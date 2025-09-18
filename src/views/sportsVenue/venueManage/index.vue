<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="场馆名称">
						<el-input placeholder="请输入场馆名称" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="场馆编号">
						<el-input placeholder="请输入场馆编号" v-model="state.queryForm.code" clearable />
					</el-form-item>
					<el-form-item label="启用状态">
						<el-select v-model="state.queryForm.status" placeholder="请选择启用状态" clearable>
							<el-option label="开启" :value="true"></el-option>
							<el-option label="关闭" :value="false"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb8">
				<el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
				<el-button @click="handleSetting">通用设置</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="code"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" align="center" />
				<el-table-column label="场馆名称" prop="name" show-overflow-tooltip />
				<el-table-column label="场馆编号" prop="code" />
				<el-table-column label="场馆地址" prop="address" />
				<el-table-column label="场馆排序" prop="sort" />
				<el-table-column label="联系电话" prop="mobile" />
				<el-table-column label="场地类型" prop="stadiumConfigName" />
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="启用状态" prop="status">
					<template #default="scope">
						{{ scope.row.status ? '开启' : '关闭' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="280">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleSort(row)">排序</el-button>
						<el-button type="primary" link @click="handleDetail(row)">查看</el-button>
						<el-button type="primary" link @click="handleConfig(row)">场馆配置</el-button>
						<el-button type="primary" link @click="handleRouter(row)">场地使用情况</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 通用设置弹窗 -->
		<el-dialog v-model="settingDialogVisible" title="通用设置" width="400">
			<el-form label-position="top" :model="settingForm" :rules="settingFormRules" ref="settingFormRef">
				<el-form-item label="单用户未使用(待开始)订单上限" prop="value">
					<el-input-number v-model.trim="settingForm.value" placeholder="请输入" :min="0" :step="1" :max="9999" step-strictly>
						<template #suffix>
							<span>个</span>
						</template>
					</el-input-number>
					<div class="text-[#888] text-[12px] leading-4 mt-2">
						同一用户允许同时存在的待开始订单最大数量<br />例如：设为3，则用户最多可持有3笔待开始的预约订单
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<div>
					<el-button @click="settingDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="handleComfirm">确认</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 排序弹窗 -->
		<el-dialog v-model="serialDialogVisible" title="提示" width="400">
			<el-form :model="serialForm" :rules="serialFormRules" ref="serialFormRef">
				<el-form-item label="场馆序号" prop="sort">
					<el-input-number v-model.trim="serialForm.sort" placeholder="请输入" :min="0" :step="1" :max="9999" step-strictly />
				</el-form-item>
			</el-form>
			<template #footer>
				<div>
					<el-button @click="serialDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="submitSort">确认</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 查看详情弹窗 -->
		<el-dialog v-model="detailDialogVisible" title="查看详情" width="1000">
			<el-card>
				<template #header>
					<span>基础信息</span>
				</template>
				<el-descriptions :column="1" :label-width="120">
					<el-descriptions-item label="场馆名称">{{ currentRow?.name }}</el-descriptions-item>
					<el-descriptions-item class-name="flex-item" label="场馆照片">
						<div class="image-col">
							<el-image
								v-for="(item, index) of currentRow?.resources"
								:key="index"
								class="w-[100px] h-[100px] mr-4"
								:src="item.imageUrl"
								fit="contain"
							/>
						</div>
					</el-descriptions-item>
					<el-descriptions-item label="启用状态">{{ currentRow?.status ? '启用' : '未启用' }}</el-descriptions-item>
					<el-descriptions-item label="场馆地址">{{ currentRow?.address }}</el-descriptions-item>
					<el-descriptions-item label="联系电话">{{ currentRow?.mobile }}</el-descriptions-item>
					<el-descriptions-item label="自动开放天数">{{ currentRow?.openDay }}</el-descriptions-item>
					<el-descriptions-item label="场地类型">{{ currentRow?.stadiumConfigs?.map((item: any) => item.name).join('，') }}</el-descriptions-item>
					<el-descriptions-item class-name="flex-item" label="预定须知">
						<div class="col">{{ currentRow?.desc }}</div>
					</el-descriptions-item>
					<!-- <div class="flex-item">
						<div>预定须知</div>
						<div>{{ currentRow?.desc }}</div>
					</div> -->
				</el-descriptions>
			</el-card>
			<el-card class="mt-4">
				<template #header>
					<span>场地信息</span>
				</template>
				<el-descriptions v-for="(item, key) of currentRow?.stadiumConfigs" :key="key" :title="item.name" :column="1" :label-width="120">
					<el-descriptions-item label="预定时间段">{{ item.startTime }} - {{ item.endTime }}</el-descriptions-item>
					<el-descriptions-item label="连续预定限制">{{ item.limitNum }}场</el-descriptions-item>
					<el-descriptions-item label="场地数量">{{ item?.stadiumConfigSubs?.length }}个</el-descriptions-item>
					<el-descriptions-item label="场地名称">{{ item?.stadiumConfigSubs?.map((item: any) => item.name).join('，') }}</el-descriptions-item>
				</el-descriptions>
			</el-card>
			<template #footer>
				<div>
					<el-button type="primary" @click="detailDialogVisible = false">确认</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="venueManage">
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { stadiumPageApi, stadiumInfoApi, stadiumUpdateSortApi, getByKeyApi, updateConfigApi } from '/@/api/sportsVenue/index';

const router = useRouter();

const settingDialogVisible = ref(false);
const settingFormRef = ref();
const settingForm = reactive({
	value: 0,
});
const settingFormRules = reactive({
	value: [{ required: true, message: '请输入', trigger: 'blur' }],
});

const serialDialogVisible = ref(false);
const serialFormRef = ref();
const serialForm = reactive({
	code: null,
	sort: 0,
});
const serialFormRules = reactive({
	sort: [{ required: true, message: '请输入', trigger: 'blur' }],
});
const submitSort = async () => {
	try {
		const res = await stadiumUpdateSortApi(serialForm);
		if (res?.ok) {
			useMessage().success('操作成功');
			getDataList();
		} else {
			useMessage().error(res?.msg || '操作失败');
		}
	} catch (err: any) {
		const errorMsg = err?.msg || '操作失败';
		useMessage().error(errorMsg);
	} finally {
		serialDialogVisible.value = false;
	}
};

const detailDialogVisible = ref(false);
const handleAdd = () => {
	router.push({ path: '/sportsVenue/venueManage/config' });
};

const handleSetting = async () => {
	settingDialogVisible.value = true;
	const { data } = await getByKeyApi();
	settingForm.value = Number(data?.value);
};

const handleComfirm = async () => {
	try {
		const res = await updateConfigApi({ ...settingForm, key: 'WAITING_STARTED_ORDER_MAX_LIMIT' });
		if (res?.ok) {
			useMessage().success('操作成功');
			getDataList();
		} else {
			useMessage().error(res?.msg || '操作失败');
		}
	} catch (err: any) {
		const errorMsg = err?.msg || '操作失败';
		useMessage().error(errorMsg);
	} finally {
		settingDialogVisible.value = false;
	}
};

const handleSort = (row: any) => {
	serialForm.code = row.code;
	serialForm.sort = row.sort;
	serialDialogVisible.value = true;
};

const handleConfig = (row: any) => {
	router.push({ path: '/sportsVenue/venueManage/config', query: { code: row.code } });
};

const currentRow = ref();
const handleDetail = async (row: any) => {
	detailDialogVisible.value = true;
	const res = await stadiumInfoApi(row.code);
	currentRow.value = res.data;
};

const handleRouter = (row: any) => {
	router.push({ path: '/sportsVenue/venueManage/detail', query: { code: row.code, name: row.name } });
};

// 搜索变量
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: stadiumPageApi,
	queryForm: {},
	dataList: [],
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {};
	queryRef.value.resetFields();
	getDataList();
};
</script>

<style scoped lang="scss">
:deep(.flex-item) {
	.col {
		width: calc(100% - 136px);
		margin-top: -24px;
		margin-left: 136px;
	}
	.image-col {
		width: calc(100% - 136px);
		margin-top: -40px;
		margin-left: 136px;
	}
}
</style>
