<template>
	<el-dialog v-model="centerDialogVisible" title="商品预览" width="410" align-center>
		<section class="banner">
			<img :src="dataForm.carousels[0].imageUrl" alt="" />
		</section>
		<section class="desc">
			<div class="price">
				<span>¥</span>
				<span>{{ dataForm.skus[0].publicationFee }}</span>
			</div>
			<div class="product-name">{{ dataForm.spuName }}</div>
			<div class="sell-point">{{ dataForm.intro }}</div>
			<div class="selected">已选：{{ dataForm.skus[0].skuName }}</div>
			<div class="sku-list">
				<div v-for="(item, index) in dataForm.skus" :key="item.skuCode">
					<img v-if="item.skuImage" :src="item.skuImage" alt="" :class="dataForm.skus[0] ? 'selected-border' : ''" />
					<img v-else :src="dataForm.carousels[0].imageUrl" alt="" />
				</div>
			</div>
		</section>
		<section class="detail">
			<div v-for="(item, index) in dataForm.details" :key="index">
				<img :src="item.imageUrl" alt="" />
			</div>
		</section>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="centerDialogVisible = false">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

const centerDialogVisible = ref(false);

let dataForm = reactive({
	carousels: [] as any, // 轮播位列表，暂时只展示第一张图
	spuName: '',
	intro: '',
	skus: [] as any,
	lologisticsType: null,
	details: [] as any,
});

const openDialog = (data?: object) => {
	centerDialogVisible.value = true;
	dataForm = data as any;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.banner {
	height: 300px;
	box-sizing: border-box;
	padding: 16px;
	margin-bottom: 8px;

	img {
		width: 100%;
		height: 100%;
	}
}

.desc {
	.price {
		color: #f5222d;
		margin-bottom: 12px;

		span {
			&:nth-child(2) {
				font-size: 32px;
			}
		}
	}

	.product-name {
		margin-bottom: 8px;
		font-size: 17px;
		font-weight: 500;
	}

	.sell-point {
		font-size: 14px;
		font-weight: 350;
		color: #86909c;
		margin-bottom: 20px;
	}

	.selected {
		font-size: 14px;
		font-weight: 500;
		color: #1d2129;
		margin-bottom: 8px;
	}

	.sku-list {
		border-radius: 4px;
		display: flex;
		width: 100%;
		padding: 4px;
		position: relative;
		border-bottom: 1px solid #f0f0f0;
		padding-bottom: 16px;
		margin-bottom: 16px;

		> div {
			background: #f5f5f5;
			width: 50px;
			height: 50px;
			margin-right: 8px;

			.img {
				width: 100%;
			}

			.selected-border {
				border: 2px solid #0256ff;
			}
		}

		&::after {
			position: absolute;
			content: '>';
			right: 0px;
			top: 25px;
			width: 6px;
			height: 8px;
			font-weight: 500;
		}
	}
}

.detail {
}
</style>
