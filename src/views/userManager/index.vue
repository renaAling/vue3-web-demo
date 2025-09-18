<template>
	<div class="layout-padding">
		<div class="layout-pd" style="background-color: #fff; padding-bottom: 0 !important">
			<div style="font-size: 20px; font-weight: 500; color: #1d2129; margin-bottom: 8px">查询</div>
			<el-row>
				<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
					<el-form-item :label="$t('userManager.uid')" prop="unionId">
						<el-input v-model="state.queryForm.unionId" maxlength="50" :placeholder="$t('userManager.inputUserId')" clearable />
					</el-form-item>
					<el-form-item :label="$t('userManager.phone')" prop="mobile">
						<el-input v-model="state.queryForm.mobile" maxlength="11" :placeholder="$t('userManager.inputPhoneTip')" clearable />
					</el-form-item>
					<el-form-item :label="$t('userManager.state')" prop="userState">
						<el-select v-model="state.queryForm.userState" :placeholder="$t('userManager.inputState')" clearable>
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
		</div>
		<div class="layout-padding-auto layout-padding-view mt-2">
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column :label="$t('userManager.uid')" prop="unionId" fixed="left" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('userManager.phone')" prop="mobile" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('userManager.createTime')" prop="createTime" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('userManager.state')" show-overflow-tooltip>
					<template #default="scope">
						<el-switch v-model="scope.row.userState" @change="changeSwitch(scope.row)" :active-value="1" :inactive-value="2"></el-switch>
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="200" fixed="right">
					<template #default="scope">
						<!-- 查看详情 -->
						<el-button text type="primary" @click="toDetails(scope.row)">
							{{ $t('userManager.detail') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle"> </pagination>
		</div>
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { pageList, freezeUser } from '/@/api/user';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const router = useRouter();
const { t } = useI18n();

const queryRef = ref();
// 筛选选择用户状态选项，1正常，2冻结
interface optionsItem {
	value: number;
	label: string;
}
const options = reactive<optionsItem[]>([
	{
		value: 1,
		label: '正常',
	},
	{
		value: 2,
		label: '冻结',
	},
]);

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		unionId: '',
		userState: '',
		mobile: '',
	},
	pageList: pageList,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

//表格内开关 (用户状态)
const changeSwitch = async (row: any) => {
	await freezeUser({ unionId: row.unionId, userState: row.userState });
	useMessage().success(t('common.optSuccessText'));
	getDataList();
};
// 跳转详情
const toDetails = (row: any) => {
	router.push({ path: '/userManager/details', query: { id: row.unionId } });
};
</script>
