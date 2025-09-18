<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="开发者手机号" prop="phone">
						<el-input placeholder="请输入开发者手机号" v-model="state.queryForm.phone" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="预警应用" prop="appName">
						<el-input placeholder="请输入预警应用名称" v-model="state.queryForm.appName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="预警接口" prop="interfaceName">
						<el-input placeholder="请输入预警接口名称" v-model="state.queryForm.interfaceName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="预警类型" prop="alertType">
						<el-select v-model="state.queryForm.alertType" placeholder="请选择预警类型" style="width: 230px" clearable>
							<el-option v-for="(item, index) in alertTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="预警时间" prop="warningTime">
						<el-date-picker
							v-model="warningTime"
							type="daterange"
							range-separator="-"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD"
							clearable
							style="width: 300px"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary"> 查询 </el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="开发者手机号" prop="phone" show-overflow-tooltip width="200" />
				<el-table-column label="预警应用" prop="appName" show-overflow-tooltip width="200" />
				<el-table-column label="预警接口" prop="interfaceName" show-overflow-tooltip width="200" />
				<el-table-column label="预警类型" prop="alertType" width="140" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.alertType == 1">限流预警</span>
						<span v-else-if="row.alertType == 2">调用异常</span>
						<span v-else-if="row.alertType == 3">接口禁用</span>
					</template>
				</el-table-column>
				<el-table-column label="预警信息" prop="alertMsg" />
				<el-table-column label="预警时间" prop="alertTime" width="200" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ElMessageBox } from 'element-plus';
import { getWarningCenterList } from '/@/api/openPlatform/monitor';
import { ElNotification } from 'element-plus';

const router = useRouter();
// 搜索变量
const queryRef = ref();
const warningTime = ref([]);

// 状态枚举列表
const alertTypeList = [
	{ label: '限流预警', value: 1 },
	{ label: '调用异常', value: 2 },
	{ label: '接口禁用', value: 3 },
];

watch(
	() => warningTime.value,
	(val) => {
		if (val && val.length === 2) {
			// 确保 val 是一个包含两个元素的数组
			state.queryForm.startTime = `${val[0]} 00:00:00`; // 格式化开始时间
			state.queryForm.endTime = `${val[1]} 23:59:59`; // 格式化结束时间
		} else {
			// 如果 val 为空或格式不正确，重置 startTime 和 endTime
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		warningTime: '',
	},
	pageList: getWarningCenterList,
	dataList: [],
	descs: ['warningTime'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	warningTime.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
</script>
