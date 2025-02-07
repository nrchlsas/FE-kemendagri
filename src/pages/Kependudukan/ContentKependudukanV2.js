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
import "./kependudukan.scss";
import "leaflet/dist/leaflet.css";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import classnames from "classnames";
import CountUp from "react-countup";
import HorizontalBarChart from "../../Components/Chart/HorizontalBarChart";
import VerticalBarChart from "../../Components/Chart/VerticalBarChart";
import PyramidChart from "../../Components/Chart/PyramidChart";
import MapIndoChart from "../../Components/MapIndo/MapIndoChart";
import Pagination from "../../Components/Pagination/Pagination";
import "./../Dapodik/dapodik.scss"

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

const ContentKependudukanV2 = () => {
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [customActiveTabAll, setcustomActiveTabAll] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const toggleCustomAll = (tab) => {
    if (customActiveTabAll !== tab) {
      setcustomActiveTabAll(tab);
    }
  };

  const [customActiveTabKelompokUmur, setcustomActiveTabKelompokUmur] =
    useState("1");
  const toggleCustomKelompokUmur = (tab) => {
    if (customActiveTabKelompokUmur !== tab) {
      setcustomActiveTabKelompokUmur(tab);
    }
  };

  const [dataKependudukan, setDataKependudukan] = useState([]);
  const [loadingKependudukan, setLoadingKependudukan] = useState([]);
  const [errorKependudukan, setErrorKependudukan] = useState([]);
  const [dataChartTop10Provinsi, setDataChartTop10Provinsi] = useState([
    [],
    [],
  ]);
  const [dataChartTop10Kabupaten, setDataChartTop10Kabupaten] = useState([
    [],
    [],
  ]);
  const [dataChartTop10Kecamatan, setDataChartTop10Kecamatan] = useState([
    [],
    [],
  ]);
  const [dataChartTop10Kelurahan, setDataChartTop10Kelurahan] = useState([
    [],
    [],
  ]);
  const [dataChartUsiaProduktif, setDataChartUsiaProduktif] = useState([
    [],
    [],
  ]);
  const [dataChartAgama, setDataChartAgama] = useState([[], []]);
  const [dataChartPendidikan, setDataChartPendidikan] = useState([[], []]);
  const [dataChartLakiLaki, setDataChartLakiLaki] = useState([[], []]);
  const [dataChartPerempuan, setDataChartPerempuan] = useState([[], []]);

  const getDataKependudukan = ({tahun}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            tahun: tahun,
        }),
        };
        const response = await fetch(`${API_URI_RBAC}/v2/dashboard_dukcapil`, requestOptions);
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const dataKependudukan = await response.json();
        setDataKependudukan(dataKependudukan.data);
  
        try {
          //chart top 10 Provinsi
          const resultChartTop10Prov = dataKependudukan.data.top10_by_provinsi.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.provinsi);
              return acc;
            },
            [[], []]
          );
          setDataChartTop10Provinsi(resultChartTop10Prov);
        } catch (error) {
          console.error("Error processing top 10 Provinsi data:", error);
        }
  
        try {
          //chart top 10 Kabupaten
          const resultChartTop10Kab = dataKependudukan.data.top10_by_kabupaten.reduce(
            (acc, item) => {
              acc[0].push(item.jumlah);
              acc[1].push(item.nama_kabkota);
              acc[2].push(item.nama_provinsi)
              return acc;
            },
            [[], [], []]
          );
          setDataChartTop10Kabupaten(resultChartTop10Kab);
        } catch (error) {
          console.error("Error processing top 10 Kabupaten data:", error);
        }
  
        try {
          //chart top 10 Kecamatan
          const resultChartTop10Kec = dataKependudukan.data.top10_by_kecamatan.reduce(
            (acc, item) => {
              acc[0].push(item.jumlah);
              acc[1].push(item.nama_kecamatan);
              acc[2].push(item.nama_provinsi)
              acc[3].push(item.nama_kabkota)
              return acc;
            },
            [[], [], [], []]
          );
          setDataChartTop10Kecamatan(resultChartTop10Kec);
        } catch (error) {
          console.error("Error processing top 10 Kecamatan data:", error);
        }
  
        try {
          //chart top 10 Kelurahan
          const resultChartTop10Kel = dataKependudukan.data.top10_by_kelurahan.reduce(
            (acc, item) => {
              acc[0].push(item.jumlah);
              acc[1].push(item.nama_desa_kelurahan);
              acc[2].push(item.nama_provinsi)
              acc[3].push(item.nama_kabkota)
              acc[4].push(item.nama_kecamatan);
              return acc;
            },
            [[], [],[], [],[]]
          );                  
          setDataChartTop10Kelurahan(resultChartTop10Kel);
        } catch (error) {
          console.error("Error processing top 10 Kelurahan data:", error);
        }
  
        try {
          //chart usia produktif
          const chartUsiaProduktif = Object.values(dataKependudukan.data.pekerjaan);
          setDataChartUsiaProduktif(chartUsiaProduktif);
        } catch (error) {
          console.error("Error processing usia produktif data:", error);
        }
  
        try {
          //chart agama
          // const resultChartAgama = Object.values(
          //   dataKependudukan.data.agama
          // ).filter((value) => typeof value === "number");

          const keys = [];
          const values = [];

          for (let key in dataKependudukan.data.agama) {
            if (key !== "description" && key !== "sumber") {
              keys.push(key);
              values.push(dataKependudukan.data.agama[key]);
            }
          }
          
          // Gabungkan keys dan values menjadi satu array objek untuk diurutkan
          const combined = keys.map((key, index) => {
            return { key: key, value: values[index] };
          });

          // Urutkan berdasarkan value dari terbesar ke terkecil
          combined.sort((a, b) => b.value - a.value);

          // Pisahkan kembali keys dan values setelah diurutkan
          const sortedKeys = combined.map(item => item.key);
          const sortedValues = combined.map(item => item.value);

          // Hasil akhir dalam array yang diurutkan
          const resultChartAgama = [sortedKeys, sortedValues];

          setDataChartAgama(resultChartAgama);
        } catch (error) {
          console.error("Error processing agama data:", error);
        }
  
        try {
          //chart pendidikan
          const resultChartPendidikan = dataKependudukan.data.pendidikan.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.key);
              return acc;
            },
            [[], []]
          );
          setDataChartPendidikan(resultChartPendidikan);
        } catch (error) {
          console.error("Error processing pendidikan data:", error);
        }
  
        try {
          //chart usia laki-laki
          const resultChartLakiLaki = dataKependudukan.data.kelompok_umur.data.reduce(
            (acc, item) => {
              acc[0].push(item.totl);
              acc[1].push(item.kelompok_umur);
              return acc;
            },
            [[], []]
          );
          setDataChartLakiLaki(resultChartLakiLaki);
        } catch (error) {
          console.error("Error processing usia laki-laki data:", error);
        }
  
        try {
          //chart usia perempuan
          const resultChartPerempuan = dataKependudukan.data.kelompok_umur.data.reduce(
            (acc, item) => {
              acc[0].push(item.totp);
              acc[1].push(item.kelompok_umur);
              return acc;
            },
            [[], []]
          );
          setDataChartPerempuan(resultChartPerempuan);
        } catch (error) {
          console.error("Error processing usia perempuan data:", error);
        }
      } catch (errorKependudukan) {
        setErrorKependudukan(errorKependudukan);
      } finally {
        setLoadingKependudukan(false);
      }
    };
    fetchData();
  };

  const [selectedSingleTahunAnggaran, setSelectedSingleTahunAnggaran] = useState('2025'); // Set default value
  const [selectedSingleTahunData, setselectedSingleTahunData] = useState('2024'); // Set default value
  const [selectedSingleTahunSemester, setSelectedSingleTahunSemester] = useState('2025'); // Set default value
  
  const handleSelectChangeAnggaran = (e) => {
    const { name, value } = e.target;
    setSelectedSingleTahunAnggaran(value); 
   
  };

  const handleSelectChangeDataPokok = (e) => {
    const { name, value } = e.target;
    setselectedSingleTahunData(value); 
    getDataKependudukan({tahun: value});
  };

  const handleSelectChangeSemester = (e) => {
    const { name, value } = e.target;
    setSelectedSingleTahunSemester(value); 
  };

  const [handleCardClick, setHandleCardClick] = useState(() => () => {});
  const [dataKependudukanTabel, setDataKependudukanTabel] = useState([]);
  const [loadingKependudukanTabel, setLoadingKependudukanTabel] = useState([]);
  const [errorKependudukanTabel, setErrorKependudukanTabel] = useState([]);
  const [titleMap, setTitleMap] = useState("Total Penduduk")
  const [valueMap, setValueMap] = useState([]);
  const [maxValueMap, setmaxValueMap] = useState(0)
  const getDataTabelKependudukanProv = () => {
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
        // /table_Kependudukan_provinsi
        // /table_Kependudukan_kabupaten
        // /table_stunting_provinsi
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_dukcapil`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataKependudukanTabel = await response.json();
        setDataKependudukanTabel(dataKependudukanTabel.data)
        setShowNextData(false)

        const valueTotalPenduduk = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.jumlahpenduduk
        }));

        const valueTotalKK = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.jmlkk
        }));

        const valueTotalLakiLaki = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.jumlahlakilaki
        }));

        const valueTotalPerempuan = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.jumlahperempuan
        }));

        const valueTotalKepadatan = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.kepadatan
        }));

        const valueTotalLuasWilayah = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.luas_wilayah
        }));

        const maxPenduduk = Math.max(...valueTotalPenduduk.map(item => item.value));
        const maxKK = Math.max(...valueTotalKK.map(item => item.value));
        const maxLakiLaki = Math.max(...valueTotalLakiLaki.map(item => item.value));
        const maxPerempuan = Math.max(...valueTotalPerempuan.map(item => item.value));
        const maxKepadatan = Math.max(...valueTotalKepadatan.map(item => item.value));
        const maxLuasWilayah = Math.max(...valueTotalLuasWilayah.map(item => item.value));

        setValueMap(valueTotalPenduduk);
        setmaxValueMap(maxPenduduk)

        const handleCardClick = (valueType) => {
          switch(valueType) {
            case 'totalPenduduk':
              setValueMap(valueTotalPenduduk);
              setmaxValueMap(maxPenduduk)
              break;
            case 'totalKK':
              setValueMap(valueTotalKK);
              setmaxValueMap(maxKK)
              break;
            case 'totalLakiLaki':
              setValueMap(valueTotalLakiLaki);
              setmaxValueMap(maxLakiLaki)
              break;
            case 'totalPerempuan':
              setValueMap(valueTotalPerempuan);
              setmaxValueMap(maxPerempuan)
              break;
            case 'totalKepadatan':
              setValueMap(valueTotalKepadatan);
              setmaxValueMap(maxKepadatan)
              break;
            case 'totalLuasWilayah':
              setValueMap(valueTotalLuasWilayah);
              setmaxValueMap(maxLuasWilayah)
              break;
            default:
              
              break;
          }
        };
        
        // Simpan `handleCardClick` di dalam state atau panggil langsung pada setiap card
        setHandleCardClick(() => handleCardClick);
        setCurrentPage(1)

      } catch (errorKependudukanTabel) {
        setErrorKependudukanTabel(errorKependudukanTabel);
      } finally {
        setLoadingKependudukanTabel(false);
      }
    };
    fetchData();
  };

  const [showNextData, setShowNextData] = useState(false);
  const getDataTabelKependudukanKabKota = ({kodeProvinsi}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_provinsi: kodeProvinsi
          }),
        };        
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_dukcapil_kabkota`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataKependudukanTabel = await response.json();

        setDataKependudukanTabel(dataKependudukanTabel.data) 
        setCurrentPage(1)
        setShowNextData(true);     
      } catch (errorKependudukanTabel) {
        setErrorKependudukanTabel(errorKependudukanTabel);
      } finally {
        setLoadingKependudukanTabel(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    getDataKependudukan({tahun: selectedSingleTahunData});
    getDataTabelKependudukanProv();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Calculate indexes for current page's data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Sorting logic
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...(dataKependudukanTabel || [])];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] || 0;
        const bValue = b[sortConfig.key] || 0;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [dataKependudukanTabel, sortConfig]);

  // Slice the sorted data for the current page
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total number of pages
  const totalPages = Math.ceil((dataKependudukanTabel?.length || 0) / itemsPerPage);

  // Pagination change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Placeholder for empty rows if data is less than items per page
  const placeholders = Array.from(
    { length: itemsPerPage - currentItems.length },
    (_, index) => (
      <tr key={`placeholder-${index}`}>
        <td
          colSpan="10"
          style={{ height: "44px", backgroundColor: "#f9f9f9" }}
        ></td>
      </tr>
    )
  );

  // Determine which icon to show for sorting using Unicode
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "↕"; // Default icon for unsorted
  };

  const [dataWidth, setDataWidth] = useState(6)  
  const [roam, setRoam] = useState(false)

    useEffect(() => {
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          handleCloseNextModalSub();
          handleCloseNextModal()
          handleClose()
        }
      };
    
      window.addEventListener("keydown", handleEscKey);
      return () => {
        window.removeEventListener("keydown", handleEscKey);
      };
    }, []);

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="card-custom">
          <div className="d-flex justify-content-between">
            <div className="d-flex title-page">
            <div className="d-flex justify-content-center align-items-center avatar-sm">
                <span className="logo-sm">
                  {/* <img src={logoKemenkoPmk} alt="" width="40" height="40" /> */}
                </span>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>Data Kependudukan</span>
              </div>
            </div>
            {/* <div className="d-flex nav-beranda">
            <div className="d-flex justify-content-center align-items-center" style={{ fontSize: "14px", fontWeight:600, fontFamily: "poppins" }}>
                    Tahun Data:
                  </div>
                 <select
              name="tahun"
              style={{
                padding: "10px 30px 10px 10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#ffffff",                          
                cursor: "pointer",                          
                margin: "15px 15px 15px 5px",
              }}
              value={selectedSingleTahunData}
              onChange={handleSelectChangeDataPokok}
            > 
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            <div className="d-flex justify-content-center align-items-center" style={{ fontSize: "14px", fontWeight:600, fontFamily: "poppins" }}>
                   Semester:
                  </div>
                 <select
              name="tahun"
              style={{
                padding: "10px 30px 10px 10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#ffffff",                          
                cursor: "pointer",                          
                margin: "15px 15px 15px 5px",
              }}
              value={selectedSingleTahunSemester}
              onChange={handleSelectChangeSemester}
            >                        
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
                </div> */}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={dataWidth}>
          <Card className="card-height-100">
            <CardBody>
              {/* <PolygonMaps /> */}
              {dataWidth==6 ? (<><button onClick={()=>{
                  setDataWidth(12)
                  setRoam(true)
                  }} style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}>
                    Maximize Map
                  </button></>) : (<><button onClick={()=>{
                    setDataWidth(6)
                    setRoam(false)
                  }} style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}>
                    Minimize Map
                  </button></>)}   
              <MapIndoChart chartTitle={titleMap} roam={roam} maxValue={maxValueMap} colorData={["#FFD47A", "#FFC04D", "#FCAD24", "#E69B20", "#CC891C", "#B27717"]} valueSeries={valueMap}/>
            </CardBody>
          </Card>
        </Col>
        <Col md={dataWidth}>
          <Card className="card-height-100">
            <CardBody>
              <Row>
                <Col xl={6}>
                  <Row>
                    <Col>
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalPenduduk')
                        setTitleMap("Total Penduduk")
                      }}>
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
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.jenis_kelamin?.jumlah
                                    }
                                    separator="."
                                    // prefix=""
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
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalLakiLaki')
                        setTitleMap("Total Laki-Laki")
                      }}>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>LAKI-LAKI</span>
                              <span className="title-percent">
                                {/* {dataJumlahPenduduk.persenLaki} */}
                              </span>
                            </div>
                            <div className="d-flex">
                              <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                  <i className="ri-men-line text-info"></i>
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={dataKependudukan?.jenis_kelamin?.laki}
                                    separator="."
                                    // prefix=""
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
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalPerempuan')
                        setTitleMap("Total Perempuan")
                      }}>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>PEREMPUAN</span>
                              <span className="title-percent">
                                {/* {dataJumlahPenduduk.persenPerempuan} */}
                              </span>
                            </div>
                            <div className="d-flex">
                              <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                                  <i className=" ri-women-line text-danger"></i>
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.jenis_kelamin?.perempuan
                                    }
                                    separator="."
                                    // prefix=""
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
                </Col>
                <Col xl={6}>
                  <Row>
                    <Col>
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalKK')
                        setTitleMap("Total Kartu Keluarga")
                      }}>
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
                                <span style={{ fontSize: "18px" }}>
                                  {" "}
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan
                                        ?.jumlah_kepadatan_penduduk?.jml
                                    }
                                    separator="."
                                    // prefix=""
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
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                       handleCardClick('totalKepadatan')
                       setTitleMap("Total Kepadatan Penduduk")
                      }}>
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
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan
                                        ?.jumlah_kepadatan_penduduk?.kepadatan
                                    }
                                    separator="."
                                    // prefix=""
                                    suffix=""
                                    duration={3}
                                  />{" "}
                                  Jiwa/Km<sup>2</sup>
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
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalLuasWilayah')
                        setTitleMap("Total Luas Wilayah")
                      }}>
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
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan
                                        ?.jumlah_kepadatan_penduduk
                                        ?.luas_wilayah
                                    }
                                    separator="."
                                    // prefix=""
                                    suffix=""
                                    duration={3}
                                  />{" "}
                                  Km<sup>2</sup>
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
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
        <Card className="card-animate">
          <CardBody>
          
          {/* <table class="table table-nowrap align-middle mb-0">
          <thead class="table-light">
        <tr>
          <th>Kode Provinsi</th>
          <th>Nama Daerah</th>
          <th>Jumlah KK</th>
          <th>Kepadatan</th>
          <th>Luas Wilayah</th>
          <th>Jumlah Penduduk Laki-laki</th>
          <th>Jumlah Penduduk Perempuan</th>
          <th>Total Penduduk</th>
        </tr>
      </thead>
      <tbody>
        {dataKependudukan?.tabel_wilayah_kelamin?.map((item, index) => (
          <tr key={index}>
            <td>{item.kode_prop}</td>
            <td>{item.nama_daerah || "-"}</td>
            <td>{item.jumlah_kk.toLocaleString("id-ID")}</td>
            <td>{item.kepadatan.toLocaleString("id-ID")}</td>
            <td>{item.luas_wilayah.toLocaleString("id-ID")} km²</td>
            <td>{item.laki.toLocaleString("id-ID")}</td>
            <td>{item.perempuan.toLocaleString("id-ID")}</td>
            <td>{item.jmlpenduduk.toLocaleString("id-ID")}</td>
          </tr>
        ))}
      </tbody>
          </table>*/}
        {/* <div className="separator">
            <h4 className="card-title mb-0">-</h4>
        </div> */}
        {showNextData ? (<><button style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginBottom: "8px"
                      }} onClick={()=>getDataTabelKependudukanProv()}>Kembali ke Provinsi</button></>) : (<></>)}  
    <div style={{ overflowX: "auto" }}>
      {/* Render Table */}
      <table
        className="table table-bordered table-nowrap align-middle mb-0 custom-table"
        style={{ width: "100%" }}
      >
        <thead className="table-light">
          <tr>
            {/* <th>Kode Provinsi</th> */}
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("nama_daerah")}>Nama Daerah {getSortIcon("nama_daerah")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("jumlahpenduduk")}>Total Penduduk (Jiwa) {getSortIcon("jumlahpenduduk")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("jmlkk")}>Jumlah KK (Jiwa) {getSortIcon("jmlkk")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("luas_wilayah")}>Luas Wilayah (Km²) {getSortIcon("luas_wilayah")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("kepadatan")}>Kepadatan (Jiwa/km²) {getSortIcon("kepadatan")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("jumlahlakilaki")}>Jumlah Penduduk Laki-laki (Jiwa) {getSortIcon("jumlahlakilaki")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("jumlahperempuan")}>Jumlah Penduduk Perempuan (Jiwa) {getSortIcon("jumlahperempuan")}</th>
            {/* <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}}>Action</th> */}
          </tr>
        </thead>
        <tbody style={{ minHeight: '500px' }}>
          {currentItems.map((item, index) => (
            <tr key={index}>
              {/* <td>{item.kode_daerah}</td> */}
              <td className={showNextData ? "" : "click-data"} onClick={() =>{showNextData ? "" : getDataTabelKependudukanKabKota({kodeProvinsi: item.kode_daerah}) }}>{item.nama_daerah}</td>
              <td>{item.jumlahpenduduk.toLocaleString("id-ID")}</td>
              <td>{item.jmlkk.toLocaleString("id-ID")}</td>            
              <td>{item.luas_wilayah.toLocaleString("id-ID")}</td>
              <td>{item.kepadatan.toLocaleString("id-ID")}</td>
              <td>{item.jumlahlakilaki.toLocaleString("id-ID")}</td>
              <td>{item.jumlahperempuan.toLocaleString("id-ID")}</td>
              {/* <i
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "30px",
                }}                                
                className="bx bx-list-ul text-primary"
              ></i> */}
            </tr>
          ))}
          {placeholders}
        </tbody>
      </table>
      </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />                 
          </CardBody>
        </Card>
        </Col>
      </Row>
      {/* <Row>
        <Col>
        <Card className="card-animate">
          <CardBody>
          <table class="table table-nowrap align-middle mb-0">
          <thead class="table-light">
        <tr>
          <th>Kode Provinsi</th>
          <th>Nama Daerah</th>
          <th>Bekerja</th>
          <th>Pelajar / Mahasiswa</th>
          <th>Mengurus Rumah Tangga</th>
          <th>Belum / Tidak Bekerja</th>
          <th>Usia Muda</th>
          <th>Usia Produktif</th>
          <th>Usia Tua</th>
        </tr>
      </thead>
      <tbody>
        {dataKependudukan?.tabel_usia_produktif_pekerjaan?.map((item, index) => (
          <tr key={index}>
            <td>{item.kode_prop}</td>
            <td>{item.nama_daerah || "-"}</td>
            <td>{item.bekerja.toLocaleString("id-ID")}</td>
            <td>{item.pelajar_mahasiswa.toLocaleString("id-ID")}</td>
            <td>{item.mengurus_rumah_tangga.toLocaleString("id-ID")}</td>
            <td>{item.belum_tidak_bekerja.toLocaleString("id-ID")}</td>
            <td>{item.usia_muda.toLocaleString("id-ID")}</td>
            <td>{item.usia_produktif.toLocaleString("id-ID")}</td>
            <td>{item.usia_tua.toLocaleString("id-ID")}</td>
          </tr>
        ))}
      </tbody>
    </table>
          </CardBody>
        </Card>
        </Col>
      </Row> */}
      
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
                      className={classnames("h-100", {
                        active: customActiveTabAll === "1",
                      })}
                      onClick={() => {
                        toggleCustomAll("1");
                      }}
                    >
                      JUMLAH PENDUDUK
                    </NavLink>
                  </NavItem>
                  {/* <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "2",
                      })}
                      onClick={() => {
                        toggleCustomAll("2");
                      }}
                    >
                     PENGELOMPOKAN USIA BERDASARKAN PRODUKTIVITAS
                    </NavLink>
                  </NavItem>                   */}
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "3",
                      })}
                      onClick={() => {
                        toggleCustomAll("3");
                      }}
                    >
                      AGAMA
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "4",
                      })}
                      onClick={() => {
                        toggleCustomAll("4");
                      }}
                    >
                      PENDIDIKAN                 
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "5",
                      })}
                      onClick={() => {
                        toggleCustomAll("5");
                      }}
                    >
                      KELOMPOK UMUR                 
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>            
              <TabContent
                activeTab={customActiveTabAll}
                className="text-muted"
              >
                <TabPane tabId="1" id="provinsi">
                {/* <div className="separator">
                <h4 className="card-title mb-0 d-flex justify-content-center">Top 10 Jumlah Penduduk</h4>
              </div> */}
              <div className="nav-beranda">
                <Nav
                  tabs
                  className="nav nav-tabs-custom card-header-tabs border-bottom-0 ms-2 mb-3"
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
                  {/* <NavItem>
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
                  </NavItem> */}
                </Nav>
              </div>
              <TabContent activeTab={customActiveTab} className="text-muted">
                <TabPane tabId="1" id="provinsi">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Provinsi[0]}
                    categoryChart={dataChartTop10Provinsi[1]}
                    dataColors='["#57E7B4"]'                    
                    dataTotal={10}
                    dataZoom={true}
                  />
                </TabPane>
                <TabPane tabId="2" id="kabupaten">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Kabupaten[0]}
                    categoryChart={dataChartTop10Kabupaten[1]}
                    namaProv={dataChartTop10Kabupaten[2]}
                    dataColors='["#57E7B4"]'
                    dataZoom={true}
                    kabupaten={true}
                  />
                </TabPane>
                <TabPane tabId="3" id="kecamatan">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Kecamatan[0]}
                    categoryChart={dataChartTop10Kecamatan[1]}
                    namaProv={dataChartTop10Kecamatan[2]}
                    namaKab={dataChartTop10Kecamatan[3]}
                    dataColors='["#57E7B4"]'
                    dataZoom={true}
                    kecamatan={true}
                  />
                </TabPane>
                <TabPane tabId="4" id="kelurahan">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Kelurahan[0]}
                    categoryChart={dataChartTop10Kelurahan[1]}
                    namaProv={dataChartTop10Kelurahan[2]}
                    namaKab={dataChartTop10Kelurahan[3]}
                    namaKec={dataChartTop10Kelurahan[4]}  
                    kelurahan={true}                  
                    dataColors='["#57E7B4"]'
                    dataZoom={true}
                  />
                </TabPane>
              </TabContent>
                </TabPane>
                {/* <TabPane tabId="2" id="provinsi">
                <div className="separator mb-2">
                <h4 className="card-title d-flex justify-content-center">Pengelompokan Usia Berdasarkan Produktivitas</h4>
              </div>
              <Row>
                <Col md={6}>
                <Row>
                <Col >
                      <Card>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Usia muda (0-15)</span>
                            </div>
                            <div className="d-flex">
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.usia_produktif
                                        ?.usia_muda
                                    }
                                    separator="."
                                    // prefix=""
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
                      <Card>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Usia Produktif  (16-64) </span>
                            </div>
                            <div className="d-flex">
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.usia_produktif
                                        ?.usia_produktif
                                    }
                                    separator="."
                                    // prefix=""
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
                      <Card>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Usia Tua (65++)</span>
                            </div>
                            <div className="d-flex">
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.usia_produktif?.usia_tua
                                    }
                                    separator="."
                                    // prefix=""
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
                </Col>
                <Col md={6}>
                  <VerticalBarChart
                    valueChart={dataChartUsiaProduktif}
                    categoryChart={[
                      "Bekerja",
                      "Belum/Tidak Kerja",
                      "Mengurus Rumah Tangga",
                      "Pelajar/Mahasiswa",
                    ]}
                    dataColors='["#2DAED4"]'
                  />
                </Col>
              </Row>
                </TabPane> */}
                <TabPane tabId="3" id="provinsi">
                <div className="separator mb-2">
                <h4 className="card-title d-flex justify-content-center">Agama</h4>
              </div>
              <HorizontalBarChart
                dataColors='["#FCAD24"]'
                valueChart={dataChartAgama[1]}
                categoryChart={dataChartAgama[0]}
              />
                </TabPane>
                <TabPane tabId="4" id="provinsi">
                <div className="separator mb-2">
                <h4 className="card-title d-flex justify-content-center">Pendidikan</h4>
              </div>
              <HorizontalBarChart
                dataColors='["#FCAD24"]'
                valueChart={dataChartPendidikan[0]}
                categoryChart={dataChartPendidikan[1]}
              />
                </TabPane>
                <TabPane tabId="5" id="provinsi">
                <div className="">
                <h4 className="card-title mb-2 d-flex justify-content-center">Kelompok Umur</h4>
              </div>
              <PyramidChart 
                    firstValue={dataChartLakiLaki[0]}
                    secondValue={dataChartPerempuan[0]}
                    category={dataChartPerempuan[1]}
                  />
              {/* <div className="nav-beranda">
                
                <Nav
                  tabs
                  className="nav nav-tabs-custom card-header-tabs border-bottom-0 ms-2 mb-3"
                >
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTabKelompokUmur === "1",
                      })}
                      onClick={() => {
                        toggleCustomKelompokUmur("1");
                      }}
                    >
                      Laki Laki
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTabKelompokUmur === "2",
                      })}
                      onClick={() => {
                        toggleCustomKelompokUmur("2");
                      }}
                    >
                      Perempuan
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent
                activeTab={customActiveTabKelompokUmur}
                className="text-muted"
              >
                  
                <TabPane tabId="1" id="lakiLaki">
                  <VerticalBarChart
                    valueChart={dataChartLakiLaki[0]}
                    categoryChart={dataChartLakiLaki[1]}
                    dataColors='["#2DAED4"]'
                  />
                </TabPane>
                <TabPane tabId="2" id="perempuan">
                  <VerticalBarChart
                    valueChart={dataChartPerempuan[0]}
                    categoryChart={dataChartPerempuan[1]}
                    dataColors='["#FFA0BE"]'
                  />
                </TabPane>
              </TabContent> */}
                </TabPane>                
              </TabContent>
          </CardBody>        
        </Card>
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">Top 10 Jumlah Penduduk</h4>
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
                  <HorizontalBarChart
                    valueChart={dataChartTop10Provinsi[0]}
                    categoryChart={dataChartTop10Provinsi[1]}
                    dataColors='["#57E7B4"]'
                  />
                </TabPane>
                <TabPane tabId="2" id="kabupaten">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Kabupaten[0]}
                    categoryChart={dataChartTop10Kabupaten[1]}
                    dataColors='["#57E7B4"]'
                  />
                </TabPane>
                <TabPane tabId="3" id="kecamatan">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Kecamatan[0]}
                    categoryChart={dataChartTop10Kecamatan[1]}
                    dataColors='["#57E7B4"]'
                  />
                </TabPane>
                <TabPane tabId="4" id="kelurahan">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Kelurahan[0]}
                    categoryChart={dataChartTop10Kelurahan[1]}
                    dataColors='["#57E7B4"]'
                  />
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
              <div className="separator mb-2">
                <h4 className="card-title ">Pengelompokan Usia Berdasarkan Produktifitas</h4>
              </div>
              <Row>
                <Col md={6}>
                <Row>
                <Col >
                      <Card>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Usia muda (0-15)</span>
                            </div>
                            <div className="d-flex">
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.usia_produktif
                                        ?.usia_muda
                                    }
                                    separator="."
                                    // prefix=""
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
                      <Card>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Usia Produktif  (16-64) </span>
                            </div>
                            <div className="d-flex">
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.usia_produktif
                                        ?.usia_produktif
                                    }
                                    separator="."
                                    // prefix=""
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
                      <Card>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Usia Tua (65++)</span>
                            </div>
                            <div className="d-flex">
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.usia_produktif?.usia_tua
                                    }
                                    separator="."
                                    // prefix=""
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
                </Col>
                <Col md={6}>
                  <VerticalBarChart
                    valueChart={dataChartUsiaProduktif}
                    categoryChart={[
                      "Bekerja",
                      "Belum/Tidak Kerja",
                      "Mengurus Rumah Tangga",
                      "Pelajar/Mahasiswa",
                    ]}
                    dataColors='["#2DAED4"]'
                  />
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
              <div className="separator mb-2">
                <h4 className="card-title ">Agama</h4>
              </div>
              <HorizontalBarChart
                dataColors='["#FCAD24"]'
                valueChart={dataChartAgama[0]}
                categoryChart={dataChartAgama[1]}
              />
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <div className="separator mb-2">
                <h4 className="card-title ">Pendidikan</h4>
              </div>
              <HorizontalBarChart
                dataColors='["#FCAD24"]'
                valueChart={dataChartPendidikan[0]}
                categoryChart={dataChartPendidikan[1]}
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
                <h4 className="card-title mb-0">Kelompok Umur</h4>
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
                        active: customActiveTabKelompokUmur === "1",
                      })}
                      onClick={() => {
                        toggleCustomKelompokUmur("1");
                      }}
                    >
                      Laki Laki
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTabKelompokUmur === "2",
                      })}
                      onClick={() => {
                        toggleCustomKelompokUmur("2");
                      }}
                    >
                      Perempuan
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent
                activeTab={customActiveTabKelompokUmur}
                className="text-muted"
              >
                <TabPane tabId="1" id="lakiLaki">
                  <VerticalBarChart
                    valueChart={dataChartLakiLaki[0]}
                    categoryChart={dataChartLakiLaki[1]}
                    dataColors='["#2DAED4"]'
                  />
                </TabPane>
                <TabPane tabId="2" id="perempuan">
                  <VerticalBarChart
                    valueChart={dataChartPerempuan[0]}
                    categoryChart={dataChartPerempuan[1]}
                    dataColors='["#FFA0BE"]'
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
    </React.Fragment>
  );
};

export default ContentKependudukanV2;
