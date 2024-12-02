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
  Modal,
  ModalHeader,
  ModalBody,
  CardHeader,
} from "reactstrap";
import classnames from "classnames";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import VerticalBarChart from "../../Components/Chart/VerticalBarChart";
import Pagination from "../../Components/Pagination/Pagination";
import HorizontalBarChart from "../../Components/Chart/HorizontalBarChart";
import CountUp from "react-countup";
import BarWithPercentage from "../../Components/Chart/BarWithPercentage";
import PieChartNew from "../../Components/Chart/PieChart";
import logoKemenkoPmk from "../../assets/images/logo-kemendagri/logo-kemenko-pmk.png";
import "./../Dapodik/dapodik.scss";
import { useNavigate } from "react-router-dom";
import FilterRightSide from "./FilterRightSide";
// import DashboardAnalisisRightSide from "./DashboardAnalisisRightSide";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const ContentDashboardAnalisis = () => {
  const [dataDashboardAnalisis, setDataDashboardAnalisis] = useState([]);
  const [errorDataDashboardAnalisis, setErrorDataDashboardAnalisis] = useState(
    []
  );
  const [loadingDataDashboardAnalisis, setLoadingDataDashboardAnalisis] =
    useState([]);

  const getDataDashboardAnalisis = ({
    kodeDdn,
    namaDaerah,
    kodeFungsi,
    namaFungsi,
    idSpm,
    spmTeks,
    kodeSkpd,
    namaSkpd,
    kodeUrusan,
    namaUrusan,
    kodeBidangUrusan,
    namaBidangUrusan,
    kodeProgram,
    namaProgram,
    kodeGiat,
    namaGiat,
    kodeSubGiat,
    namaSubGiat,
    kodeObjek,
    namaObjek,
    kodeRo,
    namaRo,
    kodeSro,
    namaSro
  }) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kode_ddn: kodeDdn,
            nama_daerah: namaDaerah,
            kode_fungsi: kodeFungsi,
            nama_fungsi: namaFungsi,
            id_spm: idSpm,
            spm_teks: spmTeks,
            kode_skpd: kodeSkpd,
            nama_skpd: namaSkpd,
            kode_urusan: kodeUrusan,
            nama_urusan: namaUrusan,
            kode_bidang_urusan: kodeBidangUrusan,
            nama_bidang_urusan: namaBidangUrusan,
            kode_program: kodeProgram,
            nama_program: namaProgram,
            kode_giat: kodeGiat,
            nama_giat: namaGiat,
            kode_sub_giat: kodeSubGiat,
            nama_sub_giat: namaSubGiat,
            kode_objek: kodeObjek,
            nama_objek: namaObjek,
            kode_ro: kodeRo,
            nama_ro: namaRo,
            kode_sro: kodeSro,
            nama_sro: namaSro,
          }),
        };
        const response = await fetch(
          `${API_URI}/dashboard_anggaran_analisis`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataDashboardAnalisis = await response.json();        
        setDataDashboardAnalisis(dataDashboardAnalisis?.data || []);
      } catch (errorDashboardAnalisis) {
        setErrorDataDashboardAnalisis(errorDashboardAnalisis);
      } finally {
        setLoadingDataDashboardAnalisis(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    getDataDashboardAnalisis({});
  }, []);
  
  const [selectedFilters, setSelectedFilters] = useState({
    daerah: [],
    skpd:[],
    fungsi: [],
    spm: [],
    urusan: [],
    bidangUrusan:[],
    program:[],
    kegiatan:[],
    subKegiatan: [],
    objek: [],
    rincianObjek: [],
    subRincianObjek: [],
});

const cleanPayload = (payload) => {
    return Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => !(Array.isArray(value) && value.length === 0))
    );
};

