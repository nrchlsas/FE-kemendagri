import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Label,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import "./../Kependudukan/kependudukan.scss";
import "leaflet/dist/leaflet.css";
import classnames from "classnames";
import CountUp from "react-countup";
import KementerianDanLembaga from ".";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007_V2}`;

const ContentKementerianDanLembaga = () => {
  const [dataKementerianDanLembaga, setDataKementerianDanLembaga] = useState(
    []
  );
  const [loadingKementerianDanLembaga, setLoadingKementerianDanLembaga] =
    useState([]);
  const [errorKementerianDanLembaga, setErrorKementerianDanLembaga] = useState(
    []
  );

  const [customActiveTabAll, setcustomActiveTabAll] = useState("1");
  const [titleCard, setTitleCard] = useState("RAPBD");

  const toggleCustomAll = (tab) => {
    if (customActiveTabAll !== tab) {
      setcustomActiveTabAll(tab);
    }
  };

  //   const getDataKementerianDanLembaga = (param = "") => {
  //     const fetchData = async () => {
  //       try {
  //         const requestOptions = {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           // body: JSON.stringify({
  //           //   query:
  //           //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
  //           // }),
  //         };
  //         // /table_dapodik_provinsi
  //         // /table_dapodik_kabupaten
  //         // /table_stunting_provinsi

  //         let endpoint = "";

  //         // Menentukan endpoint berdasarkan param
  //         switch (param) {
  //           case "rapbd":
  //             endpoint = "/monitor-rapbd";
  //             break;
  //           case "apbd":
  //             endpoint = "/monitor-apbd";
  //             break;
  //           case "rkpd":
  //             endpoint = "/monitor-rkpd";
  //             break;
  //           case "rapbdPerubahan":
  //             endpoint = "/monitor-rapbd-perubahan";
  //             break;
  //           case "kuappas":
  //             endpoint = "/monitor-kuappas";
  //             break;
  //           case "apbdPerubahan":
  //             endpoint = "/monitor-apbd-perubahan";
  //             break;
  //           case "rkpdPerubahan":
  //             endpoint = "/monitor-rkbd-perubahan";
  //             break;
  //           case "apbdpergeseran":
  //             endpoint = "/monitor-apbd-pergeseran";
  //             break;
  //           case "kupa":
  //             endpoint = "/monitor-kupa";
  //             break;
  //           // Tambahkan case lain jika diperlukan
  //           default:
  //             throw new Error("Invalid parameter");
  //         }
  //         console.log(`${API_URI}${endpoint}`);

  //         const response = await fetch(`${API_URI}${endpoint}`, requestOptions);

  //         if (!response.ok) {
  //           throw new Error("Network response was not ok");
  //         }

  //         const dataKementerianDanLembaga = await response.json();
  //         // console.log(dataKementerianDanLembaga.data[0].count, 'ini bro')

  //         setDataKementerianDanLembaga(
  //           parseInt(dataKementerianDanLembaga?.data[0]?.count)
  //         );
  //       } catch (error) {
  //         setLoadingKementerianDanLembaga(error);
  //       } finally {
  //         setLoadingKementerianDanLembaga(false);
  //       }
  //     };
  //     fetchData();
  //   };

  const getDataKementerianDanLembagaFull = () => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/dashboard_monitoring_integrasi_kl`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataKementerianDanLembagaFull = await response.json();

        setDataKementerianDanLembaga(dataKementerianDanLembagaFull.data);
      } catch (error) {
        setLoadingKementerianDanLembaga(error);
      } finally {
        setLoadingKementerianDanLembaga(false);
      }
    };
    fetchData();
  };

  const [dataKementerianDanLembagaTabel, setDataKementerianDanLembagaTabel] =
    useState([]);

  const getDataKementerianDanLembagaTabel = () => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/tabel-monitoring-kl`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataKementerianDanLembagaTabel = await response.json();
        console.log(dataKementerianDanLembagaTabel.data, "ini isinya");

        setDataKementerianDanLembagaTabel(dataKementerianDanLembagaTabel.data);
      } catch (error) {
        setLoadingKementerianDanLembaga(error);
      } finally {
        setLoadingKementerianDanLembaga(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    // getDataKementerianDanLembaga("kupa");
    getDataKementerianDanLembagaTabel();
    getDataKementerianDanLembagaFull();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Calculate indexes for current page's data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Sorting logic
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...(dataKementerianDanLembagaTabel || [])];
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
  }, [dataKementerianDanLembagaTabel, sortConfig]);

  // Slice the sorted data for the current page
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total number of pages
  const totalPages = Math.ceil(
    (dataKementerianDanLembagaTabel?.length || 0) / itemsPerPage
  );

  // Pagination change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Placeholder for empty rows if data is less than items per page
  const placeholders = Array.from(
    { length: itemsPerPage - currentItems.length },
    (_, index) => (
      <tr key={`placeholder-${index}`}>
        <td
          colSpan="8"
          style={{ height: "44px", backgroundColor: "#f9f9f9" }}
        ></td>
      </tr>
    )
  );

  // Determine which icon to show for sorting using Unicode
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "↕"; // Default icon for unsorted
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <div className="d-flex title-page">
              <div className="avatar-sm">
                <i className="ri-account-circle-line text-dark fs-1"></i>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>Kementerian Dan Lembaga</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="separator mb-3">
                <h4 className="card-title d-flex justify-content-start">
                  Monitoring Integrasi Kementerian dan Lembaga
                </h4>
              </div>
              {/* <div className="nav-beranda">
                <Nav
                  tabs
                  className="nav nav-tabs nav-success nav-justified mb-3"
                >
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "1",
                      })}
                      onClick={() => {
                        toggleCustomAll("1");
                        setTitleCard("RAPBD");
                        // getDataKementerianDanLembaga("rapbd");
                      }}
                    >
                      RAPBD
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "2",
                      })}
                      onClick={() => {
                        toggleCustomAll("2");
                        setTitleCard("APBD");
                        // getDataKementerianDanLembaga("apbd");
                      }}
                    >
                      APBD
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "3",
                      })}
                      onClick={() => {
                        toggleCustomAll("3");
                        setTitleCard("RAPBD PERUBAHAN");
                        // getDataKementerianDanLembaga("rapbdPerubahan");
                      }}
                    >
                      RAPBD PERUBAHAN
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "4",
                      })}
                      onClick={() => {
                        toggleCustomAll("4");
                        setTitleCard("KUAPPAS");
                        // getDataKementerianDanLembaga("kuappas");
                      }}
                    >
                      KUAPPAS
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "5",
                      })}
                      onClick={() => {
                        toggleCustomAll("5");
                        setTitleCard("RKPD");
                        // getDataKementerianDanLembaga("rkpd");
                      }}
                    >
                      RKPD
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "6",
                      })}
                      onClick={() => {
                        toggleCustomAll("6");
                        setTitleCard("APBD PERUBAHAN");
                        // getDataKementerianDanLembaga("apbdPerubahan");
                      }}
                    >
                      APBD PERUBAHAN
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "7",
                      })}
                      onClick={() => {
                        toggleCustomAll("7");
                        setTitleCard("RKPD PERUBAHAN");
                        // getDataKementerianDanLembaga("rkpdPerubahan");
                      }}
                    >
                      RKPD PERUBAHAN
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "8",
                      })}
                      onClick={() => {
                        toggleCustomAll("8");
                        setTitleCard("APBD PERGESERAN");
                        // getDataKementerianDanLembaga("apbdPergeseran");
                      }}
                    >
                      APBD PERGESERAN
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "9",
                      })}
                      onClick={() => {
                        toggleCustomAll("9");
                        setTitleCard("KUPA");
                        // getDataKementerianDanLembaga("kupa");
                      }}
                    >
                      KUPA
                    </NavLink>
                  </NavItem>
                </Nav>
              </div> */}

              <div className="d-flex justify-content-center align-items-center">
                <Row>
                  {dataKementerianDanLembaga.map((item, index) => (
                    <Col>
                      <Card
                        key={index}
                        className="card-animate card-height-100"
                      >
                        <CardBody>
                          <div className="d-flex justify-content-center align-items-center flex-column title-custom-card">
                            <div className="d-flex justify-content-center align-items-center mb-1 title-card">
                              <span>{item.name}</span>
                            </div>
                            <div className="d-flex">
                              {/* <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="ri-account-circle-line text-warning"></i>
                            </span>
                          </div> */}
                              <div className="d-flex justify-content-center align-items-center title-body">
                                <CountUp
                                  start={0}
                                  // end={
                                  //   dataDapodik?.dapodik_jumlah_anak_sekolah
                                  //     ?.total_anak_sekolah
                                  // }
                                  end={parseInt(item.value)}
                                  separator="."
                                  prefix=""
                                  suffix=""
                                  duration={3}
                                />
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div>
                {/* Render Table */}
                <table
                  className="table table-bordered table-nowrap align-middle mb-0"
                  style={{ width: "100%" }}
                >
                  <thead className="table-light">
                    <tr>
                      <th
                        onClick={() => requestSort("tahun")}
                        style={{ cursor: "pointer" }}
                      >
                        TAHUN {getSortIcon("tahun")}
                      </th>
                      <th
                        onClick={() => requestSort("nama_aplikasi")}
                        style={{ cursor: "pointer" }}
                      >
                        NAMA APLIKASI {getSortIcon("nama_aplikasi")}
                      </th>
                      <th
                        onClick={() => requestSort("nama_kementerian")}
                        style={{ cursor: "pointer" }}
                      >
                        NAMA KEMENTERIAN {getSortIcon("nama_kementerian")}
                      </th>
                      <th
                        onClick={() => requestSort("id_daerah")}
                        style={{ cursor: "pointer" }}
                      >
                        ID DAERAH {getSortIcon("id_daerah")}
                      </th>
                      <th
                        onClick={() => requestSort("tahapan")}
                        style={{ cursor: "pointer" }}
                      >
                        TAHAPAN {getSortIcon("tahapan")}
                      </th>
                      <th
                        onClick={() => requestSort("nama_komponen")}
                        style={{ cursor: "pointer" }}
                      >
                        NAMA KOMPONEN {getSortIcon("nama_komponen")}
                      </th>
                      <th
                        onClick={() => requestSort("kodeddn")}
                        style={{ cursor: "pointer" }}
                      >
                        KODE DDN {getSortIcon("kodeddn")}
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ minHeight: "500px" }}>
                    {currentItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.tahun}</td>
                        <td>{item.nama_aplikasi}</td>
                        <td>{item.nama_kementerian}</td>
                        <td>{item.id_daerah || '-'}</td>
                        <td>{item.tahapan}</td>
                        <td>{item.nama_komponen}</td>
                        <td>{item.kodeddn || '-'}</td>
                      </tr>
                    ))}
                    {placeholders}
                  </tbody>
                </table>

                <nav className="mt-3">
                  <ul className="pagination justify-content-end">
                    {/* Previous Button */}
                    <li
                      className={`page-item ${currentPage === 1 && "disabled"}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {/* First Page */}
                    {currentPage > 3 && (
                      <>
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => paginate(1)}
                          >
                            1
                          </button>
                        </li>
                        {currentPage > 4 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                      </>
                    )}

                    {/* Page Numbers Around Current Page */}
                    {[...Array(totalPages)]
                      .map((_, index) => index + 1)
                      .filter(
                        (page) =>
                          page === currentPage ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                      )
                      .map((page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                    {/* Last Page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => paginate(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </li>
                      </>
                    )}

                    {/* Next Button */}
                    <li
                      className={`page-item ${
                        currentPage === totalPages && "disabled"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContentKementerianDanLembaga;
