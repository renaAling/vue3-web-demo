<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="flex justify-between items-center mb-3">
				<div>
					<el-button icon="folder-add" type="primary" @click="formDialogRef.openDialog()"> 新增 </el-button>
				</div>
			</div>
			<splitpanes>
				<pane class="ml8">
					<el-table :data="dataList" row-key="id" border class="my-table" 
					:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						<el-table-column label="序号" type="index" width="60" />
						<el-table-column label="频道名称" prop="name" />
						<el-table-column label="栏目名称" prop="channelName" />
						<el-table-column label="操作" width="380">
							<template #default="{ row }">
								<el-button type="primary" link icon="plus" v-if="!row.parentId" @click="formChannelDialogRef.openDialog()">新增栏目</el-button>
								<el-button type="primary" link icon="edit" v-else @click="handleClick(row)">编辑栏目</el-button>
								<el-button type="primary" link icon="top" @click="handelSort(1, row.id)">上移</el-button>
								<el-button type="primary" link icon="bottom" @click="handelSort(2, row.id)">下移</el-button>
								<el-button type="primary" link icon="delete" @click="handleDelete(row.id)">删除</el-button>
								<el-button type="primary" link icon="edit" @click="formDialogRef.openDialog(row.id)">编辑</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="page" />
				</pane>
			</splitpanes>
			<FormC ref="formDialogRef" @refresh="getDataList()" />
			<FormChannel ref="formChannelDialogRef" @refresh="getDataList()" />
		</div>
	</div>
</template>

<script lang="ts" name="portal-channel-index" setup>
import Sortable from 'sortablejs';
import pagination from '/@/components/Pagination/index.vue';

import { useMessage, useMessageBox } from '/@/hooks/message';
import { channelPage, delChannel, channelSequence } from '/@/api/portal';
// 动态引入组件
const FormC = defineAsyncComponent(() => import('./form.vue'));
const FormChannel = defineAsyncComponent(() => import('./formChannel.vue'));

// 定义变量内容
const formDialogRef = ref();
const formChannelDialogRef = ref();
const page = ref({
	total: 0,
	size: 10,
	current: 1,
});
const handelSort = async(sequence: number, id: string)=> {
	// type 1 上移 2 下移
	const params = {id, sequence}
	const { code } = await channelSequence(params);
	if (code === 0) {
		useMessage().success('排序成功');
		getDataList();
	}

}
const sizeChangeHandle = (val: number)=> {
	page.value.size = val;
	getDataList();
}
const currentChangeHandle = (val: number)=> {
	page.value.current = val;
	getDataList();

}
const dataList = ref<{ id?: string; name: string; children?: any[] }[]>([]);
const getDataList = async () => {
	dataList.value = [];
	const { code, data } = await channelPage({...page.value});
	if (code === 0) {
		page.value.total = data.total;
		dataList.value = data.records.map((item: any) => {
			return {
				...item,
				children: (item.children || []).map((child: any) => {
					return {
						...child,
						channelName: child.name,
					};
				}),
			};
		});
	}
};
const handleClick = (row : any)=> {
	
    let parent = null;
    // 寻找父级项，这里我们使用递归查找的方法，你也可以根据实际情况优化这个方法
    const findParent = (data: any[], id: string) => {
      for (let item of data) {
        if (item.children) {
          const found = item.children.find((child:any) => child.id === id);
          if (found) {
            parent = item; // 找到父级项，赋值给parent变量
            return true; // 找到父级，停止查找
          } else if (findParent(item.children, id)) { // 递归查找子项中的子项
            return true; // 如果找到，则停止查找并返回true
          }
        }
      }
      return false; // 未找到父级项，返回false
    };
    findParent(dataList.value, row.id); // 从顶层数据开始查找父级项
    console.log(parent); // 输出找到的父级项，或者为null如果没有找到（理论上不应该发生）
	formChannelDialogRef.value.openDialog(row, parent);
  };
// 删除操作
const handleDelete = async (id: string) => {
	try {
		await useMessageBox().confirm('确定要删除吗？');
	} catch {
		return;
	}

	try {
		await delChannel({id});
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
</style>
