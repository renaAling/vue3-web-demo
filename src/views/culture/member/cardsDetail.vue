<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-descriptions class="mt-[20px]" title="卡密信息">
				<el-descriptions-item label="批次编号">{{ dataDetail?.code || '-' }}</el-descriptions-item>
				<el-descriptions-item label="批次名称">{{ dataDetail?.name || '-' }}</el-descriptions-item>
				<el-descriptions-item label="关联会员类型">{{ dataDetail?.cardName || '-' }}</el-descriptions-item>
				<el-descriptions-item label="卡密数量">{{ dataDetail?.num || '-' }}</el-descriptions-item>
				<el-descriptions-item label="已使用">{{ dataDetail?.useNum || '-' }}</el-descriptions-item>
				<el-descriptions-item label="有效期">
					{{
						dataDetail?.isLasting
							? '永久'
							: `${dayjs(dataDetail?.startTime).format('YYYY-MM-DD')} - ${dayjs(dataDetail?.endTime).format('YYYY-MM-DD')}`
					}}
				</el-descriptions-item>
				<el-descriptions-item label="销售渠道">
					{{ saleWayMap[dataDetail?.saleWay] || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="使用限制">
					{{ useRuleMap[dataDetail?.useRule] || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="备注">
					{{ dataDetail?.remark || '-' }}
				</el-descriptions-item>
				<el-descriptions-item label="状态">
					{{ dataDetail?.status ? '开启' : '关闭' }}
				</el-descriptions-item>
				<el-descriptions-item label="注册时间">
					{{ dataDetail?.createTime || '-' }}
				</el-descriptions-item>
			</el-descriptions>
			<div class="flex justify-between items-center my-[10px]">
				<span class="text-[16px] font-bold text-[#303133]">卡密详情</span>
				<el-button type="primary" @click="exportExcel">导出</el-button>
			</div>
			<el-table
				:data="dataDetail?.paidMemberCardSecretList || []"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" align="center" />
				<el-table-column label="卡号" prop="cardNum" show-overflow-tooltip />
				<el-table-column label="卡密" prop="secretNum" />
				<el-table-column label="关联用户" prop="uid" />
				<el-table-column label="使用状态" prop="status">
					<template #default="{ row }">
						<el-tag v-if="row.status === 1">未使用</el-tag>
						<el-tag v-if="row.status === 2">已使用</el-tag>
						<el-tag v-if="row.status === 3">作废</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="使用时间" prop="useTime" />
			</el-table>
		</div>
	</div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { paidMemberCdkeyDetailApi } from '/@/api/culture/member';

const saleWayMap: Record<number, string> = {
	1: '线上购买',
	2: '线下赠送',
};
const useRuleMap: Record<number, string> = {
	1: '限制每人使用一次',
	2: '限制仅新用户可用',
	3: '不限',
};

const router = useRouter();
const route = useRoute();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});

const dataDetail = ref();
const getDataDetail = async () => {
	const res = await paidMemberCdkeyDetailApi(route.query.id);
	dataDetail.value = res.data;
};

const exportExcel = () => {
	downBlobFile('/tracomps-admin/api/admin/paidMemberCdkey/export', { cdKeyId: route.query.id }, '卡密列表.xlsx');
};

onMounted(() => {
	getDataDetail();
});

const { tableStyle, downBlobFile } = useTable(state);
</script>
