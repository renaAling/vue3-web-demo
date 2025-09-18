<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
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
					<el-form-item label="状态">
						<el-select v-model="state.queryForm.isBlack" placeholder="请选择" clearable>
							<el-option label="正常" :value="false"></el-option>
							<el-option label="已加入黑名单" :value="true"></el-option>
						</el-select>
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
				<el-table-column prop="createTime" label="创建时间" />
				<el-table-column prop="orderNum" label="总预定次数" />
				<el-table-column prop="isBlack" label="状态">
					<template #default="{ row }">
						<el-tag v-if="row.isBlack">已加入黑名单</el-tag>
						<el-tag v-else>正常</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" width="150">
					<template #default="{ row }">
						<el-button link type="primary" @click="handleCheck(row)">查看</el-button>
						<el-button link type="primary" @click="handleAddBlack(row)" v-if="!row.isBlack">加入黑名单</el-button>
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
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: appEmployeePageApi,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleExport = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/stadium/app/employee/export', params, '用户列表.xlsx');
};

const handleCheck = async (row: any) => {
	router.push({ path: '/sportsVenue/userManage/detail', query: { userId: row.userId } });
};

const handleAddBlack = async (row: any) => {
	ElMessageBox.prompt('加入之后，该用户不可预订运动场馆，请谨慎操作', '加入黑名单', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		inputPattern: /^.+$/,
		inputPlaceholder: '请输入加入黑名单原因，20字以内',
		inputErrorMessage: '请输入',
	})
		.then(async ({ value }) => {
			const params = {
				userId: row.userId,
				isBlack: !row.isBlack,
				blackReason: value,
			};
			const res = await appEmployeeUpdateApi(params);
			if (res?.ok) {
				getDataList();
			} else {
				ElMessage.error(res?.msg || '操作失败');
			}
		})
		.catch(() => {});
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
	state.queryForm = {};
	getDataList();
};
</script>

<style scoped lang="scss"></style>
