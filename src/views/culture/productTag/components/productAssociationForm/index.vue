<template>
	<div>
		<el-form-item v-if="productAssociationType === 'product'">
			<el-button size="small" type="primary" @click="handleAddGoods">添加商品</el-button>
			<el-button v-if="isBatchDelete" size="small" @click="handleBatchDel" :disabled="!multipleSelection.length"> 批量删除 </el-button>
		</el-form-item>
		<el-form-item v-if="productAssociationType === 'product'">
			<el-table
				border
				ref="tableList"
				v-loading="listLoading"
				:data="tableData.data"
				style="width: 100%; margin-top: 5px"
				size="small"
				@selection-change="handleSelectionChange"
				@select-all="selectAll"
				@select="selectOne"
			>
				<el-table-column v-if="isBatchDelete" type="selection" width="55"></el-table-column>
				<el-table-column prop="id" label="ID" width="55"></el-table-column>
				<el-table-column label="商品图" min-width="80">
					<template #default="{ row }">
						<div class="demo-image__preview line-heightOne">
							<el-image :src="row.image" :preview-src-list="[row.image]" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="price" label="售价" min-width="90"></el-table-column>
				<el-table-column prop="stock" label="库存" min-width="70"></el-table-column>
				<el-table-column label="操作" width="60" fixed="right" align="center">
					<template #default="{ row, index }">
						<el-button type="text" size="small" @click="handleDelete(index, row)"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-form-item>
		<el-form-item label-width="73px" v-if="productAssociationType === 'brand'" label="选择品牌：" :span="24" prop="proBrandList">
			<el-select
				class="selWidth"
				clearable
				filterable
				v-model="formValidate.proBrandList"
				:multiple="multipleBrand"
				placeholder="请选择品牌"
				@change="handleBrandSelected"
			>
				<el-option v-for="(v, i) in adminProductBrand" :key="i" :label="v.name" :value="v.id" :disabled="!v.isShow"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label-width="73px" v-if="productAssociationType === 'category'" label="选择分类：" :span="24" prop="proCategorylist">
			<el-cascader
				v-model="formValidate.proCategorylist"
				class="selWidth"
				:props="propsCategory"
				:options="adminProductClassify"
				filterable
				placeholder=""
				:show-all-levels="false"
				clearable
				@change="handleCateSelected"
			/>
		</el-form-item>
		<el-form-item
			label-width="73px"
			label="选择商户："
			v-hasPermi="['platform:merchant:page:list']"
			v-if="productAssociationType === 'merchant'"
			:span="24"
			prop="merIds"
		>
			<merchant-name @getMerId="getMerId" :multiple="multipleMer" :mer-id-checked="formValidate.merIds"></merchant-name>
		</el-form-item>
		<el-dialog v-model="dialogVisible" title="商品列表" width="65%" :before-close="close">
			<el-form :inline="true" :model="tableFrom" @keyup.enter="getDataList" ref="queryRef" label-width="85px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="商品搜索：">
							<el-input v-model="name" placeholder="请输入商品名称" class="selWidth">
								<template #append>
									<el-button icon="el-icon-search" @click="getDataList(1)" />
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="商品分类：">
							<el-cascader
								v-model="tableFrom.categoryId"
								class="selWidth"
								:options="adminProductClassify"
								:props="propsProductClassify"
								filterable
								clearable
								@change="getDataList(1)"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="供应商选择：">
							<merchant-name @getMerId="getMerId" :merIdChecked="merIds"></merchant-name>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="商品状态：">
							<el-select clearable v-model="tableFrom.isShow" placeholder="请选择商品状态" class="selWidth" @change="getDataList(1)">
								<el-option label="上架" value="1" />
								<el-option label="下架" value="0" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<el-table
				border
				v-loading="listLoading"
				:data="dialogData.data"
				style="width: 100%"
				size="mini"
				ref="multipleTable"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="id" label="ID" min-width="50" />
				<el-table-column label="商品图" width="80">
					<template #default="scope">
						<div class="demo-image__preview line-heightOne">
							<el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="商品名称" min-width="180" />
				<el-table-column prop="categoryName" label="商品分类" min-width="100" />
				<el-table-column label="商品状态" width="100">
					<template #default="scope">
						<span>{{ scope.row.isShow ? '上架' : '下架' }}</span>
					</template>
				</el-table-column>
			</el-table>
			<div class="block mb20">
				<el-pagination
					:page-sizes="[10, 20, 30, 40]"
					:page-size="tableFrom.limit"
					:current-page="tableFrom.page"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData.total"
					@size-change="handleSizeChange"
					@current-change="pageChange"
				/>
			</div>

			<template #footer>
				<div class="dialog-footer">
					<el-button size="mini" @click="close">取消</el-button>
					<el-button size="mini" type="primary" @click="handleSubmit">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
