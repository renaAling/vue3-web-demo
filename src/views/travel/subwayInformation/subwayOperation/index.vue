<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="form" ref="queryRef" :inline="true">
					<el-form-item label="URL" prop="interfaceUrl">
						<el-input placeholder="请输入列车运行图url" style="width: 500px" v-model="form.interfaceUrl" clearable :disabled="!isEdit" />
					</el-form-item>
					<el-form-item>
						<!-- <el-button v-if="!isEdit" type="primary" @click="getSee">查看</el-button> -->
						<el-button v-if="!isEdit" type="primary" @click="handleEdit">编辑</el-button>
						<el-button v-if="isEdit" type="primary" @click="onSubmit"> 保存 </el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<div class="content">
				<iframe id="unityiframe" ref="iframeRef" name="iframeContain" seamless scrolling="yes" :src="iframeUrl" class="iframe"> </iframe>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { getInterfaceConfigGetUrlApi, putInterfaceConfigUpdateApi } from '/@/api/travel/subwayInformation';

const iframeRef = ref();
const isEdit = ref(false);
const form = ref<any>({
	type: 1, // 接口类型：1.列车运行表、2.列车时刻表、3.列车运行实时信息、4.列车拥挤详情、5.强冷强弱 6.出战信息图
	id: '',
	interfaceUrl: '',
});
const iframeUrl = ref('');

onMounted(() => {
	getDataList();
});

const handleEdit = () => {
	isEdit.value = true;
};

const getDataList = async () => {
	try {
		const { code, data, msg } = await getInterfaceConfigGetUrlApi({ type: form.value.type });
		if (code === 0) {
			form.value.id = data.id;
			form.value.interfaceUrl = data.interfaceUrl || '';
			iframeUrl.value = form.value.interfaceUrl;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const onSubmit = async () => {
	try {
		const { code, msg } = await putInterfaceConfigUpdateApi(form.value);
		if (code === 0) {
			isEdit.value = false;
			iframeUrl.value = form.value.interfaceUrl;
			useMessage().success('保存成功');
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
<style lang="scss" scoped>
.iframe {
	width: 100%;
	height: calc(100vh - 70px);
	border: 0;
}
</style>
