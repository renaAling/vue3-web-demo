<template>
	<div class="layout-padding">
		<el-scrollbar>
			<el-card class="box-card box-body" :bordered="false" shadow="never">
				<div class="acea-row">
					<div class="after-line" @click="goBack">
						<el-icon><ArrowLeft /></el-icon>
						<span class="pl10">返回</span>
					</div>
					<span class="ht_title ml10">{{ title }}</span>
				</div>
			</el-card>

			<el-card class="box-card box-body mt14" :bordered="false" shadow="never">
				<el-row>
					<div class="mb8" style="width: 100%">
						<el-button @click="handleAdd" type="primary">添加卡密</el-button>
						<el-button @click="stateData.upload.open = true">导入卡密</el-button>
						<el-button @click="exports">下载模板</el-button>
						<el-button @click="handleBatcheDel">批量删除</el-button>
					</div>
				</el-row>
				<el-table
					:data="dataList"
					style="width: 100%"
					v-loading="loading"
					border
					:cell-style="tableStyle.cellStyle"
					:header-cell-style="tableStyle.headerCellStyle"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="55" />
					<el-table-column prop="id" label="卡密ID" min-width="60" />
					<el-table-column label="卡密库ID" prop="libraryId" min-width="100" :show-overflow-tooltip="true" />
					<el-table-column label="卡号" prop="cardNumber" min-width="100" :show-overflow-tooltip="true" />
					<el-table-column label="密码" prop="secretNum" min-width="100" :show-overflow-tooltip="true" />
					<el-table-column label="出售情况" width="180">
						<template #default="{ row }">
							<el-tag v-if="!row.isUse">未出售</el-tag>
							<el-tag v-else>已出售</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建期间" width="350"> </el-table-column>
					<el-table-column label="操作" width="180" fixed="right">
						<template #default="{ row }">
							<el-button link type="primary" @click="handleCommand('edit', row)">编辑</el-button>
							<el-button v-if="row.isDel" link type="primary" @click="handleCommand('delete', row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					background
					layout="total, sizes, prev, pager, next, jumper"
					:page-sizes="[10, 20, 50, 100, 200]"
					:total="total"
					:page-size="pageSize"
					:current-page="currentPage"
					@size-change="handleSizeChange"
					@current-change="handlePageChange"
				></el-pagination>
			</el-card>

			<el-dialog v-model="dialogVisible" :title="isAdd ? '添加卡密' : '编辑卡密'" width="800" @close="onResetForm">
				<el-scrollbar height="300px">
					<el-form class="logistics-info-form" inline ref="dialogFormRef" :model="formData" label-width="80px" :rules="formRules">
						<div v-for="(item, index) in formData.list" :key="index">
							<el-form-item :label="isAdd ? `卡号${index + 1}：` : '卡号'" :prop="`list.${index}.cardNumber`" :rules="formRules.cardNumber">
								<el-input v-model.trim="item.cardNumber"></el-input>
							</el-form-item>
							<el-form-item :label="isAdd ? `卡密${index + 1}：` : '卡密'" :prop="`list.${index}.secretNum`" :rules="formRules.secretNum">
								<el-input v-model.trim="item.secretNum"></el-input>
							</el-form-item>
							<el-form-item v-if="isAdd && index !== 0" label="" prop="">
								<el-button @click="handleDelList(index)">删除</el-button>
							</el-form-item>
						</div>
						<div class="ml-5">
							<el-button v-if="isAdd" @click="handleAddList()">添加行</el-button>
						</div>
					</el-form>
				</el-scrollbar>
				<template #footer>
					<el-button type="info" size="default" @click="onResetForm()">取消</el-button>
					<el-button type="primary" size="default" @click="onSubmit(dialogFormRef)">提交</el-button>
				</template>
			</el-dialog>
			<el-dialog title="导入卡密" v-model="stateData.upload.open" :close-on-click-modal="false" draggable>
				<el-upload
					ref="uploadRef"
					:limit="1"
					accept=".xlsx, .xls"
					:headers="headers"
					:action="baseURL + other.adaptationUrl(`/tracomps-admin/api/admin/merchant/card/secret/import/excel?libraryId=${route.query.id}`)"
					:on-progress="handleFileUploadProgress"
					:on-success="handleFileSuccess"
					:on-error="handleFileError"
					:on-exceed="handleFileExceed"
					:before-upload="beforeUpload"
					:auto-upload="false"
					drag
				>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">
						将文件拖到此处，或
						<em>点击上传</em>
					</div>
					<template #tip>
						<div class="el-upload__tip text-center">
							<div style="margin-bottom: 10px">
								<span>仅允许导入xls、xlsx格式文件。</span>
								<el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="downExcelTemp"
									>下载模板
								</el-link>
							</div>
							<div style="color: #ff0000">单次上传不超过500条</div>
						</div>
					</template>
				</el-upload>
				<template #footer>
					<el-button type="primary" @click="submitFileForm">确认</el-button>
					<el-button @click="stateData.upload.open = false">取消</el-button>
				</template>
			</el-dialog>
		</el-scrollbar>
	</div>
