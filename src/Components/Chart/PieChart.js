import React from "react";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactEcharts from "echarts-for-react";

const PieChartNew = ({ dataColors, dataChart = [], categoryName = [], percentOnly = false, legendHorizontal=false, showLegend=true, heightChart="350px", lineShow=true, pieChart=true, fitContent=false }) => {

    const values = dataChart.length ? dataChart : [];
    const names = categoryName.length ? categoryName : [];

    const mappedData = names.map((name, index) => ({
        name: names[index],
        value: values[index]
      }));

    var chartPieColors = getChartColorsArray(dataColors);
    var option = {
      tooltip: {
        trigger: "item",
        formatter: function (params) {

          const value = parseFloat(params.value).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
          // Konversi persentase ke float dan format dengan 2 digit desimal
          const percent = parseFloat(params.percent).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
          // Gabungkan nilai dengan persentase dalam format yang diinginkan
          return `${value} (${percent}%)`;      
          },
          z: 999, // Atur z-index tooltip (0-1000)
          zlevel: 1, // Atur zlevel (lapisan rendering; bisa di atas layer lain)        
      },
      legend: {
        show: showLegend,
        orient: legendHorizontal ? "horizontal" : "vertical",
        left: legendHorizontal ? "center" : "left", // Center legend for horizontal, left for vertical
        bottom: legendHorizontal ? "0" : "auto",        
        textStyle: {
          //The style of the legend text
          color: "#858d98",
        },
        // formatter : function (value) { 
        //   if (value.length > 0) {
        //     const lines = [];
        //     let currentLine = "";
        //     const maxLineLength = 40;
        //     value.split(" ").forEach((word) => {
        //       if ((currentLine + word).length > maxLineLength) {
        //         lines.push(currentLine);
        //         currentLine = word;
        //       } else {
        //         currentLine += (currentLine ? " " : "") + word;
        //       }
        //     });
        //     if (currentLine) {
        //       lines.push(currentLine);
        //     }
        //     return lines.join("\n"); // Menambahkan line break
        //   }
        //   return value;
        // }
      },
      label: {
        // formatter: `{c} ({d})%`        
        formatter: function (params) {
          if (percentOnly){
            const percent = params.percent.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return `${percent}%`;
          }else{
            const value = params.value.toLocaleString('id-ID'); // Indonesian locale formatting
            // Format the percentage with a dot for the decimal point
            const percent = params.percent.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return `${value} (${percent}%)`;
          }
            // Format the number with a dot as the thousands separator 
          },                    
      },
      color: chartPieColors,
      series: [
        {
          name: "",
          type: "pie",
          radius: pieChart ? "50%" : fitContent ? ['30%', '50%'] : ['40%', '70%'],         
          data: mappedData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            rotate: percentOnly ? 45: 0, // Atau coba 'true' untuk otomatis, atau angka lain untuk derajat rotasi            
            overflow: "break", // Menangani teks agar tidak terpotong
            position: lineShow ? "outside":"inside"
          },
          // labelLine: {
          //   show: lineShow,           // Menampilkan garis penunjuk
          //   length: 0,           // Panjang garis pertama
          //   length2: 5,          // Panjang garis kedua
          //   smooth: false,        // Garis penunjuk tidak melengkung
          //   lineStyle: {
          //     width: 2,           // Ketebalan garis penunjuk
          //     type: 'solid'       // Tipe garis: solid, dashed, dll
          //   }
          // }
        },
      ],
      textStyle: {
        fontFamily: "Poppins, sans-serif",
      },
    }; 
  
    return (
      <React.Fragment>
        <ReactEcharts id="dataPerbandinganSasaranDanStunting" style={{ height: heightChart  }} option={option} />
      </React.Fragment>
    );
  };

export default PieChartNew;