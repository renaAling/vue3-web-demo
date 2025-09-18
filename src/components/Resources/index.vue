<template>
	<div class="material">
		<!-- 隐藏的文件输入 -->
		<input type="file" ref="fileInput" multiple :accept="fileAccept" @change="handleFileUpload" style="display: none" />
		<div class="flex flex-col material__center">
			<div class="flex operate-btn">
				<!-- 搜索框 -->
				<el-form :inline="true" @keyup.enter="refresh">
					<el-form-item label="素材文件名">
						<el-input :placeholder="$t('file.inputfileNameTip')" v-model="fileParams.original" @keyup.enter="refresh" />
					</el-form-item>
					<el-form-item label="上传日期">
						<el-date-picker
							v-model="daterangeTime"
							:clearable="false"
							@change="changeTime"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="refresh">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						<el-button icon="folder-add" type="primary" @click="triggerFileInput">
							{{ $t('material.uploadFileTip') }}
						</el-button>
						<el-button v-if="mode == 'page'" type="primary" :disabled="!select.length" @click.stop="batchFileDelete()">
							{{ $t('common.delBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="flex items-center justify-between">
				<!-- 全选复选框 -->
				<div v-if="mode == 'page'">
					<el-checkbox :disabled="!pager.lists.length" v-model="isCheckAll" @change="selectAll" :indeterminate="isIndeterminate">
						{{ $t('material.allCheck') }}
					</el-checkbox>
				</div>
				<!-- 视图切换按钮 -->
				<div class="flex items-center ml-2">
					<el-tooltip :content="$t('material.list')" placement="top">
						<div class="list-icon" :class="{ select: listShowType == 'table' }" @click="listShowType = 'table'">
							<el-icon><Expand /></el-icon>
						</div>
					</el-tooltip>
					<el-tooltip :content="$t('material.grid')" placement="top">
						<div class="list-icon" :class="{ select: listShowType == 'normal' }" @click="listShowType = 'normal'">
							<el-icon><Menu /></el-icon>
						</div>
					</el-tooltip>
				</div>
			</div>

			<!-- 文件列表内容 -->
			<div class="flex flex-col flex-1 min-h-0 mb-1 material-center__content">
				<!-- 网格视图 -->
				<el-scrollbar v-if="pager.lists.length" v-show="listShowType == 'normal'">
					<ul class="flex flex-wrap mt-4 file-list">
						<li class="file-item-wrap" v-for="item in pager.lists" :key="item.id" :style="{ width: fileSize }">
							<del-wrap @close="batchFileDelete([item.id])">
								<file-item :uri="getFileUri(item)" :file-size="fileSize" :type="type" @click="selectFile(item)">
									<div class="item-selected" v-if="isSelect(item.id)">
										<el-icon class="el-input__icon"><Check /></el-icon>
									</div>
								</file-item>
							</del-wrap>
							<div class="flex items-center justify-center mt-2 break-all">
								{{ item.original }}
							</div>
							<div class="flex items-center justify-center operation-btns">
								<popover-input
									@confirm="handleFileRename($event, item.id)"
									size="default"
									:value="item.name"
									width="400px"
									:limit="50"
									show-limit
									teleported
								>
									<el-button type="primary" link>{{ $t('material.rename') }}</el-button>
								</popover-input>
								<el-button type="primary" link @click="handleDownFile(item)">
									{{ $t('material.download') }}
								</el-button>
								<el-button type="primary" link @click="handlePreview(getFileUri(item))" v-if="type !== 'file'">
									{{ $t('material.view') }}
								</el-button>
							</div>
						</li>
					</ul>
				</el-scrollbar>

				<!-- 表格视图 -->
				<el-table
					border
					ref="tableRef"
					class="mt-4"
					v-show="listShowType == 'table'"
					:data="pager.lists"
					width="100%"
					height="100%"
					size="large"
					@row-click="selectFile"
				>
					<el-table-column width="50" align="center">
						<template #default="{ row }">
							<el-checkbox :modelValue="isSelect(row.id)" />
						</template>
					</el-table-column>
					<el-table-column label="素材缩略图" width="120">
						<template #default="{ row }">
							<file-item :uri="getFileUri(row)" file-size="50px" :type="type"></file-item>
						</template>
					</el-table-column>
					<el-table-column label="素材文件名" min-width="100" show-overflow-tooltip>
						<template #default="{ row }">
							<el-link @click.stop="handlePreview(getFileUri(row))" :underline="false">
								{{ row.original }}
							</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="上传日期" min-width="100" />
					<el-table-column prop="createBy" label="上传账号手机号" min-width="100" />
					<el-table-column label="操作" width="150" fixed="right">
						<template #default="{ row }">
							<div class="inline-block">
								<popover-input
									@confirm="handleFileRename($event, row.id)"
									size="default"
									:value="row.name"
									width="400px"
									:limit="50"
									show-limit
									teleported
								>
									<el-button type="primary" link>重命名</el-button>
								</popover-input>
							</div>
							<div class="inline-block">
								<el-button type="primary" link @click.stop="handlePreview(getFileUri(row))"> 查看 </el-button>
							</div>
							<div class="inline-block">
								<el-button type="primary" link @click.stop="batchFileDelete([row.id])"> 删除 </el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>

				<!-- 空状态 -->
				<div class="flex items-center justify-center flex-1" v-if="!pager.lists.length">{{ $t('el.transfer.noData') }}~</div>
			</div>

			<!-- 分页 -->
			<div>
				<pagination v-bind="pager" @change="getFileList" @current-change="currentChangeHandle" layout="total, prev, pager, next, jumper" />
			</div>
		</div>

		<!-- 右侧选择面板 -->
		<div class="material__right" v-if="mode == 'picker'"></div>

		<!-- 预览组件 -->
		<preview v-model="showPreview" :url="previewUrl" :type="type" />
	</div>
</template>

<script lang="ts" setup>
import { ElMessage, ElLoading } from 'element-plus';
import { useCate, useFile } from './hook';
import FileItem from './file.vue';
import Preview from './preview.vue';
import other from '/@/utils/other';
import { batchUploadFiles } from '/@/api/culture/common';
// 异步组件
const PopoverInput = defineAsyncComponent(() => import('/@/components/PopoverInput/index.vue'));

// 组件属性
const props = defineProps({
	fileSize: {
		type: String,
		default: '100px',
	},
	current: {
		type: Number,
		default: 1,
	},
	type: {
		type: String,
		default: 'image',
	},
	mode: {
		type: String,
		default: 'picker',
	},
	pageSize: {
		type: Number,
		default: 15,
	},
});

const emit = defineEmits(['change']);
const { current } = toRefs(props);

// 根据文件类型计算对应的值
const typeValue = computed<number>(() => {
	switch (props.type) {
		case 'image':
			return 10;
		case 'video':
			return 20;
		case 'file':
			return 30;
		default:
			return 0;
	}
});

// 计算文件选择器的accept属性
const fileAccept = computed(() => {
	switch (props.type) {
		case 'image':
			return 'image/*';
		case 'video':
			return 'video/*';
		default:
			return '*';
	}
});

// 隐藏的文件输入元素引用
const fileInput = ref<HTMLInputElement | null>(null);

// 预览相关状态
const previewUrl = ref('');
const showPreview = ref(false);

// 分类相关hook
const { cateId, getCateLists } = useCate(typeValue.value);

// 文件相关hook
const {
	tableRef,
	listShowType,
	pager,
	fileParams,
	select,
	isCheckAll,
	isIndeterminate,
	getFileList,
	refresh,
	batchFileDelete,
	selectFile,
	isSelect,
	clearSelect,
	selectAll,
	handleFileRename,
} = useFile(cateId, typeValue, current, props.pageSize);

const currentChangeHandle = (val: number) => {
	pager.current = val;
}

/**
 * 触发文件选择
 */
const triggerFileInput = () => {
	fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) return;

  // 显示全局加载状态
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '文件批量上传中...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  try {
    // 1. 过滤有效文件
    const validFiles = Array.from(files).filter(file => isValidFileType(file));
    
    // 如果有文件被过滤掉，显示提示
    if (validFiles.length !== files.length) {
      ElMessage.warning(`有 ${files.length - validFiles.length} 个文件类型不符合要求`);
    }

    if (validFiles.length === 0) {
      ElMessage.warning('没有有效的可上传文件');
      return;
    }

    const formData = new FormData();
    formData.append('groupId', cateId.value.toString());
    formData.append('type', typeValue.value.toString());
    
    validFiles.forEach(file => {
      formData.append('files', file);
    });

    // 3. 调用批量上传接口
    const res = await batchUploadFiles(formData);
    
    // 4. 处理上传结果
    if (res?.ok) {
      ElMessage.success(`成功上传 ${validFiles.length} 个文件`);
      refresh();
    } else {
      ElMessage.error(res.message || '文件上传失败');
    }

    // 清空文件输入
    target.value = '';
  } catch (error) {
    console.error('批量上传出错:', error);
    ElMessage.error('批量上传过程中出错');
  } finally {
    loadingInstance.close();
  }
};

/**
 * 检查文件类型是否有效
 * @param file 文件对象
 */
const isValidFileType = (file: File): boolean => {
	if (props.type === 'image') {
		const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
		return validTypes.includes(file.type);
	}
	return true; // 如果不是图片类型检查，则默认允许
};

/**
 * 获取数据
 */
const getData = async () => {
	await getCateLists();
	getFileList();
};

/**
 * 处理预览
 * @param url 预览的URL
 */
const handlePreview = (url: string) => {
	previewUrl.value = url;
	showPreview.value = true;
};

/**
 * 处理下载文件
 * @param item 文件项对象
 */
const handleDownFile = (item: any) => {
	other.downBlobFile(`/admin/sys-file/oss/file?fileName=${item.fileName}`, {}, item.original);
};

/**
 * 获取文件URI
 * @param item 文件项
 * @returns 文件URI
 */
const getFileUri = (item: any) => {
	return item.fileName;
	// 如果需要完整URL，可以使用下面这行
	// return `${proxy.baseURL}/admin/sys-file/oss/file?fileName=${item.fileName}`
};

const daterangeTime = ref();
const changeTime = (val: any) => {
	fileParams.startTime = `${val[0]} 00:00:00`;
	fileParams.endTime = `${val[1]} 23:59:59`;
};

const resetQuery = () => {
	fileParams.original = '';
	fileParams.startTime = '';
	fileParams.endTime = '';
	daterangeTime.value = [];
	refresh();
};

// 监听分类ID变化
watch(cateId, () => {
	fileParams.original = '';
	refresh();
});

// 监听选中文件变化
watch(
	select,
	(val: any[]) => {
		emit('change', val);
		if (val.length == pager.lists.length && val.length !== 0) {
			isIndeterminate.value = false;
			isCheckAll.value = true;
			return;
		}
		if (val.length > 0) {
			isIndeterminate.value = true;
		} else {
			isCheckAll.value = false;
			isIndeterminate.value = false;
		}
	},
	{ deep: true }
);

// 组件挂载时初始化数据
onMounted(() => {
	props.mode == 'page' && getData();
});

// 暴露方法给父组件
defineExpose({
	clearSelect,
});
</script>

<style scoped lang="scss">
.material {
	@apply h-full min-h-0 flex flex-1;
	&__center {
		flex: 1;
		min-width: 0;
		min-height: 0;
		padding: 16px 16px 0;
		.list-icon {
			border-radius: 3px;
			display: flex;
			padding: 5px;
			cursor: pointer;
			&.select {
				@apply text-primary bg-primary-light-8;
			}
		}
		.file-list {
			.file-item-wrap {
				margin-right: 16px;
				line-height: 1.3;
				cursor: pointer;
				.item-selected {
					display: flex;
					align-items: center;
					justify-content: center;
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					border-radius: 4px;
					background-color: rgba(0, 0, 0, 0.5);
					box-sizing: border-box;
				}
				.operation-btns {
					height: 28px;
					visibility: hidden;
				}
				&:hover .operation-btns {
					visibility: visible;
				}
			}
		}
	}
	&__right {
		@apply border-l border-br flex flex-col;
		width: 130px;
		.select-lists {
			padding: 10px;

			.select-item {
				width: 100px;
				height: 100px;
			}
		}
	}
}
</style>
