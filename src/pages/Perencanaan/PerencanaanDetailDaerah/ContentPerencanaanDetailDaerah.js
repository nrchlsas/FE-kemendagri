import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Col, Row,Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody } from 'reactstrap'
import Pagination from "../../../Components/Pagination/Pagination";
import PieChartNew from '../../../Components/Chart/PieChart';
import '../../../Components/ProgressArrowBar/ProgressArrowBar.scss'
import logoKemendagri from "../../../assets/images/logo-kemendagri/logo-kemendagri-home.png"
import CountUp from 'react-countup';
import "./../../Kependudukan/kependudukan.scss";
import { Buffer } from "buffer";

const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;
const API_URI_RBAC_DATA = `${process.env.REACT_APP_API_URL_9007}`;
const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const ContentPerencanaanDetailDaerah = () => {
    const { _id } = useParams();
    const location = useLocation();
  
    const queryParams = new URLSearchParams(location.search);
    const namaDaerah = queryParams.get("namaDaerah");
    const namaProv = queryParams.get("namaProv");
    const idProv = queryParams.get('idProv')
    const tahapan = queryParams.get('tahapan')
    const tahun = queryParams.get('tahun')
  
    const [customActiveTab, setcustomActiveTab] = useState("6");
    const toggleCustom = (tab) => {
      if (customActiveTab !== tab) {
        setcustomActiveTab(tab);
      }
    };
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
        } catch (errorPerencanaan) {
          setErrorPerencanaan(errorPerencanaan);
        } finally {
          setLoadingPerencanaan(false);
        }
      };
      fetchData();
    };
    const [selectedSingleTahun, setSelectedSingleTahun] = useState(tahun); // Set default value
    const [selectedSingleTahapan, setSelectedSingleTahapan] = useState(tahapan); // Set default value
    const [selectedSingleSubTahapan, setSelectedSingleSubTahapan] = useState('6'); // Set default value
    const [dataPerencanaan, setDataPerencanaan] = useState([]);
    const [dataPerencanaanPersentase, setDataPerencanaanPersentase] = useState(
      []
    );
    const [dataPerencanaanPersentaseFiltered, setDataPerencanaanPersentaseFiltered] = useState(
      []
    );
    const [loadingPerencanaan, setLoadingPerencanaan] = useState([]);
    const [errorPerencanaan, setErrorPerencanaan] = useState([]);
  
    const getDataPerencanaanRkpdNasional = ({
      tahun,
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
              tahun: tahun,
              kode_ddn: kodeDdn
            }),
          };
          const response = await fetch(
            `${API_URI_RBAC}/v2/dashboard_perencanaan_2_komposisi_rkpd`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataPerencanaanRkpdNasional = await response.json();
  
          const dataResultChartTahapan = dataPerencanaanRkpdNasional.data.dashboard_perencanaan_2_komposisi_rkpd.length > 0 ? [dataPerencanaanRkpdNasional.data.dashboard_perencanaan_2_komposisi_rkpd[0].eksekutif, dataPerencanaanRkpdNasional.data.dashboard_perencanaan_2_komposisi_rkpd[0].legislatif, dataPerencanaanRkpdNasional.data.dashboard_perencanaan_2_komposisi_rkpd[0].masyarakat] : []

          console.log(dataResultChartTahapan, "ini");
  
          setDataPerencanaan(dataResultChartTahapan);
        } catch (errorPerencanaan) {
          setErrorPerencanaan(errorPerencanaan);
        } finally {
          setLoadingPerencanaan(false);
        }
      };
      fetchData();
    };
  
    const [totalPagu, setTotalPagu] = useState(0)
    const getDataPerencanaanRkpdNasionalPersentase = ({
      tahun,
      tahapan,
      kodeDdn= _id
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
            `${API_URI_RBAC}/v2/dashboard_perencanaan_3_list_tabel`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataPerencanaanRkpdNasionalPersentase = await response.json();
          
          const sumPaguValidasi = dataPerencanaanRkpdNasionalPersentase.data.reduce((sum, item) => {
            const paguValidasi = Number(item.pagu_validasi) || 0; // Pastikan pagu_validasi adalah angka
            return sum + paguValidasi;
          }, 0);

          setTotalPagu(sumPaguValidasi)
  
          setDataPerencanaanPersentase(
            dataPerencanaanRkpdNasionalPersentase.data
          );
          setDataPerencanaanPersentaseFiltered(
            dataPerencanaanRkpdNasionalPersentase.data
          );
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
      getDataPerencanaanRkpdNasional({
        tahun: selectedSingleTahun,
        // tahapan: selectedSingleTahapan,
      });
      }, [selectedSingleTahun, selectedSingleTahapan]); // Panggil API jika tahun atau dokumen berubah
    
  
    useEffect(() => {
      getDataLogoDaerah();
      // getDataPerencanaanRkpdNasional();
      // getDataPerencanaanRkpdNasionalPersentase();
    }, []);

    const [dataDetailUnitSkpd, setDataDetailUnitSkpd] = useState([]);    
    const [dataDetailUnitSkpdFiltered, setDataDetailUnitSkpdFiltered] = useState([]);    
    const [loadingDetailUnitSkpd, setLoadingDetailUnitSkpd] = useState([]);
    const [errorDetailUnitSkpd, setErrorDetailUnitSkpd] = useState([]);    
  
    const getDataDetailUnitSkpd = ({
      tahun= "2024",
      kodeDdn=_id,
      kodeUnitSkpd="",
      idTahap="1"
    }      
    ) => {
      console.log(kodeDdn, _id)
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
            `${API_URI_RBAC}/v2/dashboard_perencanaan_3_detail_sub_giat`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataDetailUnitSkpd = await response.json();
  
          setDataDetailUnitSkpd(dataDetailUnitSkpd.data)    
          setDataDetailUnitSkpdFiltered(dataDetailUnitSkpd.data)    

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
  
    const [modall, setModall] = useState(false);
    const [dataRincianDetail, setDataRincianDetail] = useState(0);
    const [dataDetailNamaUnitSkpd, setDataDetailNamaUnitSkpd] = useState("");

    const handleOpen = ({idTahap,      
      kodeUnitSkpd = "",
      tahun = "",
      namaUnitSkpd="",
      paguValidasi=0
    }
    ) => {
      getDataDetailUnitSkpd({idTahap: idTahap, kodeUnitSkpd:kodeUnitSkpd, tahun:tahun})
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
    const [itemsPerPage] = useState(10); // Set items per page
    const [itemsPerPageDetail] = useState(10);
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
    
    const sortedItems = React.useMemo(() => {
      let sortableItems = [...(dataPerencanaanPersentaseFiltered || [])];
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
    }, [dataPerencanaanPersentaseFiltered, sortConfig]);

    const sortedItemsDetail = React.useMemo(() => {
      let sortableItems = [...(dataDetailUnitSkpdFiltered || [])];
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
    }, [dataDetailUnitSkpdFiltered, sortConfigDetail]);
  
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const currentItemsDetail = sortedItemsDetail.slice(
      indexOfFirstItemDetail,
      indexOfLastItemDetail
    );
    
    const totalPages = Math.ceil(
      (dataPerencanaanPersentaseFiltered?.length || 0) / itemsPerPage
    );
    const totalPagesDetail = Math.ceil(
      (dataDetailUnitSkpdFiltered?.length || 0) / itemsPerPage
    );
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const paginateDetail = (pageNumber) => setCurrentPageDetail(pageNumber);
  
    const [dataShowSumberUsulan, setDataShowSumberUsulan] = useState(false);
    const handleShowDataSumberUsulan = (value) => {
      setDataShowSumberUsulan(value);
    };

    const [namaTahapan, setNamaTahapan] = useState("Persiapan")  
    const handleSelectChange = (e) => {
      const { name, value } = e.target;
      console.log(`${name}: ${value}`, 'ini isi selected value');
      
      if (name === 'tahun') {
          setSelectedSingleTahun(value); // Misalnya, untuk dropdown tahun
      } else if (name === 'tahap') {
          setSelectedSingleTahapan(value); // Misalnya, untuk dropdown jenis dokumen
      }else{
        setSelectedSingleSubTahapan(value);
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

      const [searchTerm, setSearchTerm] = useState("");
      const [searchTermDetail, setSearchTermDetail] = useState(""); 
      const [searchTermDetailSub, setSearchTermDetailSub] = useState(""); 
      
        // Fungsi untuk menangani perubahan pada input
        const handleSearchInput = (e) => {
          const value = e.target.value.toLowerCase()
          setSearchTerm(e.target.value);
          if(value===""){
            setDataPerencanaanPersentaseFiltered(dataPerencanaanPersentase)
          }else{
            const filtered = dataPerencanaanPersentase.filter((item) => 
              item.nama_skpd.toLowerCase().includes(value) || 
              item.nama_unit_skpd.toLowerCase().includes(value)
            );
            setDataPerencanaanPersentaseFiltered(filtered)
          }
          setCurrentPage(1);
        };
    
        const handleClearSearch = () => {
          setCurrentPage(1);
          setSearchTerm("");
          setDataPerencanaanPersentaseFiltered(dataPerencanaanPersentase)
        };

        const handleSearchInputDetail = (e) => {
          const value = e.target.value.toLowerCase();
          setSearchTermDetail(value);
          if (value === "") {
            setDataDetailUnitSkpdFiltered(dataDetailUnitSkpd)
          } else {
            const filtered = dataDetailUnitSkpd.filter((item) => {
                return item.nama_sub_giat.toLowerCase().includes(value)
            }
            );
            setDataDetailUnitSkpdFiltered(filtered)
          }
          setCurrentPageDetail(1);
        };
    
        const handleClearSearchDetail = () => {
          setCurrentPageDetail(1);
          setSearchTermDetail("");
          setDataDetailUnitSkpdFiltered(dataDetailUnitSkpd)
        };

         useEffect(() => {
            const handleEscKey = (event) => {
              if (event.key === "Escape") {
                handleClose()
                handleCloseNextModal()
                handleCloseNextModalSub();
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
                  {/* <div className="d-flex justify-content-center align-items-center avatar-sm">
                    <span className="logo-sm">                      
                    </span>
                  </div> */}
                  <div className="d-flex justify-content-center align-items-center">
                    <span>Perencanaan (RKPD)</span>
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">                  
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
                      <li className="breadcrumb-item"><Link to={`/perencanaan`}>Perencanaan</Link></li>
                      <li className="breadcrumb-item"><Link to={`/perencanaan/perencanaan-detail/${idProv}?namaDaerah=${namaProv}&tahapan=${selectedSingleTahapan}&tahun=${selectedSingleTahun}`}>Detail Se-{namaProv}</Link></li>
                      <li className="breadcrumb-item active">Detail SKPD {namaDaerah}</li>
                  </ol>
              </div>
          </div>
          </Col>
        </Row>           
        <Row>
          <Col md={6}> 
            <Card className='card-height-100'>
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
                <div className='separator mb-3'>
                </div>
                <Row>
                  <Col>
                  <div className='d-flex justify-content-between'>
                    <div className='d-flex justify-content-start align-items-start mb-2' style={{fontSize: "20px", fontWeight:600}}>
                        Sumber Usulan RKPD
                    </div>
                    {/* <select
                        name="subtahap"
                          style={{
                            padding: "10px 30px 10px 10px",
                            fontSize: "16px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            backgroundColor: "#ffffff",                          
                            cursor: "pointer",                          
                            marginLeft: "10px"
                          }}
                          value={selectedSingleSubTahapan}
                          onChange={handleSelectChange}
                        >                        
                        <option value="1">Persiapan</option>
                        <option value="2">Ranwal</option>
                        <option value="3">Rancangan</option>
                        <option value="4">Musrenbang</option>
                        <option value="5">Rankhir</option>
                        <option value="6">Penetapan</option>                                                                                                                  
                        </select> */}
                  </div>
                  
                  <PieChartNew 
                  dataChart={dataPerencanaan}
                  categoryName={['Eksekutif', 'Legislatif', 'Masyarakat']}
                  dataColors='["#57E7B4", "#FCAD24", "#2DAED4"]'
                  />                  
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
          <Card className="card-height-100">
              <CardBody>
                <div className="separator">
                  <h4 className="card-title mb-1">
                    List Progress Perencanaan 
                  </h4>                  
                </div>                
                <Row>
                  <Col>       
                  <div className='d-flex'>
                  <div className="mb-2 d-flex">
                  <div
                      className="mx-2 mt-3"
                      style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "300px",
                        marginBottom: "20px",
                      }}
                    >
             <input
                  style={{
                    padding: "10px 30px 10px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    // width:"100%",
                    fontSize: "16px",
                  }}  
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInput}
                  placeholder="Cari SKPD / Unit SKPD"
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
                <select
                name="tahap"
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
                  value={selectedSingleTahapan}
                  onChange={handleSelectChange}
                >                        
                  <option value="1">RKPD</option>
                  <option value="3">RKPD Perubahan</option>
                </select>
            </div>         
                    <div className="table-responsive table-card" style={{ overflowX: "auto" }}>                    
                      <table className="table table-nowrap mb-2 " style={{width:"1000px"}} >
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
                              PAGU VALIDASI (Rp) {getSortIcon("pagu_validasi")}
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
                                  {/* style={{ verticalAlign: "middle", textAlign: "center" }} */}
                                <td >{item.kode_skpd}</td>
                                <td style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          maxWidth: "200px",
                        }}>{item.nama_skpd}</td>
                                <td>                               
                                    {item.kode_unit_skpd}
                                </td>
                                <td style={{
                          whiteSpace: "normal", 
                          wordWrap: "break-word", 
                          maxWidth: "200px", 
                        }}>{item.nama_unit_skpd}</td>
                                <td>
                                  <span style={{ float: "right" }}>
                                  {item.pagu_validasi
                                    ? parseInt(item.pagu_validasi).toLocaleString(
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
                                  onClick={()=> handleOpen({idTahap: item.id_tahap, tahun:item.tahun, kodeUnitSkpd: item.kode_unit_skpd, namaUnitSkpd:item.nama_unit_skpd, paguValidasi: item.pagu_validasi})}
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
            <div className="mb-2 d-flex">
            <div
              className="mx-2"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "300px",
                marginBottom: "20px",
              }}
            >
              <input
                style={{
                  padding: "10px 30px 10px 10px",
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "16px",
                }}
                type="text"
                value={searchTermDetail}
                onChange={handleSearchInputDetail}
                // onKeyDown={(e) => handleKeyDown(e, "seprovinsi")}
                placeholder="Cari Sub Sub Rincian Objek"
              />

              {/* Tombol "X" di dalam input */}
              {searchTermDetail && (
                <button
                  onClick={() => handleClearSearchDetail()}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)", // Tengah-tengah secara vertikal
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
                      Pagu Validasi (Rp){" "}
                      {getSortIconDetail("pagu_validasi")}
                    </th>                                  
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemsDetail.map((item, index) => (
                    <tr key={index}>
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
                          {item.pagu_validasi
                            ? parseInt(item.pagu_validasi).toLocaleString(
                                "id-ID"
                              )
                            : "-"}
                        </span>                        
                      </td>                      
                    </tr>
                  ))}                  
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
      </React.Fragment>
    )
}

export default ContentPerencanaanDetailDaerah