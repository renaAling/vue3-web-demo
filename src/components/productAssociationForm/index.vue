<template>
	<div>
		<!-- 商品操作按钮 -->
		<el-form-item v-if="productAssociationType === 'product'" style="margin-bottom: 20px">
			<el-button type="primary" @click="handleAddGoods">添加商品</el-button>
			<el-button v-if="isBatchDelete" :disabled="!multipleSelection.length" @click="handleBatchDel"> 批量删除 </el-button>
		</el-form-item>

		<!-- 商品表格 -->
		<el-form-item v-if="productAssociationType === 'product'">
			<el-table
				border
				ref="tableList"
				v-loading="listLoading"
				:data="tableData.data"
				style="width: 100%; margin-top: 5px"
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
					<template #default="{ $index, row }">
						<el-button type="text" size="small" @click="handleDelete($index, row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-form-item>

		<!-- 品牌选择 -->
		<el-form-item label-width="73px" v-if="productAssociationType === 'brand'" label="选择品牌：" :span="24" prop="proBrandList">
			<el-select
				v-model="formValidate.proBrandList"
				:multiple="multipleBrand"
				placeholder="请选择品牌"
				clearable
				filterable
				@change="handleBrandSelected"
			>
				<el-option v-for="(v, i) in productBrand" :key="i" :label="v.name" :value="v.id" :disabled="!v.isShow"></el-option>
			</el-select>
		</el-form-item>

		<!-- 分类选择 -->
		<el-form-item label-width="73px" v-if="productAssociationType === 'category'" label="选择分类：" :span="24" prop="proCategorylist">
			<el-cascader
				v-model="formValidate.proCategorylist"
				:props="propsCategory"
				:options="adminProductClassify"
				filterable
				placeholder=""
				:show-all-levels="false"
				clearable
				@change="handleCateSelected"
			/>
		</el-form-item>

		<!-- 商户选择 -->
		<el-form-item label-width="73px" label="选择商户：" v-if="productAssociationType === 'merchant'" :span="24" prop="merIds">
			<merchant-name @getMerId="getMerId" :multiple="multipleMer" :mer-id-checked="formValidate.merIds"></merchant-name>
		</el-form-item>
	</div>
</template>

<script setup lang="ts">
import merchantName from '/@/components/merUseCategory/index.vue';
import { mapGetters } from 'vuex';
import { productListbyidsApi } from '/@/api/culture/product/product';

// Props 定义
interface FormValidate {
	data?: number[];
	proBrandList?: number | number[];
	proCategorylist?: number[];
	merIds?: number | number[];
}

const props = defineProps<{
	formValidate: FormValidate;
	productAssociationType: 'product' | 'brand' | 'category' | 'merchant';
	multipleBrand?: boolean;
	multipleCategory?: boolean;
	isBatchDelete?: boolean;
}>();

// Emits 定义
const emit = defineEmits<{
	(e: 'getProductAssociationData', payload: any): void;
}>();

// 数据状态
const tableData = reactive<{ data: any[]; total: number }>({
	data: [],
	total: 0,
});
const multipleSelection = ref<any[]>([]);
const listLoading = ref<boolean>(false);
const productIds = ref<number[]>([]);
const multipleMer = ref<boolean>(true);

// Cascader 配置
const propsCategory = reactive({
	value: 'id',
	label: 'name',
	children: 'childList',
	expandTrigger: 'hover',
	checkStrictly: false,
	multiple: props.multipleCategory ?? false,
	emitPath: false,
});

// Vuex Getters
const storeGetters = mapGetters(['adminProductClassify', 'productBrand']);
const adminProductClassify = computed(() => storeGetters.adminProductClassify());
const productBrand = computed(() => storeGetters.productBrand());

// 生命周期
onBeforeMount(async () => {
	if (props.productAssociationType === 'product' && props.formValidate.data?.length) {
		const ids = props.formValidate.data.join(',');
		tableData.data = await productListbyidsApi(ids);
	}
});

onMounted(() => {
	const storage = localStorage;
	if (!storage.getItem('adminProductClassify')) {
		// 触发 vuex action
	}
	if (!storage.getItem('productBrand')) {
		// 触发 vuex action
	}
});

// 方法定义
const handleAddGoods = () => {
	listLoading.value = true;
	// 假设 this.$modalGoodList 是全局挂载的方法
	(window as any).$modalGoodList(
		(row: any) => {
			listLoading.value = false;
			tableData.data = row;
			emit('getProductAssociationData', tableData.data);
		},
		'many',
		tableData.data
	);
};

const handleDelete = (index: number, row: any) => {
	(window as any).$modalSure('删除该商品吗？').then(() => {
		tableData.data.splice(index, 1);
		emit('getProductAssociationData', tableData.data);
	});
};

const handleBatchDel = () => {
	(window as any).$modalSure('批量删除商品吗？').then(() => {
		const data = tableData.data.filter((item) => !multipleSelection.value.some((c) => c.id === item.id));
		tableData.data = data;
		emit('getProductAssociationData', tableData.data);
	});
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

const getMerId = (id: number | number[]) => {
	props.formValidate.merIds = id;
	emit('getProductAssociationData', id);
};

const handleBrandSelected = (ids: number | number[]) => {
	props.formValidate.proBrandList = ids;
	emit('getProductAssociationData', ids);
};

const handleCateSelected = (ids: number[]) => {
	emit('getProductAssociationData', ids);
};
</script>

<style scoped lang="scss"></style>
