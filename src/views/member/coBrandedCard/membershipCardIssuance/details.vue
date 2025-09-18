<template>
	<div class="layout-padding" style="width: 100%">
		<div class="my-2 flex justify-start cursor-pointer back-icon" @click="toForward">
			<div class="flex icon">
				<el-icon :size="22"><ArrowLeftBold /></el-icon>
			</div>
			<div class="ml-2">返回</div>
		</div>
		<!-- <div class="my-5 flex align-center justify-start cursor-pointer" @click="toForward">
					<el-icon :size="22"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
				</div> -->
		<el-scrollbar>
			<div class="py-2 bg-white rounded border-inherit border border-solid boxSizing">
				<div class="content-title">详细信息</div>
				<div class="flex flex-row">
					<div class="flex justify-start items-center" style="width: 150px">
						<div class="relative avatar">
							<el-avatar :size="84" :src="dataForm.cover"> </el-avatar>
						</div>
					</div>
					<div class="flex-1 px-2">
						<el-form ref="dataFormRef" :model="dataForm" label-width="120">
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">会员卡名称:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.name }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">发行方:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.publisher }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">发行数量:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.publishNum }}</span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">号段前缀:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.cardPre }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">起始卡号:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.firstCardId }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">关联申请单:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.applyCode }}</span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">权益说明:</div>
										<span class="ml-2 text-slate-700" v-html="dataForm.rightDescription"></span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">发行时间:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.publishTime }}</span>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<el-icon color="#409efc" class="cursor-pointer absolute el_edit" @click="edit(dataForm)">
						<Edit />
					</el-icon>
				</div>
			</div>
			<div class="py-2 bg-white rounded border-inherit border border-solid boxSizing">
				<el-row class="mb8 flex justify-between items-center content-title">
					<div>申领记录</div>
					<el-button type="primary" class="mr-2" icon="download" @click="handleExport" :disabled="dataList.length == 0">导出</el-button>
				</el-row>
				<div class="mx-2">
					<el-form :inline="true" :model="queryForm" @keyup.enter="getRecords" ref="queryRef">
						<el-form-item label="手机号" prop="mobile">
							<el-input v-model="queryForm.mobile" placeholder="请输入手机号" />
						</el-form-item>
						<el-form-item label="会员卡号" prop="cardId">
							<el-input v-model="queryForm.cardId" placeholder="请输入会员卡号" />
						</el-form-item>
						<el-form-item label="状态" prop="status">
							<el-select v-model="queryForm.status" clearable style="width: 180px">
								<el-option v-for="(item, key) in eventTypeMap" :key="key" :label="item" :value="key"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button @click="getRecords" icon="search" type="primary">查询</el-button>
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
						<el-table-column label="用户ID" prop="unionId" />
						<el-table-column label="用户名称" prop="userName" />
						<el-table-column label="手机号" prop="mobile" />
						<el-table-column label="会员卡号" prop="cardId" />
						<el-table-column label="卡密" prop="cardSecret" />
						<el-table-column label="申领时间" prop="claimTime" />
						<el-table-column label="状态" prop="status">
							<template #default="{ row }">
								<el-tag>{{ eventTypeMap[row.status as keyof typeof eventTypeMap] }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="操作" prop="action">
							<template #default="{ row }">
								<el-button type="primary" @click="handleCancel(row)" v-if="row.status != '4'">作废</el-button>
								<span v-else>-</span>
							</template>
						</el-table-column>
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
		</el-scrollbar>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { cardApplyRecords, cardDetail, cardUserUpdate } from '/@/api/member/cards';
// import publishForm from './publishForm.vue';
import { downBlobFile } from '/@/utils/other';
import { ElMessage } from 'element-plus';
const queryForm = ref<any>({
	mobile: '',
	cardId: '',
	status: '',
});
const publishFormRef = ref();

// 变动明细
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const queryRef = ref();
const eventTypeMap = ref<{ [key: string]: string }>({
	1: '制卡',
	2: '导出',
	3: '激活',
	4: '作废',
});
interface dataFormType {
	name: string;
	publisher: string;
	publishNum: string;
	cardPre: string;
	firstCardId: string;
	applyCode: string;
	rightDescription: string;
	publishTime: string;
	id: string;
	cover: string;
	code: string;
	unionId: string;
}

// 页面对应元数据
const dataForm = ref<dataFormType>({
	name: '',
	publisher: '',
	publishNum: '',
	cardPre: '',
	firstCardId: '',
	applyCode: '',
	rightDescription: '',
	publishTime: '',
	id: '',
	cover: '',
	code: '',
	unionId: '',
});
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
const { tableStyle } = useTable(state);
const show = (id: string) => {
	getDetailData(id);
};
const edit = (row: any) => {
	emit('topublishForm', dataForm.value.id);
	// publishFormRef.value.openDialog(row);
};
const getRecords = async () => {
	const params = {
		...queryForm.value,
		cardCode: dataForm.value.code,
		pageNum: currentPage.value,
		pageSize: pageSize.value,
	};
	const res = await cardApplyRecords(params);
	dataList.value = res.data.records;
	total.value = res.data.total;
};
const showDetail = ref(false);
const handelEdit = () => {
	showDetail.value = true;
	publishFormRef.value.show(dataForm.value.id);
};
const handleExport = () => {
	const params = {
		...queryForm.value,
		cardCode: dataForm.value.code,
	};
	downBlobFile('/uac/card/user/export', params, '会员卡申领记录表.xlsx');
};
const handleCancel = async (row: any) => {
	const res = await cardUserUpdate({
		id: row.id,
		status: 4,
	});
	if (res.code === 0) {
		ElMessage.success('作废成功');
		getRecords();
	}
};
const getDetailData = async (id: string) => {
	const res = await cardDetail({ id });
	dataForm.value = res.data;
	console.log(res);
	getRecords();
};

const emit = defineEmits(['changeType', 'topublishForm']);
const toForward = () => {
	queryRef.value.resetFields();
	emit('changeType', dataForm.value.unionId);
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getRecords();
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getRecords();
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getRecords();
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
		position: relative;
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
.edit {
	position: absolute;
	right: 20px;
	top: 20px;
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
.text-right {
	width: 120px;
}
</style>
