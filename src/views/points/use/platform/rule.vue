<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view" style="padding: 30px;">
            <div class="text-xl  mb-4">使用规则</div>
            <div class="bg-[#F5F5F5] p-5 rounded-xl ">
                <span class="text-xl text-[#7b7b7c]">
                    <span class="font-bold text-black mr-1 text-2xl">1</span>
                    积分可抵扣
                    <span class="font-bold text-black mx-1 text-2xl">{{state.pointsToCurrencyRatio || '0.01'}}</span>
                    (元)</span>
                <el-button type="default" icon="Setting" class="ml-4" @click="toSet">设置</el-button>

                <div v-if="state.isSet">
                    <el-divider />
                    <div class="flex items-center text-xl text-[#7b7b7c] mb-5">
                        <span class="">1积分可抵扣</span>
                        <el-input placeholder="必须为数字,最多两位小数" class=" mx-3" style="width:200px"
                            v-model="state.money"></el-input>
                        <span>(元)</span>
                    </div>
                    <div class="dialog-footer">
                        <el-button @click="onSubmit" type="primary" :disabled="state.loading">保存</el-button>
                        <el-button @click="cancel">{{ $t('common.cancelButtonText') }}</el-button>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="pointsGrant">
import { platformRuleList, platformRuleUpdate } from '/@/api/points/manage';
import { useMessage } from '/@/hooks/message';

let state = reactive({
    isSet: false,
    pointsToCurrencyRatio: '',
    money:'',
    id: '',
    loading: false
})
const toSet = () => {
    state.isSet = true
}
const cancel = () => {
    state.isSet = false
    state.money = ''
}
const validateInput = (input: string) => {
    // 正则表达式匹配大于0且保留两位小数
    const regex = /^([1-9]\d*(\.\d{1,2})?|0?\.\d{1,2})$/;

    if (input === "" || isNaN(Number(input))) {
        return false;
    }

    const number = parseFloat(input);
    if (!regex.test(input)) {
        return false;
    }

    if (number <= 0) {
        return false;
    }

    return true;
}
const onSubmit = () => {
    // 判断输入框内容是否为数字
    if (!validateInput(state.money)) {
        useMessage().error('金额必须为整数且最多保留两位整数！');
        return;
    }
    state.loading = true;
    platformRuleUpdate({ id: state.id, pointsToCurrencyRatio: state.money }).then(() => {
        state.pointsToCurrencyRatio = state.money
        state.isSet = false
        useMessage().success('保存成功！');
        getDate();
    }).finally(() => state.loading = false)
}
const getDate = () => {
    platformRuleList().then(res => {
        state.id = res.data[0]?.id
        state.pointsToCurrencyRatio = res.data[0]?.pointsToCurrencyRatio
    })
}
getDate()
</script>
<style lang="scss" scoped></style>
