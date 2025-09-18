<template>
	<div class="consumption">
		<el-table
			:data="userCenterList"
			v-loading="state.loading"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			height="400px"
		>
			<el-table-column prop="consumptionScene" label="消费场景"></el-table-column>
			<el-table-column prop="totalConsumption" label="累计消费"></el-table-column>
			<el-table-column prop="orderCount" label="下单次数"></el-table-column>
			<el-table-column prop="completedCount" label="完成次数"></el-table-column>
			<el-table-column prop="afterSalesCount" label="售后次数"></el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts" name="rechargeForm" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getConsumeInfoApi } from '/@/api/member/memberManagement/accountManager';
import { getTripRecordForMember } from '/@/api/member/memberManagement/accountManager';
import { useMessage } from '/@/hooks/message';

const userCenterList = ref([]) as any;
const props = defineProps<{
	unionId: string;
}>();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
});
const { tableStyle } = useTable(state);

onMounted(() => {
	console.log('props', props);
	if (props?.unionId) {
		getList(props.unionId);
	}
});
const getList = async (unionId: string) => {
	state.loading = true;
	try {
		const { code, data, msg } = await getConsumeInfoApi(unionId);
		if (code === 0) {
			userCenterList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		state.loading = false;
	}
	state.loading = false;
};

defineExpose({
	getList,
});
</script>
<style lang="scss" scoped>
.consumption {
	background: var(--el-color-white);
	border-radius: 4px;
	border: 1px solid var(--el-border-color-light, #ebeef5);
	padding: 10px;
	width: 100%;
}
</style>
