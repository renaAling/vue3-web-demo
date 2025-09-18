<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="flex justify-between items-center mb-3">
				<div>
					<el-form ref="queryRef" :inline="true" :model="queryForm">
						<el-form-item label="采购单名称" prop="purchaseName">
							<el-input v-model="queryForm.purchaseName" placeholder="请输入名称" clearable maxlength="20" />
						</el-form-item>
						<el-form-item label="日期范围" prop="dateRadius">
							<el-date-picker
								v-model="queryForm.dateRadius"
								type="daterange"
								value-format="YYYY-MM-DD"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
							/>
						</el-form-item>
						<el-form-item label="状态" prop="approvalStatus">
							<el-select v-model="queryForm.approvalStatus" placeholder="请选择" style="width: 240px">
								<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>

						<el-form-item>
							<el-button icon="Search" type="primary" @click="onSearch()">查询</el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tool-box">
				<el-button icon="folder-add" type="primary" @click="onAdd()"> 新建采购单 </el-button>
				<el-button icon="download" @click="onExport()"> 导出 </el-button>
			</div>
			<el-table
				:data="tableData"
				row-key="id" border
				class="my-table"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" />
				<el-table-column label="采购单名称" prop="purchaseName" />
				<el-table-column label="状态" prop="approvalStatus">
					<template #default="{ row }">
						<el-tag v-if="row.approvalStatus != null" :type="statusTagConfig[row.approvalStatus].color" effect="light" round>{{
							row.approvalStatusLabel
						}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="采购门店" prop="storeName" />
				<el-table-column label="供应商" prop="supplierName" />
				<el-table-column label="采购数量" prop="purchaseCount" />
				<el-table-column label="采购金额">
					<template #default="{ row }"> ￥{{ row.purchaseTotal }} </template>
				</el-table-column>
				<el-table-column label="操作" width="280">
					<template #default="{ row }">
						<div style="text-align: left">
							<el-button type="primary" link @click="handleDetail(row)">详情</el-button>
							<el-button v-if="![5].includes(row.approvalStatus)" type="primary" link @click="handleEdit(row)">编辑</el-button>
							<el-button v-if="[5].includes(row.approvalStatus)" type="primary" link @click="handleEdit(row, true)">编辑</el-button>
							<el-button type="danger" link @click="handleDelete(row)">删除</el-button>
							<el-button v-if="[0].includes(row.approvalStatus)" type="primary" link @click="handleAudit(row)">提交审核</el-button>
							<el-button v-if="[5].includes(row.approvalStatus)" type="primary" link @click="handleEdit(row, true)">重新提交</el-button>
							<el-button v-if="[2].includes(row.approvalStatus)" type="primary" link @click="handleComplete(row)">采购完成</el-button>
							<el-button v-if="[3].includes(row.approvalStatus)" type="primary" link @click="handleStorage(row)">入库</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="page" />
			<EditDialog ref="entranceDialogRef" @refresh="getDataList()" />
		</div>
	</div>
</template>

<script lang="ts" name="store-label-index" setup>
import { ElMessageBox, ElNotification } from 'element-plus';
import pagination from '/@/components/Pagination/index.vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	pruchaseFlowStatusApi,
	loadPurchasePageApi,
	auditPurchaseApi,
	auditPurchaseComplete,
	auditPurchaseStorageApi,
	deletePurchaseApi,
} from '/@/api/goodStore/mall';
import { downBlobFile } from '/@/utils/other';
import { BasicTableProps, useTable } from '/@/hooks/table';
// 动态引入组件
const EditDialog = defineAsyncComponent(() => import('./components/editDialog.vue'));

// 定义常量配置
const statusTagConfig = {
	0: { label: '待审核', color: 'warning' },
	1: { label: '审核中', color: 'success' },
	2: { label: '通过', color: 'success' },
	3: { label: '已完成', color: 'primary' },
	4: { label: '已入库', color: 'success' },
	5: { label: '已驳回', color: 'danger' },
};

// 定义变量内容
const statusOptions = ref([]);

const router = useRouter();
const entranceDialogRef = ref();
const queryRef = ref();
const page = ref({
	total: 0,
	size: 10,
	current: 1,
});

const queryForm = ref({
	purchaseName: '',
	dateRadius: [], // 范围日期
	approvalStatus: '',
});
const tableData = ref([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: loadPurchasePageApi,
	queryForm: {},
	dataList: [],
});
const { tableStyle } = useTable(state);

