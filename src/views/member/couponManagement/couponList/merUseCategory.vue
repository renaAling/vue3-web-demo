<template>
	<div>
		<el-cascader
			v-model="state.merIds"
			class="selWidth"
			:show-all-levels="false"
			:options="state.merSelect"
			:props="state.merProps"
			:disabled="props.disabled"
			filterable
			clearable
			@change="onChangeMerId"
		/>
	</div>
</template>

<script lang="ts" setup name="merUseCategory">
import * as merchant from '/@/api/culture/merchant';

const props = defineProps({
	multiple: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	merIdChecked: {
		type: Array,
		default: () => [],
	},
	platType: {
		type: String,
		default: '',
	},
});
const state = reactive({
	merProps: {
		value: 'id',
		label: 'name',
		children: 'merchantList',
		expandTrigger: 'hover',
		emitPath: false,
		multiple: true,
	},
	merSelect: [],
	merIds: [],
});

watch(
	() => props.merIdChecked,
	(n) => {
		state.merIds = n;
	}
);

watch(
	() => props.platType,
	(n) => {
		getMerList({ platType: props.platType });
	}
);

onMounted(() => {
	state.merIds = props.merIdChecked.map((e: string) => {
		return Number(e);
	});
	console.log('props.platType', props.platType);
	
	if (props.platType.toString()) {
		getMerList({ platType: props.platType });
	} else {
		getMerList();
	}
});
// 转数据
const renameNameToLabel = (node) => {
	// 创建一个新对象，将 orgName 替换为 label
	const { name, id, children, ...rest } = node;
	const renamedNode = { label: name, value: id, ...rest };
	// 如果有子节点，递归处理每个子节点
	if (children && Array.isArray(children)) {
		renamedNode.children = children.map((child) => renameNameToLabel(child));
	}

	return renamedNode;
};
// 列表
const getMerList = (params?: any) => {
	console.log('params', params);
	if (params) {
		merchant.merCategoryListApi(params).then((res) => {
			state.merSelect = res.data.map((item) => renameNameToLabel(item));
			// state.merSelect = renameNameToLabel(res.data);
			console.log('aaaaares.data', res.data);
		});
	} else {
		merchant.merCategoryListApi().then((res) => {
			state.merSelect = res.data;
		});
	}
};
const emit = defineEmits(['getMerId']);
const onChangeMerId = () => {
	emit('getMerId', state.merIds);
};
</script>
