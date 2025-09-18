<template>
	<div class="divBox">
		<el-card class="box-card" :bordered="false" shadow="never">
			<el-form ref="dataForm" :model="ruleForm" :rules="rules" label-width="180px" class="demo-dataForm" v-loading="loading">
				<el-form-item prop="retailStoreSwitch" label="分销启用：">
					<template #label>
						<div class="flex items-center">
							<span>分销启用：</span>
							<el-tooltip class="item" effect="dark" content="商城分销功能开启关闭" placement="top-start">
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-radio-group v-model="ruleForm.retailStoreSwitch">
						<el-radio :label="1">开启</el-radio>
						<el-radio :label="0">关闭</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="retailStoreLine">
					<template #label>
						<div class="flex items-center">
							<span>满额分销最低金额：</span>
							<el-tooltip class="item" effect="dark" content="满额分销满足金额开通分销权限" placement="top-start">
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-input-number
						v-model.trim="ruleForm.retailStoreLine"
						placeholder="请输入"
						:min="0"
						class="selWidth"
					></el-input-number>
				</el-form-item>
				<el-form-item prop="retailStoreBindingType">
					<template #label>
						<div class="flex items-center">
							<span>分销关系绑定：</span>
							<el-tooltip class="item" effect="dark" content="所有用户”指所有没有上级推广人的用户，“新用户”指新注册的用户" placement="top-start">
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-radio-group v-model="ruleForm.retailStoreBindingType">
						<el-radio :label="0">所有用户</el-radio>
						<el-radio :label="1">新用户</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="retailStoreBrokerageFirstRatio">
					<template #label>
						<div class="flex items-center">
							<span>返佣比例：</span>
							<el-tooltip class="item" effect="dark" content="订单交易成功后给上级返佣的比例0 - 100,例:5 = 返订单金额的5%" placement="top-start">
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-input-number
						v-model.trim="ruleForm.retailStoreBrokerageFirstRatio"
						:min="0"
						:max="100"
						class="selWidth"
						placeholder="请输入"
					></el-input-number>
					<span>%</span>
				</el-form-item>
				<el-form-item prop="retailStoreBrokerageShareNode">
					<template #label>
						<div class="flex items-center">
							<span>开始冻结规则：</span>
							<el-tooltip class="item" effect="dark" content="从哪个状态开始计算冻结时间" placement="top-start">
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-select v-model="ruleForm.retailStoreBrokerageShareNode" placeholder="请选择" class="selWidth">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="retailStoreBrokerageFreezingTime">
					<template #label>
						<div class="flex items-center">
							<span>发放冻结时长：</span>
							<el-tooltip class="item" effect="dark" content="冻结多久进行发放" placement="top-start">
								<el-icon>
									<Warning />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<div class="flex items-center">
						<el-input-number
						v-model.trim="ruleForm.retailStoreBrokerageFreezingTime"
						:min="0"
						:max="30"
						class="selWidth"
						placeholder="佣金冻结时间(天)"
					></el-input-number>
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
import{ configApi, configUpdateApi } from '/@/api/member/distributor';
import { useMessage } from '/@/hooks/message';
const loading = ref(false);
const dataForm = ref()
const options = ref([
	{
		value: 'pay',
		label: '订单支付后',
	},
	{
		value: 'receipt',
		label: '订单收货后',
	},
	{
		value: 'complete',
		label: '订单完成后',
	},
]);
const rules = ref({
	retailStoreSwitch: [{ required: true, message: '请选择是否启用分销', trigger: 'blur' }],
	retailStoreBrokerageFirstRatio: [{ required: true, message: '请输入返佣比例', trigger: 'blur' }],
	retailStoreBrokerageFreezingTime: [{ required: true, message: '请输入冻结时间', trigger: 'blur' }],
	retailStoreBrokerageShareNode: [{ required: true, message: '请选择冻结规则', trigger: 'blur' }],
	retailStoreBindingType: [{ required: true, message: '请选择分销关系绑定', trigger: 'blur' }],
	retailStoreLine: [{ required: true, message: '请输入满额分销最低金额', trigger: 'blur' }],
});
const ruleForm = reactive({
	retailStoreSwitch: 0,
	retailStoreLine: 0,
	retailStoreBindingType: 0,
	retailStoreBrokerageFirstRatio: 0,
	retailStoreBrokerageShareNode: '',
	retailStoreBrokerageFreezingTime: 0
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
getDetail()
const submitForm = async () => {
	try {
		const valid = await dataForm.value.validate().catch(() => {});
		if (!valid) {
			return false;
		}
		loading.value = true;
		await configUpdateApi(ruleForm)
		useMessage().success('更新成功');
		getDetail()
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
