<template>
  <div>
    <el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="40%" :before-close="resetForm">
      <el-scrollbar height="150px">
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="82px">
          <el-form-item label="显示状态:" prop="idsStatus">
            <el-switch v-model="formData.idsStatus" :active-value="true" :inactive-value="false" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ElForm } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { BusinessAreaOperationApi } from '/@/api/note/noteInfo';
import { getExpertNotesPageApi, expertNotesStatusApi } from '/@/api/note/noteInfo';
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('批量操作');
const ruleFormRef = ref<FormInstance>();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const formData = reactive<any>({
  idsStatus: false,
  dataIds: []

});
const rules = reactive<FormRules<any>>({
  idsStatus: [{ required: true, message: '请选择', trigger: 'change' }],
});

const openDialog = (data?: any) => {
  console.log(data, '<<<<<data<<<<<');
  if (data && data.length) {
    formData.dataIds = data;
  }
  visible.value = true
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    const params = { ids:   formData.dataIds, isShow: formData.idsStatus };
    try {
      const { code, msg } = await expertNotesStatusApi(params);
      if (code === 0) {
        useMessage().success('修改成功');
             emit('refresh');
        visible.value = false;
      } else {
        useMessage().error(msg);
      }
    } catch (error: any) {
      useMessage().error(error.msg);
    }
  });
};

const resetForm = () => {
  formData.idsStatus = false;
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss"></style>
