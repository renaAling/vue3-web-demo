<template>
	<el-dialog :close-on-click-modal="false" :title="!form.id ? '新增' : '修改'" width="1000" draggable v-model="visible">
		<el-form :model="form" label-width="100px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="等级" prop="level">
				<span>LV{{ form.level }}</span>
			</el-form-item>
			<el-form-item label="等级名称" prop="name">
				<span>{{ form.levelName }}</span>
			</el-form-item>
			<!-- <el-form-item label="签到页背景图" prop="signListImg">
				<upload-img v-model:image-url="form.signListImg" />
			</el-form-item> -->
			<el-form-item label="会员等级页背景图" prop="backgroundImg">
				<upload-img v-model:image-url="form.backgroundImg" />
			</el-form-item>
			<el-form-item label="会员图标" prop="icon">
				<upload-img v-model:image-url="form.icon" />
			</el-form-item>
			<el-form-item label="等级权益" prop="privileges">
				<el-row class="mb8 flex justify-between items-center">
					<div>
						<el-button type="primary" icon="plus" @click="handleAdd"> 新增 </el-button>
					</div>
				</el-row>
				<el-table
					:data="form.privileges"
					v-loading="state.loading"
					row-key="id"
					border
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="图标" prop="icon" width="200">
						<template #default="{ row }">
							<div class="img">
								<upload-img v-model:image-url="row.icon" />
							</div>
						</template>
					</el-table-column>
					<el-table-column label="权益名称" prop="privilegeName">
						<template #default="{ row }">
							<el-input v-model="row.privilegeName" placeholder="请输入权益名称" />
						</template>
					</el-table-column>
					<el-table-column label="权益介绍" prop="description" :max="15">
						<template #default="{ row }">
							<div class="img">
								<el-input v-model="row.description" placeholder="请输入权益介绍" :max="30" />
							</div>
						</template>
					</el-table-column>
					<el-table-column label="排序" prop="sort">
						<template #default="{ row }">
							<el-input-number v-model="row.sort" :min="1" :step="1" step-strictly />
						</template>
					</el-table-column>
					<el-table-column label="操作" width="80">
						<template #default="{ row, $index }">
							<el-button type="danger" link @click="handleDel(row, $index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { postSaveOrUpdateMemberLevelOther, memberLevelGet } from '/@/api/member/memberLevel/inviolableRights';
import { useMessage } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 提交表单数据
const form = reactive({
	levelName: '',
	level: '',
	// signListImg: '',
	backgroundImg: '',
	icon: '',
	privileges: [
		{
			icon: '',
			privilegeName: '',
			description: '',
			sort: '',
		},
	],
	id: '',
});
const handleDel = (row: any, index: number) => {
	console.log('index', index);
	console.log('form.privileges', form.privileges);
	form.privileges.splice(index, 1);
};
const handleAdd = () => {
	form.privileges.push({
		icon: '',
		privilegeName: '',
		description: '',
		sort: '',
	});
};
const validateMemberLevelPrivilegeList = (rule: any, value: any, callback: any) => {
	if (value.length === 0) {
		callback(new Error('请添加最少一项会员等级权益'));
	} else {
		value.find((item: any) => {
			if (!item.icon) {
				callback(new Error('图标不能为空'));
			} else if (!item.privilegeName) {
				callback(new Error('权益名称不能为空'));
			} else if (!item.description) {
				callback(new Error('权益介绍不能为空'));
			} else if (!item.sort) {
				callback(new Error('排序必填'));
			} else {
				callback();
			}
		});
	}
};
// 定义校验规则
const dataRules = ref({
	level: [{ required: true, message: '等级不能为空', trigger: 'blur' }],
	levelName: [{ required: true, message: '等级名称不能为空', trigger: 'blur' }],
	// signListImg: [{ required: true, message: '签到页背景图不能为空', trigger: 'blur' }],
	backgroundImg: [{ required: true, message: '会员等级页背景图不能为空', trigger: 'blur' }],
	icon: [{ required: true, message: '会员图标不能为空', trigger: 'blur' }],
	privileges: [{ required: true, validator: validateMemberLevelPrivilegeList, trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	form.id = '';
	if (row) {
		form.id = row.id;
		console.log('row', row);
		getMemberLevelGetList(row.id);
		// Object.assign(form, row);
		// Object.assign(form.privileges, row.memberLevelPrivilegeList);
		if (!form.privileges) {
			form.privileges = [
				{
					icon: '',
					privilegeName: '',
					description: '',
					sort: '',
				},
			];
		}
	}
};
const getMemberLevelGetList = async (id: string) => {
	try {
		loading.value = true;
		const { code, data, msg } = await memberLevelGet(id);
		if (code === 0) {
			Object.assign(form, data);
			Object.assign(form.privileges, data.memberLevelPrivilegeList);
		} else {
			useMessage().error(msg);
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

// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	form.privileges = [
		{
			icon: '',
			privilegeName: '',
			description: '',
			sort: '',
		},
	];
	closeMyDialog();
};

// 提交
const onSubmit = async () => {
	console.log('form', form);
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, msg } = await postSaveOrUpdateMemberLevelOther(form);
		if (code === 0) {
			useMessage().success('编辑成功');
			resetForm();
			emit('refresh');
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const state: BasicTableProps = reactive<BasicTableProps>({
	// pageList: getMemberLevelGetList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

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
