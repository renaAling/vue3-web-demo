<template>
    <el-dialog :close-on-click-modal="false" title="新增" width="500" draggable v-model="visible">
        <el-form :model="form" label-width="110px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
            <el-form-item label="手机号" prop="mobile">
                <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="userName">
                <el-input disabled placeholder="请输入用户名称" clearable v-model="form.userName" maxlength="20"></el-input>
            </el-form-item>

            <el-form-item label="加入黑名单原因" prop="reason">
                <el-input placeholder="请输入" clearable v-model="form.reason" maxlength="50"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">{{ $t('common.cancelButtonText') }}</el-button>
                <el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText')
                    }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { useI18n } from 'vue-i18n';
// import { addProtocol, getByProtocolId, updateSingleProtocol } from '/@/api/points/agreement';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { blackAdd } from '/@/api/points/grant';
import { getUserInfoByUidMobile } from '/@/api/points/manage';

// 定义子组件向父组件传值/事件
const { t } = useI18n();

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
    type: 2,
    unionId: '',
    reason: '',
    mobile: '',
    userName: '',
    id: '',
});

const getUserInfo = async (phone: string, callback: any) => {
    if (phone) {
        try {
            // 查询是否本平台已存在
            const res = await getUserInfoByUidMobile({uidMobile:phone});
            if (res.data) {
                form.userName = res.data.name;
                form.unionId = res.data.unionId;
                return callback();
            } else {
                form.userName = '';
                form.unionId = '';
                return callback();
            }
        } catch (err: any) {
            useMessage().error(err.msg);
        }
    } else {
        form.userName = '';
        form.unionId = '';
        return callback('手机号不能为空');
    }
};

// 定义校验规则
const dataRules = ref({
    mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    {
        validator: (rule: any, value: any, callback: any) => {
            // validatePhone(rule, value, callback, dataForm.userId !== '');
            getUserInfo(value, callback);
        },
        trigger: 'blur',
    }
    ],
    userName: [{ required: true, message: '用户信息不能为空', trigger: 'blur' }]
});

// 打开弹窗
const openDialog = () => {
    visible.value = true;
    form.id = '';
};



const closeMyDialog = () => {
    visible.value = false;
};
// 重置
const resetForm = () => {
    dataFormRef.value.resetFields();
    closeMyDialog();
};

// 取消
const cancel = async () => {
    if (!(form.mobile || form.id || form.reason)) {
        resetForm();
        return;
    }
    try {
        await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
        resetForm();
    } catch {
        return false;
    }
};
// 提交
const onSubmit = async () => {
    const valid = await dataFormRef.value.validate().catch(() => { });
    if (!valid) return false;
    try {
        loading.value = true;
        await blackAdd(form);
        useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
        resetForm();
        emit('refresh');
    } catch (err: any) {
        useMessage().error(err.msg);
    } finally {
        loading.value = false;
    }
};

// 暴露变量
defineExpose({
    openDialog,
});
</script>
