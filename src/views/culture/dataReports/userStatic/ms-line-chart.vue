<template>
	<v-chart class="line" :option="option" />
</template>
<script setup lang="ts" name="log-line-chart">
import VChart from 'vue-echarts';
import { getDeveloperMsLineChartById } from '/@/api/openPlatform/monitor';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { MsDataItem } from './types';

use([TitleComponent, TooltipComponent, LegendComponent, ToolboxComponent, GridComponent, LineChart, CanvasRenderer]);

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
	title: {
    text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
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
// 	getDeveloperMsLineChartById({ appId: props.appId, interfaceId: props.interfaceId }).then((res) => {
// 		option.title.subtext = `最大值：${res.data.maxValue}ms 均值${res.data.avgValue}ms`;
// 		option.xAxis.data = res.data.charts && res.data.charts.length > 0 ? res.data.charts.map((item: MsDataItem) => item.timeStr) : [];
// 		option.series[0].data = res.data.charts && res.data.charts.length > 0 ? res.data.charts.map((item: MsDataItem) => item.todayConsumedTime) : [];
// 		option.series[1].data =
// 			res.data.charts && res.data.charts.length > 0 ? res.data.charts.map((item: MsDataItem) => item.yesterdayConsumedTime) : [];
// 	});
// };

onMounted(() => {
	// fetchData();
});
</script>
<style lang="scss" scoped>
.line {
	width: 540px;
	height: 540px;
}
</style>
