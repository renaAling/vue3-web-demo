<template>
	<div class="layout-padding">
		<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
			<!-- 基础信息 -->
			<el-card>
				<p class="title">基础信息</p>
				<el-form-item label="活动名称：" prop="name" class="custom-width">
					<el-input v-model="model.name" placeholder="请输入活动名称" clearable maxlength="30" />
				</el-form-item>
				<el-form-item label="活动时间：" prop="activityTime" class="custom-width">
					<el-date-picker
						v-model="model.activityTime"
						type="datetimerange"
						range-separator="-"
						start-placeholder="请选择开始时间"
						end-placeholder="请选择结束时间"
						value-format="YYYY-MM-DD HH:mm:ss"
					/>
				</el-form-item>
			</el-card>
			<!-- 分组投放 -->
			<el-card>
				<p class="title">分组投放</p>
				<el-form-item label="参与对象：" prop="identityTypes">
					<el-checkbox-group v-model="model.identityTypes">
						<el-checkbox :label="item.value" v-for="(item, index) in identityTypesEnums" :key="index">{{ item.label }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-card>
			<!-- 初始抽奖次数 -->
			<el-card>
				<p class="title">初始抽奖次数</p>
				<el-form-item class="custom-form-item">
					<el-checkbox v-model="model.everyDayLotteryNumRule" @click="checkOnlyOnBox">
						每天有
						<el-input
							v-model="model.dayNum"
							type="text"
							placeholder="请输入数量"
							:disabled="!model.everyDayLotteryNumRule"
							maxlength="5"
							@input="changeNumber('dayNum')"
							clearable
						/>次抽奖机会
					</el-checkbox>
					<el-checkbox v-model="model.firstLotteryNumRule" @click="checkOnlyOnBox">
						初始赠送
						<el-input
							v-model="model.originNum"
							type="text"
							placeholder="请输入数量"
							:disabled="!model.firstLotteryNumRule"
							maxlength="5"
							style=""
							@input="changeNumber('originNum')"
							clearable
						/>次抽奖机会
					</el-checkbox>
				</el-form-item>
			</el-card>
			<!-- 次数获取 -->
			<el-card>
				<p class="title">次数获取</p>
				<el-form-item class="custom-form-item">
					<el-checkbox v-model="model.getPersonalLotteryNumRule" @click="checkOnlyOnBox">
						订单满
						<el-input
							v-model="model.buyPrice"
							type="text"
							placeholder="请输入金额"
							maxlength="5"
							@input="changeNumber('buyPrice')"
							clearable
							:disabled="!model.getPersonalLotteryNumRule"
						/>元，得
						<el-input
							v-model="model.limitNum"
							type="text"
							placeholder="请输入数量"
							maxlength="5"
							@input="changeNumber('limitNum')"
							clearable
							:disabled="!model.getPersonalLotteryNumRule"
						/>次抽奖机会，最多获取
						<el-input
							v-model="model.maxNum"
							type="text"
							placeholder="请输入数量"
							maxlength="5"
							@input="changeNumber('maxNum')"
							clearable
							:disabled="!model.getPersonalLotteryNumRule"
						/>次
					</el-checkbox>
					<el-checkbox v-model="model.friendHelpLotteryNumRule" @click="checkOnlyOnBox">
						好友助力成功得
						<el-input
							v-model="model.shareNum"
							type="text"
							placeholder="请输入数量"
							maxlength="5"
							style=""
							@input="changeNumber('shareNum')"
							clearable
							:disabled="!model.friendHelpLotteryNumRule"
						/>次抽奖机会，最多获取
						<el-input
							v-model="model.shareMaxNum"
							type="text"
							placeholder="请输入数量"
							maxlength="5"
							style=""
							@input="changeNumber('shareMaxNum')"
							clearable
							:disabled="!model.friendHelpLotteryNumRule"
						/>次
					</el-checkbox>
				</el-form-item>
			</el-card>
			<!-- 中奖规则 -->
			<el-card>
				<p class="title">中奖规则</p>
				<el-form-item class="custom-form-item">
					<el-checkbox v-model="model.maxWinRule" @click="checkOnlyOnBox">
						单用户最多可中奖
						<el-input
							v-model="model.limitWin"
							type="text"
							placeholder="请输入数量"
							maxlength="5"
							:disabled="!model.maxWinRule"
							@input="changeNumber('limitWin')"
							clearable
						/>次
					</el-checkbox>
				</el-form-item>
			</el-card>
			<!-- 领奖方式 -->
			<el-card>
				<p class="title">领奖方式</p>
				<el-form-item prop="prizeWay" class="custom-form-item">
					<el-radio-group v-model="model.prizeWay">
						<el-radio label="1">线下领奖</el-radio>
						<el-radio label="2">联系客服</el-radio>
					</el-radio-group>
				</el-form-item>
				<div class="flex-row">
					<div v-if="model.prizeWay === '1'">
						<span>领奖地址：</span>
						<el-input />
					</div>
					<div v-if="model.prizeWay === '2'">
						<span>客服二维码：</span>
						<upload-img v-model:imageUrl="model.imageUrl" dir="activity"></upload-img>
					</div>
				</div>
			</el-card>
			<footer class="footer">
				<el-button type="primary" @click="submitForm(formRef)" :disabled="isDisabled" :loading="loading">保存</el-button>
				<el-button @click="handleCancel">取消</el-button>
			</footer>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="cultureProductsForm">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules, UploadProps, UploadRequestOptions } from 'element-plus';
import { ElNotification, ElMessageBox } from 'element-plus';
import { modelTypes } from './types';
import { getSupplierList, productSaveOrUpdate, previewProductDetail, getDetail } from '/@/api/culture/products';
import { identityTypesEnums } from './enum';
import { useRoute } from 'vue-router';
let route = useRoute(); // 生成组件唯一id

