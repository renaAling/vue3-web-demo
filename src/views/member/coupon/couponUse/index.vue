<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="UID" prop="unionId">
						<el-input v-model="state.queryForm.unionId" placeholder="请输入UID" />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input v-model="state.queryForm.mobile" placeholder="请输入手机号" maxlength="11" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
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
				<el-table-column prop="unionId" label="UID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickName" label="昵称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="用户手机号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="couponName" label="已发放优惠券类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="发放时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="状态" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.statusName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button v-if="row.status === 1" type="text" @click="handleUse(row)">核销</el-button>
						<el-button v-else style="color: #666;" type="text">———</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" title="核销" width="30%" draggable @closed="resetForm">
				<el-form label-width="100px" ref="ruleFormRef" v-model="form">
					<el-form-item label="UID" prop="unionId">
						<span>{{ form.unionId }}</span>
					</el-form-item>
					<el-form-item label="昵称" prop="nickName">
						<span>{{ form.nickName }}</span>
					</el-form-item>
					<el-form-item label="用户手机号" prop="mobile">
						<span>{{ form.mobile }}</span>
					</el-form-item>
					<el-form-item label="优惠券类型" prop="couponCode">
						<span>{{ form.couponName }}</span>
					</el-form-item>
					<el-form-item label="核销备注" prop="remark">
						<el-input
							v-model="form.remark"
							:autosize="{ minRows: 3, maxRows: 5 }"
							type="textarea"
							maxlength="50"
							placeholder="选填"
							show-word-limit
						/>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="resetForm">取消</el-button>
						<el-button type="primary" @click="handleSuccess"> 确认 </el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageMemberCouponUserInfoPage, pageMemberCouponWriteOff } from '../../../../api/member/coupon';
import { useMessage } from '/@/hooks/message';
// import { useRouter } from 'vue-router';
// const router = useRouter()
const queryRef = ref();
const showSearch = ref(true);
const dialogVisible = ref(false);
const form = reactive({
	code: '',
	status: '',
	remark: '',
	unionId: '',
	nickName: '',
	mobile: '',
	couponName: '',
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageMemberCouponUserInfoPage, // H
	descs: [],
});

// 核销按钮
const handleUse = (row: any) => {
	console.log('row', row);
	Object.assign(form, row);
	dialogVisible.value = true;
};

const handleSuccess = async () => {
	const params = {
		code: form.code,
		status: 2,
		remark: form.remark,
	};
	console.log();
	try {
		const { code, msg } = await pageMemberCouponWriteOff(params);
		if (code === 0) {
			useMessage().success(`核销成功`);
			getDataList();
			resetForm();
			dialogVisible.value = false;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const resetForm = () => {
	Object.assign(form, {
		remark: '',
		unionId: '',
		nickName: '',
		mobile: '',
		couponName: '',
	});
	dialogVisible.value = false;
};

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
