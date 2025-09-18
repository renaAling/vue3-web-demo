<template>
	<el-dialog title="分销订单列表" v-model="dialogVisible" :close-on-click-modal="false" :show-close="false" width="80%">
		<el-card>
			<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
				<el-form-item label="时间选择" prop="time">
					<el-date-picker
						v-model="time"
						:clearable="false"
						@change="changeTime"
						type="daterange"
						range-separator="-"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="YYYY-MM-DD"
					/>
				</el-form-item>
				<el-form-item label="关键字" prop="keywords">
					<el-input v-model="state.queryForm.keywords" placeholder="请输入订单号" maxlength="50" />
				</el-form-item>
				<el-form-item>
					<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
					<el-button icon="Refresh" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-form>
			<el-table border :data="state.dataList" v-loading="state.loading" style="width: 100%" :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle" row-key="id">
				<el-table-column prop="orderNo" label="订单ID"></el-table-column>
				<el-table-column prop="unionId" label="UID"></el-table-column>
				<el-table-column prop="imgUrl" label="头像">
					<template #default="{ row }">
						<el-image style="width: 40px;height: 40px;" :src="row.avatar ? row.avatar : 'https://gdsh-oss.duomixing.com:9086/rls/b/culture/20250331-175529.png'" :preview-teleported="true" :preview-src-list="[row.avatar ? row.avatar : 'https://gdsh-oss.duomixing.com:9086/rls/b/culture/20250331-175529.png']" />
					</template>
				</el-table-column>
				<el-table-column prop="nickname" label="用户昵称"></el-table-column>
				<el-table-column prop="phone" label="手机号"></el-table-column>
				<el-table-column prop="updateTime" label="订单时间"></el-table-column>
				<el-table-column prop="price" label="返佣积分"></el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</el-card>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="fxy-list">
import { ref } from 'vue';
import { useMessage } from '/@/hooks/message';
// import pagination from '/@/components/Pagination/index.vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { orderList } from '/@/api/member/distributor'

const dialogVisible = ref(false);
const queryRef = ref();
const time = ref([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		type: 0,
	},
	pageList: orderList,
	createdIsNeed: false
});

const changeTime = (val: any) => {
	state.queryForm.dateLimit = val ? val.join(',') : ''
	getDataList();
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	time.value = [];
	state.queryForm.dateLimit = ''
	getDataList();
};
const openDialog = async (row: any | null) => {
	state.queryForm.uid = row.id
	if (state.queryForm.uid) {
		try {
			getDataList()
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}
	nextTick(() => {
		dialogVisible.value = true;
	});
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// 暴露变量
defineExpose({
	openDialog,
});
</script>
