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
import logoKemendagri from "../../../assets/images/logo-kemendagri/logo-kemendagri-home.png"
import CountUp from 'react-countup';

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const ContentPerencanaanDetailDaerah = () => {
    const { _id } = useParams();
    const location = useLocation();
  
    const queryParams = new URLSearchParams(location.search);
    const namaDaerah = queryParams.get("namaDaerah");
    const namaProv = queryParams.get("namaProv");
    const idProv = queryParams.get('idProv')
  
    const [customActiveTab, setcustomActiveTab] = useState("6");
    const toggleCustom = (tab) => {
      if (customActiveTab !== tab) {
        setcustomActiveTab(tab);
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
            `${API_URI}/dashboard_perencanaan_2_komposisi_rkpd`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataPerencanaanRkpdNasional = await response.json();
  
          const dataResultChartTahapan = [dataPerencanaanRkpdNasional.data.eksekutif, dataPerencanaanRkpdNasional.data.legislatif, dataPerencanaanRkpdNasional.data.masyarakat]

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
            `${API_URI}/dashboard_perencanaan_3_list_tabel`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataPerencanaanRkpdNasionalPersentase = await response.json();

          console.log(dataPerencanaanRkpdNasionalPersentase);
  
          setDataPerencanaanPersentase(
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
      getDataPerencanaanRkpdNasionalPersentase();
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
  
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(
      (dataPerencanaanPersentase?.length || 0) / itemsPerPage
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
    const goToDetail = (_id) => {
      navigate(`/perencanaan-detail/${_id}`);
    };
    
  
      
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
                      <li className="breadcrumb-item"><Link to="/Perencanaan">Perencanaan</Link></li>
                      <li className="breadcrumb-item"><Link to={`/perencanaan/perencanaan-detail/${idProv}?namaDaerah=${namaProv}`}>Detail Se-Provinsi {namaProv}</Link></li>
                      <li className="breadcrumb-item active">Detail SKPD Daerah {namaDaerah}</li>
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
                  <Col md={4}>
                    <img src={logoKemendagri} alt="" width="200" height="240" />
                  </Col>
                  <Col md={8}>
                    <div className='d-flex justify-content-start align-items-start mb-2' style={{fontSize: "30px", fontWeight:600}}>
                      Nama Daerah
                    </div>
                    {/* <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px" }}>Daerah</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        <CountUp
                            start={0}
                            end={232}
                            // decimal=","
                            // decimals={2}
                            // separator="."
                            // prefix="Rp "
                            // suffix=" T"
                            duration={3}
                          />
                      </div>
                    </div> */}
                    <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Kepala Daerah</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        <CountUp
                            start={0}
                            end={232}
                            // decimal=","
                            // decimals={2}
                            // separator="."
                            // prefix="Rp "
                            // suffix=" T"
                            duration={3}
                          />
                      </div>
                    </div>
                    <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Wakil Kepala Daerah</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        <CountUp
                            start={0}
                            end={232}
                            // decimal=","
                            // decimals={2}
                            // separator="."
                            // prefix="Rp "
                            // suffix=" T"
                            duration={3}
                          />
                      </div>
                    </div>
                    <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Sekretaris Daerah</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        <CountUp
                            start={0}
                            end={232}
                            // decimal=","
                            // decimals={2}
                            // separator="."
                            // prefix="Rp "
                            // suffix=" T"
                            duration={3}
                          />
                      </div>
                    </div>
                    <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Jumlah SKPD & Unit SKPD</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        <CountUp
                            start={0}
                            end={232}
                            // decimal=","
                            // decimals={2}
                            // separator="."
                            // prefix="Rp "
                            // suffix=" T"
                            duration={3}
                          />
                      </div>
                    </div>
                    <div className="d-flex mb-3">
                      <div style={{ flexBasis: "180px", color:"#929FB1" }}>Total Pagu</div>
                      <div>:&nbsp;</div>
                      <div style={{ fontWeight: 650 }}>
                        <CountUp
                            start={0}
                            end={232}
                            // decimal=","
                            // decimals={2}
                            // separator="."
                            // prefix="Rp "
                            // suffix=" T"
                            duration={3}
                          />
                      </div>
                    </div>
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
                  </Col>
                </Row>
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
                          <option value="1">RKPD</option>
                          <option value="3">RKPD Perubahan</option>
                        </select>
                    <div className="table-responsive table-card" style={{ overflowX: "auto" }}>                    
                      <table className="table table-nowrap mb-2 " style={{width:"1000px"}} >
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
                              KODE SKPD
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
                              NAMA SKPD
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
                              KODE UNIT SKPD
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
                              NAMA UNIT SKPD
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
                              PAGU VALIDASI
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
                                <td>{item.nama_skpd}</td>
                                <td className='d-flex justify-content-center align-items-center' style={{ verticalAlign: "middle", textAlign: "center"}}>                               
                                    {item.kode_unit_skpd}
                                </td>
                                <td>{item.nama_unit_skpd}</td>
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

export default ContentPerencanaanDetailDaerah