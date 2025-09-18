<template>
	<el-dialog title="商家管理" ref="myDialog" v-model="visible">
		<el-form :model="form" ref="queryRef" :rules="rules" label-width="120px" :disabled="isDisabled">
			<el-form-item label="地址" prop="address">
				<el-input placeholder="请输入" v-model="form.address" clearable maxlength="30" />
			</el-form-item>
			<el-form-item label="电话" prop="contactPhone">
				<el-input placeholder="请输入" v-model="form.contactPhone" clearable maxlength="30" />
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input placeholder="请输入" v-model="form.email" clearable maxlength="30" />
			</el-form-item>
			<el-form-item label="支付渠道" prop="payCodes">
				<el-table ref="multipleTableRef" :data="channelTypes" row-key="id">
					<el-table-column prop="id" label="支付渠道编号" />
					<el-table-column prop="payName" label="支付渠道名称" />
					<el-table-column label="开通" width="55">
						<template #default="scope">
							<el-checkbox
								disabled
								:model-value="form.payCodes.includes(scope.row.code)"
								@change="(val: any) => handleSelectionChange(val, scope.row)"
							/>
						</template>
					</el-table-column>
					<el-table-column prop="mchId" label="支付商户号">
						<template #default="{ $index }">
							{{ $index === 0 && form.mchId ? form.mchId : '-' }}
						</template>
					</el-table-column>
				</el-table>
				<!-- <el-checkbox-group v-model="form.payCodes" :min="1">
					<div v-for="(item, index) in channelTypes" :key="item.code">
						<el-checkbox :label="item.code">{{ item.payName }}</el-checkbox>
						<div v-if="form.payCodes.includes('WX_PAY') && index === 0">
							<el-form-item label="商户号" prop="mchId" style="margin: 10px 0px 20px 0px" label-width="55px">
								<el-select v-model="form.mchId" clearable placeholder="请选择">
									<el-option :label="item.mchName" :value="item.mchId" v-for="(item, index) in mchIdOptions" :key="index" />
								</el-select>
							</el-form-item>
						</div>
					</div>
				</el-checkbox-group> -->
			</el-form-item>
			<el-form-item label="对公账户开户行" prop="bankBranch">
				<el-input placeholder="请输入" v-model="form.bankBranch" clearable maxlength="30" />
			</el-form-item>
			<el-form-item label="对公账户" prop="bankAccount">
				<el-input placeholder="请输入" v-model="form.bankAccount" clearable maxlength="30" />
			</el-form-item>
			<el-form-item label="结算周期" prop="settlementDay">
				<el-input type="number" placeholder="请输入" v-model="form.settlementDay">
					<template #append>
            天
						<!-- <el-select v-model="form.type" placeholder="请选择" style="width: 80px">
							<el-option label="月" value="month" />
							<el-option label="天" value="day" />
						</el-select> -->
					</template>
				</el-input>
			</el-form-item>
			<el-row class="my-[20px] font-bold">资质文件</el-row>
			<el-form-item label="营业执照" prop="businessLicense">
				<UploadImg v-model:image-url="form.businessLicense" />
			</el-form-item>
			<el-form-item label="许可证" prop="license">
				<UploadImg v-model:image-url="form.license" />
			</el-form-item>
			<el-form-item label="服务协议" prop="serviceAgreement">
				<UploadImg v-model:image-url="form.serviceAgreement" />
			</el-form-item>
			<el-form-item label="其他附件" prop="otherAttachment">
				<div class="upload-item flex items-center">
					<UploadImg
						class="mr-[10px]"
						v-for="(item, index) in form.otherAttachment"
						:key="index"
						v-model:imageUrl="form.otherAttachment[index]"
						:fileType="['image/jpeg', 'image/jpg', 'image/png']"
					/>
					<el-button v-if="form.otherAttachment.length < 9" @click="handleCreateUploadComponent" type="primary">添加其他附件</el-button>
				</div>
			</el-form-item>
		</el-form>
		<template #footer v-if="!isDisabled">
			<el-button @click="resetForm(queryRef)">取消</el-button>
			<el-button @click="submitForm(queryRef)" type="primary">保存</el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { getBusinessGet, getBusinessUpdate, getPayConfig, getBusinessPay } from '/@/api/culture/merchant/merchantManage';
