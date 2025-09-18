<template>
	<div>
		<el-dialog
			lock-scroll
			show-close
			title="选择链接"
			:close-on-click-modal="false"
			:data="categoryData"
			@close="onClose"
			width="860"
			:v-model="dialogVisible"
			:append-to-body="true"
		>
			<div class="table_box">
				<div class="left_box">
					<el-tree
						:data="categoryData"
						:props="defaultProps"
						:default-expanded-keys="[1, 2, 3, 4]"
						:current-node-key="5"
						:highlight-current="true"
						node-key="id"
						@node-click="handleNodeClick"
					/>
				</div>

				<!-- 基础链接 -->
				<div v-if="currenType === 'link'" class="right_box">
					<div v-if="basicsList.length">
						<div class="cont">基础链接</div>
						<div class="Box">
							<div
								v-for="(item, index) in basicsList"
								:key="index"
								:class="['cont_box', { on: currenId === item.id && currenUrl === item.url }]"
								@click="getUrl(item)"
							>
								{{ item.name }}
							</div>
						</div>
					</div>
					<div v-if="userList.length">
						<div class="cont">个人中心</div>
						<div class="Box">
							<div v-for="(item, index) in userList" :key="index" :class="['cont_box', { on: currenId === item.id }]" @click="getUrl(item)">
								{{ item.name }}
							</div>
						</div>
					</div>
					<div v-if="distributionList.length">
						<div class="cont">分销</div>
						<div class="Box">
							<div v-for="(item, index) in distributionList" :key="index" :class="['cont_box', { on: currenId === item.id }]" @click="getUrl(item)">
								{{ item.name }}
							</div>
						</div>
					</div>
				</div>

				<!-- 营销链接 -->
				<div v-if="currenType === 'marketing_link'" class="right_box">
					<div v-if="coupon.length">
						<div class="cont">优惠券</div>
						<div class="Box">
							<div v-for="(item, index) in coupon" :key="index" :class="['cont_box', { on: currenId === item.id }]" @click="getUrl(item)">
								{{ item.name }}
							</div>
						</div>
					</div>
					<div v-if="integral.length">
						<div class="cont">积分</div>
						<div class="Box">
							<div v-for="(item, index) in integral" :key="index" :class="['cont_box', { on: currenId === item.id }]" @click="getUrl(item)">
								{{ item.name }}
							</div>
						</div>
					</div>
					<div v-if="luckDraw.length">
						<div class="cont">抽奖</div>
						<div class="Box">
							<div v-for="(item, index) in luckDraw" :key="index" :class="['cont_box', { on: currenId === item.id }]" @click="getUrl(item)">
								{{ item.name }}
							</div>
						</div>
					</div>
				</div>

				<!-- 动态表格内容 -->
				<div
					v-if="['special', 'product_category', 'product', 'seckill', 'bargain', 'combination', 'news', 'micro', 'integral'].includes(currenType)"
					class="right_box"
				>
					<el-form v-if="currenType === 'product'" ref="formValidate" :model="formValidate" class="tabform">
						<el-row>
							<el-col :span="24">
								<el-form-item>
									<el-input placeholder="请输入商品名称,关键字" v-model.trim="formValidate.keywords" style="width: 260px; margin-right: 20px" />
									<el-button type="primary" @click="handleSearch">搜索</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>

					<el-table
						row-key="id" border
						ref="table"
						size="small"
						v-loading="lodingList"
						:data="tableList.records"
						@row-click="singleElection"
						:tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
						:max-height="
							currenType === 'product_category'
								? '410'
								: ['product', 'seckill', 'bargain', 'combination', 'news', 'micro', 'integral'].includes(currenType)
								? '400'
								: ''
						"
					>
						<el-table-column label="" width="80">
							<template #default="scope">
								<el-radio v-model="radioData" :label="scope.$index">&nbsp;</el-radio>
							</template>
						</el-table-column>
						<el-table-column prop="id" label="ID" width="80"></el-table-column>
						<el-table-column v-if="currenType !== 'micro'" label="图片" width="80">
							<template #default="scope">
								<el-image v-if="currenType === 'news'" style="width: 50px; height: 50px" lazy :src="scope.row.imageInput" fit="fill" />
								<el-image v-else-if="currenType === 'product_category'" style="width: 50px; height: 50px" lazy :src="scope.row.extra" fit="fill" />
								<el-image v-else style="width: 50px; height: 50px" lazy :src="scope.row.image" fit="fill" />
							</template>
						</el-table-column>
						<el-table-column
							prop="name"
							:label="currenType === 'product' ? '商品名称' : '标题名称'"
							:show-overflow-tooltip="true"
							max-width="250"
							v-if="currenType === 'product' || currenType === 'micro'"
						></el-table-column>
						<el-table-column
							prop="name"
							label="分类名称"
							:show-overflow-tooltip="true"
							max-width="250"
							v-else-if="currenType === 'product_category'"
						></el-table-column>
						<el-table-column
							prop="title"
							:label="currenType === 'news' ? '文章名称' : '商品名称'"
							:show-overflow-tooltip="true"
							max-width="250"
							v-else
						></el-table-column>
					</el-table>

					<el-pagination
						v-if="currenType !== 'product_category'"
						class="mt20"
						:current-page="params.page"
						:page-sizes="[10, 20, 30, 40]"
						layout="prev, pager, next"
						:total="tableList.total"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
					/>
				</div>

				<!-- 自定义链接 -->
				<div v-if="currenType === 'custom'" class="right_box">
					<div style="width: 440px; margin: 50px 0 0 0">
						<el-form ref="customDate" :model="customDate" label-width="100px">
							<el-form-item label="跳转路径：" prop="url">
								<el-input v-model.trim="customDate.url" placeholder="请输入跳转路径" />
							</el-form-item>
						</el-form>
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
// import draggable from 'vuedraggable';
// import linkaddress from '/@/components/linkaddress.vue';
import { productLstApi, productCategoryListApi } from '/@/api/culture/product';
// import { seckillStoreListApi, combinationListApi, bargainListApi } from '/@/api/culture/marketing';
import { ListArticle } from '/@/api/article';
import { pagediyListApi } from '/@/api/culture/devise';
import listData from './list.json';
import linkData from './linkData.json';
import marketing from './marketing.json';

