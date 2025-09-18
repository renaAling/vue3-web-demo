<template>
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
				<el-checkbox v-model="model.everyDayLotteryNumRule" @click="checkOnlyOnBox" @change="changeDayNumCheckbox">
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
				<el-checkbox v-model="model.firstLotteryNumRule" @click="checkOnlyOnBox" @change="changeOriginNumCheckbox">
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
				<!-- <el-checkbox v-model="model.getPersonalLotteryNumRule" @click="checkOnlyOnBox">
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
				</el-checkbox> -->
				<el-checkbox v-model="model.friendHelpLotteryNumRule" @click="checkOnlyOnBox" @change="changeShareNumCheckbox">
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
				<el-checkbox v-model="model.maxWinRule" @click="checkOnlyOnBox" @change="changeLimitWinNumCheckbox">
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
			<el-form-item prop="receiveWay" class="custom-form-item">
				<el-radio-group v-model="model.receiveWay">
					<el-radio :label="2">线下领奖</el-radio>
					<el-radio :label="1">联系客服</el-radio>
					<el-radio :label="3">自动发放</el-radio>
				</el-radio-group>
			</el-form-item>
			<div class="flex-row">
				<div v-if="model.receiveWay === 2" v-for="(item, index) in model.receiveOffLines" :key="index" class="multiple-lines">
					<div>
						<span>领奖地址：</span>
						<el-input v-model="item.address" clearable placeholder="请输入领奖地址" maxlength="200" />
					</div>
					<div>
						<span>联系电话：</span>
						<el-input v-model="item.mobiles" clearable placeholder="请输入联系电话" maxlength="20" />
					</div>
					<div>
						<el-icon size="24" @click="handleAddRow"><Plus /></el-icon>
						<el-icon size="24" v-if="index !== 0" @click="handleDeleteRow(index)"><Minus /></el-icon>
					</div>
				</div>
				<div v-if="model.receiveWay === 1" class="qrcode">
					<span>客服二维码：</span>
					<upload-img v-model:imageUrl="model.receiveQrCode" dir="activity"></upload-img>
				</div>
			</div>
		</el-card>
	</el-form>
</template>

<script setup lang="ts" name="cultureProductsForm">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules, UploadProps, UploadRequestOptions } from 'element-plus';
import { ElNotification, ElMessageBox } from 'element-plus';
import { modelTypes } from '../types';
import { activityDetail } from '/@/api/operationConfig/lotteryManage';
import { identityTypesEnums } from '../enum';
import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();

const formRef = ref<FormInstance>();
const loading = ref(false);
const model = ref<modelTypes>({
	code: null,
	name: '',
	activityTime: '',
	identityTypes: [],
	everyDayLotteryNumRule: false,
	dayNum: null,
	firstLotteryNumRule: false,
	originNum: null,
	friendHelpLotteryNumRule: false,
	shareNum: null,
	shareMaxNum: null,
	maxWinRule: false,
	limitWin: null,
	receiveWay: null,
	receiveOffLines: [
		{
			address: '',
			mobiles: '',
		},
	],
	receiveQrCode: null,
});

