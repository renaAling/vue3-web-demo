<template>
	<div>
		<el-date-picker
			v-model="state[0]"
			value-format="YYYY-MM-DD"
			style="width: 120px"
			type="date"
			placeholder="开始时间"
			:disabled-date="disabledBenginDate"
		/>
		<span class="mx-2">-</span>
		<el-date-picker
			v-model="state[1]"
			value-format="YYYY-MM-DD"
			style="width: 120px"
			type="date"
			placeholder="结束时间"
			:disabled-date="disabledEndDate"
		/>
	</div>
</template>

<script lang="ts" name="PayDate" setup>
const emit = defineEmits(['getDate']);
const prop = defineProps({
	today: {
		type: Boolean,
		default: true,
	},
});
const state = reactive(['', '']);

const disabledBenginDate = computed(() => {
	return (time: any) => {
		const timeStamp = prop.today ? 86400000 : 0;
		if (!state[1]) return time.getTime() > Date.now() - timeStamp; // 如果没有设置开始日期，则不限制结束日期
		const eddDateValue = new Date(state[1]);
		const startDateLimit = new Date(eddDateValue);
		startDateLimit.setMonth(startDateLimit.getMonth() - 3); // 90天后的日期作为限制
		// 禁用开始日期之前的日期和90天后的日期
		return time.getTime() > eddDateValue.getTime() || time.getTime() < startDateLimit.getTime() || time.getTime() > Date.now() - timeStamp;
	};
});

// 根据开始日期动态计算结束日期的禁用日期
const disabledEndDate = computed(() => {
	return (time: any) => {
		const timeStamp = prop.today ? 86400000 : 0;
		if (!state[0]) return time.getTime() > Date.now() - timeStamp; // 如果没有设置开始日期，则不限制结束日期
		const startDateValue = new Date(state[0]);
		const endDateLimit = new Date(startDateValue);
		endDateLimit.setMonth(endDateLimit.getMonth() + 3); // 90天后的日期作为限制
		// 禁用开始日期之前的日期和90天后的日期
		return time.getTime() < startDateValue.getTime() || time.getTime() > endDateLimit.getTime() || time.getTime() > Date.now() - timeStamp;
	};
});

watch(state, (value) => {
	emit('getDate', value);
});
const resetField = () => {
	state[1] = '';
	state[0] = '';
};

// 暴露变量
defineExpose({
	state,
	resetField,
});
</script>
