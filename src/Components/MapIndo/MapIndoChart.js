import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { MapChart } from 'echarts/charts';
import { GeoComponent } from 'echarts/components';
import geoJsonIndo from '../../data/geoJsonNasional.json';

echarts.use([MapChart, GeoComponent]);

const MapIndoChart = ({chartTitle="", valueSeries=[], maxValue=0, roam=false, colorData=['#abd9e9','#74add1','#4575b4','#313695']}) => {  
  const [isMapRegistered, setIsMapRegistered] = useState(false);

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
        data: valueSeries,
        
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