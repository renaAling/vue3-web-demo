<template>
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="所属机构" prop="organizationId">
							<el-cascader
								placeholder="请选择机构"
								ref="cascader"
								v-model="organizationId"
								clearable
								:props="props"
								:options="categoryList"
								style="width: 180px"
							/>
						</el-form-item>
						<el-form-item label="员工类型" prop="employeeType">
							<el-select v-model="state.queryForm.employeeType" clearable style="width: 180px" placeholder="请选择员工类型">
								<el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="姓名" prop="name">
							<el-input placeholder="请输入姓名" clearable style="width: 180px" v-model="state.queryForm.name" />
						</el-form-item>
						<el-form-item label="联系电话" prop="mobile">
							<el-input placeholder="请输入联系电话" clearable style="width: 180px" v-model="state.queryForm.mobile" />
						</el-form-item>
						<el-form-item label="状态" prop="status" placeholder="请选择状态">
							<el-select v-model="state.queryForm.status" clearable style="width: 180px">
								<el-option label="启用" value="1">启用</el-option>
								<el-option label="禁用" value="2">禁用</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
				</el-row>
				<el-row class="mb8 flex justify-between items-center">
					<div>
						<el-button type="primary" icon="plus" @click="formDialogRef.openDialog()"> 新增 </el-button>
					</div>
					<div>
						<el-button type="primary" icon="download" @click="exportExcel"> 导出表格 </el-button>
					</div>
				</el-row>
				<el-table
					:data="state.dataList"
					v-loading="state.loading"
					row-key="id"
					border
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="55" />
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="姓名" prop="name" />
					<el-table-column label="联系电话" prop="mobile" />
					<el-table-column label="工号" prop="workNumber" />
					<el-table-column label="所属机构" prop="organizationName" />
					<el-table-column label="所属部门" prop="department" />
					<el-table-column label="员工类型" prop="employeeType">
						<template #default="scope">
							<span v-if="scope.row.employeeType == 1">内部员工</span>
							<span v-if="scope.row.employeeType == 2">委外员工</span>
							<span v-if="scope.row.employeeType == 3">见习员工</span>
							<span v-if="scope.row.employeeType == 4">充值无管理费人员</span>
							<span v-if="scope.row.employeeType == 5">委外单位</span>
							<span v-if="scope.row.employeeType == 6">食堂员工</span>
							<span v-if="scope.row.employeeType == 7">其他</span>
							<span v-if="scope.row.employeeType == 8">外部员工</span>
						</template>
					</el-table-column>
					<el-table-column label="微信平台openid" prop="wechatOpenid" />
					<el-table-column label="系统ID" prop="systemId" />
					<el-table-column label="状态" prop="createTime">
						<template #default="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @click="beforeChange(scope.row)" />
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="toDetail(row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="changeType"></listDetail>
	</div>
	<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
</template>

<script lang="ts" setup name="manage-list">
import { getUserEmployee, getUserEmployeeUpdate, getUserOutOrganizationTree, getMealsCompanyTree } from '/@/api/member/staffCenter/staffCenter';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';
import { ElMessage, ElMessageBox } from 'element-plus';
import listDetail from './details.vue';

const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();

const listDetailRef = ref();
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getUserEmployee,
	queryForm: {},
	dataList: [],
});
const props = {
	checkStrictly: true,
};
const organizationId = ref<any[]>([]);
watch(
	() => organizationId.value,
	(val) => {
		console.log('val', val);
		if (val?.length > 0) {
			state.queryForm.organizationId = val[val.length - 1];
		} else {
			delete state.queryForm.organizationId;
			// state.queryForm.organizationId = '';
		}
		getDataList();
	}
);
const changeType = () => {
	type.value = 'list';
	getDataList();
};
const typeList = ref([
	{
		label: '内部员工',
		value: 1,
	},
	{
		label: '委外员工',
		value: 2,
	},
	{
		label: '见习员工',
		value: 3,
	},
	{
		label: '充值无管理费人员',
		value: 4,
	},
	{
		label: '委外单位',
		value: 5,
	},
	{
		label: '食堂员工',
		value: 6,
	},
	{
		label: '其他',
		value: 7,
	},
	{
		label: '外部员工',
		value: 8,
	},
]);
let type = ref('list');
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle, downBlobFile } = useTable(state);

const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
	multipleSelection.value = val;
};
const categoryList = ref<any[]>([]);
const organizationList = ref<any[]>([]);
const companyList = ref<any[]>([]);
onMounted(async () => {
	await getCategoryList();
	await getCompanyList();
	console.log('organizationList', organizationList.value);
	console.log('companyList', companyList.value);
	categoryList.value = [...organizationList.value, ...companyList.value];
	// categoryList.value = organizationList.value;
	localStorage.setItem('queryForm', JSON.stringify({}));
});
// 转数据
const renameNameToLabel = (node: any) => {
	console.log('node', node);
	// 创建一个新对象，将 orgName 替换为 label
	const { orgName, id, children, ...rest } = node;
	const renamedNode = { label: orgName, value: id, ...rest };
	// 如果有子节点，递归处理每个子节点
	if (children && Array.isArray(children)) {
		renamedNode.children = children.map((child) => renameNameToLabel(child));
	}

	return renamedNode;
};
// 转数据
const companyRenameNameToLabel = (node) => {
	// 创建一个新对象，将 orgName 替换为 label
	const { orgShortName, siteDtoList, id, ...rest } = node;
	const renamedNode = { label: orgShortName, children: siteDtoList, value: id, ...rest };
	// 如果有子节点，递归处理每个子节点
	if (siteDtoList && Array.isArray(siteDtoList)) {
		renamedNode.children = siteDtoList.map((child) => companyRenameNameToLabel(child));
	}
	return renamedNode;
};

const getCategoryList = async () => {
	try {
		const { code, data, msg } = await getUserOutOrganizationTree();
		if (code === 0) {
			organizationList.value = data.map((item: any) => renameNameToLabel(item));
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getCompanyList = async () => {
	try {
		const { code, data, msg } = await getMealsCompanyTree();
		if (code === 0) {
			companyList.value = data.map((item: any) => companyRenameNameToLabel(item));
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	organizationId.value = [];
	getDataList();
};

const toDetail = (row: any) => {
	localStorage.setItem('queryForm', JSON.stringify(state.queryForm));
	listDetailRef.value.show(row);
	type.value = 'detail';
};

// 下载业务报表
const exportExcel = async () => {
	downBlobFile('/uac/userEmployee/export', state.queryForm, '员工管理分页数据.xlsx');
};
const beforeChange = async (row: any) => {
	const msg = row.status == 1 ? '确定要启用该员工吗?' : '确定要禁用该员工吗?';
	try {
		await ElMessageBox.confirm(msg, '系统提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	try {
		const { code, msg } = await getUserEmployeeUpdate(row);
		if (code === 0) {
			useMessage().success('操作成功');
			getDataList();
		} else {
			useMessage().error(msg);
			if (row.status == 1) row.status = 2;
			else row.status = 1;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		if (row.status == 1) row.status = 2;
		else row.status = 1;
	}
};
</script>
<style lang="scss" scoped></style>
