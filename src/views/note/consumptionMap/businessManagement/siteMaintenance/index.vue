<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="所属路线" prop="linesCodes">
						<el-select
							v-model="state.queryForm.linesCodes"
							multiple
							filterable
							remote
							reserve-keyword
							placeholder="请选择所属线路"
							:remote-method="remoteMethod"
							:loading="loading"
						>
							<el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code" />
						</el-select>
					</el-form-item>
					<el-form-item label="站点名称" prop="name">
						<el-input placeholder="请输入站点名称" maxlength="30" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="区域" prop="areaCode">
						<el-select v-model="state.queryForm.areaCode" placeholder="请选择区域" default-first-option clearable>
							<el-option v-for="value in regionCodeList" :key="value.regionCode" :label="value.regionName" :value="value.regionCode"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button type="primary" @click="formDialogRef.openDialog()"> 新增 </el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="站点名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="linesName" label="所属线路" show-overflow-tooltip></el-table-column>
				<el-table-column prop="areaCode" label="区域" show-overflow-tooltip>
					<template #default="{ row }">
						{{ regionCodeMap[row.areaCode] }}
					</template>
				</el-table-column>
				<el-table-column prop="longitude" label="坐标" show-overflow-tooltip>
					<template #default="{ row }"> {{ row.longitude }},{{ row.latitude }}</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleEdit(row, 'edit')">编辑</el-button>
						<el-button text type="primary" @click="handleEdit(row, 'map')">地图管理</el-button>
						<el-button text type="danger" @click="handelDel(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getSubwayStationPageApi, putSubwayStationDelMapApi, getRegionCodeListApi, getSubwayLineListApi } from '/@/api/note/noteInfo';
import { useRouter } from 'vue-router';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';

import { Session } from '/@/utils/storage';

// 引入组件
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const router = useRouter();
const loading = ref(false);
const timeData = ref<string[]>([]);
const options = ref<any[]>([]);
const queryRef = ref();
const showSearch = ref(true);
const regionCodeList = ref<any[]>([]);
const regionCodeMap = ref<any>({});
const subwayLineList = ref<any[]>([]);
onMounted(async() => {
	if (Session.get('state')) {
		const data = JSON.parse(Session.get('state'));
		state.queryForm = data.queryForm;
		state.pagination = data.pagination;
		Session.remove('state');
	}
	await getRegionCodeList();
	regionCodeList.value = JSON.parse(Session.get('regionCode'));
	regionCodeMap.value = JSON.parse(Session.get('regionCodeMap'));
});

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getSubwayStationPageApi,
	queryForm: {},
	dataList: [],
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// const getList = () => {
// 	if (Session.get('state')) {
// 		const data = JSON.parse(Session.get('state'));
// 		state.queryForm = data.queryForm;
// 		state.pagination = data.pagination;
// 		getDataList(false);
// 		Session.remove('state');
// 	}
// };

const getRegionCodeList = async () => {
	const { data, msg, code } = await getRegionCodeListApi();
	if (code === 0) {
		const obj: any = {};
		data.map((item: any) => {
			obj[item.regionCode] = item.regionName;
		});
		Session.set('regionCode', JSON.stringify(data));
		Session.set('regionCodeMap', JSON.stringify(obj));
	} else {
		useMessage().error(msg);
	}
};

const getSubwayLineList = async (name: any) => {
	console.log('name', name);
	const { data, msg, code } = await getSubwayLineListApi(name);
	if (code === 0) {
		subwayLineList.value = data;
		console.log('data', data);
	} else {
		useMessage().error(msg);
	}
};
// 站点
const remoteMethod = (query: string) => {
	if (query) {
		loading.value = true;
		options.value = [];
		setTimeout(async () => {
			loading.value = false;
			await getSubwayLineList(query);
			options.value = subwayLineList.value;
		}, 200);
	} else {
		options.value = [];
	}
};

const handleDelApi = async (id: string) => {
	try {
		const { code, msg } = await putSubwayStationDelMapApi(id);
		if (code === 0) {
			getDataList();
			useMessage().success('删除成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const handleEdit = (row: any, type: string) => {
	Session.set('state', JSON.stringify(state));
	if (type === 'edit') {
		formDialogRef.value.openDialog(row);
	} else {
		console.log('row', row);
		router.push({
			path: '/note/consumptionMap/businessManagement/siteMaintenance/edit',
			query: { id: row.id, name: row.name, mapUrl: row.mapUrl },
		});
	}
};
// 删除
const handelDel = async (row: any) => {
	console.log('row', row);
	ElMessageBox.confirm('此操作将永久删除？', '系统提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await handleDelApi(row.id);
		})
		.catch(() => {
			return;
		});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	timeData.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
</script>
