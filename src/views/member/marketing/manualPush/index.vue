<template>
	<!-- 自动推送 -->
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="推送ID" prop="pushId">
							<el-input placeholder="请输入推送ID" clearable style="width: 180px" v-model="state.queryForm.pushId" />
						</el-form-item>
						<el-form-item label="推送途径" prop="pushChannel" placeholder="请选择推送途径">
							<el-select v-model="state.queryForm.pushChannel" clearable style="width: 180px">
								<el-option label="站内消息" :value="2">站内消息</el-option>
								<el-option label="短信" :value="1">短信</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="推送时间" prop="searchTime">
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
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
				</el-row>
				<el-row class="mb8 flex justify-between items-center">
					<div>
						<el-button type="primary" icon="plus" @click="addFormDialogRef.openDialog()"> 新增 </el-button>
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
					<el-table-column label="推送ID" prop="pushId" />
					<el-table-column label="推送内容" prop="pushContent" />
					<el-table-column label="推送途径" prop="pushChannel">
						<template #default="scope">
							<span v-if="scope.row.pushChannel == 2">站内消息</span>
							<span v-if="scope.row.pushChannel == 1">短信</span>
						</template>
					</el-table-column>
					<el-table-column label="推送对象">
						<template #default="{ row }">
							<div v-if="row.pushTarget">
								<span v-for="(item, index) in row.pushTarget.split(',')" :key="index">
									{{ item }}
									<br v-if="index !== row.pushTarget.split(',').length - 1" />
								</span>
							</div>
							<div v-else>--</div>
						</template>
					</el-table-column>
					<el-table-column label="推送用户数" prop="totalUsers" />
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="formDialogRef.openDialog(row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	<addFormDialog ref="addFormDialogRef" @refresh="getDataList"></addFormDialog>
</template>

<script lang="ts" setup name="manage-list">
import { pageMemberMarketingPushLogPage } from '/@/api/member/marketing/marketing';
import { BasicTableProps, useTable } from '/@/hooks/table';
const formDialog = defineAsyncComponent(() => import('./see.vue'));
const addFormDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const addFormDialogRef = ref();

// 搜索变量
const queryRef = ref();
const searchTime = ref<string[]>([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageMemberMarketingPushLogPage,
	queryForm: {
		pushType: 2,
	},
	dataList: [],
});
let type = ref('list');
watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.pushStartTime = val[0] + ' 00:00:00';
			state.queryForm.pushEndTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.pushStartTime = '';
			state.queryForm.pushEndTime = '';
		}
	}
);
onMounted(() => {});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.pushStartTime = '';
	state.queryForm.pushEndTime = '';
	getDataList();
};

// const getChannelConfig = async () => {
// 	try {
// 		const { code, data, msg } = await getChannelConfigList();
// 		if (code === 0) {
// 			systemList.value = data;
// 		} else {
// 			useMessage().error(msg);
// 		}
// 	} catch (err: any) {
// 		useMessage().error(err.msg);
// 	}
// };
const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
};
</script>
<style lang="scss" scoped></style>
