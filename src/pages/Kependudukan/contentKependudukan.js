import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Label,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactApexChart from "react-apexcharts";
import "./kependudukan.scss";
import geoIndo from "../../data/geoIndo.json";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import classnames from "classnames";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const ContentKependudukan = () => {
  const [dataJumlahPenduduk, setDataJumlahPenduduk] = useState([]);
  const [loadingJumlahPenduduk, setLoadingJumlahPenduduk] = useState([]);
  const [errorJumlahPenduduk, setErrorJumlahPenduduk] = useState([]);

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const getDataJumlahPenduduk = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kependudukan_jenis_kelamin`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPenduduk = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        console.log(dataJumlahPenduduk.data, "ini data jumlah penduduk");

        const mappedData = {
          lakiLaki:
            dataJumlahPenduduk.data.aggregations["1"].value.toLocaleString(
              "id-ID"
            ),
          perempuan:
            dataJumlahPenduduk.data.aggregations["2"].value.toLocaleString(
              "id-ID"
            ),
          totalPenduduk: (
            dataJumlahPenduduk.data.aggregations["1"].value +
            dataJumlahPenduduk.data.aggregations["2"].value
          ).toLocaleString("id-ID"),
          persenLaki: `${(
            (dataJumlahPenduduk.data.aggregations["1"].value /
              (dataJumlahPenduduk.data.aggregations["1"].value +
                dataJumlahPenduduk.data.aggregations["2"].value)) *
            100
          ).toFixed(1)} %`,
          persenPerempuan: `${(
            (dataJumlahPenduduk.data.aggregations["2"].value /
              (dataJumlahPenduduk.data.aggregations["1"].value +
                dataJumlahPenduduk.data.aggregations["2"].value)) *
            100
          ).toFixed(1)} %`,
        };

        console.log(mappedData, "ini mappeddata penduduk");
        setDataJumlahPenduduk(mappedData);

        // console.log(data.hits.hits)
      } catch (errorJumlahPenduduk) {
        setErrorJumlahPenduduk(errorJumlahPenduduk);
      } finally {
        setLoadingJumlahPenduduk(false);
      }
    };
    fetchData();
  };

  const [dataJumlahKk, setDataJumlahKk] = useState([]);
  const [loadingJumlahKk, setLoadingJumlahKk] = useState([]);
  const [errorJumlahKk, setErrorJumlahKk] = useState([]);
  const getDataJumlahKk = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kependudukan_akbar_jumlahlulusan_kepadatanpenduduk_luaswilayah`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahKk = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        console.log(dataJumlahKk.data, "ini data jumlah Kk");

        const mappedData = {
          luasWilayah:
            dataJumlahKk.data.aggregations["1"].value.toLocaleString("id-ID"),
          kepadatan:
            dataJumlahKk.data.aggregations["2"].value.toLocaleString("id-ID"),
          totalKk:
            dataJumlahKk.data.aggregations["3"].value.toLocaleString("id-ID"),
        };

        console.log(mappedData, "ini mappeddata");
        setDataJumlahKk(mappedData);

        // console.log(data.hits.hits)
      } catch (errorJumlahKk) {
        setErrorJumlahKk(errorJumlahKk);
      } finally {
        setLoadingJumlahKk(false);
      }
    };
    fetchData();
  };

  const [dataJumlahPendudukTop10Prov, setDataJumlahPendudukTop10Prov] =
    useState({
      prov: [],
      values: [],
    });
  const [loadingJumlahPendudukTop10Prov, setLoadingJumlahPendudukTop10Prov] =
    useState([]);
  const [errorJumlahPendudukTop10Prov, setErrorJumlahPendudukTop10Prov] =
    useState([]);
  const getDataJumlahPendudukTop10ByProv = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kependudukan_top10_total_penduduk_by_prov`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPendudukTop10Prov = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        let keys = [];
        let values = [];

        dataJumlahPendudukTop10Prov.data.aggregations["2"].buckets.forEach(
          (bucket) => {
            keys.push(bucket.key);
            values.push(bucket["1"].value);
          }
        );

        const mappedData = {
          prov: keys,
          values: values,
        };

        console.log(mappedData, "ini mappeddata 10 prov");
        setDataJumlahPendudukTop10Prov(mappedData);

        // console.log(data.hits.hits)
      } catch (errorJumlahPendudukTop10Prov) {
        setErrorJumlahPendudukTop10Prov(errorJumlahPendudukTop10Prov);
      } finally {
        setLoadingJumlahPendudukTop10Prov(false);
      }
    };
    fetchData();
  };

  const [dataJumlahPendudukTop10ByKota, setDataJumlahPendudukTop10ByKota] =
    useState({
      kota: [],
      values: [],
    });
  const [
    loadingJumlahPendudukTop10ByKota,
    setLoadingJumlahPendudukTop10ByKota,
  ] = useState([]);
  const [errorJumlahPendudukTop10ByKota, setErrorJumlahPendudukTop10ByKota] =
    useState([]);
  const getDataJumlahPendudukTop10ByKota = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kependudukan_total_penduduk_by_kota`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPendudukTop10ByKota = await response.json();
        let keys = [];
        let values = [];

        dataJumlahPendudukTop10ByKota.data.aggregations["2"].buckets.forEach(
          (bucket) => {
            keys.push(bucket.key);
            values.push(bucket["1"].value);
          }
        );

        const mappedData = {
          kota: keys,
          values: values,
        };

        console.log(mappedData, "ini mappeddata kota");
        setDataJumlahPendudukTop10ByKota(mappedData);

        // console.log(data.hits.hits)
      } catch (errorJumlahPendudukTop10ByKota) {
        setErrorJumlahPendudukTop10ByKota(errorJumlahPendudukTop10ByKota);
      } finally {
        setLoadingJumlahPendudukTop10ByKota(false);
      }
    };
    fetchData();
  };
  const [dataJumlahPendudukTop10ByKec, setDataJumlahPendudukTop10ByKec] =
    useState({
      kec: [],
      values: [],
    });
  const [loadingJumlahPendudukTop10ByKec, setLoadingJumlahPendudukTop10ByKec] =
    useState([]);
  const [errorJumlahPendudukTop10ByKec, setErrorJumlahPendudukTop10ByKec] =
    useState([]);
  const getDataJumlahPendudukTop10ByKec = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kependudukan_top10_total_penduduk_by_kec`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPendudukTop10ByKec = await response.json();

        let keys = [];
        let values = [];

        dataJumlahPendudukTop10ByKec.data.aggregations["2"].buckets.forEach(
          (bucket) => {
            keys.push(bucket.key);
            values.push(bucket["1"].value);
          }
        );

        const mappedData = {
          kec: keys,
          values: values,
        };

        console.log(mappedData, "ini mappeddata kec");
        setDataJumlahPendudukTop10ByKec(mappedData);

        // console.log(data.hits.hits)
      } catch (errorJumlahPendudukTop10ByKec) {
        setErrorJumlahPendudukTop10ByKec(errorJumlahPendudukTop10ByKec);
      } finally {
        setLoadingJumlahPendudukTop10ByKec(false);
      }
    };
    fetchData();
  };
  const [dataJumlahPendudukTop10ByKel, setDataJumlahPendudukTop10ByKel] =
    useState({
      kel: [],
      values: [],
    });
  const [loadingJumlahPendudukTop10ByKel, setLoadingJumlahPendudukTop10ByKel] =
    useState([]);
  const [errorJumlahPendudukTop10ByKel, setErrorJumlahPendudukTop10ByKel] =
    useState([]);
  const getDataJumlahPendudukTop10ByKel = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kependudukan_top10_total_penduduk_by_kel`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPendudukTop10ByKel = await response.json();

        let keys = [];
        let values = [];

        dataJumlahPendudukTop10ByKel.data.aggregations["2"].buckets.forEach(
          (bucket) => {
            keys.push(bucket.key);
            values.push(bucket["1"].value);
          }
        );

        const mappedData = {
          kel: keys,
          values: values,
        };

        console.log(mappedData, "ini mappeddata kel");
        setDataJumlahPendudukTop10ByKel(mappedData);

        // console.log(data.hits.hits)
      } catch (errorJumlahPendudukTop10ByKel) {
        setErrorJumlahPendudukTop10ByKel(errorJumlahPendudukTop10ByKel);
      } finally {
        setLoadingJumlahPendudukTop10ByKel(false);
      }
    };
    fetchData();
  };

  const [
    dataJumlahPendudukByJenisKelamin,
    setDataJumlahPendudukByJenisKelamin,
  ] = useState([]);
  const [
    loadingJumlahPendudukByJenisKelamin,
    setLoadingJumlahPendudukByJenisKelamin,
  ] = useState([]);
  const [
    errorJumlahPendudukByJenisKelamin,
    setErrorJumlahPendudukByJenisKelamin,
  ] = useState([]);
  const getDataJumlahPendudukByJenisKelamin = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kependudukan_jenis_kelamin`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPendudukByJenisKelamin = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        console.log(
          dataJumlahPendudukByJenisKelamin.data,
          "ini data jumlah Kk"
        );

        const mappedData = {
          lakiLaki:
            dataJumlahPendudukByJenisKelamin.data["1"].value.toLocaleString(
              "id-ID"
            ),
          perempuan:
            dataJumlahPendudukByJenisKelamin.data["2"].value.toLocaleString(
              "id-ID"
            ),
          totalKk:
            dataJumlahPendudukByJenisKelamin.data["3"].value.toLocaleString(
              "id-ID"
            ),
        };

        console.log(mappedData, "ini mappeddata");
        setDataJumlahPendudukByJenisKelamin(mappedData);

        // console.log(data.hits.hits)
      } catch (errorJumlahPendudukByJenisKelamin) {
        setErrorJumlahPendudukByJenisKelamin(errorJumlahPendudukByJenisKelamin);
      } finally {
        setLoadingJumlahPendudukByJenisKelamin(false);
      }
    };
    fetchData();
  };

  const [dataJumlahPendudukTabel, setDataJumlahPendudukTabel] = useState([]);
  const [loadingJumlahPendudukTabel, setLoadingJumlahPendudukTabel] = useState(
    []
  );
  const [errorJumlahPendudukTabel, setErrorJumlahPendudukTabel] = useState([]);
  const getDataJumlahPendudukTabel = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kependudukan_table`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPendudukTabel = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        console.log(dataJumlahPendudukTabel.data, "ini data jumlah Kk");

        const mappedData = {
          lakiLaki:
            dataJumlahPendudukTabel.data["1"].value.toLocaleString("id-ID"),
          perempuan:
            dataJumlahPendudukTabel.data["2"].value.toLocaleString("id-ID"),
          totalKk:
            dataJumlahPendudukTabel.data["3"].value.toLocaleString("id-ID"),
        };

        console.log(mappedData, "ini mappeddata");
        setDataJumlahPendudukTabel(mappedData);

        // console.log(data.hits.hits)
      } catch (errorJumlahPendudukTabel) {
        setErrorJumlahPendudukTabel(errorJumlahPendudukTabel);
      } finally {
        setLoadingJumlahPendudukTabel(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    getDataJumlahPenduduk();
    getDataJumlahKk();
    getDataJumlahPendudukTop10ByProv();
    getDataJumlahPendudukTop10ByKota();
    getDataJumlahPendudukByJenisKelamin();
    getDataJumlahPendudukTop10ByKec();
    getDataJumlahPendudukTop10ByKel();
    getDataJumlahPendudukTabel();
  }, []);
  // const defaultDataJumlahPendudukTop10Prov = {
  //   prov: [],
  //   values: []
  // };
  const CustomDataLabelTop10Prov = ({ dataColors }) => {
    var chartDatalabelsBarColors = getChartColorsArray(dataColors);
    // const dataJumlahPendudukTop10Prov = useState(defaultDataJumlahPendudukTop10Prov);
    const series = [
      {
        data: dataJumlahPendudukTop10Prov?.values || [],
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

      colors: chartDatalabelsBarColors,
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#000"],
          fontSize: "15px",
        },
        formatter: function (val, opt) {
          return val.toLocaleString("id-ID");
        },
        position: "top",
        offsetX: -10,
        dropShadow: {
          enabled: false,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: dataJumlahPendudukTop10Prov?.prov || [],
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
          fontWeight: 400,
        },
      },
      subtitle: {
        text: "",
        align: "center",
      },
      legend: {
        show: false,
        showForSingleSeries: !0,
        customLegendItems: ["Actual", "Expected"],
        Markers: {
          fillColors: ["#00E396", "#775DD0"],
        },
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
          height={450}
        />
      </React.Fragment>
    );
  };
  // const defaultDataJumlahPendudukTop10Kota = {
  //   prov: [],
  //   values: []
  // };

  const CustomDataLabelTop10Kota = ({ dataColors }) => {
    var chartDatalabelsBarColors = getChartColorsArray(dataColors);
    // const dataJumlahPendudukTop10ByKota = useState(defaultDataJumlahPendudukTop10Kota);
    const series = [
      {
        data: dataJumlahPendudukTop10ByKota?.values || [],
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
      legend: {
        show: false,
        showForSingleSeries: !0,
        customLegendItems: ["Actual", "Expected"],
        Markers: {
          fillColors: ["#00E396", "#775DD0"],
        },
      },
      colors: chartDatalabelsBarColors,
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#000"],
          fontSize: "15px",
        },
        formatter: function (val, opt) {
          return val.toLocaleString("id-ID");
        },
        position: "top",
        offsetX: -10,
        dropShadow: {
          enabled: false,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: dataJumlahPendudukTop10ByKota?.kota || [],
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
          fontWeight: 400,
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
          height={450}
        />
      </React.Fragment>
    );
  };
  // const defaultDataJumlahPendudukTop10Kec = {
  //   prov: [],
  //   values: []
  // };

  const CustomDataLabelTop10Kec = ({ dataColors }) => {
    var chartDatalabelsBarColors = getChartColorsArray(dataColors);
    // const dataJumlahPendudukTop10ByKec = useState(defaultDataJumlahPendudukTop10Kec);
    const series = [
      {
        data: dataJumlahPendudukTop10ByKec?.values || [],
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

      colors: chartDatalabelsBarColors,
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#000"],
          fontSize: "15px",
        },
        formatter: function (val, opt) {
          return val.toLocaleString("id-ID");
        },
        position: "top",
        offsetX: -10,
        dropShadow: {
          enabled: false,
        },
      },
      legend: {
        show: false,
        showForSingleSeries: !0,
        customLegendItems: ["Actual", "Expected"],
        Markers: {
          fillColors: ["#00E396", "#775DD0"],
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: dataJumlahPendudukTop10ByKec?.kec || [],
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
          fontWeight: 400,
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
          height={450}
        />
      </React.Fragment>
    );
  };
  // const defaultDataJumlahPendudukTop10Kel = {
  //   prov: [],
  //   values: []
  // };

  const CustomDataLabelTop10Kel = ({ dataColors }) => {
    var chartDatalabelsBarColors = getChartColorsArray(dataColors);
    // const dataJumlahPendudukTop10ByKel = useState(defaultDataJumlahPendudukTop10Kel);
    const series = [
      {
        data: dataJumlahPendudukTop10ByKel?.values || [],
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
      legend: {
        show: false,
        showForSingleSeries: !0,
        customLegendItems: ["Actual", "Expected"],
        Markers: {
          fillColors: ["#00E396", "#775DD0"],
        },
      },
      colors: chartDatalabelsBarColors,
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#000"],
          fontSize: "15px",
        },
        formatter: function (val, opt) {
          return val.toLocaleString("id-ID");
        },
        position: "top",
        offsetX: -10,
        dropShadow: {
          enabled: false,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: dataJumlahPendudukTop10ByKel?.kel || [],
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
          fontWeight: 400,
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
          height={450}
        />
      </React.Fragment>
    );
  };

  //react leaflet
  // const [color, setColor] = useState("#ffff00");

  //   const colors = ["green", "blue", "yellow", "orange", "grey"];

  //   useEffect(() => {
  //     console.log(geoIndo, 'ini')
  //   }, []);

  //   const countryStyle = {
  //     fillColor: "red",
  //     fillOpacity: 1,
  //     color: "black",
  //     weight: 2,
  //   };

  //   const printMessageToConsole = (event) => {
  //     console.log("Clicked");
  //   };

  //   const changeCountryColor = (event) => {
  //     event.target.setStyle({
  //       color: "green",
  //       fillColor: color,
  //       fillOpacity: 1,
  //     });
  //   };

  //   const onEachCountry = (country, layer) => {
  //     const countryName = country.properties.WADMPR;
  //     console.log(countryName, 'ini country name');
  //     layer.bindPopup(countryName);

  //     layer.options.fillOpacity = Math.random();

  //     // Uncomment to apply random colors
  //     // const colorIndex = Math.floor(Math.random() * colors.length);
  //     // layer.options.fillColor = colors[colorIndex];

  //     layer.on({
  //       click: changeCountryColor,
  //     });
  //   };

  //   const colorChange = (event) => {
  //     setColor(event.target.value);
  //   };

  return (
    <React.Fragment>
      {/* <Row>
        <Col className="pb-3" style={{marginBottom :"15px"}} md={6}>
        <Card className="card-animate h-100">
            <CardBody>
              <div className="d-flex justify-content-center pb-2">
                <h4 className="card-title mb-0">Total {dataJumlahPenduduk.totalPenduduk} Jiwa</h4>
              </div>
              <Row>
                <Col md={6}>
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center ">
                        Laki - Laki
                      </div>
                      <div className="d-flex justify-content-center p-2">
                        <div className="avatar-sm">
                          <span className="avatar-title bg-primary-subtle rounded-circle fs-6">
                          <i className="ri-men-line text-primary"></i>
                          </span>
                        </div>
                      </div>     
                      <div className="d-flex justify-content-center p-2">
                         <span style={{fontWeight:600}}>{dataJumlahPenduduk.lakiLaki}&nbsp;</span> Jiwa
                      </div>                 
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <CardBody>
                    <div className="d-flex justify-content-center">
                        Perempuan
                      </div>
                      <div className="d-flex justify-content-center p-2">
                        <div className="avatar-sm">
                          <span className="avatar-title bg-danger-subtle rounded-circle fs-6">
                          <i className="ri-women-line text-danger"></i>
                          </span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center p-2">
                      <span style={{fontWeight:600}}>{dataJumlahPenduduk.perempuan}&nbsp;</span>Jiwa
                      </div>                 
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card>        
        </Col>

        <Col className="pb-3" style={{marginBottom :"15px"}} md={6}>
        <Card className="card-animate h-100">
            <CardBody>
              <div className="d-flex justify-content-center pb-2">
                <h4 className="card-title mb-0">Jumlah {dataJumlahKk.totalKk}KK</h4>
              </div>
              <Row>
                <Col md={6}>
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center">
                         Luas Wilayah
                      </div>
                      <div className="d-flex justify-content-center p-2">
                        <div className="avatar-sm">
                          <span className="avatar-title bg-success-subtle rounded-circle fs-6">
                          <i className="ri-earth-line text-success"></i>
                          </span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center p-2">
                      <span style={{fontWeight:600}}>{dataJumlahKk.luasWilayah} &nbsp;</span>Km2
                      </div>        
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <CardBody>
                    <div className="d-flex justify-content-center">
                      Kepadatan Penduduk
                      </div>
                      <div className="d-flex justify-content-center p-2">
                        <div className="avatar-sm" >
                          <span className="avatar-title bg-warning-subtle rounded-circle fs-6">
                          <i className="ri-group-2-line text-warning"></i>
                          </span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center p-2">
                      <span style={{fontWeight:600}}>{dataJumlahKk.kepadatan}&nbsp;</span>Jiwa/Km2
                      </div>        
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="card-animate">
            <CardBody>
              <h4 className="card-title mb-0">Top 10 Jumlah Penduduk Berdasarkan Provinsi</h4>
              <CustomDataLabelTop10Prov dataColors='["#FFEC8B"]' />
            </CardBody>
          </Card>
        </Col>

        <Col className="pb-3" style={{marginBottom:"15px"}} md={6}>
          <Card className="card-animate h-100">
            <CardBody>
              <h4 className="card-title mb-0">Top 10 Jumlah Penduduk Berdasarkan Kota</h4>
              <CustomDataLabelTop10Kota dataColors='["#1E90FF"]' />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="card-animate">
            <CardBody>
              <h4 className="card-title mb-0">Top 10 Jumlah Penduduk Berdasarkan Kecamatan</h4>
              <CustomDataLabelTop10Kec dataColors='["#32CD32"]' />
            </CardBody>
          </Card>
        </Col>

        <Col className="pb-3" style={{marginBottom:"15px"}} md={6}>
          <Card className="card-animate h-100">
            <CardBody>
              <h4 className="card-title mb-0">Top 10 Jumlah Penduduk Berdasarkan Kelurahan</h4>
              <CustomDataLabelTop10Kel dataColors='["#F0A8D0"]' />
            </CardBody>
          </Card>
        </Col>
      </Row> */}
      <Row>
        <Col>
          <Card className="card-custom">
            <div className="d-flex title-page">
              <div className="avatar-sm">
                <i className="ri-account-circle-line text-dark fs-1"></i>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>Data Kependudukan</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={7}>
          <Card>
            <CardBody>
              <PolygonMaps />
            </CardBody>
          </Card>
        </Col>
        <Col md={5}>
          <Row>
            <Col xl={6}>
              <Row>
                <Col>
                  <Card className="card-animate">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Penduduk</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="ri-account-circle-line text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>{dataJumlahPenduduk.totalPenduduk} Jiwa</span>
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
                          <span>LAKI-LAKI</span>
                          <span className="title-percent">
                            {dataJumlahPenduduk.persenLaki}
                          </span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                              <i className="ri-men-line text-info"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>{dataJumlahPenduduk.lakiLaki} Jiwa</span>
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
                          <span>PEREMPUAN</span>
                          <span className="title-percent">
                            {dataJumlahPenduduk.persenPerempuan}
                          </span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                              <i className=" ri-women-line text-danger"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>{dataJumlahPenduduk.perempuan} Jiwa</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xl={6}>
              <Row>
                <Col>
                  <Card className="card-animate">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Jumlah Kartu Keluarga</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="ri-home-8-line text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>{dataJumlahKk.kepadatan} KK</span>
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
                          <span>Kepadatan Penduduk</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="ri-team-line text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                               {dataJumlahKk.totalKk} Jiwa/Km<sup>2</sup>
                            </span>
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
                          <span>Luas Wilayah</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-success-subtle rounded-4 fs-3">
                              <i className="mdi mdi-arrow-expand text-success"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              {dataJumlahKk.luasWilayah} Km<sup>2</sup>
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
            <div className="separator">
                    <h4 className="card-title mb-0">
                      Top 10 Jumlah Penduduk
                    </h4>
                  </div>
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
                      PROVINSI
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
                      KABUPATEN/KOTA
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTab === "3",
                      })}
                      onClick={() => {
                        toggleCustom("3");
                      }}
                    >
                      KECAMATAN
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTab === "4",
                      })}
                      onClick={() => {
                        toggleCustom("4");
                      }}
                    >
                      KELURAHAN
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={customActiveTab} className="text-muted">
                <TabPane tabId="1" id="provinsi">
                 
                  <CustomDataLabelTop10Prov dataColors='["#FCAD24"]' />
                </TabPane>
                <TabPane tabId="2" id="kabupaten">
                  {/* <div className="separator">
                    <h4 className="card-title mb-0">
                      Top 10 Jumlah Penduduk Berdasarkan Kota
                    </h4>
                  </div> */}
                  <CustomDataLabelTop10Kota dataColors='["#FCAD24"]' />
                </TabPane>
                <TabPane tabId="3" id="kecamatan">
                  {/* <div className="separator">
                    <h4 className="card-title mb-0">
                      Top 10 Jumlah Penduduk Berdasarkan Kecamatan
                    </h4>
                  </div> */}
                  <CustomDataLabelTop10Kec dataColors='["#2DAED4"]' />
                </TabPane>
                <TabPane tabId="4" id="kelurahan">
                  {/* <div className="separator">
                    <h4 className="card-title mb-0">
                      Top 10 Jumlah Penduduk Berdasarkan Kelurahan
                    </h4>
                  </div> */}

                  <CustomDataLabelTop10Kel dataColors='["#57E7B4"]' />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}></Col>
        <Col md={6}></Col>
      </Row>
      <Row>
        <Col md={6}></Col>
        <Col md={6}></Col>
      </Row>
    </React.Fragment>
  );
};

export default ContentKependudukan;
