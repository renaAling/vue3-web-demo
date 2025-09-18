<template>
	<!-- 优惠券记录 -->
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="优惠券名称" prop="name">
							<el-input placeholder="请输入优惠券名称" clearable style="width: 180px" v-model="state.queryForm.name" />
						</el-form-item>
						<el-form-item label="所属业务" prop="platType" placeholder="请选择所属业务">
							<el-select v-model="state.queryForm.platType" clearable style="width: 180px">
								<el-option label="轨道甄选" :value="1">轨道甄选</el-option>
								<el-option label="地铁文创" :value="3">地铁文创</el-option>
								<el-option label="自有商城" :value="4">自有商城</el-option>
								<el-option label="积分商城" :value="5">积分商城</el-option>
								<el-option label="ip运营" :value="6">ip运营</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="领取时间" prop="searchTime">
							<el-date-picker
								v-model="searchTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								:default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
								value-format="YYYY-MM-DD"
								style="width: 270px"
							/>
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
				</el-row>
				<el-table
					:data="state.dataList"
					v-loading="state.loading"
					row-key="id"
					border
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="优惠券ID" prop="couponId" />
					<el-table-column label="优惠券名称" prop="name" />
					<el-table-column label="用户手机号" prop="phone" />
					<el-table-column label="面值" prop="money" />
					<el-table-column label="最低消费额" prop="minPrice" />
					<el-table-column label="使用有效期" prop="useTime" />
					<el-table-column label="所属业务" prop="platType">
						<template #default="{ row }">
							<span v-if="row.platType == 1">轨道甄选</span>
							<span v-if="row.platType == 3">地铁文创</span>
							<span v-if="row.platType == 4">自有商城</span>
							<span v-if="row.platType == 5">积分商城</span>
							<span v-if="row.platType == 6">ip运营</span>
						</template>
					</el-table-column>
					<el-table-column label="优惠类型" prop="category">
						<template #default="{ row }">
							<span v-if="row.category == 1">商家券</span>
							<span v-if="row.category == 2">商品券</span>
							<span v-if="row.category == 3">通用券</span>
							<span v-if="row.category == 4">品类券</span>
							<span v-if="row.category == 5">品牌券</span>
							<span v-if="row.category == 6">跨店券</span>
						</template>
					</el-table-column>
					<el-table-column label="领取方式" prop="receiveType">
						<template #default="{ row }">
							<span v-if="row.receiveType == 1">手动领取</span>
							<span v-if="row.receiveType == 2">商品赠送</span>
							<span v-if="row.receiveType == 3">平台活动发放</span>
						</template>
					</el-table-column>
					<el-table-column label="领取时间" prop="createTime" />
					<el-table-column label="是否可用" prop="status">
						<template #default="{ row }">
							<el-tag v-if="row.status == 0">未使用</el-tag>
							<el-tag v-if="row.status == 1">已使用</el-tag>
							<el-tag v-if="row.status == 2">已失效</el-tag>
						</template>
					</el-table-column>
					<!-- <el-table-column label="状态" prop="userState">
						<template #default="{ row }">
							<el-tag>{{ row.state == 1 ? '启用' : '禁用' }}</el-tag>
						</template>
					</el-table-column> -->
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { couponUserListApi } from '/@/api/culture/marketing';
// import { getBackendUsersForMember, getChannelConfigList } from '/@/api/member/backendUsers/user';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';

// 搜索变量
const queryRef = ref();
const searchTime = ref<string[]>([]);
const businessList = ref<string[]>([]); // 所属业务
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: couponUserListApi,
	queryForm: {},
	dataList: [],
});

let type = ref('list');
watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);
onMounted(() => {
	// getChannelConfig();
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};

const toWindsOpen = () => {
	window.open('https://www.baidu.com');
};

// 获取所属业务
const getBusinessList = async () => {
	// try {
	// 	const { code, data, msg } = await getChannelConfigList();
	// 	if (code === 0) {
	// 		businessList.value = data;
	// 	} else {
	// 		useMessage().error(msg);
	// 	}
	// } catch (err: any) {
	// 	useMessage().error(err.msg);
	// }
};
</script>
<style lang="scss" scoped></style>
