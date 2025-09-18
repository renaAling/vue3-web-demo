<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10 mb-5">
				<el-button type="primary" @click="handleVisible('add')"> 申请制卡 </el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<!-- <el-table-column prop="index" label="序号" show-overflow-tooltip></el-table-column> -->
				<el-table-column prop="unionId" label="UID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickName" label="昵称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="手机号码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mode" label="管理模式" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="text" v-if="row.applyStatus === 2" @click="handleVisible('add', row)">申请</el-button>
						<el-button type="text" v-if="row.applyStatus === 1" @click="handleRevoke(row)">撤回</el-button>
						<el-button type="text" v-if="row.applyStatus === 3 && !row.isReapply" @click="handleVisible('edit', row)">再次申请</el-button>
						<el-button type="text" v-if="row.applyStatus === 3 && row.isReapply" style="color: #666">已再次申请</el-button>
						<el-button type="text" v-if="row.applyStatus === 4" style="color: #666">已申请</el-button>
						<el-button type="text" v-if="row.applyStatus !== 4 && !row.isReapply" @click="handleDel(row)" style="color: red">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" :title="visibleTitle" width="75%" draggable @closed="resetForm">
				<el-form :model="form" ref="queryRef" :inline="true" @keyup.enter="getQueryUser" v-if="visibleIsAdd">
					<el-form-item label="UID" prop="unionId">
						<el-input v-model="form.unionId" placeholder="请输入UID" />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="11" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getQueryUser">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
				<el-table
					:data="dialogData.dataList"
					v-loading="dialogData.loading"
					style="width: 100%"
					row-key="id" border
					:cell-style="tableStyle.cellStyle"
					:header-cell-style="tableStyle.headerCellStyle"
				>
					<el-table-column prop="unionId" label="UID" show-overflow-tooltip></el-table-column>
					<el-table-column prop="nickName" label="昵称" show-overflow-tooltip width="120"></el-table-column>
					<el-table-column label="手机号码" show-overflow-tooltip>
						<template #default="{ row }">
							<span>{{ maskedMobile(row.mobile) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="管理模式" show-overflow-tooltip>
						<template #default="{ row }">
							<el-select v-model="row.modeId" class="m-2" placeholder="请选择管理模式" size="large">
								<el-option v-for="item in patternList" :key="item.modeId" :label="item.mode" :value="item.modeId" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="驳回原因" show-overflow-tooltip v-if="!visibleIsAdd && isReject"></el-table-column>
					<el-table-column label="操作" v-if="visibleIsAdd" width="90">
						<template #default="{ row }">
							<el-button type="link" class="text-sm cursor-pointer text-blue-500" @click="handleSuccess(row)">添加</el-button>
						</template>
					</el-table-column>
				</el-table>
				<template #footer v-if="!visibleIsAdd">
					<div class="dialog-footer" style="text-align: center">
						<el-button @click="resetForm">取消</el-button>
						<el-button type="primary" @click="handleSuccess"> 再次申请 </el-button>
					</div>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
	getMemberCardApplyPage,
	getMemberCardModeGetInfos,
	getMemberCardQueryUser,
	getMemberCardInsertCard,
	getMemberCardRevoke,
	getMemberCardGet,
	getMemberCardApplyCard,
	getMemberCardDel,
} from '../../../../api/member/clubCard';
import { useMessage } from '/@/hooks/message';
// import { useRouter } from 'vue-router';
// const router = useRouter()
const queryRef = ref();
const showSearch = ref(true);
const dialogVisible = ref(false);
const visibleTitle = ref<'申请制卡' | '再次制卡'>('申请制卡');
const visibleIsAdd = ref<boolean>(true);
const isReject = ref<boolean>(false); //区分驳回再次申请（true）和撤回再次申请（false）
const form = reactive({
	unionId: '',
	mobile: '',
});
const dialogData = reactive<any>({
	dataList: [],
	loading: false,
});
const patternList = ref([
	{ modeId: '1', mode: '分公司独立发行及管理' },
	{ modeId: '2', mode: '集团统一发行，分公司独立管理' },
	{ modeId: '3', mode: '集团统一发行及管理' },
]);
const maskedMobile = (mobile: string) => {
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
onMounted(async () => {
	return new Promise((resolve, reject) => {
		getMemberCardModeGetInfos()
			.then((val) => {
				patternList.value = val.data.map((item: any) => ({
					modeId: item.id,
					mode: item.mode,
				}));
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				reject(false);
			});
	});
});
// 打开弹窗
const handleVisible = async (type: 'add' | 'edit', row?: any) => {
	dialogData.dataList = [];
	if (type === 'edit') {
		visibleTitle.value = '再次制卡';
		visibleIsAdd.value = false;
		isReject.value = true;
		return new Promise((resolve, reject) => {
			getMemberCardGet(Number(row.id))
				.then((val) => {
					dialogData.dataList.push(val.data);
					dialogVisible.value = true;
					resolve(true);
				})
				.catch((err) => {
					useMessage().error(err.msg || '获取失败');
					reject(false);
				});
		});
	}
	if (type === 'add' && !row) {
		visibleTitle.value = '申请制卡';
		visibleIsAdd.value = true;
		dialogVisible.value = true;
		isReject.value = false;
	}
	if (type === 'add' && row) {
		visibleTitle.value = '申请制卡';
		visibleIsAdd.value = false;
		dialogVisible.value = true;
		isReject.value = false;
		return new Promise((resolve, reject) => {
			getMemberCardGet(Number(row.id))
				.then((val) => {
					dialogData.dataList.push(val.data);
					dialogVisible.value = true;
					resolve(true);
				})
				.catch((err) => {
					useMessage().error(err.msg || '获取失败');
					reject(false);
				});
		});
	}
	if (row) {
		console.log('row', row);
	}
};
const handleDel = (row: any) => {
	console.log('row', row);
	ElMessageBox.confirm('请确认是否删除该申请?', '删除申请', {
		distinguishCancelAndClose: true,
		confirmButtonText: '确认',
		cancelButtonText: '取消',
	})
		.then(async () => {
			return new Promise((resolve, reject) => {
				getMemberCardDel(Number(row.id))
					.then(() => {
						ElMessage.success('删除成功');
						dialogVisible.value = false;
						resolve(true);
					})
					.catch((err) => {
						ElMessage.error(err.msg || '删除失败');
						reject(false);
					});
			});
		})
		.catch(() => {
			ElMessage.info('已取消');
		});
	// await getMemberCardDel()
};
// 获取弹窗表格数据
const getQueryUser = async () => {
	console.log('form', form);

	return new Promise((resolve, reject) => {
		getMemberCardQueryUser(form)
			.then((val) => {
				dialogData.dataList = val.data;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg || '查询失败');
				reject(false);
			});
	});
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getQueryUser();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberCardApplyPage, // H
	descs: [],
});

