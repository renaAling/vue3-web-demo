<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<!-- <el-form-item label="优惠券类型" prop="couponName">
						<el-select v-model="state.queryForm.couponName" style="width: 220px" placeholder="选择优惠券类型" clearable>
							<el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.name" />
						</el-select>
					</el-form-item> -->
					<el-form-item label="优惠券类型" prop="couponName">
						<el-input v-model="state.queryForm.couponName" placeholder="请输入优惠券类型" />
					</el-form-item>
					<el-form-item label="发放时间" prop="createTime">
						<el-date-picker v-model="state.queryForm.createTime" type="date" placeholder="请选择发放时间" value-format="YYYY-MM-DD" />
					</el-form-item>
					<el-form-item label="发放人" prop="createBy">
						<el-input v-model="state.queryForm.createBy" placeholder="请输入发放人" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button type="primary" @click="dialogVisible = true"> 点击发放 </el-button>
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
				<el-table-column prop="couponName" label="已发放优惠券类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="num" label="发行数量(张)" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="发放时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="validDate" label="卡券有效期" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="createBy" label="发放人" show-overflow-tooltip></el-table-column>
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
						<el-form-item label="优惠券类型" prop="couponCode">
							<el-select v-model="form.couponCode" placeholder="请选择优惠券类型">
								<el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
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
	pageMemberCouponIssueLogPage,
	pageMemberCoupongetList,
	getUserCenterByUnionId,
	pageMemberCouponIssueLogGrantCoupon,
	downloadDistributeDetails,
} from '../../../../api/member/coupon';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
const router = useRouter();
const showSearch = ref(true);
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const typeOptions = ref([]) as any;
const searchTime = ref([]);
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
	couponCode: [{ required: true, message: '请选择优惠券类型', trigger: 'blur' }],
});
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageMemberCouponIssueLogPage, // H
	descs: [],
});
onMounted(() => {
	getMemberCoupongetList();
});

const getMemberCoupongetList = async () => {
	try {
		let res = await pageMemberCoupongetList();
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
			const couponItem = typeOptions.value.find((item: any) => item.code === form.couponCode);
			console.log('typeOptions', typeOptions.value);
			const params = {
				couponCode: form.couponCode,
				couponName: couponItem.name,
				userInfos: issuanceList.value,
			};
			console.log('params', params);
			try {
				const { code, data, msg } = await pageMemberCouponIssueLogGrantCoupon(params);
				if (code === 0) {
					ElMessageBox.alert(data, '发放结果', {
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
	const issueCode = row.issueCode;
	router.push({
		path: `/member/coupon/couponIssuance/detail`,
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
watch(
	() => searchTime.value,
	(val) => {
		if (val[0] && val[1]) {
			state.queryForm.dateStart = val[0] + ' 00:00:00';
			state.queryForm.dateEnd = val[1] + ' 23:59:59';
		} else {
			state.queryForm.dateStart = '';
			state.queryForm.dateEnd = '';
		}
	}
);
const downExcelTemp = async (ite: any) => {
	console.log('ite', ite);
	try {
		const { code, msg } = await downloadDistributeDetails(ite.issueCode);
		if (code === 0) {
			try {
				await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
			} catch {
				return;
			}
			router.push('/downloadCenter');
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.dateStart = '';
	state.queryForm.dateEnd = '';
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
