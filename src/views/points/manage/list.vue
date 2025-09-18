<template>
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="用户id" prop="unionId">
							<el-input placeholder="请输入用户id" style="width: 180px" v-model="state.queryForm.unionId" />
						</el-form-item>
						<el-form-item label="用户名称" prop="userName">
							<el-input placeholder="请输入用户名称" style="width: 180px" v-model="state.queryForm.userName" />
						</el-form-item>
						<el-form-item label="手机号" prop="mobile">
							<el-input placeholder="请输入手机号" style="width: 180px" v-model="state.queryForm.mobile" />
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
				</el-row>
				<el-row class="mb8 flex justify-end items-center">
					<div>
						<el-button type="primary" @click="exportExcel"> 导出 </el-button>
					</div>
				</el-row>
				<el-table
					border
					:data="state.dataList"
					v-loading="state.loading"
					row-key="unionId"
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="55" />
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="用户id" prop="unionId" />
					<el-table-column label="用户名称" prop="userName" />
					<el-table-column label="手机号" prop="mobile" />
					<el-table-column label="积分剩余" prop="score" />
					<!-- <el-table-column label="状态" prop="createTime">
					<template #default="scope">
						<el-switch
							v-model="scope.row.status"
							:active-value="1"
							style="--el-switch-on-color: #13ce66"
							:inactive-value="2"
							:before-change="() => beforeChange(scope.row)"
						/>
					</template>
</el-table-column> -->
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="toDetail(row)">查看流水</el-button>
							<el-button type="primary" link @click="toInfo(row)">详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="type = 'list'"></listDetail>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { accountList, exportAccountPage, exportAccountPageFilter } from '/@/api/points/manage';
import { checkPermission, getSysEntranceList } from '/@/api/portal';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';
import listDetail from './details.vue';
import { Session } from '/@/utils/storage';
const listDetailRef = ref();
const router = useRouter();
const tenantId = Session.getTenant();
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: accountList,
	queryForm: {},
	dataList: [],
});
let type = ref('list');
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
	multipleSelection.value = val;
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const toDetail = (row: any) => {
	// router.push({ path: '/points/manage/details', query: { unionId: row.unionId } });
	listDetailRef.value.show(row.unionId);
	type.value = 'detail';
};

// 跳转其他系统
const handleJump = async (item: any) => {
	const token = Session.getToken();
	const tenantId = Session.getTenant();
	const jumpLink = item.jumpLink ? encodeURIComponent(item.jumpLink) : encodeURIComponent('/home');
	const tenantIdTarget = item.tenantId;
	const { code, msg } = await checkPermission({ tenantId: tenantIdTarget });
	if (code === 0) {
		router.push({ path: '/transfer', query: { tenantId, token, jumpLink, tenantIdTarget } });
		// console.log(router.resolve({ path: '/transfer', query: { tenantId, token, jumpLink, tenantIdTarget } }).href);
		// const newWindow = window.open(router.resolve({ path: '/transfer', query: { tenantId, token, jumpLink, tenantIdTarget } }).href);
		// if (newWindow) {
		// 	// 刷新新窗口
		// 	// 延迟0.1秒后刷新新窗口
		// 	setTimeout(function () {
		// 		newWindow.location.reload();
		// 	}, 1000);
		// }
	} else {
		useMessage().error(msg);
	}
};
const toInfo = async (row: any) => {
	const unionId = row.unionId;
	const { data } = await getSysEntranceList();
	console.log('res', data);
	const res = data.find((e: any) => e.groupName === '通用模块');
	if (res) {
		const centerInfo = res.sysInfos.find((e: any) => e.name === '会员中心');
		console.log('centerInfo', centerInfo);
		if (centerInfo) {
			// centerInfo.jumpLink = `/member/memberManagement/memberManager/detail?id=${unionId}`;
			centerInfo.jumpLink = `/member/memberManagement/accountManager/index?id=${unionId}`;
			const token = Session.getToken();
			const url = `${centerInfo.domainUrl}/#${centerInfo.jumpLink}&isAuthorization=true&token=${token}&tenantId=${tenantId}&unionId=${row.unionId}`;
			console.log('url', url);
			window.open(url);
			// handleJump(centerInfo);
		}
		// 跳转到会员中心todo
		// router.push({ path: '/points/manage/details', query: { unionId: row.unionId } });
		//window.open(`https://rls-member.linghzx.online/#/member/memberManagement/memberManager/detail?id=${unionId}`, '_blank');
	}
};

// 下载业务报表
const exportExcel = async () => {
	try {
		await useMessageBox().confirm('导出完成后请到下载中心查看，是否继续导出？');
	} catch {
		return;
	}
	if (multipleSelection.value.length) {
		const selectIds = multipleSelection.value.map((item: any) => item.id);
		exportAccountPageFilter({ ...state.queryForm, selectedIds: selectIds.join(',') }).then(() => {
			router.push({ path: '/downloadCenter' });
		});
	} else {
		exportAccountPage(state.queryForm).then(() => {
			router.push({ path: '/downloadCenter' });
		});
	}
};
// const beforeChange = async (row: any) => {
// 	const msg = row.status == 2 ? '确定要启用该用户吗?' : '确定要禁用该用户吗?';
// 	try {
// 		await useMessageBox().confirm(msg);
// 	} catch {
// 		return;
// 	}
// 	try {
// 		let changeStatus: any;
// 		if (row.status == 1) changeStatus = 2;
// 		if (row.status == 2) changeStatus = 1;
// 		const params = {
// 			status: changeStatus,
// 			unionId: row.unionId,
// 		};
// 		await accountUpdateStatus(params);
// 		useMessage().success('操作成功');
// 		getDataList();
// 		return true;
// 	} catch (err: any) {
// 		useMessage().error(err.msg);
// 	}
// };
</script>
<style lang="scss" scoped></style>
