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
  CardFooter,
} from "reactstrap";
import classnames from "classnames";
import PieChartNew from "../../Components/Chart/PieChart";
import CountUp from "react-countup";
import logoKemendagri from "../../assets/images/logo-kemendagri/Animasi.gif"
import imageBeranda from "../../assets/images/logo-kemendagri/image-beranda.png"
import video from "../../assets/images/logo-kemendagri/bumper-2D.mp4"

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

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
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/v2/dashboard_beranda`,
          requestOptions
        );

        const responseAnggaran = await fetch(
          `${API_URI_RBAC}/v2/dashboard_beranda_1`,
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
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            id_tahap: idTahap            
          }),
        };

        const responsePerencanaan = await fetch(
          `${API_URI_RBAC}/v2/dashboard_beranda_perencanaan`,
          requestOptions
        );
        
        if (!responsePerencanaan.ok) {
            throw new Error("Network response was not ok");
          }
          
        const dataBerandaPerencanaan = await responsePerencanaan.json();  

        setDataBerandaPerencanaan(dataBerandaPerencanaan.data[0])
        console.log(dataBerandaPerencanaan,'ini')
      } catch (errorBeranda) {
        setErrorBeranda(errorBeranda);
      } finally {
        setLoadingBeranda(false);
      }
    };
    fetchData();
  };

  const [executeDate, setExcecuteDate] = useState('')
  const getDataBerandaPenganggaran = ({idTahap=""}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            id_tahap: idTahap    
          }),
        };

        const responsePenganggaran = await fetch(
          `${API_URI_RBAC}/v2/dashboard_beranda_penganggaran`,
          requestOptions
        );
        
        if (!responsePenganggaran.ok) {
            throw new Error("Network response was not ok");
          }
          
        const dataBerandaPenganggaran = await responsePenganggaran.json();  
        
        const date = new Date(dataBerandaPenganggaran.data[0].execute_time);        
        // Format date as DD-MM-YYYY                
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        
        const formattedDate = `${year}-${month}-${day}`; // Example output: "31-12-2022"
        
        setExcecuteDate(formattedDate)
        setDataBerandaPenganggaran(dataBerandaPenganggaran.data[0])
        
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
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          // body: JSON.stringify({
          //   id_tahap: idTahap            
          // }),
        };

        const responseRealisasi = await fetch(
          `${API_URI_RBAC}/v2/dashboard_beranda_realisasi`,
          requestOptions
        );
        
        if (!responseRealisasi.ok) {
            throw new Error("Network response was not ok");
          }
          
        const dataBerandaRealisasi = await responseRealisasi.json();  

        setDataBerandaRealisasi(dataBerandaRealisasi.data)
        
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
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          // body: JSON.stringify({
          //   id_tahap: idTahap            
          // }),
        };

        const responseSpm = await fetch(
          `${API_URI_RBAC}/v2/dashboard_beranda_spm`,
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
    getDataBerandaPenganggaran({idTahap:"99"});
    getDataBerandaRealisasi();
    // getDataBerandaSpm();
    // getPiePerencanaan();
  }, []);

  const [selectedSingle, setSelectedSingle] = useState(SingleOptions[0]); // Set default value
  const [dataPiePerencanaan, setDataPiePerencanaan] = useState([]);
  const [errorPiePerencanaan, setErrorPiePerencanaan] = useState(null);
  const [loadingPiePerencanaan, setLoadingPiePerencanaan] = useState(true);

  const getPiePerencanaan = async (filter) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("authUser"))
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", "x-sipdhub": `${token.token}`
        },
        body: JSON.stringify({ filter }),
      };

      const response = await fetch(
        `${API_URI_RBAC}/v2/dashboard_beranda_pie_perencanaan`,
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

  const [selectedTahapPenganggaran, setSelectedTahapPenganggaran] = useState("99"); // State untuk menyimpan pilihan dropdown
  const [selectedTahapPerencanaan, setSelectedTahapPerencanaan] = useState("1"); // State untuk menyimpan pilihan dropdown
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const selectedValue = value;
    if (name == "perencanaan") {
      getDataBerandaPerencanaan({idTahap : value});
      setSelectedTahapPerencanaan(selectedValue); // Update state dengan pilihan yang dipilih
    }else if (name == "penganggaran"){
      getDataBerandaPenganggaran({idTahap : value});
      setSelectedTahapPenganggaran(selectedValue); // Update state dengan pilihan yang dipilih
    }
  };  

  const [showBerandaSipd, setShowBerandaSipd] = useState(false)  

  return (
    <React.Fragment>
      {showBerandaSipd ? (<><Row style={{ fontFamily: "poppins" }}>
        <Col md={4}>
          <Card data-aos="fade-up-right" className="card-animate card-height-100">
            <CardHeader className="border-bottom-0">            
              <div className="d-flex">
              <div className="d-flex justify-content-center align-items-center" style={{ fontSize: "14px", fontWeight:600, fontFamily: "poppins" }}>
                Pilih Tahap:
              </div>
              <select
                    name="perencanaan"
                      style={{
                        padding: "2px 7px 2px 7px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        marginLeft: "10px"
                      }}
                      value={selectedTahapPerencanaan}
                      onChange={handleSelectChange}
                    >
                    <option value="1">Murni</option>
                    <option value="3">Perubahan</option>                    
                    </select>
                </div>
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
                        duration={1}
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
                        end={dataBerandaPerencanaan?.rkpd_jumlah_urusan}
                        // decimal=","
                        // decimals={2}
                        separator="."
                        prefix=""
                        // suffix=" T"
                        duration={1}
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
                        dataBerandaPerencanaan?.rkpd_jumlah_giat
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
                        dataBerandaPerencanaan?.rkpd_jumlah_sub_giat
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
                      duration={1}
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
                      duration={1}
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
                      duration={1}
                    />
                  </div>
                </div>
              </div>              
                
            </CardBody>
            <CardFooter>
                <div className="d-flex justify-content-end align-items-end" style={{color:"#929FB1"}}>
                  *update date: {dataBerandaPerencanaan?.execute_time ? dataBerandaPerencanaan?.execute_time : "-"}
                </div>                                                               
            </CardFooter>
          </Card>
        </Col>
        <Col md={4}>
          <Card data-aos="fade-down" className="card-animate card-height-100">
            <CardHeader className="border-bottom-0" >
            <div className="d-flex">
              <div className="d-flex justify-content-center align-items-center" style={{ fontSize: "14px", fontWeight:600, fontFamily: "poppins" }}>
                Pilih Tahap:
              </div>
              <select
                    name="penganggaran"
                      style={{
                        padding: "2px 7px 2px 7px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        marginLeft: "10px"
                      }}
                      value={selectedTahapPenganggaran}
                      onChange={handleSelectChange}
                    >
                    <option value="28">Murni</option>
                    <option value="30">Pergeseran</option>
                    <option value="29">Perubahan</option>
                    <option value="32">Pergeseran Setelah</option>
                    <option value="99">APBD Akhir</option>
                    </select>
                </div>
              {/* <Nav
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
                    style={{ cursor: "pointer" }}
                  >
                    Murni{" "}                    
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
                    style={{ cursor: "pointer" }}
                  >
                    Perubahan{" "}
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
                    style={{ cursor: "pointer" }}
                  >
                    Pergeseran{" "}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: activeTabPenganggaran === "4" },
                      "fw-semibold"
                    )}
                    onClick={() => {
                      toggleTabPenganggaran("4");
                      getDataBerandaPenganggaran({idTahap : "32"});
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    pergeseran setelah
                  </NavLink>
                </NavItem>
              </Nav> */}
              
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
                        duration={1}
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
            <CardFooter>
              <div className="d-flex justify-content-end align-items-end" style={{color:"#929FB1"}}>
                *update date: {executeDate}
              </div>              
            </CardFooter>              
          </Card>
        </Col>

        <Col md={4}>
          <Card data-aos="fade-up-left" className="card-animate card-height-100 card-height-100">
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
                        duration={1}
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
                      duration={1}
                    />
                      {/* {` (${((dataBerandaRealisasi?.total_belanja/dataBerandaPenganggaran?.apbd_belanja) * 100).toFixed(2)}%)`} */}
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
                        duration={1}
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
                      end={dataBerandaRealisasi?.total_kegiatan}
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
                      end={dataBerandaRealisasi?.total_sub_kegiatan}
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
                      duration={1}
                    />
                    {/* {` (${((dataBerandaRealisasi?.total_realisasi_miskin_nas/dataBerandaPenganggaran?.apbd_pagu_miskin) * 100).toFixed(2)}%)`} */}
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
                      duration={1}
                    />
                    {/* {` (${((dataBerandaRealisasi?.total_realisasi_stunting_nas/dataBerandaPenganggaran?.apdb_pagu_stunting) * 100).toFixed(2)}%)`} */}
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
                      duration={1}
                    />
                    {/* {` (${((dataBerandaRealisasi?.total_realisasi_spm_nas/dataBerandaPenganggaran?.apdb_pagu_spm) * 100).toFixed(2)}%)`} */}
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
                      duration={1}
                    />
                    {/* {` (${((dataBerandaRealisasi?.total_realisasi_pendapatan_nas/dataBerandaPenganggaran?.apdb_pagu_spm) * 100).toFixed(2)}%)`} */}
                  </div>
                </div>
                {/* <div className="d-flex mb-3">
                  <div style={{ flexBasis: "220px" }}>Realisasi Pembiayaan</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}></div>
                </div> */}
              </div>
            </CardBody>
            <CardFooter>
              <div className="d-flex justify-content-end align-items-end" style={{color:"#929FB1"}}>
                *update time : -
              </div>              
            </CardFooter>              
          </Card>
        </Col>
      </Row> </>) : (<> 
        <Row>
          <Col md={6}>
          <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
            padding:"20px",
            // background:`radial-gradient(rgb(174, 198, 207) 20%, rgb(243, 246, 249) 70%)`,            
            backgroundRepeat: "no-repeat",            
            textAlign: "start",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div>
          <h1 data-aos="fade-right"
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              animation: "fadeIn 1s ease-in-out",
            }}
          >
            Selamat Datang di <span style={{ fontWeight: "bold" }}>Dashboard SIPD-HUB</span>
          </h1>
          <p data-aos="fade-left"
            style={{
              fontSize: "1.2rem",
              marginBottom: "2rem",              
              animation: "fadeIn 2s ease-in-out",
              color: "black", // Warna teks
              backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparan untuk mendukung blur
              backdropFilter: "blur(1px)", // Efek blur
              borderRadius: "10px", // Sudut melengkung untuk tampilan lebih menarik
              padding: "15px", // Spasi di dalam elemen
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Bayangan untuk menonjolkan elemene
            }}
          >
            Platform visualisasi data dari berbagai Kementerian/Lembaga untuk mendukung pengambilan kebijakan dalam penyusunan perencanaan pembangunan dan penganggaran keuangan daerah sehingga lebih tepat sasaran.
          </p>
          <button data-aos="fade-left" data-aos-delay="3000"
            onClick={() => setShowBerandaSipd(true)}
            style={{
              backgroundColor: "#ffffff",
              color: "#007bff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
            }}
          >
            Lihat Dashboard
            <span
              style={{
                display: "inline-block",
                marginLeft: "8px",
                transition: "transform 0.3s ease",
              }}
            >
              →
            </span>
          </button>
          </div>
        </div>
          </Col>
          <Col md={6}>
            <div data-aos="fade-left" className="d-flex justify-content-center align-items-center" >
              <img  src={imageBeranda} alt=""  style={{borderRadius: "15px", width: "90%"}}/>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
          <div className="d-flex justify-content-center align-items-center">
          <video controls style={{ width: '100%',
            height: '620px',
            objectFit: 'cover',
            padding:"20px"}} >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          </div>
          </Col>
        </Row>
        

        
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
            background:`radial-gradient(rgb(174, 198, 207) 20%, rgb(243, 246, 249) 70%)`,            
            backgroundRepeat: "no-repeat",            
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
            marginLeft:"20px",
            background:`url(${logoKemendagri})`,
            backgroundSize: "850px 550px",
            backgroundPosition: "250px 0px",
            backgroundRepeat: "no-repeat",
            color: "black",
            fontWeight:500,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <h1 data-aos="fade-right"
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              animation: "fadeIn 1s ease-in-out",
            }}
          >
            Selamat Datang di <span style={{ fontWeight: "bold" }}>Dashboard SIPD-HUB</span>
          </h1>
          <p data-aos="fade-left"
            style={{
              fontSize: "1.2rem",
              marginBottom: "2rem",
              width: "900px",
              animation: "fadeIn 2s ease-in-out",
              color: "black", // Warna teks
              backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparan untuk mendukung blur
              backdropFilter: "blur(1px)", // Efek blur
              borderRadius: "10px", // Sudut melengkung untuk tampilan lebih menarik
              padding: "5px", // Spasi di dalam elemen
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Bayangan untuk menonjolkan elemene
            }}
          >
            Platform visualisasi data dari berbagai Kementerian/Lembaga untuk mendukung pengambilan kebijakan dalam penyusunan perencanaan pembangunan dan penganggaran keuangan daerah sehingga lebih tepat sasaran.
          </p>
          <button data-aos="fade-left" data-aos-delay="3000"
            onClick={() => setShowBerandaSipd(true)}
            style={{
              backgroundColor: "#ffffff",
              color: "#007bff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
            }}
          >
            Lihat Dashboard
            <span
              style={{
                display: "inline-block",
                marginLeft: "8px",
                transition: "transform 0.3s ease",
              }}
            >
              →
            </span>
          </button>
        </div>                  
        </div> */}
        </>)}               
    </React.Fragment>
  );
};

export default BerandaV2;
