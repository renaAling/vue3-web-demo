<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="商品分类：" prop="categoryId">
						<el-cascader
							ref="cascader"
							v-model="state.queryForm.categoryId"
							@change="getDataList"
							clearable
							:options="adminProductClassify"
							:props="categoryProps"
							class="selWidth"
						/>
					</el-form-item>
					<!-- <el-form-item label="供应商：" prop="merId">
						<merchant-name @getMerId="getMerId" :merIdChecked="state.queryForm.merId" :className="'selWidth'" :isDisabled="false"></merchant-name>
					</el-form-item> -->
					<el-form-item label="SPU：" prop="id">
						<el-input
							v-model="state.queryForm.id"
							placeholder="请输入SPU编码"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						></el-input>
					</el-form-item>
					<el-form-item label="所属运营机构：" prop="businessCode">
						<el-select v-model.trim="state.queryForm.businessCode" clearable placeholder="请选择所属运营机构" class="selWidth">
							<el-option :label="item.label" :value="item.value" v-for="item in businessOption" :key="'businessCode' + item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="商品搜索：" prop="keywords">
						<el-input
							v-model="state.queryForm.keywords"
							placeholder="请输入商品名称，关键字"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						></el-input>
					</el-form-item>
					<el-form-item label="会员商品：" prop="isPaidMember">
						<el-select v-model="state.queryForm.isPaidMember" clearable placeholder="请选择" class="selWidth" @change="getDataList">
							<el-option label="是" value="true" />
							<el-option label="否" value="false" />
						</el-select>
					</el-form-item>
					<el-form-item label="全境商品ID：" prop="spuId">
						<el-input
							v-model="state.queryForm.spuId"
							placeholder="请输入全境商品ID"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						></el-input>
					</el-form-item>
					<!-- <el-form-item label="积分商品：" prop="isPaidScore">
						<el-select v-model="state.queryForm.isPaidScore" clearable placeholder="请选择" class="selWidth" @change="getDataList">
							<el-option label="是" value="true" />
							<el-option label="否" value="false" />
						</el-select>
					</el-form-item> -->
					<el-form-item>
						<el-button type="primary" @click="getDataList(), goodHeade()">查询</el-button>
						<el-button @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-tabs class="list-tabs mb5" v-model="state.queryForm.type" @tab-change="handleSeachList">
				<el-tab-pane :label="item.name + '(' + item.count + ')'" :name="item.type.toString()" v-for="(item, index) in headeNum" :key="index" />
			</el-tabs>
			<div class="mb-5">
				<el-button type="primary" @click="handleAdd">添加商品</el-button>
				<el-button :disabled="!multipleSelection.length" @click.native="handlebatchOff()" v-if="state.queryForm.type === ProductTypeEnum.OnSale"
					>强制下架</el-button
				>
				<el-button :disabled="!multipleSelection.length" @click.native="handlebatchAudit" v-if="state.queryForm.type === ProductTypeEnum.Audit"
					>批量审核</el-button
				>
				<el-button
					:disabled="!multipleSelection.length"
					@click.native="handlebatchOn()"
					v-if="state.queryForm.type === ProductTypeEnum.InTheWarehouse"
					>批量上架</el-button
				>
			</div>
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange"
			>
				<el-table-column
					v-if="Number(state.queryForm.type) < 3 || state.queryForm.type === ProductTypeEnum.Audit"
					key="2"
					type="selection"
					width="55"
				/>
				<el-table-column type="expand" width="40">
					<template #default="{ row }">
						<el-form label-position="left" inline class="demo-table-expand" style="width: 70%; margin: 0 60px">
							<el-form-item label="商户类别：">
								<span>{{ row.isSelf ? '自营' : '非自营' }}</span>
							</el-form-item>
							<el-form-item label="其他销量：">
								<span>{{ row.ficti }}</span>
							</el-form-item>

							<el-form-item label="拒绝原因：" v-if="state.queryForm.type == 7">
								<span>{{ row.reason }}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column prop="id" label="SPU" width="100" v-if="checkedCities.includes('SPU')" show-overflow-tooltip />
				<el-table-column prop="spuId" label="全境商品ID" width="120" v-if="tenantId == '1963773220574330882'" show-overflow-tooltip />
				<el-table-column label="商品图" width="80" v-if="checkedCities.includes('商品图')" show-overflow-tooltip>
					<template #default="{ row }">
						<div class="demo-image__preview line-heightOne">
							<el-image :src="row.image" :preview-src-list="[row.image]" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="商品名称" prop="name" min-width="180" v-if="checkedCities.includes('商品名称')" :show-overflow-tooltip="true">
				</el-table-column>
				<!-- 其他商城 -->
				<el-table-column v-if="tenantId !== '1922177185280557058'" prop="price" label="价格" min-width="90" show-overflow-tooltip />
				<el-table-column v-if="tenantId !== '1922177185280557058'" prop="vipPrice" label="内购价" min-width="110" show-overflow-tooltip>
				</el-table-column>
				<el-table-column v-if="tenantId !== '1922177185280557058'" prop="originalPrice" label="原价" min-width="90" show-overflow-tooltip />
				<!-- 积分商城 -->
				<!-- <el-table-column v-if="tenantId == '1922177185280557058'" prop="price" label="支付现金" min-width="90" show-overflow-tooltip /> -->
				<el-table-column v-if="tenantId == '1922177185280557058'" prop="vipScorePrice" label="内购积分" min-width="90" show-overflow-tooltip />
				<el-table-column v-if="tenantId == '1922177185280557058'" prop="scorePrice" label="支付积分" min-width="110" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.scorePrice || 0 }}</span>
						<!-- <span v-if="row.scorePrice != null">（{{ (row.scorePrice / 100).toFixed(2) }}元）</span> -->
					</template>
				</el-table-column>
				<el-table-column label="商户类别" min-width="100" v-if="checkedCities.includes('商户类别')">
					<template #default="{ row }">
						<span>{{ row.isSelf ? '自营' : '非自营' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="所属供应商" min-width="160" prop="merchantName" show-overflow-tooltip v-if="!isMerchant"></el-table-column>
				<el-table-column label="所属运营机构" min-width="160" prop="businessName" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sales" label="销量" v-if="checkedCities.includes('销量')" min-width="100" show-overflow-tooltip />
				<el-table-column prop="stock" label="库存" min-width="70" v-if="checkedCities.includes('库存')" show-overflow-tooltip />
				<el-table-column label="审核状态" min-width="100" v-if="checkedCities.includes('审核状态')" show-overflow-tooltip>
					<template #default="{ row }">
						<el-tag type="primary" v-if="row.auditStatus === 0">无需审核</el-tag>
						<el-tag type="warning" v-if="row.auditStatus === 1">待审核</el-tag>
						<el-tag type="success" v-if="row.auditStatus === 2">审核成功</el-tag>
						<el-tag type="danger" v-if="row.auditStatus === 3">审核拒绝</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="首次上架时间" min-width="160" prop="firstUpTime" show-overflow-tooltip></el-table-column>
				<el-table-column label="最近上架时间" min-width="160" prop="recentUpTime" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column label="状态" min-width="160" prop="isShow" fixed="right" show-overflow-tooltip>
					<template  #default="{ row }">
						<el-switch v-model="row.isShow" :before-change="() => changeStatus(row)" :active-value="true" :inactive-value="false" active-text="上架" inactive-text="下架"></el-switch>
					</template>
				</el-table-column> -->

				<el-table-column label="操作" width="300px" fixed="right" show-overflow-tooltip>
					<template #default="{ row }">
						<el-button link type="primary" @click="handleAudit(row.id, 'see')">详情</el-button>
						<el-button v-if="state.queryForm.type === '6'" link type="primary" @click="handleAudit(row.id, 'audit')">审核</el-button>
						<el-button v-if="isMerchant && state.queryForm.type === '8'" link type="primary" @click="handleAuditForMer(row.id)">提交审核</el-button>
						<el-button v-if="Number(state.queryForm.type) < 7" link type="primary" @click="handleEdit(row)">编辑</el-button>
						<!-- <el-button v-if="isMerchant && row.isShow" link type="primary" @click="editStoreRef.openDialog(row)">编辑库存</el-button> -->
						<el-button v-if="Number(state.queryForm.type) < 2" link type="primary" @click="handleDown([row.id])">下架</el-button>
						<el-button v-if="Number(state.queryForm.type) == 2" link type="primary" @click="handleUp(row.id)">上架</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<chooseProductTypeDialog @refresh="getDataList()" @handleAdd="onChooseProductType" ref="chooseProductTypeRef" />
		<batch-audit :idList="checkedIds" ref="refBatchAudit" @subBatchAuditSuccess="subBatchAuditSuccess"></batch-audit>
		<audit-dialog ref="auditDialogRef" @subSuccess="subSuccess"></audit-dialog>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import {
	productLstApi,
	offShellApi,
	onShellApi,
	productHeadersApi,
	productCategoryApi,
	offShell,
	onShell,
	submitAudit,
} from '/@/api/culture/commodity/commodityList';
import { getBusinessPage } from '/@/api/culture/merchant/merchantManage'; //获取商户数据

onMounted(() => {
	getAdminProductClassify();
	goodHeade();
	getBusinessPageData(); //获取商家
	state.queryForm.type = '1';
});
const tenantId = ref(Session.getTenant());
const chooseProductTypeDialog = defineAsyncComponent(() => import('./components/chooseProductTypeDialog.vue'));
const batchAudit = defineAsyncComponent(() => import('./components/batchAudit.vue'));
const auditDialog = defineAsyncComponent(() => import('./info.vue'));
const merchantName = defineAsyncComponent(() => import('./components/merchantName/index.vue'));
// const infoFrom = defineAsyncComponent(() => import('./info.vue'));
const chooseProductTypeRef = ref() as any;
const editStoreRef = ref() as any;
const auditDialogRef = ref() as any;
const refBatchAudit = ref() as any;
const queryRef = ref();
const addType = ref<any>('isAdd');
const componentKey = ref(0);
// const plateList = ref([]);
const isShow = ref(false);
const goodsType = ref('3');
import { ElMessageBox } from 'element-plus';
const adminProductClassify = ref<any[]>([]);
const checkedCities = ref(['SPU', '商品图', '商品名称', '商品售价', '商户名称', '商户类别', '销量', '库存', '审核状态']);
const ProductTypeEnum = ref({
	OnSale: '1', //出售中
	InTheWarehouse: '2', //仓库中
	SoldOut: '3', //已售罄
	AlertInventory: '4', //警戒库存
	RecycleBin: '5', //回收站
	Audit: '6', //待审核
	ReviewFailed: '7', //审核失败
	PendingReview: '8', //待提审
});
const categoryProps = ref({
	value: 'id',
	label: 'name',
	children: 'childList',
	expandTrigger: 'hover',
	checkStrictly: false,
	emitPath: false,
	multiple: false,
});
const headeNum = ref<any>([]);
const headerName = ref([
	{
		name: '出售中商品',
		type: 1,
	},
	{
		name: '仓库中商品',
		type: 2,
	},
	{
		name: '库存告警',
		type: 4,
	},
	{
		name: '待审核商品',
		type: 6,
	},
	{
		name: '审核未通过商品',
		type: 7,
	},
]);

const headerNameMerchant = ref([
	// 1：出售中（已上架），2：仓库中（未上架），3：已售罄，4：警戒库存，5：回收站,6:待审核，7：审核失败，8：待提审
	{
		name: '出售中商品',
		type: 1,
	},
	{
		name: '仓库中商品',
		type: 2,
	},
	{
		name: '已售罄',
		type: 3,
	},
	{
		name: '库存告警',
		type: 4,
	},
	{
		name: '回收站',
		type: 5,
	},
	{
		name: '待审核商品',
		type: 6,
	},
	{
		name: '审核未通过商品',
		type: 7,
	},
	{
		name: '待提审',
		type: 8,
	},
]);
const multipleSelection = ref<any[]>([]);
const checkedIds = ref<any[]>([]);
const router = useRouter();
const businessOption = ref<any>([]);

const getAdminProductClassify = async () => {
	try {
		const { code, data, msg } = await productCategoryApi();
		if (code === 0) {
			console.log('data', data);
			adminProductClassify.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const getBusinessPageData = async () => {
	businessOption.value = [];
	try {
		const { code, data, msg } = await getBusinessPage({ current: 1, size: 1000, limit: 1000, descs: '', ascs: '' });
		if (code === 0) {
			console.log('data', data);
			if (data.records.length) {
				data.records.forEach((item: any) => {
					businessOption.value.push({
						label: item.name,
						value: item.code,
					});
				});
			}
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const getMerId = (id: number | string) => {
	state.queryForm.merId = id;
	subSuccess();
};
//批量审核提交成功回调
const subBatchAuditSuccess = () => {
	subSuccess();
};
const subSuccess = () => {
	getDataList('');
	goodHeade();
};
//搜索
const handleSeachList = () => {
	state.queryForm.current = 1;
	// state.queryForm.type = 1;
	getDataList();
	goodHeade();
};
const isMerchant = computed(() => {
	return import.meta.env.VITE_IS_MERCHANT;
});
// 获取商品表单头数量
const goodHeade = async () => {
	let params = Object.assign({ goodsType: goodsType.value }, state.queryForm);
	// let params = Object.assign(state.queryForm);
	delete params.page;
	delete params.limit;
	delete params.type;
	try {
		const { code, data, msg } = await productHeadersApi(params);
		if (code === 0) {
			console.log('data', data);
			data.map((item: any) => {
				item.name = headerName.value.find((e: any) => e.type === item.type)?.name;
				if (isMerchant.value) {
					item.name = headerNameMerchant.value.find((e: any) => e.type === item.type)?.name;
				} else {
					item.name = headerName.value.find((e: any) => e.type === item.type)?.name;
				}
				// if (Number(item.type) === headerName.value[index].type) item.name = headerName.value[index].name;
			});
			headeNum.value = data;
			console.log('headeNum.value', headeNum.value);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const handleSelectionChange = (val: any) => {
	console.log('val', val);
	multipleSelection.value = val;
	const data: any[] = [];
	multipleSelection.value.map((item) => {
		data.push(item.id);
	});
	checkedIds.value = data;
};
// 批量下架
const handlebatchOff = () => {
	if (multipleSelection.value.length === 0) return useMessage().warning('请先选择商品');
	handleDown(checkedIds.value);
};
// 批量上架
const handlebatchOn = () => {
	if (multipleSelection.value.length === 0) return useMessage().warning('请先选择商品');
	console.log('checkedIds.value', checkedIds.value);
	handleUp(checkedIds.value, 'batch');
};
const handlebatchAudit = () => {
	if (multipleSelection.value.length === 0) return useMessage().warning('请先选择商品');
	//   this.$refs.refBatchAudit.dialogVisible = true;
};
// 下架
const handleDown = async (id: any[]) => {
	try {
		await ElMessageBox.confirm('确认强制下架所选数据吗？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	console.log('id', id, id.toString());
	try {
		const { code, msg } = await offShellApi({ idList: id });
		if (code === 0) {
			useMessage().success('提交成功');
			subSuccess();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 上架
const handleUp = async (id: any, str?: string) => {
	console.log('id', id);
	let idList = [];
	if (str !== 'batch') {
		idList = [id];
	} else idList = id;

	// let idList = typeof id == 'number' ? [id] : id;
	try {
		await ElMessageBox.confirm('是否确认上架所选数据？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	// console.log('idList', idList);
	try {
		const { code, msg } = await onShellApi({ idList });
		if (code === 0) {
			useMessage().success('提交成功');
			subSuccess();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const handleAdd = () => {
	chooseProductTypeRef.value.openDialog();
	// addType.value = 2;
	// router.push({ path: '/culture/commodity/commodityList/edit', query: {} });
};
const handleEdit = async (row: any) => {
	console.log('row', row);
	if (state?.queryForm.type == '1') {
		try {
			await useMessageBox().confirm('下架该商品吗？出售商品需下架之后可编辑。', '提示');
		} catch {
			return;
		}
		try {
			const { code, msg } = await offShellApi({ idList: [row.id] });
			// useMessage().success('已启用');
			if (code === 0) {
				if (tenantId.value == '1963773220574330882')
					router.push({ path: '/culture/commodity/commodityList/edit', query: { id: row.id.toString(), spuId: row.spuId.toString() } });
				else router.push({ path: '/culture/commodity/commodityList/edit', query: { id: row.id.toString() } });
				// this.$router.push({ path: `/culture/productList/createProduct/${row.id}/2/2/${row.type}` });
			} else {
				useMessage().error(msg);
			}
			getDataList();
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		if (tenantId.value == '1963773220574330882')
			router.push({ path: '/culture/commodity/commodityList/edit', query: { id: row.id.toString(), spuId: row.spuId.toString() } });
		else router.push({ path: '/culture/commodity/commodityList/edit', query: { id: row.id.toString() } });
	}
};
const handleAudit = (id: any, style: string) => {
	// if (style === 'see') {
	// }
	// this.$refs.infoFrom.dialogVisible = true;
	//   this.isShow = true;
	//   this.isAtud = c;
	componentKey.value += 1;
	auditDialogRef.value.openDialog(id, style);
};
const handleAuditForMer = async (id: string) => {
	let isAutoUp = false;
	try {
		await useMessageBox().confirm('提审后是否自动上架？', '提示');
		isAutoUp = true;
	} catch {
		console.log('取消');
		isAutoUp = false;
		return;
	}
	await submitAudit({
		id,
		isAutoUp,
	});
	getDataList();
};
// 确认选择商品类型
const onChooseProductType = (data: any) => {
	console.log('确认选择商品类型', data);
	const productType = data;
	router.push({ path: '/culture/commodity/commodityList/edit', query: { productType: productType } });

	// router.push({ path: `/culture/productList/createProduct/0/2/${addType.value}/${productType.value}` });
};
const changeStatus = async (row: any) => {
	const { id, isShow } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${isShow ? '下架' : '上架'}该商品`, `${isShow ? '下架' : '上架'}`)
				.then(async () => {
					let params = { id: id };
					try {
						const request = isShow ? offShell : onShell;
						const { code, msg } = await request({ params });
						if (code === 0) {
							useMessage().success(`${isShow ? '下架' : '上架'}成功`);
							getDataList;
							return resolve(true);
						} else {
							useMessage().error(msg);
						}
					} catch (err: any) {
						useMessage().error(err.msg);
					}
				})
				.catch(() => {
					resolve(false);
				});
		} catch (err) {
			reject(false);
		}
	});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	// timeVal.value = [];
	getDataList();
	goodHeade();
	// getHeadNum();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: productLstApi,
	queryForm: {
		goodsType: goodsType.value,
	},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style lang="scss" scoped>
.isPay,
.refundAmount {
	color: #2e5cf6;
}

.el-icon-arrow-down {
	font-size: 12px;
}
</style>
