import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { MapChart } from 'echarts/charts';
import { GeoComponent } from 'echarts/components';
import geoJsonIndo from '../../data/geoJsonNasional.json';

echarts.use([MapChart, GeoComponent]);

const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

const MapIndoChart = ({chartTitle="", valueSeries=[], maxValue=0, roam=false, colorData=[], onRegionClick, daerah=false}) => {  
  console.log(valueSeries, 'ini value series')
  const [namaMap, setNamaMap] = useState("Indonesia")
  const [dataMapSeProv, setDataMapSeProv] = useState([])
  const [errorSeProv, setErrorSeProv] = useState(false)
  const [loadingSeProv, setLoadingSeProv] = useState(false)

  const getDataMapSeProv = ({kodeProv}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_prov: kodeProv
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2/peta_seprovinsi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataMapSeProv = await response.json();

        setNamaMap('Daerah')
        echarts.registerMap('Daerah', dataMapSeProv?.data[0].geojson);
        console.log(namaMap)
      } catch (errorTabel) {
        setErrorSeProv(errorTabel);
      } finally {
        setLoadingSeProv(false);
      }
    };
    fetchData();
  };


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

  const adjustedSeries = (valueSeries || []).map((item) => {
      return {
          ...item,
          name: nameMap[item.name] || item.name || "N/A" // Jika tidak ada di nameMap, tetap gunakan nama asli 
      };
      
  });

  console.log(adjustedSeries, 'ini isi adjustseries')
  console.log(namaMap, 'ini nama')

  useEffect(() => {
    if (geoJsonIndo && geoJsonIndo.type === 'FeatureCollection' && daerah==false) {
      setNamaMap('Indonesia')
      echarts.registerMap('Indonesia', geoJsonIndo);
      setIsMapRegistered(true);
    } else {
      console.error("Invalid geoJSON format:", geoJsonIndo);
    }
  }, [daerah]);

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
      max: maxValue || 100,
      orient: 'horizontal',
      inRange: {
        color: colorData || ["#FCAD24", "#57E7B4"], // Default jika tidak valid
      },
      text: ['Tinggi', 'Rendah'],
      calculable: true
    },
    series: [
      {
        name: 'Population Density',
        type: 'map',
        map: namaMap,
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

    console.log(getOption())
    const onEvents = {
      click: (params) => {
        if (params?.data?.name) {
          const clickedFeature = geoJsonIndo.features.find(
            (feature) => feature.properties.name === params.data.name
          );
  
          if (clickedFeature) {
            onRegionClick(clickedFeature.properties.key, clickedFeature.properties.name); // Kirim `key` ke parent
            getDataMapSeProv({kodeProv: clickedFeature.properties.key})
          } else {
            alert("Data wilayah tidak ditemukan!");
          }
        }
      }
    };

  return (
    isMapRegistered ? (
      <ReactEcharts        
        option={getOption()}
        onEvents={onEvents}
        style={{ height: '600px', width: '100%' }}
      />
    ) : (
      <div>Loading map...</div>
    )
  );
};

export default MapIndoChart;