// import merchantName from '@/components/merUseCategory/index.vue';
import { productListbyidsApi } from '/@/api/culture/product';
import { productCategoryApi, brandListAllApi } from '/@/api/culture/commodity/commodityList';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { productActivityListApi } from '/@/api/culture/product';
import { useStore } from 'vuex';
const merchantName = defineAsyncComponent(() => import('../merchantName/index.vue'));
const store = useStore();
// ====== Props 定义 ======
const props = defineProps({
	formValidate: {
		type: Object as () => Record<string, any>,
		required: true,
	},
	productAssociationType: {
		type: String as () => 'product' | 'brand' | 'category' | 'merchant',
		default: '',
	},
	multipleBrand: {
		type: Boolean,
		default: false,
	},
	multipleCategory: {
		type: Boolean,
		default: false,
	},
	isBatchDelete: {
		type: Boolean,
		default: false,
	},
});
const merProps = { multiple: true };
const name = ref('');
const merIds = ref<any>();
// ====== 数据定义 ======
const tableData = ref<{ data: any; total: number }>({ data: [], total: 0 });
const multipleSelection = ref<any[]>([]);
const listLoading = ref<boolean>(false);
const productIds = ref<number[]>([]);
const multipleMer = ref<boolean>(true);
const dialogVisible = ref<boolean>(false);

// ====== 计算属性（替代 mapGetters）=====
// ⚠️ 注意：这些数据应该从 Pinia/Vuex 获取，这里用 ref 模拟
const adminProductClassify = ref<any[]>(); // 商品分类
const adminProductBrand = ref<any[]>([]); // 供应商选择
const tableFrom = ref<any>({
	page: 1,
	limit: 10,
	categoryId: '',
	name: '',
	isShow: '',
	merIds: '',
	merStars: '',
});
const dialogData = ref<{ data: any; total: number }>({ data: [], total: 0 }); //弹窗表格数据
const checked = ref<any>();
const multipleTable = ref<any>();
const queryRef = ref<any>();
// ====== Cascader 配置 ======
const propsCategory = {
	value: 'id',
	label: 'name',
	children: 'childList',
	expandTrigger: 'hover',
	checkStrictly: false,
	multiple: props.multipleCategory,
	emitPath: false,
};
const propsProductClassify = {
	value: 'id',
	label: 'name',
	children: 'childList',
	expandTrigger: 'hover',
	checkStrictly: false,
	multiple: false,
	emitPath: false,
};

// ====== 生命周期 ======
onMounted(() => {
	getAdminProductClassify();
	getProductListByIds();
	getMerProductBrand();
});

// watch(
// 	() => props.productAssociationType,
// 	(val) => {
// 		console.log('productAssociationType', val);
// 		if (val !== 'product') {
// 			tableData.value.data = [];
// 		}
// 	},
// 	{
// 		immediate: true,
// 		deep: true,
// 	}
// );

//
const getProductListByIds = async () => {
	console.log('productAssociationType', props.productAssociationType);
	if (props.productAssociationType === 'product' && props.formValidate.data) {
		try {
			listLoading.value = true;
			const res = await productListbyidsApi(props.formValidate.data);
			tableData.value.data = res.data;
		} catch (err) {
			console.error(err);
		} finally {
			listLoading.value = false;
		}
	}
};

