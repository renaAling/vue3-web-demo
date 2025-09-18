<template>
	<el-dialog title="授权" ref="myDialog" v-model="visible" width="60%" :close-on-click-modal="false">
		<div class="bg-white rounded border-inherit border-solid">
			<div class="flex flex-row">
				<el-form-item label="新增权限">
					<div class="flex">
						<el-select clearable placeholder="请选择" v-model="permission" style="width: 200px; margin-right: 4px">
							<el-option :key="item.tenantId" :label="item.name" :value="item.tenantId" v-for="item in channelArr" :disabled="item.disable" />
						</el-select>
						<el-button type="primary" @click="addPermission">确定</el-button>
					</div>
				</el-form-item>
			</div>
			<div class="permission_content flex flex-wrap">
				<div class="list flex flex-wrap" v-for="(item, index) in permissionList" :key="index">
					<el-input v-model="item.name" readonly style="width: 200px" class="mx-[10px]"></el-input>
					<el-button type="primary" @click="handelEdit(item, true)" v-if="!item.isEdit" :disabled="item.code === 'UPS'">编辑</el-button>
					<el-button type="info" @click="handelEdit(item, false)" v-if="item.isEdit" :disabled="item.code === 'UPS'">取消编辑</el-button>
					<el-button type="danger" v-if="item.isEdit" :disabled="item.code === 'UPS'" @click="delPermission(item.code ?? '')">删除</el-button>
				</div>
			</div>
		</div>
		<template #footer>
			<el-button type="info" size="default" @click="handleConfirm">取消</el-button>
			<el-button type="primary" size="default" @click="handleConfirm">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="portal-account-form" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessage } from 'element-plus';
import { ChannelObj, permissionType } from './types';
import { addSysPermission, delSysPermission, getAccountDetails, sysConfigList } from '/@/api/portal';
const emit = defineEmits(['refresh']);

const visible = ref(false);
const scopeId = ref<string | null>('');
const permission = ref('');
const dataFormRef = ref();
const loading = ref(false);
const permissionList = ref<permissionType[]>([]);
// 页面对应元数据
const dataForm = reactive({
	unionId: '',
	channelCodes: [],
});

const openDialog = async (id?: string) => {
	scopeId.value = id ?? null;
	try {
		getDetail(id as string);
		getChannelList(id as string);
	} catch (err: any) {
		useMessage().error(err);
	}
	visible.value = true;
};
const disabledFun = () => {
	// 如果 permissionList 包含在 channelArr就将对应的数据置为禁用
	channelArr.value = channelArr.value.map((item) => {
		const hasPermission = permissionList.value.some((permission) => permission.tenantId === item.tenantId);
		return {
			...item,
			disable: hasPermission,
		};
	});
};

// 确定新增权限
const addPermission = async () => {
	console.log('dataForm', dataForm);
	try {
		const obj = channelArr.value.filter((item) => item.tenantId === permission.value)[0];
		console.log('obj', obj);
		const params: permissionType = Object.assign({ isEdit: false, isAdmin: false }, obj);
		console.log('params', params);
		const hasDuplicate = permissionList.value.some((item: permissionType) => item.tenantId === params.tenantId);
		if (hasDuplicate || !permission.value) {
			return useMessage().error('已存在该系统权限');
		}
		const { code, msg } = await addSysPermission({
			unionId: dataForm.unionId,
			code: params.code,
		});
		if (code === 0) {
			useMessage().success('新增成功');
			permissionList.value.push(params);
			console.log('permissionList', permissionList);
			getDetail(dataForm.unionId ?? '');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const delPermission = async (sysCode: string) => {
	const { code, msg } = await delSysPermission({ unionId: dataForm.unionId, code: sysCode });
	if (code === 0) {
		ElMessage.success('删除成功');
		getDetail(dataForm.unionId ?? '');
	} else {
		ElMessage.error(msg);
	}
};
const handelEdit = (item: permissionType, isEdit: boolean) => {
	item.isEdit = isEdit;
};
const channelArr = ref<ChannelObj[]>([]);
const getChannelList = async (id: string) => {
	const params = {
		unionId: id,
	};
	const res = await sysConfigList(params);
	channelArr.value = res.data;
};
const getDetail = async (unionId: string) => {
	try {
		loading.value = true;
		const res = await getAccountDetails({ unionId });
		const obj = res.data;
		dataForm.unionId = obj.unionId;
		permissionList.value = obj?.channelSubSystems.map((item: permissionType) => {
			return {
				...item,
			};
		});
		disabledFun();
	} finally {
		loading.value = false;
	}
};

const handleConfirm = () => {
	visible.value = false;
	emit('refresh');
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.layout-form {
	background: #fff;
	padding: 15px 200px;
	// height: calc(100vh - 50px);
}

.permission_content {
	.list {
		border: 1px solid #e5e5e5;
		padding: 10px;
		border-radius: 4px;
		background: #f2f4f8;
		margin-right: 8px;
		margin-bottom: 14px;
	}
}

.content-title {
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	padding-left: 16px;
	position: relative;
	margin-top: 9px;

	&::before {
		content: '';
		width: 8px;
		height: 20px;
		border-radius: 2px;
		background-color: #165dff;
		position: absolute;
		left: 0;
	}
}

.el_edit {
	left: 91%;
}

.avatar {
	margin-left: 25px;
	margin-top: 8px;
	margin-bottom: 25px;
	height: 84px;
	width: 84px;
}

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

.customWidth {
	width: 50%;
}
</style>