// ================ Props & Emits ================
const props = defineProps<{
	fromType?: string;
}>();

const emit = defineEmits<{
	(e: 'linkUrl', url: string): void;
}>();

// ================ State ================
const dialogVisible = ref(false);
const defaultProps = {
	children: 'children',
	label: 'title',
};

const basicsList = ref<any[]>([]);
const userList = ref<any[]>([]);
const distributionList = ref<any[]>([]);
const coupon = ref<any[]>([]);
const luckDraw = ref<any[]>([]);
const integral = ref<any[]>([]);

const lodingList = ref(false);
const currenType = ref('link');
const currenId = ref('');
const currenUrl = ref('');

const formValidate = reactive({
	page: 1,
	limit: 10,
	keywords: '',
	type: 1,
});

const customDate = reactive({
	url: '',
});

const radioData = ref<any>('');
const linkId = ref<any>(0);
const tableList = ref<any>({});
const params = reactive({
	page: 1,
	limit: 10,
	keywords: '',
	type: 1,
	name: '',
});

// ================ Computed ================
const categoryData = computed(() => {
	const data = [...listData.data];
	if (props.fromType === 'linkGenerator') {
		data.splice(3, 1);
	}
	return data;
});

// ================ Lifecycle ================
onMounted(() => {
	mockData('link');
});

// ================ Methods ================
function onClose() {
	currenId.value = '';
	currenType.value = 'link';
}

function handleSearch() {
	Object.assign(params, { ...formValidate });
	mockData('product');
}

