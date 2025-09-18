<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-icon :size="24"  @click="router.go(-1)" class="back-icon" v-if="route.query.type !== 'header'">
				<Back />
			</el-icon>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80" fixed="left" />
				<el-table-column label="任务ID" prop="checkCode"> </el-table-column>
				<el-table-column label="来源" prop="source">
					<template #default="{ row }">
						<span>{{ sourceTypelist[row.source] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="文件类型" prop="type">
					<template #default="{ row }">
						<span>{{ fileeTypelist[row.type] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="文件名称" prop="fileName" />
				<el-table-column label="文件地址" prop="fileUrl" show-overflow-tooltip />
				<el-table-column label="任务状态" prop="status">
					<template #default="{ row }">
						<span>{{ stateTypelist[row.status] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="创建账号" prop="createBy" />
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="操作" width="140">
					<template #default="{ row }">
						<el-button type="primary" link icon="download" @click="handleDownload(row)">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="download-center" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fileDownloadlist } from '/@/api/admin/user';
import { useUserInfo } from '/@/stores/userInfo';

const router = useRouter();
const route = useRoute();
// 字典
const stateTypelist = ref<MapList>({
	1: '导出中',
	2: '完成',
	3: '失败',
});
const sourceTypelist = ref<MapList>({
	1: '地铁好店',
	2: '地铁文创',
	3: '多渠道支付',
	4: '地铁广告',
	5: '自有商城',
	6: '运营管理',
	7: '积分福利',
	8: '会员系统',
	9: '平台入驻',
});
const fileeTypelist = ref<MapList>({
	1: '订单明细',
	2: '售后明细',
	3: '工单明细',
	4: '奖券领取明细',
	5: '中奖明细',
	6: '参与明细',
	7: '积分信息',
	8: '优惠券信息',
	9: '场所信息',
});
interface MapList {
	[key: number | string]: string | undefined;
}

const { user } = useUserInfo().userInfos;
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: fileDownloadlist,
	queryForm: {
		userId: user.userId,
		tenantId: baseTenantId.value,
	},
	pagination: {},
	dataList: [],
	descs: ['create_time'],
});

// const timer = ref<number | null>(null);
// timer.value = setInterval(() => {
// 	getDataList();
// }, 5000);

//  table hook
const {  currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// 下载
const handleDownload = (row: any) => {
	if (row.fileUrl) {
		const link = document.createElement('a');
		link.href = row.fileUrl;
		document.body.appendChild(link);
		link.click();
		window.setTimeout(() => {
			document.body.removeChild(link);
		}, 0);
	}
};
// 组件销毁时，清除定时器
onUnmounted(() => {
	// if (timer.value !== null) {
	// 	clearInterval(timer.value);
	// }
});
</script>
<style lang="scss" scoped>
.text-c-1 {
	color: #67c23a;
}

.text-c-2 {
	color: #f56c6c;
}
.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
.back-icon {
	border: 1px solid #433e3ea3;
	padding: 1px;
	cursor: pointer;
	margin-bottom: 5px;
	color: #433e3ea3;
}
</style>
