<template>
	<el-dialog v-model="modals" title="发货" :show-close="false" width="800px">
		<el-form ref="formItemRef" :model="formItem" label-width="100px" @submit.native.prevent :rules="rules">
			<el-form-item label="发货类型：" prop="expressId">
				<el-radio-group v-model="formItem.expressRecordType">
					<el-radio label="1">同城配送</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="配送平台：" prop="expressCode">
				<el-select v-model="formItem.expressCode" filterable style="width: 100%" clearable>
					<el-option v-for="(item, i) in express" :value="item.code" :key="i" :label="item.name"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="配送单号：" prop="expressNumber">
				<el-input v-model.trim="formItem.expressNumber" placeholder="请输入快递单号" style="width: 100%" clearable></el-input>
			</el-form-item>
			<el-form-item label="分单发货：" prop="isSplit">
				<el-switch v-model="formItem.isSplit" :active-value="true" :inactive-value="false" active-text="开启" inactive-text="关闭" inline-prompt />
			</el-form-item>
			<template v-if="formItem.isSplit">
				<el-form-item label="">
					<p class="from-tips">可选择表格中的商品单独发货，请谨慎操作！</p>
				</el-form-item>
				<el-table
					style="padding-left: 75px"
					:data="productList"
					tooltip-effect="dark"
					class="tableSelection"
					size="small"
					:row-key="
						(row:any) => {
							return row.id;
						}
					"
					@selection-change="handleSelectionChange"
					:cell-style="{ textAlign: 'left' }"
					:header-cell-style="{ textAlign: 'left', background: '#e7eefd', color: '#515a6e' }"
				>
					<el-table-column type="selection" :selectable="selectable" :reserve-selection="true" width="50" />
					<el-table-column label="商品信息" width="200">
						<template #default="{ row }">
							<div class="acea-row" style="align-items: center">
								<div class="demo-image__preview line-heightOne refundImg">
									<el-image :src="row.image" :preview-src-list="[row.image]" />
									<span class="product-info-text" style="width: 120px">{{ row.productName }}</span>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="规格" width="160">
						<template #default="{ row }">
							<span>{{ row.sku }}</span>
						</template>
					</el-table-column>
					<el-table-column label="总数（件）" width="160">
						<template #default="{ row }">
							<span>{{ row.payNum }}</span>
							<div class="textE93323">已发{{ row.deliveryNum }}</div>
							<div class="textE93323">已退款{{ row.refundNum }}</div>
						</template>
					</el-table-column>
					<el-table-column label="发货数量（件）" width="160">
						<template #default="{ row }">
							<el-input-number
								:disabled="row.deliveryNum === row.payNum"
								v-model.trim="row['num']"
								:min="0"
								:max="Number(row.payNum) - Number(row.deliveryNum)"
								:step="1"
								@blur="limitCount(row)"
							/>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-form>
		<template #footer>
			<el-button @click="handleClose(formItemRef)">取消</el-button>
			<el-button type="primary" @click="onSubmit(formItemRef)">提交</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { orderDetailList } from '/@/api/culture/order';
import { expressPageApi } from '/@/api/culture/logistics';
import { orderSendApi } from '/@/api/culture/cultureOrder';
import type { FormInstance, FormRules, UploadUserFile, UploadProps, UploadRequestOptions, UploadFile, UploadFiles } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { withDefaults } from 'vue';

interface DetailItemType {
	orderDetailId: number;
	num: number;
}

interface FormItemType {
	deliveryType: string;
	isSplit: boolean;
	expressRecordType: string;
	expressId: string;
	expressCode: string;
	expressNumber: string;
	orderNo: string;
	detailList: DetailItemType[];
}
const emit = defineEmits(['submitFail']);
const props = defineProps(['orderNo']);

const formItemRef = ref();
const modals = ref(false);
const productList = ref([]);
const express = ref([]);
const multipleSelection = ref([]);
const formItem = ref<FormItemType>({
	deliveryType: 'express',
	isSplit: false,
	expressRecordType: '1',
	expressId: '',
	expressCode: '',
	expressNumber: '',
	orderNo: '',
	detailList: [],
});

