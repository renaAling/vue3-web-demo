<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10 mb-5">
				<el-button type="primary" @click="handleEdit()"> 新增优惠券 </el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80"></el-table-column>
				<el-table-column prop="couponName" label="优惠券名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createdTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createdBy" label="创建人" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="primary" text @click="handleEdit(row)">编辑</el-button>
						<el-button type="primary" text style="color: red" @click="handleDel(row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" :title="form.id ? '编辑' : '新增'" width="53%" draggable @closed="resetForm(ruleFormRef)">
				<el-form :model="form" label-width="100px" ref="ruleFormRef" :rules="rules">
					<el-form-item label="优惠券名称" prop="couponName">
						<el-input v-model="form.couponName" maxlength="12" show-word-limit />
					</el-form-item>
					<el-form-item label="适用范围" prop="scopeTypes">
						<el-checkbox-group v-model="form.scopeTypes">
							<el-checkbox :label="item.type" v-for="item in scopeConfigs">{{ item.name }}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="适用人群" prop="identTypes">
						<div class="flex flex-row items-center">
							<el-checkbox v-model="isAll" label="全部" @input="checkAll" />
							<el-checkbox-group v-model="form.identTypes" class="ml-4">
								<el-checkbox :label="item.type" v-for="item in empConfigs">{{ item.name }}</el-checkbox>
							</el-checkbox-group>
						</div>
					</el-form-item>
					<el-form-item label="优惠折扣" prop="discountAmount">
						<div class="flex flex-row items-center">
							<div class="mr-4 ml-4">满</div>
							<el-input-number v-model="form.satisfyMoney" :min="1" :max="999999" :step="1" :precision="0" />
							<div class="mr-4 ml-4">减</div>
							<el-input-number v-model="form.discountAmount" :min="1" :max="999999" :step="1" :precision="0" />
						</div>
					</el-form-item>
					<el-form-item label="有效期" prop="validTime">
						<el-date-picker
							v-model="timeData"
							type="daterange"
							range-separator="-"
							style="width: 400px"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD HH:mm:ss"
							clearable
						/>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="resetForm(ruleFormRef)">取消</el-button>
						<el-button type="primary" @click="handleAdd(ruleFormRef)"> 确认 </el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageCouponPage, pageCouponAdd, pageCouponUpdate, pageCouponDel, getUserScope, couponDetail } from '/@/api/goodStore/coupon';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
const showSearch = ref(true);
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
interface RuleForm {
	couponName: string;
	id?: string;
	scopeTypes: string[];
	identTypes: string[];
	discountAmount: string;
	satisfyMoney: number;
	validTime: string;
	invalidTime: string;
}
const form = reactive<RuleForm>({
	couponName: '',
	scopeTypes: [],
	identTypes: [],
	discountAmount: '',
	satisfyMoney: 0,
	validTime: '',
	invalidTime: '',
});
const timeData = ref<string[]>([]);
const rules = reactive<FormRules<RuleForm>>({
	couponName: [{ required: true, message: '请填写优惠券名称', trigger: 'blur' }],
	scopeTypes: [{ required: true, message: '请选择适用范围', trigger: 'blur' }],
	identTypes: [{ required: true, message: '请选择适用人群', trigger: 'blur' }],
	discountAmount: [{ required: true, message: '请填写优惠折扣', trigger: 'blur' }],
	satisfyMoney: [{ required: true, message: '请填写优惠折扣', trigger: 'blur' }],
	validTime: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
});
// const searchTime = ref([])
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageCouponPage, // H
	descs: [],
});

// watch(
// 	() => dialogVisible.value,
// 	(val) => {
// 		if (val) {
// 			getUseBy();
// 		}
// 	}
// );
watch(
	() => timeData.value,
	(val: string[] | null) => {
		console.log('val', val);
		if (val && val.length === 2) {
			form.validTime = val[0];
			form.invalidTime = val[1];
		} else {
			form.validTime = '';
			form.invalidTime = '';
		}
	}
);

watch(
	() => form.identTypes,
	(newValue: any) => {
		// 更新复选框-全选的值
		isAll.value = newValue.length > 0 && newValue.length == empConfigs.value.length ? true : false;
	}
);

const scopeConfigs = ref<{ type: string; name: string }[]>([]);
const empConfigs = ref<{ type: string; name: string }[]>([]);
const getUseBy = async () => {
	const { code, data, msg } = await getUserScope();
	if (code === 0) {
		scopeConfigs.value = data.scopeConfigs;
		empConfigs.value = data.empConfigs;
	}
};
const isAll = ref(false);
const checkAll = (e: any) => {
	const checked = e.target.checked;
	if (checked) {
		form.identTypes = empConfigs.value.map((item) => item.type);
	} else {
		form.identTypes = [];
	}
};
const handleEdit = async (row?: any) => {
	if (row) openEditDialog({ id: row.id });
	else openEditDialog();
};

const handleAdd = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			try {
				const request = form.id ? pageCouponUpdate : pageCouponAdd;
				const { code, msg } = await request(form);
				if (code === 0) {
					useMessage().success(`${form.id ? '修改' : '新增'}成功`);
					getDataList();
					resetForm(ruleFormRef.value);
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
const handleDel = (id: string) => {
	useMessageBox()
		.confirm('是否删除该优惠券', '删除')
		.then(async () => {
			try {
				const { code, msg } = await pageCouponDel(Number(id));
				if (code === 0) {
					useMessage().success('删除成功');
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		});
};
// 打开新增或编辑弹框
const openEditDialog = async (row?: any) => {
	getUseBy();
	dialogVisible.value = true;
	let isEdit = row?.id ? true : false;
	if (isEdit) {
		const { code, data, msg } = await couponDetail(row.id);
		if (code !== 0) {
			useMessage().error(msg);
			return;
		}
		Object.assign(form, data);

		// isAll.value = form.identTypes.length > 0 && form.identTypes.length == empConfigs.value.length ? true : false;
		timeData.value = [data.validTime, data.invalidTime];
	}
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	form.couponName = '';
	form.scopeTypes = [];
	form.identTypes = [];
	form.discountAmount = '';
	form.satisfyMoney = 0;
	form.validTime = '';
	form.invalidTime = '';
	form.id = '';
	isAll.value = false;
	timeData.value = [];
	dialogVisible.value = false;
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
