<template>
	<el-dialog v-model="dialogVisible" title="运费模板" width="50%" :before-close="handleClose" :modal-append-to-body="false" class="showHeader">
		<div class="demo-drawer__content detailSection">
			<el-form ref="ruleFormRef" :model="ruleForm" label-width="100px" size="small" v-if="dialogVisible" :rules="rules">
				<el-form-item label="模板名称：" prop="name">
					<el-input v-model.trim="ruleForm.name" class="withs" placeholder="请输入模板名称" />
				</el-form-item>
				<el-form-item label="包邮方式：" prop="appoint">
					<el-radio-group v-model="ruleForm.appoint">
						<el-radio :value="0">全国包邮</el-radio>
						<el-radio :value="1">部分包邮</el-radio>
						<el-radio :value="2">自定义</el-radio>
					</el-radio-group>
				</el-form-item>
				<template v-if="Number(ruleForm.appoint) > 0">
					<el-form-item label="计费方式：" prop="type">
						<el-radio-group v-model="ruleForm.type" @change="changeRadio(ruleForm.type)">
							<el-radio :value="1">按件数</el-radio>
							<el-radio :value="2">按重量</el-radio>
							<el-radio :value="3">按体积</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="运费：" prop="region">
						<el-table
							border
							v-loading="listLoading"
							:data="ruleForm.region"
							fit
							highlight-current-row
							style="width: 100%"
							size="small"
							class="tempBox"
						>
							<el-table-column label="送达到" prop="city_ids">
								<template #default="{ row, $index }">
									<span v-if="$index === 0 && ruleForm.appoint === 2">默认运费</span>
									<el-cascader
										ref="cascader"
										v-else
										style="width: 110%"
										:options="cityList"
										v-model="row.city_ids"
										:rules="rules.city_ids"
										:props="props"
										filterable
										collapse-tags
										@change="changeRegion"
									/>
								</template>
							</el-table-column>
							<el-table-column width="150px" :label="columns.title" prop="first">
								<template #default="{ row, $index }">
									<el-form-item :rules="rules.first" :prop="'region.' + $index + '.first'">
										<el-input-number
											v-model.trim="row.first"
											controls-position="right"
											:step-strictly="ruleForm.type === 1 ? true : false"
											:min="ruleForm.type === 1 ? 1 : 0.1"
										/>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column width="150px" label="运费（元）" prop="firstPrice">
								<template #default="{ row, $index }">
									<el-form-item :rules="rules.firstPrice" :prop="'region.' + $index + '.firstPrice'">
										<el-input-number v-model.trim="row.firstPrice" controls-position="right" :min="0" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column width="150px" :label="columns.title2" prop="renewal">
								<template #default="{ row, $index }">
									<el-form-item :rules="rules.renewal" :prop="'region.' + $index + '.renewal'">
										<el-input-number
											v-model.trim="row.renewal"
											controls-position="right"
											:step-strictly="ruleForm.type === 1 ? true : false"
											:min="ruleForm.type === 1 ? 1 : 0.1"
										/>
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column class-name="status-col" label="续费（元）" width="150px" prop="renewalPrice">
								<template #default="{ row, $index }">
									<el-form-item :rules="rules.renewalPrice" :prop="'region.' + $index + '.renewalPrice'">
										<el-input-number v-model.trim="row.renewalPrice" controls-position="right" :min="0" />
									</el-form-item>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="70px">
								<template #default="{ row, $index }">
									<a v-if="ruleForm.appoint === 1 || (ruleForm.appoint !== 1 && $index > 0)" @click="confirmEdit(ruleForm.region, $index)"> 删除 </a>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-edit" @click="addRegion(ruleForm.region)"> 添加区域 </el-button>
					</el-form-item>
					<el-form-item v-if="ruleForm.appoint === 2" label="包邮区域">
						<el-table v-loading="listLoading" :data="ruleForm.free" border fit highlight-current-row style="width: 100%">
							<el-table-column label="选择区域" min-width="220">
								<template #default="{ row }">
									<el-cascader v-model="row.city_ids" ref="cascader" style="width: 100%" :options="cityList" :props="props" clearable collapse-tags />
								</template>
							</el-table-column>
							<el-table-column min-width="140px" :label="columns.title3">
								<template #default="{ row }">
									<el-input-number
										v-model.trim="row.number"
										controls-position="right"
										:step-strictly="ruleForm.type === 1 ? true : false"
										:min="ruleForm.type === 1 ? 1 : 0.1"
									/>
								</template>
							</el-table-column>
							<el-table-column min-width="120px" label="包邮金额（元）">
								<template #default="{ row }">
									<el-input-number v-model.trim="row.price" controls-position="right" />
								</template>
							</el-table-column>
							<el-table-column label="操作" width="70">
								<template #default="{ row, $index }">
									<a @click="confirmEdit(ruleForm.free, $index)"> 删除 </a>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
					<el-form-item v-if="ruleForm.appoint === 2">
						<el-button type="primary" icon="el-icon-edit" @click="addFree(ruleForm.free)"> 添加指定包邮区域 </el-button>
					</el-form-item>
				</template>
				<el-form-item label="排序：">
					<el-input v-model.trim="ruleForm.sort" class="withs" placeholder="请输入排序" />
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<el-button @click="handleClose('ruleForm')">取 消</el-button>
			<el-button type="primary" :loading="loading" @click="onsubmit('ruleForm')">确 定</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