// 撤回按钮
const handleRevoke = (row: any) => {
	console.log('row', row);
	ElMessageBox.confirm('请确认是否撤回申请?', '撤回申请', {
		distinguishCancelAndClose: true,
		confirmButtonText: '确认',
		cancelButtonText: '取消',
	})
		.then(async () => {
			return new Promise((resolve, reject) => {
				getMemberCardRevoke({ id: Number(row.id) })
					.then(() => {
						dialogVisible.value = false;
						getDataList();
						useMessage().success('撤回成功');
						resolve(true);
					})
					.catch((err) => {
						useMessage().error(err.msg || '撤回成功');
						reject(false);
					});
			});
		})
		.catch(() => {
			ElMessage.info('已取消');
		});
};

const handleSuccess = async (row?: any) => {
	console.log('dialogData.dataList', dialogData.dataList);
	console.log('row', row);
	if (!row.modeId && visibleIsAdd.value) {
		ElMessage.error('请选择管理模式');
		return;
	}
	if (!visibleIsAdd.value && !dialogData.dataList[0].modeId) {
		ElMessage.error('请选择管理模式');
		return;
	}
	if (!visibleIsAdd.value) {
		const params = {
			id: Number(dialogData.dataList[0].id),
			modeId: Number(dialogData.dataList[0].modeId),
		};
		ElMessageBox.confirm('请确认是否再次提交审核?', '再次提交审核', {
			distinguishCancelAndClose: true,
			confirmButtonText: '确认',
			cancelButtonText: '取消',
		})
			.then(async () => {
				return new Promise((resolve, reject) => {
					getMemberCardApplyCard(params)
						.then(() => {
							getDataList();
							dialogVisible.value = false;
							useMessage().success('再次申请成功');
							resolve(true);
						})
						.catch((err) => {
							useMessage().error(err.msg);
							reject(false);
						});
				});
			})
			.catch(() => {
				ElMessage.info('已取消');
			});
	} else {
		row.modeId = Number(row.modeId);
		// 走接口
		try {
			const { code } = await getMemberCardInsertCard(row);
			if (code === 0) {
				useMessage().success(`添加成功`);
				resetQuery();
				getDataList();
				dialogVisible.value = false;
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}
};
const resetForm = () => {
	Object.assign(form, {
		remark: '',
		unionId: '',
		nickName: '',
		mobile: '',
		type: '',
	});
	dialogVisible.value = false;
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
