// import React, { useEffect, useRef } from 'react';
// import ReactEcharts from 'echarts-for-react';
// import * as echarts from 'echarts';
// import geoJsonIndo from '../../data/geoJsonNasional.json'; // Adjust path as needed

// const MapIndoChart = () => {
//   const chartRef = useRef(null);

//   const dataValue = [
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

//   useEffect(() => {
//     if (geoJsonIndo && geoJsonIndo.features) {
//       echarts.registerMap('Indonesia', geoJsonIndo);
//     } else {
//       console.error("Invalid geoJSON format:", geoJsonIndo);
//     }
//   }, []);

//   const getOption = () => ({
//     title: {
//       text: 'Population Density of Indonesia',
//       left: 'center'
//     },
//     tooltip: {
//       trigger: 'item',
//       formatter: '{b}<br/>{c} (p / km²)'
//     },
//     visualMap: {
//       left: 'right',
//       min: 0,
//       max: 5000000,
//       inRange: {
//         color: ['#e0f3f8', '#fee090', '#f46d43', '#a50026']
//       },
//       text: ['High Population', 'Low Population'],
//       calculable: true
//     },
//     series: [
//       {
//         name: 'Population Density',
//         type: 'map',
//         map: 'Indonesia', // Reference to the registered map name
//         roam: true, // Enable roaming (zoom and pan)
//         label: {
//           show: false
//         },
//         data: dataValue,
//         emphasis: {
//           label: {
//             show: true,
//             color: '#000'
//           }
//         }
//       }
//     ]
//   });

//   const onChartClick = (params) => {
//     if (params.name) {
//       const chartInstance = chartRef.current.getEchartsInstance();
  
//       if (chartInstance) {
//         const region = geoJsonIndo.features.find((feature) => feature.properties.name === params.name);
  
//         if (region) {
//           const center = calculateCenter(region); // Use the calculateCenter function
  
//           if (center && center.length === 2) {
//             console.log(`Center coordinates for ${params.name}:`, center);
  
//             // Dispatch the zoom action
//             chartInstance.dispatchAction({
//               type: 'mapZoom',
//               zoom: 5, // Adjust zoom level as needed
//               center: center // Centering on the clicked region
//             });
  
//             // Dispatch select action
//             chartInstance.dispatchAction({
//               type: 'mapSelect',
//               name: params.name
//             });
//           } else {
//             console.error("No valid center coordinates found for region:", params.name);
//           }
//         } else {
//           console.error("Region not found:", params.name);
//         }
//       } else {
//         console.error("Chart instance not found");
//       }
//     }
  
//     console.log("Clicked params:", params);
//   };
  
//   // Function to calculate center coordinates
//   const calculateCenter = (region) => {
//     const coordinates = region.geometry.coordinates;
//     let center;
  
//     if (region.geometry.type === 'MultiPolygon') {
//       const allPoints = [];
//       coordinates.forEach(polygon => {
//         polygon.forEach(point => {
//           allPoints.push(...point); // Flattening all coordinates
//         });
//       });
  
//       const latSum = allPoints.reduce((sum, point) => sum + point[1], 0);
//       const lonSum = allPoints.reduce((sum, point) => sum + point[0], 0);
//       const pointCount = allPoints.length;
  
//       center = [lonSum / pointCount, latSum / pointCount]; // [longitude, latitude]
//     } else if (region.geometry.type === 'Polygon') {
//       const points = coordinates[0];
//       const latSum = points.reduce((sum, point) => sum + point[1], 0);
//       const lonSum = points.reduce((sum, point) => sum + point[0], 0);
//       const pointCount = points.length;
  
//       center = [lonSum / pointCount, latSum / pointCount]; // [longitude, latitude]
//     }
  
//     return center;
//   };    

//   return (
//     <ReactEcharts
//       ref={chartRef}
//       option={getOption()}
//       style={{ height: '600px', width: '100%' }}
//       onEvents={{ click: onChartClick }} // Add the click event handler
//     />
//   );
// };

// export default MapIndoChart;


