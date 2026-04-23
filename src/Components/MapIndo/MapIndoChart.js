import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import { MapChart } from "echarts/charts";
import { GeoComponent } from "echarts/components";

echarts.use([MapChart, GeoComponent]);

const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

const MapIndoChart = ({
  chartTitle = "",
  valueSeries = [],
  maxValue = 0,
  roam = false,
  colorData = [],
  onRegionClick,
  onKabKotaClick,
  daerah = false,
}) => {
  // console.log(valueSeries, 'ini isi value series 1')
  const [namaMap, setNamaMap] = useState("Indonesia");
  const [dataMapSeProv, setDataMapSeProv] = useState(null);
  const [loadingSeProv, setLoadingSeProv] = useState(true);

  const getDataMapSeProv = (kodeProv = null) => {
    const fetchData = async () => {
      try {
        setLoadingSeProv(true);
        const token = JSON.parse(sessionStorage.getItem("authUser"));
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-sipdhub": `${token.token}`,
          },
          body: JSON.stringify({
            kode_prov: kodeProv || "33.21",
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2/peta_seprovinsi`,
          requestOptions,
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataMapSeProv = await response.json();
        setDataMapSeProv(dataMapSeProv?.data[0]?.geojson);
        
        if (kodeProv) {
          setNamaMap("Daerah");
          echarts.registerMap("Daerah", dataMapSeProv?.data[0]?.geojson);
        } else {
          setNamaMap("Indonesia");
          echarts.registerMap("Indonesia", dataMapSeProv?.data[0]?.geojson);
        }
        
        setIsMapRegistered(true);
      } catch (error) {
        console.error("Error fetching map data:", error);
      } finally {
        setLoadingSeProv(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    console.log(maxValue, "ini max value");
    
    // Load initial map data
    if (!daerah) {
      getDataMapSeProv(); // Load peta nasional
    }
  }, [daerah]);

  const [dataMapKabKota, setDataMapKabKota] = useState(null);
  const [loadingKabKota, setLoadingKabKota] = useState(false);

  const getDataMapKabKota = (kodeDdn) => {
    const fetchData = async () => {
      try {
        setLoadingKabKota(true);
        const token = JSON.parse(sessionStorage.getItem("authUser"));
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-sipdhub": `${token.token}`,
          },
          body: JSON.stringify({
            kode_ddn: kodeDdn,
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2/peta_kabkota`,
          requestOptions,
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataMapKabKota = await response.json();
        setDataMapKabKota(dataMapKabKota?.data[0]?.geojson);
        setNamaMap("Daerah");
        echarts.registerMap("Daerah", dataMapKabKota?.data[0]?.geojson);
        setIsMapRegistered(true);
      } catch (error) {
        console.error("Error fetching kab/kota map data:", error);
      } finally {
        setLoadingKabKota(false);
      }
    };
    fetchData();
  };

  const [isMapRegistered, setIsMapRegistered] = useState(false);

  const nameMap = {
    Aceh: "ACEH",
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
    if (daerah) {
      const matchedFeature = dataMapSeProv?.features?.find(
        (feature) => feature.properties.key === item.id,
      );

      return {
        ...item,
        name: matchedFeature
          ? matchedFeature.properties.name
          : item.name || "N/A",
      };
    } else {
      return {
        ...item,
        name: nameMap[item.name] || item.name || "N/A",
      };
    }
  });

  // const maxPopulation = Math.max(...valueSeries.map(item => item.value));
  const getOption = () => ({
    title: {
      text: chartTitle,
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const formattedValue = params.value.toLocaleString("id-ID"); // format dengan titik ribuan
        return `${params.name}<br/> Total: ${formattedValue}`;
      },
    },
    visualMap: {
      left: "left",
      bottom: "5%",
      min: 0,
      max: maxValue || 100,
      orient: "horizontal",
      inRange: {
        color: colorData || ["#FCAD24", "#57E7B4"], // Default jika tidak valid
      },
      text: ["Tinggi", "Rendah"],
      calculable: true,
    },
    grid: {
      top: "10%",
      bottom: "15%",
      left: "5%",
      right: "5%",
      containLabel: true,
    },
    series: [
      {
        name: "Population Density",
        type: "map",
        map: namaMap,
        layoutCenter: roam ? ["50%", "50%"] : ["50%", "50%"],
        layoutSize: daerah ? "60%" : "95%",
        top: "10%",
        zoom: roam ? 1 : 1,
        roam: roam,
        label: {
          show: namaMap === "Daerah",
          color: "#1F2937",
          fontSize: 8,
          formatter: ({ name }) => name,
        },
        data: adjustedSeries,
        emphasis: {
          label: {
            show: true,
            color: "#000",
          },
        },
      },
    ],
  });

  const onEvents = {
    click: (params) => {
      console.log("1");
      if (params?.data?.name && dataMapSeProv) {
        console.log("2");

        const clickedFeature = dataMapSeProv?.features?.find(
          (feature) => feature.properties.name === params.data.name,
        );

        const clickedFeatureSeprov = dataMapSeProv?.features?.find(
          (feature) => feature.properties.name === params.data.name,
        );

        if (clickedFeature) {
          console.log("3");

          onRegionClick(
            clickedFeature.properties.key,
            clickedFeature.properties.name,
          );
          getDataMapSeProv(clickedFeature.properties.key);
        } else if (clickedFeatureSeprov) {
          console.log("4");
          onKabKotaClick(
            clickedFeatureSeprov.properties.key,
            clickedFeatureSeprov.properties.name,
          );
        } else {
          console.log("Data wilayah tidak ditemukan!");
        }
      }
    },
  };

  return isMapRegistered && !loadingSeProv ? (
    <ReactEcharts
      option={getOption()}
      onEvents={onEvents}
      style={{ height: "400px", width: "100%", marginTop:"50px" }}
    />
  ) : (
    <div>Loading map...</div>
  );
};

export default MapIndoChart;
