<template>
	<div class="mealCard">
		<div class="text-[#4785ea] mb-5">
			员工卡余额：<span class="text-[#4785ea]">{{ amount ? amount : '-' }}</span>
		</div>
		<el-form :model="state.queryForm" ref="queryRef" :inline="true">
			<el-row>
				<el-form-item label="状态" prop="unionId">
					<el-select v-model="tradeType" style="width: 220px" placeholder="选择状态" clearable>
						<el-option v-for="item in tradeTypeList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button icon="search" type="primary" @click="getList((currentPage = 1))"> 查询 </el-button>
					<el-button icon="Refresh" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-row>
		</el-form>
		<el-table
			:data="dataList"
			v-loading="state.loading"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
		>
			<el-table-column prop="amount" label="金额" show-overflow-tooltip></el-table-column>
			<el-table-column prop="tradeType" label="状态" show-overflow-tooltip>
				<template #default="{ row }">
					<span v-if="row.tradeType == 1">收入</span>
					<span v-if="row.tradeType == 2">支出</span>
				</template>
			</el-table-column>
			<el-table-column prop="tradeTime" label="交易信息" show-overflow-tooltip></el-table-column>
			<el-table-column prop="tradeDesc" label="备注" show-overflow-tooltip></el-table-column>
		</el-table>
		<el-pagination
			background
			layout="total, sizes, prev, pager, next, jumper"
			:page-sizes="[10, 20, 50, 100, 200]"
			:total="total"
			:page-size="pageSize"
			:current-page="currentPage"
			@size-change="handleSizeChange"
			@current-change="handlePageChange"
		></el-pagination>
	</div>
</template>

<script lang="ts" name="rechargeForm" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getWalletFlowForMember, getMemberStaffInfoByMobile } from '/@/api/member/memberManagement/accountManager';
import { useMessage } from '/@/hooks/message';

const props = defineProps<{
	unionId: string;
	staffId: string;
	mobile: string;
}>();
const dataList = ref<any[]>([]);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const queryRef = ref<any>();
const tradeType = ref<any>('');
const amount = ref<any>(''); //余额
const tradeTypeList = [
	{ label: '收入', value: '1' },
	{ label: '支出', value: '2' },
];

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
const { tableStyle } = useTable(state);

onMounted(() => {
	if (props.staffId) {
		getList();
	}
	if (props.mobile && props.staffId) {
		getAmount(props.mobile);
	}
});

const getList = async (page?: number) => {
	if (page) {
		currentPage.value = 1;
	}
	const params = {
		current: currentPage.value,
		size: pageSize.value,
		userGuid: props.staffId,
		tradeType: tradeType.value,
	};
	try {
		const { code, data, msg } = await getWalletFlowForMember(params);
		if (code === 0) {
			dataList.value = data.records;
			total.value = data.total;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		state.loading = false;
	}
};

const getAmount = async (mobile: string) => {
	state.loading = true;
	try {
		const { code, data, msg } = await getMemberStaffInfoByMobile(mobile);
		if (code === 0) {
			console.log('data', data);
			if (data) {
				amount.value = data.balance;
			}
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		state.loading = false;
	}
};

// 清空搜索条件
const resetQuery = () => {
	console.log('state', state.queryForm);
	currentPage.value = 1;
	pageSize.value = 10;
	tradeType.value = '';
	queryRef.value.resetFields();
	getList();
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getList();
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getList();
};
defineExpose({
	getList,
});
</script>
<style lang="scss" scoped>
.mealCard {
	background: var(--el-color-white);
	border-radius: 4px;
	border: 1px solid var(--el-border-color-light, #ebeef5);
	padding: 10px;
}
</style>
