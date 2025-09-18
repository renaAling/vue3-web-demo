<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="title">员工价适用用户管理</div>
			<div class="desc">以下身份视作会员，可享受会员价</div>
			<div>
				<el-checkbox-group v-model="checkList">
					<el-checkbox v-for="(item, index) in codeList" :key="index" :label="item.type" :disabled="item.disabled">{{ item.name }}</el-checkbox>
				</el-checkbox-group>
			</div>
			<div v-if="!isSetEditStatus" class="btn">
				<el-button @click="handleEdit" type="primary">编辑</el-button>
			</div>
			<div v-else class="btn">
				<el-button @click="handleSave" type="primary">确认</el-button>
				<el-button @click="handleCancel" type="info">取消</el-button>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { getCodeList, vipListAll, vipUpdateOrSave } from '/@/api/culture/member/vipUser';
import { useMessage } from '/@/hooks/message';

const checkList = ref<string[]>([]);
const isSetEditStatus = ref<boolean>(false);
const codeList = ref<{ [key: string]: any }[]>([]);

// 监听isSetEditStatus变化来更新codeList中的disabled属性
watch(
	() => isSetEditStatus.value,
	(val) => {
		codeList.value = codeList.value.map((item) => {
			item.disabled = !val;
			return item;
		});
	},
	{ deep: true, immediate: true }
);
const getCOde = async () => {
	try {
		const { code, data, msg } = await getCodeList();
		if (code === 0) {
			if (Array.isArray(data) && data.length > 0) {
				codeList.value = data.map((item) => ({
					...item,
					disabled: true,
				}));
			} else {
				codeList.value = [];
			}
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		codeList.value = [];
		useMessage().error(err.msg);
	}
};

const getList = async () => {
	try {
		const { code, data, msg } = await vipListAll();
		if (code === 0) {
			checkList.value = [];
			if (data && data.length) {
				checkList.value = data.map((item: any) => item.identityType);
			}
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleEdit = () => {
	isSetEditStatus.value = !isSetEditStatus.value;
	if (isSetEditStatus.value) {
		codeList.value = codeList.value.map((item) => {
			item.disabled = false;
			return item;
		});
	}
};

const handleSave = async () => {
	try {
		const { code, msg } = await vipUpdateOrSave({ types: checkList.value });
		if (code === 0) {
			// 使用正确的提示库替代下面这一行
			console.log('操作成功'); // 替换为实际的消息提示逻辑
			useMessage().success('操作成功');
			getList();
			isSetEditStatus.value = false;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleCancel = () => {
	getList();
	isSetEditStatus.value = false;
};

onMounted(() => {
	getCOde();
	getList();
});
</script>
<style scoped lang="scss">
.title {
	font-size: 20px;
	font-weight: 500;
	color: #1d2129;
}
.desc {
	font-size: 14px;
	font-weight: 350;
	color: #4e5969;
	margin-top: 20px;
}
span {
	font-size: 16px;
	color: #767676;
}
.btn {
	margin: 20px 0;
}
</style>
