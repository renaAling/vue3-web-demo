<template>
	<div class="portal_news">
		<div class="news_content">
			<div class="card_header">
				<span class="left">站内消息</span>
			</div>
			<div class="query_form">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="消息标题" prop="title">
						<el-input v-model="state.queryForm.title" placeholder="请输入消息标题" clearable> </el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="add_btn">
				<div style="width: 100%">
					<el-button icon="plus" @click="configMsgDialogRef.openDialog()" type="primary">新增消息</el-button>
				</div>
			</div>
			<div class="tabs">
				<el-tabs v-model="activeIndex" type="card" class="demo-tabs" @tab-click="changeType">
					<el-tab-pane v-for="(value, key) in configTypes" :label="value" :name="key" :key="key"></el-tab-pane>
				</el-tabs>
			</div>
			<div class="list">
				<el-table
					:data="state.dataList"
					v-loading="state.loading"
					row-key="id" border
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column label="消息标题" prop="title" />
					<el-table-column label="发布人UID" prop="unionId" />
					<el-table-column label="发布人姓名" prop="publishName" width="200" />
					<el-table-column label="发布时间" v-if="activeIndex == '1'" prop="publishTime" />
					<el-table-column label="操作" v-if="activeIndex == '2'" width="240">
						<template #default="{ row }">
							<el-button type="primary" link @click="handleCommand('release', row)">发布</el-button>
							<el-button type="primary" link @click="handleCommand('edit', row)">编辑</el-button>
							<el-button type="primary" link @click="handleCommand('delete', row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>

		<!-- 发布消息弹窗 -->
		<ReleaseMsgDiaglog @refresh="getDataList()" ref="releaseMsgDialogRef" />
		<!-- 新增/编辑消息弹窗 -->
		<ConfigMsgDialog @refresh="getDataList()" ref="configMsgDialogRef" />
	</div>
</template>

<script lang="ts" setup name="merchant-reportForms-business">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';
import type { TabsPaneContext } from 'element-plus';
import { getManageModeMessageList, delMessage } from '/@/api/portal/index';

const ReleaseMsgDiaglog = defineAsyncComponent(() => import('./releaseMsg.vue'));
const ConfigMsgDialog = defineAsyncComponent(() => import('./configMsg.vue'));

// 搜索变量
const queryRef = ref();
const activeIndex = ref('1');

const configTypes = {
	1: '已发布消息',
	2: '未发布消息',
};
const releaseMsgDialogRef = ref();
const configMsgDialogRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getManageModeMessageList,
	queryForm: { publishFlag: 1 },
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const changeType = (tab: TabsPaneContext, event: Event) => {
	state.queryForm.publishFlag = tab?.paneName;
	state.dataList = [];
	getDataList();
};

const handleCommand = async (command: Table.Command, row: any = {}) => {
	switch (command) {
		// 发布
		case 'release':
			releaseMsgDialogRef.value.openDialog(row.id);
			break;
		// 编辑
		case 'edit':
			configMsgDialogRef.value.openDialog(row.id);
			break;
		// 删除
		case 'delete':
			try {
				await useMessageBox().confirm(`是否确定删除该消息`, '删除消息');
			} catch {
				return;
			}
			try {
				await delMessage(row.id);
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
	}
};
</script>
<style lang="scss" scoped>
.portal_news {
	padding: 16px;
	overflow-y: scroll;
	.news_content {
		.card_header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10px;
			.left {
				font-size: 24px;
				color: #000;
			}
			.right {
				font-size: 16px;
				color: #409eff;
				cursor: pointer;
			}
		}
		.add_btn {
			margin-bottom: 10px;
		}

		.list {
			.item-box {
				position: relative;
				border: 1px solid #eee;
				border-radius: 8px;
				padding: 16px;
				margin: 4px 0;
				.read_tips {
					display: block;
					width: 8px;
					height: 8px;
					background: #f56c6c;
					border-radius: 50%;
					position: absolute;
					left: 4px;
					top: 25px;
				}
			}
			.item {
				cursor: pointer;
				.title {
					font-size: 16px;
					color: #1a1a1a;
				}
				.time {
					font-size: 14px;
					color: #666;
				}
			}
			.content {
				border-top: 1px solid #eee;
				font-size: 14px;
				color: #666;
				padding: 10px 0;
			}
		}
	}
}

:deep(.el-tabs__header) {
	margin: 0px !important;
}
</style>
