<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" v-loading="loading">
			<el-table
				:data="isAllEdit ? state.dataList : detailList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="level" label="等级" width="60">
					<template #default="{ row }">
						<span>LV{{ row.level }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="staffSignImg" label="员工标签卡">
					<template #default="{ row, $index }">
						<el-upload
							class="upload-box"
							list-type="picture-card"
							action="#"
							:show-file-list="false"
							:http-request="handleTableImageUpload.bind(null, 'staffSignImg', row, $index)"
							:on-success="productUploadSuccess"
							accept="image/jpeg,image/png,image/gif,image/jpg"
							:before-upload="beforeUpload"
						>
							<img v-if="row.staffSignImg" :src="row.staffSignImg" class="avatar" />
							<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
						</el-upload>
						<div v-if="row.staffSignImg" class="mt-2 text-sm cursor-pointer text-blue-500" @click="handlePictureCardPreview(row.staffSignImg)">
							查看大图
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="noStaffSignImg" label="非员工标签卡">
					<template #default="{ row, $index }">
						<el-upload
							class="upload-box"
							list-type="picture-card"
							action="#"
							:show-file-list="false"
							:http-request="handleTableImageUpload.bind(null, 'noStaffSignImg', row, $index)"
							:on-success="productUploadSuccess"
							accept="image/jpeg,image/png,image/gif,image/jpg"
							:before-upload="beforeUpload"
						>
							<img v-if="row.noStaffSignImg" :src="row.noStaffSignImg" class="avatar" />
							<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
						</el-upload>
						<div v-if="row.noStaffSignImg" class="mt-2 text-sm cursor-pointer text-blue-500" @click="handlePictureCardPreview(row.noStaffSignImg)">
							查看大图
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="signListImg" label="签到页背景图">
					<template #default="{ row, $index }">
						<el-upload
							class="upload-box"
							list-type="picture-card"
							action="#"
							:show-file-list="false"
							:http-request="handleTableImageUpload.bind(null, 'signListImg', row, $index)"
							:on-success="productUploadSuccess"
							accept="image/jpeg,image/png,image/gif,image/jpg"
							:before-upload="beforeUpload"
						>
							<img v-if="row.signListImg" :src="row.signListImg" class="avatar" />
							<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
						</el-upload>
						<div v-if="row.signListImg" class="mt-2 text-sm cursor-pointer text-blue-500" @click="handlePictureCardPreview(row.signListImg)">
							查看大图
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="backgroundImg" label="会员页背景图">
					<template #default="{ row, $index }">
						<el-upload
							class="upload-box"
							list-type="picture-card"
							action="#"
							:show-file-list="false"
							:http-request="handleTableImageUpload.bind(null, 'backgroundImg', row, $index)"
							:on-success="productUploadSuccess"
							accept="image/jpeg,image/png,image/gif,image/jpg"
							:before-upload="beforeUpload"
						>
							<img v-if="row.backgroundImg" :src="row.backgroundImg" class="avatar" />
							<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
						</el-upload>
						<div v-if="row.backgroundImg" class="mt-2 text-sm cursor-pointer text-blue-500" @click="handlePictureCardPreview(row.backgroundImg)">
							查看大图
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="levelName" label="等级名称">
					<template #default="scope">
						<el-input v-model="scope.row.levelName" maxlength="10" placeholder="请输入等级名称" />
					</template>
				</el-table-column>
				<el-table-column prop="threshold" label="升级条件">
					<template #default="scope">
						<el-input-number v-model="scope.row.threshold" :min="0" :max="99999999" :step="1" :step-strictly="true" placeholder="请输入升级条件">
							<template #append>成长值</template></el-input-number
						>
					</template>
				</el-table-column>
				<el-table-column prop="ruleImg" label="权益">
					<template #default="{ row, $index }">
						<el-upload
							class="upload-box"
							list-type="picture-card"
							action="#"
							:show-file-list="false"
							:http-request="handleTableImageUpload.bind(null, 'ruleImg', row, $index)"
							:on-success="productUploadSuccess"
							accept="image/jpeg,image/png,image/gif,image/jpg"
							:before-upload="beforeUpload"
						>
							<img v-if="row.ruleImg" :src="row.ruleImg" class="avatar" />
							<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
						</el-upload>
						<div v-if="row.ruleImg" class="mt-2 text-sm cursor-pointer text-blue-500" @click="handlePictureCardPreview(row.ruleImg)">查看大图</div>
					</template>
				</el-table-column>
				<!-- <el-table-column :label="$t('common.action')" width="80">
					<template #default="scope" >
						<span style="margin-left: 12px" >
							<el-icon class="cursor-pointer" @click="handleDelete(scope.row.id)"><Delete /></el-icon>
						</span>
					</template>
				</el-table-column> -->
			</el-table>
			<el-dialog v-model="dialogVisible" class="flex justify-center">
				<img w-full :src="dialogImageUrl" alt="Preview Image" />
			</el-dialog>
			<div class="mt-2 text-sm cursor-pointer text-blue-500" v-if="isAllEdit" @click="addItem">添加等级</div>
			<div class="text-right">
				<el-button type="primary" @click="onSubmit">保存</el-button>
				<el-button @click="toBack">取消</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { getMemberLevelist, getMemberLeveSaveOrUpdate } from '../../../../api/member/member';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { uploadImage } from '/@/api/culture/common';
import { ElNotification } from 'element-plus';
import type { UploadRequestOptions, UploadProps } from 'element-plus';
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const detailList = ref<any[]>([]);
const isAllEdit = ref(false);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
// const deptProps:CascaderProps ={
// 	value: 'deptCode',
// 	label: 'deptName',
// 	children: 'childNode'
// }

onMounted(() => {
	console.log('state.dataList', state.dataList);

	console.log('this.', route);
	if (route.query?.id) {
		isAllEdit.value = false;
		const obj = {};
		Object.assign(obj, route.query);
		detailList.value.push(obj);
	} else {
		isAllEdit.value = true;
		detailList.value = [];
	}
	console.log('detailList', detailList);
});

const addItem = () => {
	console.log('state.dataList', state.dataList?.length);
	if (state.dataList) {
		state.dataList?.push({
			id: '',
			level: state.dataList?.length + 1,
			levelName: '',
			threshold: '',
			backgroundImg: '',
			staffSignImg: '',
			noStaffSignImg: '',
			signListImg: '',
			ruleImg: '',
			memberNums: 0,
		});
	} else {
		state.dataList = [];
		state.dataList.push({
			id: '',
			level: 1,
			levelName: '',
			threshold: '',
			backgroundImg: '',
			noStaffSignImg: '',
			signListImg: '',
			staffSignImg: '',
			ruleImg: '',
			memberNums: 0,
		});
	}
};

// 返回
const toBack = () => {
	router.push({ path: '/member/memberManagement/memberLevel/index' });
};

const onSubmit = async () => {
	if (!isAllEdit.value) {
		console.log('state.dataList', state.dataList);
		const param: any[] = [];
		Object.assign(param, state.dataList);
		console.log('param', param);
		if (param?.length > 0) {
			param.forEach((item) => {
				if (item?.id == detailList.value[0]?.id) {
					console.log('item', item);
					Object.assign(item, detailList.value[0]);
				}
			});
		}
		console.log('state.dataList!!!!!!!!!', state.dataList);
	}
	if (state.dataList) {
		for (const item of state.dataList) {
			console.log('item', item);

			if (!item.staffSignImg) {
				useMessage().error('请上传员工标签卡');
				return; // 跳出 onSubmit 事件
			}
			if (!item.noStaffSignImg) {
				useMessage().error('请上传非员工标签卡');
				return; // 跳出 onSubmit 事件
			}
			if (!item.signListImg) {
				useMessage().error('请上传签到页背景图');
				return; // 跳出 onSubmit 事件
			}
			if (!item.backgroundImg) {
				useMessage().error('请上传会员页背景图');
				return; // 跳出 onSubmit 事件
			}
			if (!item.levelName) {
				useMessage().error('请输入等级名称');
				return; // 跳出 onSubmit 事件
			}
			if (item.threshold < 0) {
				useMessage().error('请输入升级条件');
				return; // 跳出 onSubmit 事件
			}
			if (!item.ruleImg) {
				useMessage().error('请上传会员权益图');
				return; // 跳出 onSubmit 事件
			}
		}
	}
	console.log('state.dataList', state.dataList);
	try {
		loading.value = true;
		await getMemberLeveSaveOrUpdate(state.dataList);
		useMessage().success(t('common.editSuccessText'));
		toBack();
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 删除操作
// const handleDelete = async (id?: string) => {

// };

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		current: 1,
		size: 999999,
	},
	pageList: getMemberLevelist, // H
	descs: ['create_time'],
});
//
// const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
// 	console.log(uploadFile, uploadFiles);
// };
const handlePictureCardPreview: UploadProps['onPreview'] = (url: any) => {
	dialogImageUrl.value = url!;
	dialogVisible.value = true;
};

