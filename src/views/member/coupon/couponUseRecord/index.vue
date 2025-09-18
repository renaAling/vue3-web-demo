<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="UID" prop="unionId">
						<el-input v-model="state.queryForm.unionId" placeholder="请输入UID" />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input v-model="state.queryForm.mobile" placeholder="请输入手机号" maxlength="11" />
					</el-form-item>
					<el-form-item label="券码状态" prop="status">
						<el-select v-model="state.queryForm.status" style="width: 220px" placeholder="选择券码状态" clearable>
							<el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
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
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80"></el-table-column>
				<el-table-column prop="unionId" label="用户ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickName" label="用户昵称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="用户手机号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="couponName" label="已发放优惠券类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="发放时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updateTime" label="使用时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="statusName" label="券码状态" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.statusName }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="updateBy" label="核销人" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageMemberCouponUserInfoPage } from '../../../../api/member/coupon';
// import { useMessage, useMessageBox } from '/@/hooks/message';
// import { useRouter } from 'vue-router';
const queryRef = ref();
const showSearch = ref(true);
const statusArr = ref([]) as any;
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageMemberCouponUserInfoPage, // H
	descs: [],
});
onMounted(() => {
	geStatusArr();
});
const geStatusArr = async () => {
	statusArr.value = [
		{
			value: '2',
			label: '已核销',
		},
		{
			value: '3',
			label: '已过期',
		},
	];
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
