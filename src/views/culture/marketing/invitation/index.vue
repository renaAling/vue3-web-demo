<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view">
            <el-row class="justify-between">
                <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
                    <el-row>
                        <el-form-item label="活动名称" prop="name">
                            <el-input v-model="state.queryForm.name" placeholder="请输入活动名称"  style="width:180px"
                                clearable></el-input>
                        </el-form-item>
                        <el-form-item label="活动日期" prop="createTime">
                            <el-date-picker
							v-model="createTime"
							type="datetimerange"
							range-separator="-"
                            format="YYYY-MM-DD HH:mm:ss"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
                            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
							style="width: 380px"
						/>
                        </el-form-item>
                        <el-form-item label="活动状态" prop="status">
                            <el-select v-model="state.queryForm.status" clearable placeholder="请选择活动状态" style="width:180px">
                                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="getDataList" icon="search" type="primary">查询</el-button>
                            <el-button @click="resetQuery" icon="Refresh">重置</el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-row class="mb8 flex  items-center">
                <router-link :to="{ path: '/culture/marketing/invitation/creatInvitation' }">
                    <el-button type="primary" icon="Plus">创建活动</el-button>
                </router-link>
            </el-row>
            <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border
                :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
                <el-table-column label="序号" type="index" width="60" align="center" />
                <el-table-column prop="name" :show-overflow-tooltip="true" label="活动名称" min-width="100" />
                <el-table-column prop="activityText" label="活动内容" min-width="150" :show-overflow-tooltip="true" />
                <el-table-column label="活动时间段" min-width="240">
                    <template #default="scope">
                        {{ scope.row.startTime }} - {{ scope.row.endTime }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="活动状态" min-width="90">
                    <template #default="scope">
                        <!-- <el-tag :class="scope.row.status">{{ ruleStateMap[(scope.row.status)] }}</el-tag> -->
                        <el-tag>{{ scope.row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建人" min-width="100" />
                <el-table-column prop="createTime" label="创建时间" min-width="150" />
                <el-table-column label="默认活动" min-width="150">
                    <template #default="scope">
                        <el-switch v-model="scope.row.deftStatus" :active-value="true" :inactive-value="false"
                            :before-change="() => beforeChange(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="action">
                    <template #default="scope">
                        <router-link
                            :to="{ path: '/culture/marketing/invitation/creatInvitation', query: { id: scope.row.id } }">
                            <el-button text type="primary"> 编辑</el-button>
                        </router-link>

                        <el-button text type="danger" class="ml-2" @click="handleDelete(scope.row.id)"> 删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
                v-bind="state.pagination" />
        </div>
    </div>
</template>

<script lang="ts" setup name="pointsGrant">
import { inviteActivityList, inviteActivityDelete, inviteActivityUpdate } from '/@/api/culture/cultureMarketing'

import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';

const createTime = ref([]);
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
    pageList: inviteActivityList,
    queryForm: {},
    dataList: [],
});

const statusOptions = [
  { label: '待开始', value: 1 },
  { label: '已开始', value: 2 },
  { label: '已结束', value: 3 },
];

watch(
	() => createTime.value,
	(val) => {
		if (val) {
			state.queryForm.startTime = val[0];
			state.queryForm.endTime = val[1];
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
    queryRef.value.resetFields();
    state.queryForm.startTime = '';
    state.queryForm.endTime = '';
    createTime.value = [];
    getDataList();
};

const handleDelete = async (id: string) => {
    try {
        await useMessageBox().confirm('确认删除该条数据？');
    } catch {
        return;
    }
    try {
        await inviteActivityDelete(id);
        getDataList();
        useMessage().success('删除成功');
    } catch (err: any) {
        useMessage().error(err.msg);
    }
};
const beforeChange = async (row: any) => {
    const msg = !row.deftStatus ? '确定要启用该活动吗?' : '确定要禁用该活动吗?';
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
        await inviteActivityUpdate({ id: row.id, deftStatus: !row.deftStatus });
        useMessage().success('操作成功');
        getDataList();
        return true;
    } catch (err: any) {
        useMessage().error(err.msg);
    }
};
</script>
<style lang="scss" scoped></style>
