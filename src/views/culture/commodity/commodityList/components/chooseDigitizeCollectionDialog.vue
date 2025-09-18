<template>
	<el-dialog v-model="dialogVisible" title="选择藏品" width="80%" @close="closeDialog">
		<!-- 搜索栏一 -->
		<div class="search-row">
			<div class="radio-box">
				<el-radio v-model="limitType" :label="true">长期</el-radio>
				<el-radio v-model="limitType" :label="false">限时</el-radio>
				<div style="display: flex; align-items: center">
					<span class="mr4">自购买之日起</span>
					<el-input-number v-model="limitDay" :disabled="limitType === true" :min="1" :max="365" :precision="0" style="width: 150px" /><span
						class="ml4"
						>天有效</span
					>
				</div>
			</div>
		</div>

		<!-- 搜索栏二 -->
		<div class="search-row">
			<el-row style="width: 100%" :gutter="10">
				<el-col :span="6">
					<!-- 搜索框 -->
					<el-input v-model="keyword" placeholder="请输入名称搜索" style="width: 100%; margin-bottom: 20px">
						<template #suffix>
							<el-icon @click="handleSearch"><Search /></el-icon>
						</template>
					</el-input>
				</el-col>
				<el-col :span="6">
					<!-- 藏品类型筛选 -->
					<el-select v-model="selectedType" placeholder="请选择藏品类型" style="margin-bottom: 20px">
						<el-option label="皮肤" value="1"></el-option>
					</el-select>
				</el-col>
			</el-row>
		</div>

		<div class="content">
			<!-- 藏品列表 -->
			<el-row :gutter="20">
				<el-col :span="4" v-for="(item, index) in collectionList" :key="index">
					<el-card class="item-card" :body-style="{ padding: '0px', border: 'solid 1px #ccc' }" shadow="hover" @click="selectItem(item)">
						<div class="radio-wrapper">
							<el-radio-group v-model="selectedId">
								<el-radio :label="item.id">{{ index + 1 }}</el-radio>
							</el-radio-group>
							<!-- <el-radio :value="selectedId" :label="item.id">{{ index + 1 }}</el-radio> -->
						</div>
						<div class="image-box">
							<img :src="item.previewImg" class="image" />
						</div>
						<div class="item-card-title">
							<span class="bold-text">{{ item.name }}</span>
							<span>&emsp14;皮肤</span>
						</div>
					</el-card>
				</el-col>
			</el-row>

			<!-- 分页 -->
			<el-pagination
				background
				layout="total, prev, pager, next"
				:total="total"
				:page-size="pageSize"
				:current-page="currentPage"
				@current-change="handlePageChange"
			></el-pagination>
		</div>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeDialog()">取 消</el-button>
				<el-button type="primary" @click="handleSureType">确 定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { skinListApi } from '/@/api/culture/commodity/commodityList';

// 响应式数据
const dialogVisible = ref(false);
const keyword = ref<string | null>(null);
const limitType = ref<boolean>(false);
const limitDay = ref<number>(7);
const selectedType = ref<string>('');
const selectedId = ref<number | null>(null);
const collectionList = ref<any[]>([]);
const currentPage = ref<number>(1);
const pageSize = ref<number>(12);
const total = ref<number>(0);
const relatedId = ref<number | null>(null);
// 打开弹窗方法
const openDialog = async (opt: any) => {
	console.log('打开弹框', opt);
	dialogVisible.value = true;
	relatedId.value = opt.relatedId; // 记录当前绑定的id
	await loadData(opt?.defaultData?.code);
	if (opt?.defaultData) {
		limitType.value = opt.defaultData.limitType;
		limitDay.value = opt.defaultData.limitDay;
		const findObj = collectionList.value.find((v) => v.code === opt.defaultData.code);
		selectedId.value = findObj?.id || null;
	} else {
		onReset();
	}
};

// 关闭弹窗
const closeDialog = () => {
	dialogVisible.value = false;
};

// 搜索事件
const handleSearch = () => {
	currentPage.value = 1;
	loadData();
};

// 加载数据
const loadData = async (sortCode: string | null = null) => {
	const params = {
		current: currentPage.value,
		size: pageSize.value,
		name: keyword.value,
		sortCode: sortCode ? sortCode : undefined,
		status: true,
	};
	try {
		const { code, data, msg } = await skinListApi(params);
		if (code === 0) {
			collectionList.value = data.records;
			total.value = data.total;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		fullscreenLoading.value = false;
		useMessage().error(error.msg);
	}
	// const data = await skinListApi(params);
};

// 分页切换
const handlePageChange = (page: number) => {
	currentPage.value = page;
	loadData();
};

// 选中藏品
const selectItem = (item: any) => {
	selectedId.value = item.id;
	onReset();
};

// 提交确认
const handleSureType = () => {
	const obj = {
		relatedId: relatedId.value,
		selectedRows: collectionList.value.filter((v) => v.id === selectedId.value),
		limitType: limitType.value,
		limitDay: limitDay.value,
	};
	$emit('handleOk', obj);
	closeDialog();
};

// 重置时间设置
const onReset = () => {
	limitType.value = false;
	limitDay.value = 7;
};

// 暴露给父组件的方法
defineExpose({ openDialog });

// 定义 emit
const $emit = defineEmits(['handleOk']);
</script>

<style lang="scss" scoped>
.search-row {
	margin-bottom: 14px;
	width: 100%;
	display: flex;
}
.radio-box {
	display: flex;
}

.content {
	padding: 10px;
}

.item-card {
	position: relative;
	margin-bottom: 10px;

	.radio-wrapper {
		position: absolute;
		top: 5px;
		left: 5px;
		width: 20px;
		height: 20px;
		z-index: 2;
	}

	.image-box {
		width: 100%;
		height: 200px;
		padding: 0 20px;

		.image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.item-card-title {
		padding: 10px;

		.bold-text {
			display: inline-block;
			width: 70%;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			vertical-align: middle;
			font-size: 14px;
		}
	}
}
</style>
