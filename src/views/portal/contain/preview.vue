<template>
	<div class="preview-container">
		<el-dialog :close-on-click-modal="false" title="预览" draggable v-model="visible" :class="currentChoose==='pc'?'pc':currentChoose==='phone'?'phone':'pad'">
			<div class="flex flex-row flex-start" @click="chooseItem">
				<div class="flex items-center mr-6 cursor-pointer" data-item="pc" :class="currentChoose==='pc'?'active':''"><img src="../assets/img/pc.png">pc</div>
				<div class="flex items-center mr-6 cursor-pointer" data-item="phone" :class="currentChoose==='phone'?'active':''"><img src="../assets/img/phone.png">手机</div>
				<div class="flex items-center mr-6 cursor-pointer" data-item="pad" :class="currentChoose==='pad'?'active':''"> <img src="../assets/img/pad.png">pad</div>
			</div>
			<div class="content mt-10 p-5" :class="currentChoose==='pc'?'pc':currentChoose==='phone'?'phone':'pad'">
				<div class="detail" v-html="containString"></div>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="portal-entrance-form" setup>
// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const visible = ref(false);
const containString = ref('');
const currentChoose = ref('pc');
// 打开弹窗
const openDialog = async (contain: string) => {
	visible.value = true;
	containString.value = contain;
};
const chooseItem = (e: any) => {
	currentChoose.value = e.target.dataset.item;
};
const close = () => {
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
	height: 800px;
}
.preview-container {
	img {
		width: 18px;
		height: 18px;
	}
	.active {
		font-size: 20px;
		font-weight: 600;
		img {
			width: 20px;
			height: 20px;
		}
	}
}
.content {
	margin: 10px auto;
	overflow-y: auto;
	// border: 8px solid #000;
	// border-radius: 8px;
	padding: 60px;
}
.pc {
	width: 700px;
	height: 393px;
	background: (url(../assets/img/PCc.png)) no-repeat;
	background-size: 100% 100%;
	padding: 55px 60px;
	.detail {
		font-size: 14px;
		height: 393px;
		overflow-y: auto;
	}
}
.phone {
	width: 320px;
	height: 568px;
	padding: 66px 50px;
	background: (url(../assets/img/Mobile.png)) no-repeat;
	background-size: 100% 100%;
	.detail {
		font-size: 12px;
		height: 414px;
		overflow-y: auto;
	}
}
.pad {
	width: 600px;
	height: 428px;
	padding: 66px 76px;
	background: (url(../assets/img/iPad.png)) no-repeat;
	background-size: 100% 100%;	
	.detail {
		font-size: 14px;
		height: 270px;
		overflow-y: auto;
	}
}
</style>