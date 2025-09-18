<template>
	<div>
		<section class="mb-28">
			<el-form @submit.prevent :model="topicList" ref="formRef" label-width="100px" inline>
				<el-card>
					<template #header>
						<div class="flex justify-between">
							<span>专题配置</span>
							<div>
								<el-button type="primary" @click="submitForm(formRef)" :loading="loading">保存</el-button>
								<el-button type="primary" @click="previewForm()" :loading="loading">预览</el-button>
								<el-button @click="handleCancel">取消</el-button>
							</div>
						</div>
					</template>
					<section v-for="(item, index) in topicList" :key="index">
						<el-form-item label="" :prop="`topicList.${index}.imageUrl`">
							<upload-img v-model:image-url="item.imageUrl" />
						</el-form-item>
						<el-form-item label="跳转类型" :prop="`topicList.${index}.type`">
							<el-select v-model="item.type" clearable style="width: 200px">
								<el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="跳转链接" :prop="`topicList.${index}.spuCode`" v-if="item.type === 1">
							<el-select
								v-model="item.spuCode"
								filterable
								style="width: 600px"
								remote
								reserve-keyword
								placeholder="请输入关键字查询搜索"
								:remote-method="(val:any)=>getProductsList(val,item)"
								:loading="loading"
							>
								<el-option v-for="itemX in item.configProductList" :key="itemX.value" :label="itemX.label" :value="itemX.value" />
							</el-select>
						</el-form-item>
						<el-form-item label="跳转链接" :prop="`topicList.${index}.jumpUrl`" v-if="item.type === 3">
							<el-input
								v-model="item.jumpUrl"
								type="text"
								style="width: 600px"
								placeholder="输入H5跳转链接"
								maxlength="200"
								show-word-limit
								clearable
							/>
						</el-form-item>
						<el-form-item>
							<el-button type="danger" @click="removeTopic(index)" v-if="topicList.length > 1">移除</el-button>
							<el-button type="primary" @click="addTopic" v-if="index === topicList.length - 1">添加图片</el-button>
						</el-form-item>
					</section>
				</el-card>
			</el-form>
		</section>
		<Preview ref="previewRef" />
	</div>
</template>

<script setup lang="ts" name="topic">
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { TopicTypes, DictsTypes } from './types';
import { specialConfigPreview, specialConfig, productList } from '/@/api/culture/products';
import UploadImg from '/@/components/Upload/Image.vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import Preview from './preview.vue';

const previewRef = ref();
const typeList = ref<DictsTypes[]>([
	{ label: '站内商品', value: 1 },
	{ label: 'H5链接', value: 3 },
	{ label: '不跳转', value: 2 },
]);
const formRef = ref<FormInstance>();
const loading = ref(false);
const topicList = ref<TopicTypes[]>([{ jumpUrl: '', type: 2, imageUrl: '', spuCode: '', configProductList: [{ label: '请选择', value: '' }] }]);
const addTopic = () => {
	let list: TopicTypes = {
		type: 2,
		jumpUrl: '',
		imageUrl: '',
		spuCode: '',
	};
	topicList.value.push(list);
};
const removeTopic = (index: number) => {
	topicList.value.splice(index, 1);
};
const previewForm = () => {
	previewRef.value.openDialog(topicList.value);
};
// 获取站点产品
const getProductsList = async (query: string | undefined, item: TopicTypes) => {
	if (query) {
		loading.value = true;
		try {
			const { data, code, msg } = await productList({ spuName: query });
			loading.value = false;
			if (code === 0) {
				const prdList = data?.map((itemX: any) => {
					return {
						label: itemX.spuName,
						value: itemX.spuCode,
					};
				});
				item.configProductList = prdList;
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		// item.configProductList = [];
	}
};
// 根据跳转类型校验必填字段
const validateObject = (obj: TopicTypes) => {
	delete obj.configProductList;
	if (obj.type === 2) {
		return obj.imageUrl;
	} else if (obj.type === 1) {
		obj.jumpUrl = '';
		return obj.imageUrl && obj.spuCode;
	} else {
		obj.spuCode = '';
		return obj.imageUrl && obj.jumpUrl;
	}
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	// let res = await formEl.validate();
	const validationResults = topicList.value?.map(validateObject);
	if (!validationResults.every((result) => result)) {
		useMessage().error('请完善专题配置');
		return;
	}
	try {
		await useMessageBox().confirm('是否保存专题配置信息', '保存');
	} catch {
		return false;
	}
	try {
		const { code, msg } = await specialConfig({ specialConfigs: topicList.value });
		if (code === 0) {
			useMessage().success('保存成功');
			getTopicDetail();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 取消
const handleCancel = async () => {
	try {
		await useMessageBox().confirm('当前页面将丢失更新的内容，是否确认取消', '取消保存');
	} catch {
		return;
	}
	getTopicDetail();
};
// 获取配置详情列表
const getTopicDetail = async () => {
	try {
		const { data } = await specialConfigPreview();
		const list = data.map((item: TopicTypes) => {
			// 处理
			return {
				...item,
				configProductList: [
					{
						label: item.spuName,
						value: item.spuCode,
					},
				],
			};
		});
		topicList.value = list;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

onMounted(() => {
	getTopicDetail();
});
</script>
