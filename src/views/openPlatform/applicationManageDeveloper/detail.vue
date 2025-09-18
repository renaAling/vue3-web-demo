<template>
	<div class="layout-padding">
		<!-- 基础信息 -->
		<section>
			<el-card>
				<p class="title">基础信息</p>
				<el-form :model="model" label-width="auto">
					<el-form-item label="应用名称：" class="custom-width">
						<span>{{ model.appName }}</span>
					</el-form-item>
					<el-form-item label="APPID：" class="custom-width">
						<span>{{ model.appId }}</span>
					</el-form-item>
					<el-form-item label="APPSecret：" class="custom-width">
						<span style="margin-right: 20px">{{ model.encryptSecret }}</span>
						<el-button type="primary" @click="handleViewAppSecret">查看</el-button>
					</el-form-item>
					<el-form-item label="应用公钥：" class="custom-width">
						<el-button type="primary" @click="dialogVisible = true">查看公钥</el-button>
					</el-form-item>
					<el-form-item label="应用说明：" class="custom-width">
						<span>{{ model.remark }}</span>
					</el-form-item>
				</el-form>
			</el-card>
		</section>
		<!-- 接口授权 -->
		<section>
			<el-card>
				<p class="title">接口授权</p>
				<el-table border :data="model.authorizes" :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle" >
					<el-table-column label="接口名称" prop="interfaceName" width="200" show-overflow-tooltip />
					<el-table-column label="接口地址" prop="uri" width="200" show-overflow-tooltip />
					<el-table-column label="请求方式" prop="requestMethod" width="200" show-overflow-tooltip />
					<el-table-column label="接口状态" prop="interfaceStatus" show-overflow-tooltip>
						<template #default="{ row }">
							<span v-if="row.interfaceStatus == 1">上线</span>
							<span v-else-if="row.interfaceStatus == 2">下线</span>
						</template>
					</el-table-column>
					<el-table-column label="接口版本" prop="version" show-overflow-tooltip />
				</el-table>
			</el-card>
		</section>
		<!-- 查看公钥弹窗 -->
		<el-dialog v-model="dialogVisible" title="查看公钥" width="410" align-center>
			<span>{{ model.publicKey }}</span>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="handleResetPublicKey">重置</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { reactive, ref, watch } from 'vue';
import { ElNotification, ElMessageBox } from 'element-plus';
import { getApplicationDetail, resetkeyPair, updateInterfaceStatus } from '/@/api/openPlatform/application';
import { useRoute } from 'vue-router';
import { useMessage } from '/@/hooks/message';

let route = useRoute();
const router = useRouter();
const dialogVisible = ref(false);
const blackFormdialogVisible = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
	loading: false,
});

const { tableStyle } = useTable(state);
const model = ref({
	appName: '',
	appId: '',
	encryptSecret: '',
	appSecret: '',
	publicKey: '',
	remark: '',
	authorizes: [],
});

const blackForm = ref({
	interfaceName: '',
	appName: '',
	remark: '',
	id: '',
});

const handleViewAppSecret = () => {
	ElMessageBox.alert(`${model.value.appSecret}`, 'APPsecret', {});
};

const handleResetPublicKey = () => {
	resetkeyPair(route.query.id as string).then((res) => {
		if (res.code === 0) {
			useMessage().success('密钥对重置成功');
			dialogVisible.value = false;
			getDetail();
		}
	});
};

const handleConfirm = () => {
	ElMessageBox.confirm(`是否加入黑名单`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			updateInterfaceStatus({
				id: blackForm.value.id,
				status: 2,
				remark: blackForm.value.remark,
			}).then((res) => {
				if (res.code === 0) {
					useMessage().success('移入黑名单成功');
					blackForm.value.remark = '';
					blackFormdialogVisible.value = false;
					getDetail();
				}
			});
		})
		.catch((err) => {
			console.log('err', err);
		});
};

const handleCancel = () => {
	blackFormdialogVisible.value = false;
	blackForm.value.interfaceName = '';
	blackForm.value.appName = '';
	blackForm.value.remark = '';
	blackForm.value.id = '';
};

const getDetail = () => {
	const id = route.query?.id;
	getApplicationDetail(id as string)
		.then((res) => {
			if (res.code === 0) {
				model.value = { ...res.data };
				model.value.encryptSecret = '***************************';
				model.value.authorizes = res.data.authorizes;
			}
		})
		.catch((err) => {
			console.log('err', err);
		});
};

onMounted(() => {
	getDetail();
});
</script>
<style lang="scss" scoped>
.layout-padding {
	overflow-y: scroll;
}
section {
	margin-bottom: 28px;
}

.custom-width {
	width: 330px;
}

.title {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: #1d2129;
	margin-bottom: 20px;
}

.footer {
	text-align: center;

	.el-button {
		width: 68px;
	}
}
</style>
