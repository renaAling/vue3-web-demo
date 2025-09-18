<template>
	<div class="divBox">
		<el-card class="box-card" :bordered="false" shadow="never">
			<el-form ref="dataForm" :model="ruleForm" :rules="rules" label-width="210px" class="demo-dataForm" v-loading="loading">
				<el-form-item prop="retailStoreSwitch" label="分销启用：">
					<template #label>
						<div class="flex items-center">
							<span>分销启用：</span>
							<el-tooltip
								class="item"
								effect="dark"
								content="关闭后分销员C端商详不可见分销按钮，用户购物不会记录在所属分销员名下，也不会为所属分销员计算返佣。"
								placement="top-start"
							>
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-switch v-model="ruleForm.retailStoreSwitch" :active-value="1" :inactive-value="0" inline-prompt active-text="开" inactive-text="关" />
				</el-form-item>
				<el-form-item prop="retailStoreRelationLifespan">
					<template #label>
						<div class="flex items-center">
							<span>分销关系建立后的有效期：</span>
							<el-tooltip
								class="item"
								effect="dark"
								content="上级分销员和下级分销员关联关系的有效期，从关联发生日起算，到期后解绑，即上级分销员不再享受针对该下级分销员的返佣，该下级分销员自动享受一级分销返佣"
								placement="top-start"
							>
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-input-number
						v-model.trim="ruleForm.retailStoreRelationLifespan"
						placeholder="请输入"
						:min="0"
						:step="1"
						:precision="1"
						step-strictly
						:max="9999"
						class="selWidth"
					></el-input-number>
					<div class="ml-2">天</div>
				</el-form-item>
				<el-form-item prop="retailStoreBindingType">
					<template #label>
						<div class="flex items-center">
							<span>分销关系建立的用户身份：</span>
							<el-tooltip class="item" effect="dark" content="分享关联二维码、链接和商详分销页给何种用户可关联其为下级分销员" placement="top-start">
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-radio-group v-model="ruleForm.retailStoreBindingType">
						<el-radio :label="1">仅新用户</el-radio>
						<el-radio :label="0">全部用户</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="retailStoreOrderMinPrice">
					<template #label>
						<div class="flex items-center">
							<span>返佣最低订单金额：</span>
							<el-tooltip
								class="item"
								effect="dark"
								content="下级分销员订单金额大于等于多少时，计算返佣，低于此值不计算上级分销员的返佣"
								placement="top-start"
							>
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-input-number
						v-model.trim="ruleForm.retailStoreOrderMinPrice"
						:min="0"
						:max="100"
						class="selWidth"
						placeholder="请输入"
					/>
					<span class="ml-2">元</span>
				</el-form-item>
				<el-form-item prop="retailStoreBrokerageFreezingTime">
					<template #label>
						<div class="flex items-center">
							<span>分销返佣到账时间：</span>
						</div>
					</template>
					<div class="flex items-center">
						<el-input-number
							v-model.trim="ruleForm.retailStoreBrokerageFreezingTime"
							:min="0"
							:max="30"
              :precision="0"
							class="selWidth"
							placeholder="请输入"
						/>
						<div class="ml-2">天</div>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="loading" @click="submitForm()">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="distributor-config">
import { configApi, configUpdateApi } from '/@/api/member/distributor';
import { useMessage } from '/@/hooks/message';
const loading = ref(false);
const dataForm = ref();
const rules = ref({
	retailStoreSwitch: [{ required: true, message: '请选择是否启用分销', trigger: 'blur' }],
	retailStoreOrderMinPrice: [{ required: true, message: '请输入返佣最低订单金额', trigger: 'blur' }],
	retailStoreBrokerageFreezingTime: [{ required: true, message: '请输入分销返佣到账时间', trigger: 'blur' }],
	retailStoreBindingType: [{ required: true, message: '请选择分销关系绑定', trigger: 'blur' }],
	retailStoreRelationLifespan: [{ required: true, message: '请输入分销关系建立后的有效期', trigger: 'blur' }],
});
const ruleForm = reactive({
	retailStoreSwitch: 0,
	retailStoreRelationLifespan: 0,
	retailStoreBindingType: 0,
	retailStoreOrderMinPrice: 0,
	retailStoreBrokerageFreezingTime: 0,
});
// 详情
const getDetail = async () => {
	try {
		loading.value = true;
		const res = await configApi();
		Object.assign(ruleForm, res.data);
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
	}
};
getDetail();
const submitForm = async () => {
	try {
		const valid = await dataForm.value.validate().catch(() => {});
		if (!valid) {
			return false;
		}
		loading.value = true;
		await configUpdateApi(ruleForm);
		useMessage().success('更新成功');
		getDetail();
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped lang="scss">
.selWidth {
	width: 400px;
}
</style>
