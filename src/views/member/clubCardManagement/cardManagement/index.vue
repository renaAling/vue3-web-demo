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
				<el-table-column prop="cardCode" label="会员卡号" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="text" v-if="row.cardStatus === 7" @click="handleUse(row)">申领</el-button>
						<el-button type="text" v-if="row.cardStatus !== 7" style="color: #666">已申领</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" title="申领" width="30%" draggable @closed="resetForm">
				<div v-html="visibleText" class="text-center mb-5"></div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="resetForm">取消</el-button>
						<el-button type="primary" @click="handleSuccess"> 申领 </el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberCardCardPage, getMemberCardReceive } from '../../../../api/member/clubCard';
import { useMessage } from '/@/hooks/message';
const queryRef = ref();
const showSearch = ref(true);
const dialogVisible = ref(false);
const visibleText = ref('');
const cardId = ref(0);
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberCardCardPage, // H
	descs: [],
});

// 按钮
const handleUse = (row: any) => {
	visibleText.value = '<div>是否确认申领该卡？</div><div>申领后该卡状态将改为"已出库"</div>';
	console.log('row', row);
	cardId.value = Number(row.id);
	dialogVisible.value = true;
};

const handleSuccess = async () => {
	return new Promise((resolve, reject) => {
		getMemberCardReceive({ id: cardId.value })
			.then(() => {
				useMessage().success('申领成功');
				dialogVisible.value = false;
				getDataList();
				cardId.value = 0;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				reject(false);
			});
	});
};
const resetForm = () => {
	dialogVisible.value = false;
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