const handleFilterUpdate = (filters) => {
    setSelectedFilters(filters);

    // Bersihkan payload
    const cleanedFilters = cleanPayload(filters);

    // Kirimkan request berdasarkan filter yang dipilih
    getDataDashboardAnalisis({
        kodeDdn: cleanedFilters.daerah,
        kodeSkpd: cleanedFilters.skpd,
        kodeFungsi: cleanedFilters.fungsi,
        idSpm: cleanedFilters.spm,
        kodeUrusan: cleanedFilters.urusan,
        kodeBidangUrusan: cleanedFilters.bidangUrusan,
        kodeProgram: cleanedFilters.program,
        kodeGiat: cleanedFilters.kegiatan,
        kodeSubGiat: cleanedFilters.subKegiatan,
        kodeObjek: cleanedFilters.objek,
        kodeRo: cleanedFilters.rincianObjek,
        kodeSro: cleanedFilters.subRincianObjek
    });
};

  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="d-flex justify-content-between">
            <div
              className="d-flex flex-column title-page"
              style={{ padding: "0 0 13px 0" }}
            >
              <div className="d-flex justify-content-start ms-2 align-items-center">
                <span>Dashboard Analisis</span>
              </div>
              <div
                className="d-flex justify-content-start ms-2 align-items-center"
                style={{
                  color: "#CCD4DC",
                  fontSize: "16px",
                  fontWeight: "400",
                }}
              >
                <span>
                  Terakhir diperbarui: Sabtu, 14 September 2024, Pukul 12:30
                </span>
              </div>
            </div>
          </div>
          <Row>
            <Col md={4}>
              <Card>
                <CardHeader>
                  <div>
                  <div
                    style={{
                      fontColor: "#00000",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    Data
                  </div>
                  </div>
                  
                </CardHeader>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-start">
                    <div
                      className="d-flex flex-column"
                      style={{ fontSize: "18px" }}
                    >
                      <span className="mb-2">SKPD</span>
                      <span className="mb-2">Unit SKPD</span>
                      <span className="mb-2">Program</span>
                      <span className="mb-2">Kegiatan</span>
                      <span className="mb-2">Sub Kegiatan</span>
                      <span className="mb-2">Rekening Pendapatan</span>
                      <span className="mb-2">Rekening Belanja</span>
                      <span className="mb-2">Rekening Pembiayaan</span>
                    </div>
                    <div
                      className="d-flex flex-column align-items-end"
                      style={{ fontSize: "18px" }}
                    >
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_skpd?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_unit_skpd?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_program?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_kegiatan?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_sub_kegiatan?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.rekening_pendapatan?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.rekening_belanja?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.rekening_pembiayaan?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                    <div className="d-flex flex-column justify-content-start align-items-start title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Pendapatan</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-success-subtle rounded-4 fs-3">
                              <i className="bx bx-wallet text-success"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.total_pendapatan}
                                separator="."
                                prefix="Rp "
                                suffix=""
                                duration={3}
                              />
                            </span>
                          </div>
                        </div>
                      </div>                      
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>
                            Total Anggaran Standar Pelayanan Minimal (SPM)
                          </span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-secondary-subtle rounded-4 fs-3">
                              <i className="bx bx-donate-heart text-secondary"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.total_anggaran_spm}
                                separator="."
                                prefix="Rp "
                                suffix=""
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
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Pembiayaan</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="bx bx-calculator text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.total_pembiayaan}
                                separator="."
                                prefix="Rp "
                                suffix=""
                                duration={3}
                              />
                            </span>
                          </div>
                        </div>
                      </div>   
                      
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Anggaran Miskin Ekstrem</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                              <i className="bx bx-body text-danger"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={
                                  dataDashboardAnalisis?.data_dashboard_nasional?.total_anggaran_miskin_ekstrem
                                }
                                separator="."
                                prefix="Rp "
                                suffix=""
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
                <Col md={6}>
                <Card className="card-height-100 card-animate">
                    <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Belanja</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                              <i className="bx bx-cart-alt text-info"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-start align-items-start ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.total_belanja}
                                separator="."
                                prefix="Rp "
                                suffix=""
                                duration={3}
                              />
                            </span>
                          </div>
                        </div>
                      </div>                 
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="card-height-100 card-animate">
                    <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Anggaran Stunting</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-primary-subtle rounded-4 fs-3">
                              <i className="bx bx-receipt text-primary"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-start align-items-start ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.total_anggaran_stunting}
                                separator="."
                                prefix="Rp "
                                suffix=""
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
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <Card className="card-height-100 card-animate">
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Total Belanja Per Sumber Dana
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={5}>
                  <PieChartNew
                    dataChart={[12, 12]}
                    dataColors={'["#2DAED4", "#FCAD24"]'}
                    categoryName={[
                      "Anggaran Di luar Pendidikan",
                      "Anggaran Pendidikan",
                    ]}
                    pieChart={false}
                    showLegend={false}
                    percentOnly={true}
                    legendHorizontal={false}
                    heightChart="350px"
                  />
                </Col>
                <Col md={7}>
                  <div className="d-flex" style={{ fontSize: "26px" }}>
                    <span>Total Sumber Dana : Rp 13.099.467.360.171,09</span>
                  </div>
                  <div
                    className="d-flex flex-column"
                    style={{ maxHeight: "350px", overflowY: "auto" }}
                  >
                    {Array.from({ length: 20 }, (_, index) => (
                      <div key={index}>
                        <ul>
                          <li>
                            <div className="d-flex flex-column">
                              <div style={{ fontSize: "16px" }}>
                                {`Jenis Anggaran ${index}`}
                              </div>
                              <div
                                style={{ fontSize: "16px", fontWeight: 600 }}
                              >
                                {Math.floor(Math.random() * 10000000000000)}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card>
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Total Anggaran Belanja Berdasarkan Kelompok
              </div>
            </CardHeader>
            <CardBody>
              <table class="table table-nowrap">
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "#57E7B4",
                              marginRight: "8px",
                            }}
                          ></div>
                          <span
                            style={{ fontStyle: "poppins", color: "#929FB1" }}
                          >
                            belanja
                          </span>
                        </div>
                      </td>
                      <td>Rp {Math.floor(Math.random() * 10000000000)}</td>
                      <td>
                        <span style={{ float: "right" }}>{`${Math.floor(
                          Math.random() * 100
                        )}%`}</span>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border-bottom-0">Total</td>
                    <td className="border-bottom-0" style={{ fontWeight: 600 }}>
                      Rp {Math.floor(Math.random() * 10000000000000)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Total Anggaran Pendapatan Berdasarkan Kelompok
              </div>
            </CardHeader>
            <CardBody>
              <table class="table table-nowrap">
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "#57E7B4",
                              marginRight: "8px",
                            }}
                          ></div>
                          <span
                            style={{ fontStyle: "poppins", color: "#929FB1" }}
                          >
                            belanja
                          </span>
                        </div>
                      </td>
                      <td>Rp {Math.floor(Math.random() * 10000000000)}</td>
                      <td>
                        <span style={{ float: "right" }}>{`${Math.floor(
                          Math.random() * 100
                        )}%`}</span>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border-bottom-0">Total</td>
                    <td className="border-bottom-0" style={{ fontWeight: 600 }}>
                      Rp {Math.floor(Math.random() * 10000000000000)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Narasi Analisis
              </div>
            </CardHeader>
            <CardBody>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis
              adipisci eaque doloremque incidunt, excepturi doloribus
              cupiditate? Harum minus asperiores aspernatur, quo laudantium
              beatae sit vel unde cumque eius neque soluta, est ullam
              dignissimos fugit corporis, dolorem aut. Excepturi sequi aut
              dolorum obcaecati doloremque porro, nulla deserunt sint rem
              dolorem earum suscipit, voluptatum nam atque incidunt perspiciatis
              reprehenderit id possimus nesciunt explicabo illum? Sapiente neque
              quidem vero quibusdam molestias ratione maiores eius enim,
              recusandae voluptates ut inventore dicta placeat ipsa, eligendi
              repellat incidunt modi. Distinctio tempora tenetur pariatur! Iure
              tempore nulla, ratione accusamus sint quod sapiente aspernatur
              sed. Officia, rem earum!
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                List Data Anggaran Per Daerah
              </div>
            </CardHeader>
            <CardBody>
              <table class="table table-nowrap">
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}>
                      <td>
                        Urusan Pemerintahan Wajib yang Berkaitan Dengan
                        Pelayanan Dasar
                      </td>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div className="d-flex flex-column justify-content-evenly">
                            <div className="d-flex align-items-center mb-2">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#57E7B4",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Pendapatan
                              </span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#FCAD24",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Belanja
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#EFF2F7",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Pembiayaan
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column justify-content-evenly">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column justify-content-evenly">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >
                              10%
                            </span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >
                              10%
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ fontStyle: "poppins", color: "#9f9FB1" }}
                            >
                              10%
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                List Data Anggaran Per Urusan
              </div>
            </CardHeader>
            <CardBody>
              <table class="table table-nowrap">
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}>
                      <td>
                        Urusan Pemerintahan Wajib yang Berkaitan Dengan
                        Pelayanan Dasar
                      </td>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div className="d-flex flex-column justify-content-evenly">
                            <div className="d-flex align-items-center mb-2">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#57E7B4",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Pendapatan
                              </span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#FCAD24",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Belanja
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#EFF2F7",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Pembiayaan
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column justify-content-evenly">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column justify-content-evenly">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >
                              10%
                            </span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >
                              10%
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ fontStyle: "poppins", color: "#9f9FB1" }}
                            >
                              10%
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
      <FilterRightSide dataFilter={dataDashboardAnalisis} onSelectFilter={handleFilterUpdate} />
    </React.Fragment>
  );
};

export default ContentDashboardAnalisis;