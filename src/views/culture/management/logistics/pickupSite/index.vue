<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="网点名称：">
						<el-input @keyup.enter.native="getDataList" v-model="state.queryForm.name" placeholder="请输入网点名称查询" class="selWidth" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="状态：">
						<el-select v-model="state.queryForm.status" placeholder="请选择状态" clearable class="selWidth">
							<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary"  @click="getDataList">查询</el-button>
						<el-button  @click="handleReset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<div class="mb10">
				<el-button type="primary" @click="handleSubmit()">新增</el-button>
			</div>
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column prop="id" label="ID" min-width="60" />
				<el-table-column label="网点名称" prop="name" show-overflow-tooltip />
				<el-table-column label="联系人" prop="contactName" show-overflow-tooltip />
				<el-table-column label="联系电话" prop="contactTelephone" show-overflow-tooltip />
				<el-table-column label="省市区" prop="detailName" show-overflow-tooltip />
				<el-table-column label="详细地址" prop="address" show-overflow-tooltip />
				<el-table-column label="营业时间" prop="businessHours" show-overflow-tooltip />
				<el-table-column label="取货单数" prop="pickupNum" show-overflow-tooltip />
				<el-table-column label="状态" prop="status">
					<template #default="{ row }">
						<span v-if="row.status === 1">启用</span>
						<span v-else>停用</span>
					</template>
				</el-table-column>
				<el-table-column prop="address" fixed="right" width="180" label="操作">
					<template #default="scope">
						<el-button type="primary" link @click="handleCommand('unlock', scope.row)" v-if="scope.row.status == 2">启用</el-button>
						<el-button type="primary" link @click="handleCommand('lock', scope.row)" v-if="scope.row.status == 1">停用</el-button>
						<el-button type="primary" link @click="bindEdit(scope.row)">修改</el-button>
						<el-button type="primary" link @click="bindDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<CreatPickup ref="creatPickupRef" @refresh="getDataList()"></CreatPickup>
	</div>
</template>
<script setup lang="ts">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import * as pickup from '/@/api/culture/pickup';
const CreatPickup = defineAsyncComponent(() => import('./creatPickup.vue'));

const creatPickupRef = ref() as any;
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pickup.pickupListApi,
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 状态选项
const statusList = [
	{ value: 1, label: '启用' },
	{ value: 2, label: '停用' },
];

// 重置
const handleReset = () => {
	Object.assign(state.queryForm, {
		name: '',
		status: '',
	});
	state.queryForm;
	getDataList();
};

// 新增按钮
const handleSubmit = () => {
	console.log('aaaaaa', creatPickupRef.value);
	creatPickupRef.value.openDetail();
	if (!localStorage.getItem('cityList')) {
		creatPickupRef.value.getCityList();
	}
};

// 编辑
const bindEdit = (item: any) => {
	console.log('item--------', item);
	
	if (!localStorage.getItem('cityList')) {
		creatPickupRef.value?.getCityList();
	}
	creatPickupRef.value.openDetail(item.id);
};

// 删除
const bindDelete = async (item: any) => {
	try {
		await useMessageBox().confirm('确认删除该自提地址吗？', '提示');
	} catch {
		return;
	}
	try {
		const { code, msg } = await pickup.deletePickupApi({ id: item.id });
		if (code === 0) {
			useMessage().success('删除成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		return;
	}
};

// 启用 / 停用
const handleCommand = async (type: string, item: any) => {
	const isLock = type === 'lock';
	try {
		await useMessageBox().confirm(`确定${isLock ? '停用' : '启用'}该自提点吗?`, '提示');
	} catch {
		return;
	}
	try {
		const { code, msg } = await pickup.updatePickupStatusApi({
			id: item.id,
			status: isLock ? 2 : 1,
		});
		if (code === 0) {
			useMessage().success(`${isLock ? '停用' : '启用'}成功`);
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		return;
	}
};
</script>

<style scoped lang="scss"></style>
