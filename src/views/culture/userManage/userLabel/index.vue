<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="标签管理" name="first">
					<el-row class="ml10">
						<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
							<el-form-item label="标签名称">
								<el-input placeholder="请输入标签名称" v-model="state.queryForm.name" clearable />
							</el-form-item>
							<el-form-item label="创建时间">
								<el-date-picker
									v-model="daterangeTime"
									@change="changeTime"
									type="daterange"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="YYYY-MM-DD"
								/>
							</el-form-item>
							<el-form-item>
								<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
								<el-button @click="resetQuery" icon="Refresh">重置</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<div class="mb8">
							<el-button type="primary" icon="Plus" class="mr10" @click="handleAdd">新增</el-button>
						</div>
					</el-row>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column label="序号" type="index" width="60" align="center" />
						<el-table-column label="标签名称" prop="name" />
						<el-table-column label="标签说明" prop="description" show-overflow-tooltip />
						<el-table-column label="用户数" prop="userCount" />
						<el-table-column label="创建时间" prop="createTime" />
						<el-table-column label="操作">
							<template #default="{ row }">
								<el-button type="primary" link @click="handleTagsEdit(row)">编辑</el-button>
								<el-button type="primary" link @click="handleDel(row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
				<el-tab-pane label="标签用户列表" name="second">
					<el-row class="ml10">
						<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item label="标签名称">
								<el-input placeholder="请输入用户名" v-model="state.queryForm.labelName" clearable />
							</el-form-item>
							<el-form-item label="用户ID">
								<el-input placeholder="请输入用户ID" v-model="state.queryForm.unionId" clearable />
							</el-form-item>
							<el-form-item>
								<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
								<el-button @click="resetQuery" icon="Refresh">重置</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<div class="mb8">
							<el-button type="primary" class="mr10" @click="handleExport">导出</el-button>
							<el-button @click="excelUploadRef.show()">批量更新用户标签</el-button>
						</div>
					</el-row>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column label="序号" type="index" width="60" align="center" />
						<el-table-column label="用户ID" prop="unionId" />
						<el-table-column label="用户昵称" prop="nickName" show-overflow-tooltip />
						<el-table-column label="手机号" prop="mobile" />
						<el-table-column label="用户标签" prop="labelName" />
						<el-table-column label="操作">
							<template #default="{ row }">
								<el-button type="primary" link @click="handleUserTagsEdit(row)">编辑</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
			</el-tabs>
		</div>
		<el-dialog title="新增/编辑" v-model="tagsDialogVisible" ref="dialogVisibleRef">
			<el-form :model="formData" :rules="rules" ref="tagsDataRef">
				<el-form-item label="标签名称" prop="name">
					<el-input v-model="formData.name" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="标签说明" prop="description">
					<el-input type="textarea" v-model="formData.description" placeholder="请输入" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="tagsDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitAdd" :loading="loading">确定</el-button>
			</template>
		</el-dialog>
		<el-dialog title="编辑" v-model="userTagsDialogVisible" ref="dialogVisibleRef">
			<el-form :model="formTagsUser" :rules="tagsUserRules" ref="formDataRef">
				<el-form-item label="用户ID">{{ formTagsUser?.unionId || '-' }}</el-form-item>
				<el-form-item label="用户昵称">{{ formTagsUser?.nickName || '-' }}</el-form-item>
				<el-form-item label="联系电话">{{ formTagsUser?.mobile || '-' }}</el-form-item>
				<el-form-item label="会员标签" prop="labelCodes">
					<el-select v-model="formTagsUser.labelCodes" multiple filterable placeholder="请选择">
						<el-option v-for="item in userLabelList" :key="item.code" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="userTagsDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitAddUserTags">确定</el-button>
			</template>
		</el-dialog>
		<UploadExcel
			title="批量更新用户标签"
			@refreshDataList="getUserLabelInfoPage"
			ref="excelUploadRef"
			:custom-temp-url="baseFileUrl + '/rls/b/自有商城批量上传标签模版.xlsx'"
			url="/tracomps-admin/api/admin/userLabelInfo/upload"
			:fileType="['xlsx', 'xls']"
		/>
	</div>
</template>

