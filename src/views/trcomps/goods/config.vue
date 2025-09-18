<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" v-loading="loading" ref="formRef" label-width="100px" :rules="formRules">
				<el-card>
					<el-form-item label="商家" prop="merchantName">
						<el-input
							v-model="model.merchantName"
							:disabled="true"
							type="text"
							placeholder="请输入商家名称"
							maxlength="50"
							show-word-limit
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="渠道商品ID" prop="productCode">
						<el-input
							v-model="model.productCode"
							:disabled="true"
							type="text"
							placeholder="请输入第三方渠道商品ID"
							maxlength="50"
							show-word-limit
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="商品名称" prop="name">
						<el-input
							v-model="model.name"
							type="text"
							placeholder="请输入商品名称"
							maxlength="50"
							show-word-limit
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="商品图" prop="image">
						<upload-img v-model:image-url="model.image" />
					</el-form-item>
					<el-form-item label="分组" prop="brandIds">
						<el-select v-model="model.brandIds" multiple collapse-tags placeholder="选择分组(可多选)">
							<el-option v-for="item in groupSelect" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>
				</el-card>
				<el-card class="mt-[12px]">
					<!-- <el-form-item label="渠道售价" prop="cost">
						<div>{{ model.cost ? model.cost + ' 元' : '/' }}</div>
					</el-form-item>
					<el-form-item label="划线价" prop="otPrice">
						<div class="flex" style="width: 100%;">
							<el-input-number v-model="model.otPrice" :step="0.01" :min="0" :max="999999.99"
							:precision="2"
								controls-position="right" />
							<span class="ml-[10px]">元</span>
						</div>
					</el-form-item>
					<el-form-item label="售价" prop="price">
						<div class="flex" style="width: 100%;">
							<el-input-number v-model="model.price" :step="0.01" :min="0" :max="999999.99" :precision="2"
								controls-position="right" />
							<span class="ml-[10px]">元</span>
						</div>
					</el-form-item> -->
					<el-form-item label="上架状态" prop="isShow">
						<el-radio-group v-model="model.isShow">
							<el-radio :label="1">上架</el-radio>
							<el-radio :label="0">下架</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-card>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { productInfo, groupList, updateGoods } from '/@/api/goodStore/goods';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const dialogTitle = ref('编辑商品');
const formRef = ref();
const scopeId = ref<string | null>('');
const groupSelect = ref<any>([]);
const loading = ref(false);
const model = ref<any>({
	productCode: '',
	name: '',
	image: '',
	cost: 0,
	isShow: 1,
	price: 0,
	otPrice: 0,
	brandIds: [],
});
//   表单校验规则
const formRules = reactive<FormRules>({
	price: [{ required: true, message: '售价不能为空' }],
	isShow: [{ required: true, message: '上架状态不能为空' }],
	name: [{ required: true, message: '商品名称不能为空' }],
	brandIds: [{ required: true, message: '分组不能为空' }],
});

const getGroupList = () => {
	groupList().then((res) => {
		groupSelect.value = res.data;
	});
};
const openDialog = async (id: string | null) => {
	scopeId.value = id;
	if (id) {
		dialogTitle.value = '编辑商品';
		try {
			const { code, data } = await productInfo(id);
			if (code === 0) {
				const detail = Object.assign(data);
				model.value = detail;
				console.log(model.value);
				model.value.isShow = model.value.isShow ? 1 : 0;
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}
	visible.value = true;
	nextTick(() => {
		getGroupList();
	});
};

const closeMyDialog = () => {
	visible.value = false;
};
const onSubmit = async () => {
	const valid = await formRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		if (!model.value.otPrice) model.value.otPrice = 0;
		loading.value = true;
		await updateGoods(model.value);
		useMessage().success('编辑成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 输入框回车事件
const handleKeyUp = (enterable: Boolean) => {
	if (!enterable) return;
	onSubmit();
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		productCode: '',
		name: '',
		image: '',
		cost: 0,
		isShow: 1,
		price: 0,
		otPrice: 0,
		brandIds: [],
	};
	closeMyDialog();
};
// 取消
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
.map-input {
	height: 456px;
}

.map {
	width: 715px;
	height: 366px;
}

.add-img {
	width: 150px;
	height: 150px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background-color: transparent;
	border: 1px dashed #cdd0d6;
	border-radius: 8px;
	cursor: pointer;
	margin-left: 10px;

	.icon-plus {
		width: 24px;
		height: 24px;
	}
}

.box {
	position: relative;

	.del {
		position: absolute;
		width: 1em;
		height: 1em;
		top: 0;
		right: 0;
	}
}
</style>
<style>
.popper-select {
	:is(li)[aria-haspopup='true'] {
		.el-checkbox {
			display: none;
		}
	}
}
</style>
