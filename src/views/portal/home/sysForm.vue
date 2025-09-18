<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="title" draggable v-model="visible" width="30%">
			<el-form :model="dataForm" :rules="dataRules" label-width="120px" ref="dataFormRef" v-loading="loading">
				<el-form-item label="子系统ID" prop="tenantId">
					<el-select clearable placeholder="请选择" v-model="dataForm.tenantId" @change="changeSystem">
						<el-option :key="item.tenantId" :label="item.name" :value="item.tenantId" v-for="item in sysConfigListData" />
					</el-select>
				</el-form-item>
				<el-form-item label="子系统名称" prop="subSysName">
					<el-input placeholder="请输入子系统名称" maxlength="12" show-word-limit v-model="dataForm.subSysName" clearable></el-input>
				</el-form-item>
				<el-form-item label="域名" prop="domainUrl">
					<el-input placeholder="请输入域名"  show-word-limit v-model="dataForm.domainUrl" readonly></el-input>
				</el-form-item>
				<el-form-item label="系统ICON" prop="imageUrl">
					<upload-img v-model:image-url="dataForm.imageUrl" />
				</el-form-item>
				<el-form-item label="子系统地址" prop="jumpLink">
					<el-input placeholder="请输入子系统地址" maxlength="200" v-model="dataForm.jumpLink" clearable></el-input>
				</el-form-item>
				<el-form-item label="所属分类" prop="groupId">
					<el-select clearable placeholder="请选择所属分类" v-model="dataForm.groupId">
						<el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in groupListData" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="refreshData(dataFormRef)">取消</el-button>
					<el-button @click="onSubmit(dataFormRef)" type="primary" :disabled="loading">保存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="portal-entrance-form" setup>
import { useMessage } from '/@/hooks/message';
import { addEntrance, entranceDetail, groupList, sysConfigList, updateEntrance } from '/@/api/portal';
import type { FormInstance, FormRules } from 'element-plus';
// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const dataForm = ref({
	id: '',
	groupId: '',
	name: '' as string | undefined,
	description: '',
	imageUrl: '',
	domainUrl: '',
	tenantId: '',
	linkType: 1,
	jumpLink: '',
	subSysId: '',
	subSysName: '',
});

// 打开弹窗
const groupListData = ref<{ name: string; id: string }[]>([]);
const title = ref('');
const scopeId = ref(''); //数据ID

const dataRules = ref({
	tenantId: [{ required: true, message: '请输入子系统ID', trigger: 'change' }],
	subSysName: [{ required: true, message: '请输入子系统名称', trigger: ['change', 'blur'] }],
	imageUrl: [{ required: true, message: '请上传子系统ICON', trigger: ['change', 'blur'] }],
	groupId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
});
const openDialog = async (id: string, pid: number) => {
	scopeId.value = id;
	const pre = id ? `编辑` : `新增`;
	const next = pid == 0 ? '分类' : '子系统';
	title.value = `${pre}${next}`;
	dataForm.value.id = '';
	if (id) {
		const { code, data } = await entranceDetail({ id });
		if (code === 0) {
			dataForm.value = data;
			dataForm.value.subSysName = dataForm.value.name || '';
			visible.value = true;
		}
	} else {
		visible.value = true;
	}
	getGroupList();
	getSysConfigList();
};

// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	let request = null;

	dataForm.value.name = dataForm.value.subSysName;
	request = dataForm.value.id ? updateEntrance : addEntrance;
	try {
		const { code, data } = await request(dataForm.value);
		if (code === 0) {
			useMessage().success(dataForm.value.id ? '编辑成功' : '创建成功');
			refreshData(formEl);
			emit('refresh');
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};
const refreshData = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl?.resetFields();
	dataForm.value = {
		id: '',
		groupId: '',
		name: '' as string | undefined,
		description: '',
		imageUrl: '',
		domainUrl: '',
		tenantId: '',
		linkType: 1,
		jumpLink: '',
		subSysId: '',
		subSysName: '',
	};
	visible.value = false;
};
const changeSystem = (val: string) => {
	dataForm.value.domainUrl = sysConfigListData.value.find((item) => item.tenantId === val)?.domainUrl || '';
};

// 初始化分类数据
const getGroupList = async () => {
	const { code, data } = await groupList();
	if (code === 0) {
		groupListData.value = data;
	}
};
const sysConfigListData = ref<{ name: string; tenantId: string , domainUrl: string }[]>([]);

// 初始化子系统数据
const getSysConfigList = async () => {
	// 获取部门数据
	const { code, data } = await sysConfigList();
	if (code === 0) {
		sysConfigListData.value = data;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
