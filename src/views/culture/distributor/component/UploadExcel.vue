<template>
	<el-dialog
    v-model="state.upload.open"
    :title="prop.title"
    draggable
    :close-on-click-modal="false"
  >
		<el-upload
			ref="uploadRef"
			:limit="1"
			accept=".xlsx, .xls"
			:headers="headers"
			:action="baseURL + other.adaptationUrl(url)"
			:disabled="state.upload.isUploading"
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
						<el-link
							type="primary"
							:underline="false"
							style="font-size: 12px; vertical-align: baseline"
							@click="downExcelTemp"
							v-if="tempUrl || customTempUrl"
							>下载模板
						</el-link>
					</div>
					<!-- <div style="color: #ff0000">单次上传不超过500条</div> -->
				</div>
			</template>
		</el-upload>
		<template #footer>
			<el-button type="primary" @click="submitFileForm">确认</el-button>
			<el-button @click="state.upload.open = false">取消</el-button>
		</template>
	</el-dialog>

	<!--校验失败错误数据-->
	<el-dialog title="批量导入结果" v-model="state.resultVisible" width="40%">
		<div class="content">
			<div>导入完成</div>
			<div>导入条数{{ state.importNum }}条</div>
			<div>成功{{ state.successSum }}条</div>
			<div>失败{{ state.failSum }}条</div>
		</div>
		<div style="text-align: center" v-if="state.isFail">
			<el-button @click="handleExportFailRecords" type="primary">导出失败记录 </el-button>
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="upload-excel">
import { ElNotification, UploadProps, UploadRawFile } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';
import { exportFailRecords } from '/@/api/culture/orderManage';

const emit = defineEmits(['refreshDataList']);
const prop = defineProps({
	url: {
		type: String,
	},
	title: {
		type: String,
	},
	tempUrl: {
		type: String,
	},
	customTempUrl: {
		type: String,
	},
	fileType: {
		type: Array,
		default: () => ['xlsx', 'xls'],
	},
});

const uploadRef = ref();

const state = reactive({
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

/**
 * 下载模板文件
 */
const downExcelTemp = () => {
	if (prop.customTempUrl) {
		// 自定义模板
		const link = document.createElement('a');
		link.href = prop.customTempUrl;
		// link.download = 'temp.zip';
		document.body.appendChild(link);
		link.click();
		window.setTimeout(() => {
			document.body.removeChild(link);
		}, 0);
	} else {
		other.downBlobFile(other.adaptationUrl(prop.tempUrl), {}, `temp.xlsx`);
	}
};

/**
 * 上传进度条变化事件
 */
const handleFileUploadProgress = () => {
	state.upload.isUploading = true;
};
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
	const type = rawFile.name.split('.')[1];
	const fileType = prop.fileType?.includes(type);
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
	state.upload.open = false;
};

/**
 * 上传成功事件处理
 * @param {any} response - 上传成功的响应结果
 */
const handleFileSuccess = (response: any) => {
	console.log('response', response);
	state.upload.isUploading = false;
	state.upload.open = false;
	uploadRef.value.clearFiles();

	// 校验失败
	if (response.code === 1) {
		useMessage().error('导入失败');
		uploadRef.value.clearFiles();
		// 刷新表格
		emit?.('refreshDataList');
	} else if (response.code === 0) {
		// 无论接口返回成功或者失败都需要弹出
		const { importNum, successSum, failSum, failExcels, isFail } = response.data;
		state.importNum = importNum;
		state.successSum = successSum;
		state.failSum = failSum;
		state.failExcels = failExcels;
		state.resultVisible = true;
		state.isFail = isFail;

		// useMessage().success(response.msg ? response.msg : '导入成功');
		// 刷新表格
		emit?.('refreshDataList');
	} else {
		useMessage().error(response.msg ? response.msg : '导入失败');
	}
};

// 导出失败记录
const handleExportFailRecords = () => {
	if (state.failExcels && state.failExcels.length > 0) {
		exportFailRecords('/mall/order/export', state.failExcels, `失败记录.xlsx`);
		state.resultVisible = false;
	}
};

/**
 * 提交表单，触发上传
 */
const submitFileForm = () => {
	uploadRef.value.submit();
};

/**
 * 显示上传文件对话框，并清除上传信息
 */
const show = () => {
	state.upload.isUploading = false;
	state.upload.open = true;
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

// 暴露变量
defineExpose({
	show,
});
</script>

<style scoped lang="scss">
.content {
	div {
		margin-bottom: 10px;
	}
}
</style>
