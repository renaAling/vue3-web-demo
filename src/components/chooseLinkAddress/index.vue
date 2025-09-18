<template>
	<div>
		<el-dialog
			lock-scroll
			show-close
			title="选择链接"
			:close-on-click-modal="false"
			@close="closeDialog"
			width="860"
			v-model="dialogVisible"
			:append-to-body="true"
		>
			<div class="table_box">
				<div class="left_box">
					<el-tree
						ref="leftTreeRef"
						:data="categoryData"
						:props="defaultProps"
						:highlight-current="true"
						node-key="id"
						@node-click="handleNodeClick"
					/>
				</div>

				<!-- 业务场景 -->
				<div class="right_box" v-if="currentType === 'business'">
					<div>
						<div class="cont">业务场景</div>
						<div class="Box">
							<el-radio-group v-model="businessType" @change="changeBusinessType">
								<el-radio v-for="(item, index) in businessSceneOptions" :key="index" :label="item.id" class="lh-30">
									{{ item.name }}
								</el-radio>
							</el-radio-group>
						</div>
					</div>
					<div class="mt-20">
						<div class="cont">{{ [1, 2].includes(businessType) ? '选择店铺' : '选择商品' }}</div>
						<div class="Box">
							<el-select v-model="linkVal" style="width: 100%" filterable :placeholder="[1, 2].includes(businessType) ? '请选择店铺' : '请选择商品'">
								<el-option v-for="item in storeOptions" :key="item.id" :label="item.name" :value="item.id" />
							</el-select>
						</div>
					</div>
				</div>

				<!-- 微信内置页面 -->
				<div class="right_box" v-if="currentType === 'wechartInternal'">
					<div>
						<div class="cont">页面类型</div>
						<div style="margin-top: 19px">
							<div>
								<el-radio-group v-model="pageType">
									<el-radio :label="1">功能页面</el-radio>
									<el-radio :label="2">自定义链接</el-radio>
								</el-radio-group>
							</div>
							<div style="margin-top: 20px">
								<el-radio-group v-if="pageType === 1" v-model="linkVal">
									<el-radio v-for="(item, index) in pageTypeOptions" :key="index" :label="item.id" style="line-height: 30px">
										{{ item.name }}
									</el-radio>
								</el-radio-group>
								<el-input v-if="pageType === 2" v-model="linkVal" placeholder="请输入自定义链接" />
							</div>
						</div>
					</div>
				</div>

				<!-- 自定义链接 -->
				<div class="right_box" v-if="['customLink', 'wechartOther'].includes(currentType)">
					<div>
						<div class="cont">链接地址</div>
						<div class="Box">
							<el-input v-model="linkVal" placeholder="请输入自定义链接" />
						</div>
					</div>
				</div>

				<!-- 自定义页面 -->
				<div class="right_box" v-if="currentType === 'customPage'">
					<div class="cont">选择自定义页面</div>
					<div class="Box">
						<CustomListPage v-if="dialogVisible" ref="customRef" />
					</div>
				</div>
			</div>
			<template #footer>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { mallListApi } from '/@/api/culture/mall';
import { productLstApi } from '/@/api/culture/product';
import listData from './list.json';
import CustomListPage from './customListPage.vue';
import { Session } from '/@/utils/storage';

// 静态数据
const businessSceneOptions = [
	{ id: 1, name: '到店支付' },
	{ id: 2, name: '网订店取' },
	{ id: 3, name: '文创商城' },
	{ id: 4, name: '助农商城' },
	{ id: 5, name: '积分商城' },
	{ id: 6, name: '数字藏品' },
	{ id: 7, name: '自有商城' },
];

const pageTypeOptions = [
	{ id: '/pages_index/pages/index?index=5', name: '个人中心' },
	{ id: '/pages_index/pages/index?index=4', name: '商户地图' },
	{ id: '/pages_index/pages/index?index=3', name: '生活码' },
	{ id: '/pages_metro_mall/pages/address/shippingAddress', name: '地址管理' },
	{ id: '/pages_activity/seckill/index', name: '自有商城秒杀页' },
	{ id: '/pages_activity/activitySquare/index', name: '活动广场' },
	{ id: '/pages_common/pages/shoppingCart/index', name: '自有商城购物车' },
];

// 响应式状态
const dialogVisible = ref(false);
const currentType = ref<string | null>(null);
const businessType = ref<number>(1);
const pageType = ref<number>(1);
const linkVal = ref<string | null>(null);
const storeOptions = ref<{ id: string; name: string }[]>([]);
const categoryData = ref(listData.data);
const customRef = ref();
const leftTreeRef = ref();

