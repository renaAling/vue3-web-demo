<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs class="list-tabs mt14" v-model="queryForm.status" @tab-click="handleTabClick">
				<el-tab-pane name="0" label="智元汇公司"></el-tab-pane>
				<el-tab-pane name="1" label="轨道资源公司"></el-tab-pane>
			</el-tabs>
			<el-table
				border
				:data="tableData"
				v-loading="listLoading"
				row-key="orderNo"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				class="mt20"
			>
				<el-table-column prop="id" label="支付渠道编号" width="200" />
				<el-table-column prop="payName" label="支付渠道名称" />
				<el-table-column label="开通" prop="payPostage">
					<template #default="{ row }">
						<el-checkbox v-model="row.checked" label="" size="large" @change="handleCheckboxChange(row)" />
					</template>
				</el-table-column>
				<el-table-column prop="merchantId" label="支付商户号" />
				<el-table-column label="操作" width="220" fixed="right">
					<template #default="{ row }">
						<el-tag v-if="row.isPayDefault" class="ml-2" type="danger" style="color: #f56d6d; border: 1px solid #f56d6d">默认</el-tag>
						<el-button v-else type="primary" link @click="handleSet(row)"> 设为默认 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-table :data="merchantList" row-key="id" class="my-table" :border="true">
			<el-table-column label="姓名" prop="name" align="center" width="150"></el-table-column>
			<el-table-column :label="item.name" :prop="item.code" align="center" v-for="(item, index) in sysInfostem" :key="index">
				<template #default="{ row }">
					<el-checkbox v-model="row[item.code].ischecked" @change="handleCheckboxChange(row)"></el-checkbox>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" align="center">
				<template #default="{ row, $index }">
					<el-button v-if="row.isModified" type="primary" link @click="save(row)">更新</el-button>
				</template>
			</el-table-column>
		</el-table> -->
		</div>
	</div>
</template>

<script setup lang="ts" name="pay-channels">
import { getBusinessPage, getBusinessUpdate, getGetBusinessPayListApi, postSetDefaultApi } from '/@/api/culture/merchant/merchantManage';
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';

