<template>
  <div>
    <el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="40%" :before-close="resetForm">
      <el-scrollbar height="150px">
        <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="82px">
          <el-form-item label="商圈半径:" prop="radius">
             <el-input-number
                placeholder="请输入"
                v-model="formData.radius"
                :min="100"
                :max="5000"
                controls-position="right"
              >
                <template #suffix>
                  <span>米</span>
                </template>
              </el-input-number>
          </el-form-item>
          <div class="tips">
            <span>&nbsp;&nbsp;&nbsp;注:可设置范围100-5000米</span><br />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置后将覆盖统一设置的半径值</span>
          </div>
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

const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('批量设置');
const ruleFormRef = ref<FormInstance>();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const formData = reactive<any>({
  subwayIds: [],
  radius: null
});
const rules = reactive<FormRules<any>>({
  radius: [{ required: true, message: '请输入商圈半径', trigger: 'blur' }],
});

const openDialog = (row?: any) => {
  if (row?.subwayId) {
    dialogTitle.value = '编辑';
    formData.subwayIds = [row.subwayId];
  } else {
    dialogTitle.value = '批量设置';
    formData.subwayIds = row;
  }
  visible.value = true
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      const response = await BusinessAreaOperationApi(formData);
      if (response?.ok) {
        useMessage().success(response.msg || '操作成功');
        emit('refresh');
        visible.value = false;
      } else {
        useMessage().error(response.msg);
      }
    } catch (error: any) {
      useMessage().error(error.msg || '操作失败');
    }
  });
};

const resetForm = () => {
  formData.subwayIds = [];
  formData.radius = null;
  visible.value = false;
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss"></style>
