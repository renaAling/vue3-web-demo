<template>
	<div class="channel_manage">
		<div class="search">
			<el-form ref="queryRef" :inline="true" :model="queryForm" @keyup.enter="getDataList">
				<el-form-item label="栏目名称" prop="name">
					<el-input style="width: 240px" v-model="queryForm.name" placeholder="请输入栏目名称" clearable />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
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
			<el-button icon="plus" type="primary" @click="formDialogRef.openDialog()">新增栏目</el-button>
		</div>
		<el-table :data="dataList" row-key="id" border class="my-table" :border="true">
			<el-table-column label="栏目名称" prop="name" />
			<el-table-column label="状态" prop="status">
				<template #default="{ row }">
					<span>{{ row.status ? '显示中' : '隐藏中' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="350">
				<template #default="{ row }">
					<el-button type="primary" link icon="view" @click="toggleRowStatus(1, row.id)" v-if="!row.status">显示</el-button>
					<el-button type="primary" link icon="hide" @click="toggleRowStatus(0, row.id)" v-if="row.status">隐藏</el-button>
					<el-button type="primary" link icon="top" @click="handelSort(1, row.id)">上移</el-button>
					<el-button type="primary" link icon="bottom" @click="handelSort(2, row.id)">下移</el-button>
					<el-button type="primary" link icon="delete" @click="handleDelete(row.id)">删除</el-button>
					<el-button type="primary" link icon="edit" @click="formDialogRef.openDialog(row.id)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="page" />
		<FormC ref="formDialogRef" @refresh="getDataList()" />
		<FormChannel ref="formChannelDialogRef" @refresh="getDataList()" />
	</div>
</template>

<script lang="ts" name="portal-channel-index" setup>
import pagination from '/@/components/Pagination/index.vue';

import { useMessage, useMessageBox } from '/@/hooks/message';
import { channelPage, delChannel, channelSequence, updateChannel } from '/@/api/portal';
// 动态引入组件
const FormC = defineAsyncComponent(() => import('./form.vue'));
const FormChannel = defineAsyncComponent(() => import('./formChannel.vue'));

// 定义变量内容
const queryRef = ref();
const formDialogRef = ref();
const formChannelDialogRef = ref();
const page = ref({
	total: 0,
	size: 10,
	current: 1,
});

const statusTypes = [
	{
		label: '显示中',
		value: 1,
	},
	{
		label: '隐藏中',
		value: 0,
	},
];

interface ChannelListItem {
	id?: any;
	name: string;
	sequence?: number;
	status: number | string;
}
const queryForm = ref<ChannelListItem>({
	name: '',
	status: '',
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	getDataList();
};

const handelSort = async (sequence: number, id: string) => {
	try {
		// type 1 上移 2 下移
		const params = { id, sequence };
		const { code } = await channelSequence(params);
		if (code === 0) {
			useMessage().success('排序成功');
			getDataList();
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const sizeChangeHandle = (val: number) => {
	page.value.size = val;
	getDataList();
};
const currentChangeHandle = (val: number) => {
	page.value.current = val;
	getDataList();
};
const dataList = ref([]);
const getDataList = async () => {
	dataList.value = [];

	const { code, data } = await channelPage({
		current: page.value.current,
		size: page.value.size,
		...queryForm.value,
	});
	if (code === 0) {
		page.value.total = data.total;
		dataList.value = data.records;
	}
};

const toggleRowStatus = async (status: number, id: string) => {
	try {
		const params = { id, status };
		const { code } = await updateChannel(params);
		if (code === 0) {
			useMessage().success('操作成功');
			getDataList();
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 删除操作
const handleDelete = async (id: string) => {
	try {
		await useMessageBox().confirm('确定要删除吗？');
	} catch {
		return;
	}

	try {
		await delChannel({ id });
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
onMounted(() => {
	getDataList();
});
</script>
<style lang="scss" scoped>
.channel_manage {
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
