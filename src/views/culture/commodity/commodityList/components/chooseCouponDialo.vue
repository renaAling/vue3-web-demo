<template>
	<div class="chooseCouponDialo">
		<el-dialog title="优惠券" ref="myDialog" v-model="visible" width="70%" :close-on-click-modal="false" :before-close="handleClose">
			<el-form :inline="true" :model="state.queryForm" ref="queryRef" @submit.prevent>
				<el-form-item label="优惠券名称：" prop="keywords">
					<el-input v-model.trim="state.queryForm.keywords" @keyup.enter.native="getDataList()" placeholder="请输入优惠券名称：" />
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
				</el-form-item>
			</el-form>
			<el-table
				ref="multipleTableRef"
				v-loading="state.loading"
				:data="state.dataList"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" min-width="55" />
				<el-table-column prop="id" label="ID" min-width="50" show-overflow-tooltip />
				<el-table-column prop="name" label="优惠券名称" min-width="120" />
				<el-table-column label="使用范围" min-width="90">
					<template #default="{ row }">
						<span v-if="row.category === 1">店铺</span>
						<span v-if="row.category === 2">商品</span>
						<span v-if="row.category === 3">通用</span>
						<span v-if="row.category === 4">品类</span>
						<span v-if="row.category === 5">品牌</span>
						<span v-if="row.category === 6">跨店</span>
					</template>
				</el-table-column>
				<el-table-column prop="money" label="面值（元）" min-width="90" />
				<el-table-column label="使用门槛（元）" prop="minPrice" min-width="100">
					<template #default="{ row }">
						<span>{{ row.minPrice === 0 ? '不限制' : row.minPrice }}</span>
					</template>
				</el-table-column>
				<el-table-column label="有效期限" min-width="220" show-overflow-tooltip>
					<template #default="{ row }">
						<div v-if="row.isFixedTime">
							{{ row.useStartTime + '一' + row.useEndTime }}
						</div>
						<div v-else>
							{{ row.day + '天' }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="剩余数量" min-width="90">
					<template #default="{ row }">
						<span v-if="row.isLimited">不限量</span>
						<span v-else> {{ row.lastTotal }}</span>
						<!-- <span>{{ !row.isLimited ? '' : row.lastTotal }}</span> -->
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			<template #footer>
				<el-button @click="submitForm()" type="primary">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { canSendListApi } from '/@/api/culture/commodity/commodityList';
import { useMessage } from '/@/hooks/message';

const queryRef = ref();
const multipleTableRef = ref();
const visible = ref<boolean>(false);
const multipleSelection = ref<any>([]);
const selectType = ref<string>('');
// 定义 emit
const $emit = defineEmits(['handleReturnedSelect', 'handleSelect']);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: canSendListApi,
	queryForm: {},
	dataList: [
		// {
		// 	id: 1,
		// 	name: '优惠券名称',
		// 	money: 100,
		// 	category: 1,
		// },
	],
});
const openDialog = (type: string) => {
	visible.value = true;
	selectType.value = type;
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// watch(
// 	() => multipleTableRef.value,
// 	(val) => {
// 		console.log('multipleTableRef.value', multipleTableRef.value);
// 		console.log('val', val);
// 	},
// 	{
// 		immediate: true,
// 		deep: true,
// 	}
// );
const handleSelectionChange = (val: any[]) => {
	console.log('val', val);

	// console.log('multipleSelection', multipleSelection.value);
	if (val.length > 1) {
		const selection = val.pop();
		// val = val[val.length - 1];
		multipleTableRef.value.clearSelection();
		multipleTableRef.value!.toggleRowSelection(selection, true);
		multipleSelection.value = [selection];
	} else {
		multipleSelection.value = val;
	}
	console.log('multipleSelection.value', multipleSelection.value);
	//
	// 	multipleSelection.value = [];
	// 	console.log('aaaa', multipleSelection.value);
	// 	multipleSelection.value = val;
	// } else {
	// 	multipleSelection.value = val;
	// }
	// multipleTableRef.value!.toggleRowSelection(val, true);
};
const submitForm = () => {
	console.log('multipleSelection', multipleSelection.value);
	console.log('selectType.value', selectType.value);
	if (multipleSelection.value?.length < 1) {
		useMessage().error('请选择优惠券');
		return;
	}
	if (selectType.value == 'returned') {
		$emit('handleReturnedSelect', multipleSelection.value);
	} else {
		multipleSelection.value[0].state = selectType.value;
		$emit('handleSelect', multipleSelection.value);
	}
	handleClose();
};

const handleClose = () => {
	console.log('multipleTableRef.value', multipleTableRef.value);
	multipleTableRef.value.clearSelection();
	multipleSelection.value = [];
	visible.value = false;
};

defineExpose({
	openDialog,
	multipleSelection,
});
</script>
<!-- <script setup lang="ts">
import { ref, reactive } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { canSendListApi } from '/@/api/culture/commodity/commodityList';
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref<any>(null);
const queryRef = ref() as any;

// const state: BasicTableProps = reactive<BasicTableProps>({
// 	pageList: canSendListApi,
// 	queryForm: {
// 		isSwitch: '1',
// 	},
// 	dataList: [],
// });
// //  table hook
// const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// const submitForm = () => {};


// </script> -->
<style lang="scss" scoped></style>
