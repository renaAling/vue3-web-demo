<template>
	<el-form ref="searchForm" :model="query" :inline="true">
		<el-form-item :label="item.label" :prop="item.prop" v-for="item in options">
			<!-- 文本框、下拉框、日期框 -->
			<el-input
				v-if="item.type === 'input'"
				v-model="query[item.prop]"
				:disabled="item.disabled"
				:placeholder="item.placeholder"
				clearable
				style="width: 200px"
			></el-input>
			<el-select
				v-else-if="item.type === 'select'"
				v-model="query[item.prop]"
				:disabled="item.disabled"
				:placeholder="item.placeholder"
				clearable
				style="width: 200px"
			>
				<el-option v-for="opt in item.opts" :label="opt.label" :value="opt.value"></el-option>
			</el-select>
			<el-date-picker
				v-else-if="item.type === 'date'"
				type="date"
				v-model="query[item.prop]"
				:value-format="item.format"
				style="width: 200px"
			></el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" :loading="loading" :icon="Search" @click="handleSearch"> 搜索 </el-button>
			<el-button :loading="loading" :icon="Refresh" @click="handleReset(searchForm)"> 重置 </el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { FormInstance } from 'element-plus';
import { Search, Refresh } from '@element-plus/icons-vue';
import { PropType, ref } from 'vue';
import { FormOption, FormOptionList } from '/@/types/form-option';

const props = defineProps({
	query: {
		type: Object,
		required: true,
	},
	options: {
		type: Array as PropType<Array<FormOptionList>>,
		required: true,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	handleSearch: {
		type: Function,
		required: true,
	},
});

const searchForm = ref<FormInstance>();

// const emit = defineEmits(['handleSearch', 'handleReset']);
// const handleSearch = () => {
// 	emit('handleSearch', props.query);
// };

// const handleReset = (formEl: FormInstance | undefined) => {
// 	if (!formEl) return;
// 	emit('handleReset');
// };

const handleReset = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	props.handleSearch();
};
</script>

<style scoped>
.search-container {
	padding: 20px 30px 0;
	background-color: #fff;
	margin-bottom: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
}
</style>
