<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="180px" class="demo-ruleForm">
				<el-card class="box-card box-body" :bordered="false" shadow="never">
					<template #header>
						<div class="clearfix">
							<span>基础信息</span>
						</div>
					</template>
					<div v-loading="state.loading">
						<el-form-item label="活动名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入活动名称" class="from-ipt-width" maxlength="30"></el-input>
						</el-form-item>
						<el-form-item label="活动日期" prop="startTime">
							<el-date-picker
								v-model="state.activeDate"
								value-format="YYYY-MM-DD HH:mm:ss"
								align="right"
								unlink-panels
								type="datetimerange"
								placement="bottom-end"
								placeholder="请选择活动日期"
								@change="onchangeTime"
								:picker-options="state.pickerOptions"
							/>
						</el-form-item>
						<el-form-item label="默认活动" prop="name">
							<el-switch v-model="ruleForm.deftStatus" :active-value="true" :inactive-value="false" />
						</el-form-item>
						<el-form-item label="活动主图" prop="activityImg">
							<upload-img v-model:image-url="ruleForm.activityImg" />
						</el-form-item>
						<el-form-item label="活动内容：" prop="activityText">
							<el-input
								type="textarea"
								v-model="ruleForm.activityText"
								placeholder="请输入活动内容，如需换行请直接换行输入即可"
								:rows="10"
								maxlength="2000"
								show-word-limit
							></el-input>
							<!-- <div class="from-tips">换行符统一用‘&lt;br/&gt;’</div> -->
						</el-form-item>
					</div>
				</el-card>
				<el-card class="box-card box-body mt14" :bordered="false" shadow="never">
					<template #header>
						<div class="clearfix">
							<span>邀请奖励规则</span>
						</div>
					</template>
					<el-form-item label="单次邀请奖励积分" prop="onceScore">
						<el-input-number v-model="ruleForm.onceScore" placeholder="请输入单次邀请奖励积分" :min="1" :max="999999"></el-input-number>
					</el-form-item>
					<el-form-item label="单次邀请奖励优惠券" prop="inviteActivityCouponList">
						<el-table
							ref="multipleTableRef"
							:data="ruleForm.inviteActivityCouponList"
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
									<span v-else>{{ scope.row.discount / 10 || 0 / 10 }}折</span>
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
									<el-form-item
										:prop="`inviteActivityCouponList.${$index}.rewardCount`"
										:rules="[{ required: true, message: '请输入奖励张数', trigger: 'blur' }]"
									>
										<el-input-number v-model="row.rewardCount" :min="1" :max="999999" :disabled="!row.isRepeated" placeholder="请输入" />
									</el-form-item>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
					<div class="text-center ml-[180px]" v-if="ruleForm.inviteActivityCouponList.length < 10">
						<el-button type="text" @click="handleSelectCoupon">{{
							ruleForm.inviteActivityCouponList.length ? '修改优惠券选择' : '+ 增加奖励优惠券'
						}}</el-button>
					</div>
					<el-form-item label="新用户下单才可发放" prop="userOrderFlag">
						<el-radio-group v-model="ruleForm.userOrderFlag">
							<el-radio :value="false">否</el-radio>
							<el-radio :value="true">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="首单金额要求" prop="firstOrderAmount" v-if="ruleForm.userOrderFlag">
						<el-input-number v-model="ruleForm.firstOrderAmount" :min="0" :max="999999" placeholder="请输入首单金额要求"></el-input-number>
					</el-form-item>

					<div class="flex justify-center items-center">
						<el-button type="primary" @click="submitForm" :loading="state.listLoading">确定</el-button>
						<el-button type="info" @click="back()">取消</el-button>
					</div>
				</el-card>
			</el-form>
		</div>
		<!-- 选择优惠券弹窗  -->
		<choose-coupon-dialo ref="couponDialogRef" :selected-coupons="ruleForm.inviteActivityCouponList" @save="handleCouponSave" />
	</div>
</template>

<script lang="ts" setup name="creatInvitation">
import { inviteActivityAdd, inviteActivityUpdate, inviteActivityDetail } from '/@/api/culture/cultureMarketing';
import { useMessage } from '/@/hooks/message';
import { useTable } from '/@/hooks/table';

