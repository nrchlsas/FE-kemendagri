import React, { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  CardBody,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import classnames from "classnames";
import ReactEcharts from "echarts-for-react";
import CountUp from "react-countup";
import * as echarts from "echarts/core";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const PieChartNew = ({ dataColors, dataChart }) => {
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
    label: {
      formatter: `{c} ({d})%`
    },
    color: chartPieColors,
    series: [
      {
        name: "Access From",
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
      <ReactEcharts id="dataPerbandinganSasaranDanStunting" style={{ height: "350px" }} option={option} />
    </React.Fragment>
  );
};

const PieChart = memo(({ dataColors, dataChart, id }) => {
  console.log(id, "masuk sini")
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
    label: {
      formatter: `{c} ({d})%`
    },
    color: chartPieColors,
    series: [
      {
        name: "Access From",
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
    <React.Fragment key={id}>
      {id ? <>
        <ReactEcharts key={id} style={{ height: "350px" }} option={option} />
      </> : <></>}
    </React.Fragment>
  );
});

const CustomDataLabelFasilitas = ({ dataColors, dataChart, categories, id }) => {
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
    legend: {
      show: false
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
          return (val / 10000000000).toLocaleString("id-ID");
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
    <React.Fragment key={id}>
      <ReactApexChart
        key={id}
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

const StackedProv = memo(({ dataColors, dataLabelBeresikoStuntinProv, dataValueBeresikoStuntinProv, dataValueTidakBeresikoStuntinProv }) => {
  console.log("stake prov")
  var chartStackedBarColors = getChartColorsArray(dataColors);
  const series = [
    {
      name: "Keluarga Beresiko Stunting",
      data: dataValueBeresikoStuntinProv,
    },
    {
      name: "Keluarga Tidak Beresiko Stunting",
      data: dataValueTidakBeresikoStuntinProv,
    },
  ];
  var options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      formatter: function (val) {
        return val.toLocaleString("id-ID");
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    title: {
      text: "",
      style: {
        fontWeight: 500,
      },
    },
    xaxis: {
      categories: dataLabelBeresikoStuntinProv,
      labels: {
        formatter: function (val) {
          return val.toLocaleString("id-ID");
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
    },
    colors: chartStackedBarColors,
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
});

const StackedKab = memo(({ dataColors, dataLabelBeresikoStuntinKab, dataValueBeresikoStuntinKab, dataValueTidakBeresikoStuntinKab, }) => {
  var chartStackedBarColors = getChartColorsArray(dataColors);
  const series = [
    {
      name: "Keluarga Beresiko Stunting",
      data: dataValueBeresikoStuntinKab,
    },
    {
      name: "Keluarga Tidak Beresiko Stunting",
      data: dataValueTidakBeresikoStuntinKab,
    },
  ];
  var options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      formatter: function (val) {
        return val.toLocaleString("id-ID");
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    title: {
      text: "",
      style: {
        fontWeight: 500,
      },
    },
    xaxis: {
      categories: dataLabelBeresikoStuntinKab,
      labels: {
        formatter: function (val) {
          return val.toLocaleString("id-ID");
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
    },
    colors: chartStackedBarColors,
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
});

const ContentStunting = () => {
  const [customActiveTab, setcustomActiveTab] = useState("1");

  const toggleCustom = (tab) => {
    console.log(tab, 'tab')
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const [customActiveTabBelanja, setcustomActiveTabBelanja] = useState("1");
  const toggleCustomBelanja = (tab) => {
    if (customActiveTabBelanja !== tab) {
      setcustomActiveTabBelanja(tab);
    }
  };

  const [
    customActiveTabPerbandinganAnggaranKesehatan,
    setcustomActiveTabPerbandinganAnggaranKesehatan,
  ] = useState("1");
  const toggleCustomPerbandinganAnggaranKesehatan = (tab) => {
    if (customActiveTabPerbandinganAnggaranKesehatan !== tab) {
      setcustomActiveTabPerbandinganAnggaranKesehatan(tab);
    }
  };

  const [dataCompareStuntingByProv, setDataCompareStuntingByProv] = useState(
    []
  );
  const [loadingCompareStuntingByProv, setLoadingCompareStuntingByProv] =
    useState([]);
  const [errorCompareStuntingByProv, setErrorCompareStuntingByProv] = useState(
    []
  );
  const [dataValueBeresikoStuntinProv, setDataValueBeresikoStuntinProv] =
    useState([]);
  const [
    dataValueTidakBeresikoStuntinProv,
    setDataValueTidakBeresikoStuntinProv,
  ] = useState([]);
  const [dataLabelBeresikoStuntinProv, setDataLabelTidakBeresikoStuntinProv] =
    useState([]);

  const getDataCompareStuntingByProv = () => {
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
          `${API_URI}/dash_stunting_compare_by_prov`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataCompareStuntingByProv = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        const valueBeresikoStunting = [];
        const valueTidakBeresikoStunting = [];
        const labelDaerah = [];

        // Mapping data dari buckets ke array
        dataCompareStuntingByProv.data.aggregations["3"].buckets.forEach(
          (bucket) => {
            valueBeresikoStunting.push(bucket["1"].value);
            valueTidakBeresikoStunting.push(bucket["2"].value);
            labelDaerah.push(bucket.key);
          }
        );

        setDataValueBeresikoStuntinProv(valueBeresikoStunting);
        setDataValueTidakBeresikoStuntinProv(valueTidakBeresikoStunting);
        setDataLabelTidakBeresikoStuntinProv(labelDaerah);

        console.log(key1Values, "ini value 1");
        console.log(key2Values, "ini value 2");
        console.log(keys, "ini keys");

        setDataCompareStuntingByProv(dataCompareStuntingByProv);

        // console.log(data.hits.hits)
      } catch (errorCompareStuntingByProv) {
        setErrorCompareStuntingByProv(errorCompareStuntingByProv);
      } finally {
        setLoadingCompareStuntingByProv(false);
      }
    };
    fetchData();
  };

  const [dataCompareStuntingByKab, setDataCompareStuntingByKab] = useState([]);
  const [loadingCompareStuntingByKab, setLoadingCompareStuntingByKab] =
    useState([]);
  const [errorCompareStuntingByKab, setErrorCompareStuntingByKab] = useState(
    []
  );
  const [dataValueBeresikoStuntinKab, setDataValueBeresikoStuntinKab] =
    useState([]);
  const [
    dataValueTidakBeresikoStuntinKab,
    setDataValueTidakBeresikoStuntinKab,
  ] = useState([]);
  const [dataLabelBeresikoStuntinKab, setDataLabelTidakBeresikoStuntinKab] =
    useState([]);

  const getDataCompareStuntingByKab = () => {
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
          `${API_URI}/dash_stunting_compare_by_kab`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataCompareStuntingByKab = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        const valueBeresikoStunting = [];
        const valueTidakBeresikoStunting = [];
        const labelDaerah = [];

        // Mapping data dari buckets ke array
        dataCompareStuntingByKab.data["3"].buckets.forEach((bucket) => {
          valueBeresikoStunting.push(bucket["1"].value);
          valueTidakBeresikoStunting.push(bucket["2"].value);
          labelDaerah.push(bucket.key);
        });

        setDataValueBeresikoStuntinKab(valueBeresikoStunting);
        setDataValueTidakBeresikoStuntinKab(valueTidakBeresikoStunting);
        setDataLabelTidakBeresikoStuntinKab(labelDaerah);

        console.log(dataCompareStuntingByKab, "ini");
        setDataCompareStuntingByKab(dataCompareStuntingByKab);

        // console.log(data.hits.hits)
      } catch (errorCompareStuntingByKab) {
        setErrorCompareStuntingByKab(errorCompareStuntingByKab);
      } finally {
        setLoadingCompareStuntingByKab(false);
      }
    };
    fetchData();
  };

  const [dataJumlahKeluarga, setDataJumlahKeluarga] = useState([]);
  const [loadingJumlahKeluarga, setLoadingJumlahKeluarga] = useState([]);
  const [errorJumlahKeluarga, setErrorJumlahKeluarga] = useState([]);

  const getDataJumlahKeluarga = () => {
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
          `${API_URI}/dash_stunting_jumlah_keluarga`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahKeluarga = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        setDataJumlahKeluarga(
          dataJumlahKeluarga.data.aggregations.data.value.toLocaleString(
            "id-ID"
          )
        );

        // console.log(data.hits.hits)
      } catch (errorJumlahKeluarga) {
        setErrorJumlahKeluarga(errorJumlahKeluarga);
      } finally {
        setLoadingJumlahKeluarga(false);
      }
    };
    fetchData();
  };

  const [dataCompareStuntingByKecamatan, setDataCompareStuntingByKecamatan] =
    useState([]);
  const [
    loadingCompareStuntingByKecamatan,
    setLoadingCompareStuntingByKecamatan,
  ] = useState([]);
  const [errorCompareStuntingByKecamatan, setErrorCompareStuntingByKecamatan] =
    useState([]);
  const [dataValueBeresikoStuntinKec, setDataValueBeresikoStuntinKec] =
    useState([]);
  const [
    dataValueTidakBeresikoStuntinKec,
    setDataValueTidakBeresikoStuntinKec,
  ] = useState([]);
  const [dataLabelBeresikoStuntinKec, setDataLabelTidakBeresikoStuntinKec] =
    useState([]);

  const getDataCompareStuntingByKecamatan = () => {
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
          `${API_URI}/dash_stunting_compare_resiko_by_kec`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataCompareStuntingByKecamatan = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        const valueBeresikoStunting = [];
        const valueTidakBeresikoStunting = [];
        const labelDaerah = [];

        // Mapping data dari buckets ke array
        dataCompareStuntingByKecamatan.data.aggregations["3"].buckets.forEach(
          (bucket) => {
            valueBeresikoStunting.push(bucket["1"].value);
            valueTidakBeresikoStunting.push(bucket["2"].value);
            labelDaerah.push(bucket.key);
          }
        );

        setDataValueBeresikoStuntinKec(valueBeresikoStunting);
        setDataValueTidakBeresikoStuntinKec(valueTidakBeresikoStunting);
        setDataLabelTidakBeresikoStuntinKec(labelDaerah);

        console.log(dataCompareStuntingByKecamatan, "ini");
        setDataCompareStuntingByKecamatan(dataCompareStuntingByKecamatan);

        // console.log(data.hits.hits)
      } catch (errorCompareStuntingByKecamatan) {
        setErrorCompareStuntingByKecamatan(errorCompareStuntingByKecamatan);
      } finally {
        setLoadingCompareStuntingByKecamatan(false);
      }
    };
    fetchData();
  };

  const [dataCompareStuntingByKelurahan, setDataCompareStuntingByKelurahan] =
    useState([]);
  const [
    loadingCompareStuntingByKelurahan,
    setLoadingCompareStuntingByKelurahan,
  ] = useState([]);
  const [errorCompareStuntingByKelurahan, setErrorCompareStuntingByKelurahan] =
    useState([]);
  const [dataValueBeresikoStuntinKel, setDataValueBeresikoStuntinKel] =
    useState([]);
  const [
    dataValueTidakBeresikoStuntinKel,
    setDataValueTidakBeresikoStuntinKel,
  ] = useState([]);
  const [dataLabelBeresikoStuntinKel, setDataLabelTidakBeresikoStuntinKel] =
    useState([]);

  const getDataCompareStuntingByKelurahan = () => {
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
          `${API_URI}/dash_stunting_compare_resiko_by_kel`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataCompareStuntingByKelurahan = await response.json();

        const valueBeresikoStunting = [];
        const valueTidakBeresikoStunting = [];
        const labelDaerah = [];

        // Mapping data dari buckets ke array
        dataCompareStuntingByKelurahan.data.aggregations["3"].buckets.forEach(
          (bucket) => {
            valueBeresikoStunting.push(bucket["1"].value);
            valueTidakBeresikoStunting.push(bucket["2"].value);
            labelDaerah.push(bucket.key);
          }
        );

        setDataValueBeresikoStuntinKel(valueBeresikoStunting);
        setDataValueTidakBeresikoStuntinKel(valueTidakBeresikoStunting);
        setDataLabelTidakBeresikoStuntinKel(labelDaerah);

        console.log(dataCompareStuntingByKelurahan, "ini");
        setDataCompareStuntingByKelurahan(dataCompareStuntingByKelurahan);

        // console.log(data.hits.hits)
      } catch (errorCompareStuntingByKelurahan) {
        setErrorCompareStuntingByKelurahan(errorCompareStuntingByKelurahan);
      } finally {
        setLoadingCompareStuntingByKelurahan(false);
      }
    };
    fetchData();
  };

  const [dataKeluargaSasaran, setDataKeluargaSasaran] = useState([]);
  const [loadingKeluargaSasaran, setLoadingKeluargaSasaran] = useState([]);
  const [errorKeluargaSasaran, setErrorKeluargaSasaran] = useState([]);

  const getDataKeluargaSasaran = () => {
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
          `${API_URI}/dash_stunting_keluarga_sasaran`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataKeluargaSasaran = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(dataKeluargaSasaran.data.aggregations["1"].value, "ini");
        setDataKeluargaSasaran(
          dataKeluargaSasaran.data.aggregations["1"].value.toLocaleString(
            "id-ID"
          )
        );

        // console.log(data.hits.hits)
      } catch (errorKeluargaSasaran) {
        setErrorKeluargaSasaran(errorKeluargaSasaran);
      } finally {
        setLoadingKeluargaSasaran(false);
      }
    };
    fetchData();
  };

  const [dataKeluargaBeresikoStunting, setDataKeluargaBeresikoStunting] =
    useState([]);
  const [loadingKeluargaBeresikoStunting, setLoadingKeluargaBeresikoStunting] =
    useState([]);
  const [errorKeluargaBeresikoStunting, setErrorKeluargaBeresikoStunting] =
    useState([]);

  const getDataKeluargaBeresikoStunting = () => {
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
          `${API_URI}/dash_stunting_jumlah_keluarga_stunting`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataKeluargaBeresikoStunting = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(
          dataKeluargaBeresikoStunting.data.aggregations["1"].value,
          "ini stunting keluarga"
        );
        setDataKeluargaBeresikoStunting(
          dataKeluargaBeresikoStunting.data.aggregations[
            "1"
          ].value.toLocaleString("id-ID")
        );

        // console.log(data.hits.hits)
      } catch (errorKeluargaBeresikoStunting) {
        setErrorKeluargaBeresikoStunting(errorKeluargaBeresikoStunting);
      } finally {
        setLoadingKeluargaBeresikoStunting(false);
      }
    };
    fetchData();
  };

  const [dataTabelPerDaerah, setDataTabelPerDaerah] = useState([]);
  const [loadingTabelPerDaerah, setLoadingTabelPerDaerah] = useState([]);
  const [errorTabelPerDaerah, setErrorTabelPerDaerah] = useState([]);

  const getDataTabelPerDaerah = () => {
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
          `${API_URI}/dash_stunting_tabel_per_daerah`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTabelPerDaerah = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(dataTabelPerDaerah, "ini");
        setDataTabelPerDaerah(dataTabelPerDaerah);

        // console.log(data.hits.hits)
      } catch (errorTabelPerDaerah) {
        setErrorTabelPerDaerah(errorTabelPerDaerah);
      } finally {
        setLoadingTabelPerDaerah(false);
      }
    };
    fetchData();
  };

  const [
    dataStuntingPeringkatKesejahteraan,
    setDataStuntingPeringkatKesejahteraan,
  ] = useState([]);
  const [
    loadingStuntingPeringkatKesejahteraan,
    setLoadingStuntingPeringkatKesejahteraan,
  ] = useState([]);
  const [
    errorStuntingPeringkatKesejahteraan,
    setErrorStuntingPeringkatKesejahteraan,
  ] = useState([]);

  const getDataStuntingPeringkatKesejahteraan = () => {
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
          `${API_URI}/dash_stunting_peringkat_kesejahteraan`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataStuntingPeringkatKesejahteraan = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        const arrays = {
          1: [],
          2: [],
          3: [],
          4: [],
        };

        // Populate arrays with values from each bucket
        dataStuntingPeringkatKesejahteraan.data.aggregations[
          "6"
        ].buckets.forEach((bucket) => {
          Object.keys(arrays).forEach((key) => {
            arrays[key].push(bucket[key].value);
          });
        });

        // Transform the arrays into the desired format
        const mappedData = Object.keys(arrays).map((key) => ({
          name: `Desil ${key}`,
          data: arrays[key],
        }));

        // const mappedData = dataStuntingPeringkatKesejahteraan.data.aggregations["6"].buckets.map((bucket, index) => ({
        //   name: `${index+1}`,
        //   data: [
        //     bucket["1"].value,
        //     bucket["2"].value,
        //     bucket["3"].value,
        //     bucket["4"].value
        //   ]
        // }));

        console.log(mappedData, "ini mappeddata");

        console.log(dataStuntingPeringkatKesejahteraan, "ini");
        setDataStuntingPeringkatKesejahteraan(mappedData);

        // console.log(data.hits.hits)
      } catch (errorStuntingPeringkatKesejahteraan) {
        setErrorStuntingPeringkatKesejahteraan(
          errorStuntingPeringkatKesejahteraan
        );
      } finally {
        setLoadingStuntingPeringkatKesejahteraan(false);
      }
    };
    fetchData();
  };

  const [dataStuntingPunyaAnakPus, setDataStuntingPunyaAnakPus] = useState([]);
  const [loadingStuntingPunyaAnakPus, setLoadingStuntingPunyaAnakPus] =
    useState([]);
  const [errorStuntingPunyaAnakPus, setErrorStuntingPunyaAnakPus] = useState(
    []
  );

  const getDataStuntingPunyaAnakPus = () => {
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
          `${API_URI}/dash_stunting_punya_anak_dan_pus`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataStuntingPunyaAnakPus = await response.json();

        // Initialize arrays for each bucket key
        const arrays = {
          baduta: [],
          balita: [],
          "pus hamil": [],
        };

        // Map new names to bucket keys
        const bucketKeys = ["1", "2", "4"];
        const names = ["baduta", "balita", "pus hamil"];

        // Populate arrays with values from each bucket
        dataStuntingPunyaAnakPus.data.aggregations["6"].buckets.forEach(
          (bucket) => {
            bucketKeys.forEach((key, index) => {
              if (names[index]) {
                arrays[names[index]].push(bucket[key].value);
              }
            });
          }
        );

        // Transform the arrays into the desired format
        const mappedData = Object.keys(arrays).map((name) => ({
          name: name,
          data: arrays[name],
        }));

        console.log(mappedData, "ini mapped data pus");
        setDataStuntingPunyaAnakPus(mappedData);

        // console.log(data.hits.hits)
      } catch (errorStuntingPunyaAnakPus) {
        setErrorStuntingPunyaAnakPus(errorStuntingPunyaAnakPus);
      } finally {
        setLoadingStuntingPunyaAnakPus(false);
      }
    };
    fetchData();
  };

  const [dataPesertaKbModern, setDataPesertaKbModern] = useState([]);
  const [loadingPesertaKbModern, setLoadingPesertaKbModern] = useState([]);
  const [errorPesertaKbModern, setErrorPesertaKbModern] = useState([]);

  const getDataPesertaKbModern = () => {
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
          `${API_URI}/dash_stunting_peserta_kb_modern`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPesertaKbModern = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(dataPesertaKbModern, "ini");
        setDataPesertaKbModern(
          dataPesertaKbModern.data.aggregations["1"].value.toLocaleString(
            "id-ID"
          )
        );

        // console.log(data.hits.hits)
      } catch (errorPesertaKbModern) {
        setErrorPesertaKbModern(errorPesertaKbModern);
      } finally {
        setLoadingPesertaKbModern(false);
      }
    };
    fetchData();
  };

  const [dataJumlahPus, setDataJumlahPus] = useState([]);
  const [loadingJumlahPus, setLoadingJumlahPus] = useState([]);
  const [errorJumlahPus, setErrorJumlahPus] = useState([]);

  const getDataJumlahPus = () => {
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
          `${API_URI}/dash_stunting_jumlah_pus`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPus = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        console.log(dataJumlahPus.data.aggregations["1"].value, "ini");
        setDataJumlahPus(
          dataJumlahPus.data.aggregations["1"].value.toLocaleString("id-ID")
        );

        // console.log(data.hits.hits)
      } catch (errorJumlahPus) {
        setErrorJumlahPus(errorJumlahPus);
      } finally {
        setLoadingJumlahPus(false);
      }
    };
    fetchData();
  };

  const [dataFasilitasTidakSehat, setDataFasilitasTidakSehat] = useState([]);
  const [loadingFasilitasTidakSehat, setLoadingFasilitasTidakSehat] = useState(
    []
  );
  const [errorFasilitasTidakSehat, setErrorFasilitasTidakSehat] = useState([]);

  const getDataFasilitasTidakSehat = () => {
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
          `${API_URI}/dash_stunting_fasilitas_tidak_sehat`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataFasilitasTidakSehat = await response.json();

        const mappedData = [
          dataFasilitasTidakSehat.data.aggregations["1"].value,
          dataFasilitasTidakSehat.data.aggregations["2"].value,
        ];

        setDataFasilitasTidakSehat(mappedData);

        // console.log(data.hits.hits)
      } catch (errorFasilitasTidakSehat) {
        setErrorFasilitasTidakSehat(errorFasilitasTidakSehat);
      } finally {
        setLoadingFasilitasTidakSehat(false);
      }
    };
    fetchData();
  };

  const [dataStuntingPusTerlalu, setDataStuntingPusTerlalu] = useState([]);
  const [loadingStuntingPusTerlalu, setLoadingStuntingPusTerlalu] = useState(
    []
  );
  const [errorStuntingPusTerlalu, setErrorStuntingPusTerlalu] = useState([]);

  const getDataStuntingPusTerlalu = () => {
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
          `${API_URI}/dash_stunting_pus_terlalu`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataStuntingPusTerlalu = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(dataStuntingPusTerlalu, "ini");
        setDataStuntingPusTerlalu(dataStuntingPusTerlalu);

        // console.log(data.hits.hits)
      } catch (errorStuntingPusTerlalu) {
        setErrorStuntingPusTerlalu(errorStuntingPusTerlalu);
      } finally {
        setLoadingStuntingPusTerlalu(false);
      }
    };
    fetchData();
  };

  //total belanja nasional
  const [dataBelanjaNasional, setDataBelanjaNasional] = useState([]);
  const [loadingBelanjaNasional, setLoadingBelanjaNasional] = useState([]);
  const [errorBelanjaNasional, setErrorBelanjaNasional] = useState([]);

  const getDataBelanjaNasional = () => {
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
          `${API_URI}/dash_stunting_akbar_1`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataBelanjaNasional = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(
          dataBelanjaNasional.data.aggregations.one.value,
          "ini belanja nasional akbar"
        );
        setDataBelanjaNasional(dataBelanjaNasional.data.aggregations.one.value);

        // console.log(data.hits.hits)
      } catch (errorBelanjaNasional) {
        setErrorBelanjaNasional(errorBelanjaNasional);
      } finally {
        setLoadingBelanjaNasional(false);
      }
    };
    fetchData();
  };

  const [dataAnggaranBelanjaStunting, setDataAnggaranBelanjaStunting] =
    useState([]);
  const [loadingAnggaranBelanjaStunting, setLoadingAnggaranBelanjaStunting] =
    useState([]);
  const [errorAnggaranBelanjaStunting, setErrorAnggaranBelanjaStunting] =
    useState([]);

  const getDataAnggaranBelanjaStunting = () => {
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
          `${API_URI}/dash_stunting_akbar_2`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataAnggaranBelanjaStunting = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );`Rp ${dataAnggaranBelanjaStunting.data.aggregations.one.value.toLocaleString('id-ID')}`
        console.log(
          dataAnggaranBelanjaStunting,
          "ini anggaran belanja stuntin"
        );
        setDataAnggaranBelanjaStunting(
          dataAnggaranBelanjaStunting.data.aggregations.one.value
        );

        // console.log(data.hits.hits)
      } catch (errorAnggaranBelanjaStunting) {
        setErrorAnggaranBelanjaStunting(errorAnggaranBelanjaStunting);
      } finally {
        setLoadingAnggaranBelanjaStunting(false);
      }
    };
    fetchData();
  };

  const [
    dataAnggaranBelanjaUrusanKesehatan,
    setDataAnggaranBelanjaUrusanKesehatan,
  ] = useState([]);
  const [
    loadingAnggaranBelanjaUrusanKesehatan,
    setLoadingAnggaranBelanjaUrusanKesehatan,
  ] = useState([]);
  const [
    errorAnggaranBelanjaUrusanKesehatan,
    setErrorAnggaranBelanjaUrusanKesehatan,
  ] = useState([]);

  const getDataAnggaranBelanjaUrusanKesehatan = () => {
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
          `${API_URI}/dash_stunting_akbar_3`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataAnggaranBelanjaUrusanKesehatan = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        // `Rp ${dataAnggaranBelanjaUrusanKesehatan.data.aggregations.one.value.toLocaleString('id-ID')}`
        console.log(
          dataAnggaranBelanjaUrusanKesehatan,
          "ini anggaran belanja urusan kesehatan"
        );
        setDataAnggaranBelanjaUrusanKesehatan(
          dataAnggaranBelanjaUrusanKesehatan.data.aggregations.one.value
        );

        // console.log(data.hits.hits)
      } catch (errorAnggaranBelanjaUrusanKesehatan) {
        setErrorAnggaranBelanjaUrusanKesehatan(
          errorAnggaranBelanjaUrusanKesehatan
        );
      } finally {
        setLoadingAnggaranBelanjaUrusanKesehatan(false);
      }
    };
    fetchData();
  };

  const [
    dataPerbandinganBelanjaUrusanKesehatan,
    setDataPerbandinganBelanjaUrusanKesehatan,
  ] = useState([]);
  const [
    loadingPerbandinganBelanjaUrusanKesehatan,
    setLoadingPerbandinganBelanjaUrusanKesehatan,
  ] = useState([]);
  const [
    errorPerbandinganBelanjaUrusanKesehatan,
    setErrorPerbandinganBelanjaUrusanKesehatan,
  ] = useState([]);

  const getDataPerbandinganBelanjaUrusanKesehatan = () => {
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
          `${API_URI}/dash_stunting_akbar_6`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPerbandinganBelanjaUrusanKesehatan = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        const valueChart = [];
        const keyChart = [
          "Bidang Urusan di Luar Kesehatan",
          "Bidang Urusan Kesehatan",
        ];

        dataPerbandinganBelanjaUrusanKesehatan.data.aggregations[
          "2"
        ].buckets.map((item, index) => {
          valueChart.push({ value: item["1"].value, name: keyChart[index] });
        });

        console.log(valueChart, "ini mapped rrsfe");
        // console.log(
        //   dataPerbandinganBelanjaUrusanKesehatan,
        //   "ini perbandingan belanja urusan kesehatan"
        // );
        setDataPerbandinganBelanjaUrusanKesehatan(valueChart);

        // console.log(data.hits.hits)
      } catch (errorPerbandinganBelanjaUrusanKesehatan) {
        setErrorPerbandinganBelanjaUrusanKesehatan(
          errorPerbandinganBelanjaUrusanKesehatan
        );
      } finally {
        setLoadingPerbandinganBelanjaUrusanKesehatan(false);
      }
    };
    fetchData();
  };

  const [
    dataPerbandinganBelanjaKasusStunting,
    setDataPerbandinganBelanjaKasusStunting,
  ] = useState([]);
  const [
    loadingPerbandinganBelanjaKasusStunting,
    setLoadingPerbandinganBelanjaKasusStunting,
  ] = useState([]);
  const [
    errorPerbandinganBelanjaKasusStunting,
    setErrorPerbandinganBelanjaKasusStunting,
  ] = useState([]);

  const getDataPerbandinganBelanjaKasusStunting = () => {
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
          `${API_URI}/dash_stunting_akbar_7`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPerbandinganBelanjaKasusStunting = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        const valueChart = [];
        const keyChart = [
          "Anggaran Untuk Lainnya",
          "Anggaran Penurunan dan Pencegahan Stunting",
        ];

        dataPerbandinganBelanjaKasusStunting.data.aggregations["2"].buckets.map(
          (item, index) => {
            valueChart.push({ value: item["1"].value, name: keyChart[index] });
          }
        );

        console.log(
          dataPerbandinganBelanjaKasusStunting,
          "ini perbandingan belanja kasus stunting"
        );
        setDataPerbandinganBelanjaKasusStunting(valueChart);

        // console.log(data.hits.hits)
      } catch (errorPerbandinganBelanjaKasusStunting) {
        setErrorPerbandinganBelanjaKasusStunting(
          errorPerbandinganBelanjaKasusStunting
        );
      } finally {
        setLoadingPerbandinganBelanjaKasusStunting(false);
      }
    };
    fetchData();
  };

  const [
    dataPerbandinganSasaranDanStunting,
    setDataPerbandinganSasaranDanStunting,
  ] = useState([]);
  const [
    loadingPerbandinganSasaranDanStunting,
    setLoadingPerbandinganSasaranDanStunting,
  ] = useState([]);
  const [
    errorPerbandinganSasaranDanStunting,
    setErrorPerbandinganSasaranDanStunting,
  ] = useState([]);

  const getDataPerbandinganSasaranDanStunting = () => {
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
          `${API_URI}/dash_stunting_akbar_8`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPerbandinganSasaranDanStunting = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        const valueChart = [
          {
            value:
              dataPerbandinganSasaranDanStunting.data.total_keluarga_sasaran,
            name: "Keluarga Tidak Beresiko Stunting",
          },
          {
            value:
              dataPerbandinganSasaranDanStunting.data
                .total_keluarga_beresiko_stunting,
            name: "Keluarga Beresiko Stunting",
          },
        ];

        console.log(
          valueChart,
          "ini perbandingan belanja kasus stunting value hcasdiajdia"
        );
        setDataPerbandinganSasaranDanStunting(valueChart);

        // console.log(data.hits.hits)
      } catch (errorPerbandinganSasaranDanStunting) {
        setErrorPerbandinganSasaranDanStunting(
          errorPerbandinganSasaranDanStunting
        );
      } finally {
        setLoadingPerbandinganSasaranDanStunting(false);
      }
    };
    fetchData();
  };

  const [dataSpmUntukKasusStunting, setDataSpmUntukKasusStunting] = useState(
    []
  );
  const [loadingSpmUntukKasusStunting, setLoadingSpmUntukKasusStunting] =
    useState([]);
  const [errorSpmUntukKasusStunting, setErrorSpmUntukKasusStunting] = useState(
    []
  );

  const getDataSpmUntukKasusStunting = () => {
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
          `${API_URI}/dash_stunting_akbar_9`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataSpmUntukKasusStunting = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        const mappedData = dataSpmUntukKasusStunting.data.aggregations[
          "2"
        ].buckets.map((bucket) => bucket["1"].value);
        console.log(
          mappedData,
          "ini perbandingan sasaran dan stunting 53reofj"
        );

        setDataSpmUntukKasusStunting(mappedData);

        // console.log(data.hits.hits)
      } catch (errorSpmUntukKasusStunting) {
        setErrorSpmUntukKasusStunting(errorSpmUntukKasusStunting);
      } finally {
        setLoadingSpmUntukKasusStunting(false);
      }
    };
    fetchData();
  };

  const [dataTop5AkunBelanjaStunting, setDataTop5AkunBelanjaStunting] =
    useState([]);
  const [dataKeyTop5AkunBelanjaStunting, setDataKeyTop5AkunBelanjaStunting] =
    useState([]);
  const [loadingTop5AkunBelanjaStunting, setLoadingTop5AkunBelanjaStunting] =
    useState([]);
  const [errorTop5AkunBelanjaStunting, setErrorTop5AkunBelanjaStunting] =
    useState([]);

  const getDataTop5AkunBelanjaStunting = () => {
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
          `${API_URI}/dash_stunting_akbar_10`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTop5AkunBelanjaStunting = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(dataTop5AkunBelanjaStunting, "ini akun belanjaa");
        const mappedData = dataTop5AkunBelanjaStunting.data.aggregations[
          "2"
        ].buckets.map((bucket) => bucket["1"].value);
        const keyData = dataTop5AkunBelanjaStunting.data.aggregations[
          "2"
        ].buckets.map((bucket) => bucket.key);

        console.log(mappedData, "ini isi vlaues akun belnja");
        setDataTop5AkunBelanjaStunting(mappedData);
        setDataKeyTop5AkunBelanjaStunting(keyData);

        // console.log(data.hits.hits)
      } catch (errorTop5AkunBelanjaStunting) {
        setErrorTop5AkunBelanjaStunting(errorTop5AkunBelanjaStunting);
      } finally {
        setLoadingTop5AkunBelanjaStunting(false);
      }
    };
    fetchData();
  };


  const StackedKec = ({ dataColors }) => {
    var chartStackedBarColors = getChartColorsArray(dataColors);
    const series = [
      {
        name: "Keluarga Beresiko Stunting",
        data: dataValueBeresikoStuntinKec,
      },
      {
        name: "Keluarga Tidak Beresiko Stunting",
        data: dataValueTidakBeresikoStuntinKec,
      },
    ];
    var options = {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      title: {
        text: "",
        style: {
          fontWeight: 500,
        },
      },
      dataLabels: {
        formatter: function (val) {
          return val.toLocaleString("id-ID");
        },
        style: {
          colors: ["#000"],          
        },
      },
      xaxis: {
        categories: dataLabelBeresikoStuntinKec,
        labels: {
          formatter: function (val) {
            return val.toLocaleString("id-ID");
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
      colors: chartStackedBarColors,
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
  const StackedKel = ({ dataColors }) => {
    var chartStackedBarColors = getChartColorsArray(dataColors);
    const series = [
      {
        name: "Keluarga Beresiko Stunting",
        data: dataValueBeresikoStuntinKel,
      },
      {
        name: "Keluarga Tidak Beresiko Stunting",
        data: dataValueTidakBeresikoStuntinKel,
      },
    ];
    var options = {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      title: {
        text: "",
        style: {
          fontWeight: 500,
        },
      },
      dataLabels: {
        formatter: function (val) {
          return val.toLocaleString("id-ID");
        },
        style: {
          colors: ["#000"],          
        },
      },
      xaxis: {
        categories: dataLabelBeresikoStuntinKel,
        labels: {
          formatter: function (val) {
            return val.toLocaleString("id-ID");
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
      colors: chartStackedBarColors,
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

  const CustomDataLabelPus = ({ dataColors }) => {
    var chartDatalabelsBarColors = getChartColorsArray(dataColors);
    const series = [
      {
        data: [99, 99],
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
          fontSize: "20px",
        },
        formatter: function (val, opt) {
          return val;
        },
        position: "top",
        offsetX: 20,
        dropShadow: {
          enabled: false,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: ["Jamban Tidak Layak", "Air Tidak Layak"],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: "Custom DataLabels",
        align: "center",
        floating: true,
        style: {
          fontWeight: 500,
        },
      },
      subtitle: {
        text: "Category Names as DataLabels inside bars",
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


  useEffect(() => {
    console.log("jalam doong")
    getDataCompareStuntingByProv();
    getDataCompareStuntingByKab();
    getDataJumlahKeluarga();
    getDataCompareStuntingByKecamatan();
    getDataCompareStuntingByKelurahan();
    getDataKeluargaSasaran();
    getDataKeluargaBeresikoStunting();
    getDataTabelPerDaerah();
    getDataStuntingPeringkatKesejahteraan();
    getDataStuntingPunyaAnakPus();
    getDataPesertaKbModern();
    getDataJumlahPus();
    getDataFasilitasTidakSehat();
    getDataStuntingPusTerlalu();
    getDataBelanjaNasional();
    getDataAnggaranBelanjaStunting();
    getDataPerbandinganBelanjaUrusanKesehatan();
    getDataAnggaranBelanjaUrusanKesehatan();
    getDataPerbandinganBelanjaKasusStunting();
    getDataPerbandinganSasaranDanStunting();
    getDataSpmUntukKasusStunting();
    getDataTop5AkunBelanjaStunting();
  }, []);

  const ColumnWithLableKesejahteraan = ({ dataColors }) => {
    var chartColumnDatatalabelColors = getChartColorsArray(dataColors);
    const series = dataStuntingPeringkatKesejahteraan;

    const options = {
      chart: {
        toolbar: {
          show: !1,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "90%",
          endingShape: "rounded",
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: !0,
        formatter: function (val) {
          return val.toLocaleString("id-ID");
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#000"],
        },
      },
      colors: chartColumnDatatalabelColors,
      grid: {
        borderColor: "#f1f1f1",
      },
      xaxis: {
        categories: [
          "Jawa Barat",
          "Jawa Timur",
          "Jawa Tengah",
          "Sumatera Utara",
          "Banten",
        ],
        position: "bottom",
        labels: {
          offsetY: 2,
        },
        axisBorder: {
          show: !1,
        },
        axisTicks: {
          show: !1,
        },
        // crosshairs: {
        //     fill: {
        //         type: "gradient",
        //         gradient: {
        //             colorFrom: "#D8E3F0",
        //             colorTo: "#BED1E6",
        //             stops: [0, 100],
        //             opacityFrom: 0.4,
        //             opacityTo: 0.5,
        //         },
        //     },
        // },
        tooltip: {
          enabled: false,
          offsetY: -35,
        },
      },
      fill: {
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: !0,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      yaxis: {
        axisBorder: {
          show: !1,
        },
        axisTicks: {
          show: !1,
        },
        labels: {
          show: true,
          formatter: function (val) {
            return val.toLocaleString("id-ID");
          },
        },
      },
      title: {
        text: "",
        floating: !0,
        offsetY: 320,
        align: "center",
        style: {
          color: "#444",
          fontWeight: 500,
        },
      },
    };

    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="bar"
        height={350}
      />
    );
  };
  const ColumnWithLablePus = ({ dataColors }) => {
    var chartColumnDatatalabelColors = getChartColorsArray(dataColors);
    const series = dataStuntingPunyaAnakPus;

    const options = {
      chart: {
        toolbar: {
          show: !1,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "90%",
          endingShape: "rounded",
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: !0,
        formatter: function (val) {
          return val.toLocaleString("id-ID");
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#000"],
        },
      },
      colors: chartColumnDatatalabelColors,
      grid: {
        borderColor: "#f1f1f1",
      },
      xaxis: {
        categories: [
          "Jawa Barat",
          "Jawa Timur",
          "Jawa Tengah",
          "Sumatera Utara",
          "Banten",
        ],
        position: "bottom",
        labels: {
          offsetY: 2,
        },
        axisBorder: {
          show: !1,
        },
        axisTicks: {
          show: !1,
        },
        // crosshairs: {
        //     fill: {
        //         type: "gradient",
        //         gradient: {
        //             colorFrom: "#D8E3F0",
        //             colorTo: "#BED1E6",
        //             stops: [0, 100],
        //             opacityFrom: 0.4,
        //             opacityTo: 0.5,
        //         },
        //     },
        // },
        tooltip: {
          enabled: false,
          offsetY: -35,
        },
      },
      fill: {
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: !0,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      yaxis: {
        axisBorder: {
          show: !1,
        },
        axisTicks: {
          show: !1,
        },
        labels: {
          show: true,
          formatter: function (val) {
            return val.toLocaleString();
          },
        },
      },
      title: {
        text: "",
        floating: !0,
        offsetY: 320,
        align: "center",
        style: {
          color: "#444",
          fontWeight: 500,
        },
      },
    };

    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="bar"
        height={350}
      />
    );
  };

  const [dataShowAkunBelanja, setDataShowAkunBelanja] = useState(false);
  const handleShowDataAkun = (value) => {
    setDataShowAkunBelanja(value)
    console.log(dataShowAkunBelanja, 'ini isinyaaa')
  }

  return (
    <React.Fragment>
      {/* <Row>
        <Col md={10}>
          <Row>
            <Col md={6}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-center mb-2">
                    <span style={{ fontWeight: 600, fontSize: "20px" }}>
                      Perbandingan Keluarga Sasaran yang Berisiko dan Tidak
                      Berisiko Stunting Provinsi
                    </span>
                  </div>
                  <StackedProv dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-center mb-2">
                    <span style={{ fontWeight: 600, fontSize: "20px" }}>
                      Perbandingan Keluarga Sasaran yang Berisiko dan Tidak
                      Berisiko Stunting Kabupaten
                    </span>
                  </div>
                  <StackedKab dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-center mb-2">
                    <span style={{ fontWeight: 600, fontSize: "20px" }}>
                      Perbandingan Keluarga Sasaran yang Berisiko dan Tidak
                      Berisiko Stunting Kecamatan
                    </span>
                  </div>
                  <StackedKec dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-center mb-2">
                    <span style={{ fontWeight: 600, fontSize: "20px" }}>
                      Perbandingan Keluarga Sasaran yang Berisiko dan Tidak
                      Berisiko Stunting Kelurahan
                    </span>
                  </div>
                  <StackedKel dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={2}>
          <Row>
            <Col>
              <Card style={{ minHeight: "270px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center mb-2">
                    <span style={{ fontSize: "20px" }}>Jumlah Keluarga</span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <span style={{ fontWeight: 600, fontSize: "35px" }}>
                      {dataJumlahKeluarga}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ minHeight: "270px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center mb-2">
                    <span style={{ fontSize: "20px" }}>Keluarga Sasaran</span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <span style={{ fontWeight: 600, fontSize: "35px" }}>
                      {dataKeluargaSasaran}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ minHeight: "270px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center mb-2">
                    <span style={{ fontSize: "20px" }}>
                      Keluarga Berisiko Stunting
                    </span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <span style={{ fontWeight: 600, fontSize: "35px" }}>
                      {dataKeluargaBeresikoStunting}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>Tabel per Daerah</CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              SASARAN MENURUT PERINGKAT KESEJAHTERAAN
              <ColumnWithLableKesejahteraan dataColors='["#00008B","#4682B4","#87CEEB","#ADD8E6"]' />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              SASARAN MENURUT USIA ANAK DAN PUS
              <ColumnWithLablePus dataColors='["#00008B","#4682B4","#87CEEB","#ADD8E6"]' />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <Row>
            <Col>
              <Card style={{ minHeight: "201px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center mb-2">
                    <span style={{ fontSize: "20px" }}>
                      Bukan Peserta KB Modern
                    </span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <span style={{ fontWeight: 600, fontSize: "35px" }}>
                      {dataPesertaKbModern}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card style={{ minHeight: "201px" }}>
                <CardBody>
                  <div className="d-flex justify-content-center mb-2">
                    <span style={{ fontSize: "20px" }}>Jumlah PUS</span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <span style={{ fontWeight: 600, fontSize: "35px" }}>
                      {dataJumlahPus}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={10}>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  Fasilitas Lingkungan Tidak Sehat
                  <CustomDataLabelFasilitas dataColors='["#00008B","#4682B4","#87CEEB","#ADD8E6"]' />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardBody>PUS 4 Terlalu</CardBody>
              </Card>
            </Col>
          </Row>
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
                <span>Badan Kependudukan dan Keluarga Berencana Nasional</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={6}>
          <Card>
            <CardBody>
              <PolygonMaps />
            </CardBody>
          </Card>
        </Col>
        <Col xl={6}>
          <Row>
            <Col>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex flex-column title-custom-card">
                    <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                      <span>TOTAL BELANJA NASIONAL</span>
                    </div>
                    <div className="d-flex">
                      <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                          <i className="ri-shopping-bag-line text-warning"></i>
                        </span>
                      </div>
                      <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                        <span>
                          <CountUp
                            start={0}
                            end={dataBelanjaNasional}
                            separator="."
                            prefix="Rp "
                            duration={3}
                          />
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
                  <TabContent
                    activeTab={customActiveTabBelanja}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>TOTAL BELANJA PENURUNAN DAN PENCEGAHAN STUNTING</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="ri-shopping-bag-line text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataAnggaranBelanjaStunting}
                                separator="."
                                prefix="Rp "
                                duration={3}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>TOTAL BELANJA UNTUK BIDANG URUSAN KESEHATAN</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="ri-shopping-bag-line text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataAnggaranBelanjaUrusanKesehatan}
                                separator="."
                                prefix="Rp "
                                duration={3}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
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
                            active: customActiveTabBelanja === "1",
                          })}
                          onClick={() => {
                            toggleCustomBelanja("1");
                          }}
                        >
                          PENURUNAN DAN PENCEGAHAN STUNTING
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabBelanja === "2",
                          })}
                          onClick={() => {
                            toggleCustomBelanja("2");
                          }}
                        >
                          BIDANG URUSAN KESEHATAN
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column title-custom-card">
                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                  <span>JUMLAH KELUARGA</span>
                </div>
                <div className="d-flex">
                  <div className="avatar-xs-half flex-shrink-0">
                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                      <i className="mdi mdi-human-male-female-child text-warning"></i>
                    </span>
                  </div>
                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                    <span>{dataJumlahKeluarga}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column title-custom-card">
                <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                  <span>KELUARGA SASARAN</span>
                </div>
                <div className="d-flex">
                  <div className="avatar-xs-half flex-shrink-0">
                    <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                      <i className="mdi mdi-human-male-female-child text-info"></i>
                    </span>
                  </div>
                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                    <span>{dataKeluargaSasaran}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column title-custom-card">
                <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                  <span>KELUARGA BERESIKO STUNTING</span>
                </div>
                <div className="d-flex">
                  <div className="avatar-xs-half flex-shrink-0">
                    <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                      <i className="mdi mdi-human-male-female-child text-danger"></i>
                    </span>
                  </div>
                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                    <span>{dataKeluargaBeresikoStunting}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={6}>
          <Card>
            <CardBody>
              {dataShowAkunBelanja ? (
                <>
                  <h4 className="card-title mb-0">
                   Top 5 Akun Belanja Terbesar Untuk Penurunan dan Pencegahan Stunting
                  </h4>
                  <CustomDataLabelFasilitas
                    dataChart={dataTop5AkunBelanjaStunting}
                    categories={dataKeyTop5AkunBelanjaStunting}
                    dataColors='["#FCAD24","#FCAD248B"]'
                  />
                  <span
                    onClick={() => handleShowDataAkun(false)}
                    style={{ cursor: "pointer", color: "#2DAED4" }}
                  >
                    Lihat Grafik
                  </span>
                </>
              ) : (
                <>
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      Perbandingan Total Anggaran Pencegahan dan Penurunan Stunting Berdasarkan Total Belanja Nasional
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
                            active:
                              customActiveTabPerbandinganAnggaranKesehatan ===
                              "1",
                          })}
                          onClick={() => {
                            toggleCustomPerbandinganAnggaranKesehatan("1");
                          }}
                        >
                          KESEHATAN
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active:
                              customActiveTabPerbandinganAnggaranKesehatan ===
                              "2",
                          })}
                          onClick={() => {
                            toggleCustomPerbandinganAnggaranKesehatan("2");
                          }}
                        >
                          PENCEGAHAN DAN PENURUNAN STUNTING
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTabPerbandinganAnggaranKesehatan}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      <PieChartNew
                        dataChart={dataPerbandinganBelanjaUrusanKesehatan}
                        dataColors={'["#57E7B4", "#2DAED4"]'}
                      />
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      <PieChartNew
                        dataChart={dataPerbandinganBelanjaKasusStunting}
                        dataColors={'["#57E7B4", "#2DAED4"]'}
                      />
                      <div className="d-flex justify-content-center align-items-center mt-4">
                        <span
                          onClick={() => handleShowDataAkun(true)}
                          style={{ cursor: "pointer", color: "#2DAED4" }}
                        >
                          Lihat Akun Belanja
                        </span>
                      </div>
                    </TabPane>
                  </TabContent>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  Perbandingan Total Keluarga Beresiko Stunting Berdasarkan Total Keluarga Sasaran
                </h4>
              </div>
              <PieChart
                dataChart={dataPerbandinganSasaranDanStunting}
                dataColors={'["#57E7B4", "#2DAED4"]'}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ minHeight: "487px" }}>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  Perbandingan Keluarga Sasaran yang Berisiko dan Tidak Berisiko
                  Stunting
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
                      KABUPATEN
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
                  <StackedProv
                    dataColors='["#2DAED4", "#57E7B4"]'
                    dataValueBeresikoStuntinProv={dataValueBeresikoStuntinProv}
                    dataValueTidakBeresikoStuntinProv={dataValueTidakBeresikoStuntinProv}
                    dataLabelBeresikoStuntinProv={dataLabelBeresikoStuntinProv}
                  />
                </TabPane>
                <TabPane tabId="2" id="kabupaten">
                  <StackedKab
                    dataColors='["#2DAED4", "#57E7B4"]'
                    dataLabelBeresikoStuntinKab={dataLabelBeresikoStuntinKab}
                    dataValueBeresikoStuntinKab={dataValueBeresikoStuntinKab}
                    dataValueTidakBeresikoStuntinKab={dataValueTidakBeresikoStuntinKab}
                  />
                </TabPane>
                <TabPane tabId="3" id="kecamatan">
                  <StackedKec dataColors='["#2DAED4", "#57E7B4"]' />
                </TabPane>
                <TabPane tabId="4" id="kelurahan">
                  <StackedKel dataColors='["#2DAED4", "#57E7B4"]' />
                </TabPane>
              </TabContent>
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
                  ANGGARAN SPM UNTUK PENURUNAN DAN PENCEGAHAN STUNTING
                </h4>
              </div>
              <CustomDataLabelFasilitas
                categories={[
                  "SPM Bidang Pekerjaan Umum Dan Penataan Ruang",
                  "SPM Bidang Kesehatan",
                  "SPM Bidang Pendidikan",
                  "SPM Bidang Sosial",
                ]}
                dataChart={dataSpmUntukKasusStunting}
                dataColors='["#FCAD24","#FCAD248B"]'
              />
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
                  KELUARGA SASARAN MENURUT PERINGKAT KESEJAHTERAAN
                </h4>
              </div>
              <ColumnWithLableKesejahteraan dataColors='["#2DAED4","#2DAED4C4","#2DAED47B","#2DAED43B"]' />
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
                  KELUARGA SASARAN MENURUT USIA ANAK DAN PASANGAN USIA SUBUR (PUS)
                </h4>
              </div>
              <ColumnWithLablePus dataColors='["#2DAED4","#2DAED4C4","#2DAED47B","#2DAED43B"]' />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={3}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column title-custom-card">
                <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                  <span>BUKAN PESERTA KB MODERN</span>
                </div>
                <div className="d-flex">
                  {/* <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                          <i className="ri-women-line text-danger"></i>
                        </span>
                      </div> */}
                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                    <span>{dataPesertaKbModern}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex flex-column title-custom-card">
                <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                  <span>JUMLAH PUS</span>
                </div>
                <div className="d-flex">
                  {/* <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                          <i className="ri-women-line text-danger"></i>
                        </span>
                      </div> */}
                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                    <span>{dataJumlahPus}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xl={9}>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  FASILITAS LINGKUNGAN TIDAK SEHAT
                </h4>
              </div>
              <CustomDataLabelFasilitas
                categories={["Jamban Tidak Layak", "Air Tidak Layak"]}
                dataChart={dataFasilitasTidakSehat}
                dataColors='["#FCAD24","#FCAD248B"]'
                anggaran={false}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContentStunting;
