<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar>
				<div class="title">机构管理</div>
				<!-- 树形结构 -->
				<div class="tree-container mb-20">
					<el-tree
						:data="companyTreeData"
						node-key="id"
						:default-expand-all="false"
						:expand-on-click-node="false"
						class="category-tree"
						v-loading="tableLoading"
					>
						<template #default="{ node, data }">
							<div class="custom-tree-node">
								<span class="node-label">{{ node.label }}</span>
							</div>
						</template>
					</el-tree>
				</div>
				<div class="tree-container">
					<el-tree
						:data="treeData"
						node-key="id"
						:default-expand-all="false"
						:expand-on-click-node="false"
						class="category-tree"
						v-loading="tableLoading"
					>
						<template #default="{ node, data }">
							<div class="custom-tree-node">
								<span class="node-label">{{ node.label }}</span>
								<div class="node-actions" v-if="showActions">
									<el-image
										style="width: 20px; height: 20px"
										class="action-btn"
										src="https://gdsh-oss.duomixing.com:9086/rls/b/CcEg5PNPkZHdsBb8T2gp.png"
										@click.stop="handleAddChild(data)"
									></el-image>
									<el-image
										v-if="data.id != '1'"
										style="width: 16px; height: 16px"
										class="action-btn"
										src="https://gdsh-oss.duomixing.com:9086/rls/b/KFN4O6ZO2HQ9RFoU9gzb.png"
										@click.stop="handleEdit(data)"
									></el-image>
									<el-image
										v-if="data.id != '1'"
										style="width: 16px; height: 16px"
										class="action-btn"
										src="https://gdsh-oss.duomixing.com:9086/rls/b/mEKH6KMQP4oCCSlY3bR7.png"
										@click.stop="handleDelete(data)"
									></el-image>
								</div>
							</div>
						</template>
					</el-tree>
				</div>
			</el-scrollbar>
			<!-- 表单弹框组件 -->
			<FormDialog ref="formDialogRef" @submit="handleFormSubmit" />
		</div>
	</div>
</template>

<script setup>
import { useMessageBox, useMessage } from '/@/hooks/message';
import { Edit, Delete, Plus } from '@element-plus/icons-vue';
import FormDialog from './form.vue';
import { getUserOutOrganizationTree, deleteUserOutOrganizationDel, getMealsCompanyTree } from '/@/api/member/staffCenter/institution';
import { ElMessageBox } from 'element-plus';

const formDialogRef = ref();
const showActions = ref(true);
const tableLoading = ref(false); // 加载状态
const treeData = ref([]); // 树形数据
const companyTreeData = ref([]); // 树形数据
// API调用函数（示例）
const categoryApi = {
	// 获取外部机构列表
	async getList() {
		try {
			tableLoading.value = true;
			const { code, data, msg } = await getUserOutOrganizationTree();
			if (code === 0) {
				return data;
			} else {
				useMessage().error(msg);
				return [];
			}
		} catch (error) {
			useMessage().error(error.msg);
			return [];
		} finally {
			tableLoading.value = false;
		}
	},
	// 获取外部机构列表
	async getCompanyList() {
		try {
			tableLoading.value = true;
			const { code, data, msg } = await getMealsCompanyTree();
			if (code === 0) {
				return data;
			} else {
				useMessage().error(msg);
				return [];
			}
		} catch (error) {
			useMessage().error(error.msg);
			return [];
		} finally {
			tableLoading.value = false;
		}
	},
	async delete(id) {
		try {
			tableLoading.value = true;
			const { code, data, msg } = await deleteUserOutOrganizationDel(id);
			if (code === 0) {
				await loadCategoryData();
				useMessage().success('删除成功');
				return data;
			} else {
				handleMsg(msg);
				return null;
			}
		} catch (error) {
			handleMsg(error.msg);
			return null;
		} finally {
			tableLoading.value = false;
		}
	},
};
// 转数据
const renameNameToLabel = (node) => {
	// 创建一个新对象，将 orgName 替换为 label
	const { orgName, children, ...rest } = node;
	const renamedNode = { label: orgName, ...rest };
	// 如果有子节点，递归处理每个子节点
	if (children && Array.isArray(children)) {
		renamedNode.children = children.map((child) => renameNameToLabel(child));
	}

	return renamedNode;
};
// 转数据
const companyRenameNameToLabel = (node) => {
	// 创建一个新对象，将 orgName 替换为 label
	const { orgShortName, siteDtoList, ...rest } = node;
	const renamedNode = { label: orgShortName, children: siteDtoList, ...rest };
	// 如果有子节点，递归处理每个子节点
	if (siteDtoList && Array.isArray(siteDtoList)) {
		renamedNode.children = siteDtoList.map((child) => companyRenameNameToLabel(child));
	}

	return renamedNode;
};
// 查找节点的父级名称
const getParentName = (parentId) => {
	if (!parentId) return 'xxxx';
	const findParent = (nodes, id) => {
		for (let node of nodes) {
			if (node.id === id) {
				return node.label;
			}
			if (node.children && node.children.length > 0) {
				const found = findParent(node.children, id);
				if (found) return found;
			}
		}
		return null;
	};
	return findParent(treeData.value, parentId) || 'xxxx';
};

