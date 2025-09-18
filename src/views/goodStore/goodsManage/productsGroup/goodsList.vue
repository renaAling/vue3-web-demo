<template>
	<div>
		<el-dialog title="关联商品" v-model="dialogVisible" :close-on-click-modal="false" :show-close="false">
			<el-table
				:data="dataList"
				v-loading="loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="商品ID" prop="spuCode" show-overflow-tooltip />
				<el-table-column label="商品图" prop="icon">
					<template #default="{ row }">
						<img :src="row.imageUrl" class="img-center" style="margin: 0 auto; width: 50px; height: 50px" />
					</template>
				</el-table-column>
				<el-table-column label="商品名称" prop="spuName" show-overflow-tooltip />
			</el-table>
			<!-- <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" /> -->
			<template #footer>
				<el-button type="info" size="default" @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" size="default" @click="addGoods">添加商品</el-button>
			</template>
		</el-dialog>
		<el-dialog title="关联商品" v-model="dialogVisibleAll" :close-on-click-modal="false" :show-close="false">
			<el-table
				:data="dataListAll"
				v-loading="loading"
				row-key="spuCode"
				ref="tableAllRef"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection"></el-table-column>
				<el-table-column label="商品ID" prop="spuCode" show-overflow-tooltip />
				<el-table-column label="商品图" prop="icon" align="center">
					<template #default="{ row }">
						<img :src="row.imageUrl" class="img-center" style="margin: 0 auto; width: 50px; height: 50px" />
					</template>
				</el-table-column>
				<el-table-column label="商品名称" prop="spuName" show-overflow-tooltip />
			</el-table>
			<!-- <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" /> -->
			<template #footer>
				<el-button type="info" size="default" @click="cancelAll">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { updateGoods } from '/@/api/goodStore/goods';
import { getSpuByGroupCode, getByMerchantCode, wdGroupRelate } from '/@/api/goodStore/productsGroup';

const emit = defineEmits(['refresh']);
const dialogVisible = ref(false);
const dialogVisibleAll = ref(false);
const tableAllRef = ref();
const groupData: any = ref({});
const loading = ref(false);
const dataList = ref([] as any);
const dataListAll = ref([] as any);
const productCodes = ref([] as any);
// 选中的数据
const multipleTable = ref([] as any);

const state: BasicTableProps = reactive<BasicTableProps>({
	// pageList: getGoodsGroupList,
	queryForm: {},
	pagination: {},
	isPage: false,
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const openDialog = async (row: string | null) => {
	dialogVisible.value = true;
	groupData.value = row;
	nextTick(() => {
		getList();
	});
};

const addGoods = () => {
	getByMerchantCode(groupData.value.merchantCode).then((res) => {
		dataListAll.value = res.data;
		dialogVisibleAll.value = true;
		nextTick(() => {
			dataListAll.value.forEach((item) => {
				if (multipleTable.value.includes(item.spuCode)) {
					tableAllRef.value.toggleRowSelection(item, true);
				}
			});
		});
	});
};

const getList = () => {
	getSpuByGroupCode(groupData.value.groupCode).then((res) => {
		dataList.value = res.data;
		multipleTable.value = res.data.map((item) => {
			return item.spuCode;
		});
	});
};

// 多选事件
const handleSelectionChange = (objs: { spuCode: string }[]) => {
	productCodes.value = objs.map(({ spuCode }) => spuCode);
};

const cancelAll = () => {
	dialogVisibleAll.value = false;
	emit('refresh');
};
const onSubmit = async () => {
	try {
		const params = {
			groupCode: groupData.value.groupCode,
			productCodes: productCodes.value,
		};
		const { code, msg } = await wdGroupRelate(params);
		if (code != 0) {
			return useMessage().error(msg);
		}
		useMessage().success('操作成功');
		dialogVisibleAll.value = false;
		getList();
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.map-input {
	height: 456px;
}

.map {
	width: 715px;
	height: 366px;
}

.add-img {
	width: 150px;
	height: 150px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background-color: transparent;
	border: 1px dashed #cdd0d6;
	border-radius: 8px;
	cursor: pointer;
	margin-left: 10px;

	.icon-plus {
		width: 24px;
		height: 24px;
	}
}

.box {
	position: relative;

	.del {
		position: absolute;
		width: 1em;
		height: 1em;
		top: 0;
		right: 0;
	}
}
</style>
<style>
.popper-select {
	:is(li)[aria-haspopup='true'] {
		.el-checkbox {
			display: none;
		}
	}
}
</style>
