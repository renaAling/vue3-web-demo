<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-row>
						<el-form-item :label="$t('memberManager.uid')" prop="unionId">
							<el-input
								:placeholder="$t('memberManager.inputUidTip')"
								maxlength="50"
								style="width: 220px"
								v-model="state.queryForm.unionId"
								clearable
							/>
						</el-form-item>
						<el-form-item :label="$t('memberManager.mobile')" prop="mobile">
							<el-input
								:placeholder="$t('memberManager.inputMobileTip')"
								maxlength="11"
								style="width: 220px"
								v-model="state.queryForm.mobile"
								clearable
							/>
						</el-form-item>
						<el-form-item label="是否员工" prop="isStaff">
							<el-select v-model="state.queryForm.isStaff" style="width: 220px" placeholder="选择用户状态" clearable>
								<el-option v-for="item in staffStatus" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
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
							<el-button icon="search" type="primary" @click="getDataList">
								{{ $t('common.queryBtn') }}
							</el-button>
							<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="unionId" :label="$t('memberManager.uid')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" :label="$t('memberManager.mobile')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isStaff" label="员工" show-overflow-tooltip>
					<template #default="scope">
						<span class="text-green-400" v-if="scope.row.isStaff === '1'">是</span>
						<span v-else>否</span>
					</template>
				</el-table-column>
				<el-table-column prop="growthValue" label="成长值" show-overflow-tooltip></el-table-column>
				<el-table-column prop="levelName" label="等级" show-overflow-tooltip></el-table-column>
				<el-table-column prop="lastLoginTime" label="最近登录" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userState" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<span v-if="scope.row.userState == 1">正常</span>
						<span v-if="scope.row.userState == 2">冻结</span>
						<!-- <span v-if="scope.row.userState == 3">注销</span> -->
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="100">
					<template #default="scope">
						<el-button text type="primary" @click="toDetail(scope.row.unionId)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageMemberList, getLevelList } from '../../../../api/member/member';
import { useRouter } from 'vue-router';
const router = useRouter();

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
		// {
		// 	value: 3,
		// 	label: '注销',
		// },
	],
	levelArr: [],
});
const staffStatus = ref([
	{
		value: 1,
		label: '是',
	},
	{
		value: 0,
		label: '否',
	},
]);
onMounted(async () => {
	const res = await getLevelList();
	queryForm.levelArr = res.data;
});
const toDetail = (id: string) => {
	router.push({ path: '/member/memberManagement/memberManager/detail', query: { id } });
};
const queryRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		unionId: '',
		mobile: '',
		userState: '',
		level: '',
	},
	pageList: pageMemberList, // H
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
