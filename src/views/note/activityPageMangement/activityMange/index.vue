<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="活动名称">
						<el-input placeholder="请输入活动名称" maxlength="30" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="活动状态">
						<el-select v-model="state.queryForm.status" placeholder="请选择活动状态" clearable>
							<el-option v-for="value in activityList" :key="value.value" :label="value.label" :value="value.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="code"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="code" label="活动ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="活动名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="address" label="地点" show-overflow-tooltip></el-table-column>
				<el-table-column prop="num" label="活动人数" />
				<el-table-column prop="enrolledNum" label="已报名人数" />
				<el-table-column prop="startTime" label="时间" width="180">
					<template #default="{ row }"> {{ dayjs(row.startTime).format('YYYY-MM-DD') }}~{{ dayjs(row.endTime).format('YYYY-MM-DD') }} </template>
				</el-table-column>
				<el-table-column prop="status" label="活动状态">
					<template #default="{ row }">
						<el-tag v-if="row.status === 1">未开始</el-tag>
						<el-tag v-else-if="row.status === 2">进行中</el-tag>
						<el-tag v-else-if="row.status === 3">已结束</el-tag>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column prop="isOpen" label="状态">
					<template #default="{ row }">
						<el-switch v-model="row.isOpen" :active-value="true" :inactive-value="false" @change="handleStatusChange(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="260">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
						<el-button text type="primary" @click="handelSignUp(row)">报名统计</el-button>
						<el-button text type="primary" @click="handelStatistics(row)">活动统计</el-button>
						<el-button text type="primary" @click="handelComment(row)">活动评论</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { activityPageApi, activityUpdateStatusApi } from '/@/api/note/noteInfo';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';
import { activityList } from '../hooks';

// 引入组件
const stores = travelCommunalData();
const router = useRouter();
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: activityPageApi,
});

const handleStatusChange = async (row: any) => {
	const params = { code: row.code, isOpen: row.isOpen };
	try {
		const { code, msg } = await activityUpdateStatusApi(params);
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

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

onMounted(async () => {
	console.log('mounted', Session.get('state'));
	if (Session.get('state')) {
		const data = JSON.parse(Session.get('state'));
		state.queryForm = data.queryForm;
		state.pagination = data.pagination;
		getDataList(false);
		Session.remove('state');
	}
	if (stores.regionCodeList.length < 1) {
		await stores.getRegionCodeList();
	}
});
// 新增
const handleAdd = () => {
	router.push({ path: '/note/activityPageMangement/activityMange/createActivity/index' });
};
// 编辑
const handleEdit = (row: any) => {
	if (row.isOpen) {
		useMessage().error('活动状态为已开启，不能修改');
		return;
	} else {
		Session.set('state', JSON.stringify(state));
		router.push({ path: '/note/activityPageMangement/activityMange/createActivity/index', query: { code: row.code } });
	}
};
// 报名统计
const handelSignUp = (row: any) => {
	Session.set('state', JSON.stringify(state));
	router.push({ path: '/note/activityPageMangement/activityMange/signUpList/index', query: { code: row.code } });
};
// 活动统计
const handelStatistics = (row: any) => {
	Session.set('state', JSON.stringify(state));
	router.push({
		path: '/note/activityPageMangement/activityMange/statisticsList/index',
		query: { code: row.code },
	});
};
// 活动评论
const handelComment = (row: any) => {
	router.push({
		path: '/note/activityPageMangement/activityMange/commentList/index',
		query: { code: row.code },
	});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
</script>
