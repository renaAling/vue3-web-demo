<template>
	<!-- 优惠券列表 -->
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="优惠券名称" prop="name">
							<el-input placeholder="请输入优惠券名称" clearable style="width: 180px" v-model="state.queryForm.name" />
						</el-form-item>
						<el-form-item label="所属业务" prop="platType" placeholder="请选择状态">
							<el-select v-model="state.queryForm.platType" clearable style="width: 180px">
								<el-option label="轨道甄选" :value="0">轨道甄选</el-option>
								<el-option label="地铁文创" :value="3">地铁文创</el-option>
								<!-- <el-option label="自有商城" :value="4">自有商城</el-option>
								<el-option label="积分商城" :value="5">积分商城</el-option>
								<el-option label="ip运营" :value="6">ip运营</el-option> -->
							</el-select>
						</el-form-item>
						<el-form-item label="状态" prop="status" placeholder="请选择状态">
							<el-select v-model="state.queryForm.status" clearable style="width: 180px">
								<el-option label="启用" :value="1">启用</el-option>
								<el-option label="禁用" :value="0">禁用</el-option>
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
						<el-button type="primary" icon="plus" @click="toAdd()"> 发行优惠券 </el-button>
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
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="优惠券ID" prop="id" />
					<el-table-column label="所属业务" prop="platType">
						<template #default="{ row }">
							<span v-if="row.platType == 0">轨道甄选</span>
							<span v-if="row.platType == 3">地铁文创</span>
							<span v-if="row.platType == 4">自有商城</span>
							<span v-if="row.platType == 5">积分商城</span>
							<span v-if="row.platType == 6">ip运营</span>
						</template>
					</el-table-column>
					<el-table-column label="优惠券名称" prop="name" />
					<el-table-column label="优惠券类型" prop="category">
						<template #default="{ row }">
							<span v-if="row.category == 1">商家券</span>
							<span v-if="row.category == 2">商品券</span>
							<span v-if="row.category == 3">通用券</span>
							<span v-if="row.category == 4">品类券</span>
							<span v-if="row.category == 5">品牌券</span>
							<span v-if="row.category == 6">跨店券</span>
						</template>
					</el-table-column>
					<el-table-column label="领取方式" prop="receiveType">
						<template #default="{ row }">
							<span v-if="row.receiveType == 1">手动领取</span>
							<span v-if="row.receiveType == 2">商品赠送券</span>
							<span v-if="row.receiveType == 3">平台活动发放</span>
						</template>
					</el-table-column>
					<el-table-column label="发行时间" prop="total">
						<!-- receiveStartTime -->
						<template #default="{ row }">
							<div v-if="row.receiveStartTime && row.receiveEndTime">
								<span>{{ row.receiveStartTime }}-{{ row.receiveEndTime }}</span>
							</div>
							<div v-else>-</div>
							<!-- <span v-if="row.receiveType == 1">手动领取</span>
							<span v-if="row.receiveType == 2">商品赠送券</span>
							<span v-if="row.receiveType == 3">平台活动发放</span> -->
						</template>
					</el-table-column>
					<el-table-column label="使用有效期" prop="mobile">
						<template #default="{ row }">
							<span>{{ row.useStartTime ? row.useStartTime : '-' }}</span>
							<span v-if="row.useStartTime || row.useEndTime">-</span>
							<span>{{ row.useEndTime ? row.useEndTime : '-' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="发行数量" prop="total">
						<!-- isLimited -->
						<template #default="{ row }">
							<span v-if="row.isLimited">{{ row.total }}</span>
							<span v-if="!row.isLimited">不限量</span>
						</template>
					</el-table-column>
					<el-table-column label="状态" prop="status">
						<template #default="scope">
							<el-tag v-if="scope.row.status == 1">启用</el-tag>
							<el-tag v-if="scope.row.status == 0">禁用</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="toSee(row.id)">查看</el-button>
							<el-button type="primary" link @click="toEdit(row.id)">编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="changeType" @getList="getDataList"></listDetail>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { platformCouponListApi } from '/@/api/culture/marketing';
import { BasicTableProps, useTable } from '/@/hooks/table';
import listDetail from './details.vue';
const listDetailRef = ref();
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: platformCouponListApi,
	queryForm: {},
	dataList: [],
});
let type = ref('list');
onMounted(() => {});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const changeType = () => {
	type.value = 'list';
	getDataList();
};
const toAdd = () => {
	listDetailRef.value.show();
	type.value = 'detail';
};
const toEdit = (row: any) => {
	listDetailRef.value.show(row, 'edit');
	type.value = 'detail';
};
const toSee = (row: any) => {
	listDetailRef.value.show(row, 'see');
	type.value = 'detail';
};
</script>
<style lang="scss" scoped></style>
