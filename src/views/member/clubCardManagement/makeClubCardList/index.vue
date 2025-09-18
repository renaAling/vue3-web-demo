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
				<el-table-column prop="unionId" label="UID" show-overflow-tooltip width="240"></el-table-column>
				<el-table-column prop="nickName" label="昵称" show-overflow-tooltip width="140"></el-table-column>
				<el-table-column prop="mobile" label="手机号码" show-overflow-tooltip width="140"></el-table-column>
				<el-table-column prop="mode" label="管理模式" show-overflow-tooltip width="200"></el-table-column>
				<el-table-column label="当前状态">
					<template #default="{ row }">
						<!-- row.currentStatus -->
						<div class="horizontal-timeline">
							<el-steps :active="row.cardStatus - 1" align-center>
								<el-step title="卡号段规划"> </el-step>
								<el-step title="卡号段领用" />
								<el-step title="制卡中" />
								<el-step title="制卡完成" />
								<el-step title="运输中" />
								<el-step title="待入库" />
							</el-steps>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="140">
					<template #default="{ row, $index }">
						<el-button type="text" v-if="row.cardStatus < 6" @click="handleUpdate(row, $index)">更新状态</el-button>
						<el-button type="text" v-if="row.cardStatus === 6" @click="handleSave(row)">入库</el-button>
						<el-button type="text" v-if="row.cardStatus > 6" style="color: #666">已入库</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" title="入库" width="25%" draggable @closed="resetForm">
				<el-form label-width="100px" ref="ruleFormRef" v-model="form">
					<div v-html="visibleText" class="text-center mb-5"></div>
					<el-form-item label="卡号" prop="cardCode" label-width="50">
						<el-input v-model="form.cardCode" placeholder="请输入卡号" show-word-limit />
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="resetForm">取消</el-button>
						<el-button type="primary" @click="handleSuccess"> 入库 </el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberCardProgressPage, getMemberCardGet, getMemberCardInbound } from '../../../../api/member/clubCard';
import { useMessage } from '/@/hooks/message';
const queryRef = ref();
const showSearch = ref(true);
const dialogVisible = ref(false);
const form = reactive({
	cardCode: '',
	id: 0,
});
const visibleText = ref('');
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberCardProgressPage, // H
	descs: [],
});

// 核销按钮
const handleSave = (row: any) => {
	console.log('入库row', row);
	form.id = Number(row.id);
	visibleText.value = '<div>请输入该卡卡号，输入后确认入库？</div>';
	dialogVisible.value = true;
};

const handleSuccess = async () => {
	if (!form.cardCode) {
		useMessage().error('请输入该卡卡号');
		return;
	}

	console.log('form', form);
	try {
		const { code, msg } = await getMemberCardInbound(form);
		if (code === 0) {
			useMessage().success('入库成功');
			getDataList();
			dialogVisible.value = false;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
//
const handleUpdate = async (row: any, index: number) => {
	console.log('row', row);
	try {
		// const { code, data } = await getMemberCardUpdateStatus({ id: Number(row.id) });
		// 更新状态
		const { code, data } = await getMemberCardGet(Number(row.id));
		if (code === 0) {
			console.log('data', data);
			console.log('index', index);
			if(state.dataList){
				state.dataList[index].cardStatus = data.cardStatus;
			}
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const resetForm = () => {
	Object.assign(form, {
		cardCode: '',
		id: 0,
	});
	dialogVisible.value = false;
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style scoped>
.horizontal-timeline :deep(.el-step .el-step__icon) {
	height: 12px;
	width: 12px;
}
.horizontal-timeline :deep(.el-step .el-step__icon-inner) {
	display: none;
}
.horizontal-timeline :deep(.el-step.is-horizontal .el-step__line) {
	top: 9px;
}
.horizontal-timeline :deep(.el-step__title) {
	line-height: 21px;
	font-size: 12px;
}
.horizontal-timeline :deep(.el-step__head.is-finish),
:deep(.el-step.is-center .el-step__head) {
	height: 16px;
}
.horizontal-timeline :deep(.el-step__head.is-finish .el-step__icon) {
	background: var(--el-color-primary);
	border: 0px;
}
.horizontal-timeline :deep(.el-step__head.is-finish .el-step__line) {
	background: var(--el-color-primary);
}
.horizontal-timeline :deep(.el-step__head.is-process .el-step__icon) {
	background: var(--el-color-primary);
	border: 0px;
}
.horizontal-timeline :deep(.el-step__head.is-wait .el-step__icon) {
	background: var(--el-text-color-placeholder);
	border: 0px;
}

.horizontal-timeline :deep(.is-process) {
	color: var(--el-color-primary);
	border-color: var(--el-color-primary);
	font-weight: 500;
}

.horizontal-timeline :deep(.is-wait) {
	color: var(--el-text-color-placeholder);
	border-color: var(--el-text-color-placeholder);
}
</style>
