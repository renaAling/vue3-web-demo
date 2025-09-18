<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="dataForm.id ? '编辑' : '新增'" draggable v-model="visible">
			<el-form :model="dataForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
				<el-form-item label="所属频道" prop="channelId">
					<el-select
						v-model="dataForm.channelId"
						filterable
						remote
						reserve-keyword
						placeholder="请输入频道名称搜索"
						:remote-method="remoteMethod"
						@change="getParentId"
						:loading="loading">
						<el-option
						v-for="item in channdelList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="栏目名称" prop="name">
					<el-input placeholder="请输入栏目名称" maxlength="10" v-model="dataForm.name" clearable show-word-limit></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="refreshData">取消</el-button>
					<el-button @click="onSubmit" type="primary" :disabled="loading">保存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="portal-entrance-form" setup>
import { useMessage } from '/@/hooks/message';
import { addChannel, channelDetail, updateChannel, allChannel } from '/@/api/portal';


// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const dataForm = ref({
	channelId: '',
	id: '',
	name: '' as string | undefined,
	sequence: 0,
	typeFlag: 0,
});
const channdelList = ref<{ label: string; value: number }[]>([]);
const dataRules = ref({
	name: [{ required: true, message: '请输入频道名称', trigger: 'blur' }],
});
// 打开弹窗
const openDialog = async (row: any = {}, parent: any) => {
	// console.log("row", row)
	// console.log('parent', parent)
	channdelList.value = parent ? [{ label: parent.name, value: parent.id }] : [];
	console.log('channdelList', channdelList.value)
	const {id} = row;
	visible.value = true;
	dataForm.value.id = '';
	if (id) {
		dataForm.value.id = id;
		const { code, data } = await channelDetail({ id });
		if (code === 0) {
			dataForm.value = data;
		}
	}
};
const remoteMethod = async (query: string)=> {
	console.log(query)
	const { code, data } = await allChannel({name: query});
	if (code === 0) {
		channdelList.value = data.map((item: any) => ({ label: item.name, value: item.id }));
	}
}
const curParentId = ref('');
const getParentId = (val: string) => {
	curParentId.value = val;
}
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	const { id, name, sequence } = dataForm.value;
	const params ={
		id, name, sequence,
		typeFlag: 2, //：0-频道，2-栏目
		parentId: curParentId.value,
	}
	if (!valid) return false;
	try {
		const request = dataForm.value.id ? updateChannel : addChannel;
		const { code, data } = await request(params);
		if (code === 0) {
			useMessage().success((dataForm.value.id ? '编辑成功' : '创建成功'));
			refreshData();
			emit('refresh');
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};
const refreshData = () => {
	visible.value = false;
	dataForm.value = {
		channelId: '',
		id: '',
		name: '' as string | undefined,
		sequence: 0,
		typeFlag: 2,
	};
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