</template>
<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox } from 'element-plus';
import other from '/@/utils/other';
import { useMessage } from '/@/hooks/message';
import { downBlobFile } from '/@/utils/other';
import { Session } from '/@/utils/storage';
import { ElNotification, UploadProps, UploadRawFile } from 'element-plus';
import { cardPageApi, cardDeleteApi, cardBatchDeleteApi, cardSaveApi, cardUpdateApi } from '/@/api/culture/commodity/cdkeyId';

const router = useRouter();
const route = useRoute();
const title = ref<any>('');
const multipleSelection = ref<any[]>([]);
const dialogVisible = ref(false);
const isAdd = ref(false);
const dialogFormRef = ref();
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const total = ref(0);
const uploadRef = ref();
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const dataForm = ref({
	tagName: '',
	id: null,
	owner: 1,
	tagNote: '',
	timerange: [] as (string | Date)[],
	sort: 0,
	playType: 'product',
	playProducts: '',
	position: 0,
	status: null,
	proBrandList: [] as number[],
	data: '',
	proCategorylist: [] as number[],
	merIds: [] as number[],
	startTime: '',
	endTime: '',
});
const formData = reactive({
	list: [{ cardNumber: '', secretNum: '', id: '' }],
});
const formRules = reactive<FormRules>({
	cardNumber: [{ required: true, message: '卡号不能为空', trigger: 'blur' }],
	secretNum: [{ required: true, message: '卡密不能为空', trigger: 'blur' }],
});
const stateData = reactive({
	resultVisible: false,
	importNum: 0,
	successSum: 0,
	failSum: 0,
	failExcels: [],
	dialog: {
		title: '',
		isShowDialog: false,
	},
	upload: {
		open: false,
		isUploading: false,
	},
	isFail: false,
});
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
//  table hook
const { tableStyle } = useTable(state);

onMounted(() => {
	console.log('dataForm.value', dataForm.value);
	if (route.query.id) {
		getDataList();
		title.value = route.query.title;
	}
});

