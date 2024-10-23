import React from "react";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts/core";

const VerticalBarChart = ({ dataColors, valueChart, categoryChart, emphasis=false, trillion=false, rotate=false, background=false, breakWord=false }) => {

    var chartBarColors = getChartColorsArray(dataColors);
    var option = {
      color: chartBarColors,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: categoryChart,
          axisLabel: {
            interval: 0,
            
            rotate: rotate ? 30 : 0,

            // formatter: function (value, index) {
            //   if(emphasis){
            //     if (value.length > 10) {
            //       return value.substring(0, 10) + "...";
            //     }
            //     return value;
            //   }else{
            //     return value
            //   }              
            // },
            formatter: breakWord
            ? function (value) {
                if (value.length > 10) {
                  const lines = [];
                  let currentLine = "";
                  const maxLineLength = 10;
                  value.split(" ").forEach((word) => {
                    if ((currentLine + word).length > maxLineLength) {
                      lines.push(currentLine);
                      currentLine = word;
                    } else {
                      currentLine += (currentLine ? " " : "") + word;
                    }
                  });
                  if (currentLine) {
                    lines.push(currentLine);
                  }
                  return lines.join("\n"); // Menambahkan line break
                }
                return value;
              }
            : function (value) {
                return value;
              },
            
          },
          tooltip: {
            show: background,
            formatter: function (params) {
              return params.name; // Menampilkan label lengkap saat dihover
            },
          },
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          show: background ? false : true,
          axisLabel: {
            formatter: function (value) {
              if (trillion) {
                return `${(value / 1000000000000).toLocaleString("id-ID")} T`;
              } else {
                return value.toLocaleString("id-ID");
              }
            },
          },
          max: background ? 546 : undefined,
        },        
      ],
      series: [
        {
          name: "",
          type: "bar",
          barWidth: "60%",
          data: valueChart,
          showBackground: background,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
            borderRadius: [10, 10, 0, 0]
          },
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              // Menggunakan toLocaleString untuk format angka
              if(trillion) {
                return `${(params.value/1000000000000).toLocaleString("id-ID")} T`;
              }else{
                return params.value.toLocaleString("id-ID")
              }
              
            },
            textStyle: {
              fontFamily: 'Poppins, sans-serif',  // Set the font family
              fontSize: 12,  // Set the font size
              // fontWeight: 'bold',  // Set the font weight (normal, bold, etc.)
              color: '#000'  // Set the font color
            }
          },
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: function (params) {
              return option.color[params.dataIndex % option.color.length];
            },
          },
        },
      ],
    };

    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "350px" }} option={option} />
      </React.Fragment>
    );
  };

export default VerticalBarChart;