<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="changeType">
					<el-tab-pane v-for="(value, key) in configTypes" :label="value" :name="key" :key="key"></el-tab-pane>
				</el-tabs>
			</el-row>
			<el-row class="ml10 mb8">
				<el-form>
					<el-form-item label="选择样式" prop="style" v-if="state.queryForm.locationType == '11'">
						<el-radio-group @input="changeStyleType" :model-value="magic.style">
							<el-radio :label="1">
								<div class="flex">
									<div class="w-[20px] h-[20px] bg-[#D4D7DE]"></div>
									<div class="w-[20px] h-[20px] bg-[#D4D7DE] ml-[6px]"></div>
								</div>
							</el-radio>
							<el-radio :label="2">
								<div class="flex">
									<div class="w-[20px] h-[20px] bg-[#D4D7DE]"></div>
									<div class="ml-[6px]">
										<div class="w-[20px] h-[8px] bg-[#D4D7DE] mb-[4px]"></div>
										<div class="w-[20px] h-[8px] bg-[#D4D7DE]"></div>
									</div>
								</div>
							</el-radio>
							<el-radio :label="3">
								<div class="flex">
									<div class="w-[20px] h-[20px] bg-[#D4D7DE]"></div>
									<div class="ml-[6px]">
										<div class="w-[20px] h-[8px] bg-[#D4D7DE] mb-[4px]"></div>
										<div class="w-[20px] h-[8px] flex">
											<div class="w-[8px] h-[8px] bg-[#D4D7DE]"></div>
											<div class="w-[8px] h-[8px] bg-[#D4D7DE] ml-[4px]"></div>
										</div>
									</div>
								</div>
							</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="configDialogRef.openDialog(scopeType, activeName, '')" class="ml10" icon="folder-add" type="primary">新建</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				ref="tableRef"
			>
				<el-table-column label="排序" prop="merchantName" width="200">
					<template #default="{ row }">
						<el-input
							style="width: 100px"
							v-if="row.showSort"
							v-model="row.sequence"
							placeholder="请输入序号"
							maxlength="5"
							@input="row.sequence = String(row.sequence)?.replace(/^(0+)|[^\d]+/g, '')"
							clearable
						/>
						<span v-if="!row.showSort">{{ row.sequence }}</span>
						<el-button type="primary" link @click="updateSequence(row)" v-if="row.showSort">确定</el-button>
					</template>
				</el-table-column>
				<el-table-column label="ID" prop="id" />
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
				<el-table-column label="可见对象" prop="visibleIdentity">
					<template #default="{ row }">
						<el-tag class="m-1" :disable-transitions="true" type="primary" v-for="(item, index) in row.visibleIdentity" :key="index">{{
							item.identityName
						}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="启用" prop="status">
					<template #default="{ row }">
						<el-switch v-model="row.status" :before-change="() => beforeChangeStatus(row)" :active-value="1" :inactive-value="2" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="240">
					<template #default="{ row }">
						<el-button type="primary" link icon="refresh" @click="row.showSort = true" v-if="!row.showSort">更新排序</el-button>
						<el-button type="primary" link icon="edit" @click="configDialogRef.openDialog(scopeType, activeName, row.id)">编辑</el-button>
						<el-button type="primary" link icon="delete" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 配置配置  -->
		<config-dialog @refresh="getDataList()" ref="configDialogRef" />
	</div>
</template>

<script lang="ts" name="config-first-page" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import type { TabsPaneContext } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { configTypes, jumpTypes } from './constant';
import {
	configDelete,
	configUpdateSequence,
	configUpdateStatus,
	getByLocationType,
	configStyleUpdate,
	configGetStyle,
} from '/@/api/operationConfig/firstPage';
const activeName = ref('1');
// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));
const magic = reactive({
	style: 1,
});
// 定义变量内容
const configDialogRef = ref();
const tableRef = ref();
const scopeType = ref('首页banner');
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getByLocationType,
	queryForm: { locationType: 1 },
	dataList: [],
	descs: ['create_time'],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const changeType = (tab: TabsPaneContext, event: Event) => {
	if (event?.currentTarget instanceof HTMLElement) {
		scopeType.value = event.currentTarget.innerText;
	}
	state.queryForm.locationType = tab?.paneName;
	state.dataList = [];
	if (tab?.paneName == '11') {
		getStyle();
	}
	getDataList(true);
};

const getStyle = () => {
	configGetStyle({ locationType: state.queryForm.locationType }).then((res) => {
		magic.style = res.data;
	});
};

const changeStyleType = async (value: any) => {
	try {
		await useMessageBox().confirm('是否确定切换小程序样式？');
	} catch {
		return;
	}
	try {
		let params = {
			style: value.target._value,
			locationType: state.queryForm.locationType,
		};
		const res = await configStyleUpdate(params);
		if (res.code != 0) {
			return useMessage().error(res.msg);
		}
		useMessage().success('操作成功');
		getStyle();
		getDataList();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm(`是否确定删除配置`, '删除配置');
	} catch {
		return;
	}
	try {
		await configDelete(row.id);
		useMessage().success('删除成功');
		getDataList();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const beforeChangeStatus = async (row: any) => {
	const { id, status } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${status === 2 ? '启用' : '停用'}该配置`, `${status === 2 ? '启用' : '停用'}`)
				.then(async () => {
					let params = { id: id, status: status === 2 ? 1 : 2 };
					try {
						const { code, msg } = await configUpdateStatus(params);
						if (code === 0) {
							useMessage().success(`${status === 2 ? '启用' : '停用'}成功`);
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
const updateSequence = async (row: any) => {
	try {
		const { code, msg } = await configUpdateSequence({
			id: row.id,
			sequence: row.sequence,
		});
		if (code === 0) {
			useMessage().success('更新排序成功');
			row.showSort = false;
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
<style lang="scss" scoped>
.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
