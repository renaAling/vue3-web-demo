<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="场所ID" prop="code">
						<el-input placeholder="请输入场所ID" v-model="state.queryForm.code" clearable />
					</el-form-item>
					<el-form-item label="场所名称" prop="name">
						<el-input placeholder="请输入场所名称" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="审核状态" prop="auditStatus">
						<el-select v-model="state.queryForm.auditStatus" clearable>
							<el-option v-for="(item, index) in auditStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
				<el-table-column prop="code" label="场所ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="场所名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="platformPlaceSiteNames" label="附近站点" show-overflow-tooltip>
					<template #default="{ row }">
						{{ row.platformPlaceSiteNames.join('/') }}
					</template>
				</el-table-column>
				<el-table-column label="地图图标" show-overflow-tooltip>
					<template #default="{ row }">
						<el-image style="width: 20px; height: 20px" :src="row.mapIcon" fit="fill" />
					</template>
				</el-table-column>
				<el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop="labelName" label="站点主题标签" show-overflow-tooltip></el-table-column>
				<el-table-column prop="labelContent" label="站点主题内容" show-overflow-tooltip></el-table-column>
				<el-table-column prop="platformPlaceSystemNames" label="已对接数字化系统" show-overflow-tooltip min-width="100"></el-table-column>
				<el-table-column label="审核状态" min-width="60">
					<template #default="{ row }">
						<el-button link type="success" v-if="row.auditStatus === 3">已通过</el-button>
						<el-button link type="danger" v-if="row.auditStatus === 4">已驳回</el-button>
						<el-button link type="primary" v-if="row.auditStatus === 2">待审核</el-button>
						<!-- <el-button link type="primary">待审核</el-button>
						<el-button link type="danger">已驳回</el-button> -->
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="60" fixed="right">
					<template #default="{ row }">
						<el-button link disabled v-if="row.auditStatus !== 2">--</el-button>
						<el-button link type="primary" @click="handleAudit(row, 3)" v-if="row.auditStatus === 2">通过</el-button>
						<el-button link type="danger" @click="handleAudit(row, 4)" v-if="row.auditStatus === 2">驳回</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogVisible" title="" width="25%" :close-on-click-modal="false">
			<div class="dialog-content">确认驳回该信息，请填写驳回原因</div>
			<el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="驳回原因" prop="rejectReason">
					<el-input v-model="form.rejectReason" maxlength="20" :rows="3" type="textarea" show-word-limit />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)"> 确认 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';
// import { useMessage, useMessageBox } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { getAuditPage, getPlatformPlaceAudit } from '/@/api/platformEntry/locationInformationAudit';
const queryRef = ref();
const ruleFormRef = ref<FormInstance>();
const dialogVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getAuditPage, // H
	descs: [],
});
const form = ref<any>({
	id: '',
	auditStatus: 0,
	rejectReason: '',
});
const auditStatusList = ref([
	{ label: '待审核', value: 2 },
	{ label: '已通过', value: 3 },
	{ label: '已驳回', value: 4 },
]);
const rules = reactive<FormRules<any>>({
	rejectReason: [{ required: true, message: '请输入驳回原因', trigger: ['blur', 'change'] }],
});
const handleAudit = async (row: any, auditStatus: number) => {
	console.log('row', row);
	form.value.id = Number(row.id);
	form.value.auditStatus = auditStatus;
	if (auditStatus === 3) {
		try {
			await useMessageBox().confirm(`是否确认通过该场所信息审核？`, '审核提示', '确定');
		} catch {
			return;
		}
		console.log('form', form.value);
		try {
			let res = await getPlatformPlaceAudit(form.value);
			if (res.code === 0) {
				useMessage().success('审核成功');
				getDataList();
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogVisible.value = true;
	}
};

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', form.value);
			try {
				let res = await getPlatformPlaceAudit(form.value);
				if (res.code === 0) {
					useMessage().success('审核成功');
					dialogVisible.value = false;
					getDataList();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	dialogVisible.value = false;
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
<style scoped>
.dialog-content {
	text-align: center;
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 10px;
}
</style>
