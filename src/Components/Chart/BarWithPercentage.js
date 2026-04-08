import React from "react";
import getChartColorsArray from "../Common/ChartsDynamicColor";
import ReactEcharts from "echarts-for-react";

const BarWithPercentage = ({dataColors=[], valueChart=[], percentageChart=[], categoryChart=[], additionalData=[], axisY=["Anggaran Kemiskinan Ekstrem", "Persentase Dari Total Anggaran"], dataTotal=10}) => {
    const limit = dataTotal;  // Misal kita ingin menampilkan hanya 10 data

    // Periksa apakah limit lebih besar dari total data
// Tentukan `startIndex` dan `endIndex` berdasarkan limit
    const startIndex = 0;  // Mulai dari indeks pertama
    const endIndex = limit - 1 
    var chartBarColors = getChartColorsArray(dataColors);
    var option = {
        // title: {
        //     text: 'Data Provinsi',
        //     left: 'center'
        // },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow' // Menggunakan shadow untuk menyoroti batang bar
            },
            formatter: function (params) {
                let tooltipItems = params.map(function (item) {
                    // Ambil marker untuk warna setiap series (untuk menunjukkan warna pada tooltip)
                    let marker = item.marker;
        
                    // Periksa jenis series (bar atau line) dan format nilainya sesuai
                    if (item.seriesType !== 'bar') {
                        // Format angka untuk series bar dengan titik sebagai pemisah ribuan
                        return `${marker} ${item.seriesName}: ${(item.value).toLocaleString('id-ID')}`;
                    } else {
                        // Format angka untuk series line dengan persentase
                        return `${marker} ${item.seriesName}: ${item.value.toFixed(2)}%`;
                    }
                });
        
                // Tambahkan kategori di bagian atas tooltip
                let categoryName = params[0].axisValueLabel;

                 // Find the index of the category name in categoryChart
                let categoryIndex = categoryChart.indexOf(categoryName);

                // Get the corresponding value from additionalData and convert it to a string
                let additionalValue = additionalData[categoryIndex]?.toString() || 'N/A';

                // Ensure two decimal places without rounding
                if (additionalValue !== 'N/A') {
                    let [integerPart, decimalPart] = additionalValue.split('.');
                    decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00'; // Take the first two decimal digits
                    additionalValue = `${parseInt(integerPart).toLocaleString('id-ID')},${decimalPart}`;
                }
                // Gabungkan kategori dengan nilai-nilai yang dihasilkan
                return `${categoryName}<br/>` + `Total Anggaran: ${additionalValue}<br/>` + tooltipItems.join('<br/>');
            }
        },
        grid: {
            bottom: 100, // Memberi lebih banyak ruang di bagian bawah untuk label
            top: 50,   // Memberikan lebih banyak ruang di bagian atas untuk label yang lebih besar
        },
        legend: {
            data: ['Anggaran Kemiskinan Ekstrem', 'Persentase Dari Total Anggaran'],
            top: 0, // Mengatur jarak legend dari atas
            left: 'center' // Menempatkan legend di tengah
        },
        xAxis: {
            type: 'category',
            data: categoryChart,
            axisLabel: {
                rotate: 30, // Memutar label untuk menghindari overlapping
                interval: 0 // Menampilkan semua label
            }
        },
        yAxis: [
            {
                type: 'value',
                name: axisY[0],
                position: 'right',
                axisLabel: {
                    formatter: function(value) {
                        return `${(value/1000000000000).toLocaleString()} T`; // Menampilkan format angka dengan koma
                    }
                },
                 // Mengatur offset vertikal label sumbu Y
                nameGap: 25, // Menentukan jarak default label dari sumbu Y
                splitLine: {
                    show: true,   // Menampilkan garis horizontal
                    lineStyle: {
                        type: 'dashed'  // Garis putus-putus untuk y-axis kiri
                    }
                }
            },
            {
                type: 'value',
                // max: 100, // Menyediakan lebih banyak ruang, hingga 120% untuk menghindari label tertimpa
                name: axisY[1],
                position: 'left',
                axisLabel: {
                    formatter: '{value} %'
                },
                nameGap: 25
            }
        ],
        series: [
            {
                name: 'Anggaran Kemiskinan Ekstrem',
                type: 'line',
                data: valueChart,
                itemStyle: {
                    color: '#FCAD24'
                },
                label: {
                    show: true,
                    position: 'inside', // Menampilkan label di atas batang bar
                    formatter: function(value) {
                        return `${((value.data/1000000000000).toFixed(2)).toLocaleString()} T`; // Menampilkan nilai dengan format angka
                    },
                }
            },
            {
                name: 'Persentase Dari Total Anggaran',
                type: 'bar',
                yAxisIndex: 1, // Menggunakan sumbu Y kedua                
                data: percentageChart,
                itemStyle: {
                    color: '#2DAED4'
                },
                smooth: true, // Garis yang lebih halus untuk persentase
                label: {
                    show: true,
                    position: 'top', // Menampilkan label di atas titik garis
                    formatter: function(params) {
                        return params.value.toFixed(2) + '%'; // Membatasi hingga dua angka di belakang koma
                    },
                    textStyle: {
                        color: '#000', // Warna teks label persentase
                        // fontWeight: 'bold'
                    }
                }
            }
        ],
        dataZoom: [
            {
              type: 'slider',  // Jenis slider untuk scroll
              show: true,
            //   start: 0,        // Posisi awal (0%)
            //   end: dataTotal,         // Posisi akhir (50%)
            startValue: startIndex,
            endValue: endIndex
            },
            {type : 'inside'}
          ]
        , 
        toolbox: {
            feature: {              
              saveAsImage: {}
            }
          },
    };

    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "500px" }} option={option} />
      </React.Fragment>
    );
  };

export default BarWithPercentage;