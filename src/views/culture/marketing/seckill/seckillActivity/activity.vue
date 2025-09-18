<template>
	<el-dialog :before-close="onClose" :title="type == 1 ? '设置活动价' : '设置限量'" v-model="visible" width="470px"
		:close-on-click-modal="false" draggable>
		<el-form ref="formRef" :model="form" label-width="100px">
			<template v-if="type == 1">
				<el-form-item label="活动方式" required >
					<el-radio-group v-model="form.type">
						<el-radio :label="0">活动价</el-radio>
						<el-radio :label="1">活动折扣(%)</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="form.type == 0">
					<el-input-number v-model="form.price" type="number" :precision="2" :min="0" :max="99999"
						:controls="false" class="input_width">
					</el-input-number>
				</el-form-item>
				<el-form-item v-if="form.type == 1">
					<el-input-number v-model="form.discount" type="number" :step="1" step-strictly :min="0" :max="100"
						:controls="false" class="input_width">
					</el-input-number>
				</el-form-item>
			</template>
			<template v-if="type == 2">
				<el-form-item label="设置限量" required>
					<el-input-number v-model="form.activity_stock" :step="1" step-strictly type="number" :min="1"
						:max="99999" class="input_width">
					</el-input-number>
				</el-form-item>
			</template>
		</el-form>
		<template #footer>
			<div class="acea-row row-right">
				<el-button  @click="onClose">取 消</el-button>
				<el-button  type="primary" :disabled="loading" @click="confirmSet">确 定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="activityForm" setup>
const visible = ref(false);
const loading = ref(false);

let type = ref(1);
const formRef = ref();
// 提交表单数据
const form = reactive({
	type: 0,
	price: '',
	discount: '',
	activity_stock: 1,
});

const onClose = () => {
	visible.value = false;
	setTimeout(() => {
		Object.assign(form, {
			type: 0,
			price: '',
			discount: '',
			activity_stock: 1,
		});
		loading.value = false;
	}, 500);
};
const emit = defineEmits(['onChange']);
const confirmSet = () => {
	loading.value = true;
	emit('onChange', form, type.value);
	onClose();
};
defineExpose({
    visible,
	type
})
</script>

<style lang="scss" scoped>
.input_width {
	width: 330px;
}
</style>