const rules = reactive<FormRules>({
	expressCode: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
	expressNumber: [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
	isSplit: [{ required: true, message: '请选择是否分单发货', trigger: 'change' }],
});

// 决定这一行的 CheckBox 是否可以勾选
const selectable = (row: any) => {
	if (row.deliveryNum === row.payNum) {
		return false;
	} else {
		return true;
	}
};

const limitCount = (row: any) => {
	if (row.num > row.payNum) row.num = row.payNum;
};

// 分单发货选择商品
const handleSelectionChange = (val: any) => {
	multipleSelection.value = val;
};

// 商品信息
const orderProDetail = (orderNo: string, merId: number) => {
	orderDetailList({ orderNo, merId }).then(async (res) => {
		productList.value = res.data;
		productList.value = productList.value.map((item) => Object.assign(item, { num: 1 }));
		console.log('productList.value', productList.value);
	});
};

// 物流公司列表
const getList = () => {
	expressPageApi({
		keywords: '',
		current: 1,
		size: 1200,
		openStatus: true,
		isShow: true,
	}).then((res) => {
		console.log('res', res);
		express.value = res.data.records;
		express.value.map((item) => {
			if (item.isDefault) formItem.value.expressCode = item.code;
		});
	});
};
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				formItem.value.orderNo = props.orderNo;
				const formData = { ...formItem.value };
				let data: Partial<FormItemType> = {};
				// 复制 formItem 中的值到 data
				for (const key in formData) {
					data[key] = formData[key];
				}

				if (data.isSplit) {
					const attr: DetailItemType[] = multipleSelection.value.map((item: any) => ({
						orderDetailId: item.id,
						num: item.num,
					}));
					data.detailList = attr;

					if (!data.detailList.length) {
						return useMessage().warning('请选择分单发货商品');
					}

					let flag = false;
					data.detailList.forEach((item) => {
						if (!item.num) {
							flag = true;
						}
					});

					if (flag) {
						useMessage().warning('请填写发货数量');
						return;
					}
				} else {
					delete data.detailList; // 现在可以安全删除
				}
				const { code } = await orderSendApi(data);
				if (code === 0) {
					useMessage().success('发货成功');
					modals.value = false;
					resetForm(formEl);
					emit('submitFail');
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		}
	});
};

const handleClose = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	modals.value = false;
	// resetForm(formItemRef.value);
};

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	// model.value = {
	// 	mobile: '',
	// 	roleInfos: [],
	// 	nickName: '',
	// };
	// isShowName.value = false;
	// isShowRole.value = false;
	// isShowResult.value = false;
	// userStateMsg.value = '';
	modals.value = false;
};

defineExpose({ getList, orderProDetail, modals });
</script>

<style scoped lang="scss">
.width8 {
	width: 80%;
}

.width9 {
	width: 70%;
}

.tempImgList {
	// opacity: 1;
	width: 38px !important;
	height: 30px !important;
	// margin-top: -30px;
	cursor: pointer;
	position: absolute;
	z-index: 11;
	img {
		width: 38px !important;
		height: 30px !important;
	}
}
.refundImg {
	display: flex;
	align-items: center;
}
.product-info-text {
	display: block;
	white-space: nowrap; /* 确保文本在一行内显示 */
	overflow: hidden; /* 超出容器部分隐藏 */
	text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
	margin-left: 5px;
}

.from-tips {
	font-size: 12px;
	color: #909399;
	line-height: 12px;
	text-align: left;
}
//表格中带checkbox选择框的样式
.tableSelection {
	.el-table__cell:first-child .cell {
		padding-left: 14px;
		padding-right: 14px;
	}
}

.acea-row {
	display: flex;
	flex-wrap: wrap;
}

.demo-image__preview {
	display: flex;
	.el-image {
		width: 50px;
		height: 50px;
	}
}
.line-heightOne {
	line-height: 1;
}
.product-info-text {
	display: block;
	white-space: nowrap; /* 确保文本在一行内显示 */
	overflow: hidden; /* 超出容器部分隐藏 */
	text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
	margin-left: 5px;
}
.textE93323 {
	color: #e93323 !important;
}
//dialog按钮上间距
.dialog-btn-top {
	padding-top: 20px;
}
</style>