const handleAddGoods = () => {
	dialogVisible.value = true;
	getDataList();
	// 假设 $modalGoodList 是一个全局方法，用于打开商品选择弹窗
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	// this.$modalGoodList(
	// 	function (row: any[]) {
	// 		listLoading.value = false;
	// 		tableData.value.data = row;
	// 		// 触发父组件事件
	// 		emit('getProductAssociationData', tableData.value.data);
	// 	},
	// 	'many',
	// 	tableData.value.data
	// );
};

// 弹窗搜索
const getDataList = async (num?: number) => {
	console.log('merIds.value', merIds.value);
	listLoading.value = true;
	tableFrom.value.page = num ? num : tableFrom.value.page;
	tableFrom.value.name = encodeURIComponent(name.value);
	tableFrom.value.merIds = merIds.value ? merIds.value.toString() : '';
	try {
		console.log('tableFrom.value', tableFrom.value);
		const res = await productActivityListApi(tableFrom.value);
		console.log('res', res);
		console.log('tableFrom.value', tableFrom.value);
		if (res.code === 0) {
			dialogData.value.data = res.data.records;
			console.log('dialogData.value.data', dialogData.value.data);
			dialogData.value.total = res.data.total;
			// dialogData.value.data.forEach((item: any) => {
			// 	checked.value.forEach((element: any) => {
			// 		if (Number(item.id) === Number(element.id)) {
			// 			nextTick(() => {
			// 				multipleTable.value.toggleRowSelection(item, true);
			// 			});
			// 		}
			// 	});
			// });
			listLoading.value = false;
		} else {
			useMessage().error(res.msg);
		}
	} catch (err: any) {
		listLoading.value = false;
		useMessage().error(err.msg);
	}
	// let params = {
	// 	...this.tableFrom,
	// };
	// productActivityListApi(tableFrom.value)
	// 	.then((res) => {

	// 	})
	// 	.catch((res) => {
	// 		this.listLoading = false;
	// 		this.$message.error(res.message);
	// 	});
};
const pageChange = (page: any) => {
	tableFrom.value.page = page;
	getDataList();
};
const handleSizeChange = (val: any) => {
	tableFrom.value.limit = val;
	getDataList();
};
const handleSubmit = () => {
	if (multipleSelection.value.length > 100) return useMessage().error('最多可选择100个商品');
	// $emit('getStoreItem', this.checkBox);
	tableData.value.data = multipleSelection.value;
	emit('getProductAssociationData', tableData.value.data);
	dialogVisible.value = false;
	Object.assign(tableFrom.value, { page: 1, limit: 10, categoryId: '', name: '', isShow: '', merIds: '', merStars: '' });
};

const close = () => {
	dialogVisible.value = false;
	Object.assign({}, tableFrom.value, { page: 1, limit: 10, categoryId: '', name: '', isShow: '', merIds: '', merStars: '' });
	tableData.value.data = [];
	// this.$emit('closeDialog', null);
};
const handleDelete = async (index: number, row: any) => {
	// 假设 $modalSure 是一个确认弹窗方法
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	// this.$modalSure('删除该商品吗？').then(() => {
	// 	tableData.value.data.splice(index, 1);
	// 	emit('getProductAssociationData', tableData.value.data);
	// });
	try {
		await useMessageBox().confirm('删除该商品吗？', '提示');
		tableData.value.data.splice(index, 1);
		emit('getProductAssociationData', tableData.value.data);
	} catch {
		return;
	}
};

const handleBatchDel = async () => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	try {
		await useMessageBox().confirm('批量删除商品吗？', '提示');
		const data = tableData.value.data.filter((item: any) => {
			return !multipleSelection.value.some((sel) => sel.id === item.id);
		});
		tableData.value.data = data;
		emit('getProductAssociationData', data);
	} catch {
		return;
	}
	// this.$modalSure('批量删除商品吗？').then(() => {
	// 	const data = tableData.value.data.filter((item: any) => {
	// 		return !multipleSelection.value.some((sel) => sel.id === item.id);
	// 	});
	// 	tableData.value.data = data;
	// 	emit('getProductAssociationData', data);
	// });
};

