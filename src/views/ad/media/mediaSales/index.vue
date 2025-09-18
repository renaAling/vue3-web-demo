<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="SPU" prop="productCode">
						<el-input placeholder="请输入spu编码" v-model="state.queryForm.productCode" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="媒体名称" prop="spuName">
						<el-input placeholder="请输入媒体名称" v-model="state.queryForm.spuName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="所属运营商" prop="operatorCode">
						<el-select v-model="state.queryForm.operatorCode" placeholder="请选择所属运营商" style="width: 230px" clearable filterable>
							<el-option v-for="(item, index) in providerList" :key="item.code" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="媒体状态" prop="isShow">
						<el-select v-model="state.queryForm.isShow" placeholder="请选择媒体状态" style="width: 230px" clearable>
							<el-option v-for="(item, index) in StatusList" :key="index" :label="item.label" :value="item.value"></el-option>
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
					<el-button @click="handleAdd" class="ml10" icon="folder-add" type="primary"> 新建 </el-button>
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
				<el-table-column label="SPU" prop="productCode" show-overflow-tooltip width="200" />
				<el-table-column label="媒体主图" prop="image" show-overflow-tooltip>
					<template #default="{ row }">
						<img :src="row.image" alt="" style="width: 90px; height: 70px" />
					</template>
				</el-table-column>
				<el-table-column label="媒体名称" prop="name" width="200" show-overflow-tooltip />
				<el-table-column label="价格区间" prop="priceRange" show-overflow-tooltip width="120" />
				<el-table-column label="可用库存" prop="stock" width="90" />
				<el-table-column label="总销量" prop="sales" width="90" />
				<el-table-column label="所属运营商" prop="operatorName" width="200" />
				<el-table-column label="状态" prop="isShow" show-overflow-tooltip width="120">
					<template #default="{ row }">
						<span>{{ row.isShow ? '已上架' : '已下架' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="340" fixed="right">
					<template #default="{ row, $index }">
						<el-button class="ml-1" text type="primary" @click="handleCommand('putShelves', row, $index)" v-if="!row.isShow">上架</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('removeShelves', row, $index)" v-if="row.isShow">下架</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('edit', row, $index)" v-if="!row.isShow">编辑</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('preview', row, $index)">预览</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('detail', row, $index)" v-if="row.isShow">详情</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('delete', row, $index)" v-if="!row.isShow">删除</el-button>
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
import { ElNotification } from 'element-plus';
import PreviewDialog from './dialog.vue';
import { StatusList } from './enums';
import { getMediaSalesList, mediaDelete, mediaStatusUpdate, previewMediaDetail } from '/@/api/ad/media';
import { getServiceProvidersList } from '/@/api/ad/serviceProvider';

// 搜索变量
const queryRef = ref();

const previewDialogRef = ref();

const providerList = ref([]) as any;

onMounted(() => {
	getServiceProviders();
});

const getServiceProviders = async () => {
	let res = await getServiceProvidersList({
		current: 1,
		size: 100,
	});
	providerList.value = res.data.records;
	console.log('res', res);
};
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
			ElMessageBox.confirm(`请确认是否将 ${row.name} 上架`, '上架确认', {
				confirmButtonText: '上架',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					mediaStatusUpdate({
						id: row.id,
						isShow: row.isShow ? false : true,
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
			ElMessageBox.confirm(`请确认是否将 ${row.name} 下架`, '下架确认', {
				confirmButtonText: '下架',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					mediaStatusUpdate({
						id: row.id,
						isShow: !row.isShow ? true : false,
					}).then((res) => {
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'preview':
			previewMediaDetail(row.id).then((res) => {
				previewDialogRef.value.openDialog(res.data);
			});
			break;
		case 'edit':
			router.push({
				path: `/ad/media/mediaSales/form`,
				query: {
					id: row.id,
					type: 'edit',
				},
			});
			break;
		case 'delete':
			ElMessageBox.confirm(`请确认是否将 ${row.name} 删除，删除动作无法恢复，请谨慎操作。`, '删除商品', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					mediaDelete(row.id).then((res) => {
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'detail':
			router.push({
				path: `/ad/media/mediaSales/form`,
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
		goodsType: 2,
	},
	pageList: getMediaSalesList,
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const router = useRouter();
const handleAdd = () => {
	router.push('/ad/media/mediaSales/form');
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
