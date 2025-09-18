<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<el-form ref="ruleFormRef" :model="checkInTaskForm" :rules="rules" label-width="180px">
				<!-- 打卡任务设定 -->
				<el-card class="box-card box-body" :bordered="false" shadow="never">
					<template #header>
						<div>
							<span>打卡任务设定</span>
						</div>
					</template>
					<div v-loading="state.loading">
						<el-alert title="满足以下任务用户才可点击打卡" type="warning" show-icon />
						<el-row class="flex items-center mt-[10px]">
							<el-form-item>
								<el-checkbox v-model="checkInTaskForm.isContinuousLogin" label="连续登录" />
							</el-form-item>
							<el-form-item label="连续登录天数" prop="continuousLoginDays" v-if="checkInTaskForm.isContinuousLogin">
								<el-input-number v-model="checkInTaskForm.continuousLoginDays" placeholder="请输入" :min="1" :max="999999" controls-position="right">
									<template #suffix>
										<span>天</span>
									</template>
								</el-input-number>
							</el-form-item>
						</el-row>
						<el-row class="flex items-center">
							<el-form-item>
								<el-checkbox v-model="checkInTaskForm.isContinuousOrder" label="连续下单" />
							</el-form-item>
							<el-form-item label="每日下单笔数" prop="dailyOrderCount" v-if="checkInTaskForm.isContinuousOrder">
								<el-input-number v-model="checkInTaskForm.dailyOrderCount" placeholder="请输入" :min="1" :max="999999" controls-position="right">
									<template #suffix>
										<span>笔</span>
									</template>
								</el-input-number>
							</el-form-item>
							<el-form-item label="连续下单天数" prop="continuousOrderDays" v-if="checkInTaskForm.isContinuousOrder">
								<el-input-number v-model="checkInTaskForm.continuousOrderDays" placeholder="请输入" :min="1" :max="999999" controls-position="right">
									<template #suffix>
										<span>天</span>
									</template>
								</el-input-number>
							</el-form-item>
						</el-row>
						<el-form-item label="打卡规则说明" prop="rule">
							<editor v-model:get-html="checkInTaskForm.rule" height="400" width="100%" />
						</el-form-item>
					</div>
					<div class="flex items-center justify-end">
						<el-button type="primary" @click="submitCheckInTaskForm" :loading="state.listLoading">确定</el-button>
						<el-button @click="back">取消</el-button>
					</div>
				</el-card>
				<!-- 每日打卡奖励 -->
				<el-card class="box-card box-body mt14" :bordered="false" shadow="never">
					<template #header>
						<div>
							<span>每日打卡奖励</span>
						</div>
					</template>
					<el-row class="flex items-center">
						<el-form-item>
							<el-checkbox v-model="checkInRewardForm.isRewardScore" label="是否赠送积分值" />
						</el-form-item>
						<el-form-item label="赠送积分值" prop="rewardValue" v-if="checkInRewardForm.isRewardScore">
							<el-input-number v-model="checkInRewardForm.rewardValue" placeholder="请输入" :min="1" :max="999999" controls-position="right">
								<template #suffix>
									<span>分</span>
								</template>
							</el-input-number>
						</el-form-item>
					</el-row>
					<el-form-item label="奖励优惠券" prop="couponRelationList">
						<el-table
							ref="dailyCouponTableRef"
							:data="checkInRewardForm.couponRelationList"
							row-key="id"
							border
							:cell-style="tableStyle?.cellStyle"
							:header-cell-style="tableStyle?.headerCellStyle"
						>
							<el-table-column type="index" label="序号" width="60" />
							<el-table-column prop="name" :show-overflow-tooltip="true" label="优惠券名称" />
							<el-table-column prop="category" label="使用范围">
								<template #default="scope">
									<span>{{ couponCategory[scope.row.category] }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="couponType" label="优惠券类型" min-width="100">
								<template #default="scope">
									<span>{{ scope.row.couponType === 1 ? '满减券' : '折扣券' }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="money" label="面值(元)/折扣率(折)" min-width="150">
								<template #default="scope">
									<span v-if="scope.row.couponType === 1">{{ scope.row.money }}元</span>
									<span v-else>{{ (scope.row.discount / 10).toFixed(1) }}折</span>
								</template>
							</el-table-column>
							<el-table-column prop="minPrice" label="使用门槛(元)" />
							<el-table-column label="有效期" show-overflow-tooltip>
								<template #default="{ row }">
									<div v-if="row.isFixedTime">
										{{ row.useStartTime + '一' + row.useEndTime }}
									</div>
									<div v-else>
										{{ row.day + '天' }}
									</div>
								</template>
							</el-table-column>
							<el-table-column label="奖励张数" prop="rewardCount" width="150">
								<template #default="{ row, $index }">
									<!-- :rules="[{ required: true, message: '请输入奖励张数', trigger: 'blur' }]" -->
									<el-form-item :prop="`checkInRewardForm.couponRelationList.${$index}.rewardCount`">
										<el-input-number v-model="row.rewardCount" :min="1" :max="999999" :disabled="!row.isRepeated" placeholder="请输入" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="80">
								<template #default="{ $index }">
									<el-button type="danger" text @click="handleRemoveDailyCoupon($index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
					<div class="text-center ml-[180px]" v-if="checkInRewardForm.couponRelationList.length < 10">
						<el-button type="primary" link @click="handleSelectDailyCoupon">
							{{ checkInRewardForm.couponRelationList.length ? '修改优惠券选择' : '+ 增加奖励优惠券' }}
						</el-button>
					</div>
					<div class="flex items-center justify-end">
						<el-button type="primary" @click="submitCheckInRewardForm" :loading="state.listLoading">确定</el-button>
						<el-button @click="back">取消</el-button>
					</div>
				</el-card>
				<!-- 连续打卡奖励 -->
				<el-card class="box-card box-body mt14" :bordered="false" shadow="never">
					<template #header>
						<div>
							<span>连续打卡奖励</span>
							<el-button class="ml-[10px]" type="primary" @click="handleAddContinuousData">新增连续打卡奖励</el-button>
						</div>
					</template>
					<div v-for="(item, i) of continuousConfigList" :key="i">
						<el-row>
							<el-form-item label="连续天数" prop="dayNum">
								<el-input-number v-model="item.dayNum" placeholder="请输入" :min="1" :max="999999" controls-position="right">
									<template #suffix>
										<span>天</span>
									</template>
								</el-input-number>
							</el-form-item>
						</el-row>
						<el-row class="flex items-center">
							<el-form-item>
								<el-checkbox v-model="item.isRewardScore" label="是否赠送积分值" />
							</el-form-item>
							<el-form-item label="赠送积分值" prop="rewardValue" v-if="item.isRewardScore">
								<el-input-number v-model="item.rewardValue" placeholder="请输入" :min="1" :max="999999" controls-position="right">
									<template #suffix>
										<span>分</span>
									</template>
								</el-input-number>
							</el-form-item>
						</el-row>
						<el-form-item label="奖励优惠券" prop="dayMaxNum">
							<el-table
								:ref="(el: any) => (continuousCouponTables[i] = el)"
								:data="item.couponRelationList"
								row-key="id"
								border
								:cell-style="tableStyle?.cellStyle"
								:header-cell-style="tableStyle?.headerCellStyle"
							>
								<el-table-column type="index" label="序号" width="60" />
								<el-table-column prop="name" :show-overflow-tooltip="true" label="优惠券名称" />
								<el-table-column prop="category" label="使用范围">
									<template #default="scope">
										<span>{{ couponCategory[scope.row.category] }}</span>
									</template>
								</el-table-column>
								<el-table-column prop="couponType" label="优惠券类型" min-width="100">
									<template #default="scope">
										<span>{{ scope.row.couponType === 1 ? '满减券' : '折扣券' }}</span>
									</template>
								</el-table-column>
								<el-table-column prop="money" label="面值(元)/折扣率(折)" min-width="150">
									<template #default="scope">
										<span v-if="scope.row.couponType === 1">{{ scope.row.money }}元</span>
										<span v-else>{{ (scope.row.discount / 10).toFixed(1) }}折</span>
									</template>
								</el-table-column>
								<el-table-column prop="minPrice" label="使用门槛(元)" />
								<el-table-column label="有效期" show-overflow-tooltip>
									<template #default="{ row }">
										<div v-if="row.isFixedTime">
											{{ row.useStartTime + '一' + row.useEndTime }}
										</div>
										<div v-else>
											{{ row.day + '天' }}
										</div>
									</template>
								</el-table-column>
								<el-table-column label="奖励张数" prop="rewardCount" width="150">
									<template #default="{ row, $index }">
										<!-- :rules="[{ required: true, message: '请输入奖励张数', trigger: 'blur' }]" -->
										<el-form-item :prop="`continuousConfigList[${i}].couponRelationList[${$index}].rewardCount`">
											<el-input-number v-model="row.rewardCount" :min="1" :max="999999" :disabled="!row.isRepeated" placeholder="请输入" />
										</el-form-item>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="80">
									<template #default="{ $index }">
										<el-button type="danger" text @click="handleRemoveContinuousCoupon(i, $index)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
						<div class="text-center ml-[180px]" v-if="item.couponRelationList.length < 10">
							<el-button type="primary" link @click="handleSelectContinuousCoupon(i)">
								{{ item.couponRelationList.length ? '修改优惠券选择' : '+ 增加奖励优惠券' }}
							</el-button>
							<el-button type="danger" link v-if="i > 0" @click="handleDeleteContinuousData(i)">删除此列打卡奖励</el-button>
						</div>
					</div>
					<div class="flex items-center justify-end">
						<el-button type="primary" @click="submitContinuousConfigList" :loading="state.listLoading">确定</el-button>
						<el-button @click="back">取消</el-button>
					</div>
				</el-card>
			</el-form>
		</div>
		<!-- 选择优惠券弹窗  -->
		<choose-coupon-dialo ref="couponDialogRef" :selected-coupons="currentCouponSelection" @save="handleCouponSave" />
	</div>
</template>
<script lang="ts" setup>
import {
	updateCheckInTask,
	updateCheckInReward,
	saveOrUpdateContinuous,
	getCheckInTask,
	getCheckInReward,
	getContinuous,
} from '/@/api/culture/marketing';
import { useMessage } from '/@/hooks/message';
import { useTable } from '/@/hooks/table';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 异步加载优惠券选择对话框组件
const chooseCouponDialo = defineAsyncComponent(() => import('../invitation/components/chooseCouponDialog.vue'));

interface StatusType {
	[key: number | string]: string | undefined;
}

// 后端返回的优惠券信息接口
interface BackendCouponInfo {
	id: number;
	name: string;
	category: number;
	couponType: number;
	money?: number;
	discount?: number;
	minPrice: number;
	isFixedTime: boolean;
	useStartTime?: string;
	useEndTime?: string;
	day?: number;
	isRepeated: boolean;
	rewardId?: number;
	couponId?: number;
	rewardCount?: number;
}

// 提交给后端的优惠券关联信息接口
interface SubmitCouponRelation {
	rewardId?: number;
	couponId: number;
	rewardCount: number;
}

// 打卡任务表单接口
interface CheckInTaskForm {
	id?: number;
	continuousLoginDays: number;
	dailyOrderCount: number;
	continuousOrderDays: number;
	rule: string;
	isContinuousLogin: boolean;
	isContinuousOrder: boolean;
}

// 每日奖励表单接口
interface CheckInRewardForm {
	id?: number;
	taskId?: number | null;
	rewardType: number;
	rewardValue: number;
	couponRelationList: BackendCouponInfo[];
	isRewardScore: boolean;
}

// 连续奖励配置接口
interface ContinuousConfig {
	id?: number;
	taskId?: number | null;
	rewardType: number;
	rewardValue: number;
	dayNum: number;
	specialFlag?: boolean; // 特殊标记，最后一个连续奖励项为true
	couponRelationList: BackendCouponInfo[];
	isRewardScore: boolean;
}

// 优惠券使用范围映射
const couponCategory: StatusType = {
	1: '店铺',
	2: '商品',
	3: '通用',
	4: '品类',
	5: '品牌',
	6: '供应商',
};

// 打卡任务表单数据
const checkInTaskForm = ref<CheckInTaskForm>({
	continuousLoginDays: 0,
	dailyOrderCount: 0,
	continuousOrderDays: 0,
	rule: '',
	isContinuousLogin: true,
	isContinuousOrder: true,
});

// 每日奖励表单数据
const checkInRewardForm = ref<CheckInRewardForm>({
	taskId: null,
	rewardType: 1, // 1表示每日奖励
	rewardValue: 0,
	couponRelationList: [],
	isRewardScore: true,
});

// 连续奖励配置列表，最后一个项的specialFlag为true
const continuousConfigList = ref<ContinuousConfig[]>([
	{
		taskId: null,
		rewardType: 2, // 2表示连续奖励
		rewardValue: 0,
		dayNum: 0,
		specialFlag: true, // 最后一个连续奖励项标记为特殊
		couponRelationList: [],
		isRewardScore: true,
	},
]);

// 表单验证规则
const rules = {
	continuousLoginDays: [{ required: true, message: '请输入连续登录天数', trigger: 'blur' }],
	dailyOrderCount: [{ required: true, message: '请输入每日下单笔数', trigger: 'blur' }],
	continuousOrderDays: [{ required: true, message: '请输入连续下单天数', trigger: 'blur' }],
	rule: [{ required: true, message: '请输入打卡规则说明', trigger: 'blur' }],
};

// 组件状态
const state = reactive({
	loading: false, // 加载状态
	listLoading: false, // 列表加载状态
	currentEditingIndex: -1, // 当前编辑的连续奖励索引
});

const router = useRouter();
const ruleFormRef = ref(); // 表单引用
const couponDialogRef = ref(); // 优惠券对话框引用
const dailyCouponTableRef = ref(); // 每日奖励表格引用
const continuousCouponTables = ref([]); // 连续奖励表格引用数组
const currentCouponSelection = ref<BackendCouponInfo[]>([]); // 当前选择的优惠券

/**
 * 将后端返回的couponsInfo转换为前端使用的couponRelationList
 * @param couponsInfo 后端返回的优惠券信息数组
 * @returns 转换后的优惠券关系列表
 */
const convertCouponsInfoToRelationList = (couponsInfo: BackendCouponInfo[]): BackendCouponInfo[] => {
	return couponsInfo.map((coupon) => ({
		...coupon,
		rewardCount: coupon.rewardCount || 1, // 默认奖励数量为1
		couponId: coupon.couponId || coupon.id, // 确保couponId存在
	}));
};

/**
 * 将前端使用的couponRelationList转换为后端需要的提交格式
 * @param couponRelationList 前端优惠券关系列表
 * @param rewardId 奖励ID
 * @returns 后端需要的优惠券关系列表
 */
const convertRelationListToSubmitFormat = (couponRelationList: BackendCouponInfo[], rewardId?: number): SubmitCouponRelation[] => {
	return couponRelationList.map((coupon) => ({
		rewardId,
		couponId: coupon.couponId || coupon.id, // 使用couponId或id
		rewardCount: coupon.rewardCount || 1, // 确保奖励数量存在
	}));
};

/**
 * 获取打卡任务详情
 */
const getDetail = async () => {
	try {
		state.loading = true;
		const res1 = await getCheckInTask();
		const taskId = res1?.data?.id;
		if (!taskId) return;

		// 设置打卡任务表单数据
		checkInTaskForm.value = { ...res1.data };

		// 并行获取每日奖励和连续奖励数据
		const [res2, res3] = await Promise.all([getCheckInReward({ taskId }), getContinuous({ taskId })]);

		// 设置每日奖励数据
		checkInRewardForm.value = {
			id: res2?.data?.id,
			taskId,
			rewardType: 1,
			rewardValue: res2?.data?.rewardValue || 0,
			couponRelationList: convertCouponsInfoToRelationList(res2?.data?.couponsInfo || []),
			isRewardScore: res2?.data?.isRewardScore,
		};

		// 设置连续奖励数据，确保最后一个项的specialFlag为true
		const continuousData = res3?.data?.length
			? res3.data.map((item: any, index: number) => ({
					...item,
					specialFlag: index === res3.data.length - 1, // 最后一个项标记为特殊
					couponRelationList: convertCouponsInfoToRelationList(item.couponsInfo || []),
			  }))
			: [
					{
						taskId,
						rewardType: 2,
						rewardValue: 0,
						dayNum: 0,
						specialFlag: true, // 默认情况下只有一个项，标记为特殊
						couponRelationList: [],
					},
			  ];

		continuousConfigList.value = continuousData;
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		state.loading = false;
	}
};

/**
 * 选择每日奖励优惠券
 */
const handleSelectDailyCoupon = () => {
	currentCouponSelection.value = [...checkInRewardForm.value.couponRelationList];
	state.currentEditingIndex = -1; // -1表示编辑每日奖励
	couponDialogRef.value.openDialog();
};

/**
 * 选择连续奖励优惠券
 * @param index 连续奖励项的索引
 */
const handleSelectContinuousCoupon = (index: number) => {
	currentCouponSelection.value = [...continuousConfigList.value[index].couponRelationList];
	state.currentEditingIndex = index; // 设置当前编辑的连续奖励索引
	couponDialogRef.value.openDialog();
};

/**
 * 处理优惠券保存
 * @param selectedCoupons 选择的优惠券列表
 */
const handleCouponSave = (selectedCoupons: BackendCouponInfo[]) => {
	// 完善优惠券数据
	const enrichedCoupons = selectedCoupons.map((coupon) => ({
		...coupon,
		rewardCount: coupon.rewardCount || 1,
		couponId: coupon.couponId || coupon.id,
	}));

	if (state.currentEditingIndex === -1) {
		// 保存每日奖励优惠券
		checkInRewardForm.value.couponRelationList = enrichedCoupons;
	} else {
		// 保存连续奖励优惠券
		continuousConfigList.value[state.currentEditingIndex].couponRelationList = enrichedCoupons;
	}
};

/**
 * 删除每日奖励优惠券
 * @param index 优惠券索引
 */
const handleRemoveDailyCoupon = (index: number) => {
	checkInRewardForm.value.couponRelationList.splice(index, 1);
};

/**
 * 删除连续奖励优惠券
 * @param configIndex 连续奖励配置索引
 * @param couponIndex 优惠券索引
 */
const handleRemoveContinuousCoupon = (configIndex: number, couponIndex: number) => {
	continuousConfigList.value[configIndex].couponRelationList.splice(couponIndex, 1);
};

/**
 * 添加连续奖励配置
 */
const handleAddContinuousData = () => {
	// 先将当前最后一个项的specialFlag设为false
	if (continuousConfigList.value.length > 0) {
		continuousConfigList.value[continuousConfigList.value.length - 1].specialFlag = false;
	}

	// 添加新项，并设置specialFlag为true
	continuousConfigList.value.push({
		taskId: checkInTaskForm.value.id || null,
		rewardType: 2,
		rewardValue: 0,
		dayNum: 0,
		specialFlag: true, // 新添加的项成为最后一个，标记为特殊
		couponRelationList: [],
		isRewardScore: true,
	});
};

/**
 * 删除连续奖励配置
 * @param index 要删除的配置索引
 */
const handleDeleteContinuousData = (index: number) => {
	// 如果要删除的是最后一个项且列表中有多个项，需要将新的最后一个项标记为特殊
	if (index === continuousConfigList.value.length - 1 && continuousConfigList.value.length > 1) {
		continuousConfigList.value[continuousConfigList.value.length - 2].specialFlag = true;
	}

	continuousConfigList.value.splice(index, 1);
};

/**
 * 提交打卡任务表单
 */
const submitCheckInTaskForm = async () => {
	ruleFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		try {
			state.listLoading = true;
			const res = await updateCheckInTask(checkInTaskForm.value);
			if (res?.ok) {
				useMessage().success('保存成功');
				const taskId = res.data?.id || checkInTaskForm.value.id;
				if (taskId) {
					// 更新关联的taskId
					checkInTaskForm.value.id = taskId;
					checkInRewardForm.value.taskId = taskId;
					continuousConfigList.value.forEach((item) => {
						item.taskId = taskId;
					});
				}
				getDetail();
			}
		} catch (error: any) {
			getDetail();
			useMessage().error(error.msg);
		} finally {
			state.listLoading = false;
		}
	});
};

