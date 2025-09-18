<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="dataForm.id ? '编辑' : '新增'" draggable v-model="visible">
			<el-form :model="dataForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
				<!-- <el-form-item label="分组" prop="groupId">
					<el-select clearable placeholder="请选择分组" v-model="dataForm.groupId">
						<el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in groupListData" />
					</el-select>
				</el-form-item> -->
				<el-form-item label="图片" prop="imageUrl">
					<upload-img v-model:image-url="dataForm.imageUrl" />
				</el-form-item>
				<el-form-item label="系统名称" prop="name">
					<el-input placeholder="请输入系统名称" maxlength="50" v-model="dataForm.name" clearable></el-input>
				</el-form-item>
				<el-form-item label="地址类型" prop="linkType">
					<el-radio-group v-model="dataForm.linkType">
						<el-radio :key="index" :label="item.value" border v-for="(item, index) in addressType">{{ item.label }} </el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="地址" prop="jumpLink">
					<div class="flex">
						<el-select clearable placeholder="请选择" v-model="dataForm.tenantId" v-if="dataForm.linkType === 1">
							<el-option :key="item.tenantId" :label="item.name" :value="item.tenantId" v-for="item in sysConfigListData" />
						</el-select>
						<el-input clearable placeholder="请输入地址" v-model="dataForm.jumpLink" style="width: 500px"></el-input>
					</div>
				</el-form-item>

				<el-form-item label="描述" prop="description">
					<editor v-model:get-html="dataForm.description" height="400" />
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
import { addEntrance, entranceDetail, groupList, sysConfigList, updateEntrance } from '/@/api/portal';

// 定义刷新表格emit
const emit = defineEmits(['refresh']);
const addressType = ref([
	{ label: '内部', value: 1 },
	{ label: '外部', value: 2 },
]);
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
	tenantId: '',
	linkType: 1,
	jumpLink: '',
});

const dataRules = ref({
	// groupId: [{ required: true, message: '请选择分组', trigger: 'blur' }],
	imageUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
	linkType: [{ required: true, message: '请选择地址类型', trigger: 'blur' }],
});
// 打开弹窗
const groupListData = ref<{ name: string; id: string }[]>([]);
const openDialog = async (id: string) => {
	visible.value = true;
	dataForm.value.id = '';
	if (id) {
		dataForm.value.id = id;
		const { code, data } = await entranceDetail({ id });
		if (code === 0) {
			dataForm.value = data;
		}
	}
	getGroupList();
	getSysConfigList();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		const request = dataForm.value.id ? updateEntrance : addEntrance;
		const { code, data } = await request(dataForm.value);
		if (code === 0) {
			useMessage().success(data.msg || (dataForm.value.id ? '编辑成功' : '创建成功'));
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
		id: '',
		groupId: '',
		name: '' as string | undefined,
		description: '',
		imageUrl: '',
		tenantId: '',
		linkType: 1,
		jumpLink: '',
	};
};

// 初始化部门数据
const getGroupList = async () => {
	const { code, data } = await groupList();
	if (code === 0) {
		groupListData.value = data;
	}
};
const sysConfigListData = ref<{ name: string; tenantId: string }[]>([]);
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
