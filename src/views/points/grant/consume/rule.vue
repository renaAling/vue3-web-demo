<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view">
            <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border 
                :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
                <el-table-column label="平台名称" prop="name" />
                <el-table-column label="消费金额" prop="consumeAmount" />
                <el-table-column label="发放积分" prop="rewardPoints" />
                <el-table-column label="操作">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="toSet(row)">设置</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <formDialog ref="formDialogRef" @refresh="getData"></formDialog>
    </div>
</template>

<script lang="ts" setup name="pointsGrant">
import { consumeRuleList } from '/@/api/points/grant';
import { BasicTableProps, useTable } from '/@/hooks/table';
// 引入组件
const formDialog = defineAsyncComponent(() => import('./ruleForm.vue'));
const formDialogRef = ref();

// 发放渠道
// 事件列表
const state: BasicTableProps = reactive<BasicTableProps>({
    dataList: [],

});
const toSet = (row) => {
    formDialogRef.value.openDialog(row);
}

//  table hook
const { tableStyle } = useTable(state);

const getData = () => {
    consumeRuleList().then(res => {
        state.dataList = res.data;
    })
}
getData()
</script>
<style lang="scss" scoped></style>
