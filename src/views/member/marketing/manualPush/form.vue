<template>
	<el-dialog :close-on-click-modal="false" title="新增" width="600" draggable v-model="visible" @closed="resetForm">
		<div class="flex" style="justify-content: space-between">
			<el-form :model="form" label-width="100px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
				<el-form-item label="推送对象" prop="obj">
					<div class="flex" style="width: 100%">
						<el-checkbox v-model="checkedPushUser" label="用户分组" size="large" />
						<el-select
							:disabled="!checkedPushUser"
							v-model="form.pushGroup"
							filterable
							remote
							multiple
							clearable
							reserve-keyword
							placeholder="请选择用户分组"
							:remote-method="remoteMethodPushGroup"
							:loading="loading"
							style="margin-left: 10px"
						>
							<el-option v-for="item in pushUserList" :key="item.name" :label="item.name" :value="item.code" />
						</el-select>
					</div>
					<div class="flex" style="width: 100%">
						<el-checkbox v-model="checkedPushSign" label="用户标签" size="large" />
						<el-select
							:disabled="!checkedPushSign"
							v-model="form.pushSign"
							filterable
							remote
							multiple
							clearable
							reserve-keyword
							placeholder="请选择所属标签"
							:remote-method="remoteMethodPushSign"
							:loading="loading"
							style="margin-left: 10px"
						>
							<el-option v-for="item in pushSignList" :key="item.name" :label="item.name" :value="item.code" />
						</el-select>
					</div>
					<div class="flex" style="width: 100%">
						<el-checkbox v-model="checkedUser" label="选择用户" size="large" />
						<el-input :disabled="!checkedUser" placeholder="请输入推送ID" clearable v-model="mobile" style="margin-left: 10px"
							><template #append> <el-button :icon="Search" @click="hanldChange" /> </template
						></el-input>
					</div>
					<el-tag v-for="(tag, index) in userList" :key="tag.name" closable :type="tag.type" @close="handleClose(tag, index)">
						{{ tag.name }}
					</el-tag>
					<!-- <el-input placeholder="请输入发行方" clearable v-model="form.mobile" maxlength="30"></el-input> -->
				</el-form-item>
				<el-form-item label="推送途径" prop="pushChannel" placeholder="请选择推送途径">
					<el-select v-model="form.pushChannel" clearable>
						<el-option label="站内消息" :value="2">站内消息</el-option>
						<el-option label="短信" :value="1">短信</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="推送内容" prop="pushContent">
					<el-select
						v-model="form.pushContent"
						filterable
						remote
						reserve-keyword
						placeholder="请选择推送内容"
						:remote-method="remoteMethod"
						:loading="loading"
					>
						<el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="推送时间" prop="pushTime">
					<el-date-picker
						v-model="form.pushTime"
						type="datetime"
						range-separator="-"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						value-format="YYYY-MM-DD HH:mm:ss"
						style="width: 100%"
					/>
				</el-form-item>
			</el-form>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { Search } from '@element-plus/icons-vue';
import {
	postMemberMarketingPushLogAdd,
	getMemberSignListaApi,
	getMemberGroupListApi,
	getMemberMarketingTemplateApi,
} from '/@/api/member/marketing/marketing';
import { addBackendUser, updateBackendUser } from '/@/api/member/backendUsers/user';
import { getUserInfoByUidMobile } from '/@/api/points/manage';
import { batchSysPermission } from '/@/api/portal';
// import { addBackendUser } from '/@/api/points/manage';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh', 'addToDetail']);
const dataFormRef = ref<any>();
const visible = ref(false);
const loading = ref(false);
const isAdd = ref(true);
const storeLoading = ref(false);
const searchTime = ref<string[]>([]);
const storeList = ref<any[]>([]);
const checkedPushUser = ref(false);
const checkedPushSign = ref(false);
const checkedUser = ref(false);
const pushUserList = ref<any[]>([]); //分组
const pushSignList = ref<any[]>([]); //标签
const userList = ref<any[]>([]);
const mobile = ref('');

// 提交表单数据
const form = reactive({
	pushChannel: '',
	pushGroup: [],
	pushSign: [],
	pushUser: [],
	unionId: '',
	pushContent: '',
});

const validate = (rule: any, value: any, callback: any) => {
	if (form.pushGroup.length == 0) {
		return callback(new Error('请选择用户分组!'));
	} else if (form.pushSign.length == 0) {
		return callback(new Error('请选择用户标签!'));
	} else if (userList.value.length == 0) {
		return callback(new Error('请选择推送用户!'));
	} else {
		return callback();
	}
};
// 定义校验规则
const dataRules = ref({
	obj: [{ required: true, validator: validate, trigger: 'blur' }],
	pushContent: [{ required: true, message: '推送内容不能为空', trigger: 'blur' }],
	pushTime: [{ required: true, message: '推送时间不能为空', trigger: 'blur' }],
});
// 打开弹窗
const openDialog = (row?: any) => {
	getStoreList();
	remoteMethodPushSign();
	remoteMethodPushGroup();
	console.log('row', row);
	visible.value = true;
};
const resetForm = () => {
	dataFormRef.value.resetFields();
	pushUserList.value = [];
	pushSignList.value = [];
	userList.value = [];
	checkedPushUser.value = false;
	checkedPushSign.value = false;
	checkedUser.value = false;
	form.pushGroup = [];
	form.pushSign = [];
	form.pushUser = [];
	visible.value = false;
};

// 根据手机号获取用户详情
const hanldChange = (val: any) => {
	console.log('val', val);
	getUserInfoByUidMobile({ uidMobile: mobile.value })
		.then((res) => {
			console.log(res.data);
			if (userList.value.length > 0) {
				if (userList.value.some((item: any) => item.unionId === res.data.unionId)) {
					useMessage().error('该用户已存在');
					return;
				} else {
					userList.value.push(res.data);
				}
			} else {
				userList.value.push(res.data);
			}
		})
		.catch((err) => {
			useMessage().error(err.msg);
		});
};

const handleClose = (tag: any, index: number) => {
	userList.value.splice(index, 1);
};

// 提交
const onSubmit = async () => {
	if (userList.value.length > 0) {
		userList.value.forEach((item: any) => {
			form.pushUser.push(item.unionId);
		});
	}
	console.log('form', form);
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, data, msg } = await postMemberMarketingPushLogAdd(form);
		if (code === 0) {
			console.log('aaa', data);
			useMessage().success('添加成功');
			dataFormRef.value.resetFields();
			resetForm();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const remoteMethod = (query: string) => {
	if (query) {
		getStoreList(query);
	}
};
// 下拉数据
const remoteMethodPushSign = async (str?: string) => {
	try {
		const { code, data, msg } = await getMemberSignListaApi({ name: str });
		if (code === 0) {
			console.log('saveOrUpdateUserInfos', data);
			pushSignList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const remoteMethodPushGroup = async (str?: string) => {
	try {
		const { code, data, msg } = await getMemberGroupListApi({ name: str });
		if (code === 0) {
			console.log('getMemberCategoryGetList', data);
			pushUserList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 获取远程下拉列表
const getStoreList = async (name?: string) => {
	let params = {
		name: name,
	};
	storeLoading.value = true;
	try {
		const { code, data, msg } = await getMemberMarketingTemplateApi(params);
		if (code === 0) {
			console.log('getMemberCategoryGetList', data);
			storeList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
	storeLoading.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
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
