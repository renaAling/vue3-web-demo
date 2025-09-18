<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10 mb-5">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<!-- <el-form-item>
						<el-button type="primary" @click="dialogVisible = true"> 点击发放 </el-button>
					</el-form-item> -->
					<el-form-item label="优惠券名称" prop="couponName">
                        <el-input v-model="state.queryForm.couponName" placeholder="请输入优惠券名称" maxlength="12" />
					</el-form-item>
					<el-form-item label="发放时间" prop="distributeTime">
						<el-date-picker
							v-model="state.queryForm.distributeTime"
							type="date"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>
					<el-form-item label="发放人" prop="distributeUser">
						<el-input v-model="state.queryForm.distributeUser" placeholder="请输入发放人" maxlength="11" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb8" style="width: 100%">
				<el-button type="primary" @click="dialogVisible = true">点击发放</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" show-overflow-tooltip width="80"></el-table-column>
				<el-table-column prop="couponName" label="已发放优惠券名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="distributeNum" label="发行数量(张)" show-overflow-tooltip></el-table-column>
				<el-table-column prop="distributeTime" label="发放时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="卡券有效期" show-overflow-tooltip>
					<template #default="{ row }">
						<div>{{ row.validTime }} - {{ row.invalidTime }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="distributeUser" label="发放人" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="text" @click="handleDetail(row)">详情</el-button>
						<el-button type="text" @click="downExcelTemp(row)">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" title="发放" width="60%" draggable @closed="resetForm(ruleFormRef)">
				<div class="flex justify-between">
					<el-form :model="form" label-width="100px" ref="ruleFormRef" :rules="rules" class="mb-5" :inline="true">
						<el-form-item label="优惠券名称" prop="couponCode">
							<el-select v-model="form.couponCode" placeholder="请选择优惠券名称">
								<el-option v-for="item in typeOptions" :key="item.couponCode" :label="item.couponName" :value="item.couponCode" />
							</el-select>
						</el-form-item>
					</el-form>
					<el-button type="primary" @click="clickAddUser">新增用户</el-button>
				</div>
				<el-scrollbar height="400px">
					<el-table
						border
						:data="issuanceList"
						v-loading="state.loading"
						style="width: 100%"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column prop="unionId" label="用户ID">
							<template #default="{ row }">
								<el-input v-model="row.unionId" placeholder="请输入用户ID" @change="handleChangeId" />
							</template>
						</el-table-column>
						<el-table-column prop="mobile" label="手机号">
							<template #default="scope">
								<el-input v-model="scope.row.mobile" disabled placeholder="不可编辑,输入ID自动带入" />
							</template>
						</el-table-column>
						<el-table-column prop="nickName" label="昵称">
							<template #default="scope">
								<el-input v-model="scope.row.nickName" disabled placeholder="不可编辑,输入ID自动带入" />
							</template>
						</el-table-column>
						<el-table-column prop="num" label="发放张数">
							<template #default="scope">
								<el-input-number v-model="scope.row.num" :min="1" :max="99" :step="1" :step-strictly="true" placeholder="请输入发放张数">
								</el-input-number>
							</template>
						</el-table-column>
						<el-table-column :label="$t('common.action')" width="80">
							<template #default="{ row, $index }">
								<span style="margin-left: 12px">
									<el-icon class="cursor-pointer" v-if="$index !== 0" @click="handleDeleteUser(row, $index)"><Delete /></el-icon>
								</span>
							</template>
						</el-table-column>
					</el-table>
				</el-scrollbar>
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
import {
	pageCouponIssueLogPage,
	pageCoupongetList,
	getUserCenterByUnionId,
	pageCouponIssueLogGrantCoupon,
	downloadDistribute
} from '/@/api/goodStore/coupon';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
const router = useRouter();
const showSearch = ref(true);
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const typeArr = ref([]) as any;
const typeOptions = ref([]) as any;
const queryRef = ref();
const issuanceList = ref([
	{
		unionId: '',
		mobile: '',
		nickName: '',
		num: 1,
	},
]);

interface RuleForm {
	couponCode: string;
}
const form = reactive<RuleForm>({
	couponCode: '',
});
const rules = reactive<FormRules<RuleForm>>({
	couponCode: [{ required: true, message: '请选择优惠券名称', trigger: 'blur' }],
});
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageCouponIssueLogPage, // H
	descs: [],
});
onMounted(() => {
	getMemberCoupongetList();
	geTypeArr();
});

