<template>
	<div class="layout-padding">
		<el-card shadow="never" class="mb8" :body-style="{ paddingBottom: 0 }">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item label="商家名称" prop="merchantName">
					<el-input placeholder="请输入商家名称" style="width: 180px" v-model="state.queryForm.merchantName" clearable />
				</el-form-item>
				<el-form-item label="商家ID" prop="merchantCode">
					<el-input placeholder="请输入商家编码" style="width: 180px" v-model="state.queryForm.merchantCode" clearable />
				</el-form-item>
				<el-form-item label="商品名称" prop="spuName">
					<el-input placeholder="请输入商品名称" style="width: 180px" v-model="state.queryForm.spuName" clearable />
				</el-form-item>
				<el-form-item label="商品ID" prop="spuCode">
					<el-input placeholder="请输入商品编码" style="width: 180px" v-model="state.queryForm.spuCode" clearable />
				</el-form-item>
				<el-form-item label="上架状态" prop="status">
					<el-select v-model="state.queryForm.status" style="width: 180px" clearable>
						<el-option label="上架中" value="2">上架中</el-option>
						<el-option label="未上架" value="1">未上架</el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="float-right">
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
					<el-button @click="resetQuery" icon="Refresh">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button type="primary" @click="configDialogRef.openDialog()">新增</el-button>
					<el-button type="primary" @click="batchDelisting('up')" :disabled="selectObjs.length == 0">上架</el-button>
					<el-button type="primary" @click="batchDelisting('down')" :disabled="selectObjs.length == 0">下架</el-button>
					<el-button type="danger" @click="batchDelisting('delete')" :disabled="selectObjs.length == 0">删除</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="50" align="center" />
				<el-table-column label="商家" prop="merchantName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="商品图" prop="image">
					<template #default="{ row }">
						<img :src="row.imageUrl" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="商品ID" prop="spuCode" show-overflow-tooltip />
				<el-table-column label="商品名称" prop="spuName" show-overflow-tooltip />
				<el-table-column label="分组" prop="groupList" show-overflow-tooltip />
				<el-table-column label="标签" prop="tagCode" show-overflow-tooltip />
				<el-table-column label="供应时间" prop="supplyWeek" show-overflow-tooltip />
				<el-table-column label="售价" prop="priceRange" show-overflow-tooltip />
				<el-table-column label="划线价" prop="otPriceRange" show-overflow-tooltip />
				<el-table-column label="排序" prop="sort">
					<template #default="{ row }">
						<el-button type="primary" link class="underline" @click="changeSort(row)">{{ row.sort }}</el-button>
					</template>
				</el-table-column>
				<el-table-column label="状态" prop="status">
					<template #default="{ row }">
						<el-tag v-if="row.status == 2">上架中</el-tag>
						<el-tag v-if="row.status == 1">已下架</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="configDialogRef.openDialog(row.spuCode)">编辑</el-button>
						<el-button type="primary" link icon="edit" @click="associationDigRef.openDialog(row.merchantCode, row.spuCode)">发布商品</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 商品编辑  -->
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
		<el-dialog v-model="dialogFormVisible" title="修改排序" width="500">
			<el-form :model="formSort" :rules="formRules" ref="sortForm">
				<el-form-item label="排序" prop="sort">
					<el-input v-model="formSort.sort" placeholder="请输入" oninput="value=value.replace(/^0|[^0-9]/g, '')" autocomplete="off" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button type="primary" @click="submitSort"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
		<associationDig ref="associationDigRef"></associationDig>
	</div>
</template>

<script lang="ts" name="gs-shop-store" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import mittBus from '/@/utils/mitt';
import { storeToRefs } from 'pinia';
import { useTrcomps } from '/@/stores/trcomps';
import { pageList, delBatch, updateStatusBatch, wdProductSort } from '/@/api/goodStore/platformGoods';
import { Session } from '/@/utils/storage';

// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));
const associationDig = defineAsyncComponent(() => import('../salesManage/config.vue'));

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

const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
// 判断是否为好店-商家
const isMerchant = computed(() => (Session.getTenant() === '1817759704625901569' ? true : false));
const baseFileUrl = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);
// 定义变量内容
const excelUploadRef = ref();
const queryRef = ref();
const configDialogRef = ref();
const associationDigRef = ref();
const multiple = ref();
const selectObjs = ref<any>([]);
const dialogFormVisible = ref(false);
const sortForm = ref();
const formSort = reactive({
	sort: 0,
});

const formRules = reactive<FormRules>({
	sort: [{ required: true, message: '排序值不能为空' }],
});
// 监听事件，特殊处理切换商户对应的门店列表
mittBus.on('changeMerchantStoreList', () => {
	getDataList();
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList,
	queryForm: {},
	pagination: {},
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const changeSort = (row: any) => {
	Object.assign(formSort, row);
	dialogFormVisible.value = true;
};

const submitSort = async () => {
	try {
		await wdProductSort(formSort);
		dialogFormVisible.value = false;
		useMessage().success('编辑成功');
		getDataList();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const batchDelisting = async (type: string) => {
	if (type === 'up') {
		try {
			await useMessageBox().confirm(`确定要将选中商品批量上架吗`, '提示');
		} catch (err: any) {
			return false;
		}
		try {
			const params = {
				spuCodes: selectObjs.value,
				status: 2,
			};
			await updateStatusBatch(params);
			useMessage().success('已上架');
			getDataList();
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else if (type === 'down') {
		try {
			await useMessageBox().confirm(`确定要将选中商品批量下架吗`, '提示');
		} catch (err: any) {
			return false;
		}
		try {
			const params = {
				spuCodes: selectObjs.value,
				status: 1,
			};
			await updateStatusBatch(params);
			useMessage().success('已下架');
			getDataList();
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		try {
			await useMessageBox().confirm(`确定要将选中商品批量删除吗`, '提示');
		} catch (err: any) {
			return false;
		}
		try {
			const { code, msg } = await delBatch({ spuCodes: selectObjs.value });
			if (code === 0) {
				useMessage().success('已删除');
				getDataList();
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}
};

// 多选事件
const handleSelectionChange = (objs: { spuCode: string }[]) => {
	selectObjs.value = objs.map(({ spuCode }) => spuCode);
	multiple.value = !objs.length;
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
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
