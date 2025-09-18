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
				<el-table-column prop="code" label="投放编号" />
				<el-table-column prop="spaceName" label="投放广告位" />
				<el-table-column prop="fileUrl" label="素材预览">
					<template #default="scope">
						<el-image class="w-[50px] h-[50px]" :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" fit="contain" preview-teleported />
					</template>
				</el-table-column>
				<el-table-column prop="signCodes" label="可见用户标签" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.signCodes.map((code: string) => memberSignMap?.get(code) || code).join(',') }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="linkUrl" label="链接" />
				<el-table-column prop="appId" label="外部小程序ID">
					<template #default="scope">
						<span>{{ scope.row.appId || '-' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="startTime" label="投放时间">
					<template #default="scope">
						<span>{{ dayjs(scope.row.startTime).format('YYYY-MM-DD') }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" show-overflow-tooltip />
				<el-table-column prop="applyPhone" label="申请账号手机号" />
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-switch
							v-model="row.isPublish"
							inline-prompt
							:active-value="true"
							:inactive-value="false"
							active-text="开"
							inactive-text="关"
							@change="handleStatusChange(row)"
						/>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup name="releaseManage">
import dayjs from 'dayjs';
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { advertPublishPage, advertSpaceList, adUpdatePublishStatus } from '/@/api/ad/advertise';
import { getMemberSignList } from '/@/api/member/memberLabel/label';

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: advertPublishPage,
	queryForm: {
		auditStatus: 2,
	},
	dataList: [],
});
const advertisingList = ref();
const getAdvertisingList = async () => {
	const res = await advertSpaceList({ type: 1 }); // 1: 自然广告位 2: 推送广告位
	advertisingList.value = res.data;
};
const memberSignList = ref();
const getMemberSignListApi = async () => {
	const res = await getMemberSignList();
	memberSignList.value = res.data;
};
const memberSignMap = computed(() => {
	const map = new Map();
	memberSignList.value?.forEach((item: any) => {
		map.set(item.code, item.name);
	});
	return map;
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleStatusChange = async (row: any) => {
	const params = { code: row.code, isPublish: row.isPublish };
	try {
		const { msg, ok } = await adUpdatePublishStatus(params);
		if (ok) {
			useMessage().success('修改成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	daterangeTime.value = [];
	state.queryForm = {};
	state.queryForm.auditStatus = 2;
	getDataList();
};

onMounted(() => {
	getAdvertisingList();
	getMemberSignListApi();
});
</script>

<style scoped lang="scss"></style>
