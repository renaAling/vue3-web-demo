<template>
	<div class="layout-padding" style="width: 100%">
		<div class="-autolayout-padding layout-padding-view">
			<el-scrollbar>
				<div class="my-5 flex align-center justify-start cursor-pointer">
					<el-icon :size="22" class="mt-1" @click="toForward"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon" @click="toForward">返回</span>
				</div>
				<div class="addTitle m-5">发行优惠券</div>
				<div style="width: 600px; margin-left: 50px">
					<el-form
						ref="formValidateRef"
						v-loading="loading"
						class="formValidate"
						:rules="ruleValidate"
						:model="formValidate"
						:disabled="isSee"
						label-width="150px"
						@submit.native.prevent
					>
						<div>
							<el-form-item label="所属业务" prop="platType" :disabled="isSee">
								<el-select v-model="formValidate.platType" clearable>
									<el-option label="轨道甄选" :value="0">轨道甄选</el-option>
									<el-option label="地铁文创" :value="3">地铁文创</el-option>
									<!-- <el-option label="自有商城" :value="4">自有商城</el-option>
									<el-option label="积分商城" :value="5">积分商城</el-option>
									<el-option label="ip商城" :value="6">ip商城</el-option> -->
								</el-select>
							</el-form-item>
							<el-form-item label="优惠券名称" prop="name">
								<el-input v-model="formValidate.name" :disabled="isSee" class="from-ipt-width" placeholder="请输入优惠券名称" maxlength="20" />
							</el-form-item>
							<el-form-item label="优惠券面值(元)" prop="money">
								<el-input-number
									type="number"
									@change="changeMinPrice"
									v-model="formValidate.money"
									:min="0"
									:step="1"
									step-strictly
									:disabled="isEdit || isSee"
									:max="9999"
									class="from-ipt-width"
									placeholder="请输入优惠券面值"
								>
									<template #suffix><span class="suffix_text">元</span></template>
								</el-input-number>
							</el-form-item>
							<el-form-item label="使用门槛(元)" prop="minPrice">
								<el-input-number
									@change="changeMinPrice"
									v-model="formValidate.minPrice"
									:min="0"
									:disabled="isEdit || isSee"
									class="from-ipt-width"
									:max="999999"
									:step="1"
									step-strictly
									placeholder="请输入使用门槛"
								>
									<template #suffix><span class="suffix_text">元</span></template>
								</el-input-number>
								<p class="desc mt10">填写优惠券的最低消费金额，使用门槛为0时指无门槛</p>
							</el-form-item>
							<el-form-item label="领取方式" prop="receiveType">
								<el-radio-group v-model="formValidate.receiveType" :disabled="isSee">
									<!-- <el-radio :label="1">用户领取</el-radio> -->
									<el-radio :label="3">平台活动使用</el-radio>
								</el-radio-group>
								<p class="desc mt-10">
									1. 用户手动领取指用户需要在移动端的领券中心领取优惠券；<br />
									2. 平台活动使用指其他营销活动可选择此类型优惠券，用户满足活动条件后直接提示发放 ；
								</p>
							</el-form-item>
							<el-form-item label="优惠券类型" prop="category">
								<el-radio-group v-model="formValidate.category" :disabled="isSee || isEdit">
									<el-radio :label="3">通用券</el-radio>
									<el-radio :label="2">商品券</el-radio>
									<el-radio :label="4">品类券</el-radio>
									<el-radio :label="6">跨店券</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item v-if="formValidate.category == 4" label="选择分类" :span="24" label-width="150px">
								<el-cascader
									class="from-ipt-width"
									ref="cascader"
									:disabled="!formValidate.platType.toString()"
									v-model="state.linkedData"
									clearable
									:options="adminProductClassify"
									:props="categoryProps"
								/>
							</el-form-item>
							<el-form-item v-if="formValidate.category == 2" label-width="150px">
								<el-button type="primary" @click="addGoods">添加商品</el-button>
								<el-button @click="batchDel" :disabled="!state.multipleSelection.length">批量删除</el-button>
							</el-form-item>
							<el-form-item v-if="formValidate.category == 2" label-width="150px">
								<el-table
									border
									ref="tableList"
									v-loading="state.listLoading"
									:data="state.tableData.data"
									style="width: 100%"
									@selection-change="handleSelectionChange"
									@select-all="selectAll"
									@select="selectOne"
									class="tableSelection"
								>
									<el-table-column type="selection" width="55"> </el-table-column>
									<el-table-column prop="id" label="ID" width="55"> </el-table-column>
									<el-table-column label="商品图" min-width="80">
										<template #default="scope">
											<div class="demo-image__preview line-heightOne">
												<el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
											</div>
										</template>
									</el-table-column>
									<el-table-column :show-overflow-tooltip="true" prop="name" label="商品名称" min-width="200" />
									<el-table-column prop="price" label="售价" min-width="90" />
									<el-table-column prop="stock" label="库存" min-width="70" />
									<el-table-column label="操作" width="140" fixed="right">
										<template #default="scope">
											<el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
							<el-form-item v-if="formValidate.category == 5" label="选择品牌" :span="24" prop="proBrandList" label-width="160px">
								<el-select
									class="from-ipt-width"
									clearable
									filterable
									v-model="state.proBrandList"
									:loading="loading"
									remote
									placeholder="请选择品牌"
								>
									<el-option v-for="(v, i) in productBrand" :key="i" :label="v.name" :value="v.id" :disabled="!v.isShow"> </el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="选择供应商" v-if="formValidate.category == 6" :span="24" label-width="150px" prop="merIds">
								<merchant-name
									@getMerId="getMerId"
									:multiple="true"
									:merIdChecked="state.merIds"
									:disabled="!formValidate.platType.toString()"
									:platType="formValidate.platType"
									style="width: 460px"
								></merchant-name>
							</el-form-item>
							<!-- <el-form-item label="领取时间" prop="isTimeReceive" v-if="formValidate.receiveType === 1">
								<el-radio-group v-model="formValidate.isTimeReceive" :disabled="isSee">
									<el-radio :label="false">不限时</el-radio>
									<el-radio :label="true">时间段</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item v-if="formValidate.isTimeReceive && formValidate.receiveType === 1" prop="collectionTime">
								<el-date-picker
									v-model="formValidate.collectionTime"
									class="from-ipt-width"
									type="datetimerange"
									value-format="YYYY-MM-DD HH:mm:ss"
									format="YYYY-MM-DD HH:mm:ss"
									:default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									:picker-options="pickerOptionsForEditCoupon"
									align="right"
									@change="onChangeCollectionTime"
									:disabled="isSee"
								/>
								<p class="desc mt10">优惠券可以在此时间范围之内领取</p>
							</el-form-item> -->
							<el-form-item label="发行时间" prop="isTimeReceive">
								<el-radio-group v-model="formValidate.isTimeReceive" :disabled="isSee">
									<el-radio :label="false">不限时</el-radio>
									<el-radio :label="true">时间段</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item v-if="formValidate.isTimeReceive" prop="collectionTime">
								<el-date-picker
									v-model="formValidate.collectionTime"
									class="from-ipt-width"
									type="datetimerange"
									value-format="YYYY-MM-DD HH:mm:ss"
									format="YYYY-MM-DD HH:mm:ss"
									:default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									:picker-options="pickerOptionsForEditCoupon"
									align="right"
									@change="onChangeCollectionTime"
									:disabled="isSee"
								/>
								<p class="desc mt10">优惠券可以在此时间范围之内领取</p>
							</el-form-item>
							<el-form-item label="使用有效期" prop="isFixedTime">
								<el-radio-group v-model="formValidate.isFixedTime" :disabled="isSee">
									<el-radio :label="false">天数</el-radio>
									<el-radio :label="true">时间段</el-radio>
								</el-radio-group>
								<p class="desc mt10">
									{{ !isEdit ? '' : '优惠券编辑后，之前已经领取的优惠券使用有效期不会改变' }}
								</p>
							</el-form-item>
							<el-form-item v-if="!formValidate.isFixedTime" prop="day">
								<el-input-number
									class="from-ipt-width"
									placeholder="请输入天数"
									:max="999"
									:step="1"
									step-strictly
									v-model="formValidate.day"
									:disabled="isSee"
								>
									<template #suffix><span class="suffix_text">天</span></template>
								</el-input-number>
								<p class="desc mt10">领取之后多少天之后失效，失效的优惠券将不能使用</p>
							</el-form-item>
							<el-form-item v-if="formValidate.isFixedTime" prop="validityTime">
								<el-date-picker
									placement="top"
									v-model="formValidate.validityTime"
									class="from-ipt-width"
									type="datetimerange"
									value-format="YYYY-MM-DD HH:mm:ss"
									format="YYYY-MM-DD HH:mm:ss"
									:default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									align="right"
									:disabled="isSee"
									@change="onChangeValidityTime"
									:picker-options="pickerOptionsForEditCoupon"
								/>
							</el-form-item>
							<el-form-item :label="!isEdit ? '发布数量(张)' : '增加发布数量(张)'" prop="isLimited">
								<el-radio-group v-model="formValidate.isLimited" :disabled="isSee">
									<el-radio :label="true">限量</el-radio>
									<el-radio :label="false">不限量</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item v-if="formValidate.isLimited" prop="total">
								<el-input-number
									v-if="!isEdit"
									class="from-ipt-width"
									placeholder="请输入优惠券数量"
									:max="999999"
									:step="1"
									:disabled="isSee"
									step-strictly
									v-model="formValidate.total"
								>
									<template #suffix><span class="suffix_text">张</span></template>
								</el-input-number>
								<el-input-number
									v-else
									class="from-ipt-width"
									placeholder="请输入优惠券数量"
									:max="999999"
									:step="1"
									step-strictly
									:disabled="isSee"
									v-model="formValidate.num"
								>
									<template #suffix><span class="suffix_text">张</span></template>
								</el-input-number>
								<p class="desc mt10">
									{{
										!isEdit
											? '填写优惠券的发放数量'
											: '编辑时，填写优惠券增加的数量；例如：新增时填写2张优惠券，编辑时填写1，则编辑后总共发布3张优惠券'
									}}
								</p>
							</el-form-item>
							<el-form-item label="重复领取" prop="isRepeated">
								<el-radio-group v-model="formValidate.isRepeated" :disabled="isSee">
									<el-radio :label="false">不可重复</el-radio>
									<el-radio :label="true">可重复</el-radio>
								</el-radio-group>
								<p v-if="formValidate.receiveType === 1" class="desc mt10">
									可重复领取，若用户领取该优惠券且使用过后，可以再次领取；<br />
									不可重复领取，若用户领取该优惠券无论是否使用，都不可再次领取
								</p>
								<p v-else class="desc mt10">
									可重复领取，若多个营销活动赠送同一优惠券，一个用户可领取多张；<br />
									不可重复领取，若多个营销活动赠送同一优惠券，一个用户只能领取1张
								</p>
							</el-form-item>
							<el-form-item label="是否开启:">
								<el-switch :width="56" :disabled="isSee" v-model="formValidate.status" active-text="开启" inactive-text="关闭" inline-prompt />
							</el-form-item>
						</div>
					</el-form>
					<div class="flex align-center justify-center mt-10" v-if="!isSee">
						<span class="dialog-footer">
							<el-button @click="resetForm">取消</el-button>
							<el-button @click="onSubmit" type="primary" :disabled="loading">确认</el-button>
						</span>
					</div>
				</div>
			</el-scrollbar>
		</div>
		<goodListModal ref="goodListRef"></goodListModal>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
