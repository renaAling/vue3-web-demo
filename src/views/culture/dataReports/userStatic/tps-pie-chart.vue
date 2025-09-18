<template>
	<v-chart class="line" :option="option" />
</template>
<script setup lang="ts" name="log-line-chart">
import VChart from 'vue-echarts';
import { getDeveloperTpsLineChartById } from '/@/api/openPlatform/monitor';
import { use } from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TpsDataItem } from './types';

use([TitleComponent, TooltipComponent, LegendComponent, ToolboxComponent, GridComponent, LineChart, PieChart, CanvasRenderer]);

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
	tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
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
	height: 540px;
}
</style>
