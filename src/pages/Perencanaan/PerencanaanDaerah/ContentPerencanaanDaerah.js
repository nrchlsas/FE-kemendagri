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


const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;
const SingleOptions = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];
const ContentPerencanaanDaerah = () => {
  const { _id } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const namaDaerah = queryParams.get("namaDaerah");
  const tahapan = queryParams.get("tahapan")
  const tahun = queryParams.get("tahun")

  const [customActiveTab, setcustomActiveTab] = useState("6");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedSingleTahun, setSelectedSingleTahun] = useState(tahun); // Set default value
  const [selectedSingleTahapan, setSelectedSingleTahapan] = useState(tahapan); // Set default value
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
          `${API_URI_RBAC}/v2/dashboard_perencanaan_2_komposisi_rkpd`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPerencanaanRkpdNasional = await response.json();

        const dataResultChartTahapan = [dataPerencanaanRkpdNasional.data.eksekutif, dataPerencanaanRkpdNasional.data.legislatif, dataPerencanaanRkpdNasional.data.masyarakat]
        //   dataPerencanaanRkpdNasional.data.dashboard_perencanaan_1_rkpd_nasional.list.reduce(
        //     (acc, item) => {
        //       acc[0].push(item.value);
        //       acc[1].push(item.tahapan);
        //       return acc;
        //     },
        //     [[], []]
        //   );

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

  const getDataPerencanaanRkpdNasionalPersentase = ({
    tahun = "2024",
    tahapan = "1",
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
          `${API_URI_RBAC}/v2/dashboard_perencanaan_2_list_persentase`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPerencanaanRkpdNasionalPersentase = await response.json();

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
    }, [selectedSingleTahun, selectedSingleTahapan]); // Panggil API jika tahun atau dokumen berubah
  

  useEffect(() => {
    getDataPerencanaanRkpdNasional();
    // getDataPerencanaanRkpdNasionalPersentase();
  }, []);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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

  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    (dataPerencanaanPersentaseFiltered?.length || 0) / itemsPerPage
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
    navigate(`/perencanaan/perencanaan-detail/perencanaan-detail-skpd/${id}?namaDaerah=${encodedNamaDaerah}&namaProv=${encodedNamaProv}&idProv=${_id}&tahapan=${selectedSingleTahapan}&tahun=${selectedSingleTahun}`);
  };
  
  const [searchTerm, setSearchTerm] = useState("");
      // Fungsi untuk menangani perubahan pada input
      const handleSearchInput = (e) => {
        const value = e.target.value.toLowerCase()
        setSearchTerm(e.target.value);
        if(value===""){
          setDataPerencanaanPersentaseFiltered(dataPerencanaanPersentase)
        }else{
          const filtered = dataPerencanaanPersentase.filter((item) => 
            item.nama_daerah.toLowerCase().includes(value)
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
              <div className="separator">
                <h4 className="card-title mb-1">
                  List Progress Perencanaan 
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
                                {/* style={{ verticalAlign: "middle", textAlign: "center" }} */}
                              <td >{item.kode_ddn}</td>
                              <td>{item.nama_daerah}</td>
                              <td className='d-flex justify-content-center align-items-center' style={{ verticalAlign: "middle", textAlign: "center"}}>                               
                                {/* <div className='d-flex justify-content-center align-items-center' style={{backgroundColor: tahapData[customActiveTab]=="SUDAH" ? "#57E7B4" : "#F35F52", borderRadius:"5px", width:"86px", height:"37px"}}>
                                    {tahapData[customActiveTab]}
                                </div> */}
                                  <div className="step-container">
                                    {selectedSingleTahapan=="1" ? 
                                    (<>
                                    <div onClick={()=>{item.persiapan=='SUDAH'? '':''}} className={`step-item ${item.persiapan=='SUDAH'? 'persiapan':'disabled'}`}>Persiapan</div>
                                    <div onClick={()=>{item.rancangan_awal=='SUDAH'? '':''}} className={`step-item ${item.rancangan_awal=='SUDAH'? 'ranwal':'disabled'}`}>Ranwal</div>
                                    <div onClick={()=>{item.rancangan=='SUDAH'? '':''}} className={`step-item ${item.rancangan=='SUDAH'? 'rancangan':'disabled'}`}>Rancangan</div>
                                    <div onClick={()=>{item.musrenbang=='SUDAH'? '':''}} className={`step-item ${item.musrenbang=='SUDAH'? 'musrenbang':'disabled'}`}>Musrenbang</div>
                                    <div onClick={()=>{item.rancangan_akhir=='SUDAH'? '':''}} className={`step-item ${item.rancangan_akhir=='SUDAH'? 'rankhir':'disabled'}`}>Rankhir</div>
                                    <div onClick={()=>{item.penetapan=='SUDAH'? '':''}} className={`step-item ${item.penetapan=='SUDAH'? 'penetapan':'disabled'}`}>Penetapan</div>
                                    </>) : 
                                    (<>
                                    <div onClick={()=>{item.rancangan=='SUDAH'? '':''}} className={`step-item ${item.rancangan=='SUDAH'? 'rancangan':'disabled'}`}>Rancangan</div>
                                    <div onClick={()=>{item.rancangan_akhir=='SUDAH'? '':''}} className={`step-item ${item.rancangan_akhir=='SUDAH'? 'rankhir':'disabled'}`}>Rankhir</div>
                                    <div onClick={()=>{item.penetapan=='SUDAH'? '':''}} className={`step-item ${item.penetapan=='SUDAH'? 'penetapan':'disabled'}`}>Penetapan</div>
                                    </>)}
                                    
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

export default ContentPerencanaanDaerah
