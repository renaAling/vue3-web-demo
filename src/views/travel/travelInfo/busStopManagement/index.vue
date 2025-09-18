<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="站点类型" prop="stationType">
						<el-select v-model="state.queryForm.stationType" placeholder="请选择站点类型" multiple default-first-option clearable>
							<el-option v-for="(value, key) in stationTypeList" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="站点名称" prop="stationName">
						<el-input placeholder="请输入站点名称" v-model="state.queryForm.stationName" clearable />
					</el-form-item>
					<el-form-item label="区域" prop="region">
						<el-select v-model="state.queryForm.region" multiple placeholder="请选择区域" default-first-option clearable>
							<el-option v-for="value in regionCodeList" :key="value.regionCode" :label="value.regionName" :value="value.regionCode"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属线路" prop="line">
						<el-input placeholder="请输入所属线路" v-model="state.queryForm.line" clearable />
					</el-form-item>
					<el-form-item label="是否允许覆盖" prop="allowOverride">
						<el-select v-model="state.queryForm.allowOverride" placeholder="请选择是否允许覆盖" default-first-option clearable>
							<el-option v-for="(value, key) in coverTypelist" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button @click="getSynchrodata" type="primary">数据同步</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80" fixed="left" />
				<el-table-column label="站点名称" prop="stationName" />
				<el-table-column label="站点类型" prop="stationType">
					<template #default="{ row }">
						{{ stationTypeList[row.stationType] }}
					</template>
				</el-table-column>
				<el-table-column label="区域" prop="region">
					<template #default="{ row }">
						{{ regionCodeMap[row.region] }}
					</template>
				</el-table-column>
				<el-table-column label="所属线路" prop="line" />
				<el-table-column label="坐标" prop="coordinates" />
				<el-table-column label="是否允许覆盖" prop="allowOverride">
					<template #default="{ row }">
						{{ row.allowOverride ? '是' : '否' }}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('edit', row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getPublicTransportStationsApi, postSyncPublicStationsApi } from '/@/api/travel/travelInfo';
import { ElMessageBox } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import router from '/@/router';
import { Session } from '/@/utils/storage';
import { getRegionCodeListApi } from '/@/api/travel/index';

// 字典
const coverTypelist = ref<any>({
	1: '是',
	0: '否',
});
// 区域
const regionCodeList = ref<any>({});
const stationTypeList = ref<any>({
	1: '公交站',
	2: '公租自行车站',
});
const regionCodeMap = ref<any>({});
// 定义变量内容
const queryRef = ref();

onMounted(async() => {
	if (!Session.get('regionCode')) {
		await getRegionCodeList();
	}
	regionCodeList.value = JSON.parse(Session.get('regionCode'));
	regionCodeMap.value = JSON.parse(Session.get('regionCodeMap'));
	if (Session.get('state')) {
		const data = JSON.parse(Session.get('state'));
		state.queryForm = data.queryForm;
		state.pagination = data.pagination;
		Session.remove('state');
	}
});

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getPublicTransportStationsApi,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const getRegionCodeList = async () => {
	const { data, msg, code } = await getRegionCodeListApi();
	if (code === 0) {
		const obj: any = {};
		data.map((item: any) => {
			obj[item.regionCode] = item.regionName;
		});
		regionCodeList.value = data;
		regionCodeMap.value = obj;
		Session.set('regionCode', JSON.stringify(data));
		Session.set('regionCodeMap', JSON.stringify(obj));
	} else {
		useMessage().error(msg);
	}
};

// 同步数据
const getSynchrodata = () => {
	ElMessageBox({
		title: '数据同步',
		message: h('div', { style: 'text-align: center;width:100%;margin-left: 40px;' }, [
			h('p', null, '您将同步最新数据'),
			h('p', null, '同步期间请勿重复操作，以免导致数据异常'),
		]),
		confirmButtonText: '立即同步',
		showCancelButton: false,
		dangerouslyUseHTMLString: true,
	})
		.then(async () => {
			try {
				const { code, msg } = await postSyncPublicStationsApi();
				if (code === 0) {
					useMessage().success('同步成功');
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		})
		.catch(() => {});
};

const handleCommand = (command: string, row: any) => {
	if (command === 'edit') {
		Session.set('state', JSON.stringify(state));
		router.push({
			path: '/travel/travelInfo/busStopManagement/edit',
			query: { id: row.id },
		});
	}
};
</script>
<style lang="scss" scoped></style>
