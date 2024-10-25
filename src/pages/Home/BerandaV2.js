import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardHeader,
} from "reactstrap";
import classnames from "classnames";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import PieChartNew from "../../Components/Chart/PieChart";
import CountUp from "react-countup";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const SingleOptions = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
];
const BerandaV2 = () => {
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const [activeTabPerencanaan, setActiveTabPerencanaan] = useState("1");
  const toggleTabPerencanaan = (tab) => {
    if (activeTabPerencanaan !== tab) {
      setActiveTabPerencanaan(tab);
    }
  };

  const [activeTabPenganggaran, setActiveTabPenganggaran] = useState("3");
  const toggleTabPenganggaran = (tab) => {
    if (activeTabPenganggaran !== tab) {
      setActiveTabPenganggaran(tab);
    }
  };

  const [dataBeranda, setDataBeranda] = useState([]);
  const [dataBeranda1, setDataBeranda1] = useState([]);
  const [dataBerandaRealisasi, setDataBerandaRealisasi] = useState([]);
  const [dataBerandaPenganggaran, setDataBerandaPenganggaran] = useState([]);
  const [dataBerandaPerencanaan, setDataBerandaPerencanaan] = useState([]);
  const [dataBerandaSpm, setDataBerandaSpm] = useState([]);
  const [loadingBeranda, setLoadingBeranda] = useState([]);
  const [errorBeranda, setErrorBeranda] = useState([]);

  const [dataChartSpmPendidikan, setDataChartSpmPendidikan] = useState([
    [],
    [],
  ]);
  const [dataChartSpmKesehatan, setDataChartSpmKesehatan] = useState([[], []]);
  const [dataChartSpmPekerjaanUmum, setDataChartSpmPekerjaanUmum] = useState([
    [],
    [],
  ]);
  const [dataChartSpmPerumahanRakyat, setDataChartSpmPerumahanRakyat] =
    useState([[], []]);
  const [dataChartSpmPelindungMasyarakat, setDataChartSpmPelindungMasyarakat] =
    useState([[], []]);
  const [dataChartSpmSosial, setDataChartSpmSosial] = useState([[], []]);

  const getDataBeranda = () => {
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
          `${API_URI}/dashboard_beranda`,
          requestOptions
        );

        const responseAnggaran = await fetch(
          `${API_URI}/dashboard_beranda_1`,
          requestOptions
        );
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataBeranda = await response.json();
        const dataBeranda1 = await responseAnggaran.json();
        
        setDataBeranda(dataBeranda.data);
        setDataBeranda1(dataBeranda1.data);        


      } catch (errorBeranda) {
        setErrorBeranda(errorBeranda);
      } finally {
        setLoadingBeranda(false);
      }
    };
    fetchData();
  };

  const getDataBerandaPerencanaan = ({idTahap="1"}) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_tahap: idTahap            
          }),
        };

        const responsePerencanaan = await fetch(
          `${API_URI}/dashboard_beranda_perencanaan`,
          requestOptions
        );
        
        if (!responsePerencanaan.ok) {
            throw new Error("Network response was not ok");
          }
          
        const dataBerandaPerencanaan = await responsePerencanaan.json();  

        setDataBerandaPerencanaan(dataBerandaPerencanaan.data.beranda_card_perencanaan[0])
        console.log(dataBerandaPerencanaan,'ini')
      } catch (errorBeranda) {
        setErrorBeranda(errorBeranda);
      } finally {
        setLoadingBeranda(false);
      }
    };
    fetchData();
  };

  const getDataBerandaPenganggaran = ({idTahap="30"}) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_tahap: idTahap    
          }),
        };

        const responsePenganggaran = await fetch(
          `${API_URI}/dashboard_beranda_penganggaran`,
          requestOptions
        );
        
        if (!responsePenganggaran.ok) {
            throw new Error("Network response was not ok");
          }
          
        const dataBerandaPenganggaran = await responsePenganggaran.json();  
        
        setDataBerandaPenganggaran(dataBerandaPenganggaran.data.beranda_card_penganggaran[0])
        
      } catch (errorBeranda) {
        setErrorBeranda(errorBeranda);
      } finally {
        setLoadingBeranda(false);
      }
    };
    fetchData();
  };

  const getDataBerandaRealisasi = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   id_tahap: idTahap            
          // }),
        };

        const responseRealisasi = await fetch(
          `${API_URI}/dashboard_beranda_realisasi`,
          requestOptions
        );
        
        if (!responseRealisasi.ok) {
            throw new Error("Network response was not ok");
          }
          
        const dataBerandaRealisasi = await responseRealisasi.json();  

        setDataBerandaRealisasi(dataBerandaRealisasi.data.realisasi)
        
      } catch (errorBeranda) {
        setErrorBeranda(errorBeranda);
      } finally {
        setLoadingBeranda(false);
      }
    };
    fetchData();
  };

  const getDataBerandaSpm = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   id_tahap: idTahap            
          // }),
        };

        const responseSpm = await fetch(
          `${API_URI}/dashboard_beranda_spm`,
          requestOptions
        );
        
        if (!responseSpm.ok) {
            throw new Error("Network response was not ok");
          }
          
        const dataBerandaSpm = await responseSpm.json(); 
        

        const nilaiSpmPendidikan = [
          dataBerandaSpm.data.spm.spm_anggaran_pendidikan,
          dataBerandaSpm.data.spm.spm_realisasi_pendidikan,
        ];
        const nilaiSpmKesehatan = [
          dataBerandaSpm.data.spm.spm_anggaran_kesehatan,
          dataBerandaSpm.data.spm.spm_realisasi_kesehatan,
        ];
        const nilaiSpmPekerjaanUmum = [
          dataBerandaSpm.data.spm.spm_anggaran_pu_dan_penataan_ruang,
          dataBerandaSpm.data.spm.spm_realisasi_pu_dan_penataan_ruang,
        ];
        const nilaiSpmPerumahanRakyat = [
          dataBerandaSpm.data.spm.spm_anggaran_perumahan_rakyat,
          dataBerandaSpm.data.spm.spm_realisasi_perumahan_rakyat,
        ];
        const nilaiSpmPelindungMasyarakat = [
          dataBerandaSpm.data.spm.spm_anggaran_perlindungan_masyarakat,
          dataBerandaSpm.data.spm.spm_realisasi_perlindungan_masyarakat,
        ];
        const nilaiSpmSosial = [
          dataBerandaSpm.data.spm.spm_anggaran_sosial,
          dataBerandaSpm.data.spm.spm_realisasi_sosial,
        ];

        console.log(nilaiSpmKesehatan, 'ini isi nilai spm')

        setDataChartSpmPendidikan(nilaiSpmPendidikan);
        setDataChartSpmKesehatan(nilaiSpmKesehatan);
        setDataChartSpmPekerjaanUmum(nilaiSpmPekerjaanUmum);
        setDataChartSpmPerumahanRakyat(nilaiSpmPerumahanRakyat);
        setDataChartSpmPelindungMasyarakat(nilaiSpmPelindungMasyarakat);
        setDataChartSpmSosial(nilaiSpmSosial);        
      } catch (errorBeranda) {
        setErrorBeranda(errorBeranda);
      } finally {
        setLoadingBeranda(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    // getDataBeranda();
    getDataBerandaPerencanaan("1");
    getDataBerandaPenganggaran("30");
    getDataBerandaRealisasi();
    getDataBerandaSpm();
    getPiePerencanaan();
  }, []);

  const [selectedSingle, setSelectedSingle] = useState(SingleOptions[0]); // Set default value
  const [dataPiePerencanaan, setDataPiePerencanaan] = useState([]);
  const [errorPiePerencanaan, setErrorPiePerencanaan] = useState(null);
  const [loadingPiePerencanaan, setLoadingPiePerencanaan] = useState(true);

  const getPiePerencanaan = async (filter) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter }),
      };

      const response = await fetch(
        `${API_URI}/dashboard_beranda_pie_perencanaan`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data.data);
      console.log(
        parseFloat(data.data["0"].persiapan),
        "ini isi data perencanaan"
      );

      const mappedData = [
        parseFloat(data.data["0"].persiapan),
        parseFloat(data.data["0"].rancangan_awal),
        parseFloat(data.data["0"].rancangan),
        parseFloat(data.data["0"].musrenbang),
        parseFloat(data.data["0"].rancangan_akhir),
        parseFloat(data.data["0"].penetapan),
      ];

      setDataPiePerencanaan(mappedData); // Sesuaikan berdasarkan struktur data yang dikembalikan API
    } catch (error) {
      setErrorPiePerencanaan(error);
    } finally {
      setLoadingPiePerencanaan(false);
    }
  };


  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Selected value:", selectedValue); // Debugging

    setSelectedSingle(selectedValue);
    getPiePerencanaan(selectedValue); // Panggil API dengan filter yang dipilih
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/detail-anggaran-bidang-pendidikan");
  };

  return (
    <React.Fragment>
      {/* <Card>
        <CardBody>
          <div className="nav-beranda">
            <Nav tabs className="nav nav-tabs nav-success nav-justified mb-3">
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: customActiveTabPerencanaan === "1",
                  })}
                  onClick={() => {
                    toggleCustom("1");
                  }}
                >
                  Perencanaan
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: customActiveTabPerencanaan === "2",
                  })}
                  onClick={() => {
                    toggleCustom("2");
                  }}
                >
                  Penganggaran
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: customActiveTabPerencanaan === "3",
                  })}
                  onClick={() => {
                    toggleCustom("3");
                  }}
                >
                  Realisasi
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </CardBody>
      </Card>
      <TabContent activeTabPerencanaan={customActiveTabPerencanaan}
                className="text-muted">
      <Row style={{ fontFamily: "bookmanoldstyle" }}>
        <TabPane tabId="1" id="chats">
          <Row>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Perencanaan
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pagu Belanja</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdPaguBelanja}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahUrusan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahProgram}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Jumlah Sub Kegiatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahSubGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Pagu Kemiskinan Ekstrem
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdMiskinEkstrem}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pagu Stunting</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdStunting}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pagu SPM</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>{dataBeranda.rkpdSpm}</div>
                  </div>
                </div>
              </CardBody>
            </Card>
            </Col>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Tahapan Perencanaan
                  </div>
                  <div className="d-flex">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ marginRight: "20px", fontSize: "18px" }}
                    >
                      Tahun :
                    </div>
                    <div>
                      <select
                        style={{
                          padding: "8px 12px",
                          fontSize: "16px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor: "#f8f8f8",
                          color: "#333",
                          cursor: "pointer",
                          outline: "none",
                        }}
                        value={selectedSingle}
                        onChange={handleSelectChange}
                      >
                        <option value="">Select an option</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </select>
                    </div>
                  </div>
                </div>
                <SimplePieTahapanRencana dataColors='["#FF5733", "#33FFF2", "#3357FF", "#FF33A1", "#A133FF", "#388E3C"]' />
              </CardBody>
            </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2" id="chats">
          <Row>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Penganggaran
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Total Rincian</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguBelanja}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahUrusan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahProgram}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Jumlah Sub Kegiatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahSubGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Rincian Kemiskinan Ekstrem
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguKemiskinanEkstrem}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Rincian Stunting</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguStunting}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Rincian SPM</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguSpm}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pendapatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguPendapatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Pembiayaan Penerimaan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPembiayaanPenerimaan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Pembiayaan Pengeluaran
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPembiayaanPengeluaran}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            </Col>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Tahapan Penganggaran
                  </div>
                </div>
                <SimplePieTahapanAnggaran dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                <div>
                sumber data : SIPD                
              </div>
              <div>
                di-update pada : {}
              </div>
              </CardBody>
            </Card>
            </Col>
          </Row>
          
        </TabPane>
        <TabPane tabId="3" id="chats">
          <Row>
            <Col md={6}>            
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Realisasi
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Daerah</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahRealisasi}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Realisasi Belanja</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahRealisasi}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahBidang}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.program}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahKegiatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Jumlah Sub Kegiatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahSubKegiatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Realisasi Kemiskinan Ekstrem
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiKemiskinanEkstrem}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Realisasi Stunting</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiStunting}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Realisasi SPM</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiSpm}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Realisasi Pendapatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiPendapatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Realisasi Pembiayaan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>         
                    </div>
                  </div>                  
                </div>                
              </CardBody>
            </Card>
            </Col>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Tahapan Realisasi
                  </div>
                </div>
                <SimplePieTahapanRealisasi dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                <div>
                sumber data : SIPD                
              </div>
              <div>
                di-update pada : {}
              </div>
              </CardBody>
            </Card>
            </Col>
          </Row>
        </TabPane>
      </Row>
      </TabContent>  */}
      <Row style={{ fontFamily: "poppins" }}>
        <Col md={4}>
          <Card className="card-animate card-height-100">
            <CardHeader className="border-bottom-0">
              <Nav
                className="nav-tabs-custom card-header-tabs border-bottom-0"
                role="tablist"
              >
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: activeTabPerencanaan === "1" },
                      "fw-semibold"
                    )}
                    onClick={() => {
                      toggleTabPerencanaan("1", "all");
                      getDataBerandaPerencanaan({idTahap : "1"});
                    }}
                    href="#"
                  >
                    Murni{" "}
                    {/* <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              12
                            </span> */}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: activeTabPerencanaan === "2" },
                      "fw-semibold"
                    )}
                    onClick={() => {
                      toggleTabPerencanaan("2", "published");
                      getDataBerandaPerencanaan({idTahap : "3"});
                    }}
                    href="#"
                  >
                    Perubahan{" "}
                    {/* <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              5
                            </span> */}
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>

            <CardBody>
              <div className="d-flex flex-column align-items-center">
                <div
                  className="card-title mb-3"
                  style={{
                    fontColor: "#333333",
                    fontSize: "30px",
                    fontWeight: 650,
                  }}
                >
                  Perencanaan
                </div>
              </div>
              <div style={{ fontSize: "20px" }}>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Daerah</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                        start={0}
                        end={dataBerandaPerencanaan?.jumlah_daerah}
                        // decimal=","
                        // decimals={2}
                        // separator="."
                        // prefix="Rp "
                        // suffix=" T"
                        duration={3}
                      />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Pagu Belanja</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPerencanaan?.rkpd_pagu / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                {/* <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                    <CountUp
                        start={0}
                        end={dataBerandaPerencanaan?.rkpd_jumlah_urusan}
                        // decimal=","
                        // decimals={2}
                        separator="."
                        prefix=""
                        // suffix=" T"
                        duration={3}
                      />
                     
                    </div>
                  </div> */}
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPerencanaan?.rkpd_jumlah_program
                      }
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix=""
                      // suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPerencanaan?.rkpd_jumlah_giat
                      }
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix=""
                      // suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Sub Kegiatan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPerencanaan?.rkpd_jumlah_sub_giat
                      }
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix=""
                      // suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>
                    Pagu Kemiskinan Ekstrem
                  </div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPerencanaan?.pagu_validasi_miskin_rkpd / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Pagu Stunting</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPerencanaan?.pagu_validasi_stunting_rkpd / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Pagu SPM</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPerencanaan?.rkpd_pagu_spm / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate card-height-100">
            <CardHeader className="border-bottom-0">
              <Nav
                className="nav-tabs-custom card-header-tabs border-bottom-0"
                role="tablist"
              >
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: activeTabPenganggaran === "1" },
                      "fw-semibold"
                    )}
                    onClick={() => {
                      toggleTabPenganggaran("1");
                      getDataBerandaPenganggaran({idTahap : "28"});
                    }}
                    href="#"
                  >
                    Murni{" "}
                    {/* <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              12
                            </span> */}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: activeTabPenganggaran === "2" },
                      "fw-semibold"
                    )}
                    onClick={() => {
                      toggleTabPenganggaran("2");
                      getDataBerandaPenganggaran({idTahap : "29"});
                    }}
                    href="#"
                  >
                    Perubahan{" "}
                    {/* <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              5
                            </span> */}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: activeTabPenganggaran === "3" },
                      "fw-semibold"
                    )}
                    onClick={() => {
                      toggleTabPenganggaran("3");
                      getDataBerandaPenganggaran({idTahap : "30"});
                    }}
                    href="#"
                  >
                    Pergeseran{" "}
                    {/* <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              5
                            </span> */}
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>
            <CardBody>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-3"
                  style={{
                    fontColor: "#333333",
                    fontSize: "30px",
                    fontWeight: 650,
                  }}
                >
                  Penganggaran
                </div>
              </div>
              <div style={{ fontSize: "20px" }}>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Daerah</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                        start={0}
                        end={dataBerandaPenganggaran?.jumlah_daerah}                      
                        duration={1}
                      />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Rincian Belanja</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran?.apbd_belanja / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
                {/* <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                    <CountUp
                        start={0}
                        end={dataBerandaPenganggaran?.apbd_jumlah_urusan}
                        // decimal=","
                        // decimals={2}
                        separator="."
                        prefix=""
                        // suffix=" T"
                        duration={3}
                      />
                   
                    </div>
                  </div> */}
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran?.apdb_jumlah_program
                      }
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix=""
                      // suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran?.apdb_jumlah_giat
                      }
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix=""
                      // suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Sub Kegiatan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran?.apdb_jumlah_sub_giat
                      }
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix=""
                      // suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>
                    Rincian Kemiskinan Ekstrem
                  </div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran?.apbd_pagu_miskin / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Rincian Stunting</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran?.apdb_pagu_stunting / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Rincian SPM</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran?.apdb_pagu_spm / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Pendapatan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran
                          ?.apbd_pendapatan / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>
                    Pembiayaan Penerimaan
                  </div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran
                          ?.apbd_pembiayaan_penerimaan / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>
                    Pembiayaan Pengeluaran
                  </div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaPenganggaran
                          ?.apbd_pembiayaan_pengeluaran / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={1}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="card-animate card-height-100 card-height-100">
            <CardHeader
              className="border-bottom-0"
              style={{ minHeight: "52px" }}
            ></CardHeader>
            <CardBody>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-3"
                  style={{
                    fontSize: "30px",
                    fontWeight: 650,
                  }}
                >
                  Realisasi
                </div>
              </div>
              <div style={{ fontSize: "20px" }}>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Daerah</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                  <CountUp
                        start={0}
                        end={dataBerandaRealisasi?.jumlah_daerah}                      
                        duration={3}
                      />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Realisasi Belanja</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaRealisasi?.total_belanja / 1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                {/* <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                    <CountUp
                        start={0}
                        end={dataBerandaRealisasi?.total_bid_urusan}
                        // decimal=","
                        // decimals={2}
                        separator="."
                        prefix=""
                        // suffix=" T"
                        duration={3}
                      />
                    
                    </div>
                  </div> */}
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={dataBerandaRealisasi?.total_program}
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix=""
                      // suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={dataBerandaRealisasi?.total_kegiatan}
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix=""
                      // suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Jumlah Sub Kegiatan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={dataBerandaRealisasi?.total_sub_kegiatan}
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix=""
                      // suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>
                    Realisasi Kemiskinan Ekstrem
                  </div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaRealisasi?.total_realisasi_miskin_nas /
                        1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Realisasi Stunting</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaRealisasi?.total_realisasi_stunting_nas /
                        1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Realisasi SPM</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaRealisasi?.total_realisasi_spm_nas /
                        1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Realisasi Pendapatan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                    <CountUp
                      start={0}
                      end={
                        dataBerandaRealisasi?.total_realisasi_pendapatan_nas /
                        1000000000000
                      }
                      decimal=","
                      decimals={2}
                      separator="."
                      prefix="Rp "
                      suffix=" T"
                      duration={3}
                    />
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Realisasi Pembiayaan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}></div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="card-animate card-height-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div
                className="card-title mb-2"
                style={{
                  fontColor: "#333333",
                  fontSize: "20px",
                  fontWeight: 650,
                  padding: "4px",
                }}
              >
                SPM Pendidikan
              </div>
            </div>

            <CardBody>
              <PieChartNew
                dataChart={dataChartSpmPendidikan}
                dataColors={'["#2DAED4", "#FCAD24"]'}
                categoryName={["Sisa Anggaran", "Realisasi"]}
                pieChart={false}
                showLegend={true}
                percentOnly={true}
                // legendHorizontal={true}
                heightChart="350px"
              />
              {/* <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                Lihat Detail
              </Button> */}
              {/* <button className="btn" onClick={handleClick}>
                Lihat Detail
              </button> */}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate card-height-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div
                className="card-title mb-2"
                style={{
                  fontColor: "#333333",
                  fontSize: "20px",
                  fontWeight: 650,
                  padding: "4px",
                }}
              >
                SPM Kesehatan
              </div>
            </div>

            <CardBody>
              <PieChartNew
                dataChart={dataChartSpmKesehatan}
                dataColors={'["#2DAED4", "#FCAD24"]'}
                categoryName={["Sisa Anggaran", "Realisasi"]}
                pieChart={false}
                showLegend={true}
                percentOnly={true}
                // legendHorizontal={true}
                heightChart="350px"
              />
              {/* <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                Lihat Detail
              </Button> */}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate card-height-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div
                className="card-title mb-2"
                style={{
                  fontColor: "#333333",
                  fontSize: "20px",
                  fontWeight: 650,
                  padding: "4px",
                }}
              >
                SPM Pekerjaan Umum dan Penataan Ruang
              </div>
            </div>

            <CardBody>
              <PieChartNew
                dataChart={dataChartSpmPekerjaanUmum}
                dataColors={'["#2DAED4", "#FCAD24"]'}
                categoryName={["Sisa Anggaran", "Realisasi"]}
                pieChart={false}
                showLegend={true}
                percentOnly={true}
                // legendHorizontal={true}
                heightChart="350px"
              />
              {/* <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                Lihat Detail
              </Button> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="card-animate card-height-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div
                className="card-title mb-2"
                style={{
                  fontColor: "#333333",
                  fontSize: "20px",
                  fontWeight: 650,
                  padding: "4px",
                }}
              >
                SPM Perumahan Rakyat dan Kawasan Permukiman
              </div>
            </div>

            <CardBody>
              <PieChartNew
                dataChart={dataChartSpmPerumahanRakyat}
                dataColors={'["#2DAED4", "#FCAD24"]'}
                categoryName={["Sisa Anggaran", "Realisasi"]}
                pieChart={false}
                showLegend={true}
                percentOnly={true}
                // legendHorizontal={true}
                heightChart="350px"
              />
              {/* <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                Lihat Detail
              </Button> */}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate card-height-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div
                className="card-title mb-2"
                style={{
                  fontColor: "#333333",
                  fontSize: "20px",
                  fontWeight: 650,
                  padding: "4px",
                }}
              >
                SPM Pelindungan Masyarakat
              </div>
            </div>

            <CardBody>
              <PieChartNew
                dataChart={dataChartSpmPelindungMasyarakat}
                dataColors={'["#2DAED4", "#FCAD24"]'}
                categoryName={["Sisa Anggaran", "Realisasi"]}
                pieChart={false}
                showLegend={true}
                percentOnly={true}
                // legendHorizontal={true}
                heightChart="350px"
              />
              {/* <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                Lihat Detail
              </Button> */}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate card-height-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div
                className="card-title mb-2"
                style={{
                  fontColor: "#333333",
                  fontSize: "20px",
                  fontWeight: 650,
                  padding: "4px",
                }}
              >
                SPM Sosial
              </div>
            </div>

            <CardBody>
              <PieChartNew
                dataChart={dataChartSpmSosial}
                dataColors={'["#2DAED4", "#FCAD24"]'}
                categoryName={["Sisa Anggaran", "Realisasi"]}
                pieChart={false}
                showLegend={true}
                percentOnly={true}
                // legendHorizontal={true}
                heightChart="350px"
              />
              {/* <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                Lihat Detail
              </Button> */}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* </TabContent> */}
    </React.Fragment>
  );
};

export default BerandaV2;
