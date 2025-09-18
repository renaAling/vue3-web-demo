<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="所属分组">
						<el-input placeholder="请输入所属分组" v-model="groupName" clearable disabled />
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
					<el-button type="primary" icon="Plus" class="mr10" @click="handleExport">导出</el-button>
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
				<el-table-column label="用户ID" prop="unionId" show-overflow-tooltip />
				<el-table-column label="用户昵称" prop="nickName" />
				<el-table-column label="手机号" prop="mobile" />
				<el-table-column label="所属分组" prop="groupName" show-overflow-tooltip />
				<el-table-column label="操作" width="100">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog title="修改用户分组" v-model="dialogVisible" ref="dialogVisibleRef">
			<el-form :model="formData" :rules="rules" ref="formDataRef" label-width="120px">
				<el-form-item label="所属分组" prop="groupCodes">
					<el-select v-model="formData.groupCodes" multiple filterable placeholder="请选择">
						<el-option v-for="item in userGroupList" :key="item.code" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitAdd">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="userGroupList">
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getUserInfoPage, getUserGroupListApi, getUserGroupInfosDetail, saveOrUpdateUserGroupInfos } from '/@/api/culture/userManage';

const route = useRoute();
const router = useRouter();
const dialogVisible = ref(false);
const dialogVisibleRef = ref<any>();

const handleEdit = async (row: any) => {
	await getUserLabelList();
	const res = await getUserGroupInfosDetail(row.unionId);
	formData.value = { ...row, groupCodes: res.data.map((item: any) => item.groupCode) || [] };
	dialogVisible.value = true;
};
const handleExport = () => {
	downBlobFile('/tracomps-admin/api/admin/userGroupInfo/export', { ...state.queryForm }, '标签用户列表.xlsx');
};

// 搜索变量
const queryRef = ref();
const formDataRef = ref<any>();
const formData = ref({
	groupCodes: '',
});
const rules = reactive({
	groupCodes: [{ required: true, message: '请选择分组', trigger: 'change' }],
});
const submitAdd = async () => {
	formDataRef?.value?.validate(async (valid: any) => {
		if (valid) {
			const res = await saveOrUpdateUserGroupInfos(formData.value);
			if (res?.ok) {
				useMessage().success('操作成功');
				dialogVisible.value = false;
				getDataList();
			} else {
				useMessage().success('操作成功');
			}
		}
	});
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getUserInfoPage,
	queryForm: {
		groupCode: route.query.code,
	},
	dataList: [],
});

const userGroupList = ref();
const groupName = ref(route.query.name);
const getUserLabelList = async () => {
	const res = await getUserGroupListApi({});
	userGroupList.value = res.data || [];
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.unionId = '';
	state.queryForm.groupName = route.query.name;
	getDataList();
};
</script>
