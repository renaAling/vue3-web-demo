<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="desc-box">
				<div>双十一即开抽奖活动</div>
				<div>活动时间：2024年11月1日-2014年11月31日</div>
			</div>
			<div class="btns">
				<el-button @click="configDialogRef.openDialog()" icon="folder-add" type="primary">添加奖品 </el-button>
				<div>总中奖概率：0.08%</div>
			</div>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				ref="tableRef"
			>
				<el-table-column label="等级" prop="name" width="130" />
				<el-table-column label="奖品名称" prop="startTime" />
				<el-table-column label="奖品图片" prop="endTime" />
				<el-table-column label="奖品总数" prop="winTime" />
				<el-table-column label="每日投放" prop="cashEndTime" />
				<el-table-column label="中奖概率" prop="isOpen" width="130">
					<template #default="{ row }">
						<span>{{ row.isOpen === 1 ? '启用' : '停用' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('edit', row)">编辑</el-button>
						<el-button type="primary" link @click="handleCommand('delete', row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 配置配置  -->
		<config-dialog @refresh="getList()" ref="configDialogRef" />
	</div>
</template>

<script lang="ts" name="config-first-page" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getLotteryList } from '/@/api/operationConfig/firstPage';
// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));

// 定义变量内容
const configDialogRef = ref();
const tableRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
	loading: false,
});
//  table hook
const { tableStyle } = useTable(state);

const getList = async () => {
	try {
		state.loading = true;
		let res = await getLotteryList();
		state.loading = false;
		state.dataList = res.data;
	} catch (err) {
		state.loading = false;
		console.log('err', err);
	}
};
// 操作项
const handleCommand = (type: string, row?: object) => {
	switch (type) {
		case 'edit':
			configDialogRef.value.openDialog();
			break;
		case 'delete':
			configDialogRef.value.openDialog();
			break;
	}
};
onMounted(() => {
	getList();
});
</script>
<style lang="scss" scoped>
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
