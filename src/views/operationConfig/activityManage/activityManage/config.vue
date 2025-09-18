<template>
	<div>
		<el-dialog :title="title" ref="myDialog" v-model="visible" draggable width="60%" :close-on-click-modal="false" :show-close="false">
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				ref="tableRef"
			>
				<el-table-column label="昵称" prop="name" width="130" />
				<el-table-column label="手机号" prop="mobile" />
				<el-table-column v-if="dialogType === 'list'" label="获得奖品" prop="prizeName" />
				<el-table-column v-if="dialogType === 'list'" label="中奖时间" prop="prizeName" />
				<el-table-column v-if="dialogType === 'list'" label="核销状态" prop="status" width="130">
					<template #default="{ row }">
						<span>{{ row.status === 1 ? '已核销' : '未核销' }}</span>
					</template>
				</el-table-column>
				<el-table-column v-if="dialogType === 'log'" label="获取次数" prop="prizeName" />
				<el-table-column v-if="dialogType === 'log'" label="获取方式" prop="buyNum" />
				<el-table-column v-if="dialogType === 'log'" label="获取时间" prop="shareNum" />
			</el-table>
			<template #footer>
				<el-button type="info" size="default" @click="closeMyDialog()">取消</el-button>
				<el-button type="primary" size="default" @click="closeMyDialog()">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getWinningList } from '/@/api/operationConfig/firstPage';
const emit = defineEmits(['refresh']);

const visible = ref(false);
const myDialog = ref(null);
const title = ref('');
const dialogType = ref('');
const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
	loading: false,
});
//  table hook
const { tableStyle } = useTable(state);

const openDialog = async (row: object, type: string) => {
	dialogType.value = type;
	dialogType.value === 'log' ? (title.value = '参与日志') : (title.value = '中奖名单');
	visible.value = true;
	console.log('row', row);
	// 	try {
	// 	let res = await getWinningList();
	// 	state.dataList = res.data;
	// } catch (err) {
	// 	console.log('err', err);
	// }
};
const closeMyDialog = () => {
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
