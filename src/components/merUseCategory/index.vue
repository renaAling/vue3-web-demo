<template>
	<div>
		<el-cascader
			v-model="merIds"
			class="selWidth"
			:show-all-levels="false"
			:options="merSelect"
			:props="merProps"
			filterable
			clearable
			@change="onChangeMerId"
		/>
	</div>
</template>

<script setup lang="ts">
import { merCategoryListApi } from '/@/api/culture/merchant/classify';

// 定义 props
const props = defineProps<{
	multiple?: boolean;
	merIdChecked?: Array<number | string>;
}>();

// 定义 emit 事件
const emit = defineEmits<{
	(e: 'getMerId', value: (number | string)[]): void;
}>();

// 响应式数据
const merIds = ref<(number | string)[]>(props.merIdChecked ?? []);
const merSelect = ref<any[]>([]);
const merProps = ref({
	value: 'id',
	label: 'name',
	children: 'merchantList',
	expandTrigger: 'hover',
	emitPath: false,
	multiple: true,
});

// 方法定义
const getMerList = async () => {
	try {
		const res = await merCategoryListApi();
		merSelect.value = res;
	} catch (error) {
		console.error('获取商户列表失败:', error);
	}
};

const onChangeMerId = () => {
	emit('getMerId', merIds.value);
};

// Watch 监听
watch(
	() => props.merIdChecked,
	(newVal) => {
		if (newVal) {
			merIds.value = newVal;
		}
	}
);

// 生命周期钩子
onMounted(() => {
	merIds.value = props.merIdChecked ?? [];
	getMerList();
});
</script>
