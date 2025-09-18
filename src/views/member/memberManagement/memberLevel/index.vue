<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button type="primary" class="ml10" @click="toDetail('edit')"> 编辑等级方案 </el-button>
					<el-button class="ml10" @click="toDetail('detail')"> 管理成长值 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="level" label="等级" show-overflow-tooltip width="70">
					<template #default="{ row }">
						<span>LV{{ row.level }}</span>
					</template>
				</el-table-column>
				<el-table-column label="员工标签卡" prop="staffSignImg" width="205">
					<template #default="{ row }">
						<img :src="row.staffSignImg" class="img-center" style="max-width: 180px; max-height: 200px" />
					</template>
				</el-table-column>
				<el-table-column label="非员工标签卡" prop="noStaffSignImg" width="205">
					<template #default="{ row }">
						<img :src="row.noStaffSignImg" class="img-center" style="max-width: 180px; max-height: 200px" />
					</template>
				</el-table-column>
				<el-table-column label="签到页背景图" prop="signListImg" width="205">
					<template #default="{ row }">
						<img :src="row.signListImg" class="img-center" style="max-width: 180px; max-height: 200px" />
					</template>
				</el-table-column>
				<el-table-column label="会员页背景图" prop="backgroundImg" width="205">
					<template #default="{ row }">
						<img :src="row.backgroundImg" class="img-center" style="max-width: 180px; max-height: 200px" />
					</template>
				</el-table-column>
				<el-table-column prop="levelName" label="等级名称" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="threshold" label="升级条件(成长值)" show-overflow-tooltip></el-table-column>
				<el-table-column label="权益" prop="ruleImg" width="205">
					<template #default="{ row }">
						<img :src="row.ruleImg" class="img-center" style="max-width: 180px; max-height: 200px" />
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="80">
					<template #default="scope">
						<el-button text type="primary" @click="toDetail('singleEdit', scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
// import type { CascaderProps } from 'element-plus'
import { getMemberLevelist } from '../../../../api/member/member';
import { useRouter } from 'vue-router';
const router = useRouter();
// const deptProps:CascaderProps ={
// 	value: 'deptCode',
// 	label: 'deptName',
// 	children: 'childNode'
// }

const toDetail = (type: string, data?: any) => {
	if (type === 'edit') {
		router.push({
			path: '/member/memberManagement/memberLevel/edit',
		});
	} else if (type === 'singleEdit') {
		console.log('编辑单个', data);
		router.push({
			path: '/member/memberManagement/memberLevel/edit',
			query: data,
		});
	} else {
		router.push({ path: '/member/memberManagement/memberLevel/detail' });
	}
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberLevelist, // H
	descs: ['create_time'],
});

//  table hook
const { currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
