<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="guid">
						<el-input placeholder="请输入" v-model="state.queryForm.guid" clearable />
					</el-form-item>
					<el-form-item label="员工姓名">
						<el-input placeholder="请输入" v-model="state.queryForm.nickName" clearable />
					</el-form-item>
					<el-form-item label="员工号">
						<el-input placeholder="请输入" v-model="state.queryForm.userJobNum" clearable />
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="请输入" v-model="state.queryForm.mobile" clearable />
					</el-form-item>
					<el-form-item label="加入黑名单时间">
						<el-date-picker
							v-model="daterangeTime"
							:clearable="false"
							@change="changeTime"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-4">
				<el-button @click="handleExport" type="primary">导出</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="guid" label="GUID" show-overflow-tooltip />
				<el-table-column prop="nickName" label="员工姓名" />
				<el-table-column prop="userJobNum" label="员工号" />
				<el-table-column prop="mobile" label="手机号" />
				<el-table-column prop="blackTime" label="加入黑名单时间" />
				<el-table-column prop="blackReason" label="加入黑名单原因" />
				<el-table-column label="操作" fixed="right" width="240">
					<template #default="{ row }">
						<el-button link type="primary" @click="handleCheck(row)">查看</el-button>
						<el-button link type="primary" @click="handleRemoveBlack(row)" v-if="row.isBlack">移出黑名单</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup name="userManage">
import { ElMessage, ElMessageBox } from 'element-plus';
import { downBlobFile } from '/@/utils/other';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { appEmployeePageApi, appEmployeeUpdateApi } from '/@/api/sportsVenue/index';

const router = useRouter();
// 搜索变量
const daterangeTime = ref();
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: appEmployeePageApi,
	queryForm: {
		isBlack: true,
	},
	dataList: [],
});

const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleExport = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/stadium/app/employee/blackExport', params, '黑名单列表.xlsx');
};

const handleCheck = async (row: any) => {
	router.push({ path: '/sportsVenue/userManage/detail', query: { userId: row.userId } });
};

const handleRemoveBlack = async (row: any) => {
	ElMessageBox.confirm('确认移出黑名单吗？移出后该用户可正常使用运动场馆', '移出黑名单', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const params = {
				userId: row.userId,
				isBlack: !row.isBlack,
			};
			const res = await appEmployeeUpdateApi(params);
			if (res?.ok) {
				getDataList();
			} else {
				ElMessage.error(res?.msg || '操作失败');
			}
		})
		.catch(() => {
			ElMessage.error('操作失败');
		});
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	daterangeTime.value = [];
	state.queryForm = {};
	state.queryForm.isBlack = true;
	getDataList();
};
</script>

<style scoped lang="scss"></style>
