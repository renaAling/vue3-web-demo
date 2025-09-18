<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" title="核销订单" draggable v-model="visible">
			<div class="search-box">
				<el-form :model="formData" label-width="100px" ref="dataFormRef" :rules="rules">
					<el-form-item label="核销点：" prop="realPickupCode">
						<el-select v-model="formData.realPickupCode" placeholder="请选择核销点">
								<el-option v-for="(item, index) in pickupSites" :key="index" :label="item.name" :value="item.code"></el-option>
							</el-select>
					</el-form-item>
					<el-form-item label="核销码：" prop="verifyCode">
						<el-input  placeholder="请输入核销码" maxlength="20" v-model="formData.verifyCode" clearable></el-input>
					</el-form-item>
				</el-form>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialog()">取消</el-button>
					<el-button @click="onSubmit" type="primary">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="mall-order-writeOff" setup>
import { useMessage } from '/@/hooks/message';
import { merchantOrderVerification, merchantPickupSiteList } from '/@/api/culture/cultureOrder';



// 定义刷新表格emit
const emit = defineEmits(['onRefresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);

const formData = ref({
	realPickupCode: null,
	verifyCode: '',
});
const rules = ref({
	realPickupCode: [
		{ required: true, message: '请选择核销点', trigger: 'change' }
	],
	verifyCode: [
		{ required: true, message: '请输入核销码', trigger: 'blur' }
	]
})
interface PickupSite {
	name: string;
	code: string;
	// add other properties if needed
}
const pickupSites = ref<PickupSite[]>([]);

// 打开弹框
const show = async () => {
	// 获取核销点数据
	visible.value = true;
	getrealPickupCodeList();
};
const getrealPickupCodeList = async()=> {
	const {code, data} = await merchantPickupSiteList({
		current: 1,
		size: 999
	});
	pickupSites.value = data.records;
}
// 关闭弹框
const closeDialog = () => {
	visible.value = false;
};

// 提交
const onSubmit = async () => {
	try { 
		await merchantOrderVerification(formData.value);
		useMessage().success('核销成功');
			emit('onRefresh');
			closeDialog();
	} catch (err: any) {
		useMessage().error(err.msg);
	}

};

// 暴露变量
defineExpose({
	show,
});
</script>

