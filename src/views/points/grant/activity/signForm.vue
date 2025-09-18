<template>
	<el-dialog :close-on-click-modal="false" title="设置" width="700" draggable v-model="visible">
		<div class="mb-3">系统名称：{{ form.name }}</div>
		<div class="mb-3">
			是否开启签到功能
			<el-switch
				v-model="form.status"
				:active-value="true"
				style="--el-switch-on-color: #13ce66"
				:inactive-value="false"
				:before-change="() => beforeChange(form)"
			/>
		</div>
		<div class="flex justify-end mb-3">
			<el-button @click="addDay" type="primary" icon="plus">增加连续天数</el-button>
		</div>
		<div>
			<el-table :data="dataList" row-key="id" border :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column label="连续签到天数" prop="dayNum">
					<template #default="{ row }">
						<el-input-number style="width: 150px" v-model="row.dayNum" size="small" placeholder="请输入" :precision="0" :min="1" />
					</template>
				</el-table-column>
				<el-table-column label="奖励积分" prop="rewardValue">
					<template #default="{ row }">
						<div class="flex items-center">
							<label style="font-size: 12px" class="mr-1">赠送积分值</label>
							<el-input-number style="width: 100px" v-model="row.rewardValue" size="small" placeholder="请输入" :precision="0" :min="1" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default="scope">
						<el-button type="danger" link @click="delData(scope.$index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="flex items-center mt-4">
			<div class="flex items-center ml-7">
				<el-input-number style="width: 150px" v-model="form.dayNum" size="small" @change="changeDay" placeholder="请输入" :precision="0" :min="1" />
				<label style="font-size: 12px" class="ml-1">天后</label>
			</div>
			<div class="flex items-center ml-4">
				<label style="font-size: 12px" class="mr-1">赠送积分值</label>
				<el-input-number style="width: 100px" v-model="form.rewardValue" size="small" placeholder="请输入" :precision="0" :min="1" />
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
import { signInDetail, signInUpdate, signInPlatformStatus } from '/@/api/points/grant';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useTable } from '/@/hooks/table';

const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	status: false,
	name: '',
	rewardValue: null,
	dayNum: null,
	platformCode: null,
});
const dataList = ref([]);
const { tableStyle } = useTable(form);

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

// 打开弹窗
const openDialog = (row) => {
	visible.value = true;
	if (row.id) {
		form.name = row.name;
		form.status = row.status;
		form.platformCode = row.code;
		form.id = row.id;
		dataList.value.length = 0;
		signInDetail({ current: 1, size: 10, platformCode: row.code }).then((res) => {
			const result = res.data;
			for (let i = 0; i < result.length; i++) {
				if (result[i].specialFlag) {
					form.rewardValue = result[i].rewardValue;
					form.dayNum = result[i].dayNum;
				} else {
					dataList.value.push({ dayNum: result[i].dayNum, rewardValue: result[i].rewardValue, specialFlag: false });
				}
			}
		});
	}
};
const closeMyDialog = () => {
	visible.value = false;
};
// 重置
const resetForm = () => {
	// dataFormRef.value.resetFields();
	Object.keys(form).forEach((key) => (form[key] = null));
	dataList.value.length = 0;
	closeMyDialog();
};
const delData = (index: number) => {
	dataList.value.splice(index, 1);
};
// const changeDayNum = (val:number, index:number)=>{
// 	for(let i = 0; i < dataList.value.length; i++) {
// 		if(val === dataList.value[i].dayNum){
// 			useMessage().error('当前连续天数已存在！');
// 			dataList.value[index].dayNum = null;
// 			break
// 		}
// 	}
// }
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
const emit = defineEmits(['refresh']);
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
		await signInUpdate({
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

const beforeChange = async (row: any) => {
	const msg = !row.status ? '确定要启用该数据吗?' : '确定要禁用该数据吗?';
	try {
		await useMessageBox().confirm(msg);
	} catch {
		return;
	}
	try {
		let changeStatus: any;
		if (row.status) changeStatus = false;
		if (!row.status) changeStatus = true;
		const params = {
			status: changeStatus,
			id: form.id,
		};
		await signInPlatformStatus(params);
		useMessage().success('操作成功');
		emit('refresh');
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
