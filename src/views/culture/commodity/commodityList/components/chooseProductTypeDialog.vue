<template>
	<div>
		<!-- 商品添加选择-->
		<el-dialog v-model="proTypedialogVisible" title="选择商品类型" destroy-on-close :close-on-click-modal="false" width="700px">
			<el-form ref="formValiDateRef" class="formValidate mt20" :model="formValiDate" label-width="120px" @submit.native.prevent>
				<el-form-item label="商品类型：" required>
					<div class="acea-row">
						<div
							v-for="(item, index) in productType"
							:key="index"
							class="virtual"
							:class="formValiDate.type == item.id ? 'virtual_boder' : 'virtual_boder2'"
							@click="handleChangeProductType(item.id)"
						>
							<div class="virtual_top">{{ item.tit }}</div>
							<div class="virtual_bottom">({{ item.tit2 }})</div>
							<div v-if="formValiDate.type == item.id" class="virtual_san" />
							<div v-if="formValiDate.type == item.id" class="virtual_dui">✓</div>
						</div>
					</div>
					<!-- <div class="font12 add-product-title">数字藏品、虚拟产品不支持用户申请售后。</div> -->
				</el-form-item>
				<div class="font12 add-product-title">卡密商品不支持用户申请售后。</div>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="proTypedialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="handleSureType">确 定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Session } from '/@/utils/storage';
const router = useRouter();
const emit = defineEmits(['handleAdd']);
// 数据定义
const formValiDate = ref({
	type: 0,
});
const formValiDateRef = ref() as any;
const tenantId = ref(Session.getTenant());
const productType = ref<any[]>([
	{ tit: '普通商品', id: 0, tit2: '实体货物' },
	// { tit: '数字藏品', id: 9, tit2: '地铁IP' },
	// { tit: '虚拟产品', id: 98, tit2: '无需线下发货' },
	// { tit: '云盘商品', id: 5, tit2: '统一链接发货' },
	{ tit: '卡密商品', id: 6, tit2: '不同充值码发货' },
]);

const proTypedialogVisible = ref<boolean>(false);

// 打开弹窗
const openDialog = () => {
	formValiDate.value.type = 0;
	proTypedialogVisible.value = true;
	if (tenantId.value == '1922177185280557058') {
		productType.value.push({ tit: '优惠券商品', id: 11, tit2: '平台优惠券' });
	}

	if (tenantId.value == '1963773220574330882') {
		productType.value = [{ tit: '普通商品', id: 0, tit2: '实体货物' }];
	}
};

// 确定选择商品类型
const handleSureType = () => {
	proTypedialogVisible.value = false;
	emit('handleAdd', formValiDate.value.type);

	// 示例路由跳转逻辑（可根据需要取消注释）
	// const addType = addTypeProp.value === 'isAdd' ? 2 : 1;
	// router.push({ path: `/product/list/creatProduct/0/2/${addType}/${formValidate.value.type}` });
};

// 选择商品类型
const handleChangeProductType = (id: number) => {
	formValiDate.value.type = id;
};
defineExpose({
	openDialog,
});
// 如果你需要启用 props，请取消下面这段并根据需求修改
// const props = defineProps<{
//   addType?: string;
// }>();
</script>

<style scoped lang="scss">
.acea-row {
	display: -webkit-box;
	display: -moz-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-lines: multiple;
	-moz-box-lines: multiple;
	-o-box-lines: multiple;
	-webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	/* 辅助类 */
}
.virtual {
	width: 120px;
	height: 60px;
	background: #ffffff;
	border-radius: 3px;
	text-align: center;
	padding-top: 8px;
	position: relative;
	cursor: pointer;
	line-height: 23px;
	.virtual_top {
		font-size: 14px;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.85);
	}
	.virtual_bottom {
		font-size: 12px;
		font-weight: 400;
		color: #999999;
	}
}
.virtual_san {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 0;
	height: 0;
	border-bottom: 26px solid #0256ff;
	border-left: 26px solid transparent;
}
.virtual_dui {
	position: absolute;
	bottom: -2px;
	right: 2px;
	color: #ffffff;
	font-family: system-ui;
}
.virtual:nth-child(2n) {
	margin: 0 12px;
}
.virtual_boder {
	border: 1px solid #0256ff;
}
.virtual_boder2 {
	border: 1px solid #e7e7e7;
}
.add-product-title {
	margin-left: 120px;
}
</style>