// 配置 props & emit
const defaultProps = {
	children: 'children',
	label: 'title',
};

// 方法定义
const openDialog = (opt?: { defaultLink?: string }) => {
	dialogVisible.value = true;
	getMallLinkData();
	callbackDisplay(opt?.defaultLink);
};

const closeDialog = () => {
	dialogVisible.value = false;
};

const handleNodeClick = async (data: any) => {
	linkVal.value = null;
	currentType.value = data.type;
	leftTreeRef.value?.setCurrentKey(data.id);
};

const changeBusinessType = async () => {
	await getMallLinkData();
};

const getMallLinkData = async () => {
	const params: any = { current: 1, size: 500 };
	let requestApi: any;
	let prefixUrl: string;

	if ([1, 2].includes(businessType.value)) {
		params.isReminder = true;
		requestApi = mallListApi;
		prefixUrl = 'pages_metro_mall/pages/detail/index?id=';
	} else {
		const mapType = { 3: 3, 4: 0, 5: 5, 6: 6, 7: 4 };
		params.goodsType = mapType[businessType.value];
		params.type = 1;
		params.onlineIsReminder = true;
		requestApi = productLstApi;
		prefixUrl = '/pages_main/pages/product/detail?spuCode=';
	}

	const data = await requestApi(params);
	storeOptions.value = data.records?.map((item: any) => ({
		id: prefixUrl + item.id,
		name: item.storeName || item.name,
	}));
};

const handleSubmit = () => {
	let data = '';
	if (currentType.value === 'customPage') {
		const selId = customRef.value?.getSelectedVal();
		data = '/pages_costom_config/pages/index/index?id=' + selId;
	} else {
		data = linkVal.value || '';
	}

	$emit('linkUrl', data);

	let category1: number | null = null;
	switch (currentType.value) {
		case 'business':
			category1 = businessType.value;
			break;
		case 'wechartInternal':
			category1 = pageType.value;
			break;
		default:
			category1 = null;
	}

	insertLinkCache(data, currentType.value, category1);
	closeDialog();
};

const insertLinkCache = (link: string, nodeKey: string, category1: number | null) => {
	const cacheList = Session.get('linkCache') || [];
	const itemData = { nodeKey, link, category1 };
	if (!findLinkCache(link)) {
		cacheList.push(itemData);
		Session.set('linkCache', cacheList);
	}
};

const findLinkCache = (link: string) => {
	const cacheList = Session.get('linkCache') || [];
	return cacheList.find((v: any) => v.link === link);
};

const callbackDisplay = (linkValStr: string | null) => {
	if (!linkValStr) {
		resetToDefault();
		return;
	}

	const result = findLinkCache(linkValStr);
	if (!result) {
		resetToDefault();
		return;
	}

	const { nodeKey, category1, link } = result;
	const nodeId = ['business', 'wechartInternal', 'customLink', 'wechartOther', 'customPage'].indexOf(nodeKey) + 1;

	currentType.value = nodeKey;
	leftTreeRef.value?.setCurrentKey(nodeId);

	if (nodeKey === 'business') {
		businessType.value = category1;
		getMallLinkData();
	} else if (nodeKey === 'wechartInternal') {
		pageType.value = category1;
	}

	linkVal.value = link;

	if (nodeKey === 'customPage') {
		setTimeout(() => {
			customRef.value?.setSelectedVal(link);
		}, 0);
	}
};

const resetToDefault = () => {
	currentType.value = 'business';
	leftTreeRef.value?.setCurrentKey(1);
	businessType.value = 1;
	linkVal.value = null;
};

// 暴露方法给父组件调用
defineExpose({ openDialog });
</script>
<style scoped lang="scss">
.mt-20 {
	margin-top: 20px;
}
.lh-30 {
	line-height: 30px;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
	-webkit-box-shadow: inset 0 0 6px #ddd;
}
::-webkit-scrollbar {
	width: 4px !important; /*对垂直流动条有效*/
}
.on {
	background-color: #2d8cf0 !important;
	color: #fff !important;
}
.menu-item {
	position: relative;
	display flex justify-content space-between word-break break-all .icon-box {
		z-index: 3 position absolute right 20px top 50% transform translateY(-50%) display none;
	}
	&:hover .icon-box {
		display: block;
	}
	.right-menu {
		z-index: 10;
		position: absolute;
		right: -106px;
		top: -11px;
		width: auto;
		min-width: 121px;
	}
}