const chooseCouponDialo = defineAsyncComponent(() => import('./components/chooseCouponDialog.vue'));

interface StatusType {
	[key: number | string]: string | undefined;
}

const couponCategory: StatusType = {
	1: '店铺',
	2: '商品',
	3: '通用',
	4: '品类',
	5: '品牌',
	6: '供应商',
};

let ruleForm = reactive({
	id: '',
	name: '',
	startTime: '',
	endTime: '',
	deftStatus: false,
	activityImg: '',
	activityText: '',
	onceScore: 0,
	userOrderFlag: null,
	firstOrderAmount: '',
	inviteActivityCouponList: [],
});
const rules = {
	name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
	startTime: [{ required: true, message: '请选择活动日期', trigger: 'change' }],
	activityImg: [{ required: true, message: '请选择活动主图', trigger: 'change' }],
	activityText: [{ required: true, message: '请输入活动内容', trigger: 'blur' }],
	rewardCount: [{ required: true, message: '请输入奖励张数', trigger: 'blur' }],
	firstOrderAmount: [{ required: true, message: '请输入首单金额要求', trigger: 'blur' }],
	onceScore: [{ required: true, message: '请输入积分奖励', trigger: 'blur' }],
	userOrderFlag: [{ required: true, message: '请选择', trigger: 'change' }],
};
const state = reactive({
	activeDate: [] as any[],
	pickerOptions: {
		disabledDate(time: Date) {
			return time.getTime() < Date.now() - 8.64e7;
		},
	},
	spikeTimeList: [],
	listLoading: false,
	loading: false,
});
const router = useRouter();
const route = useRoute();
onMounted(() => {
	route.query.id && getDetail();
});

const couponDialogRef = ref<any>();
const handleSelectCoupon = () => {
	couponDialogRef.value.openDialog();
};
const handleCouponSave = (selectedCoupons: any[]) => {
	console.log('selectedCoupons', selectedCoupons);
	if (Array.isArray(selectedCoupons)) {
		ruleForm.inviteActivityCouponList = selectedCoupons.map((coupon) => {
			if (!coupon.isRepeated) {
				return { ...coupon, rewardCount: 1 };
			}
			return coupon;
		}) as any;
	} else {
		ruleForm.inviteActivityCouponList = selectedCoupons;
	}
};

const back = () => {
	router.push({ path: `/culture/marketing/invitation/index` });
};
const getDetail = () => {
	inviteActivityDetail(route.query.id as string).then((res) => {
		state.spikeTimeList = res.data;
		Object.assign(ruleForm, { ...res.data, inviteActivityCouponList: res.data.couponsInfo });
		state.activeDate = [res.data.startTime, res.data.endTime];
	});
};
// 具体日期
const onchangeTime = (val: any) => {
	if (val) {
		state.activeDate = val;
		ruleForm.startTime = val[0];
		ruleForm.endTime = val[1];
	} else {
		state.activeDate = [];
		ruleForm.startTime = '';
		ruleForm.endTime = '';
	}
};

const ruleFormRef = ref();
const submitForm = () => {
	ruleFormRef.value.validate((valid: boolean) => {
		if (valid) {
			ruleForm.inviteActivityCouponList = ruleForm.inviteActivityCouponList.map((item: any) => {
				return {
					activityId: ruleForm.id,
					couponId: item.id,
					rewardCount: item.rewardCount,
				};
			}) as any;
			state.listLoading = true;
			route.query.id
				? inviteActivityUpdate(ruleForm)
						.then(() => {
							useMessage().success('编辑成功');
							back();
						})
						.catch((err) => {
							state.listLoading = false;
							useMessage().error(err.msg);
						})
				: inviteActivityAdd(ruleForm)
						.then(() => {
							useMessage().success('添加成功');
							back();
						})
						.catch((err) => {
							state.listLoading = false;
							useMessage().error(err.msg);
						});
		} else {
			return false;
		}
	});
};

const { tableStyle } = useTable(state);
</script>

<style lang="scss" scoped></style>
