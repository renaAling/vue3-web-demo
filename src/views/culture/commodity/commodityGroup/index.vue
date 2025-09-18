<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<!-- <el-form inline :model="state.queryForm" label-position="right" @submit.native.prevent ref="queryRef" @keyup.enter="getDataList">
					<el-form-item label="分组名称：" prop="name">
						<el-input v-model.trim="state.queryForm.name" placeholder="请输入分组名称" style="width: 230px" clearable></el-input>
					</el-form-item>
					<el-form-item label="分类描述" prop="description">
						<el-input v-model.trim="state.queryForm.description" placeholder="请输入分类描述" style="width: 230px" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getDataList">查询</el-button>
						<el-button @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form> -->
			</el-row>
			<div class="mb-5">
				<el-button type="primary" @click="onEdit">新增分组 </el-button>
			</div>
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<!-- <el-table-column prop="id" label="序号" width="60" />
				<el-table-column prop="name" label="分组名称" />
				<el-table-column prop="description" label="分组描述" />
				<el-table-column prop="description" label="分组图标"
					><template #default="{ row }">
						<div style="display: flex; justify-content: center">
							<img :src="row.icon" style="width: 50px; height: 50px" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="description" label="启用状态"
					><template #default="{ row }">
						<el-switch v-model="row.status" @click="onStatusChange(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" width="100">
					<template #default="{ row }">
						<div style="display: flex; align-items: center">
							<el-button link type="primary" @click="onEdit(row)">编辑 </el-button>
							<el-button link type="primary" @click="onDelete(row)">删除 </el-button>
						</div>
					</template>
				</el-table-column> -->
				<el-table-column prop="id" label="ID" min-width="60" />
				<el-table-column prop="name" label="分组名称" min-width="180" :show-overflow-tooltip="true" />
				<el-table-column prop="productCount" label="商品数量" min-width="150" show-overflow-tooltip />
				<el-table-column prop="description" label="分组说明" min-width="150" show-overflow-tooltip />
				<el-table-column label="操作" min-width="40" fixed="right">
					<template #default="{ row }">
						<div style="display: flex; align-items: center">
							<el-button link type="primary" @click="onEdit(row)">编辑 </el-button>
							<el-button link type="primary" @click="onDelete(row)">删除 </el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { groupPageApi, groupDel } from '/@/api/culture/commodity/commodityGroup';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';

const router = useRouter();
// 搜索变量
const queryRef = ref();
const onDelete = async (row: any) => {
	try {
		await ElMessageBox.confirm('是否删除该商品分组信息', '确认删除？', {
			confirmButtonText: '确认删除',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	try {
		const { code, msg } = await groupDel(Number(row.id));
		if (code === 0) {
			useMessage().success('删除成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const onEdit = (row?: any) => {
	console.log('row,row');
	if (row?.id) {
		router.push({
			path: '/culture/commodity/commodityGroup/edit',
			query: {
				id: row.id,
			},
		});
	} else {
		router.push({
			path: '/culture/commodity/commodityGroup/edit',
		});
	}
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const onStatusChange = async (row: any) => {
	console.log('row');
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: groupPageApi,
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
