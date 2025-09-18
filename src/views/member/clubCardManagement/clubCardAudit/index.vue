<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="UID" prop="unionId">
						<el-input v-model="state.queryForm.unionId" placeholder="请输入UID" />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input v-model="state.queryForm.mobile" placeholder="请输入手机号" maxlength="11" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
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
				<el-table-column prop="unionId" label="UID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickName" label="昵称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="手机号码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mode" label="管理模式" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="备注" show-overflow-tooltip>
					<template #default="{ row }">
						<sapn>{{ row.remark ? row.remark : '——' }}</sapn>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="text" v-if="row.applyStatus === 1" @click="handleUse('agree', row)">通过</el-button>
						<el-button type="text" v-if="row.applyStatus === 1" style="color: red" @click="handleUse('disagree', row)">驳回</el-button>
						<el-button type="text" v-if="row.applyStatus === 2" style="color: #666">已撤回</el-button>
						<el-button type="text" v-if="row.auditResult && row.applyStatus === 4" style="color: #666">已通过</el-button>
						<el-button type="text" v-if="!row.auditResult && row.applyStatus === 3" style="color: #666">已驳回</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" title="审核" width="30%" draggable @closed="resetForm">
				<el-form label-width="100px" ref="ruleFormRef" v-model="form">
					<div v-html="visibleText" class="text-center mb-5"></div>
					<el-form-item label="备注" prop="type" label-width="50">
						<el-input
							v-model="form.remark"
							:autosize="{ minRows: 2, maxRows: 5 }"
							type="textarea"
							maxlength="20"
							placeholder="选填"
							show-word-limit
						/>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="resetForm">取消</el-button>
						<el-button type="primary" @click="handleSuccess"> {{ form.auditResult ? '通过' : '驳回' }} </el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberCardAuditPage, getMemberCardAudit } from '../../../../api/member/clubCard';
// import { ElMessage } from 'element-plus';
import { useMessage } from '/@/hooks/message';
// import { useRouter } from 'vue-router';
// const router = useRouter()

const queryRef = ref();
const showSearch = ref(true);
const dialogVisible = ref(false);
const form = reactive({
	id: '',
	remark: '',
	auditResult: true,
});
const visibleText = ref('');

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberCardAuditPage, // H
	// descs: [],
});

// 核销按钮
const handleUse = (type: string, row: any) => {
	console.log('row', row);
	Object.assign(form, row);
	if (type === 'agree') {
		form.auditResult = true;
		visibleText.value = '<div>确认通过该制卡申请吗？</div><div>通过后不可撤回，该卡片将进入制卡流程</div>';
	} else {
		form.auditResult = false;
		visibleText.value = '<div>确认驳回该制卡申请吗？</div>';
	}
	dialogVisible.value = true;
};

const handleSuccess = async () => {
	const params = {
		id: Number(form?.id),
		auditResult: form.auditResult,
		remark: form.remark,
	};
	console.log('params', params);
	return new Promise((resolve, reject) => {
		getMemberCardAudit(params)
			.then(() => {
				useMessage().success(`审核成功`);
				dialogVisible.value = false;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg || '审核失败');
				reject(false);
			});
	});
};
const resetForm = () => {
	Object.assign(form, {
		remark: '',
		auditResult: true,
	});
	dialogVisible.value = false;
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// const changeSearchTime = (val: any) => {
// 	if (!val) {
// 		state.queryForm.dateStart = '';
// 		state.queryForm.dateEnd = '';
// 	}
// 	getDataList();
// };

// 清空搜索条件
// const resetQuery = () => {
// 	queryRef.value.resetFields();
// 	searchTime.value = [];
// 	state.queryForm.dateStart = '';
// 	state.queryForm.dateEnd = '';
// 	getDataList();
// };
</script>
