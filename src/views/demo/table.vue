<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<easy-table
					:options="options"
					:columns="tableSearchColumn"
					:table-data="tableData"
					@command="handleCommand"
					@search="handleSearch"
					:loading="loading"
				>
					<template #extra><el-button type="primary" plain @click="handleAdd">新增</el-button></template>
					<template #spu="{ row }">
						<span>演示slot使用{{ row.spu }}</span>
					</template>

					<template #operate="{ row }">
						<el-button type="primary" plain @click="handleAdd">新增</el-button>
					</template>
					<!-- <template #spu="{ row }">
						<span>演示slot使用{{ row.spu }}</span>
					</template> -->
				</easy-table>
			</el-row>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus';
const EasyTable = defineAsyncComponent(() => import('/@/components/EasyTable/index.vue'));

interface Products {
	spu: number | string;
	imgUrl: string;
	productName: string;
	priceSection: string;
	wuliu: string;
	kucun: string;
	total: string;
	supplier: string;
	status: string;
}

const loading = ref(false);
// 表格数据
const tableData: Products[] = [
	{
		spu: 'A0000001',
		productName: '熊猫地铁票',
		imgUrl: 'https://q5.itc.cn/q_70/images03/20240520/ceb0d77d1be24eea8cd3826994eac1c1.jpeg',
		priceSection: '12.50-13.50',
		wuliu: '自提',
		kucun: '50000',
		total: '888',
		supplier: '北京XXXXXX有限公司',
		status: '上架',
	},
	{
		spu: 'A0000001',
		productName: '熊猫地铁票',
		imgUrl: 'https://q5.itc.cn/q_70/images03/20240520/ceb0d77d1be24eea8cd3826994eac1c1.jpeg',
		priceSection: '12.50-13.50',
		wuliu: '自提',
		kucun: '50000',
		total: '888',
		supplier: '北京XXXXXX有限公司',
		status: '上架',
	},
];
const statuList = [
	{ label: '正常', value: 1 },
	{ label: '禁用', value: 0 },
];
const options = {
	showSearch: true,
	showToolbar: true,
	showPagination: true,
};
// 开启表格搜索配置
const tableSearchColumn: Table.Column<Products>[] = [
	{ prop: 'spu', label: 'SPU', search: true, slot: 'spu' },
	{ prop: 'imgUrl', label: '商品主图', type: 'image' },
	{ prop: 'productName', label: '商品名称', search: true },
	{ prop: 'priceSection', label: '价格区间' },
	{ prop: 'wuliu', label: '物流方式' },
	{ prop: 'kucun', label: '可用库存' },
	{ prop: 'total', label: '总销量' },
	{ prop: 'supplier', label: '所属供应商', search: true },
	{
		prop: 'status',
		label: '状态',
		search: true,
		searchFiledType: 'Select',
		searchFieldOptions: {
			data: statuList,
		},
	},
	{
		label: '操作',
		slot: 'operate',
		// buttons: [
		// 	{ name: '上架', type: 'primary', command: 'putShelves' },
		// 	{ name: '下架', type: 'primary', command: 'removeShelves' },
		// 	{ name: '编辑', type: 'primary', command: 'edit' },
		// 	{ name: '预览', type: 'primary', command: 'preview' },
		// 	{ name: '详情', type: 'primary', command: 'detail' },
		// 	{ name: '删除', type: 'primary', command: 'delete' },
		// ],
	},
	// {
	// 	prop: 'status',
	// 	label: '状态',
	// 	search: true,
	// 	searchFiledType: 'Select',
	// 	searchFieldOptions: {
	// 		data: statuList,
	// 	},
	// 	// render: ({ row }) => h(ElTag, { type: row.status === 1 ? 'success' : 'danger' }, () => (row.status === 1 ? '正常' : '禁用')),
	// },
	// {
	// 	type: 'date',
	// 	prop: 'date',
	// 	label: '日期',
	// 	search: true,
	// 	searchFiledType: 'DatePicker',
	// 	searchFieldOptions: { valueFormat: 'x' },
	// },
	// { prop: 'address', label: '地址', slot: 'address', showOverflowTooltip: true },
	// {
	// 	width: '150',
	// 	label: '操作',
	// 	buttons: [
	// 		{ name: '编辑', type: 'primary', command: 'edit' },
	// 		{ name: '删除', type: 'primary', command: 'delete' },
	// 	],
	// },
];
const handleCommand = (command: Table.Command, row: any, index: number) => {
	switch (command) {
		case 'edit':
			console.log('edit');
			break;
		case 'delete':
			console.log('delete');
			break;
		default:
			break;
	}
};

// 搜索事件
const handleSearch = (info: any) => {
	loading.value = true;
	setTimeout(() => {
		loading.value = false;
	}, 1000);
};
const handleAdd = () => {
	console.log('dianji ');
};
const handleAction = (row: object, type?: string) => {
	console.log('row', row);
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
const handleOperate = (id: string | number, type: string): void => {
	console.log('id', id);
	console.log('type', type);
	switch (type) {
		case 'putShelves':
			ElMessageBox.confirm('请确认是否将熊猫地铁票上架', '上架确认', {
				confirmButtonText: '上架',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					// enableFlow(flow.flowId).then((res) => {
					// 	handleQuery();
					// });
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'removeShelves':
			ElMessageBox.confirm('请确认是否将熊猫地铁票下架', '下架确认', {
				confirmButtonText: '下架',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					// enableFlow(flow.flowId).then((res) => {
					// 	handleQuery();
					// });
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'preview':
		// return 30;
		case 'edit':
		// return 30;
		case 'delete':
			ElMessageBox.confirm('请确认是否将 熊猫地铁票 删除，删除动作无法恢复，请谨慎操作。', '删除商品', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					// enableFlow(flow.flowId).then((res) => {
					// 	handleQuery();
					// });
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'detail':
		// return 30;
		default:
		// return 0;
	}
};
</script>
<style scoped></style>
