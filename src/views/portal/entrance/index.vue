<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="flex justify-between items-center mb-3">
				<div>
					<el-form ref="queryRef" :inline="true" :model="queryForm" @keyup.enter="getDataList">
						<el-form-item label="系统名称" prop="name">
							<el-input v-model="queryForm.name" placeholder="请输入系统名称查找" clearable />
						</el-form-item>
						<el-form-item>
							<el-button icon="Search" type="primary" @click="getDataList">查询</el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div>
					<el-button icon="folder-add" type="primary" @click="entranceDialogRef.openDialog()"> 新增 </el-button>
				</div>
			</div>
			<splitpanes>
				<pane class="ml8">
					<el-table :data="dataList" row-key="id" border class="my-table" >
						<el-table-column label="序号" type="index" width="60" />
						<el-table-column label="系统名称" prop="name" />
						<el-table-column label="链接" prop="jumpLink" />
						<el-table-column label="状态" prop="isEnabled">
							<template #default="{ row }">
								<el-switch v-model="row.isEnabled" :active-value="true" :inactive-value="false"
									:before-change="() => beforeChangeStatus(row)" />
							</template>
						</el-table-column>
						<!-- <el-table-column label="排序" prop="sequence" /> -->
						<el-table-column label="操作" width="280">
							<template #default="{ row }">
								<el-button type="primary" link icon="top" @click="handelSort(1, row.id)">上移</el-button>
								<el-button type="primary" link icon="bottom"
									@click="handelSort(2, row.id)">下移</el-button>
								<el-button type="primary" link icon="delete" @click="handleDelete(row)">删除</el-button>
								<el-button type="primary" link icon="edit"
									@click="entranceDialogRef.openDialog(row.id)">编辑</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="page" />
				</pane>
			</splitpanes>
			<entrance-form ref="entranceDialogRef" @refresh="getDataList()" />
		</div>
	</div>
</template>

<script lang="ts" name="portal-entrance-index" setup>
import Sortable from 'sortablejs';
import pagination from '/@/components/Pagination/index.vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { delEntrance, enabledEntrance, entranceList, entranceSequence, groupList } from '/@/api/portal';
// 动态引入组件
const EntranceForm = defineAsyncComponent(() => import('./form.vue'));

// 定义变量内容
const entranceDialogRef = ref();
const queryRef = ref();
const page = ref({
	total: 0,
	size: 10,
	current: 1,
});
interface GroupListItem {
	id?: any;
	name: string;
	sequence?: number;
}
const queryForm = ref<GroupListItem>({
	name: '',
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
	getDataList();
};
const beforeChangeStatus = async (row: any) => {
	const { id, isEnabled } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${!isEnabled ? '启用' : '禁用'}`, `${!isEnabled ? '启用' : '禁用'}`)
				.then(async () => {
					try {
						const { code, msg } = await enabledEntrance({ id, isEnabled: !isEnabled });
						if (code === 0) {
							useMessage().success(`${!isEnabled ? '启用' : '禁用'}成功`);
							getDataList();
							return resolve(true);
						} else {
							useMessage().error(msg);
						}
					} catch (err: any) {
						useMessage().error(err.msg);
					}
				})
				.catch(() => {
					resolve(false);
				});
		} catch (err) {
			reject(false);
		}
	});
};
const dataList = ref([]);
const getDataList = async () => {
	dataList.value = [];
	const { code, data } = await entranceList({ name: queryForm.value.name, ...page.value });
	if (code === 0) {
		dataList.value = data.records;
		page.value.total = data.total;
	}
};
const handelSort = async (sequence: number, id: string) => {
	// type1 上移 2 下移
	const params = {id, sequence}
	const { code } = await entranceSequence(params);
	if (code === 0) {
		useMessage().success('排序成功');
		getDataList();
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
		await delEntrance(ids);
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