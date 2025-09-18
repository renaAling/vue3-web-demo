<template>
	<div class="doc-center">
		<div class="menu-list">
			<div class="list">
				<div class="name">
					<el-icon><CircleCheck /></el-icon>
					<span>API</span>
				</div>
				<div class="item-list">
					<div
						class="item"
						@click="handleClickInterface(item, index)"
						v-for="(item, index) in apiList"
						:class="selectInterfaceIndex === index ? 'active' : ''"
						:key="index"
					>
						<div class="name">{{ item.requestMethod }}</div>
						<div class="desc">{{ item.interfaceName }}</div>
					</div>
				</div>
			</div>
			<div class="list">
				<div class="name">
					<el-icon><Histogram /></el-icon>
					<span>SDK</span>
				</div>
				<div class="item-list">
					<div
						class="item"
						@click="handleClickSdk(item, index)"
						v-for="(item, index) in sdkList"
						:class="selectSdkIndex === index ? 'active' : ''"
						:key="index"
					>
						<div class="name">{{ item.sdkName }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="preview-section">
			<el-button type="primary" @click="downloadMarkdown(text)" class="download-md-btn" :disabled="disableDownloadBtn">下载文档 </el-button>
			<el-button type="primary" @click="downloadZip" class="download-md-btn">下载SDK </el-button>
			<MdPreview :key="renderKey" :editor-id="id" :model-value="text" theme="dark"></MdPreview>
		</div>
	</div>
</template>

<script lang="ts" name="systemDatasourceConf" setup>
import { ElMessageBox } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import '@vavt/v3-extension/lib/asset/ExportPDF.css';
import { getDocInterfaceList } from '/@/api/openPlatform/interface';
import { getDocSdkList } from '/@/api/openPlatform/sdkInfo';
import { ApiItem, SdkItem } from './types';
// 新增引入
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const route = useRoute();
const router = useRouter();
const text = ref('# Hello Editor');
const id = 'preview-only';
const apiList = ref<ApiItem[]>([]);
const sdkList = ref<SdkItem[]>([]);
const selectInterfaceIndex = ref<number | null>(0);
const selectSdkIndex = ref<number | null>(null);
const renderKey = ref(0);
const fileName = ref('example.md');
const disableDownloadBtn = ref(false);
// 获取api列表
const getApiList = () => {
	getDocInterfaceList({
		current: 1,
		size: 999,
		status: 1,
	}).then((res) => {
		apiList.value = res.data.records;
		text.value = res.data.records[0].doc ?? '';
		!text.value ? (disableDownloadBtn.value = true) : (disableDownloadBtn.value = false);
		fileName.value = res.data.records[0].interfaceName ?? '';
	});
};

// 获取sdk列表
const getSdkDirList = () => {
	getDocSdkList({
		current: 1,
		size: 10,
	}).then((res) => {
		sdkList.value = res.data.records;
	});
};

const handleClickInterface = (item: ApiItem, index: number) => {
	selectInterfaceIndex.value = index;
	selectSdkIndex.value = null;
	text.value = item.doc ?? ''; // 使用空值合并操作符提供默认值
	renderKey.value++; // 更新计数器
	fileName.value = item.interfaceName; // 更新文件名
	!text.value ? (disableDownloadBtn.value = true) : (disableDownloadBtn.value = false);
};

const handleClickSdk = (item: SdkItem, index: number) => {
	selectSdkIndex.value = index;
	selectInterfaceIndex.value = null;
	text.value = item.sdkDoc ?? ''; // 使用空值合并操作符提供默认值
	renderKey.value++; // 更新计数器
	fileName.value = item.sdkName; // 更新文件名
	!text.value ? (disableDownloadBtn.value = true) : (disableDownloadBtn.value = false);
};

// 新增方法：将markdown转换为安全HTML
const markdownToHtml = async (content: string): Promise<string> => {
	const parsedContent = await marked.parse(content);
	return DOMPurify.sanitize(parsedContent);
};

// 新增下载doc文件方法
const downloadMarkdown = async (content: string) => {
	const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
${await markdownToHtml(content)}
</body>
</html>`;

	const blob = new Blob([htmlContent], { type: 'application/msword' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = `${fileName.value}.docx`;
	link.click();
	URL.revokeObjectURL(link.href);
};

// 新增下载zip文件方法
const downloadZip = async () => {
	console.log('sdkList.value[0].sdkFileUrl', sdkList.value[0].sdkFileUrl);
	if (sdkList.value.length === 0) {
		console.error('SDK列表为空，无法下载');
		return;
	}

	const sdkFileUrl = sdkList.value[0].sdkFileUrl;
	if (!sdkFileUrl) {
		console.error('SDK文件URL为空，无法下载');
		return;
	}

	const link = document.createElement('a');
	link.href = sdkFileUrl;
	link.download = `${fileName.value}.zip`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

onMounted(() => {
	getApiList();
	getSdkDirList();
});
</script>
<style lang="scss">
.doc-center {
	display: flex;
	background-color: #3d3d3d;
	color: #fff;
	height: 100%;

	.menu-list {
		width: 200px;
		.list {
			margin-bottom: 10px;

			> .name {
				display: flex;
				align-items: center;
				font-size: 18px;
				margin-bottom: 14px;
				cursor: pointer;
				padding-left: 16px;
				padding-top: 12px;
				.el-icon {
					margin-right: 16px;
				}
			}
			.item-list {
				height: 100%;
				.item {
					display: flex;
					cursor: pointer;
					margin-bottom: 6px;
					padding: 9px 14px 9px 16px;
					font-size: 14px;
					> .name {
						margin-right: 10px;
					}
				}
				.active {
					background-color: #4785ea;
					border-radius: 6px;
				}
			}
		}
	}
	.preview-section {
		padding-top: 12px;
		width: 100%;
		height: 100%;
		.download-md-btn {
			margin-bottom: 10px;
			width: 100px;
		}
		.md-editor {
			height: 95%;
		}
	}
}
</style>
