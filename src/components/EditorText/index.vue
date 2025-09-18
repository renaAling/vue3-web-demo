<template>
	<div class="flex flex-col border border-br" :style="styles">
		<Toolbar class="border-b border-br" :defaultConfig="toolbarConfig" :editor="editorRef" :mode="mode" />
		<Editor
			class="flex-1 overflow-y-auto"
			:mode="mode"
			:defaultConfig="state.editorConfig"
			v-model="state.editorVal"
			@onCreated="handleCreated"
			@onChange="handleChange"
		/>
	</div>
</template>

<script setup lang="ts" name="wngEditor">
import '@wangeditor/editor/dist/css/style.css';
import { reactive, shallowRef, watch, onBeforeUnmount, CSSProperties } from 'vue';
// @ts-ignore
import { IDomEditor } from '@wangeditor/editor';
import { Toolbar, Editor } from '@wangeditor/editor-for-vue';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';
const { proxy } = getCurrentInstance();

// 定义父组件传过来的值
const props = defineProps({
	// 是否禁用
	disable: {
		type: Boolean,
		default: () => false,
	},
	// 内容框默认 placeholder
	placeholder: {
		type: String,
		default: () => '请输入内容...',
	},
	// https://www.wangeditor.com/v5/getting-started.html#mode-%E6%A8%A1%E5%BC%8F
	// 模式，可选 <default|simple>，默认 default
	mode: {
		type: String,
		default: () => 'default',
	},
	// 高度
	height: {
		type: String,
		default: () => '310',
	},
	// 宽度
	width: {
		type: String,
		default: () => 'auto',
	},
	// 双向绑定，用于获取 editor.getHtml()
	getHtml: String,
	// 双向绑定，用于获取 editor.getText()
	getText: String,
	uploadFileUrl: {
		type: String,
		default: `/admin/sys-file/upload`,
	},
	excludeKeys: {
		type: Array,
		default: () => [],
	},
});
const toolbarConfig = { excludeKeys: props.excludeKeys };
// 定义子组件向父组件传值/事件
const emit = defineEmits(['update:getHtml', 'update:getText']);

// 定义上传需要的请求头信息
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});

// 定义上传需要的字段信息
const uploadAttr = reactive({
	fieldName: 'file',
	maxFileSize: 10 * 1024 * 1024, // 10MB
	server: proxy.baseURL + props.uploadFileUrl,
	headers: headers,
	customInsert(res, insertFn) {
		insertFn(res.data.url);
	},
});

const editorRef = shallowRef();
const state = reactive({
	editorConfig: {
		placeholder: props.placeholder,
		MENU_CONF: {
			uploadImage: uploadAttr,
			uploadVideo: uploadAttr,
		},
	},
	editorVal: props.getHtml,
});

const styles = computed<CSSProperties>(() => ({
	height: other.addUnit(props.height),
	width: other.addUnit(props.width),
	'z-index': 1000,
}));

// 编辑器回调函数
const handleCreated = (editor: IDomEditor) => {
	editorRef.value = editor;
};

// 编辑器内容改变时
const handleChange = (editor: IDomEditor) => {
	emit('update:getHtml', editor.getHtml());
	emit('update:getText', editor.getText());
};

// 页面销毁时
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor == null) return;
	emit('update:getHtml', '');
	emit('update:getText', '');
	editor.destroy();
});

// 监听是否禁用改变
onMounted(() => {
	nextTick(() => {
		const editor = editorRef.value;
		if (editor == null) return;
		props.disable ? editor.disable() : editor.enable();
	});
});

// 监听双向绑定值改变，用于回显
watch(
	() => props.getHtml,
	(val) => {
		state.editorVal = val;
	},
	{
		deep: true,
	}
);
</script>
<!-- <template>
	<div class="flex flex-col border border-br" :style="styles">
		<Toolbar class="border-b border-br" :defaultConfig="toolbarConfig" :editor="editorRef" :mode="mode" />
		<Editor
			class="flex-1 overflow-y-auto"
			:mode="mode"
			:defaultConfig="state.editorConfig"
			v-model="state.editorVal"
			@onCreated="handleCreated"
			@onChange="handleChange"
		/>
		<div class="text-sm text-gray-500 px-4 py-1">{{ textLength }} / {{ maxChars }}</div>
	</div>
