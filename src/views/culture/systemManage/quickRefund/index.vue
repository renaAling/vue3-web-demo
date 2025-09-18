<template>
	<div class="container">
		<div class="title">极速退款配置</div>
		<div class="desc">极速退款配置说明：极速退款开启后，对于未出库的订单产生的售后申请将无需人工审核，由系统自动审核通过，清谨慎开启。</div>
		<div>
			当前状态：
			<span v-if="!isSetEditStatus">
				{{ status ? '开启' : '关闭' }}
			</span>
			<el-radio-group v-else v-model="status">
				<el-radio :label="true">开启</el-radio>
				<el-radio :label="false">关闭</el-radio>
			</el-radio-group>
		</div>
		<div v-if="!isSetEditStatus">
			<el-button @click="handleEditSwitch" type="primary">编辑</el-button>
		</div>
		<div v-else>
			<el-button @click="handleSave" type="primary">确认</el-button>
			<el-button @click="handleCancel" type="info">取消</el-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';
import { quickRefund, quickRefundConfig } from '/@/api/culture/systemMange';
const status = ref(false);
const mainId = ref(null);
// 是否设置编辑状态，标识
const isSetEditStatus = ref(false);

// 点击编辑展示单选组
const handleEditSwitch = () => {
	isSetEditStatus.value = !isSetEditStatus.value;
};

const handleCancel = () => {
	isSetEditStatus.value = false;
};

// 获取快速退款状态
const getQuickRefundConfig = () => {
	quickRefundConfig()
		.then((res) => {
			if (res.code === 0) {
				mainId.value = res.data.id;
				status.value = res.data.status;
			}
			console.log('res', res);
		})
		.catch((err) => {});
};

// 保存
const handleSave = () => {
	useMessageBox()
		.confirm(`请确认是否${status.value ? '开启' : '关闭'}极速退款`, '确认')
		.then(async () => {
			try {
				let params = {
					id: mainId.value,
					status: status.value,
				};
				const { code, msg } = await quickRefund(params);
				// 保存
				if (code === 0) {
					useMessage().success('修改成功');
					isSetEditStatus.value = !isSetEditStatus.value;
					getQuickRefundConfig();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		})
		.catch(() => {});
};

onMounted(() => {
	getQuickRefundConfig();
});
</script>

<style lang="scss" scoped>
.container {
	margin: 18px 20px;
	padding: 12px 20px;
	background-color: #fff;

	> div {
		margin-bottom: 16px;
	}
	.title {
		font-size: 20px;
		font-weight: 500;
		color: #1d2129;
	}
	.desc {
		font-size: 14px;
		font-weight: 350;
		color: #4e5969;
	}
	span {
		font-size: 16px;
		color: #767676;
	}
}
</style>