.table_box {
	margin-top: 14px;
	display: flex;
	position: relative;
	.left_box {
		width: 171px;
		height: 470px;
		border-right: 1px solid #eeeeee;
		overflow-x: hidden;
		overflow-y: auto;
		.left_cont {
			margin-bottom: 12px;
			cursor: pointer;
		}
	}
	.right_box {
		margin-left: 23px;
		font-size: 13px;
		font-family: PingFang SC;
		width: 645px;
		height: 470px;
		overflow-x: hidden;
		overflow-y: auto;
		.cont {
			font-weight: 500;
			color: #000000;
			font-weight: bold;
		}
		.Box {
			margin-top: 19px;
			display: flex;
			flex-wrap: wrap;
			.cont_box {
				font-weight: 400;
				color: rgba(0, 0, 0, 0.85);
				background: #fafafa;
				border-radius: 3px;
				text-align: center;
				padding: 7px 30px;
				margin-right: 10px;
				margin-bottom: 18px;
				cursor: pointer;
				&:hover {
					background-color: #eee;
					color: #333;
				}
			}
			.item {
				position: relative;
				.iconfont {
					display: none;
				}
				&:hover {
					.iconfont {
						display: block;
					}
				}
			}
			.iconfont {
				position: absolute;
				right: 9px;
				top: -8px;
				font-size: 18px;
				color: #333;
			}
		}
	}
	.Button {
		position: absolute;
		bottom: 15px;
		right: 15px;
		font-family: PingFangSC-Regular;
		text-align center .cancel {
			width: 70px;
			height: 32px;
			background: #ffffff;
			border: 1px solid rgba(0, 0, 0, 0.14901960784313725);
			border-radius: 2px;
			font-size: 14px;
			color: #000000;
			line-height: 32px;
			float: left;
			margin-right: 10px;
			cursor: pointer;
		}
		.ok {
			width: 70px;
			height: 32px;
			background: var(--prev-color-primary);
			border-radius: 2px;
			font-size: 14px;
			color: #ffffff;
			line-height: 32px;
			float: left;
			cursor: pointer;
		}
	}
}
::v-deep .el-tree-node:focus > .el-tree-node__content {
	color: #409eff; //节点的字体颜色
}
</style>
<!-- <template>
  <div>
    <el-dialog
      lock-scroll
      show-close
      title="选择链接"
      :close-on-click-modal="false"
      @close="closeDialog()"
      width="860"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <div class="table_box">
        <div class="left_box">
          <el-tree
            ref="leftTreeRef"
            :data="categoryData"
            :props="defaultProps"
            :highlight-current="true"
            node-key="id"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
        <div class="right_box" v-if="currenType == 'business'">
          <div>
            <div class="cont">业务场景</div>
            <div class="Box">
              <el-radio-group v-model="businessType" @change="changeBusinessType">
                <el-radio v-for="(item, index) in businessSceneOptions" class="lh-30" :key="index" :label="item.id">{{
                  item.name
                }}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="mt-20">
            <div class="cont">{{ [1, 2].includes(businessType) ? '选择店铺' : '选择商品' }}</div>
            <div class="Box">
              <el-select
                v-model="linkVal"
                style="width: 100%"
                filterable
                :placeholder="[1, 2].includes(businessType) ? '请选择店铺' : '请选择商品'"
              >
                <el-option v-for="item in storeOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="right_box" v-if="currenType == 'wechartInternal'">
          <div>
            <div class="cont">页面类型</div>
            <div style="margin-top: 19px">
              <div>
                <el-radio-group v-model="pageType">
                  <el-radio :label="1">功能页面</el-radio>
                  <el-radio :label="2">自定义链接</el-radio>
                </el-radio-group>
              </div>
              <div style="margin-top: 20px">
                <el-radio-group v-if="pageType == 1" v-model="linkVal">
                  <el-radio
                    v-for="(item, index) in pageTypeOptions"
                    :key="index"
                    :label="item.id"
                    style="line-height: 30px"
                    >{{ item.name }}</el-radio
                  >
                </el-radio-group>
                <el-input v-if="pageType == 2" v-model="linkVal" placeholder="请输入自定义链接" />
              </div>
            </div>
          </div>
        </div>

        <div class="right_box" v-if="['customLink', 'wechartOther'].includes(currenType)">
          <div>
            <div class="cont">链接地址</div>
            <div class="Box">
              <el-input v-model="linkVal" placeholder="请输入自定义链接" />
            </div>
          </div>
        </div>

        <div class="right_box" v-if="currenType == 'customPage'">
          <div class="cont">选择自定义页面</div>
          <div class="Box">
            <CustomListPage v-if="dialogVisible" ref="customRef" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mallListApi } from '@/api/mall';
