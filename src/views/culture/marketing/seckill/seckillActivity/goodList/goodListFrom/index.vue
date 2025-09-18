<template>
  <div>
    <el-dialog title="商品列表" v-model="state.visible" width="1196px" :before-close="handleClose" class="dialog-bottom">
      <good-list v-if="state.visible" @getStoreItem="getStoreItem" :handleNum="state.handleNum" :checked="state.checked"
        :goodsType="state.goodsType" @closeDialog="closeDialog"></good-list>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="GoodListFrom">
import goodList from '../index.vue';
const state = reactive({
  handleNum: '',
  visible: false,
  callback: function () { },
  checked: [],
  goodsType: '',
})
const closeDialog = () => {
  state.visible = false;
};
const handleClose = () => {
  state.visible = false;
};
const getStoreItem = (img) => {
  state.callback(img);
  state.visible = false;
};
defineExpose({
  state
})
</script>

<style scoped></style>