// import
import { templateDetailApi, cityListTree, shippingSave, shippingUpdate } from '/@/api/culture/merchant/logistics';
import { useMessage } from '/@/hooks/message';
// 变量
const defaultRole = {
	name: '',
	type: 1,
	appoint: 0,
	sort: 0,
	region: [
		{
			first: 1,
			firstPrice: 0,
			renewal: 0,
			renewalPrice: 0,
			city_ids: [],
			cityId: 0,
		},
	],
	undelivery: 0,
	free: [],
};
const ruleFormRef = ref();
const kg = '重量（kg）';
const m = '体积（m³）';
const statusMap = ref([
	{
		title: '首件',
		title2: '续件',
		title3: '包邮件数',
	},
	{
		title: `首件${kg}`,
		title2: `续件${kg}`,
		title3: `包邮${kg}`,
	},
	{
		title: `首件${m}`,
		title2: `续件${m}`,
		title3: `包邮${m}`,
	},
]);
const rules = ref({
	name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
	free: [{ type: 'array', required: true, message: '请至少添加一个区域', trigger: 'change' }],
	appoint: [{ required: true, message: '请选择包邮方式', trigger: 'change' }],
	undelivery: [{ required: true, message: '请选择是否指定区域不配送', trigger: 'change' }],
	type: [{ required: true, message: '请选择计费方式', trigger: 'change' }],
	region: [{ required: true, message: '请选择区域运费', trigger: 'change' }],
	city_ids: [{ type: 'array', required: true, message: '请至少选择一个区域', trigger: 'change' }],
	first: [{ required: true, message: '请输入', trigger: 'blur' }],
	renewal: [{ required: true, message: '请输入', trigger: 'blur' }],
	firstPrice: [{ required: true, message: '请输入运费', trigger: 'blur' }],
	renewalPrice: [{ required: true, message: '请输入续费', trigger: 'blur' }],
});
const loading = ref(false);
const props = ref({
	children: 'child',
	label: 'regionName',
	value: 'regionId',
	multiple: true,
});
const emit = defineEmits(['getList']);
const dialogVisible = ref(false);
const ruleForm = ref(Object.assign({}, defaultRole));
const listLoading = ref(false);
const cityList = ref([]);
const columns = ref({
	title: '首件',
	title2: '续件',
	title3: '包邮件数',
});
const tempId = ref(0);
const regionNew = ref([
	{
		first: 1,
		firstPrice: 0,
		renewal: 0,
		renewalPrice: 0,
		city_ids: [],
		cityId: 0,
	},
]);
const type = ref(0); // 0添加 1编辑
onMounted(() => {
	getCityList();
});
const openDialog = (id) => {
	dialogVisible.value = true;
	if (id) {
		getInfo(id);
		type.value = 1;
	} else {
		type.value = 0;
  }
	getCityList();
};
const changeNodes = (data) => {
	if (data.length > 0) {
		for (var i = 0; i < data.length; i++) {
			if (!data[i].child || data[i].child.length < 1) {
				data[i].child = undefined;
			} else {
				changeNodes(data[i].child);
			}
		}
	}
	return data;
};
const confirmEdit = (row, index) => {
	row.splice(index, 1);
};

const handleClose = () => {
	dialogVisible.value = false;
	setTimeout(() => {
		ruleForm.value = {
			name: '',
			type: 1,
			appoint: 0,
			sort: 0,
			region: [
				{
					first: 0,
					firstPrice: 0,
					renewal: 0,
					renewalPrice: 0,
					city_ids: [],
					cityId: 0,
				},
			],
			undelivery: 0,
			free: [],
			undelives: {},
		};
	}, 1000);
	columns.value = Object.assign({}, statusMap.value[0]);
};
const changeRegion = (data) => {};

