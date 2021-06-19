<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import {CanvasRenderer} from 'echarts/renderers'
import {PieChart} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

export default {
  name: "DonutChart",
  components: {
    VChart
  },

  props: {
    title: {
      type: String,
      required: true
    },

    data: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      option: {
        title: {
          text: this.title,
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{d}%"
        },
        legend: {
          orient: "horizontal",
          left: "auto",
          top: 'bottom',
          data: this.data.map(v => v.name)
        },
        series: [
          {
            name: this.title,
            type: "pie",
            radius: ['40%', '70%'],
            center: ["50%", "60%"],
            data: this.data,
            top: 'middle',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    }
  }
}

</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
