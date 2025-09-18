<template>
  <div style="width: 50%; height: 400px">
    <div id="pieDom" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';

// 1. 类型定义
// 图表数据接口
interface ChartData {
	cancel: number;
	done: number;
	waitPay: number;
}

// 组件Props定义
interface Props {
	initialData?: ChartData;
}

// 2. 组件Props配置（带默认值）
const props = withDefaults(defineProps<Props>(), {
	initialData: () => ({
		cancel: 0,
		done: 0,
		waitPay: 0,
	}),
});

const initChart = (data: ChartData) => {
  const chartDom = document.getElementById('pieDom');
  if (!chartDom) return;
  
  const chartData = [
    { value: data.waitPay, name: '待支付' },
    { value: data.cancel, name: '已取消' },
    { value: data.done, name: '已完成' },
  ].filter(item => item.value > 0);

  const myChart = echarts.init(chartDom);
  const options = {
    title: {
      text: '订单状态分布',
      textStyle: {
				fontSize: 16,
			},
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      top: '8%',
      left: 'center',
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false,
        },
        data: chartData,
      },
    ],
  };
  
  myChart.setOption(options);
  
  const resizeHandler = () => myChart.resize();
  window.addEventListener('resize', resizeHandler);
  
  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    myChart.dispose();
  });
};

watch(
	() => props.initialData,
	(newData) => {
		if (newData) {
			initChart(newData);
		}
	},
	{ immediate: true, deep: true }
);
</script>