<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" @keyup.enter="getDataList" ref="queryRef" style="width: 100%">
					<el-row style="width: 100%">
						<el-form-item label="平台消费使用规则" prop="unionId" label-width="150px" style="width: 100%">
							<div class="flex" style="width: 100%">
								<span class="ml-5 formText">1积分可抵扣</span
								><el-input-number
									class="ml-2"
									v-model="platformNum.pointsToCurrencyRatio"
									:min="0"
									:precision="2"
									:step="0.01"
									step-strictly
									style="width: 300px"
								/><span class="formText">（元）</span>
								<el-button type="primary" class="ml-5" @click="handleSet(platformNum)">设置</el-button>
							</div>
						</el-form-item>
					</el-row>
					<el-row style="width: 100%">
						<el-form-item label="地铁乘车使用规则" prop="unionId" label-width="150px" style="width: 100%">
							<div class="flex" style="width: 100%">
								<span class="ml-5 formText">1积分可抵扣</span
								><el-input-number
									class="ml-2"
									v-model="ridingNum.pointsToCurrencyRatio"
									:min="0"
									:precision="2"
									:step="0.01"
									step-strictly
									style="width: 300px"
								/><span class="formText">（元）</span>
								<el-button type="primary" class="ml-5" @click="handleSet(ridingNum)">设置</el-button>
							</div>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-row class="table-title my-2">使用任务</el-row>
			<el-row class="mb8 flex items-center">
				<div>
					<el-button type="primary" icon="plus" @click="handleAdd"> 新增 </el-button>
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
				<el-table-column label="图标" prop="unionId">
					<template #default="{ row }">
						<el-image style="width: 40px; height: 40px" :src="row.icon" />
					</template>
				</el-table-column>
				<el-table-column label="场景名称" prop="taskName" />
				<el-table-column label="场景规则" prop="taskRule" />
				<el-table-column label="跳转地址" prop="jumpUrl" />
				<el-table-column label="状态" prop="channelName">
					<template #default="{ row }">
						<el-switch v-model="row.status" :active-value="1" :inactive-value="2" @click="handleChange(row)" />
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="操作" prop="scoreSerialNumber">
					<template #default="{ row }">
						<el-button @click="handleEdit(row)"> 编辑 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	</div>
</template>

<script lang="ts" setup name="pointsGrant">
import { getTaskPage, getUsageConfigList, getUsageConfigUpdate, getTaskUpdate } from '/@/api/points/manage';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
// 引入组件
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const platformNum = ref<any>({
	id: 0,
	pointsToCurrencyRatio: 0,
}); //平台消费使用规则
const ridingNum = ref<any>({
	id: 0,
	pointsToCurrencyRatio: 0,
}); // 地铁乘车使用规则
// const router = useRouter();
// // 发放渠道
// const channelType: any = ref([]);
// // 事件列表
// const eventType: any = ref([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getTaskPage,
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
onMounted(() => {
	handleUsageConfigList();
});

const handleUsageConfigList = async () => {
	//
	try {
		const { code, data, msg } = await getUsageConfigList();
		if (code === 0) {
			console.log('data', data);
			if (data?.length > 0) {
				Object.assign(platformNum.value, data[0]);
				Object.assign(ridingNum.value, data[1]);
			}
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 设置
const handleSet = async (data: any) => {
	try {
		const { code, msg } = await getUsageConfigUpdate(data);
		if (code === 0) {
			useMessage().success('设置成功');
			handleUsageConfigList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 修改
const handleChange = async (data: any) => {
	const params = { ...data };
	try {
		const { code, msg } = await getTaskUpdate(params);
		if (code === 0) {
			useMessage().success('修改成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 编辑
const handleEdit = (row: any) => {
	formDialogRef.value.openDialog(row);
};

const handleAdd = () => {
	formDialogRef.value.openDialog();
};
</script>
<style lang="scss" scoped>
.el-form-item__content {
	width: 100%;
}
.formText {
	color: #999;
}
.el-input-number:deep(.el-input-number__decrease) {
	display: none;
}
.el-input-number:deep(.el-input-number__increase) {
	display: none;
}
.table-title {
	font-size: 20px;
}
</style>
