<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar>
				<div class="my-5 flex align-center justify-start cursor-pointer" @click="toForward">
					<el-icon :size="22" class="mt-1"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
				</div>
				<el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleChange">
					<el-tab-pane v-for="item in tabList" :key="item.value" :label="item.label" :name="item.value"> </el-tab-pane>
				</el-tabs>
				<div v-if="activeName === '1'">
					<el-form :inline="true" :model="queryForm" @keyup.enter="getJournalList" ref="queryRef">
						<el-form-item label="会员卡号" prop="cardId">
							<el-input v-model="queryForm.cardId" placeholder="请输入会员卡号" />
						</el-form-item>
						<el-form-item label="类型" prop="status">
							<el-select v-model="queryForm.status" clearable style="width: 180px">
								<el-option v-for="(item, key) in typeList" :key="key" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="时间" prop="userId">
							<el-date-picker
								v-model="searchTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="YYYY-MM-DD"
								style="width: 270px"
								:disabled-date="disabledDate"
							/>
						</el-form-item>
						<el-form-item>
							<el-button @click="getJournalList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
					<el-table
						:data="dataList"
						v-loading="loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column type="index" label="序号" width="60" align="center" />
						<el-table-column label="时间" prop="claimTime" />
						<el-table-column label="会员卡号" prop="cardId" />
						<el-table-column label="类型" prop="status">
							<template #default="scope">
								<el-tag v-if="scope.row.status == 1">制卡</el-tag>
								<el-tag v-if="scope.row.status == 2">导出</el-tag>
								<el-tag v-if="scope.row.status == 3">激活</el-tag>
								<el-tag v-if="scope.row.status == 4">作废</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="操作内容" prop="operationDescription" />
					</el-table>
				</div>
				<div v-if="activeName === '2'">
					<el-form :inline="true" :model="equitiesForm" @keyup.enter="getJournalList" ref="queryRef">
						<el-form-item label="会员卡号" prop="cardId">
							<el-input v-model="equitiesForm.cardId" placeholder="请输入流水号" />
						</el-form-item>
						<el-form-item label="权益类型" prop="equitiesType">
							<el-select v-model="queryForm.equitiesType" clearable style="width: 180px">
								<el-option v-for="(item, key) in equitiesTypeList" :key="key" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<!-- <el-input v-model="equitiesForm.equitiesType" placeholder="请输入权益类型" /> -->
						</el-form-item>
						<el-form-item label="时间" prop="userId">
							<el-date-picker
								v-model="equitiesSearchTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="YYYY-MM-DD"
								style="width: 270px"
								:disabled-date="disabledDate"
							/>
						</el-form-item>
						<el-form-item>
							<el-button @click="getJournalList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
					<el-table
						:data="equitiesDataList"
						v-loading="equitiesLoading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column type="index" label="序号" width="60" align="center" />
						<el-table-column label="时间" prop="claimTime" />
						<el-table-column label="会员卡号" prop="cardId" />
						<el-table-column label="权益类型" prop="rightType" />
						<el-table-column label="操作内容" prop="operationDescription" />
					</el-table>
				</div>
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
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { cardRightsPage, userCardPage } from '/@/api/member/cards';
const tabList = ref([
	{ label: '会员卡日志', value: '1' },
	{ label: '权益记录', value: '2' },
]);
const queryForm = ref<any>({
	claimStartTime: '',
	claimEndTime: '',
	cardId: '',
	status: '', // 类型
});
const equitiesForm = ref<any>({
	startTime: '',
	endTime: '',
	serialNumber: '',
	eventType: '', // 类型
	channel: '', // 渠道
});
const emit = defineEmits(['changeType']);
const activeName = ref('1');
// 会员卡日志
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
// 权益记录
const equitiesDataList = ref<any[]>([]);
const equitiesLoading = ref<boolean>(false);
const queryRef = ref();
const searchTime = ref<any[]>([]);
const equitiesSearchTime = ref<any[]>([]);
const typeList = ref([
	{ value: 1, label: '制卡' },
	{ value: 2, label: '导出' },
	{ value: 3, label: '激活' },
	{ value: 3, label: '作废' },
]);
const equitiesTypeList = ref([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	// pageList: accountDetailList,
	queryForm: {},
	dataList: [],
});
//  table hook
const { tableStyle } = useTable(state);
const toForward = () => {
	emit('changeType');
};
watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			queryForm.value.claimStartTime = val[0] + ' 00:00:00';
			queryForm.value.claimEndTime = val[1] + ' 23:59:59';
		} else {
			queryForm.value.claimStartTime = '';
			queryForm.value.claimEndTime = '';
		}
	}
);
watch(
	() => equitiesSearchTime.value,
	(val) => {
		if (val?.length > 0) {
			queryForm.value.claimStartTime = val[0] + ' 00:00:00';
			queryForm.value.claimEndTime = val[1] + ' 23:59:59';
		} else {
			queryForm.value.claimStartTime = '';
			queryForm.value.claimEndTime = '';
		}
	}
);
const cardCode = ref('');
const show = (row: any) => {
	cardCode.value = row.code;
	getJournalList();
};
const handleChange = (tab: any, event: Event) => {
	console.log(tab, event);
	activeName.value = tab;
	getJournalList();
};
// 会员卡日志
const getJournalList = async () => {
	if (activeName.value === '1') {
		//会员卡日志
		const params = {
			...queryForm.value,
			cardCode: cardCode.value,
			current: currentPage.value,
			size: pageSize.value,
		};
		try {
			const { code, data, msg } = await userCardPage(params);
			if (code === 0) {
				dataList.value = data.records;
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else if (activeName.value === '2') {
		//权益记录
		const params = {
			...queryForm.value,
			cardCode: cardCode.value,
			current: currentPage.value,
			size: pageSize.value,
		};
		try {
			const { code, data, msg } = await cardRightsPage(params);
			if (code === 0) {
				equitiesDataList.value = data.records;
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	equitiesSearchTime.value = [];
	queryForm.value.claimStartTime = '';
	queryForm.value.claimEndTime = '';
	getJournalList();
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getJournalList();
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getJournalList();
};
const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
};
defineExpose({
	show,
});
</script>
<style lang="scss" scoped>
.layout-padding {
	height: 100%;
	.boxSizing {
		box-sizing: border-box;
		margin-bottom: 10px;
	}
}
.back-icon {
	font-size: 20px;
	.el-icon {
		height: 100%;
	}
}

.avatar {
	margin-left: 25px;
	height: 84px;
	width: 84px;
}
.content-title {
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	padding-left: 16px;
	position: relative;
	margin-top: 9px;
	margin-bottom: 9px;
	&::before {
		content: '';
		width: 8px;
		height: 20px;
		border-radius: 2px;
		background-color: #165dff;
		position: absolute;
		left: 0;
	}
}
.el_edit {
	margin-right: 10px;
}
</style>
