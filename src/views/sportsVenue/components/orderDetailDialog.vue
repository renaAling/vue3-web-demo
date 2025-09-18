<template>
	<el-dialog :model-value="modelValue" title="订单详情" width="600" @close="closeDialog">
		<el-descriptions :column="1" :label-width="120">
			<el-descriptions-item label="订单编号">{{ row?.orderCode || '-' }}</el-descriptions-item>
			<el-descriptions-item label="员工姓名">{{ row?.employeeName || '-' }}</el-descriptions-item>
			<el-descriptions-item label="手机号">{{ row?.employeeMobile || '-' }}</el-descriptions-item>
			<el-descriptions-item label="场馆名称">{{ row?.stadiumName || '-' }}</el-descriptions-item>
			<el-descriptions-item label="场馆类型">{{ row?.stadiumConfigName || '-' }}</el-descriptions-item>
			<el-descriptions-item label="场地名称">{{ row?.stadiumConfigSubName || '-' }}</el-descriptions-item>
			<el-descriptions-item label="预定日期">{{ row?.stadiumDate || '-' }}</el-descriptions-item>
			<el-descriptions-item label="预定时间段">{{ row?.startTime }} - {{ row?.endTime }} </el-descriptions-item>
			<el-descriptions-item label="订单状态">
				{{ row?.status === 5 ? '待开始' : row?.status === 6 ? '已完成' : row?.status === 7 ? '已取消' : row?.status === 10 ? '不可用' : '-' }}
				<span v-if="row?.status === 10" class="text-[#f56c6c] ml-2">场馆或场地已被禁用/删除</span>
			</el-descriptions-item>
			<el-descriptions-item label="是否到场" v-if="row?.status < 7">
				<span>{{ row?.isAttendance ? '已到场' : '-' }}</span>
				<span v-if="!row?.isAttendance" class="text-[#4785ea] hover:text-[#a3c2f4] cursor-pointer ml-3" @click="handleArrive">确认到场</span>
			</el-descriptions-item>
			<el-descriptions-item label="下单时间">{{ row?.createTime || '-' }}</el-descriptions-item>
			<el-descriptions-item label="取消时间" v-if="row?.status === 7">{{ row?.cancelTime || '-' }}</el-descriptions-item>
			<el-descriptions-item label="取消方式" v-if="row?.status === 7">
				{{ row?.cancelType === 1 ? '用户主动取消' : row?.cancelType === 2 ? '管理员取消' : '-' }}
			</el-descriptions-item>
		</el-descriptions>
		<template #footer>
			<div>
				<el-button type="primary" @click="closeDialog">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup name="orderDetailDialog">
import { ElMessageBox } from 'element-plus';
import { confirmAttendanceApi } from '/@/api/sportsVenue/index';

const props = defineProps<{
	modelValue: boolean;
	row?: any;
}>();

const emits = defineEmits<{
	(event: 'update:modelValue', val: boolean): void;
	(event: 'ok', params?: any): void;
}>();

const currentRow = ref();

const handleArrive = async () => {
	ElMessageBox.confirm('确认该用户已到场吗？', '确认到场', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		const res = await confirmAttendanceApi(props.row.orderCode);
		if (res?.ok) {
			closeDialog();
			emits('ok');
		}
	});
};

const closeDialog = () => {
	emits('update:modelValue', false);
};

watch(
	() => props.modelValue,
	(newUid) => {
		if (newUid) {
			try {
				currentRow.value = props.row;
			} catch (err) {
				console.log(err);
			}
		}
	},
	{ immediate: true }
);
</script>
