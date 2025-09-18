<template>
	<el-dialog v-model="resourcesDialogVisible" title="素材管理" height="400px">
		<div class="material">
			<div class="flex flex-col material__center">
				<!-- 视图切换按钮 -->
				<div class="flex items-center justify-end mb-4">
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

				<!-- 文件列表内容 -->
				<div class="flex flex-col flex-1 min-h-0 mb-1 material-center__content">
					<!-- 网格视图 -->
					<el-scrollbar v-if="pager.lists.length" v-show="listShowType == 'normal'">
						<ul class="flex flex-wrap mt-4 file-list">
							<li class="file-item-wrap" v-for="item in pager.lists" :key="item.id" :style="{ width: '100px' }">
								<file-item :uri="getFileUri(item)" :file-size="'100px'" type="image" @click="selectFile(item)">
									<div class="item-selected" v-if="isSelect(item.id)">
										<el-icon class="el-input__icon"><Check /></el-icon>
									</div>
								</file-item>
								<div class="flex items-center justify-center mt-2 break-all">
									{{ item.original }}
								</div>
								<div class="flex items-center justify-center operation-btns">
									<el-button type="primary" link @click="handleDownFile(item)">
										{{ $t('material.download') }}
									</el-button>
									<el-button type="primary" link @click="handlePreview(getFileUri(item))">
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
						v-show="listShowType == 'table'"
						:data="pager.lists"
						width="100%"
						height="100%"
						@row-click="selectFile"
					>
            <el-table-column width="50" align="center">
              <template #default="{ row }">
                <el-checkbox :modelValue="isSelect(row.id)" />
              </template>
            </el-table-column>
						<el-table-column label="素材缩略图" width="100">
							<template #default="{ row }">
								<file-item :uri="getFileUri(row)" file-size="50px" type="image"></file-item>
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
						<el-table-column label="操作" fixed="right">
							<template #default="{ row }">
								<div class="inline-block">
									<el-button type="primary" link @click.stop="handlePreview(getFileUri(row))"> 查看 </el-button>
								</div>
								<div class="inline-block">
									<el-button type="primary" link @click="handleDownFile(row)">{{ $t('material.download') }}</el-button>
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

			<!-- 预览组件 -->
			<preview v-model="showPreview" :url="previewUrl" type="image" />
		</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resourcesDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!select.length" @click="handleChoose">
          确定
        </el-button>
      </div>
    </template>
	</el-dialog>
</template>
<script setup lang="ts">
import { useCate, useFile } from './hook';
import FileItem from './file.vue';
import Preview from './preview.vue';
import other from '/@/utils/other';

const resourcesDialogVisible = ref(false);
const emit = defineEmits(['change']);

// 根据文件类型计算对应的值
const typeValue = computed<number>(() => {
	return 10;
});
const limit = ref(1);
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
	selectFile,
	isSelect,
} = useFile(cateId, typeValue, limit, 15);

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

const currentChangeHandle = (val: number) => {
	pager.current = val;
}

const handleChoose = () => {
  resourcesDialogVisible.value = false;
  emit('change', select.value);
}

// 监听分类ID变化
watch(cateId, () => {
	fileParams.original = '';
	refresh();
});

// 监听选中文件变化
watch(
	select,
	(val: any[]) => {
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

const openDialog = (res: any) => {
	getData();
	resourcesDialogVisible.value = true;
	if (res) {
		console.log(res);
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.material {
	@apply h-full min-h-0 flex flex-1;
  margin: -20px;
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
}
</style>