// import { getUserInfoByUidMobile, getAuthorizationSystemInfos } from '/@/api/member/backendUsers/user';
// import { accountDetailList } from '/@/api/points/manage';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import goodListModal from './goodList/goodListFrom/index.vue';
import merchantName from './merUseCategory.vue';
import { productCategoryApi, brandListAllApi } from '/@/api/culture/commodity/commodityList';
import { couponInfoApi, platformCouponEditApi, platformCouponAddApi } from '/@/api/culture/marketing';
// 定义变量内容
// const emit = defineEmits(['refresh']);
const emit = defineEmits(['changeType', 'getList']);
const formValidateRef = ref();
const visible = ref(false);
const loading = ref(false);
const adminProductClassify = ref<any[]>([]);
const productBrand = ref<any[]>([]);
const goodListRef = ref();
// 提交表单数据
const formValidate = reactive({
	name: '', //优惠券名称
	category: 3, //适用范围
	money: 1, //面值
	minPrice: 2, // 使用门槛(使用门槛略高于优惠券面额)
	receiveType: 3, //领取方式
	isTimeReceive: false, //领取时间类型
	receiveStartTime: '', //可领取开始时间
	receiveEndTime: '', //可领取结束时间
	isFixedTime: false,
	day: 1, //天数
	useStartTime: '', //可使用时间范围 开始时间
	useEndTime: '', //可使用时间范围 结束时间
	isLimited: true, //是否限量
	total: 1, //总数
	num: 0, //编辑优惠券发布数量
	isRepeated: false, //是否可重复领取
	// linkedData: null, //关联数据
	status: false,
	validityTime: [], //使用有效期
	collectionTime: [], //领取时间
	platType: '',
});
const state = reactive({
	listLoading: false,
	selectGoods: false,
	multipleSelection: [],
	tableData: {
		data: [],
		total: 0,
	},
	proBrandList: '',
	merIds: [],
	ids: [],
	linkedData: null,
});
const categoryProps = {
	value: 'id',
	label: 'name',
	children: 'childList',
	expandTrigger: 'hover',
	checkStrictly: true,
	emitPath: false,
	multiple: false,
};
const isEdit = ref<boolean>(false);
const isSee = ref<boolean>(false);

