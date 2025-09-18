<template>
    <el-dialog :footer="false" :close-on-click-modal="false" title="员工卡余额明细" width="800" draggable v-model="visible">
        <el-scrollbar height="400px">
            <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border
                :cell-style="tableStyle.cellStyle" height="400" :header-cell-style="tableStyle.headerCellStyle">
                <el-table-column prop="tradeTime" label="时间" show-overflow-tooltip></el-table-column>
                <el-table-column label="类型" show-overflow-tooltip>
                    <template #default="{ row }">
                        <div v-if="row.tradeType == 1">增加</div>
                        <div v-if="row.tradeType == 2">扣减</div>
                    </template>
                </el-table-column>
                <el-table-column label="金额" show-overflow-tooltip>
                    <template #default="scope">
                        <div v-if="scope.row.amount">{{ `${scope.row.amount}元` }}</div>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
        <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
    </el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import {
    getMemberStaffWalletFlow
} from '/@/api/member/member.ts';
// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
    // pageList: [],
    queryForm: {},
    dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);


// 打开弹窗
const openDialog = (row: any) => {
    visible.value = true;
    const params = {
        userGuid: row.guid,
        current: state.pagination.current,
        size: state.pagination.size,
        tradeType: '',
    };
    state.queryForm = params;
    getMemberStaffWalletFlow(params)
        .then(() => {
            getDataList();
        })
        .catch((err) => {
            useMessage().error(err.msg);
        });
};



// 暴露变量
defineExpose({
    openDialog,
});
</script>