const formRules = reactive<FormRules>({
	name: [{ required: true, message: '请输入活动名称' }],
	activityTime: [{ required: true, message: '请选择活动时间' }],
	identityTypes: [{ required: true, message: '请至少选择一个对象' }],
	receiveWay: [{ required: true, message: '请选择领奖方式' }],
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

// 添加一行领奖地址、电话
const handleAddRow = () => {
	model.value.receiveOffLines.push({
		address: '',
		mobiles: '',
	});
};

// 删除当前行
const handleDeleteRow = (index: number) => {
	model.value.receiveOffLines.splice(index, 1);
};

const formatFormData = () => {
	const {
		name,
		activityTime,
		identityTypes,
		receiveWay,
		everyDayLotteryNumRule,
		dayNum,
		firstLotteryNumRule,
		originNum,
		friendHelpLotteryNumRule,
		shareNum,
		shareMaxNum,
		maxWinRule,
		limitWin,
		receiveOffLines,
		receiveQrCode,
		code,
	} = model.value;
	let params = {
		name, // 活动名称
		startTime: activityTime && activityTime.length > 0 ? activityTime[0] : '', // 开始时间
		endTime: activityTime && activityTime.length > 0 ? activityTime[1] : '', // 结束时间
		identityTypes, // 参与对象
		receiveWay, // 领奖方式 1-联系客服 2-线下领奖
		receiveQrCode, // 客服二维码
		receiveOffLines, // 线下领奖地点
		dayGetNum: null as { dayNum: string | null } | null, // 每天获得次数
		originGetNum: null as { originNum: string | null } | null, // 初始获得次数
		shareGetNum: null as { shareNum: string | null; shareMaxNum: string | null } | null, // 分享获得次数
		maxWinNum: null as { limitWin: string | null } | null, // 最大中奖次数
		everyDayLotteryNumRule,
		firstLotteryNumRule,
		friendHelpLotteryNumRule,
		maxWinRule,
		code,
	};

	if (everyDayLotteryNumRule && dayNum) {
		params.dayGetNum = {
			dayNum,
		};
	}

	if (firstLotteryNumRule && originNum) {
		params.originGetNum = {
			originNum,
		};
	}

	if (friendHelpLotteryNumRule && shareNum && shareMaxNum) {
		params.shareGetNum = {
			shareNum,
			shareMaxNum,
		};
	}

	if (maxWinRule && limitWin) {
		params.maxWinNum = {
			limitWin,
		};
	}

	return params;
};

// 处理取消勾选后将对应的值清空
const resetFields = (fields: string[]) => {
	fields.forEach((field) => {
		model.value[field] = '';
	});
};

const changeDayNumCheckbox = () => {
	resetFields(['dayNum']);
};

const changeOriginNumCheckbox = () => {
	resetFields(['originNum']);
};

const changeShareNumCheckbox = () => {
	resetFields(['shareNum', 'shareMaxNum']);
};

const changeLimitWinNumCheckbox = () => {
	resetFields(['limitWin']);
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
// 处理所有输入框的合法输入值校验
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
	} else if (val === 'shareNum') {
		updateValue('shareNum');
	} else if (val === 'shareMaxNum') {
		updateValue('shareMaxNum');
	} else if (val === 'limitWin') {
		updateValue('limitWin');
	}
};

const getDetail = (code: string) => {
	activityDetail(code)
		.then((res) => {
			const { name, activityTime, identityTypes, dayGetNum, originGetNum, shareGetNum, maxWinNum, receiveWay, receiveOffLines, receiveQrCode, code } =
				res.data;
			model.value.name = name;
			model.value.activityTime = activityTime;
			model.value.identityTypes = identityTypes;
			if (dayGetNum && dayGetNum.dayNum) {
				model.value.dayNum = dayGetNum.dayNum;
				model.value.everyDayLotteryNumRule = true;
			}
			if (originGetNum && originGetNum.originNum) {
				model.value.originNum = originGetNum.originNum;
				model.value.firstLotteryNumRule = true;
			}
			if (shareGetNum && shareGetNum.shareNum && shareGetNum.shareMaxNum) {
				model.value.shareNum = shareGetNum.shareNum;
				model.value.shareMaxNum = shareGetNum.shareMaxNum;
				model.value.friendHelpLotteryNumRule = true;
			}
			if (maxWinNum && maxWinNum.limitWin) {
				model.value.limitWin = maxWinNum.limitWin;
				model.value.maxWinRule = true;
			}
			model.value.receiveWay = receiveWay;
			if (receiveOffLines && receiveOffLines.length > 0) {
				model.value.receiveOffLines = receiveOffLines;
			} else {
				model.value.receiveOffLines = [
					{
						address: '',
						mobiles: '',
					},
				];
			}
			model.value.receiveQrCode = receiveQrCode;
			model.value.code = code;
		})
		.catch((err) => {
			console.log('err', err);
		});
};

onMounted(() => {
	if (route.query.activityCode) {
		const activityCode = Array.isArray(route.query.activityCode) ? route.query.activityCode[0] : route.query.activityCode;
		getDetail(activityCode as string);
	}
});
// 暴露方法
defineExpose({
	formRef,
	formatFormData,
});
</script>
<style lang="scss" scoped>
.el-form {
	margin-bottom: 40px;
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
			.multiple-lines {
				display: flex;
				flex-direction: row;
				align-items: self-end;
				margin-bottom: 16px;
				> div {
					margin-right: 20px;
					.el-input {
						width: 320px;
					}
					.el-icon {
						cursor: pointer;
						margin-right: 16px;
					}
				}
			}
			.qrcode {
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
}
</style>
