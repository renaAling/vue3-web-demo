<template>
	<el-dialog :close-on-click-modal="false" :title="!isSee ? '历史版本' : '查看'" width="1000" draggable v-model="visible" :before-close="resetForm">
		<div v-if="!isSee">
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" width="80" align="center" label="序号" />
				<el-table-column prop="version" label="版本号" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="updateTime" label="修改时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleSee(row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<div v-else>
			<div v-html="description" class="my-10 mx-20"></div>
		</div>
	</el-dialog>
</template>

<script lang="ts" name="accountForm" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberLevelPage, getMemberLevelGetById } from '/@/api/member/memberLevel/levelRule';
import { useMessage, useMessageBox } from '/@/hooks/message';

const visible = ref(false);
const isSee = ref(false);
const description = ref<string>('');

// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	isSee.value = false;
	getDataList();
};
const handleSee = async (row: any) => {
	console.log('see', row);
	isSee.value = true;
	try {
		const { code, data, msg } = await getMemberLevelGetById(Number(row.id));
		if (code === 0) {
			description.value = data.description;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
	//
};

const resetForm = () => {
	if (isSee.value) isSee.value = false;
	else {
		visible.value = false;
	}
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberLevelPage,
	dataList: [],
	pagination: {
		pageSizes: [10, 20, 50, 100, 200],
	},
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 暴露变量
defineExpose({
	openDialog,
});
</script>
