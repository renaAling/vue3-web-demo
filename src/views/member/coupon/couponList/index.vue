<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- <el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="日期" prop="searchTime">
						<el-date-picker
							v-model="searchTime"
							@change="changeSearchTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							style="width: 380px"
						/>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row> -->
			<el-row shadow="hover" v-show="showSearch" class="ml10 mb-5">
				<el-button type="primary" @click="dialogVisible = true"> 新增类型 </el-button>
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
				<el-table-column prop="name" label="优惠券类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createBy" label="创建人" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="text" @click="handleEdit(row)">编辑</el-button>
						<el-button type="text" style="color: red" @click="handleDel(row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" :title="form.code ? '编辑' : '新增'" width="30%" draggable @closed="resetForm(ruleFormRef)">
				<el-form :model="form" label-width="100px" ref="ruleFormRef" :rules="rules">
					<el-form-item label="优惠券类型" prop="name">
						<el-input v-model="form.name" maxlength="12" show-word-limit />
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
import { pageMemberCouponPage, pageMemberCouponAdd, pageMemberCouponUpdate, pageMemberCouponDel } from '../../../../api/member/coupon';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
// import { useRouter } from 'vue-router';
// const router = useRouter()
// const queryRef = ref();
const showSearch = ref(true);
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
interface RuleForm {
	name: string;
	code: string;
}
const form = reactive<RuleForm>({
	name: '',
	code: '',
});
const rules = reactive<FormRules<RuleForm>>({
	name: [{ required: true, message: '请填写优惠券类型', trigger: 'blur' }],
});
// const searchTime = ref([])
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageMemberCouponPage, // H
	descs: [],
});
const handleEdit = (row: any) => {
	Object.assign(form, row);
	dialogVisible.value = true;
};

const handleAdd = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			try {
				const request = form.code ? pageMemberCouponUpdate : pageMemberCouponAdd;
				const { code, msg } = await request(form);
				if (code === 0) {
					useMessage().success(`${form.code ? '修改' : '新增'}成功`);
					getDataList();
					dialogVisible.value = false;
					// return resolve(true);
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
		.confirm('是否删除该类型', '删除')
		.then(async () => {
			try {
				const { code, msg } = await pageMemberCouponDel(Number(id));
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
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	dialogVisible.value = false;
};
// watch(
// 	() => searchTime.value,
// 	(val) => {
// 		if (val) {
// 			state.queryForm.dateStart = val[0];
// 			state.queryForm.dateEnd = val[1];
// 		} else {
// 			state.queryForm.dateStart = '';
// 			state.queryForm.dateEnd = '';
// 		}
// 	}
// );

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// const changeSearchTime = (val: any) => {
// 	if (!val) {
// 		state.queryForm.dateStart = '';
// 		state.queryForm.dateEnd = '';
// 	}
// 	getDataList();
// };

// 清空搜索条件
// const resetQuery = () => {
// 	queryRef.value.resetFields();
// 	searchTime.value = [];
// 	state.queryForm.dateStart = '';
// 	state.queryForm.dateEnd = '';
// 	getDataList();
// };
</script>
