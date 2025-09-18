<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="商家ID" prop="merchantCode" v-if="!isMerchant">
						<el-input placeholder="请输入商家ID查询" v-model="state.queryForm.merchantCode" clearable />
					</el-form-item>
					<el-form-item label="门店ID" prop="storeCode">
						<el-input placeholder="请输入门店ID查询" v-model="state.queryForm.storeCode" clearable />
					</el-form-item>
					<el-form-item label="门店名称" prop="storeName">
						<el-input placeholder="请输入门店名称查询" v-model="state.queryForm.storeName" clearable />
					</el-form-item>
					<el-form-item label="门店状态" prop="status">
						<el-select v-model="state.queryForm.status" default-first-option clearable>
							<el-option v-for="(value, key) in storeTypelist" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="推荐状态" prop="isRecommend">
						<el-select v-model="state.queryForm.isRecommend" default-first-option clearable>
							<el-option v-for="(item, index) in recommendList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="configDialogRef.openDialog()" icon="folder-add" type="primary">新建</el-button>
					<el-button plain @click="excelUploadRef.show()" icon="upload-filled" type="primary"> 批量导入 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80" fixed="left" />
				<el-table-column label="商家" prop="merchantName" show-overflow-tooltip v-if="!isMerchant">
					<template #default="{ row }">
						<div>{{ row.merchantName }}</div>
						<div>{{ row.merchantCode }}</div>
					</template>
				</el-table-column>
				<el-table-column label="头图" prop="headImage" width="120">
					<template #default="{ row }">
						<img :src="row.headImage" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="小图" prop="logoUrl" width="120">
					<template #default="{ row }">
						<img :src="row.logoUrl" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="地图图标" prop="mapPointImage"  width="120">
					<template #default="{ row }">
						<img :src="row.mapPointImage" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="门店名称" prop="storeName" show-overflow-tooltip />
				<el-table-column label="门店ID" prop="storeCode" show-overflow-tooltip />
				<el-table-column label="品类" prop="categoryName" />
				<el-table-column label="地址" prop="address" show-overflow-tooltip />
				<el-table-column label="电话" prop="mobile" width="150" />
				<el-table-column label="状态" prop="status">
					<template #default="{ row }">
						<el-tag>{{ storeTypelist[row.status] }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="排序" prop="sort">
					<template #default="{ row }">
						<span class="text-blue-500 underline cursor-pointer" @click="changeSort(row)">{{ row.sort || 0 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="显示" prop="displayStatus" v-if="!isMerchant">
					<template #default="{ row }">
						<el-switch v-model="row.displayStatus" :before-change="() => beforeChangeStatus(row)" :active-value="1" :inactive-value="2" />
					</template>
				</el-table-column>
				<el-table-column label="推荐状态" prop="isRecommend" v-if="!isMerchant">
					<template #default="{ row }">
						   <img  @click="beforeChangeRecommend(row)" :src="row.isRecommend ? 'https://gdsh-oss.duomixing.com:9086/rls/b/HL0pNzBtzAIjzvA4UhXr.png' : 'https://gdsh-oss.duomixing.com:9086/rls/b/U0w0vFPAj1ea8gDZ7sh9.png'" class="img" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="340">
					<template #default="{ row }">
						<el-button type="primary" link @click="configDialogRef.openDialog(row.id)">编辑</el-button>
						<el-button type="primary" link @click="bindDialogRef.openDialog(row.id)" v-if="!row.merchantName && !isMerchant"
							>绑定商家</el-button
						>
						<el-button type="primary" link  @click="handleCommand('unbind', row)" v-if="row.merchantName && !isMerchant"
							>解绑商家</el-button
						>
						<el-button type="primary" link @click="handleCommand('downCode', row)">下载收款码</el-button>
						<el-button type="primary" link @click="handleCommand('delete', row)" v-if="!isMerchant">删除</el-button>
						<el-button type="primary" link @click="handleCommand('businessManage', row)">业务管理</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 门店配置  -->
		<config-dialog @refresh="getDataList()" ref="configDialogRef" />
		<!-- 导入 -->
		<upload-excel
			title="门店数据批量导入"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			:custom-temp-url="baseFileUrl + '/rls/b/rls/门店模板.zip'"
			url="/mall/store/import"
			:fileType="['xlsx', 'xls']"
		/>
		<!-- 绑定商家弹窗 -->
		<bind-dialog @refresh="getDataList()" ref="bindDialogRef" />
		<el-dialog v-model="dialogFormVisible" title="修改排序" width="500">
			<el-form :model="formSort" :rules="formRules" ref="sortForm">
				<el-form-item label="排序" prop="sort">
					<el-input v-model="formSort.sort" placeholder="请输入" oninput="value=value.replace(/^0|[^0-9]/g, '')" autocomplete="off" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm(sortForm)">取消</el-button>
					<el-button type="primary" @click="submitSort(sortForm)"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 业务管理 -->
		<el-dialog v-model="businessManage" title="门店业务" width="400">
			<el-card>
				<div class="card-inner">
					<div class="switch-btn">
						<div class="mr-4">到店支付</div>
						<el-switch
							v-model="businessManageInfo.isReminder"
							:active-value="true"
							:inactive-value="false"
							:before-change="() => beforeChangeBusinessReminder(!businessManageInfo.isReminder, '到店支付')"
						></el-switch>
					</div>
					<div class="switch-btn">
						<div class="mr-4">网订店取</div>
						<el-switch
							v-model="businessManageInfo.onlineIsReminder"
							:active-value="true"
							:inactive-value="false"
							:before-change="() => beforeChangeBusinessReminder(!businessManageInfo.onlineIsReminder, '网订店取')"
						></el-switch>
					</div>
				</div>
			</el-card>

			<!-- <template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm(sortForm)">取消</el-button>
					<el-button type="primary" @click="submitSort(sortForm)"> 确认 </el-button>
				</div>
			</template> -->
		</el-dialog>
	</div>
</template>

<script lang="ts" name="gs-shop-store" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	storeDel,
	storePage,
	storeUnbind,
	storeUpdateDisplayStatus,
	storeUpdateSortApi,
	getBusinessManage,
	updatePlatformStoreReminder,
	updateRecommendStatus
} from '/@/api/goodStore/merchant';
import { downBlobFile } from '/@/utils/other';
import mittBus from '/@/utils/mitt';
import { FormInstance, FormRules } from 'element-plus';
import { Session } from '/@/utils/storage';

// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));
const BindDialog = defineAsyncComponent(() => import('./bindMerchant.vue'));
// 字典
const storeTypelist = ref<any>({
	1: '营业中',
	2: '暂停营业',
});
const recommendList = ref<any>([{
	label: '推荐',
	value: true,
}, {
	label: '不推荐',
	value: false,
}]);
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
// 判断是否为好店-商家
const isMerchant = computed(() => (Session.getTenant() === '1817759704625901569' ? true : false));
const baseFileUrl = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);
// 定义变量内容
const excelUploadRef = ref();
const queryRef = ref();
const configDialogRef = ref();
const bindDialogRef = ref();
const businessManage = ref(false);
const businessManageInfo = ref({
	isReminder: false,
	onlineIsReminder: false,
	storeCode: '',
});
// 监听事件，特殊处理切换商户对应的门店列表
mittBus.on('changeMerchantStoreList', () => {
	getDataList();
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: storePage,
	queryForm: {},
	pagination: {},
	dataList: [],
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const formRules = reactive<FormRules>({
	sort: [{ required: true, message: '排序值不能为空' }],
});

const sortForm = ref();

const formSort = ref({
	sort: 0,
	id: '',
});
const dialogFormVisible = ref(false);

const changeSort = (row: any) => {
	formSort.value.sort = row.sort || 0;
	formSort.value.id = row.id;
	dialogFormVisible.value = true;
};

// 取消
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	formSort.value = {
		sort: 0,
		id: '',
	};
	dialogFormVisible.value = false;
};

const submitSort = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				const { code, msg } = await storeUpdateSortApi(formSort.value);
				if (code === 0) {
					useMessage().success('编辑成功');
					getDataList();
					resetForm(formEl);
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const beforeChangeRecommend = async (row: any) => {
	const { code, msg } = await updateRecommendStatus({
		id: row.id,
		isRecommend: !row.isRecommend,
	});
	row.isRecommend = !row.isRecommend;
	// getDataList();
};
const beforeChangeStatus = async (row: any) => {
	const { id, displayStatus } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${displayStatus === 2 ? '显示' : '隐藏'}该门店`, `${displayStatus === 2 ? '显示' : '隐藏'}`)
				.then(async () => {
					let params = { id: id, displayStatus: displayStatus === 2 ? 1 : 2 };
					try {
						const { code, msg } = await storeUpdateDisplayStatus(params);
						if (code === 0) {
							useMessage().success(`${displayStatus === 2 ? '显示' : '隐藏'}成功`);
							return resolve(true);
						} else {
							useMessage().error(msg);
						}
					} catch (err: any) {
						useMessage().error(err.msg);
					}
				})
				.catch(() => {
					resolve(false);
				});
		} catch (err) {
			reject(false);
		}
	});
};

const beforeChangeBusinessReminder = async (flag: boolean, desc: string) => {
	return new Promise((resolve, reject) => {
		try {
			let formatString = useMessageBox()
				.confirm(`是否${flag ? '开启' : '关闭	'}该门店${desc}？`, `${flag ? '开启' : '关闭'}`)
				.then(async () => {
					let params = {
						storeCode: businessManageInfo.value.storeCode,
						isReminder: desc === '到店支付' ? flag : undefined,
						onlineIsReminder: desc === '网订店取' ? flag : undefined,
					};
					try {
						const { code, msg } = await updatePlatformStoreReminder(params as any);
						if (code === 0) {
							useMessage().success(`${flag ? '开启' : '关闭'}成功`);
							return resolve(true);
						} else {
							useMessage().error(msg);
						}
					} catch (err: any) {
						useMessage().error(err.msg);
					}
				})
				.catch(() => {
					resolve(false);
				});
		} catch (err) {
			reject(false);
		}
	});
};
const handleCommand = async (command: Table.Command, row: any = {}) => {
	switch (command) {
		case 'unbind': // 解绑
			try {
				await useMessageBox().confirm('请确认是否解绑商家', '解绑');
			} catch {
				return;
			}

			try {
				const { id } = row;
				await storeUnbind(id);
				useMessage().success('已解绑');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'delete':
			try {
				await useMessageBox().confirm(`是否确定删除门店`, '删除门店');
			} catch {
				return;
			}
			try {
				await storeDel(row.id);
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'downCode':
			const params = {
				storeCode: row.storeCode,
				storeName: row.storeName,
			};
			downBlobFile('/mall/store/downloadQR', params, '收款码.png');
			break;
		case 'businessManage':
			businessManage.value = true;
			try {
				const { code, data } = await getBusinessManage(row.storeCode);
				if (code === 0) {
					businessManageInfo.value = data;
					businessManageInfo.value.storeCode = row.storeCode;
					// configDialogRef.value.openDialog(row.id, row.businessList);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
	}
};
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
.img {
	display: block;
	width: 36px;
	height: 36px;
	// margin: 0 auto;
	cursor: pointer;
}

.card-inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.switch-btn {
		display: flex;
		align-items: center;
	}
}
</style>
