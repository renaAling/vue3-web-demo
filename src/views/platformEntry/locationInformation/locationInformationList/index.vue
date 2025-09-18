<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form v-model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="场所ID" prop="code">
						<el-input placeholder="请输入场所ID" v-model="state.queryForm.code" clearable />
					</el-form-item>
					<el-form-item label="场所名称" prop="name">
						<el-input placeholder="请输入场所名称" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item v-show="active === 1" label="附近站点" prop="siteName">
						<el-input placeholder="请输入附近站点" v-model="state.queryForm.siteName" clearable />
					</el-form-item>
					<el-form-item v-show="active === 1" label="状态" prop="status">
						<el-select v-model="state.queryForm.status" default-first-option clearable>
							<el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-show="active === 2" label="审核状态" prop="auditStatus">
						<el-select v-model="state.queryForm.auditStatus" default-first-option clearable>
							<el-option v-for="(item, index) in auditStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<el-button type="primary" @click="handleOpenDialog()"> 新增场所 </el-button>
				<el-button v-if="active === 1" type="primary" @click="handleDownload()"> 导出 </el-button>
			</el-row>
			<el-tabs v-model="active" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane v-for="(item, index) in activeList" :key="index" :label="item.label" :name="item.name"> </el-tab-pane>
			</el-tabs>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" show-overflow-tooltip min-width="60"></el-table-column>
				<el-table-column prop="code" label="场所ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="场所名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="platformPlaceSiteNames" label="附近站点" show-overflow-tooltip min-width="150px">
					<template #default="{ row }">
						{{ row.platformPlaceSiteNames.join('/') }}
					</template>
				</el-table-column>
				<el-table-column label="地图图标" show-overflow-tooltip>
					<template #default="{ row }">
						<el-image style="width: 40px; height: 40px" :src="row.mapIcon" fit="fill" />
					</template>
				</el-table-column>
				<el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop="labelName" label="站点主题标签" show-overflow-tooltip min-width="150px"></el-table-column>
				<el-table-column prop="labelContent" label="站点主题内容" show-overflow-tooltip min-width="150px"></el-table-column>
				<el-table-column label="已对接数字化系统" show-overflow-tooltip min-width="150px">
					<template #default="{ row }">
						{{ row.platformPlaceSystemNames.join('/') }}
					</template>
				</el-table-column>
				<el-table-column v-if="active === 1" prop="status" label="状态" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-show="!row.status">已下架</span>
						<span v-show="row.status">上架中</span>
					</template>
				</el-table-column>
				<el-table-column v-if="active === 2" prop="auditStatus" label="审核状态" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-show="row.auditStatus === 1">已撤回</span>
						<span v-show="row.auditStatus === 2">审核中</span>
						<span v-show="row.auditStatus === 4">审核驳回</span>
					</template>
				</el-table-column>
				<el-table-column v-if="active === 2" prop="rejectReason" label="驳回原因" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" min-width="180" fixed="right">
					<template #default="{ row }">
						<el-button v-show="active === 1 && !row.status" link type="primary" @click="handleEdit(row, 'putaway')">上架</el-button>
						<el-button v-show="active === 1 && row.status" link type="danger" @click="handleEdit(row, 'soldOut')">下架</el-button>
						<el-button v-show="active === 2 && row.auditStatus === 1" link @click="handleOpenDialog(row)">编辑</el-button>
						<el-button v-show="active === 2 && row.auditStatus === 1" link type="primary" @click="handleEdit(row, 'submit')">提交审核</el-button>
						<el-button v-show="active === 2 && row.auditStatus === 4" link type="primary" @click="handleOpenDialog(row, true)">再次提交</el-button>
						<el-button v-show="active === 2 && row.auditStatus === 2" link type="danger" @click="handleEdit(row, 'revocation')">撤回</el-button>
						<el-button v-show="active === 2 && row.auditStatus === 1" link type="danger" @click="handleDel(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<form-dialog @refresh="getDataList()" ref="formDialogRef" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { postPlatformPlaceUpdate } from '/@/api/platformEntry/locationInformationList';
