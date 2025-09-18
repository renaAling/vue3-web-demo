<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
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
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="configDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">新建</el-button>
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
				<el-table-column type="index" label="序号" width="80" fixed="left" />
				<el-table-column label="头图" prop="headImage">
					<template #default="{ row }">
						<img :src="row.headImage" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="小图" prop="logoUrl">
					<template #default="{ row }">
						<img :src="row.logoUrl" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="地图图标" prop="mapPointImage">
					<template #default="{ row }">
						<img :src="row.mapPointImage" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="门店名称" prop="storeName" show-overflow-tooltip />
				<el-table-column label="门店ID" prop="storeCode" show-overflow-tooltip />
				<el-table-column label="品类" prop="categoryName" />
				<el-table-column label="地址" prop="address" show-overflow-tooltip />
				<el-table-column label="电话" prop="mobile" />
				<el-table-column label="状态" prop="status">
					<template #default="{ row }">
						<span :class="'text-c-' + row.status">{{ storeTypelist[row.status] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="240">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="configDialogRef.openDialog(row.id)">编辑</el-button>
						<el-button type="primary" link icon="download" @click="handleCommand('downCode', row)">下载收款码</el-button>
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
	</div>
</template>

<script lang="ts" name="gs-shop-store" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { storeDel, storePage, storeUnbind, storeUpdateDisplayStatus } from '/@/api/goodStore/merchant';
import { downBlobFile } from '/@/utils/other';
import mittBus from '/@/utils/mitt';

// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));
const BindDialog = defineAsyncComponent(() => import('./bindMerchant.vue'));
// 字典
const storeTypelist = ref<any>({
	1: '营业中',
	2: '暂停营业',
});
const baseFileUrl = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);
// 定义变量内容
const excelUploadRef = ref();
const queryRef = ref();
const configDialogRef = ref();
const bindDialogRef = ref();
// 监听事件，特殊处理切换商户对应的门店列表
mittBus.on('changeMerchantStoreList', () => {
	getDataList();
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: storePage,
	queryForm: { status: '' },
	pagination: {},
	dataList: [],
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

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
</style>
