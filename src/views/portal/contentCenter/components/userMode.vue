<template>
	<div class="content_center_user_mode">
		<div class="tabs">
			<el-tabs v-model="activeIndex" type="card" @tab-click="changeType">
				<el-tab-pane v-for="(item, index) in channelList" :label="item.name" :name="item.id" :key="item.id"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="list" v-if="list && list.length > 0">
			<div v-for="(item, index) in list" :key="index" class="item" @click="handleDetail(item)">
				<img class="article_img" :src="item.imgUrl" alt="" />
				<div class="title">{{ item.name }}</div>
				<div class="user_info_time">
					<div class="left">
						<img class="avatar" :src="item.publishAvatar" alt="" />
						<div class="username">{{ item.publishName }}</div>
					</div>
					<div class="right">
						{{ item.publishTime }}
					</div>
				</div>
			</div>
		</div>
		<div v-else class="empty">暂无文章</div>
		<el-pagination
			class="mt15"
			:current-page="pagination.current"
			:page-size="pagination.size"
			:page-sizes="pagination.pageSizes"
			background
			layout="total, sizes, prev, pager, next, jumper"
			:total="pagination.total"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		/>
	</div>
	<el-dialog v-model="dialogVisible" title="文章详情" width="1200">
		<div class="detail">
			<div class="title">{{ articleDetail.name }}</div>
			<div class="info">
				<div class="user">
					<img class="avatar" :src="articleDetail.publishAvatar" alt="" />
					<div class="name">{{ articleDetail.publishName }}</div>
				</div>
				<div class="time">{{ articleDetail.publishTime }}</div>
			</div>
			<div class="content" v-html="articleDetail.description"></div>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="portal-content-center">
import type { TabsPaneContext } from 'element-plus';
import { getChannels, getArticles } from '/@/api/portal/index';
import { useMessage } from '/@/hooks/message';

const activeIndex = ref('1');
const currentChannel = ref('') as any;
const dialogVisible = ref(false);
const channelList = ref<any[]>([]);

const getChannelList = async () => {
	try {
		const { code, data } = await getChannels();
		if (code === 0) {
			channelList.value = data;
			currentChannel.value = data[0].id;
		}
	} catch (err: any) {
		console.log(err);
	}
};
const changeType = async (tab: TabsPaneContext, event: Event) => {
	currentChannel.value = tab?.paneName;
	await getArticleList(currentChannel.value);
	// getDataList();
};
interface ListItem {
	id?: string | number;
	imgUrl: string;
	name: string;
	publishUserAvatar: string;
	publishName: string;
	publishTime: string;
	description: string;
}
const list = ref<ListItem[]>([]);
const articleDetail = ref();
const pagination = reactive({
	current: 1,
	size: 5,
	total: 0,
	pageSizes: [1, 5, 10, 20, 50, 100],
});

const currentChangeHandle = (val: number) => {
	pagination!.current = val;
	getArticleList(currentChannel.value);
};
const sizeChangeHandle = (val: number) => {
	pagination!.size = val;
	getArticleList(currentChannel.value);
};
const getArticleList = async (channelId: string) => {
	const params = {
		current: pagination!.current,
		size: pagination!.size,
		columnId: channelId,
	};
	try {
		const { code, msg, data } = await getArticles(params);
		if (code === 0) {
			list.value = [];
			list.value = data.records;
			console.log('list.value', list.value);
			// list.value = data.records?.map((item: any) => {
			// 	return {
			// 		...item,
			// 		showDetail: false,
			// 	};
			// });
			pagination.total = data.total;
		} else {
			list.value = [];
			useMessage().error(msg);
		}
	} catch (err: any) {
		list.value = [];
		useMessage().error(err.msg);
	}
};

const handleDetail = (row: any) => {
	// 打开一个新窗口
	const newWindow: any = window.open('', '_blank', '');

	// 写入完整的 HTML 文档
	newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>新闻详情</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #222;
          padding: 48px 100px;
          margin: 0 auto;
        }
        p {
          margin-bottom: 1em;
        }
		.title{
		    font-size: 20px;
    		font-weight: 600;
			margin-bottom: 24px;
			font-size: 20px;
			color: #333333;
		}
		.head{
			display:flex;
			align-items: center;
    		padding-bottom: 26px;
			font-size: 14px;
			line-height: 22px;
			.time{
				margin-left: 20px;
				color: #999999;
			}
		}
      </style>
    </head>
    <body>
	<div class='title'>${row.name}</div>
	<div class='head'>
		<div class='avatar'><img src="${row.publishAvatar}" style='width:27px;height:26px;border-radius: 50%;margin-right: 5px;vertical-align: middle;'></img>${row.publishName}</div>
		<div class='time'>${row.publishTime}</div>
	</div>
      ${row.description}
    </body>
    </html>
  `);

	// 可选：确保文档关闭以正确渲染
	newWindow.document.close();
};

onMounted(async () => {
	await getChannelList();
	await getArticleList(currentChannel.value);
});
</script>
<style lang="scss" scoped>
.content_center_user_mode {
	padding: 16px;
	overflow-y: scroll;
	.list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding-top: 16px;
		.item {
			border-radius: 12px;
			background: #fff;
			padding: 16px;
			border: 1px solid #eaeaea;
			margin-right: 12px;
			margin-bottom: 12px;
			box-shadow: 0px 8px 20px 0px rgba(40, 51, 80, 0.08), 0px 12px 32px 4px rgba(40, 51, 80, 0.04);
			width: 304px;
			box-sizing: content-box;
			.article_img {
				width: 100%;
				height: 180px;
				margin-bottom: 12px;
				border-radius: 4px;
			}
			.title {
				font-size: 14px;
				font-weight: bold;
				margin-bottom: 12px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.user_info_time {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					display: flex;
					align-items: center;
					.avatar {
						width: 40px;
						height: 40px;
						border-radius: 50%;
						margin-right: 10px;
					}
					.username {
						font-size: 14px;
						font-weight: normal;
						color: #666666;
					}
				}
				.right {
					font-size: 14px;
					font-weight: normal;
					color: #999999;
				}
			}
		}
	}
	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 100px;
		font-size: 18px;
	}
}
.detail {
	.title {
		font-size: 18px;
		font-weight: bold;
		color: #333333;
		margin-bottom: 14px;
	}
	.info {
		display: flex;
		justify-content: space-between;
		.user {
			display: flex;
			align-items: center;
			font-size: 14px;
			font-weight: normal;
			color: #666666;
			.avatar {
				width: 28px;
				height: 28px;
				border-radius: 50%;
				margin-right: 8px;
			}
		}
		.time {
			font-size: 14px;
			font-weight: normal;
			color: #666666;
		}
	}

	.content {
		text-align: center;
	}
}
:deep(.el-tabs__header) {
	margin: 0px !important;
	.is-active {
		background-color: #4785ea !important;
		color: #fff !important;
	}
}
</style>
