<template>
	<el-dialog
		title="商家管理"
		ref="myDialog"
		v-model="visible"
		width="70%"
		:close-on-click-modal="false"
		:show-close="false"
	>
		<el-row style="box-sizing: border-box">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef" label-width="95">
				<el-form-item label="商品分类: " prop="categoryId">
					<el-cascader
						ref="cascader"
						v-model="state.queryForm.categoryId"
						@change="getDataList"
						clearable
						:options="adminProductClassify"
						:props="categoryProps"
						class="selWidth"
					/>
				</el-form-item>
				<el-form-item label="所属供应商: " prop="merId">
					<merchant-name @getMerId="getMerId" :merIdChecked="state.queryForm.merId" :className="'selWidth'" :isDisabled="false"></merchant-name>
				</el-form-item>
				<el-form-item label="SPU: ">
					<el-input
						v-model.trim="state.queryForm.id"
						@keyup.enter.native="getDataList()"
						placeholder="请输入SPU编码"
						class="selWidth"
						style="width: 240px"
					/>
				</el-form-item>
				<el-form-item label="所属商家: " prop="businessCode">
					<el-select v-model.trim="state.queryForm.businessCode" clearable placeholder="请选择" class="selWidth">
						<el-option :label="item.label" :value="item.value" v-for="item in businessOption" :key="'businessCode' + item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="商品搜索: " prop="keywords">
					<el-input
						v-model.trim="state.queryForm.keywords"
						@keyup.enter.native="getDataList()"
						placeholder="请输入商品名称、关键字"
						class="selWidth"
						style="width: 240px"
					/>
				</el-form-item>
				<el-form-item label="会员商品: " prop="isPaidMember">
					<el-select v-model.trim="state.queryForm.isPaidMember" clearable placeholder="请选择" class="selWidth">
						<el-option label="是" :value="true" />
						<el-option label="否" :value="false" />
					</el-select>
				</el-form-item>
				<el-form-item label="积分商品: " prop="isPaidScore">
					<el-select v-model.trim="state.queryForm.isPaidScore" clearable placeholder="请选择" class="selWidth">
						<el-option label="是" :value="true" />
						<el-option label="否" :value="false" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getDataList()">查询</el-button>
					<el-button @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-form>
		</el-row>
		<el-table
			ref="multipleTableRef"
			v-loading="state.loading"
			:data="state.dataList"
			row-key="id" border
			:cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle"
			@selection-change="handleSelectionChange"
			style="height: 300px;"
		>
			<el-table-column type="selection" :selectable="selectable" width="55" />
			<el-table-column property="id" label="SPU" min-width="120" />
			<el-table-column label="商品图" min-width="90">
				<template #default="{ row }">
					<el-image style="width: 60px; height: 60px" :src="row.image" />
				</template>
			</el-table-column>
			<el-table-column property="name" label="商品名称" min-width="120" show-overflow-tooltip />
			<el-table-column property="price" label="支付现金" min-width="120" show-overflow-tooltip />
			<el-table-column property="scorePrice" label="支付积分" min-width="120" show-overflow-tooltip />
			<el-table-column property="originalPrice" label="原价" min-width="120" show-overflow-tooltip />
			<el-table-column property="sales" label="销量" min-width="120" show-overflow-tooltip />
			<el-table-column property="stock" label="库存" min-width="120" show-overflow-tooltip />
			<el-table-column property="firstUpTime" label="首次上架时间" min-width="180" show-overflow-tooltip />
			<el-table-column property="recentUpTime" label="最近上架时间" min-width="180" show-overflow-tooltip />
			<el-table-column property="merchantName" label="所属供应商" min-width="120" show-overflow-tooltip />
			<el-table-column property="businessName" label="所属商家" min-width="120" show-overflow-tooltip />
			<el-table-column label="操作" min-width="120" fixed="right">
				<template #default="{ row }">
					<el-button type="primary" link @click="handleAdd(row)">添加</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- <el-pagination
			v-model:current-page="queryForm.current"
			:page-sizes="[100, 200, 300, 400]"
			layout="total, prev, pager, next,jumper"
			:total="pagination.total"
			background
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/> -->
		<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		<template #footer>
			<el-button @click="handleBatchAdd()" type="primary">添加</el-button>
			<el-button @click="cancel">取消</el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { productCategoryApi } from '/@/api/culture/commodity/commodityList';
