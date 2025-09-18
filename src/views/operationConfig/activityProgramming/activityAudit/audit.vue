<template>
	<div class="layout-padding">
		<div class="activityAudit">
			<el-card class="box-card activityAudit-top" shadow="never">
				<el-row shadow="hover" class="ml10 flex align-center justify-between">
					<p class="title">活动方案审核</p>
					<el-button @click="toBack(queryRef)"
						><el-icon><ArrowLeft /></el-icon>返回</el-button
					>
				</el-row>
			</el-card>
			<div class="activityAudit-body">
				<el-scrollbar>
					<el-card v-if="!isAudit" class="box-card activityAudit-top">
						<p class="title">审核信息</p>
						<div class="details-item">
							<div class="flex w-[400px]">
								<div class="item-title">审核人：</div>
								{{ detailsData.auditBy }}
							</div>
							<div class="flex">
								<div class="item-title">审核时间：</div>
								{{ detailsData.auditTime }}
							</div>
						</div>
						<div class="details-item">
							<div class="item-title">审核结果：</div>
							<span v-if="detailsData.status === 3" style="color: #67c23a">通过</span>
							<span v-if="detailsData.status === 4" style="color: #f56c6c">驳回</span>
						</div>
						<div class="details-item">
							<div class="item-title">审核说明：</div>
							{{ detailsData.auditDescription }}
						</div>
					</el-card>
					<el-card class="box-card activityAudit-top">
						<div class="flex justify-between align-center">
							<p class="title">{{ isAudit ? '基本信息' : '活动方案' }}</p>
							<el-tag class="ml-2" v-if="isAudit && detailsData.status == 2" type="warning">待审核</el-tag>
							<el-tag v-if="!isAudit && detailsData.status == 3" class="ml-2" type="success">已通过</el-tag>
							<el-tag v-if="!isAudit && detailsData.status == 4" class="ml-2" type="danger">已驳回</el-tag>
						</div>

						<div class="details-item">
							<div class="item-title">活动名称：</div>
							{{ detailsData.schemeName }}
						</div>
						<div class="details-item">
							<div class="item-title">提交时间：</div>
							{{ detailsData.submitTime }}
						</div>
						<div class="details-item">
							<div class="item-title">提交人：</div>
							{{ detailsData.submitBy }}
						</div>
						<div class="details-item">
							<div class="item-title">活动时间：</div>
							{{ detailsData.startTime }}~{{ detailsData.endTime }}
						</div>
						<div class="details-item">
							<div class="item-title">方案说明：</div>
							{{ detailsData.schemeDescription }}
						</div>
						<div class="details-item">
							<div class="item-title">附件列表：</div>
							<div style="width: 100%">
								<div
									v-for="(item, index) in detailsData.activitySchemeAttachmentList"
									:key="item.id + index"
									class="download"
									@click="downExcelTemp(item)"
								>
									<p>
										<el-icon color="#409EFC" class="mr-2"><Document /></el-icon> {{ item.attachmentName }}
									</p>
									<el-icon color="#409EFC"><Download /></el-icon>
								</div>
							</div>
						</div>
					</el-card>
				</el-scrollbar>
			</div>
			<div class="activityAudit-footer" v-if="isAudit">
				<el-card class="box-card activityAudit-top" shadow="never">
					<el-form :model="form" ref="queryRef" :inline="true" :rules="rules" class="justify-between align-center" style="display: flex">
						<el-form-item prop="auditDescription">
							<el-input
								placeholder="请输入审核意见"
								maxlength="300"
								style="width: 800px"
								resize="none"
								:rows="3"
								v-model="form.auditDescription"
								clearable
								type="textarea"
							/>
						</el-form-item>
						<el-form-item>
							<el-button @click="handleAudit(queryRef, false)">驳回</el-button>
							<el-button type="primary" @click="handleAudit(queryRef, true)"> 通过 </el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="cultureProductsForm">
import { reactive, ref } from 'vue';
import { getAuditDetail, getActivitySchemePlanAudit } from '/@/api/operationConfig/activityAudit';
import router from '/@/router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { useMessage } from '/@/hooks/message';
const route = useRoute(); // 生成组件唯一id
const queryRef = ref<FormInstance>();
const isAudit = ref<boolean>(true);
const form = reactive({
	id: 0,
	auditDescription: '',
	status: 0,
});
interface RuleForm {
	id: number;
	auditDescription: string;
	status: number;
}
const detailsData = ref<any>({
	id: 0,
	name: '活动名称',
	activitySchemeAttachmentList: [],
});

