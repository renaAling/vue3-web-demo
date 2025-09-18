<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="姓名" prop="name">
						<el-input placeholder="请输入联系人姓名" v-model="state.queryForm.name" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="手机号" prop="contactPhone">
						<el-input placeholder="请输入联系人手机号" v-model="state.queryForm.contactPhone" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="公司名称" prop="enterpriseName">
						<el-input placeholder="请输入联系人公司名称" v-model="state.queryForm.enterpriseName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="state.queryForm.status" placeholder="请选择处理状态" style="width: 230px" clearable>
							<el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary"> 查询 </el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="姓名" prop="name" show-overflow-tooltip />
				<el-table-column label="手机号" prop="contactPhone" show-overflow-tooltip />
				<el-table-column label="公司名称" prop="enterpriseName" width="140" show-overflow-tooltip />
				<el-table-column label="申请时间" prop="createTime" width="200" />
				<el-table-column label="状态" prop="status" width="200">
					<template #default="{ row }">
						<span v-if="row.status === 1">待沟通</span>
						<span v-else-if="row.status === 2">已开通账号</span>
						<span v-else-if="row.status === 3">不符合介入标准</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="240">
					<template #default="{ row, $index }">
						<el-button class="ml-1" text type="primary" v-if="row.status === 1" @click="handleDeal(row)">处理</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />

			<!-- 审核 -->
			<el-dialog v-model="dialogVisible" title="接入审核" width="410" align-center>
				<el-form ref="formRef" :model="model" :rules="rules" label-width="auto">
					<el-form-item label="处理结果：" class="custom-width" prop="status">
						<el-radio-group v-model="model.status">
							<el-radio :label="2">已开通账号</el-radio>
							<el-radio :label="3">不符合接入标准</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<template #footer>
					<div class="dialog-footer">
						<el-button type="primary" v-loading="loading" @click="handleConfirm">确认</el-button>
					</div>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script lang="ts" name="systemDatasourceConf" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ElMessageBox } from 'element-plus';
import { getContactsInfoList, updateApproveStatus } from '/@/api/openPlatform/contact';
import { ElNotification } from 'element-plus';

const router = useRouter();
// 搜索变量
const queryRef = ref();
const dialogVisible = ref(false);
const loading = ref(false);
const mainId = ref('');

// 状态枚举列表
const statusList = [
	{ label: '待沟通', value: 1 },
	{ label: '已开通账号', value: 2 },
	{ label: '不符合介入标准', value: 3 },
];

const model = ref({
	status: 2,
});

const rules = reactive({
	status: [{ required: true, message: '请选择处理结果', trigger: 'change' }],
});
/**
 * 处理列表项的操作
 */
const handleDeal = (row: any) => {
	dialogVisible.value = true;
	mainId.value = row.id;
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getContactsInfoList,
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleConfirm = () => {
	loading.value = true;
	let data = {
		id: mainId.value,
		status: model.value.status,
	};
	updateApproveStatus(data).then((res) => {
		loading.value = false;
		dialogVisible.value = false;
		ElNotification({
			title: '提示',
			message: '操作成功',
			type: 'success',
		});
		getDataList();
	});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
