<template>
	<div>
		<div class="portal-home">
			<div class="header" v-if="modeType === 'admin'">
				<el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
					<el-tab-pane label="入口配置" name="first"></el-tab-pane>
					<el-tab-pane label="入口授权" name="second"></el-tab-pane>
				</el-tabs>
			</div>
			<div class="content ml-3">
				<!-- 入口配置 -->
				<div v-show="activeName === 'first'">
					<div class="btns" v-if="activeName === 'first' && modeType === 'admin'">
						<el-button type="primary" @click="entranceDialogRef?.openDialog('', 0)">新增分类</el-button>
						<el-button type="primary" @click="sysDialogRef?.openDialog('', 1)">新增子系统</el-button>
					</div>
					<div class="system mb-5 mt-3" v-for="(ele, index) in systemList" :key="index">
						<div class="title">
							<div>{{ ele.groupName }}</div>
							<div class="ml-3 flex items-center" v-if="modeType === 'admin'">
								<div class="action edit mr-3" @click="handleEdit($event, ele.groupId, 0)">
									<img style="width: 16px; height: 16px" src="/src/assets/imgs/edit_c.png" alt="" />
									编辑
								</div>
								<div class="action del" @click="handleDel($event, ele, 0)">
									<img style="width: 16px; height: 16px" src="/src/assets/imgs/del_c.png" alt="" />删除
								</div>
							</div>
						</div>
						<VueDraggable class="sub_system flex items-center" v-model="ele.sysInfos" :disabled="disabled" :animation="150" @end="dragEnd">
							<div class="system-list" v-for="(item, index) in ele.sysInfos">
								<div
									class="home flex items-center"
									:class="index === clickIndex && clickIndexPre === index ? 'active' : ''"
									@click="handelJump($event, index, item)"
								>
									<div class="img-box"><img :src="item.imageUrl" alt="" /></div>
									<div class="text">{{ item.name }}</div>
									<div class="edit flex items-center" v-if="modeType === 'admin'">
										<img
											class="mr-3"
											style="width: 20px; height: 20px"
											src="/src/assets/imgs/edit.png"
											@click="handleEditSys($event, item.id, 1)"
											alt=""
										/>
										<img style="width: 20px; height: 20px" src="/src/assets/imgs/delete.png" alt="" @click="handleDel($event, item, 1)" />
									</div>
								</div>
							</div>
						</VueDraggable>
					</div>
					<div class="no_data" v-if="systemList.length === 0">
						<img src="/src/assets/imgs/no_data.png" alt="" />
						<div class="tips">暂无数据</div>
					</div>
				</div>
				<!-- 入口授权 -->
				<div v-show="activeName === 'second'" class="">
					<el-form ref="queryRef" :inline="true" :model="queryForm" @keyup.enter="getDataList">
						<el-form-item label="用户姓名" prop="name">
							<el-input v-model="queryForm.name" placeholder="请输入用户姓名查找" clearable />
						</el-form-item>
						<el-form-item>
							<el-button icon="Search" type="primary" @click="getDataList">查询</el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-form>
					<el-table border :data="userList" row-key="unionId" class="my-table">
						<el-table-column label="姓名" prop="name" align="center"></el-table-column>
						<el-table-column :label="item.name" :prop="item.code" align="center" v-for="(item, index) in sysInfostem" :key="index">
							<template #default="{ row }">
								<el-checkbox v-model="row[item.code].ischecked" @change="handleCheckboxChange(row)"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column label="操作" fixed="right" align="center">
							<template #default="{ row, $index }">
								<!-- <el-button type="primary" link @click="cancel">取消</el-button> -->
								<el-button v-if="row.isModified" type="primary" link @click="save(row)">更新</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="page" />
				</div>
			</div>
			<div class="no_permission" v-if="noPermission">
				<img src="/src/assets/imgs/no_permission.png" alt="" />
				<div class="tips bold">抱歉！该账号无当前系统权限</div>
				<div class="tips">权限问题可咨询相关管理人员</div>
			</div>
		</div>
		<div class="no_permission" v-if="noPermission">
			<img src="/src/assets/imgs/no_permission.png" alt="" />
			<div class="tips bold">抱歉！该账号无当前系统权限</div>
			<div class="tips">权限问题可咨询相关管理人员</div>
		</div>
		<entrance-form ref="entranceDialogRef" @refresh="getEntranceList()" />
		<sys-form ref="sysDialogRef" @refresh="getEntranceList()" />
	</div>
