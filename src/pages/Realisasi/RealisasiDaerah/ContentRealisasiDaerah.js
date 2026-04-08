import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Col, Row,Nav, NavItem, NavLink } from 'reactstrap'
import classnames from "classnames";
import Pagination from "../../../Components/Pagination/Pagination";
import PolygonMaps from "../../../Components/MapIndo/PolygonMaps";
import VerticalBarChart from "../../../Components/Chart/VerticalBarChart";
import PieChartNew from '../../../Components/Chart/PieChart';
import '../../../Components/ProgressArrowBar/ProgressArrowBar.scss'
import BreadCrumb from '../../../Components/Common/BreadCrumb';

const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;
const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const SingleOptions = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];
const ContentRealisasiDaerah = () => {
  const { _id } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const namaDaerah = queryParams.get("namaDaerah");

  const [customActiveTab, setcustomActiveTab] = useState("1");
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

  const getDataRealisasiRkpdNasional = ({
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
          `${API_URI_RBAC}/v2/dashboard_Realisasi_2_komposisi_rkpd`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataRealisasiRkpdNasional = await response.json();

        const dataResultChartTahapan = [dataRealisasiRkpdNasional.data.eksekutif, dataRealisasiRkpdNasional.data.legislatif, dataRealisasiRkpdNasional.data.masyarakat]
        //   dataRealisasiRkpdNasional.data.dashboard_Realisasi_1_rkpd_nasional.list.reduce(
        //     (acc, item) => {
        //       acc[0].push(item.value);
        //       acc[1].push(item.tahapan);
        //       return acc;
        //     },
        //     [[], []]
        //   );

        console.log(dataResultChartTahapan, "ini");

        setDataRealisasi(dataResultChartTahapan);
      } catch (errorRealisasi) {
        setErrorRealisasi(errorRealisasi);
      } finally {
        setLoadingRealisasi(false);
      }
    };
    fetchData();
  };

  const getDataRealisasiPersentase = ({
    tahun = "",
    kodeProv= _id
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
            kode_prov: kodeProv
          }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/v2/realisasi_level_2`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataRealisasiPersentase = await response.json();

        console.log(dataRealisasiPersentase, 'ini data persentase')
        setDataRealisasiPersentase(
          dataRealisasiPersentase.data.realisasi_level_2
        );
        setDataRealisasiPersentaseFiltered(
          dataRealisasiPersentase.data.realisasi_level_2
        );
      } catch (errorRealisasi) {
        setErrorRealisasi(errorRealisasi);
      } finally {
        setLoadingRealisasi(false);
      }
    };
    fetchData();
  };

    // Memanggil fungsi API setiap kali dropdown berubah
    // useEffect(() => {
    // getDataRealisasiNasionalPersentase({
    //     tahun: selectedSingleTahun,
    //     tahapan: selectedSingleTahapan,
    // });
    // }, [selectedSingleTahun, selectedSingleTahapan]); // Panggil API jika tahun atau dokumen berubah
  

  useEffect(() => {
    // getDataRealisasiRkpdNasional();
    getDataRealisasiPersentase({
      tahun:selectedSingleTahun
    });
  }, [selectedSingleTahun]);

  
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
    (dataRealisasiPersentaseFiltered?.length || 0) / itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    }

  };
  
  const navigate = useNavigate();
  const goToDetail = (id, namaDaerah, namaProv) => {
    const encodedNamaDaerah = encodeURIComponent(namaDaerah); 
    const encodedNamaProv = encodeURIComponent(namaProv); 
    navigate(`/realisasi/realisasi-detail/realisasi-detail-skpd/${id}?namaDaerah=${encodedNamaDaerah}&namaProv=${encodedNamaProv}&idProv=${_id}`);
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
              item.nama_daerah.toLowerCase().includes(value)
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

    return (
    <React.Fragment>
        <Row>
          {/* <Card className="card-custom"> */}
            <div className="d-flex">
              <div className="d-flex title-page" style={{padding:"0 0 13px 0"}}>
                {/* <div className="d-flex justify-content-center align-items-center avatar-sm">
                  <span className="logo-sm">
                    
                  </span>
                </div> */}
                <div className="d-flex justify-content-start align-items-start">
                  <span>Realisasi</span>
                </div>
              </div>              
            </div>
          {/* </Card> */}
        <Col>
        </Col>
      </Row>   
      <Row>
        <Col>
        <div className="d-sm-flex align-items-center justify-content-between">            
            <div className="page-title-right">
                <ol className="breadcrumb mb-2 ms-2" style={{fontWeight:600}}>
                    <li className="breadcrumb-item"><Link to="/realisasi">Realisasi</Link></li>
                    <li className="breadcrumb-item active">Detail Realisasi Se-{namaDaerah}</li>
                </ol>
            </div>
        </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
        <Card className="card-height-100">
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-1">
                  List Progress Realisasi 
                </h4>
                {/* <h4 className="card-title">
                    {namaTahapan}
                </h4>                 */}
              </div>  
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
                    width:"250px",
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
              <Row>
                <Col>                
                <div className='d-flex justify-content-start mt-2' style={{
                      padding: "10px 0 10px 0px", // Sesuaikan padding kanan agar tidak menimpa tombol X                      
                    }}>
                <Nav
                className="nav-tabs-custom card-header-tabs border-bottom-0"
                role="tablist"
              >
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: customActiveTab === "1" },
                      "fw-semibold"
                    )}
                    onClick={() => {
                      toggleCustom("1");                      
                    }}
                    href="#"
                  >
                    Progress{" "}
                    {/* <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              12
                            </span> */}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: customActiveTab === "2" },
                      "fw-semibold"
                    )}
                    onClick={() => {
                      toggleCustom("2");                      
                    }}
                    href="#"
                  >
                    Nilai{" "}
                    {/* <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              5
                            </span> */}
                  </NavLink>
                </NavItem>                
              </Nav>
                </div>
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
                      </select> */}
                  <div className="table-responsive table-card mt-2">
                    <table className="table table-nowrap mb-2">
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
                          {customActiveTab == "1" ? (<>
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
                            PROGRESS
                          </th>
                          </>) : (<>
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
                            ANGGARAN
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
                            REALISASI
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
                            PERSENTASE
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
                          return (
                            <tr key={index}>
                                {/* style={{ verticalAlign: "middle", textAlign: "center" }} */}
                              <td >{item.kode_ddn}</td>
                              <td>{item.nama_daerah}</td>
                              {customActiveTab == "1" ?
                               (<>
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
                               </>) : 
                              (<>
                                <td>
                                <span style={{ float: "right" }}>
                                  {item.anggaran
                                    ? parseInt(item.anggaran).toLocaleString(
                                        "id-ID"
                                      )
                                    : "-"}
                                  </span>                                  
                                </td>
                                <td>
                                <span style={{ float: "right" }}>
                                  {item.realisasi
                                    ? parseInt(item.realisasi).toLocaleString(
                                        "id-ID"
                                      )
                                    : "-"}
                                  </span>                                  
                                </td>
                                <td>
                                <span style={{ float: "right" }}>
                                  {item.persenrealisasianggaran
                                    ? `${Number(item.persenrealisasianggaran).toLocaleString(
                                          "id-ID",
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        )}%`                                      
                                    : "-"}
                                </span>                                  
                                </td>
                              </>)}             

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
  )
}

export default ContentRealisasiDaerah