<script lang="ts" setup name="userLabel">
import type { TabsPaneContext } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	getUserLabelPage,
	getUserLabelInfoPage,
	deleteUserLabel,
	getUserLabelListApi,
	addUserLabel,
	editUserLabel,
	saveOrUpdateUserLabelInfos,
	getUserLabelInfosDetail,
} from '/@/api/culture/userManage';
const UploadExcel = defineAsyncComponent(() => import('../../distributor/component/UploadExcel.vue'));

// 搜索变量
const queryRef = ref();
const excelUploadRef = ref();
const baseFileUrl = import.meta.env.VITE_DOCUMENT_FILE_URL;

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getUserLabelPage,
	queryForm: {},
	dataList: [],
});

const tagsDialogVisible = ref(false);
const userTagsDialogVisible = ref(false);
const formData = ref({
	id: null,
	name: '',
	description: '',
});
const rules = reactive({
	name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
	description: [{ required: true, message: '请输入标签说明', trigger: 'blur' }],
});
const tagsDataRef = ref<any>();
const loading = ref(false);
const submitAdd = async () => {
	tagsDataRef?.value?.validate(async (valid: any) => {
		if (!valid) return;
		try {
			loading.value = true;
			const res = formData.value.id ? await editUserLabel(formData.value) : await addUserLabel(formData.value);
			if (res?.ok) {
				loading.value = false;
				tagsDialogVisible.value = false;
				useMessage().success('操作成功');
				getDataList();
			} else {
				loading.value = false;
				useMessage().error(res?.msg || '操作失败');
			}
		} catch (err: any) {
			const errorMsg = err?.msg || '操作失败';
			useMessage().error(errorMsg);
		} finally {
			loading.value = false;
		}
	});
};

const formTagsUser = ref({
	unionId: '',
	nickName: '',
	mobile: '',
	labelCodes: [],
});
const tagsUserRules = reactive({
	labelCodes: [{ required: true, message: '请选择', trigger: 'change' }],
});
const formDataRef = ref<any>();
const submitAddUserTags = async () => {
	formDataRef?.value?.validate(async (valid: any) => {
		if (!valid) return;
		try {
			const res = await saveOrUpdateUserLabelInfos(formTagsUser.value);
			if (res?.ok) {
				useMessage().success('操作成功');
				userTagsDialogVisible.value = false;
				getDataList();
			} else {
				useMessage().success('操作成功');
			}
		} catch (err: any) {
			const errorMsg = err?.msg || '操作失败';
			useMessage().error(errorMsg);
		}
	});
};

const activeName = ref('first');
const handleClick = (tab: TabsPaneContext) => {
	if (tab.props.name === 'first') {
		state.queryForm = {};
		state.pageList = getUserLabelPage;
	} else {
		state.queryForm = {};
		state.pageList = getUserLabelInfoPage;
		getUserLabelList(); // 刷新用户标签
	}
	getDataList();
};

const daterangeTime = ref();
const changeTime = (val: any) => {
	if (daterangeTime.value) {
		state.queryForm.createTimeStart = `${val[0]} 00:00:00`;
		state.queryForm.createTimeEnd = `${val[1]} 23:59:59`;
	}
};

const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};

const handleAdd = () => {
	tagsDialogVisible.value = true;
};
const handleExport = () => {
	downBlobFile('/tracomps-admin/api/admin/userLabelInfo/export', { ...state.queryForm }, '标签用户列表.xlsx');
};
const handleTagsEdit = (row: any) => {
	formData.value = { ...row };
	tagsDialogVisible.value = true;
};
const handleUserTagsEdit = async (row: any) => {
	const res = await getUserLabelInfosDetail(row.unionId);
	formTagsUser.value = { ...row, labelCodes: res.data.map((item: any) => item.labelCode) || [] };
	userTagsDialogVisible.value = true;
};
const handleDel = async (row: any) => {
	try {
		await useMessageBox().confirm('此操作将永久删除，并自动解除该分组下的所有关联');
		let res = await deleteUserLabel(row.id);
		if (!res.ok) {
			return useMessage().error(res.msg);
		}
		getDataList();
		return true;
	} catch (err: any) {
		return false;
	}
};

const userLabelList = ref();
const getUserLabelList = async () => {
	const res = await getUserLabelListApi({});
	userLabelList.value = res.data || [];
};
</script>