// 加载分类数据
const loadCategoryData = async () => {
	const data = await categoryApi.getList();
	treeData.value = data.map((item) => renameNameToLabel(item));
	const companyData = await categoryApi.getCompanyList();
	companyTreeData.value = companyData.map((item) => companyRenameNameToLabel(item));
};

// 新增子分类
const handleAddChild = (data) => {
	formDialogRef.value.openDialog('add', data);
};

// 编辑分类
const handleEdit = (data) => {
	console.log('data', data);
	const editData = {
		id: data.id,
		orgName: data.label,
		parentCategory: getParentName(data.parentId),
	};
	console.log('editData', editData);
	formDialogRef.value.openDialog('edit', editData);
};

// 删除分类
const handleDelete = async (data) => {
	await ElMessageBox.confirm('此操作将永久删除？', '系统提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await categoryApi.delete(data.id);
		})
		.catch(() => {
			return;
		});
};
const handleMsg = async (msg) => {
	await ElMessageBox.confirm(msg, '系统提示', {
		confirmButtonText: '确认',
		showClose: false,
		showCancelButton: false,
		type: 'warning',
	})
		.then(async () => {
			return;
		})
		.catch(() => {
			return;
		});
};
// 处理表单提交
const handleFormSubmit = async () => {
	// 新增成功后刷新表格
	await loadCategoryData();
};

// 组件挂载时的初始化
onMounted(async () => {
	await loadCategoryData();
});
</script>

<style scoped>
.title {
	font-family: PingFang SC;
	font-size: 20px;
	font-weight: normal;
	line-height: 28px;
	letter-spacing: 0em;
	/* 正文色/正文色 */
	color: #1a1a1a;
	margin-bottom: 30px;
}
.tree-container {
	/* border: 1px solid #e4e7ed; */
	border-radius: 4px;
	padding: 0 32px;
	/* background: #fafafa; */
	position: relative;
}
.custom-tree-node {
	display: flex;
	width: 100%;
	justify-content: space-between;
}
.category-tree {
	background: transparent;
	width: 400px;
}

.tree-node {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding-right: 8px;
}

.node-label {
	font-family: PingFang SC;
	font-size: 14px;
	font-weight: normal;
	line-height: 22px;
	letter-spacing: 0em;

	/* 正文色/正文色 */
	color: #1a1a1a;
}

.node-actions {
	display: flex;
	align-items: center;
	margin-left: 20px;
	/* gap: 4px;
	opacity: 0; */
	/* transition: opacity 0.3s; */
}

.tree-node:hover .node-actions {
	opacity: 1;
}

.action-btn {
	margin: 0 10px;
	border: none;
	cursor: pointer;
}

.action-btn:hover {
	color: #409eff;
	background: rgba(64, 158, 255, 0.1);
}

.action-btn:disabled {
	color: #c0c4cc;
	background: transparent;
}

.more-btn {
	color: #c0c4cc;
}

:deep(.el-tree-node__content) {
	height: 32px;
	line-height: 32px;
}

:deep(.el-tree-node__content:hover) {
	background-color: #f5f7fa;
}

:deep(.el-tree-node__expand-icon) {
	color: #c0c4cc;
}

:deep(.el-tree-node__expand-icon.expanded) {
	transform: rotate(90deg);
}

/* 加载状态样式 */
:deep(.el-loading-mask) {
	border-radius: 4px;
}
</style>