const pickerOptionsForEditCoupon = {
	// 时间有效校验
	disabledDate(time) {
		return time.getTime() < Date.now() - 8.64e7;
	},
};
const changeMinPrice = () => {
	if (formValidate.minPrice <= formValidate.money) {
		useMessage().error('优惠卷面值必须小于优惠券使用门槛');
		formValidate.minPrice = formValidate.money + 1;
		return;
	}
};
// 具体日期
const onChangeValidityTime = (e: any) => {
	formValidate.validityTime = e;
	formValidate.useStartTime = e ? e[0] : '';
	formValidate.useEndTime = e ? e[1] : '';
};
// 领取时间
const onChangeCollectionTime = (e: any) => {
	formValidate.collectionTime = e;
	formValidate.receiveStartTime = e ? e[0] : '';
	formValidate.receiveEndTime = e ? e[1] : '';
};
// 定义校验规则
const ruleValidate = {
	platType: [{ required: true, message: '请选择所属业务' }],
	name: [{ required: true, message: '请输入优惠券名称' }],
	money: [
		{ required: true, message: '请输入优惠券面值' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value >= formValidate.minPrice) {
					callback(new Error('优惠卷面值必须小于优惠券使用门槛'));
				} else {
					callback();
				}
			},
			trigger: 'change',
		},
	],
	minPrice: [
		{ required: true, message: '请输入优惠券使用门槛' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value <= formValidate.money) {
					callback(new Error('优惠券使用门槛必须大于优惠卷面值'));
				} else {
					callback();
				}
			},
			trigger: 'change',
		},
	],
	receiveType: [{ required: true, message: '请选择领取方式' }],
	isTimeReceive: [{ required: true, message: '请选择领取时间类型' }],
	day: [{ required: true, message: '请输入天数' }],
	total: [{ required: true, message: '请输入发布数量' }],
	isLimited: [{ required: true, message: '请选择使用有效期' }],
	isRepeated: [{ required: true, message: '请选择是否可重复领取' }],
	isFixedTime: [{ required: true, message: '请选择使用有效期' }],
	validityTime: [
		{
			type: 'array',
			required: true,
			message: '请选择日期区间',
			fields: {
				0: {
					//type: 'tpye', //tpye类型试情况而定,所以如果返回的是date就改成date
					required: true,
					trigger: 'change',
					message: '请选择开始日期',
				},
				1: {
					//type: 'tpye',
					required: true,
					trigger: 'change',
					message: '请选择结束日期',
				},
			},
		},
	],
	collectionTime: [
		{
			type: 'array',
			required: true,
			message: '请选择日期区间',
			fields: {
				0: {
					//type: 'tpye', //tpye类型试情况而定,所以如果返回的是date就改成date
					required: true,
					trigger: 'change',
					message: '请选择开始日期',
				},
				1: {
					//type: 'tpye',
					required: true,
					trigger: 'change',
					message: '请选择结束日期',
				},
			},
		},
	],
};

