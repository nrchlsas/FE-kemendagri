"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Label, Row, Table } from "reactstrap";
import { Bar } from "react-chartjs-2";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import { Link } from "react-router-dom";
import TableContainer from "../../Components/Common/TableContainerReactTable";
// import FeatherIcon from "feather-icons-react";
import axios from "axios";
import ExpandableTable from "./expandableTable";

// import Swal from "sweetalert2";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_SQL_URI = `${process.env.REACT_APP_API_SQL_URL}`;

const ContentApbd = () => {
  const totalRincianKab = [];
  const namaKabupaten = [];
  const totalRincianProv = [];
  const nama_provinsi = [];
  //   const [count, setCount] = useState(0)

  //   const handleClick = () => {
  //     setCount(count - 1);
  //   }

  //   const handleClick1 = () =>{
  //     setCount(count + 1)
  //   }

  const [dataPengeluaran, setdataPengeluaran] = useState([]);
  const [dataPenerimaan, setdataPenerimaan] = useState([]);
  const [dataTotalBel, setdataTotalBel] = useState([]);

  const [dataBelanjaNas, setdataBelanjaNas] = useState([]);
  const [loadingProv, setLoadingProv] = useState(true);
  const [errorProv, setErrorProv] = useState(null);

  const [dataGrafikPostur, setDataGrafikPostur] = useState([]);
  const [dataGrafikLabelPostur, setDataGrafikLabelPostur] = useState([]);
  const [dataGrafikValuePostur, setDataGrafikValuePostur] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query:
              "select sum(total_rincian)/1000000000000 TotalPendapatan from konsolidasi_apbd where kode_akun = '4'",
          }),
        };

        const response = await fetch(`${API_SQL_URI}`, requestOptions);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataBelanjaNas = await response.json();
        const formatDataBelanjaNas = parseFloat(
          dataBelanjaNas.datarows[0][0].toFixed(2)
        );
        setdataBelanjaNas(formatDataBelanjaNas);
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(
          // "https://sipdhub.gbhaswaranirantaka.com/sipdhub/postur_apbd_nasional"
          `${API_URI}/postur_apbd_nasional`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataGrafikPostur = await response.json();
        // console.log(dataGrafikPostur.data, "Grafik Postur");

        const mappedData = dataGrafikPostur.data.map((item) => ({
          kode: item.kode_akun,
          nama: item.nama_akun,
          value: item.total.toLocaleString(),
        }));

        setDataGrafikPostur(mappedData);

        const dataGrafikLabel1 = dataGrafikPostur.datarows.map(
          (labelGrafik) => labelGrafik[0]
        );
        setDataGrafikLabelPostur(dataGrafikLabel1);
        console.log(dataGrafikLabel1, "ini label postur");

        const dataGrafikValue1 = dataGrafikPostur.datarows.map(
          (labelGrafik) => labelGrafik[2]
        );
        setDataGrafikValuePostur(dataGrafikValue1);
        console.log(dataGrafikValue1, "ini value postur");
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  }, []);

  const PaginationTable = () => {
    const paginationTable = dataGrafikPostur;
    // dataGrafikPostur.map((item, idx) => {
    // })

    const columns = useMemo(
      () => [
        {
          header: "Kode Akun",
          accessorKey: "kode",
          enableColumnFilter: false,
        },

        {
          header: "Nama Akun",
          accessorKey: "nama",
          enableColumnFilter: false,
        },
        {
          header: "Value",
          accessorKey: "value",
          enableColumnFilter: false,
        },
      ],
      []
    );

    return (
      <React.Fragment>
        <TableContainer
          columns={columns || []}
          data={paginationTable || []}
          customPageSize={45}
          tableClass="table-centered align-middle table-nowrap mb-0"
          theadClass="text-muted table-light"
          SearchPlaceholder="Search Products..."
        />
      </React.Fragment>
    );
  };

  useEffect(() => {
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

        const response = await fetch(
          `${API_URI}/PE_Pendapatan`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataBelanjaNas = await response.json();
        const formatDataBelanjaNas = parseFloat(
          dataBelanjaNas.datarows[0][0].toFixed(2)
        );
        setdataBelanjaNas(formatDataBelanjaNas);
        console.log(options, "ini options");
        setSingleOptions(options);
        console.log(setSingleOptions(options), "ini set single");

        console.log(singleOptions);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query:
              "select sum(total_rincian)/1000000000000 TotalBelanja from konsolidasi_apbd where kode_akun = '5'",
          }),
        };
        const response = await fetch(`${API_SQL_URI}`, requestOptions);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTotalBel = await response.json();
        const formatdataTotalBel = parseFloat(
          dataTotalBel.datarows[0][0].toFixed(2)
        );
        setdataTotalBel(formatdataTotalBel);
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query:
              "select sum(total_rincian)/1000000000000 TotalPembiayaanP from konsolidasi_apbd where kode_kelompok = '6.1'",
          }),
        };
        const response = await fetch(
          "https://192.168.128.72:9220/_plugins/_sql",
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPenerimaan = await response.json();
        const formatDataPenerimaan = parseFloat(
          dataPenerimaan.datarows[0][0].toFixed(2)
        );

        // setData(data.hits.hits);
        setdataPenerimaan(formatDataPenerimaan);

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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query:
              "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          }),
        };
        const response = await fetch(
          "https://192.168.128.72:9220/_plugins/_sql",
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataPengeluaran = await response.json();
        const formatDataPengeluaran = parseFloat(
          dataPengeluaran.datarows[0][0].toFixed(2)
        );
        setdataPengeluaran(formatDataPengeluaran);

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
  }, []);

  const [dataGrafikChartLabelPostur, setDataGrafikChartLabelPostur] = useState(
    []
  );
  const [dataGrafikChartValuePostur, setDataGrafikChartValuePostur] = useState(
    []
  );
  const [dataChartPostur, setDataChartPostur] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(
          // "https://sipdhub.gbhaswaranirantaka.com/sipdhub/data_chart_postur",
          `${API_URI}/data_chart_postur`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataChartPostur = await response.json();

        const arrayLabel = ["Pendapatan", "Belanja", "Pembiayaan Netto"];
        console.log(arrayLabel);

        const arrayValue = [
          parseFloat(dataChartPostur.data[0].pendapatan),
          parseFloat(dataChartPostur.data[0].belanja),
          parseFloat(dataChartPostur.data[0].pembiayaan_netto),
        ];
        console.log(arrayValue);

        setDataGrafikChartLabelPostur(arrayLabel);
        setDataGrafikChartValuePostur(arrayValue);
      } catch (errorProv) {
        setErrorProv(errorProv);
      } finally {
        setLoadingProv(false);
      }
    };

    fetchData();
  }, []);

  const BarChartGrafikPosturAPBD = ({ dataColors }) => {
    var barChartColor = getChartColorsArray(dataColors);
    const data = {
      labels: dataGrafikChartLabelPostur,
      datasets: [
        {
          label: "Total Rincian Dalam (Triliun)",
          backgroundColor: barChartColor[0],
          borderColor: barChartColor[0],
          borderWidth: 1,
          hoverBackgroundColor: barChartColor[1],
          hoverBorderColor: barChartColor[1],
          data: dataGrafikChartValuePostur,
          // data: [],
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

  return (
    <React.Fragment>
      <Row>
        <Col md={3}>
          <Link to="/apbd-details">
            <Card className="card-animate" style={{ borderRadius: "100px" }}>
              <CardBody>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="avatar-sm flex-shrink-0 ">
                    <span className="avatar-title bg-success-subtle rounded-circle fs-2">
                      {/* <FeatherIcon
                      icon="check-circle"
                      className="text-success"
                    ></FeatherIcon> */}
                      <i className="ri-wallet-line text-success"></i>
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
                        fontSize: "22px",
                        fontWeight: 600,
                      }}
                    >
                      Pendapatan Nasional
                    </div>
                    <div
                      style={{
                        fontColor: "#333333",
                        fontSize: "18px",
                        fontWeight: 400,
                      }}
                    >
                      {dataBelanjaNas} T
                    </div>
                  </div>
                </div>

                {/* <BarChartProv dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/> */}
              </CardBody>
            </Card>
          </Link>
        </Col>

        <Col md={3}>
          <Link to="/apbd-details">
            <Card className="card-animate" style={{ borderRadius: "100px" }}>
              <CardBody>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="avatar-sm flex-shrink-0 ">
                    <span className="avatar-title bg-primary-subtle rounded-circle fs-2">
                      {/* <FeatherIcon
                      icon="check-circle"
                      className="text-primary"
                    ></FeatherIcon> */}
                      <i className="ri-shopping-cart-2-line text-primary"></i>
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
                        fontSize: "22px",
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
                      {dataTotalBel} T
                    </div>
                  </div>
                </div>
                {/* <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-0"
                  style={{
                    fontColor: "#333333",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Total Belanja Nasional
                </div>
                <div>{dataBel.datarows}</div>
              </div> */}
                {/* <BarChartKab dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/> */}
              </CardBody>
            </Card>
          </Link>
        </Col>

        <Col md={3}>
          <Link to="/apbd-details">
            <Card className="card-animate" style={{ borderRadius: "100px" }}>
              <CardBody>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="avatar-sm flex-shrink-0 ">
                    <span className="avatar-title bg-warning-subtle rounded-circle fs-2">
                      {/* <FeatherIcon
                      icon="check-circle"
                      className="text-warning"
                    ></FeatherIcon> */}
                      <i className="ri-hand-coin-line text-warning"></i>
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
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      Pembiayaan Penerimaan
                    </div>
                    <div
                      style={{
                        fontColor: "#333333",
                        fontSize: "18px",
                        fontWeight: 400,
                      }}
                    >
                      {dataPenerimaan} T
                    </div>
                  </div>
                </div>
                {/* <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-0"
                  style={{
                    fontColor: "#333333",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Penerimaan
                </div>
                <div>{dataPenerimaan.datarows}</div>
              </div> */}

                {/* <BarChartKab dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/> */}
              </CardBody>
            </Card>
          </Link>
        </Col>

        <Col md={3}>
          <Link to="/apbd-details">
            <Card className="card-animate" style={{ borderRadius: "100px" }}>
              <CardBody>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="avatar-sm flex-shrink-0 ">
                    <span className="avatar-title bg-secondary-subtle rounded-circle fs-2">
                      {/* <FeatherIcon
                      icon="check-circle"
                      className="text-secondary"
                    ></FeatherIcon> */}
                      <i className="ri-shopping-bag-line text-secondary"></i>
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
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                    >
                      Pembiayaan Pegeluaran
                    </div>
                    <div
                      style={{
                        fontColor: "#333333",
                        fontSize: "18px",
                        fontWeight: 400,
                      }}
                    >
                      {dataPengeluaran} T
                    </div>
                  </div>
                </div>
                {/* <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-0"
                  style={{
                    fontColor: "#333333",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Pegeluaran
                </div>
                <div>{dataPengeluaran.datarows}</div>
              </div> */}

                {/* <BarChartKab dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/> */}
              </CardBody>
            </Card>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4
                className="card-title mb-5 d-flex justify-content-center"
                style={{ fontSize: "20px", fontWeight: 600 }}
              >
                Grafik Postur
              </h4>
              <BarChartGrafikPosturAPBD dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]' />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="card-animate">
            <CardBody>
              <h4
                className="card-title mb-5 d-flex justify-content-center"
                style={{ fontSize: "20px", fontWeight: 600 }}
              >
                Postur Anggaran Pendapatan dan Belanja se Nasional
              </h4>
              <div className="">
                {/* <BarChartPostur dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'/> */}
                <div className="live-preview p-3">
                  <div className="table-responsive table-card">
                    {/* <table className="table align-middle table-nowrap table-striped-columns mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Kode Akun</th>
                          <th scope="col">Nama Akun</th>
                          <th scope="col">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataGrafikPostur.map((item, idx) => (
                          <tr key={idx}>
                           
                            {item.kode == "4" ||
                            item.kode == "5" ||
                            item.kode == "6" ? (
                              <td>
                                <div style={{ fontWeight: 800 }}>
                                  {item.kode}
                                </div>
                              </td>
                            ) : (
                              <td>{item.kode}</td>
                            )}
                        
                            {item.kode == "4" ||
                            item.kode == "5" ||
                            item.kode == "6" ? (
                              <td>
                                <div style={{ fontWeight: 800 }}>
                                  {item.nama}
                                </div>
                              </td>
                            ) : (
                              <td>{item.nama}</td>
                            )}
                         
                            {item.kode == "4" ||
                            item.kode == "5" ||
                            item.kode == "6" ? (
                              <td>
                                <div style={{ fontWeight: 800 }}>
                                  {item.value}
                                </div>
                              </td>
                            ) : (
                              <td>{item.value}</td>
                            )}
                          
                          </tr>
                        ))}
                      </tbody>
                    </table> */}
                    <ExpandableTable />
                  </div>
                </div>
                {/* <PaginationTable /> */}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContentApbd;
