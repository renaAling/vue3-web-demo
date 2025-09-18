<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
					<el-form-item label="用户名">
						<el-input placeholder="请输入" v-model="state.queryForm.contact" clearable />
					</el-form-item>
					<el-form-item label="联系电话">
						<el-input placeholder="请输入" v-model="state.queryForm.contactPhone" clearable />
					</el-form-item>
					<el-form-item label="企业名称">
						<el-input placeholder="请输入" v-model="state.queryForm.companyName" clearable />
					</el-form-item>
					<el-form-item label="提交时间">
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
					<el-form-item label="业务类型">
						<el-select v-model="state.queryForm.bizCode" placeholder="请选择" clearable>
							<el-option label="商铺出租" value="SPCZ"></el-option>
							<el-option label="接口咨询" value="JKZX"></el-option>
							<el-option label="机会清单" value="JHQD"></el-option>
							<el-option label="企业广告" value="QYGG"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-4">
				<el-button @click="handleExport" type="primary">导出</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="createName" label="用户名" />
				<el-table-column prop="createBy" label="uid" show-overflow-tooltip />
				<el-table-column prop="contact" label="姓名" />
				<el-table-column prop="contactPhone" label="联系电话" />
				<el-table-column prop="companyName" label="企业名称" />
				<el-table-column prop="remark" label="备注" show-overflow-tooltip />
				<el-table-column prop="bizName" label="业务类型" />
				<el-table-column prop="createTime" label="提交时间" width="180" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup name="collection">
import { downBlobFile } from '/@/utils/other';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { bizMessagePageApi } from '/@/api/cooperation/collection';

// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: bizMessagePageApi,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

const handleExport = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/business/biz/message/export', params, '信息收集列表.xlsx');
};

// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {};
	daterangeTime.value = [];
	getDataList();
};
</script>

<style scoped lang="scss"></style>