const geTypeArr = async () => {
	typeArr.value = [
		{
			value: '1',
			label: '启用',
		},
		{
			value: '2',
			label: '停用',
		},
	];
	// try {
	// let res = await pageCoupongetList();
	// typeArr.value = res.data;
	// }catch (err: any) {
	// 	useMessage().error(err.msg);
	// }
};
const getMemberCoupongetList = async () => {
	try {
		const res = await pageCoupongetList();
		console.log('res===========', res);
		typeOptions.value = res.data;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleAdd = async (formEl: FormInstance | undefined) => {
	for (const item of issuanceList.value) {
		if (!item.unionId) {
			useMessage().error('请输入用户ID');
			return;
		}
		if (!item.num) {
			useMessage().error('请输入发放张数');
			return;
		}
		console.log('issuanceList.value', issuanceList.value);
	}
	if (!formEl) return;
	if (issuanceList.value.length === 0) {
		useMessage().error('请输入用户ID');
		return;
	}
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', issuanceList.value);
			const couponItem = typeOptions.value.find((item: any) => item.couponCode === form.couponCode);
			console.log('typeOptions', typeOptions.value);
			const params = {
				couponCode: form.couponCode,
				couponName: couponItem.couponName,
				userInfos: issuanceList.value,
				satisfyMoney: couponItem.satisfyMoney,
				discountAmount: couponItem.discountAmount,
				validTime: couponItem.validTime,
				invalidTime: couponItem.invalidTime,
			};
			console.log('params', params);
			try {
				const { code, data, msg } = await pageCouponIssueLogGrantCoupon(params);
				if (code === 0) {
					ElMessageBox.alert('发放成功', '发放结果', {
						confirmButtonText: '确认',
						center: true,
					});
					getDataList();
					dialogVisible.value = false;
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
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	issuanceList.value = [
		{
			unionId: '',
			mobile: '',
			nickName: '',
			num: 1,
		},
	];
	dialogVisible.value = false;
};
const handleDetail = (row: any) => {
	console.log('row', row);
	const issueCode = row.code;
	router.push({
		path: `/goodStore/coupon/detail`,
		query: { issueCode },
	});
};
const clickAddUser = () => {
	issuanceList.value.push({
		unionId: '',
		mobile: '',
		nickName: '',
		num: 0,
	});
};
const handleDeleteUser = (row: any, index: any) => {
	console.log('row', row, index);
	issuanceList.value.splice(index, 1);
};
const handleChangeId = async (val: any) => {
	const res = issuanceList.value.filter((item) => val === item.unionId);
	console.log('res', res);
	if (!val) {
		useMessage().error('请输入用户ID');
	} else {
		try {
			const { code, data, msg } = await getUserCenterByUnionId(val);
			if (code === 0) {
				if (!data) {
					useMessage().error('用户不存在');
					return;
				}
				console.log('data', data);
				for (const item of issuanceList.value) {
					if (item.unionId === val) {
						Object.assign(item, data);
					}
				}
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}
};
const downExcelTemp = async(ite: any) => {
	console.log('ite', ite);
	downloadDistribute({distributeCode: ite.code}, `发放详情.xlsx`);
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style scoped>
.el-input-number:deep(.el-input-number__decrease) {
	display: none;
}
.el-input-number:deep(.el-input-number__increase) {
	display: none;
}
</style>
