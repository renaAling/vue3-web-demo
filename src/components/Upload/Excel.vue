<!-- excel 导入组件 -->
<template>
	<el-dialog :title="prop.title" v-model="state.upload.open" :close-on-click-modal="false" draggable>
		<el-upload
			ref="uploadRef"
			:limit="1"
			accept=".xlsx, .xls"
			:headers="headers"
			:action="baseURL + other.adaptationUrl(url)"
			:disabled="state.upload.isUploading"
			:on-progress="handleFileUploadProgress"
			:on-success="handleFileSuccess"
			:on-exceed="handleFileExceed"
			:on-error="handleFileError"
			:before-upload="beforeUpload"
			:auto-upload="false"
			drag
		>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">
				{{ $t('excel.operationNotice') }}
				<em>{{ $t('excel.clickUpload') }}</em>
			</div>
			<template #tip>
				<div class="el-upload__tip text-center">
					<span>{{ $t('excel.fileFormat') }}</span>
					<el-link
						type="primary"
						:underline="false"
						style="font-size: 12px; vertical-align: baseline"
						@click="downExcelTemp"
						v-if="tempUrl || customTempUrl"
						>{{ $t('excel.downloadTemplate') }}
					</el-link>
				</div>
			</template>
		</el-upload>
		<template #footer>
			<el-button type="primary" @click="submitFileForm">{{ $t('common.confirmButtonText') }}</el-button>
			<el-button @click="state.upload.open = false">{{ $t('common.cancelButtonText') }}</el-button>
		</template>
	</el-dialog>

	<!--校验失败错误数据-->
	<el-dialog :title="$t('excel.validationFailureData')" v-model="state.errorVisible">
		<el-table border :data="state.errorData">
			<el-table-column property="lineNum" :label="$t('excel.lineNumbers')" width="100"></el-table-column>
			<el-table-column property="errors" :label="$t('excel.misDescription')" show-overflow-tooltip>
				<template v-slot="scope">
					<el-tag type="danger" v-for="error in scope.row.errors" :key="error">{{ error }}</el-tag>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>

<script setup lang="ts" name="upload-excel">
import { ElNotification, UploadProps, UploadRawFile } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';

const emit = defineEmits(['sizeChange', 'refreshDataList']);
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
	errorVisible: false,
	errorData: [],
	dialog: {
		title: '',
		isShowDialog: false,
	},
	upload: {
		open: false,
		isUploading: false,
	},
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
	state.upload.isUploading = false;
	state.upload.open = false;
	uploadRef.value.clearFiles();

	// 校验失败
	if (response.code === 1) {
		useMessage().error('导入失败，以下数据不合法');
		state.errorVisible = true;
		state.errorData = response.data.errorMessageList;
		uploadRef.value.clearFiles();
		// 刷新表格
		emit?.('refreshDataList');
	} else if (response.code === 0) {
		if (response.data.code === 1) {
			state.errorVisible = true;
			state.errorData = response.data.data.errorMessageList;
			return;
		}
		useMessage().success(response.msg ? response.msg : '导入成功');
		// 刷新表格
		emit?.('refreshDataList', response);
	} else {
		useMessage().error(response.msg ? response.msg : '导入失败');
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

<style scoped></style>
