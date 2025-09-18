<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form inline :model="state.queryForm" label-position="right" @submit.native.prevent ref="queryRef" @keyup.enter="getDataList">
					<el-form-item label="卡密名称：" prop="name">
						<el-input v-model.trim="state.queryForm.name" placeholder="请输入卡片名称" style="width: 230px" clearable></el-input>
					</el-form-item>
					<el-form-item label="商品名称：" prop="productName">
						<el-input v-model.trim="state.queryForm.productName" placeholder="请输入商品名称" style="width: 230px" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getDataList">查询</el-button>
						<el-button @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleAdd" type="primary">添加卡密库</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="id" label="ID" min-width="60" />
				<el-table-column label="卡密库名称" prop="name" min-width="100" />
				<el-table-column label="关联商品" prop="productName" min-width="100" />
				<el-table-column label="关联商品规格" prop="productAttrValueName" min-width="100" />
				<el-table-column label="未使用/卡密总数" prop="totalNum" min-width="200">
					<template #default="{ row }"> {{ row.totalNum - row.usedNum ? row.totalNum - row.usedNum : 0 }} / {{ row.totalNum }} </template>
				</el-table-column>
				<el-table-column label="备注" prop="remark" min-width="200" :show-overflow-tooltip="true" />
				<el-table-column prop="createTime" label="创建期间" width="350"> </el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template #default="{ row, $index }">
						<el-button link type="primary" @click="handleCommand('edit', row, $index)">编辑</el-button>
						<el-button link type="primary" @click="handleCommand('management', row, $index)">管理卡密</el-button>
						<el-button link type="primary" @click="handleCommand('delete', row, $index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" :title="!form.id ? '新增卡密库' : '编辑卡密库'" width="600" @close="onResetForm(dialogFormRef)">
				<el-form class="logistics-info-form" ref="dialogFormRef" :model="form" label-width="120px" :rules="formRules">
					<el-form-item label="卡密库名称：" prop="name">
						<el-input v-model.trim="form.name" maxlength="32"></el-input>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model.trim="form.remark" :rows="2" type="textarea" maxlength="100"></el-input>
					</el-form-item>
				</el-form>
				<template #footer>
					<el-button type="info" size="default" @click="onResetForm(dialogFormRef)">取消</el-button>
					<el-button type="primary" size="default" :loading="loading" @click="onSubmit(dialogFormRef)">提交</el-button>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox, ElNotification } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { cdkeyPageApi, cdkeyDeleteApi, cdkeySaveApi, cdkeyUpdateApi } from '/@/api/culture/commodity/cdkeyId';
// import editTag from './editTag.vue';
import { useStore } from 'vuex';
// 搜索变量
const queryRef = ref();
const dialogFormRef = ref();
const router = useRouter();
const visible = ref(false);
const loading = ref(false);
const dialogVisible = ref(false);
const form = ref({
	id: '',
	name: '',
	remark: '',
});

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: cdkeyPageApi,
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

onMounted(() => {
	const store = useStore();
	console.log('store', store);
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 操作
const handleCommand = (command: Table.Command, row: any, index: number) => {
	switch (command) {
		case 'edit':
			form.value.id = row.id;
			Object.assign(form.value, row);
			dialogVisible.value = true;
			break;
		case 'management':
			router.push({
				path: '/culture/commodity/cdkeyId/management',
				query: {
					id: row.id,
					title: row.name ? row.name : '--',
				},
			});
			visible.value = true;
			break;
		case 'delete':
			ElMessageBox.confirm(`确定删除当前卡密库吗？`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					cdkeyDeleteApi(row.id).then((res: any) => {
						useMessage().success('删除卡密库成功');
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
	}
};

// 新增卡密库
const handleAdd = () => {
	dialogVisible.value = true;
};

const formRules = reactive<FormRules>({
	name: [{ required: true, message: '请输入卡密库名称', trigger: 'blur' }],
});
const onResetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	Object.assign(form.value, {
		id: '',
		name: '',
		remark: '',
	});
	dialogVisible.value = false;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid: any) => {
		if (!valid) return;
		dialogVisible.value = false;
		loading.value = true;
		try {
			const { code, msg } = form.value.id ? await cdkeyUpdateApi(form.value) : await cdkeySaveApi(form.value);
			if (code === 0) {
				useMessage().success(`${form.value.id ? '编辑' : '添加'}成功`);
				onResetForm(dialogFormRef.value);
				getDataList();
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		} finally {
			loading.value = false;
		}
	});
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
