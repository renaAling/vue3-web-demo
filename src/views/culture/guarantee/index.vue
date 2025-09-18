<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="mb-5">
				<el-button type="primary" @click="handlerOpenEdit(0)">添加保障服务 </el-button>
			</div>
			<el-table v-loading="listLoading" :data="tableData.data" row-key="id" border>
				<!-- 			:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle" -->
				<el-table-column prop="id" label="ID" min-width="50" />
				<el-table-column prop="name" label="服务条款" min-width="150" show-overflow-tooltip />
				<el-table-column label="服务条款图标" min-width="80" show-overflow-tooltip>
					<template #default="{ row }">
						<div class="demo-image__preview line-heightOne">
							<el-image :src="row.icon" :preview-src-list="[row.icon]" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="content" label="服务内容描述" min-width="250" show-overflow-tooltip />
				<el-table-column prop="sort" label="排序" min-width="80" show-overflow-tooltip />
				<el-table-column label="创建时间" min-width="150" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.createTime }}</span>
					</template>
				</el-table-column>
				<el-table-column label="是否显示" min-width="110" fixed="right" show-overflow-tooltip>
					<template #default="{ row }">
						<el-switch
							v-model="row.isShow"
							:active-value="true"
							:inactive-value="false"
							active-text="显示"
							inactive-text="隐藏"
							@click.native="onchangeIsShow(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right" show-overflow-tooltip>
					<template #default="{ row }">
						<a @click="handlerOpenEdit(1, row)">编辑</a>
						<el-divider direction="vertical"></el-divider>
						<a @click="handlerOpenDel(row)">删除</a>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
			<el-form :model="formValue" :rules="rules" @keyup.enter="submit" ref="queryRef" label-width="110px">
				<el-form-item label="服务条款" prop="name">
					<el-input placeholder="请输入服务条款" v-model="formValue.name" clearable />
				</el-form-item>
				<el-form-item label="服务内容描述" prop="content">
					<el-input placeholder="请输入服务内容描述" v-model="formValue.content" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" clearable />
				</el-form-item>
				<el-form-item label="服务条款图标" prop="icon">
					<upload-img v-model:image-url="formValue.icon" :fileType="['image/jpeg', 'image/jpg', 'image/png']" />
					<div class="from-tips">（100*100px）</div>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input-number v-model="formValue.sort" :min="0" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel(queryRef)">取消</el-button>
					<el-button type="primary" @click="submit(queryRef)"> 提交 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { guaranteeListApi, guaranteeDeleteApi, guaranteeShowApi, guaranteeAddApi, guaranteeUpdateApi } from '/@/api/culture/product';
import { useMessage, useMessageBox } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';

interface TableDataType {
	data: any[];
	total: number;
}

interface FormValueType {
	name?: string;
	content?: string;
	icon?: string;
	sort?: number;
}

const tableData = ref<TableDataType>({ data: [], total: 0 });
const listLoading = ref<boolean>(false);
const keyNum = ref<number>(0);
const id = ref<number>(0);
const tableFrom = ref<{ page: number; limit: number }>({ page: 1, limit: 10 });
const dialogTitle = ref<string>('');
const dialogVisible = ref<boolean>(false);
const queryRef = ref<any>();
const formValue = ref<FormValueType>({
	name: '',
	content: '',
	icon: '',
	sort: 0,
});
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入服务条款', trigger: 'blur' }],
	content: [{ required: true, message: '请输入服务内容描述', trigger: 'blur' }],
	icon: [{ required: true, message: '请上传服务条款图标', trigger: 'blur' }],
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
});
const getDataList = async () => {
	listLoading.value = true;
	try {
		const { code, data, msg } = await guaranteeListApi();
		if (code === 0) {
			tableData.value.data = data;
			listLoading.value = false;
		} else {
			listLoading.value = false;
			useMessage().error(msg);
		}
	} catch {
		return;
	}
};

const handlerOpenEdit = (isCreate: number, editDate?: any) => {
	id.value = editDate ? editDate.id : 0;
	dialogTitle.value = isCreate === 0 ? '添加服务条款' : '编辑服务条款';
	if (editDate) {
		formValue.value = Object.assign({}, editDate);
	}
	dialogVisible.value = true;
};

const submit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			const params = {
				id: id.value,
				name: formValue.value.name,
				content: formValue.value.content,
				icon: formValue.value.icon,
				sort: formValue.value.sort,
			};
			try {
				const request = !id.value ? await guaranteeAddApi(params) : await guaranteeUpdateApi(params);
				const { code, msg } = request;
				if (code === 0) {
					useMessage().success('操作成功');
					cancel(queryRef.value);
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				listLoading.value = false;
				useMessage().error(err.msg);
				return;
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};

const cancel = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	dialogVisible.value = false;
};

const handlerOpenDel = async (rowData: any) => {
	try {
		await useMessageBox().confirm('删除当前保障服务吗', '提示');
	} catch {
		return;
	}
	try {
		const { code, msg } = await guaranteeDeleteApi(rowData.id);
		if (code === 0) {
			useMessage().success('操作成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const onchangeIsShow = async (row: any) => {
	try {
		const { code, msg } = await guaranteeShowApi(row.id);
		if (code === 0) {
			useMessage().success('操作成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

onMounted(() => {
	getDataList();
});
</script>

<style>
.el-message-box__headerbtn {
	right: 24px;
}
.from-tips {
	font-size: 12px;
	color: #909399;
	line-height: 12px;
	text-align: left;
}
.demo-image__preview {
	display: inline-block;
	.el-image {
		width: 50px;
		height: 50px;
	}
}
</style>
