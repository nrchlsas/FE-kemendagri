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

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const SingleOptions = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

const ContentPerencanaan = () => {
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
          `${API_URI}/dashboard_perencanaan_1_rkpd_nasional`,
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

  const getDataPerencanaanRkpdNasionalPersentase = ({
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
          `${API_URI}/dashboard_perencanaan_1_list_persentase`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataPerencanaanRkpdNasionalPersentase = await response.json();

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
    navigate(`/perencanaan/perencanaan-detail/${_id}?namaDaerah=${encodedNamaDaerah}`);
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
                <div className="nav-beranda d-flex justify-content-center align-items-center">
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
                </div>
              </div>
            </div>
          </Card>
        </Col>        
    </Row>    
      <Row>
        <Col md={6} xl={6}>
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
                  <PolygonMaps />
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
        <Col md={6} xl={6}>
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
                              <td>{item.nama_daerah}</td>
                              <td>
                                <div
                                  className="progress"
                                  style={{ height: "20px" }}
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
    </React.Fragment>
  );
};

export default ContentPerencanaan;
