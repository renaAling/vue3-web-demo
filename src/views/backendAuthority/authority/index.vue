<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item :label="$t('authon.uid')" prop="unionId">
						<el-input :placeholder="$t('authon.inputUidTip')" maxlength="50" v-model="state.queryForm.unionId" clearable />
					</el-form-item>
					<!-- <el-form-item :label="$t('authon.mobile')" prop="mobile">
						<el-input :placeholder="$t('authon.inputMobileTip')" maxlength="11" v-model="state.queryForm.mobile" />
					</el-form-item> -->
					<el-form-item :label="$t('authon.mobile')" prop="mobile">
						<el-input :placeholder="$t('authon.inputMobileTip')" maxlength="11" v-model="state.queryForm.mobile" clearable />
					</el-form-item>
					<el-form-item :label="$t('authon.name')" prop="name">
						<el-input :placeholder="$t('authon.inputNameTip')" maxlength="10" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<!-- <el-form-item :label="$t('authon.dept')" prop="dept">
						<el-cascader :placeholder="$t('authon.inputDeptTip')" v-model="state.queryForm.deptCode" :options="queryForm.deptArr" :props="deptProps" clearable />
					</el-form-item> -->
					<el-form-item :label="$t('authon.channel')" prop="channelCode">
						<el-select :placeholder="$t('authon.inputChannelTip')" v-model="state.queryForm.channelCode" clearable>
							<el-option v-for="item in queryForm.channelArr" :key="item.channelCode" :label="item.platformName" :value="item.channelCode" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<!-- <el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="toDetail()">
						{{ $t('common.addBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'sys_role_export'"
						@exportExcel="exportExcel"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row> -->
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="unionId" :label="$t('authon.uid')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" :label="$t('authon.mobile')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" :label="$t('authon.name')" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column prop="deptName" :label="$t('authon.dept')" show-overflow-tooltip></el-table-column> -->
				<el-table-column prop="subSystemNum" :label="$t('authon.channel')" show-overflow-tooltip> </el-table-column>
				<!-- <el-table-column prop="data_authority" :label="$t('authon.dept')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="dictType" :value="scope.row.dsType"></dict-tag>
					</template>
				</el-table-column> -->
				<el-table-column prop="authTime" :label="$t('authon.authTime')" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('common.action')" width="100">
					<template #default="scope">
						<el-button text type="primary" @click="toDetail(scope.row.unionId)">查看</el-button>
						<!-- <span style="margin-left: 12px">
							<el-button
								text
								type="primary"
								@click="handleDelete(scope.row.unionId)"
								>{{ $t('common.delBtn') }}
							</el-button>
						</span> -->
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
// import type { CascaderProps } from 'element-plus'
import { channelList, pageList, delAuthorty } from '/@/api/authority';
import { useRouter } from 'vue-router';
const router = useRouter();

const { t } = useI18n();
interface DeptObj {
	deptCode: string;
	deptName: string;
	childNode: any[];
}
interface ChannelObj {
	channelCode: string;
	platformName: string;
}
interface QueryForm {
	deptArr: DeptObj[];
	channelArr: ChannelObj[];
}
// 组织可选列表
const queryForm = reactive<QueryForm>({
	deptArr: [],
	channelArr: [],
});
// const deptProps:CascaderProps ={
// 	value: 'deptCode',
// 	label: 'deptName',
// 	children: 'childNode'
// }

const toDetail = (id?: string) => {
	if (id) {
		router.push({ path: '/backendAuthority/authority/form', query: { id } });
	} else {
		router.push({ path: '/backendAuthority/authority/form' });
	}
};

// const getDeptList =  async () => {
// 	const res = await deptList();
// 	queryForm.deptArr = res.data
// }
// getDeptList()
const getChannelList = async () => {
	const res = await channelList();
	queryForm.channelArr = res.data;
};
getChannelList();
// 定义变量内容
const queryRef = ref();
const showSearch = ref(true);
// 多选rows
const selectObjs = ref([]) as any;

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		unionId: '',
		mobile: '',
		name: '',
		// deptCode: '',
		channelCode: '',
	},
	pageList: pageList, // H
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/role/export', Object.assign(state.queryForm, { ids: selectObjs }), 'role.xlsx');
};

// 删除操作
const handleDelete = async (id: string) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'), t('message.box.title'));
	} catch {
		return;
	}

	try {
		await delAuthorty(id);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
