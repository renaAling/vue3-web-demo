<template>
	<div class="childSystem">
		<el-table
			:data="userCenterList"
			v-loading="state.loading"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			height="200"
		>
			<el-table-column prop="platformName" label="系统名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="channelUserCode" label="子ID" show-overflow-tooltip></el-table-column>
			<el-table-column prop="createTime" label="同步时间" show-overflow-tooltip></el-table-column>
			<el-table-column label="同步状态" show-overflow-tooltip>
				<template #default>
					<span class="ml-2 cursor-pointer text-[#27d23e]">同步成功</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts" name="rechargeForm" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getUserCenter } from '/@/api/member/memberManagement/accountManager';
import { useMessage } from '/@/hooks/message';
const props = defineProps<{
	unionId: string;
}>();
const userCenterList = ref([]) as any;
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
});

const { tableStyle } = useTable(state);

onMounted(() => {
	console.log('props', props);
	if (props?.unionId) {
		getUserCenterList(props.unionId);
	}
});

const getUserCenterList = async (unionId: string) => {
	state.loading = true;
	return new Promise((resolve, reject) => {
		getUserCenter(unionId)
			.then((val) => {
				console.log('val', val);
				userCenterList.value = val.data.subSystemInfos;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				reject(false);
			})
			.finally(() => {
				state.loading = false;
			});
	});
};

defineExpose({
	getUserCenterList,
});
</script>

<style>
.childSystem {
	background: var(--el-color-white);
	border-radius: 4px;
	border: 1px solid var(--el-border-color-light, #ebeef5);
	padding: 10px;
	overflow: hidden;
	height: 100%;
}
</style>
