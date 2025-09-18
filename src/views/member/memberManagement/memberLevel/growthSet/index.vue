<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleChange">
				<el-tab-pane label="成长值任务" name="first"></el-tab-pane>
				<el-tab-pane label="签到任务" name="second"></el-tab-pane>
			</el-tabs>
			<el-row v-if="activeName === 'first'" class="mb8 flex justify-between items-center">
				<div>
					<el-button type="primary" icon="plus" @click="formDialogRef.openDialog()"> 新增 </el-button>
				</div>
			</el-row>
			<el-scrollbar>
				<div v-if="activeName === 'first'">
					<el-table
						:data="growthValueData"
						style="width: 100%"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column type="index" width="60" align="center" label="序号" />
						<el-table-column label="图标" prop="logoUrl">
							<template #default="{ row }">
								<el-image :src="row.logoUrl" />
							</template>
						</el-table-column>
						<el-table-column label="任务名称" prop="taskName" />
						<el-table-column label="任务规则" prop="rule" />
						<el-table-column label="发放成长值" prop="growthValue" />
						<el-table-column label="跳转地址" prop="jumpPath" />
						<el-table-column label="状态" prop="taskStatus">
							<template #default="scope">
								<el-switch
									v-model="scope.row.taskStatus"
									:active-value="1"
									style="--el-switch-on-color: #13ce66"
									:inactive-value="2"
									@click="() => handleClick(scope.row)"
								/>
							</template>
						</el-table-column>
						<el-table-column label="创建时间" prop="createTime" />
						<el-table-column label="操作">
							<template #default="{ row }">
								<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div v-else>
					<el-table
						:data="signDataList"
						v-loading="state.loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column label="平台名称" prop="name" />
						<el-table-column label="启用/禁用" prop="status">
							<template #default="scope">
								<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @click="handleClickSwitch(scope.row)" />
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template #default="{ row }">
								<el-button type="primary" link @click="handleSet(row)">设置</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-scrollbar>
		</div>
	</div>
	<formDialog ref="formDialogRef" @refresh="getGrowthValueData"></formDialog>
	<setDialog ref="setDialogRef" @refresh="getSignDataList"></setDialog>
</template>

<script lang="ts" setup name="manage-list">
import { getMemberGrowthManageGrowthList, getHideConfigApi, postMemberGrowthManageUpdate,putMemberSignSwitchUpdateApi } from '/@/api/member/memberLevel/growthSet';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';

const formDialog = defineAsyncComponent(() => import('./form.vue'));
const setDialog = defineAsyncComponent(() => import('./set.vue'));
const formDialogRef = ref();
const setDialogRef = ref();
const activeName = ref('first');
const signDataList = ref<any[]>([
	{
		id: '1',
		name: '平台',
		status: 2,
	},
]);
const growthValueData = ref<any[]>([]);

onMounted(() => {
	getGrowthValueData();
});

const getGrowthValueData = async () => {
	try {
		const { code, data, msg } = await getMemberGrowthManageGrowthList();
		if (code === 0) {
			console.log('growthValueData', data);
			growthValueData.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleChange = (tab: any, event: Event) => {
	console.log(tab, event);
	if (tab === 'first') {
		getGrowthValueData();
	} else {
		getSignDataList();
	}
};
// 只取个样式
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
const { tableStyle } = useTable(state);

const handleEdit = (row: any) => {
	console.log('row', row);
	formDialogRef.value.openDialog(row);
};

const handleSet = (row: any) => {
	console.log('row', row);
	setDialogRef.value.openDialog(row);
};

const getSignDataList = async () => {
	try {
		const { code, data, msg } = await getHideConfigApi();
		if (code === 0) {
			console.log('data', data);
			signDataList.value.forEach((item: any) => {
				item.id = data.id;
				item.status = data.status;
			});
			// signDataList.value.push();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleClick = async (row: any) => {
	const msg = row.status == 1 ? '确定要禁用该任务吗?' : '确定要启用该任务吗?';
	try {
		await ElMessageBox.confirm(msg, '系统提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	try {
		// const params = {
		// 	...row,
		// };
		const { code, msg } = await postMemberGrowthManageUpdate(row);
		if (code === 0) {
			useMessage().success('操作成功');
			getSignDataList();
			getGrowthValueData();
		} else {
			useMessage().error(msg);
			row.status == 1 ? (row.status = 2) : (row.status = 1);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		row.status == 1 ? (row.status = 2) : (row.status = 1);
	}
};
const handleClickSwitch = async (row: any) => {
	const msg = row.status == 1 ? '确定要禁用吗?' : '确定要启用吗?';
	try {
		await ElMessageBox.confirm(msg, '系统提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	try {

		const { code, msg } = await putMemberSignSwitchUpdateApi(row);
		if (code === 0) {
			useMessage().success('操作成功');
		} else {
			useMessage().error(msg);
			row.status == 1 ? (row.status = 2) : (row.status = 1);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		row.status == 1 ? (row.status = 2) : (row.status = 1);
	}
};
</script>
<style lang="scss" scoped></style>
