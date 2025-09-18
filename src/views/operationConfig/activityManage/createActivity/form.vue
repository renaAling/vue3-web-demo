<template>
	<div class="layout-padding">
		<div class="tabs">
			<el-button
				v-for="(item, index) in tabsList"
				:key="index"
				:class="currentIndex === index ? 'active' : ''"
				@click="handleChangeTab(index)"
				:disabled="item.disabled"
			>
				{{ item.name }}
			</el-button>
		</div>
		<ActivityRules ref="activityRulesRef" v-if="currentIndex === 0" />
		<PrizeList v-if="currentIndex === 1" />
		<PageConfig ref="pageConfigRef" v-if="currentIndex === 2" />
		<footer class="footer" v-if="currentIndex !== 1">
			<el-button type="primary" @click="submitForm" :loading="loading">保存</el-button>
			<el-button @click="handleCancel">取消</el-button>
		</footer>
	</div>
</template>

<script setup lang="ts" name="cultureProductsForm">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules, UploadProps, UploadRequestOptions } from 'element-plus';
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus';
import { createActivity, updateActivity, createOrUpdatePageConfig } from '/@/api/operationConfig/lotteryManage';

const ActivityRules = defineAsyncComponent(() => import('./components/Rules.vue'));
const PrizeList = defineAsyncComponent(() => import('./components/PrizeList.vue'));
const PageConfig = defineAsyncComponent(() => import('./components/PageConfig.vue'));

const route = useRoute();

interface ActivityRulesComponent {
	formRef: FormInstance;
}

interface PageConfigComponent {
	formRef: FormInstance;
}
const activityRulesRef = ref<(InstanceType<typeof ActivityRules> & ActivityRulesComponent) | null>(null);
const pageConfigRef = ref<(InstanceType<typeof PageConfig> & PageConfigComponent) | null>(null);
const loading = ref(false);
const router = useRouter();
const tabsList = reactive([
	{
		name: '活动规则',
		disabled: false,
	},
	{
		name: '奖品配置',
		disabled: false,
	},
	{
		name: '页面配置',
		disabled: false,
	},
]);
const currentIndex = ref(0);

const handleChangeTab = (index: number) => {
	currentIndex.value = index;
};

// 自动定位到表单报错项
const moveToErr = () => {
	nextTick(() => {
		let isError = document.getElementsByClassName('is-error');
		if (isError.length) {
			isError[0].scrollIntoView({
				block: 'center',
				behavior: 'smooth',
			});
			// 这个当滑动到报错项之后自动获取输入框的焦点，方便用户直接进行输入，延迟 800ms 是因为需要都能到定位成功后在进行获取焦点体验更好一些
			setTimeout(() => {
				if (isError[0].previousElementSibling?.querySelector('input')) {
					isError[0].previousElementSibling.querySelector('input')?.focus();
				}
			}, 800);
		}
	});
};

const isAllFieldsFilled = (arr: { address: string; mobiles: string }[]) => {
	for (const item of arr) {
		if (!item.address || !item.mobiles) {
			return false;
		}
	}
	return true;
};

const submitForm = () => {
	loading.value = true;
	if (currentIndex.value === 0) {
		if (activityRulesRef.value && activityRulesRef.value?.formRef) {
			activityRulesRef.value?.formRef.validate(async (valid) => {
				let params = activityRulesRef.value?.formatFormData();
				if (params) {
					// 处理选中后必填，表单校验不能满足，手动校验
					if (params.everyDayLotteryNumRule && !params.dayGetNum) {
						ElMessage.error('请输入每天获取次数');
						loading.value = false;
						return;
					}
					if (params.firstLotteryNumRule && !params.originGetNum) {
						ElMessage.error('请输入初始赠送次数');
						loading.value = false;
						return;
					}
					if (params.friendHelpLotteryNumRule && !params.shareGetNum) {
						ElMessage.error('请输入好友助力次数、最多获取次数');
						loading.value = false;
						return;
					}
					if (params.maxWinRule && !params.maxWinNum) {
						ElMessage.error('请输入单用户最多可中奖次数');
						loading.value = false;
						return;
					}
					if (params.receiveWay === 2) {
						if (!isAllFieldsFilled(params.receiveOffLines)) {
							ElMessage.error('请输入完整的领奖地址和联系电话');
							loading.value = false;
							return;
						}
					}
					if (valid) {
						try {
							const request = params.code ? updateActivity : createActivity;
							const { code, msg, data } = await request(params);
							// 处理响应
							if (code === 0) {
								loading.value = false;
								ElMessage.success(params.code ? '更新活动成功' : '新建活动成功');
								router.push(`/operationConfig/activityManage/createActivity/form?type=edit&activityCode=${data}`);
							} else {
								ElMessage.error(msg);
								loading.value = false;
							}
						} catch (err: any) {
							loading.value = false;
							ElMessage.error(err.msg);
						}
					} else {
						console.log('校验失败');
						loading.value = false;
						moveToErr();
					}
				} else {
					loading.value = false;
					console.error('格式化表单数据失败，params 或 params.receiveOffLines 为 undefined');
				}
			});
		}
	} else if (currentIndex.value === 2) {
		if (pageConfigRef.value && pageConfigRef.value.formRef) {
			pageConfigRef.value?.formRef.validate(async (valid: any) => {
				let params = pageConfigRef.value?.formatFormData();
				console.log('params', params);
				if (params) {
					if (valid) {
						try {
							const { code, msg } = await createOrUpdatePageConfig(params);
							// 处理响应
							if (code === 0) {
								loading.value = false;
								ElMessage.success(params.activityCode ? '页面配置更新成功' : '页面配置新增成功');
								router.push(`/operationConfig/activityManage/createActivity/form?type=edit&activityCode=${params.activityCode}`);
								// .then(() => {
								//	window.location.reload();
								// });
							} else {
								ElMessage.error(msg);
								loading.value = false;
							}
						} catch (err: any) {
							loading.value = false;
							ElMessage.error(err.msg);
						}
					} else {
						loading.value = false;
						console.log('校验失败');
						moveToErr();
					}
				} else {
					loading.value = false;
					console.error('格式化表单数据失败，params 或 params.receiveOffLines 为 undefined');
				}
			});
		}
	}
};

// 取消（关闭当前 tag）
const handleCancel = () => {
	ElMessageBox.confirm(`取消保存当前页面将丢失编辑内容，是否确认取消保存?`, '取消保存', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info',
	})
		.then(() => {
			router.push('/operationConfig/activityManage/createActivity/form').then(() => {
				window.location.reload();
			});
		})
		.catch(() => {});
};
// 判断对象是否是空对象
const isEmptyObject = (obj: object) => Object.keys(obj).length === 0;

onMounted(() => {
	if (isEmptyObject(route.query)) {
		tabsList[1].disabled = true;
		tabsList[2].disabled = true;
	} else {
		tabsList[1].disabled = false;
		tabsList[2].disabled = false;
	}
});
</script>
<style lang="scss" scoped>
.layout-padding {
	overflow: auto;
	.tabs {
		margin-bottom: 16px;
		.active {
			color: #fff;
			background-color: #4785ea;
		}
	}

	.footer {
		text-align: center;
		margin-bottom: 56px;

		.el-button {
			width: 68px;
		}
	}
}
</style>
