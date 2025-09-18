<template>
	<div style="width: 100%; height: 500px">
		<div ref="mapContainer" style="width: 100%; height: 100%"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as echarts from 'echarts';
import china from '/@/utils/china.json';

interface ChartData {
	name: string;
	value: number;
}

interface Props {
	initialData?: ChartData[];
}

const props = withDefaults(defineProps<Props>(), {
	initialData: () => [],
  // dataList.value = [
	// 	{ name: '北京市', value: 290 },
	// 	{ name: '天津市', value: 320 },
	// 	{ name: '河北省', value: 240 },
	// 	{ name: '山西省', value: 520 },
	// 	{ name: '内蒙古自治区', value: 120 },
	// 	{ name: '辽宁省', value: 210 },
	// 	{ name: '吉林省', value: 620 },
	// 	{ name: '黑龙江省', value: 20 },
	// 	{ name: '上海市', value: 220 },
	// 	{ name: '江苏省', value: 820 },
	// 	{ name: '浙江省', value: 320 },
	// 	{ name: '安徽省', value: 520 },
	// 	{ name: '福建省', value: 120 },
	// 	{ name: '江西省', value: 620 },
	// 	{ name: '山东省', value: 920 },
	// 	{ name: '河南省', value: 220 },
	// 	{ name: '湖北省', value: 720 },
	// 	{ name: '湖南省', value: 210 },
	// 	{ name: '广东省', value: 20 },
	// 	{ name: '广西壮族自治区', value: 20 },
	// 	{ name: '海南省', value: 240 },
	// 	{ name: '重庆市', value: 20 },
	// 	{ name: '四川省', value: 240 },
	// 	{ name: '贵州省', value: 420 },
	// 	{ name: '云南省', value: 320 },
	// 	{ name: '西藏自治区', value: 20 },
	// 	{ name: '陕西省', value: 240 },
	// 	{ name: '甘肃省', value: 920 },
	// 	{ name: '青海省', value: 720 },
	// 	{ name: '宁夏回族自治区', value: 120 },
	// 	{ name: '新疆维吾尔自治区', value: 420 },
	// 	{ name: '台湾省', value: 230 },
	// 	{ name: '香港特别行政区', value: 420 },
	// 	{ name: '澳门特别行政区', value: 210 },
	// ];
});

const mapContainer = ref<HTMLElement | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);
const chartData = ref<ChartData[]>(props.initialData);

// 初始化地图
const initMap = () => {
	if (!mapContainer.value) return;

	// 销毁旧实例
	if (chartInstance.value) {
		chartInstance.value.dispose();
	}

	chartInstance.value = echarts.init(mapContainer.value);
	echarts.registerMap('china', china);
	updateChart();
};

// 更新图表数据
const updateChart = () => {
	if (!chartInstance.value) return;

	const options = {
		title: {
			text: '用户地域分布',
			textStyle: {
				fontSize: 16,
			},
		},
		tooltip: {
			trigger: 'item',
			formatter: function (params: any) {
				const value = isNaN(params.value) || params.value === undefined ? 0 : params.value;
				return `${params.name}<br/>${value} (累计用户数)`;
			},
		},
		toolbox: {
			show: true,
			orient: 'vertical',
			left: 'right',
			top: 'center',
		},
		visualMap: {
			min: 0,
			realtime: false,
			calculable: true,
			inRange: {
				// 调整为蓝绿色渐变 (从浅蓝绿到深蓝绿)
				color: ['#a8edea', '#00b4d8', '#0077b6'],
			},
		},
		series: [
			{
				name: '中国',
				type: 'map',
				map: 'china',
				label: {
					show: false,
				},
				data: chartData.value,
				itemStyle: {
					emphasis: {
						areaColor: '#90e0ef', // 浅蓝色
						borderColor: '#48cae4', // 边框颜色
						borderWidth: 1,
					},
				},
			},
		],
	};

	chartInstance.value.setOption(options);
};

// 窗口缩放处理
const handleResize = () => {
	chartInstance.value?.resize();
};

// 监听数据变化
watch(
	() => props.initialData,
	(newData) => {
		chartData.value = newData;
		if (chartInstance.value) {
			updateChart();
		} else {
			initMap();
		}
	},
	{ deep: true, immediate: true }
);

onMounted(() => {
	nextTick(() => {
		initMap();
		window.addEventListener('resize', handleResize);
	});
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', handleResize);
	chartInstance.value?.dispose();
});
</script>
