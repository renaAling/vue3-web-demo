<template>
	<el-dialog :close-on-click-modal="false" title="设置" width="700" draggable v-model="visible">
		<div class="mb-3">发放场景：{{ form.thirdName }}</div>
		<div class="mb-3">
			<el-button @click="add" type="primary" icon="plus">新增</el-button>
		</div>
		<div>
			<el-table :data="dataList" row-key="id" border :cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column label="名称" prop="name">
					<template #default="{ row }">
						<el-input style="width: 150px;" v-model="row.name" size="small" maxlength="150"
							placeholder="请输入" />
					</template>
				</el-table-column>
				<el-table-column label="手机号" prop="mobile">
					<template #default="{ row }">
						<el-input style="width: 150px;" v-model="row.mobile" size="small" placeholder="请输入" />
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default="scope">
						<el-button type="danger" link @click="delData(scope.$index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancel">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { whiteList, whiteConfig } from '/@/api/points/grant';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useTable } from '/@/hooks/table';


const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	thirdName: null,
	thirdCode: null,
});
const dataList = ref<{ name: string, mobile: string }[]>([]);
const { tableStyle } = useTable(form);


const add = () => {
	dataList.value.push({ name: '', mobile: '' })
}


// 打开弹窗
const openDialog = (row) => {
	visible.value = true;
	dataList.value.length = 0;
	if (row.id) {
		form.id = row.id;
		form.thirdCode = row.thirdCode;
		form.thirdName = row.thirdName;
		whiteList({ current: 1, size: 10000, thirdCode: row.thirdCode }).then((res) => {
			dataList.value = res.data.records;
		});
	}
};
const closeMyDialog = () => {
	visible.value = false;
};
// 重置
const resetForm = () => {
	// dataFormRef.value.resetFields();
	//Object.keys(form).forEach((key) => (form[key] = null));
	dataList.value.length = 0;
	closeMyDialog();
};
const delData = (index: number) => {
	dataList.value.splice(index, 1);
}

// 取消
const cancel = async () => {
	const isEmptyForm = !(dataList.value.length || form.thirdName);
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
// 提交
const onSubmit = async () => {
	if (dataList.value.length == 0) {
		useMessage().error('请添加！');
		return;
	}
	// 获取表格中的字段是否有空值
	let flag = false;
	let mobileFlag = false;
	dataList.value.forEach((item) => {
		if (!(item.name && item.mobile)) {
			flag = true
		}
		// 校验手机号
		if(item.mobile){
			const pattern = /^1[3-9]\d{9}$/;
			if (!pattern.test(item.mobile)) {
				mobileFlag = true
			}
		}
	})
	if (flag) {
		useMessage().error('请填写完整的信息！');
		return
	}
	if (mobileFlag) {
		useMessage().error('请填写正确的手机号！');
		return
	}
	try {
		await whiteConfig({
			thirdCode: form.thirdCode,
			whites: dataList.value,
		});
		useMessage().success('操作成功');
		resetForm();
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
