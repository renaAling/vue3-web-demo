<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="商家名称" prop="name">
						<el-input placeholder="请输入商家名称" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="统一社会信用代码" prop="creditCode">
						<el-input placeholder="请输入统一社会信用代码" v-model="state.queryForm.creditCode" clearable />
					</el-form-item>
					<el-form-item label="账户联系人" prop="accountContact">
						<el-input placeholder="请输入账户联系人" v-model="state.queryForm.accountContact" clearable />
					</el-form-item>
					<el-form-item label="手机号码" prop="mobile">
						<el-input placeholder="请输入手机号码" v-model="state.queryForm.mobile" clearable />
					</el-form-item>
					<el-form-item label="注册时间" prop="registrationTime">
						<el-date-picker v-model="state.queryForm.registrationTime" type="date" placeholder="请选择注册时间" value-format="YYYY-MM-DD" />
					</el-form-item>
					<el-form-item label="审核状态" prop="auditStatus">
						<el-select v-model="state.queryForm.auditStatus" default-first-option clearable>
							<el-option v-for="(item, index) in auditStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
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
				<el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
				<el-table-column prop="code" label="商家ID" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="name" label="商家名称" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="creditCode" label="统一社会信用代码" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="legalRepresentative" label="法定代表人" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="registrationTime" label="注册时间" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="registeredCapital" label="注册资本(万元)" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="businessAddress" label="经营地址" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column label="营业执照" min-width="160">
					<template #default="{ row }">
						<el-image
							style="width: 40px; height: 40px"
							:src="row.businessLicense"
							fit="fill"
							@click="handlePictureCardPreview(row.businessLicense)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="businessScope" label="经营范围" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="storeName" label="门店名称" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="storeCategoryName" label="门店品类" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column prop="duration" label="经营年限" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column label="场所照片" min-width="230">
					<template #default="{ row }">
						<div style="display: flex; align-items: center; justify-content: space-between">
							<el-image
								v-for="item in row.premiseImgUrls"
								:key="item"
								style="width: 40px; height: 40px"
								:src="item"
								fit="fill"
								@click="handlePictureCardPreview(item)"
							/>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="accountContact" label="账户联系人" show-overflow-tooltip min-width="160"></el-table-column>
				<el-table-column label="手机号码" show-overflow-tooltip min-width="160">
					<template #default="{ row }">
						{{ maskedMobile(row.mobile) }}
					</template>
				</el-table-column>
				<el-table-column label="查看合约" show-overflow-tooltip min-width="250">
					<template #default="{ row }">
						<div v-for="item in row.contractUrls" :key="item.contractUrl">
							<el-button link type="primary">
								<el-link type="primary" @click="downExcelTemp(item)">{{ item.contractName }}</el-link></el-button
							>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="审核状态" show-overflow-tooltip min-width="100">
					<template #default="{ row }">
						<span v-if="row.auditStatus === 2">待审核</span>
						<span v-if="row.auditStatus === 3">审核通过</span>
						<span v-if="row.auditStatus === 4">审核驳回</span>
					</template>
				</el-table-column>
				<el-table-column prop="activeUser" label="操作" min-width="60" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" v-if="row.auditStatus === 2" @click="handleAudit(row)">审核</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog v-model="dialogImageVisible" class="flex justify-center">
				<img w-full :src="dialogImageUrl" alt="Preview Image" />
			</el-dialog>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogVisible" title="" width="25%" :close-on-click-modal="false">
			<div class="dialog-content">审核</div>
			<el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="" prop="auditStatus">
					<el-radio-group v-model="form.auditStatus">
						<el-radio :label="3">通过</el-radio>
						<el-radio :label="4">不通过</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="" v-if="form.auditStatus === 4" prop="rejectReason">
					<el-input v-model="form.rejectReason" placeholder="请输入不通过原因" maxlength="200" :rows="3" type="textarea" show-word-limit />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)"> 确认 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';
import type { UploadProps } from 'element-plus';
// import { useMessage, useMessageBox } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { getPlatformMerchantPage, getPlatformCategoryAudit } from '/@/api/platformEntry/merchantAudit';
const queryRef = ref();
const ruleFormRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogImageUrl = ref('');
const dialogImageVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		isAudit: true,
	},
	pageList: getPlatformMerchantPage, // H
	descs: [],
});
const form = ref<any>({
	id: '',
	auditStatus: 3,
	rejectReason: '',
});
const auditStatusList = ref([
	{
		label: '待审核',
		value: 2,
	},
	{
		label: '已通过',
		value: 3,
	},
	{
		label: '已驳回',
		value: 4,
	},
]);
const rules = reactive<FormRules<any>>({
	rejectReason: [{ required: true, message: '请输入驳回原因', trigger: 'change' }],
});
const handlePictureCardPreview: UploadProps['onPreview'] = (url: any) => {
	dialogImageUrl.value = url!;
	dialogImageVisible.value = true;
};
const maskedMobile = (mobile: string) => {
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
const handleAudit = async (row: any) => {
	console.log('row', row);
	dialogVisible.value = true;
	form.value.id = Number(row.id);
};
const downExcelTemp = (ite: any) => {
	console.log('ite', ite);

	// 使用 fetch 获取文件并解析响应头
	fetch(ite.contractUrl, {
		method: 'GET',
	})
		.then((response) => {
			console.log('response', response);
			if (!response.ok) {
				throw new Error('下载失败');
			}
			let fileName = ''; // 默认文件名
			fileName = ite.contractName;
			return response.blob().then((blob) => ({ blob, fileName }));
		})
		.then(({ blob, fileName }) => {
			// 创建临时链接
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = fileName; // 设置文件名
			document.body.appendChild(link);
			link.click();

			// 清理
			window.setTimeout(() => {
				document.body.removeChild(link);
				URL.revokeObjectURL(link.href); // 释放 blob URL
			}, 0);
		})
		.catch((error) => {
			console.error('文件下载失败:', error);
		});
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			try {
				let res = await getPlatformCategoryAudit(form.value);
				if (res.code === 0) {
					useMessage().success('审核成功');
					dialogVisible.value = false;
					getDataList();
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
	dialogVisible.value = false;
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
<style scoped>
.dialog-content {
	text-align: center;
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 10px;
}
</style>
