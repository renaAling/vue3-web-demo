<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="分销员姓名">
						<el-input @keyup.enter.native="getDataList" v-model="state.queryForm.name" placeholder="请输入分销员姓名" clearable> </el-input>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input @keyup.enter.native="getDataList" v-model="state.queryForm.phone" placeholder="请输入手机号" clearable> </el-input>
					</el-form-item>
					<el-form-item label="分销等级">
						<el-select v-model="state.queryForm.distributionLevelCode" placeholder="请选择" clearable>
							<el-option v-for="item in statusList" :key="item.levelCode" :label="item.levelName" :value="item.levelCode" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getDataList">查询</el-button>
						<el-button @click="handleReset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb10">
				<el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
				<el-button type="primary" icon="Plus" @click="excelUploadRef.show()">导入</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" />
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="phone" label="手机号"></el-table-column>
				<el-table-column prop="levelName" label="分销等级"></el-table-column>
				<el-table-column prop="spreadCount" label="推广用户数量"></el-table-column>
				<el-table-column prop="spreadOrderNum" label="推广订单数量"></el-table-column>
				<el-table-column prop="spreadOrderTotalPrice" label="推广订单总额"></el-table-column>
				<el-table-column prop="brokeragePrice" label="返佣金额"></el-table-column>
				<el-table-column prop="createTime" label="注册时间"></el-table-column>
				<el-table-column prop="isSpread" label="推广权限">
					<template #default="{ row }">
						<el-switch v-model="row.isSpread" inline-prompt active-text="是" inactive-text="否" :before-change="() => beforeChange(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-button type="text" @click="handleCheck(row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<DiscountUserForm v-model="dialogVisible" :pageType="pageType" :row="{}" @ok="getDataList" />
		<!-- 导入 -->
		<UploadExcel
			title="导入"
			@refreshDataList="handleSearchList"
			ref="excelUploadRef"
			:custom-temp-url="baseFileUrl + '/rls/b/分销员模板.xlsx'"
			url="/tracomps-admin/api/admin/userDistribution/import"
			:fileType="['xlsx', 'xls']"
		/>
	</div>
</template>

<script setup lang="ts" name="distributor-member">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { pageUserDistribution, distributionLevelConfigList, discountUserUpdateStatus } from '/@/api/member/distributionManage';

const baseFileUrl = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);
const UploadExcel = defineAsyncComponent(() => import('./component/UploadExcel.vue'));
const DiscountUserForm = defineAsyncComponent(() => import('./component/discountUserForm.vue'));
const router = useRouter();

const excelUploadRef = ref();

const handleSearchList = () => {
	state.queryForm.current = 1;
	getDataList();
};

const pageType = ref('');

const handleAdd = () => {
	pageType.value = 'add';
	dialogVisible.value = true;
};
const dialogVisible = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageUserDistribution,
	descs: [],
});

// 按钮
const handleCheck = (row: any) => {
	pageType.value = 'check';
	router.push({ path: '/culture/distributor/discountUserDetail', query: { id: row.id, uid: row.uid } });
};

const handleReset = () => {
	state.queryForm = {};
	getDataList();
};

const beforeChange = async (row: any) => {
	try {
		const data = {
			id: row.id,
			isSpread: !row.isSpread,
		};
		let res = await discountUserUpdateStatus(data);
		if (!res.ok) {
			return useMessage().error(res.msg);
		}
		getDataList();
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const statusList = ref();
const distributionLevelConfigListApi = async () => {
	const res = await distributionLevelConfigList();
	statusList.value = res.data;
};

onMounted(() => {
	distributionLevelConfigListApi();
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
