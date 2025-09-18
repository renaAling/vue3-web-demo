<template>
	<div class="layout-padding">
		<div class="activityAudit">
			<el-card class="box-card activityAudit-top">
				<el-row shadow="hover" class="ml10">
					<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
						<el-form-item label="活动状态" prop="schemeStatus">
							<el-radio-group v-model="schemeStatus">
								<el-radio-button v-for="(item, index) in auditPageNum" :key="index" :label="item.label">{{ item.value }}</el-radio-button>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="活动名称" prop="schemeName">
							<el-input placeholder="请输入活动名称" maxlength="50" style="width: 220px" v-model="state.queryForm.schemeName" clearable />
						</el-form-item>
						<el-form-item label="活动时间" prop="searchTime">
							<el-date-picker
								v-model="searchTime"
								@change="changeSearchTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="YYYY-MM-DD"
								style="width: 380px"
							/>
						</el-form-item>
						<el-form-item>
							<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-form>
				</el-row>
			</el-card>
			<div class="activityAudit-body">
				<el-scrollbar>
					<el-card class="card-list" v-for="item in state.dataList" :key="item.id">
						<div class="card-left">
							<div class="card-title">
								<p>{{ item.schemeName }}</p>
								<el-tag class="ml-2" type="success" v-if="item.status == 3">已通过</el-tag>
								<el-tag class="ml-2" type="warning" v-if="item.status == 2">待审核</el-tag>
								<el-tag class="ml-2" type="danger" v-if="item.status == 4">已驳回</el-tag>
							</div>
							<div class="card-text">活动时间：{{ item.startTime + ' 至 ' + item.endTime }}</div>
							<div class="card-text">提交时间：{{ item.submitTime }}</div>
							<div class="card-text">提交人：{{ item.submitBy }}</div>
							<div class="card-text">{{ item.schemeDescription }}</div>
							<div class="card-link flex flex-warp" v-if="item.activitySchemeAttachmentList.length > 0">
								<div class="link-item" v-for="(ite, i) in item.activitySchemeAttachmentList" :key="i">
									<el-icon><Document /></el-icon>
									<el-link type="primary" @click="downExcelTemp(ite)">{{ ite.attachmentName }}</el-link>
								</div>
							</div>
							<div class="card-text" v-if="item.status === 3 || item.status === 4">
								<span class="mr-2">审核人：{{ item.auditBy }}</span>
								<span>审核时间：{{ item.auditTime }}</span>
							</div>
							<div class="card-text" v-if="item.status === 3 || item.status === 4">审核说明：{{ item.auditDescription }}</div>
						</div>
						<div class="card-right">
							<el-button type="primary" v-if="item.status === 2" @click="handleAudit(item, 'audit')">去审核</el-button>
							<el-button type="info" v-if="item.status === 3 || item.status === 4" @click="handleAudit(item, 'see')">查看详情</el-button>
						</div>
					</el-card>
				</el-scrollbar>
			</div>
			<div class="activityAudit-footer">
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" schemeName="cultureProductsForm">
import { reactive, ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getAuditPage, getAuditPageNum } from '/@/api/operationConfig/activityAudit';
import router from '/@/router';
const searchTime = ref([]);
const queryRef = ref();
const schemeStatus = ref('0');
const auditPageNum = ref<any[]>([]);
watch(
	() => searchTime.value,
	(val) => {
		if (val[0] && val[1]) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);
watch(
	() => schemeStatus.value,
	(val) => {
		console.log('val', val);
		if (val) {
			if (val === '0') state.queryForm.status = '';
			else state.queryForm.status = val;
			getDataList();
			// getAuditPageList();
		} else {
			state.queryForm.status = '';
		}
	}
);
onMounted(() => {
	getAuditPageList();
});
const getAuditPageList = async () => {
	auditPageNum.value = [];
	const { code, data } = await getAuditPageNum();

	if (code === 0) {
		statusList.value.forEach((item: any, index: number) => {
			const obj = {
				value: item.value,
				label: item.label,
			};
			if (index === 0) obj.value = item.value + '(' + data.allNum + ')';
			else obj.value = item.value + '(' + data.auditPageNumInfoList[index - 1].num + ')';
			auditPageNum.value.push(obj);
		});
	}
};
const changeSearchTime = (val: any) => {
	if (!val) {
		state.queryForm.startTime = '';
		state.queryForm.endTime = '';
	}
	getDataList();
	// getAuditPageList();
};
const handleAudit = (row: any, type: string) => {
	console.log('row', row, type);
	router.push({
		path: '/operationConfig/activityProgramming/activityAudit/audit',
		query: {
			id: row.id,
			type: type,
		},
	});
};
const statusList = ref([
	{
		value: '全部',
		label: '0',
	},
	{
		value: '审核中',
		label: '2',
	},
	{
		value: '已通过',
		label: '3',
	},
	{
		value: '已驳回',
		label: '4',
	},
]);
// const isDisabled = ref(false);

// onMounted(() => {});
const downExcelTemp = (ite: any) => {
	console.log('ite', ite);

	// 使用 fetch 获取文件并解析响应头
	fetch(ite.attachmentDownloadUrl, {
		method: 'GET',
	})
		.then((response) => {
			console.log('response', response);
			if (!response.ok) {
				throw new Error('下载失败');
			}
			let fileName = ''; // 默认文件名
			fileName = ite.attachmentName;
			return response.blob().then((blob) => ({ blob, fileName }));
		})
		.then(({ blob, fileName }) => {
			// 创建临时链接
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = fileName; // 设置文件名
			document.body.appendChild(link);
			link.click();

			// 清理
			window.setTimeout(() => {
				document.body.removeChild(link);
				URL.revokeObjectURL(link.href); // 释放 blob URL
			}, 0);
		})
		.catch((error) => {
			console.error('文件下载失败:', error);
		});
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getAuditPage,
	queryForm: {
		status: '',
	},
	dataList: [],
	loading: false,
});
// 清空搜索条件;
const resetQuery = () => {
	// getAuditPageList();
	schemeStatus.value = '0';
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.status = '';
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle } = useTable(state);
</script>
<style lang="scss" scoped>
.layout-padding {
	overflow: auto;
	.activityAudit {
		display: flex;
		flex-direction: column;
		height: 100%;
		.activityAudit-body {
			flex: 1;
			overflow: hidden;
		}
		.activityAudit-footer {
			padding-bottom: 15px;
		}
	}
	.card-list {
		width: 100%;
		margin-bottom: 16px;
		box-sizing: border-box;
		:deep(.el-card__body) {
			display: flex;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
		}
		.card-left {
			flex: 1;
		}
		.card-right {
			width: 200px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.card-title {
			display: flex;
			line-height: 32px;
			p {
				font-weight: 700;
				font-size: 16px;
			}
		}
		.card-text {
			font-size: 14px;
			color: #666;
			line-height: 28px;
		}
		.link-item {
			margin-right: 15px;
			.el-icon {
				vertical-align: middle;
				margin-right: 3px;
			}
		}
	}
	.el-card {
		margin-bottom: 16px;
	}
}
</style>
