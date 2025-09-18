<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="ml10 mb-[10px]" style="font-size: 18px; font-weight: 500">{{ route.query.name }}</div>
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="用户" prop="unionId">
						<el-input placeholder="请输入UID" style="width: 220px" maxlength="50" v-model="state.queryForm.unionId" clearable />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input placeholder="请输入手机号" style="width: 220px" maxlength="11" v-model="state.queryForm.mobile" clearable />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
				<div>
					<!-- <el-button icon="upload" type="primary" @click="excelUploadRef.show()"> 批量导入 </el-button> -->
					<el-button icon="upload" type="primary" @click="excelUpload"> 批量导入 </el-button>
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
				<el-table-column type="index" label="序号" width="80"></el-table-column>
				<el-table-column prop="unionId" label="用户ID"></el-table-column>
				<el-table-column prop="mobile" label="手机号">
					<template #default="{ row }">
						<!-- <el-button type="text" @click="getMobile(row)">获取手机号</el-button> -->
						<sapn v-if="row.mobile">{{ row.mobile }}</sapn>
						<el-button type="text" v-else @click="getMobile(row)">获取手机号</el-button>
					</template>
				</el-table-column>
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
		<upload-excel title="用户数据批量导入" @refreshDataList="handle" ref="excelUploadRef" :url="importUrl" :fileType="['xlsx', 'xls']" />
	</div>
</template>

<script setup lang="ts" name="member-group">
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	pageMemberSignInfoDel,
	pageMemberSignInfoPage,
	getUserInfoByUnionIdForMember,
	pageMemberSignInfoUpDate,
} from '../../../../api/member/member';
import { useRouter } from 'vue-router';
import { useMessage, useMessageBox } from '/@/hooks/message';
const route = useRoute();
const router = useRouter();
import { ElMessageBox } from 'element-plus';
const excelUploadRef = ref();
const queryRef = ref();
const importUrl = ref(`/uac/memberSignInfo/import?signCode=${route.query.code}`);
const handelDel = (id: string) => {
	useMessageBox()
		.confirm('是否删除该用户', '删除')
		.then(async () => {
			try {
				const { code } = await pageMemberSignInfoDel(Number(id));
				if (code === 0) {
					useMessage().success('删除成功');
					getDataList();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		});
};
const getMobile = async (row: any) => {
	try {
		const { code, data } = await getUserInfoByUnionIdForMember(row.unionId);
		if (code === 0) {
			console.log('data', data);
			handleUpDate(row, data);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const handleUpDate = async (row: any, userInfoData: any) => {
	try {
		const { code, data } = await pageMemberSignInfoUpDate({ id: row.id, mobile: userInfoData.mobile });
		if (code === 0) {
			console.log('data', data);
			useMessage().success('获取成功');
			getDataList();
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const handelBack = () => {
	router.back();
};
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		unionId: '',
		mobile: '',
		signCode: route.query.code,
	},
	pageList: pageMemberSignInfoPage,
	descs: ['create_time'],
});
const excelUpload = () => {
	if (Number(route.query.status) === 2) {
		useMessage().error('该标签已禁用，不能进行批量导入');
	} else excelUploadRef.value.show();
};
/**
 * 下载模板文件
 */
const downExcelTemp = () => {
	// 自定义模板
	const link = document.createElement('a');
	link.href = 'https://gdsh-oss.duomixing.com:9086/rls/b/dtmember/会员中心分组标签批量导入模版.xlsx';
	// link.download = 'temp.zip';
	link.download = '轨道生活会员中心分组批量导入模版.xlsx';
	document.body.appendChild(link);
	link.click();
	window.setTimeout(() => {
		document.body.removeChild(link);
	}, 0);
};
const handle = (val: any) => {
	console.log('val', val);
	if (val.code === 0) {
		const htmlValue = `<div>导入成功${val.data.importSuccessNum},导入失败${val.data.importFailNum}</div>
		<div>添加成功${val.data.insertSuccessNum},添加失败${val.data.insertFailNum}</div>
		<div>删除成功${val.data.deleteSuccessNum}，删除失败${val.data.deleteFailNum}</div>`;
		ElMessageBox.alert(htmlValue, '', {
			confirmButtonText: '关闭',
			dangerouslyUseHTMLString: true,
		});
	}
	getDataList();
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
