import React from "react";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts/core";

const StackedBarChart = ({
  dataColors,
  valueCharts=[], // Array of arrays for each series
  categoryChart=[],
  legendNames=[], // Array of legend names for each series
  namaProv = [],  
  namaKab = [],
  namaKec = [],  
  kabupaten = false,
  kecamatan = false,
  kelurahan = false,
  fasilitasLingkungan = false,
  onBarClickProv,
  onBarClick,
  idParam = [],
  dataZoom=false,
  dataTotal = 10,
  breakWord = false
}) => {
  var chartBarColors = getChartColorsArray(dataColors);
  const limit = Math.min(dataTotal, categoryChart.length);  // Misal kita ingin menampilkan hanya 10 data

  // const totalData = categoryChart.length;

  // Periksa apakah limit lebih besar dari total data
// Tentukan `startIndex` dan `endIndex` berdasarkan limit
  const startIndex = 0;  // Mulai dari indeks pertama
  const endIndex = limit - 1

  // console.log(limit, 'ini limit')

  // Buat series secara dinamis berdasarkan jumlah valueCharts yang diberikan
  var seriesData = valueCharts.map((values, index) => ({    
    name: legendNames[index] || `Series ${index + 1}`, // Ambil nama legend atau gunakan default "Series {index}"
    type: "bar",
    stack: "total", // Semua series di-stack pada grup "total"
    label: {
      show: true,
      formatter: (params) => params.value.toLocaleString("id-ID"), // Menggunakan toLocaleString untuk format angka
      textStyle: {
        fontFamily: "Poppins, sans-serif", // Set the font family
        fontSize: 12, // Set the font size
        color: "#000", // Set the font color
      },
    },
    emphasis: {
      focus: "series",
    },
    data: values, // Data untuk setiap series
  }));  

  var option = {
    color: chartBarColors,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      // formatter: function (params) {
      //   const data = params[0];
      //   let categoryName = params[0].axisValueLabel;

      //   // Find the index of the category name in categoryChart
      //   let categoryIndex = categoryChart.indexOf(categoryName);

      //   // Get the corresponding value from additionalData and convert it to a string
      //   let namaProvinsi = namaProv[categoryIndex] || 'N/A';
      //   let namaKabupaten = namaKab[categoryIndex] || 'N/A';
      //   let namaKecamatan = namaKec[categoryIndex] || 'N/A';

      //   let tooltipItems = params.map(function (item) {
      //     // Ambil marker untuk warna setiap series (untuk menunjukkan warna pada tooltip)
      //     let marker = item.marker;
      //     // Periksa jenis series (bar atau line) dan format nilainya sesuai
      //     if (kabupaten) {
      //       // Format angka untuk series bar dengan titik sebagai pemisah ribuan
      //       return `Provinsi: ${namaProvinsi}<br/>` + `Jumlah Penduduk: ${item.value.toLocaleString(
      //         "id-ID"
      //       )}`;
      //     } else if (kecamatan){
      //       // Format angka untuk series line dengan persentase
      //       return `Provinsi: ${namaProvinsi}<br/>` + `Kabupaten/Kota: ${namaKabupaten} <br/>` + `Jumlah Penduduk: ${item.value.toLocaleString(
      //         "id-ID"
      //       )}`;
      //     }else if (kelurahan) {
      //       return `Provinsi: ${namaProvinsi}<br/>` + `Kabupaten/Kota: ${namaKabupaten} <br/>`+ `Kecamatan: ${namaKecamatan} <br/>` + `Jumlah Penduduk: ${item.value.toLocaleString(
      //         "id-ID"
      //       )}`;
      //     }else if (fasilitasLingkungan){
      //       return `${marker} ${data.name}: ${(item.value).toLocaleString('id-ID')} <br/>` + `Click Untuk Melihat Detail`;
      //     }else{
      //       return `${marker} ${data.name}: ${(item.value).toLocaleString('id-ID')} `;
      //     }
      //   });

      //   // Tambahkan kategori di bagian atas tooltip
      //   return `${tooltipItems}`;
      // },
    },
    legend: {
      data: legendNames, // Legend names from props
      top: "bottom",
      bottom: 20,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%", // Pastikan grid memberikan ruang untuk legend
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => value.toLocaleString("id-ID"),
        
      },
    },
    yAxis: {
      type: "category",
      data: categoryChart,
      inverse: true, // Membalikkan urutan kategori sehingga array pertama muncul di atas
      axisLabel: {
        textStyle: {
          fontFamily: 'Poppins, sans-serif', // Set the font family
          fontSize: 10, // Set the font size
          color: '#000', // Set the font color
        },
        interval: 0,
        formatter: breakWord ? (function (value) {
          if (value.length > 10) {
            const lines = [];
            let currentLine = "";
            const maxLineLength = 10;
            value.split(" ").forEach(word => {
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
        }) : (function(value){
          return value;
        }) ,
        rich: {
          lineBreak: {
            height: 15, // Menyesuaikan tinggi baris
          },
        },
      },
    },
    dataZoom: dataZoom ? [
      // {
      //   type: "slider",  // Jenis dataZoom slider
      //   yAxisIndex: 0,   // Menargetkan sumbu Y
      //   start: 0,        // Posisi awal slider (0%)
      //   end: dataTotal,         // Posisi akhir slider (50%)
      //   zoomLock: false, // Memungkinkan zoom in/out
      //   width: 20,       // Lebar slider
      //   left: "100%",     // Posisi slider
      // },
      {
        type: "slider",       // Menambahkan slider scroll
        yAxisIndex: 0,        // Scroll akan diterapkan pada yAxis
        // start: 0,             // Persentase awal tampilan data
        // end: dataTotal,              // Persentase akhir tampilan data (misal, 30% dari total data akan tampil awal)
        handleSize: '100%',   // Ukuran handle untuk scroll
        startValue: startIndex,        
        endValue: endIndex, 
      },
      // {
      //   type: "inside",       // Menambahkan dataZoom untuk interaksi di dalam chart (mouse scroll, drag)
      //   yAxisIndex: 0,
      //   start: 0,
      //   end: 30,
      // },
    ] : [],
    series: seriesData, // Masukkan series yang telah dibuat secara dinamis
  };

  const onEvents = {
    click: (params) => {
      if (onBarClick) {
        onBarClick(params);
      }else if (onBarClickProv) {      
        const clickedIndex = params.dataIndex;
        const clickedId = idParam[clickedIndex]; // Ambil ID berdasarkan indeks
        const clickedCategory = categoryChart[clickedIndex]; // Ambil kategori berdasarkan indeks
        const clickedValue = valueCharts[clickedIndex]; // Ambil nilai berdasarkan indeks
  
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

  return (
    <React.Fragment>
      <ReactEcharts style={{ height: "450px" }} option={option} onEvents={onEvents}/>
    </React.Fragment>
  );
};

export default StackedBarChart;
