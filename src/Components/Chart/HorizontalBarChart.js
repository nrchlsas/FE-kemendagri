import React from "react";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts/core";

const HorizontalBarChart = ({
  dataColors,
  valueChart = [],
  categoryChart = [],
  namaProv = [],  
  namaKab = [],
  namaKec = [],  
  kabupaten = false,
  kecamatan = false,
  kelurahan = false,
  fasilitasLingkungan = false,
  trillion = false,
  dataZoom = false,
  dataTotal = 10,
  idParam = [],
  onBarClick,
  onBarClickProv,
  breakWord = false,
}) => {
  // Tentukan limit berapa banyak data yang ingin ditampilkan
  const limit = Math.min(dataTotal, valueChart.length); // Misal kita ingin menampilkan hanya 10 data
  
  // Periksa apakah limit lebih besar dari total data
  // Tentukan `startIndex` dan `endIndex` berdasarkan limit
  const startIndex = 0; // Mulai dari indeks pertama
  const endIndex = limit - 1;

  var chartBarColors = getChartColorsArray(dataColors);
  var option = {
    color: chartBarColors,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        const data = params[0];
        let categoryName = params[0].axisValueLabel;

        // Find the index of the category name in categoryChart
        let categoryIndex = categoryChart.indexOf(categoryName);

        // Get the corresponding value from additionalData and convert it to a string
        let namaProvinsi = namaProv[categoryIndex] || 'N/A';
        let namaKabupaten = namaKab[categoryIndex] || 'N/A';
        let namaKecamatan = namaKec[categoryIndex] || 'N/A';

        let tooltipItems = params.map(function (item) {
          // Ambil marker untuk warna setiap series (untuk menunjukkan warna pada tooltip)
          let marker = item.marker;
          // Periksa jenis series (bar atau line) dan format nilainya sesuai
          if (kabupaten) {
            // Format angka untuk series bar dengan titik sebagai pemisah ribuan
            return `Provinsi: ${namaProvinsi}<br/>` + `Jumlah Penduduk: ${item.value.toLocaleString(
              "id-ID"
            )}`;
          } else if (kecamatan){
            // Format angka untuk series line dengan persentase
            return `Provinsi: ${namaProvinsi}<br/>` + `Kabupaten/Kota: ${namaKabupaten} <br/>` + `Jumlah Penduduk: ${item.value.toLocaleString(
              "id-ID"
            )}`;
          }else if (kelurahan) {
            return `Provinsi: ${namaProvinsi}<br/>` + `Kabupaten/Kota: ${namaKabupaten} <br/>`+ `Kecamatan: ${namaKecamatan} <br/>` + `Jumlah Penduduk: ${item.value.toLocaleString(
              "id-ID"
            )}`;
          }else if (fasilitasLingkungan){
            return `${marker} ${data.name}: ${(item.value).toLocaleString('id-ID')} <br/>` + `Click Untuk Melihat Detail`;
          }else{
            return `${marker} ${data.name}: ${(item.value).toLocaleString('id-ID')}`;
          }
        });

        // Tambahkan kategori di bagian atas tooltip
        return `${tooltipItems}`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: function (value) {
          if (trillion) {
            return `${(value / 1000000000000).toLocaleString("id-ID")} T`;
          } else {
            return value.toLocaleString("id-ID");
          }
        },
      },
      axisLine: {
        show: true, // Menampilkan garis di sumbu X
      },
      splitLine: {
        show: true, // Menampilkan garis bantu (grid lines) di sumbu X
      },
    },
    yAxis: {
      type: "category",
      data: categoryChart,
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        textStyle: {
          fontFamily: "Poppins, sans-serif", // Set the font family
          fontSize: 10, // Set the font size
          color: "#000", // Set the font color
        },
        interval: 0,
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
        rich: {
          lineBreak: {
            height: 15, // Menyesuaikan tinggi baris
          },
        },
      },
      axisLine: {
        show: false, // Menghilangkan garis di sumbu Y
      },
      splitLine: {
        show: false, // Menghilangkan garis bantu (grid lines) di sumbu Y
      },
      inverse: true, // Membalik urutan kategori sehingga mulai dari yang paling bawah
    },
    dataZoom: dataZoom
      ? [
          {
            type: "slider", // Jenis dataZoom slider
            yAxisIndex: 0, // Menargetkan sumbu Y
            startValue: startIndex,
            endValue: endIndex,
            // start:0, // Posisi awal slider (0%)
            // end:0, // Posisi akhir slider (50%)
            // zoomLock: false, // Memungkinkan zoom in/out
            width: 20, // Lebar slider
            // left: "97%",     // Posisi slider
            handleSize: "100%",
          },
        ]
      : [],
    series: [
      {
        name: "Jumlah",
        type: "bar",
        data: valueChart,
        label: {
          show: true,
          position: "inside",
          offset: [50, 0],
          formatter: function (params) {
            const value = parseFloat(params.value);
            if (trillion) {
              return `${(value / 1000000000000).toLocaleString("id-ID", {
                minimumFractionDigits: value % 1 === 0 ? 0 : 2,
                maximumFractionDigits: 2,
              })} T`;
            } else {
              return value.toLocaleString("id-ID", {
                minimumFractionDigits: value % 1 === 0 ? 0 : 2,
                maximumFractionDigits: 2,
              });
            }
          },
          textStyle: {
            fontSize: 12, // Set the font size
            color: "#000", // Set the font color
          },
        },
        itemStyle: {
          borderRadius: [0, 10, 10, 0],
          color: function (params) {
            return option.color[params.dataIndex % option.color.length];
          },
        },
      },
    ],
  };

  // Event handler untuk klik pada bar chart
  const onEvents = {
    click: (params) => {
      if (onBarClick) {
        onBarClick(params);
      }else if (onBarClickProv) {      
        const clickedIndex = params.dataIndex;
        const clickedId = idParam[clickedIndex]; // Ambil ID berdasarkan indeks
        const clickedCategory = categoryChart[clickedIndex]; // Ambil kategori berdasarkan indeks
        const clickedValue = valueChart[clickedIndex]; // Ambil nilai berdasarkan indeks
  
        // Kirim data lengkap ke handler
        onBarClickProv({
          id: clickedId,
          category: clickedCategory,
          value: clickedValue,
          index: clickedIndex,
        });
      }      
    },
  };

  // const onEvents = {
  //   click: (params) => {
  //     if (onBarClick) {
  //       const clickedIndex = params.dataIndex;
  //       const clickedId = idParam[clickedIndex]; // Ambil ID berdasarkan indeks
  //       const clickedCategory = categoryChart[clickedIndex]; // Ambil kategori berdasarkan indeks
  //       const clickedValue = valueChart[clickedIndex]; // Ambil nilai berdasarkan indeks
  
  //       // Kirim data lengkap ke handler
  //       onBarClick({
  //         id: clickedId,
  //         category: clickedCategory,
  //         value: clickedValue,
  //         index: clickedIndex,
  //       });
  //     }
  //   },
  // };

  return (
    <React.Fragment>
      <ReactEcharts
        style={{ height: "450px" }}
        option={option}
        onEvents={onEvents}
      />
    </React.Fragment>
  );
};

export default HorizontalBarChart;
