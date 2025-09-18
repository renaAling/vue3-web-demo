<template>
	<v-chart class="line" :option="option" />
</template>
<script setup lang="ts" name="log-line-chart">
import VChart from 'vue-echarts';
import { getDeveloperTpsLineChartById } from '/@/api/openPlatform/monitor';
import { use } from 'echarts/core';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TpsDataItem } from './types';

use([TitleComponent, TooltipComponent, LegendComponent, ToolboxComponent, GridComponent, LineChart, PieChart, BarChart, CanvasRenderer]);

const props = defineProps({
	appId: {
		type: String,
		required: true,
	},
	interfaceId: {
		type: String,
		required: true,
	},
});

const option = reactive({
	  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
});

watch(
	() => [props.appId, props.interfaceId],
	() => {
		// fetchData();
	}
);

// const fetchData = () => {
// 	getDeveloperTpsLineChartById({
// 		appId: props.appId,
// 		interfaceId: props.interfaceId,
// 	}).then((res) => {
// 		option.title.subtext = `最大值：${res.data.maxValue}tps 均值${res.data.avgValue}tps`;
// 		option.xAxis.data = res.data.charts && res.data.charts.length > 0 ? res.data.charts.map((item: TpsDataItem) => item.timeStr) : [];
// 		option.series[0].data = res.data.charts && res.data.charts.length > 0 ? res.data.charts.map((item: TpsDataItem) => item.todayCounts) : [];
// 		option.series[1].data = res.data.charts && res.data.charts.length > 0 ? res.data.charts.map((item: TpsDataItem) => item.yesterdayCounts) : [];
// 	});
// };

onMounted(() => {
	// fetchData();
});
</script>
<style lang="scss" scoped>
.line {
	width: 540px;
	height: 560px;
}
</style>