import { productLstApi } from '@/api/product';
import listData from './list.json';
import CustomListPage from './customListPage.vue';
import { Session } from '@/utils/storage';
const staticBusinessSceneOptions = [
  {
    id: 1,
    name: '到店支付',
  },
  {
    id: 2,
    name: '网订店取',
  },
  {
    id: 3,
    name: '文创商城',
  },
  {
    id: 4,
    name: '助农商城',
  },
  {
    id: 5,
    name: '积分商城',
  },
  {
    id: 6,
    name: '数字藏品',
  },
  {
    id: 7,
    name: '自有商城',
  },
];

const staticPageTypeOptions = [
  { id: '/pages_index/pages/index?index=5', name: '个人中心' },
  { id: '/pages_index/pages/index?index=4', name: '商户地图' },
  { id: '/pages_index/pages/index?index=3', name: '生活码' },
  // { id: '/pages/index/index?index=3', name: '乘车码' },
  { id: '/pages_metro_mall/pages/address/shippingAddress', name: '地址管理' },
  // { id: '/pages/mine/index?index=5', name: '客服' },
  { id: '/pages_activity/seckill/index', name: '自有商城秒杀页' },
  { id: '/pages_activity/activitySquare/index', name: '活动广场' },
  { id: '/pages_common/pages/shoppingCart/index', name: '自有商城购物车' },
];

