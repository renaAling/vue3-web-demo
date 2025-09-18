<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="商家ID" prop="merchantCode">
						<el-input placeholder="请输入商家ID查询" v-model="state.queryForm.merchantCode" clearable />
					</el-form-item>
					<el-form-item label="商家名称" prop="merchantName">
						<el-input placeholder="请输入商家名称查询" v-model="state.queryForm.merchantName" clearable />
					</el-form-item>
					<el-form-item label="商家类型" prop="type">
						<el-select v-model="state.queryForm.type" default-first-option clearable>
							<el-option v-for="(value, key) in businessTypelist" :key="key" :label="value" :value="key"></el-option>
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
					<el-button @click="handleCommand('add')" class="ml10" icon="folder-add" type="primary">新建</el-button>
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
				<el-table-column label="商家" prop="merchantName" show-overflow-tooltip>
					<template #default="{ row }">
						<div>{{ row.merchantName }}</div>
						<div>{{ row.merchantCode }}</div>
					</template>
				</el-table-column>
				<el-table-column label="LOGO" prop="logo" width="150">
					<template #default="{ row }">
						<img :src="row.logo" class="img-center" />
					</template>
				</el-table-column>

				<el-table-column label="商家类型" prop="type">
					<template #default="{ row }">
						<span>{{ businessTypelist[row.type] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="关联门店" prop="storeNum" />
				<el-table-column label="管理员" prop="supperMobile" />
				<el-table-column label="状态" prop="status">
					<template #default="{ row }">
						<el-switch v-model="row.status" :before-change="() => beforeChangeStatus(row)" :active-value="1" :inactive-value="2" />
					</template>
				</el-table-column>
				<el-table-column label="到店买单" prop="isReminder" v-if="!isMerchant">
					<template #default="{ row }">
						<el-switch v-model="row.isReminder" :before-change="() => beforeChangeReminder(row)" :active-value="true" :inactive-value="false" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="340">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="handleCommand('edit', row)">编辑</el-button>
						<!-- <el-button type="primary" link icon="delete" @click="handleCommand('delete', row)">删除</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="gs-business" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { statusUpdate } from '/@/api/culture/supplier';
import router from '/@/router';
import { merchantDel, merchantPage, merchantUpdateStatus, updateIsReminder } from '/@/api/goodStore/merchant';
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
const isMerchant = computed(() => (baseTenantId.value === '1817759704625901569' ? true : false));
// 字典
const businessTypelist = ref<any>({
	1: '单店',
	2: '连锁',
	3: '大众点评',
});

// 定义变量内容
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: merchantPage,
	queryForm: { status: '0' },
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
const beforeChangeReminder = async (row: any) => {
	const { id, isReminder } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${isReminder ? '禁用' : '启用'}该商家的到店支付功能`, `${isReminder ? '禁用' : '启用'}`)
				.then(async () => {
					let params = Object.assign({ id, isReminder: !isReminder });
					try {
						const { code, msg } = await updateIsReminder(params);
						if (code === 0) {
							useMessage().success(`${isReminder ? '禁用' : '启用'}成功`);
							getDataList;
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
const beforeChangeStatus = async (row: any) => {
	const { id, status } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${status === 1 ? '禁用' : '启用'}该商家`, `${status === 1 ? '禁用' : '启用'}`)
				.then(async () => {
					let params = { id: id, status: status === 1 ? 2 : 1 };
					try {
						const { code, msg } = await merchantUpdateStatus(params);
						if (code === 0) {
							useMessage().success(`${status === 1 ? '禁用' : '启用'}成功`);
							getDataList;
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
		case 'unlock': // 启用
			try {
				await useMessageBox().confirm('请确认是否启用商家', '启用');
			} catch {
				return;
			}

			try {
				const { id } = row;
				await statusUpdate({ id, status: 1 });
				useMessage().success('已启用');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'lock': // 停用
			try {
				await useMessageBox().confirm(`是否确定停用商家`, '停用商家');
			} catch {
				return false;
			}

			try {
				const { id } = row;
				await statusUpdate({ id, status: 2 });
				useMessage().success('已停用');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'delete':
			try {
				await useMessageBox().confirm(`是否确定删除商家`, '删除商家');
			} catch (err: any) {
				return false;
			}

			try {
				await merchantDel(row.id);
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'add':
			router.push('/goodStore/business/config');
			break;
		case 'edit':
			router.push({ path: '/goodStore/business/config', query: { id: row.id } });
			break;
	}
};
</script>
<style lang="scss" scoped>
.img-center {
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