watch(
	() => formValidate.category,
	(val) => {
		if (val == 2 || val == 4 || val == 6) {
			if (!formValidate.platType.toString()) {
				useMessage().error('请选择所属业务');
				return;
			} else {
				getAdminProductClassify({ platType: formValidate.platType });
			}
		}
	}
);
watch(
	() => formValidate.platType,
	(val) => {
		if (formValidate.category == 4) {
			// if (!formValidate.platType && formValidate.platType != 0) {
			// 	useMessage().error('请选择所属业务');
			// 	return;
			// } else {
			if (!isEdit.value) {
				state.linkedData = null;
			}
			// state.linkedData = null;
			getAdminProductClassify({ platType: val });
			// }
		}
	}
);
// watch(
// 	() => formValidate.receiveType,
// 	(val) => {
// 		if (formValidate.receiveType == 3) {
// 			formValidate.isTimeReceive = false;
// 		}
// 	}
// );

//

watch(
	() => formValidate.isLimited,
	(val) => {
		if (val) {
		}
	}
);
const addGoods = () => {
	goodListRef.value.state.handleNum = 'many';
	if (!formValidate.platType.toString()) {
		useMessage().error('请选择所属业务');
		return;
	}
	goodListRef.value.state.goodsType = formValidate.platType;
	// if (state.tableData.data.length) {
	// 	goodListRef.value.state.goodsType = state.tableData.data.map((e) => {
	// 		return e.id;
	// 	});
	// }
	// goodListRef.value.state.goodsType = state.tableData.data;
	goodListRef.value.state.callback = function (row) {
		state.listLoading = false;
		state.tableData.data = row;
	};
	goodListRef.value.state.visible = true;
	// this.$modalGoodList(
	//   function (row) {
	//     state.listLoading = false;
	//     getAttrValue(row);
	//   },
	//   'many',
	//   state.proData,
	// );
};
const show = (id?: string, type?: string) => {
	isSee.value = false;
	isEdit.value = false;
	// getAdminProductClassify();
	if (type == 'see') {
		isSee.value = true;
	} else if (type == 'edit') {
		isEdit.value = true;
	}
	if (id) {
		getCouponInfo(id);
	}
	// state1.queryForm.unionId = id;
	// unionId.value = '';
	// if (unionId) {
	// 	unionId.value = id;
	// 	getDetailsChanges(); //变动明细
	// 	// getUserInfoByUidMobileData();
	// }
};
/** 平台商品分类 **/
const getAdminProductClassify = async (params: any) => {
	try {
		const { code, data, msg } = await productCategoryApi(params);
		if (code === 0) {
			console.log('data', data);
			adminProductClassify.value = data.map((e) => {
				return {
					...e,
					disabled: true,
				};
			});
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 获取商户id
const getMerId = (id) => {
	state.merIds = id;
};
//行删除
const handleDelete = async (index) => {
	try {
		await useMessageBox().confirm('删除该秒杀商品吗？');
	} catch {
		return;
	}
	try {
		state.tableData.data.splice(index, 1);
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
//批量删除
const batchDel = async () => {
	try {
		await useMessageBox().confirm('批量删除该商品吗？');
	} catch {
		return;
	}
	try {
		let data = [];
		for (let item1 of state.tableData.data) {
			let _index = state.multipleSelection.findIndex((c) => c.id === item1.id);
			if (_index === -1) {
				data.push(item1);
			}
		}
		state.tableData.data = data;
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const handleSelectionChange = (val) => {
	state.multipleSelection = val;
};
const selectAll = (data) => {
	let id = data.map((i) => {
		return i.spu_id;
	});
	state.ids = Array.from(new Set([...state.ids, ...id]));
};
const selectOne = (data, row) => {
	let id = data.map((i) => {
		return i.spu_id;
	});
	let index = state.ids.findIndex((e) => {
		return e == row.spu_id;
	});
	state.ids.splice(index, 1);
	state.ids = Array.from(new Set([...state.ids, ...id]));
};
// 关闭弹窗
const resetForm = () => {
	formValidateRef.value.resetFields();
	emit('changeType');
	if (!isEdit.value) {
		emit('getList');
	}
	visible.value = false;
};
// 提交
const onSubmit = async () => {
	console.log('formValidate', formValidate);
	const valid = await formValidateRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		switch (formValidate.category) {
			case 6:
				formValidate.linkedData = state.merIds.toString();
				break;
			case 2:
				if (!state.tableData.data.length) return useMessage().error('请选择至少一个商品');
				let data = [];
				state.tableData.data.map((item) => data.push(item.id));
				formValidate.linkedData = data.toString();
				break;
			case 4:
				formValidate.linkedData = state.linkedData;
				break;
			case 5:
				formValidate.linkedData = state.proBrandList.toString();
				break;
			default:
				formValidate.linkedData = '';
				break;
		}
		// if (formValidate.receiveType === 3) formValidate.isTimeReceive = false;
		// if (form.unionId) {
		// 	form.password = '';
		// }
		const { code, data, msg } = isEdit.value ? await platformCouponEditApi(formValidate) : await platformCouponAddApi(formValidate);
		if (code === 0) {
			console.log('aaa', data);
			useMessage().success('提交成功');
			formValidateRef.value.resetFields();
			formValidate.collectionTime = [];
			formValidate.receiveStartTime = '';
			formValidate.receiveEndTime = '';
			formValidate.validityTime = [];
			formValidate.useStartTime = '';
			formValidate.useEndTime = '';
			visible.value = false;
			emit('changeType');
			if (!isEdit.value) {
				emit('getList');
			}
			// if (!form.unionId) {
			// 	// saveBatchSysPermission(form);
			// 	emit('addToDetail', data);
			// }
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const toForward = () => {
	formValidateRef.value.resetFields();
	formValidate.collectionTime = [];
	formValidate.receiveStartTime = '';
	formValidate.receiveEndTime = '';
	formValidate.validityTime = [];
	formValidate.useStartTime = '';
	formValidate.useEndTime = '';
	// searchTime.value = [];
	// queryForm.value.startTime = '';
	// queryForm.value.endTime = '';
	emit('changeType');
};
// 获取所属业务
const getCouponInfo = async (id: string) => {
	couponInfoApi(id).then((data) => {
		const res = data.data;
		Object.assign(formValidate, JSON.parse(JSON.stringify(res)));
		if (formValidate.isTimeReceive) {
			formValidate.collectionTime = [formValidate.receiveStartTime, formValidate.receiveEndTime];
		}
		if (res.category == 6) {
			state.merIds = formValidate.linkedData.split(',');
		} else if (formValidate.category == 4) {
			state.linkedData = Number(formValidate.linkedData);
		} else if (formValidate.category == 2) {
			state.tableData.data = formValidate.productList;
		} else if (formValidate.category == 5) {
			state.proBrandList = Number(formValidate.linkedData);
		}
		if (formValidate.useStartTime && formValidate.useEndTime) {
			formValidate.validityTime = [res.useStartTime, res.useEndTime];
		}
		formValidate.num = 1;
	});
};
defineExpose({
	show,
});
</script>
<style lang="scss" scoped>
.layout-padding {
	height: 100%;
	.boxSizing {
		box-sizing: border-box;
		margin-bottom: 10px;
	}
}
.addTitle {
	font-size: 20px;
	font-weight: 600;
	color: #000;
}
.back-icon {
	font-size: 20px;
	.el-icon {
		height: 100%;
	}
}

.avatar {
	margin-left: 25px;
	height: 84px;
	width: 84px;
}
.content-title {
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	padding-left: 16px;
	position: relative;
	margin-top: 9px;
	margin-bottom: 9px;
	&::before {
		content: '';
		width: 8px;
		height: 20px;
		border-radius: 2px;
		background-color: #165dff;
		position: absolute;
		left: 0;
	}
}
.el_edit {
	margin-right: 10px;
}
</style>
