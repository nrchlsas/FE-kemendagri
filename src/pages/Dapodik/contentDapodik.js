import React, { useEffect, useState } from "react";
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
import "./../Kependudukan/kependudukan.scss";
import "leaflet/dist/leaflet.css";
import classnames from "classnames";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const chartDataPaud = [
  {
    name: "TK-A",
    data: [37],
  },
  {
    name: "TK-B",
    data: [12],
  },
  {
    name: "Kelompok Belajar",
    data: [18],
  },
  {
    name: "Taman Pendidikan Al-Quran (TPA)",
    data: [37],
  },
  {
    name: "Satuan PAUD Selain TK, KB dan TPA",
    data: [12],
  },
];

const ContentDapodik = () => {
  const [dataJumlahAnakSekolah, setDataJumlahAnakSekolah] = useState({});
  const [loadingJumlahAnakSekolah, setLoadingJumlahAnakSekolah] = useState([]);
  const [errorJumlahAnakSekolah, setErrorJumlahAnakSekolah] = useState([]);

  const [customActiveTab, setcustomActiveTab] = useState("2");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const getDataJumlahAnakSekolah = () => {
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
          `${API_URI}/dash_kemendikbud_jumlah_anak_sekolah`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahAnakSekolah = await response.json();

        console.log(dataJumlahAnakSekolah.data.aggregations, "ini aggrawd");
        setDataJumlahAnakSekolah(dataJumlahAnakSekolah.data.aggregations);

        // console.log(data.hits.hits)
      } catch (errorJumlahAnakSekolah) {
        setErrorJumlahAnakSekolah(errorJumlahAnakSekolah);
      } finally {
        setLoadingJumlahAnakSekolah(false);
      }
    };
    fetchData();
  };

  const [dataJumlahAnakTidakSekolah, setDataJumlahAnakTidakSekolah] = useState(
    {}
  );
  const [loadingJumlahAnakTidakSekolah, setLoadingJumlahAnakTidakSekolah] =
    useState([]);
  const [errorJumlahAnakTidakSekolah, setErrorJumlahAnakTidakSekolah] =
    useState([]);

  const getDataJumlahAnakTidakSekolah = () => {
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
          `${API_URI}/dash_kemendikbud_matrix_ats`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahAnakTidakSekolah = await response.json();

        console.log(dataJumlahAnakTidakSekolah.data, "ini aggrawdAAAAAA");
        setDataJumlahAnakTidakSekolah(dataJumlahAnakTidakSekolah.data);

        // console.log(data.hits.hits)
      } catch (errorJumlahAnakTidakSekolah) {
        setErrorJumlahAnakTidakSekolah(errorJumlahAnakTidakSekolah);
      } finally {
        setLoadingJumlahAnakTidakSekolah(false);
      }
    };
    fetchData();
  };

  const [
    dataJumlahAnakBelumPernahSekolah,
    setDataJumlahAnakBelumPernahSekolah,
  ] = useState([]);
  const [
    loadingJumlahAnakBelumPernahSekolah,
    setLoadingJumlahAnakBelumPernahSekolah,
  ] = useState([]);
  const [
    errorJumlahAnakBelumPernahSekolah,
    setErrorJumlahAnakBelumPernahSekolah,
  ] = useState([]);

  const getDataJumlahAnakBelumPernahSekolah = () => {
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
          `${API_URI}/dash_kemendikbud_matrix_anak_belum_pernah_sekolah`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahAnakBelumPernahSekolah = await response.json();

        const dataMapped = [
          {
            name: `6-18 tahun`,
            data: [dataJumlahAnakBelumPernahSekolah.data["6_18thn"].value],
          },
          {
            name: `Belum Sekolah`,
            data: [dataJumlahAnakBelumPernahSekolah.data.blm_sekolah.value],
          },
          {
            name: `Dapodik`,
            data: [dataJumlahAnakBelumPernahSekolah.data.dapodik.value],
          },
        ];
        console.log(dataMapped, "ini aggrawdZZZZzzz");
        setDataJumlahAnakBelumPernahSekolah(dataMapped);

        // console.log(data.hits.hits)
      } catch (errorJumlahAnakBelumPernahSekolah) {
        setErrorJumlahAnakBelumPernahSekolah(errorJumlahAnakBelumPernahSekolah);
      } finally {
        setLoadingJumlahAnakBelumPernahSekolah(false);
      }
    };
    fetchData();
  };

  const [dataPaud, setDataPaud] = useState([]);
  const [loadingPaud, setLoadingPaud] = useState([]);
  const [errorPaud, setErrorPaud] = useState([]);

  const getDataPaud = () => {
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
          `${API_URI}/dash_kemendikbud_do_paud`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPaud = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        // console.log(dataMapped, 'ini data mapped')
        console.log(dataPaud.data.aggregations, "ini data paud");

        const nameLabel = [
          "TK-A",
          "TK-B",
          "Kelompok Belajar",
          "Taman Pendidikan Al-Quran (TPA)",
          "Satuan Paud Selain TK, KB, dan TPA",
        ];

        const dataMapped = Object.keys(dataPaud.data.aggregations).map(
          (key, index) => {
            return {
              name: nameLabel[index],
              data: [dataPaud.data.aggregations[key].value],
            };
          }
        );

        console.log(dataMapped, "ini data mapped");

        setDataPaud(dataMapped);

        // console.log(data.hits.hits)
      } catch (errorPaud) {
        setErrorPaud(errorPaud);
      } finally {
        setLoadingPaud(false);
      }
    };
    fetchData();
  };

  const [dataSd, setDataSd] = useState([]);
  const [loadingSd, setLoadingSd] = useState([]);
  const [errorSd, setErrorSd] = useState([]);

  const getDataSd = () => {
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
          `${API_URI}/dash_kemendikbud_do_sd`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataSd = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        const nameLabel = [
          "Kelas 1",
          "Kelas 2",
          "Kelas 3",
          "Kelas 4",
          "Kelas 5",
          "Kelas 6",
        ];

        const dataMapped = Object.keys(dataSd.data.aggregations).map(
          (key, index) => {
            return {
              name: nameLabel[index],
              data: [dataSd.data.aggregations[key].value],
            };
          }
        );

        setDataSd(dataMapped);

        // console.log(data.hits.hits)
      } catch (errorSd) {
        setErrorSd(errorSd);
      } finally {
        setLoadingSd(false);
      }
    };
    fetchData();
  };

  const [dataSmp, setDataSmp] = useState([]);
  const [loadingSmp, setLoadingSmp] = useState([]);
  const [errorSmp, setErrorSmp] = useState([]);

  const getDataSmp = () => {
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
          `${API_URI}/dash_kemendikbud_do_smp`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataSmp = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        const nameLabel = ["Kelas 7", "Kelas 8", "Kelas 9"];

        const dataMapped = Object.keys(dataSmp.data.aggregations).map(
          (key, index) => {
            return {
              name: nameLabel[index],
              data: [dataSmp.data.aggregations[key].value],
            };
          }
        );
        setDataSmp(dataMapped);

        // console.log(data.hits.hits)
      } catch (errorSmp) {
        setErrorSmp(errorSmp);
      } finally {
        setLoadingSmp(false);
      }
    };
    fetchData();
  };
  const [dataSma, setDataSma] = useState([]);
  const [loadingSma, setLoadingSma] = useState([]);
  const [errorSma, setErrorSma] = useState([]);

  const getDataSma = () => {
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
          `${API_URI}/dash_kemendikbud_do_sma`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataSma = await response.json();

        const nameLabel = ["Kelas 10", "Kelas 11", "Kelas 12", "Kelas 13"];

        const dataMapped = Object.keys(dataSma.data.aggregations).map(
          (key, index) => {
            return {
              name: nameLabel[index],
              data: [dataSma.data.aggregations[key].value],
            };
          }
        );

        setDataSma(dataMapped);

        // console.log(data.hits.hits)
      } catch (errorSma) {
        setErrorSma(errorSma);
      } finally {
        setLoadingSma(false);
      }
    };
    fetchData();
  };

  const [dataAtsTidakLanjut, setDataAtsTidakLanjut] = useState([]);
  const [loadingAtsTidakLanjut, setLoadingAtsTidakLanjut] = useState([]);
  const [errorAtsTidakLanjut, setErrorAtsTidakLanjut] = useState([]);

  const getDataAtsTidakLanjut = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelomaok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kemendikbud_compare_ats_tidak_lanjut`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataAtsTidakLanjut = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(dataAtsTidakLanjut.data, "ini is data ATS");
        const valuesArray = Object.values(dataAtsTidakLanjut.data).map(
          (item) => item.value
        );

        console.log(valuesArray, "ini value");
        console.log(dataAtsTidakLanjut, "ini");

        setDataAtsTidakLanjut(valuesArray);

        // console.log(data.hits.hits)
      } catch (errorAtsTidakLanjut) {
        setErrorAtsTidakLanjut(errorAtsTidakLanjut);
      } finally {
        setLoadingAtsTidakLanjut(false);
      }
    };
    fetchData();
  };

  const [dataUsiaBelumPernahBersekolah, setDataUsiaBelumPernahBersekolah] =
    useState([]);
  const [
    loadingUsiaBelumPernahBersekolah,
    setLoadingUsiaBelumPernahBersekolah,
  ] = useState([]);
  const [errorUsiaBelumPernahBersekolah, setErrorUsiaBelumPernahBersekolah] =
    useState([]);

  const getDataUsiaBelumPernahBersekolah = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelomaok = '6.2'",
          // }),
        };
        const response = await fetch(`${API_URI}/e6`, requestOptions);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataUsiaBelumPernahBersekolah = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        let valuesArray = [];

        valuesArray = Object.values(
          dataUsiaBelumPernahBersekolah.data.aggregations
        ).map((item) => item.value);
        console.log(valuesArray, "ini");
        setDataUsiaBelumPernahBersekolah(valuesArray);

        // console.log(data.hits.hits)
      } catch (errorUsiaBelumPernahBersekolah) {
        setErrorUsiaBelumPernahBersekolah(errorUsiaBelumPernahBersekolah);
      } finally {
        setLoadingUsiaBelumPernahBersekolah(false);
      }
    };
    fetchData();
  };
  const [dataJumlahBelumPernahSekolah, setDataJumlahBelumPernahSekolah] =
    useState([]);
  const [loadingJumlahBelumPernahSekolah, setLoadingJumlahBelumPernahSekolah] =
    useState([]);
  const [errorJumlahBelumPernahSekolah, setErrorJumlahBelumPernahSekolah] =
    useState([]);

  const getDataJumlahBelumPernahSekolah = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelomaok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dash_kemendikbud_jumlah_belum_pernah_sekolah`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahBelumPernahSekolah = await response.json();

        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(
          dataJumlahBelumPernahSekolah.data.aggregations[1].value,
          "ini belum pernah sekolah"
        );
        setDataJumlahBelumPernahSekolah(
          dataJumlahBelumPernahSekolah.data.aggregations[1].value.toLocaleString()
        );

        // console.log(data.hits.hits)
      } catch (errorJumlahBelumPernahSekolah) {
        setErrorJumlahBelumPernahSekolah(errorJumlahBelumPernahSekolah);
      } finally {
        setLoadingJumlahBelumPernahSekolah(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    getDataJumlahAnakSekolah();
    getDataJumlahAnakTidakSekolah();
    getDataPaud();
    getDataSd();
    getDataSmp();
    getDataSma();
    getDataAtsTidakLanjut();
    getDataJumlahBelumPernahSekolah();
    getDataUsiaBelumPernahBersekolah();
    getDataJumlahAnakBelumPernahSekolah();
  }, []);

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
          columnWidth: "65%",
        },
      },
      dataLabels: {
        enabled: !0,
        formatter: function (val) {
          return val.toLocaleString("id-ID");
        },
        offsetY: 60,
        style: {
          fontSize: "14px",
          colors: ["#000000"],
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
          text: "",
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
            return value.toLocaleString("id-ID");
          },
        },
        tickAmount: 4,
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
          width: 10,
          height: 10,
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

  const CustomDataLabel = ({ dataColors }) => {
    var chartDatalabelsBarColors = getChartColorsArray(dataColors);
    const series = [
      {
        data: dataAtsTidakLanjut,
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
          return val.toLocaleString("id-ID");
        },
        position: "top",
        offsetX: 20,
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
        categories: ["SMP", "SMA"],
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

  const CustomDataLabelTidakSekolah = ({ dataColors }) => {
    var chartDatalabelsBarColors = getChartColorsArray(dataColors);
    const series = [
      {
        data: dataUsiaBelumPernahBersekolah,
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
        },
        formatter: function (val, opt) {
          // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val.toLocaleString();
          return val.toLocaleString("id-ID");
        },
        offsetX: 0,
        dropShadow: {
          enabled: false,
        },
      },
      stroke: {
        width: 1,
        colors: ["#000"],
      },
      xaxis: {
        categories: [
          "Usia 8",
          "Usia 9",
          "Usia 10",
          "Usia 11",
          "Usia 12",
          "Usia 13",
          "Usia 14",
          "Usia 15",
          "Usia 16",
          "Usia 17",
          "Usia 18",
          "Usia 19",
          "Usia 20",
          "Usia 21",
        ],
      },
      legend: {
        show: false,
        showForSingleSeries: !0,
        customLegendItems: ["Actual", "Expected"],
        Markers: {
          fillColors: ["#00E396", "#775DD0"],
        },
      },
      yaxis: {
        labels: {
          // show: false
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
          height={550}
        />
      </React.Fragment>
    );
  };

  // const [color, setColor] = useState("#ffff00");

  // const colors = ["green", "blue", "yellow", "orange", "grey"];

  // useEffect(() => {

  // }, []);

  // const countryStyle = {
  //   fillColor: "red",
  //   fillOpacity: 1,
  //   color: "black",
  //   weight: 2,
  // };

  // const printMessageToConsole = (event) => {
  //   console.log("Clicked");
  // };

  // const changeCountryColor = (event) => {
  //   event.target.setStyle({
  //     color: "green",
  //     fillColor: color,
  //     fillOpacity: 1,
  //   });
  // };

  // const onEachCountry = (country, layer) => {
  //   const countryName = country.properties.WADMPR;
  //   // console.log(countryName, "ini country name");
  //   layer.bindPopup(countryName);

  //   layer.options.fillOpacity = Math.random();

  //   // Uncomment to apply random colors
  //   // const colorIndex = Math.floor(Math.random() * colors.length);
  //   // layer.options.fillColor = colors[colorIndex];

  //   layer.on({
  //     click: changeCountryColor,
  //   });
  // };

  // const colorChange = (event) => {
  //   setColor(event.target.value);
  // };

  return (
    <React.Fragment>
      {/* <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                DAPODIK
              </h4>
              <div className="d-flex justify-content-center align-items-center">
                <div className="me-3">
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        TK
                      </div>
                      <div className="d-flex justify-content-center align-items-center fw-bolder">
                        {dataJumlahAnakSekolah?.tk?.value?.toLocaleString()}
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="me-3">
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        SD
                      </div>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        {dataJumlahAnakSekolah?.sd?.value?.toLocaleString()}
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="me-3">
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        SMP
                      </div>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        {dataJumlahAnakSekolah?.smp?.value?.toLocaleString()}
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="me-3">
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        SMA
                      </div>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        {dataJumlahAnakSekolah?.sma?.value?.toLocaleString()}
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        UNIVERSITAS
                      </div>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        {dataJumlahAnakSekolah?.univ?.value?.toLocaleString()}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  minHeight: "154px",
                }}
              >
                ANAK TIDAK SEKOLAH
              </h4>
              <Row>
                <Col md={6}>
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        {dataJumlahAnakTidakSekolah.do?.value?.toLocaleString(
                          "id-ID"
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        {dataJumlahAnakTidakSekolah.tdk_lanjut?.value?.toLocaleString(
                          "id-ID"
                        )}
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
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                ANAK BELUM SEKOLAH
              </h4>
              <Card>
                <CardBody>
                  <SalesForecastCharts
                    series={dataJumlahAnakBelumPernahSekolah}
                    dataColors='["#32CD32", "#3CB371", "#2E8B57", "#66CDAA", "#8FBC8F", "#98FB98"]'
                  />
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card style={{ minHeight: "456px" }}>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                TOTAL ANAK TIDAK SEKOLAH (ATS)
              </h4>
              <Row>
                <Col md={12}>
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        {dataJumlahAnakTidakSekolah.total_ats?.value?.toLocaleString(
                          "id-ID"
                        )}
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
        <Col md={12}>
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                ANAK TIDAK SEKOLAH KARENA DROP OUT
              </h4>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                Drop Out Paud
              </h4>
              <SalesForecastCharts
                series={dataPaud}
                dataColors='["#32CD32", "#3CB371", "#2E8B57", "#66CDAA", "#8FBC8F", "#98FB98"]'
              />
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                Drop Out SD
              </h4>
              <SalesForecastCharts
                series={dataSd}
                dataColors='["#E9967A", "#FA8072", "#FF6347", "#FF4500", "#FF7F7F", "#FF6F61"]'
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                Drop Out SMP
              </h4>
              <SalesForecastCharts
                series={dataSmp}
                dataColors='["#4682B4", "#5F9EA0", "#00BFFF", "#87CEEB", "#ADD8E6"]'
              />
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                Drop Out SMA
              </h4>
              <SalesForecastCharts
                series={dataSma}
                dataColors='["#FFFACD", "#FAFAD2", "#FFEFD5", "#FFE4B5", "#F0E68C", "#FFDAB9"]'
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                Anak Tidak Sekolah Karena Lulus Tetapi Tidak Melanjutkan
              </h4>
              <CustomDataLabel dataColors='["#98FB98", "#3CB371"]' />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <h4
                className="card-title d-flex justify-content-center"
                style={{ fontSize: "16px", fontWeight: 600 }}
              >
                Anak Tidak Sekolah Karena Belum Pernah Bersekolah
              </h4>
              <Row>
                <Col md={4}>
                  <Card>
                    <CardBody>
                      <h4
                        className="card-title d-flex justify-content-center"
                        style={{ fontSize: "16px", fontWeight: 600 }}
                      >
                        Jumlah Belum Pernah Bersekolah
                      </h4>
                      <div
                        className="d-flex justify-content-center mb-3"
                        style={{ fontWeight: 700, fontSize: "72px" }}
                      >
                        {dataJumlahBelumPernahSekolah}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={8}>
                  <Card>
                    <CardBody>
                      <CustomDataLabelTidakSekolah dataColors='["#98FB98"]' />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
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
                <span>Dapodik</span>
              </div>
            </div>
          </Card>
          <Card>
            <CardBody>
              <PolygonMaps />
            </CardBody>
          </Card>
          <Card>
            <Row className="row-cols-xxl-5 row-cols-md-3 row-cols-1 g-0">
              <Col style={{ borderRight: "1px solid #e9ebec" }}>
                <div className="py-4 px-3">
                  <h5 className="text-muted text-uppercase fs-13">
                    TK<i className=" fs-18 float-end align-middle"></i>
                  </h5>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="ri-account-circle-line display-6 text-muted"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h2 className="mb-0">
                        <span className="counter-value fs-18" data-target="197">
                          {dataJumlahAnakSekolah?.tk?.value?.toLocaleString()}
                          {/* <CountUp
                                      start={0}
                                      prefix={widget.prefix}
                                      suffix={widget.suffix}
                                      separator={widget.separator}
                                      end={widget.counter}
                                      decimals={widget.decimals}
                                      duration={4}
                                /> */}
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
              </Col>
              <Col style={{ borderRight: "1px solid #e9ebec" }}>
                <div className="py-4 px-3">
                  <h5 className="text-muted text-uppercase fs-13">
                    SD<i className=" fs-18 float-end align-middle"></i>
                  </h5>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="ri-account-circle-line display-6 text-muted"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h2 className="mb-0">
                        <span className="counter-value fs-18" data-target="197">
                          {dataJumlahAnakSekolah?.sd?.value?.toLocaleString()}
                          {/* <CountUp
                                      start={0}
                                      prefix={widget.prefix}
                                      suffix={widget.suffix}
                                      separator={widget.separator}
                                      end={widget.counter}
                                      decimals={widget.decimals}
                                      duration={4}
                                  /> */}
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
              </Col>
              <Col style={{ borderRight: "1px solid #e9ebec" }}>
                <div className="py-4 px-3">
                  <h5 className="text-muted text-uppercase fs-13">
                    SMP<i className=" fs-18 float-end align-middle"></i>
                  </h5>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="ri-account-circle-line display-6 text-muted"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h2 className="mb-0">
                        <span className="counter-value fs-18" data-target="197">
                          {dataJumlahAnakSekolah?.smp?.value?.toLocaleString()}
                          {/* <CountUp
                                      start={0}
                                      prefix={widget.prefix}
                                      suffix={widget.suffix}
                                      separator={widget.separator}
                                      end={widget.counter}
                                      decimals={widget.decimals}
                                      duration={4}
                                  /> */}
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
              </Col>
              <Col style={{ borderRight: "1px solid #e9ebec" }}>
                <div className="py-4 px-3">
                  <h5 className="text-muted text-uppercase fs-13">
                    SMA<i className=" fs-18 float-end align-middle"></i>
                  </h5>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="ri-account-circle-line display-6 text-muted"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h2 className="mb-0">
                        <span className="counter-value fs-18" data-target="197">
                          {dataJumlahAnakSekolah?.sma?.value?.toLocaleString()}
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
              </Col>
              <Col>
                <div className="py-4 px-3">
                  <h5 className="text-muted text-uppercase fs-13">
                    UNIVERSITAS<i className=" fs-18 float-end align-middle"></i>
                  </h5>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="ri-account-circle-line display-6 text-muted"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h2 className="mb-0">
                        <span className="counter-value fs-18" data-target="197">
                          {dataJumlahAnakSekolah?.univ?.value?.toLocaleString()}
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
          {/* <Row>
            <Col md={6}>
              <Card style={{minHeight:"487px"}}>
                <CardBody>
                  <h4
                    className="card-title d-flex justify-content-center"
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    ANAK BELUM SEKOLAH
                  </h4>
                  <SalesForecastCharts
                    series={dataJumlahAnakBelumPernahSekolah}
                    dataColors='["#32CD32", "#3CB371", "#2E8B57", "#66CDAA", "#8FBC8F", "#98FB98"]'
                  />
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{ minHeight: "487px" }}>
                <CardBody>
                  <h4
                    className="card-title d-flex justify-content-center"
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    TOTAL ANAK TIDAK SEKOLAH (ATS)
                  </h4>
                  <Row>
                    <Col md={12}>
                      <div className="d-flex justify-content-center align-items-center fw-bold">
                        {dataJumlahAnakTidakSekolah.total_ats?.value?.toLocaleString(
                          "id-ID"
                        )}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row> */}
          <Row>
            <Col md={6}>
              <Row>
                <Col>
                  <Card style={{ minHeight: "487px" }}>
                    <CardBody>
                      <div className="separator">
                        <h4 className="card-title mb-0">
                          Anak Tidak Sekolah Karena Drop Out
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
                              PAUD
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
                              SD
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
                              SMP
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
                              SMA/SMK
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </div>
                      <TabContent
                        activeTab={customActiveTab}
                        className="text-muted"
                      >
                        <TabPane tabId="1" id="paud">
                          <SalesForecastCharts
                            series={dataPaud}
                            dataColors='["#32CD32", "#3CB371", "#2E8B57", "#66CDAA", "#8FBC8F", "#98FB98"]'
                          />
                        </TabPane>
                        <TabPane tabId="2" id="sd">
                          <SalesForecastCharts
                            series={dataSd}
                            dataColors='["#E9967A", "#FA8072", "#FF6347", "#FF4500", "#FF7F7F", "#FF6F61"]'
                          />
                        </TabPane>
                        <TabPane tabId="3" id="smp">
                          <SalesForecastCharts
                            series={dataSmp}
                            dataColors='["#4682B4", "#5F9EA0", "#00BFFF", "#87CEEB", "#ADD8E6"]'
                          />
                        </TabPane>
                        <TabPane tabId="4" id="sma/smk">
                          <SalesForecastCharts
                            series={dataSma}
                            dataColors='["#BA7600", "#FCAD24", "#FCAD2464", "#FCC86E"]'
                          />
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Card style={{ minHeight: "487px" }}>
                <CardBody>
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      Anak Tidak Sekolah Karena Tidak Melanjutkan Ke Jenjang
                      Pendidikan
                    </h4>
                  </div>
                  <CustomDataLabel dataColors='["#98FB98", "#3CB371"]' />
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
                      Anak Tidak Sekolah Karena Belum Pernah Bersekolah
                    </h4>
                  </div>
                  <Row>
                    <Col md={2}>
                      <div style={{ marginTop: "30px" }}>
                        <div
                          className="card-title d-flex justify-content-start"
                          style={{ fontWeight: 600, fontSize: "12px" }}
                        >
                          Jumlah Anak Belum Pernah Bersekolah
                        </div>
                        <div
                          className="d-flex justify-content-start mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          {dataJumlahBelumPernahSekolah}
                        </div>
                      </div>
                    </Col>
                    <Col md={10}>
                      <CustomDataLabelTidakSekolah dataColors='["#98FB98"]' />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContentDapodik;
