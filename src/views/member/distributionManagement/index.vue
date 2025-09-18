<template>
	<!-- 分销管理 -->
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="业务名称" prop="unionId">
							<el-input placeholder="请输入业务名称" clearable style="width: 180px" v-model="state.queryForm.unionId" />
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
				</el-row>
				<el-table
					:data="dataList"
					v-loading="state.loading"
					row-key="id"
					border
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="业务名称" prop="name" />
					<el-table-column label="分销员数量" prop="num" />
					<el-table-column label="分销订单数" prop="orderNum" />
					<el-table-column label="分销营销金额" prop="price" />
					<el-table-column label="分销返佣金额" prop="rebate" />
					<el-table-column label="操作" prop="userState">
						<template #default="{ row }">
							<el-button type="primary" link @click="toWindsOpen(row)">分销员管理</el-button>
							<el-button type="primary" link @click="toWindsOpen(row)">返佣设置</el-button>
							<el-button type="primary" link @click="toWindsOpen(row)">促销设置</el-button>
							<el-button type="primary" link @click="toWindsOpen(row)">分销设置</el-button>
							<el-button type="primary" link @click="toWindsOpen(row)">返佣统计</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					background
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[1, 10, 20, 50, 100, 200]"
					:total="total"
					:page-size="pageSize"
					:current-page="currentPage"
					@size-change="handleSizeChange"
					@current-change="handlePageChange"
				></el-pagination>
				<!-- <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" /> -->
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { getBackendUsersForMember, getChannelConfigList } from '/@/api/member/backendUsers/user';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';

// 搜索变量
const queryRef = ref();
const searchTime = ref<string[]>([]);
const dataList = ref<any[]>([{ name: '轨道甄选', num: '10', orderNum: '100', price: '10000', rebate: '100' }]);
const total = ref(1);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const state: BasicTableProps = reactive<BasicTableProps>({
	// pageList: getBackendUsersForMember,
	queryForm: {},
	dataList: [],
});

let type = ref('list');
watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);
onMounted(() => {
	getDataList();
	// getChannelConfig();
});
//  table hook
const { tableStyle } = useTable(state);

const getDataList = () => {
	// Object.assign(dataList, );
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.value.startTime = '';
	state.queryForm.value.endTime = '';
	// getDataList();
};
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	// getJournalList();
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	// getJournalList();
};
const toWindsOpen = () => {
	window.open('https://www.baidu.com');
};
</script>
<style lang="scss" scoped></style>
