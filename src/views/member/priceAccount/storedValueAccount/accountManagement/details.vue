<template>
	<div class="layout-padding" style="width: 100%">
		<el-scrollbar>
			<div class="">
				<div class="my-5 flex align-center justify-start cursor-pointer" @click="toForward">
					<el-icon :size="22" class="mt-1"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
				</div>

				<div class="py-2 bg-white rounded border-inherit border border-solid boxSizing">
					<div class="content-title">用户信息</div>
					<div class="flex flex-row">
						<div class="flex justify-start items-center" style="width: 150px">
							<div class="relative avatar">
								<el-avatar :size="84" :src="dataForm.avatar"> </el-avatar>
							</div>
						</div>
						<div class="flex-1 px-2">
							<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="86" @keydown.enter.prevent>
								<el-row :gutter="20">
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">用户昵称:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.userName }}</span>
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
											<div class="text-right" style="width: 72px">账户余额:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.amountCurrent ? dataForm.amountCurrent : '-' }}</span>
										</div>
									</el-col>
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">注册时间:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.registerTime ? dataForm.registerTime : '-' }}</span>
										</div>
									</el-col>
									<!-- <el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">密码:</div>
											<span class="ml-2 text-slate-700">xxxxxx</span>
											<span class="ml-2 cursor-pointer text-[#4785ea]" @click="visible = true">修改密码</span>
										</div>
									</el-col> -->
								</el-row>
							</el-form>
						</div>
						<!-- <div>
							<el-icon color="#409efc" class="cursor-pointer absolute el_edit" @click="edit(dataForm)">
								<Edit />
							</el-icon>
						</div> -->
					</div>
				</div>
				<div class="mr-5 py-2 bg-white rounded border-inherit border border-solid boxSizing">
					<el-row class="mb8 flex justify-between items-center content-title">
						<div>变动明细</div>
					</el-row>
					<div class="mx-2">
						<el-form :inline="true" :model="queryForm" @keyup.enter="getDetailsChanges" ref="queryRef">
							<el-form-item label="选择时间" prop="userId">
								<el-date-picker
									v-model="searchTime"
									type="daterange"
									range-separator="-"
									start-placeholder="开始时间"
									end-placeholder="结束时间"
									value-format="YYYY-MM-DD"
									style="width: 270px"
									:disabled-date="disabledDate"
								/>
							</el-form-item>
							<el-form-item label="流水号" prop="transactionId">
								<el-input v-model="queryForm.transactionId" placeholder="请输入流水号" />
							</el-form-item>
							<el-form-item label="类型" prop="transactionType">
								<el-select v-model="queryForm.transactionType" clearable style="width: 180px">
									<el-option v-for="(item, key) in eventTypeList" :key="key" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="渠道" prop="channel">
								<el-select v-model="queryForm.channel" clearable style="width: 180px">
									<el-option label="轨道甄选" :value="1">轨道甄选</el-option>
									<el-option label="地铁文创" :value="2">地铁文创</el-option>
									<el-option label="网订店取" :value="3">网订店取</el-option>
									<el-option label="到店支付" :value="4">到店支付</el-option>
									<el-option label="后台" :value="5">后台</el-option>
									<el-option label="用户端" :value="6">用户端</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button @click="getDetailsChanges" icon="search" type="primary">查询</el-button>
								<el-button @click="resetQuery" icon="Refresh">重置</el-button>
							</el-form-item>
						</el-form>
					</div>
					<div class="mx-2">
						<el-table
							:data="dataList"
							v-loading="loading"
							row-key="id"
							border
							:cell-style="tableStyle?.cellStyle"
							:header-cell-style="tableStyle?.headerCellStyle"
						>
							<el-table-column type="index" label="序号" width="60" align="center" />
							<el-table-column label="流水号" prop="transactionId" />
							<el-table-column label="变动金额" prop="amountChange" />
							<el-table-column label="变动前金额" prop="amountBefore" />
							<el-table-column label="变动后金额" prop="amountCurrent" />
							<el-table-column label="类型" prop="transactionType">
								<template #default="scope">
									<span v-if="scope.row.transactionType == 1">支出</span>
									<span v-if="scope.row.transactionType == 2">退款</span>
									<span v-if="scope.row.transactionType == 3">充值</span>
								</template>
							</el-table-column>
							<el-table-column label="使用渠道" prop="channel">
								<template #default="{ row }">
									<span v-if="row.channel == 1">轨道甄选</span>
									<sapn v-if="row.channel == 2">地铁文创</sapn>
									<span v-if="row.channel == 3">网订店取</span>
									<span v-if="row.channel == 4">到店支付</span>
									<span v-if="row.channel == 5">后台</span>
									<span v-if="row.channel == 6">用户端</span>
								</template>
							</el-table-column>
							<el-table-column label="事件" prop="event" />
							<el-table-column label="使用日期" prop="usageDate" />
							<el-table-column label="备注" prop="remark" />
						</el-table>
						<el-pagination
							background
							layout="total, sizes, prev, pager, next, jumper"
							:page-sizes="[10, 20, 50, 100, 200]"
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
import { getMemberUserStoredLogGet, getMemberUserStoredLogPage } from '/@/api/member/priceAccount/storedValueAccount';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { channelList } from '/@/api/points/manage';

