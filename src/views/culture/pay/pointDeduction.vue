<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="form">
				<el-form :model="form" label-position="top" ref="queryRef" v-loading="loading">
					<el-form-item label="积分抵扣起用额度" prop="id">
						<div class="display-flex ml-5">
							<div>
								<el-input-number
									v-model="form.minAmountDeduction"
									:precision="2"
									step-strictly
									:step="0.01"
									:min="0"
									style="width: 440px"
									placeholder="积分抵扣起用额度"
								/>
								<span class="ml-2">元</span>
							</div>
							<div class="from-tips">设置商城支付时，需要达到多少金额才可以使用积分抵扣。</div>
						</div>
					</el-form-item>

					<el-form-item label="积分最高抵扣额度" prop="id">
						<div class="display-flex ml-5">
							<div>
								<el-input-number
									v-model="form.maxDeductionRatio"
									:precision="2"
									step-strictly
									:step="0.01"
									:min="0"
									style="width: 440px"
									placeholder="积分最高抵扣额度"
								/>
								<span class="ml-2">%</span>
							</div>
							<div class="from-tips">设置积分可抵扣商品总价的最高百分比。</div>
						</div>
					</el-form-item>
					<el-form-item>
						<div style="margin: 0 auto">
							<el-button type="primary" @click="handleSubmit" :disabled="loading">保存配置</el-button>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" name="pay-channels">
import { useMessage } from '/@/hooks/message';
import { getScorePayConfigApi, updateScorePayConfigApi } from '/@/api/culture/pointDeduction';

onMounted(() => {
	getDataList();
});

const loading = ref(false);
const form = ref({
	minAmountDeduction: null,
	maxDeductionRatio: null,
});

const getDataList = async () => {
	try {
		loading.value = true;
		const { data, msg, code } = await getScorePayConfigApi(form);
		if (code == 0) {
			form.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const handleSubmit = async () => {
	console.log('form', form.value);
	try {
		loading.value = true;
		const { msg, code } = await updateScorePayConfigApi(form.value);
		if (code == 0) {
			useMessage().success('保存成功');
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
</script>
<style lang="scss" scoped>
.from-tips {
	font-size: 12px;
	color: #909399;
	line-height: 12px;
	text-align: left;
	margin-top: 5px;
	margin-bottom: 30px;
}
.form {
	width: 500px;
	margin: 60px 0 40px 60px;
}
:deep(.el-input-number__decrease) {
	display: none;
}
:deep(.el-input-number__increase) {
	display: none;
}
</style>
