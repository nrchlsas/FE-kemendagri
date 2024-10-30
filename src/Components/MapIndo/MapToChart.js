import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import geoJsonIndo from '../../data/geoJsonNasional.json';
// import geoJsonIndo from '../../data/geoJsonIndo.json'; // Adjust the path to your local geoJSON file

const IDPopulationDensityChart = () => {
  const [isMapRegistered, setIsMapRegistered] = useState(false);

  useEffect(() => {
    if (geoJsonIndo && geoJsonIndo.type === 'FeatureCollection') {
      echarts.registerMap('ID', geoJsonIndo);
      setIsMapRegistered(true);
    } else {
      console.error("Invalid geoJSON format:", geoJsonIndo);
    }
  }, []);

  const getOption = () => ({
    title: {
      text: 'Population Density of Hong Kong (2011)',
      subtext: 'Data from Wikipedia',
      sublink: 'http://zh.wikipedia.org/wiki/%E9%A6%99%E6%B8%AF%E8%A1%8C%E6%94%BF%E5%8D%80%E5%8A%83#cite_note-12',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>{c} (p / km²)',
    },
    visualMap: {
      min: 800,
      max: 50000,
      text: ['High', 'Low'],
      calculable: true,
      inRange: {
        color: ['lightskyblue', 'yellow', 'orangered'],
      },
    },
    series: [
      {
        name: 'Hong Kong District Population Density',
        type: 'map',
        map: 'ID',
        label: {
          show: true,
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
      },
    ],
  });

  return (
    isMapRegistered ? (
      <ReactEcharts
        option={getOption()}
        style={{ height: '600px', width: '100%' }}
      />
    ) : (
      <div>Loading map...</div>
    )
  );
};

export default IDPopulationDensityChart;