const formRef = ref<FormInstance>();
const loading = ref(false);
const router = useRouter();
const model = ref<modelTypes>({
	name: '',
	activityTime: '',
	identityTypes: [],
	everyDayLotteryNumRule: false,
	dayNum: null,
	firstLotteryNumRule: false,
	originNum: null,
	getPersonalLotteryNumRule: false,
	buyPrice: null,
	limitNum: null,
	maxNum: null,
	friendHelpLotteryNumRule: false,
	shareNum: null,
	shareMaxNum: null,
	maxWinRule: false,
	limitWin: null,
	imageUrl: '',
	prizeWay: null,
	prizeWayInfo: null,
});
const formRules = reactive<FormRules>({
	name: [{ required: true, message: '请输入活动名称' }],
	activityTime: [{ required: true, message: '请选择活动时间' }],
	identityTypes: [{ required: true, message: '请至少选择一个对象' }],
	awardType: [{ required: true, message: '请选择领奖方式' }],
});
watch(
	() => model.value.activityTime,
	(val) => {
		if (val) {
			model.value.startTime = val[0];
			model.value.endTime = val[1];
		} else {
			model.value.startTime = '';
			model.value.endTime = '';
		}
	}
);

const test = (e: any) => {
	console.log('e', e);
};

// 处理只允许点击框体才能勾选/取消勾选，label文本禁止点击
const checkOnlyOnBox = (event: any) => {
	if ('el-checkbox__inner' != event.target.className) {
		//点击的不是前面的小框框,阻止默认行为
		event.preventDefault();
	} else {
		//点击的是前面的小框框
	}
};
// 处理所有输入校验
const changeNumber = (val: string) => {
	const reg = /^[1-9][0-9]{0,4}$/;
	const updateValue = (key: string) => {
		const value = String(model.value[key]);
		if (!reg.test(value)) {
			model.value[key] = null;
		} else {
			const numValue = Number(value);
			if (numValue > 99999) {
				model.value[key] = 99999;
			} else if (numValue < 1) {
				model.value[key] = null;
			}
		}
	};

	if (val === 'dayNum') {
		updateValue('dayNum');
	} else if (val === 'originNum') {
		updateValue('originNum');
	} else if (val === 'buyPrice') {
		updateValue('buyPrice');
	} else if (val === 'limitNum') {
		updateValue('limitNum');
	} else if (val === 'maxNum') {
		updateValue('maxNum');
	} else if (val === 'shareNum') {
		updateValue('shareNum');
	} else if (val === 'shareMaxNum') {
		updateValue('shareMaxNum');
	} else if (val === 'limitWin') {
		updateValue('limitWin');
	}
};

// 自动定位到表单报错项
const moveToErr = () => {
	nextTick(() => {
		let isError = document.getElementsByClassName('is-error');
		if (isError.length) {
			isError[0].scrollIntoView({
				block: 'center',
				behavior: 'smooth',
			});
			// 这个当滑动到报错项之后自动获取输入框的焦点，方便用户直接进行输入，延迟 800ms 是因为需要都能到定位成功后在进行获取焦点体验更好一些
			setTimeout(() => {
				if (isError[0].previousElementSibling?.querySelector('input')) {
					isError[0].previousElementSibling.querySelector('input')?.focus();
				}
			}, 800);
		}
	});
};

const submitForm = async (formEl: FormInstance | undefined) => {
	console.log('model.value', model.value);
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			// try {
			// 	await useMessageBox().confirm(`是否${scopeId.value ? '修改' : '新建'}供应商`, '创建供应商');
			// } catch {
			// 	return false;
			// }
			// try {
			// 	const request = scopeId.value ? supplierUpdate : supplierAdd;
			// 	const { code, msg } = await request(model.value);
			// 	if (code === 0) {
			// 		useMessage().success(`${scopeId.value ? '修改成功' : '新建成功'}`);
			// 		resetForm(formEl);
			// 		emit('refresh');
			// 	} else {
			// 		useMessage().error(msg);
			// 	}
			// } catch (err: any) {
			// 	useMessage().error(err.msg);
			// }
		} else {
			moveToErr();
			loading.value = false;
		}
	});
};

// 取消（关闭当前 tag）
const handleCancel = () => {
	ElMessageBox.confirm(`退出当前页面将丢失编辑内容，是否确认退出?`, '取消保存', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	})
		.then(() => {
			router.push('/operationConfig/activityManage/activityOperate/index');
		})
		.catch(() => {});
};

const isDisabled = ref(false);

onMounted(() => {});
</script>
<style lang="scss" scoped>
.layout-padding {
	overflow: auto;
	.el-card {
		margin-bottom: 16px;

		.title {
			font-size: 20px;
			font-weight: 500;
			line-height: 28px;
			color: #1d2129;
			margin-bottom: 16px;
		}
		.custom-width {
			width: 460px;
		}
		.custom-form-item {
			:deep(.el-form-item__content) {
				margin-left: 0px !important;
				display: flex;
				flex-direction: column;
				align-content: flex-start;
				align-items: flex-start;
				.el-checkbox {
					display: block;
					margin-bottom: 16px;
					.el-input {
						width: 100px;
						margin: 0 8px;
					}
				}
			}
		}
		.flex-row {
			> div {
				display: flex;
				flex-direction: row;
				align-items: center;
				span {
					display: inline-block;
					width: 100px;
				}
			}
		}
	}
	.footer {
		text-align: center;

		.el-button {
			width: 68px;
		}
	}
}
</style>
