<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="联名卡名称" prop="carName">
						<el-input placeholder="请输入联名卡名称" v-model="state.queryForm.carName" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
                    <el-form-item label="持有人" prop="name">
						<el-input placeholder="请输入持有人" v-model="state.queryForm.name" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
                    <el-form-item label="持有人手机号" prop="mobile">
						<el-input placeholder="请输入持有人手机号" maxlength="11" v-model="state.queryForm.mobile" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="有效期" prop="timeData">
						<el-date-picker
							v-model="timeData"
							type="daterange"
							range-separator="至"
							style="width: 400px"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							clearable
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="exportExcel" icon="download" type="primary"> 导出数据 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="80" />
                <el-table-column label="联名卡名称" prop="carName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="所属机构" prop="orgName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="持有人" prop="name" />
                <el-table-column label="持有人手机号" prop="mobile" />
                <el-table-column label="有效期">
					<template #default="{ row }">
						<div>{{row.cooperationStartDate}}至{{row.cooperationEndDate}}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="left">
					<template #default="{ row }">
						<el-button type="danger" link icon="delete" @click="handleDelete(row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" carName="goodstore-card-index" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { cardUserList, delCard } from '/@/api/goodStore/xianwang';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 搜索变量
const queryRef = ref();
const timeData = ref<string[]>([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: cardUserList,
	queryForm: {},
	dataList: [],
});

watch(
	() => timeData.value,
	(val) => {
		console.log('val', val);
		if (val) {
			state.queryForm.startDate = val[0];
			state.queryForm.endDate = val[1];
		} else {
			state.queryForm.startDate = '';
			state.queryForm.endDate = '';
		}
	}
);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle, downBlobFile } = useTable(state);
// 导出excel
const exportExcel = () => {
	downBlobFile('/mall/car_org_user/excel', Object.assign(state.queryForm, { ids: [] }), '联名卡列表.xlsx');
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	timeData.value = [];
	state.queryForm.startDate = '';
	state.queryForm.endDate = '';
    state.queryForm.carName = '';
    state.queryForm.name = '';
    state.queryForm.mobile = '';
	getDataList();
};
// 删除
const handleDelete = async (id: string) => {
	useMessageBox()
		.confirm('是否删除该联名卡', '删除')
		.then(async () => {
			try {
				const { code, msg } = await delCard(id);
				if (code === 0) {
					useMessage().success('删除成功');
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		});
};
</script>
