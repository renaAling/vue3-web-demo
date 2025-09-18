<template>
	<div class="purchase-detail">
		<!-- 返回按钮 -->
		<div class="btn-back" @click="goBack()">
			<el-icon><Back /></el-icon>
			返回列表
		</div>

		<!-- 页面标题 -->
		<div class="title">采购商品列表</div>

		<div class="table-box">
			<el-table :data="tableData" style="width: 100%" border>
				<el-table-column prop="imageUrl" label="商品信息">
					<template #default="scope">
						<div class="goods-info">
							<img :src="scope.row.imageUrl" alt="商品图片" class="goods-image" />
							<div class="goods-details">
								<p class="name">{{ scope.row.productName }}</p>
								<p class="spec">{{ scope.row.skuName }}</p>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="price" label="单价" width="120">
					<template #default="scope"> ¥{{ scope.row.productPrice.toFixed(2) }} </template>
				</el-table-column>
				<el-table-column prop="quantity" label="数量" width="120">
					<template #default="scope">
						{{ scope.row.productCount }}
					</template>
				</el-table-column>
				<el-table-column prop="subtotal" label="小计" width="120">
					<template #default="scope"> ¥{{ scope.row.productTotal.toFixed(2) }} </template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 底部汇总 -->
		<div class="row-summary">
			<span class="summary-text">商品总数：{{ totalQuantity }} 件</span>
			<span class="summary-text ml-20"
				>采购总额：<span class="blue">¥{{ (totalPrice).toFixed(2) }}</span></span
			>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElTable } from 'element-plus';
import { getPurchaseDetailApi } from '/@/api/goodStore/mall';
import { useMessage } from '/@/hooks/message';

// 定义商品数据类型
interface Product {
	productName: string;
	productCode: string;
	productSkuCode: string; // 商品sku code
	productCount: number; // 商品数量
	productPrice: number; // 单价
	productTotal: number; // 小计
}

let relatedId: string = '';

const route = useRoute();
const router = useRouter();

const tableData = ref<Array<Product>>([]);

// 获取详情
const getInfo = async () => {
	console.log("获取详情",relatedId)
	let params = {
		id: relatedId,
	};
	let res = await getPurchaseDetailApi(params);
	if (res.code == 0) {
		const { data } = res;
		tableData.value = data.productList;
	} else {
		useMessage().error(res.msg || '获取失败');
	}
};

// 计算商品总数
const totalQuantity = computed(() => {
	return tableData.value.reduce((total, item) => total + item.productCount, 0);
});

// 计算采购总额
const totalPrice = computed(() => {
	return tableData.value.reduce((total, item) => total + item.productTotal, 0);
});

const goBack = () => {
	router.back();
};

onMounted(() => {
	relatedId = route.query.id as string;
	getInfo();
});
</script>

<style scoped>
.ml-20 {
	margin-left: 20px;
}

.purchase-detail {
	width: 100%;
	height: 100%;
	padding: 20px;
	background-color: #fff;
}

.title {
	padding: 20px 10px;
	font-size: 16px;
	font-weight: bold;
}

.table-box {
	width: 100%;
}

.goods-info {
	.goods-image {
		display: inline-block;
		width: 50px;
		height: 50px;
		border-radius: 5px;
	}
	.goods-details {
		display: inline-block;
		margin-left: 16px;
		margin-top: 10px;
		.name {
			font-size: 14px;
			/* color: #666; */
		}
		.spec {
			font-size: 12px;
			color: #aaa;
		}
	}
}

.row-summary {
	width: 100%;
	padding: 14px 10px;
	background-color: #f9fafb;
	text-align: right;
	.summary-text {
		font-weight: 600;
		.blue {
			color: #5d98f7;
		}
	}
}

.btn-back {
	cursor: pointer;
}
</style>
