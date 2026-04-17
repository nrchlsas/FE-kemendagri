import React, { use, useEffect, useMemo, useState } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";
import { MapChart } from "echarts/charts";
import { GeoComponent } from "echarts/components";
import geoJsonIndo from "../../data/geoJsonNasional.json";

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
  const matchValueSeriesWithGeoJson = (valueSeries, geoJson) => {
    return valueSeries.map((item) => {
      const matchedFeature = geoJson.features.find(
        (feature) => feature.properties.key === item.id,
      );
      return {
        ...item,
        name: matchedFeature ? matchedFeature.properties.name : item.name, // Gunakan nama dari geoJSON jika cocok
      };
    });
  };
  const [namaMap, setNamaMap] = useState("Indonesia");
  const [dataMapSeProv, setDataMapSeProv] = useState([]);
  const [errorSeProv, setErrorSeProv] = useState(false);
  const [loadingSeProv, setLoadingSeProv] = useState(false);

  const getDataMapSeProv = ({ kodeProv }) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"));
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-sipdhub": `${token.token}`,
          },
          body: JSON.stringify({
            kode_prov: kodeProv,
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
        // const updatedGeoJSON = matchValueSeriesWithGeoJson(valueSeries, dataMapSeProv?.data[0]?.geojson);
        setDataMapSeProv(dataMapSeProv?.data[0]?.geojson);
        setNamaMap("Daerah");
        echarts.registerMap("Daerah", dataMapSeProv?.data[0]?.geojson);
        setIsMapRegistered(true);
      } catch (errorTabel) {
        setErrorSeProv(errorTabel);
      } finally {
        setLoadingSeProv(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    console.log(maxValue, "ini max value");
  }, []);

  const [dataMapKabKota, setDataMapKabKota] = useState([]);
  const [errorKabKota, setErrorKabKota] = useState(false);
  const [loadingKabKota, setLoadingKabKota] = useState(false);

  const getDataMapKabKota = ({ kodeDdn }) => {
    const fetchData = async () => {
      try {
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
        // const updatedGeoJSON = matchValueSeriesWithGeoJson(valueSeries, dataMapKabKota?.data[0]?.geojson);
        setDataMapKabKota(dataMapKabKota?.data[0]?.geojson);
        setNamaMap("Daerah");
        echarts.registerMap("Daerah", dataMapKabKota?.data[0]?.geojson);
        setIsMapRegistered(true);
      } catch (errorTabel) {
        setErrorKabKota(errorTabel);
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
          : item.name || "N/A", // Ambil name dari geoJSON jika ada
      };
    } else {
      return {
        ...item,
        name: nameMap[item.name] || item.name || "N/A", // Jika tidak ada di nameMap, tetap gunakan nama asli
      };
    }
  });

  // Contoh pemanggilan fungsi

  const updateGeoJSONWithValues = (geojson, values) => {
    return {
      ...geojson,
      features: geojson.features.map((feature) => {
        const matchedValue = values.find(
          (item) => item.id === feature.properties.key,
        );
        return {
          ...feature,
          properties: {
            ...feature.properties,
            value: matchedValue ? matchedValue.value : 0, // Set default 0 jika tidak ditemukan
            name: matchedValue
              ? feature.properties.name
              : feature.properties.name, // Ganti nama dari geoJSON
          },
        };
      }),
    };
  };

  useEffect(() => {
    if (
      geoJsonIndo &&
      geoJsonIndo.type === "FeatureCollection" &&
      daerah == false
    ) {
      setNamaMap("Indonesia");
      echarts.registerMap("Indonesia", geoJsonIndo);
      setIsMapRegistered(true);
    } else {
      console.error("Invalid geoJSON format:", geoJsonIndo);
    }
  }, [daerah]);

  // const maxPopulation = Math.max(...valueSeries.map(item => item.value));
  const getOption = () => ({
    title: {
      text: chartTitle,
      left: "center",
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
      bottom: "20%",
      min: 0,
      max: maxValue || 100,
      orient: "horizontal",
      inRange: {
        color: colorData || ["#FCAD24", "#57E7B4"], // Default jika tidak valid
      },
      text: ["Tinggi", "Rendah"],
      calculable: true,
    },
    series: [
      {
        name: "Population Density",
        type: "map",
        map: namaMap,
        layoutCenter: roam ? "" : ["50%", "35%"],
        layoutSize: daerah ? "60%" : "100%",
        zoom: roam ? "" : 0,
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
      if (params?.data?.name) {
        const clickedFeature = geoJsonIndo?.features?.find(
          (feature) => feature.properties.name === params.data.name,
        );

        const clickedFeatureSeprov = dataMapSeProv?.features?.find(
          (feature) => feature.properties.name === params.data.name,
        );

        if (clickedFeature) {
          onRegionClick(
            clickedFeature.properties.key,
            clickedFeature.properties.name,
          );
          getDataMapSeProv({ kodeProv: clickedFeature.properties.key });
        } else if (clickedFeatureSeprov) {
          onKabKotaClick(
            clickedFeatureSeprov.properties.key,
            clickedFeatureSeprov.properties.name,
          );
        } else {
          console.log("Data wilayah tidak ditemukan!");
        }

        //  else {
        //   console.log("Data wilayah tidak ditemukan!");
        // }
      }
    },
  };

  return isMapRegistered ? (
    <ReactEcharts
      option={getOption()}
      onEvents={onEvents}
      style={{ height: "600px", width: "100%" }}
    />
  ) : (
    <div>Loading map...</div>
  );
};

export default MapIndoChart;