import UploadImg from '/@/components/Upload/Image.vue';
import type { TableInstance } from 'element-plus';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const queryRef = ref() as any;
const mchIdOptions = ref<any>([]);
interface RuleForm {
	address: string;
  email: string;
	contactName: string;
	contactPhone: string;
  bankBranch: string;
  bankAccount: string;
  settlementDay: number;
  businessLicense: string;
  license: string;
  serviceAgreement: string;
	payCodes: any[];
	mchId: string; //商户号
	otherAttachment: string[];
}
const form = ref<RuleForm>({
	address: '',
  email: '',
	contactName: '',
	contactPhone: '',
  bankBranch: '',
  bankAccount: '',
  settlementDay: 0,
  businessLicense: '',
  license: '',
  serviceAgreement: '',
	payCodes: [],
	mchId: '', //商户号
	otherAttachment: [],
});
const channelTypes = ref<any>([]);
const rules = reactive<FormRules<RuleForm>>({
	address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
	contactPhone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
	email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
	contactName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
	bankBranch: [{ required: true, message: '请输入对公账户开户行', trigger: 'blur' }],
	bankAccount: [{ required: true, message: '请输入对公账户', trigger: 'blur' }],
	settlementDay: [{ required: true, message: '请输入结算周期', trigger: 'blur' }],
	businessLicense: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
	license: [{ required: true, message: '请上传许可证', trigger: 'change' }],
	serviceAgreement: [{ required: true, message: '请上传服务协议', trigger: 'change' }],
	payCodes: [
		{
			required: true,
			validator: (rule: any, value: any, callback: any) => {
				if (value < 1) {
					callback(new Error('请至少选择一个支付渠道'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	mchId: [
		{
			validator: (rule: any, value: any, callback: any) => {
				if (form.value.payCodes.includes('WX_PAY') && !value) {
					callback(new Error('请选择商户号'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
});

const multipleTableRef = ref<TableInstance>();
const handleSelectionChange = (isChecked: boolean, row: any) => {
	if (isChecked) {
		form.value.payCodes.push(row.code);
	} else {
		form.value.payCodes = form.value.payCodes.filter((code) => code !== row.code);
	}
};

const handleCreateUploadComponent = () => {
	const MAX_IMAGES = 5;
	if (form.value.otherAttachment.some((img) => !img)) {
		useMessage().error('请先上传已有的图片');
		return;
	}
	if (form.value.otherAttachment.length >= MAX_IMAGES) {
		useMessage().error(`最多上传${MAX_IMAGES}张轮播图`);
		return;
	}
	form.value.otherAttachment.push('');
};

onMounted(() => {
	getPayConfigList();
	getBusinessPayList();
});

const isDisabled = ref(false);
const openDialog = async (code?: string, isDisable?: boolean) => {
	isDisabled.value = isDisable || false;
	visible.value = true;
	if (code) {
		try {
			const res = await getBusinessGet(code);
			if (res.code === 0) {
				visible.value = true;
				delete res.data.payCount;
				delete res.data.id;
				Object.assign(form.value, res.data);
				form.value.payCodes = [...res.data.payCodes];
			} else {
				useMessage().error(res.msg);
			}
		} catch (error: any) {
			useMessage().error(error.msg);
		}
	}
};
// 获取商户号下拉列表
const getPayConfigList = async () => {
	try {
		// 这里和后端核对了就传1
		const res = await getPayConfig(1);
		if (res.code === 0) {
			mchIdOptions.value = res.data;
		} else {
			useMessage().error(res.msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 支付渠道列表
const getBusinessPayList = async () => {
	try {
		const res = await getBusinessPay();
		if (res.code === 0) {
			channelTypes.value = res.data;
		} else {
			useMessage().error(res.msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			if (!form.value.payCodes.includes('WX_PAY')) form.value.mchId = '';
			try {
				const { code, msg } = await getBusinessUpdate(form.value);
				if (code === 0) {
					useMessage().success('编辑成功');
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	visible.value = false;
	Object.assign(form.value, { address: '', contactName: '', contactPhone: '', payCodes: [], mchId: '' });
	if (!formEl) return;
	formEl.resetFields();
	emit('refresh');
};

defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.header {
	font-size: 24px;
	font-weight: 500;
	margin: 0 0 10px 10px;
}
:deep(.el-checkbox-group) {
	width: 100%;
}
</style>
