<template>
	<div class="layout">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-table
					:data="dataList"
					v-loading="loading"
					style="width: 100%"
					row-key="id"
					:cell-style="tableStyle.cellStyle"
					:header-cell-style="tableStyle.headerCellStyle"
				>
					<el-table-column prop="interfaceName" label="接口名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="interfaceUrl" label="接口地址" show-overflow-tooltip></el-table-column>
					<el-table-column prop="configTime" label="配置时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="configUser" label="配置人员" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" width="230">
						<template #default="scope">
							<el-button text type="primary" @click="toDetail('url', scope.row)">配置接口地址</el-button>
							<el-button text type="primary" @click="toDetail('record', scope.row)">查看日志</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<recordDialog ref="recordDialogRef" @refresh="getDataList"></recordDialog>
		<setUrlDialog ref="setUrlDialogRef" @refresh="getDataList"></setUrlDialog>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getInterfaceConfigGetUrlApi } from '/@/api/travel/subwayInformation';

// import { getMemberUserPage } from '/@/api/member/memberManagement/accountManager';
const recordDialog = defineAsyncComponent(() => import('./record.vue'));
const recordDialogRef = ref();
const setUrlDialog = defineAsyncComponent(() => import('./setUrl.vue'));
const setUrlDialogRef = ref();
const dataList = ref<any[]>([]);
const loading = ref(false);
onMounted(() => {
	getDataList();
});

const toDetail = (str: string, row: any) => {
	if (str == 'url') {
		setUrlDialogRef.value.openDialog(row);
	} else {
		recordDialogRef.value.openDialog(row);
	}
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
});

//  table hook
const { tableStyle } = useTable(state);

// 接口类型：1.列车运行表、2.列车时刻表、3.列车运行实时信息、4.列车拥挤详情、5.强冷强弱 6.出战信息图
const getDataList = async () => {
	loading.value = true;
	try {
		const { code, data, msg } = await getInterfaceConfigGetUrlApi({ type: 6 });
		if (code === 0) {
			dataList.value = [data];
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
</script>

<style>
.layout {
	height: 100%;
	overflow: auto;
	box-sizing: border-box;
}
</style>
