<template>
	<div class="layout-padding-auto layout-padding-view list">
		<div class="btns">
			<el-button @click="prizeDialogRef.openDialog()" icon="folder-add" type="primary">添加奖品 </el-button>
		</div>
		<el-table
			border
			:data="state.dataList"
			v-loading="state.loading"
			:cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle"
			ref="tableRef"
		>
			<el-table-column label="等级" prop="sequence" width="60" />
			<el-table-column label="奖品名称" prop="name" />
			<el-table-column label="奖品图片" prop="imgUrl">
				<template #default="{ row }">
					<img :src="row.imgUrl" />
				</template>
			</el-table-column>
			<el-table-column label="奖品类型" prop="type" width="150">
				<template #default="{ row }">
					<div v-if="row.type === 1">不中奖</div>
					<div v-else-if="row.type === 2">实物自提</div>
					<div v-else-if="row.type === 3">微信红包</div>
				</template>
			</el-table-column>

			<el-table-column label="每日投放" prop="dayNum" width="150" />
			<el-table-column label="中奖概率" prop="odds" width="150">
				<template #default="{ row }"> {{ row.odds }}% </template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template #default="{ row }">
					<el-button type="primary" link @click="handleCommand('edit', row)">编辑</el-button>
					<el-button type="primary" link @click="handleCommand('delete', row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
	<!-- 配置配置  -->
	<PrizeDialog @refresh="getDataList()" ref="prizeDialogRef" />
</template>

<script lang="ts" name="config-first-page" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getPrizeList, prizeDel } from '/@/api/operationConfig/lotteryManage';
// 引入组件
const PrizeDialog = defineAsyncComponent(() => import('./PrizeDialog.vue'));
const route = useRoute();

// 定义变量内容
const prizeDialogRef = ref();
const tableRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getPrizeList,
	queryForm: {
		activityCode: route.query.activityCode,
	},
	dataList: [],
	loading: false,
});
//  table hook
const { getDataList, tableStyle } = useTable(state);

// 操作项
const handleCommand = async (type: string, row: any) => {
	switch (type) {
		case 'edit':
			prizeDialogRef.value.openDialog(row.code, row.id);
			break;
		case 'delete':
			try {
				await useMessageBox().confirm(`是否确认删除奖品？`, '删除奖品');
			} catch (err: any) {
				return false;
			}

			try {
				await prizeDel(row.id);
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
	}
};
onMounted(() => {});
</script>
<style lang="scss" scoped>
.list {
	margin-bottom: 56px;
}
.desc-box {
	margin-bottom: 50px;
	> div {
		&:nth-child(1) {
			font-size: 20px;
			color: #1d2129;
			margin-bottom: 10px;
		}
		&:nth-child(2) {
			font-size: 14px;
			color: #4e5969;
		}
	}
}
.btns {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}
.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
