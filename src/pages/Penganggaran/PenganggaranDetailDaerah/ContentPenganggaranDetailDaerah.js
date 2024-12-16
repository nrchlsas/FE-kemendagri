import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Col, Row,Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody } from 'reactstrap'
import classnames from "classnames";
import Pagination from "../../../Components/Pagination/Pagination";
import PolygonMaps from "../../../Components/MapIndo/PolygonMaps";
import VerticalBarChart from "../../../Components/Chart/VerticalBarChart";
import PieChartNew from '../../../Components/Chart/PieChart';
import '../../../Components/ProgressArrowBar/ProgressArrowBar.scss'
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import logoKemendagri from "../../../assets/images/logo-kemendagri/logo-kemendagri-home.png"
import CountUp from 'react-countup';
import "./../../Kependudukan/kependudukan.scss";
import { Buffer } from "buffer";
const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;
const API_URI_RBAC_DATA = `${process.env.REACT_APP_API_URL_9007}`;

const ContentPenganggaranDetailDaerah = () => {
    const { _id } = useParams();
    const location = useLocation();
  
    const queryParams = new URLSearchParams(location.search);
    const namaDaerah = queryParams.get("namaDaerah");
    const namaProv = queryParams.get("namaProv");
    const idProv = queryParams.get('idProv')
    const tahapan = queryParams.get('tahapan');
    const subTahapan = queryParams.get('subTahapan')
  
    const [customActiveTab, setcustomActiveTab] = useState(tahapan);
    const toggleCustom = (tab) => {
      if (customActiveTab !== tab) {
        setcustomActiveTab(tab);
      }
    };
    const [selectedSingleTahun, setSelectedSingleTahun] = useState('2024'); // Set default value
    const [selectedSingleTahapan, setSelectedSingleTahapan] = useState(subTahapan); // Set default value        
    const [dataPenganggaranPersentase, setDataPenganggaranPersentase] = useState(
      []
    );
    const [loadingPenganggaran, setLoadingPenganggaran] = useState([]);
    const [errorPenganggaran, setErrorPenganggaran] = useState([]);
  
    const [logoImage, setLogoImage] = useState(null)
    const [dataProfilDaerah, setDataProfilDaerah] = useState([])
    const getDataLogoDaerah = ({
      kodeDdn=_id
    } = {}) => {
      const fetchData = async () => {
        try {
          const token = JSON.parse(sessionStorage.getItem("authUser"))
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
            body: JSON.stringify({
              kode_ddn: kodeDdn
            }),
          };
          const response = await fetch(
            `${API_URI_RBAC_DATA}/rbac/list-logo`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataGetLogoDaerah = await response.json();

          setDataProfilDaerah(dataGetLogoDaerah.data[0])
  
                // Ambil buffer data logo
          const logoBuffer = dataGetLogoDaerah.data[0].logo.data;

          // Konversi buffer ke Base64
          const base64Image = `data:image/png;base64,${Buffer.from(logoBuffer).toString('base64')}`;

          setLogoImage(base64Image)
        } catch (errorPenganggaran) {
          setErrorPenganggaran(errorPenganggaran);
        } finally {
          setLoadingPenganggaran(false);
        }
      };
      fetchData();
    };

    const getDataPenganggaranNasional = ({
      // tahun = "2024",
      // tahapan = "1",
      kodeDdn=_id
    } = {}) => {
      const fetchData = async () => {
        try {
          const token = JSON.parse(sessionStorage.getItem("authUser"))
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
            body: JSON.stringify({
              // id_tahap: tahapan,
              // tahun: tahun,
              kode_ddn: kodeDdn
            }),
          };
          const response = await fetch(
            `${API_URI_RBAC}/v2/dashboard_Penganggaran_2_komposisi`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataPenganggaranNasional = await response.json();
  
          const dataResultChartTahapan = [dataPenganggaranNasional.data.eksekutif, dataPenganggaranNasional.data.legislatif, dataPenganggaranNasional.data.masyarakat]
  
          setDataPenganggaran(dataResultChartTahapan);
        } catch (errorPenganggaran) {
          setErrorPenganggaran(errorPenganggaran);
        } finally {
          setLoadingPenganggaran(false);
        }
      };
      fetchData();
    };

    const [totalPagu, setTotalPagu] = useState(0)
    const getDataPenganggaranNasionalPersentase = ({
      tahun = "2024",      
      tahapan = subTahapan,
      kodeDdn = _id
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
            `${API_URI_RBAC}/v2/dashboard_Penganggaran_level_3`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataPenganggaranNasionalPersentase = await response.json();

          const sumPaguValidasi = dataPenganggaranNasionalPersentase.data.penganggaran_level_3.reduce((sum, item) => {
            const tahapData = {
              5: item?.total_rincian_rapbd,
              40: item?.total_rincian_kuappas,
              30: item?.total_rincian_apbdgeser,
              41: item?.total_rincian_kupa,
              8: item?.total_rincian_rapbdubah,
              29: item?.total_rincian_apbdubah,
              28: item?.total_rincian_apbd,
              32: item?.total_rincian_apbdgeserpasca,
            };
            const paguValidasi = Number(tahapData[selectedSingleTahapan]) || 0; // Pastikan pagu_validasi adalah angka
            return sum + paguValidasi;
          }, 0);

          setTotalPagu(sumPaguValidasi)
  
          setDataPenganggaranPersentase(
            dataPenganggaranNasionalPersentase.data.penganggaran_level_3
          );
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
      getDataLogoDaerah()
    }, []);

    const [dataDetailUnitSkpd, setDataDetailUnitSkpd] = useState([]);    
    const [loadingDetailUnitSkpd, setLoadingDetailUnitSkpd] = useState([]);
    const [errorDetailUnitSkpd, setErrorDetailUnitSkpd] = useState([]);    
  
    const getDataDetailUnitSkpd = ({
      tahun= "2024",
      kodeDdn=_id,
      kodeUnitSkpd="",
      idTahap=""
    }      
    ) => {
      const fetchData = async () => {
        setLoadingDetailUnitSkpd(true); // Set loading state to true when starting the fetch
        try {
          const token = JSON.parse(sessionStorage.getItem("authUser"))
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
            body: JSON.stringify({
              kode_ddn: kodeDdn,
              kode_unit_skpd: kodeUnitSkpd,
              id_tahap: idTahap,
              tahun : tahun,
            }),
          };
  
          const response = await fetch(
            `${API_URI_RBAC}/v2/dashboard_penganggaran_level_3_subgiat`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataDetailUnitSkpd = await response.json();
  
          setDataDetailUnitSkpd(dataDetailUnitSkpd.data.penganggaran_level_3_subgiat)    

          setModall(true);            
          setCurrentPageDetail(1);        
          // Open the modal only after data is successfully fetched
        } catch (errorDetailUnitSkpd) {
          setErrorDetailUnitSkpd(errorDetailUnitSkpd);
        } finally {
          setLoadingDetailUnitSkpd(false);
        }
      };
  
      fetchData();
    };

    const [dataDetailUnitSkpdSro, setDataDetailUnitSkpdSro] = useState([]);    
    const [loadingDetailUnitSkpdSro, setLoadingDetailUnitSkpdSro] = useState([]);
    const [errorDetailUnitSkpdSro, setErrorDetailUnitSkpdSro] = useState([]);    
  
    const getDataDetailUnitSkpdSro = ({
      tahun= "2024",
      kodeDdn=_id,
      idTahap=selectedSingleTahapan,
      kodeSubGiat="",
      kodeUnitSkpd=""
    }      
    ) => {
      const fetchData = async () => {
        // setLoadingDetailUnitSkpdSro(true); // Set loading state to true when starting the fetch
        try {
          const token = JSON.parse(sessionStorage.getItem("authUser"))
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
            body: JSON.stringify({
              kode_ddn: kodeDdn,
              kode_sub_giat: kodeSubGiat,
              tahun : tahun,
              id_tahap: idTahap,
              kode_unit_skpd: kodeUnitSkpd
            }),
          };
  
          const response = await fetch(
            `${API_URI_RBAC}/v2/dashboard_penganggaran_level_3_sro`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataDetailUnitSkpdSro = await response.json();
  
          setDataDetailUnitSkpdSro(dataDetailUnitSkpdSro.data.penganggaran_level_3_sro)

          setModall(true);            
          setCurrentPageDetail(1);     
          // Open the modal only after data is successfully fetched
        } catch (errorDetailUnitSkpdSro) {
          setErrorDetailUnitSkpdSro(errorDetailUnitSkpdSro);
        } finally {
          setLoadingDetailUnitSkpdSro(false);
        }
      };
  
      fetchData();
    };
  
    const [modall, setModall] = useState(false);
    const [dataRincianDetail, setDataRincianDetail] = useState(0);
    const [dataDetailNamaUnitSkpd, setDataDetailNamaUnitSkpd] = useState("");

    const handleOpen = ({
      kodeDdn = "",
      kodeUnitSkpd = "",
      tahun = "",
      namaUnitSkpd="",
      paguValidasi=0
    }
    ) => {
      getDataDetailUnitSkpd({idTahap: selectedSingleTahapan, kodeDdn: kodeDdn, kodeUnitSkpd:kodeUnitSkpd, tahun:tahun})
      setDataDetailNamaUnitSkpd(namaUnitSkpd);    
      setDataRincianDetail(paguValidasi) 
      setCardHead(null);
    };
  
    const [cardhead, setCardHead] = useState();    
  
    const handleClose = () => {
      setModall(false); // Close modal by setting modall to false
    };
    
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageDetail, setCurrentPageDetail] = useState(1);
    const [currentPageDetailSub, setCurrentPageDetailSub] = useState(1);
    const [itemsPerPage] = useState(10); // Set items per page
    const [itemsPerPageDetail] = useState(10);
    const [itemsPerPageDetailSub] = useState(10); // Set items per page
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

    const indexOfLastItemDetail = currentPageDetail * itemsPerPageDetail;
    const indexOfFirstItemDetail = indexOfLastItemDetail - itemsPerPageDetail;

    const indexOfLastItemDetailSub = currentPageDetailSub * itemsPerPageDetailSub;
    const indexOfFirstItemDetailSub = indexOfLastItemDetailSub - itemsPerPageDetailSub;
    
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

    const sortedItemsDetail = React.useMemo(() => {
      let sortableItems = [...(dataDetailUnitSkpd || [])];
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
    }, [dataDetailUnitSkpd, sortConfigDetail]);

    const sortedItemsDetailSub = React.useMemo(() => {
      let sortableItems = [...(dataDetailUnitSkpdSro || [])];
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
    }, [dataDetailUnitSkpdSro, sortConfig]);
    
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const currentItemsDetail = sortedItemsDetail.slice(
      indexOfFirstItemDetail,
      indexOfLastItemDetail
    );
    const currentItemsDetailSub = sortedItemsDetailSub.slice(
      indexOfFirstItemDetailSub,
      indexOfLastItemDetailSub
    );    
    
    const totalPages = Math.ceil(
      (dataPenganggaranPersentase?.length || 0) / itemsPerPage
    );
    const totalPagesDetail = Math.ceil(
      (dataDetailUnitSkpd?.length || 0) / itemsPerPage
    );
    const totalPagesDetailSub = Math.ceil(
      (dataDetailUnitSkpdSro?.length || 0) / itemsPerPage
    );
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const paginateDetail = (pageNumber) => setCurrentPageDetail(pageNumber);
    const paginateDetailSub = (pageNumber) => setCurrentPageDetailSub(pageNumber);
  
    const [dataShowSumberUsulan, setDataShowSumberUsulan] = useState(false);
    const handleShowDataSumberUsulan = (value) => {
      setDataShowSumberUsulan(value);
    };

    const [namaTahapan, setNamaTahapan] = useState("Persiapan")  
    const handleSelectChange = (e) => {
      const { name, value } = e.target;
      
      if (name === 'tahun') {
          setSelectedSingleTahun(value); // Misalnya, untuk dropdown tahun
      } else if (name === 'tahap') {
          setSelectedSingleTahapan(value); // Misalnya, untuk dropdown jenis dokumen
      }
    };
      
    const requestSort = (key) => {
      let direction = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
      if (sortConfig.key === key) {
        return sortConfig.direction === "ascending" ? "▲" : "▼";
      }
      return "↕"; // Default icon for unsorted
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

    const [modal, setModal] = useState(false);
    const [dataRincianDetailAnggaranSub, setDataRincianDetailAnggaranSub] = useState(0);
    const [dataRincianDetailRealisasiSub, setDataRincianDetailRealisasiSub] = useState(0);
    const [dataDetailNamaSubRincinianObjek, setDataDetailNamaSubRincinianObjek] = useState("");

    const handleOpenNextModal = ({
      kodeSubGiat = "",
      namaSubGiat = "",
      anggaran = "",      
      kodeUnitSkpd=""
    }
    ) => {
      getDataDetailUnitSkpdSro( {kodeUnitSkpd: kodeUnitSkpd, kodeSubGiat : kodeSubGiat, idTahap: selectedSingleTahapan} )
      setModal(true);
      setDataDetailNamaSubRincinianObjek(namaSubGiat)
      setDataRincianDetailAnggaranSub(anggaran);      
      setCardHead(null);
    };
    const handleCloseNextModal = () => {
      setModal(false);
    };
      
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
          <Col>
          <div className="d-sm-flex align-items-center justify-content-between">            
              <div className="page-title-right">
                  <ol className="breadcrumb mb-2 ms-2" style={{fontWeight:600}}>
                      <li className="breadcrumb-item"><Link to="/penganggaran">Penganggaran</Link></li>
                      <li className="breadcrumb-item"><Link to={`/penganggaran/Penganggaran-detail/${idProv}?namaDaerah=${namaProv}&tahapan=${customActiveTab}&subTahapan=${subTahapan}`}>Detail Se-{namaProv}</Link></li>
                      <li className="breadcrumb-item active">Detail SKPD {namaDaerah}</li>
                  </ol>
              </div>
          </div>
          </Col>
        </Row>           
        <Row>
          <Col md={12}> 
            <Card>
              <CardBody>
                <Row>
                  <Col xs={12} md={12} xl={4}>
                    <img src={logoImage} alt="" width="200" height="210" />
                  </Col>
                  <Col xs={12} md={12} xl={8}>
                  <div className='ms-3'>
                  <div className='d-flex justify-content-start align-items-start mb-2' style={{fontSize: "30px", fontWeight:600}}>
                      {namaDaerah}
                    </div>
                    {/* <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px" }}>Daerah</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        Data Belum Tersedia
                      </div>
                    </div> */}
                    <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Kepala Daerah</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        {dataProfilDaerah?.kepala_daerah}
                      </div>
                    </div>
                    <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Wakil Kepala Daerah</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        {dataProfilDaerah?.wakil_kepala_daerah}
                      </div>
                    </div>
                    {/* <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Sekretaris Daerah</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        {dataProfilDaerah?.kepala_daerah}
                      </div>
                    </div>
                    <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Jumlah SKPD & Unit SKPD</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        {dataProfilDaerah?.kepala_daerah}
                      </div>
                    </div> */}
                    <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Total Pagu</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                      {`Rp ${totalPagu?.toLocaleString("id-ID")}`}
                      </div>
                    </div>
                  </div>                    
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>         
        </Row>
        <Row>
        <Col md={12}>
          <Card className="card-height-100">
              <CardBody>
                <div className="separator">
                  <h4 className="card-title mb-1">
                    List Progress Penganggaran 
                  </h4>                  
                </div>                
                <Row>
                  <Col>                
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
                    <div className="table-responsive table-card" style={{ overflowX: "auto" }}>                    
                      <table className="table table-nowrap mb-2 " style={{width:"100%"}} >
                        <thead className="table-light">
                          <tr>
                      
                            <th
                              onClick={() => requestSort("kode_skpd")}
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                                cursor: "pointer",
                                whiteSpace: "normal",
                                overflowWrap: "break-word",
                              }}                              
                              scope="col"
                            >
                              KODE SKPD {getSortIcon("kode_skpd")}
                            </th>
                            <th
                              onClick={() => requestSort("nama_skpd")}
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                                cursor: "pointer",
                                whiteSpace: "normal",
                                overflowWrap: "break-word",
                              }}
                              scope="col"
                            >
                              NAMA SKPD {getSortIcon("nama_skpd")}
                            </th>
                            <th
                            onClick={() => requestSort("kode_unit_skpd")}
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                                cursor: "pointer",
                                whiteSpace: "normal",
                                overflowWrap: "break-word",                                
                              }}
                              scope="col"
                            >
                              KODE UNIT SKPD {getSortIcon("kode_sub_giat")}
                            </th>
                            <th
                            onClick={() => requestSort("nama_unit_skpd")}
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                                cursor: "pointer",
                                whiteSpace: "normal",
                                overflowWrap: "break-word",                                
                              }}
                              scope="col"
                            >
                              NAMA UNIT SKPD {getSortIcon("nama_unit_skpd")}
                            </th>
                            <th
                            onClick={() => requestSort("pagu_validasi")}
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                                cursor: "pointer",
                                whiteSpace: "normal",
                                overflowWrap: "break-word",
                              }}
                              scope="col"
                            >
                              ANGGARAN (Rp) {getSortIcon("pagu_validasi")}
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
                              5: item?.total_rincian_rapbd,
                              40: item?.total_rincian_kuappas,
                              30: item?.total_rincian_apbdgeser,
                              41: item?.total_rincian_kupa,
                              8: item?.total_rincian_rapbdubah,
                              29: item?.total_rincian_apbdubah,
                              28: item?.total_rincian_apbd,
                              32: item?.total_rincian_apbdgeserpasca,
                            };
                            return (
                              <tr key={index}>
                                  {/* style={{ verticalAlign: "middle", textAlign: "center" }} */}
                                <td >{item.kode_skpd}</td>
                                <td style={{
                                  whiteSpace: "normal",
                                  wordWrap: "break-word",
                                  maxWidth: "200px",
                                }}>
                                  {item.nama_skpd}
                                </td>
                                <td>                               
                                    {item.kode_unit_skpd}
                                </td>
                                <td style={{
                                  whiteSpace: "normal", 
                                  wordWrap: "break-word", 
                                  maxWidth: "200px", 
                                }}>
                                  {item.nama_unit_skpd}
                                </td>
                                <td>
                                  <span style={{ float: "right" }}>
                                  {tahapData[selectedSingleTahapan]
                                    ? parseInt(tahapData[selectedSingleTahapan]).toLocaleString(
                                        "id-ID"
                                      )
                                    : "-"}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    whiteSpace: "normal",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  <i
                                  onClick={()=> handleOpen({idTahap: selectedSingleTahapan, tahun:item.tahun, kodeUnitSkpd: item.kode_unit_skpd, kodeDdn: item.kode_ddn, namaUnitSkpd:item.nama_unit_skpd, paguValidasi: tahapData[selectedSingleTahapan]})}
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
            Detail Unit SKPD {dataDetailNamaUnitSkpd} {" "}            
          </ModalHeader>
          <ModalBody>
            {/* <div>
              Total Anggaran: {dataRincianDetail}
            </div> */}
            <Row>
              <Col md={4}>
                <Card className="card-animate card-height-100">
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                        <span>Total Anggaran</span>
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
                                dataRincianDetail
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

            {/* <div style={{ overflowY: "scroll", maxHeight: "500px" }}> */}
              <table
                className="table table-bordered table-nowrap align-middle mb-0"
                style={{ width: "100%" }}
              >
                <thead
                  className="table-light"
                  style={{ position: "sticky", top: 0, zIndex: 2 }}
                >
                  <tr>                  
                    <th
                      onClick={() => requestSortDetail("kode_sub_giat")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Kode Sub Giat {getSortIconDetail("kode_sub_giat")}
                    </th>
                    <th
                      onClick={() => requestSortDetail("nama_sub_giat")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Nama Sub Giat {getSortIconDetail("nama_sub_giat")}
                    </th>
                    {/* <th onClick={() => requestSortDetail("")}
                        style={{ cursor: "pointer", textAlign: "center" }}>
                        Rincian Sub Giat
                      </th>                       */}
                    <th
                      onClick={() => requestSortDetail("pagu_validasi")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Anggaran
                      {getSortIconDetail("pagu_validasi")}
                    </th>              
                    <th
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Action
                    </th>                                            
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemsDetail.map((item, index) => {
                    const tahapData = {
                      5: item?.total_rincian_rapbd,
                      40: item?.total_rincian_kuappas,
                      30: item?.total_rincian_apbdgeser,
                      41: item?.total_rincian_kupa,
                      8: item?.total_rincian_rapbdubah,
                      29: item?.total_rincian_apbdubah,
                      28: item?.total_rincian_apbd,
                      32: item?.total_rincian_apbdgeserpasca,
                    };
                    return (<tr key={index}>
                      {/* <td>{item.kode_prop}</td> */}
                      <td>
                        {item.kode_sub_giat}
                      </td>                      
                      <td style={{
                          whiteSpace: "normal", // Membolehkan teks turun ke baris berikutnya
                          wordWrap: "break-word", // Memastikan teks panjang terpotong dan turun ke bawah
                          maxWidth: "200px", // Menetapkan lebar maksimum sel (sesuaikan dengan kebutuhan)
                        }}>
                        {item.nama_sub_giat}
                      </td>                      
                      <td>
                         <span style={{ float: "right" }}>
                          {tahapData[selectedSingleTahapan]
                            ? parseInt(tahapData[selectedSingleTahapan]).toLocaleString(
                                "id-ID"
                              )
                            : "-"}
                        </span>                        
                      </td>       
                      <td style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                      }}>
                      <i
                      onClick={()=> handleOpenNextModal({ kodeSubGiat: item.kode_sub_giat, kodeUnitSkpd:item.kode_unit_skpd, namaSubGiat:item.nama_sub_giat, realisasi: item.realisasi, anggaran: tahapData[selectedSingleTahapan] })}
                        style={{
                          padding: "5px 10px",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                        className="bx bx-list-ul text-primary"
                      >                        
                      </i>
                      </td>               
                    </tr>)                    
                  })}                  
                </tbody>
              </table>
            {/* </div> */}
            <Pagination
              currentPage={currentPageDetail}
              totalPages={totalPagesDetail}
              onPageChange={paginateDetail}
            />
          </ModalBody>
        </div>
      </Modal>

      <Modal
        size="xl"
        isOpen={modal}
        toggle={handleOpenNextModal}
        centered={true}
        backdrop="static"
      >
        <div className="modal-content border-0">
          <ModalHeader
            className=" p-3 bg-info-subtle"
            toggle={handleCloseNextModal}
          >
            Sub Kegiatan {dataDetailNamaSubRincinianObjek}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md={4}>
                <Card className="card-animate card-height-100">
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                        <span>Total Anggaran Sub Kegiatan</span>
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
                                dataRincianDetailAnggaranSub
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

            <div style={{ overflowY: "scroll", maxHeight: "500px" }}>
              <table
                className="table table-bordered table-nowrap align-middle mb-0"
                style={{ width: "100%" }}
              >
                <thead className="table-light">
                  <tr>
                    <th
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      NO
                    </th>
                    <th
                      onClick={() => requestSort("nama_daerah")}
                      style={{ cursor: "pointer", verticalAlign: "middle" }}
                    >
                      Kode Sub Rincian Objek {getSortIcon("nama_daerah")}
                    </th>
                    <th
                      onClick={() => requestSort("nama_sro")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Nama Sub Rincian Objek {getSortIcon("nama_sro")}
                    </th>
                    <th
                      onClick={() => requestSort("total_rinciansro")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Anggaran (Rp) {getSortIcon("total_rinciansro")}
                    </th>                                        
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemsDetailSub.map((item, index) => {
                    const tahapData = {
                      5: item?.total_rincian_rapbd,
                      40: item?.total_rincian_kuappas,
                      30: item?.total_rincian_apbdgeser,
                      41: item?.total_rincian_kupa,
                      8: item?.total_rincian_rapbdubah,
                      29: item?.total_rincian_apbdubah,
                      28: item?.total_rincian_apbd,
                      32: item?.total_rincian_apbdgeserpasca,
                    };
                    return (
                      <tr key={index}>
                      {/* <td>{item.kode_prop}</td> */}
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        {index + 1}
                      </td>
                      <td>{item.kode_sro}</td>
                      <td
                        style={{
                          whiteSpace: "normal", // Membolehkan teks turun ke baris berikutnya
                          wordWrap: "break-word", // Memastikan teks panjang terpotong dan turun ke bawah
                          maxWidth: "200px", // Menetapkan lebar maksimum sel (sesuaikan dengan kebutuhan)
                        }}
                      >
                        {" "}
                        {item.nama_sro || "-"}
                      </td>
                      {/* <td>
                         Rp {item.rincian_sub_giat ? parseInt(item.rincian_sub_giat).toLocaleString("id-ID")
                            : "-"}
                        </td> */}
                      <td>
                      <span style={{ float: "right" }}>
                        {tahapData[selectedSingleTahapan]
                          ? parseInt(tahapData[selectedSingleTahapan]).toLocaleString(
                              "id-ID"
                            )
                          : "-"}
                      </span>
                    </td>                                          
                    </tr>
                    )                    
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPageDetailSub}
              totalPages={totalPagesDetailSub}
              onPageChange={paginateDetailSub}
            />
          </ModalBody>
        </div>
      </Modal>
      </React.Fragment>
    )
}

export default ContentPenganggaranDetailDaerah