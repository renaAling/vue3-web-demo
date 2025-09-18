<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<div class="my-[4px] flex items-center cursor-pointer" @click="toForward">
				<el-icon><ArrowLeftBold /></el-icon><span class="ml-[10px] text-[18px]">返回</span>
			</div>
			<el-descriptions class="mx-[20px]" title="分销员信息">
				<template #extra>
					<el-button type="text" icon="edit" @click="handleEdit" />
				</template>
				<el-descriptions-item label="姓名">{{ discountUserInfo?.name || '-' }}</el-descriptions-item>
				<el-descriptions-item label="手机号">{{ discountUserInfo?.phone || '-' }}</el-descriptions-item>
				<el-descriptions-item label="分销等级">
					<el-tag size="small">{{ discountUserInfo?.levelName || '-' }}</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="推广权限">{{ discountUserInfo?.isSpread ? '是' : '否' }}</el-descriptions-item>
				<el-descriptions-item label="上级推广人">
					{{ discountUserInfo?.spreadInfo ? `${discountUserInfo.spreadInfo?.name || '-'} (${discountUserInfo.spreadInfo?.phone || '-'})` : '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="关联用户账号">{{ discountUserInfo?.phone || '-' }}</el-descriptions-item>
				<el-descriptions-item label="收款信息">{{ discountUserInfo?.paymentAccount || '-' }}</el-descriptions-item>
			</el-descriptions>
			<el-descriptions class="mx-[20px]" title="推广渠道" v-if="discountUserInfo?.isSpread">
				<el-descriptions-item label="二维码">
					<el-button type="text" @click="dialogVisible = true">查看</el-button>
				</el-descriptions-item>
				<el-descriptions-item label="分享链接">
					{{ shareLink }}
					<el-button type="text" class="ml-[10px]" @click="copyLink(shareLink)">复制</el-button>
				</el-descriptions-item>
			</el-descriptions>
			<el-tabs v-model="activeName" class="mx-[20px]" @tab-click="handleClick">
				<el-tab-pane label="历史推广" name="first">
					<el-row>
						<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
							<el-form-item label="日期选择" prop="paymentTime">
								<el-date-picker
									v-model="paymentTime"
									@change="changeTime"
									type="daterange"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="YYYY-MM-DD"
								/>
							</el-form-item>
							<el-form-item>
								<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
								<el-button icon="Refresh" @click="resetQuery">重置</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						border
						row-key="id"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column label="序号" type="index" width="60" />
						<el-table-column prop="orderNo" label="订单号" width="210">
							<template #default="scope">
								<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="payTime" label="推广时间" />
						<el-table-column prop="totalPrice" label="订单金额" />
						<el-table-column prop="brokeragePrice" label="返佣比例">
							<template #default="scope">
								<span>
									{{ scope.row.totalPrice === 0 ? '0%' : ((scope.row.brokeragePrice / scope.row.totalPrice) * 100).toFixed(2) + '%' }}
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="brokeragePrice" label="返佣金额" />
						<el-table-column prop="brokerageStatus" label="成交状态">
							<template #default="scope">
								{{ scope.row.brokerageStatus ? '已结算' : '待发放' }}
							</template>
						</el-table-column>
					</el-table>
					<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
				<el-tab-pane label="返佣明细" name="second">
					<el-row>
						<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
							<el-form-item label="日期选择" prop="paymentTime">
								<el-date-picker
									v-model="paymentTime"
									@change="changeTime"
									type="daterange"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="YYYY-MM-DD"
								/>
							</el-form-item>
							<el-form-item label="分销员姓名">
								<el-input v-model="state.queryForm.name" placeholder="请输入分销员姓名" clearable> </el-input>
							</el-form-item>
							<el-form-item label="分销等级">
								<el-select v-model="state.queryForm.distributionLevelCode" placeholder="请选择" clearable>
									<el-option v-for="item in statusList" :key="item.levelCode" :label="item.levelName" :value="item.levelCode" />
								</el-select>
							</el-form-item>
							<el-form-item label="返佣状态">
								<el-select v-model="state.queryForm.brokerageStatus" placeholder="请选择" clearable>
									<el-option label="未返佣" :value="0" />
									<el-option label="已返佣" :value="1" />
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
								<el-button icon="Refresh" @click="resetQuery">重置</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						border
						row-key="id"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column label="序号" type="index" width="60" />
						<el-table-column prop="payTime" label="时间" />
						<el-table-column prop="orderNo" label="订单编号" width="220">
							<template #default="scope">
								<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="分销员姓名" />
						<el-table-column prop="levelName" label="分销等级" />
						<el-table-column prop="totalPrice" label="订单金额" />
						<el-table-column prop="brokeragePrice" label="返佣比例">
							<template #default="scope">
								<span>
									{{ scope.row.totalPrice === 0 ? '0%' : ((scope.row.brokeragePrice / scope.row.totalPrice) * 100).toFixed(2) + '%' }}
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="brokeragePrice" label="返佣金额" />
						<el-table-column prop="brokerageStatus" label="发放状态">
							<template #default="scope">
								{{ scope.row.brokerageStatus ? '已发放' : '待发放' }}
							</template>
						</el-table-column>
					</el-table>
					<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
			</el-tabs>
		</div>
		<el-dialog v-model="dialogVisible" title="新分销员推广二维码" width="400">
			<div class="flex justify-center items-center">
				<vue-qrcode
					:value="shareLink"
					:options="{
						height: 200,
						width: 200,
					}"
				/>
			</div>
			<div class="text-center mt-[10px]">请用微信扫一扫</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="dialogVisible = false">下载</el-button>
				</div>
			</template>
		</el-dialog>
		<DiscountUserForm v-model="userDialogVisible" :pageType="pageType" :row="discountUserInfo" />
	</div>
</template>

<script setup lang="ts" name="distributor-user-detail">
import type { TabsPaneContext } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	discountUserDetail,
	pageUserHistorySpread,
	pageUserBrokerageDetail,
	distributionLevelConfigList,
	pageUserList,
} from '/@/api/member/distributionManage';
import { useMessage } from '/@/hooks/message';

