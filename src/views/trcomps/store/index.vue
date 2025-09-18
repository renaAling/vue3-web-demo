<template>
	<div class="layout-padding">
		<div class="page_title mb8">门店管理</div>
		<el-card shadow="never" class="mb8" :body-style="{ paddingBottom: 0 }">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item label="商家" prop="merchantCode">
					<el-select
						v-model="state.queryForm.merchantCode"
						filterable
						remote
						reserve-keyword
						placeholder="请选择商家"
						:remote-method="(val: string) => getMerchantsList(val)"
						:loading="loading"
					>
						<el-option v-for="item in merchantsList" :key="item.value" :label="`${item.label}`" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="商家类型" prop="categoryId">
					<el-select v-model="state.queryForm.categoryId" clearable>
						<el-option v-for="item in merchantClassify" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="门店名称" prop="storeName">
					<el-input placeholder="请输入门店名称查询" v-model="state.queryForm.storeName" clearable />
				</el-form-item>
				<el-form-item label="门店状态" prop="status">
					<el-select v-model="state.queryForm.status" default-first-option clearable>
						<el-option v-for="(value, key) in storeTypelist" :key="key" :label="value" :value="key"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
					<el-button @click="resetQuery" icon="Refresh">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8 text-right" style="width: 100%">
					<el-button @click="handleCommand('add')" class="ml10" icon="folder-add" type="primary">新建</el-button>
					<el-button plain @click="excelUploadRef.show()" class="ml10" icon="upload-filled" type="primary"> 批量导入 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<!-- <el-table-column type="index" label="序号" width="80" fixed="left" /> -->
				<el-table-column label="商家" prop="merchantName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="小图" prop="logoUrl">
					<template #default="{ row }">
						<img :src="row.logoUrl" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="头图" prop="headImage">
					<template #default="{ row }">
						<img :src="row.headImage" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="地图图标" prop="mapPointImage">
					<template #default="{ row }">
						<img :src="row.mapPointImage" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="门店ID" prop="storeCode" show-overflow-tooltip />
				<el-table-column label="门店名称" prop="storeName" show-overflow-tooltip />
				<el-table-column label="品类" prop="categoryName" />
				<el-table-column label="地址" prop="address" show-overflow-tooltip />
				<el-table-column label="电话" prop="mobile" />
				<el-table-column label="排序" prop="sort">
					<template #default="{ row }">
						<span class="text-blue-500 underline cursor-pointer" @click="changeSort(row)">{{ row.sort || 0 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" prop="status">
					<template #default="{ row }">
						<span :class="'text-c-' + row.status">{{ storeTypelist[row.status] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="显示" prop="displayStatus">
					<template #default="{ row }">
						<el-switch v-model="row.displayStatus" :before-change="() => beforeChangeStatus(row)" :active-value="1" :inactive-value="2" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="240">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="handleCommand('edit', row)">编辑</el-button>
						<el-button type="primary" link icon="lock" @click="bindDialogRef.openDialog(row.id)" v-if="!row.merchantName">绑定商家</el-button>
						<el-button type="primary" link icon="unlock" @click="handleCommand('unbind', row)" v-if="row.merchantName">解绑商家</el-button>
						<el-button type="primary" link icon="delete" @click="handleCommand('delete', row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 导入 -->
		<upload-excel
			title="门店数据批量导入"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			:custom-temp-url="baseFileUrl + '/rls/b/rls/门店模板.zip'"
			url="/tracomps-admin/api/admin/platform/store/import"
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
	</div>
</template>

<script lang="ts" name="gs-shop-store" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { storePageApi, storeUnbindApi, storeUpdateStatusApi, storeDelApi, storeUpdateSortApi } from '/@/api/trcomps/store';
import { merchantListApi } from '/@/api/trcomps/merchant';
import { downBlobFile } from '/@/utils/other';
import mittBus from '/@/utils/mitt';
import { storeToRefs } from 'pinia';
import { useTrcomps } from '/@/stores/trcomps';
import router from '/@/router';
import type { FormInstance, FormRules } from 'element-plus';

const merchantsList = ref<
	Array<{
		label?: string;
		value?: number | string;
	}>
>([]);
const loading = ref(false);
const dialogFormVisible = ref(false);
const sortForm = ref();
const formSort = ref({
	sort: 0,
	id: '',
});

const formRules = reactive<FormRules>({
	sort: [{ required: true, message: '排序值不能为空' }],
});

// 引入组件
const BindDialog = defineAsyncComponent(() => import('./bindMerchant.vue'));
// 商户分类枚举
const stores = useTrcomps();
const { merchantClassify } = storeToRefs(stores);
const getMerchantClassify = async () => {
	if (merchantClassify.value && merchantClassify.value.length < 1) {
		await stores.setMerchantClassify();
		merchantClassify.value = stores.merchantClassify;
	}
};
getMerchantClassify();
let keywords: any;
const getMerchantsList = async (query: string | undefined) => {
	if (keywords === query) return;
	keywords = query;
	loading.value = true;
	try {
		const params = {
			keywords: query,
			page: 1,
			limit: 20,
		};
		const { data, code, msg } = await merchantListApi(params);
		loading.value = false;
		if (code === 0) {
			const list = data?.records?.map((item: any) => {
				return {
					label: item.name,
					value: item.merchantCode,
				};
			});
			merchantsList.value = list;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
getMerchantsList('');
// 字典
const storeTypelist = ref<any>({
	1: '营业中',
	2: '暂停营业',
});
const baseFileUrl = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);
// 定义变量内容
const excelUploadRef = ref();
const queryRef = ref();
const bindDialogRef = ref();
// 监听事件，特殊处理切换商户对应的门店列表
mittBus.on('changeMerchantStoreList', () => {
	getDataList();
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: storePageApi,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const changeSort = (row: any) => {
	formSort.value.sort = row.sort || 0;
	formSort.value.id = row.id;
	dialogFormVisible.value = true;
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

// 取消
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	formSort.value = {
		sort: 0,
		id: '',
	};
	dialogFormVisible.value = false;
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
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
						const { code, msg } = await storeUpdateStatusApi(params);
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
				const params = { id };
				const { code, msg } = await storeUnbindApi(params);
				if (code === 0) {
					useMessage().success('已解绑');
					getDataList();
				} else {
					useMessage().error(msg);
				}
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
				const { code, msg } = await storeDelApi(row.id);
				if (code === 0) {
					useMessage().success('删除成功');
					getDataList();
				} else {
					useMessage().error(msg);
				}
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
		case 'add':
			router.push('/trcomps/store/config');
			break;
		case 'edit':
			router.push({ path: '/trcomps/store/config', query: { id: row.id, storeCode: row.storeCode } });
			break;
	}
};
</script>
<style lang="scss" scoped>
.page_title {
	font-size: 18rpx;
	font-weight: bold;
}
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
</style>
