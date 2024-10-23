import React from "react";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactEcharts from "echarts-for-react";

const ColBarChart = ({dataColors, valueChart, categoryChart, seriesName}) => {
  const series = seriesName.map((name, index) => ({
    name: name,
    data: valueChart[index],
    type: 'bar',
    barWidth: 40,
    label: {
      show: true,
      position: 'top', // Shows the label on top of the bar
      formatter: function (params) {
        return params.value.toLocaleString('id-ID'); // Format the label value with thousand separator
      },
      textStyle: {
        fontFamily: 'Poppins, sans-serif',  // Set the font family
        fontSize: 10,  // Set the font size
        // fontWeight: 'bold',  // Set the font weight (normal, bold, etc.)
        color: '#000'  // Set the font color
      }
    }
  }));
    var chartBarColors = getChartColorsArray(dataColors);
    var option = {
        color: chartBarColors,
        grid: {
          left: '5%',   
          right: '5%',  
          bottom: '10%', 
          containLabel: true  
        },
        xAxis: {
          type: 'category',
          data: categoryChart,
          axisLabel: {
            interval: 0,
            rotate: 0,
            formatter: function (value, index) {
              return value.toLocaleString("id-ID");
            },
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (value) {
              // Format number with thousand separator (dot)
              return value.toLocaleString('id-ID');
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return `${params.seriesName} di ${params.name}: ${params.value.toLocaleString('id-ID')}`;
          }
        },
        legend: {
          data: seriesName, // Nama-nama seri yang akan ditampilkan di legenda
          bottom: '0%', // Meletakkan legenda di bagian bawah chart
          orient: 'horizontal' // Menyusun legenda secara horizontal
        },
        series: series,
        barCategoryGap: '50%',
        barGap: '10%'
      };

    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "350px" }} option={option} />
      </React.Fragment>
    );
  };

export default ColBarChart;