import React, { useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import geoJsonIndo from '../../data/geoJsonNasional.json'; // Adjust path as needed

const MapIndoChart = () => {
  const dataValue = [
        { name: 'ACEH', value: 2200000 },
        { name: 'KEP. BANGKA BELITUNG', value: 1400000 },
        { name: 'KEP. RIAU', value: 2000000 },
        { name: 'SUMATERA UTARA', value: 2400000 },
        { name: 'SUMATERA BARAT', value: 1800000 },
        { name: 'RIAU', value: 2500000 },
        { name: 'JAMBI', value: 1500000 },
        { name: 'SUMATERA SELATAN', value: 3000000 },
        { name: 'BENGKULU', value: 1000000 },
        { name: 'LAMPUNG', value: 2800000 },
        { name: 'DKI JAKARTA', value: 9000000 },
        { name: 'JAWA BARAT', value: 50000000 },
        { name: 'JAWA TENGAH', value: 35000000 },
        { name: 'DI YOGYAKARTA', value: 4000000 },
        { name: 'JAWA TIMUR', value: 50000000 },
        { name: 'BANTEN', value: 2400000 },
        { name: 'BALI', value: 3500000 },
        { name: 'NUSA TENGGARA BARAT', value: 1800000 },
        { name: 'NUSA TENGGARA TIMUR', value: 1300000 },
        { name: 'KALIMANTAN BARAT', value: 2200000 },
        { name: 'KALIMANTAN TENGAH', value: 1700000 },
        { name: 'KALIMANTAN SELATAN', value: 2000000 },
        { name: 'KALIMANTAN TIMUR', value: 2400000 },
        { name: 'KALIMANTAN UTARA', value: 1500000 },
        { name: 'SULAWESI UTARA', value: 1900000 },
        { name: 'SULAWESI TENGAH', value: 1700000 },
        { name: 'SULAWESI SELATAN', value: 2000000 },
        { name: 'SULAWESI TENGGARA', value: 1600000 },
        { name: 'SULAWESI BARAT', value: 1400000 },
        { name: 'GORONTALO', value: 1100000 },
        { name: 'MALUKU', value: 1500000 },
        { name: 'MALUKU UTARA', value: 1200000 },
        { name: 'PAPUA BARAT', value: 1500000 },
        { name: 'PAPUA', value: 3000000 },
        { name: 'PAPUA BARAT DAYA', value: 1300000 },
        { name: 'PAPUA SELATAN', value: 1100000 },
        { name: 'PAPUA TENGAH', value: 900000 },
        { name: 'PAPUA PEGUNUNGAN', value: 800000 }
      ]

      useEffect(() => {
        // Log the GeoJSON to verify its structure
        console.log(geoJsonIndo);
    
        if (geoJsonIndo && geoJsonIndo.type === 'FeatureCollection' && Array.isArray(geoJsonIndo.features)) {
          echarts.registerMap('Indonesia', geoJsonIndo);
        } else {
          console.error("Invalid geoJSON format:", geoJsonIndo);
        }
      }, []);

  const getOption = () => ({
    title: {
      text: 'Population Density of Indonesia',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/> total anak SD: {c} '
    },
    visualMap: {
      left: 'left',
      bottom: '20%', // Adjust as needed
      min: 0,
      max: 5000000,
      orient: 'horizontal', // Set orientation to horizontal
      inRange: {
        color: ['#abd9e9','#74add1','#4575b4','#313695']
      },
      text: ['High Population', 'Low Population'],
      calculable: true
    },
    series: [
      {
        name: 'Population Density',
        type: 'map',
        map: 'Indonesia', // Reference to the registered map name
        label: {
          show: false
        },
        data: [
          { name: 'ACEH', value: 2200000 },
          { name: 'KEP. BANGKA BELITUNG', value: 1400000 },
          { name: 'KEP. RIAU', value: 2000000 },
          { name: 'SUMATERA UTARA', value: 2400000 },
          { name: 'SUMATERA BARAT', value: 1800000 },
          { name: 'RIAU', value: 2500000 },
          { name: 'JAMBI', value: 1500000 },
          { name: 'SUMATERA SELATAN', value: 3000000 },
          { name: 'BENGKULU', value: 1000000 },
          { name: 'LAMPUNG', value: 2800000 },
          { name: 'DKI JAKARTA', value: 9000000 },
          { name: 'JAWA BARAT', value: 50000000 },
          { name: 'JAWA TENGAH', value: 35000000 },
          { name: 'DI YOGYAKARTA', value: 4000000 },
          { name: 'JAWA TIMUR', value: 50000000 },
          { name: 'BANTEN', value: 2400000 },
          { name: 'BALI', value: 3500000 },
          { name: 'NUSA TENGGARA BARAT', value: 1800000 },
          { name: 'NUSA TENGGARA TIMUR', value: 1300000 },
          { name: 'KALIMANTAN BARAT', value: 2200000 },
          { name: 'KALIMANTAN TENGAH', value: 1700000 },
          { name: 'KALIMANTAN SELATAN', value: 2000000 },
          { name: 'KALIMANTAN TIMUR', value: 2400000 },
          { name: 'KALIMANTAN UTARA', value: 1500000 },
          { name: 'SULAWESI UTARA', value: 1900000 },
          { name: 'SULAWESI TENGAH', value: 1700000 },
          { name: 'SULAWESI SELATAN', value: 2000000 },
          { name: 'SULAWESI TENGGARA', value: 1600000 },
          { name: 'SULAWESI BARAT', value: 1400000 },
          { name: 'GORONTALO', value: 1100000 },
          { name: 'MALUKU', value: 1500000 },
          { name: 'MALUKU UTARA', value: 1200000 },
          { name: 'PAPUA BARAT', value: 1500000 },
          { name: 'PAPUA', value: 3000000 },
          { name: 'PAPUA BARAT DAYA', value: 1300000 },
          { name: 'PAPUA SELATAN', value: 1100000 },
          { name: 'PAPUA TENGAH', value: 900000 },
          { name: 'PAPUA PEGUNUNGAN', value: 800000 }
        ],        
        emphasis: {
          label: {
            show: true,
            color: '#000'
          }
        }
      }
    ]
  });

  return (
    <ReactEcharts
      option={getOption()}
      style={{ height: '600px', width: '100%' }}
    />
  );
};

export default MapIndoChart;
