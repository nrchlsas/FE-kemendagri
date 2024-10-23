import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Col, Row } from "reactstrap";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import geoIndo from "../../data/geoIndo.json";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import "./../Kependudukan/kependudukan.scss";
import HorizontalBarChart from "../../Components/Chart/HorizontalBarChart";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const ContentUhc = () => {
  const [dataJumlahPesertaBpjs, setDataJumlahPesertaBpjs] = useState([]);
  const [loadingJumlahPesertaBpjs, setLoadingJumlahPesertaBpjs] = useState([]);
  const [errorJumlahPesertaBpjs, setErrorJumlahPesertaBpjs] = useState([]);

  // const getDataJumlahPesertaBpjs = () => {
  //   const fetchData = async () => {
  //     try {
  //       const requestOptions = {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //         // body: JSON.stringify({
  //         //   query:
  //         //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
  //         // }),
  //       };
  //       const response = await fetch(
  //         `${API_URI}/dash_uhc_jumlah_peserta_bpjs`,
  //         requestOptions
  //       );
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const dataJumlahPesertaBpjs = await response.json();
  //       // const formatDataPengeluaran = parseFloat(
  //       //   dataPengeluaran.datarows[0][0].toFixed(2)
  //       // );
  //       console.log(
  //         dataJumlahPesertaBpjs.data.aggregations["1"].value,
  //         "ini data jumlah peserta bpjs"
  //       );
  //       setDataJumlahPesertaBpjs(
  //         dataJumlahPesertaBpjs.data.aggregations["1"].value.toLocaleString('id-ID')
  //       );

  //       // console.log(data.hits.hits)
  //     } catch (errorJumlahPesertaBpjs) {
  //       setErrorJumlahPesertaBpjs(errorJumlahPesertaBpjs);
  //     } finally {
  //       setLoadingJumlahPesertaBpjs(false);
  //     }
  //   };
  //   fetchData();
  // };

  const [dataJumlahPesertaNonBpjs, setDataJumlahPesertaNonBpjs] = useState([]);
  const [loadingJumlahPesertaNonBpjs, setLoadingJumlahPesertaNonBpjs] =
    useState([]);
  const [errorJumlahPesertaNonBpjs, setErrorJumlahPesertaNonBpjs] = useState(
    []
  );

  const getDataJumlahPesertaNonBpjs = () => {
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
          `${API_URI}/dash_uhc_jumlah_non_peserta_bpjs`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPesertaNonBpjs = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(dataJumlahPesertaNonBpjs, "ini");
        setDataJumlahPesertaNonBpjs(dataJumlahPesertaNonBpjs);

        // console.log(data.hits.hits)
      } catch (errorJumlahPesertaNonBpjs) {
        setErrorJumlahPesertaNonBpjs(errorJumlahPesertaNonBpjs);
      } finally {
        setLoadingJumlahPesertaNonBpjs(false);
      }
    };
    fetchData();
  };

  const [dataJumlahBelumMasukBpjs, setDataJumlahBelumMasukBpjs] = useState([]);
  const [loadingJumlahBelumMasukBpjs, setLoadingJumlahBelumMasukBpjs] =
    useState([]);
  const [errorJumlahBelumMasukBpjs, setErrorJumlahBelumMasukBpjs] = useState(
    []
  );

  const getDataJumlahBelumMasukBpjs = () => {
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
          `${API_URI}/dash_uhc_jumlah_belum_masuk_bpjs`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahBelumMasukBpjs = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );
        console.log(dataJumlahBelumMasukBpjs.data.aggregations, "ini");
        setDataJumlahBelumMasukBpjs(dataJumlahBelumMasukBpjs.data.aggregations);

        // console.log(data.hits.hits)
      } catch (errorJumlahBelumMasukBpjs) {
        setErrorJumlahBelumMasukBpjs(errorJumlahBelumMasukBpjs);
      } finally {
        setLoadingJumlahBelumMasukBpjs(false);
      }
    };
    fetchData();
  };

  const [dataJumlahNonPesertaAllGender, setDataJumlahNonPesertaAllGender] =
    useState([]);
  const [
    loadingJumlahNonPesertaAllGender,
    setLoadingJumlahNonPesertaAllGender,
  ] = useState([]);
  const [errorJumlahNonPesertaAllGender, setErrorJumlahNonPesertaAllGender] =
    useState([]);

  const getDataJumlahNonPesertaAllGender = () => {
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
          `${API_URI}/dash_uhc_jumlah_non_peserta_all_gender`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahNonPesertaAllGender = await response.json();

        console.log(
          dataJumlahNonPesertaAllGender.data.aggregations,
          "ini jumlah"
        );
        const dataMapped = {
          lakiLaki:
            dataJumlahNonPesertaAllGender.data.aggregations[
              "1"
            ].value.toLocaleString("id-ID"),
          perempuan:
            dataJumlahNonPesertaAllGender.data.aggregations[
              "2"
            ].value.toLocaleString("id-ID"),
        };

        setDataJumlahNonPesertaAllGender(dataMapped);

        // console.log(data.hits.hits)
      } catch (errorJumlahNonPesertaAllGender) {
        setErrorJumlahNonPesertaAllGender(errorJumlahNonPesertaAllGender);
      } finally {
        setLoadingJumlahNonPesertaAllGender(false);
      }
    };
    fetchData();
  };

  const [dataTotalDitanggungPemda, setDataTotalDitanggungPemda] = useState([]);
  const [loadingTotalDitanggungPemda, setLoadingTotalDitanggungPemda] =
    useState([]);
  const [errorTotalDitanggungPemda, setErrorTotalDitanggungPemda] = useState(
    []
  );

  const getDataTotalDitanggungPemda = () => {
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
          `${API_URI}/dash_uhc_total_ditanggung_pemda`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTotalDitanggungPemda = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // )
        const mappedData = {
          kelas3:
            dataTotalDitanggungPemda.data.aggregations.total_pbpubp_kelas3.value.toLocaleString(
              "id-ID"
            ),
          pemda:
            dataTotalDitanggungPemda.data.aggregations.total_pbpubp_pemda.value.toLocaleString(
              "id-ID"
            ),
        };

        console.log(dataTotalDitanggungPemda, "ini");
        setDataTotalDitanggungPemda(mappedData);

        // console.log(data.hits.hits)
      } catch (errorTotalDitanggungPemda) {
        setErrorTotalDitanggungPemda(errorTotalDitanggungPemda);
      } finally {
        setLoadingTotalDitanggungPemda(false);
      }
    };
    fetchData();
  };

  const [dataPembiayaan, setDataPembiayaan] = useState([]);
  const [loadingPembiayaan, setLoadingPembiayaan] = useState([]);
  const [errorPembiayaan, setErrorPembiayaan] = useState([]);

  const getDataPembiayaan = () => {
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
          `${API_URI}/dash_uhc_pembiayaan`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPembiayaan = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        console.log(dataPembiayaan, "ini pembiayaan");
        let valuesArray = [];

        valuesArray = Object.values(dataPembiayaan.data.aggregations).map(
          (item) => item.value
        );
        console.log(valuesArray, "ini pembiayaan1");

        setDataPembiayaan(valuesArray);

        // console.log(data.hits.hits)
      } catch (errorPembiayaan) {
        setErrorPembiayaan(errorPembiayaan);
      } finally {
        setLoadingPembiayaan(false);
      }
    };
    fetchData();
  };

  const [
    dataComparePesertaDitanggungPemda,
    setDataComparePesertaDitanggungPemda,
  ] = useState([]);
  const [
    loadingComparePesertaDitanggungPemda,
    setLoadingComparePesertaDitanggungPemda,
  ] = useState([]);
  const [
    errorComparePesertaDitanggungPemda,
    setErrorComparePesertaDitanggungPemda,
  ] = useState([]);

  const getDataComparePesertaDitanggungPemda = () => {
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
          `${API_URI}/dash_uhc_compare_peserta_ditanggung_pemda`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataComparePesertaDitanggungPemda = await response.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        setDataComparePesertaDitanggungPemda(dataComparePesertaDitanggungPemda);

        // console.log(data.hits.hits)
      } catch (errorComparePesertaDitanggungPemda) {
        setErrorComparePesertaDitanggungPemda(
          errorComparePesertaDitanggungPemda
        );
      } finally {
        setLoadingComparePesertaDitanggungPemda(false);
      }
    };
    fetchData();
  };

  const [dataJumlahPenduduk, setDataJumlahPenduduk] = useState({});
  const [loadingJumlahPenduduk, setLoadingJumlahPenduduk] = useState([]);
  const [errorJumlahPenduduk, setErrorJumlahPenduduk] = useState([]);
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
          `${API_URI}/dash_uhc_jumlah_penduduk`,
          requestOptions
        );
        const responseBpjs = await fetch(
          `${API_URI}/dash_uhc_jumlah_peserta_bpjs`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataJumlahPenduduk = await response.json();
        const dataJumlahBpjs = await responseBpjs.json();
        // const formatDataPengeluaran = parseFloat(
        //   dataPengeluaran.datarows[0][0].toFixed(2)
        // );

        console.log(
          dataJumlahPenduduk.data.aggregations,
          "ini data jumlah penduduk"
        );
        console.log(dataJumlahBpjs.data.aggregations, "ini data jumlah bpjs");
        const mappedData = {
          jumlahPenduduk:
            dataJumlahPenduduk.data.aggregations["1"].value.toLocaleString(
              "id-ID"
            ),
          jumlahBpjs:
            dataJumlahBpjs.data.aggregations["1"].value.toLocaleString("id-ID"),
          persentase: `${(
            (dataJumlahBpjs.data.aggregations["1"].value /
              dataJumlahPenduduk.data.aggregations["1"].value) *
            100
          ).toFixed(2)} %`,
        };

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

  useEffect(() => {
    // getDataJumlahPesertaBpjs();
    getDataJumlahPesertaNonBpjs();
    getDataJumlahBelumMasukBpjs();
    getDataJumlahNonPesertaAllGender();
    getDataTotalDitanggungPemda();
    getDataPembiayaan();
    // getDataComparePesertaDitanggungPemda();
    getDataJumlahPenduduk();
  }, []);

  const CustomDataLabel = ({ dataColors }) => {
    var chartDatalabelsBarColors = getChartColorsArray(dataColors);
    const series = [
      {
        data: dataPembiayaan,
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
          colors: ["#fff"],
        },
        formatter: function (val, opt) {
          return (
            opt.w.globals.labels[opt.dataPointIndex] +
            ":  " +
            val.toLocaleString("id-ID")
          );
        },
        offsetX: 0,
        dropShadow: {
          enabled: false,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: ["Pemda", "Pusat", "Umum"],
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

  //react leaflet
  const [color, setColor] = useState("#ffff00");

  const colors = ["green", "blue", "yellow", "orange", "grey"];

  useEffect(() => {
    console.log(geoIndo, "ini");
  }, []);

  const countryStyle = {
    fillColor: "red",
    fillOpacity: 1,
    color: "black",
    weight: 2,
  };

  const printMessageToConsole = (event) => {
    console.log("Clicked");
  };

  const changeCountryColor = (event) => {
    event.target.setStyle({
      color: "green",
      fillColor: color,
      fillOpacity: 1,
    });
  };

  const onEachCountry = (country, layer) => {
    const countryName = country.properties.WADMPR;
    console.log(countryName, "ini country name");
    layer.bindPopup(countryName);

    layer.options.fillOpacity = Math.random();

    // Uncomment to apply random colors
    // const colorIndex = Math.floor(Math.random() * colors.length);
    // layer.options.fillColor = colors[colorIndex];

    layer.on({
      click: changeCountryColor,
    });
  };

  const colorChange = (event) => {
    setColor(event.target.value);
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="card-custom">
            <div className="d-flex title-page">
              <div className="avatar-sm">
                <i className="ri-account-circle-line text-dark fs-1"></i>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>Universal Health Coverage</span>
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
              <div className="d-flex justify-content-start mb-2">
                Capaian Universal Health Coverage (UHC)
              </div>
              <Row>
                <Col>
                  <Card className="card-animate">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Jumlah Penduduk</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="ri-account-circle-line text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              {dataJumlahPenduduk.jumlahPenduduk} Jiwa
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
                          <span>JUMLAH BPJS KESEHATAN</span>
                          {/* <span className="title-percent">{dataJumlahPenduduk.persenLaki}</span> */}
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                              <i className="las la-briefcase-medical text-info"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>{dataJumlahPenduduk.jumlahBpjs} Jiwa</span>
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
                          <span>PERCENTASE</span>
                          {/* <span className="title-percent">{dataJumlahPenduduk.persenPerempuan}</span> */}
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                              <i className="ri-percent-line text-danger"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>{dataJumlahPenduduk.persentase}</span>
                          </div>
                        </div>
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
        <Col xl={6}>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  Penduduk Belum Masuk Kepesertaan BPJS Kesehatan
                </h4>
              </div>
              <Col>
                <Card>
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                        <span>Laki - Laki</span>
                      </div>
                      <div className="d-flex">
                        <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                            <i className="ri-men-line text-info"></i>
                          </span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                          <span>{dataJumlahNonPesertaAllGender.lakiLaki} </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                        <span>Perempuan</span>
                      </div>
                      <div className="d-flex">
                        <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                            <i className=" ri-women-line text-danger"></i>
                          </span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                          <span>{dataJumlahNonPesertaAllGender.perempuan}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </CardBody>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  Peserja BPJS Kesehatan Yang Ditanggung Pemda
                </h4>
              </div>
              <Col>
                <Card>
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                        <span>PB PU/BP PEMDA</span>
                      </div>
                      <div className="d-flex">
                        <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                            <i className="ri-account-circle-line text-warning"></i>
                          </span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                          <span>{dataTotalDitanggungPemda.pemda}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                        <span>PB PU/BP Kelas III</span>
                      </div>
                      <div className="d-flex">
                        <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                            <i className="ri-account-circle-line text-warning"></i>
                          </span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                          <span>{dataTotalDitanggungPemda.kelas3}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ minHeight: "410px" }}>
            <CardBody>
              % Pembiayaan
              {/* <HorizontalBarChart />  */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContentUhc;
