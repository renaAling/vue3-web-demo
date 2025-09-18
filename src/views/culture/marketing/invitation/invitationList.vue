<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view">
            <el-row class="justify-between">
                <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
                    <el-row>
                        <el-form-item label="邀请人手机号" prop="inviteUserMobile">
                            <el-input v-model="state.queryForm.inviteUserMobile" style="width: 180px;"
                                placeholder="请输入邀请人手机号" maxlength="11" class="selWidth" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="被邀请人手机号" prop="toInviteUserMobile">
                            <el-input v-model="state.queryForm.toInviteUserMobile" style="width: 180px;"
                                placeholder="请输入被邀请人手机号" maxlength="11" class="selWidth" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="活动名称" prop="activityName">
                            <el-input v-model="state.queryForm.activityName" style="width: 180px;" placeholder="请输入活动名称"
                                class="selWidth" clearable maxlength="200"></el-input>
                        </el-form-item>
                        <el-form-item label="活动日期" prop="createTime">
                            <el-date-picker v-model="createTime" type="datetimerange" range-separator="-"
                                format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                                style="width: 250px" />
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="getDataList" icon="search" type="primary">查询</el-button>
                            <el-button @click="resetQuery" icon="Refresh">重置</el-button>
                            <el-button @click="exportExcel"> 导出 </el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-row>
            <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border 
                :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
                <el-table-column label="邀请人昵称" prop="inviteUserName" min-width="180"> </el-table-column>
                <el-table-column prop="inviteUserMobile" label="邀请人手机号" min-width="100" />
                <el-table-column prop="name" label="受邀活动名称" min-width="130" />
                <el-table-column prop="" label="活动时间" min-width="180">
                    <template #default="scope">
                        {{ scope.row.startTime }}至{{ scope.row.endTime }}
                    </template>
                </el-table-column>
                <el-table-column prop="toInviteUserName" label="被邀请人昵称" min-width="90" />
                <el-table-column prop="toInviteUserMobile" label="被邀请人手机号" min-width="90" />
                <el-table-column prop="inviteTime" label="受邀时间" fixed="right" min-width="120" />
            </el-table>
            <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
                v-bind="state.pagination" />
        </div>
    </div>
</template>

<script lang="ts" setup name="invitationList">
import {
    pageInviteRecord
} from '/@/api/culture/cultureMarketing';

import { BasicTableProps, useTable } from '/@/hooks/table';
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
    pageList: pageInviteRecord,
    queryForm: {},
    dataList: [],
});

const createTime = ref([]);
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle,downBlobFile } = useTable(state);

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

// 清空搜索条件
const resetQuery = () => {
    queryRef.value.resetFields();
    state.queryForm.startTime = '';
    state.queryForm.endTime = '';
    createTime.value = [];
    getDataList();
};
// 下载业务报表
const exportExcel = () => {
    downBlobFile('/tracomps-admin/api/admin/inviteRecord/export', state.queryForm, '参与记录列表.xlsx');
    // inviteRecordExport(state.queryForm).then(() => {
    //     router.push({ path: '/downloadCenter' });
    // });
};

</script>
<style lang="scss" scoped></style>