export default {
  name: 'linkaddress',
  components: { CustomListPage },
  data() {
    return {
      constants: this.$constants,
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      categoryData: listData.data,
      currenType: null,
      businessType: 1,
      businessSceneOptions: staticBusinessSceneOptions,
      storeOptions: [],
      pageTypeOptions: staticPageTypeOptions,
      pageType: 1,
      linkVal: null,
    };
  },
  methods: {
    // 打开弹框
    openDialog(opt) {
      this.dialogVisible = true;
      // this.linkVal = null; // 统一放到回显中设置
      // this.currenType = 'business';  // 统一放到回显中设置
      this.getMallLinkData();
      // 回显函数
      this.callbackDisplay(opt?.defaultLink);
    },
    //关闭弹窗
    closeDialog() {
      this.dialogVisible = false;
    },
    handleNodeClick(data) {
      this.linkVal = null;
      this.$set(this, 'currenType', data.type);
      this.$refs.leftTreeRef.setCurrentKey(data.id);
    },
    // 业务页面类型单选框事件
    changeBusinessType(e) {
      // console.log('业务类型单选框事件', e);
      this.$nextTick(() => {
        this.getMallLinkData();
      });
    },
    // 获取店铺链接数据
    async getMallLinkData() {
      let params = {
        current: 1,
        size: 500,
      };
      this.storeOptions = [];
      let requestApi = null;
      let prefixUrl = null;
      if ([1, 2].includes(this.businessType)) {
        params.isReminder = true;
        requestApi = mallListApi;
        prefixUrl = 'pages_metro_mall/pages/detail/index?id=';  // 店铺详情
      } else {
        // 3 文创 4 助农 5 积分 6 数字藏品 7 自有商城
        const mapType = { 3: 3, 4: 0, 5: 5, 6: 6, 7: 4 };
        params.goodsType = mapType[this.businessType]; // 商城类型：
        params.type = 1; // 类型：1 出售中(已上架)
        params.onlineIsReminder = true;
        requestApi = productLstApi;
        prefixUrl = '/pages_main/pages/product/detail?spuCode=';  // 商品详情
      }
      let data = await requestApi(params);
      this.storeOptions = data.records?.map((item) => {
        return {
          id: prefixUrl + item.id,
          name: item.storeName || item.name,
        };
      });
    },
    handleSubmit() {
      let data = '';
      if (this.currenType == 'customPage') {
        const selId = this.$refs.customRef.getSelectedVal();
        data = '/pages_costom_config/pages/index/index?id=' + selId;
      } else {
        data = this.linkVal;
      }

      this.$emit('linkUrl', data);

      // 缓存链接数据，用于回显
      let category1 = null;
      switch (this.currenType) {
        case 'business': {
          category1 = this.businessType;
          break;
        }
        case 'wechartInternal': {
          category1 = this.pageType;
          break;
        }
        default: {
          category1 = null;
        }
      }
      // 记录当前选中并插入到缓存。若不需要则删除此行代码即可，其他不需要变动
      this.insertLinkCache(data, this.currenType, category1);

      this.closeDialog();
    },
    insertLinkCache(link, nodeKey, ...args) {
      const cacheList = Session.get('linkCache') || [];
      // base data
      let itemData = {
        nodeKey: nodeKey,
        link: link,
        category1: args[0],
      };
      if (!this.findLinkCache(link)) {
        cacheList.push(itemData);
        Session.set('linkCache', cacheList);
      }
    },
    findLinkCache(link) {
      const cacheList = Session.get('linkCache') || [];
      const result = cacheList.find((v) => v.link === link);
      return result;
    },
    callbackDisplay(linkVal) {
      const result = this.findLinkCache(linkVal);
      if (!result) {
        // 未命中缓存，重置到第一个
        this.$nextTick(() => {
          this.currenType = 'business';
          this.$refs.leftTreeRef.setCurrentKey(1);
          this.businessType = 1;
          this.linkVal = null;
        });
        return;
      }
      const { nodeKey, category1, link } = result;
      const nodeId = ['business', 'wechartInternal', 'customLink', 'wechartOther', 'customPage'].indexOf(nodeKey) + 1;
      console.log('当前链接回显值', nodeId, category1, link);
      this.$nextTick(() => {
        this.currenType = nodeKey;
        this.$refs.leftTreeRef.setCurrentKey(nodeId);
        if (nodeKey === 'business') {
          this.businessType = category1;
          this.getMallLinkData();
        } else if (nodeKey === 'wechartInternal') {
          this.pageType = category1;
        }
        this.linkVal = link;
        if(nodeKey === 'customPage') {
          this.$nextTick(() => {
            this.$refs.customRef.setSelectedVal(link);
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.mt-20 {
  margin-top: 20px;
}
.lh-30 {
  line-height: 30px;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #ddd;
}
::-webkit-scrollbar {
  width: 4px !important; /*对垂直流动条有效*/
}
.on {
  background-color: #2d8cf0 !important;
  color: #fff !important;
}
.menu-item {
  position: relative;
  display flex justify-content space-between word-break break-all .icon-box {
    z-index: 3 position absolute right 20px top 50% transform translateY(-50%) display none;
  }
  &:hover .icon-box {
    display: block;
  }
  .right-menu {
    z-index: 10;
    position: absolute;
    right: -106px;
    top: -11px;
    width: auto;
    min-width: 121px;
  }
}

.table_box {
  margin-top: 14px;
  display: flex;
  position: relative;
  .left_box {
    width: 171px;
    height: 470px;
    border-right: 1px solid #eeeeee;
    overflow-x: hidden;
    overflow-y: auto;
    .left_cont {
      margin-bottom: 12px;
      cursor: pointer;
    }
  }
  .right_box {
    margin-left: 23px;
    font-size: 13px;
    font-family: PingFang SC;
    width: 645px;
    height: 470px;
    overflow-x: hidden;
    overflow-y: auto;
    .cont {
      font-weight: 500;
      color: #000000;
      font-weight: bold;
    }
    .Box {
      margin-top: 19px;
      display: flex;
      flex-wrap: wrap;
      .cont_box {
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        background: #fafafa;
        border-radius: 3px;
        text-align: center;
        padding: 7px 30px;
        margin-right: 10px;
        margin-bottom: 18px;
        cursor: pointer;
        &:hover {
          background-color: #eee;
          color: #333;
        }
      }
      .item {
        position: relative;
        .iconfont {
          display: none;
        }
        &:hover {
          .iconfont {
            display: block;
          }
        }
      }
      .iconfont {
        position: absolute;
        right: 9px;
        top: -8px;
        font-size: 18px;
        color: #333;
      }
    }
  }
  .Button {
    position: absolute;
    bottom: 15px;
    right: 15px;
    font-family: PingFangSC-Regular;
    text-align center .cancel {
      width: 70px;
      height: 32px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.14901960784313725);
      border-radius: 2px;
      font-size: 14px;
      color: #000000;
      line-height: 32px;
      float: left;
      margin-right: 10px;
      cursor: pointer;
    }
    .ok {
      width: 70px;
      height: 32px;
      background: var(--prev-color-primary);
      border-radius: 2px;
      font-size: 14px;
      color: #ffffff;
      line-height: 32px;
      float: left;
      cursor: pointer;
    }
  }
}
::v-deep .el-tree-node:focus > .el-tree-node__content {
  color: #409eff; //节点的字体颜色
}
</style> -->