/**
 * 提交每日奖励表单
 */
const submitCheckInRewardForm = async () => {
	try {
		if (!checkInTaskForm.value.id) {
			useMessage().warning('请先保存打卡任务设置');
			return;
		}

		state.listLoading = true;
		const submitData = {
			...checkInRewardForm.value,
			couponRelationList: convertRelationListToSubmitFormat(checkInRewardForm.value.couponRelationList, checkInRewardForm.value.id),
		};

		const res = await updateCheckInReward(submitData);
		if (res?.ok) {
			useMessage().success('保存成功');
			if (res.data?.id) {
				checkInRewardForm.value.id = res.data.id;
			}
			getDetail();
		}
	} catch (error: any) {
		getDetail();
		useMessage().error(error.msg);
	} finally {
		state.listLoading = false;
	}
};

/**
 * 提交连续奖励配置
 */
const submitContinuousConfigList = async () => {
	try {
		if (!checkInTaskForm.value.id) {
			useMessage().warning('请先保存打卡任务设置');
			return;
		}

		state.listLoading = true;
		const submitData = continuousConfigList.value.map((config) => ({
			...config,
			couponRelationList: convertRelationListToSubmitFormat(config.couponRelationList, config.id),
		}));

		const res = await saveOrUpdateContinuous({ continuousConfigList: submitData });
		if (res?.ok) {
			useMessage().success('保存成功');
			if (res.data?.length) {
				// 更新ID并保持specialFlag状态
				continuousConfigList.value = continuousConfigList.value.map((item, index) => ({
					...item,
					id: res.data[index]?.id || item.id,
					specialFlag: index === continuousConfigList.value.length - 1, // 保持最后一个项的特殊标记
				}));
			}
			getDetail();
		}
	} catch (error: any) {
		getDetail();
		useMessage().error(error.msg);
	} finally {
		state.listLoading = false;
	}
};

/**
 * 返回上一页
 */
const back = () => {
	router.push({ path: `/culture/marketing/checkInRecord/index` });
};

const { tableStyle } = useTable(state);

// 组件挂载时获取详情
onMounted(() => {
	getDetail();
});
</script>

<style lang="scss" scoped>
.el-form .el-form-item:last-of-type {
	margin-bottom: 18px !important;
}
</style>