</template>

<script setup lang="ts" name="portal-home">
import {
	checkPermission,
	getSysEntranceList,
	homePageArticle,
	delGroup,
	delEntrance,
	getAuthorizedHeaders,
	getAccountList,
	batchSysPermission,
	updateSubSystemSequence,
	getRandomTenantInfo,
} from '/@/api/portal';
import { Session } from '/@/utils/storage';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox, TabsPaneContext } from 'element-plus';
import pinia from '/@/stores';
import { usePortalList } from '/@/stores/portal';
const { modeView } = storeToRefs(usePortalList(pinia));
const portalList = usePortalList(pinia);
import { VueDraggable } from 'vue-draggable-plus';
import router from '/@/router';
import { loginByFree } from '/@/api/login';
// 引入组件// 动态引入组件
const EntranceForm = defineAsyncComponent(() => import('./form.vue'));
const SysForm = defineAsyncComponent(() => import('./sysForm.vue'));
// const PortalUser = defineAsyncComponent(() => import('/@/layout/navBars/portalUser.vue'));
interface EntranceType {
	// id: string;
	groupName: string;
	groupId: string;
	imageUrl?: string;
	jumpLink?: string;
	description?: string;
	sysInfos?: Array<{ id: string; name: string; groupId: string; groupName?: string | null; imageUrl: string; tenantId?: string; jumpLink?: string }>;
}

const systemList = ref<EntranceType[]>([]);
const clickIndex = ref(-1);
const clickIndexPre = ref(-1);
const activeName = ref('first');
const entranceDialogRef = ref<{ openDialog: (id: string, type: number) => void } | null>(null);
const sysDialogRef = ref<{ openDialog: (id: string, type: number) => void } | null>(null);
onMounted(async () => {
	await getEntranceList(); // 获取入口列表
	await getsysInfostem(); // 子系统列表
	await getDataList(); // 获取用户权限数据
});
let modeType = ref('user');
watch(
	modeView,
	(newVal, oldVal) => {
		// console.log('modeView changed from', oldVal, 'to', newVal);
		modeType.value = newVal;
		if (activeName.value === 'second' && newVal === 'user') {
			activeName.value = 'first';
		}
	},
	{ immediate: true }
);
const disabled = computed(() => {
	if (modeType.value === 'admin') {
		return false;
	} else {
		return true;
	}
});
const noPermission = ref(false);
const getEntranceList = async () => {
	try {
		const { code, data, msg } = await getSysEntranceList();
		if (code === 0) {
			// console.log('入口列表', data);
			systemList.value = data;
			portalList.setSystemList(systemList.value);
		} else if (code == 12001) {
			noPermission.value = true;
		} else {
			useMessage().error(msg);
		}
	} catch (error) {
		console.log(error);
	}
};
// 拖拽排序
const dragEnd = async (item: any) => {
	const { newDraggableIndex, oldDraggableIndex, data } = item;
	console.log('dragEnd', item);
	const res = await updateSubSystemSequence({
		id: data.id,
		targetPosition: newDraggableIndex + 1,
	});
	console.log('res', res);
	if (res.code === 0) {
		useMessage().success('排序成功');
		getEntranceList();
	} else {
		useMessage().error(res.msg);
	}
};
const page = reactive({
	size: 10,
	current: 1,
	total: 0,
});
const sizeChangeHandle = (val: number) => {
	page.size = val;
	getDataList();
};
const currentChangeHandle = (val: number) => {
	page.current = val;
	getDataList();
};
// 获取用户数据
const userList = ref([]);
const getDataList = async () => {
	userList.value = [];
	const { code, data, msg } = await getAccountList({ name: queryForm.value.name, ...page });
	page.total = data.total;
	// console.log('用户列表', data.records);
	// const list = data.records.slice(0, 1) || [];
	const list = data.records || [];
	userList.value = transformData(list, sysInfostem.value);
	// console.log('userList.value==============', userList.value);
};

