<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="name" label="业务类型" />
				<el-table-column prop="createTime" label="创建时间" />
				<el-table-column prop="updateTime" label="最近修改时间" />
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 富文本弹窗 -->
		<el-dialog v-model="dialogVisible" title="编辑" width="900">
			<el-form :model="formData" :rules="formDataRules" ref="formDataRef">
				<el-form-item label="描述" prop="desc">
					<editor v-model:get-html="formData.desc" height="500" width="100%" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitForm">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup name="pageManage">
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { bizConfigPageApi, bizConfigUpdateApi, bizConfigInfoApi } from '/@/api/cooperation/collection';

const dialogVisible = ref(false);
const formDataRef = ref();
const formData = ref({
	code: null,
	desc: '',
});
const formDataRules = reactive({
	desc: [{ required: true, message: '请输入', trigger: 'blur' }],
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: bizConfigPageApi,
	queryForm: {},
	dataList: [],
});

const handleEdit = async (row: any) => {
	dialogVisible.value = true;
	const res = await bizConfigInfoApi(row.code);
	formData.value = { ...res?.data };
};

const submitForm = async () => {
	try {
		const res = await bizConfigUpdateApi(formData.value);
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
		dialogVisible.value = false;
	}
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>

<style scoped lang="scss"></style>
