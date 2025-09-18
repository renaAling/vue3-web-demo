<template>
	<div class="layout-padding" style="width: 100%">
		<el-scrollbar class="boxSizing">
			<div>
				<div class="flex justify-start cursor-pointer back-icon mb-5" @click="toForward">
					<div class="flex icon">
						<el-icon :size="22"><ArrowLeftBold /></el-icon>
					</div>
					<div class="ml-2">返回</div>
				</div>
				<div class="py-2 bg-white rounded border-inherit border border-solid boxSizing">
					<div class="content-title">用户信息</div>
					<div class="flex flex-row">
						<div class="flex justify-start items-center" style="width: 150px">
							<div class="relative avatar">
								<el-avatar :size="84" :src="dataForm.avatar"> </el-avatar>
							</div>
						</div>
						<div class="flex-1 px-2 mt-6">
							<el-form ref="dataFormRef" :model="dataForm" label-width="86" @keydown.enter.prevent>
								<el-row :gutter="20">
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">用户昵称:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.nickName }}</span>
										</div>
									</el-col>
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">联系电话:</div>
											<span class="ml-2 text-slate-700">{{ maskedMobile(dataForm.mobile) }}</span>
										</div>
									</el-col>
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">用户ID:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.unionId }}</span>
										</div>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">用户身份:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.name ? '员工' : '普通' }}</span>
										</div>
									</el-col>
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">注册时间:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.registerTime || '-' }}</span>
										</div>
									</el-col>
								</el-row>
							</el-form>
						</div>
					</div>
				</div>
				<div class="my-2 py-2 bg-white rounded border-inherit border border-solid boxSizing">
					<el-row class="mb8 flex justify-between items-center">
						<div class="content-title">地址信息</div>
					</el-row>
					<div class="px-2">
						<el-table
							:data="dataList"
							v-loading="loading"
							row-key="id"
							border
							:cell-style="tableStyle?.cellStyle"
							:header-cell-style="tableStyle?.headerCellStyle"
						>
							<el-table-column type="index" label="序号" width="60" align="center" />
							<el-table-column label="姓名" prop="realName" />
							<el-table-column label="手机号" prop="phone" />
							<el-table-column label="省市区" prop="userName">
								<template #default="{ row }">
									<span>{{ row.province ? row.province : '' }}</span>
									<span>{{ row.city ? row.city : '' }}</span>
									<span>{{ row.district ? row.district : '' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="详细地址" prop="detail">
								<template #default="{ row }">
									<span>{{ row.street ? row.street : '' }}</span>
									<span>{{ row.detail ? row.detail : '' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="是否默认" prop="isDefault">
								<template #default="{ row }">
									<span v-if="row.isDefault" type="success">是</span>
									<span v-else>否</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
				<div class="my-2 py-2 bg-white rounded border-inherit border border-solid boxSizing">
					<el-row class="mb8 flex justify-between items-center">
						<div class="content-title">消费信息</div>
					</el-row>
					<div class="mx-2">
						<el-table
							:data="consumeList"
							v-loading="state.loading"
							row-key="id"
							border
							:cell-style="tableStyle?.cellStyle"
							:header-cell-style="tableStyle?.headerCellStyle"
						>
							<el-table-column label="消费场景" prop="consumptionScene" />
							<el-table-column label="累计消费" prop="totalConsumption" />
							<el-table-column label="下单次数" prop="orderCount" />
							<el-table-column label="完成次数" prop="completedCount" />
							<el-table-column label="售后次数" prop="afterSalesCount" />
							<el-table-column label="消费金额" prop="consumptionAmount" />
						</el-table>
						<!-- <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" /> -->
					</div>
				</div>
				<div class="bg-white rounded border-inherit border border-solid boxSizing">
					<el-row class="mb8 flex justify-between items-center">
						<div class="content-title">订单信息</div>
					</el-row>
					<el-form :model="state2.queryForm" ref="queryRef" :inline="true">
						<el-row class="px-2">
							<el-form-item label="消费场景" prop="consumeScene">
								<el-select v-model="consumeScene" style="width: 220px" placeholder="选择消费场景" clearable>
									<el-option v-for="item in consumeSceneList" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button icon="search" type="primary" @click="getConsumeDataList(uid)"> 查询 </el-button>
								<el-button icon="Refresh" @click="resetQuery">重置</el-button>
							</el-form-item>
						</el-row>
					</el-form>
					<div>
						<el-table
							:data="consumeDataList"
							v-loading="consumeSceneLoading"
							row-key="id"
							border
							max-height="300"
							:cell-style="tableStyle2?.cellStyle"
							:header-cell-style="tableStyle2?.headerCellStyle"
						>
							<el-table-column label="消费场景" prop="consumptionScene">
								<template #default="{ row }">
									<span>{{ row.consumptionScene ? row.consumptionScene : '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="订单编号" prop="orderNo">
								<template #default="{ row }">
									<span>{{ row.orderNo ? row.orderNo : '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="商品名称" prop="productName">
								<template #default="{ row }">
									<span>{{ row.productName ? row.productName : '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="商品金额" prop="productPrice">
								<template #default="{ row }">
									<span>{{ row.productPrice ? row.productPrice : '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="实付金额" prop="payPrice">
								<template #default="{ row }">
									<span>{{ row.payPrice ? row.payPrice : '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="下单时间" prop="orderTime">
								<template #default="{ row }">
									<span>{{ row.orderTime ? row.orderTime : '-' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="订单状态" prop="orderStatus">
								<template #default="{ row }">
									<el-tag link v-if="row.orderStatus">{{ row.orderStatus }}</el-tag>
									<span v-else>-</span>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
							background
							layout="total, sizes, prev, pager, next, jumper"
							:page-sizes="[10, 20, 50]"
							:total="total"
							:page-size="pageSize"
							:current-page="currentPage"
							@size-change="handleSizeChange"
							@current-change="handlePageChange"
						></el-pagination>
					</div>
				</div>
			</div>
		</el-scrollbar>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { getConsumeInfo, getOrderProductInfo, getUserAddressListApi } from '/@/api/member/platformCustomer/customer';

import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';

const loading = ref(false);
const emit = defineEmits(['changeType']);
const uid = ref('');
const queryRef = ref<any>();
const consumeList = ref<any[]>([]); //消费数据下拉列表
const consumeDataList = ref<any[]>([]); //消费数据下拉列表
const dataList = ref<any[]>([]); //地址列表
const consumeSceneLoading = ref(false);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const consumeScene = ref<any>('');
// 页面对应元数据
const dataForm = reactive({
	avatar: '',
	mobile: '',
	nickName: '',
	unionId: '',
	isStaff: '',
	lastLoginTime: '',
	growthValue: '',
	levelName: '',
	score: '',
	card: '',
});
const consumeSceneList = ref<any[]>([
	{
		value: 1,
		label: '轨道甄选',
	},
	{
		value: 2,
		label: '地铁文创',
	},
	{
		value: 3,
		label: '网订店取',
	},
	{
		value: 4,
		label: '到店支付',
	},
]); //消费场景
const state: BasicTableProps = reactive<BasicTableProps>({
	// pageList: getUserAddressListApi,
	queryForm: {},
	dataList: [],
	isPage: false,
});
const state1: BasicTableProps = reactive<BasicTableProps>({
	// pageList: accountDetailList,
	queryForm: {},
	dataList: [],
});
const state2: BasicTableProps = reactive<BasicTableProps>({
	// pageList: getOrderProductInfo,
	queryForm: {},
	dataList: [],
});

//  table hook
const { tableStyle } = useTable(state);
const { getDataList: getDataList1 } = useTable(state1);
const { tableStyle: tableStyle2 } = useTable(state2);

const show = (row: any) => {
	console.log('row', row);
	state.queryForm.id = row;
	state.queryForm.unionId = row.unionId;
	Object.assign(dataForm, row);
	uid.value = row.unionId;
	getConsumeInfoList(row.unionId);
	getConsumeDataList(row.unionId);
	getDataList1();
	getUserAddressList();
};

const maskedMobile = (mobile: any) => {
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};

// 消费信息
const getConsumeInfoList = async (uid: string) => {
	try {
		const { code, data, msg } = await getConsumeInfo(uid);
		if (code === 0) {
			consumeList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// dataList
const getUserAddressList = async () => {
	loading.value = true;
	try {
		const { code, data, msg } = await getUserAddressListApi(uid.value);
		if (code === 0) {
			dataList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 订单信息
const getConsumeDataList = async (uid: string) => {
	consumeSceneLoading.value = true;
	const params = {
		current: currentPage.value,
		size: pageSize.value,
		unionId: uid,
		consumeScene: consumeScene.value,
	};
	try {
		const { code, data, msg } = await getOrderProductInfo(params);
		if (code === 0) {
			consumeDataList.value = data.records;
			total.value = data.total;
			consumeSceneLoading.value = false;
		} else {
			useMessage().error(msg);
			consumeSceneLoading.value = false;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		consumeSceneLoading.value = false;
	}
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getConsumeDataList(uid.value);
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getConsumeDataList(uid.value);
};
// 清空搜索条件
const resetQuery = () => {
	console.log('state', state.queryForm);
	currentPage.value = 1;
	pageSize.value = 10;
	consumeScene.value = '';
	queryRef.value.resetFields();
	getConsumeDataList(uid.value);
	// getList();
};
const toForward = () => {
	emit('changeType');
};
defineExpose({
	show,
});
</script>
<style lang="scss" scoped>
.layout-padding {
	height: 100%;
	.boxSizing {
		box-sizing: border-box;
	}
}
.content-title {
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	padding-left: 16px;
	position: relative;
	margin-top: 9px;
	margin-bottom: 9px;
	&::before {
		content: '';
		width: 8px;
		height: 20px;
		border-radius: 2px;
		background-color: #165dff;
		position: absolute;
		left: 0;
	}
}
.back-icon {
	font-size: 22px;
	.icon {
		align-items: flex-end;
	}
	.el-icon {
		height: 100%;
	}
}
.avatar {
	margin-left: 25px;
	height: 84px;
	width: 84px;
}
</style>
