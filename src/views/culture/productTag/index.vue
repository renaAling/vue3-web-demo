<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form inline :model="state.queryForm" label-position="right" @submit.native.prevent ref="queryRef" @keyup.enter="getDataList">
					<el-form-item label="标签名称：" prop="keywords">
						<el-input v-model.trim="state.queryForm.keywords" placeholder="请输入标签名称" style="width: 230px" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">搜索</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleAdd" type="primary">添加标签</el-button>
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
				<el-table-column prop="id" label="ID" min-width="60" />
				<el-table-column label="标签名称" prop="tagName" min-width="100" :show-overflow-tooltip="true" />
				<el-table-column label="标签说明" prop="tagNote" min-width="200" :show-overflow-tooltip="true" />
				<el-table-column prop="startTime" label="生效期间" width="350">
					<template #default="{ row }"> {{ row.startTime }} - {{ row.endTime }} </template>
				</el-table-column>
				<el-table-column prop="status" label="是否显示" min-width="100" fixed="right">
					<template #default="{ row }">
						<el-switch
							v-model="row.status"
							:active-value="1"
							:inactive-value="0"
							active-text="显示"
							inline-prompt
							inactive-text="隐藏"
							@change="onchangeIsShow(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="150" />
				<el-table-column prop="position" label="商城标题位置" min-width="120">
					<template #default="{ row }">
						<span>{{ row.position === 0 ? '标题下' : '标题前' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="sort" label="排序" min-width="50" />
				<el-table-column label="操作" width="120" fixed="right">
					<template #default="{ row, index }">
						<el-button link type="primary" @click="handleCommand('edit', row, index)">编辑</el-button>
						<el-button v-if="row.owner > 0" link type="primary" @click="handleCommand('delete', row, index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			<!-- <el-drawer
				:visible.sync="visible"
				:title="editData.id ? '商品标签编辑' : '商品标签新增'"
				direction="rtl"
				custom-class="demo-drawer"
				size="900px"
				ref="drawer"
				:wrapperClosable="editData.id ? false : true"
				:modal-append-to-body="false"
				class="infoBox"
				@close="visible = false"
			>
				<edit-tag v-if="visible" :edit-data="editData" ></edit-tag>
			</el-drawer> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox, ElNotification } from 'element-plus';
import { productTagListApi, productTagStatusApi, productTagDelete } from '/@/api/culture/product/product';
// import editTag from './editTag.vue';
import { useStore } from 'vuex';
// 搜索变量
const queryRef = ref();
const router = useRouter();
const visible = ref(false);
const editDataDialogConfig = ref({
	visible: false,
});

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: productTagListApi,
	queryForm: {
		keywords: '',
	},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleAdd = () => {
	router.push('/culture/productTag/createTag');
};

const onchangeIsShow = (row: any) => {
	productTagStatusApi(row.id, row.status)
		.then((res:any) => {
			useMessage().success('操作成功');
			getDataList();
		})
		.catch((e) => {
			return (row.status = !row.status);
		});
};
onMounted(() => {
	const store = useStore();
	console.log('store', store);
});

const handleCommand = (command: Table.Command, row: any, index: number) => {
	switch (command) {
		case 'edit':
			router.push({
				path: '/culture/productTag/createTag',
				query: {
					id: row.id,
				},
			});
			visible.value = true;
			break;
		case 'delete':
			ElMessageBox.confirm(`确定删除当前标签吗？`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					productTagDelete(row.id).then((res:any) => {
						useMessage().success('删除成功');
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
	}
};
</script>

<style scoped lang="scss">
.infoBox {
	::v-deep.el-drawer__header {
		margin-bottom: 0;
		font-size: 20px;
	}
	::v-deep.el-icon-arrow-down,
	::v-deep .el-icon-arrow-up {
		display: none;
	}
}
</style>
