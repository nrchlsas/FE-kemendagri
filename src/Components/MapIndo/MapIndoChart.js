import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

const MapIndoChart = () => {
  const ROOT_PATH = '../../data/geoJsonNasional.json'; // Sesuaikan path data geoJSON
  const [isGeoJsonLoaded, setGeoJsonLoaded] = useState(false);

  const getOption = () => ({
    title: {
      text: 'Population Density of Indonesia',
      subtext: 'Data from Indonesia',
      sublink: 'https://link_data_indonesia.com'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>{c} (p / km2)'
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    visualMap: {
      min: 100,
      max: 30000,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['lightgreen', 'yellow', 'darkred']
      }
    },
    series: [
      {
        name: 'Kepadatan Populasi Indonesia',
        type: 'map',
        map: 'Indonesia', // Sesuaikan nama peta
        label: { show: true },
        data: [
          { name: 'Jawa Barat', value: 15000 },
          { name: 'DKI Jakarta', value: 40000 },
          // Tambahkan data provinsi lainnya
        ]
      }
    ]
  });

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const response = await fetch(ROOT_PATH);
        const geoJson = await response.json();
        echarts.registerMap('Indonesia', geoJson);
        setGeoJsonLoaded(true);
      } catch (error) {
        console.error('Error loading geoJSON:', error);
      }
    };
    loadGeoJson();
  }, []);

  return (
    <>
      {isGeoJsonLoaded && (
        <ReactEcharts
          option={getOption()}
          style={{ height: '500px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      )}
    </>
  );
};

export default MapIndoChart;
