<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb-[8px]" style="font-size: 20px; font-weight: 500; color: #1d2129">发放详情</el-row>
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="UID" prop="unionId">
						<el-input v-model="state.queryForm.unionId" placeholder="请输入UID" />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input v-model="state.queryForm.mobile" placeholder="请输入手机号" maxlength="11"/>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="couponName" label="发放优惠券类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="validDate" label="卡券有效期" show-overflow-tooltip></el-table-column>
				<el-table-column prop="unionId" label="UID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="手机号"width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalNum" label="发放张数"  width="200" show-overflow-tooltip></el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageMemberCouponIssueLogGet } from '../../../../api/member/coupon';
const queryRef = ref();
const showSearch = ref(true);
const route = useRoute();
onMounted(() => {
	if(route.query?.issueCode)
	state.queryForm.issueCode = route.query?.issueCode
});
// const memberCouponIssueLog = async () => {
// 	const params = {
// 		issueCode: route.query?.issueCode,
// 	}
// 	let res = await pageMemberCouponIssueLogGet(params);
// 	return res;
// };
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageMemberCouponIssueLogGet, // H
	descs: ['create_time'],
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
