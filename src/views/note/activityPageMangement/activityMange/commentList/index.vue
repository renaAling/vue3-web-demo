<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer mb-4">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="昵称">
						<el-input placeholder="请输入昵称" maxlength="30" v-model="state.queryForm.nickName" clearable />
					</el-form-item>
					<el-form-item label="发布时间">
						<el-date-picker
							v-model="daterangeTime"
							@change="changeTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="state.queryForm.isShow" placeholder="请选择状态">
							<el-option label="显示" :value="true"></el-option>
							<el-option label="隐藏" :value="false"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="avatar" label="头像">
          <template #default="{ row }">
						<el-avatar :size="40" :src="row.avatar" />
					</template>
        </el-table-column>
				<el-table-column prop="nickName" label="昵称" />
				<el-table-column prop="content" label="评论内容" show-overflow-tooltip />
				<el-table-column prop="createTime" label="评论时间" />
				<el-table-column prop="isShow" label="状态">
					<template #default="{ row }">
            <el-switch v-model="row.isShow" :active-value="true" :inactive-value="false" @change="handleStatusChange(row)" />
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { commentPageApi, commentUpdateShowApi } from '/@/api/note/noteInfo';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';

const route = useRoute();
const router = useRouter();
const stores = travelCommunalData();
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		code: route.query.code as string,
	},
	pageList: commentPageApi,
});

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

const handleStatusChange = async (row: any) => {
	const params = { id: row.id, isShow: row.isShow };
	try {
		const { code, msg } = await commentUpdateShowApi(params);
		if (code === 0) {
			useMessage().success('修改成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
			getDataList();
	}
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

onMounted(async () => {
	if (Session.get('state')) {
		const data = JSON.parse(Session.get('state'));
		state.queryForm = data.queryForm;
		state.pagination = data.pagination;
		Session.remove('state');
	}
	if (stores.regionCodeList.length < 1) {
		await stores.getRegionCodeList();
	}
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	daterangeTime.value = [];
	state.queryForm = {};
	state.queryForm.code = route.query.code as string;
	getDataList();
};
</script>
