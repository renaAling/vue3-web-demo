<template>
  <div style="width: 50%; height: 300px;">
    <span class="font-bold text-[18px] text-[#333]">达人</span>
    <div id="pieDom" style="width: 100%; height: 300px;"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

// 图表数据接口
interface ChartData {
  labels: string[];
  values: number[];
  riskCount: number;
  ratios: number[];

}

// 组件Props定义
interface Props {
  initialData?: ChartData;
}

// 组件Props配置（带默认值）
const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({
    ratios: [],
    labels: [],
    values: [],
    riskCount: 0,
  }),
});

const initChart = (data: ChartData) => {
  const chartDom = document.getElementById('pieDom');
  if (!chartDom) return;
  const myChart = echarts.init(chartDom);
  const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
  const options = {
    title: {
      text: '风险数量',
      subtext: `${data.riskCount}`,
      left: '26%',
      top: '30%',
      textStyle: {
        fontSize: 16,
        color: '#666'
      },
      subtextStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 'right',
    //   top: '15%',
    //     itemWidth: 14,  
    //   itemHeight: 14,
    //   data: data.labels.map((label) => {
    //     return label;
    //   }),
    //   formatter: function(name:string,index:any) {
    //     const value:any = data.values.find((val, idx) => data.labels[idx] === name);
    //     const ratio:any = data.ratios.find((val, idx) => data.labels[idx] === name);
    //     return `${name}| ${ratio}% ${value}`;
    //   }
    // },
    // legend: {
    //   orient: 'vertical',
    //   right: 10,
    //   top: '15%',
    //   itemWidth: 0,
    //   itemHeight: 0,
    //   textStyle: {
    //     rich: {
    //       dot: {                 // 手动画圆点
    //         width: 10,
    //         height: 10,
    //         borderRadius: 5,
    //         // 背景色由 formatter 动态替换
    //         backgroundColor: 'green'
    //       },
    //       name: {
    //         width: 90,           // 足够放 5~6 个汉字
    //         fontSize: 14,
    //         color: '#333',
    //         overflow: 'truncate',
    //         ellipsis: '…'
    //       },
    //       ratio: {
    //         width: 50,
    //         fontSize: 14,
    //         color: '#666',
    //         align: 'right'
    //       },
    //       value: {
    //         width: 40,
    //         fontSize: 14,
    //         color: '#333',
    //         align: 'right'
    //       }
    //     }
    //   },
    //   formatter: (name: string) => {
    //     const idx = data.labels.indexOf(name);
    //     const ratio = data.ratios[idx];
    //     const value = data.values[idx];
    //     return `{name|${name}} {ratio|${ratio}%} {value|${value}}`;
    //   }
    // },
    legend: {
      orient: 'vertical',
      right: 10,
      top: '15%',
      itemWidth: 14,
      itemHeight: 14,
      textStyle: {
        rich: {
          dot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: (params: any) => {
              // 动态设置小圆点的颜色
              const idx = data.labels.indexOf(params.name);
              return colorList[idx % colorList.length];
            }
          },
          name: {
            width: 180, // 稍微增加宽度以确保有足够的空间显示省略号
            fontSize: 14,
            color: '#333',
            overflow: 'truncate',
            ellipsis: '…',
          },
          ratio: {
            width: 50,
            fontSize: 14,
            color: '#666',
            align: 'right'
          },
          value: {
            width: 40,
            fontSize: 14,
            color: '#333',
            align: 'right'
          }
        }
      },
      formatter: (name: string) => {
        const idx = data.labels.indexOf(name);
        const ratio = data.ratios[idx];
        const value = data.values[idx];
        // 如果名称超长，可以在这里进行截断处理
        let displayName = name;
        if (name.length > 20) { // 假设10个字符为超长
          displayName = name.substring(0, 20) + '…';
        }
        return `{name|${displayName}} {ratio|${ratio}%} {value|${value}}`;
      }
    },
    series: [
      {
        name: '风险名称',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['30%', '40%'], // 饼图居左，给右侧图例留空间
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
        data: data.values.map((value, index) => ({
          value: value,
          name: `${data.labels[index]}`
        })),
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

onMounted(() => {
  initChart(props.initialData);
});
</script>