</template>

<script setup lang="ts" name="wngEditor">
import '@wangeditor/editor/dist/css/style.css';
import { reactive, shallowRef, watch, onBeforeUnmount, CSSProperties, computed, nextTick, onMounted } from 'vue';
import { getCurrentInstance } from 'vue';
// @ts-ignore
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { Toolbar, Editor } from '@wangeditor/editor-for-vue';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';

const { proxy } = getCurrentInstance();
// 定义父组件传过来的值
const props = defineProps({
	disable: { type: Boolean, default: false },
	placeholder: { type: String, default: '请输入内容...' },
	mode: { type: String, default: 'default' },
	height: { type: String, default: '310' },
	width: { type: String, default: 'auto' },
	getHtml: { type: String, default: '' },
	getText: { type: String, default: '' },
	uploadFileUrl: { type: String, default: `/admin/sys-file/upload` },
	excludeKeys: { type: Array, default: () => [] },
	maxChars: { type: Number, default: 300 }, // 👈 新增：最大字符数
});
const toolbarConfig = { excludeKeys: props.excludeKeys};
const emit = defineEmits(['update:getHtml', 'update:getText']);

const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});

const uploadAttr = reactive({
	fieldName: 'file',
	maxFileSize: 10 * 1024 * 1024,
	server: proxy.baseURL + props.uploadFileUrl,
	headers: headers,
	customInsert(res: any, insertFn: (url: string) => void) {
		insertFn(res.data.url);
	},
});

const editorRef = shallowRef();
const state = reactive({
	editorConfig: {
		placeholder: props.placeholder,
		MENU_CONF: {
			uploadImage: uploadAttr,
			uploadVideo: uploadAttr,
		},
		onCreated: (editor: IDomEditor) => {
			editorRef.value = editor;
		},
		onChange: (editor: IDomEditor) => {
			handleChange(editor);
		},
	} as Partial<IEditorConfig>,
	editorVal: props.getHtml,
});

// 👇 计算当前文本长度
const textLength = computed(() => {
	const editor = editorRef.value;
	if (!editor) return 0;
	return editor.getText().replace(/\n/g, '').length; // 去掉换行符（可选）
});
// 编辑器回调函数
const handleCreated = (editor: IDomEditor) => {
	editorRef.value = editor;
};

// 监听内容变化并限制字数
const handleChange = (editor: IDomEditor) => {
	const text = editor.getText();
	const len = text.replace(/\n/g, '').length;

	// 👇 超出字数限制时，截断内容
	if (len > props.maxChars) {
		const remainingText = text.slice(0, props.maxChars);
		// 使用 editor.setHtml() 或 editor.setText() 的替代方案
		editor.setHtml(remainingText); // 设置纯文本（保留换行）
		// 或者使用：
		// 保留 HTML 结构（慎用）
		// editor.dangerouslyInsertHtml(remainingText);
		// proxy.$message?.warn?.(`最多只能输入 ${props.maxChars} 个字符`);
	}

	// 同步输出
	emit('update:getHtml', editor.getHtml());
	emit('update:getText', editor.getText());
};

// 页面销毁
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor == null) return;
	editor.destroy();
});

// 监听禁用状态
onMounted(() => {
	nextTick(() => {
		const editor = editorRef.value;
		if (editor == null) return;
		props.disable ? editor.disable() : editor.enable();
	});
});

// 监听外部 v-model 回显
watch(
	() => props.getHtml,
	(newVal) => {
		const editor = editorRef.value;
		if (!editor) return;
		// 避免重复设置
		if (editor.getHtml() !== newVal) {
			state.editorVal = newVal;
		}
	},
	{ deep: true }
);

// 👇 动态样式
const styles = computed<CSSProperties>(() => ({
	height: other.addUnit(props.height),
	width: other.addUnit(props.width),
	'z-index': 1000,
}));
</script>
 -->
