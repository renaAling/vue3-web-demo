<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar>
				<!-- 树形结构 -->
				<div class="tree-container">
					<el-tree
						ref="treeRef"
						:data="treeData"
						node-key="id"
						:default-expand-all="true"
						:expand-on-click-node="false"
						class="category-tree"
						v-loading="tableLoading"
					>
						<template #default="{ node, data }">
							<div class="tree-node">
								<span class="node-label">{{ node.label }}</span>
								<div class="node-actions" v-if="showActions">
									<el-image
										v-if="data.isAddSub"
										style="width: 20px; height: 20px"
										class="action-btn"
										src="https://gdsh-oss.duomixing.com:9086/rls/b/CcEg5PNPkZHdsBb8T2gp.png"
										@click.stop="handleAddChild(data)"
									></el-image>
									<el-image
										v-if="data.isEditable"
										style="width: 16px; height: 16px"
										class="action-btn"
										src="https://gdsh-oss.duomixing.com:9086/rls/b/KFN4O6ZO2HQ9RFoU9gzb.png"
										@click.stop="handleEdit(data)"
									></el-image>
									<el-image
										v-if="data.isDeletable"
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
import { getMemberCategoryTree, deleteMemberCategoryDel } from '/@/api/member/memberType/typeManager';
import { ElMessageBox } from 'element-plus';
// import { getCategoryList, addCategory, updateCategory, deleteCategory } from '@/api/category'

// 响应式数据
const treeRef = ref();
const formDialogRef = ref();
const showActions = ref(true);
const currentParent = ref(null); // 当前选中的父级分类

// 加载状态
const tableLoading = ref(false);

// 树形数据
const treeData = ref([]);

// API调用函数（示例）
const categoryApi = {
	// 获取分类列表
	//
	async getList() {
		try {
			tableLoading.value = true;
			//     // 这里调用实际的API
			const { code, data, msg } = await getMemberCategoryTree();
			if (code === 0) {
				console.log('data', data);
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

	// 删除分类
	async delete(id) {
		try {
			tableLoading.value = true;
			const { code, data, msg } = await deleteMemberCategoryDel(id);
			if (code === 0) {
				await loadCategoryData();
				useMessage().success('删除成功');
				return data;
			} else {
				useMessage().error(msg);
				return null;
			}
		} catch (error) {
			handleMsg(error.msg);
			// useMessage().error(error.msg);
			return null;
		} finally {
			tableLoading.value = false;
		}
	},
};
// 查找节点的父级名称
const getParentName = (parentId) => {
	console.log('parentId', parentId);
	if (!parentId) return 'xxxx';
	const findParent = (nodes, id) => {
		for (let node of nodes) {
			if (node.id == id) {
				return node.label;
			}
			if (node.children && node.children.length > 0) {
				const found = findParent(node.children, id);
				if (found) return found;
			}
		}
		// return null;
	};

	return findParent(treeData.value, parentId) || 'xxxx';
};

// 转数据
const renameNameToLabel = (node) => {
	// 创建一个新对象，将 categoryName 替换为 label
	const { categoryName, children, ...rest } = node;
	const renamedNode = { label: categoryName, ...rest };
	// 如果有子节点，递归处理每个子节点
	if (children && Array.isArray(children)) {
		renamedNode.children = children.map((child) => renameNameToLabel(child));
	}

	return renamedNode;
};

// 加载分类数据
const loadCategoryData = async () => {
	const data = await categoryApi.getList();
	console.log('data', data);
	treeData.value = data.map((item) => renameNameToLabel(item));
};

// 新增子分类
const handleAddChild = (data) => {
	console.log('data', data);
	currentParent.value = data;
	const obj = {
		parentId: data.id,
		categoryName: '',
		isSystem: 0,
		parentCategory: data.label,
	};
	formDialogRef.value.openDialog('add', obj);
};

// 编辑分类
const handleEdit = (data) => {
	// console.log('getParentNamesById(data.parentId)', getParentNamesById(data.parentId));

	const editData = {
		...data,
		parentCategory: getParentName(data.parentId),
	};
	formDialogRef.value.openDialog('edit', editData);
};

// 删除分类
const handleDelete = async (data) => {
	ElMessageBox.confirm('此操作将永久删除？', '系统提示', {
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
.tree-container {
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	padding: 20px;
	background: #fafafa;
	position: relative;
}

.category-tree {
	background: transparent;
	width: 400px;
}

.tree-node {
	display: flex;
	width: 100%;
	justify-content: space-between;
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
