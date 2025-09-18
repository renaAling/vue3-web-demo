<template>
	<div>
		<el-form class="custom-form" :model="basicInfoForm" label-width="100px" v-loading="loading" ref="formRef">
			<el-card>
				<p class="title">基础信息</p>
				<el-row :getter="24">
					<el-col :span="6">
						<el-form-item label="订单号：">
							<span>{{ basicInfoForm.orderCode }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="订单状态：">
							<span>{{ orderStatusMap[basicInfoForm.status] }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="下单时间：">
							<span>{{ basicInfoForm.orderTime }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :getter="24">
					<el-col :span="24">
						<el-form-item label="订单备注：">
							<span>{{ basicInfoForm.remark }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :getter="24">
					<el-col :span="6">
						<el-form-item label="下单账号：">
							<span>{{ basicInfoForm.name }}({{ basicInfoForm.mobile }})</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="收货方式：">
							<span style="margin-right: 10px">
								{{ receiveWayMap[basicInfoForm?.logisticsType] }}
								<span v-if="basicInfoForm.logisticsType == '1'">
									({{ basicInfoForm.deliveryName }} {{ basicInfoForm.deliveryMobile }} {{ basicInfoForm.districtName
									}}{{ basicInfoForm.deliveryAddress }} )
								</span>
							</span>
							<el-button
								type="primary"
								@click="handleChangeAddress"
								v-if="basicInfoForm.logisticsType == '1' && basicInfoForm.shippingStatus == '1' && basicInfoForm.status != '6'"
							>
								变更收货地址
							</el-button>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="完成时间：">
							<span>{{ basicInfoForm.finishTime }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<el-card>
				<p class="title">订单商品</p>
				<el-table
					border
					:data="basicInfoForm.skuInfos"
					v-loading="state.loading"
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column label="SKU" prop="skuCode" />
					<el-table-column label="SKU图" prop="skuImage" width="120">
						<template #default="scope">
							<el-image style="width: 100px; height: 100px" :src="scope.row.skuImage" />
						</template>
					</el-table-column>
					<el-table-column label="商品标题" prop="spuName" />
					<el-table-column label="规格" prop="skuName" />
					<el-table-column label="供应商" prop="supplierName" />
					<el-table-column label="数量" prop="quantity" />
					<el-table-column label="单价" prop="price" />
				</el-table>
				<div class="mt-3">订单总金额:￥{{ Number(basicInfoForm.amount).toFixed(2) }}元</div>
				<el-button type="primary" @click="showAfter = true" v-if="basicInfoForm.afterSalesIsShow">发起售后</el-button>
			</el-card>
			<el-card v-if="basicInfoForm.afterSalesIsShow && showAfter">
				<p class="title">发起售后</p>
				<el-row :getter="24">
					<el-col :span="6">
						<el-form-item label="售后原因：" :rules="[{ required: true, message: '请选择售后原因' }]" prop="reasonId">
							<el-select v-model="basicInfoForm.reasonId" style="width: 100%">
								<el-option v-for="(item, index) in reasonList" :key="index" :label="item.reason" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="售后说明：" :rules="[{ required: true, message: '售后说明' }]" prop="applyDescription">
							<el-input v-model="basicInfoForm.applyDescription" type="textarea" maxlength="200" placeholder="请输入售后说明" />
						</el-form-item>
					</el-col>
					<el-col :span="6" class="ml-3">
						<el-button type="primary" @click="applyAfterSale">发起退款</el-button>
						<el-button type="primary" @click="cancel">取消</el-button>
					</el-col>
				</el-row>
			</el-card>
			<el-card>
				<p class="title">支付信息</p>
				<el-row :getter="12">
					<el-col :span="6">
						<el-form-item label="支付渠道：">
							<span>{{ paymentWayMap[basicInfoForm.paymentMethod] }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="支付时间：">
							<span>{{ basicInfoForm.paymentTime }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :getter="12">
					<el-col :span="6">
						<el-form-item label="支付单号：">
							<span>{{ basicInfoForm.orderCode }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="支付金额：">
							<span>￥{{ Number(basicInfoForm.payAmount).toFixed(2) }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<el-card v-if="basicInfoForm.logisticsType != '4'">
				<p class="title">{{ basicInfoForm.logisticsType == '1' ? '物流信息' : '自提信息' }}</p>
				<div v-if="basicInfoForm.logisticsType == '1'">
					<el-button type="primary" style="margin-bottom: 16px" @click="addLogisticsInfo" v-if="basicInfoForm.logisticsInfos.length === 0">
						<el-icon>
							<Plus />
						</el-icon>
						添加物流信息
					</el-button>
					<el-table
						border
						:data="basicInfoForm.logisticsInfos"
						v-loading="state.loading"
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column label="物流单号" prop="logisticsNumber">
							<template #default="{ row }">
								<el-input
									v-if="row.config"
									v-model="row.logisticsNumber"
									maxlength="20"
									placeholder="请输入物流单号"
									@blur="editLogisticsNumber(row)"
								/>
								<div v-else>
									<span>{{ row.logisticsNumber }}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="发货人" prop="shipperName" />
						<el-table-column label="所属主体" prop="platform" />
						<el-table-column label="发货时间" prop="deliveryTime" />
						<el-table-column label="操作">
							<template #default="{ row }">
								<el-button type="text" size="small" @click="row.config = true" icon="Edit"></el-button>
								<!-- <el-button type="text" size="small" @click="basicInfoForm.logisticsInfos.splice($index, 1)" icon="delete"></el-button> -->
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div v-else>
					<el-row :getter="24">
						<el-col :span="6">
							<el-form-item label="取货状态:">
								<span>{{
									basicInfoForm.logisticsType == '1' && basicInfoForm.status == '3'
										? '待发货'
										: basicInfoForm.logisticsType == '2' && basicInfoForm.status == '3'
										? '待取货'
										: orderStatusMap[basicInfoForm.status]
								}}</span>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="取货网点:">
								<span>{{ basicInfoForm.pickupSiteName }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="核销人:">
								<span>{{ basicInfoForm.verifyUser }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="核销时间:">
								<span>{{ basicInfoForm.verifyTime }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card>
				<p class="title">售后记录</p>
				<el-table
					border
					:data="basicInfoForm.afterSaleInfos"
					v-loading="state.loading"
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column label="售后单号" prop="afterSaleCode" />
					<el-table-column label="创建时间" prop="applyTime" />
					<el-table-column label="状态" prop="status">
						<template #default="{ row }">
							<span>{{ afterSaleStatusMap[row.status] }}</span>
						</template>
					</el-table-column>
					<el-table-column label="审核人" prop="auditName" />
					<el-table-column label="审核时间" prop="auditTime" />
					<el-table-column label="审核结果" prop="auditResult">
						<template #default="{ row }">
							<span>{{ row.auditResult == true ? '通过' : row.auditResult == false ? '驳回' : '——' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="退款金额" prop="refundAmount" />
					<el-table-column label="审核说明" prop="auditDescription" />
					<el-table-column label="操作" width="120">
						<template #default="{ row }">
							<el-button type="primary" link @click="goToDetailPage(row)">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</el-card>
		</el-form>
		<footer class="footer">
			<el-button @click="handleCancel">取消</el-button>
		</footer>
		<el-dialog v-model="addLogisticsInfoDialogVisible" title="添加物流信息" width="400">
			<el-form class="logistics-info-form" ref="logisticsInfoFormRef" :model="logisticsInfoForm" label-width="100px" :rules="logisticsInfoFormRules">
				<el-form-item label="物流单号：" prop="logisticsNumber">
					<el-input v-model="logisticsInfoForm.logisticsNumber"></el-input>
				</el-form-item>
				<el-form-item label="发货人：" prop="shipperName">
					<el-input v-model="logisticsInfoForm.shipperName" disabled></el-input>
				</el-form-item>
				<el-form-item label="所属主体：" prop="platform">
					<el-input v-model="logisticsInfoForm.platform" disabled></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="clickResetForm('logisticsInfo')">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(logisticsInfoFormRef)">提交</el-button>
				<!-- <div class="dialog-footer">
					<el-button @click="handleClose">取消</el-button>
					<el-button type="primary" @click="handleConfirm"> 确定</el-button>
				</div> -->
			</template>
		</el-dialog>
		<el-dialog v-model="changeAddressDialogVisible" title="变更收货地址" width="600">
			<el-form ref="receiptInfoFormRef" :model="receiptInfoForm" label-width="100px" :rules="receiptInfoFormRules">
				<el-form-item label="收货人：" prop="deliveryName">
					<el-input v-model="receiptInfoForm.deliveryName" clearable placeholder="请输入收货人"></el-input>
				</el-form-item>
				<el-form-item label="手机号：" prop="deliveryMobile">
					<el-input v-model="receiptInfoForm.deliveryMobile" clearable placeholder="请输入手机号"></el-input>
				</el-form-item>
				<el-form-item label="省市区：" prop="districtCode">
					<el-cascader
						v-model="receiptInfoForm.districtCode"
						:props="{
							value: 'code',
							label: 'name',
							children: 'childNode',
							emitPath: false,
						}"
						:options="provinceCityDistrictTreeList"
						placeholder="请选择省市区"
						clearable
						ref="cascader"
						style="width: 430px"
					/>
				</el-form-item>
				<el-form-item label="详细地址：" prop="deliveryAddress">
					<el-input v-model="receiptInfoForm.deliveryAddress" clearable placeholder="请输入详细地址"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="clickResetForm('receiptInfo')">取消</el-button>
				<el-button type="primary" size="default" @click="confirmChangeAddress">变更地址</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="cultureProductsForm">
import { reactive, Ref, ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	getOrderDetail,
	orderSendAdd,
	orderCodeUpdate,
	queryReasonList,
	backendApply,
	updateAddress,
	getProvinceCityDistrictTree,
} from '/@/api/culture/orderManage';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { LogisticsInfoType } from './types';
import { orderStatusMap, receiveWayMap, paymentWayMap } from './constant';
import { afterSaleStatusMap } from '../orderManage/workOrder/constant';
import { useUserInfo } from '/@/stores/userInfo';
import type { FormInstance, FormRules, ElNotification, ElMessageBox } from 'element-plus';

const router = useRouter();
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
const addLogisticsInfoDialogVisible = ref(false);
const changeAddressDialogVisible = ref(false);

const formRef = ref<FormInstance>();

const logisticsInfoFormRef = ref<FormInstance>();
const receiptInfoFormRef = ref<FormInstance>();

const provinceCityDistrictTreeList = ref([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
});
//  table hook
const { tableStyle, currentChangeHandle, sizeChangeHandle } = useTable(state);
const loading = ref(false);
const showAfter = ref(false);
const basicInfoForm = ref({
	afterSalesIsShow: false,
	reasonId: '',
	applyDescription: '',
	logisticsType: '',
	orderCode: '',
	verifyUser: '',
	verifyTime: '',
	status: '',
	mobile: '',
	orderTime: '',
	name: '',
	deliveryName: '',
	deliveryMobile: '',
	shippingStatus: '',
	districtName: '',
	deliveryAddress: '',
	paymentTime: '',
	finishTime: '',
	remark: '',
	skuInfos: [],
	payAmount: '',
	amount: '',
	paymentMethod: '',
	pickupSiteName: '',
	logisticsInfos: [] as LogisticsInfoType[],
	afterSaleInfos: [],
});

// 获取行政区树形结构数据
const getTree = async () => {
	let res = await getProvinceCityDistrictTree();
	provinceCityDistrictTreeList.value = res.data;
};

const receiptInfoForm = ref({
	deliveryName: '',
	deliveryMobile: '',
	districtCode: '',
	deliveryAddress: '',
});

// 新增物流信息表单
const logisticsInfoForm = ref({
	logisticsNumber: '',
	shipperName: '',
	platform: '',
});
// 售后原因列表
const reasonList = ref<{ id: string; reason: string }[]>([]);

const logisticsInfoFormRules = reactive<FormRules>({
	logisticsNumber: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
});

const receiptInfoFormRules = reactive<FormRules>({
	deliveryName: [{ required: true, message: '请输入收货人', trigger: 'change' }],
	deliveryMobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
	districtCode: [{ required: true, message: '请选择省市区', trigger: 'change' }],
	deliveryAddress: [{ required: true, message: '请输入详细地址', trigger: 'change' }],
});

// 取消
const handleCancel = () => {
	router.push('/culture/orderManage/orderList/index');
};

// 关闭新增物流信息弹窗
const resetForm = (formEl: FormInstance | undefined, dialogVisible: Ref<boolean>) => {
	if (!formEl) return;
	formEl.resetFields();
	dialogVisible.value = false;
};

const clickResetForm = (type: string) => {
	if (type === 'logisticsInfo') {
		resetForm(logisticsInfoFormRef.value, addLogisticsInfoDialogVisible);
	} else {
		resetForm(receiptInfoFormRef.value, changeAddressDialogVisible);
	}
};
const cancel = () => {
	basicInfoForm.value.reasonId = '';
	basicInfoForm.value.applyDescription = '';
	showAfter.value = false;
};

// 点击变更收货地址按钮
const handleChangeAddress = () => {
	changeAddressDialogVisible.value = true;
	receiptInfoForm.value = JSON.parse(JSON.stringify(basicInfoForm.value));
	getTree();
};

// 点击确认变更地址按钮
const confirmChangeAddress = () => {
	useMessageBox()
		.confirm(`请确认是否变更订单收货地址`, '变更收货地址')
		.then(() => {
			let params = {
				orderCode: basicInfoForm.value.orderCode,
				districtCode: receiptInfoForm.value.districtCode,
				deliveryName: receiptInfoForm.value.deliveryName,
				deliveryMobile: receiptInfoForm.value.deliveryMobile,
				deliveryAddress: receiptInfoForm.value.deliveryAddress,
			};
			updateAddress(params)
				.then((res) => {
					console.log('res', res);
					if (res.code === 0) {
						changeAddressDialogVisible.value = false;
						useMessage().success('修改收货地址成功');
						const orderCode = router.currentRoute.value.query.orderCode;
						getOrderDetailData({ orderCode });
					} else {
						useMessage().error(res.msg);
					}
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		})
		.catch(() => {});
};

// 发起售后
const applyAfterSale = async () => {
	formRef?.value?.validate(async (valid) => {
		if (!valid) return;
		const params = {
			orderCode: basicInfoForm.value.orderCode,
			reasonId: basicInfoForm.value.reasonId,
			applyDescription: basicInfoForm.value.applyDescription,
		};
		try {
			const { code, msg } = await backendApply(params);
			loading.value = false;
			if (code === 0) {
				useMessage().success('发起售后成功');
				const orderCode = router.currentRoute.value.query.orderCode;
				getOrderDetailData({ orderCode });
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	});
};

// 提交物流信息表单
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			orderSendAdd({
				orderCode: basicInfoForm.value.orderCode,
				logisticsNumber: logisticsInfoForm.value.logisticsNumber,
				platform: logisticsInfoForm.value.platform,
			})
				.then((res) => {
					if (res.code === 0) {
						useMessage().success('新增物流信息成功');
						addLogisticsInfoDialogVisible.value = false;
						const orderCode = router.currentRoute.value.query.orderCode;
						getOrderDetailData({ orderCode });
					}
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		} else {
			return false;
		}
	});
};
const getOrderDetailData = async (orderCode: any) => {
	try {
		const { code, data, msg } = await getOrderDetail(orderCode);
		loading.value = false;
		if (code === 0) {
			basicInfoForm.value = data;
			handelQueryReasonList();
		} else {
			useMessage().error(msg);
			router.push('/culture/orderManage/orderList/index');
			loading.value = false;
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		router.push('/culture/orderManage/orderList/index');
		loading.value = false;
	}
};
const handelQueryReasonList = async () => {
	try {
		const { code, data, msg } = await queryReasonList();
		loading.value = false;
		if (code === 0) {
			reasonList.value = data;
		} else {
			useMessage().error(msg);
			loading.value = false;
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 售后详情
const goToDetailPage = (row: any) => {
	router.push({
		path: '/culture/orderManage/workOrder/form',
		query: {
			afterSaleCode: row.afterSaleCode,
		},
	});
};
//添加物流信息
const addLogisticsInfo = () => {
	addLogisticsInfoDialogVisible.value = true;

	const { name } = userInfos.value.user;
	logisticsInfoForm.value.shipperName = name;
	logisticsInfoForm.value.platform = '管理平台';
	// const logisticsInfos = {
	// 	logisticsNumber: '',
	// 	platform: '管理平台',
	// 	deliveryTime: '',
	// 	config: true,
	// } as unknown as LogisticsInfoType;
	// basicInfoForm.value.logisticsInfos.push(logisticsInfos);
};
// 编辑物流单号
const editLogisticsNumber = async (row: any) => {
	if (!row.logisticsNumber) {
		return useMessage().error('请输入物流单号');
	}
	loading.value = true;
	const params = {
		id: row.id,
		logisticsNumber: row.logisticsNumber,
		platform: '',
	};
	try {
		const { code, msg } = await orderCodeUpdate(params);
		loading.value = false;
		if (code === 0) {
			useMessage().success('编辑成功');
			row.config = false;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		loading.value = false;
	}
};
onMounted(() => {
	loading.value = true;
	const orderCode = router.currentRoute.value.query.orderCode;
	getOrderDetailData({ orderCode });
});
</script>
<style lang="scss">
.custom-form {
	padding: 20px 20px 0;

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
}

section {
	margin-bottom: 28px;
}

.custom-width {
	width: 330px;
}

.product-specifications {
	margin-bottom: 36px;

	.img-box {
		width: 100%;

		.view-img {
			display: flex;
			flex-direction: column;
			align-items: center;

			.operate-img {
				width: 100%;
				position: relative;
				margin-bottom: 4px;

				&:after {
					position: absolute;
					content: '';
					top: 0;
					right: 0;
					border-radius: 50%;
					background: red;
					width: 20px;
					height: 20px;
				}
			}
		}

		.upload-box {
			width: 100%;
			height: 120px;

			.el-upload--picture-card {
				width: 100%;
				height: 100%;
			}
		}
	}
}

.add-standards-btn {
	text-align: center;
}

.footer {
	text-align: center;

	.el-button {
		width: 68px;
	}
}

// .basic-info {
// }
// .logistics-methods {
// }
</style>
