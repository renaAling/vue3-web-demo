<template>
	<el-dialog v-model="dialogVisible" title="商品预览" width="410" align-center>
		<el-form ref="formRef" :model="model" label-width="auto">
			<el-form-item label="应用名称：" class="custom-width">
				<span>{{ model.name }}</span>
			</el-form-item>
			<el-form-item label="应用类型：" class="custom-width">
				<span>{{ model.type }}</span>
			</el-form-item>
			<el-form-item label="APPKey：" class="custom-width">
				<span>{{ model.key }}</span>
			</el-form-item>
			<el-form-item label="APPSecret：" class="custom-width">
				<span>{{ model.secret }}</span>
				<el-button type="primary" @click="handleViewSecret">查看</el-button>
			</el-form-item>
			<el-form-item label="应用公钥：" class="custom-width">
				<el-button type="primary" @click="handleViewSecret">查看公钥</el-button>
			</el-form-item>
			<el-form-item label="应用说明：" class="custom-width">
				<span>{{ model.info }}</span>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

const dialogVisible = ref(false);

let model = reactive({
	name: '11111',
	type: 'Web',
	key: 'hufdhguihbcjvbkvcjkvbkxbckzbbaijdqepojfkljblk',
	secret: '******************',
	publicKey: '123123123',
	info: '移动积分互通',
});

const openDialog = (data?: object) => {
	dialogVisible.value = true;
};

const handleViewSecret = () => {
	console.log(1111);
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
