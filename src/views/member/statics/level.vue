<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb8 mt8 flex justify-start items-center">
				<div>
					统计时间：{{staticsTime}}（数据每小时更新）
				</div>
			</el-row>
			<el-table
				:data="dataList"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="等级" prop="level" />
				<el-table-column label="等级名称" prop="levelName" />
                <el-table-column label="等级人数" prop="userCount" />
			</el-table>
		</div>
	</div>
</template>

<script lang="ts" setup name="level">
import { userLevelPage } from '/@/api/member/statics';
import { BasicTableProps, useTable } from '/@/hooks/table';

// 搜索变量
interface UserLevel {
  id: number;
  level: number | string;
  levelName: string;
  userCount: number;
  statisticTime?: string;
}

const dataList = ref<UserLevel[]>([]);
const staticsTime = ref('');
onMounted(() => {
	getDataList()
});
const state: BasicTableProps = reactive<BasicTableProps>({
	// pageList: reBuyReportPage,
	queryForm: {
		type: '1',
	},
	dataList: [],
});
const { tableStyle } = useTable(state);

const getDataList = async() => { 
	try { 
		const res = await userLevelPage();
	 if (res.data.length > 0) { 
		dataList.value = res.data;
		 staticsTime.value = dataList.value[0]?.statisticTime ?? '';
	 } else { 
		dataList.value = [];
	 }
	} catch (error) {
		console.log(error);
	}


	
};
</script>
<style lang="scss" scoped></style>
