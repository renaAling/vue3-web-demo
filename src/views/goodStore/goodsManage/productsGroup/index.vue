<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item label="商家ID" prop="merchantCode">
					<el-input placeholder="请输入商家ID" v-model="state.queryForm.merchantCode" clearable />
				</el-form-item>
				<el-form-item label="商家名称" prop="merchantName">
					<el-input placeholder="请输入商家名称" v-model="state.queryForm.merchantName" clearable />
				</el-form-item>
				<el-form-item label="分组名称" prop="groupName">
					<el-input placeholder="请输入分组名称" v-model="state.queryForm.groupName" clearable />
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
					<el-button @click="resetQuery" icon="Refresh">重置</el-button>
				</el-form-item>
			</el-form>
			<el-row class="mb10">
				<el-button type="primary" icon="plus" @click="configDialogRef.openDialog()">新增分组</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="商家名称" prop="merchantName" show-overflow-tooltip />
				<el-table-column label="图标" prop="icon">
					<template #default="{ row }">
						<img :src="row.imageUrl" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="分组ID" prop="groupCode" />
				<el-table-column label="分组名称" prop="groupName" />
				<el-table-column label="描述" prop="remark" />
				<el-table-column label="关联商品数" prop="spuNum" />
				<el-table-column label="排序值" prop="sort" >
					<template #default="{ row }">
						<el-button type="primary" link class="underline" @click="changeSort(row)">{{ row.sort }}</el-button>
					</template>
				</el-table-column>
				<el-table-column label="启/禁用" prop="status">
					<template #default="{ row }">
						<el-switch v-model="row.status" :active-value="2" :inactive-value="1" :before-change="() => beforeChangeStatus(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleOperation(row.groupCode, 'edit')">编辑</el-button>
						<el-button type="primary" link @click="handleOperation(row, 'associatedGoods')">关联商品</el-button>
						<el-button type="primary" link @click="handleOperation(row.groupCode, 'del')">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogFormVisible" title="修改排序" width="500">
			<el-form :model="formSort" :rules="formRules" ref="sortForm">
				<el-form-item label="排序" prop="sort">
					<el-input v-model="formSort.sort" placeholder="请输入" oninput="value=value.replace(/^0|[^0-9]/g, '')" autocomplete="off" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button type="primary" @click="submitSort"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 新增/编辑分组  -->
		<ConfigDialog @refresh="getDataList()" ref="configDialogRef" />
		<!-- 关联商品  -->
		<AssociatedGoods @refresh="getDataList()" ref="associatedGoodsDialogRef" />
	</div>
</template>

<script lang="ts" name="gs-shop-store" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { pageList, upDateSort, wdGroupDel, wdGroupUpdateStatus } from '/@/api/goodStore/productsGroup';
import type { FormInstance, FormRules } from 'element-plus';

// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));
const AssociatedGoods = defineAsyncComponent(() => import('./goodsList.vue'));

const queryRef = ref();
const configDialogRef = ref();
const associatedGoodsDialogRef = ref();
const selectObjs = ref<any>([]);
const dialogFormVisible = ref(false);
const sortForm = ref();
const formSort = reactive({
	sort: 0,
});
const formRules = reactive<FormRules>({
	sort: [{ required: true, message: '排序值不能为空' }],
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList,
	queryForm: {},
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const beforeChangeStatus = async (row: any) => {
	const msg = row.status == '1' ? '确定要启用该账户吗?' : '确定要禁用该账户吗?';
	try {
		await useMessageBox().confirm(msg);
	} catch {
		return;
	}
	try {
		let status;
		if (row.status == '1') status = 2;
		if (row.status == '2') status = 1;
		const params = {
			groupCode: row.groupCode,
			status: status,
		};
		let res = await wdGroupUpdateStatus(params);
		if (res.code != 0) {
			return useMessage().error(res.msg);
		}
		getDataList();
		useMessage().success('操作成功');
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const changeSort = (row: any) => {
	Object.assign(formSort, row);
	dialogFormVisible.value = true;
};
const submitSort = async () => {
	try {
		await upDateSort(formSort);
		dialogFormVisible.value = false;
		useMessage().success('编辑成功');
		getDataList();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 操作
const handleOperation = async (id: number, type: string) => {
	if (type === 'edit') {
		configDialogRef.value.openDialog(id);
	} else if (type === 'associatedGoods') {
		associatedGoodsDialogRef.value.openDialog(id);
	} else if (type === 'del') {
		try {
			await useMessageBox().confirm(`确定要将选中商品批量删除吗`, '提示');
		} catch (err: any) {
			return false;
		}
		try {
			let { code, msg } = await wdGroupDel({ groupCode: id });
			if (code != 0) {
				useMessage().error(msg);
				return;
			}
			useMessage().success('已删除');
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
