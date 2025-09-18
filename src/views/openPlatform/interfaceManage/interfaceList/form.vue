<template>
	<div class="layout-padding">
		<!-- 基础信息 -->
		<section>
			<el-card>
				<p class="title">基础信息</p>
				<el-form ref="formRef" :model="model" :rules="rules" label-width="auto">
					<el-form-item label="接口名称：" prop="interfaceName" class="custom-width">
						<el-input v-model="model.interfaceName" placeholder="请输入接口名称" clearable maxlength="30" show-word-limit />
					</el-form-item>
					<el-form-item label="接口路径：" prop="uri" class="custom-width">
						<el-input v-model="model.uri" placeholder="请输入接口路径" clearable maxlength="300" show-word-limit type="textarea" />
					</el-form-item>
					<el-form-item label="请求方式：" prop="requestMethod" class="custom-width">
						<el-select v-model="model.requestMethod" placeholder="请选择请求方式" clearable filterable>
							<el-option v-for="item in requestMethodsList" :label="item.label" :value="item.value" :key="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="接口版本号：" prop="version" class="custom-width">
						<el-input v-model="model.version" placeholder="请输入接口版本号" clearable maxlength="20" show-word-limit />
					</el-form-item>
				</el-form>
				<div class="footer">
					<el-button type="primary" @click="submitForm(formRef)" :loading="loading">保存</el-button>
					<el-button @click="handleCancel">取消</el-button>
				</div>
			</el-card>
		</section>
		<!-- 请求参数 -->
		<section>
			<el-card>
				<p class="title">请求参数</p>
				<el-button @click="handleAddParams(1)" type="primary" style="margin-bottom: 20px" :disabled="disableBtn">添加参数</el-button>
				<el-table border :data="model.requestParams" :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle" >
					<el-table-column label="参数名称" prop="paramName" width="200" show-overflow-tooltip />
					<el-table-column label="参数类型" prop="paramType" width="200" show-overflow-tooltip />
					<el-table-column label="是否必填" prop="required" width="200" show-overflow-tooltip>
						<template #default="{ row }">
							<span>{{ row.required ? '是' : '否' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="参数说明" prop="remark" show-overflow-tooltip />
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" text @click="handleEdit(row, 1)">编辑</el-button>
							<el-button type="primary" text @click="handleDelete(row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</section>
		<!-- 响应参数 -->
		<section>
			<el-card>
				<p class="title">响应参数</p>
				<el-button @click="handleAddParams(2)" type="primary" style="margin-bottom: 20px" :disabled="disableBtn">添加参数</el-button>
				<el-table border :data="model.responseParams" :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
					<el-table-column label="参数名称" prop="paramName" width="200" show-overflow-tooltip />
					<el-table-column label="参数类型" prop="paramType" width="200" show-overflow-tooltip />
					<el-table-column label="是否必填" prop="required" width="200" show-overflow-tooltip>
						<template #default="{ row }">
							<span>{{ row.required ? '是' : '否' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="参数说明" prop="remark" show-overflow-tooltip />
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" text @click="handleEdit(row, 2)">编辑</el-button>
							<el-button type="primary" text @click="handleDelete(row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</section>
		<PreviewDialog ref="previewDialogRef" @refresh="refresh" />
	</div>
</template>

<script setup lang="ts" name="cultureProductsForm">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElNotification, ElMessageBox } from 'element-plus';
import PreviewDialog from './dialog.vue';
import { useMessage } from '/@/hooks/message';
import { useRoute } from 'vue-router';
import { addInterface, updateInterface, getInterfaceDetail, deleteParams } from '/@/api/openPlatform/interface';
let route = useRoute(); // 生成组件唯一id

const formRef = ref<FormInstance>();
const loading = ref(false);
const previewDialogRef = ref();

// 请求方式枚举列表
const requestMethodsList = ref([
	{
		label: 'POST',
		value: 'POST',
	},
	{
		label: 'GET',
		value: 'GET',
	},
]);

const disableBtn = ref(true);
const router = useRouter();

const model = ref({
	id: null,
	interfaceId: null,
	interfaceName: '',
	uri: '',
	requestMethod: '',
	version: '',
	requestParams: [],
	responseParams: [],
});

const rules = reactive<FormRules>({
	interfaceName: [{ required: true, message: '请输入接口名称', trigger: ['blur', 'change'] }],
	uri: [{ required: true, message: '请输入接口路径', trigger: ['blur', 'change'] }],
	requestMethod: [{ required: true, message: '请选择请求方式', trigger: 'change' }],
	version: [{ required: true, message: '请输入接口版本号', trigger: ['blur', 'change'] }],
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
	loading: false,
});
const { tableStyle } = useTable(state);

const handleEdit = (row: any, type: number) => {
	previewDialogRef.value.openDialog(type, row.interfaceId, row);
};
const handleDelete = (row: any) => {
	ElMessageBox.confirm(`是否确定删除 ${row.paramName} 参数？`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		deleteParams(row.id).then((res) => {
			if (res.code == 0) {
				useMessage().success(`删除成功`);
				getDetail(route.query.id as string);
			}
		});
	});
};

const handleAddParams = (type: number) => {
	previewDialogRef.value.openDialog(type, model.value?.interfaceId);
};
// 自动定位到表单报错项
const moveToErr = () => {
	nextTick(() => {
		let isError = document.getElementsByClassName('is-error');
		if (isError.length) {
			isError[0].scrollIntoView({
				block: 'center',
				behavior: 'smooth',
			});
			// 这个当滑动到报错项之后自动获取输入框的焦点，方便用户直接进行输入，延迟 800ms 是因为需要都能到定位成功后在进行获取焦点体验更好一些
			setTimeout(() => {
				if (isError[0].previousElementSibling?.querySelector('input')) {
					isError[0].previousElementSibling.querySelector('input')?.focus();
				}
			}, 800);
		}
	});
};

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid, fields) => {
		if (valid) {
			try {
				const request = route.query.id ? updateInterface : addInterface;
				const { code, msg, data } = await request(model.value);
				if (code === 0) {
					useMessage().success(`${route.query.id ? '修改成功' : '新建成功'}`);
					if (data) {
						router.push({
							path: `/openPlatform/interfaceManage/interfaceList/form`,
							query: {
								id: data,
								type: 'edit',
							},
						});
					}
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				console.log('err', err);
			}
		} else {
			loading.value = false;
			moveToErr();
			console.log('error submit!', fields);
		}
	});
};

// 取消（关闭当前页面）
const handleCancel = () => {
	router.push('/openPlatform/interfaceManage/interfaceList/index');
};

const getDetail = (id: string) => {
	getInterfaceDetail(id)
		.then((res) => {
			const { code, data, msg } = res;
			if (code == 0) {
				model.value = { ...res.data };
			}
		})
		.catch((err) => {});
};

const refresh = () => {
	getDetail(route.query.id as string);
	router.push({
		path: `/openPlatform/interfaceManage/interfaceList/form`,
		query: {
			id: route.query.id,
			type: 'edit',
		},
	});
	// .then(() => {
	// 	window.location.reload();
	// });
};

onMounted(() => {
	if (route.query.id) {
		disableBtn.value = false;
	}
	if (route.query.type === 'edit') {
		getDetail(route.query.id as string);
	}
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
