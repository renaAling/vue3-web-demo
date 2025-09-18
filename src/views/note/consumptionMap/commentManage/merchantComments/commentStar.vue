<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
       <div @click="router.go(-1)" class="flex items-center cursor-pointer mb-4">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
      <el-row>
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item label="用户昵称">
            <el-input placeholder="请输入用户昵称" maxlength="30" v-model="state.queryForm.nickName" clearable />
          </el-form-item>
          <el-form-item label="身份">
            <el-select v-model="state.queryForm.userType">
              <el-option v-for="item in userIdentity" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
							v-model="daterangeTime"
							@change="changeTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="mb-5">
        <el-button type="primary" @click="commentsDialogRef.openDialog()">新增</el-button>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border
        :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="content" label="评论内容" show-overflow-tooltip />
        <el-table-column prop="score" label="评分" />
        <el-table-column prop="nickName" label="用户昵称" />
        <el-table-column prop="userType" label="身份">
          <template #default="{ row }">
            <el-tag v-if="row.userType === 1">地铁达人</el-tag>
            <el-tag v-else-if="row.userType === 2">普通用户</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button text type="danger" @click="handelDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </div>
    <CommentsDialog ref="commentsDialogRef" @refresh="getDataList" />
  </div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { commentPageApi, commentDelApi } from '/@/api/note/noteInfo';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { userIdentity } from '../hook/index'
// 引入组件
const CommentsDialog = defineAsyncComponent(() => import('./commentsDialog.vue'));
const commentsDialogRef = ref();
const route = useRoute();
const router = useRouter();
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    code: route.query.ipoCode as string,
  },
  pageList: commentPageApi,
});
const daterangeTime = ref<string[]>([]);
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields();
  daterangeTime.value = [];
  state.queryForm = {
    code: route.query.ipoCode as string,
  };
  getDataList();
};
// 删除
const handleDelApi = async (id: string) => {
	try {
		const { code, msg } = await commentDelApi(id);
		if (code === 0) {
			getDataList();
			useMessage().success('删除成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const handelDel = async (row: any) => {
	console.log('row', row);
	ElMessageBox.confirm('此操作将永久删除？', '系统提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await handleDelApi(row.id);
		})
		.catch(() => {
			return;
		});
};
</script>
