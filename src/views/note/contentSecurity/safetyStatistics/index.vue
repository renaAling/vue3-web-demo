<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :model="queryForm" ref="queryRef" :inline="true">
					<el-form-item label="选择时间" prop="areaCode">
						<el-date-picker
							v-model="daterangeTime"
							@change="changeTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
				</el-form>
			</el-row>
			<div class="flex">
				<prePage :initialData="preData"></prePage>
				<listPage :initialData="preData"></listPage>
			</div>
			<div class="flex">
				<linePage :initialData="lineData"></linePage>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { getRiskLogCountApi, getRiskLogSubwayApi, getRiskListApi } from '/@/api/note/noteInfo';

const prePage = defineAsyncComponent(() => import('./components/prePage.vue'));
const listPage = defineAsyncComponent(() => import('./components/listPage.vue'));
const linePage = defineAsyncComponent(() => import('./components/linePage.vue'));
const queryForm = reactive({
	startTime: '',
	endTime: '',
});
const preData = reactive({
	labels: [],
	values: [],
	riskCount: 0,
  ratios:[]

});
const lineData = reactive({
	labels: [],
	values: [],
});
const daterangeTime = ref();
const changeTime = (val: any) => {
	if (val) {
		queryForm.startTime = `${val[0]} 00:00:00`;
		queryForm.endTime = `${val[1]} 23:59:59`;
	} else {
		queryForm.startTime = '';
		queryForm.endTime = '';
	}
	init();
};

const init = () => {
	try {
		getRiskLogCountApi(queryForm).then((res) => {
			preData.riskCount = res.data;
		});
		getRiskLogSubwayApi(queryForm).then((res) => {
			lineData.labels = res.data.map((item: any) => item.subwayName);
			lineData.values = res.data.map((item: any) => item.riskCount);
		});
		getRiskListApi(queryForm).then((res) => {
			preData.labels = res.data.map((item: any) => item.phone);
			preData.values = res.data.map((item: any) => item.riskCount);
      preData.ratios=res.data.map((item: any) => item.ratio);
		});
	} catch (error) {
		console.log(error);
	}
};

onMounted(() => {
	init();
});
</script>
<style lang="scss" scoped></style>
