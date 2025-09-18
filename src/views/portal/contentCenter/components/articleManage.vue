<template>
	<div class="article_manage">
		<div class="search">
			<el-form ref="queryRef" :inline="true" :model="queryForm" @keyup.enter="getDataList">
				<el-form-item label="文章名称" prop="name">
					<el-input style="width: 240px" v-model="queryForm.name" placeholder="请输入文章名称" clearable />
				</el-form-item>
				<el-form-item label="所属栏目" prop="columnId">
					<el-select v-model="queryForm.columnId" placeholder="请选择所属栏目" clearable>
						<el-option v-for="item in channdelList" :label="item.name" :value="item.id" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发布状态" prop="status">
					<el-select v-model="queryForm.status" placeholder="请选择发布状态" clearable>
						<el-option v-for="item in statusTypes" :label="item.label" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button icon="Search" type="primary" @click="getDataList">查询</el-button>
					<el-button icon="Refresh" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="mb-3">
			<el-button icon="plus" type="primary" @click="toEdit()">新增文章</el-button>
		</div>
		<el-table :data="dataList" row-key="id" border class="my-table" >
			<el-table-column label="序号" type="index" width="60" />
			<el-table-column label="文章名称" prop="name" />
			<el-table-column label="所属栏目" prop="columnName" />
			<el-table-column label="发布状态" prop="status">
				<template #default="{ row }">
					<span v-if="row.status">已发布</span>
					<span v-else>未发布</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="360">
				<template #default="{ row }">
					<el-button type="primary" link icon="video-play" v-if="!row.status" @click="handleRelease(row)">发布</el-button>
					<el-button type="primary" link icon="video-pause" v-if="row.status" @click="handleRelease(row)">下架</el-button>
					<el-button type="primary" link icon="top" @click="handelSort(1, row.id)">上移</el-button>
					<el-button type="primary" link icon="bottom" @click="handelSort(2, row.id)">下移</el-button>
					<el-button type="primary" link icon="delete" @click="handleDelete(row)">删除</el-button>
					<el-button type="primary" link icon="edit" @click="toEdit(row.id)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="page" />
	</div>
</template>

<script lang="ts" name="portal-conatain-index" setup>
import pagination from '/@/components/Pagination/index.vue';

import { useMessage, useMessageBox } from '/@/hooks/message';
import { delContent, contentPage, contentSequence, updateArticleStatus, searchParamsAllChannel } from '/@/api/portal';
import router from '/@/router';
import { status } from 'nprogress';
// 定义变量内容
const queryRef = ref();
const page = ref({
	total: 0,
	size: 10,
	current: 1,
});

const statusTypes = [
	{
		label: '已发布',
		value: 1,
	},
	{
		label: '未发布',
		value: 0,
	},
];

const loading = ref(false);
const channdelList = ref<{ name: string; id: number | string }[]>([]);
interface ChannelListItem {
	id?: any;
	name: string;
	columnId: string;
	status: number | string;
	sequence?: number;
}
const queryForm = ref<ChannelListItem>({
	name: '',
	status: '',
	columnId: '',
});
const sizeChangeHandle = (val: number) => {
	page.value.size = val;
	getDataList();
};
const currentChangeHandle = (val: number) => {
	page.value.current = val;
	getDataList();
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	clickIndex.value = 0;
	getDataList();
};
const handelSort = async (sequence: number, id: string) => {
	// type 1 上移 2 下移
	const params = { id, sequence };
	const { code } = await contentSequence(params);
	if (code === 0) {
		useMessage().success('排序成功');
		getDataList();
	}
};
const toEdit = (id?: string) => {
	router.push({
		path: '/portal/contentCenter/edit',
		query: { id },
	});
};
const handleRelease = async (row: any) => {
	try {
		await useMessageBox().confirm(`确定要${!row.status ? '发布' : '取消发布'}吗？`);
	} catch {
		return;
	}
	const params = {
		id: row.id,
		status: row.status ? 0 : 1,
	};
	const { code, msg } = await updateArticleStatus(params);
	if (code === 0) {
		useMessage().success(`${!row.status ? '发布' : '取消发布'}成功`);
		getDataList();
	} else {
		useMessage().error(msg);
	}
};

const clickIndex = ref(0);
const dataList = ref([]);
const getDataList = async (filter: boolean = false) => {
	dataList.value = [];
	const params = {
		current: page.value.current,
		size: page.value.size,
		...queryForm.value,
	};
	const { code, data } = await contentPage(params);
	if (code === 0) {
		page.value.total = data.total;
		dataList.value = data.records;
	}
};
// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm('确定要删除吗？');
	} catch {
		return;
	}

	try {
		await delContent(ids);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getChannelList = async () => {
	const { code, data } = await searchParamsAllChannel();
	if (code === 0) {
		channdelList.value = data;
		// channdelList.value = data.map((item: any) => {
		// 	return {
		// 		label: item.channelName,
		// 		value: item.channelId,
		// 		children:
		// 			item.children &&
		// 			item.children.map((item: any) => {
		// 				return {
		// 					label: item.columnName,
		// 					value: item.columnId,
		// 				};
		// 			}),
		// };
		// });
		console.log('channdelList', channdelList.value);
	}
};
onMounted(() => {
	getDataList();
	getChannelList();
});
</script>
<style lang="scss" scoped>
.article_manage {
	.search {
	}
	.group_box {
		.group_title {
			text-align: center;
			height: 44px;
			line-height: 44px;
			border-bottom: 1px solid #eee;
			font-size: 18px;
		}

		.item {
			width: 100%;
			padding: 10px 0;
			text-align: center;
			cursor: pointer;

			&:first-child {
				margin-top: 10px;
			}

			&.active {
				color: #4785ea;
				font-size: 20px;
				border-left: 4px solid;
			}
		}
	}
}
</style>
