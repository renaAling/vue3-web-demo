<template>
    <div>
        <el-cascader v-model="state.merIds" class="selWidth" :show-all-levels="false" :options="state.merSelect"
            :props="state.merProps" filterable clearable @change="onChangeMerId" />
    </div>
</template>

<script lang="ts" setup name="merUseCategory">

import * as merchant from '/@/api/culture/merchant.ts';

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false,
    },
    merIdChecked: {
        type: Array,
        default: () => [],
    },
})
const state = reactive({
    merProps: {
        value: 'id',
        label: 'name',
        children: 'merchantList',
        expandTrigger: 'hover',
        emitPath: false,
        multiple: true,
    },
    merSelect: [],
    merIds: [],
})

watch(() => props.merIdChecked, (n) => {
    state.merIds = n
})

onMounted(() => {
    state.merIds = props.merIdChecked.map((e: string) =>{return Number(e)});
    getMerList();
})
// 列表
const getMerList = () => {
    merchant.merCategoryListApi().then((res) => {
        state.merSelect = res.data;
    });
};
const emit = defineEmits(['getMerId']);
const onChangeMerId = () => {
    emit('getMerId', state.merIds);
}
</script>