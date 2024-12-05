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
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007_V2}`;

const ContentPerencanaan = () => {
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
      const selectedData = dataPersentaseMap[`tahap${tab}`]; // Ambil data sesuai pilihan
      setValueMap(selectedData);
      const maxValue = Math.max(...selectedData.map(item => item.value));
      setmaxValueMap(maxValue);
    }
  };
  const [selectedSingleTahun, setSelectedSingleTahun] = useState('2024'); // Set default value
  const [selectedSingleTahapan, setSelectedSingleTahapan] = useState('1'); // Set default value

  const [dataPerencanaan, setDataPerencanaan] = useState([]);
  const [dataPerencanaanPersentase, setDataPerencanaanPersentase] = useState(
    []
  );
  const [loadingPerencanaan, setLoadingPerencanaan] = useState([]);
  const [errorPerencanaan, setErrorPerencanaan] = useState([]);

  const getDataPerencanaanRkpdNasional = ({
    tahun = "2024",
    tahapan = "1",
  } = {}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            id_tahap: tahapan,
            tahun: tahun,
          }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/dashboard_perencanaan_1_rkpd_nasional`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPerencanaanRkpdNasional = await response.json();

        const dataResultChartTahapan =
          dataPerencanaanRkpdNasional.data.dashboard_perencanaan_1_rkpd_nasional.list.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.tahapan);
              return acc;
            },
            [[], []]
          );        

        setDataPerencanaan(dataResultChartTahapan);
      } catch (errorPerencanaan) {
        setErrorPerencanaan(errorPerencanaan);
      } finally {
        setLoadingPerencanaan(false);
      }
    };
    fetchData();
  };

  const handleSelectChangeMap = () => {      
    // Ambil data desil yang sesuai dan update valueMap
    console.log(dataPersentaseMap, 'ini persentase map')
    console.log(selectedData, `tahap${customActiveTab}`)
    if (selectedData) {
      const selectedData = dataPersentaseMap[`tahap${customActiveTab}`]; // Ambil data sesuai pilihan
      setValueMap(selectedData);
      const maxValue = Math.max(...selectedData.map(item => item.value));
      setmaxValueMap(maxValue);
    }
  };

  const getDataPerencanaanRkpdNasionalPersentase = ({
    tahun = "2024",
    tahapan = "1",    
  } = {}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            id_tahap: tahapan,
            tahun: tahun,
          }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/dashboard_perencanaan_1_list_persentase`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPerencanaanRkpdNasionalPersentase = await response.json();

        setDataPerencanaanPersentase(
          dataPerencanaanRkpdNasionalPersentase.data
        );

        const dataPersentasePerencanaan = {
          tahap1: dataPerencanaanRkpdNasionalPersentase.data.map(item => ({
          name: item.nama_daerah,
          value: item.persiapan
        })),
          tahap2: dataPerencanaanRkpdNasionalPersentase.data.map(item => ({
          name:item.nama_daerah,
          value: item.rancangan_awal
        })),
          tahap3: dataPerencanaanRkpdNasionalPersentase.data.map(item => ({
          name:item.nama_daerah,
          value: item.rancangan
        })),
          tahap4: dataPerencanaanRkpdNasionalPersentase.data.map(item => ({
          name:item.nama_daerah,
          value: item.musrenbang
        })),
          tahap5: dataPerencanaanRkpdNasionalPersentase.data.map(item => ({
          name:item.nama_daerah,
          value: item.rancangan_akhir
        })),
          tahap6: dataPerencanaanRkpdNasionalPersentase.data.map(item => ({
          name:item.nama_daerah,
          value: item.penetapan
        })),
      }
      setDataPersentaseMap(dataPersentasePerencanaan)
      setValueMap(dataPersentasePerencanaan.tahap6);
      const maxValue = Math.max(...dataPersentasePerencanaan.tahap6.map(item => item.value));
      setmaxValueMap(maxValue);
      
      } catch (errorPerencanaan) {
        setErrorPerencanaan(errorPerencanaan);
      } finally {
        setLoadingPerencanaan(false);
      }
    };
    fetchData();
  };
  const [dataPerencanaanSudahDanBelum, setDataPerencanaanSudahDanBelum] = useState(
    []
  );
  const getDataPerencanaanNasionalProgress = ({
    tahun = "2024",
    tahapan = selectedSingleTahapan,
    kodeDdn
  } = {}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            id_tahap: tahapan,
            tahun: tahun,
            kode_ddn: kodeDdn
          }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/dashboard_perencanaan_2_list_persentase`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPerencanaanNasionalPersentase = await response.json();

        setDataPerencanaanSudahDanBelum(
          dataPerencanaanNasionalPersentase.data
        )

        setModall(true);  
      } catch (errorPerencanaan) {
        setErrorPerencanaan(errorPerencanaan);
      } finally {
        setLoadingPerencanaan(false);
      }
    };
    fetchData();
  };

    // Memanggil fungsi API setiap kali dropdown berubah
    useEffect(() => {
    getDataPerencanaanRkpdNasionalPersentase({
        tahun: selectedSingleTahun,
        tahapan: selectedSingleTahapan,
    });
    }, [selectedSingleTahun, selectedSingleTahapan]); // Panggil API jika tahun atau dokumen berubah


    useEffect(() => {
        getDataPerencanaanRkpdNasional();
        getDataPerencanaanRkpdNasionalPersentase();
    }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page
  const [currentPageSudahDanBelum, setCurrentPageSudahDanBelum] = useState(1);
  const [itemsPerPageSudahDanBelum] = useState(10); // Set items per page
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [sortConfigDetail, setSortConfigDetail] = useState({      
    key: null,
    direction: "ascending",
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const indexOfLastItemSudahDanBelum = currentPageSudahDanBelum * itemsPerPageSudahDanBelum;
  const indexOfFirstItemSudahDanBelum = indexOfLastItemSudahDanBelum - itemsPerPageSudahDanBelum;

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...(dataPerencanaanPersentase || [])];
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
  }, [dataPerencanaanPersentase, sortConfig]);

  const sortedItemsSudahDanBelum = React.useMemo(() => {
    let sortableItems = [...(dataPerencanaanSudahDanBelum || [])];
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
  }, [dataPerencanaanSudahDanBelum, sortConfigDetail]);

  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemsSudahDanBelum = sortedItemsSudahDanBelum
  const totalPages = Math.ceil(
    (dataPerencanaanPersentase?.length || 0) / itemsPerPage
  );
  const totalPagesSudahDanBelum = Math.ceil(
    (dataPerencanaanSudahDanBelum?.length || 0) / itemsPerPage
  );


  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateSudahDanBelum = (pageNumber) => setCurrentPageSudahDanBelum(pageNumber);

  const [dataShowSumberUsulan, setDataShowSumberUsulan] = useState(false);
  const handleShowDataSumberUsulan = (value) => {
    setDataShowSumberUsulan(value);
  };

  const [namaTahapan, setNamaTahapan] = useState("Penetapan")  

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`, 'ini isi selected value');
    if (value == "3"){
      setcustomActiveTab("3")
    }else{
      setcustomActiveTab("6")
    }
    if (name === 'tahun') {
        setSelectedSingleTahun(value); // Misalnya, untuk dropdown tahun
    } else if (name === 'tahap') {
        setSelectedSingleTahapan(value);        
    }

  };
  
  const navigate = useNavigate();
  const goToDetail = (_id, namaDaerah) => {
    const encodedNamaDaerah = encodeURIComponent(namaDaerah);
    navigate(`/perencanaan/perencanaan-detail/${_id}?namaDaerah=${encodedNamaDaerah}&tahapan=${selectedSingleTahapan}&tahun=${selectedSingleTahun}`);
  };

  const [modall, setModall] = useState(false);
  const [dataDetailNamaTahap, setDataDetailNamaTahap] = useState("");
  const [dataDetailIdTahap, setDataDetailIdTahap] = useState(28);
  const [dataRincianDetail, setDataRincianDetail] = useState(0);
  const [dataDetailNamaUnitSkpd, setDataDetailNamaUnitSkpd] = useState("");
  const [cardhead, setCardHead] = useState();

  const handleOpen = ({kodeDdn}) => {   
    getDataPerencanaanNasionalProgress({kodeDdn: kodeDdn})   
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
      1: item?.persiapan,
      2: item?.rancangan_awal,
      3: item?.rancangan,
      4: item?.musrenbang,
      5: item?.rancangan_akhir,
      6: item?.penetapan,
    };
    return tahapData[customActiveTab] == "SUDAH";
  });
  
  const itemsBelum = currentItemsSudahDanBelum.filter((item) => {
    const tahapData = {
      1: item?.persiapan,
      2: item?.rancangan_awal,
      3: item?.rancangan,
      4: item?.musrenbang,
      5: item?.rancangan_akhir,
      6: item?.penetapan,
    };
    return tahapData[customActiveTab] == "BELUM";
  });

  const totalDaerahSudah = itemsSudah.length
  const totalDaerahBelum = itemsBelum.length
  
  // Sesuaikan panjang array dengan menambahkan baris kosong ke array yang lebih pendek
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
                  <span>Perencanaan (RKPD)</span>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <div className="nav-beranda d-flex justify-content-center align-items-center">
                  <Nav tabs className="nav nav-tabs nav-success nav-justified">
                    {selectedSingleTahapan == "1" ? (<><NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleCustom("1");
                          setNamaTahapan("Persiapan")                         
                        }}
                      >
                        Persiapan
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
                          setNamaTahapan("Rancangan Awal")                          
                        }}
                      >
                        Ranwal
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
                          setNamaTahapan("Rancangan")                          
                        }}
                      >
                        Rancangan
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
                          setNamaTahapan("Musrenbang")                          
                        }}
                      >
                        Musrenbang
                      </NavLink>
                    </NavItem>                    
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "5",
                        })}
                        onClick={() => {
                          toggleCustom("5");
                          setNamaTahapan("Rancangan Akhir")                          
                        }}
                      >
                        Rankhir
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "6",
                        })}
                        onClick={() => {
                          toggleCustom("6");
                          setNamaTahapan("Penetapan")                          
                        }}
                      >
                        Penetapan
                      </NavLink>
                    </NavItem></>):(<>                     
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "3",
                        })}
                        onClick={() => {
                          toggleCustom("3");
                          setNamaTahapan("Rancangan")
                        }}
                      >
                        Rancangan
                      </NavLink>
                    </NavItem>                                    
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "5",
                        })}
                        onClick={() => {
                          toggleCustom("5");
                          setNamaTahapan("Rancangan Akhir")         
                        }}
                      >
                        Rankhir
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "6",
                        })}
                        onClick={() => {
                          toggleCustom("6");
                          setNamaTahapan("Penetapan")                    
                        }}
                      >
                        Penetapan
                      </NavLink>
                    </NavItem>
                    </>)}
                    
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
                    <h4 className="card-title mb-0">Perencanaan Nasional</h4>
                    <h4 className="card-title mb-0">Republik Indonesia</h4>
                  </div>
                  <VerticalBarChart
                    valueChart={dataPerencanaan[0]}
                    categoryChart={dataPerencanaan[1]}
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
                    <h4 className="card-title mb-0">Perencanaan Nasional</h4>
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
                  List Progress Perencanaan 
                </h4>
                <h4 className="card-title">
                    {namaTahapan}
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
                        <option value="2025">2025</option>
                      </select>
                      <select
                      name="tahap"
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
                        <option value="1">RKPD</option>
                        <option value="3">RKPD Perubahan</option>
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
                            1: item.persiapan,
                            2: item.rancangan_awal,
                            3: item.rancangan,
                            4: item.musrenbang,
                            5: item.rancangan_akhir,
                            6: item.penetapan,
                          };

                          return (
                            <tr key={index}>
                              <td>{item.kode_ddn}</td>
                              <td>{item.nama_daerah.replace("Provinsi ", "")}</td>
                              <td>
                                <div onClick={()=> (handleOpen({kodeDdn: item.kode_ddn}), setCurrentPageSudahDanBelum(1))}
                                  className="progress"
                                  style={{ height: "20px", cursor: "pointer" }}
                                >
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${tahapData[customActiveTab]}%`,
                                      backgroundColor: tahapData[customActiveTab] === 100
                                      ? "#57E7B4" // Hijau jika 100%
                                      : (tahapData[customActiveTab] > 5 && tahapData[customActiveTab] < 100)
                                      ? "#FCAD24" // Kuning jika 1%-99%
                                      : "#F35F52", // Merah jika 0%,
                                      color: "black",
                                    }}
                                    aria-valuenow={tahapData[customActiveTab]}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >
                                    {tahapData[customActiveTab] > 30 &&
                                      `${tahapData[
                                        customActiveTab
                                      ].toLocaleString("id-ID", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}%`}
                                  </div>
                                  {tahapData[customActiveTab] <= 30 && (
                                    <div className="d-flex justify-content-center ms-1 align-items-center">
                                      {tahapData[
                                        customActiveTab
                                      ].toLocaleString("id-ID", {
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
                                <i onClick={()=> goToDetail(item.kode_ddn, item.nama_daerah)}
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
                        <span>Total Daerah Sudah</span>
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
                        <span>Total Daerah Belum</span>
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

export default ContentPerencanaan;