const VueQrcode = defineAsyncComponent(() => import('@chenfengyuan/vue-qrcode'));
const DiscountUserForm = defineAsyncComponent(() => import('./component/discountUserForm.vue'));

const router = useRouter();
const route = useRoute();

const pageType = ref('');
const activeName = ref('first');
const dialogVisible = ref(false);
const userDialogVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		uid: route.query.uid as string,
	},
	pageList: pageUserHistorySpread,
	descs: [],
});
const paymentTime = ref([] as any);
const queryRef = ref();

const handleClick = (tab: TabsPaneContext) => {
	if (tab.props.name === 'first') {
		state.pageList = pageUserHistorySpread;
	} else {
		state.pageList = pageUserBrokerageDetail;
	}
	getDataList();
};

const handleEdit = () => {
	pageType.value = 'edit';
	userDialogVisible.value = true;
};

const handleGoDetail = (orderNo: string) => {
	router.push({
		path: '/culture/orderManage/orderList/orderDetail',
		query: {
			orderNo,
		},
	});
};

const copyLink = (text: string) => {
	navigator.clipboard.writeText(text);
	useMessage().success('复制成功');
};

const resetQuery = () => {
	queryRef.value.resetFields();
	paymentTime.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	state.queryForm.name = '';
	state.queryForm.distributionLevelCode = '';
	state.queryForm.brokerageStatus = '';
	getDataList();
};

const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

const toForward = () => {
	router.go(-1);
};

const domain = import.meta.env.VITE_ADMIN_PROXY_PATH;
const shareLink = ref('');
const discountUserInfo = ref();
const getDiscountUserDetail = async () => {
	try {
		state.loading = true;
		const res = await discountUserDetail(route.query.id as string);
		discountUserInfo.value = res.data;
		shareLink.value = `${domain}/pages_h5/pages/h5_agricMall?path=/pages/activity/distribution/share?type=6&spreadUid=${res.data.spreadUid}&platType=${res.data.platType}`;
	} catch (err) {
		state.loading = false;
	} finally {
		state.loading = false;
	}
};

const statusList = ref();
const distributionLevelConfigListApi = async () => {
	const res = await distributionLevelConfigList();
	statusList.value = res.data;
};

const userOptionsApi = async () => {
	const res = await pageUserList();
	discountUserInfo.value.spreadInfo = res.data.find((item: any) => item.uid === discountUserInfo.value.spreadUid) || null;
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

onMounted(async () => {
	await getDiscountUserDetail();
	await userOptionsApi();
	distributionLevelConfigListApi();
});
</script>

<style lang="scss" scoped></style>
