<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-row>
						<el-form-item prop="searchTime" label="选择时间">
							<date-compents ref="dateRef" :today="false"
								@getDate="(val) => ([state.queryForm.handleStartTime, state.queryForm.handleEndTime] = val)"></date-compents>
						</el-form-item>
						<el-form-item label="用户名称" prop="userName" label-width="68px">
							<el-input placeholder="请输入用户名称" style="width: 180px" v-model="state.queryForm.userName" />
						</el-form-item>

						<el-form-item label="类型" prop="type" label-width="68px">
							<el-select placeholder="请选择" v-model="state.queryForm.type" clearable style="width: 180px">
								<el-option v-for="(item, key) in typeList" :key="key" :label="item.label"
									:value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="渠道" prop="channelCode" label-width="68px">
							<el-select placeholder="请选择" v-model="state.queryForm.channelCode" @change="handleEvent"
								clearable style="width: 180px">
								<el-option v-for="(item, key) in channelType" :key="key" :label="item.name"
									:value="item.channelCode"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-row class="mb8 flex justify-start items-center">
				<div>
					<el-button type="default" @click="exportExcel"> 导出 </el-button>
				</div>
			</el-row>
			<el-table :data="state.dataList" v-loading="state.loading" row-key="id" border 
				:cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column label="用户id" prop="unionId" />
				<el-table-column label="用户名称" prop="userName" />
				<el-table-column label="手机号" prop="mobile" />
				<el-table-column label="变动积分" prop="changeScore" />
				<el-table-column label="变动前积分" prop="lastScore" />
				<el-table-column label="变动后积分" prop="currentScore" />
				<el-table-column label="类型" prop="type" />
				<el-table-column label="变动渠道" prop="channelName" />
				<el-table-column label="事件" prop="eventName" />
				<el-table-column label="积分流水号" prop="scoreSerialNumber" />
				<el-table-column label="第三方订单号" prop="businessNumber" />
				<el-table-column label="变动日期" prop="handleTime" />
				<el-table-column label="备注" prop="remark" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
				v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="pointsGrant">
import { channelList, channelNameAndEventNameList } from '/@/api/points/manage';
import { getFlow, exportFlow } from '/@/api/points/statistic';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox } from '/@/hooks/message';
// 引入组件
const dateCompents = defineAsyncComponent(() => import('../components/index.vue'));
const dateRef = ref();
// 搜索变量
const queryRef = ref();
const router = useRouter();
// 发放渠道
const channelType: any = ref([]);
// 事件列表
const eventType: any = ref([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getFlow,
	queryForm: {},
	dataList: [],
});
const typeList = [
	{
		label: '发放',
		value: '1',
	},
	{
		label: '使用',
		value: '2',
	},
	{
		label: '冻结',
		value: '3',
	},
	{
		label: '清零',
		value: '4',
	},
]
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
	exportFlow(state.queryForm).then(() => {
		router.push({ path: '/downloadCenter' });
	});
};
</script>
<style lang="scss" scoped></style>
