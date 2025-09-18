<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="用户UID" prop="id">
						<el-input placeholder="请输入" style="width: 220px" maxlength="50" v-model="state.queryForm.id" clearable />
					</el-form-item>
					<el-form-item label="用户手机号" prop="phone">
						<el-input placeholder="请输入手机号" style="width: 220px" maxlength="11" v-model="state.queryForm.phone" clearable />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-button icon="upload" type="primary" @click="excelUploadRef.show()"> 批量导入 </el-button>
					<el-button icon="download" type="primary" @click="downExcelTemp"> 下载模板 </el-button>
					<el-button icon="ArrowLeftBold" type="primary" @click="handelBack()">返回</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="id" label="用户ID"></el-table-column>
				<el-table-column prop="groupName" label="手机号"></el-table-column>
				<el-table-column prop="createTime" label="添加时间"></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button text type="danger" @click="handelDel(row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 导入 -->
		<upload-excel
			title="用户数据批量导入"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			:custom-temp-url="baseFileUrl + '/rls/b/rls/门店模板.zip'"
			url="/mall/store/import"
			:fileType="['xlsx', 'xls']"
		/>
	</div>
</template>

<script setup lang="ts" name="member-label">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delGroup, pageList } from '../../../../api/member/member';
import { useRouter } from 'vue-router';
import { useMessage, useMessageBox } from '/@/hooks/message';

const router = useRouter();
const baseFileUrl = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);
const excelUploadRef = ref();
const queryRef = ref();

const handelDel = (id: string) => {
	useMessageBox()
		.confirm('是否删除该用户', '删除')
		.then(async () => {
			try {
				const { code } = await delGroup(id);
				if (code === 0) {
					useMessage().success('删除成功');
					getDataList();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		});
};
/**
 * 下载模板文件
 */
const downExcelTemp = () => {
	// 自定义模板
	const link = document.createElement('a');
	link.href = 'https://gdsh-oss.duomixing.com:9086/rls/b/dtmeber/轨道生活会员中心分组标签批量导入模版.xlsx'; 
	 link.download = '轨道生活会员中心标签批量导入模版.xlsx'
	document.body.appendChild(link);
	link.click();
	window.setTimeout(() => {
		document.body.removeChild(link);
	}, 0);
};
const handelBack = () => {
	router.back();
};
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		id: '',
		phone: '',
	},
	pageList: pageList,
	descs: ['create_time'],
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
