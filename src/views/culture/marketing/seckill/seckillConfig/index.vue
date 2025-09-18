<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view">
            <el-row class="justify-between">
                <el-form :inline="true" :model="state.queryForm" @keyup.enter="getData" ref="queryRef">
                    <el-row>
                        <el-form-item label="是否显示" prop="status" label-width="68px">
                            <el-select v-model="state.queryForm.status" style="width: 180px;" placeholder="请选择"
                                clearable>
                                <el-option label="关闭" :value="0" />
                                <el-option label="开启" :value="1" />
                            </el-select> </el-form-item>
                        <el-form-item>
                            <el-button @click="getData" icon="search" type="primary">查询</el-button>
                            <el-button @click="resetQuery" icon="Refresh">重置</el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-row class="mb8 flex items-center">
                <div>
                    <el-button type="primary" @click="add" icon="Plus"> 添加秒杀配置 </el-button>
                </div>
            </el-row>
            <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border
                :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
                <el-table-column label="序号" type="index" width="60" align="center" />
                <el-table-column prop="name" label="时段名称" min-width="150" :show-overflow-tooltip="true" />
                <el-table-column label="秒杀时段" min-width="100">
                    <template #default="scope">
                        {{ scope.row.startTime + '-' + scope.row.endTime }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="150">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" :active-value="1" style="--el-switch-on-color: #13ce66"
                            :inactive-value="0" :before-change="() => beforeChange(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" min-width="130" />
                <el-table-column label="操作" prop="action">
                    <template #default="scope">
                        <el-button class="mr-2" text type="primary"
                            @click="formDialogRef.openDialog(scope.row)"> 编辑
                        </el-button>
                        <el-button text type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <formDialog ref="formDialogRef" @refresh="getData"></formDialog>
    </div>
</template>

<script lang="ts" setup name="pointsGrant">
import {
    seckillIntervalListApi,
    seckillIntervalDeleteApi,
    seckillIntervalSwitcheApi,
} from '/@/api/culture/marketing.ts';
import { useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
// 引入组件
const formDialog = defineAsyncComponent(() => import('./form.vue'));

// 搜索变量
const queryRef = ref();
const formDialogRef = ref();
const state = reactive({
    queryForm: {},
    dataList: [],
});
//  table hook
const { tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
    queryRef.value.resetFields();
    getData();
};
const getData = () => {
    seckillIntervalListApi(state.queryForm).then(res => {
        state.dataList = res.data || [];
    })
}
const add = ()=>{
    formDialogRef.value.openDialog();
}
const handleDelete = async (ids: string) => {
    try {
        await useMessageBox().confirm('确认删除该条数据？');
    } catch {
        return;
    }
    try {
        await seckillIntervalDeleteApi(ids);
        getData();
        useMessage().success('删除成功');
    } catch (err: any) {
        useMessage().error(err.msg);
    }
};
const beforeChange = async (row: any) => {
    const msg = row.status == 0 ? '确定要启用该时段吗?' : '确定要禁用该时段吗?';
    try {
        await useMessageBox().confirm(msg);
    } catch {
        return;
    }
    try {
        // let changeStatus: any;
        // if (row.status == 1) changeStatus = 0;
        // if (row.status == 0) changeStatus = 1;
        // const params = {
        //     status: changeStatus,
        //     unionId: row.unionId,
        // };
        await seckillIntervalSwitcheApi(row.id);
        useMessage().success('操作成功');
        getData();
        return true;
    } catch (err: any) {
        useMessage().error(err.msg);
    }
};
getData();
</script>
<style lang="scss" scoped></style>