function handleNodeClick(data: any) {
	params.page = 1;
	tableList.value.records = [];
	linkId.value = null as any;
	radioData.value = null;
	currenType.value = data.type;
	mockData(data.type);
}

function mockData(type: string) {
	// let apiPromise: Promise<any> | undefined;
	switch (type) {
		case 'marketing_link':
			setTimeout(() => {
				const data = marketing.data.list;
				processLinkData(data);
			}, 0);
			break;
		case 'link':
			setTimeout(() => {
				const data = linkData.data.list;
				processLinkData(data);
			}, 0);
			break;
		case 'product_category':
			lodingList.value = true;
			productCategoryListApi({ type: 1, status: -1 }).then((res) => {
				tableList.value.records = res;
				lodingList.value = false;
			});
			break;
		case 'product':
			lodingList.value = true;
			productLstApi(params).then((res: any) => {
				tableList.value = res;
				lodingList.value = false;
			});
			break;
		case 'seckill':
			lodingList.value = true;
			// seckillStoreListApi(params).then((res:any) => {
			// 	tableList.value = res;
			// 	lodingList.value = false;
			// });
			break;
		case 'bargain':
			lodingList.value = true;
			// bargainListApi(params).then((res:any) => {
			// 	tableList.value = res;
			// 	lodingList.value = false;
			// });
			break;
		case 'combination':
			lodingList.value = true;
			// combinationListApi(params).then((res:any) => {
			// 	tableList.value = res;
			// 	lodingList.value = false;
			// });
			break;
		case 'news':
			lodingList.value = true;
			ListArticle(params).then((res: any) => {
				tableList.value = res;
				lodingList.value = false;
			});
			break;
		case 'micro':
			lodingList.value = true;
			pagediyListApi(params).then((res: any) => {
				tableList.value = res;
				lodingList.value = false;
			});
			break;
		default:
			break;
	}
}

function processLinkData(data: any[]) {
	basicsList.value = data.filter((e) => e.type === 1);
	distributionList.value = data.filter((e) => e.type === 2);
	userList.value = data.filter((e) => e.type === 3);
	integral.value = data.filter((e) => e.type === 4);
	luckDraw.value = data.filter((e) => e.type === 5);
	coupon.value = data.filter((e) => ![1, 2, 3, 4, 5].includes(e.type));
}

function getUrl(item: any) {
	currenId.value = item.id;
	currenUrl.value = item.url;
}

function singleElection(row: any) {
	linkId.value = row.id;
}

function handleSubmit() {
	let url = '';
	switch (currenType.value) {
		case 'product':
			url = `/pages/goods/goods_details/index?id=${linkId.value}`;
			break;
		case 'seckill':
			url = `/pages/activity/goods_seckill_details/index?id=${linkId.value}`;
			break;
		case 'bargain':
			url = `/pages/activity/goods_bargain_details/index?id=${linkId.value}`;
			break;
		case 'combination':
			url = `/pages/activity/goods_combination_details/index?id=${linkId.value}`;
			break;
		case 'news':
			url = `/pages/goods/news_details/index?id=${linkId.value}`;
			break;
		case 'product_category':
			url = '/pages/goods/goods_cate/index';
			break;
		case 'custom':
			url = customDate.url;
			break;
		case 'micro':
			url = `/pages/activity/small_page/index?id=${linkId.value}`;
			break;
		default:
			url = currenUrl.value;
			break;
	}

	emit('linkUrl', url);
	dialogVisible.value = false;
	currenId.value = '';
	currenType.value = 'link';
}

function handleSizeChange(val: number) {
	params.limit = val;
	radioData.value = null;
	mockData(currenType.value);
}

function handleCurrentChange(val: number) {
	params.page = val;
	radioData.value = null;
	mockData(currenType.value);
}

// ================ Expose ================
defineExpose({
	dialogVisible,
	getLink: () => handleNodeClick,
});
</script>

