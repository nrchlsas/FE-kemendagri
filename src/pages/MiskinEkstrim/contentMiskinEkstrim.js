import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Label,
  Nav,
  Row,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
} from "reactstrap";
import { BarChart } from "../Charts/ChartsJs/ChartsJs";
import { BarLabelChart } from "../Charts/ECharts/ECharts";
import ReactEcharts from "echarts-for-react";
import { Bar } from "react-chartjs-2";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactApexChart from "react-apexcharts";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import classnames from "classnames";
// import axios from "axios";
// import FeatherIcon from "feather-icons-react";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const contentMiskinEkstrim = () => {
  const [dataGrafikLabel, setDataGrafikLabel] = useState([]);
  const [dataGrafikValue, setDataGrafikValue] = useState([]);

  const [dataGrafikLabelKab, setDataGrafikLabelKab] = useState([]);
  const [dataGrafikValueKab, setDataGrafikValueKab] = useState([]);

  const [dataGrafikLabelKota, setDataGrafikLabelKota] = useState([]);
  const [dataGrafikValueKota, setDataGrafikValueKota] = useState([]);

  const [dataGrafikLabelKomp, setDataGrafikLabelKomp] = useState([]);
  const [dataGrafikValueKomp, setDataGrafikValueKomp] = useState([]);

  const [dataGrafikLabelKompKab, setDataGrafikLabelKompKab] = useState([]);
  const [dataGrafikValueKompKab, setDataGrafikValueKompKab] = useState([]);

  const [dataGrafikLabelKompKota, setDataGrafikLabelKompKota] = useState([]);
  const [dataGrafikValueKompKota, setDataGrafikValueKompKota] = useState([]);

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [customActiveTab1, setcustomActiveTab1] = useState("1");
  const [customActiveTabChart, setcustomActiveTabChart] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const toggleCustomDaerah = (tab) => {
    if (customActiveTab1 !== tab) {
      setcustomActiveTab1(tab);
    }
  };
  const toggleCustomChart = (tab) => {
    if (customActiveTabChart !== tab) {
      setcustomActiveTabChart(tab);
    }
  };

  //Belanja Nasional
  const [dataBelanjaNas, setdataBelanjaNas] = useState([]);
  const [loadingProv, setLoadingProv] = useState(true);
  const [errorProv, setErrorProv] = useState(null);

  const getDataBelanjaNasional = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPendapatan from konsolidasi_apbd where kode_akun = '4'",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/KE_TotalBelanjaNasional`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataBelanjaNas = await response.json();

        const formatDataBelanjaNas = `${parseFloat(
          dataBelanjaNas.data.datarows[0][0].toFixed(2)
        )} T`;
        setdataBelanjaNas(formatDataBelanjaNas);

        // setdataBelanjaNas(formatDataBelanjaNas);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  //Anggaran Kemiskinan Ekstrem Nasional
  const [dataAnggaranKemNas, setdataAnggaranKemNas] = useState([]);
  const getDataKemiskinanEkstremNasional = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT SUM(total_rincian)/1000000000000 FROM konsolidasi_apbd WHERE kode_akun='5' and strategi_kemiskinan != ''",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/KE_AnggaranNasional`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataAnggaranKemNas = await response.json();
        const formatDataBelanjaNas = `${parseFloat(
          dataAnggaranKemNas.data.datarows[0][0].toFixed(2)
        )} T`;
        console.log(
          dataAnggaranKemNas.datarows,
          "anggaran kemiskinan ekstrem nasional"
        );
        // setData(data.hits.hits);
        setdataAnggaranKemNas(formatDataBelanjaNas);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  //set Belanja Prov
  const [dataBelanjaProv, setdataBelanjaProv] = useState([]);
  const getDataBelanjaProv = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT SUM ( total_rincian )/1000000000000 AS total FROM	konsolidasi_apbd WHERE	kode_akun = '5' AND nama_prov = nama_daerah",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/KE_TotalBelanjaProvinsi`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataBelanjaProv = await response.json();
        console.log(dataBelanjaProv.datarows, "belanja prov");
        const formatDataBelanjaNas = `${parseFloat(
          dataBelanjaProv.data.datarows[0][0].toFixed(2)
        )} T`;
        // setData(data.hits.hits);
        setdataBelanjaProv(formatDataBelanjaNas);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  //set anggaran Belanja Prov
  const [dataAnggaranKemProv, setdataAnggaranKemProv] = useState([]);
  const getDataKemiskinanEkstremProv = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT SUM ( total_rincian )/1000000000000 AS total FROM konsolidasi_apbd WHERE kode_akun = '5' AND nama_prov = nama_daerah AND strategi_kemiskinan != ''",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/KE_AnggaranProvinsi`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataAnggaranKemProv = await response.json();
        console.log(dataAnggaranKemProv.datarows, "anggaran K.E provinsi");
        // setData(data.hits.hits);
        const formatDataBelanjaNas = `${parseFloat(
          dataAnggaranKemProv.data.datarows[0][0].toFixed(2)
        )} T`;
        setdataAnggaranKemProv(formatDataBelanjaNas);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };
  //total daerah menganggarkan
  const [dataTotalDaerahMenganggarkan, setdataTotalDaerahMenganggarkan] =
    useState([]);
  const getDataTotalDaerahMeanggarkan = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT COUNT (DISTINCT nama_daerah) AS jumlah_daerah FROM	konsolidasi_apbd WHERE kode_akun = '5' 	AND strategi_kemiskinan  != ''",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/KE_TotalDaerahMenganggar`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTotalDaerahMenganggarkan = await response.json();
        console.log(
          dataTotalDaerahMenganggarkan.datarows,
          "total daerah menganggarkan"
        );
        // setData(data.hits.hits);
        setdataTotalDaerahMenganggarkan(dataTotalDaerahMenganggarkan.data);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  //total daerah tidak menganggarkan
  const [dataTotalDaerahNotMenganggarkan, setdataTotalDaerahNotMenganggarkan] =
    useState([]);
  const getDataTotalDaerahNotMenganggarkan = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT (546- COUNT (DISTINCT nama_daerah)) AS jumlah_daerah FROM konsolidasi_apbd WHERE kode_akun = '5' AND strategi_kemiskinan != ''",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/KE_TotalDaerahTidakMenganggar`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTotalDaerahNotMenganggarkan = await response.json();
        console.log(
          dataTotalDaerahNotMenganggarkan.datarows,
          "total daerah tidak menganggarkan"
        );
        // setData(data.hits.hits);
        setdataTotalDaerahNotMenganggarkan(
          dataTotalDaerahNotMenganggarkan.data
        );
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  //total prov menganggarkan
  const [dataTotalProvMenganggarkan, setdataTotalProvMenganggarkan] = useState(
    []
  );
  const getTotalProvMenganggarkan = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GEt",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT COUNT (DISTINCT nama_prov)AS jumlah_daerah FROM	konsolidasi_apbd WHERE	kode_akun = '5' AND nama_daerah=nama_prov	AND strategi_kemiskinan != ''",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/KE_TotalProvMenganggar`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTotalProvMenganggarkan = await response.json();
        console.log(
          dataTotalProvMenganggarkan.datarows,
          "total prov menganggarkan"
        );
        // setData(data.hits.hits);
        setdataTotalProvMenganggarkan(dataTotalProvMenganggarkan.data);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  //total prov tidak menganggarkan
  const [dataTotalProvNotMenganggarkan, setdataTotalProvNotMenganggarkan] =
    useState([]);
  const getTotalProvNotMenganggarkan = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT (38- COUNT (DISTINCT nama_prov)) AS jumlah_daerah FROM konsolidasi_apbd WHERE kode_akun = '5' AND nama_daerah=nama_prov AND strategi_kemiskinan != ''",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/KE_TotalProvTidakMenganggar`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTotalProvNotMenganggarkan = await response.json();
        console.log(
          dataTotalProvNotMenganggarkan.datarows,
          "total prov tidak menganggarkan"
        );
        // setData(data.hits.hits);
        setdataTotalProvNotMenganggarkan(dataTotalProvNotMenganggarkan.data);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  // Grafik Alokasi Anggaran Miskin Pemerintah Daerah Provinsi
  const [dataGrafikAnggaranMiskinProv, setdataGrafikAnggaranMiskinProv] =
    useState([]);
  const getGrafikAlokasi = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT nama_prov, nama_daerah, SUM ( total_rincian ) AS total FROM konsolidasi_apbd WHERE kode_akun = '5' AND nama_prov = nama_daerah AND strategi_kemiskinan != '' GROUP BY nama_prov,nama_daerah ORDER BY nama_prov,nama_daerah",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/KE_GrafikaAllokasiAnggaranProv`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataGrafikAnggaranMiskinProv = await response.json();
        console.log(
          dataGrafikAnggaranMiskinProv.data.datarows,
          "Grafik Alokasi Anggaran Miskin Pemerintah Daerah Provinsi"
        );
        // setData(data.hits.hits);
        setdataGrafikAnggaranMiskinProv(
          dataGrafikAnggaranMiskinProv.data.datarows
        );
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataGrafikAnggaranMiskinProv.datarows.map(hit => ({
        //     value: hit[2],
        //     label: hit[0]
        // }));
        const dataGrafikLabel1 = dataGrafikAnggaranMiskinProv.data.datarows.map(
          (labelGrafik) => labelGrafik[0]
        );
        setDataGrafikLabel(dataGrafikLabel1);

        const dataGrafikValue1 = dataGrafikAnggaranMiskinProv.data.datarows.map(
          (labelGrafik) => labelGrafik[2]
        );
        setDataGrafikValue(dataGrafikValue1);

        setSingleOptions(options);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  // Grafik Alokasi Anggaran Miskin Pemerintah Daerah Kabupaten
  const [dataGrafikAnggaranMiskinKab, setdataGrafikAnggaranMiskinKab] =
    useState([]);
  const getGrafikAlokasiKab = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT nama_daerah, SUM ( total_rincian ) AS total FROM konsolidasi_apbd WHERE kode_akun = '5' AND SUBSTRING (nama_daerah,1,3)='Kab' AND strategi_kemiskinan !='' GROUP BY nama_daerah ORDER BY nama_daerah;",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          // "https://192.168.128.72:9220/_plugins/_sql",
          `${API_URI}/KE_GrafikaAllokasiAnggaranKab`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataGrafikAnggaranMiskinKab = await response.json();
        console.log(
          dataGrafikAnggaranMiskinKab.datarows,
          "Grafik Alokasi Anggaran Miskin Pemerintah Daerah Kabupaten"
        );
        // setData(data.hits.hits);
        setdataGrafikAnggaranMiskinKab(dataGrafikAnggaranMiskinKab);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataGrafikAnggaranMiskinProv.datarows.map(hit => ({
        //     value: hit[2],
        //     label: hit[0]
        // }));
        const dataGrafikLabel1 = dataGrafikAnggaranMiskinKab.data.datarows.map(
          (labelGrafik) => labelGrafik[0]
        );
        setDataGrafikLabelKab(dataGrafikLabel1);

        const dataGrafikValue1 = dataGrafikAnggaranMiskinKab.data.datarows.map(
          (labelGrafik) => labelGrafik[1]
        );
        setDataGrafikValueKab(dataGrafikValue1);
        console.log(dataGrafikValueKab, "ini value kabupaten 122321313");

        setSingleOptions(options);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  // Grafik Alokasi Anggaran Miskin Pemerintah Daerah Kota
  const [dataGrafikAnggaranMiskinKota, setdataGrafikAnggaranMiskinKota] =
    useState([]);
  const getGrafikAlokasiKota = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT nama_daerah,SUM ( total_rincian ) AS total FROM konsolidasi_apbd WHERE kode_akun = '5' AND SUBSTRING (nama_daerah,1,4)='Kota' AND strategi_kemiskinan !=''GROUP BY nama_daerah ORDER BY nama_daerah",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          // "https://192.168.128.72:9220/_plugins/_sql",
          `${API_URI}/KE_GrafikaAllokasiAnggaranKota`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataGrafikAnggaranMiskinKota = await response.json();
        console.log(
          dataGrafikAnggaranMiskinKota.datarows,
          "Grafik Alokasi Anggaran Miskin Pemerintah Daerah kota"
        );
        // setData(data.hits.hits);
        setdataGrafikAnggaranMiskinKota(dataGrafikAnggaranMiskinKota);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataGrafikAnggaranMiskinProv.datarows.map(hit => ({
        //     value: hit[2],
        //     label: hit[0]
        // }));
        const dataGrafikLabel1 = dataGrafikAnggaranMiskinKota.data.datarows.map(
          (labelGrafik) => labelGrafik[0]
        );
        setDataGrafikLabelKota(dataGrafikLabel1);

        const dataGrafikValue1 = dataGrafikAnggaranMiskinKota.data.datarows.map(
          (labelGrafik) => labelGrafik[1]
        );
        setDataGrafikValueKota(dataGrafikValue1);

        setSingleOptions(options);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  // Grafik Komposisi
  const [dataGrafikSuppKemiskinanDaerah, setdataGrafikSuppKemiskinanDaerah] =
    useState([]);
  const getDataGrafikKomposisi = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT nama_jenis, SUM ( total_rincian ) AS total FROM konsolidasi_apbd WHERE kode_akun = '5' AND nama_prov = nama_daerah AND strategi_kemiskinan != '' GROUP BY nama_jenis ORDER BY nama_jenis",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          // "https://192.168.128.72:9220/_plugins/_sql",
          `${API_URI}/KE_KomposisiBelanja`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataGrafikSuppKemiskinanDaerah = await response.json();
        console.log(
          dataGrafikSuppKemiskinanDaerah.datarows,
          "Grafik Komposisi Support"
        );
        setdataGrafikSuppKemiskinanDaerah(dataGrafikSuppKemiskinanDaerah);

        const dataGrafikLabel1 =
          dataGrafikSuppKemiskinanDaerah.data.datarows.map(
            (labelGrafik) => labelGrafik[0]
          );
        setDataGrafikLabelKomp(dataGrafikLabel1);
        console.log(dataGrafikLabel1, "ini label komposisi");

        const dataGrafikValue1 =
          dataGrafikSuppKemiskinanDaerah.data.datarows.map(
            (labelGrafik) => labelGrafik[1]
          );
        setDataGrafikValueKomp(dataGrafikValue1);
        console.log(dataGrafikValue1, "ini value komposisi");

        //   const objects = dataGrafikSuppKemiskinanDaerah.datarows.map(category => ({
        //     name: category[0],
        //     type: "bar",
        //     barGap: 0,
        //     label: labelOption,
        //     emphasis: {
        //       focus: "series",
        //     },
        //     data: category[1],
        //   }));

        //   console.log(objects, 'ini objects')
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  // Grafik Komposisi Kabupaten
  const [
    dataGrafikSuppKemiskinanDaerahKab,
    setdataGrafikSuppKemiskinanDaerahKab,
  ] = useState([]);
  const getDataGrafikKomposisiKab = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT nama_jenis,SUM ( total_rincian ) AS total FROM konsolidasi_apbd WHERE kode_akun = '5' AND SUBSTRING(nama_daerah,1,3)='Kab' AND strategi_kemiskinan !='' GROUP BY nama_jenis ORDER BY nama_jenis",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          // "https://192.168.128.72:9220/_plugins/_sql",
          `${API_URI}/KE_KomposisiBelanjaKab`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataGrafikSuppKemiskinanDaerahKab = await response.json();
        console.log(
          dataGrafikSuppKemiskinanDaerahKab.datarows,
          "Grafik Komposisi Support Kabupaten"
        );
        setdataGrafikSuppKemiskinanDaerahKab(dataGrafikSuppKemiskinanDaerahKab);

        const dataGrafikLabel1 =
          dataGrafikSuppKemiskinanDaerahKab.data.datarows.map(
            (labelGrafik) => labelGrafik[0]
          );
        setDataGrafikLabelKompKab(dataGrafikLabel1);
        console.log(dataGrafikLabel1, "ini label komposisi kabupaten");

        const dataGrafikValue1 =
          dataGrafikSuppKemiskinanDaerahKab.data.datarows.map(
            (labelGrafik) => labelGrafik[1]
          );
        setDataGrafikValueKompKab(dataGrafikValue1);
        console.log(dataGrafikValue1, "ini value komposisi kabupaten");

        //   const objects = dataGrafikSuppKemiskinanDaerah.datarows.map(category => ({
        //     name: category[0],
        //     type: "bar",
        //     barGap: 0,
        //     label: labelOption,
        //     emphasis: {
        //       focus: "series",
        //     },
        //     data: category[1],
        //   }));

        //   console.log(objects, 'ini objects')
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  // Grafik Komposisi Kota
  const [
    dataGrafikSuppKemiskinanDaerahKota,
    setdataGrafikSuppKemiskinanDaerahKota,
  ] = useState([]);
  const getDataGrafikKomposisiKota = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "SELECT nama_jenis,SUM ( total_rincian ) AS total FROM konsolidasi_apbd WHERE kode_akun = '5' AND SUBSTRING(nama_daerah,1,3)='Kab' AND strategi_kemiskinan !='' GROUP BY nama_jenis ORDER BY nama_jenis",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          // "https://192.168.128.72:9220/_plugins/_sql",
          `${API_URI}/KE_KomposisiBelanjaKota`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataGrafikSuppKemiskinanDaerahKota = await response.json();
        console.log(
          dataGrafikSuppKemiskinanDaerahKota.data.datarows,
          "Grafik Komposisi Support Kota"
        );

        // const mappedData = dataGrafikSuppKemiskinanDaerahKota.datarows.map(item => {
        //   return {
        //     name: item[0],
        //     data: [item[1]]
        //   };
        // });

        // console.log(mappedData, 'ini isi mapped data')
        // setdataGrafikSuppKemiskinanDaerahKota(mappedData);

        const dataGrafikLabel1 =
          dataGrafikSuppKemiskinanDaerahKota.data.datarows.map(
            (labelGrafik) => labelGrafik[0]
          );
        setDataGrafikLabelKompKota(dataGrafikLabel1);
        console.log(dataGrafikLabel1, "ini label komposisi kota");

        const dataGrafikValue1 =
          dataGrafikSuppKemiskinanDaerahKota.data.datarows.map(
            (labelGrafik) => labelGrafik[1]
          );
        setDataGrafikValueKompKota(dataGrafikValue1);
        console.log(dataGrafikValue1, "ini value komposisi kota");

        //   const objects = dataGrafikSuppKemiskinanDaerah.datarows.map(category => ({
        //     name: category[0],
        //     type: "bar",
        //     barGap: 0,
        //     label: labelOption,
        //     emphasis: {
        //       focus: "series",
        //     },
        //     data: category[1],
        //   }));

        //   console.log(objects, 'ini objects')
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  };

  const [
    dataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja,
    setDataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja,
  ] = useState([]);
  const [
    loadingPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja,
    setLoadingPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja,
  ] = useState(true);
  const [
    errorPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja,
    setErrorPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja,
  ] = useState(null);

  const getDataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPendapatan from konsolidasi_apbd where kode_akun = '4'",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/dash_ke_akbar_3`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja = await response.json();

        const value = []
        const keyChart = ['Total Belanja Nasional', 'Total Anggaran Untuk Penanganan kemiskinan Ekstrem']

        dataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja.data['2'].buckets.map((item, index) => value.push({value : item['1'].value, name:keyChart[index]}))
        
        // const formatDataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja = `${parseFloat(
        //   dataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja.data.datarows[0][0].toFixed(2)
        // )} T`;
        setDataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja(
          value
        );

        // setdataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja(formatDataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja) {
        setErrorPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja(
          errorPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja
        );
      } finally {
        setLoadingPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja(false);
      }
    };

    fetchData();
  };

  const [
    dataTop5UrusanPemerintahKemiskinanEkstrem,
    setDataTop5UrusanPemerintahKemiskinanEkstrem,
  ] = useState([]);
  const [
    dataKeyTop5UrusanPemerintahKemiskinanEkstrem,
    setDataKeyTop5UrusanPemerintahKemiskinanEkstrem,
  ] = useState([]);
  const [
    loadingTop5UrusanPemerintahKemiskinanEkstrem,
    setLoadingTop5UrusanPemerintahKemiskinanEkstrem,
  ] = useState(true);
  const [
    errorTop5UrusanPemerintahKemiskinanEkstrem,
    setErrorTop5UrusanPemerintahKemiskinanEkstrem,
  ] = useState(null);

  const getDataTop5UrusanPemerintahKemiskinanEkstrem = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPendapatan from konsolidasi_apbd where kode_akun = '4'",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/dash_ke_akbar_4`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTop5UrusanPemerintahKemiskinanEkstrem = await response.json();

        const mappedData = dataTop5UrusanPemerintahKemiskinanEkstrem.data.nama_bidang_urusan.buckets.map(item => item.total_rincian.value)
        const mappedKeys = dataTop5UrusanPemerintahKemiskinanEkstrem.data.nama_bidang_urusan.buckets.map(item => item.key)
        // const formatDataTop5UrusanPemerintahKemiskinanEkstrem = `${parseFloat(
        //   dataTop5UrusanPemerintahKemiskinanEkstrem.data.datarows[0][0].toFixed(2)
        // )} T`;
        setDataTop5UrusanPemerintahKemiskinanEkstrem(
          mappedData
        );

        setDataKeyTop5UrusanPemerintahKemiskinanEkstrem(
          mappedKeys
        )

        // setdataTop5UrusanPemerintahKemiskinanEkstrem(formatDataTop5UrusanPemerintahKemiskinanEkstrem);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorTop5UrusanPemerintahKemiskinanEkstrem) {
        setErrorTop5UrusanPemerintahKemiskinanEkstrem(
          errorTop5UrusanPemerintahKemiskinanEkstrem
        );
      } finally {
        setLoadingTop5UrusanPemerintahKemiskinanEkstrem(false);
      }
    };

    fetchData();
  };

  const [
    dataTop5AnggaranProvMiskinEkstrem,
    setDataTop5AnggaranProvMiskinEkstrem,
  ] = useState([]);
  const [
    dataKeyTop5AnggaranProvMiskinEkstrem,
    setDataKeyTop5AnggaranProvMiskinEkstrem,
  ] = useState([]);
  const [
    loadingTop5AnggaranProvMiskinEkstrem,
    setLoadingTop5AnggaranProvMiskinEkstrem,
  ] = useState(true);
  const [
    errorTop5AnggaranProvMiskinEkstrem,
    setErrorTop5AnggaranProvMiskinEkstrem,
  ] = useState(null);

  const getDataTop5AnggaranProvMiskinEkstrem = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPendapatan from konsolidasi_apbd where kode_akun = '4'",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/dash_ke_akbar_5`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTop5AnggaranProvMiskinEkstrem = await response.json();

        const mappedData = dataTop5AnggaranProvMiskinEkstrem.data['2'].buckets.map(item => 
          item['1'].value
        )
        const mappedKeys = dataTop5AnggaranProvMiskinEkstrem.data['2'].buckets.map(item => 
          item.key
        )
        console.log(mappedData, 'ini top 5 anggaran prov miskin ekstrem')
        // const formatDataTop5AnggaranProvMiskinEkstrem = `${parseFloat(
        //   dataTop5AnggaranProvMiskinEkstrem.data.datarows[0][0].toFixed(2)
        // )} T`;
        setDataTop5AnggaranProvMiskinEkstrem(mappedData);

        setDataKeyTop5AnggaranProvMiskinEkstrem(mappedKeys);

        // setdataTop5AnggaranProvMiskinEkstrem(formatDataTop5AnggaranProvMiskinEkstrem);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorTop5AnggaranProvMiskinEkstrem) {
        setErrorTop5AnggaranProvMiskinEkstrem(
          errorTop5AnggaranProvMiskinEkstrem
        );
      } finally {
        setLoadingTop5AnggaranProvMiskinEkstrem(false);
      }
    };

    fetchData();
  };

  const [
    dataBottom5AnggaranProvMiskinEkstrem,
    setDataBottom5AnggaranProvMiskinEkstrem,
  ] = useState([]);
  const [
    dataKeyBottom5AnggaranProvMiskinEkstrem,
    setDataKeyBottom5AnggaranProvMiskinEkstrem,
  ] = useState([]);
  const [
    loadingBottom5AnggaranProvMiskinEkstrem,
    setLoadingBottom5AnggaranProvMiskinEkstrem,
  ] = useState(true);
  const [
    errorBottom5AnggaranProvMiskinEkstrem,
    setErrorBottom5AnggaranProvMiskinEkstrem,
  ] = useState(null);

  const getDataBottom5AnggaranProvMiskinEkstrem = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPendapatan from konsolidasi_apbd where kode_akun = '4'",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/dash_ke_akbar_6`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataBottom5AnggaranProvMiskinEkstrem = await response.json();

        console.log(
          dataBottom5AnggaranProvMiskinEkstrem.data["2"].buckets,
          "ini top 5 urusan KE"
        );

        const mappedData = dataBottom5AnggaranProvMiskinEkstrem.data['2'].buckets.map(item => item['1'].value)
        const mappedKeys = dataBottom5AnggaranProvMiskinEkstrem.data['2'].buckets.map(item => item.key)
        // const formatDataBottom5AnggaranProvMiskinEkstrem = `${parseFloat(
        //   dataBottom5AnggaranProvMiskinEkstrem.data.datarows[0][0].toFixed(2)
        // )} T`;
        setDataBottom5AnggaranProvMiskinEkstrem(
          mappedData
        );

        setDataKeyBottom5AnggaranProvMiskinEkstrem(mappedKey)

        // setdataBottom5AnggaranProvMiskinEkstrem(formatDataBottom5AnggaranProvMiskinEkstrem);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorBottom5AnggaranProvMiskinEkstrem) {
        setErrorBottom5AnggaranProvMiskinEkstrem(
          errorBottom5AnggaranProvMiskinEkstrem
        );
      } finally {
        setLoadingBottom5AnggaranProvMiskinEkstrem(false);
      }
    };

    fetchData();
  };

  const [
    dataTop5AkunBelanjaKemiskinanEkstrem,
    setDataTop5AkunBelanjaKemiskinanEkstrem,
  ] = useState([]);
  const [
    dataKeyTop5AkunBelanjaKemiskinanEkstrem,
    setDataKeyTop5AkunBelanjaKemiskinanEkstrem,
  ] = useState([]);
  const [
    loadingTop5AkunBelanjaKemiskinanEkstrem,
    setLoadingTop5AkunBelanjaKemiskinanEkstrem,
  ] = useState(true);
  const [
    errorTop5AkunBelanjaKemiskinanEkstrem,
    setErrorTop5AkunBelanjaKemiskinanEkstrem,
  ] = useState(null);

  const getDataTop5AkunBelanjaKemiskinanEkstrem = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPendapatan from konsolidasi_apbd where kode_akun = '4'",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/dash_ke_akbar_7`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTop5AkunBelanjaKemiskinanEkstrem = await response.json();

        console.log(
          dataTop5AkunBelanjaKemiskinanEkstrem,
          "ini top 5 akun belanjaaa brpopoooo"
        );


        const mappedData = dataTop5AkunBelanjaKemiskinanEkstrem.data['2'].buckets.map(item => item['1'].value)
        const mappedKey = dataTop5AkunBelanjaKemiskinanEkstrem.data['2'].buckets.map(item => item.key)
        // const formatDataTop5AkunBelanjaKemiskinanEkstrem = `${parseFloat(
        //   dataTop5AkunBelanjaKemiskinanEkstrem.data.datarows[0][0].toFixed(2)
        // )} T`;
        setDataTop5AkunBelanjaKemiskinanEkstrem(
          mappedData
        );
        
        setDataKeyTop5AkunBelanjaKemiskinanEkstrem(mappedKey)

        // setdataTop5AkunBelanjaKemiskinanEkstrem(formatDataTop5AkunBelanjaKemiskinanEkstrem);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorTop5AkunBelanjaKemiskinanEkstrem) {
        setErrorTop5AkunBelanjaKemiskinanEkstrem(
          errorTop5AkunBelanjaKemiskinanEkstrem
        );
      } finally {
        setLoadingTop5AkunBelanjaKemiskinanEkstrem(false);
      }
    };

    fetchData();
  };

  const [
    dataPerbandinganSpmKemiskinanEkstrem,
    setDataPerbandinganSpmKemiskinanEkstrem,
  ] = useState([]);
  const [
    dataKeyPerbandinganSpm,
    setDataKeyPerbandinganSpm,
  ] = useState([]);
  const [
    loadingPerbandinganSpmKemiskinanEkstrem,
    setLoadingPerbandinganSpmKemiskinanEkstrem,
  ] = useState(true);
  const [
    errorPerbandinganSpmKemiskinanEkstrem,
    setErrorPerbandinganSpmKemiskinanEkstrem,
  ] = useState(null);

  const getDataPerbandinganSpmKemiskinanEkstrem = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPendapatan from konsolidasi_apbd where kode_akun = '4'",
          // }),
        };
        // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        const response = await fetch(
          `${API_URI}/dash_ke_akbar_8`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPerbandinganSpmKemiskinanEkstrem = await response.json();
        
        const mappedData = dataPerbandinganSpmKemiskinanEkstrem.data['2'].buckets.map(item => item['1'].value)
        const mappedKeys = dataPerbandinganSpmKemiskinanEkstrem.data['2'].buckets.map(item => item.key)
        
        console.log(dataPerbandinganSpmKemiskinanEkstrem, 'ini isi spm broooo')
        // const formatDataPerbandinganSpmKemiskinanEkstrem = `${parseFloat(
        //   dataPerbandinganSpmKemiskinanEkstrem.data.datarows[0][0].toFixed(2)
        // )} T`;
        setDataPerbandinganSpmKemiskinanEkstrem(
          mappedData
        );

        setDataKeyPerbandinganSpm(mappedKeys)

        // setdataPerbandinganSpmKemiskinanEkstrem(formatDataPerbandinganSpmKemiskinanEkstrem);
        // const options = data.hits.hits.map(hit => ({
        //     value: hit._source.kode_wil_prop,
        //     label: hit._source.nama_prop
        // }));
        // const options = dataBel.datarows.map(hit => ({
        //     value: hit[0],
        //     label: hit[1]
        // }));
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        // console.log(data.hits.hits)
        console.log(singleOptions);
      } catch (errorPerbandinganSpmKemiskinanEkstrem) {
        setErrorPerbandinganSpmKemiskinanEkstrem(
          errorPerbandinganSpmKemiskinanEkstrem
        );
      } finally {
        setLoadingPerbandinganSpmKemiskinanEkstrem(false);
      }
    };

    fetchData();
  };

  useEffect(() => {
    getDataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja();
    getDataPerbandinganSpmKemiskinanEkstrem();
    getDataTop5AkunBelanjaKemiskinanEkstrem();
    getDataBottom5AnggaranProvMiskinEkstrem();
    getDataTop5AnggaranProvMiskinEkstrem();
    getDataTop5UrusanPemerintahKemiskinanEkstrem();
    getDataBelanjaNasional();
    getDataKemiskinanEkstremNasional();
    getDataBelanjaProv();
    getDataKemiskinanEkstremProv();
    getDataTotalDaerahMeanggarkan();
    getDataTotalDaerahNotMenganggarkan();
    getTotalProvMenganggarkan();
    getTotalProvNotMenganggarkan();
    getGrafikAlokasi();
    getGrafikAlokasiKab();
    getGrafikAlokasiKota();
    getDataGrafikKomposisi();
    getDataGrafikKomposisiKab();
    getDataGrafikKomposisiKota();
  }, []);

  const BarChartAlokasi = ({ dataColors }) => {
    var barChartColor = getChartColorsArray(dataColors);
    const data = {
      labels: dataGrafikLabel,
      datasets: [
        {
          label: "Total Rincian",
          backgroundColor: barChartColor[0],
          borderColor: barChartColor[0],
          borderWidth: 1,
          hoverBackgroundColor: barChartColor[1],
          hoverBorderColor: barChartColor[1],
          data: dataGrafikValue,
        },
      ],
    };
    const option = {
      x: {
        ticks: {
          font: {
            family: "Poppins",
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: "Poppins",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: "Poppins",
            },
          },
        },
      },
    };

    return (
      <React.Fragment>
        <Bar width={723} height={"200px"} data={data} options={option} />
      </React.Fragment>
    );
  };
  const BarChartAlokasiKab = ({ dataColors }) => {
    var barChartColor = getChartColorsArray(dataColors);
    const data = {
      labels: dataGrafikLabelKab,
      datasets: [
        {
          label: "Total Rincian",
          backgroundColor: barChartColor[0],
          borderColor: barChartColor[0],
          borderWidth: 1,
          hoverBackgroundColor: barChartColor[1],
          hoverBorderColor: barChartColor[1],
          data: dataGrafikValueKab,
        },
      ],
    };
    const option = {
      x: {
        ticks: {
          font: {
            family: "Poppins",
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: "Poppins",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: "Poppins",
            },
          },
        },
      },
    };

    return (
      <React.Fragment>
        <Bar width={723} height={"200px"} data={data} options={option} />
      </React.Fragment>
    );
  };

  const BarChartAlokasiKota = ({ dataColors }) => {
    var barChartColor = getChartColorsArray(dataColors);
    const data = {
      labels: dataGrafikLabelKota,
      datasets: [
        {
          label: "Total Rincian",
          backgroundColor: barChartColor[0],
          borderColor: barChartColor[0],
          borderWidth: 1,
          hoverBackgroundColor: barChartColor[1],
          hoverBorderColor: barChartColor[1],
          data: dataGrafikValueKota,
        },
      ],
    };
    const option = {
      x: {
        ticks: {
          font: {
            family: "Poppins",
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: "Poppins",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: "Poppins",
            },
          },
        },
      },
    };

    return (
      <React.Fragment>
        <Bar width={723} height={"200px"} data={data} options={option} />
      </React.Fragment>
    );
  };

  const BarLabelChartKomposisi = ({ dataColors }) => {
    var chartBarLabelRotationColors = getChartColorsArray(dataColors);
    var app = {};
    var myChart;

    var posList = [
      "left",
      "right",
      "top",
      "bottom",
      "inside",
      "insideTop",
      "insideLeft",
      "insideRight",
      "insideBottom",
      "insideTopLeft",
      "insideTopRight",
      "insideBottomLeft",
      "insideBottomRight",
    ];
    app.configParameters = {
      rotate: {
        min: -90,
        max: 90,
      },
      align: {
        options: {
          left: "left",
          center: "center",
          right: "right",
        },
      },
      verticalAlign: {
        options: {
          top: "top",
          middle: "middle",
          bottom: "bottom",
        },
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos;
          return map;
        }, {}),
      },
      distance: {
        min: 0,
        max: 100,
      },
    };
    app.config = {
      rotate: 90,
      align: "left",
      verticalAlign: "middle",
      position: "insideBottom",
      distance: 15,
      onChange: function () {
        var labelOption = {
          rotate: app.config.rotate,
          align: app.config.align,
          verticalAlign: app.config.verticalAlign,
          position: app.config.position,
          distance: app.config.distance,
        };
        myChart.setOption({
          series: [
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
          ],
        });
      },
    };
    var labelOption = {
      show: false,
      position: app.config.position,
      distance: app.config.distance,
      align: app.config.align,
      verticalAlign: app.config.verticalAlign,
      rotate: app.config.rotate,
      formatter: "{c}  {name|{a}}",
      fontSize: 16,
      rich: {
        name: {},
      },
    };
    var option = {
      grid: {
        left: "10%",
        right: "10%",
        bottom: "20%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        orient: "horizontal",
        // left: 'left',
        bottom: "bottom",
        textStyle: {
          //The style of the legend text
          color: "#858d98",
        },
        // data: ["Belanja Pegawai", "Belanja Barang Dan Jasa", "Belanja Modal", "Belanja Hibah", "Belanja Lainnya", "Transfer antar Pemda"],
        data: dataGrafikLabelKomp,
        textStyle: {
          //The style of the legend text
          color: "#000000",
        },
      },
      color: chartBarLabelRotationColors,
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: {
            show: true,
          },
          dataView: {
            show: true,
            readOnly: false,
          },
          magicType: {
            show: true,
            type: ["line", "bar", "stack"],
          },
          restore: {
            show: true,
          },
          saveAsImage: {
            show: true,
          },
        },
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            show: false,
          },
          data: ["Provinsi"],
          axisLine: {
            lineStyle: {
              color: "#858d98",
            },
          },
        },
      ],
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#858d98",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(133, 141, 152, 0.1)",
          },
        },
      },
      textStyle: {
        fontFamily: "Poppins, sans-serif",
      },
      series: [
        {
          name: dataGrafikLabelKomp[0],
          type: "bar",
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[0]],
        },
        {
          name: dataGrafikLabelKomp[1],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[1]],
        },
        {
          name: dataGrafikLabelKomp[2],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[2]],
        },
        {
          name: dataGrafikLabelKomp[3],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[3]],
        },
        {
          name: dataGrafikLabelKomp[4],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[4]],
        },
        {
          name: dataGrafikLabelKomp[5],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[5]],
        },
        {
          name: dataGrafikLabelKomp[6],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[6]],
        },
        {
          name: dataGrafikLabelKomp[7],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[7]],
        },
        {
          name: dataGrafikLabelKomp[8],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[8]],
        },
        {
          name: dataGrafikLabelKomp[9],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[9]],
        },
        {
          name: dataGrafikLabelKomp[10],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKomp[10]],
        },
        // {
        //   name: "Belanja Pegawai",
        //   type: "bar",
        //   barGap: 0,
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [320, 332, 301, 334, 390],
        // },
        // {
        //   name: "Belanja Barang Dan Jasa",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [220, 182, 191, 234, 290],
        // },
        // {
        //   name: "Belanja Modal",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [150, 232, 201, 154, 190],
        // },
        // {
        //   name: "Belanja Hibah",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
        // {
        //   name: "Belanja Lainnya",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
        // {
        //   name: "Transfer antar Pemda",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
      ],
    };

    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "400px" }} option={option} />
      </React.Fragment>
    );
  };
  const BarLabelChartKomposisiKab = ({ dataColors }) => {
    var chartBarLabelRotationColors = getChartColorsArray(dataColors);
    var app = {};
    var myChart;

    var posList = [
      "left",
      "right",
      "top",
      "bottom",
      "inside",
      "insideTop",
      "insideLeft",
      "insideRight",
      "insideBottom",
      "insideTopLeft",
      "insideTopRight",
      "insideBottomLeft",
      "insideBottomRight",
    ];
    app.configParameters = {
      rotate: {
        min: -90,
        max: 90,
      },
      align: {
        options: {
          left: "left",
          center: "center",
          right: "right",
        },
      },
      verticalAlign: {
        options: {
          top: "top",
          middle: "middle",
          bottom: "bottom",
        },
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos;
          return map;
        }, {}),
      },
      distance: {
        min: 0,
        max: 100,
      },
    };
    app.config = {
      rotate: 90,
      align: "left",
      verticalAlign: "middle",
      position: "insideBottom",
      distance: 15,
      onChange: function () {
        var labelOption = {
          rotate: app.config.rotate,
          align: app.config.align,
          verticalAlign: app.config.verticalAlign,
          position: app.config.position,
          distance: app.config.distance,
        };
        myChart.setOption({
          series: [
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
          ],
        });
      },
    };
    var labelOption = {
      show: false,
      position: app.config.position,
      distance: app.config.distance,
      align: app.config.align,
      verticalAlign: app.config.verticalAlign,
      rotate: app.config.rotate,
      formatter: "{c}  {name|{a}}",
      fontSize: 16,
      rich: {
        name: {},
      },
    };
    var option = {
      grid: {
        left: "10%",
        right: "10%",
        bottom: "20%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        orient: "horizontal",
        // left: 'left',
        bottom: "bottom",
        textStyle: {
          //The style of the legend text
          color: "#858d98",
        },
        // data: ["Belanja Pegawai", "Belanja Barang Dan Jasa", "Belanja Modal", "Belanja Hibah", "Belanja Lainnya", "Transfer antar Pemda"],
        data: dataGrafikLabelKompKab,
        textStyle: {
          //The style of the legend text
          color: "#000000",
        },
      },
      color: chartBarLabelRotationColors,
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: {
            show: true,
          },
          dataView: {
            show: true,
            readOnly: false,
          },
          magicType: {
            show: true,
            type: ["line", "bar", "stack"],
          },
          restore: {
            show: true,
          },
          saveAsImage: {
            show: true,
          },
        },
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            show: false,
          },
          data: ["Kabupaten"],
          axisLine: {
            lineStyle: {
              color: "#858d98",
            },
          },
        },
      ],
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#858d98",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(133, 141, 152, 0.1)",
          },
        },
      },
      textStyle: {
        fontFamily: "Poppins, sans-serif",
      },
      series: [
        {
          name: dataGrafikLabelKompKab[0],
          type: "bar",
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[0]],
        },
        {
          name: dataGrafikLabelKompKab[1],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[1]],
        },
        {
          name: dataGrafikLabelKompKab[2],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[2]],
        },
        {
          name: dataGrafikLabelKompKab[3],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[3]],
        },
        {
          name: dataGrafikLabelKompKab[4],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[4]],
        },
        {
          name: dataGrafikLabelKompKab[5],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[5]],
        },
        {
          name: dataGrafikLabelKompKab[6],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[6]],
        },
        {
          name: dataGrafikLabelKompKab[7],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[7]],
        },
        {
          name: dataGrafikLabelKompKab[8],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[8]],
        },
        {
          name: dataGrafikLabelKompKab[9],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[9]],
        },
        {
          name: dataGrafikLabelKompKab[10],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKab[10]],
        },
        // {
        //   name: "Belanja Pegawai",
        //   type: "bar",
        //   barGap: 0,
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [320, 332, 301, 334, 390],
        // },
        // {
        //   name: "Belanja Barang Dan Jasa",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [220, 182, 191, 234, 290],
        // },
        // {
        //   name: "Belanja Modal",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [150, 232, 201, 154, 190],
        // },
        // {
        //   name: "Belanja Hibah",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
        // {
        //   name: "Belanja Lainnya",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
        // {
        //   name: "Transfer antar Pemda",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
      ],
    };

    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "400px" }} option={option} />
      </React.Fragment>
    );
  };
  const BarLabelChartKomposisiKota = ({ dataColors }) => {
    var chartBarLabelRotationColors = getChartColorsArray(dataColors);
    var app = {};
    var myChart;

    var posList = [
      "left",
      "right",
      "top",
      "bottom",
      "inside",
      "insideTop",
      "insideLeft",
      "insideRight",
      "insideBottom",
      "insideTopLeft",
      "insideTopRight",
      "insideBottomLeft",
      "insideBottomRight",
    ];
    app.configParameters = {
      rotate: {
        min: -90,
        max: 90,
      },
      align: {
        options: {
          left: "left",
          center: "center",
          right: "right",
        },
      },
      legend: {
        orient: "horizontal",
        // left: 'left',
        bottom: "bottom",
        textStyle: {
          //The style of the legend text
          color: "#858d98",
        },
        // orient: 'vertical',
        // left: 'left',
        // textStyle: { //The style of the legend text
        //     color: '#858d98',
        // },
      },
      verticalAlign: {
        options: {
          top: "top",
          middle: "middle",
          bottom: "bottom",
        },
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos;
          return map;
        }, {}),
      },
      distance: {
        min: 0,
        max: 100,
      },
    };
    app.config = {
      rotate: 90,
      align: "left",
      verticalAlign: "middle",
      position: "insideTop",
      distance: 15,
      onChange: function () {
        var labelOption = {
          rotate: app.config.rotate,
          align: app.config.align,
          verticalAlign: app.config.verticalAlign,
          position: app.config.position,
          distance: app.config.distance,
        };
        myChart.setOption({
          series: [
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
          ],
        });
      },
    };
    var labelOption = {
      show: false,
      position: app.config.position,
      distance: app.config.distance,
      align: app.config.align,
      verticalAlign: app.config.verticalAlign,
      rotate: app.config.rotate,
      formatter: "{c}  {name|{a}}",
      fontSize: 16,
      rich: {
        name: {},
      },
    };
    var option = {
      grid: {
        left: "10%",
        right: "10%",
        bottom: "20%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      dataLabels: {
        // enabled: false,
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: 20,
        style: {
          fontSize: "20px",
          colors: ["#000000"],
        },
      },

      // legend: {
      //   show: true,
      //   position: "bottom",
      //   horizontalAlign: "center",
      //   fontWeight: 500,
      //   offsetX: 0,
      //   offsetY: -14,
      //   itemMargin: {
      //     horizontal: 8,
      //     vertical: 0,
      //   },
      //   markers: {
      //     width: 10,
      //     height: 10,
      //   },
      // },
      legend: {
        orient: "horizontal",
        // left: 'left',
        bottom: "bottom",
        textStyle: {
          //The style of the legend text
          color: "#858d98",
        },
        // position: "bottom",
        // horizontalAlign: "center",
        // data: ["Belanja Pegawai", "Belanja Barang Dan Jasa", "Belanja Modal", "Belanja Hibah", "Belanja Lainnya", "Transfer antar Pemda"],
        data: dataGrafikLabelKompKota,
        textStyle: {
          //The style of the legend text
          color: "#000000",
        },
      },
      color: chartBarLabelRotationColors,
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: {
            show: true,
          },
          dataView: {
            show: true,
            readOnly: false,
          },
          magicType: {
            show: true,
            type: ["line", "bar", "stack"],
          },
          restore: {
            show: true,
          },
          saveAsImage: {
            show: true,
          },
        },
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            show: false,
          },
          data: ["Kota"],
          axisLine: {
            lineStyle: {
              color: "#858d98",
            },
          },
        },
      ],
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#858d98",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(133, 141, 152, 0.1)",
          },
        },
      },
      textStyle: {
        fontFamily: "Poppins, sans-serif",
      },
      series: [
        {
          name: dataGrafikLabelKompKota[0],
          type: "bar",
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[0]],
        },
        {
          name: dataGrafikLabelKompKota[1],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[1]],
        },
        {
          name: dataGrafikLabelKompKota[2],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[2]],
        },
        {
          name: dataGrafikLabelKompKota[3],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[3]],
        },
        {
          name: dataGrafikLabelKompKota[4],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[4]],
        },
        {
          name: dataGrafikLabelKompKota[5],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[5]],
        },
        {
          name: dataGrafikLabelKompKota[6],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[6]],
        },
        {
          name: dataGrafikLabelKompKota[7],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[7]],
        },
        {
          name: dataGrafikLabelKompKota[8],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[8]],
        },
        {
          name: dataGrafikLabelKompKota[9],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[9]],
        },
        {
          name: dataGrafikLabelKompKota[10],
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [dataGrafikValueKompKota[10]],
        },
        // {
        //   name: "Belanja Pegawai",
        //   type: "bar",
        //   barGap: 0,
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [320, 332, 301, 334, 390],
        // },
        // {
        //   name: "Belanja Barang Dan Jasa",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [220, 182, 191, 234, 290],
        // },
        // {
        //   name: "Belanja Modal",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [150, 232, 201, 154, 190],
        // },
        // {
        //   name: "Belanja Hibah",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
        // {
        //   name: "Belanja Lainnya",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
        // {
        //   name: "Transfer antar Pemda",
        //   type: "bar",
        //   label: labelOption,
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
      ],
    };

    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "400px" }} option={option} />
      </React.Fragment>
    );
  };

  const SalesForecastCharts = ({ dataColors, series }) => {
    const areachartSalesColors = getChartColorsArray(dataColors);

    var options = {
      chart: {
        type: "bar",
        height: 341,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "80%",
        },
      },
      stroke: {
        show: true,
        width: 5,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [""],
        axisTicks: {
          show: false,
          borderType: "solid",
          color: "#78909C",
          height: 6,
          offsetX: 0,
          offsetY: 0,
        },
        title: {
          text: "Kota",
          offsetX: 0,
          offsetY: -30,
          style: {
            color: "#78909C",
            fontSize: "12px",
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return (value / 1000000000000).toFixed(2);
          },
        },
        tickAmount: 10,
        min: 0,
      },
      fill: {
        opacity: 1,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        fontWeight: 500,
        offsetX: 0,
        offsetY: -14,
        itemMargin: {
          horizontal: 8,
          vertical: 0,
        },
        markers: {
          width: 100,
          height: 100,
        },
      },
      colors: areachartSalesColors,
    };
    return (
      <React.Fragment>
        <ReactApexChart
          dir="ltr"
          options={options}
          series={series}
          type="bar"
          height="341"
          className="apex-charts"
        />
      </React.Fragment>
    );
  };

  const PieChart = ({ dataColors, dataChart }) => {
    var chartPieColors = getChartColorsArray(dataColors);
    var option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          //The style of the legend text
          color: "#858d98",
        },
      },
      label:{
        formatter: `{c} ({d})%`
      },
      color: chartPieColors,
      series: [
        {
          name: "",
          type: "pie",
          radius: "50%",
          data: dataChart,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
      textStyle: {
        fontFamily: "Poppins, sans-serif",
      },
    };

    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "350px" }} option={option} />
      </React.Fragment>
    );
  };

  const CustomDataLabel = ({ dataColors, dataChart, categories }) => {
    var chartDatalabelsBarColors = getChartColorsArray(dataColors);
    const series = [
      {
        data: dataChart,
      },
    ];
    var options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          formatter: function (val) {
            return val.toLocaleString("id-ID");
          },
        },
      },
      colors: chartDatalabelsBarColors,
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#000"],
          fontSize: "20px",
        },
        formatter: function (val, opt) {
          return val.toLocaleString("id-ID");
        },
        position: "top",
        offsetX: 20,
        dropShadow: {
          enabled: false,
        },
      },
      stroke: {
        width: 1,
        colors: ["#000"],
      },
      yaxis: {
        labels: {
          show: true,
        },
      },
      title: {
        text: "",
        align: "center",
        floating: true,
        style: {
          fontWeight: 500,
        },
      },
      subtitle: {
        text: "",
        align: "center",
      },
      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    };
    return (
      <React.Fragment>
        <ReactApexChart
          dir="ltr"
          className="apex-charts"
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {/* <Row>
        <Col xl={6}>
          <Row>
            <Col xl={6}>
              <Card className="card-animate" style={{ borderRadius: "100px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="avatar-sm flex-shrink-0 ">
                      <span className="avatar-title bg-success-subtle rounded-circle fs-2">
                        <FeatherIcon
                          icon="check-circle"
                          className="text-success"
                        ></FeatherIcon>
                        <i className="bx bx-cart text-success"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ marginLeft: "20px" }}
                    >
                      <div
                        className="card-title mb-0 "
                        style={{
                          fontColor: "#333333",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        Total Belanja Nasional
                      </div>
                      <div
                        style={{
                          fontColor: "#333333",
                          fontSize: "18px",
                          fontWeight: 400,
                        }}
                      >
                        {dataBelanjaNas}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="card-title mb-0" style={{ fontColor: "#333333", fontSize: "12px", fontWeight:600 }}>
                      Total Belanja Nasional
                    </div>
                    <div>{dataBelanjaNas} T</div>
                  </div>
                  <BarChartProv dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="card-animate" style={{ borderRadius: "100px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="avatar-sm flex-shrink-0 ">
                      <span className="avatar-title bg-success-subtle rounded-circle fs-2">
                        <FeatherIcon
                          icon="check-circle"
                          className="text-success"
                        ></FeatherIcon>
                        <i className="bx bx-money text-success"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ marginLeft: "20px" }}
                    >
                      <div
                        className="card-title mb-0 "
                        style={{
                          fontColor: "#333333",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        Anggaran Kemiskinan Ekstrem Nasional
                      </div>
                      <div
                        style={{
                          fontColor: "#333333",
                          fontSize: "18px",
                          fontWeight: 400,
                        }}
                      >
                        {dataAnggaranKemNas}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="card-title mb-0" style={{ fontColor: "#333333", fontSize: "12px", fontWeight:600 }}>
                      Anggaran K.E Ekstrem Nasional
                    </div>
                    <div>{dataAnggaranKemNas} T</div>
                  </div>
                  <BarChartProv dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card className="card-animate" style={{ borderRadius: "100px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="avatar-sm flex-shrink-0 ">
                      <span className="avatar-title bg-primary-subtle rounded-circle fs-2">
                        <FeatherIcon
                          icon="check-circle"
                          className="text-success"
                        ></FeatherIcon>
                        <i className="bx bx-cart text-primary"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ marginLeft: "20px" }}
                    >
                      <div
                        className="card-title mb-0 "
                        style={{
                          fontColor: "#333333",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        Total Belanja Provinsi
                      </div>
                      <div
                        style={{
                          fontColor: "#333333",
                          fontSize: "18px",
                          fontWeight: 400,
                        }}
                      >
                        {dataBelanjaProv}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="card-title mb-0" style={{ fontColor: "#333333", fontSize: "12px", fontWeight:600 }}>
                      Total Belanja Provinsi
                    </div>
                    <div>{dataBelanjaProv} T</div>
                  </div>
                  <BarChartProv dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="card-animate" style={{ borderRadius: "100px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="avatar-sm flex-shrink-0 ">
                      <span className="avatar-title bg-primary-subtle rounded-circle fs-2">
                        <FeatherIcon
                          icon="check-circle"
                          className="text-success"
                        ></FeatherIcon>
                        <i className="bx bx-money text-primary"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ marginLeft: "20px" }}
                    >
                      <div
                        className="card-title mb-0 "
                        style={{
                          fontColor: "#333333",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        Anggaran Kemiskinan Ekstrem Provinsi
                      </div>
                      <div
                        style={{
                          fontColor: "#333333",
                          fontSize: "18px",
                          fontWeight: 400,
                        }}
                      >
                        {dataAnggaranKemProv}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div
                      className="card-title mb-0"
                      style={{ fontColor: "#333333", fontSize: "12px", fontWeight:600 }}
                    >
                      Anggaran K.E Provinsi
                    </div>
                    <div>{dataAnggaranKemProv} T</div>
                  </div>

                  <BarChartProv dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col md={6}>
          <Row>
            <Col xl={6}>
              <Card className="card-animate" style={{ borderRadius: "100px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="avatar-sm flex-shrink-0 ">
                      <span className="avatar-title bg-success-subtle rounded-circle fs-2">
                        <FeatherIcon
                          icon="check-circle"
                          className="text-success"
                        ></FeatherIcon>
                        <i className="bx bx-check-circle text-success"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ marginLeft: "20px" }}
                    >
                      <div
                        className="card-title mb-0 "
                        style={{
                          fontColor: "#333333",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        Total Daerah Menganggarkan
                      </div>
                      <div
                        style={{
                          fontColor: "#333333",
                          fontSize: "18px",
                          fontWeight: 400,
                        }}
                      >
                        {dataTotalDaerahMenganggarkan.datarows}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="card-title mb-0" style={{ fontColor: "#333333", fontSize: "12px", fontWeight:600 }}>
                      Total Daerah Menganggarkan
                    </div>
                    <div>{dataTotalDaerahMenganggarkan.datarows}</div>
                  </div>
                  <BarChartProv dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="card-animate" style={{ borderRadius: "100px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="avatar-sm flex-shrink-0 ">
                      <span className="avatar-title bg-danger-subtle rounded-circle fs-2">
                        <FeatherIcon
                          icon="check-circle"
                          className="text-success"
                        ></FeatherIcon>
                        <i className="bx bx-error-alt text-danger"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ marginLeft: "20px" }}
                    >
                      <div
                        className="card-title mb-0 "
                        style={{
                          fontColor: "#333333",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        Total Daerah Tidak Menganggarkan
                      </div>
                      <div
                        style={{
                          fontColor: "#333333",
                          fontSize: "18px",
                          fontWeight: 400,
                        }}
                      >
                        {dataTotalDaerahNotMenganggarkan.datarows}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="card-title mb-0" style={{ fontColor: "#333333", fontSize: "12px", fontWeight:600 }}>
                      Total Daerah Tidak Menganggarkan
                    </div>
                    <div>{dataTotalDaerahNotMenganggarkan.datarows}</div>
                  </div>
                  <BarChartProv dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card className="card-animate" style={{ borderRadius: "100px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="avatar-sm flex-shrink-0 ">
                      <span className="avatar-title bg-success-subtle rounded-circle fs-2">
                        <FeatherIcon
                          icon="check-circle"
                          className="text-success"
                        ></FeatherIcon>
                        <i className="bx bx-check-circle text-success"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ marginLeft: "20px" }}
                    >
                      <div
                        className="card-title mb-0 "
                        style={{
                          fontColor: "#333333",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        Total Provinsi Menganggarkan
                      </div>
                      <div
                        style={{
                          fontColor: "#333333",
                          fontSize: "18px",
                          fontWeight: 400,
                        }}
                      >
                        {dataTotalProvMenganggarkan.datarows}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="card-title mb-0" style={{ fontColor: "#333333", fontSize: "12px", fontWeight:600 }}>
                      Total Prov Menganggarkan
                    </div>
                    <div>{dataTotalProvMenganggarkan.datarows}</div>
                  </div>
                  <BarChartProv dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="card-animate" style={{ borderRadius: "100px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="avatar-sm flex-shrink-0 ">
                      <span className="avatar-title bg-danger-subtle rounded-circle fs-2">
                        <FeatherIcon
                          icon="check-circle"
                          className="text-success"
                        ></FeatherIcon>
                        <i className="bx bx-error-alt text-danger"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex flex-column justify-content-center align-items-center"
                      style={{ marginLeft: "20px" }}
                    >
                      <div
                        className="card-title mb-0 "
                        style={{
                          fontColor: "#333333",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        Total Provinsi Tidak Menganggarkan
                      </div>
                      <div
                        style={{
                          fontColor: "#333333",
                          fontSize: "18px",
                          fontWeight: 400,
                        }}
                      >
                        {dataTotalProvNotMenganggarkan.datarows}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="card-title mb-0" style={{ fontColor: "#333333", fontSize: "12px", fontWeight:600 }}>
                      Total Prov Tidak Menganggarkan
                    </div>
                    <div>{dataTotalProvNotMenganggarkan.datarows}</div>
                  </div>
                  <BarChartProv dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  Grafik Alokasi Anggaran Kemiskinan Ekstrem Pemerintah Daerah
                  Provinsi
                </div>
              </div>
              <h4>{dataPengeluaran.datarows}</h4>
              <BarChartAlokasi dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]' />
              <BarChart dataValues={dataGrafikValue} dataColors={["--vz-primary-rgb, 0.8"]} labels={dataGrafikLabel}></BarChart>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  Komposisi Belanja Daerah Dalam Mendukung Kemiskinan Ekstrem
                  Pemerintah Daerah Provinsi
                </div>
              </div>

              <h4>{dataPengeluaran.datarows}</h4>
              <BarLabelChartKomposisi
                dataColors='[
    "#FFB6C1",
    "#FFDAB9",
    "#FFDEAD",
    "#FFFFE0",
    "#E0FFFF",
    "#B0E0E6",
    "#D8BFD8",
    "#E6E6FA",
    "#FFFACD",
    "#F5DEB3",
    "#D3FFCE"
]'
              />
              <BarChartKab dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  Grafik Alokasi Anggaran Kemiskin Ekstrem Pemerintah Daerah
                  Kabupaten
                </div>
              </div>
              <h4>{dataPengeluaran.datarows}</h4>
              <BarChartAlokasiKab dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]' />
              <BarChart dataValues={dataGrafikValue} dataColors={["--vz-primary-rgb, 0.8"]} labels={dataGrafikLabel}></BarChart>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  Komposisi Belanja Daerah Dalam Mendukung Kemiskinan Ekstrem
                  Pemerintah Daerah Kabupaten
                </div>
              </div>

              <h4>{dataPengeluaran.datarows}</h4>
              <BarLabelChartKomposisiKab dataColors='["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#33FFF5", "#DA33FF", "#FF8C33", "#33FF8C", "#FF3333", "#3385FF"]' />
              <BarChartKab dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  Grafik Alokasi Anggaran Kemiskinan Ekstrem Pemerintah Daerah
                  Kota
                </div>
              </div>
              <h4>{dataPengeluaran.datarows}</h4>
              <BarChartAlokasiKota dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]' />
              <BarChart dataValues={dataGrafikValue} dataColors={["--vz-primary-rgb, 0.8"]} labels={dataGrafikLabel}></BarChart>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  Komposisi Belanja Daerah Dalam Mendukung Kemiskinan Ekstrem
                  Pemerintah Daerah Kota
                </div>
              </div>

              <h4>{dataPengeluaran.datarows}</h4>
              <BarLabelChartKomposisiKota
                dataColors='[
  "#FF0000",
  "#33FF57",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#000000",
  "#808080",
  "#FFA500",
  "#800080",
  "#A52A2A"
]'
              />
              <BarChartKab dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Card>
        <CardBody>
          <SalesForecastCharts dataColors='[ "#FF5733","#33FF57","#FF33A1","#33FFF1","#FFAF33","#A1FF33","#FF33FF","#33A1FF","#FFD700","#8B4513","#40E0D0"]' series={dataGrafikSuppKemiskinanDaerahKota}/>
        </CardBody>
      </Card> */}

      <Row>
        <Col>
          <Card className="card-custom">
            <div className="d-flex title-page">
              <div className="avatar-sm">
                <i className="ri-account-circle-line text-dark fs-1"></i>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>KEMISKINAN EKSTREM</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <PolygonMaps />
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <Row>
                <Col>
                  <TabContent
                    activeTab={customActiveTab}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      {/* <StackedProv dataColors='["#2DAED4", "#57E7B4"]' /> */}
                      <Row>
                        <Col>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex flex-column title-custom-card mb-2">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span style={{fontSize:"16px", fontWeight:"600"}}>Total Belanja Nasional</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                      <i className="bx bx-cart text-info"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>{dataBelanjaNas}</span>
                                  </div>
                                </div>
                              </div>

                              
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex flex-column title-custom-card mb-2">
                                <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                  <span style={{fontSize:"16px", fontWeight:"600"}}>
                                    ANGGARAN PENANGANAN KEMISKINAN EKSTREM NASIONAL
                                  </span>
                                  {/* <span className="title-percent">{dataJumlahPenduduk.persenLaki}</span> */}
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                      <i className="bx bx-money text-warning"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>{dataAnggaranKemNas}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="separator">
                                <h4 className="card-title mb-0">
                                  Berbandingan Total Anggaran Untuk Kasus Miskin Ekstrem Berdasarkan Total Belanja
                                </h4>
                              </div>
                              <PieChart
                                dataChart={dataPerbandinganKasusMiskinEkstremBerdasarkanTotalBelanja}
                                dataColors={'["#57E7B4", "#2DAED4"]'}
                              />
                              <div className="separator">
                                <h4 className="card-title mb-0">
                                  TOP 5 PROVINSI BERDASARKAN PRESENTASE
                                </h4>
                              </div>
                              <CustomDataLabel
                                dataChart={dataTop5AkunBelanjaKemiskinanEkstrem}
                                categories={dataKeyTop5AkunBelanjaKemiskinanEkstrem}
                                dataColors='["#FCAD24","#FCAD248B"]'
                              />
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      {/* <StackedKab dataColors='["#2DAED4", "#57E7B4"]' /> */}
                      <Row>
                        <Col>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex flex-column title-custom-card">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span>Total Belanja Provinsi</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                      <i className="bx bx-cart text-info"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>{dataBelanjaProv}</span>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex flex-column title-custom-card">
                                <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                  <span>
                                    ANGGARAN PENANGANAN KEMISKINAN EKSTREM PROVINSI
                                  </span>
                                  {/* <span className="title-percent">{dataJumlahPenduduk.persenLaki}</span> */}
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                      <i className="bx bx-money text-warning"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>{dataAnggaranKemProv}</span>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                  <div className="nav-beranda">
                    <Nav
                      tabs
                      className="nav nav-tabs nav-success nav-justified mb-3"
                    >
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTab === "1",
                          })}
                          onClick={() => {
                            toggleCustom("1");
                          }}
                        >
                          NASIONAL
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTab === "2",
                          })}
                          onClick={() => {
                            toggleCustom("2");
                          }}
                        >
                          PROVINSI
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>

                  {/* disini nav link nya */}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="nav-beranda">
                <TabContent activeTab={customActiveTab1} className="text-muted">
                  <TabPane tabId="1" id="a">
                    <Row>
                      <Col md={6}>
                        <Card className="card-animate">
                          <CardBody>
                            <div className="d-flex flex-column title-custom-card">
                              <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                <span>TOTAL DAERAH MENGANGGARKAN</span>
                              </div>
                              <div className="d-flex">
                                <div className="avatar-xs-half flex-shrink-0">
                                  <span className="avatar-title bg-success-subtle rounded-4 fs-3">
                                    <i className="bx bx-check-circle text-success"></i>
                                  </span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                  <span>
                                    {dataTotalDaerahMenganggarkan.datarows}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="card-animate">
                          <CardBody>
                            <div className="d-flex flex-column title-custom-card">
                              <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                <span>TOTAL DAERAH TIDAK MENGANGGARKAN</span>
                                <span className="title-percent">{dataJumlahPenduduk.persenLaki}</span>
                              </div>
                              <div className="d-flex">
                                <div className="avatar-xs-half flex-shrink-0">
                                  <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                                    <i className="bx bx-error-alt text-danger"></i>
                                  </span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                  <span>
                                    {dataTotalDaerahNotMenganggarkan.datarows}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2" id="b">
                    <Row>
                      <Col md={6}>
                        <Card className="card-animate">
                          <CardBody>
                            <div className="d-flex flex-column title-custom-card">
                              <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                <span>TOTAL PROVINSI MENGANGGARKAN</span>
                              </div>
                              <div className="d-flex">
                                <div className="avatar-xs-half flex-shrink-0">
                                  <span className="avatar-title bg-success-subtle rounded-4 fs-3">
                                    <i className="bx bx-check-circle text-success"></i>
                                  </span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                  <span>
                                    {dataTotalProvMenganggarkan.datarows}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="card-animate">
                          <CardBody>
                            <div className="d-flex flex-column title-custom-card">
                              <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                <span>TOTAL PROVINSI TIDAK MENGANGGARKAN</span>
                                <span className="title-percent">{dataJumlahPenduduk.persenLaki}</span>
                              </div>
                              <div className="d-flex">
                                <div className="avatar-xs-half flex-shrink-0">
                                  <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                                    <i className="bx bx-error-alt text-danger"></i>
                                  </span>
                                </div>
                                <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                  <span>
                                    {dataTotalProvNotMenganggarkan.datarows}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
                <Nav
                  tabs
                  className="nav nav-tabs nav-success nav-justified mb-3"
                >
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTab1 === "1",
                      })}
                      onClick={() => {
                        toggleCustomDaerah("1");
                      }}
                    >
                      DAERAH
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTab1 === "2",
                      })}
                      onClick={() => {
                        toggleCustomDaerah("2");
                      }}
                    >
                      PROVINSI
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
      <Row>
        <Col md={6}>
          <Card>
            <CardBody>
            <div className="separator">
                <h4 className="card-title mb-0">
                  TOP 5 PROVINSI BERDASARKAN PRESENTASE
                </h4>
              </div>
              <CustomDataLabel
              dataChart={dataTop5AnggaranProvMiskinEkstrem}
                categories={dataKeyTop5AnggaranProvMiskinEkstrem}
                dataColors='["#FCAD24","#FCAD248B"]'
              />
               <div className="separator">
                <h4 className="card-title mb-0">
                  BOTTOM 5 PROVINSI BERDASARKAN PRESENTASE
                </h4>
              </div>
              <CustomDataLabel
                dataChart={dataBottom5AnggaranProvMiskinEkstrem}
                categories={dataKeyBottom5AnggaranProvMiskinEkstrem}
                dataColors='["#FCAD24","#FCAD248B"]'
              />
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
            <div className="separator">
                <h4 className="card-title mb-0">
                  TOP 5 URUSAN PEMERINTAH TERBESAR UNTUK PENANGANAN MISKIN EKSTREM
                </h4>
              </div>
              <CustomDataLabel dataChart={dataTop5UrusanPemerintahKemiskinanEkstrem} categories={dataKeyTop5UrusanPemerintahKemiskinanEkstrem}
                dataColors='["#FCAD24","#FCAD248B"]'/>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
        <Card>
          <CardBody>
          <div className="separator">
                <h4 className="card-title mb-0">
                  PERBANDINGAN SPM UNTUK PENANGANAN MISKIN EKSTREM
                </h4>
              </div>
              <CustomDataLabel dataChart={dataPerbandinganSpmKemiskinanEkstrem} categories={dataKeyPerbandinganSpm}
                dataColors='["#FCAD24","#FCAD248B"]'/>
          </CardBody>
        </Card>        
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="nav-beranda">
                <Nav
                  tabs
                  className="nav nav-tabs nav-success nav-justified mb-3"
                >
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTabChart === "1",
                      })}
                      onClick={() => {
                        toggleCustomChart("1");
                      }}
                    >
                      PROVINSI
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTabChart === "2",
                      })}
                      onClick={() => {
                        toggleCustomChart("2");
                      }}
                    >
                      KABUPATEN
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTabChart === "3",
                      })}
                      onClick={() => {
                        toggleCustomChart("3");
                      }}
                    >
                      KOTA
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent
                activeTab={customActiveTabChart}
                className="text-muted"
              >
                <TabPane tabId="1" id="provinsi">
                  {/* <StackedProv dataColors='["#2DAED4", "#57E7B4"]' /> */}
                  <BarChartAlokasi dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]' />
                  <BarLabelChartKomposisi
                    dataColors='[
    "#FFB6C1",
    "#FFDAB9",
    "#FFDEAD",
    "#FFFFE0",
    "#E0FFFF",
    "#B0E0E6",
    "#D8BFD8",
    "#E6E6FA",
    "#FFFACD",
    "#F5DEB3",
    "#D3FFCE"
]'
                  />
                </TabPane>
                <TabPane tabId="2" id="kabupaten">
                  {/* <StackedKab dataColors='["#2DAED4", "#57E7B4"]' /> */}
                  <BarChartAlokasiKab dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]' />
                  <BarLabelChartKomposisiKab dataColors='["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#33FFF5", "#DA33FF", "#FF8C33", "#33FF8C", "#FF3333", "#3385FF"]' />
                </TabPane>
                <TabPane tabId="3" id="kecamatan">
                  {/* <StackedKec dataColors='["#2DAED4", "#57E7B4"]' /> */}
                  <BarChartAlokasiKota dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]' />
                  <BarLabelChartKomposisiKota
                    dataColors='[
  "#FF0000",
  "#33FF57",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#000000",
  "#808080",
  "#FFA500",
  "#800080",
  "#A52A2A"
]'
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default contentMiskinEkstrim;