import { getBusinessPage } from '/@/api/culture/merchant/merchantManage'; //获取商户数据
import { productLstApi, batchAddApi } from '/@/api/culture/commodity/commodityGroup';
import { ElTable } from 'element-plus';
const merchantName = defineAsyncComponent(() => import('./components/merchantName/index.vue'));
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const queryRef = ref() as any;
const selectable = ref() as any;
const selection = ref() as any;
const businessOption = ref<any>([]);
const adminProductClassify = ref<any[]>([]);
const multipleTableRef = ref();
const groupId = ref<any>();
const loading = ref(false);
const dataList = ref<any[]>([]);
// const queryForm = ref<any>({});
const categoryProps = ref({
	value: 'id',
	label: 'name',
	children: 'childList',
	expandTrigger: 'hover',
	checkStrictly: false,
	emitPath: false,
	multiple: false,
});
const openDialog = async (id: any, productIds?: any) => {
	getDataList();
	console.log('selection', selection.value);
	groupId.value = id;
	getBusinessPageData();
	getAdminProductClassify();
	visible.value = true;
	// dataList.value?.map((item: any) => {
	// 	if (productIds.includes(item.id)) {
	// 		selection.value.push(item);
	// 		console.log('multipleTableRef.value', multipleTableRef.value);
	// 		multipleTableRef.value.toggleRowSelection(item, true);
	// 	}
	// });
	// getDataList();
	// productLstApi
	// try {
	// 	const params = {};
	// 	const { code, data, msg } = await productLstApi(params);
	// 	if (code === 0) {
	// 		visible.value = true;
	// 		// Object.assign(form.value, data);
	// 	} else {
	// 		useMessage().error(msg);
	// 	}
	// } catch (error: any) {
	// 	useMessage().error(error.msg);
	// }
	// try {
	// 	const { code,data, msg } = await orderSendAdd(params);
	// 	if (code === 0) {
	// visible.value = true;
	// Object.assign(form.value, data);
	// 	} else {
	// 		useMessage().error(msg);
	// 	}
	// } catch (error: any) {
	// 	useMessage().error(error.msg);
	// }
};
const getBusinessPageData = async () => {
	businessOption.value = [];
	// getBusinessPage
	try {
		const { code, data, msg } = await getBusinessPage({ current: 1, size: 1000, limit: 1000, descs: '', ascs: '' });
		if (code === 0) {
			console.log('data', data);
			if (data.records.length) {
				data.records.forEach((item: any) => {
					businessOption.value.push({
						label: item.name,
						value: item.code,
					});
				});
			}
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const getAdminProductClassify = async () => {
	try {
		const { code, data, msg } = await productCategoryApi();
		if (code === 0) {
			console.log('data', data);
			data.map((item: any) => {
				if (item.childList?.length < 1) {
					item.disabled = true;
				}
			});
			adminProductClassify.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const getMerId = (id: number | string) => {
	state.queryForm.merId = id;
	// subSuccess();
};
const handleSelectionChange = (val: any[]) => {
	selection.value = val;
};
// 添加
const handleAdd = async (row) => {
	const params = {
		productIdList: [row.id],
		groupId: Number(groupId.value),
	};
	try {
		const { code, data, msg } = await batchAddApi(params);
		if (code === 0) {
			visible.value = true;
			useMessage().success('添加成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

// 批量添加
const handleBatchAdd = async () => {
	if (!selection.value.length) {
		useMessage().warning('请选择商品');
		return;
	}
	console.log('selection.value', selection.value);
	const params = {
		productIdList: selection.value.map((item: any) => item.id),
		groupId: Number(groupId.value),
	};
	try {
		const { code, data, msg } = await batchAddApi(params);
		if (code === 0) {
			visible.value = true;
			useMessage().success('添加成功');
			selection.value.length = [];
			cancel();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

// 取消添加-关闭弹窗
const cancel = () => {
	selection.value = [];
	Object.assign(state.queryForm, {
		categoryId: '',
		merId: '',
		id: '',
		businessCode: '',
		keywords: '',
		isPaidMember: '',
		isPaidScore: '',
	});
	queryRef.value.resetFields();
	emit('refresh');
	visible.value = false;
};

// 清空搜索条件
const resetQuery = () => {
	selection.value = [];
	Object.assign(state.queryForm, {
		categoryId: '',
		merId: '',
		id: '',
		businessCode: '',
		keywords: '',
		isPaidMember: '',
		isPaidScore: '',
	});
	queryRef.value.resetFields();
	getDataList();
};
// const handleSizeChange = (val: number) => {
// 	queryForm.value.size = val;
// 	getDataList();
// };
// const handleCurrentChange = (val: number) => {
// 	queryForm.value.current = val;
// 	getDataList();
// };
// const getDataList = async () => {
// 	try {
// 		const { code, data, msg } = await productLstApi(queryForm.value);
// 		if (code === 0) {
// 			dataList.value = data.records;
// 			pagination.value.current = data.current;
// 			pagination.value.total = data.total;
// 			pagination.value.size = data.size;
// 		} else {
// 			useMessage().error(msg);
// 		}
// 	} catch (error: any) {
// 		useMessage().error(error.msg);
// 	}
// };

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: productLstApi,
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.header {
	font-size: 24px;
	font-weight: 500;
	margin: 0 0 10px 10px;
}
</style>
