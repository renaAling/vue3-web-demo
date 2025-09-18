<template>
	<div class="layout-padding">
		<MdEditor :toolbars="toolbars" v-model="text" @onSave="handleSave" class="md-editor"> </MdEditor>
		<footer class="footer">
			<el-button type="primary" @click="handleSave" :loading="loading">保存</el-button>
			<el-button @click="() => router.back()">取消</el-button>
		</footer>
	</div>
</template>

<script lang="ts" name="systemDatasourceConf" setup>
import { ElMessageBox } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { MdEditor, ToolbarNames } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ExportPDF } from '@vavt/v3-extension';
import '@vavt/v3-extension/lib/asset/ExportPDF.css';
import { updateInterface, getMarkdownString } from '/@/api/openPlatform/interface';
import { getSdkDetailInfo, updateSdkDoc } from '/@/api/openPlatform/sdkInfo';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const text = ref('');

const toolbars: ToolbarNames[] = [
	'bold',
	'underline',
	'italic',
	'-',
	'title',
	'strikeThrough',
	'sub',
	'sup',
	'quote',
	'unorderedList',
	'orderedList',
	'task',
	'-',
	'codeRow',
	'code',
	'link',
	'image',
	'table',
	'mermaid',
	'katex',
	'-',
	'revoke',
	'next',
	'save',
	'=',
	0,
	// 'pageFullscreen',
	// 'fullscreen',
	// 'preview',
	// 'previewOnly',
	// 'htmlPreview',
	// 'catalog',
	// 'github',
];

const getMarkdown = async () => {
	try {
		if (route.query.type === 'sdk') {
			const sdkRes = await getSdkDetailInfo(route.query.id as string);
			if (sdkRes.code === 0) {
				text.value = sdkRes.data.sdkDoc;
			}
		} else {
			const res = await getMarkdownString(route.query.id as string);
			if (res.code === 0) {
				text.value = res.data;
			}
		}
	} catch {
		useMessage().error('获取文档失败');
	}
};
const handleSave = () => {
	loading.value = true;
	let params = {
		id: route.query.id,
		doc: text.value,
	};
	if (route.query.type === 'sdk') {
		updateSdkDoc(params)
			.then((res) => {
				loading.value = false;
				if (res.code == 0) {
					useMessage().success('保存成功');
					router.back();
				}
			})
			.catch((err) => {
				loading.value = false;
				console.log('err', err);
			});
	} else {
		updateInterface(params)
			.then((res) => {
				loading.value = false;
				if (res.code == 0) {
					useMessage().success('保存成功');
					router.back();
				}
			})
			.catch((err) => {
				loading.value = false;
				console.log('err', err);
			});
	}
};
onMounted(() => {
	getMarkdown();
});
</script>
<style lang="scss" scoped>
.md-editor {
	width: 100%;
	height: 100%;
	margin-bottom: 68px;
}
.footer {
	display: flex;
	justify-content: center;
}
</style>
