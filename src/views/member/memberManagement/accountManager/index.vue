<template>
	<div class="layout" v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row shadow="hover" v-show="showSearch" class="ml10">
					<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
						<el-row>
							<el-form-item label="用户ID" prop="unionId">
								<el-input placeholder="请输入用户ID" maxlength="50" style="width: 220px" v-model="state.queryForm.unionId" clearable />
							</el-form-item>
							<el-form-item label="联系电话" prop="mobile">
								<el-input placeholder="请输入联系电话" maxlength="11" style="width: 220px" v-model="state.queryForm.mobile" clearable />
							</el-form-item>
							<el-form-item label="会员等级" prop="level">
								<el-select v-model="state.queryForm.level" style="width: 220px" placeholder="选择会员等级" clearable>
									<el-option v-for="item in queryForm.levelArr" :key="item.level" :label="item.levelName" :value="item.level" />
								</el-select>
							</el-form-item>
							<el-form-item label="状态" prop="userState">
								<el-select v-model="state.queryForm.userState" style="width: 220px" placeholder="选择用户状态" clearable>
									<el-option v-for="item in queryForm.stateArr" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
								<el-button icon="Refresh" @click="resetQuery">重置</el-button>
							</el-form-item>
						</el-row>
					</el-form>
				</el-row>
				<el-table
					:data="state.dataList"
					v-loading="state.loading"
					style="width: 100%"
					row-key="id"
					:cell-style="tableStyle.cellStyle"
					:header-cell-style="tableStyle.headerCellStyle"
				>
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column prop="unionId" label="用户ID" show-overflow-tooltip></el-table-column>
					<el-table-column prop="mobile" label="联系电话" show-overflow-tooltip></el-table-column>
					<el-table-column prop="totalGrowthValue" label="成长值" show-overflow-tooltip>
						<template #default="{ row }">
							<span>{{ row.totalGrowthValue ? row.totalGrowthValue : 0 }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="level" label="等级" show-overflow-tooltip>
						<template #default="{ row }">
							<!-- <span>{{ row.level ? 'LV' + row.level : '-' }}</span> -->
							<span>{{ row.levelName ? row.levelName : '-' }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="registerTime" label="注册时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="userState" label="状态" show-overflow-tooltip>
						<template #default="scope">
							<el-tag v-if="scope.row.userState == 1">正常</el-tag>
							<el-tag v-if="scope.row.userState == 2">冻结</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100">
						<template #default="scope">
							<el-button text type="primary" @click="toDetail(scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="changeType"></listDetail>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { useRoute } from 'vue-router';
import { getMemberUserPage, getLevelList } from '/@/api/member/memberManagement/accountManager';

const listDetail = defineAsyncComponent(() => import('./details.vue'));
const listDetailRef = ref();
let route = useRoute(); // 生成组件唯一id
// 筛选选择用户状态选项，1正常，2冻结
interface StateItem {
	value: number;
	label: string;
}
interface LevelObj {
	level: string;
	levelName: string;
	[str: string]: any;
}
interface QueryForm {
	stateArr: StateItem[];
	levelArr: LevelObj[];
}
// 组织可选列表
const queryForm = reactive<QueryForm>({
	stateArr: [
		{
			value: 1,
			label: '正常',
		},
		{
			value: 2,
			label: '冻结',
		},
	],
	levelArr: [],
});
const type = ref('list');
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		unionId: '',
		mobile: '',
		userState: '',
		level: '',
	},
	pageList: getMemberUserPage, // H
	descs: ['create_time'],
});
onMounted(() => {
	const data = route.query;
	console.log('data', data);
	if (data.unionId) {
		state.queryForm.unionId = data.unionId;
	}
	getLevelListData();
});
const getLevelListData = async () => {
	try {
		const { code, data, msg } = await getLevelList();
		if (code === 0) {
			console.log('getLevelListData', data);
			queryForm.levelArr = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const changeType = () => {
	type.value = 'list';
	getDataList();
};
const toDetail = (row: any) => {
	console.log('row', row);
	listDetailRef.value.show(row.unionId);
	type.value = 'detail';
};
const queryRef = ref();
const showSearch = ref(true);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>

<style>
.layout {
	height: 100%;
	overflow: auto;
	box-sizing: border-box;
}
</style>
