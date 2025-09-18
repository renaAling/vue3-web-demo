<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- 应用信息列表 -->
			<div class="app-list">
				<div
					v-for="(item, index) in appList"
					:key="index"
					@click="handleChangeAppName(item, index)"
					class="app-item"
					:class="selectedIndex === index ? 'active' : ''"
				>
					{{ item.appName }}
				</div>
			</div>
			<!-- 对应应用下的所有接口资源列表 -->
			<el-table
				border
				:data="dataList"
				style="width: 100%"
				:cell-style="{ textAlign: 'center' }"
				:header-cell-style="{
					textAlign: 'center',
					background: 'var(--el-table-row-hover-bg-color)',
					color: 'var(--el-text-color-primary)',
				}"
				@row-click="handleRowClick"
			>
				<el-table-column label="接口" prop="interfaceName" show-overflow-tooltip />
				<el-table-column label="路径" prop="uri" show-overflow-tooltip />
				<el-table-column label="请求方式" prop="requestMethod" width="140" show-overflow-tooltip />
				<el-table-column label="请求次数" prop="requestCounts" show-overflow-tooltip width="140" />
				<el-table-column label="吞吐量" prop="requestTps" show-overflow-tooltip width="140" />
				<el-table-column label="平均耗时" prop="consumedTime" show-overflow-tooltip width="140" />
			</el-table>
			<!-- 对应接口的ECharts折线图 -->
			<div class="charts" v-if="isShowCharts">
				<tps-line-chart class="line-chart" :appId="appId" :interfaceId="interfaceId" />
				<ms-line-chart class="line-chart" :appId="appId" :interfaceId="interfaceId" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useUserInfo } from '/@/stores/userInfo';
import { ElMessageBox } from 'element-plus';
import { getDeveloperApplicationList } from '/@/api/openPlatform/application';
import { getDeveloperAppMonitorInfoList } from '/@/api/openPlatform/monitor';
import { ElNotification } from 'element-plus';
const tpsLineChart = defineAsyncComponent(() => import('./tps-line-chart.vue'));
const msLineChart = defineAsyncComponent(() => import('./ms-line-chart.vue'));

// 定义 appList 的类型
interface AppItem {
	appName: string;
	appId: string;
}

const router = useRouter();
const route = useRoute();
const developerUserId = useUserInfo().userInfos.user;
console.log('developerUserId', developerUserId);

const selectedIndex = ref(0);
const appList = ref<AppItem[]>([]);
const isShowCharts = ref(false);
const dataList = ref([]);
const appId = ref('');
const interfaceId = ref('');

// 切换应用名称时触发查询操作
const handleChangeAppName = (val: any, index: number) => {
	selectedIndex.value = index;
	getCurrentAppInterfaceList(val.appId);
};

const handleRowClick = (row: any) => {
	isShowCharts.value = true;
	appId.value = row.appId;
	interfaceId.value = row.interfaceId;
};

// 获取应用列表
const getAppInfoList = () => {
	const params = {
		current: 1,
		size: 99,
		userId: route.query.userId,
	};
	getDeveloperApplicationList(params).then((res) => {
		appList.value = res.data.records.map((item: any) => {
			return {
				appName: item.appName,
				appId: item.appId,
			};
		});
		selectedIndex.value = 0;
		getCurrentAppInterfaceList(appList.value[0].appId);
	});
};

// 根据选择的应用，查询对应应用下的接口资源列表
const getCurrentAppInterfaceList = (appId: string) => {
	const params = {
		current: 1,
		size: 999,
		appId,
	};
	getDeveloperAppMonitorInfoList(params).then((res) => {
		dataList.value = res.data.records;
	});
};

onMounted(() => {
	getAppInfoList();
});
</script>
<style lang="scss" scoped>
.layout-padding-view {
	display: flex;
	flex-direction: row;
	overflow-y: scroll;
	.app-list {
		display: flex;
		flex-direction: column;
		margin-right: 10px;
		.app-item {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			width: 174px;
			min-height: 48px;
			padding: 8px;
			background-color: #fff;
			border: 1px solid #f2f2f2;
			font-size: 16px;
			border-radius: 10px;
			cursor: pointer;
			font-weight: bold;
			word-break: break-word;
			white-space: normal;
			margin-bottom: 4px;
		}
		.active {
			background-color: #5683e3;
			color: #fff;
		}
	}
	.charts {
		.line-chart {
			margin-bottom: 20px;
		}
	}
}
</style>
