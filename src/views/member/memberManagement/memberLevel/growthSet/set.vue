<template>
	<el-dialog :close-on-click-modal="false" title="设置" width="800" draggable v-model="visible">
		<div class="mb-3">
			系统名称：<span>{{ form.name }}</span>
		</div>
		<div class="mb-3">
			是否开启签到功能：<span
				><el-switch
					v-model="form.status"
					:active-value="1"
					:inactive-value="2"
					@click="handleClick(form)"
			/></span>
		</div>
		<el-row class="mb8 flex" style="justify-content: flex-end">
			<div>
				<el-button type="primary" icon="plus" @click="addDay()"> 增加连续天数 </el-button>
			</div>
		</el-row>
		<el-table
			:data="dataList"
			v-loading="loading"
			row-key="id"
			border
			:cell-style="tableStyle?.cellStyle"
			:header-cell-style="tableStyle?.headerCellStyle"
		>
			<el-table-column label="连续签到天数" prop="dayNum">
				<template #default="{ row }">
					<el-input-number v-model="row.dayNum" placeholder="请输入" :min="1" :step="1" step-strictly />
				</template>
			</el-table-column>
			<el-table-column label="奖励积分" prop="rewardValue">
				<template #default="{ row }">
					<div class="flex justify-center align-center items-center">
						<span class="w-[110px]">赠送积分值</span
						><el-input-number v-model="row.rewardValue" placeholder="请输入" :min="1" :step="1" step-strictly :precision="0" />
						<!-- <el-input-number style="width: 100px" v-model="row.rewardValue" size="small" placeholder="请输入" :precision="0" :min="1" /> -->
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template #default="{ $index }">
					<el-button type="primary" link @click="delData($index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="flex items-center mt-4">
			<div class="flex items-center ml-3">
				<el-input-number style="width: 200px" v-model="form.dayNum" @change="changeDay" placeholder="请输入" :precision="0" :min="1" />
				<label class="ml-1">天后</label>
			</div>
			<div class="flex items-center ml-4">
				<label class="mr-1">赠送积分值</label>
				<el-input-number style="width: 140px" v-model="form.rewardValue" placeholder="请输入" :precision="0" :min="1" />
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancel">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { getHideConfigApi, putMemberSignSwitchUpdateApi, getMemberSignConfigList } from '/@/api/member/memberLevel/growthSet';
import { postSaveOrUpdateApi } from '/@/api/member/memberLevel/growthSet';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ElMessageBox } from 'element-plus';

// 定义变量内容
const emit = defineEmits(['refresh']);
// const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const dataList = ref<any[]>([]);
// 提交表单数据
const form = reactive({
	id: '',
	status: false,
	name: '',
	rewardValue: null,
	dayNum: null,
	platformCode: null,
});
// 只取个样式
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
const { tableStyle } = useTable(state);

// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	if (row.id) {
		form.name = row.name;
		form.status = row.status;
		form.platformCode = row.code;
		form.id = row.id;
		dataList.value.length = 0;
		signInDetail();
		// signInDetail({ current: 1, size: 10, platformCode: row.code }).then((res) => {
		// 	const result = res.data;
		// 	for (let i = 0; i < result.length; i++) {
		// 		if (result[i].specialFlag) {
		// 			form.rewardValue = result[i].rewardValue;
		// 			form.dayNum = result[i].dayNum;
		// 		} else {
		// 			dataList.value.push({ dayNum: result[i].dayNum, rewardValue: result[i].rewardValue, specialFlag: false });
		// 		}
		// 	}
		// });
	}
};

const signInDetail = async () => {
	try {
		const result = await getMemberSignConfigList();
		if (result.code === 0) {
			for (let i = 0; i < result.data.length; i++) {
				if (result.data[i].specialFlag) {
					form.rewardValue = result.data[i].rewardValue;
					form.dayNum = result.data[i].dayNum;
				} else {
					dataList.value.push({ dayNum: result.data[i].dayNum, rewardValue: result.data[i].rewardValue, specialFlag: false });
				}
			}
		} else {
			useMessage().error(result.msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const closeMyDialog = () => {
	visible.value = false;
};
// 取消
const cancel = async () => {
	const isEmptyForm = !(dataList.value.length || form.dayNum || form.rewardValue);
	if (isEmptyForm || form.id) {
		resetForm();
		return;
	}
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		resetForm();
	} catch {
		return false;
	}
};

const addDay = () => {
	dataList.value.push({ dayNum: null, rewardValue: null, specialFlag: false });
};
const changeDay = () => {
	// 获取表格中的所有天数总和
	let max = 0;
	dataList.value.forEach((item) => {
		if (item.dayNum && max < item.dayNum) {
			max = item.dayNum;
		}
	});

	if (form.dayNum <= max) {
		form.dayNum = max + 1;
		useMessageBox().warning('不可输入小于最大连续天数的值！');
		return;
	}
};

// 重置
const resetForm = () => {
	Object.keys(form).forEach((key) => (form[key] = null));
	dataList.value.length = 0;
	closeMyDialog();
};
const delData = (index: number) => {
	dataList.value.splice(index, 1);
};
// 提交
const onSubmit = async () => {
	//changeDay();
	if (dataList.value.length == 0) {
		useMessage().error('请添加连续天数！');
		return;
	}
	// 获取表格中的字段是否有空值
	let flag = false;
	dataList.value.forEach((item) => {
		if (!(item.dayNum && item.rewardValue)) {
			flag = true;
		}
	});
	if (flag) {
		useMessage().error('请填写完整的连续天数信息！');
		return;
	}
	try {
		await postSaveOrUpdateApi({
			platformCode: form.platformCode,
			signConfig:
				form.rewardValue || form.dayNum
					? [...dataList.value, { dayNum: form.dayNum, rewardValue: form.rewardValue, specialFlag: true }]
					: dataList.value,
		});
		useMessage().success('操作成功');
		resetForm();
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const handleClick = async (row: any) => {
	const msg = row.status == 1 ? '确定要启用该任务吗?' : '确定要禁用该任务吗?';
	try {
		await ElMessageBox.confirm(msg, '系统提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	try {
		const params = {
			status: row.status,
		};
		const { code, msg } = await putMemberSignSwitchUpdateApi(params);
		if (code === 0) {
			useMessage().success('操作成功');
			// getSignDataList();
		} else {
			useMessage().error(msg);
			row.status == 1 ? (row.status = 2) : (row.status = 1);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		row.status == 1 ? (row.status = 2) : (row.status = 1);
	}
};
// const beforeChange = async (row: any) => {
// 	const msg = !row.status ? '确定要启用该数据吗?' : '确定要禁用该数据吗?';
// 	try {
// 		await useMessageBox().confirm(msg);
// 	} catch {
// 		return;
// 	}
// 	try {
// 		let changeStatus: any;
// 		if (row.status) changeStatus = false;
// 		if (!row.status) changeStatus = true;
// 		const params = {
// 			status: changeStatus,
// 			id: form.id,
// 		};
// 		await signInPlatformStatus(params);
// 		useMessage().success('操作成功');
// 		emit('refresh');
// 		return true;
// 	} catch (err: any) {
// 		useMessage().error(err.msg);
// 	}
// };

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.upload_icon {
	position: absolute;
	width: 24px;
	height: 24px;
	left: 62px;
	top: 62px;
	border-radius: 100px;
	border: 2px solid #ffffff;
	background-color: #e8f3ff;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}
</style>
