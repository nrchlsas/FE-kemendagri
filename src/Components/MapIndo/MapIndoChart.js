import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { MapChart } from 'echarts/charts';
import { GeoComponent } from 'echarts/components';
import geoJsonIndo from '../../data/geoJsonNasional.json';

echarts.use([MapChart, GeoComponent]);

const MapIndoChart = ({chartTitle="", valueSeries=[], maxValue=0, roam=false, colorData=['#abd9e9','#74add1','#4575b4','#313695']}) => {  
  const [isMapRegistered, setIsMapRegistered] = useState(false);

  const nameMap = {
    "Aceh": "ACEH",
    "Provinsi Sumatera Utara": "SUMATERA UTARA",
    "Provinsi Sumatera Barat": "SUMATERA BARAT",
    "Provinsi Riau": "RIAU",
    "Provinsi Jambi": "JAMBI",
    "Provinsi Sumatera Selatan": "SUMATERA SELATAN",
    "Provinsi Bengkulu": "BENGKULU",
    "Provinsi Lampung": "LAMPUNG",
    "Provinsi Bangka Belitung": "KEPULAUAN BANGKA BELITUNG",
    "Provinsi Kepulauan Riau": "KEPULAUAN RIAU",
    "Provinsi DKI Jakarta": "DKI JAKARTA",
    "Provinsi Jawa Barat": "JAWA BARAT",
    "Provinsi Jawa Tengah": "JAWA TENGAH",
    "Provinsi DI Yogyakarta": "DAERAH ISTIMEWA YOGYAKARTA",
    "Provinsi Jawa Timur": "JAWA TIMUR",
    "Provinsi Banten": "BANTEN",
    "Provinsi Bali": "BALI",
    "Provinsi Nusa Tenggara Barat": "NUSA TENGGARA BARAT",
    "Provinsi Nusa Tenggara Timur": "NUSA TENGGARA TIMUR",
    "Provinsi Kalimantan Barat": "KALIMANTAN BARAT",
    "Provinsi Kalimantan Tengah": "KALIMANTAN TENGAH",
    "Provinsi Kalimantan Selatan": "KALIMANTAN SELATAN",
    "Provinsi Kalimantan Timur": "KALIMANTAN TIMUR",
    "Provinsi Kalimantan Utara": "KALIMANTAN UTARA",
    "Provinsi Sulawesi Utara": "SULAWESI UTARA",
    "Provinsi Sulawesi Tengah": "SULAWESI TENGAH",
    "Provinsi Sulawesi Selatan": "SULAWESI SELATAN",
    "Provinsi Sulawesi Tenggara": "SULAWESI TENGGARA",
    "Provinsi Gorontalo": "GORONTALO",
    "Provinsi Sulawesi Barat": "SULAWESI BARAT",
    "Provinsi Maluku": "MALUKU",
    "Provinsi Maluku Utara": "MALUKU UTARA",
    "Provinsi Papua": "P A P U A",
    "Provinsi Papua Barat": "PAPUA BARAT",
    "Provinsi Papua Selatan": "PAPUA SELATAN",
    "Provinsi Papua Tengah": "PAPUA TENGAH",
    "Provinsi Papua Pegunungan": "PAPUA PEGUNUNGAN",
    "Provinsi Papua Barat Daya": "PAPUA BARAT DAYA",
};

  const adjustedSeries = valueSeries.map((item) => {
      return {
          ...item,
          name: nameMap[item.name] || item.name // Jika tidak ada di nameMap, tetap gunakan nama asli
      };
  });

  useEffect(() => {
    if (geoJsonIndo && geoJsonIndo.type === 'FeatureCollection') {
      echarts.registerMap('Indonesia', geoJsonIndo);
      setIsMapRegistered(true);
    } else {
      console.error("Invalid geoJSON format:", geoJsonIndo);
    }
  }, []);
  // const maxPopulation = Math.max(...valueSeries.map(item => item.value));
  const getOption = () => ({
      title: {
      text: chartTitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const formattedValue = params.value.toLocaleString('id-ID'); // format dengan titik ribuan
        return `${params.name}<br/> Total: ${formattedValue}`;
      }
    },
    visualMap: {
      left: 'left',
      bottom: '20%',
      min: 0,
      max: maxValue,
      orient: 'horizontal',
      inRange: {
        color: colorData ? colorData : ['#abd9e9','#74add1','#4575b4','#313695']
      },
      text: ['Tinggi', 'Rendah'],
      calculable: true
    },
    series: [
      {
        name: 'Population Density',
        type: 'map',
        map: 'Indonesia',
        layoutCenter: roam ? "" : ['50%', '35%'],
        layoutSize: "100%",
        zoom: roam ? "" : 0,
        roam: roam,       
        data: adjustedSeries,
        emphasis: {
          label: {
            show: true,
            color: '#000'
          }
        }
      }
    ]});

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

