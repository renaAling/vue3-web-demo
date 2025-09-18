<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="商户名称">
						<el-input placeholder="请输入商户名称" maxlength="30" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="商户类型">
						<el-select v-model="state.queryForm.storeTypes" multiple filterable placeholder="请选择商户类型">
							<el-option label="中餐厅" :value="1" />
							<el-option label="外国餐厅" :value="2" />
							<el-option label="快餐厅" :value="3" />
							<el-option label="咖啡厅" :value="4" />
							<el-option label="茶艺馆" :value="5" />
							<el-option label="冷饮店" :value="6" />
							<el-option label="糕饼店" :value="7" />
							<el-option label="甜品店" :value="8" />
						</el-select>
					</el-form-item>
					<el-form-item label="关联站点">
						<el-input placeholder="请输入关联站点" maxlength="30" v-model="state.queryForm.subwayName" clearable />
					</el-form-item>
					<el-form-item label="区域" prop="areaIdList">
						<el-select v-model="state.queryForm.areaIdList" placeholder="请选择区域" multiple clearable>
							<el-option
								v-for="value in stores.regionCodeList"
								:key="value.regionCode"
								:label="value.regionName"
								:value="value.regionCode"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否允许覆盖">
						<el-select v-model="state.queryForm.isCover" placeholder="请选择区域" clearable>
							<el-option label="是" :value="true" />
							<el-option label="否" :value="false" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button type="primary" @click="handleAdd">新增</el-button>
				<el-button type="primary" @click="handleAsync">数据同步</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="name" label="商户名称" />
				<el-table-column prop="storeType" label="商户类型">
					<template #default="{ row }">
						<el-tag v-if="row.storeType === 1">中餐厅</el-tag>
						<el-tag v-else-if="row.storeType === 2">外国餐厅</el-tag>
						<el-tag v-else-if="row.storeType === 3">快餐厅</el-tag>
						<el-tag v-else-if="row.storeType === 4">咖啡厅</el-tag>
						<el-tag v-else-if="row.storeType === 5">茶艺馆</el-tag>
						<el-tag v-else-if="row.storeType === 6">冷饮店</el-tag>
						<el-tag v-else-if="row.storeType === 7">糕饼店</el-tag>
						<el-tag v-else-if="row.storeType === 8">甜品店</el-tag>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column prop="subwayName" label="关联站点" />
				<el-table-column prop="linesName" label="所属线路" show-overflow-tooltip />
				<el-table-column prop="areaName" label="区域" show-overflow-tooltip />
				<el-table-column prop="isCover" label="是否允许覆盖">
					<template #default="{ row }">
						<span v-if="row.isCover">是</span>
						<span v-else>否</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<!-- <el-button text type="primary" @click="formDialogRef.openDialog(row)">编辑</el-button> -->
						<el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
						<el-button text type="primary" @click="handelTop(row)">{{row.isTop?'取消置顶':'置顶'}}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
		<asyncDialog ref="asyncDialogRef" @refresh="getDataList"></asyncDialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getStorePageApi, storeUpdateTopApi } from '/@/api/note/noteInfo';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';
import { useMessage } from '/@/hooks/message';

const router = useRouter();
const formDialog = defineAsyncComponent(() => import('./dialogComponents/index.vue'));
const asyncDialog = defineAsyncComponent(() => import('./asyncDialog.vue'));
const formDialogRef = ref();
const asyncDialogRef = ref();
const stores = travelCommunalData();
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getStorePageApi,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

onMounted(async () => {
	if (Session.get('state')) {
		const data = JSON.parse(Session.get('state'));
		state.queryForm = data.queryForm;
		state.pagination = data.pagination;
		Session.remove('state');
	}
	if (stores.regionCodeList.length < 1) {
		await stores.getRegionCodeList();
	}
});

const handelTop = async (row: any) => {
	try {
		const { code, msg } = await storeUpdateTopApi({
			ipoCode: row.ipoCode,
			isTop: row.isTop?0:1,
		});
		if (code === 0) {
			getDataList();
      let tips=row.isTop?'取消置顶成功':'置顶成功';
			useMessage().success(tips);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const handleAdd = () => {
	router.push({ path: '/note/consumptionMap/merchantManagement/detail' });
}

const handleEdit = (row: any) => {
	router.push({ path: '/note/consumptionMap/merchantManagement/detail', query: { ipoCode: row.ipoCode } });
}

// 置顶
// const handelTop = async (row: any) => {
// 	console.log('row', row);
// ElMessageBox.confirm('此操作将永久删除？', '系统提示', {
//   confirmButtonText: '确认',
//   cancelButtonText: '取消',
//   type: 'warning',
// })
//   .then(async () => {
//     await handleDelApi(row.id);
//   })
//   .catch(() => {
//     return;
//   });
// };

// 数据同步
const handleAsync = async () => {
	asyncDialogRef.value.openDialog();
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
</script>
