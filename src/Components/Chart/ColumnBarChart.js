import React from "react";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactEcharts from "echarts-for-react";

const ColBarChart = ({dataTotal=10, dataColors, valueChart=[], categoryChart=[], seriesName=[]}) => {
  const limit = dataTotal;  // Misal kita ingin menampilkan hanya 10 data

  // Periksa apakah limit lebih besar dari total data
  // Tentukan `startIndex` dan `endIndex` berdasarkan limit
  const startIndex = 0;  // Mulai dari indeks pertama
  const endIndex = limit - 1
  const series = seriesName.map((name, index) => ({
    name: name,
    data: valueChart[index],
    type: 'bar',
    barWidth: 30,
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
          bottom: '20%', 
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
          bottom: 0,
          top:10, // Meletakkan legenda di bagian bawah chart
          orient: 'horizontal', // Menyusun legenda secara horizontal
          left: 'center' // Menempatkan legend di tengah
        },
        series: series,
        barCategoryGap: '50%',
        barGap: '10%',
        dataZoom: [
          {
            type: 'slider', // Jenis slider untuk scroll
            show: true,
          startValue: startIndex,
          endValue: endIndex,
          bottom: 20, // Memberikan jarak antara slider dan grid bawah
          },
          {type : 'inside'}
        ]
      , 
      };

    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "350px" }} option={option} />
      </React.Fragment>
    );
  };

export default ColBarChart;