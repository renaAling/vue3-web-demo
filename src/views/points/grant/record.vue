<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="my-5 flex align-center justify-start cursor-pointer" @click="router.go(-1)">
				<el-icon :size="22" class="mt-1"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
			</div>
			<!-- <el-icon :size="24"  v-if="query.unionId || query.type" class="back-icon"><Back /></el-icon> -->
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-row>
						<el-form-item label="用户id" prop="unionId" label-width="68px">
							<el-input placeholder="请输入用户id" style="width: 180px" v-model="state.queryForm.unionId" />
						</el-form-item>
						<el-form-item label="用户名称" prop="userName" label-width="68px">
							<el-input placeholder="请输入用户名称" style="width: 180px" v-model="state.queryForm.userName" />
						</el-form-item>
						<el-form-item label="手机号" prop="mobile" label-width="56px">
							<el-input placeholder="请输入手机号" style="width: 180px" v-model="state.queryForm.mobile" />
						</el-form-item>
						<el-form-item prop="searchTime" label="发放日期">
							<!-- <date-compents
								ref="dateRef"
								:today="false"
								@getDate="(val) => ([state.queryForm.handleStartTime, state.queryForm.handleEndTime] = val)"
							></date-compents> -->
							<el-date-picker
								v-model="searchTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="YYYY-MM-DD"
								style="width: 270px"
							/>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="发放渠道" prop="channelCode" label-width="68px">
							<el-select v-model="state.queryForm.channelCode" @change="handleEvent" clearable style="width: 180px">
								<el-option v-for="(item, key) in channelType" :key="key" :label="item.name" :value="item.channelCode"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="事件" prop="eventCode" label-width="68px">
							<el-select v-model="state.queryForm.eventCode" clearable style="width: 180px">
								<el-option v-for="(item, key) in eventType" :key="key" :label="item.eventName" :value="item.eventCode"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-row>
				</el-form>
				<!-- <div class="text-[#165DFF] cursor-pointer" @click="formDialogRef.openDialog()" v-if="!query.unionId">手动发放积分</div> -->
			</el-row>
			<el-row class="mb8 flex justify-end items-center">
				<div>
					<el-button type="primary" @click="exportExcel"> 导出 </el-button>
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
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column label="用户id" prop="unionId" />
				<el-table-column label="用户名称" prop="userName" />
				<el-table-column label="手机号" prop="mobile" />
				<el-table-column label="发放积分" prop="changeScore" />
				<el-table-column label="发放渠道" prop="channelName" />
				<el-table-column label="事件" prop="eventName" />
				<el-table-column label="发放时间" prop="handleTime" />
				<el-table-column label="备注" prop="remark" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- <formDialog ref="formDialogRef"></formDialog> -->
	</div>
</template>

<script lang="ts" setup name="pointsGrant">
import { getGrantFlowList, exportGrantFlow, channelList, channelNameAndEventNameList } from '/@/api/points/manage';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox } from '/@/hooks/message';
// 引入组件
// const formDialog = defineAsyncComponent(() => import('./recordForm.vue'));
// const dateCompents = defineAsyncComponent(() => import('../../components/index.vue'));
const dateRef = ref();
// 搜索变量
const queryRef = ref();
const formDialogRef = ref();
const route = useRoute();
const router = useRouter();
const searchTime = ref<any[]>([]);
const { query } = route;

const toForward = () => {
	emit('changeType');
};

// 发放渠道
const channelType: any = ref([]);
// 事件列表
const eventType: any = ref([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getGrantFlowList,
	queryForm: {
		unionId: query.unionId,
	},
	dataList: [],
});

onMounted(() => {
	channelList().then((res) => {
		channelType.value = res.data;
	});
});

// 根据渠道查询事件
const handleEvent = () => {
	channelNameAndEventNameList({ channelCode: state.queryForm.channelCode }).then((res) => {
		eventType.value = res.data;
	});
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	dateRef.value.resetField();
	state.queryForm.handleStartTime = '';
	state.queryForm.handleEndTime = '';
	getDataList();
};

// 导出
const exportExcel = async () => {
	try {
		await useMessageBox().confirm('导出完成后请到下载中心查看，是否继续导出？');
	} catch {
		return;
	}
	exportGrantFlow(state.queryForm).then(() => {
		router.push({ path: '/downloadCenter' });
	});
};
</script>
<style lang="scss" scoped>
.back-icon {
	font-size: 20px;
	.el-icon {
		height: 100%;
	}
}
</style>
