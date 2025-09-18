<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-row>
						<el-form-item label="标签分类" prop="categoryCode">
							<el-select v-model="state.queryForm.categoryCode" placeholder="请选择标签分类" clearable>
								<el-option v-for="item in categoryCodeList" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode" />
							</el-select>
						</el-form-item>
						<el-form-item label="标签名称" prop="name">
							<el-input placeholder="请输入标签名称" maxlength="50" v-model="state.queryForm.name" clearable />
						</el-form-item>
						<el-form-item label="创建时间" prop="timeData">
							<el-date-picker
								v-model="timeData"
								:clearable="false"
								type="daterange"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
							/>
						</el-form-item>
						<el-form-item label="标签类型" prop="type">
							<el-select v-model="state.queryForm.type" placeholder="选择标签分类" clearable>
								<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
							<el-button type="primary" icon="plus" @click="handleSync">同步</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				border
				row-key="id"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" width="80" align="center" label="序号" />
				<el-table-column prop="categoryName" label="标签分类" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="标签名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userNum" label="用户数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="description" label="标签说明" show-overflow-tooltip></el-table-column>
				<el-table-column prop="type" label="标签类型">
					<template #default="scope">
						<span v-if="scope.row.type == 1">系统标签</span>
						<span v-if="scope.row.type == 2">用户标签</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="userTagManage">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberSignPage, getMemberSignCategoryList } from '/@/api/member/memberLabel/label';
import { adPublishRefresh } from '/@/api/ad/advertise';
import { useMessage } from '/@/hooks/message';

const timeData = ref<string[]>([]);
const categoryCodeList = ref<any[]>([]);
const typeList = ref([
	{
		value: 1,
		label: '系统标签',
	},
	{
		value: 2,
		label: '用户标签',
	},
]);

watch(
	() => timeData.value,
	(val: string[]) => {
		console.log('val', val);
		if (val.length === 2) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

onMounted(() => {
	getMemberSignCategory();
});

const getMemberSignCategory = async () => {
	try {
		const { code, data, msg } = await getMemberSignCategoryList();
		if (code === 0) {
			categoryCodeList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberSignPage,
	dataList: [],
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleSync = () => {
	state.loading = true;
	adPublishRefresh().then(() => {
		state.loading = false;
		getDataList();
	});
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	timeData.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
</script>
