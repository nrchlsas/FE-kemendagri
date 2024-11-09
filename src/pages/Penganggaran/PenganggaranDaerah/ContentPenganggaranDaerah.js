import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Col, Row,Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody } from 'reactstrap'
import Pagination from "../../../Components/Pagination/Pagination";
import '../../../Components/ProgressArrowBar/ProgressArrowBar.scss'

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const SingleOptions = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];
const ContentPenganggaranDaerah = () => {
  const { _id } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const namaDaerah = queryParams.get("namaDaerah");

  const [customActiveTab, setcustomActiveTab] = useState("6");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedSingleTahun, setSelectedSingleTahun] = useState('2024'); // Set default value
  const [selectedSingleTahapan, setSelectedSingleTahapan] = useState('1'); // Set default value
  const [dataPenganggaran, setDataPenganggaran] = useState([]);
  const [dataPenganggaranPersentase, setDataPenganggaranPersentase] = useState(
    []
  );
  const [dataPenganggaranSudahDanBelum, setDataPenganggaranSudahDanBelum] = useState(
    []
  );
  const [loadingPenganggaran, setLoadingPenganggaran] = useState([]);
  const [errorPenganggaran, setErrorPenganggaran] = useState([]);

  const getDataPenganggaranNasional = ({
    // tahun = "2024",
    // tahapan = "1",
    kodeDdn=_id
  } = {}) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // id_tahap: tahapan,
            // tahun: tahun,
            kode_ddn: kodeDdn
          }),
        };
        const response = await fetch(
          `${API_URI}/dashboard_Penganggaran_2_komposisi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPenganggaranNasional = await response.json();

        const dataResultChartTahapan = [dataPenganggaranNasional.data.eksekutif, dataPenganggaranNasional.data.legislatif, dataPenganggaranNasional.data.masyarakat]
        //   dataPenganggaranNasional.data.dashboard_Penganggaran_1__nasional.list.reduce(
        //     (acc, item) => {
        //       acc[0].push(item.value);
        //       acc[1].push(item.tahapan);
        //       return acc;
        //     },
        //     [[], []]
        //   );

        console.log(dataResultChartTahapan, "ini");

        setDataPenganggaran(dataResultChartTahapan);
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
    // tahapan = "1",
    kodeDdn= _id
  } = {}) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // id_tahap: tahapan,
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

        setDataPenganggaranPersentase(
          dataPenganggaranNasionalPersentase.data.penganggaran_level_2
        );

        setDataPenganggaranSudahDanBelum(
          dataPenganggaranNasionalPersentase.data.penganggaran_level_2
        )
      } catch (errorPenganggaran) {
        setErrorPenganggaran(errorPenganggaran);
      } finally {
        setLoadingPenganggaran(false);
      }
    };
    fetchData();
  };

    // Memanggil fungsi API setiap kali dropdown berubah
    // useEffect(() => {
    // getDataPenganggaranNasionalPersentase({
    //     tahun: selectedSingleTahun,
    //     tahapan: selectedSingleTahapan,
    // });
    // }, [selectedSingleTahun, selectedSingleTahapan]); // Panggil API jika tahun atau dokumen berubah
  

  useEffect(() => {
    // getDataPenganggaranNasional();
    getDataPenganggaranNasionalPersentase();
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
  const currentItemsSudahDanBelum = sortedItemsSudahDanBelum.slice(indexOfFirstItemSudahDanBelum, indexOfLastItemSudahDanBelum);

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
    const { name, value } = e.target;
    console.log(`${name}: ${value}`, 'ini isi selected value');
    
    if (name === 'tahun') {
        setSelectedSingleTahun(value); // Misalnya, untuk dropdown tahun
    } else if (name === 'tahap') {
        setSelectedSingleTahapan(value); // Misalnya, untuk dropdown jenis dokumen
    }

  };
  
  const navigate = useNavigate();
  const goToDetail = (id, namaDaerah, namaProv) => {
    const encodedNamaDaerah = encodeURIComponent(namaDaerah); 
    const encodedNamaProv = encodeURIComponent(namaProv); 
    navigate(`/penganggaran/penganggaran-detail/penganggaran-detail-skpd/${id}?namaDaerah=${encodedNamaDaerah}&namaProv=${encodedNamaProv}&idProv=${_id}`);
  };
  
  const [modall, setModall] = useState(false);
  const [dataDetailNamaTahap, setDataDetailNamaTahap] = useState("");
  const [dataDetailIdTahap, setDataDetailIdTahap] = useState(28);
  const [dataRincianDetail, setDataRincianDetail] = useState(0);
  const [dataDetailNamaUnitSkpd, setDataDetailNamaUnitSkpd] = useState("");
  const [cardhead, setCardHead] = useState();    

  const handleOpen = ({   
    idTahap 
  }) => {         
    setModall(true);  
    setCardHead(null);
    console.log(dataDetailIdTahap, 'ini isi data detail')
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
                {/* <div className="nav-beranda d-flex justify-content-center align-items-center">
                  <Nav tabs className="nav nav-tabs nav-success nav-justified">
                    <NavItem>
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
                    </NavItem>
                  </Nav>
                </div> */}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      {/* <Row>
        <Col md={6} xl={6}>
          <Card className="card-height-100">
            <CardBody>
              {dataShowSumberUsulan ? (
                <>
                  <div className="separator mb-2">
                    <h4 className="card-title mb-0">Penganggaran Nasional</h4>
                    <h4 className="card-title mb-0">Republik Indonesia</h4>
                  </div>
                  <PieChartNew 
                  dataChart={dataPenganggaran}
                  categoryName={['Eksekutif', 'Legislatif', 'Masyarakat']}
                  dataColors='["#57E7B4", "#FCAD24", "#2DAED4"]'
                  />
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
                  <PolygonMaps />
                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-column justify-content-evenly">
                    <div className="d-flex align-items-center mb-2">
                        <div style={{ height: "10px", width: "10px", backgroundColor: "#57E7B4", marginRight: "8px" }}></div>
                        <span style={{fontStyle:"poppins", color:"#929FB1"}}>Ketika 100% Pemda</span>
                    </div>                
                    <div className="d-flex align-items-center mb-2">
                        <div style={{ height: "10px", width: "10px", backgroundColor: "#FCAD24", marginRight: "8px" }}></div>
                        <span style={{fontStyle:"poppins", color:"#929FB1"}}>Ketika 6%-99% Pemda</span>
                    </div>                    
                    <div className="d-flex align-items-center">
                        <div style={{ height: "10px", width: "10px", backgroundColor: "#F35F52", marginRight: "8px" }}></div>
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
        <Col md={6} xl={6}>
        <Card>
          <CardBody>
          <div className="separator">
                <h4 className="card-title mb-1">
                  List Progress Penganggaran 
                </h4>
                <h4 className="card-title">
                    {namaTahapan}
                </h4>                
              </div>
        <input
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
          />
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
                <option value="1"></option>
                <option value="3"> Perubahan</option>
              </select>
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
                    NAMA DAERAH
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      cursor: "pointer",
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                      width: "600px"
                    }}
                    scope="col"
                  >
                    STATUS
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
                      <td >{item.kode_ddn}</td>
                      <td>{item.nama_daerah}</td>
                      <td className='d-flex justify-content-center align-items-center' style={{ verticalAlign: "middle", textAlign: "center" }}>                               
                        
                          <div className="step-container">
                            <div className={`step-item ${item.persiapan=='SUDAH'? 'persiapan':''}`}>Persiapan</div>
                            <div className={`step-item ${item.rancangan_awal=='SUDAH'? 'ranwal':''}`}>Ranwal</div>
                            <div className={`step-item ${item.rancangan=='SUDAH'? 'rancangan':''}`}>Rancangan</div>
                            <div className={`step-item ${item.musrenbang=='SUDAH'? 'musrenbang':''}`}>Musrenbang</div>
                            <div className={`step-item ${item.rancangan_akhir=='SUDAH'? 'rankhir':''}`}>Rankhir</div>
                            <div className={`step-item ${item.penetapan=='SUDAH'? 'penetapan':''}`}>Penetapan</div>
                          </div>                                
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                          cursor: "pointer",
                          whiteSpace: "normal",
                          overflowWrap: "break-word",
                        }}
                      >
                        <i
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
          </CardBody>
        </Card>       
        </Col>
      </Row> */}      
      <Row>
        <Col>
        <div className="d-sm-flex align-items-center justify-content-between">            
            <div className="page-title-right">
                <ol className="breadcrumb mb-2 ms-2" style={{fontWeight:600}}>
                    <li className="breadcrumb-item"><Link to="/penganggaran">Penganggaran</Link></li>
                    <li className="breadcrumb-item active">Detail Se-{namaDaerah}</li>
                </ol>
            </div>
        </div>
        </Col>
      </Row>
         
      <Row>
        <Col>
        <Card className="card-height-100">
            <CardBody>
              <div className="separator mb-2">
                <h4 className="card-title">
                  List Progress Penganggaran 
                </h4>
                {/* <h4 className="card-title">
                    {namaTahapan}
                </h4>*/}
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
                  {/* <select
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
                      </select> */}
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
                        <option value="1">Murni</option>
                        <option value="2">Pergeseran</option>
                        <option value="3">Perubahan</option>
                        <option value="4">Pergeseran Setelah Perubahan</option>
                      </select>
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
                            NAMA DAERAH
                          </th>
                          {(selectedSingleTahapan == "2" || selectedSingleTahapan == "4") ? (
                          <>
                          <th
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              width: "600px"
                            }}
                            scope="col"
                          >
                            PERGESERAN KE-
                          </th>
                          </>
                          ) : (
                          <>
                          <th
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              width: "600px"
                            }}
                            scope="col"
                          >
                            STATUS
                          </th>
                          </>)}                          
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
                              <td >{item.kode_ddn}</td>
                              <td>{item.nama_daerah}</td>
                              <td className='d-flex justify-content-center align-items-center' style={{ verticalAlign: "middle", textAlign: "center", overflowX: "auto"}}>                               
                                {/* <div className='d-flex justify-content-center align-items-center' style={{backgroundColor: tahapData[customActiveTab]=="SUDAH" ? "#57E7B4" : "#F35F52", borderRadius:"5px", width:"86px", height:"37px"}}>
                                    {tahapData[customActiveTab]}
                                </div> */}
                                  <div className="step-container">
                                    {selectedSingleTahapan=="1" ? 
                                    (<>
                                    <div onClick={()=>{item.daerah_kuappas=='1'? (handleOpen({idTahap: 40}), setDataDetailIdTahap(40)):''}} className={`step-item ${item.daerah_kuappas=='1'? 'persiapan':'disabled'}`}>KUA & PPAS</div>
                                    <div onClick={()=>{item.daerah_rapbd=='1'? (handleOpen({idTahap: 5}), setDataDetailIdTahap(5)):''}} className={`step-item ${item.daerah_rapbd=='1'? 'ranwal':'disabled'}`}>RAPBD</div>
                                    <div onClick={()=>{item.daerah_apbd=='1'? handleOpen({idTahap: 28}):''}} className={`step-item ${item.daerah_apbd=='1'? 'rancangan':'disabled'}`}>Penetapan APBD</div>                                  
                                    </>) : selectedSingleTahapan=="2" ?
                                    (<>                                
                                    {item.daerah_apbdgeser==0 ? (<>
                                    <div>Tidak Ada Pergeseran</div>  {/* Menampilkan div lain saat data 0 */}
                                    </>):(
                                    //   Array.from({ length: item.daerah_apbdgeser }, (_, index) => (                                      
                                    //   <div
                                    //     key={index}
                                    //     onClick={() => console.log(`Clicked step ${index + 1}`)}
                                    //     className={`step-item ${index + 1 <= item.daerah_apbdgeser ? 'rancangan' : 'disabled'}`}
                                    //   >
                                    //     {/* {index + 1} */}
                                    //     {index === item.daerah_apbdgeser - 1 ? index + 1 : "\u00A0"}
                                    //   </div>
                                    // ))
                                    <div onClick={()=>{item.daerah_apbdgeser>0? '':''}} className={`step-item ${item.daerah_apbdgeser>0 ? 'rancangan':'disabled'}`}>{item.daerah_apbdgeser}</div>
                                    )}
                                    </>) : selectedSingleTahapan=="3" ? (<>
                                    <div onClick={()=>{item.daerah_kupa=='1'? (handleOpen({idTahap: 41}), setDataDetailIdTahap(41)):''}} className={`step-item ${item.daerah_kupa=='1'? 'rancangan':'disabled'}`}>KUPA & PPAS</div>
                                    <div onClick={()=>{item.daerah_rapbdubah=='1'? handleOpen({idTahap: 8}):''}} className={`step-item ${item.daerah_rapbdubah=='1'? 'rankhir':'disabled'}`}>RAPBD Perubahan</div>
                                    <div onClick={()=>{item.daerah_apbdubah=='1'? handleOpen({idTahap: 29}):''}} className={`step-item ${item.daerah_apbdubah=='1'? 'penetapan':'disabled'}`}>Penetapan APBD Perubahan</div>
                                    </>) : (<>
                                      {item.daerah_apbdgeserpasca==0 ? (<>
                                    <div>Tidak Ada Pergeseran</div>  {/* Menampilkan div lain saat data 0 */}
                                    </>):(
                                      Array.from({ length: item.daerah_apbdgeserpasca }, (_, index) => (                                      
                                      <div
                                        key={index}
                                        onClick={() => console.log(`Clicked step ${index + 1}`)}
                                        className={`step-item ${index + 1 <= item.daerah_apbdgeserpasca ? 'rancangan' : 'disabled'}`}
                                      >                                        
                                        {index === item.daerah_apbdgeserpasca - 1 ? index + 1 : "\u00A0"}
                                      </div>
                                    ))
                                  )
                                    }</>)}                                    
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
                                <i onClick={()=> goToDetail(item.kode_ddn, item.nama_daerah, namaDaerah)}
                                  style={{
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                    fontSize: "20px",
                                  }}
                                  className="bx bx-list-ul text-primary"
                                ></i>
                                    {/* <div className="dropdown">
                                      <i
                                        onClick={() => toggleDropdown()}
                                        style={{
                                          padding: "5px 10px",
                                          cursor: "pointer",
                                          fontSize: "20px",
                                        }}
                                        className="bx bx-list-ul text-primary"
                                      ></i>
                                    
                                      <div id="dropdownMenu" className="dropdown-menu">
                                        <div onClick={() => goToDetail(item.kode_ddn, item.nama_daerah, namaDaerah)}>
                                          Detail
                                        </div>
                                        <div>Another action</div>
                                        <div>Something else</div>
                                      </div>
                                    </div> */}
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
            List Progress Penganggaran {dataDetailNamaTahap} {" "}            
          </ModalHeader>
          <ModalBody>
            {/* <div>
              Total Anggaran: {dataRincianDetail}
            </div> */}
            

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
                      Kode
                    </th>
                    <th
                      onClick={() => requestSortDetail("kode_sub_giat")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Sudah {getSortIconDetail("kode_sub_giat")}
                    </th>
                    <th
                      onClick={() => requestSortDetail("nama_sub_giat")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Kode {getSortIconDetail("nama_sub_giat")}
                    </th>
                    <th
                      onClick={() => requestSortDetail("nama_sub_giat")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Belum {getSortIconDetail("nama_sub_giat")}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemsSudahDanBelum.map((item, index) => {
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
                    return (                      
                    <tr key={index}>
                      <td>{tahapData[dataDetailIdTahap] == 1 ? item.kode_ddn : ""}</td>
                      <td>{tahapData[dataDetailIdTahap] == 1 ? item.nama_daerah : ""}</td>
                      <td>{tahapData[dataDetailIdTahap] == 0 ? item.kode_ddn : ""}</td>
                      <td>{tahapData[dataDetailIdTahap] == 0 ? item.nama_daerah : ""}</td>
                    </tr>)
                  })}
                </tbody>
              </table>
            {/* </div> */}
            <Pagination
              currentPage={currentPageSudahDanBelum}
              totalPages={totalPagesSudahDanBelum}
              onPageChange={paginateSudahDanBelum}
            />
          </ModalBody>
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default ContentPenganggaranDaerah
