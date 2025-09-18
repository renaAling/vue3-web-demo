<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="选择时间：" prop="timeVal">
						<el-date-picker
							v-model="timeVal"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
							@change="onchangeTime"
							class="selWidth"
						/>
					</el-form-item>
					<el-form-item label="供应商名称：" prop="keywords">
						<el-input v-model.trim="state.queryForm.keywords" @keyup.enter.native="getDataList()" placeholder="请输入供应商名称" class="selWidth" />
					</el-form-item>
					<el-form-item label="供应商类别：" prop="isSelf">
						<el-select v-model.trim="state.queryForm.isSelf" clearable placeholder="请选择供应商类别" class="selWidth">
							<el-option label="自营" value="1" />
							<el-option label="非自营" value="0" />
						</el-select>
					</el-form-item>
					<el-form-item label="联系人:" prop="realName">
						<el-input v-model.trim="state.queryForm.realName" @keyup.enter.native="getDataList()" placeholder="请输入联系人" class="selWidth" />
					</el-form-item>
					<el-form-item label="联系电话:" prop="phone">
						<el-input v-model.trim="state.queryForm.phone" @keyup.enter.native="getDataList()" placeholder="请输入联系电话" class="selWidth" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getDataList(), getHeadNum()">查询</el-button>
						<el-button @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-tabs class="list-tabs" v-if="headeNum.length > 0" v-model="isSwitch" @tab-change="handleClick">
				<el-tab-pane v-for="(item, index) in headeNum" :key="index" :name="item.type.toString()" :label="item.title + '(' + item.count + ')'" />
			</el-tabs>
			<div class="mb-5">
				<el-button type="primary" @click="onAdd">添加供应商 </el-button>
			</div>
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column prop="id" label="ID" min-width="60" />
				<el-table-column prop="name" label="供应商名称" min-width="180" :show-overflow-tooltip="true" />
				<el-table-column prop="realName" label="联系人" min-width="150" />
				<!-- <el-table-column label="创建类型" min-width="120">
					<template #default="{ row }">
						<span class="spBlock">{{ row.createType }}</span>
					</template>
				</el-table-column> -->
				<el-table-column prop="phone" label="联系电话" min-width="150" />
				<!-- <el-table-column prop="copyProductNum" label="第三方复制次数" min-width="110" /> -->
				<el-table-column prop="createTime" label="创建时间" min-width="150" />
				<el-table-column prop="status" label="开启/关闭" min-width="90" fixed="right">
					<template #default="{ row }">
						<el-switch v-model="row.isSwitch" inline-prompt active-text="开启" inactive-text="关闭" @click.native="onchangeIsClose(row)" />
						<!-- <div v-else>{{ scope.row.isSwitch ? '开启' : '关闭' }}</div> -->
					</template>
				</el-table-column>
				<!-- <el-table-column label="推荐" min-width="90" fixed="right">
					<template #default="{ row }">
						<el-switch
							v-model="row.isRecommend"
							:active-value="true"
							:inactive-value="false"
							inline-prompt
							active-text="是"
							inactive-text="否"
							@click.native="onchangeIsShow(row)"
						/>
						<div v-else>{{ scope.row.isRecommend ? '是' : '否' }}</div>
					</template>
				</el-table-column> -->
				<el-table-column label="操作" min-width="110" fixed="right">
					<template #default="{ row }">
						<div style="display: flex; align-items: center">
							<el-button link type="primary" @click="onEdit(row, 1, 'info')">详情 </el-button>
							<el-divider direction="vertical"></el-divider>

							<!-- <el-dropdown trigger="click">
							<span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
							<el-dropdown-menu slot="dropdown" class="icon-arrow-down">
								<el-dropdown-item @click.native="onEdit(scope.row.id, '', 'edit')">编辑 </el-dropdown-item>
								<el-dropdown-item @click.native="handleUpdatePhone(scope.row, 1)">修改手机号 </el-dropdown-item>
								<el-dropdown-item @click.native="onPassword(scope.row.id)">重置商户密码 </el-dropdown-item>
								<el-dropdown-item @click.native="handleTimes(scope.row, 2)">设置第三方平台商品复制次数 </el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown> -->
							<el-dropdown>
								<div class="el-dropdown-link" style="color: var(--el-color-primary); display: flex">
									更多<el-icon><ArrowDown /></el-icon>
								</div>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item @click.native="onEdit(row, '', 'edit')">编辑 </el-dropdown-item>
										<el-dropdown-item @click.native="handleUpdatePhone(row)">修改手机号 </el-dropdown-item>
										<el-dropdown-item @click.native="onPassword(row.id)">重置商户密码 </el-dropdown-item>
										<!-- <el-dropdown-item @click.native="handleTimes(row, 2)">设置第三方平台商品复制次数 </el-dropdown-item> -->
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			<!-- <el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="merchantId"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="ID" prop="merchantId" />
				<el-table-column label="商家名称" prop="merchantName">
					<template #default="{ row }">
						<span>{{ row.merchantName ? row.merchantName : '--' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="联系人" prop="contacts">
					<template #default="{ row }">
						<span>{{ row.contacts ? row.contacts : '--' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="联系电话" prop="phone">
					<template #default="{ row }">
						<span>{{ row.phone ? row.phone : '--' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="已开通收款渠道" prop="status">
					<template #default="{ row }">
						<span v-if="row.status === 0">微信支付</span>
						<span v-if="row.status === 1">积分抵扣</span>
						<span v-if="row.status === 2">账户余额支付</span>
						<span v-if="row.status === 3">员工卡支付</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" /> -->
		</div>
		<!-- 编辑、新增  -->
		<!-- <form-dialog @refresh="getDataList()" ref="formDialogRef" /> -->
		<!-- :before-close="resetForm(ruleFormRef)" -->
		<el-dialog v-model="dialogVisibleAmend" :title="dialogTitle" width="500" :show-close="false">
			<el-form :model="form" label-width="auto" ref="ruleFormRef" :rules="rules" v-if="keyNum === 1 || keyNum === 2">
				<el-form-item label="手机号" prop="phone" v-if="keyNum === 2">
					<el-input v-model="form.phone" />
				</el-form-item>
				<el-form-item label="复制次数" prop="copyProductNumShow" v-if="keyNum === 1">
					<el-input-number v-model="form.copyProductNumShow" :min="0" disabled />
				</el-form-item>
				<el-form-item label="修改类型" prop="type" v-if="keyNum === 1">
					<el-radio-group v-model="form.type">
						<el-radio value="add" label="add">增加</el-radio>
						<el-radio value="sub" label="sub">减少</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="修改数量" prop="copyProductNum" v-if="keyNum === 1">
					<el-input-number v-model="form.copyProductNum" :min="0" placeholder="修改数量" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)"> 提交 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox } from 'element-plus';
import {
	merchantCategoryAllListApi,
	merchantTypeListApi,
	merHeaderNumApi,
	merchantListApi,
	merchantupdatePhoneApi,
	merchantCopyNumApi,
	merRsetPasswordApi,
	merchantCloseApi,
	merchantOpenApi,
} from '/@/api/culture/merchant/supplierList';
// 	merchantSwitchApi,
// /@/api/culture/merchant/supplierList
const router = useRouter();
// const formDialogRef = ref();
const queryRef = ref();
const timeVal = ref([]);
const merchantClassify = ref([]) as any;
const merchantType = ref([]) as any;
const dialogVisible = ref(false); //新增弹窗
const dialogVisibleAmend = ref(false); //修改小弹窗
const dialogTitle = ref('');
const isDisabled = ref(false);
const indexKey = ref<any>();
const merId = ref(0);
const handleType = ref('add');
const ruleFormRef = ref<any>();
const keyNum = ref(0); //弹窗类型 1-复制 2-修改手机号 3-重置商户密码
const form = ref<any>({});
const rules = reactive<FormRules<any>>({
	phone: [
		{
			required: true,
			validator: (rule: any, value: any, callback: any) => {
				if (keyNum.value === 2 && !value) {
					callback(new Error('请输入手机号'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	type: [
		{
			required: true,
			validator: (rule: any, value: any, callback: any) => {
				if (keyNum.value === 1 && !value) {
					callback(new Error('请选择修改类型'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	copyProductNum: [
		{
			required: true,
			validator: (rule: any, value: any, callback: any) => {
				if (keyNum.value === 1 && !value) {
					callback(new Error('请输入修改数量'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
});
const headeNum = ref([
	{
		count: '',
		type: '1',
		title: '正常开启的供应商',
	},
	{
		count: '',
		type: '0',
		title: '已关闭供应商',
	},
]);
const isSwitch = ref('1');

onMounted(() => {
	getMerchantClassify();
	getMerchantTypeListApi();
	getHeadNum();
});
const handleClick = (tab: any, event: any) => {
	// isSwitch isSwitch: string
	console.log('event', event);
	console.log('tab', tab);
	console.log('isSwitch', isSwitch.value);
	state.queryForm.isSwitch = isSwitch.value;
	getDataList();
	getHeadNum();
};
const getMerchantClassify = async () => {
	try {
		const { code, data, msg } = await merchantCategoryAllListApi();
		if (code === 0) {
			merchantClassify.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const getMerchantTypeListApi = async () => {
	try {
		const { code, data, msg } = await merchantTypeListApi();
		if (code === 0) {
			console.log('data', data);
			merchantType.value = data.records;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const onAdd = () => {
	isDisabled.value = false;
	indexKey.value = Math.random();
	merId.value = 0;
	router.push({
		path: '/culture/merchant/supplierManagements/supplierList/form',
	});
};
const onEdit = (row: any, n: any, type: any) => {
	dialogVisible.value = true;
	merId.value = row.id;
	indexKey.value = Math.random();
	handleType.value = type;
	n ? (isDisabled.value = true) : (isDisabled.value = false);
	router.push({
		path: '/culture/merchant/supplierManagements/supplierList/form',
		query: {
			id: row.id,
			type: type,
		},
	});
};
// 开启关闭
const onchangeIsClose = async (row: any) => {
	try {
		const { code, msg } = row.isSwitch ? await merchantOpenApi(Number(row.id)) : await merchantCloseApi(Number(row.id));
		if (code === 0) {
			useMessage().success(`${row.isSwitch ? '开启' : '关闭'}成功`);
			isSwitch.value = row.isSwitch ? '1' : '0';
			row.isSwitch ? (state.queryForm.isSwitch = '1') : (state.queryForm.isSwitch = '0');
			getDataList();
			getHeadNum();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
	// !row.isSwitch
	// 	? merchant.merchantCloseApi(row.id).then(() => {
	// 			this.$message.success('关闭成功');
	// 			this.tableFrom.isSwitch = '0';
	// 			this.getHeadNum();
	// 			this.getList('');
	// 	  })
	// 	: merchant.merchantOpenApi(row.id).then(() => {
	// 			this.$message.success('开启成功');
	// 			this.tableFrom.isSwitch = '1';
	// 			this.getHeadNum();
	// 			this.getList('');
	// 	  });
};
// 修改状态
// const onchangeIsShow = (row: any) => {
// 	if (state.queryForm.isSwitch === '0') return;
// 	row.isRecommend = !row.isRecommend;
// 	const title = !row.isRecommend ? '是否开启推荐商户' : '是否关闭推荐商户';
// 	ElMessageBox.confirm(title, '提示', {
// 		confirmButtonText: '确定',
// 		cancelButtonText: '取消',
// 		type: 'warning',
// 	})
// 		.then(async () => {
// 			try {
// 				const { code, msg } = await merchantSwitchApi(Number(row.id));
// 				if (code === 0) {
// 					row.isRecommend = !row.isRecommend;
// 					useMessage().success('操作成功');
// 					getDataList();
// 					getHeadNum();
// 				} else {
// 					useMessage().error(msg);
// 				}
// 			} catch (err: any) {
// 				useMessage().error(err.msg);
// 			}
// 		})
// 		.catch(() => {});
// };
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', form.value);
			if (keyNum.value === 2) {
				const data = {
					id: merId.value,
					phone: form.value.phone,
				};
				try {
					const { code, msg } = await merchantupdatePhoneApi(data);
					// loading.value = false;
					if (code === 0) {
						useMessage().success('操作成功');
						getDataList();
						getHeadNum();
						dialogVisibleAmend.value = false;
					} else {
						useMessage().error(msg);
					}
				} catch (err: any) {
					useMessage().error(err.msg);
				}
			} else {
				const data = {
					id: merId.value,
					type: form.value.type,
					copyProductNum: form.value.copyProductNum,
				};
				try {
					const { code, msg } = await merchantCopyNumApi(data);
					if (code === 0) {
						useMessage().success('操作成功');
						getDataList();
						getHeadNum();
						dialogVisibleAmend.value = false;
					} else {
						useMessage().error(msg);
					}
				} catch (err: any) {
					useMessage().error(err.msg);
				}
			}
			// try {
			// 	const { code, msg } = await merchantupdatePhoneApi(params);
			// 	loading.value = false;
			// 	if (code === 0) {
			// 		useMessage().success('发起售后成功');
			// 		const orderCode = router.currentRoute.value.query.orderCode;
			// 		getOrderDetailData({ orderCode });
			// 	} else {
			// 		useMessage().error(msg);
			// 	}
			// } catch (err: any) {
			// 	useMessage().error(err.msg);
			// }
		} else {
			console.log('error submit!', fields);
		}
	});
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	dialogVisibleAmend.value = false;
};
// 修改手机号
const handleUpdatePhone = (row: any) => {
	keyNum.value = 2;
	dialogVisibleAmend.value = true;
	merId.value = row.id;
	form.value.phone = row.phone;
	dialogTitle.value = '修改商户手机号';
};

// 修改复制商品数量
// const handleTimes = (row: any, num: any) => {
// 	keyNum.value = 1;
// 	dialogTitle.value = '修改复制商品数量';
// 	merId.value = row.id;
// 	form.value.type = 'add';
// 	form.value.copyProductNumShow = row.copyProductNum;
// 	dialogVisibleAmend.value = true;
// };
// 重置密码
const onPassword = (id: any) => {
	merId.value = id;
	ElMessageBox.confirm('确定重置商户密码吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			try {
				const { code, msg } = await merRsetPasswordApi(Number(merId.value));
				if (code === 0) {
					useMessage().success('重置密码成功');
					getDataList();
					getHeadNum();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			// ElMessage({
			// 	type: 'success',
			// 	message: 'Delete completed',
			// });
		})
		.catch(() => {});
};
// modalParserFrom(
// 	'修改商户手机号',
// 	'修改商户手机号',
// 	1,
// 	{ phone: row.phone },
// 	function (formValue:any)  => {
// 	submit(formValue, num);
// 	},
// 	(keyNum.value += 2)
// );
// };

// const  submit = (formValue:any, num:any)=> {
//       if (num === 1) {
//         const data = {
//           id: this.merId,
//           phone: formValue.phone,
//         };
//         merchant
//           .merchantupdatePhoneApi(data)
//           .then((res) => {
//             this.$message.success('操作成功');
//             this.$msgbox.close();
//             this.getList(1);
//           })
//           .catch(() => {
//             this.loading = false;
//           });
//       } else {
//         const data = {
//           id: this.merId,
//           type: formValue.type,
//           num: formValue.num,
//         };
//         merchant
//           .merchantCopyNumApi(data)
//           .then((res) => {
//             this.$message.success('操作成功');
//             this.$msgbox.close();
//             this.getList(1);
//           })
//           .catch(() => {
//             this.loading = false;
//           });
//       }
//     },
// watch(
// 	() => keywords.value,
// 	(val) => {
// 		if (val) {
// 			// state.queryForm.keywords = encodeURIComponent(val);
// 			state.queryForm.keywords = val;
// 		} else {
// 			state.queryForm.keywords = '';
// 		}
// 	}
// );
// watch(
// 	() => timeVal.value,
// 	(val) => {
// 		if (val) {
// 			state.queryForm.orderTimeStart = val[0];
// 			state.queryForm.orderTimeEnd = val[1];
// 		} else {
// 			state.queryForm.orderTimeStart = '';
// 			state.queryForm.orderTimeEnd = '';
// 		}
// 	}
// );
const onchangeTime = (val: any) => {
	console.log('val', val);
	if (val?.length > 0) {
		console.log('val', val);
		console.log('val[0]', val[0]);
		console.log('val[1]', val[1]);
		state.queryForm.dateLimit = val.join(',');
	}
	console.log('state.queryForm.dateLimit', state.queryForm.dateLimit);
	getDataList();
	getHeadNum();
};

/**
 *  获取开启商户数
 */
const getHeadNum = async () => {
	const form = { ...state.queryForm };
	delete form.page;
	delete form.limit;
	delete form.isSwitch;
	console.log('state.queryForm', form);
	try {
		const { code, data, msg } = await merHeaderNumApi(form);
		if (code === 0) {
			console.log('data', data);
			headeNum.value[0]['count'] = data.openNum;
			headeNum.value[1]['count'] = data.closeNum;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}

	// merchant
	// 	.merHeaderNumApi(data)
	// 	.then((res) => {
	// 		this.headeNum[0]['count'] = res.openNum;
	// 		this.headeNum[1]['count'] = res.closeNum;
	// 	})
	// 	.catch((res) => {});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	// paymentTime.value = [];
	timeVal.value = [];
	state.queryForm.dateLimit = '';
	state.queryForm.keywords = '';
	state.queryForm.isSelf = '';
	state.queryForm.realName = '';
	state.queryForm.phone = '';
	getDataList();
	getHeadNum();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: merchantListApi,
	queryForm: {
		isSwitch: '1',
	},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// const handleEdit = (row: any) => {
// 	console.log('formDialogRef', formDialogRef.value);
// 	formDialogRef.value.openDialog(row.id);
// };
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
