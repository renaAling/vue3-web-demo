<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar>
				<el-row class="ml-2 mb-4 flex-col" v-for="(item, k) in list" :key="k">
					<div>{{ k + 1 + '.' + item.name }}</div>
					<div class="ml-2 mt-2 relative icon_box">
						<!-- <el-input
							v-if="!editShow"
							placeholder="请输入"
							type="textarea"
							maxlength="500"
							show-word-limit
							rows="8"
							resize="none"
							style="width: 550px"
							clearable
							v-model="item.context"
							:readonly="!editShow"
						/> -->
						<div v-if="!editShow" v-html="item.context" class="w-[550px]"></div>
						<editor v-model:get-html="item.context" v-if="editShow" height="300" width="550"></editor>
						<el-icon size="20" v-if="!editShow" @click="editContent" color="#909399" class="top-[0] cursor-pointer left-[552px]">
							<Edit />
						</el-icon>
					</div>
				</el-row>
				<div class="w-[550px] justify-center flex" v-if="editShow">
					<el-button @click="cancel">取消</el-button>
					<el-button @click="submit" type="primary">保存</el-button>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { getListByGroupCode, updateProtocol } from '/@/api/points/agreement';
import { useMessage, useMessageBox } from '/@/hooks/message';
// 搜索变量
const list = ref([] as any[]);
const editShow = ref(false);
const getByGroupCode = () => {
	getListByGroupCode({ groupCode: 'score_rule' }).then((res) => {
		console.log("aaaa",res.data)
		list.value = res.data;
	});
};
getByGroupCode();
// 提交
const submit = () => {
	updateProtocol(list.value).then((res) => {
		useMessage().success('编辑成功');
		cancel();
	});
};
const cancel = () => {
	editShow.value = false;
	getByGroupCode();
};
const editContent = () => {
	if (!editShow.value) {
		editShow.value = true;
	}
};
</script>
<style lang="scss" scoped>
.icon_box {
	::v-deep {
		.el-icon {
			position: absolute !important;
		}
	}
}
</style>
