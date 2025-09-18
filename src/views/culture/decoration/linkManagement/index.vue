<template>
	<div class="layout-padding">
		<div class="layout-padding-view wrap_box">
            <div class="left">
				<el-row class="mb-3">
					<el-button icon="folder-add" type="primary" @click="linkClassDialogRef.openDialog()"> 新建分类 </el-button>
				</el-row>
                <el-tree
					id="tree-option"
					ref="selectTree"
                    :data="linkClassData"
					:props="linkClassProps"
					default-expand-all
					highlight-current
					@node-click="handleNodeClick"
				>
                <template #default="{ node, data }">
						<div class="flex align-center justify-between class_name">
							<span>{{ data.name }}</span>
							<div>
								<el-dropdown trigger="click" @command="handleCommand" class="dropdown">
								<el-link type="primary" >...</el-link>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item  @click="linkClassDialogRef.openDialog(data)">编辑分类</el-dropdown-item>
										<el-dropdown-item  @click="delLinkClass(data.code)">删除分类</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
							</div>
						</div>
                </template>
                </el-tree>
            </div>
            <div class="right">
                <el-row class="mb-3">
					<el-button icon="folder-add" type="primary" @click="linkDialogRef.openDialog()"> 新建链接 </el-button>
				</el-row>
			<el-table
				:data="state.dataList"
				row-key="id" border
				class="my-table"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" />
                <el-table-column label="ID" prop="code"  />
				<el-table-column label="链接名称" prop="name" />
				<el-table-column label="H5链接" prop="urlH5" />
				<el-table-column label="小程序链接" prop="urlApp" />
                <el-table-column label="最后操作人" prop="updateBy" />
                <el-table-column label="最后操作时间" prop="updateTime" />
				<el-table-column label="操作" width="180">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="linkDialogRef.openDialog(row)">编辑</el-button>
						<el-button type="danger" link icon="delete" @click="handleDelete(row.code)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
            </div>
			
			<link-class-form ref="linkClassDialogRef" @refresh="getClassDataList()" />
            <link-form ref="linkDialogRef" @refresh="getDataList()" />
		</div>
	</div>
</template>

<script lang="ts" name="store-label-index" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';
import { tagList, delTag } from '/@/api/goodStore/xianwang';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { linkClassDelApi, linkClassListApi, linkDelApi, linkListApi } from '/@/api/culture/devise';
// 动态引入组件
const LinkClassForm = defineAsyncComponent(() => import('./linkClassForm.vue'));
const LinkForm = defineAsyncComponent(() => import('./linkForm.vue'));
// 定义变量内容
const linkClassDialogRef = ref();
const linkDialogRef = ref();
interface GroupListItem {
	id?: any;
	tagName: string;
	sequence?: number;
}
const linkClassProps = ref({
    value: 'code', // ID字段名
	label: 'name', // 显示名称
	children: 'childList', // 子级字段名
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: linkListApi,
	queryForm: {
		cateCode: '',
	},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// 删除操作
const handleDelete = async (code: string) => {
	try {
		await useMessageBox().confirm('确定要删除链接吗？');
	} catch {
		return;
	}
	try {
		await linkDelApi(code);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const delLinkClass = async (code: string) => {
    try {
        await useMessageBox().confirm('确定要删除分类吗？');
    } catch {
        return;
    }
    try {
        await linkClassDelApi(code);
        getClassDataList();
        useMessage().success('删除成功');
    } catch (err: any) {
        useMessage().error(err.msg);
    }
}
const handleNodeClick = (data: any) => {
    // 选中节点
    console.log('选中节点', data);
	state.queryForm.cateCode = data.code;
	// 重新请求数据	
	getDataList()

};
const linkClassData = ref([]);
const getClassDataList = async()=> {
    const {data, message, code} = await linkClassListApi();
    linkClassData.value = data;
}
const handleCommand = (command: string) => { 
};
onMounted(() => {
    getClassDataList();
});
</script>
<style lang="scss" scoped>

.wrap_box {
    padding: 10px;
    display: flex;
    .left {
        width: 280px;
			height: 800px;
			overflow: auto;
		.class_name {
			width: 200px;
			padding: 10px;
		}
    }
    .right {
        flex: 1;
    }
}
</style>