const rules = reactive<FormRules<RuleForm>>({
	auditDescription: [
		{
			required: true,
			message: '请输入审核意见',
			trigger: 'change',
		},
	],
});
const toBack = (formEl?: FormInstance | undefined) => {
	if (isAudit.value) {
		if (!formEl) return;
		formEl.resetFields();
	}
	router.push('/operationConfig/activityProgramming/activityAudit/index');
};
const handleAudit = async (formEl: FormInstance | undefined, status: boolean) => {
	// 重新拉一下数据，判断状态
	getDetailsData();
	if (detailsData.value.status === 1) {
		useMessage().error('当前方案已撤销');
		return;
	}
	if (detailsData.value.status === 3 || detailsData.value.status === 4) {
		useMessage().error('当前方案已审批');
		return;
	}
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			try {
				ElMessageBox.confirm(`请确认是否${status ? '通过' : '驳回'}?`, `${status ? '通过' : '驳回'}方案`, {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info',
				})
					.then(async () => {
						form.status = status ? 3 : 4;
						form.id = detailsData.value.id;
						console.log('form', form);
						const { code } = await getActivitySchemePlanAudit(form);
						if (code === 0) {
							useMessage().success('审核成功');
							toBack(queryRef.value);
						}
					})
					.catch(() => {});
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
onMounted(() => {
	console.log('route', route.query);
	if (route.query.type === 'see') {
		isAudit.value = false;
	}
	getDetailsData();
});
const getDetailsData = async () => {
	try {
		const { code, data } = await getAuditDetail(Number(route.query.id));
		if (code === 0) detailsData.value = data;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const downExcelTemp = (ite: any) => {
	console.log('ite', ite);

	// 使用 fetch 获取文件并解析响应头
	fetch(ite.attachmentDownloadUrl, {
		method: 'GET',
	})
		.then((response) => {
			console.log('response', response);
			if (!response.ok) {
				throw new Error('下载失败');
			}
			let fileName = ''; // 默认文件名
			fileName = ite.attachmentName;
			return response.blob().then((blob) => ({ blob, fileName }));
		})
		.then(({ blob, fileName }) => {
			// 创建临时链接
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = fileName; // 设置文件名
			document.body.appendChild(link);
			link.click();

			// 清理
			window.setTimeout(() => {
				document.body.removeChild(link);
				URL.revokeObjectURL(link.href); // 释放 blob URL
			}, 0);
		})
		.catch((error) => {
			console.error('文件下载失败:', error);
		});
};
// const downExcelTemp = (item: any) => {
// 	console.log('item', item);
// 	const link = document.createElement('a');
// 	link.href = item.attachmentDownloadUrl;
// 	// link.download = 'temp.zip';
// 	link.download = item.attachmentName;
// 	document.body.appendChild(link);
// 	link.click();
// 	window.setTimeout(() => {
// 		document.body.removeChild(link);
// 	}, 0);
// };
</script>
<style lang="scss" scoped>
.layout-padding {
	overflow: auto;
	.activityAudit {
		display: flex;
		flex-direction: column;
		height: 100%;
		.activityAudit-body {
			flex: 1;
			overflow: hidden;
		}
		.activityAudit-footer {
			padding-bottom: 15px;
			margin-top: 15px;
		}
	}
	.el-card {
		margin-bottom: 16px;
	}
	.title {
		font-size: 20px;
		font-weight: 500;
		line-height: 28px;
		color: #1d2129;
		margin-bottom: 16px;
	}
	.details-item {
		font-size: 14px;
		line-height: 24px;
		color: #1d2129;
		display: flex;
		margin-bottom: 5px;
		.item-title {
			color: #666;
			margin-right: 10px;
			min-width: 70px;
		}
	}
	.download {
		background-color: #f8f8f8;
		padding: 5px 10px;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-width: 100%;
		cursor: pointer;
		border-radius: 5px;
		margin-bottom: 5px;
		.el-icon {
			vertical-align: middle;
		}
	}
	// .card-list {
	// 	width: 100%;
	// 	margin-bottom: 16px;
	// 	box-sizing: border-box;
	// 	:deep(.el-card__body) {
	// 		display: flex;
	// 		width: 100%;
	// 		height: 100%;
	// 		box-sizing: border-box;
	// 	}
	// 	.card-left {
	// 		flex: 1;
	// 	}
	// 	.card-right {
	// 		width: 200px;
	// 		display: flex;
	// 		align-items: center;
	// 		justify-content: center;
	// 	}
	// 	.card-title {
	// 		display: flex;
	// 		line-height: 32px;
	// 		p {
	// 			font-weight: 700;
	// 			font-size: 16px;
	// 		}
	// 	}
	// 	.card-text {
	// 		font-size: 14px;
	// 		color: #666;
	// 		line-height: 28px;
	// 	}
	// 	.link-item {
	// 		margin-right: 15px;
	// 		.el-icon {
	// 			vertical-align: middle;
	// 			margin-right: 3px;
	// 		}
	// 	}
	// }
}
</style>
