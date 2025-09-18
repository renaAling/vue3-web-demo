<template>
	<div class="portal_news">
		<div class="news_content">
			<div class="card-header">
				<span class="left">站内消息</span>
				<span class="right" @click="readNews()">全部已读</span>
			</div>
			<div class="search">
				<el-form ref="queryRef" :inline="true" :model="queryForm" @keyup.enter="getNewsList">
					<el-form-item label="时间" prop="time">
						<el-date-picker v-model="queryForm.time" value-format="YYYY-MM-DD" clearable style="width: 200px" placeholder="请选择时间" />
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="getNewsList">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="list">
				<div v-for="(item, index) in list" :key="index" class="item-box">
					<span class="read_tips" v-if="item.readFlag == '0'"></span>
					<div class="item flex justify-between items-center" @click="handleRead(item)">
						<div class="title" :class="item.readFlag == '1' || isAllReadFlag ? 'has_read' : ''">{{ item.title }}</div>
						<div class="time" :class="item.readFlag == '1' || isAllReadFlag ? 'has_read' : ''">{{ item.publishTime }}</div>
					</div>
					<div class="content" v-show="item.showDetail" v-html="item.content"></div>
				</div>
				<div v-if="list.length == 0">暂无系统消息~</div>
			</div>
			<el-pagination
				@size-change="sizeChangeHandle"
				@current-change="currentChangeHandle"
				class="mt15"
				:pager-count="5"
				:page-sizes="pagination.pageSizes"
				:current-page="pagination.current"
				background
				:page-size="pagination.size"
				:total="pagination.total"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script setup lang="ts" name="portal-home">
import { getUserModeMessageList, readAllMessage, readSingleMessage } from '/@/api/portal/index';
import { useMessage, useMessageBox } from '/@/hooks/message';
import router from '/@/router';

const queryRef = ref();
const isAllReadFlag = ref(false);
interface ListItem {
	title: string;
	content: string;
	publishTime: string;
	showDetail?: boolean;
	readFlag?: string;
	allFlag?: string;
}
const queryForm = ref({
	time: '',
});
const list = ref<ListItem[]>([]);
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0,
	pageSizes: [1, 10, 20, 50, 100, 200],
});

const currentChangeHandle = (val: number) => {
	pagination!.current = val;
	getNewsList();
};
const sizeChangeHandle = (val: number) => {
	pagination!.size = val;
	getNewsList();
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getNewsList();
};
const getNewsList = async () => {
	const params = {
		current: pagination!.current,
		size: pagination!.size,
		date: queryForm.value.time,
	};
	const { code, data } = await getUserModeMessageList(params);
	if (code === 0) {
		list.value = data.records?.map((item: any) => {
			return {
				...item,
				showDetail: false,
			};
		});
		pagination.total = data.total;
	}
};
const readNews = async () => {
	try {
		await useMessageBox().confirm(`确定将消息标记为已读吗？`, '提示');
	} catch {
		return false;
	}
	const { code } = await readAllMessage();
	if (code === 0) {
		isAllReadFlag.value = true;
		list.value.forEach((item) => {
			item.readFlag = '1';
		});
		getNewsList();
	}
};

const handleRead = async (item: any) => {
	item.showDetail = !item.showDetail;
	const { code } = await readSingleMessage(item.id);
	if (code === 0) {
		item.readFlag = '1';
	}
};

onMounted(() => {
	getNewsList();
});
</script>
<style lang="scss">
.portal_news {
	padding: 16px;
	overflow-y: scroll;
	.news_content {
		.card-header {
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
		.list {
			padding: 16px 0;
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
				.has_read {
					color: #ccc;
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
</style>
