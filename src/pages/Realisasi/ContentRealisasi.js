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
import BreadCrumb from "../../Components/Common/BreadCrumb";
import MapIndoChart from "../../Components/MapIndo/MapIndoChart";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

const ContentRealisasi = () => {
  const [titleMap, setTitleMap] = useState("Total Peserta Aktif")
  const [valueMap, setValueMap] = useState([]);
  const [maxValueMap, setmaxValueMap] = useState(0)
  const [dataWidth, setDataWidth] = useState(6)  
  const [roam, setRoam] = useState(false);
  const [dataPersentaseMap, setDataPersentaseMap] = useState({}); 
  const [customActiveTab, setcustomActiveTab] = useState("6");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedSingleTahun, setSelectedSingleTahun] = useState('2025'); // Set default value
  const [selectedSingleTahapan, setSelectedSingleTahapan] = useState('1'); // Set default value

  const [dataRealisasi, setDataRealisasi] = useState([]);
  const [dataRealisasiPersentase, setDataRealisasiPersentase] = useState(
    []
  );
  const [dataRealisasiPersentaseFiltered, setDataRealisasiPersentaseFiltered] = useState(
    []
  );
  const [loadingRealisasi, setLoadingRealisasi] = useState([]);
  const [errorRealisasi, setErrorRealisasi] = useState([]);

  const getDataRealisasiNasionalPersentase = ({
    tahun = "",
    // tahapan = "1",    
  } = {}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            // id_tahap: tahapan,
            tahun: tahun,
          }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/v2/realisasi_level_1`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataRealisasiNasionalPersentase = await response.json();
        setDataRealisasiPersentase(
          dataRealisasiNasionalPersentase.data.realisasi_level_1
        );
        setDataRealisasiPersentaseFiltered(
          dataRealisasiNasionalPersentase.data.realisasi_level_1
        );

        const dataPersentaseMap = Array.isArray(dataRealisasiNasionalPersentase?.data?.realisasi_level_1)
        ? dataRealisasiNasionalPersentase.data.realisasi_level_1.map(item => ({
            name: item?.nama_prov || "Unknown",
            value: item?.persenrealisasianggaran || 0,
          }))
        : [];

        const maxValue = Array.isArray(dataPersentaseMap)
          ? dataPersentaseMap.reduce((max, item) => Math.max(max, item.value || 0), 0)
          : 0;

        setValueMap(dataPersentaseMap)
        setmaxValueMap(maxValue);

      } catch (errorRealisasi) {
        setErrorRealisasi(errorRealisasi);
      } finally {
        setLoadingRealisasi(false);
      }
    };
    fetchData();
  };

    // Memanggil fungsi API setiap kali dropdown berubah
    useEffect(() => {
    getDataRealisasiNasionalPersentase({
        tahun: selectedSingleTahun,
        tahapan: selectedSingleTahapan,
    });
    }, [selectedSingleTahun, selectedSingleTahapan]); // Panggil API jika tahun atau dokumen berubah

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...(dataRealisasiPersentaseFiltered || [])];
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
  }, [dataRealisasiPersentaseFiltered, sortConfig]);

  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    (dataRealisasiPersentase?.length || 0) / itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [dataShowSumberUsulan, setDataShowSumberUsulan] = useState(false);
  const handleShowDataSumberUsulan = (value) => {
    setDataShowSumberUsulan(value);
  };

  const [namaTahapan, setNamaTahapan] = useState("Penetapan")
  

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`, 'ini isi selected value');
    
    if (name === 'tahun') {
        setSelectedSingleTahun(value); // Misalnya, untuk dropdown tahun
    } else if (name === 'tahap') {
        setSelectedSingleTahapan(value); // Misalnya, untuk dropdown jenis dokumen
    }

  };
  
  const navigate = useNavigate();
  const goToDetail = (_id, namaDaerah) => {
    const encodedNamaDaerah = encodeURIComponent(namaDaerah);
    navigate(`/realisasi/realisasi-detail/${_id}?namaDaerah=${encodedNamaDaerah}`);
  };

  const [searchTerm, setSearchTerm] = useState("");
      // Fungsi untuk menangani perubahan pada input
      const handleSearchInput = (e) => {
        const value = e.target.value.toLowerCase()
        setSearchTerm(e.target.value);
        if(value===""){
          setDataRealisasiPersentaseFiltered(dataRealisasiPersentase)
        }else{
          const filtered = dataRealisasiPersentase.filter((item) => 
            item.nama_prov.toLowerCase().includes(value)
          );
          setDataRealisasiPersentaseFiltered(filtered)
        }
        setCurrentPage(1);
      };
  
      const handleClearSearch = () => {
        setCurrentPage(1);
        setSearchTerm("");
        setDataRealisasiPersentaseFiltered(dataRealisasiPersentase)
      };

      const [clickDaerah, setClickDaerah] = useState(false)
      const [clickNamaDaerah, setClickNamaDaerah] = useState("")
      const [kodeWilayahPeta, setKodeWilayahPeta]=useState("")  
      const handleRegionClick = (kodeProv, namaProv) => {
        goToDetail(kodeProv, namaProv)
        setClickNamaDaerah(namaProv)
        setClickDaerah(true)
      };

      const handleKabKotaClick = (kodeProv, namaProv) => {
        setClickNamaDaerah(namaProv)
        setClickDaerah(true)
      };
  
      const resetRegionClick = () => {

        setClickDaerah(false)
      }
  

  return (
    <React.Fragment>
    
    <Row>
        <Col>
            <div className="d-flex justify-content-between">
              <div className="d-flex title-page" style={{padding:"0 0 13px 0"}}>
                {/* <div className="d-flex justify-content-center align-items-center avatar-sm">
                  <span className="logo-sm">
                    <img src={logoKemenkoPmk} alt="" width="40" height="40" />
                  </span>
                </div> */}
                <div className="d-flex justify-content-center align-items-center">
                  <span>Realisasi</span>
                </div>
              </div>
              </div>
        </Col>        
    </Row>    
      <Row>
        <Col md={dataWidth} xl={dataWidth}>
          <Card className="card-height-100">
            <CardBody>
              {dataShowSumberUsulan ? (
                <>
                  <div className="separator">
                    <h4 className="card-title mb-0">Realisasi Nasional</h4>
                    <h4 className="card-title mb-0">Republik Indonesia</h4>
                  </div>
                  <VerticalBarChart
                    valueChart={dataRealisasi[0]}
                    categoryChart={dataRealisasi[1]}
                    dataColors='["#57E7B4"]'
                    background={true}
                  />
                  <div className="mt-4">
                    <span
                      onClick={() => handleShowDataSumberUsulan(false)}
                      style={{ cursor: "pointer", color: "#2DAED4" }}
                    >
                      Lihat Peta
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="separator">
                    <h4 className="card-title mb-0">Realisasi Nasional</h4>
                    <h4 className="card-title mb-0">Republik Indonesia</h4>
                  </div>
                  <div className="d-flex justify-content-between mb-2 mt-2">
              <div className="d-flex justify-content-center align-items-center">
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
              </div>                          
              </div>
                  <MapIndoChart onKabKotaClick={handleKabKotaClick} onRegionClick={handleRegionClick} roam={roam} maxValue={maxValueMap} valueSeries={valueMap} colorData={["#FCAD24", "#57E7B4"]} />                           
                </>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col md={6} xl={6}>
          <Card className="card-height-100">
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-1">
                  Realisasi Belanja
                </h4>
                {/* <h4 className="card-title">
                    {namaTahapan}
                </h4>                 */}
              </div>
              <Row>
                <Col>
                <div className='d-flex'>
                  <div className="mb-2 d-flex">
                  <div
                      className="mx-2 mt-3"
                      style={{
                        position: "relative",
                        // width: "100%",
                        marginBottom: "20px",
                      }}
                    >
             <input
                  style={{
                    padding: "10px 30px 10px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    maxWidth: "250px",
                    fontSize: "16px",
                  }}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInput}
                  placeholder="Cari Daerah"
                />
                {searchTerm && (
                <button
                  onClick={() => handleClearSearch()}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "#999",
                  }}
                >
                  &#10006;
                </button>
              )}
            </div> 
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
                          marginLeft: "10px",
                          marginTop: "16px",
                          marginBottom: "30px",
                        }}
                        value={selectedSingleTahun}
                        onChange={handleSelectChange}
                      >                        
                        <option value="2024">2024</option>                      
                        <option value="2025">2025</option>                      
                      </select>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="table-responsive table-card mt-2">
                    <table className="table table-nowrap mb-2 ">
                      <thead className="table-light">
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            }}
                            scope="col"
                          >
                            KODE
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            }}
                            scope="col"
                          >
                            Se-PROVINSI
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            }}
                            scope="col"
                          >
                            PROGRESS (%)
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            }}
                            scope="col"
                          >
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => {
                          const tahapData = {
                            1: item.persiapan,
                            2: item.rancangan_awal,
                            3: item.rancangan,
                            4: item.musrenbang,
                            5: item.rancangan_akhir,
                            6: item.penetapan,
                          };

                          return (
                            <tr key={index}>
                              <td>{item.kode_prov}</td>
                              <td>{item.nama_prov.replace("Provinsi ", "")}</td>
                              <td>
                                <div
                                  className="progress"
                                  style={{ height: "20px" }}
                                >
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${item.persenrealisasianggaran}%`,
                                      backgroundColor: item.persenrealisasianggaran === 100
                                      ? "#57E7B4" // Hijau jika 100%
                                      : (item.persenrealisasianggaran > 5 && item.persenrealisasianggaran < 100)
                                      ? "#FCAD24" // Kuning jika 1%-99%
                                      : "#F35F52", // Merah jika 0%,
                                      color: "black",
                                    }}
                                    aria-valuenow={item.persenrealisasianggaran}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >
                                    {item.persenrealisasianggaran > 30 &&
                                      `${item.persenrealisasianggaran.toLocaleString("id-ID", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}%`}
                                  </div>
                                  {item.persenrealisasianggaran <= 30 && (
                                    <div className="d-flex justify-content-center ms-1 align-items-center">
                                      {item.persenrealisasianggaran.toLocaleString("id-ID", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                      %
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  verticalAlign: "middle",                                  
                                  whiteSpace: "normal",
                                  overflowWrap: "break-word",
                                }}
                              >
                                <i onClick={()=> goToDetail(item.kode_prov, item.nama_prov)}
                                  style={{
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                    fontSize: "20px",
                                  }}
                                  className="bx bx-list-ul text-primary"
                                ></i>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContentRealisasi;