const getDataList = async () => {
	loading.value = true;
	const params = {
		libraryId: route.query.id,
		current: currentPage.value,
		size: pageSize.value,
	};
	try {
		const { code, data, msg } = await cardPageApi(params);

		if (code === 0) {
			dataList.value = data.records;
			total.value = data.total;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const handleAdd = () => {
	isAdd.value = true;
	dialogVisible.value = true;
};

const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val;
};
const goBack = () => {
	router.back();
};
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getDataList();
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getDataList();
};

// 操作
const handleCommand = (command: Table.Command, row: any) => {
	switch (command) {
		case 'edit':
			Object.assign(formData.list[0], row);
			isAdd.value = false;
			dialogVisible.value = true;
			break;
		case 'delete':
			ElMessageBox.confirm(`确定删除当前卡密库吗？`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					cardDeleteApi(row.id).then(() => {
						useMessage().success('删除成功');
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
	}
};

const handleBatcheDel = async () => {
	console.log(multipleSelection.value);
	if (multipleSelection.value.length <= 0) {
		useMessage().error('请选择要删除的卡密');
		return;
	}
	const data: any[] = [];
	multipleSelection.value.forEach((item) => {
		data.push(item.id);
	});
	console.log('data', data.join(','));

	try {
		const { code, msg } = await cardBatchDeleteApi({ ids: data.join(',') });
		loading.value = false;
		if (code === 0) {
			useMessage().success('删除成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 导出模板
const exports = () => {
	downBlobFile('https://oss.duomixing.com/rls/b/卡密上传模版.xlsx', {}, '卡密上传模版.xlsx');
};
const downExcelTemp = () => {
	// 自定义模板
	const link = document.createElement('a');
	link.href = 'https://oss.duomixing.com/rls/b/卡密上传模版.xlsx';
	document.body.appendChild(link);
	link.click();
	window.setTimeout(() => {
		document.body.removeChild(link);
	}, 0);
};
const handleAddList = () => {
	formData.list.push({
		id: '',
		cardNumber: '',
		secretNum: '',
	});
};

const handleDelList = (index: number) => {
	formData.list.splice(index, 1);
};
const onResetForm = () => {
	dialogFormRef.value.resetFields();
	formData.list = [
		{
			id: '',
			cardNumber: '',
			secretNum: '',
		},
	];
	dialogVisible.value = false;
	getDataList();
};

const onSubmit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid: any) => {
		if (!valid) return;
		const params: any = {};
		if (isAdd.value) {
			params.libraryId = route.query.id;
			params.csList = formData.list;
		} else {
			Object.assign(params, formData.list[0]);
		}
		console.log('params', params);
		try {
			const { code, msg } = isAdd.value ? await cardSaveApi(params) : await cardUpdateApi(params);
			if (code === 0) {
				useMessage().success(`${!isAdd.value ? '编辑' : '添加'}成功`);
				onResetForm();
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		} finally {
			loading.value = false;
		}
	});
};

/**
 * 计算请求头部信息
 */
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.getToken(),
		'TENANT-ID': Session.getTenant(),
	};
});
/**
 * 上传进度条变化事件
 */
const handleFileUploadProgress = () => {
	stateData.upload.isUploading = true;
};
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
	const type = rawFile.name.split('.')[1];
	const data = ['xlsx', 'xls'];
	const fileType = data?.includes(type);
	if (!fileType)
		ElNotification({
			title: '温馨提示',
			message: '上传的文件不符合所需的格式！',
			type: 'warning',
		});
	return fileType;
};
/**
 * 上传的文件超出限制条数时
 * @param files
 */
const handleFileExceed: UploadProps['onExceed'] = (files) => {
	uploadRef.value!.clearFiles();
	const file = files[0] as UploadRawFile;
	uploadRef.value!.handleStart(file);
};
/**
 * 上传失败事件处理
 */
const handleFileError = () => {
	useMessage().error('上传失败,数据格式不合法!');
	stateData.upload.open = false;
};
/**
 * 上传成功事件处理
 * @param {any} response - 上传成功的响应结果
 */
const handleFileSuccess = (response: any) => {
	console.log('response', response);
	stateData.upload.isUploading = false;
	stateData.upload.open = false;
	uploadRef.value.clearFiles();

	// 校验失败
	if (response.code === 1) {
		useMessage().error(response.msg);
		uploadRef.value.clearFiles();
		// 刷新表格
		getDataList();
	} else if (response.code === 0) {
		// 无论接口返回成功或者失败都需要弹出
		// const { importNum, successSum, failSum, failExcels, isFail } = response.data;
		// stateData.importNum = importNum;
		// stateData.successSum = successSum;
		// stateData.failSum = failSum;
		// stateData.failExcels = failExcels;
		// stateData.resultVisible = true;
		// stateData.isFail = isFail;

		useMessage().success(response.msg ? response.msg : '导入成功');
		// 刷新表格
		getDataList();
	} else {
		useMessage().error(response.msg ? response.msg : '导入失败');
	}
};

// // 导出失败记录
// const handleExportFailRecords = () => {
// 	if (stateData.failExcels && stateData.failExcels.length > 0) {
// 		exportFailRecords('/mall/order/export', stateData.failExcels, `批量发货失败记录.xlsx`);
// 		stateData.resultVisible = false;
// 	}
// };

/**
 * 提交表单，触发上传
 */
const submitFileForm = () => {
	uploadRef.value.submit();
};
</script>
<style scoped lang="scss">
.box-body {
	::v-deep.el-card__body {
		padding-top: 0px;
	}
}
.acea-row {
	display: flex;
	align-items: center;
	.after-line {
		display: flex;
		align-items: center;
		margin-right: 16px;
		color: rgba(0, 0, 0, 0.85);
		cursor: pointer;
	}
	.ht_title {
		font-weight: 500;
		font-size: 18px;
	}
}

//页面中带tab的表单外边框
.form-boder-padding {
	padding: 25px 30px 40px 30px;
}
//表单内输入框宽度
.from-ipt-width {
	width: 350px !important;
}
.from-tips {
	font-size: 12px;
	color: #909399;
	line-height: 12px;
	text-align: left;
}
.form-btn {
	width: 700px;
}
.custom-date-picker {
	:deep(.el-input__inner) {
		/* 或者其他适当的类 */
		width: 200px !important; /* 或者你想要的任何宽度 */
	}
}
:deep(.el-form-item__label) {
	font-size: 12px;
}
.custom-radio-group {
	:deep(.el-form-item__content) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
