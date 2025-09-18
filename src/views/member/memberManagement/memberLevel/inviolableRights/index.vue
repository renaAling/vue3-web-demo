<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<!-- <el-row class="mb8 flex justify-between items-center">
				<div>
					<el-button type="primary" icon="plus" @click="formDialogRef.openDialog()"> 新增 </el-button>
				</div>
			</el-row> -->
			<el-table
				:data="dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" width="60" align="center" label="序号" />
				<el-table-column label="等级名称" prop="levelName" />
				<!-- <el-table-column label="签到背景图" prop="signListImg">
					<template #default="{ row }">
						<div class="img">
							<el-image :src="row.signListImg" />
						</div>
					</template>
				</el-table-column> -->
				<el-table-column label="会员等级页背景图" prop="backgroundImg">
					<template #default="{ row }">
						<div class="img">
							<el-image :src="row.backgroundImg" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="会员图标" prop="icon">
					<template #default="{ row }">
						<div class="img">
							<el-image :src="row.icon" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
	<formDialog ref="formDialogRef" @refresh="getMemberLevelGetListData()"></formDialog>
</template>

<script lang="ts" setup name="manage-list">
import { getMemberLevelGetList } from '/@/api/member/memberLevel/inviolableRights';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';

const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const dataList = ref<any[]>([]);
onMounted(() => {
	getMemberLevelGetListData();
});
const getMemberLevelGetListData = async () => {
	try {
		const { code, data, msg } = await getMemberLevelGetList();
		if (code === 0) {
			dataList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const state: BasicTableProps = reactive<BasicTableProps>({
	// pageList: getMemberLevelGetList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { tableStyle } = useTable(state);

const handleEdit = (row: any) => {
	formDialogRef.value.openDialog(row);
};
</script>
<style lang="scss" scoped>
.img {
	display: flex;
	justify-content: center;
	align-items: center;
	.el-image {
		width: 120px;
		height: 120px;
	}
}
</style>
