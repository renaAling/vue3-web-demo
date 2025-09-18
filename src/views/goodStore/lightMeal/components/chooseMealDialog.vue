<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" title="配置食谱" draggable v-model="visible">
			<div class="search-box">
				<el-form :model="searchForm" label-width="100px" ref="dataFormRef" :inline="true">
					<el-form-item label="商品名称：">
						<el-input style="width: 150px" placeholder="请输入商品名称" maxlength="20" v-model="searchForm.name" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSearch()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>

			<div class="tool-box">
				<el-checkbox v-model="selectAll" label="全选" @change="onSelectAll" />
				<span class="selected-text"
					>已选择 <span class="highlight">{{ selectedList.length }}</span> 个食谱</span
				>
			</div>
			<div class="grid-box">
				<div v-for="(meal, index) in meals" :key="index" class="meal-item" :class="{ 'meal-item-selected': meal.isSelected }">
					<img :src="meal.imageUrl" alt="菜品图片" class="meal-image" />
					<div class="meal-name">{{ meal.spuName }}</div>
					<!-- 复选框 -->
					<div>
						<el-checkbox v-model="meal.isSelected" class="meal-checkbox" @change="selectItem(meal)"></el-checkbox>
					</div>
				</div>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialog()">取消</el-button>
					<el-button @click="onSubmit" type="primary">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="portal-entrance-form" setup>
import { useMessage } from '/@/hooks/message';
import { getProductDataApi, addWeekFoodApi, updateWeekFoodApi } from '/@/api/goodStore/mall';
import { forEach } from 'lodash';

let calendarCode: string = '';

// 定义刷新表格emit
const emit = defineEmits(['onRefresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);

const searchForm = reactive({
	name: null,
});

const relatedData = ref();

// 定义菜品数据类型
interface Meal {
	id: string;
	imageUrl: string;
	productCode: string;
	spuName: string;
	isSelected: boolean;
}

// 菜品数据
const meals = ref<Meal[]>([]);

// 是否全选
const selectAll = ref(false);
// 已选数据列表
const selectedList = ref<Meal[]>([]);

// 打开弹框
const openDialog = async (opt: any) => {
	searchForm.name = null;
	visible.value = true;
	relatedData.value = opt || {};
	selectedList.value = [];
	if (opt) {
		calendarCode = opt.calendarCode;
	}
	loadData(); // 获取商品列表数据
};
// 关闭弹框
const closeDialog = () => {
	selectAll.value = false;
	visible.value = false;
};

// 查询商品
const onSearch = () => {
	loadData('search');
};

// 获取商品数据
const loadData = async (str?: string) => {
	let selectedId: string[] = [];
	if (str && selectedList.value.length > 0) {
		selectedList.value.forEach((item) => selectedId.push(item.id));
	}
	try {
		let params = {
			calendarCode: calendarCode,
			productName: searchForm.name,
		};
		let res = await getProductDataApi(params);
		if (res.code == 0) {
			meals.value = res.data.map((item: any) => {
				item.id = item.productCode;
				item.isSelected = item.checked == 1 ? true : false;
				if (str && selectedId.includes(item.id)) item.isSelected = true;
				return item;
			});
			if (!str) selectedList.value = meals.value.filter((v) => v.isSelected == true);
		}
		if (selectedList.value.length === meals.value.length && selectedList.value.length > 0) selectAll.value = true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const selectItem = (data: Meal) => {
	console.log('data.isSelected', data.isSelected);
	if (data.isSelected == true) {
		selectedList.value.push(data);
	} else {
		selectedList.value = selectedList.value.filter((v) => v.id !== data.id);
	}
};

// 全选复选框事件
const onSelectAll = (e: boolean) => {
	if (e == true && selectedList.value.length < meals.value.length) {
		meals.value.map((v) => (v.isSelected = true));
		selectedList.value = JSON.parse(JSON.stringify(meals.value));
	} else {
		meals.value.map((v) => (v.isSelected = false));
		selectedList.value = [];
	}
};

// 提交
const onSubmit = async () => {
	// console.log("当前选择的数据", selectedList.value);
	const isEdit = relatedData.value.id ? true : false;
	let params = {
		id: isEdit ? relatedData.value.id : undefined,
		foodDate: relatedData.value.foodDate,
		week: relatedData.value.week,
		calendarDetailVoList: selectedList.value,
	};
	let apiMethod = isEdit ? updateWeekFoodApi : addWeekFoodApi;
	let res = await apiMethod(params);
	if (res.code == 0) {
		useMessage().success(isEdit ? '编辑成功' : '新增成功');
		emit('onRefresh');
		closeDialog();
	} else {
		useMessage().error(res.msg || '操作失败');
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
.search-box {
	margin-bottom: 10px;
}

.tool-box {
	margin-bottom: 10px;
}
.selected-text {
	margin-left: 20px;
	vertical-align: text-bottom;
	.highlight {
		color: #409eff;
	}
}

.grid-box {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 20px;
}

.meal-item {
	position: relative;
	border: 1px solid #ebeef5;
	border-radius: 4px;
	overflow: hidden;
	cursor: pointer;
	transition: all 0.3s ease;

	&.meal-item-selected {
		border-color: #409eff;
		box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
	}

	.meal-image {
		width: 100%;
		height: 150px;
		object-fit: cover;
	}

	.meal-name {
		padding: 10px;
		font-size: 14px;
		text-align: center;
	}

	.meal-checkbox {
		position: absolute;
		top: 10px;
		right: 10px;
	}
}
</style>
