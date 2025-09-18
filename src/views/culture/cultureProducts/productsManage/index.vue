<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="SPU" prop="spuCode">
						<el-input placeholder="请输入spu编码" v-model="state.queryForm.spuCode" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="商品名称" prop="spuName">
						<el-input placeholder="请输入商品名称" v-model="state.queryForm.spuName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="所属供应商" prop="supplierName">
						<el-input placeholder="请输入所属供应商" v-model="state.queryForm.supplierName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="state.queryForm.status" placeholder="请选择状态" style="width: 230px">
							<el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary"> 查询 </el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleAdd('real')" class="ml10" icon="folder-add" type="primary"> 新增实物商品 </el-button>
					<el-button @click="handleAdd('virtual')" class="ml10" icon="folder-add" type="primary"> 新增虚拟商品 </el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="SPU" prop="spuCode" width="200" show-overflow-tooltip />
				<el-table-column label="商品主图" prop="imageUrl" width="200" show-overflow-tooltip>
					<template #default="{ row }">
						<img :src="row.imageUrl" alt="" style="width: 90px; height: 70px" />
					</template>
				</el-table-column>
				<el-table-column label="商品名称" prop="spuName" width="200" show-overflow-tooltip />
				<el-table-column label="类型" prop="type" show-overflow-tooltip>
					<template #default="{ row }">
						<el-tag v-if="row.type === 1">实物</el-tag>
						<el-tag v-if="row.type === 2">虚拟</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="价格区间" prop="priceRange" show-overflow-tooltip />
				<el-table-column label="物流方式" prop="logisticsType" show-overflow-tooltip>
					<template #default="{ row }">
						<el-tag v-if="row.logisticsType === 1">邮寄</el-tag>
						<el-tag v-else-if="row.logisticsType === 2">网点自提</el-tag>
						<el-tag v-else-if="row.logisticsType === 5">虚拟发货</el-tag>
						<el-tag v-else>邮寄，网点自提</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="可用库存" prop="inventory" />
				<el-table-column label="总销量" prop="salesVolume" />
				<el-table-column label="所属供应商" prop="supplierName" />
				<el-table-column label="状态" prop="status" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.status === 1">下架</span>
						<span v-else> 上架</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="340">
					<template #default="{ row, $index }">
						<el-button class="ml-1" text type="primary" @click="handleCommand('putShelves', row, $index)" v-if="row.status === 1">上架</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('removeShelves', row, $index)" v-if="row.status === 2">下架</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('edit', row, $index)" v-if="row.status === 1">编辑</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('preview', row, $index)">预览</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('detail', row, $index)" v-if="row.status === 2">详情</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('delete', row, $index)" v-if="row.status === 1">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<PreviewDialog ref="previewDialogRef" />
	</div>
</template>

<script lang="ts" name="systemDatasourceConf" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ElMessageBox } from 'element-plus';
import { getProductsList, updateProductsStatus, deleteProduct, previewProductDetail } from '/@/api/culture/products';
import { ElNotification } from 'element-plus';
import PreviewDialog from './dialog.vue';
// const EasyTable = defineAsyncComponent(() => import('/@/components/EasyTable/index.vue'));

// 搜索变量
const queryRef = ref();

const previewDialogRef = ref();

// 上下架状态枚举列表
const statusList = [
	{ label: '已下架', value: 1 },
	{ label: '已上架', value: 2 },
];
/**
 * 处理列表项的操作
 *
 * 该函数旨在对列表中选定项进行操作。
 * 操作的功能分别有：上架、下架、编辑、详情、删除、预览。
 *
 * @param {string | number} id - 列表项的唯一标识符。
 * @param {string} type - 操作类型
 * putShelves 上架
 * removeShelves 下架
 * preview 预览
 * edit 编辑
 * delete 删除
 * detail 详情
 */
const handleCommand = (command: Table.Command, row: any, index: number) => {
	switch (command) {
		case 'putShelves':
			ElMessageBox.confirm(`请确认是否将 ${row.spuName} 上架`, '上架确认', {
				confirmButtonText: '上架',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					updateProductsStatus({
						id: row.id,
						status: row.status === 1 ? 2 : 1,
					}).then((res) => {
						if (res.msg) {
							ElNotification({
								type: 'error',
								message: res.msg,
							});
						}
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'removeShelves':
			ElMessageBox.confirm(`请确认是否将 ${row.spuName} 下架`, '下架确认', {
				confirmButtonText: '下架',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					updateProductsStatus({
						id: row.id,
						status: row.status === 1 ? 2 : 1,
					}).then((res) => {
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'preview':
			previewProductDetail(row.id).then((res) => {
				previewDialogRef.value.openDialog(res.data);
			});
			break;
		case 'edit':
			router.push({
				path: `/culture/cultureProducts/productsManage/form`,
				query: {
					id: row.id,
					type: 'edit',
				},
			});
			break;
		case 'delete':
			ElMessageBox.confirm(`请确认是否将 ${row.spuName} 删除，删除动作无法恢复，请谨慎操作。`, '删除商品', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					deleteProduct(row.id).then((res) => {
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'detail':
			router.push({
				path: `/culture/cultureProducts/productsManage/form`,
				query: {
					id: row.id,
					type: 'detail',
				},
			});
		default:
		// return 0;
	}
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		spuCode: '',
		spuName: '',
		supplierName: '',
		status: '',
	},
	pageList: getProductsList,
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const router = useRouter();
const handleAdd = (type: string) => {
	// 新增虚拟商品 type === 'virtual'
	if (type === 'virtual')
		router.push({
			path: `/culture/cultureProducts/productsManage/form`,
			query: {
				id: null,
				type: type,
			},
		});
	else router.push('/culture/cultureProducts/productsManage/form');
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
