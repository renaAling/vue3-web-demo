<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item label="ID" prop="printerCode">
					<el-input placeholder="请输入ID" v-model="state.queryForm.printerCode" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="商家ID" prop="merchantCode">
					<el-input placeholder="请输入商家ID" v-model="state.queryForm.merchantCode" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="商家名称" prop="merchantName">
					<el-input placeholder="请输入商家名称" v-model="state.queryForm.merchantName" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="门店ID" prop="storeCode">
					<el-input placeholder="请输入门店ID" v-model="state.queryForm.storeCode" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="门店名称" prop="storeName">
					<el-input placeholder="请输入门店名称" v-model="state.queryForm.storeName" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="设备编号" prop="sn">
					<el-input placeholder="请输入设备编号" v-model="state.queryForm.sn" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="state.queryForm.status" clearable placeholder="请选择状态">
						<el-option label="启用" value="1">启用</el-option>
						<el-option label="禁用" value="2">禁用</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
					<el-button @click="resetQuery" icon="Refresh">重置</el-button>
				</el-form-item>
			</el-form>
			<el-row>
				<div class="mb10" style="width: 100%">
					<el-button type="primary" icon="plus" @click="handleOperation(null, 'add')">新增设备</el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="ID" prop="printerCode" show-overflow-tooltip width="120" />
				<el-table-column label="商家名称" prop="merchantName" show-overflow-tooltip width="200" />
				<el-table-column label="门店名称" prop="storeName" show-overflow-tooltip width="200" />
				<el-table-column label="设备名称" prop="name" show-overflow-tooltip />
				<el-table-column label="设备品牌" prop="brand" show-overflow-tooltip width="100" />
				<el-table-column label="设备编号" prop="sn" show-overflow-tooltip width="100" />
				<el-table-column label="打印类型" prop="type" show-overflow-tooltip width="100">
					<template #default="{ row }">
						<span v-if="row.type === 1">小票</span>
						<span v-else-if="row.type === 2">标签</span>
					</template>
				</el-table-column>
				<el-table-column label="打印份数" prop="num" show-overflow-tooltip width="100" />
				<el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip width="180" />
				<el-table-column label="状态" prop="status" show-overflow-tooltip>
					<template #default="{ row }">
						<el-switch v-model="row.status" :active-value="1" :inactive-value="2" :before-change="() => beforeChangeStatus(row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleOperation(row, 'edit')">编辑</el-button>
						<el-button type="primary" link @click="handleOperation(row, 'delete')">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 新增/编辑设备  -->
		<config-dialog @refresh="getDataList()" ref="configDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getDevicesList, updateDeviceStatus, delDevice } from '/@/api/goodStore/devices';

// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));

const queryRef = ref();
const configDialogRef = ref();
const selectObjs = ref<any>([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getDevicesList,
	queryForm: {},
	pagination: {},
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 切换启用/禁用
const beforeChangeStatus = async (row: any) => {
	const { printerCode, status } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${status === 2 ? '启用' : '禁用'}该设备`, `${status === 2 ? '启用' : '禁用'}`)
				.then(async () => {
					try {
						const { code, msg } = await updateDeviceStatus({ printerCode, status: status === 2 ? 1 : 2 });
						if (code === 0) {
							useMessage().success(`${status === 2 ? '启用' : '禁用'}成功`);
							getDataList();
							return resolve(true);
						} else {
							useMessage().error(msg);
						}
					} catch (err: any) {
						useMessage().error(err.msg);
					}
				})
				.catch(() => {
					resolve(false);
				});
		} catch (err) {
			reject(false);
		}
	});
};
const handleOperation = async (row: any, type: string) => {
	if (type === 'add') {
		configDialogRef.value.openDialog(null);
	} else if (type === 'edit') {
		configDialogRef.value.openDialog(row.printerCode);
	} else if (type === 'delete') {
		try {
			await useMessageBox().confirm(`确定要将选中设备删除吗`, '提示');
		} catch (err: any) {
			return false;
		}
		try {
			await delDevice(row.printerCode);
			useMessage().success('已删除该设备');
			getDataList();
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
<style lang="scss" scoped>
.page_title {
	font-size: 18rpx;
	font-weight: bold;
}

.text-c-1 {
	color: #67c23a;
}

.text-c-2 {
	color: #f56c6c;
}

.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