const queryForm = ref<any>({
	startTime: '',
	endTime: '',
	serialNumber: '',
	eventType: '', // 类型
	channel: '', // 渠道
});
// 变动明细
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const queryRef = ref();
const searchTime = ref([]);
const channelListData = ref([]);
const eventTypeList = ref([
	{ value: 1, label: '支出' },
	{ value: 2, label: '退款' },
	{ value: 3, label: '充值' },
]);
const unionId = ref('');

// 定义校验规则
const dataRules = ref({
	password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
});
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
const state: BasicTableProps = reactive<BasicTableProps>({
	// pageList: accountDetailList,
	queryForm: {},
	dataList: [],
});
//  table hook
const { tableStyle } = useTable(state);

watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			queryForm.value.startTime = val[0] + ' 00:00:00';
			queryForm.value.endTime = val[1] + ' 23:59:59';
		} else {
			queryForm.value.startTime = '';
			queryForm.value.endTime = '';
		}
	}
);
const show = (row: any) => {
	getChannelList();
	// state1.queryForm.unionId = id;
	unionId.value = '';
	if (row) {
		unionId.value = row.unionId; //这里是id
		getDetailsChanges(); //变动明细
		Object.assign(dataForm, row);

		// getUserInfo(row.id);
	}
};

const getUserInfo = async (id: string) => {
	try {
		const { code, data, msg } = await getMemberUserStoredLogGet(id);
		if (code === 0) {
			Object.assign(dataForm, data);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 变动明细
const getDetailsChanges = async () => {
	loading.value = true;
	const params = {
		...queryForm.value,
		unionId: unionId.value,
	};
	console.log('params', params);
	try {
		const { code, data, msg } = await getMemberUserStoredLogPage(params);
		if (code === 0) {
			dataList.value = data.records;
			total.value = data.total;
			loading.value = false;
			// Object.assign(dataForm, data);
		} else {
			useMessage().error(msg);
			loading.value = false;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		loading.value = false;
	}
};

const maskedMobile = (mobile: any) => {
	console.log('mobile', mobile);
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
const emit = defineEmits(['changeType']);
const toForward = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	queryForm.value.startTime = '';
	queryForm.value.endTime = '';
	emit('changeType');
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	queryForm.value.startTime = '';
	queryForm.value.endTime = '';
	getDetailsChanges();
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getDetailsChanges();
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getDetailsChanges();
};
// 获取渠道下拉列表
const getChannelList = async () => {
	// try {
	// 	const { code, data } = await channelList();
	// 	if (code === 0) {
	// 		channelListData.value = data;
	// 	}
	// } catch (err: any) {
	// 	console.log(err);
	// }
};
const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
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
		margin-bottom: 10px;
	}
}
.back-icon {
	font-size: 20px;
	.el-icon {
		height: 100%;
	}
}

.avatar {
	margin-left: 25px;
	height: 84px;
	width: 84px;
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
.el_edit {
	margin-right: 10px;
}
</style>
