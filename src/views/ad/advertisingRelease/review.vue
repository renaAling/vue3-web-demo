<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="广告位选择">
						<el-select v-model="state.queryForm.spaceCode" placeholder="请选择">
							<el-option :label="item.name" :value="item.code" v-for="(item, index) in advertisingList" :key="index" />
						</el-select>
					</el-form-item>
					<el-form-item label="申请人手机号">
						<el-input placeholder="请输入" v-model="state.queryForm.applyPhone" />
					</el-form-item>
					<el-form-item label="申请日期">
						<el-date-picker
							v-model="daterangeTime"
							:clearable="false"
							@change="changeTime"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="code"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column prop="code" label="广告投放ID" />
				<el-table-column prop="spaceName" label="投放广告位" />
				<el-table-column prop="fileUrl" label="素材预览">
					<template #default="scope">
						<el-image class="w-[50px] h-[50px]" :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" fit="contain" preview-teleported />
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" show-overflow-tooltip />
				<el-table-column prop="startTime" label="投放时间">
					<template #default="scope">
						<span>{{ dayjs(scope.row.startTime).format('YYYY-MM-DD') }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="applyPhone" label="申请人手机号" />
				<el-table-column prop="auditStatus" label="审核状态">
					<template #default="scope">
						<el-tag>{{ scope.row.auditStatus == 1 ? '待审核' : scope.row.auditStatus == 2 ? '审核通过' : '审核拒绝' }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleDetail(row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup name="review">
import dayjs from 'dayjs';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { advertPublishPage, advertSpaceList } from '/@/api/ad/advertise';

const router = useRouter();
const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: advertPublishPage,
	queryForm: {},
	dataList: [],
});
const advertisingList = ref();
const getAdvertisingList = async () => {
	const res = await advertSpaceList({ type: 1 }); // 1: 自然广告位 2: 推送广告位
	advertisingList.value = res.data;
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleDetail = (row: any) => {
	router.push({ path: '/ad/advertisingRelease/form', query: { code: row.code } });
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	daterangeTime.value = [];
	state.queryForm = {};
	getDataList();
};

onMounted(() => {
	getAdvertisingList();
});
</script>

<style scoped lang="scss"></style>
