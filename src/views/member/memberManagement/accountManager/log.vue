<template>
	<div class="log">
		<div class="font-bold text-xl mb-4">日志记录</div>
		<el-form :model="queryForm" ref="queryRef" :inline="true">
			<el-row>
				<el-form-item label="时间" prop="time">
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
				<el-form-item label="类型" prop="logType">
					<el-select v-model="queryForm.logType" style="width: 220px" placeholder="选择类型" clearable>
						<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
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
			v-loading="loading"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			height="400"
		>
			<el-table-column type="index" label="序号" width="60" align="center" />
			<el-table-column prop="logTime" label="时间" show-overflow-tooltip></el-table-column>
			<el-table-column prop="logType" label="类型" show-overflow-tooltip>
				<template #default="{ row }">
					<el-tag v-if="row.logType === 1">登录</el-tag>
					<el-tag v-if="row.logType === 2">注册</el-tag>
					<el-tag v-if="row.logType === 3">子系统认证</el-tag>
					<el-tag v-if="row.logType === 4">交易</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="content" label="操作内容" show-overflow-tooltip></el-table-column>
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
		<!-- <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" /> -->
	</div>
</template>

<script lang="ts" name="rechargeForm" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getLogByUserApi } from '/@/api/member/memberManagement/accountManager';
import { useMessage } from '/@/hooks/message';
const props = defineProps<{
	unionId: string;
}>();
const typeList = ref([
	{ value: 1, label: '登录' },
	{ value: 2, label: '注册' },
	{ value: 3, label: '子系统认证' },
	{ value: 4, label: '交易' },
]);
const searchTime = ref<any[]>([]);
const queryForm = reactive({
	logType: '',
	mobile: '',
	startTime: '',
	endTime: '',
});
const loading = ref(false);
const queryRef = ref();
const dataList = ref<any[]>([]);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
	dataList: [],
	// pageList: [],
});
onMounted(async () => {
	if (props?.unionId) {
		getList();
		// getDataList();
	}
});

watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			queryForm.startTime = val[0] + ' 00:00:00';
			queryForm.endTime = val[1] + ' 23:59:59';
			getList();
		} else {
			queryForm.startTime = '';
			queryForm.endTime = '';
		}
	}
);
const { tableStyle } = useTable(state);

const getList = async (page?: number) => {
	loading.value = true;
	if (page) {
		currentPage.value = 1;
	}
	const params = {
		unionId: props.unionId,
		current: currentPage.value,
		size: pageSize.value,
		...queryForm,
	};
	try {
		const { code, data, msg } = await getLogByUserApi(params);
		if (code === 0) {
			if (data) {
				dataList.value = data.records;
				total.value = data.total;
			} else {
				dataList.value = [];
				total.value = 0;
			}
			loading.value = false;
		} else {
			useMessage().error(msg);
			loading.value = false;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		loading.value = false;
	}
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getList();
};

const handlePageChange = (page: number) => {
	currentPage.value = page;
	getList();
};
const changeTime = () => {
	getList();
};
const changeType = () => {
	getList();
};

// 清空搜索条件
const resetQuery = () => {
	console.log('state', state.queryForm);
	currentPage.value = 1;
	pageSize.value = 10;
	searchTime.value = [];
	queryForm.startTime = '';
	queryForm.endTime = '';
	queryRef.value.resetFields();
	getList();
};

defineExpose({
	getList,
});
</script>
<style lang="scss" scoped>
.log {
	background: var(--el-color-white);
	border-radius: 4px;
	border: 1px solid var(--el-border-color-light, #ebeef5);
	padding: 10px;
}
</style>
