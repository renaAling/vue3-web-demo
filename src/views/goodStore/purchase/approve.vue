<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="flex justify-between items-center mb-3">
				<div>
					<el-form ref="queryRef" :inline="true" :model="queryForm">
						<el-form-item label="审批状态" prop="auditStatus">
							<el-select v-model="queryForm.auditStatus" placeholder="请选择" style="width: 240px">
								<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item label="采购单名称" prop="purchaseName">
							<el-input v-model="queryForm.purchaseName" placeholder="请输入采购单名称" />
						</el-form-item>
						<el-form-item label="提交日期" prop="createTime">
							<el-date-picker v-model="queryForm.createTime" value-format="YYYY-MM-DD" />
						</el-form-item>
						<el-form-item label="提交人" prop="createBy">
							<el-input v-model="queryForm.createBy" placeholder="请输入提交人" />
						</el-form-item>

						<el-form-item>
							<el-button icon="Search" type="primary" @click="onSearch()">查询</el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<el-table :data="dataList" row-key="id" border class="my-table">
				<el-table-column label="序号" type="index" width="60" />
				<el-table-column label="采购单名称" prop="purchaseName" />
				<el-table-column label="采购门店" prop="storeName" />
				<el-table-column label="供应商" prop="supplierName" />
				<el-table-column label="采购数量" prop="purchaseCount" />
				<el-table-column label="采购金额" prop="purchaseTotal" />
				<el-table-column label="提交人" prop="createBy" />
				<el-table-column label="审批状态" prop="auditStatusLabel" />
				<el-table-column label="操作" width="160">
					<template #default="{ row }">
						<!-- TODO   通过、驳回需要二次确认；审批操作后，状态反馈给采购单列表； -->

						<el-button type="primary" link @click="handleDetail(row)">详情</el-button>
						<el-button type="success" v-if="row.auditStatus === 0" link @click="handleAudit(row, 1)">通过</el-button>
						<el-button type="danger" v-if="row.auditStatus === 0" link @click="handleAudit(row, 2)">驳回</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="page" />

			<EditDialog ref="entranceDialogRef" @refresh="getDataList()" />
		</div>
	</div>
</template>

<script lang="ts" name="store-label-index" setup>
import pagination from '/@/components/Pagination/index.vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { loadPurchaseAuditPageApi, purchaseAuditStatusApi, updatePurchaseAuditApi } from '/@/api/goodStore/mall';
import { ElMessageBox, ElNotification } from 'element-plus';
// 动态引入组件
const EditDialog = defineAsyncComponent(() => import('./components/editDialog.vue'));

// 定义变量内容
const statusOptions = ref([]);
// [
// 	{ value: 1, label: '待审核' },
// 	{ value: 2, label: '审核中' },
// 	{ value: 3, label: '通过' },
// 	{ value: 4, label: '已完成' },
// 	{ value: 5, label: '已驳回' },
// 	{ value: 6, label: '已入库' },
// ];

const router = useRouter();
const entranceDialogRef = ref();
const queryRef = ref();
const page = ref({
	total: 0,
	size: 10,
	current: 1,
});

const queryForm = ref<any>({});
const dataList = ref([]);

// 获取状态列表数据
const getStatusList = async () => {
	const res = await purchaseAuditStatusApi();
	if (res.code === 0) {
		statusOptions.value = res.data;
	} else {
		useMessage().error(res.msg);
	}
};
// 查询
const onSearch = () => {
	page.value.current = 1;
	getDataList();
};
const getDataList = async () => {
	let params = {
		current: page.value.current,
		size: page.value.size,
		...queryForm.value,
	};

	const { code, data } = await loadPurchaseAuditPageApi(params);
	if (code === 0) {
		dataList.value = data.records;
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

// 审批
const handleAudit = async (record: any, type: number) => {
	ElMessageBox.confirm(`${type == 1 ? '确认审核通过此采购单吗' : '确认驳回此采购单吗'}`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			updatePurchaseAuditApi({
				id: record.id,
				status: type,
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

// 查看详情
const handleDetail = (record: any) => {
	router.push({
		path: '/goodStore/purchase/purchaseDetail',
		query: { id: record.purchaseId },
	});
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
