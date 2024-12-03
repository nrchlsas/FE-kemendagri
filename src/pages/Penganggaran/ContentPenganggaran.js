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

const ContentPenganggaran = () => {
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedSingleTahun, setSelectedSingleTahun] = useState('2024'); // Set default value
  const [selectedSingleTahapan, setSelectedSingleTahapan] = useState('28'); // Set default value

  const [dataPenganggaran, setDataPenganggaran] = useState([]);
  const [dataPenganggaranPersentase, setDataPenganggaranPersentase] = useState(
    []
  );
  const [loadingPenganggaran, setLoadingPenganggaran] = useState([]);
  const [errorPenganggaran, setErrorPenganggaran] = useState([]);

  const [dataPenganggaranSudahDanBelum, setDataPenganggaranSudahDanBelum] = useState(
    []
  );

  const [titleMap, setTitleMap] = useState("Total Peserta Aktif")
  const [valueMap, setValueMap] = useState([]);
  const [maxValueMap, setmaxValueMap] = useState(0)
  const [dataWidth, setDataWidth] = useState(6)  
  const [roam, setRoam] = useState(false);
  const [dataPersentaseMap, setDataPersentaseMap] = useState({}); 

  const getDataPenganggaranNasional = ({
    tahun = "2024",
    tahapan = "1",
  } = {}) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_tahap: tahapan,
            tahun: tahun,
          }),
        };
        const response = await fetch(
          `${API_URI}/dashboard_penganggaran_1_nasional`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPenganggaranNasional = await response.json();

        const dataResultChartTahapan =
          dataPenganggaranNasional.data.dashboard_Penganggaran_1__nasional.list.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.tahapan);
              return acc;
            },
            [[], []]
          );        

        setDataPenganggaran(dataResultChartTahapan);
      } catch (errorPenganggaran) {
        setErrorPenganggaran(errorPenganggaran);
      } finally {
        setLoadingPenganggaran(false);
      }
    };
    fetchData();
  };

  const getDataPenganggaranNasionalProgress = ({
    tahun = "2024",
    tahapan = selectedSingleTahapan,
    kodeDdn
  } = {}) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_tahap: tahapan,
            tahun: tahun,
            kode_ddn: kodeDdn
          }),
        };
        const response = await fetch(
          `${API_URI}/dashboard_penganggaran_level_2`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPenganggaranNasionalPersentase = await response.json();

        const sudahData = dataPenganggaranNasionalPersentase.data.penganggaran_level_2.filter((item) => {
          const tahapData = {
            5: item?.persen_daerah_rapbd,
            40: item?.persen_daerah_kuappas,
            30: item?.persen_daerah_apbdgeser,
            41: item?.persen_daerah_kupa,
            8: item?.persen_daerah_rapbdubah,
            29: item?.persen_daerah_apbdubah,
            28: item?.persen_daerah_apbd,
            32: item?.persen_daerah_apbdgeserpasca,
          };

          return (
            tahapData[selectedSingleTahapan] > 0
          )
        });

        const belumData = dataPenganggaranNasionalPersentase.data.penganggaran_level_2.filter((item) => {
          const tahapData = {
            5: item?.persen_daerah_rapbd,
            40: item?.persen_daerah_kuappas,
            30: item?.persen_daerah_apbdgeser,
            41: item?.persen_daerah_kupa,
            8: item?.persen_daerah_rapbdubah,
            29: item?.persen_daerah_apbdubah,
            28: item?.persen_daerah_apbd,
            32: item?.persen_daerah_apbdgeserpasca,
          };

          return (
            tahapData[selectedSingleTahapan] == 0
          )
        });        
        setDataPenganggaranSudahDanBelum(
          dataPenganggaranNasionalPersentase.data.penganggaran_level_2
        )

        setModall(true);  
      } catch (errorPenganggaran) {
        setErrorPenganggaran(errorPenganggaran);
      } finally {
        setLoadingPenganggaran(false);
      }
    };
    fetchData();
  };

  const getDataPenganggaranNasionalPersentase = ({
    tahun = "2024",
    tahapan = "28",    
  } = {}) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_tahap: tahapan,
            tahun: tahun,
          }),
        };
        const response = await fetch(
          `${API_URI}/dashboard_penganggaran_level_1`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPenganggaranNasionalPersentase = await response.json();
        setDataPenganggaranPersentase(
          dataPenganggaranNasionalPersentase.data.penganggaran_level_1
        );
        const dataPersentasePenganggaran = {
          tahap40: dataPenganggaranNasionalPersentase.data.penganggaran_level_1.map(item => ({
          name: item.nama_prov,
          value: item.persen_daerah_kuappas
        })),
          tahap5: dataPenganggaranNasionalPersentase.data.penganggaran_level_1.map(item => ({
          name:item.nama_prov,
          value: item.persen_daerah_rapbd        
        })),
          tahap28: dataPenganggaranNasionalPersentase.data.penganggaran_level_1.map(item => ({
          name: item.nama_prov,
          value: item.persen_daerah_apbd       
        })),
          tahap30: dataPenganggaranNasionalPersentase.data.penganggaran_level_1.map(item => ({
          name:item.nama_prov,
          value: item.persen_daerah_apbdgeser
        })),
          tahap41: dataPenganggaranNasionalPersentase.data.penganggaran_level_1.map(item => ({
          name:item.nama_prov,
          value: item.persen_daerah_kupa
        })),
          tahap8: dataPenganggaranNasionalPersentase.data.penganggaran_level_1.map(item => ({            
          name:item.nama_prov,
          value: item.persen_daerah_rapbdubah
        })),
          tahap29: dataPenganggaranNasionalPersentase.data.penganggaran_level_1.map(item => ({
          name:item.nama_prov,
          value: item.persen_daerah_apbdubah
        })),
          tahap32: dataPenganggaranNasionalPersentase.data.penganggaran_level_1.map(item => ({
          name:item.nama_prov,
          value: item.persen_daerah_apbdgeserpasca
        })),
      }
      
      const selectedData = dataPersentasePenganggaran[`tahap${selectedSingleTahapan}`]; // Ambil data sesuai pilihan
      const maxValue = Math.max(...selectedData.map(item => item.value));
      // setDataPersentaseMap(dataPersentasePenganggaran)
      setValueMap(selectedData);
      setmaxValueMap(maxValue);
      // const maxValue = Math.max(...dataPersentasePenganggaran.tahap28.map(item => item.value));
      
      } catch (errorPenganggaran) {
        setErrorPenganggaran(errorPenganggaran);
      } finally {
        setLoadingPenganggaran(false);
      }
    };
    fetchData();
  };

    // Memanggil fungsi API setiap kali dropdown berubah
    useEffect(() => {
    getDataPenganggaranNasionalPersentase({
        tahun: selectedSingleTahun,
        tahapan: selectedSingleTahapan,
    });
    }, [selectedSingleTahun, selectedSingleTahapan]); // Panggil API jika tahun atau dokumen berubah


    useEffect(() => {
        // getDataPenganggaranNasional();
        getDataPenganggaranNasionalPersentase();        
    }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page
  const [currentPageSudahDanBelum, setCurrentPageSudahDanBelum] = useState(1);
  const [itemsPerPageSudahDanBelum] = useState(10); // Set items per page
  const [sortConfigDetail, setSortConfigDetail] = useState({      
    key: null,
    direction: "ascending",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const indexOfLastItemSudahDanBelum = currentPageSudahDanBelum * itemsPerPageSudahDanBelum;
  const indexOfFirstItemSudahDanBelum = indexOfLastItemSudahDanBelum - itemsPerPageSudahDanBelum;

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...(dataPenganggaranPersentase || [])];
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
  }, [dataPenganggaranPersentase, sortConfig]);

  const sortedItemsSudahDanBelum = React.useMemo(() => {
    let sortableItems = [...(dataPenganggaranSudahDanBelum || [])];
    if (sortConfigDetail.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfigDetail.key] || 0;
        const bValue = b[sortConfigDetail.key] || 0;

        if (aValue < bValue) {
          return sortConfigDetail.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfigDetail.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [dataPenganggaranSudahDanBelum, sortConfigDetail]);

  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemsSudahDanBelum = sortedItemsSudahDanBelum
  
  const totalPages = Math.ceil(
    (dataPenganggaranPersentase?.length || 0) / itemsPerPage
  );

  const totalPagesSudahDanBelum = Math.ceil(
    (dataPenganggaranSudahDanBelum?.length || 0) / itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateSudahDanBelum = (pageNumber) => setCurrentPageSudahDanBelum(pageNumber);

  const [dataShowSumberUsulan, setDataShowSumberUsulan] = useState(false);
  const handleShowDataSumberUsulan = (value) => {
    setDataShowSumberUsulan(value);
  };  
  
  const handleSelectChange = (e) => {
    console.log('oii')
    const { name, value } = e.target;    
    
    switch (value) {
      case "40":
       setDataDetailNamaTahap("KUA & PPAS");
       break;
      case "5":
       setDataDetailNamaTahap("RAPBD")
       break;
      case "28":
       setDataDetailNamaTahap("Penetapan APBD")      
       break;
      case "30":
       setDataDetailNamaTahap("APBD Pergeseran")
       break;
      case "41":
       setDataDetailNamaTahap("KUPA & PPAS")   
       break;
      case "8":
       setDataDetailNamaTahap("RAPBD Perubahan")
       break;
      case "29":
       setDataDetailNamaTahap("Penetapan APBD Perubahan")
       break;
      default:
       setDataDetailNamaTahap("APBD Pergeseran Setelah APBD Perubahan")    
    }    
    
    if (name === 'tahun') {
        setSelectedSingleTahun(value); // Misalnya, untuk dropdown tahun
    } else if (name === 'tahap') {
        setSelectedSingleTahapan(value); // Misalnya, untuk dropdown jenis dokumen
    }    

  };
  
  const navigate = useNavigate();
  const goToDetail = (_id, namaDaerah) => {
    const encodedNamaDaerah = encodeURIComponent(namaDaerah);
    navigate(`/penganggaran/penganggaran-detail/${_id}?namaDaerah=${encodedNamaDaerah}&tahapan=${customActiveTab}&subTahapan=${selectedSingleTahapan}`);
  };

  const [modall, setModall] = useState(false);
  const [dataDetailNamaTahap, setDataDetailNamaTahap] = useState("Penetapan APBD Perubahan");
  const [dataDetailIdTahap, setDataDetailIdTahap] = useState(28);
  const [dataRincianDetail, setDataRincianDetail] = useState(0);
  const [dataDetailNamaUnitSkpd, setDataDetailNamaUnitSkpd] = useState("");
  const [cardhead, setCardHead] = useState();
  const [totalDaerahSudahBelum, setTotalDaerahSudahBelum] = useState([]);

  const handleOpen = ({kodeDdn}) => {   
    getDataPenganggaranNasionalProgress({kodeDdn: kodeDdn})   
    setCardHead(null);
  };


  const handleClose = () => {
    setModall(false); // Close modal by setting modall to false
  };

  const requestSortDetail = (key) => {
    let direction = "ascending";
    if (sortConfigDetail.key === key && sortConfigDetail.direction === "ascending") {
      direction = "descending";
    }
    setSortConfigDetail({ key, direction });
  };

  const getSortIconDetail = (key) => {
    if (sortConfigDetail.key === key) {
      return sortConfigDetail.direction === "ascending" ? "▲" : "▼";
    }
    return "↕"; // Default icon for unsorted
  };

  
    const itemsSudah = currentItemsSudahDanBelum.filter((item) => {
      const tahapData = {
        5: item?.daerah_rapbd,
        40: item?.daerah_kuappas,
        30: item?.daerah_apbdgeser,
        41: item?.daerah_kupa,
        8: item?.daerah_rapbdubah,
        29: item?.daerah_apbdubah,
        28: item?.daerah_apbd,
        32: item?.daerah_apbdgeserpasca,
      };
      return tahapData[selectedSingleTahapan] > 0;
    });
    
    const itemsBelum = currentItemsSudahDanBelum.filter((item) => {
      const tahapData = {
        5: item?.daerah_rapbd,
        40: item?.daerah_kuappas,
        30: item?.daerah_apbdgeser,
        41: item?.daerah_kupa,
        8: item?.daerah_rapbdubah,
        29: item?.daerah_apbdubah,
        28: item?.daerah_apbd,
        32: item?.daerah_apbdgeserpasca,
      };
      return tahapData[selectedSingleTahapan] === 0;
    });
    
    const totalDaerahSudah = itemsSudah.length
    const totalDaerahBelum = itemsBelum.length  
      
    const maxLength = Math.max(itemsSudah.length, itemsBelum.length);
    
    while (itemsSudah.length < maxLength) {
      itemsSudah.push({ kode_ddn: "", nama_daerah: "" });
    }
    
    while (itemsBelum.length < maxLength) {
      itemsBelum.push({ kode_ddn: "", nama_daerah: "" });
    }

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
                  <span>Penganggaran</span>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <div className="nav-beranda d-flex justify-content-center align-items-center">
                <Nav tabs className="nav nav-tabs nav-success nav-justified border-bottom-0">
                    <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames("h-100", {
                            active: customActiveTab === "1",
                          })}
                          onClick={() => {
                            toggleCustom("1");
                            setSelectedSingleTahapan("28")
                            setDataDetailNamaTahap("Penetapan APBD")
                          }}
                        >
                          Murni
                        </NavLink>
                      </NavItem>                                            
                    <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames("h-100", {
                            active: customActiveTab === "2",
                          })}
                          onClick={() => {
                            toggleCustom("2");
                            setSelectedSingleTahapan("30")
                            setDataDetailNamaTahap("APBD Pergeseran")
                          }}
                        >
                          Pergeseran
                        </NavLink>
                      </NavItem>                                            
                    <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames("h-100", {
                            active: customActiveTab === "3",
                          })}
                          onClick={() => {
                            toggleCustom("3");
                            setSelectedSingleTahapan("41")
                            setDataDetailNamaTahap("KUPA & PPAS")
                          }}
                        >
                          Perubahan
                        </NavLink>
                      </NavItem>                                            
                    <NavItem>
                        <NavLink
                          style={{ cursor: "pointer", width:"250px" }}
                          className={classnames("h-100", {
                            active: customActiveTab === "4",
                          })}
                          onClick={() => {
                            toggleCustom("4");
                            setSelectedSingleTahapan("32")
                            setDataDetailNamaTahap("APBD Pergeseran Setelah APBD Perubahan")
                          }}
                        >
                          Pergeseran Setelah Perubahan
                        </NavLink>
                      </NavItem>                                            
                    </Nav>
                </div>
              </div>
            </div>
          </Card>
        </Col>        
    </Row>    
      <Row>
        <Col md={dataWidth} xl={dataWidth}>
          <Card className="card-height-100">
            <CardBody>
              {dataShowSumberUsulan ? (
                <>
                  <div className="separator">
                    <h4 className="card-title mb-0">Penganggaran Nasional</h4>
                    <h4 className="card-title mb-0">Republik Indonesia</h4>
                  </div>
                  <VerticalBarChart
                    valueChart={dataPenganggaran[0]}
                    categoryChart={dataPenganggaran[1]}
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
                    <h4 className="card-title mb-0">Penganggaran Nasional</h4>
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
                  <MapIndoChart roam={roam} maxValue={maxValueMap} valueSeries={valueMap} colorData={["#FCAD24", "#57E7B4"]} />
                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-column justify-content-evenly">
                    <div className="d-flex align-items-center mb-2">
                        <div style={{ height: "10px", width: "10px", backgroundColor: "#57E7B4", marginRight: "8px" }}></div>
                        <span style={{fontStyle:"poppins", color:"#929FB1"}}>Ketika 100% Pemda</span>
                    </div>                
                    <div className="d-flex align-items-center mb-2">
                        <div style={{ height: "10px", width: "10px", backgroundColor: "#FCAD24", marginRight: "8px" }}></div>
                        <span style={{fontStyle:"poppins", color:"#929FB1"}}>Ketika 1%-99% Pemda</span>
                    </div>                    
                    <div className="d-flex align-items-center">
                        <div style={{ height: "10px", width: "10px", backgroundColor: "#EFF2F7", marginRight: "8px" }}></div>
                        <span style={{fontStyle:"poppins", color:"#929FB1"}}>Ketika 0% Pemda</span>
                    </div>
                    </div>
                    <div className="d-flex mt-4 align-items-end">
                        <span
                        onClick={() => handleShowDataSumberUsulan(true)}
                        style={{ cursor: "pointer", color: "#2DAED4" }}
                        >
                        Lihat Sumber Usulan
                        </span>
                    </div>
                  </div>
                  
                </>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col md={dataWidth} xl={dataWidth}>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-1">
                  List Progress Penganggaran 
                </h4>
              </div>
              <Row>
                <Col>
                  {/* <input
                    style={{
                      padding: "10px 30px 10px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      marginTop: "16px",
                      marginBottom: "30px",
                    }}
                    type="text"
                    // value={searchTerm}
                    // onChange={handleSearchInput}
                    // onKeyDown={(e) => handleKeyDown(e, "provinsi")}
                    placeholder="Cari Daerah"
                  /> */}
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
                      </select>
                      <select
                      name="tahap"
                      id="mySelect"
                        style={{
                          padding: "10px 30px 10px 10px",
                          fontSize: "16px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          backgroundColor: "#ffffff",                          
                          cursor: "pointer",                          
                          marginLeft: "10px"
                        }}
                        value={selectedSingleTahapan}
                        onChange={handleSelectChange}
                      >                        
                        {(()=>{
                          switch(customActiveTab){
                            case "1":
                            return (<>
                            <option value="40">KUA & PPAS</option>
                            <option value="5">RAPBD</option>
                            <option value="28">Penetapan APBD</option>
                            </>)                            
                            case "2":
                            return (<>
                              <option value="30">APBD Pergeseran</option>                              
                            </>)                            
                            case "3":
                            return (<>
                            <option value="41">KUPA & PPAS</option>
                            <option value="8">RAPBD Perubahan</option>
                            <option value="29">Penetapan APBD Perubahan</option>
                            </>)                            
                            default:
                            return (<>
                              <option value="32">APBD Pergeseran Setelah APBD Perubahan</option>
                            </>)
                          }
                        })()}
                      </select>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="table-responsive table-card">
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
                              5: item?.persen_daerah_rapbd,
                              40: item?.persen_daerah_kuappas,
                              30: item?.persen_daerah_apbdgeser,
                              41: item?.persen_daerah_kupa,
                              8: item?.persen_daerah_rapbdubah,
                              29: item?.persen_daerah_apbdubah,
                              28: item?.persen_daerah_apbd,
                              32: item?.persen_daerah_apbdgeserpasca,
                            };
                          return (
                            <tr key={index}>
                              <td>{item.kode_prov}</td>
                              <td>{item.nama_prov.replace("Provinsi ", "")}</td>
                              <td>
                                <div onClick={()=> (handleOpen({kodeDdn: item.kode_prov}), setCurrentPageSudahDanBelum(1))}
                                  className="progress"
                                  style={{ height: "20px", cursor: "pointer" }}
                                >
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${tahapData[selectedSingleTahapan]}%`,
                                      backgroundColor: tahapData[selectedSingleTahapan] === 100
                                      ? "#57E7B4" // Hijau jika 100%
                                      : (tahapData[selectedSingleTahapan] > 5 && tahapData[selectedSingleTahapan] < 100)
                                      ? "#FCAD24" // Kuning jika 1%-99%
                                      : "#EFF2F7", // Merah jika 0%,
                                      color: "black",
                                    }}
                                    aria-valuenow={tahapData[selectedSingleTahapan] !=0 ? tahapData[selectedSingleTahapan] : 100}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >                                    
                                    {tahapData[selectedSingleTahapan] > 30 && `${tahapData[selectedSingleTahapan].toLocaleString("id-ID", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}%`}
                                  </div>
                                  {tahapData[selectedSingleTahapan] <= 30 && (<div className="d-flex justify-content-center ms-1 align-items-center">{tahapData[selectedSingleTahapan].toLocaleString("id-ID", {
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

      <Modal
        size="xl"
        isOpen={modall}
        toggle={handleOpen}
        centered={true}
        backdrop="static"
      >
        <div className="modal-content border-0">
          <ModalHeader className=" p-3 bg-info-subtle" toggle={handleClose}>
            Tahapan {dataDetailNamaTahap}
          </ModalHeader>
          <ModalBody>
          <Row>
              <Col md={4}>
                <Card className="card-animate card-height-100">
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                        <span>{customActiveTab == "1" ? "Total Daerah Sudah" : "Total Daerah Melakukan"}</span>
                      </div>
                      <div className="d-flex">
                        {/* <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                          <i className=" ri-women-line text-danger"></i>
                        </span>
                      </div> */}
                        <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                          <span>
                            <CountUp
                              start={0}
                              end={
                                // dataDapodik?.dapodik_jumlah_anak_sekolah?.jumlah_siswa
                                totalDaerahSudah
                              }
                              separator="."                              
                              suffix=" Daerah"
                              duration={3}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="card-animate card-height-100">
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                        <span>{customActiveTab == "1" ? "Total Daerah Belum" : "Total Daerah Tidak Melakukan"}</span>
                      </div>
                      <div className="d-flex">
                        {/* <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                          <i className=" ri-women-line text-danger"></i>
                        </span>
                      </div> */}
                        <div className="d-flex justify-content-center align-items-center title-body">
                          <span>
                            <CountUp
                              start={0}
                              end={
                                // dataDapodik?.dapodik_jumlah_anak_sekolah?.jumlah_siswa
                                totalDaerahBelum
                              }
                              separator="."                   
                              suffix=" Daerah"
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
                     <div className="d-flex" style={{height:"450px", overflowX: "auto"}}>
  <table
    className="table table-bordered table-nowrap align-middle mb-0"
    style={{ width: "100%" }}
  >
    <thead
      className="table-light"
      style={{ position: "sticky", top: 0, zIndex: 2 }}
    >
      <tr>
        <th style={{ cursor: "pointer", textAlign: "center" }}>Kode</th>
        <th style={{ cursor: "pointer", textAlign: "center" }}>{customActiveTab == "1" ? "Sudah" : "Melakukan"}</th>
      </tr>
    </thead>
    <tbody style={{ minHeight: "500px" }}>
      {itemsSudah.map((item, index) => (
        <tr key={index}>
          <td style={{ height: "45px" }}>{item.kode_ddn}</td>
          <td style={{ height: "45px" }}>{item.nama_daerah}</td>
        </tr>
      ))}
    </tbody>
  </table>

  <table
    className="table table-bordered table-nowrap align-middle mb-0"
    style={{ width: "100%" }}
  >
    <thead
      className="table-light"
      style={{ position: "sticky", top: 0, zIndex: 2 }}
    >
      <tr>
        <th style={{ cursor: "pointer", textAlign: "center" }}>Kode</th>
        <th style={{ cursor: "pointer", textAlign: "center" }}>{customActiveTab == "1" ? "Belum" : "Tidak Melakukan"}</th>
      </tr>
    </thead>
    <tbody style={{ minHeight: "500px" }}>
      {itemsBelum.map((item, index) => (
        <tr key={index}>
          <td style={{ height: "45px" }}>{item.kode_ddn}</td>
          <td style={{ height: "45px" }}>{item.nama_daerah}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
            {/* <Pagination
              currentPage={currentPageSudahDanBelum}
              totalPages={totalPagesSudahDanBelum}
              onPageChange={paginateSudahDanBelum}
            /> */}
          </ModalBody>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default ContentPenganggaran;