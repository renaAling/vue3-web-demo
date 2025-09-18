<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="add_btn">
				<el-button type="primary" @click="handleAddMenu({ id: 0, name: '顶层目录' })">新增商品分类 </el-button>
			</div>
			<el-table
				:data="dataList"
				highlight-current-row
				row-key="id" border
				:cellstyle="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column prop="name" label="名称" min-width="200">
					<template #default="{ row }"> {{ row.name }} | {{ row.id }}</template>
				</el-table-column>
				<el-table-column label="分类图标" min-width="120">
					<template #default="{ row }">
						<div class="table-image-wrapper">
							<el-image :preview-teleported="true" :src="row.icon" :preview-src-list="[row.icon]" v-if="row.icon" fit="cover" />
							<img v-else src="/@/assets/imgs/moren.jpg" alt="" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="排序" prop="sort" min-width="120" />
				<el-table-column label="状态" min-width="120" fixed="right">
					<template #default="{ row }">
						<el-switch
							v-model="row.isShow"
							:active-value="true"
							:inactive-value="false"
							inline-prompt
							active-text="显示"
							inactive-text="隐藏"
							@change="onchangeIsShow(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="220" fixed="right">
					<template #default="{ row }">
						<el-button v-if="row.level < 2" link type="primary" @click="handleAddMenu(row)">添加子目录</el-button>
						<el-button link type="primary" @click="handleEditMenu(row)">编辑</el-button>
						<el-button link type="primary" @click="handleDelete(row)">删除</el-button>
						<!-- <el-button link type="primary" @click="handleCopy(row)">复制</el-button> -->
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 新增/编辑弹窗 -->
		<config-dialog ref="configDialogRef" @refresh="getDataList"></config-dialog>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { productCategoryListApi, productCategoryDeleteApi, productCategoryShowApi } from '/@/api/culture/product/product';
import { handleTree } from '/@/utils/parsing';
import { useStore } from 'vuex';

const configDialog = defineAsyncComponent(() => import('./components/config.vue'));

const state: BasicTableProps = reactive<BasicTableProps>({});
//  table hook
const { tableStyle } = useTable(state);

// Refs
const configDialogRef = ref();
const loading = ref(false);
const store = useStore();
const editDialogConfig = ref({
	isCreate: 0,
	prent: {},
	data: {},
	biztype: 1,
});
const dataList = ref([]);
// Methods
const onchangeIsShow = (row) => {
	productCategoryShowApi(row.id)
		.then(() => {
			useMessage().success('修改成功');
			store.commit('product/SET_AdminProductClassify', []);
			console.log('store', store);
			getDataList();
		})
		.catch(() => {
			row.isShow = !row.isShow;
		});
};

const handleEditMenu = (rowData) => {
	editDialogConfig.value.isCreate = 1;
	editDialogConfig.value.data = rowData;
	editDialogConfig.value.prent = rowData;
	configDialogRef.value.openDialog(editDialogConfig.value, dataList.value);
};

const handleAddMenu = (rowData) => {
	editDialogConfig.value.isCreate = 0;
	editDialogConfig.value.prent = rowData;
	editDialogConfig.value.data = {};
	configDialogRef.value.openDialog(editDialogConfig.value, dataList.value);
};

const handleDelete = (rowData) => {
	useMessageBox()
		.confirm('确定删除品类吗？该品类优惠券将同步删除。')
		.then(async () => {
			try {
				const { code, msg } = await productCategoryDeleteApi(rowData.id);
				if (code === 0) {
					getDataList();
					useMessage().success('删除成功');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		});
};

const handleCopy = (rowData: any) => {
	// productCategoryShowApi(rowData.id)
	// 	.then(() => {
	// 		useMessage().success('复制成功');
	// 		getDataList();
	// 	})
	// 	.catch(() => {});
};

const getDataList = () => {
	productCategoryListApi()
		.then((res) => {
			const list = res.data.map((item) => ({
				...item,
				parentId: item.pid,
				children: [],
			}));
			dataList.value = handleTree(list);
			console.log('dataList.value', dataList.value);
			loading.value = false;
		})
		.catch((res) => {
			useMessage().error(res.msg);
			loading.value = false;
		});
};

const hideEditDialog = () => {
	setTimeout(() => {
		editDialogConfig.value.prent = {};
		editDialogConfig.value.type = 0;

		getDataList();
	}, 200);
};

// Lifecycle
onMounted(async () => {
	await getDataList();
});
</script>
<style lang="scss" scoped>
.add_btn {
	margin-bottom: 10px;
}
.demo-image__preview {
	display: inline-block;
	.el-image {
		width: 50px;
		height: 50px;
	}
}
.table-image-wrapper {
	width: 40px;
	height: 40px;
	display: inline-block;
	vertical-align: middle;

	.el-image {
		width: 100%;
		height: 100%;
		border-radius: 4px;
	}
}
</style>