const handleCheckboxChange = (row: any) => {
	const currentCheckedKeys = Object.keys(row).filter((key) => {
		const value = row[key];
		return typeof value === 'object' && value !== null && value.ischecked === true;
	});

	const initialCheckedKeys = row.initialCheckedKeys;

	row.isModified = !arraysEqual(currentCheckedKeys, initialCheckedKeys);
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
				ischecked: user.codes?.includes(sys.code) || false, // 安全访问 codes
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
			unionId: user.unionId.toString(),
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
	groupId: string;
	code: string;
}

const sysInfostem = ref<sysInfostemType[]>([]);
const getsysInfostem = async () => {
	const { code, data, msg } = await getAuthorizedHeaders();
	console.log('子系统列表', data);
	sysInfostem.value = data;
};
// 重置查询
const queryForm = ref({
	name: '',
});
const resetQuery = () => {
	queryForm.value = {
		name: '',
	};
	getDataList();
};
// 保存
const save = async (row: any) => {
	console.log('保存===========', row);
	const checkedKeys = filterCheckedKeys(row);
	const params = {
		unionId: row.unionId,
		codes: checkedKeys,
	};
	console.log('params', params);
	const { code, msg } = await batchSysPermission(params);
	if (code === 0) {
		useMessage().success('更新成功');
		row.isModified = false; // 重置状态
		getDataList();
	} else {
		useMessage().error(msg);
	}
};
const filterCheckedKeys = (obj: any): string[] => {
	return Object.keys(obj).filter((key) => {
		const value = obj[key];
		return typeof value === 'object' && value !== null && value.ischecked === true;
	});
};
// 取消
const cancel = () => {};
const handelJump = async (e: Event, index: number, item: any) => {
	// 管理模式下不能跳转
	if (modeType.value === 'admin') {
		return;
	}
	e.stopPropagation();
	clickIndex.value = index;
	const token = Session.getToken();
	const tenantId = Session.getTenant();
	// const tenantId = item.tenantId;
	const jumpLink = item.jumpLink ? item.jumpLink : '/home';
	const tenantIdTarget = item.tenantId;
	try {
		const { code, msg } = await checkPermission({ tenantId: tenantIdTarget });
		if (code === 0) {
			if (tenantIdTarget == 18) {
				// 自有商城逻辑跳转
				const { code, data } = await getRandomTenantInfo();
				if (code === 0) {
					if (!data) {
						useMessage().error('抱歉！该账号无该系统权限');
						return;
					} else {
						const requestUrl = data.domainUrl + '/#/home';
						const url = requestUrl + '?token=' + token + '&tenantId=' + tenantId;
						window.open(url, '_blank');
					}
				} else {
					useMessage().error(msg);
				}
			} else {
				// 其他
				// 各子系统自己玩
				// const requestUrl = item.domainUrl + '/#' + jumpLink;
				const requestUrl = item.domainUrl + '/#' + jumpLink;
				console.log('requestUrl', requestUrl);
				const url = requestUrl + '?token=' + token + '&tenantId=' + tenantId;
				window.open(url, '_blank');
			}
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error('暂无访问权限，请联系管理员');
	}
};
const handleClick = async (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
	if (activeName.value == 'first') {
		await getsysInfostem();
	}
};
const handleEdit = (e: Event, id: string, type: number) => {
	e.stopPropagation();
	entranceDialogRef.value?.openDialog(id, type);
};

const handleEditSys = (e: Event, id: string, type: number) => {
	e.stopPropagation();
	sysDialogRef.value?.openDialog(id, type);
};

const handleDel = (e: Event, item: any, type: number) => {
	e.stopPropagation();
	if (type === 1) {
		// 删除子系统
		ElMessageBox.confirm(`确认要将该系统从成都轨道生活智慧服务平台中删除吗？`, {
			confirmButtonText: '删除',
			cancelButtonText: '取消',
			type: 'info',
		})
			.then(() => {
				delEntrance({ id: item.id }).then((res) => {
					getEntranceList();
				});
			})
			.catch((err: any) => {
				console.log('err', err);
			});
	} else {
		// 删除分类
		ElMessageBox.confirm(`确认要删除该分类吗？`, {
			confirmButtonText: '删除',
			cancelButtonText: '取消',
			type: 'info',
		})
			.then(() => {
				if (item.sysInfos.length > 0) {
					ElMessageBox.confirm(`无法删除该分类，请先移动该分类下的子系统，再进行尝试。`, {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'info',
					})
						.then(() => {
							handleDelFun(item.groupId);
						})
						.catch((err: any) => {
							console.log('err', err);
						});
				} else {
					handleDelFun(item.groupId);
				}
			})
			.catch((err: any) => {
				console.log('err', err);
			});
	}
};
const handleDelFun = (id: string) => {
	delGroup({ id }).then((res) => {
		getEntranceList();
	});
};
</script>
<style lang="scss" scoped>
@font-face {
	font-family: 'MyCustomFont';
	src: url('~@/assets/font/alternate.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
}

.portal-home {
	// height: 100%;
	height: calc(100vh - 70px);
	overflow-y: auto;
	background: #fff;
	background: url('/src/assets/imgs/portal_bg.png') no-repeat center 100% 100%;
	padding-top: 70px;
	.header {
		padding: 20px 0 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.btns {
			width: 280px;
		}
		.tabs {
			flex: 1;
		}
	}
	.content {
		overflow: auto;
		// border-radius: 12px;
		.system {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			.title {
				display: flex;
				align-items: center;
				margin-left: 10px;
				font-size: 18px;
				font-weight: bold;
				color: #1a1a1a;
				.action {
					display: flex;
					align-items: center;
					padding: 3px 8px;
					gap: 4px;
					border-radius: 3px;
					background: #e3f9e9;
					padding: 3px 8px;
					font-size: 14px;
					font-weight: normal;
					cursor: pointer;
				}
				.edit {
					background: #e3f9e9;
					color: #2ba471;
				}
				.del {
					background: #fff0ed;
					color: #d54941;
				}
			}
			.sub_system {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
			}
			.desc {
				display: none;
			}

			&:hover > .active {
				background: #47a5ea;
				color: #fff;
				font-size: 16px;
			}

			.name {
				font-size: 24px;
				color: #1a1a1a;
				font-weight: 700;
				margin-bottom: 30px;
			}

			.system-list {
				display: flex;
				flex-wrap: wrap;
				margin: 10px;
				.item {
					margin: 0 30px 30px 0;
					position: relative;
				}

				.home {
					cursor: pointer;
					position: relative;
					border-radius: 4px;
					background: rgba(71, 133, 234, 0.06);
					padding: 20px;
					width: 352px;
					height: 68px;
					.img-box {
						background: #fff;
						border-radius: 50%;
						width: 28px;
						// height: 28px;
						margin-right: 14px;
						align-items: center;
					}

					&.active {
						background: #47a5ea;
						color: #fff;
						font-size: 16px;
					}

					.text {
						font-size: 16px;
						font-weight: 400;
						width: 200px;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					}
					.edit {
						display: flex;
						align-items: center;
						cursor: pointer;
					}
				}
			}
		}
	}
}

.no_data {
	width: 400px;
	height: 268px;
	margin: 0 auto;

	.tips {
		text-align: center;
		color: #999;
	}
}

.no_permission {
	width: 400px;
	height: 250px;

	.tips {
		text-align: center;
		color: #999;
	}

	.bold {
		color: #000;
		font-weight: 500;
	}
}
</style>