// 上传图片
// 多文件上传组件配置;
const uploadImageConfig = {
	fileSize: 20,
	fileType: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
};
/**
 * @description 文件上传之前判断
 * @param file 选择的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
	const imgSize = file.size / 1024 / 1024 < uploadImageConfig.fileSize;
	const imgType = uploadImageConfig.fileType.includes(file.type);
	if (!imgType)
		({
			title: '温馨提示',
			message: '上传图片不符合所需的格式！',
			type: 'warning',
		});
	if (!imgSize)
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: `上传图片大小不能超过 ${uploadImageConfig.fileSize}M！`,
				type: 'warning',
			});
		}, 0);
	return imgType && imgSize;
};
const handleTableImageUpload = async (key: string, row: any, index: number, options: UploadRequestOptions) => {
	console.log('state.dataList', state.dataList);
	console.log('row', row);
	console.log('index', index);
	console.log('options', options);
	console.log('key', key);
	let formData = new FormData();
	formData.append('file', options.file);
	formData.append('dir', 'culture');
	try {
		const { data } = await uploadImage(formData);
		console.log('上传成功', data.url);
		// row.imageUrl = data.url;
		// ruleForm.iconUrl = data.url;
		console.log('state.dataList', state.dataList);
		console.log('isAllEdit', isAllEdit);
		if (state.dataList && isAllEdit.value) state.dataList[index][key] = data.url;
		if (!isAllEdit.value) detailList.value[0][key] = data.url;
		console.log('detailList', detailList.value[0]);
		console.log('state.dataList', state.dataList);
	} catch (error) {
		options.onError(error as any);
	}
};
const productUploadSuccess = () => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传成功！',
		type: 'success',
	});
};
//  table hook
const { tableStyle } = useTable(state);
</script>
<style scoped>
.el-input-number:deep(.el-input-number__decrease) {
	display: none;
}
.el-input-number:deep(.el-input-number__increase) {
	display: none;
}
</style>
