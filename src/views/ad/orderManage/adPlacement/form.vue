<template>
	<div class="order-detail">{{ afterSaleStatusMap[basicInfoForm.status] }}</div>
	<!-- 投放期望 -->
	<el-card>
		<p class="title">投放期望</p>
		<el-table
			border
			:data="basicInfoForm.tfqw"
			v-loading="state.loading"
			:cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle"
		>
			<el-table-column label="联系人" prop="contacts" />
			<el-table-column label="联系电话" prop="contactsNumber" />
			<el-table-column label="投放时间" prop="placementTime" />
			<el-table-column label="更多要求" prop="description" />
			<el-table-column label="操作" width="240" fixed="right">
				<template #default="">
					<el-button type="primary" link @click="dialogsRef.openDialog(basicInfoForm, 2)" v-if="basicInfoForm.status === 1">拒绝并退款</el-button>
					<el-button type="primary" link @click="dialogsRef.openDialog(basicInfoForm, 3)" v-if="basicInfoForm.status === 1">去排期</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
	<!-- 审核说明 -->
	<el-card v-if="basicInfoForm.status === 10">
		<p class="title">审核说明</p>
		<el-table
			border
			:data="basicInfoForm.shsm"
			v-loading="state.loading"
			:cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle"
		>
			<el-table-column label="审核说明" prop="auditDescription" />
			<el-table-column label="退款金额" prop="refundPrice" />
			<el-table-column label="退款状态" prop="refundStatus">
				<template #default="{ row }">
					<el-tag type="primary" >{{row.tkzt ? '已退款' : '未退款'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="退款时间" prop="refundTime" />
		</el-table>
	</el-card>
	<!-- 投放排期 -->
	<el-card>
		<p class="title">投放排期</p>
		<el-table
			border
			:data="basicInfoForm.tfpq"
			v-loading="state.loading"
			:cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle"
		>
			<el-table-column label="投放时间" prop="deliveryTime" />
			<el-table-column label="投放说明" prop="deliveryDescription" />

			<el-table-column label="操作人" prop="deliveryUser" />
			<el-table-column label="确认状态" prop="status">
				<template #default="{ row }">{{ afterSaleStatusMap[row.status] }}</template>
			</el-table-column>
			<el-table-column label="确认时间" prop="deliveryConfirmTime" />
			<el-table-column label="确认方式" prop="deliveryConfirmType">
				<template #default="{ row }">{{ confirmTypeMap[row.deliveryConfirmType] }}</template>
			</el-table-column>
		</el-table>
	</el-card>
	<!-- 订单补款 -->
	<el-card v-if="basicInfoForm.compOrderCode">
		<p class="title">订单补款</p>
		<el-table
			border
			:data="basicInfoForm.ddbk"
			v-loading="state.loading"
			:cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle"
		>
			<el-table-column label="补款单号" prop="compOrderCode" />
			<el-table-column label="补款金额" prop="compPrice" />
			<el-table-column label="补款状态" prop="isComp">
				<template #default="{ row }">{{ row.isComp ? '已补款' : '未补款' }} </template>
			</el-table-column>
			<el-table-column label="支付方式" prop="payMethod">
				<template #default="{}">{{ '微信支付' }}</template>
			</el-table-column>
			<el-table-column label="支付单号" prop="compOrderCode" />
			<el-table-column label="补款时间" prop="compTime" />
		</el-table>
	</el-card>
	<!-- 工单退款 -->
	<el-card v-if="basicInfoForm.refundOrderCode">
		<p class="title">工单退款</p>
		<el-table
			border
			:data="basicInfoForm.gdtk"
			v-loading="state.loading"
			:cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle"
		>
			<el-table-column label="退款单号" prop="refundOrderCode" />
			<el-table-column label="退款金额" prop="refundPrice" />
			<el-table-column label="退款状态" prop="refundStatus">
				<template #default="{ row }">{{ refundStatusMap[row.refundStatus] }}</template>
			</el-table-column>
			<el-table-column label="退款渠道" prop="payMethod">
				<template #default="{}">{{ '微信支付' }}</template>
			</el-table-column>
			<el-table-column label="退款时间" prop="refundTime" />
		</el-table>
	</el-card>
	<!-- 广告素材 -->
	<el-card>
		<p class="title">广告素材</p>
		<el-form-item label="上传时间：">
			<span>{{ basicInfoForm.uploadTime }}</span>
		</el-form-item>
		<el-form-item label="素材说明：">
			<span class="text">{{ basicInfoForm.adDescription }}</span>
		</el-form-item>
		<el-form-item label="素材图片：">
			<div class="flex">
				<div v-for="(item, index) in basicInfoForm.adImages" :key="index" class="mr-3">
					<el-image class="img" :src="item" :preview-src-list="basicInfoForm.adImages" :initial-index="index" fit="cover" />
				</div>
			</div>
		</el-form-item>
		<el-form-item label="审核时间：">
			<span>{{ basicInfoForm.auditTime }}</span>
		</el-form-item>
		<el-form-item label="审核人：">
			<span>{{ basicInfoForm.auditUser }}</span>
		</el-form-item>
		<el-form-item label="审核说明：">
			<span>{{ basicInfoForm.auditDescription }}</span>
		</el-form-item>
		<el-form-item label="审核附件：">
			<div class="flex" v-if="basicInfoForm.auditFiles && basicInfoForm.auditFiles.length > 0">
				<div v-for="(item, index) in basicInfoForm.auditFiles" :key="index" class="mr-3">
					<el-image
						class="img"
						:src="item.img"
						:preview-src-list="basicInfoForm.auditFiles.map((item) => item.img)"
						:initial-index="index"
						fit="cover"
					/>
				</div>
			</div>
		</el-form-item>
		<el-form-item label="去审核：" v-if="basicInfoForm.status === 4">
			<el-button type="primary" @click="dialogsRef.openDialog(basicInfoForm, 4)">通过审核</el-button>
			<el-button type="primary" @click="dialogsRef.openDialog(basicInfoForm, 5)"> 不通过</el-button>
		</el-form-item>
	</el-card>
	<!-- 上刊确认 -->
	<el-card v-if="basicInfoForm.status === 6">
		<p class="title">上刊确认</p>
		<el-table
			border
			:data="basicInfoForm.skqr"
			v-loading="state.loading"
			:cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle"
		>
			<el-table-column label="上刊报告" prop="publishFiles" width="430">
				<template #default="{}">
					<div class="flex flex-wrap">
						<div v-for="(item, index) in basicInfoForm.publishFiles" :key="index" class="flex items-center mr-2 box">
							<upload-img v-model:image-url="item.img" />
							<el-icon
								size="18px"
								@click="basicInfoForm.publishFiles?.splice(index, 1)"
								v-if="(basicInfoForm.publishFiles?.length ?? 0) > 0 && !item.img"
								><Delete
							/></el-icon>
						</div>
						<div class="">
							<el-button type="primary" icon="Plus" v-if="(basicInfoForm.publishFiles?.length ?? 0) < 9" @click="addImg()">报告</el-button>
							<el-button type="primary" class="" v-if="(basicInfoForm.publishFiles?.length ?? 0) > 0" @click="confirmPublish()">确认上刊</el-button>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="上传时间" prop="publishUploadTime" />
			<el-table-column label="操作人" prop="publishUser" />
			<el-table-column label="确认状态" prop="status">
				<template #default="{ row }">{{ afterSaleStatusMap[row.status] }}</template>
			</el-table-column>
			<el-table-column label="确认时间" prop="publishConfirmTime" />
			<el-table-column label="确认方式" prop="publishConfirmType">
				<template #default="{ row }">{{ confirmTypeMap[row.publishConfirmType] }}</template>
			</el-table-column>
		</el-table>
	</el-card>

	<!-- 弹窗 -->
	<Dialogs ref="dialogsRef" @refreshDetail="getDetails" />
</template>

<script setup lang="ts" name="ad-adPlacement-form">
import { reactive, ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { afterSaleStatusMap, confirmTypeMap, refundStatusMap } from './constant';
import { basicInfoTypes } from './types';
import { workOrderDetail, workOrderPublishConfirm } from '/@/api/ad/afterSellOrder';
import { useMessage } from '/@/hooks/message';
const Dialogs = defineAsyncComponent(() => import('./dialogs.vue'));
const router = useRouter();
const dialogsRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
});
const loading = ref(false);
//  table hook
const { tableStyle } = useTable(state);
const basicInfoForm = ref<basicInfoTypes>({
	tfqw: [],
	tfpq: [],
	ddbk: [],
	skqr: [],
	gdtk: [],
	shsm: [],
	adDescription: '',
	orderCode: '',
	workOrderCode: '',
	uploadTime: '',
	status: 0,
	adImages: [],
	auditTime: '',
	auditUser: '',
	auditDescription: '',
	compOrderCode: '',
	refundOrderCode: '',
	auditFiles: [],
	publishFiles: [{ img: '' }],
});
const getOrderDetailData = async (orderCode: any) => {
	try {
		const { code, data, msg } = await workOrderDetail(orderCode);
		loading.value = false;
		if (code === 0) {
			const {
				contacts,
				contactsNumber,
				description,
				workOrderCode,
				status,
				deliveryConfirmType,
				deliveryUser,
				deliveryTime,
				deliveryConfirmTime,
				adDescription,
				adImage,
				adImages,
				uploadTime,
				publishFiles,
				publishDescription,
				publishUploadTime,
				publishUser,
				publishTime,
				publishConfirmTime,
				publishConfirmType,
				compOrderCode,
				compPrice,
				compTime,
				isComp,
				closeMsg,
				closeTime,
				auditTime,
				auditUser,
				auditDescription,
				auditFiles,
				orderCode,
				refundOrderCode,
				refundPrice,
				refundTime,
				refundStatus,
				deliveryDescription,
				placementTime,
			} = data;
			const scopeAuditFiles = auditFiles?.map((itemX: any) => ({ img: itemX }));
			basicInfoForm.value = Object.assign(
				{ closeMsg: closeMsg || '——' },
				{ closeTime: closeTime || '——' },
				{ auditTime: auditTime || '——' },
				{ auditUser: auditUser || '——' },
				{ auditDescription: auditDescription || '——' },
				{ auditFiles: scopeAuditFiles },
				{ workOrderCode: workOrderCode || '——' },
				{ status: status },
				{ adDescription: adDescription || '——' },
				{ adImage: adImage || '——' },
				{ adImages: adImages || '——' },
				{ uploadTime: uploadTime || '——' },
				{ publishFiles: publishFiles || [] },
				{ orderCode: orderCode || '——' },
				{ compOrderCode: compOrderCode },
				{ refundOrderCode: refundOrderCode },
				{
					tfqw: [
						{
							contacts: contacts || '——',
							placementTime: placementTime || '——',
							contactsNumber: contactsNumber || '——',
							description: description || '——',
						},
					],
					tfpq: [
						{
							deliveryConfirmType,
							deliveryUser: deliveryUser || '——',
							deliveryTime: deliveryTime || '——',
							deliveryDescription: deliveryDescription || '——',
							deliveryConfirmTime: deliveryConfirmTime || '——',
							status,
						},
					],
					ddbk: [{ compOrderCode: compOrderCode || '——', compPrice: compPrice || '——', compTime: compTime || '——', isComp: isComp }],
					gdtk: [
						{
							refundOrderCode: refundOrderCode || '——',
							refundPrice: refundPrice || '——',
							refundTime: refundTime || '——',
							refundStatus: refundStatus,
						},
					],
					skqr: [
						{
							publishFiles: publishFiles || [],
							publishDescription: publishDescription || '——',
							publishUploadTime: publishUploadTime || '——',
							publishUser: publishUser || '——',
							publishTime: publishTime || '——',
							status,
							publishConfirmTime: publishConfirmTime || '——',
							publishConfirmType: publishConfirmType || '——',
						},
					],
					shsm: [
						{
							auditDescription: auditDescription || '——',
							refundPrice: refundPrice || '——',
							refundStatus: closeMsg || '——',
							refundTime: closeMsg || '——',
						},
					],
				}
			);
			console.log('basicInfoForm==========', basicInfoForm.value);
		} else {
			useMessage().error(msg || '获取数据失败');
			loading.value = false;
			router.push('/ad/orderManage/adPlacement/index');
		}
	} catch (error: any) {
		useMessage().error(error.msg || '获取数据失败');
		router.push('/ad/orderManage/adPlacement/index');
		loading.value = false;
	}
};
const addImg = () => {
	basicInfoForm.value.publishFiles.push({ img: '' });
};
const validImg = (list: Array<any> = [], msg: string) => {
	const val = list.some((item) => !item.img);
	if (val) useMessage().error(msg);
	return !val;
};
const delEmpty = (list: any[] = []) => {
	return list.filter((item) => item);
};
const confirmPublish = async () => {
	validImg(basicInfoForm.value.publishFiles, '请上传上刊文件');
	// 确认上刊
	const publishFile = delEmpty(basicInfoForm.value.publishFiles)?.map((itemX: any) => itemX.img || itemX);
	const params = {
		workOrderCode: basicInfoForm.value.workOrderCode,
		publishFile,
	};
	const { code, msg } = await workOrderPublishConfirm(params);
	if (code === 0) {
		useMessage().success(msg || '上刊成功');
		getDetails();
	} else {
		useMessage().error(msg);
	}
};
const getDetails = () => {
	const workOrderCode = router.currentRoute.value.query.workOrderCode;
	getOrderDetailData(workOrderCode);
};
onMounted(() => {
	loading.value = true;
	getDetails();
});
</script>
<style lang="scss" scoped>
.img {
	width: 50px;
	height: 50px;
}
::v-deep .upload-box .upload .el-upload {
	width: 100px;
	height: 100px;
}
.el-card {
	margin-bottom: 20px;
}
.title {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: #1d2129;
	margin-bottom: 16px;
}
.text {
	display: inline-block;
	width: 50%;
	line-height: 1.5;
}
.order-detail {
	padding: 20px;
	font-size: 22px;
	background: #fff;
	color: #4785ea;
}
</style>
