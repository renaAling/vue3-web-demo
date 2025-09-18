<template>
	<div>
		<el-select
			@change="onChangeMerId"
			:class="className"
			popper-class="custom-popper"
			clearable
			filterable
			v-model="merId"
			v-selectLoadMore="selectLoadMore"
			:loading="loading"
			remote
			:multiple="multiple"
			:remote-method="remoteMethod"
			placeholder="请选择供应商"
		>
			<el-option v-for="user in merchantList" :key="user.id" :label="user.name" :value="user.id" :disabled="!user.isSwitch && isDisabled">
				{{ user.name }}{{ !user.isSwitch && isDisabled ? '(该商户已关闭)' : '' }}
			</el-option>
		</el-select>
	</div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import * as merchant from '/@/api/culture/commodity/commodityList';

// Props 定义
interface Props {
	multiple?: boolean;
	merIdChecked?: number | string | boolean | null;
	className?: string;
	isDisabled?: boolean;
	// platId?: number | string | null;
}
const props = withDefaults(defineProps<Props>(), {
	multiple: false,
	merIdChecked: null,
	className: 'from-ipt-width',
	isDisabled: true,
	// platId: null,
});

// Emits 定义
const emit = defineEmits(['getMerId']);

// 数据定义
const merchantList = ref<any[]>([]);
const merId = ref<number | string | boolean | null>(props.merIdChecked);
const loading = ref(false);
const search = ref({
	limit: 200,
	page: 1,
	keywords: '',
});
const totalPage = ref(0);
const total = ref(0);

// 监听 props.merIdChecked 变化
watch(
	() => props.merIdChecked,
	(newValue) => {
		merId.value = newValue ?? null;
	}
);

// 生命周期：组件挂载时调用
onMounted(() => {
	console.log('选择商户弹框~~~~~');
	getMerList();
});

// 下拉加载更多
const selectLoadMore = () => {
	search.value.page += 1;
	if (search.value.page > totalPage.value) return;
	getMerList();
};

// 远程搜索
const remoteMethod = (query: string) => {
	loading.value = true;
	search.value.keywords = query;
	search.value.page = 1;
	merchantList.value = [];
	setTimeout(() => {
		loading.value = false;
		getMerList();
	}, 200);
};

// 获取商户列表
const getMerList = async () => {
	// console.log('当前商品类型', props.platId);

	const params = {
		// goodsType: props.platId || undefined,
		...search.value,
	};
	try {
		const { code, data, msg } = await merchant.merchantListApi(params);
		if (code === 0) {
			totalPage.value = data.totalPage;
			total.value = data.total;
			merchantList.value = merchantList.value.concat(data.records);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

// 商户 ID 改变时触发事件
const onChangeMerId = () => {
	emit('getMerId', merId.value);
};
</script>

<style lang="scss" scoped>
::v-deep .custom-popper {
	left: 0 !important;
}
</style>
