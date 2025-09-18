<template>
	<div>
		<el-card>
			<el-tabs v-model="activeName" class="demo-tabs activeTbs" @tab-change="handleClick">
				<el-tab-pane label="分组信息" name="0"></el-tab-pane>
				<el-tab-pane v-if="groupId" label="分组商品" name="1"></el-tab-pane>
			</el-tabs>
		</el-card>
		<el-card v-if="activeName === '0'" class="activeOne">
			<div class="ml10">
				<div class="activeTitle mb10">基础信息</div>
				<el-form v-loading="loadingFrom" ref="ruleFormRef" :model="dataForm" label-width="140px" :rules="rules" style="width: 500px">
					<el-form-item label="分组名称：" prop="name">
						<el-input v-model.trim="dataForm.name" placeholder="请输入分组名称" maxlength="30" style="width: 400px" />
					</el-form-item>
					<el-form-item label="分组说明：" prop="description">
						<el-input v-model.trim="dataForm.description" placeholder="请输入分组说明" maxlength="100" style="width: 400px" />
					</el-form-item>
					<!-- <el-form-item label="分组名称：" prop="name" style="width: 100%">
						<el-input v-model.trim="dataForm.name" placeholder="请输入分组名称" maxlength="30" />
					</el-form-item>
					<el-form-item label="分组图标：" prop="img" style="width: 100%">
						<upload-img v-model:image-url="dataForm.img" />
					</el-form-item>
					<el-form-item label="启用状态：" prop="status" style="width: 100%">
						<el-switch v-model="dataForm.status" />
					</el-form-item>
					<el-form-item label="分组描述：" prop="description" style="width: 100%">
						<el-input v-model.trim="dataForm.description" placeholder="请输入分组说明" maxlength="100"/>
					</el-form-item> -->
				</el-form>
				<div class="footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
				</div>
			</div>
		</el-card>
		<div class="my-2 mx-10" v-if="activeName === '1'">
			<el-button type="primary" @click="onAdd" icon="Plus">添加商品 </el-button>
			<el-button @click="onDelete">批量移除 </el-button>
		</div>
		<el-card v-if="activeName === '1'" class="activeTwo mx-10">
			<el-table ref="multipleTableRef" v-loading="loading" :data="dataList" row-key="productId" border @selection-change="handleSelectionChange">
				<!-- :cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle" -->
				<el-table-column type="selection" width="55" />
				<el-table-column property="productId" label="SPU" min-width="120" />
				<el-table-column label="商品图" min-width="80">
					<template #default="{ row }">
						<el-image style="width: 60px; height: 60px" :src="row.image" />
					</template>
				</el-table-column>
				<el-table-column property="name" label="商品名称" min-width="120" show-overflow-tooltip />
				<el-table-column property="price" label="支付现金" min-width="120" show-overflow-tooltip />
				<el-table-column property="scorePrice" label="支付积分" min-width="120" show-overflow-tooltip />
				<el-table-column property="originalPrice" label="原价" min-width="120" show-overflow-tooltip />
				<el-table-column property="sales" label="销量" min-width="120" show-overflow-tooltip />
				<el-table-column property="stock" label="库存" min-width="120" show-overflow-tooltip />
				<el-table-column property="firstUpTime" label="首次上架时间" min-width="180" show-overflow-tooltip />
				<el-table-column property="recentUpTime" label="最近上架时间" min-width="180" show-overflow-tooltip />
				<el-table-column property="merchantName" label="所属供应商" min-width="120" show-overflow-tooltip />
				<el-table-column property="businessName" label="所属商家" min-width="120" show-overflow-tooltip />
				<el-table-column label="操作" min-width="120" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleDel(row)">移除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<add-dialog @refresh="getProductInfoPage()" ref="formDialogRef" />
	</div>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ElMessageBox } from 'element-plus';
