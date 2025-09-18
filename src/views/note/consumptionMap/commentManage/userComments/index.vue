<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="标签名称">
						<el-input placeholder="请输入标签名称" maxlength="30" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="标签分类">
						<el-select v-model="state.queryForm.categories" placeholder="请选择标签分类" clearable>
							<el-option v-for="value in tagList" :key="value.value" :label="value.label" :value="value.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="state.queryForm.status" placeholder="请选择状态">
							<el-option label="启用" :value="1"></el-option>
							<el-option label="禁用" :value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button type="primary" @click="formDialogRef.openDialog()">新增</el-button>
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
				<el-table-column prop="name" label="标签名称" show-overflow-tooltip />
				<el-table-column prop="category" label="标签分类">
          <template #default="{ row }">
            <span v-if="row.category == 1">服务</span>
            <span v-else-if="row.category == 2">环境</span>
            <span v-else-if="row.category == 3">性价比</span>
            <span v-else-if="row.category == 4">其他</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
				<el-table-column prop="sort" label="排序权重" />
				<el-table-column prop="status" label="状态">
					<template #default="{ row }">
						<el-switch v-model="row.status" :active-value="true" :inactive-value="false" @change="handleStatusChange(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button text type="primary" @click="formDialogRef.openDialog(row)">编辑</el-button>
						<el-button text type="primary" @click="handleSort(row)">排序</el-button>
						<el-button text type="danger" @click="handelDel(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>

		<!-- 排序弹窗 -->
		<el-dialog v-model="serialDialogVisible" title="提示" width="400">
			<el-form :model="serialForm" :rules="serialFormRules" ref="serialFormRef">
				<el-form-item label="排序权重" prop="sort">
					<el-input-number v-model.trim="serialForm.sort" placeholder="请输入" :min="0" :step="1" :max="9999" step-strictly />
				</el-form-item>
			</el-form>
			<template #footer>
				<div>
					<el-button @click="serialDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="submitSort">确认</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { userCommentPageApi, userCommentDelApi, userCommentUpdateStatusApi, userCommentUpdateApi } from '/@/api/note/noteInfo';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { tagList } from '../hook/index';
// 引入组件
const formDialog = defineAsyncComponent(() => import('./dialog.vue'));
const formDialogRef = ref();
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: userCommentPageApi,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleStatusChange = async (row: any) => {
	const params = { id: row.id, status: row.status };
	try {
		const { code, msg } = await userCommentUpdateStatusApi(params);
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

const serialDialogVisible = ref(false);
const serialFormRef = ref();
const serialForm = reactive({
	id: null,
	sort: 0,
});
const serialFormRules = reactive({
	sort: [{ required: true, message: '请输入', trigger: 'blur' }],
});
const handleSort = (row: any) => {
	serialForm.id = row.id;
	serialForm.sort = row.sort;
	serialDialogVisible.value = true;
};
const submitSort = async () => {
	try {
		const res = await userCommentUpdateApi(serialForm);
		if (res?.ok) {
			useMessage().success('操作成功');
			getDataList();
		} else {
			useMessage().error(res?.msg || '操作失败');
		}
	} catch (err: any) {
		const errorMsg = err?.msg || '操作失败';
		useMessage().error(errorMsg);
	} finally {
		serialDialogVisible.value = false;
	}
};

// 删除
const handleDelApi = async (id: string) => {
	try {
		const { code, msg } = await userCommentDelApi(id);
		if (code === 0) {
			getDataList();
			useMessage().success('删除成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const handelDel = async (row: any) => {
	ElMessageBox.confirm('此操作将永久删除？', '系统提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await handleDelApi(row.id);
		})
		.catch(() => {
			return;
		});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
</script>