// const judgeDisabled = (cityList, cityTree) => {
// 	cityList?.map((item, index) => {
// 		item.disabled = item.regionId === cityTree[index];
// 		if (item.child && item.child.length) {
// 			judgeDisabled(item.child);
// 		}
// 	});
// };
const changeRadio = (num) => {
	columns.value = Object.assign({}, statusMap.value[num - 1]);
	console.log('columns.value', columns.value);
};
const addRegion = (region) => {
	region.push(
		Object.assign(
			{},
			{
				first: 0,
				firstPrice: 0,
				renewal: 0,
				renewalPrice: 0,
				city_ids: [],
				cityId: '',
			}
		)
	);
};
const addFree = (Free) => {
	Free.push(
		Object.assign(
			{},
			{
				number: 1,
				price: 1,
				city_ids: [],
				cityId: '',
			}
		)
	);
};
const getInfo = (id) => {
	tempId.value = id;
	loading.value = true;
	templateDetailApi({ id })
		.then((res) => {
			dialogVisible.value = true;
			const info = res.data;
			if (info.appoint === 0) info.type = 1;
			if (Number(info.appoint) > 0) {
				if (info.regionList && info.regionList.length > 0) {
					info.regionList.forEach((item, index) => {
						item.title = JSON.parse(item.title);
						item.city_ids = item.title;
					});
				}
				if (info.freeList && info.freeList.length > 0) {
					info.freeList.forEach((item, index) => {
						item.title = JSON.parse(item.title);
						item.city_ids = item.title;
					});
				}
			}
			ruleForm.value = Object.assign(ruleForm.value, {
				name: info.name,
				type: info.type,
				appoint: info.appoint,
				sort: info.sort,
				region: info.regionList || [], // 运费区域
				free: info.freeList || [], // 包邮区域
			});
			regionNew.value = [...ruleForm.value.region];
			columns.value = Object.assign({}, statusMap.value[ruleForm.value.type - 1]);
			nextTick(() => {
				loading.value = false;
			});
		})
		.catch((res) => {
			// console.integralLog(res)
			useMessage().error(res.message);
			nextTick(() => {
				loadingInstance.close();
			});
		});
};
// 列表
const getCityList = () => {
	cityListTree()
		.then((res) => {
			console.log('res', res);
			localStorage.setItem('cityList', JSON.stringify(res.data));
			const cityLists = [];
			if (res.data?.length > 0) {
				res.data.forEach((item) => {
					cityLists.push(item);
				});
			}
			console.log('cityLists', cityLists);
			cityList.value = changeNodes(cityLists);
		})
		.catch((res) => {
			useMessage().error(res.message);
		});
};
const onsubmit = () => {
	ruleFormRef.value.validate((valid) => {
		if (valid) {
			loading.value = true;
			const param = {
				appoint: ruleForm.value.appoint,
				name: ruleForm.value.name,
				sort: ruleForm.value.sort,
				type: ruleForm.value.type,
				// 配送区域及运费
				shippingTemplatesRegionRequestList: [],
				// 指定包邮设置
				shippingTemplatesFreeRequestList: [],
				id: tempId.value,
			};
			ruleForm.value.region.forEach((el, index) => {
				el.title = el.city_ids?.length > 0 ? JSON.stringify(el.city_ids) : JSON.stringify([[0, 0]]);
				if (el.title === '[[0,0]]') {
					el.cityId = '0';
				} else {
					for (var i = 0; i < el.city_ids.length; i++) {
						el.city_ids[i].splice(0, 2);
					}
					el.cityId = el.city_ids.length > 0 ? el.city_ids.join(',') : '0';
				}
			});
			param.shippingTemplatesRegionRequestList = ruleForm.value.region;
			param.shippingTemplatesRegionRequestList.forEach((el, index) => {
				delete el['city_ids'];
			});
			ruleForm.value.free.forEach((el, index) => {
				el.title = el.city_ids.length > 0 ? JSON.stringify(el.city_ids) : JSON.stringify([[0, 0]]);
				if (el.title === '[[0,0]]') {
					el.cityId = '0';
				} else {
					for (var i = 0; i < el.city_ids.length; i++) {
						el.city_ids[i].splice(0, 2);
					}
					el.cityId = el.city_ids.length > 0 ? el.city_ids.join(',') : '0';
				}
			});
			param.shippingTemplatesFreeRequestList = ruleForm.value.free;
			param.shippingTemplatesFreeRequestList.forEach((el, index) => {
				delete el['city_ids'];
			});
			if (ruleForm.value.appoint === 2) {
				ruleForm.value.region.map((item, index) => {
					ruleForm.value.region[0].title = '[[0,0]]';
					ruleForm.value.region[0].cityId = '0';
				});
			}
			if (ruleForm.value.appoint === 0) {
				delete param['shippingTemplatesRegionRequestList'];
				delete param['shippingTemplatesFreeRequestList'];
				ruleForm.value.type = 0;
			}
			const request = type.value === 0 ? shippingSave : shippingUpdate;
			request(param)
				.then((res) => {
					useMessage().success('操作成功');
					emit('getList');
					handleClose();
				})
				.catch((error) => {
					useMessage().error(error.msg);
					loading.value = false;
				});
		} else {
			return false;
		}
	});
};

defineExpose({
	openDialog,
	getCityList,
});
</script>

<style scoped lang="scss"></style>
