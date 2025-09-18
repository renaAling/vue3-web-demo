<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="日期选择" prop="paymentTime">
						<el-date-picker v-model="paymentTime" :clearable="false" @change="changeTime" type="daterange"
							range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
							value-format="YYYY-MM-DD" />
					</el-form-item>
					<el-form-item label="分销商" prop="keywords">
						<el-input v-model="state.queryForm.keywords" placeholder="请输入用户昵称、电话、UID" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table :data="state.dataList" v-loading="state.loading" style="width: 100%" row-key="id" border
				:cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
				<el-table-column label="序号" type="index" width="60" />
				<!-- <el-table-column prop="id" label="ID"></el-table-column> -->
				<el-table-column prop="imgUrl" label="头像">
					<template #default="{ row }">
						<el-image :src="row.avatar ? row.avatar : 'https://gdsh-oss.duomixing.com:9086/rls/b/culture/20250331-175529.png'" :preview-teleported="true" :preview-src-list="[row.avatar ? row.avatar : 'https://gdsh-oss.duomixing.com:9086/rls/b/culture/20250331-175529.png']" />
					</template>
				</el-table-column>
				<el-table-column prop="unionId" label="UID" width="250" />
				<el-table-column prop="nickname" label="用户昵称" width="150" />
				<el-table-column prop="phone" label="手机号" width="150" />
				<!-- <el-table-column sortable prop="spreadCount" label="分销用户数量" :sort-method="(a, b) => {
					return a.spreadCount - b.spreadCount;
				}
					" /> -->
				<el-table-column sortable label="分销订单数量" prop="spreadOrderNum" :sort-method="(a, b) => {
					return a.spreadOrderNum - b.spreadOrderNum;
				}
					" />
				<el-table-column sortable label="分销订单金额" :sort-method="(a, b) => {
					return a.spreadOrderTotalPrice - b.spreadOrderTotalPrice;
				}
					" prop="spreadOrderTotalPrice" />
				<el-table-column sortable label="待发放分销积分" :sort-method="(a, b) => {
						return a.freezeBrokeragePrice - b.freezeBrokeragePrice;
					}
					" prop="freezeBrokeragePrice" />
				<el-table-column prop="promoterTime" label="成为分销员时间" min-width="250" />
				<el-table-column label="操作" width="180">
					<template #default="{ row }">
						<el-button type="text" @click="fxyListRef.openDialog(row)">被分销人</el-button>
						<el-button type="text" @click="fxddListRef.openDialog(row)">分销订单</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle"
				v-bind="state.pagination" />
			<fxddList ref="fxddListRef" />
			<fxyList ref="fxyListRef" />
		</div>
	</div>
</template>

<script setup lang="ts" name="distributor-list">
import { BasicTableProps, useTable } from '/@/hooks/table';
import fxddList from './fxddList.vue';
import fxyList from './fxyList.vue';
import { pageList } from '/@/api/member/distributor'

const paymentTime = ref([] as any);
const queryRef = ref();
const fxddListRef = ref();
const fxyListRef = ref();
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	paymentTime.value = [];
	state.queryForm.dateLimit = ''
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageList,
	descs: [],
});

const changeTime = (val: any) => {
	state.queryForm.dateLimit = val ? val.join(',') : ''
	getDataList();
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style scoped lang="scss">
.demo-image__error .image-slot {
	font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
	font-size: 30px;
}

.demo-image__error .el-image {
	width: 100%;
	height: 200px;
}
</style>