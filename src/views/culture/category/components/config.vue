<template>
	<el-dialog :title="dialogTitle" v-model="visible" destroy-on-close :close-on-click-modal="false" width="540px">
		<el-form ref="formRef" :model="model" label-width="100px">
			<el-form-item label="分类名称：" prop="name" :rules="[{ required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }]">
				<el-input v-model.trim="model.name" maxlength="8" placeholder="分类名称" />
			</el-form-item>
			<el-form-item label="父级：">
				<el-cascader
					v-model="model.pid"
					:disabled="scopeId ? true : false"
					:options="parentOptions"
					filterable
					:props="categoryProps"
					style="width: 100%"
					ref="cascader"
					@change="handleChange"
				/>
			</el-form-item>
			<el-form-item label="分类图标：">
				<div class="upLoadPicBox">
					<div class="upLoad">
						<upload-img v-model:imageUrl="model.icon" dir="media"> </upload-img>
						<div class="from-tips">建议尺寸(180*180)</div>
					</div>
				</div>
			</el-form-item>
			<el-form-item class="mb30" label="排序：">
				<el-input-number v-model.trim="model.sort" :min="0" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="cancel(formRef)">取消</el-button>
			<el-button type="primary" :loading="loadingBtn" @click="onSubmit(formRef)"> 确定 </el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { productCategoryUpdateApi, productCategoryAddApi } from '/@/api/culture/product/product';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useStore } from 'vuex';
import type { FormInstance } from 'element-plus';

// Emits
const emit = defineEmits(['refresh']);

// Refs
const visible = ref(false);
const dialogTitle = ref('新增商品分类');
const loadingBtn = ref(false);
const store = useStore();
const scopeId = ref(null);
const cascader = ref();
const formRef = ref();
const model = ref({
	icon: null as string | null,
	name: null as string | null,
	pid: null as number | null,
	sort: 0,
	id: 0,
	level: 0,
});
const categoryProps = ref({
	value: 'id',
	label: 'name',
	children: 'children',
	expandTrigger: 'hover',
	checkStrictly: true,
	emitPath: false,
});
const parentOptions = ref<any[]>([]);

// Methods
const handleChange = () => {
	console.log('model', model);
	// if (cascader.value) {
	// 	const checkedNodes = cascader.value.getCheckedNodes();
	// 	console.log('checkedNodes', checkedNodes);
	// 	if (checkedNodes && checkedNodes.length > 0) {
	// 		model.prent.level = checkedNodes[0].level;
	// 	}
	// }
};

const close = () => {
	emit('refresh');
};
const addTreeListLabelForCasCard = (arr: any[], child: string) => {
	arr.forEach((item) => {
		treeListCheckLevelLT3ForDisabled(item[child]);
	});
};

const treeListCheckLevelLT3ForDisabled = (children: any[]) => {
	if (!children) return;
	children.forEach((j) => {
		if (j.level >= 2) {
			j.disabled = true;
		} else {
			treeListCheckLevelLT3ForDisabled(j.children);
		}
	});
};

const handlerSubmit = (formName: string) => {
	const formRef = (document.querySelector(`[ref="${formName}"]`) as any)?.validate;
	if (formRef) {
		formRef((valid: boolean) => {
			if (!valid) return;
			handlerSaveOrUpdate(model.value.isCreate === 0);
		});
	}
};

const handlerSaveOrUpdate = (isSave: boolean) => {
	loadingBtn.value = true;

	if (isSave) {
		if (model.value.pid === 0) {
			model.value.level = 1;
		}
		if (!model.value.level) {
			model.value.level = parseInt(props.prent.level) + 1;
		}

		const apiCall = productCategoryAddApi;

		apiCall(model.value)
			.then(() => {
				useMessage().success('创建目录成功');
				if (props.biztype.value !== 2) {
					// 更新全局状态
					// this.$store.commit('product/SET_AdminProductClassify', []);
				} else {
					localStorage.clear('articleClass');
				}
				emit('hideEditDialog');
			})
			.catch((error: any) => {
				console.error('Error in handlerSaveOrUpdate:', error);
			})
			.finally(() => {
				loadingBtn.value = false;
			});
	} else {
		if (props.biztype.value !== 2) {
			if (model.value.pid === props.editData.id) {
				useMessage().warning('父级不能选当前分类');
				return;
			}
		} else {
			model.value.pid = Array.isArray(model.value.pid) ? model.value.pid[0] : model.value.pid;
		}

		const apiCall = productCategoryUpdateApi;

		apiCall(model.value)
			.then(() => {
				useMessage().success('更新目录成功');
				if (props.biztype.value !== 2) {
					// this.$store.commit('product/SET_AdminProductClassify', []);
				} else {
					localStorage.clear('articleClass');
				}
				emit('hideEditDialog');
			})
			.catch((error: any) => {
				console.error('Error in handlerSaveOrUpdate:', error);
			})
			.finally(() => {
				loadingBtn.value = false;
			});
	}
};
const openDialog = async (editDialogConfig: any, allTreeList: any) => {
	scopeId.value = editDialogConfig.data.id;
	parentOptions.value = [...allTreeList];
	addTreeListLabelForCasCard(parentOptions.value, 'child');
	if (scopeId.value) {
		dialogTitle.value = '编辑商品分类';
		const { icon, name, pid, sort, id, level } = editDialogConfig.data;
		model.value = {
			...model.value,
			icon,
			name,
			pid,
			sort,
			id,
			level,
		};
	} else {
		console.log('editDialogConfig', editDialogConfig);
		dialogTitle.value = '新增商品分类';
		model.value = {
			...model.value,
			pid: editDialogConfig.prent.id,
			level: parseInt(editDialogConfig.prent.level) + 1,
		};
		console.log('model.value', model.value);
	}
	visible.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否${scopeId.value ? '编辑' : '新建'}商品分类`, `${scopeId.value ? '编辑' : '新建'}商品分类`);
			} catch {
				return false;
			}
			try {
				const request = scopeId.value ? productCategoryUpdateApi : productCategoryAddApi;
				if (model.value.pid) model.value.level = 2;
				else model.value.level = 1;
				const params = {
					...model.value,
				};
				const { code, msg } = await request(params);
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '编辑' : '新建'}成功`);
					store.commit('product/SET_AdminProductClassify', []);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		icon: null,
		name: null,
		pid: null,
		sort: 0,
		id: 0,
		level: 0,
	};
	closeMyDialog();
};

const cancel = async (formEl: FormInstance | undefined) => {
	if (scopeId.value) return resetForm(formEl);
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
	} catch {
		return false;
	}
	resetForm(formEl);
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
/**
 * 上传图片的照相机
 */
.upLoadPicBox {
	display: inline-block;
	cursor: pointer;
}
.cameraIconfont {
	color: #898989;
	font-size: 26px;
}
</style>
