<template>
	<div ref="chartRef" style="width: 100%; height: 500px"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';

// 1. 类型定义
// 图表数据接口
interface ChartData {
	date: number[];
	consumeNum: number[];
	totalAmount: number[];
}

// 组件Props定义
interface Props {
	initialData?: ChartData;
}

// 2. 组件Props配置（带默认值）
const props = withDefaults(defineProps<Props>(), {
	initialData: () => ({
		date: [],
		consumeNum: [],
		totalAmount: [],
	}),
});

// 3. 响应式数据
const chartRef = ref<HTMLElement | null>(null); // 图表DOM引用
const chartInstance = ref<ECharts | null>(null); // ECharts实例
const chartData = ref<ChartData>(props.initialData); // 图表数据

// 4. 获取图表配置选项
const getChartOptions = (): EChartsOption => {
	return {
		title: {
			text: '消费频次/金额统计',
			textStyle: {
				fontSize: 16,
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999',
				},
			},
		},
		legend: {
			data: ['金额', '消费频次'],
		},
		xAxis: [
			{
				type: 'category',
				data: chartData.value.date,
				axisPointer: {
					type: 'shadow',
				},
			},
		],
		yAxis: [
			{
				name: '消费频次',
				type: 'value',
				axisLabel: {
					formatter: '{value} 次',
				},
			},
			{
				name: '金额',
				type: 'value',
				axisLabel: {
					formatter: '{value} 元',
				},
			},
		],
		series: [
			{
				name: '消费频次',
				type: 'bar',
				barWidth: '20',
				tooltip: {
					valueFormatter: function (value) {
						return value + ' 次';
					},
				},
				data: chartData.value.consumeNum,
			},
			{
				name: '金额',
				type: 'line',
				yAxisIndex: 1,
				tooltip: {
					valueFormatter: function (value) {
						return value + ' 元';
					},
				},
				smooth: true,
				data: chartData.value.totalAmount,
			},
		],
	};
};

// 5. 初始化图表
const initChart = () => {
	if (!chartRef.value) return;

	// 销毁之前的实例（如果存在）
	if (chartInstance.value) {
		chartInstance.value.dispose();
	}

	// 创建新的ECharts实例
	chartInstance.value = markRaw(echarts.init(chartRef.value));
	// 设置图表选项
	chartInstance.value.setOption(getChartOptions());
};

// 7. 更新图表数据
const updateChart = () => {
	if (chartInstance.value) {
		chartInstance.value.setOption(getChartOptions());
	}
};

// 8. 处理窗口大小变化
const handleResize = () => {
	chartInstance.value?.resize();
};

// 9. 生命周期钩子
onMounted(async () => {
	initChart();
	window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
	// 清理事件监听器
	window.removeEventListener('resize', handleResize);
	// 销毁图表实例
	chartInstance.value?.dispose();
});

// 10. 监听数据变化
watch(
	() => props.initialData,
	(newData) => {
		if (newData.date.length > 0) {
			// 确保数据非空
			chartData.value = newData; // 更新 chartData
			if (!chartInstance.value) {
				initChart(); // 如果图表未初始化，先初始化
			} else {
				updateChart(); // 如果已初始化，直接更新数据
			}
		}
	},
	{ immediate: true, deep: true }
);
</script>
