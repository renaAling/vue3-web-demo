<template>
	<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="30%" :close-on-click-modal="false" :show-close="false">
		<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
			<el-form-item label="奖品名称：" prop="name">
				<el-input v-model="model.name" placeholder="请输入奖品名称" clearable maxlength="30" />
			</el-form-item>
			<el-form-item label="奖品类型：" prop="type">
				<el-select v-model="model.type" placeholder="请选择奖品类型" clearable>
					<el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="红包金额：" prop="price" v-if="model.type == 3">
				<el-input v-model="model.price" placeholder="请输入红包金额" clearable maxlength="6" />
			</el-form-item>
			<el-form-item label="奖品图片：">
				<upload-img v-model:imageUrl="model.imgUrl" dir="activity"></upload-img>
			</el-form-item>
			<el-form-item label="中奖概率：" prop="odds">
				<el-input v-model="model.odds" placeholder="请输入中奖概率" clearable maxlength="6">
					<template #append>%</template>
				</el-input>
			</el-form-item>
			<el-form-item label="奖品数量：">
				<el-input
					v-model="model.totalNum"
					type="text"
					placeholder="请输入奖品数量"
					clearable
					maxlength="5"
					:disabled="model.type == 1"
					@input="changeNumber('totalNum')"
				/>
			</el-form-item>
			<el-form-item label="每日投放：">
				<el-input
					v-model="model.dayNum"
					type="text"
					placeholder="请输入每日投放数量"
					clearable
					maxlength="5"
					:disabled="model.type == 1"
					@input="changeNumber('dayNum')"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="submitForm(formRef)" :loading="loading">保存</el-button>
				<el-button @click="closeMyDialog">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { createPrize, updatePrize, getPrizeInfoDetail, getSurplusOdds } from '/@/api/operationConfig/lotteryManage';
import { prizeModelTypes } from '../types';
const emit = defineEmits(['refresh']);
const route = useRoute();

const visible = ref(false);
const myDialog = ref(null);
const formRef = ref<FormInstance>();
const loading = ref(false);
const dialogTitle = ref('新建奖品');
const scopeId = ref<string | null>('');
const maxOdds = ref(0);
// 奖品类型
const typeList = reactive([
	{
		label: '不中奖',
		value: 1,
	},
	{
		label: '实物自提',
		value: 2,
	},
	{
		label: '转账到零钱',
		value: 3,
	},
]);

// 初始模型数据
const initialModel = {
	name: '',
	activityCode: '',
	type: 2,
	price: '',
	imgUrl: '',
	odds: '',
	totalNum: '',
	dayNum: '',
};

// 数据层
const model = ref<prizeModelTypes>({
	...initialModel,
});

// 自定义校验中奖概率在0.01-接口获取的最大值区间
const validateOdds = (rule: any, value: any, callback: any) => {
	if (value < 0.01 || value > maxOdds.value) {
		callback(new Error(`请输入0.01~${maxOdds.value}之间的数值`));
	} else {
		callback();
	}
};

const validatePrice = (rule: any, value: any, callback: any) => {
	if (value < 0.01 || value > 200) {
		callback(new Error(`请输入0.01~200之间的数值`));
	} else {
		callback();
	}
};

const formRules = reactive<FormRules>({
	name: [{ required: true, message: '请输入奖品名称', trigger: ['blur', 'change'] }],
	price: [
		{ required: true, message: '请输入红包金额', trigger: ['blur', 'change'] },
		{ validator: validatePrice, trigger: ['blur', 'change'] },
	],
	type: [{ required: true, message: '请选择奖品类型', trigger: ['blur', 'change'] }],
	odds: [
		{ required: true, message: '请输入中奖概率', trigger: ['blur', 'change'] },
		{ validator: validateOdds, trigger: ['blur', 'change'] },
	],
});

// 处理所有输入框的合法输入值校验
const changeNumber = (val: string) => {
	const reg = /^[1-9][0-9]{0,4}$/;
	const updateValue = (key: any) => {
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
		if (model.value.dayNum && model.value.totalNum && parseInt(model.value.dayNum) > parseInt(model.value.totalNum)) {
			model.value.dayNum = model.value.totalNum;
			useMessage().warning('每日投放数量不能大于奖品数量');
		}
	} else if (val === 'totalNum') {
		updateValue('totalNum');
		if (model.value.dayNum && model.value.totalNum && parseInt(model.value.dayNum) > parseInt(model.value.totalNum)) {
			model.value.dayNum = model.value.totalNum;
			useMessage().warning('每日投放数量不能大于奖品数量');
		}
	}
};

const openDialog = async (code: string | null, id: string) => {
	scopeId.value = code;
	// 处理每次打开弹窗动态查询剩余中奖概率
	if (typeof route.query.activityCode === 'string') {
		let params = {
			activityCode: route.query.activityCode,
			id,
		};
		getSurplusOdds(params)
			.then((res) => {
				const { data, code, msg } = res;
				if (code === 0) {
					maxOdds.value = data;
				} else {
					console.error(msg);
				}
			})
			.catch((err) => {
				console.log('err', err);
			});
	} else {
		console.error('Invalid activityCode:', route.query.activityCode);
	}
	if (code) {
		dialogTitle.value = '编辑奖品';
		try {
			let res = await getPrizeInfoDetail(code);
			if (res.code === 0) {
				const { id, code, name, activityCode, type, odds, imgUrl, dayNum, totalNum, price } = res.data;
				model.value.id = id;
				model.value.code = code;
				model.value.name = name;
				model.value.activityCode = activityCode;
				model.value.type = type;
				model.value.price = price;
				model.value.imgUrl = imgUrl;
				model.value.odds = odds;
				model.value.totalNum = totalNum;
				model.value.dayNum = dayNum;
			}
		} catch (err: any) {
			useMessage().error(err);
		}
	} else {
		dialogTitle.value = '新建奖品';
		model.value.activityCode = route.query.activityCode as string;
	}
	visible.value = true;
};

const submitForm = async (formEl: FormInstance | undefined) => {
	console.log('model.value', model.value);
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否${scopeId.value ? '编辑' : '新建'}奖品?`, `${scopeId.value ? '编辑' : '创建'}奖品`);
			} catch {
				return false;
			}
			try {
				const request = scopeId.value ? updatePrize : createPrize;
				const { code, msg } = await request(model.value);
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改成功' : '新建成功'}`);
					closeMyDialog();
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			loading.value = false;
		}
	});
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	model.value = { ...initialModel };
};

const closeMyDialog = () => {
	resetForm(formRef.value);
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
