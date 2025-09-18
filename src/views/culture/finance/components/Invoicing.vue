<template>
	<div>
		<el-drawer v-model="dialogVisible" title="开票申请">
			<el-descriptions :column="1" label-width="100px">
				<el-descriptions-item label="发票类型">{{ invoicingDatail.invoiceType === 1 ? '普票' : '专票' }}</el-descriptions-item>
				<el-descriptions-item label="抬头信息">{{ invoicingDatail.headerInfo }}</el-descriptions-item>
				<el-descriptions-item label="抬头类型">{{ invoicingDatail.headerType === 1 ? '个人' : '单位' }}</el-descriptions-item>
				<el-descriptions-item label="税号">{{ invoicingDatail.taxNumber || '-' }}</el-descriptions-item>
				<el-descriptions-item label="金额">{{ invoicingDatail.amount }}</el-descriptions-item>
				<el-descriptions-item label="联系电话">{{ invoicingDatail.mobile }}</el-descriptions-item>
				<el-descriptions-item label="关联订单号">{{ invoicingDatail.relatedOrderId }}</el-descriptions-item>
				<el-descriptions-item label="电子票">
          			<el-link type="primary" :underline="false" :href="invoicingDatail.invoiceUrl">{{ invoicingDatail.invoiceUrl }}</el-link>
				</el-descriptions-item>
			</el-descriptions>
			<template #footer v-if="invoicingDatail.billingStatus === 1">
				<div>
					<el-button type="primary" @click="confirmClick">确认提交</el-button>
					<el-button @click="cancelClick">取消</el-button>
				</div>
			</template>
		</el-drawer>
	</div>
</template>
<script lang="ts" setup name="invoicing">
import { invoiceInfoDetailApi, uploadInvoiceInfoApi } from '/@/api/culture/finance';
import { useMessage } from '/@/hooks/message';

const dialogVisible = ref(false);
const invoicingDatail = ref({
	id: null,
	invoiceType: null,
	headerType: null,
	headerInfo: '',
	taxNumber: '',
	amount: null,
	mobile: '',
	relatedOrderId: '',
	invoiceUrl: '',
	billingStatus: null,
});

const getDetail = async (id: number) => {
	try {
		const res = await invoiceInfoDetailApi({ id });
		invoicingDatail.value = res.data;
	} catch (error) {
    console.log(error);
	}
};

const confirmClick = () => {
	if (invoicingDatail.value.invoiceUrl) {
		uploadInvoiceInfoApi({
			id: invoicingDatail.value.id,
			invoiceUrl: invoicingDatail.value.invoiceUrl,
		}).then((res: any) => {
			if (res.ok) {
				dialogVisible.value = false;
				useMessage().success('提交成功');
			} else {
				useMessage().error(res.msg);
			}
		});
	} else {
		useMessage().error('请上传电子票');
  }
};
const cancelClick = () => {
	dialogVisible.value = false;
};
defineExpose({ getDetail, dialogVisible });
</script>
<style lang="scss" scoped>
:deep(.el-descriptions__cell) {
	display: flex;
}
:deep(.el-link__inner) {
  display: inline-block;
  word-break: break-all;
  width: 300px;
}
</style>
