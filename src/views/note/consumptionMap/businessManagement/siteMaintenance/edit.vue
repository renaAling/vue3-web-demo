<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer mb-4">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-scrollbar>
				<div class="m-5 flex" style="justify-content: space-between; width: 600px">
					<span class="addTitle">地图管理</span>
				</div>
				<div style="width: 700px; margin-left: 50px">
					<el-form :model="form" label-width="100px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
						<el-form-item label="站点名称：" prop="name">
							{{ form.name }}
						</el-form-item>
						<el-form-item label="地图：" prop="mapUrl">
							<upload-img v-model:image-url="form.mapUrl" :fileType="['image/jpeg', 'image/jpg', 'image/png']" width="400px" height="300px" />
						</el-form-item>
						<div class="tips">支持上传JPEG、PNG等</div>
					</el-form>
					<div class="flex align-center justify-center mt-10">
						<span class="dialog-footer">
							<el-button @click="resetForm">取消</el-button>
							<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
						</span>
					</div>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import router from '/@/router';
import { putSubwayStationUpdateMapApi } from '/@/api/note/noteInfo';

const route = useRoute();
const dataFormRef = ref();
const loading = ref(false);
const form = ref<any>({
	id: route.query.id,
	name: route.query.name,
	mapUrl: route.query.mapUrl,
});
// 定义校验规则
const dataRules = ref({});
onMounted(() => {
	console.log('route.query', route.query);
});
// 关闭
const resetForm = () => {
	ElMessageBox.confirm('请确认是否取消编辑?', '取消编辑', {
		distinguishCancelAndClose: true,
		confirmButtonText: '确认',
		cancelButtonText: '取消',
	})
		.then(async () => {
			dataFormRef.value.resetFields();
			router.push({
				path: '/note/consumptionMap/businessManagement/siteMaintenance/index',
			});
		})
		.catch(() => {
			return;
		});
};
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		console.log('form', form.value);
		const { code, msg } = await putSubwayStationUpdateMapApi(form.value);
		if (code === 0) {
			useMessage().success('编辑成功');
			dataFormRef.value.resetFields();
			router.push({
				path: '/note/consumptionMap/businessManagement/siteMaintenance/index',
			});
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
</script>
<style lang="scss" scoped>
.back-icon {
	font-size: 20px;

	.el-icon {
		height: 100%;
	}
}
.addTitle {
	font-size: 20px;
	font-weight: 600;
	color: #000;
}
.tips {
	color: #999;
	margin-left: 100px;
}
</style>
