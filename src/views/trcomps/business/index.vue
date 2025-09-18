<template>
	<div class="layout-padding">
		<div class="page_title mb8">商家管理</div>
		<el-card shadow="never" class="mb8" :body-style="{ paddingBottom: 0 }">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item label="商家ID" prop="id">
					<el-input placeholder="请输入商家ID查询" v-model="state.queryForm.id" clearable />
				</el-form-item>
				<el-form-item label="商家名称" prop="keywords">
					<el-input placeholder="请输入商家名称查询" v-model="state.queryForm.keywords" clearable />
				</el-form-item>
				<el-form-item label="商家类型" prop="categoryId">
					<el-select v-model="state.queryForm.categoryId" clearable>
						<el-option v-for="item in merchantClassify" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
				<el-table-column label="LOGO" prop="rectangleLogo" width="150">
					<template #default="{ row }">
						<img :src="row.rectangleLogo" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="商家ID" prop="id"> </el-table-column>
				<el-table-column label="商家名称" prop="name" min-width="180" show-overflow-tooltip></el-table-column>
				<el-table-column label="供应商渠道" prop="name" min-width="180" show-overflow-tooltip>
					<template #default="{ row }">
						<dict-tag :options="merchantTypeList" :value="row.channelId"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="商家类型" prop="merchantType">
					<template #default="{ row }">
						<dict-tag :options="merchantClassify" :value="row.merchantType"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="关联门店" prop="storeCount" />
				<el-table-column label="商品调价" prop="priceRatio">
					<template #default="{ row }">
						<span :class="row.priceDir ? 'up' : 'down'">{{
							((row.priceDir === true ? '+' : row.priceDir === false ? '-' : '') + row.priceRatio || 0) + '%'
						}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" prop="isSwitch">
					<template #default="{ row }">
						<el-switch v-model="row.isSwitch" :before-change="() => beforeChangeStatus(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="handleCommand('edit', row)">编辑</el-button>
						<!-- <el-button type="primary" link icon="delete" @click="handleCommand('delete', row)">删除</el-button> -->
						<el-button type="primary" link icon="edit" @click="handleCommand('justment', row)">商品调价</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<Justment ref="justment" @refresh="getDataList" />
	</div>
</template>

<script lang="ts" name="tc-business" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { statusUpdate } from '/@/api/culture/supplier';
import router from '/@/router';
import { merchantDel } from '/@/api/goodStore/merchant';
import { merchantListApi, merchantCloseApi, merchantOpenApi, getChannel } from '/@/api/trcomps/merchant';
// import { useTrcomps } from '/@/stores/trcomps';
const Justment = defineAsyncComponent(() => import('./justment.vue'));

// 字典
// 商户分类枚举
// const stores = useTrcomps();
// const { merchantClassify } = storeToRefs(stores);
// const getMerchantClassify = async () =>{
// 	if(merchantClassify.value && merchantClassify.value.length < 1) {
// 		await stores.setMerchantClassify();
// 		merchantClassify.value = stores.merchantClassify;
// 	}
// }
// getMerchantClassify()
const justment = ref();
const merchantClassify = ref([
	{ label: '单店', value: '1', elTagType: '' },
	{ label: '连锁', value: '2', elTagType: '' },
]);

// 定义变量内容
const queryRef = ref();
const merchantTypeList = ref([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: merchantListApi,
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

const getChannelData = () => {
	getChannel().then((res) => {
		merchantTypeList.value = res.data.map((item: any) => {
			return { value: item.channelId, label: item.channelName, elTagType: '' };
		});
	});
};
getChannelData();

const beforeChangeStatus = async (row: any) => {
	const { id, isSwitch } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${isSwitch ? '禁用' : '启用'}该商家`, `${isSwitch ? '禁用' : '启用'}`)
				.then(async () => {
					try {
						const { code, msg } = isSwitch ? await merchantCloseApi(id) : await merchantOpenApi(id);
						if (code === 0) {
							useMessage().success(`${isSwitch ? '禁用' : '启用'}成功`);
							getDataList();
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
				const { code, msg } = await statusUpdate({ id, status: 1 });
				if (code === 0) {
					useMessage().success('已启用');
					getDataList();
				} else {
					useMessage().error(msg);
				}
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
				const { code, msg } = await statusUpdate({ id, status: 2 });
				if (code === 0) {
					useMessage().success('已停用');
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
			router.push('/trcomps/business/config');
			break;
		case 'edit':
			router.push({ path: '/trcomps/business/config', query: { id: row.id } });
			break;
		case 'justment':
			justment.value.openDialog(row);
			break;
	}
};
</script>
<style lang="scss" scoped>
.page_title {
	font-size: 18rpx;
	font-weight: bold;
}
.img-center {
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
.up {
	color: #f56c6c;
}
.down {
	color: #67c23a;
}
</style>
