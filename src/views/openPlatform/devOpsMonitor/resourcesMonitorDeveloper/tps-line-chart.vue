<template>
	<v-chart class="line" :option="option" />
</template>
<script setup lang="ts" name="log-line-chart">
import VChart from 'vue-echarts';
import { getDeveloperTpsLineChartById } from '/@/api/openPlatform/monitor';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TpsDataItem } from './types';

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
	// 设置图表标题
	title: {
		text: '总吞吐量',
		subtext: '',
	},
	// 设置提示框（tooltip）的触发方式
	tooltip: {
		trigger: 'axis',
	},
	// 设置图例组件
	legend: {
		data: ['今日吞吐量', '昨日吞吐量'],
	},
	// 设置图表的网格属性，包括边距和是否包含标签
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true,
	},
	// 设置工具箱的功能，这里启用了保存为图片的功能
	toolbox: {
		feature: {
			saveAsImage: {},
		},
	},
	// 设置x轴的类型为类目轴，关闭边界空白，并初始化数据为空数组
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: [],
	},
	// 设置y轴的类型为数值轴
	yAxis: {
		type: 'value',
		axisLabel: {
			formatter: '{value}tps',
		},
	},
	series: [
		{
			name: '今日吞吐量',
			type: 'line',
			stack: 'Total',
			data: [],
			// 设置第一个数据序列，名称为'今日吞吐量'，类型为折线图，堆叠名为'Total'，数据为空数组
		},
		{
			name: '昨日吞吐量',
			type: 'line',
			stack: 'x',
			data: [],
			itemStyle: {
				color: '#e08743',
			},
			// 设置第二个数据序列，名称为'昨日吞吐量'，类型为折线图，堆叠名为'x'，数据为空数组，并自定义颜色
		},
	],
});

watch(
	() => [props.appId, props.interfaceId],
	() => {
		fetchData();
	}
);

const fetchData = () => {
	getDeveloperTpsLineChartById({
		appId: props.appId,
		interfaceId: props.interfaceId,
	}).then((res) => {
		option.title.subtext = `最大值：${res.data.maxValue}tps 均值${res.data.avgValue}tps`;
		option.xAxis.data = res.data.charts && res.data.charts.length > 0 ? res.data.charts.map((item: TpsDataItem) => item.timeStr) : [];
		option.series[0].data = res.data.charts && res.data.charts.length > 0 ? res.data.charts.map((item: TpsDataItem) => item.todayCounts) : [];
		option.series[1].data = res.data.charts && res.data.charts.length > 0 ? res.data.charts.map((item: TpsDataItem) => item.yesterdayCounts) : [];
	});
};

onMounted(() => {
	fetchData();
});
</script>
<style lang="scss" scoped>
.line {
	width: 640px;
	height: 460px;
}
</style>
