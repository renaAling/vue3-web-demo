<template>
	<el-form @submit.prevent :model="model" ref="formRef" label-width="120px" :rules="formRules">
		<el-card>
			<div class="btns">活动主页</div>
			<div class="content">
				<div class="left">
					<el-form-item label="头部配置：" prop="headImg">
						<upload-img v-model:imageUrl="model.headImg" dir="activity"></upload-img>
					</el-form-item>
					<el-form-item label="转盘背景：" prop="backgroundImg">
						<upload-img v-model:imageUrl="model.backgroundImg" dir="activity"></upload-img>
					</el-form-item>
					<el-form-item label="中心指针：" prop="pointerImg">
						<upload-img v-model:imageUrl="model.pointerImg" dir="activity"></upload-img>
					</el-form-item>
					<el-form-item label="分栏颜色1：" prop="insideColor">
						<el-color-picker v-model="model.insideColor" @change="onColorPickerChange" />
						<span style="margin-left: 10px">{{ model.insideColor }}</span>
					</el-form-item>
					<el-form-item label="分栏颜色2：" prop="outsideColor">
						<el-color-picker v-model="model.outsideColor" @change="onColorPickerChange2" />
						<span style="margin-left: 10px">{{ model.outsideColor }}</span>
					</el-form-item>
					<el-form-item label="左侧按钮底图：" prop="leftBtnImg">
						<upload-img v-model:imageUrl="model.leftBtnImg" dir="activity"></upload-img>
					</el-form-item>
					<el-form-item label="右侧按钮底图：" prop="rightBtnImg">
						<upload-img v-model:imageUrl="model.rightBtnImg" dir="activity"></upload-img>
					</el-form-item>
					<el-form-item label="活动规则：" prop="ruleImg">
						<upload-img v-model:imageUrl="model.ruleImg" dir="activity"></upload-img>
					</el-form-item>
				</div>
				<div class="right">
					<div style="text-align: center; font-size: 16px; font-weight: 600">预览效果</div>
					<img :src="activityConfig.headImg || ''" alt="" />
					<img :src="activityConfig.ruleImg || ''" alt="" />
					<LuckyWheel
						ref="myLuckyWheel"
						class="lottery"
						width="240px"
						height="240px"
						:prizes="myLuckyWheel.prizes"
						:blocks="myLuckyWheel.blocks"
						:buttons="myLuckyWheel.buttons"
					/>
					<div class="lottery-btns">
						<div :style="{ backgroundImage: `url(${activityConfig.leftBtnImg}) `, backgroundRepeat: 'no-repeat' }">中奖记录 ></div>
						<div :style="{ backgroundImage: `url(${activityConfig.rightBtnImg}) `, backgroundRepeat: 'no-repeat' }">抽奖</div>
					</div>
				</div>
			</div>
		</el-card>
	</el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules, UploadProps, UploadRequestOptions } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { pageConfigDetail } from '/@/api/operationConfig/lotteryManage';

import { pageConfigTypes } from '../types';

const route = useRoute();

const formRef = ref();
// 大转盘
const myLuckyWheel = ref({
	blocks: [
		{
			padding: '20px',
			imgs: [
				{
					src: '',
					width: '100%',
					rotate: true,
				},
			],
		},
	],
	prizes: [
		{ fonts: [{ text: '测试奖品', top: '10%', fontColor: 'red', fontSize: '14px' }], background: '#e9e8fe' },
		{ fonts: [{ text: '谢谢惠顾', top: '10%', fontColor: 'red', fontSize: '14px' }], background: '#b8c5f2' },
		{ fonts: [{ text: '测试奖品', top: '10%', fontColor: 'red', fontSize: '14px' }], background: '#b8c5f2' },
		{ fonts: [{ text: '谢谢惠顾', top: '10%', fontColor: 'red', fontSize: '14px' }], background: '#b8c5f2' },
	],
	buttons: [
		{
			radius: '45%',
			imgs: [
				{
					src: '',
					width: '100%',
					top: '-130%',
				},
			],
		},
	],
});

const model = ref<pageConfigTypes>({
	headImg: '', // 顶部背景
	backgroundImg: '', // 转盘外圈背景图
	insideColor: '', // 分栏颜色
	outsideColor: '', // 分栏颜色
	leftBtnImg: '', // 左侧按钮背景图
	rightBtnImg: '', // 右侧按钮背景图
	pointerImg: '', // 转盘内圈背景图
	ruleImg: '', // 活动规则背景图
});
const activityConfig = ref<pageConfigTypes>({
	headImg: '',
	backgroundImg: '',
	insideColor: '',
	outsideColor: '',
	leftBtnImg: '',
	rightBtnImg: '',
	pointerImg: '',
	ruleImg: '',
});
watch(
	() => model.value.headImg,
	(newVal, oldVal) => {
		if (newVal) {
			activityConfig.value.headImg = newVal;
		} else {
			activityConfig.value.headImg = '';
		}
	}
);

watch(
	() => model.value.ruleImg,
	(newVal, oldVal) => {
		if (newVal) {
			activityConfig.value.ruleImg = newVal;
		} else {
			activityConfig.value.ruleImg = '';
		}
	}
);

watch(
	() => model.value.backgroundImg,
	(newVal, oldVal) => {
		if (newVal) {
			myLuckyWheel.value.blocks[0].imgs[0].src = newVal;
		} else {
			myLuckyWheel.value.blocks[0].imgs[0].src = '';
		}
	}
);

