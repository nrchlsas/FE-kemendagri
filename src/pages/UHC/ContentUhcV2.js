import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import "leaflet/dist/leaflet.css";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import "./../Kependudukan/kependudukan.scss";
import HorizontalBarChart from "../../Components/Chart/HorizontalBarChart";
import PieChartNew from "../../Components/Chart/PieChart";
import CountUp from "react-countup";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const ContentUhcV2 = () => {
  const [customActiveTab, setcustomActiveTab] = useState("2");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const [dataUhc, setDataUhc] = useState([]);
  const [dataCategoryChartPembiayaan, setDataCategoryChartPembiayaan] = useState([])
  const [dataValueChartPembiayaan, setDataValueChartPembiayaan] = useState([])
  const [dataChartGender, setDataChartGender] = useState([[], []])
  const [loadingUhc, setLoadingUhc] = useState([]);
  const [errorUhc, setErrorUhc] = useState([]);

  const getDataUhc = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dashboard_uhc`,
          requestOptions
        );
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataUhc = await response.json();

        const categoryPembiayaan = Object.keys(dataUhc.data.uhc_pembiayaan);
        const valuePembiayaan = Object.values(dataUhc.data.uhc_pembiayaan);

        setDataUhc(dataUhc.data);
        setDataCategoryChartPembiayaan(categoryPembiayaan)
        setDataValueChartPembiayaan(valuePembiayaan)

        const dataGender = [dataUhc.data.uhc_jumlah_belum_masuk_bpjs.laki, dataUhc.data.uhc_jumlah_belum_masuk_bpjs.perempuan]
        console.log(dataGender)
        setDataChartGender(dataGender)

      } catch (errorUhc) {
        setErrorUhc(errorUhc);
      } finally {
        setLoadingUhc(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    getDataUhc();
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="card-custom ">
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
          <Card className="card-height-100">
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
                  <Card className="card-animate card-height-100">
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
                            <CountUp
                            start={0}
                            end={dataUhc?.uhc_total_jumlah_penduduk}
                            separator="."
                            prefix=""
                            suffix=" Jiwa"
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
                  <Card className="card-animate card-height-100">
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
                            <span>
                            <CountUp
                            start={0}
                            end={dataUhc?.uhc_jumlah_peserta_bpjs}
                            separator="."
                            prefix=""
                            suffix=" Jiwa"
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
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                          <span>PERCENTASE</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                              <i className="ri-percent-line text-danger"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                            <CountUp
                            start={0}
                            end={(dataUhc?.uhc_jumlah_peserta_bpjs/dataUhc?.uhc_total_jumlah_penduduk)*100}
                            separator="."
                            decimals={2}
                            decimal=","
                            prefix=""                            
                            suffix="%"
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
              <Row>
                <Col md={6}>
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
                          <span>
                            {dataUhc?.uhc_jumlah_belum_masuk_bpjs?.laki? dataUhc.uhc_jumlah_belum_masuk_bpjs.laki.toLocaleString("id-ID") : "N/A"}
                          </span>
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
                          <span>{dataUhc?.uhc_jumlah_belum_masuk_bpjs?.perempuan? dataUhc.uhc_jumlah_belum_masuk_bpjs.perempuan.toLocaleString("id-ID") : "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
                </Col>
                <Col md={6}>
                <PieChartNew
                        dataChart={dataChartGender}
                        dataColors={'["#2DAED4", "#FFA0BE"]'}
                        categoryName={[
                          "Laki - Laki",
                          "Perempuan",
                        ]}
                        showLegend={false}
                        percentOnly={true}
                        legendHorizontal={true}
                        heightChart="250px"
                      />
                </Col>
              </Row>
              
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
                          <span>{dataUhc?.uhc_total_ditanggung_pemda?.total_pbpubp_pemda?.toLocaleString("id-ID")}</span>
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
                          <span>{dataUhc?.uhc_total_ditanggung_pemda?.total_pbpubp_kelas3?.toLocaleString("id-ID")}</span>
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
              <HorizontalBarChart
                    valueChart={dataValueChartPembiayaan}
                    categoryChart={dataCategoryChartPembiayaan}
                    dataColors='["#57E7B4"]'
                  />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContentUhcV2;