export default MapIndoChart;

// [
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
        // ],


        // nameMap: {
        //   "Provinsi Aceh": "ACEH",
        //   "Provinsi Sumatera Utara": "SUMATERA UTARA",
        //   "Provinsi Sumatera Barat": "SUMATERA BARAT",
        //   "Provinsi Riau": "RIAU",
        //   "Provinsi Jambi": "JAMBI",
        //   "Provinsi Sumatera Selatan": "SUMATERA SELATAN",
        //   "Provinsi Bengkulu": "BENGKULU",
        //   "Provinsi Lampung": "LAMPUNG",
        //   "Provinsi Bangka Belitung": "KEP. BANGKA BELITUNG",
        //   "Provinsi Kepulauan Riau": "KEP. RIAU",
        //   "Provinsi DKI Jakarta": "DKI JAKARTA",
        //   "Provinsi Jawa Barat": "JAWA BARAT",
        //   "Provinsi Jawa Tengah": "JAWA TENGAH",
        //   "Provinsi DI Yogyakarta": "DI YOGYAKARTA",
        //   "Provinsi Jawa Timur": "JAWA TIMUR",
        //   "Provinsi Banten": "BANTEN",
        //   "Provinsi Bali": "BALI",
        //   "Provinsi Nusa Tenggara Barat": "NUSA TENGGARA BARAT",
        //   "Provinsi Nusa Tenggara Timur": "NUSA TENGGARA TIMUR",
        //   "Provinsi Kalimantan Barat": "KALIMANTAN BARAT",
        //   "Provinsi Kalimantan Tengah": "KALIMANTAN TENGAH",
        //   "Provinsi Kalimantan Selatan": "KALIMANTAN SELATAN",
        //   "Provinsi Kalimantan Timur": "KALIMANTAN TIMUR",
        //   "Provinsi Kalimantan Utara": "KALIMANTAN UTARA",
        //   "Provinsi Sulawesi Utara": "SULAWESI UTARA",
        //   "Provinsi Sulawesi Tengah": "SULAWESI TENGAH",
        //   "Provinsi Sulawesi Selatan": "SULAWESI SELATAN",
        //   "Provinsi Sulawesi Tenggara": "SULAWESI TENGGARA",
        //   "Provinsi Gorontalo": "GORONTALO",
        //   "Provinsi Sulawesi Barat": "SULAWESI BARAT",
        //   "Provinsi Maluku": "MALUKU",
        //   "Provinsi Maluku Utara": "MALUKU UTARA",
        //   "Provinsi Papua": "PAPUA",
        //   "Provinsi Papua Barat": "PAPUA BARAT",
        //   "Provinsi Papua Selatan": "PAPUA SELATAN",
        //   "Provinsi Papua Tengah": "PAPUA TENGAH",
        //   "Provinsi Papua Pegunungan": "PAPUA PEGUNUNGAN",
        //   "Provinsi Papua Barat Daya": "PAPUA BARAT DAYA"
        //       },