// 获取状态列表数据
const getStatusList = async () => {
	const res = await pruchaseFlowStatusApi();
	if (res.code === 0) {
		statusOptions.value = res.data;
	}
};
// 查询
const onSearch = () => {
	page.value.current = 1;
	getDataList();
};
const getDataList = async () => {
	let formValues = {};
	for (let key in queryForm.value) {
		if (key == 'dateRadius') {
			formValues.startDate = queryForm.value.dateRadius[0];
			formValues.endDate = queryForm.value.dateRadius[1];
		} else {
			formValues[key] = queryForm.value[key];
		}
	}

	let params = {
		current: page.value.current,
		size: page.value.size,
		...formValues,
	};

	const { code, data } = await loadPurchasePageApi(params);
	if (code === 0) {
		tableData.value = data.records;
		page.value.total = data.total;
	}
};

const sizeChangeHandle = (val: number) => {
	page.value.size = val;
	getDataList();
};
const currentChangeHandle = (val: number) => {
	page.value.current = val;
	getDataList();
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	getDataList();
};

// 删除操作
const handleDelete = async (record: any) => {
	// "审核中"和"已审核"不可编辑和删除
	const tipConfig: any = {
		1: '审核中，不可删除',
		2: '已审核，不可删除',
		3: '已完成，不可删除',
		4: '已入库，不可删除',
	};
	if ([1, 2, 3, 4].includes(record.approvalStatus)) {
		ElMessageBox.alert(tipConfig[record.approvalStatus], '提示', {
			confirmButtonText: '确认',
			center: true,
		});
		return;
	}

	// try {
	// 	await useMessageBox().confirm('确定要删除吗？');
	// } catch {
	// 	return;
	// }

	try {
		const { id } = record;
		await deletePurchaseApi({ id });
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 查看详情
const handleDetail = (record: any) => {
	router.push({
		path: '/goodStore/purchase/purchaseDetail',
		query: { id: record.id },
	});
};
// 新建采购单
const onAdd = () => {
	entranceDialogRef.value.openDialog();
};
// 编辑
const handleEdit = (record: any, resubmit?: boolean) => {
	console.log('record', record);
	// "审核中"和"已审核"不可编辑和删除
	const tipConfig: any = {
		1: '审核中，不可编辑',
		2: '已通过，不可编辑',
		3: '已完成，不可编辑',
		4: '已入库，不可编辑',
	};
	if ([1, 2, 3, 4].includes(record.approvalStatus)) {
		ElMessageBox.alert(tipConfig[record.approvalStatus], '提示', {
			confirmButtonText: '确认',
			center: true,
		});
		return;
	}

	let obj = record;
	if (resubmit) obj.resubmit = resubmit;
	entranceDialogRef.value.openDialog(record);
};
// 提交审核
const handleAudit = (record: any) => {
	ElMessageBox.confirm(`请确认是否提交审核`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	})
		.then(() => {
			auditPurchaseApi({
				id: record.id,
			}).then((res) => {
				if (res.msg) {
					ElNotification({
						type: 'error',
						message: res.msg,
					});
				}
				getDataList();
			});
		})
		.catch((err) => {
			console.log('err', err);
		});
};
// 采购完成提交
const handleComplete = (record: any) => {
	ElMessageBox.confirm(`请确认是否采购完成`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	})
		.then(() => {
			auditPurchaseComplete({
				purchaseCode: record.purchaseCode,
			}).then((res) => {
				if (res.msg) {
					ElNotification({
						type: 'error',
						message: res.msg,
					});
				}
				getDataList();
			});
		})
		.catch((err) => {
			console.log('err', err);
		});
};
// 入库提交
const handleStorage = (record: any) => {
	ElMessageBox.confirm(`请确认是否入库`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	})
		.then(() => {
			auditPurchaseStorageApi({
				id: record.id,
			}).then((res) => {
				if (res.msg) {
					ElNotification({
						type: 'error',
						message: res.msg,
					});
				}
				getDataList();
			});
		})
		.catch((err) => {
			console.log('err', err);
		});
};

// 导出
const onExport = async () => {
	// let params = {
	// 	...queryForm.value,
	// }
	// let res = await purchaseExportApi(params);
	downBlobFile('/mall/purchase_manage/excel', queryForm.value, '采购单导出.xlsx');
};

onMounted(() => {
	getStatusList();
	getDataList();
});
</script>

<style lang="scss" scoped>
.tool-box {
	margin-bottom: 10px;
}
</style>
