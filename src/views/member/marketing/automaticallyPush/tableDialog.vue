<template>
	<el-dialog :close-on-click-modal="false" title="推送日志" width="900" draggable v-model="visible">
		<div>
			<div class="flex" style="justify-content: space-between">
				<el-form :inline="true" :model="queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="推送时间" prop="searchTime">
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
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-button type="primary" icon="plus" @click="handleExport()"> 导出表格 </el-button>
				</div>
			</div>
			<el-table
				:data="dataList"
				v-loading="loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column type="index" width="60" align="center" label="序号" />
				<el-table-column label="推送ID" prop="pushId" />
				<el-table-column label="推送内容" prop="pushContent" />
				<el-table-column label="推送途径" prop="pushChannel">
					<template #default="scope">
						<el-tag v-if="scope.row.pushChannel == 1">站内消息</el-tag>
						<el-tag v-if="scope.row.pushChannel == 2">短信</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="推送对象" prop="pushTarget">
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
				<el-table-column label="规则成功" prop="successCount" />
				<el-table-column label="推送失败" prop="failureCount" />
				<el-table-column label="推送时间" prop="pushTime" />
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
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">取消</el-button>
				<el-button @click="resetForm" type="primary">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageMemberMarketingPushLogPage } from '/@/api/member/marketing/marketing';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh', 'addToDetail']);
const dataFormRef = ref<any>();
const visible = ref(false);
const total = ref(0);
const loading = ref(false);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const dataList = ref<any[]>([]);
const queryRef = ref<any>();
const multipleSelection = ref<any[]>([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
const searchTime = ref<any[]>([]);
const { tableStyle, downBlobFile } = useTable(state);
const queryForm = ref<any>({});
watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			queryForm.value.pushStartTime = val[0] + ' 00:00:00';
			queryForm.value.pushEndTime = val[1] + ' 23:59:59';
		} else {
			queryForm.value.pushStartTime = '';
			queryForm.value.pushEndTime = '';
		}
	}
);
// 打开弹窗
const openDialog = (row?: any) => {
	console.log('row', row);
	if (row) {
		queryForm.value.pushId = row.pushId;
		queryForm.value.pushType = 1;
		visible.value = true;
		getDataList();
	}
};

// 关闭弹窗
const resetForm = () => {
	queryForm.value.pushStartTime = '';
	queryForm.value.pushEndTime = '';
	queryForm.value.pushId = '';
	queryForm.value.pushType = '';
	searchTime.value = [];
	visible.value = false;
};
const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val;
};

// 导出
const handleExport = async () => {
	console.log('multipleSelection', multipleSelection.value);
	if (multipleSelection.value.length == 0) {
		useMessage().error('请选择要导出的记录');
		return;
	}
	const params = {
		ids: [],
	};
	multipleSelection.value.forEach((item: any) => {
		params.ids.push(item.id);
	});
	downBlobFile('/uac/memberMarketingPushLog/export', params, '会员中心营销自动推送日志.xlsx');
};

const getDataList = async () => {
	try {
		const { code, data, msg } = await pageMemberMarketingPushLogPage(queryForm.value);
		if (code === 0) {
			Object.assign(dataList.value, data.records);
			total.value = data.total;
			// dataList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	queryForm.value.pushStartTime = '';
	queryForm.value.pushEndTime = '';
	searchTime.value = [];
	getDataList();
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getDataList();
};

const handlePageChange = (page: number) => {
	currentPage.value = page;
	getDataList();
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.upload_icon {
	position: absolute;
	width: 24px;
	height: 24px;
	left: 62px;
	top: 62px;
	border-radius: 100px;
	border: 2px solid #ffffff;
	background-color: #e8f3ff;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}
.form-right {
	background-color: #f2f2f2;
	padding: 10px;
	margin-bottom: 5px;
}
.variate {
	color: #0fa2dc;
	display: flex;
	flex-direction: column;
}
</style>