const router = useRouter();
import { downFileAddTask } from '/@/utils/other';
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
import { getPlatformPlaceDel, getNotPassPage, getPassPage } from '/@/api/platformEntry/locationInformationList';
const queryRef = ref();
const formDialogRef = ref() as any;
const active = ref(1); //tab切换
const statusList = ref([
	{ label: '上架中', value: 1 },
	{ label: '已下架', value: 0 },
]);
const activeList = ref([
	{
		label: '已通过',
		name: 1,
	},
	{
		label: '待审核/未通过',
		name: 2,
	},
]);
const auditStatusList = ref([
	{ label: '审核中', value: 2 },
	{ label: '已撤回', value: 1 },
	{ label: '已驳回', value: 4 },
]);
onMounted(() => {});
watch(
	() => active.value,
	(val) => {
		state.queryForm.active = val;
		getDataList();
	},
	{ deep: true }
);
const handleClick = (tab: any, event: Event) => {
	console.log(tab, event);
};

const handleOpenDialog = (row?: any, isAdd?: boolean) => {
	console.log('formDialogRef.value', formDialogRef.value);
	if (row) {
		// 编辑、再次提交
		formDialogRef.value.openDialog(row, isAdd);
	} else {
		// 新增
		formDialogRef.value.openDialog();
	}
};
const handleEdit = async (row: any, type: string) => {
	switch (type) {
		case 'revocation':
			try {
				const res = await postPlatformPlaceUpdate({
					id: Number(row.id),
					auditStatus: 1,
				});
				if (res.code === 0) {
					useMessage().success('撤回成功');
					getDataList();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'putaway':
			try {
				const res = await postPlatformPlaceUpdate({
					id: Number(row.id),
					status: 1,
				});
				if (res.code === 0) {
					useMessage().success('上架成功');
					getDataList();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'soldOut':
			try {
				const res = await postPlatformPlaceUpdate({
					id: Number(row.id),
					status: 0,
				});
				if (res.code === 0) {
					useMessage().success('下架成功');
					getDataList();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'submit':
			try {
				const res = await postPlatformPlaceUpdate({
					id: Number(row.id),
					auditStatus: 2,
				});
				if (res.code === 0) {
					useMessage().success('提交成功');
					getDataList();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
	}
};
// 删除
const handleDel = async (row: any) => {
	try {
		await useMessageBox().confirm(`是否确认删除${row.name}场所信息？`, '删除提示', '确定');
	} catch {
		return;
	}
	try {
		const res = await getPlatformPlaceDel(Number(row.id));
		if (res.code === 0) {
			useMessage().success('删除成功');
		}
		getDataList();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 清空搜索条件
const resetQuery = () => {
	console.log('state.queryForm', state.queryForm);
	queryRef.value.resetFields();
	Object.assign(state.queryForm, {
		code: '',
		name: '',
		siteName: '',
		status: '',
		auditStatus: '',
	});
	getDataList();
};

const handleDownload = async () => {
	const query = {
		...state.queryForm,
		current: state.pagination?.current,
		size: state.pagination?.size,
	};
	console.log('state.queryFormv', state.queryForm, state.pagination);
	const { code } = await downFileAddTask('/platform/platformPlace/downloadPassPage', query);
	if (code === 0) {
		try {
			await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
		} catch {
			return;
		}
		router.push('/downloadCenter');
	}
};
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		active: active.value,
	},
	pageList: getPassPage, // H
	descs: [],
});

//  table hook
// downBlobFile
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style scoped>
/* .demo-tabs{
	height: 85%;
}
:deep(.el-tabs__content){
	height: 100%;
} */
/* el-tabs el-tabs--top demo-tabs */
</style>
