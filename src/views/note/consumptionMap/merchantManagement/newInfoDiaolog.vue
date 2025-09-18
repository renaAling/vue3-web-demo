<template>
  <div>
    <el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="20%" :close-on-click-modal="false"
      :before-close="resetForm">
      <el-scrollbar height="50px">
        <div class="tips">
            <div>是否获取该商户最新数据</div>
        </div>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button @click="resetForm">取消</el-button> -->
          <el-button type="primary" @click="submitForm">立即同步 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ref } from 'vue';
import { ElForm } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { postSubwayStationAddApi, putSubwayStationUpdateApi } from '/@/api/note/noteInfo';

const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('获取最新商户数据');
const ruleFormRef = ref<FormInstance>();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const openDialog = (row?: any) => {
  visible.value = true
};
const submitForm = async (formEl: FormInstance | undefined) => {

   visible.value = false;
  // await formEl.validate(async (valid, fields) => {
  //   if (valid) {
  //     console.log('submit!');
  //     console.log('formData.value', formData.value);
  //     const response = formData.value.id ? await putSubwayStationUpdateApi(formData.value) : await postSubwayStationAddApi(formData.value);
  //     if (response.code === 0) {
  //       useMessage().success(response.msg || '操作成功');
  //       emit('refresh');
  //       formData.value = {
  //         radius: null
  //       };
  // visible.value = false;
  //     } else {
  //       useMessage().error(response.msg);
  //     }
  //   } else {
  //     console.log('error submit!', fields);
  //   }
  // });
};
const resetForm = () => {
  emit('refresh');
  visible.value = false;
};


// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss">
.tips {
  width: 100%;
  margin: auto;
  text-align: center;
}
.dialog-footer{
   width: 100%;
  margin: auto;
  text-align: center;
}
</style>
