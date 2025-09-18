<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="批次名称">
						<el-input placeholder="请输入批次名称" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="激活状态">
						<el-select v-model="state.queryForm.status" placeholder="请选择激活状态" clearable>
							<el-option label="开启" :value="true"></el-option>
							<el-option label="关闭" :value="false"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb8">
				<el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" align="center" />
				<el-table-column label="批次编号" prop="code" show-overflow-tooltip />
				<el-table-column label="批次名称" prop="name" />
				<el-table-column label="关联会员类型" prop="cardName" />
				<el-table-column label="卡密数量" prop="num" />
				<el-table-column label="已使用" prop="useNum" />
				<el-table-column label="有效期" prop="isLasting" width="200">
					<template #default="scope">
						{{
							scope.row.isLasting ? '永久' : `${dayjs(scope.row.startTime).format('YYYY-MM-DD')} - ${dayjs(scope.row.endTime).format('YYYY-MM-DD')}`
						}}
					</template>
				</el-table-column>
				<el-table-column label="状态" prop="status">
					<template #default="scope">
						<el-switch
							v-model="scope.row.status"
							inline-prompt
							:active-value="true"
							:inactive-value="false"
							active-text="开"
							inactive-text="关"
							@change="handleStatusChange(scope.row)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="生成时间" prop="createTime" />
				<el-table-column label="操作" width="160">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCheck(row)">查看</el-button>
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
						<el-button type="primary" link @click="handleDel(row)">作废</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<FormDialog v-model="formDialogVisible" :row="currentRow" :type="type" @ok="getDataList" />
	</div>
</template>

<script lang="ts" setup name="memberCards">
import dayjs from 'dayjs';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { paidMemberCdkeyPageApi, switchPaidMemberCdkeyApi, deletePaidMemberCdkeyApi, paidMemberCdkeyInfoApi } from '/@/api/culture/member';

const FormDialog = defineAsyncComponent(() => import('./components/cardsForm.vue'));

const router = useRouter();
const type = ref<'add' | 'edit'>('add');
const formDialogVisible = ref(false);
const currentRow = ref();
const handleAdd = () => {
	formDialogVisible.value = true;
	currentRow.value = { status: false, isLasting: false };
	type.value = 'add';
};

const handleCheck = (row: any) => {
	router.push({ path: '/culture/member/cardsDetail', query: { id: row.id } });
};

const handleEdit = async (row: any) => {
	const res = await paidMemberCdkeyInfoApi(row.id);
	currentRow.value = { ...res.data, daterangeTime: !res.data.isLasting ? [res.data.startTime, res.data.endTime] : [] };
	formDialogVisible.value = true;
	type.value = 'edit';
};

const handleStatusChange = async (row: any) => {
	const params = { id: row.id, status: row.status };
	try {
		const { code, msg } = await switchPaidMemberCdkeyApi(params);
		if (code === 0) {
			useMessage().success('修改成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

// 搜索变量
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: paidMemberCdkeyPageApi,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
  state.queryForm.name = '';
  state.queryForm.status = '';
	queryRef.value.resetFields();
	getDataList();
};

const handleDel = async (row: any) => {
	try {
		await useMessageBox().confirm('此操作将作废该批次内未绑定用户的剩余卡密');
		let res = await deletePaidMemberCdkeyApi(row.id);
		if (!res.ok) {
			return useMessage().error(res.msg);
		}
		getDataList();
		return true;
	} catch (err: any) {
		return false;
	}
};
</script>
