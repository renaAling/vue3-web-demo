<template>
  <div class="upload-box">
    <!-- 上传组件部分 -->
    <el-upload action="#" :id="uuid" :class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
      :multiple="true" :disabled="self_disabled" :show-file-list="false" :http-request="handleHttpUpload"
      :before-upload="beforeUpload" :on-success="uploadSuccess" :on-error="uploadError" :drag="drag"
      :accept="fileType.join(',')">
      <!-- 仅显示上传按钮 -->
      <!-- <template> -->
      <!-- <div class="upload-empty">
          <slot name="empty">
            <el-icon v-if="showPlus">
              <Plus />
            </el-icon>
          
          </slot>
        </div> -->
      <div v-if="showPlus">
        <el-icon class="uploader-icon">
          <Plus />
        </el-icon>
        <div class="el-upload__text">点击上传</div>
      </div>

      <slot name="centerTip"></slot>
      <!-- </template> -->
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>

    <!-- 上传成功的图片展示在下面 -->
    <div v-if="imageUrls.length > 0" class="upload-preview">
      <template v-for="(url, index) in imageUrls" :key="index">
        <div class="upload-image-container">
          <img :src="url.includes('http') ? url : baseURL + url" class="upload-image" />
          <div class="upload-handle" @click.stop>
            <div class="handle-icon" @click="openPreview(index)">
              <el-icon :size="iconSize">
                <ZoomIn />
              </el-icon>
              <span v-if="iconSize">{{ $t('common.viewBtn') }}</span>
            </div>
            <div class="handle-icon" @click="deleteImg(index)" v-if="!self_disabled">
              <el-icon :size="iconSize">
                <Delete />
              </el-icon>
              <span v-if="iconSize">{{ $t('common.delBtn') }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 查看大图 -->
    <el-image-viewer v-if="imgViewVisible" :teleported="true" :url-list="imageUrls" :initial-index="initialIndex"
      @close="imgViewVisible = false" />
  </div>
</template>



<script setup lang="ts" name="UploadImg">
import { ref, computed, inject } from 'vue';
import { ElNotification, formContextKey, formItemContextKey } from 'element-plus';
import type { UploadProps, UploadRequestOptions } from 'element-plus';
import { generateUUID } from '/@/utils/other';
import request from '/@/utils/request';

interface UploadFileProps {
  imageUrls?: string[]; // 允许多个图片
  uploadFileUrl?: string; // 上传图片的 API 方法
  drag?: boolean; // 是否支持拖拽上传
  disabled?: boolean; // 是否禁用上传组件
  fileSize?: number; // 图片大小限制
  fileType?: File.ImageMimeType[]; // 图片类型限制
  height?: string; // 组件高度
  width?: string; // 组件宽度
  borderRadius?: string; // 组件边框圆角
  iconSize?: number;
  dir?: string; // 文件目录
  showPlus?: boolean; // 是否显示上传图标
  maxCount?: number; // 最大上传数量
}

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileProps>(), {
  imageUrls: () => [],  // 默认空数组，支持多图片上传
  uploadFileUrl: '/admin/sys-file/upload',
  drag: true,
  disabled: false,
  fileSize: 5,
  fileType: () => ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
  height: '150px',
  width: '150px',
  borderRadius: '8px',
  dir: '',
  showPlus: true,
  maxCount: 5 // 默认最大上传数量为 5
});

// 生成组件唯一id
const uuid = ref('id-' + generateUUID());
const baseURL = import.meta.env.VITE_DOCUMENT_FILE_URL;

// 查看图片
const imgViewVisible = ref(false);
const openPreview = (index: number) => {
  initialIndex.value = index; // 设置预览从哪一张开始
  imgViewVisible.value = true;
};

const initialIndex = ref(0);
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);

// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

// 定义事件类型
const emit = defineEmits<{
  (e: 'update:imageUrls', value: string[]): void;  // 更新图片列表
}>();

// 上传处理函数
const handleHttpUpload = async (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append('file', options.file);
  formData.append('dir', props.dir);
  try {
    const { data } = await request({
      url: props.uploadFileUrl,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
    emit('update:imageUrls', [...props.imageUrls, data.url]);  // 更新图片列表
    formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  } catch (error) {
    options.onError(error as any);
  }
};

// 删除图片
const deleteImg = (index: number) => {
  emit('update:imageUrls', props.imageUrls.filter((_, i) => i !== index));  // 删除指定图片
};

// 编辑图片
const editImg = (index: number) => {
  const dom = document.querySelector(`#${uuid.value} .el-upload__input`);
  dom && dom.dispatchEvent(new MouseEvent('click'));
};

// 判断上传文件是否合法
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 控制最大上传数量
  if (props.imageUrls.length >= props.maxCount) {
    ElNotification({
      title: '温馨提示',
      message: `最多上传${props.maxCount}张图片！`,
      type: 'warning',
    });
    return false; // 超过最大数量，阻止上传
  }

  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize;
  const imgType = props.fileType.includes(rawFile.type as File.ImageMimeType);
  if (!imgType) {
    ElNotification({
      title: '温馨提示',
      message: '上传图片不符合所需的格式！',
      type: 'warning',
    });
  }
  if (!imgSize) {
    setTimeout(() => {
      ElNotification({
        title: '温馨提示',
        message: `上传图片大小不能超过 ${props.fileSize}M！`,
        type: 'warning',
      });
    }, 0);
  }
  return imgType && imgSize;
};

// 上传成功
const uploadSuccess = () => {
  ElNotification({
    title: '温馨提示',
    message: '图片上传成功！',
    type: 'success',
  });
};

// 上传失败
const uploadError = () => {
  ElNotification({
    title: '温馨提示',
    message: '图片上传失败，请您重新上传！',
    type: 'error',
  });
};
</script>



<style scoped lang="scss">
.is-error {
  .upload {

    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {

  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;

    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);

        .upload-handle {
          opacity: 1;
        }
      }

      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderRadius);

        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }

      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }

      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);

        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }

      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);

        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;

          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }

          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }

  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}

.upload-preview {
  display: flex;
}

.upload-image-container {
  position: relative;
  display: flex;
  border: 1px solid #ebeef5;
  margin-right: 5px;

  .upload-image {
    width: 100px;
    height: 100px;
    object-fit: contain;

  }

  .upload-handle {
    display: flex;
    position: absolute;
    top: 40%;
    width: 100%;
    z-index: 99;
    display: none;

  }
}

.upload-image-container:hover {
  .upload-handle {
    display: flex;
    justify-content: space-around;
    width: 100%;
    z-index: 99;

    .handle-icon {
      cursor: pointer;
    }
  }
}
</style>