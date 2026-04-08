import React from "react";
import ReactEcharts from "echarts-for-react";

const PyramidChart = ({firstValue=[], secondValue=[], category=[]}) => {
  const incomeData = [320, 302, 341, 374, 390, 450, 420];
  const expensesData = [120, 132, 101, 134, 190, 230, 210];

  // Mengonversi nilai Income menjadi negatif
  const negativeIncomeData = firstValue.map(value => -Math.abs(value));

  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params) {
        return `${params[0]?.name}<br/>${params[0]?.seriesName}: ${(Math.abs(params[0]?.value)).toLocaleString("id-ID")}<br/>${params[1]?.seriesName}: ${(Math.abs(params[1]?.value)).toLocaleString("id-ID")}<br/>Total: ${((Math.abs(params[1]?.value))+(Math.abs(params[0]?.value))).toLocaleString("id-ID")}`;
      },
    },
    legend: {        
      data: ['Laki-Laki', 'Perempuan'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            return (Math.abs(value)).toLocaleString("id-ID");
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: category,
      },
    ],
    series: [
      {
        name: 'Laki-Laki',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true,
          formatter: function (param) {
            return (Math.abs(param.value)).toLocaleString("id-ID");
          },
        },
        emphasis: {
          focus: 'series',
        },
        data: negativeIncomeData, // Menggunakan data Income yang sudah diubah menjadi negatif
        itemStyle: {
            borderRadius: [10, 0, 0, 10],      
            color:"#2DAED4"
        },
      },
      {
        name: 'Perempuan',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true,
          formatter: function (param) {
            return (Math.abs(param.value)).toLocaleString("id-ID");
          },
        },
        emphasis: {
          focus: 'series',
        },
        data: secondValue, // Data Expenses tetap positif
        itemStyle: {
            borderRadius: [0, 10, 10, 0],   
            color:"#FFA0BE"
        },
      },
    ],
  };

  return <ReactEcharts option={options} style={{ height: "600px", width: "100%" }} />;
};

export default PyramidChart;