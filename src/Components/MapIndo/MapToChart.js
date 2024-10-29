// import React, { useEffect, useRef, useState } from 'react';
// import * as echarts from 'echarts/core';
// import { GeoMapChart, VisualMapComponent, BarChart } from 'echarts/charts';
// import { TitleComponent, LegendComponent } from 'echarts/components';
// import '../../data/geoJsonNasional.json'; // Assuming USA map is needed

// const USAChart = () => {
//   const chartRef = useRef(null);
//   const [currentOption, setCurrentOption] = useState('map');

//   const chartData = [
//     { name: 'ACEH', value: 2200000 },
//     { name: 'KEP. BANGKA BELITUNG', value: 1400000 },
//     { name: 'KEP. RIAU', value: 2000000 },
//     { name: 'SUMATERA UTARA', value: 2400000 },
//     { name: 'SUMATERA BARAT', value: 1800000 },
//     { name: 'RIAU', value: 2500000 },
//     { name: 'JAMBI', value: 1500000 },
//     { name: 'SUMATERA SELATAN', value: 3000000 },
//     { name: 'BENGKULU', value: 1000000 },
//     { name: 'LAMPUNG', value: 2800000 },
//     { name: 'DKI JAKARTA', value: 9000000 },
//     { name: 'JAWA BARAT', value: 50000000 },
//     { name: 'JAWA TENGAH', value: 35000000 },
//     { name: 'DI YOGYAKARTA', value: 4000000 },
//     { name: 'JAWA TIMUR', value: 50000000 },
//     { name: 'BANTEN', value: 2400000 },
//     { name: 'BALI', value: 3500000 },
//     { name: 'NUSA TENGGARA BARAT', value: 1800000 },
//     { name: 'NUSA TENGGARA TIMUR', value: 1300000 },
//     { name: 'KALIMANTAN BARAT', value: 2200000 },
//     { name: 'KALIMANTAN TENGAH', value: 1700000 },
//     { name: 'KALIMANTAN SELATAN', value: 2000000 },
//     { name: 'KALIMANTAN TIMUR', value: 2400000 },
//     { name: 'KALIMANTAN UTARA', value: 1500000 },
//     { name: 'SULAWESI UTARA', value: 1900000 },
//     { name: 'SULAWESI TENGAH', value: 1700000 },
//     { name: 'SULAWESI SELATAN', value: 2000000 },
//     { name: 'SULAWESI TENGGARA', value: 1600000 },
//     { name: 'SULAWESI BARAT', value: 1400000 },
//     { name: 'GORONTALO', value: 1100000 },
//     { name: 'MALUKU', value: 1500000 },
//     { name: 'MALUKU UTARA', value: 1200000 },
//     { name: 'PAPUA BARAT', value: 1500000 },
//     { name: 'PAPUA', value: 3000000 },
//     { name: 'PAPUA BARAT DAYA', value: 1300000 },
//     { name: 'PAPUA SELATAN', value: 1100000 },
//     { name: 'PAPUA TENGAH', value: 900000 },
//     { name: 'PAPUA PEGUNUNGAN', value: 800000 }
//   ];

//   const mapOption = {
//     visualMap: {
//       left: 'right',
//       min: 500000,
//       max: 38000000,
//       inRange: {
//         color: [
//           '#313695',
//           '#4575b4',
//           '#74add1',
//           '#abd9e9',
//           '#e0f3f8',
//           '#ffffbf',
//           '#fee090',
//           '#fdae61', 
//           '#f46d43',
//           '#d73027',
//           '#a50026',
//         ],
//       },
//       text: ['High', 'Low'],
//       calculable: true,
//     },
//     series: [
//       {
//         name: 'Population Density',
//         type: 'map',
//         map: 'Indonesia', // Reference to the registered map name
//         roam: true, // Enable roaming (zoom and pan)
//         animationDurationUpdate: 1000,
//         universalTransition: true,
//         data:  
//  chartData.sort((a, b) => a.value - b.value),
//       },
//     ],
//   };

//   const barOption = {
//     xAxis: {
//       type: 'value',
//     },
//     yAxis: {
//       type: 'category',
//       axisLabel: {
//         rotate: 30,
//       },
//       data: chartData.map((item) => item.name),
//     },
//     animationDurationUpdate: 1000,
//     series: {
//       type: 'bar',
//       id: 'population',
//       data: chartData.map((item) => item.value),
//       universalTransition: true,
//     },
//   };

//   useEffect(() => {
//     const initChart = () => {
//       const chart = echarts.init(chartRef.current);
//       chart.setOption(mapOption);
//       setInterval(() => {
//         setCurrentOption((prev) => (prev === 'map' ? 'bar' : 'map'));
//         chart.setOption(currentOption === 'map' ? mapOption : barOption, true);
//       }, 2000);
//     };

//     initChart();
//   }, []);

//   return <div ref={chartRef} style={{ height: 500 }} />;
// };

// export default USAChart;