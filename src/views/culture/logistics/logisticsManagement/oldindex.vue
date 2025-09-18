<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="关键字" prop="keywords">
						<el-input
							v-model="state.queryForm.keywords"
							placeholder="请输入关键字"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary">查询</el-button>
						<el-button @click="handleReset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row v-if="isMerchant">
				<div class="mb8" style="width: 100%">
					<el-button @click="handleAdd" class="ml10" icon="folder-add" type="primary"> 新增 </el-button>
				</div>
			</el-row>
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column label="物流公司名称" min-width="150" prop="name" />
				<el-table-column min-width="200" label="编码" prop="code" />
				<el-table-column min-width="100" label="排序" prop="sort" sortable />
				<el-table-column label="是否显示" min-width="100">
					<template #default="scope">
						<el-switch
							v-model="scope.row.isShow"
							:disabled="scope.row.isDefault"
							class="demo"
							:active-value="true"
							:inactive-value="false"
							active-text="开启"
							inactive-text="关闭"
							@change="handleStatusChange(scope.row)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="address" fixed="right" width="170" label="操作">
					<template #default="scope">
						<el-button type="primary" link @click="bindEdit(scope.row)" v-if="!isMerchant">编辑</el-button>
						<el-button type="primary" link @click="bindDel(scope.row)" >删除</el-button>
						<el-button type="primary" link @click="bindSetDufault(scope.row)" v-if="!scope.row.isOpen && isMerchant && !scope.row.isDefault">设为默认</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog title="编辑物流公司" v-model="dialogVisible" width="540px" :show-close="false"  ref="dialogVisibleRef">
			<el-form :model="formData" :rules="rules" ref="formDataRef" label-width="100px">
				<el-form-item label="月结账号" prop="account" v-if="formData.partnerId">
					<el-input v-model="formData.account" placeholder="请输入月结账号"></el-input>
				</el-form-item>
				<el-form-item label="月结密码" prop="password" v-if="formData.partnerKey">
					<el-input v-model="formData.password" placeholder="请输入月结密码"></el-input>
				</el-form-item>
				<el-form-item label="网点名称" prop="netName" v-if="formData.net">
					<el-input v-model="formData.netName" placeholder="请输入网点名称"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input-number v-model="formData.sort" :min="1" :max="10" />
				</el-form-item>
				<el-form-item label="是否启用" prop="status">
					<el-radio-group v-model="formData.status">
						<el-radio :label="false">关闭</el-radio>
						<el-radio :label="true">开启</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="handleClose(formDataRef)">取消</el-button>
				<el-button type="primary" @click="submit(formDataRef)">确定</el-button>
			</template>
		</el-dialog>
		<!-- 新增 -->
		<el-dialog title="新增物流公司" v-model="dialogVisibleAdd" width="540px" :show-close="false" ref="dialogVisibleRef">
			<el-form :model="formDataAdd" :rules="rulesAdd" ref="formDataAddRef" label-width="100px">
				<el-form-item label="物流公司" prop="expressId">
					<el-select v-model="formDataAdd.expressId" style="width: 100%">
						<el-option v-for="(item, index) in expressAllList" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="handleClose(formDataAddRef)">取消</el-button>
				<el-button type="primary" @click="submitAdd(formDataAddRef)">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';

import * as logistics from '/@/api/culture/logistics';
import { expressAllApi } from '/@/api/culture/logistics';
import type { FormInstance, FormRules } from 'element-plus';

const isMerchant = computed(() => {
	return import.meta.env.VITE_IS_MERCHANT;
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: logistics.expressPageApi,
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const expressAllList = ref<any>([]);
const dialogVisibleRef = ref<any>();
const formData = ref<any>({});
const formDataAdd = ref<any>({});
const formDataRef = ref<any>();
const formDataAddRef = ref<any>();
const dialogVisible = ref(false);
const dialogVisibleAdd = ref(false);
// const formRef = ref(null);
const rules = reactive<FormRules<any>>({
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
	account: [{ required: true, message: '请输入月结账号', trigger: 'blur' }],
	password: [{ required: true, message: '请输入月结密码', trigger: 'blur' }],
	netName: [{ required: true, message: '请输入网点名称', trigger: 'blur' }],
});
const rulesAdd = reactive<FormRules<any>>({
	account: [{ required: true, message: '请输入物流公司名称', trigger: 'blur' }],
});
const handleAdd = () => { 
	dialogVisibleAdd.value = true;

};
const handleReset = () => {
	state.queryForm.keywords = '';
	getDataList();
};

onMounted(() => {
	getDataList();
	getExpressList();
});
const bindSetDufault =async (row: any) => { 
	try {
		const { code, msg } = await logistics.expressDefaultSwitch({id: row.id});
		if (code === 0) {
			useMessage().success('设置成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	}catch(error: any) {
		useMessage().error(error.msg);
	}
};
const getExpressList = () => {
	expressAllApi({ type: 'normal' }).then((res) => {
		expressAllList.value = res.data;
		localStorage.setItem('expressAllList', JSON.stringify(res));
	});
};

const handleStatusChange = async (row: any) => {
	console.log('row', row);
	const params = { id: row.id, isShow: row.isShow };
	try {
		const { code, msg } = await logistics.expressUpdateShow(params);
		if (code === 0) {
			useMessage().success('修改成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 编辑
const bindEdit = async (item: any) => {
	try {
		const { code, data, msg } = await logistics.expressInfo({ id: item.id });
		console.log('data', data);
		if (code === 0) {
			Object.assign(formData.value, data);
			dialogVisible.value = true;
			console.log('formData.value', formData.value);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const bindDel = async (item: any) => {
	try {
		await useMessageBox().confirm(`是否确定删除物流公司`, '删除物流公司');
		} catch {
				return;
			}

	try {
		const { code, msg } = await logistics.expressDelete({ id: item.id });
		if (code === 0) {
			useMessage().success('删除成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
}
// 表单提交
// const     submit = ((formName) {
//       this.$refs[formName].validate((valid) => {
//         if (valid) {
//           logistics.expressUpdate(this.formData).then((res) => {
//             this.$message.success('操作成功');
//             this.handleClose();
//             this.getExpressList();
//           });
//         } else {
//           return false;
//         }
//       });
//     })
const submitAdd = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('formDataAdd.value', formDataAdd.value);
			try {
				const { code, msg } = await logistics.expressRelateApi(formDataAdd.value);
				if (code === 0) {
					handleClose(formDataAddRef.value);
					useMessage().success('操作成功');
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
const submit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			try {
				const { code, msg } = await logistics.expressUpdate(formData.value);
				if (code === 0) {
					handleClose(formDataRef.value);
					getExpressList();
					useMessage().success('操作成功');
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
//  关闭模态框
const handleClose = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	dialogVisible.value = false;
	dialogVisibleAdd.value = false;
	//   isCreate.value = 0
	//   formConf.value.fields = [];
	//   formShow.value = false
};
// const handleDeleteTable = (length, tableFrom) => {
//   if (length === 1 && tableFrom.page > 1) return (tableFrom.page = tableFrom.page - 1);
// }
</script>

<style scoped lang="scss"></style>