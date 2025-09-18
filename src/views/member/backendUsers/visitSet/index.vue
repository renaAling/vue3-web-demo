<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<div class="px-10 pt-8">
				<div class="pageTitle">访问设置</div>
				<div class="form">
					<div>
						<!--  -->
						<!-- class="mt-8 border-1 border-black py-8 px-10" -->
						<span>单点登录：</span>
						<!-- <el-checkbox v-model="single" @change="changeSingle" /> -->
						<el-switch v-model="single" class="ml-2" @change="changeSingle" />
						<div class="flex justify-start items-center mt-8">
							<span>会话保持：</span>
							<!-- <el-checkbox v-model="session" @change="changeSession" /> -->
							<el-switch v-model="session" class="ml-2" @change="changeSession" />
							<span style="color: red" class="mx-2">*</span>
							<el-select v-model="sessionTime" placeholder="请选择" style="width: 250px; margin-right: 16px">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
							<el-button type="primary" @click="handleEdit">更新</el-button>
						</div>
					</div>
				</div>
				<div class="flex tip">
					<div class="mr-2">
						<el-icon color="#4077D2" size="20"><WarningFilled /></el-icon>
					</div>
					<div>
						<div>温馨提示：</div>
						<div class="mt-4" style="color: #666666;line-height: 22px;">1、单点登录 ：一次登录，访问所有关联系统，无需重复认证。</div>
						<div style="color: #666666;line-height: 22px;">2、会话保持：设置会话有效期（如15分钟/30分钟），保持登录状态，减少重复登录</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { accountList } from '/@/api/points/manage';
import { useMessageBox, useMessage } from '/@/hooks/message';

let sessionTime = ref(null);
let single = ref(false);
let session = ref(false);
let options = [
	{
		value: '10',
		label: '10min',
	},
	{
		value: '15',
		label: '15min',
	},
	{
		value: '30',
		label: '30min',
	},
	{},
];
const changeSingle = (val: Boolean) => {
	if (val) {
		session.value = false;
	}
};
const changeSession = (val: Boolean) => {
	if (val) {
		single.value = false;
	}
};
const handleEdit = () => {
	if (session.value) {
		if (sessionTime.value) {
			// accountList({ sessionTime: sessionTime.value }).then((res) => {
			//     useMessage().success('更新成功');
			// })
		} else {
			useMessage().warning('请选择会话有效期');
		}
	}
	if (single.value) {
		// accountList({ single: single.value }).then((res) => {
		//     useMessage().success('更新成功');
		// })
	}
};
</script>
<style lang="scss" scoped>
.pageTitle {
	font-family: PingFang SC;
	font-size: 20px;
	font-weight: normal;
	line-height: 28px;
	letter-spacing: 0em;

	/* 正文色/正文色 */
	color: #1a1a1a;
}
.form {
	border: 1px solid #dcdcdc;
	border-radius: 6px;
	padding: 24px 32px 60px 24px;
	margin: 24px 0 32px 0;
}
.tip {
	background-color: rgba(71, 133, 234, 0.08);
	border-radius: 6px;
    padding: 27px 24px;
	.tipTitle {
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: normal;
		line-height: 22px;
		/* 正文色/正文色 */
		color: #1a1a1a;
	}
}
</style>
