<template>
	<el-dialog :model-value="modelValue" :title="pageType === 'add' ? '新增' : '编辑'" width="800" draggable @closed="resetForm">
		<el-form ref="promoterForm" :model="rightsForm" :rules="rules" v-loading="loading" label-width="150px">
			<el-row>
				<el-col :span="12">
					<el-form-item prop="name" label="姓名">
						<el-input v-model="rightsForm.name" placeholder="请输入" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="phone" label="关联注册用户手机号">
						<el-input v-model="rightsForm.phone" placeholder="请输入" :disabled="pageType === 'edit'" @change="handleChangePhone" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="distributionLevelCode" label="分销等级">
						<el-select v-model="rightsForm.distributionLevelCode" placeholder="请选择" clearable>
							<el-option v-for="item in statusList" :key="item.levelCode" :label="item.levelName" :value="item.levelCode" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="account" label="关联用户账号">
						<el-input v-model="nameAndPhone" disabled />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="paymentAccount" label="收款信息">
						<el-input type="textarea" v-model="rightsForm.paymentAccount" placeholder="请输入该分销员结算收款的渠道、账号" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="spreadUid" label="上级推广人">
						<el-select v-model="rightsForm.spreadUid" placeholder="请输入" :disabled="pageType === 'edit'" filterable clearable>
							<el-option v-for="item in options" :key="item.uid" :label="`${item.name || '-'}(${item.phone || '-'})`" :value="item.uid" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="isSpread" label="推广权限">
						<el-switch v-model="rightsForm.isSpread" inline-prompt active-text="开" inactive-text="关" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">取消</el-button>
				<el-button type="primary" @click="handleSuccess">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="distributor-member">
import { discountUserAdd, discountUserUpdate, getByPhone, pageUserList, distributionLevelConfigList } from '/@/api/member/distributionManage';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';

const props = defineProps<{
	modelValue: boolean;
	row?: any;
	pageType: string;
}>();

const emits = defineEmits<{
	(event: 'update:modelValue', val: boolean): void;
	(event: 'ok', params?: any): void;
}>();

const loading = ref(false);
const promoterForm = ref();
const rightsForm = ref({
	name: '',
	uid: '',
	phone: null,
	distributionLevelCode: null,
	account: '',
	paymentAccount: '',
	spreadUid: '',
	isSpread: null,
});
const nameAndPhone = ref('');

const rules = reactive({
	name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
	phone: [
		{ required: true, message: '手机号不能为空', trigger: 'blur' },
		{ validator: rule.validatePhone, trigger: 'blur', message: '手机格式不正确' },
	],
	distributionLevelCode: [{ required: true, message: '请选择分销等级', trigger: 'blur' }],
	paymentAccount: [{ required: true, message: '收款信息不能为空', trigger: 'blur' }],
	isSpread: [{ required: true, message: '请选择推广权限', trigger: 'change' }],
});

const handleChangePhone = (val: string) => {
	getByPhone(val).then((res) => {
		if (res?.ok && res?.data) {
			nameAndPhone.value = `${res.data.nickname}(${res.data.phone})`;
			rightsForm.value.uid = res.data.id;
		} else {
			useMessage().error('暂无关联用户账号');
			nameAndPhone.value = '';
		}
	});
};

const handleSuccess = async () => {
	const valid = await promoterForm.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const res = props.pageType === 'edit' ? await discountUserUpdate(rightsForm.value) : await discountUserAdd(rightsForm.value);
		if (res?.ok) {
			useMessage().success('操作成功');
			promoterForm.value.resetFields();
			closeDialog();
			emits('ok');
		} else {
			useMessage().error(res?.msg);
    }
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const resetForm = () => {
	// rightsForm.name = '';
	// rightsForm.phone = null;
	// rightsForm.distributionLevelCode = null;
	// rightsForm.account = '';
	// rightsForm.paymentAccount = '';
	// rightsForm.spreadUid = '';
	// rightsForm.isSpread = null;
	promoterForm.value.resetFields();
	closeDialog();
};

const closeDialog = () => {
	emits('update:modelValue', false);
};

const options = ref();
const statusList = ref();

watch(
	() => props.modelValue,
	(newUid) => {
		if (newUid) {
			try {
				loading.value = true;
				pageUserList().then((res) => {
					options.value = res.data;
				});
				distributionLevelConfigList().then((res) => {
					statusList.value = res.data;
				});
				rightsForm.value = { ...props.row, spreadUid: props.row.spreadUid };
				nameAndPhone.value = props.pageType === 'edit' ? `${props.row.nickName}(${props.row.phone})` : '';
			} catch (err) {
				loading.value = false;
			} finally {
				loading.value = false;
			}
		}
	},
	{ immediate: true }
);
</script>
<style scoped lang="scss">
.el-form .el-form-item:last-of-type {
	margin-bottom: 18px !important;
}
</style>
