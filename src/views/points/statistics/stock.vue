<template>
    <div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
        <div class="layout-padding-auto layout-padding-view">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="总计" name="total">
                    <el-row>
                        <el-form :inline="true" :model="stateTotal.queryForm" ref="queryTotalRef">
                            <el-form-item prop="searchTime" label="选择时间">
                                <el-date-picker v-model="stateTotal.queryForm.searchTime" value-format="YYYY-MM-DD"
                                    style="width: 280px" type="date" placeholder="开始时间" :disabled-date="disabledDate"
                                    @change="handleChange" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="refreshT">查看今日</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <el-card style="max-width: 540px" v-loading="loading">
                        <!-- 总览 -->
                        <div>
                            <div class="text-[20px] font-medium">积分存量池总览</div>
                            <div class="text-[#165DFF] text-[20px] font-medium mt-[8px]">{{ pandectInfo.scoreStock || 0
                            }}</div>
                        </div>
                        <el-row class="mt-[30px]">
                            <el-col :span="8">
                                <div class="text-[18px] font-medium">积分已发放</div>
                                <div class="text-[#165DFF] text-[18px] font-medium mt-[8px]">{{
                                    pandectInfo.scoreIncreaseSum || 0 }}</div>
                            </el-col>
                            <el-col :span="8">
                                <div class="text-[18px] font-medium">积分已使用</div>
                                <div class="text-[#165DFF] text-[18px] font-medium mt-[8px]">{{
                                    pandectInfo.scoreDeductionSum || 0 }}</div>
                            </el-col>
                            <el-col :span="8">
                                <div class="text-[18px] font-medium">积分已过期</div>
                                <div class="text-[#165DFF] text-[18px] font-medium mt-[8px]">{{
                                    pandectInfo.scoreExpiredSum || 0 }}</div>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-tab-pane>
                <el-tab-pane label="用户" name="user">
                    <el-row class="justify-between">
                        <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
                            <el-row>
                                <el-form-item label="用户id" prop="unionId">
                                    <el-input placeholder="请输入用户id" style="width: 180px"
                                        v-model="state.queryForm.unionId" />
                                </el-form-item>
                                <el-form-item label="用户名称" prop="userName">
                                    <el-input placeholder="请输入用户名称" style="width: 180px"
                                        v-model="state.queryForm.userName" />
                                </el-form-item>
                                <el-form-item label="手机号" prop="mobile">
                                    <el-input placeholder="请输入手机号" style="width: 180px"
                                        v-model="state.queryForm.mobile" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click="getDataList" icon="search" type="primary">查询</el-button>
                                    <el-button @click="resetQuery" icon="Refresh">重置</el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </el-row>
                    <el-row class="mb8 flex justify-start items-center">
                        <div>
                            <el-button type="default" @click="exportExcel"> 导出 </el-button>
                        </div>
                    </el-row>
                    <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border 
                        :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
                        <el-table-column type="index" label="序号" width="60" align="center" />
                        <el-table-column label="用户id" prop="unionId" />
                        <el-table-column label="用户名称" prop="userName" />
                        <el-table-column label="手机号" prop="mobile" />
                        <el-table-column label="积分剩余" prop="score" />
                        <el-table-column label="操作">
                            <template #default="{ row }">
                                <el-button type="primary" link @click="toDetail(row)">查看流水</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
                        v-bind="state.pagination" />
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>
    </div>
    <div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="type = 'list'"></listDetail>
	</div>
</template>

<script lang="ts" setup name="pointsGrant">
import { accountList, exportAccountPage } from '/@/api/points/manage';
import { BasicTableProps, useTable } from '/@/hooks/table';
import type { TabsPaneContext } from 'element-plus'
import { dataOverview, dataOverviewByToday } from '/@/api/points/manage';
import { useMessageBox } from '/@/hooks/message';
import listDetail from '../manage/details.vue';
const listDetailRef = ref();

const activeName = ref('total')
let type = ref('list');
// 搜索变量
const queryRef = ref();
const router = useRouter();
// 事件列表
const state: BasicTableProps = reactive<BasicTableProps>({
    pageList: accountList,
    queryForm: {},
    dataList: [],
});
interface infoTs {
    scoreStock?: number | string;
    scoreIncreaseSum?: number | string;
    scoreDeductionSum?: number | string;
    scoreExpiredSum?: number | string;
}
const queryTotalRef = ref();
const loading = ref(false);
const stateTotal = reactive({
    queryForm: {
        searchTime: '',
    },
});
const pandectInfo = ref<infoTs>({});
const disabledDate = computed(() => {
    return (time: any) => {
        return time.getTime() > Date.now() - 86400000;
    };
});

const refreshT = () => {
    queryTotalRef.value.resetFields();
    lockToday();
};

const handleChange = () => {
    loading.value = true;
    pandectInfo.value = {};
    dataOverview({ date: state.queryForm.searchTime })
        .then((res) => {
            pandectInfo.value = res.data;
        })
        .finally(() => {
            loading.value = false;
        });
};
// 只看今日
const lockToday = () => {
    loading.value = true;
    pandectInfo.value = {};
    dataOverviewByToday()
        .then((res) => {
            pandectInfo.value = res.data;
        })
        .finally(() => {
            loading.value = false;
        });
};
const handleClick = (tab: TabsPaneContext) => {

    // 切换tab
    if (tab.paneName == 'user') {
        //state.dataList1 = state.dataList1
    } else {
        //lockToday();
    }
}

onMounted(() => {
    lockToday();
})

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
    queryRef.value.resetFields();
    state.queryForm.handleStartTime = '';
    state.queryForm.handleEndTime = '';
    getDataList();
};

// 导出
const exportExcel = async () => {
    try {
        await useMessageBox().confirm('导出完成后请到下载中心查看，是否继续导出？');
    } catch {
        return;
    }
    exportAccountPage(state.queryForm).then(() => {
        router.push({ path: '/downloadCenter' });
    });
};
// const toDetail = (unionId: string) => {
//     router.push({ path: '/points/manage/details', query: { unionId } });
// };
const toDetail = (row: any) => {
	// router.push({ path: '/points/manage/details', query: { unionId: row.unionId } });
	listDetailRef.value.show(row.unionId);
	type.value = 'detail';
};
</script>
<style lang="scss" scoped></style>
