<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				ref="tableRef"
			>
				<el-table-column label="名称" prop="name" />
				<el-table-column label="图片" prop="imageUrl" width="130">
					<template #default="{ row }">
						<img :src="row.imageUrl" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="跳转类型" prop="jumpType">
					<template #default="{ row }">
						<span>{{ jumpTypes.filter((item) => item.value == row.jumpType)[0].label }}</span>
					</template>
				</el-table-column>
				<el-table-column label="跳转链接" prop="jumpUrl"> </el-table-column>
				<el-table-column label="可见对象" prop="visibleIdentity">
					<template #default="{ row }">
						<el-tag class="m-1" :disable-transitions="true" type="primary" v-for="(item, index) in row.visibleIdentity" :key="index">{{
							item.identityName
						}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="启用状态" prop="status">
					<template #default="{ row }">
						<span>{{ row.status === 1 ? '启用' : '停用' }} </span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="240">
					<template #default="{ row }">
						<el-button type="primary" link icon="unlock" @click="handleCommand('unlock', row)" v-if="row.status == 2">启用</el-button>
						<el-button type="primary" link icon="lock" @click="handleCommand('lock', row)" v-if="row.status == 1">停用</el-button>
						<el-button type="primary" link icon="edit" @click="handleCommand('edit', row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" /> -->
		</div>
		<!-- 配置配置  -->
		<config-dialog @refresh="getAdList()" ref="configDialogRef" />
	</div>
</template>

<script lang="ts" name="config-first-page" setup>
import { useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getByLocationType } from '/@/api/operationConfig/firstPage';
import { jumpTypes } from './constant';
import { configUpdateStatus } from '/@/api/operationConfig/firstPage';

// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));

// 定义变量内容
const configDialogRef = ref();
const state = reactive({
	dataList: [] as any,
	loading: false,
});
//  table hook
const { tableStyle } = useTable(state);

const handleCommand = async (command: Table.Command, row: any) => {
	const { id, status } = row;
	switch (command) {
		case 'unlock': // 启用
			try {
				useMessageBox()
					.confirm(`是否${status === 2 ? '启用' : '停用'}该配置`, `${status === 2 ? '启用' : '停用'}`)
					.then(async () => {
						let params = { id: id, status: status === 2 ? 1 : 2 };
						try {
							const { code, msg } = await configUpdateStatus(params);
							if (code === 0) {
								useMessage().success(`${status === 2 ? '启用' : '停用'}成功`);
								getAdList();
							} else {
								useMessage().error(msg);
							}
						} catch (err: any) {
							useMessage().error(err.msg);
						}
					})
					.catch(() => {});
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'lock': // 停用
			try {
				useMessageBox()
					.confirm(`是否${status === 1 ? '停用' : '启用'}该配置`, `${status === 2 ? '停用' : '启用'}`)
					.then(async () => {
						let params = { id: id, status: status === 2 ? 1 : 2 };
						try {
							const { code, msg } = await configUpdateStatus(params);
							if (code === 0) {
								useMessage().success(`${status === 1 ? '停用' : '启用'}成功`);
								getAdList();
							} else {
								useMessage().error(msg);
							}
						} catch (err: any) {
							useMessage().error(err.msg);
						}
					})
					.catch(() => {});
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'edit': // 编辑
			configDialogRef.value.openDialog(id);
			break;
	}
};

const getAdList = async () => {
	try {
		state.loading = true;
		let res = await getByLocationType({ locationType: 8 });
		state.loading = false;
		state.dataList = res.data.records;
	} catch {
		state.loading = false;
	}
};

onMounted(async () => {
	getAdList();
});
</script>
<style lang="scss" scoped>
.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