<style scoped lang="scss">
@import '@/assets/css/scss/mixins.scss';

.tabBox_img {
	width: 36px;
	height: 36px;
	border-radius: 4px;
	cursor: pointer;

	img {
		width: 100%;
		height: 100%;
	}
}

::-webkit-scrollbar-thumb {
	-webkit-box-shadow: inset 0 0 6px #ddd;
}
::-webkit-scrollbar {
	width: 4px !important;
}
.on {
	background-color: #2d8cf0 !important;
	color: #fff !important;
}

.menu-item {
	position: relative;
	display: flex;
	justify-content: space-between;
	word-break: break-all;

	.icon-box {
		z-index: 3;
		position: absolute;
		right: 20px;
		top: 50%;
		transform: translateY(-50%);
		display: none;
	}

	&:hover .icon-box {
		display: block;
	}

	.right-menu {
		z-index: 10;
		position: absolute;
		right: -106px;
		top: -11px;
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
			font-weight: bold;
			color: #000000;
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

				&:hover .iconfont {
					display: block;
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
		text-align: center;

		.cancel {
			width: 70px;
			height: 32px;
			background: #ffffff;
			border: 1px solid rgba(0, 0, 0, 0.149);
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
	color: #409eff;
}
</style>
<!-- <template>
  <div>
    <el-dialog
      lock-scroll
      show-close
      title="选择链接"
      :close-on-click-modal="false"
      :data="categoryData"
      @close="onClose()"
      width="860"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <div class="table_box">
        <div class="left_box">
          <el-tree
            :data="categoryData"
            :props="defaultProps"
            :default-expanded-keys="[1, 2, 3, 4]"
            :current-node-key="5"
            :highlight-current="true"
            node-key="id"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
        <div class="right_box" v-if="currenType == 'link'">
          <div v-if="basicsList.length">
            <div class="cont">基础链接</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id && currenUrl == item.url ? 'on' : ''"
                v-for="(item, index) in basicsList"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div v-if="userList.length">
            <div class="cont">个人中心</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in userList"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div v-if="distributionList.length">
            <div class="cont">分销</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in distributionList"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="right_box" v-if="currenType == 'marketing_link'">
          <div v-if="coupon.length">
            <div class="cont">优惠券</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in coupon"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div v-if="integral.length">
            <div class="cont">积分</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in integral"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div v-if="luckDraw.length">
            <div class="cont">抽奖</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in luckDraw"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="right_box"
          v-if="
            currenType === 'special' ||
            currenType === 'product_category' ||
            currenType === 'product' ||
            currenType === 'seckill' ||
            currenType === 'bargain' ||
            currenType === 'combination' ||
            currenType === 'news' ||
            currenType === 'micro' ||
            currenType === 'integral'
          "
        >
          <el-form ref="formValidate" :model="formValidate" class="tabform" v-if="currenType == 'product'">
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <el-input
                    placeholder="请输入商品名称,关键字"
                    v-model.trim="formValidate.keywords"
                    style="width: 260px; margin-right: 20px"
                  />
                  <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            row-key="id" border
            ref="table"
            size="small"
            v-loading="lodingList"
            :data="tableList.records"
            @row-click="singleElection"
            :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
            :max-height="
              currenType == 'product_category'
                ? '410'
                : currenType === 'product' ||
                  currenType === 'seckill' ||
                  currenType === 'bargain' ||
                  currenType === 'combination' ||
                  currenType === 'news' ||
                  currenType === 'micro' ||
                  currenType === 'integral'
                ? '400'
                : ''
            "
          >
            <el-table-column label="" width="80">
              <template slot-scope="scope">
                <el-radio class="radio" v-model="radioData" :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column v-if="currenType !== 'micro'" label="图片" width="80">
              <template slot-scope="scope">
                <el-image
                  style="width: 50px; height: 50px"
                  lazy
                  :src="scope.row.imageInput"
                  fit="fill"
                  v-if="currenType == 'news'"
                ></el-image>
                <el-image
                  style="width: 50px; height: 50px"
                  lazy
                  :src="scope.row.extra"
                  fit="fill"
                  v-else-if="currenType == 'product_category'"
                ></el-image>
                <el-image style="width: 50px; height: 50px" lazy :src="scope.row.image" fit="fill" v-else></el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              :label="currenType === 'product' ? '商品名称' : '标题名称'"
              :show-overflow-tooltip="true"
              max-width="250"
              v-if="currenType === 'product' || currenType === 'micro'"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="分类名称"
              :show-overflow-tooltip="true"
              max-width="250"
              v-else-if="currenType == 'product_category'"
            ></el-table-column>
            <el-table-column
              prop="title"
              :label="currenType == 'news' ? '文章名称' : '商品名称'"
              :show-overflow-tooltip="true"
              max-width="250"
              v-else
            ></el-table-column>
          </el-table>
          <el-pagination
            class="mt20"
            :current-page="params.page"
            :page-sizes="[10, 20, 30, 40]"
            :layout="constants.page.layout"
            :total="tableList.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-if="currenType !== 'product_category'"
          />
        </div>
        <div class="right_box" v-if="currenType == 'custom'">
          <div style="width: 440px; margin: 50px 0 0 0">
            <el-form ref="customDate" :model="customDate" label-width="100px">
              <el-form-item label="跳转路径：" prop="url">
                <el-input v-model.trim="customDate.url" placeholder="请输入跳转路径" />
              </el-form-item>
            </el-form>
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

import { productLstApi, productCategoryListApi } from '@/api/product';
import { seckillStoreListApi, combinationListApi, bargainListApi } from '@/api/marketing';
import { ListArticle } from '@/api/article';
import { pagediyListApi } from '@/api/devise';
import listData from './list.json';
import linkData from './linkData.json';
import marketing from './marketing.json';

export default {
  name: 'linkaddress',
  data() {
    return {
      constants: this.$constants,
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      basicsList: [],
      userList: [],
      distributionList: [],
      coupon: [],
      luckDraw: [],
      integral: [],
      lodingList: false,
      currenType: 'link',
      currenId: '',
      currenUrl: '',
      formValidate: {
        page: 1,
        limit: 10,
        keywords: '',
        type: 1,
      },
      customDate: {
        url: '',
      },
      radioData: '',
      linkId: 0,
      tableList: {},
      params: {
        page: 1,
        limit: 10,
        keywords: '',
        type: 1,
        name: '',
      },
      columns: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '页面名称', key: 'name', width: 150 },
        { title: '页面链接', key: 'url' },
      ],
      columns7: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '分类名称', key: 'cate_name', tree: true },
        { title: '分类图标', slot: 'pic' },
      ],
      columns8: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '商品图片', slot: 'image', width: 90 },
        { title: '商品名称', key: 'store_name' },
      ],
      bargain: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '商品图片', slot: 'image', width: 90 },
        { title: '商品名称', key: 'title' },
      ],
      news: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '文章图片', slot: 'image_input', width: 90 },
        { title: '文章名称', key: 'title' },
      ],
    };
  },
  props: {
    //使用组件的页面
    fromType: {
      type: String,
      default: '',
    },
  },
  computed: {
    categoryData() {
      const obj = [...listData.data];
      if (this.fromType === 'linkGenerator') {
        obj.splice(3, 1);
        return obj;
      } else {
        return [...listData.data];
      }
    },
  },
  mounted() {
    this.currenId = '';
    this.mockData('link');
  },
  methods: {
    //关闭弹窗
    onClose() {
      this.currenId = '';
      this.currenType = 'link';
    },
    handleSearch() {
      this.params = this.formValidate;
      this.mockData('product');
    },
    handleNodeClick(data) {
      this.params.page = 1;
      this.tableList.records = [];
      this.linkId = null;
      this.radioData = null;
      this.$set(this, 'currenType', data.type);
      this.mockData(data.type);
    },
    mockData(type) {
      let data = [];
      if (type == 'marketing_link') {
        data = marketing.data.list;
      } else if (type == 'link') {
        data = linkData.data.list;
      } else if (type == 'product_category') {
        this.lodingList = true;
        productCategoryListApi({ type: 1, status: -1 }).then((res) => {
          this.tableList.records = res;
          this.lodingList = false;
        });
      } else if (type == 'product') {
        this.lodingList = true;
        productLstApi(this.params).then((res) => {
          this.tableList = res;
          this.lodingList = false;
        });
      } else if (type == 'seckill') {
        this.lodingList = true;
        seckillStoreListApi(this.params).then((res) => {
          this.tableList = res;
          this.lodingList = false;
        });
      } else if (type == 'bargain') {
        this.lodingList = true;
        bargainListApi(this.params).then((res) => {
          this.tableList = res;
          this.lodingList = false;
        });
      } else if (type == 'combination') {
        this.lodingList = true;
        combinationListApi(this.params).then((res) => {
          this.tableList = res;
          this.lodingList = false;
        });
      } else if (type == 'news') {
        this.lodingList = true;
        ListArticle(this.params).then((res) => {
          this.tableList = res;
          this.lodingList = false;
        });
      } else if (type == 'micro') {
        this.lodingList = true;
        pagediyListApi(this.params).then((res) => {
          this.tableList = res;
          this.lodingList = false;
        });
      }
      let basicsList = [];
      let distributionList = [];
      let userList = [];
      let integral = [];
      let luckDraw = [];
      let coupon = [];
      data.forEach((e) => {
        if (e.type == 1) {
          basicsList.push(e);
        } else if (e.type == 2) {
          distributionList.push(e);
        } else if (e.type == 3) {
          userList.push(e);
        } else if (e.type == 4) {
          integral.push(e);
        } else if (e.type == 5) {
          luckDraw.push(e);
        } else {
          coupon.push(e);
        }
      });
      this.basicsList = basicsList;
      this.distributionList = distributionList;
      this.userList = userList;
      this.coupon = coupon;
      this.luckDraw = luckDraw;
      this.integral = integral;
    },
    getUrl(item) {
      this.currenId = item.id;
      this.currenUrl = item.url;
    },
    singleElection(row) {
      this.linkId = row.id;
    },
    handleSubmit(name) {
      switch (this.currenType) {
        case 'product':
          this.$emit('linkUrl', '/pages/goods/goods_details/index?id=' + this.linkId);
          break;
        case 'seckill':
          this.$emit('linkUrl', '/pages/activity/goods_seckill_details/index?id=' + this.linkId);
          break;
        case 'bargain':
          this.$emit('linkUrl', '/pages/activity/goods_bargain_details/index?id=' + this.linkId);
          break;
        case 'combination':
          this.$emit('linkUrl', '/pages/activity/goods_combination_details/index?id=' + this.linkId);
          break;
        case 'news':
          this.$emit('linkUrl', '/pages/goods/news_details/index?id=' + this.linkId);
          break;
        case 'product_category':
          this.$emit('linkUrl', '/pages/goods/goods_cate/index');
          break;
        case 'custom':
          this.$emit('linkUrl', this.customDate.url);
          break;
        case 'micro':
          this.$emit('linkUrl', `/pages/activity/small_page/index?id=${this.linkId}`);
          break;
        default:
          this.$emit('linkUrl', this.currenUrl);
          break;
      }
      this.dialogVisible = false;
      this.currenId = '';
      this.currenType = 'link';
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.radioData = null;
      this.mockData(this.currenType);
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.radioData = null;
      this.mockData(this.currenType);
    },
  },
};
</script>

<style scoped lang="scss">
.tabBox_img {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
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