onMounted(async () => {
	await getDataList(); // 获取商户数据
});
const activeIndex = ref('1');
const merchantList = ref([]);
const queryForm = reactive({
	status: '0',
});
const tableData = ref<any[]>([]);
const listLoading = ref(false);
const businessPayList = ref<any[]>([]);
const state: BasicTableProps = reactive<BasicTableProps>({});
const { tableStyle } = useTable(state);
onMounted(() => {
	getGetBusinessPayList();
	getDataList();
});
const handleSet = async (row: any) => {
	const params = {
		businessCode: row.merchantId,
		payCode: row.code,
		isDefault: true,
	};
	try {
		const { code, data, msg } = await postSetDefaultApi(params);
		if (code == 0) {
			useMessage().success('更新成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
	//
};

const getDataList = async () => {
	merchantList.value = [];

	const { code, data, msg } = await getBusinessPage();
	if (code == 0) {
		console.log('用户数据', data.records);
		const payCodesList = data.records[Number(queryForm.status)].payCodes || [];
		if (payCodesList.length > 0 && businessPayList.value.length > 0) {
			console.log('businessPayList', businessPayList.value);
			// is_pay_default
			tableData.value = [];
			businessPayList.value.forEach((item: any) => {
				const obj = {
					...item,
					mchId: data.records[Number(queryForm.status)].mchId, //商户号（有微信支付必填）
					merchantId: data.records[Number(queryForm.status)].code, // 商户唯一编码
					merchantName: data.records[Number(queryForm.status)].name,
					checked: payCodesList.includes(item.code),
					isPayDefault: data.records[Number(queryForm.status)].isPayDefault == item.code,
				};
				tableData.value.push(obj);
				console.log('tableData.value', tableData.value);
			});
		}
	} else {
		useMessage().error(msg);
	}

	// if(businessPayList.value.length > 0 ){
	// 	businessPayList.value.forEach((item: any) => {
	// 		tableData.
	// 	// if(item.code === item.payCode)
	// 	});
	// }

	// const list = payCodesList.map((item: any) => {
	// 	const sys = sysInfostem.value.find((sys: any) => sys.code === item);
	// 	return {
	// 		...item,
	// 		name: sys.name,
	// 	};
	// });
	// merchantList.value = transformData(list, sysInfostem.value);
};
const getGetBusinessPayList = async () => {
	businessPayList.value = [];
	const { code, data, msg } = await getGetBusinessPayListApi();
	if (code === 0) {
		businessPayList.value = data;
		console.log('data', data);
	} else {
		useMessage().error(msg);
	}
};
const handleCheckboxChange = async (row: any) => {
	const payCodesList: any[] = [];
	const checkedItems = tableData.value.filter((item) => item.checked === true);
	checkedItems.forEach((item) => {
		payCodesList.push(item.code);
	});
	console.log('payCodesList', payCodesList);
	try {
		const params = {
			code: row.merchantId,
			name: row.merchantName,
			mchId: row.mchId,
			payCodes: payCodesList,
		};
		console.log('params', params);

		const { code, msg } = await getBusinessUpdate(params);
		if (code == 0) {
			useMessage().success('更新成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
	// const currentCheckedKeys = Object.keys(row).filter((key) => {
	// 	const value = row[key];
	// 	return typeof value === 'object' && value !== null && value.ischecked === true;
	// });
	// const initialCheckedKeys = row.initialCheckedKeys;
	// row.isModified = !arraysEqual(currentCheckedKeys, initialCheckedKeys);
};
// 保存
const save = async (params: any) => {
	// const checkedKeys = filterCheckedKeys(row);
	// const params = {
	// 	name: row.name,
	// 	code: row.code,
	// 	payCodes: checkedKeys,
	// };
	// console.log('params', params);
	// const { code, msg } = await getBusinessUpdate(params);
	// console.log('aaa', aaa);
	// if (code === 0) {
	// 	useMessage().success('更新成功');
	// 	row.isModified = false; // 重置状态
	// 	getDataList();
	// } else {
	// 	useMessage().error(msg);
	// }
};
const handleTabClick = () => {
	console.log('activeIndex', activeIndex.value);
	// activeIndex.value = tab.paneName;
	getDataList();
};

const arraysEqual = (a: any[], b: any[]) => {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};
const transformData = (users: any, systems: any) => {
	return users.map((user: any) => {
		// 初始化所有子系统属性
		const initialSysData = systems.reduce((acc: any, sys: any) => {
			acc[sys.code] = {
				name: sys.name,
				code: sys.code,
				ischecked: user.payCodes?.includes(sys.code) || false, // 安全访问 codes
			};
			return acc;
		}, {});

		// 获取初始的勾选状态
		const initialCheckedKeys = Object.keys(initialSysData).filter((key) => {
			const value = initialSysData[key];
			return typeof value === 'object' && value !== null && value.ischecked === true;
		});

		return {
			name: user.name,
			code: user.code,
			id: user.id.toString(),
			isModified: false,
			initialCheckedKeys,
			...initialSysData,
		};
	});
};
// 获取子系统数据
interface sysInfostemType {
	id: string;
	name: string;
	code: string;
}

const sysInfostem = ref<sysInfostemType[]>([
	{ id: '1', code: 'BALANCE_PAY', name: '账户余额' },
	{ id: '2', code: 'STAFF_PAY', name: '员工卡支付' },
	{ id: '3', code: 'WX_PAY', name: '微信支付' },
	{ id: '4', code: 'SCORE_PAY', name: '积分抵扣' },
	{ id: '5', code: 'STORED_BALANCE', name: '储值账户' },
	{ id: '6', code: 'CREDIT_BALANCE', name: '授信账户' },
]);

const filterCheckedKeys = (obj: any): string[] => {
	return Object.keys(obj).filter((key) => {
		const value = obj[key];
		return typeof value === 'object' && value !== null && value.ischecked === true;
	});
};
</script>
<style lang="scss" scoped></style>