watch(
	() => model.value.pointerImg,
	(newVal, oldVal) => {
		if (newVal) {
			myLuckyWheel.value.buttons[0].imgs[0].src = newVal;
		} else {
			myLuckyWheel.value.blocks[0].imgs[0].src = '';
		}
	}
);

watch(
	() => model.value.leftBtnImg,
	(newVal, oldVal) => {
		if (newVal) {
			activityConfig.value.leftBtnImg = newVal;
		} else {
			activityConfig.value.leftBtnImg = '';
		}
	}
);

watch(
	() => model.value.rightBtnImg,
	(newVal, oldVal) => {
		if (newVal) {
			activityConfig.value.rightBtnImg = newVal;
		} else {
			activityConfig.value.rightBtnImg = '';
		}
	}
);

const formRules = reactive<FormRules>({
	headImg: [{ required: true, message: '请上传头部配置背景图片' }],
	backgroundImg: [{ required: true, message: '请上传转盘背景图片' }],
	pointerImg: [{ required: true, message: '请上传中心指针背景图片' }],
	insideColor: [{ required: true, message: '请选择分栏颜色1' }],
	outsideColor: [{ required: true, message: '请选择分栏颜色2' }],
	leftBtnImg: [{ required: true, message: '请上传左侧按钮底图图片' }],
	rightBtnImg: [{ required: true, message: '请上传右侧按钮底图图片' }],
	ruleImg: [{ required: true, message: '请上传活动规则图片' }],
});

const formatFormData = () => {
	const { headImg, backgroundImg, insideColor, outsideColor, leftBtnImg, rightBtnImg, pointerImg, ruleImg } = model.value;
	let params = {
		activityCode: route.query.activityCode,
		headImg,
		backgroundImg,
		insideColor,
		outsideColor,
		leftBtnImg,
		rightBtnImg,
		pointerImg,
		ruleImg,
	};

	return params;
};

const onColorPickerChange = (e: string) => {
	myLuckyWheel.value.prizes[0].background = e;
	myLuckyWheel.value.prizes[2].background = e;
	myLuckyWheel.value.prizes[1].fonts[0].fontColor = e;
	myLuckyWheel.value.prizes[3].fonts[0].fontColor = e;
};
const onColorPickerChange2 = (e: string) => {
	myLuckyWheel.value.prizes[1].background = e;
	myLuckyWheel.value.prizes[3].background = e;
	myLuckyWheel.value.prizes[0].fonts[0].fontColor = e;
	myLuckyWheel.value.prizes[2].fonts[0].fontColor = e;
};
const getDetail = (code: string) => {
	pageConfigDetail(code)
		.then((res) => {
			if (res.code === 0) {
				const { headImg, backgroundImg, insideColor, outsideColor, leftBtnImg, rightBtnImg, pointerImg, ruleImg } = res.data;
				model.value.headImg = headImg || 'https://oss.duomixing.com/rls/b/activity/MXoXpj1VWUuPL6gIj9py.png';
				model.value.backgroundImg = backgroundImg || 'https://oss.duomixing.com/rls/b/activity/bYoEsjjQqgLOJVaWZ4hN.png';
				model.value.insideColor = insideColor || '#EBBC45';
				model.value.outsideColor = outsideColor || '#FFFFFF';
				model.value.leftBtnImg = leftBtnImg || 'https://oss.duomixing.com/rls/b/activity/c7NrLmVp0C3RQyf2CDgm.png';
				model.value.rightBtnImg = rightBtnImg || 'https://oss.duomixing.com/rls/b/activity/edM6MaWPpnZ22CGf35Mt.png';
				model.value.pointerImg = pointerImg || 'https://oss.duomixing.com/rls/b/activity/eY2LyebXLgD1jJlVJsKC.png';
				model.value.ruleImg = ruleImg || 'https://oss.duomixing.com/rls/b/activity/DdB2wIkjEFn2W9saQ58P.png';
				activityConfig.value = { ...res.data };

				myLuckyWheel.value.buttons[0].imgs[0].src = pointerImg;
				myLuckyWheel.value.blocks[0].imgs[0].src = backgroundImg;
				myLuckyWheel.value.prizes[0].background = insideColor || '#EBBC45';
				myLuckyWheel.value.prizes[1].background = outsideColor || '#FFFFFF';
				myLuckyWheel.value.prizes[2].background = insideColor || '#EBBC45';
				myLuckyWheel.value.prizes[3].background = outsideColor || '#FFFFFF';
				myLuckyWheel.value.prizes[0].fonts[0].fontColor = outsideColor || '#FFFFFF';
				myLuckyWheel.value.prizes[1].fonts[0].fontColor = insideColor || '#EBBC45';
				myLuckyWheel.value.prizes[2].fonts[0].fontColor = outsideColor || '#FFFFFF';
				myLuckyWheel.value.prizes[3].fonts[0].fontColor = insideColor || '#EBBC45';
			}
		})
		.catch((err) => {
			useMessage().error(err);
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
	.btns {
		font-size: 20px;
		font-weight: 500;
		color: #1d2129;
		margin-bottom: 16px;
	}
	.content {
		display: flex;
		justify-content: space-between;
		.right {
			overflow-y: scroll;
			width: 350px;
			height: 100%;
			background-repeat: no-repeat;
			background-size: contain;
			position: relative;
			.lottery {
				position: absolute;
				top: 18%;
				left: 15%;
			}
			.lottery-btns {
				position: absolute;
				top: 36%;
				left: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				> div {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 8px 20px;
					width: 171px;
					color: #d46617;
					height: 56px;
				}
			}
		}
	}
}
</style>
