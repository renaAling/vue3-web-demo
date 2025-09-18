<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="商圈">
						<el-input placeholder="请输入商圈名称" maxlength="30" v-model="state.queryForm.subwayName" clearable />
					</el-form-item>
					<el-form-item label="商家名称">
						<el-input placeholder="请输入商家名称" maxlength="30" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="用户昵称">
						<el-input placeholder="请输入用户昵称" maxlength="30" v-model="state.queryForm.nickName" clearable />
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="state.queryForm.isShow" placeholder="请选择状态">
							<el-option label="显示" :value="1"></el-option>
							<el-option label="隐藏" :value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="content" label="评论内容" show-overflow-tooltip />
				<el-table-column prop="score" label="评分" />
				<el-table-column prop="subwayName" label="关联商圈" show-overflow-tooltip />
				<el-table-column prop="name" label="商家名称" show-overflow-tooltip />
				<el-table-column prop="nickName" label="用户昵称" />
				<el-table-column prop="createTime" label="提交时间" />
				<el-table-column prop="isShow" label="状态">
					<template #default="{ row }">
						<el-switch v-model="row.isShow" :active-value="true" :inactive-value="false" @change="handleStatusChange(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleLook(row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { merchantCommentPageApi, commentUpdateShowApi } from '/@/api/note/noteInfo';
const router = useRouter();
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: merchantCommentPageApi,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleStatusChange = async (row: any) => {
	const params = { id: row.id, isShow: row.isShow };
	try {
		const { code, msg } = await commentUpdateShowApi(params);
		if (code === 0) {
			useMessage().success('修改成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		getDataList();
	}
};

// onMounted(async () => {
// 	if (Session.get('state')) {
// 		const data = JSON.parse(Session.get('state'));
// 		state.queryForm = data.queryForm;
// 		state.pagination = data.pagination;
// 		Session.remove('state');
// 	}
// 	if (stores.regionCodeList.length < 1) {
// 		await stores.getRegionCodeList();
// 	}
// });

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
// 查看
const handleLook = (row: any) => {
	router.push({
		path: '/note/consumptionMap/commentManage/expertComments/lookComments',
		query: { id: row.id },
	});
};
</script>
