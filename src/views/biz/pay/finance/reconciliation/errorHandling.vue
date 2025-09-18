<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="mb10 text-[18px]">差错详情</div>
			<el-table
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				row-key="id" border
			>
				<!-- <el-table-column align="center" type="selection" :reserve-selection="true" width="40" /> -->
				<el-table-column label="序号" fixed type="index" width="60" />
				<el-table-column label="对账批次" prop="reconciliationLot" show-overflow-tooltip />
				<el-table-column label="中台单号" prop="payOrderId" show-overflow-tooltip />
				<el-table-column label="第三方交易单号" prop="goodsOrderId" show-overflow-tooltip />
				<el-table-column label="交易日期" prop="transactionDate" show-overflow-tooltip width="160" />
				<el-table-column label="交易类型" prop="transactionTypeName" show-overflow-tooltip width="120" />
				<el-table-column label="交易渠道" prop="channelTypeName" show-overflow-tooltip width="120" />
				<el-table-column label="对账金额(元)" prop="refundAmount" show-overflow-tooltip width="160">
					<template #default="scope">
						<div class="flex items-center justify-center">
							<dict-tag :options="typeList" :value="scope.row.channelType"></dict-tag>
							<div>：</div>
							<div>{{ scope.row.channelTotalAmount }}</div>
						</div>
						<div>中台：{{ scope.row.platformTotalAmount }}</div>
					</template>
				</el-table-column>
				<el-table-column label="对账结果" prop="reconciliationResult" show-overflow-tooltip width="120" />
				<el-table-column label="处理状态" prop="status" show-overflow-tooltip width="120">
					<template #default="scope">
						<dict-tag :options="processingList" :value="scope.row.processingStatus"></dict-tag>
					</template>
				</el-table-column>
			</el-table>
			<el-form ref="dataFormRef" :model="form" class="w-1/3 mt25" :rules="dataRules" v-loading="loading">
				<div v-if="listInfo.processingStatus == 1">
					<el-form-item label="处理原因" prop="processingReason">
						<el-input
							type="textarea"
							maxlength="30"
							:autosize="{ minRows: 4, maxRows: 8 }"
							v-model="form.processingReason"
							placeholder="请输入"
							show-word-limit
						/>
					</el-form-item>
					<el-form-item label="上传凭证" prop="fileList">
						<upload-file :data="{}" v-model="form.fileList" :fileType="['png', 'jpg', 'jpeg']" />
					</el-form-item>
					<el-form-item class="formBox_item">
						<el-button type="primary" @click="submit"> 确认处理 </el-button>
					</el-form-item>
				</div>
				<div v-else>
					<el-form-item label="处理原因" prop="processingReason">
						<div>{{ dataInfo.processingReason }}</div>
					</el-form-item>
					<el-form-item label="上传凭证" prop="fileList">
						<div v-for="(item, index) in dataInfo.imageUrl" :key="index" class="flex">
							<el-image style="width: 100px; height: 100px" class="mr-[8px]" :src="item" :preview-src-list="dataInfo.imageUrl" />
						</div>
					</el-form-item>
					<el-form-item class="formBox_item">
						<el-button @click="back">返回</el-button>
					</el-form-item>
				</div>
			</el-form>
			<!-- <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" /> -->
		</div>
	</div>
</template>

<script lang="ts" name="systemPayTradeOrder" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { handleError, findVouchers } from '/@/api/pay/finance';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { typeList } from '/@/hooks/enums';

// 引入组件
const { t } = useI18n();
const router = useRouter();
const { query } = useRoute();
const dataFormRef = ref();
const listInfo = JSON.parse(query.listInfo);
let dataInfo = ref({
	processingReason: '',
	imageUrl: [],
});
if (listInfo.processingStatus == 2) {
	const params = {
		errorCode: listInfo.code,
	};
	findVouchers(params).then((res) => {
		dataInfo.value = res.data;
	});
}
// 定义查询字典
const loading = ref(false);

const processingList = ref([
	{
		label: '待处理',
		value: '1',
		elTagType: '',
	},
	{
		label: '已处理',
		value: '2',
		elTagType: '',
	},
]);

// 提交表单数据
const form = reactive({
	processingReason: '',
	fileList: '',
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
});
state.dataList = [listInfo];

// 定义校验规则
const dataRules = ref({
	fileList: [{ required: true, message: '凭证不能为空', trigger: 'change' }],
	processingReason: [{ required: true, message: '处理原因不能为空', trigger: 'blur' }],
});

/**
 * 操作
 */
const submit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		await useMessageBox().confirm('确定处理该笔差错账？');
	} catch {
		return;
	}
	try {
		const params = {
			errorCode: listInfo.code,
			processingReason: form.processingReason,
			imageUrlsList: form.fileList.split(','),
		};
		handleError(params).then((res) => {
			useMessage().success('处理成功');
			router.back();
		});
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const back = () => {
	router.back();
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);
</script>
<style lang="scss" scoped>
.formBox_item {
	::v-deep {
		.el-form-item__content {
			justify-content: end;
		}
	}
}

::v-deep .upload-file {
	width: 100%;
}

::v-deep .el-upload-dragger {
	padding-top: 0;
	padding-bottom: 0;
}
</style>