import { getProductInfoPageApi, groupAddApi, getByIdApi, batchDelApi, updateApi } from '/@/api/culture/commodity/commodityGroup';
import { useMessage, useMessageBox } from '/@/hooks/message';
const router = useRouter();
const route = useRoute();
const activeName = ref('0');
const loadingFrom = ref(false);
const dataForm = ref({
	status: true,
}) as any;
const ruleFormRef = ref() as any;
const dataList = ref<any[]>([]);
const loading = ref(false);
const groupId = ref<string>('');
const multipleTableRef = ref();
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
	description: [
		{ required: true, message: '请输入分组描述', trigger: 'blur' },
		{ min: 5, message: '请输入至少5个字符', trigger: 'blur' },
	],
});
const selectable = ref() as any;
const selection = ref([]) as any;
const addDialog = defineAsyncComponent(() => import('./add.vue'));
const formDialogRef = ref() as any;

onMounted(() => {
	console.log('route', route);
	if (route.query?.id) {
		dataForm.value.id = route.query.id;
		groupId.value = route.query.id.toString();
		getById(route.query.id);
		getProductInfoPage();
	}
});
// 获取分组详情
const getById = async (id: any) => {
	loadingFrom.value = true;
	try {
		const { code, data, msg } = await getByIdApi(Number(id));
		if (code === 0) {
			const { id, name, description } = data;
			dataForm.value.id = Number(id);
			dataForm.value.name = name;
			dataForm.value.description = description;
			loadingFrom.value = false;
		} else {
			useMessage().error(msg);
			loadingFrom.value = false;
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		loadingFrom.value = false;
	}
};

// 获取分组商品列表
const getProductInfoPage = async () => {
	loading.value = true;
	try {
		const { code, data, msg } = await getProductInfoPageApi({ groupId: route.query.id });
		if (code === 0) {
			dataList.value = data;
			loading.value = false;
		} else {
			useMessage().error(msg);
			loading.value = false;
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		loading.value = false;
	}
	//
};

// 切换tabs
const handleClick = (tab, event) => {};

// 保存
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			try {
				await ElMessageBox.confirm('是否保存该分组信息', '确认保存？', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				});
			} catch {
				return;
			}
			try {
				const { code, msg } = route.query?.id ? await updateApi(dataForm.value) : await groupAddApi(dataForm.value);
				if (code === 0) {
					useMessage().success(`${route.query?.id ? '编辑' : '新增'}成功`);
					// groupId.value = data;
					// activeName.value = '1';
					resetForm(ruleFormRef.value);
				} else {
					useMessage().error(msg);
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	router.push({
		path: '/culture/commodity/commodityGroup/index',
	});
};

// 添加
const onAdd = () => {
	formDialogRef.value.openDialog(groupId.value);
};

const handleSelectionChange = (val: any[]) => {
	selection.value = val;
};
const handleDel = async (row: any) => {
	try {
		await ElMessageBox.confirm('是否移除该分组商品', '确认删除？', {
			confirmButtonText: '确认删除',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	const params = {
		productIdList: [row.productId],
		groupId: Number(groupId.value),
	};
	console.log('params', params);
	try {
		const { code, msg } = await batchDelApi(params);
		if (code === 0) {
			useMessage().success('删除成功');
			getProductInfoPage();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 批量移除
const onDelete = async () => {
	if (!selection.value.length) {
		useMessage().warning('请选择要删除的分组商品');
		return;
	}
	console.log('selection', selection.value);
	try {
		await ElMessageBox.confirm('是否移除选中的分组商品', '确认删除？', {
			confirmButtonText: '确认删除',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	const params = {
		productIdList: selection.value.map((item: any) => item.productId),
		groupId: Number(groupId.value),
	};
	try {
		const { code, msg } = await batchDelApi(params);
		if (code === 0) {
			useMessage().success('批量删除成功');
			selection.value.length = [];
			getProductInfoPage();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
</script>

<style scoped lang="scss">
.activeTbs {
	width: 80%;
	margin: 0 auto 0;
}
.activeOne {
	width: 80%;
	margin: 20px auto 0;
}
.activeTitle {
	font-size: 22px;
}
.footer {
	width: 400px;
	text-align: center;
	margin-top: 50px;
}
</style>