const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val;
};

const selectAll = (data: any[]) => {
	const ids = data.map((i) => i.id);
	productIds.value = Array.from(new Set([...productIds.value, ...ids]));
};

const selectOne = (data: any[], row: any) => {
	const ids = data.map((i) => i.id);
	const index = productIds.value.findIndex((e) => e === row.id);
	if (index > -1) productIds.value.splice(index, 1);
	productIds.value = Array.from(new Set([...productIds.value, ...ids]));
};

const getMerId = (id: number[]) => {
	console.log('id', id);
	merIds.value = id;
	props.formValidate.merIds = id;
	getDataList();
	emit('getProductAssociationData', id);
};

const handleBrandSelected = (ids: number[]) => {
	props.formValidate.proBrandList = ids;
	tableFrom.value.proBrandList = ids;
	getDataList();
	emit('getProductAssociationData', ids);
};

const handleCateSelected = (ids: number[]) => {
	emit('getProductAssociationData', ids);
};
const getAdminProductClassify = async () => {
	try {
		const { code, data, msg } = await productCategoryApi();
		if (code === 0) {
			console.log('data', data);
			if (data.length > 0) {
				data.map((item: any) => {
					console.log('dataitem', item);
					if (item.childList?.length < 1) {
						item.disabled = true;
					}
				});
				adminProductClassify.value = data;
			}
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const getMerProductBrand = async () => {
	try {
		const { code, data, msg } = await brandListAllApi();
		if (code === 0) {
			console.log('adminProductBrand', adminProductBrand);
			adminProductBrand.value = data;
			// data.map((item: any) => {
			// 	if (item.childList?.length < 1) {
			// 		item.disabled = true;
			// 	}
			// });
			// adminProductClassify.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 定义 emits
const emit = defineEmits(['getProductAssociationData']);
</script>

<style scoped lang="scss">
.selWidth {
	margin-bottom: 10px;
}
</style>
<!-- <template>
  <div>
    <el-form-item v-if="productAssociationType == 'product'">
      <el-button size="small" type="primary" @click="handleAddGoods">添加商品</el-button>
      <el-button v-if="isBatchDelete" size="small" @click="handleBatchDel" :disabled="!multipleSelection.length"
        >批量删除</el-button
      >
    </el-form-item>
    <el-form-item v-if="productAssociationType == 'product'">
      <el-table
        ref="tableList"
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%; margin-top: 5px"
        size="small"
        @selection-change="handleSelectionChange"
        @select-all="selectAll"
        @select="selectOne"
      >
        <el-table-column v-if="isBatchDelete" type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="ID" width="55"> </el-table-column>
        <el-table-column label="商品图" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="price" label="售价" min-width="90" />
        <el-table-column prop="stock" label="库存" min-width="70" />
        <el-table-column label="操作" width="60" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item
      label-width="73px"
      v-if="productAssociationType == 'brand'"
      label="选择品牌："
      :span="24"
      prop="proBrandList"
    >
      <el-select
        class="selWidth"
        clearable
        filterable
        v-model="formValidate.proBrandList"
        :multiple="multipleBrand"
        placeholder="请选择品牌"
        @change="handleBrandSelected"
      >
        <el-option v-for="(v, i) in productBrand" :key="i" :label="v.name" :value="v.id" :disabled="!v.isShow">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label-width="73px"
      v-if="productAssociationType == 'category'"
      label="选择分类："
      :span="24"
      prop="proCategorylist"
    >
      <el-cascader
        v-model="formValidate.proCategorylist"
        class="selWidth"
        :props="propsCategory"
        :options="adminProductClassify"
        filterable
        placeholder=""
        :show-all-levels="false"
        clearable
        @change="handleCateSelected"
      />
    </el-form-item>
    <el-form-item
      label-width="73px"
      label="选择商户："
      v-hasPermi="['platform:merchant:page:list']"
      v-if="productAssociationType == 'merchant'"
      :span="24"
      prop="merIds"
    >
      <merchant-name @getMerId="getMerId" :multiple="multipleMer" :merIdChecked="formValidate.merIds"></merchant-name>
    </el-form-item>
  </div>
</template>
<script setup>
import merchantName from '@/components/merUseCategory/index.vue';
import { mapGetters } from 'vuex';
import { productListbyidsApi } from '@/api/product';
export default {
  props: {
    formValidate: {
      type: Object,
      default: null,
    },
    //商品关联类型:product-商品，category-品类，brand-品牌,merchant-店铺
    productAssociationType: {
      type: String,
      default: '',
    },
    //品牌是否多选，false单选
    multipleBrand: {
      type: Boolean,
      default: false,
    },
    //分类是否多选，false单选
    multipleCategory: {
      type: Boolean,
      default: false,
    },
    //是否展示批量删除
    isBatchDelete: {
      type: Boolean,
      default: false,
    },
  },
  components: { merchantName },
  data() {
    return {
      tableData: {
        data: [],
        total: 0,
      },
      multipleSelection: [], //全部选中的商品值
      multipleMer: true, //商户是否多选
      listLoading: false,
      productIds: [],
      propsCategory: {
        value: 'id',
        label: 'name',
        children: 'childList',
        expandTrigger: 'hover',
        checkStrictly: false,
        multiple: this.multipleCategory,
        emitPath: false,
      },
    };
  },
  computed: {
    ...mapGetters(['adminProductClassify', 'productBrand']),
  },
  mounted() {
    if (!localStorage.getItem('adminProductClassify')) this.$store.dispatch('product/getAdminProductClassify');
    if (!localStorage.getItem('productBrand')) this.$store.dispatch('product/getMerProductBrand');
  },
  created() {
    this.getProductListByIds();
  },
  methods: {
    async getProductListByIds() {
      if (this.productAssociationType === 'product' && this.formValidate.data) {
        // 根据id查询出对应商品
        this.tableData.data = await productListbyidsApi(this.formValidate.data);
      }
    },
    //添加商品
    handleAddGoods() {
      const _this = this;
      this.$modalGoodList(
        function (row) {
          _this.listLoading = false;
          _this.tableData.data = row;
          _this.$emit('getProductAssociationData', _this.tableData.data);
        },
        'many',
        _this.tableData.data,
      );
    },
    //行删除
    handleDelete(index, row) {
      this.$modalSure('删除该商品吗？').then(() => {
        this.tableData.data.splice(index, 1);
        this.$emit('getProductAssociationData', this.tableData.data);
      });
    },
    //批量删除
    handleBatchDel() {
      this.$modalSure('批量删除商品吗？').then(() => {
        let data = [];
        for (let item1 of this.tableData.data) {
          let _index = this.multipleSelection.findIndex((c) => c.id === item1.id);
          if (_index === -1) {
            data.push(item1);
          }
        }
        this.tableData.data = data;
        this.$emit('getProductAssociationData', this.tableData.data);
      });
    },
    //表格选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectAll(data) {
      let id = data.map((i, index) => {
        return i.id;
      });
      this.productIds = Array.from(new Set([...this.productIds, ...id]));
    },
    selectOne(data, row) {
      let id = data.map((i, index) => {
        return i.id;
      });
      let index = this.productIds.findIndex((e) => {
        return e == row.id;
      });
      this.productIds.splice(index, 1);
      this.productIds = Array.from(new Set([...this.productIds, ...id]));
    },
    // 获取商户id
    getMerId(id) {
      this.formValidate.merIds = id;
      this.$emit('getProductAssociationData', id);
      // this.formValidate.merIds = id;
    },
    handleBrandSelected(ids) {
      this.$forceUpdate(() => {
        this.formValidate.proBrandList = ids;
      });
      this.$emit('getProductAssociationData', ids);
    },
    handleCateSelected(ids) {
      this.$emit('getProductAssociationData', ids);
    },
  },
};
</script>
<style scoped lang="scss"></style> -->
