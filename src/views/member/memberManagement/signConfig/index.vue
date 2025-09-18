<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8 flex justify-between" style="width: 100%">
					<el-button type="primary" class="ml10" @click="handelAdd"> 新增连续天数 </el-button>
					<div style="vertical-align: middle">
						<span class="mr-3">是否开启签到功能</span> <el-switch v-model="isSignIn" :loading="loading" :before-change="beforeChange" />
					</div>
				</div>
			</el-row>
			<el-table
				:data="dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="dayNum" label="连续天数">
					<template #default="{ row, $index }">
						<el-input-number
							v-if="row.edit && $index !== 0"
							placeholder="请输入连续天数"
							v-model="row.dayNum"
							:min="1"
							:step="1"
							:step-strictly="true"
							clearable
						/>
						<span v-else>{{ row.dayNum || '' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="rewardValue" label="奖励">
					<template #default="{ row }">
						<div class="flex justify-center align-center">
							<div class="w-[80px]" style="line-height: 32px; min-width: 80px">赠送经验值</div>
							<el-input-number
								v-if="row.edit"
								placeholder="请输入奖励经验值"
								v-model="row.rewardValue"
								clearable
								:min="0"
								:max="99999999"
								:step="1"
								:step-strictly="true"
							>
								<!-- <template #prepend></template> -->
							</el-input-number>
							<span v-else style="line-height: 32px">{{ row.rewardValue || '' }}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row, $index }">
						<el-button text type="primary" v-if="!row.edit" @click="handelEdit(row)">编辑</el-button>
						<el-button text type="danger" v-if="!row.edit && $index !== 0" @click="handelDel(row.id)">删除</el-button>
						<el-button text type="primary" v-if="row.edit" @click="handelSave(row)">保存</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" /> -->
		</div>
	</div>
</template>

<script setup lang="ts" name="member-sign">
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	pageMemberSignConfigList,
	pageMemberSignConfigAdd,
	pageMemberSignConfigUpdate,
	pageMemberSignConfigDel,
} from '../../../../api/member/member';
import { useMessage, useMessageBox } from '/@/hooks/message';

onMounted(() => {
	getDataList();
});
const dataList = ref<any[]>([]);
const isSignIn = ref(true);
const loading = ref(false);

const getDataList = async () => {
	const { data } = await pageMemberSignConfigList();
	dataList.value = data;
	isSignIn.value = data[0].hide;
};
const beforeChange = () => {
	return new Promise((resolve, reject) => {
		const params = {
			id: 1,
			hide: !isSignIn.value,
		};
		pageMemberSignConfigUpdate(params)
			.then(() => {
				useMessage().success('修改成功');
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg || '修改失败');
				reject(false);
			});
	});
};

const handelAdd = () => {
	if (!dataList.value) dataList.value = [];
	const params = {
		dayNum: '',
		rewardValue: '',
		edit: true,
	};
	dataList.value?.push(params);
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
	pageList: pageMemberSignConfigList, // H
	descs: ['create_time'],
});
const handelDel = (id: string) => {
	useMessageBox()
		.confirm('是否删除该配置', '删除')
		.then(async () => {
			try {
				const { code, msg } = await pageMemberSignConfigDel(Number(id));
				if (code === 0) {
					useMessage().success('删除成功');
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg || '删除失败');
			}
		});
};
const handelEdit = (row: any) => {
	console.log('row', row);
	if (state.dataList) {
		console.log('state.dataList', state.dataList);
	}
	row.edit = true;
};
const handelSave = async (row: any) => {
	console.log('row', row);
	if (!row.dayNum) {
		useMessage().error('请输入连续天数');
		return;
	}
	if (!row.rewardValue) {
		useMessage().error('请输入奖励经验值');
		return;
	}
	row.edit = false;
	const params = {
		id: row.id,
		dayNum: Number(row.dayNum),
		rewardValue: Number(row.rewardValue),
	};

	try {
		const { code, msg } = params.id ? await pageMemberSignConfigUpdate(params) : await pageMemberSignConfigAdd(params);
		console.log('code', code);
		if (code === 0) {
			useMessage().success('保存成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg || '保存失败');
		getDataList();
	}
};
const { tableStyle } = useTable(state);
</script>
<style scoped>
.el-input-number:deep(.el-input-number__decrease) {
	display: none;
}
.el-input-number:deep(.el-input-number__increase) {
	display: none;
}
</style>
