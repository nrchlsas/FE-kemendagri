import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import "./../Kependudukan/kependudukan.scss";
import "leaflet/dist/leaflet.css";
import classnames from "classnames";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import MapIndoChart from "../../Components/MapIndo/MapIndoChart";
import VerticalBarChart from "../../Components/Chart/VerticalBarChart";
import HorizontalBarChart from "../../Components/Chart/HorizontalBarChart";
import CountUp from "react-countup";
import PieChartNew from "../../Components/Chart/PieChart";
import BarWithPercentageModified from "../../Components/Chart/BarWithPercentageModified";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/Pagination/Pagination";
import logoKemendikbud from "../../assets/images/logo-kemendagri/logo-kemendikbud.png";
import "./dapodik.scss";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const ContentDapodikV2 = () => {
  const [customActiveTab, setcustomActiveTab] = useState("2");
  const [customActiveTabAll, setcustomActiveTabAll] = useState("1");
  const [customActiveTabChartAnggaran, setcustomActiveTabChartAnggaran] =
    useState("1");
  const [customActiveTabTabel, setcustomActiveTabTabel] = useState("1");
  const [titleChartAnggaran, setTitleChartAnggaran] = useState("");

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const toggleCustomAll = (tab) => {
    if (customActiveTabAll !== tab) {
      setcustomActiveTabAll(tab);
    }
  };
  const toggleCustomTabel = (tab) => {
    if (customActiveTabTabel !== tab) {
      setcustomActiveTabTabel(tab);
    }
  };

  const toggleCustomChartAnggaran = (tab) => {
    if (customActiveTabChartAnggaran !== tab) {
      setcustomActiveTabChartAnggaran(tab);
    }
  };

  const [dataDapodik, setDataDapodik] = useState([]);
  const [dataTotalTkSdSmpSma, setDataTotalTkSdSmpSma] = useState([]);
  const [dataDropOutPaud, setDataDropOutPaud] = useState([]);
  const [dataDropOutSd, setDataDropOutSd] = useState([]);
  const [dataDropOutSmp, setDataDropOutSmp] = useState([]);
  const [dataDropOutSma, setDataDropOutSma] = useState([]);
  const [dataBelumPernahSekolahByUsia, setDataBelumPernahSekolahByUsia] =
    useState([]);
  const [dataChartAts, setDataChartAts] = useState([]);
  const [loadingDapodik, setLoadingDapodik] = useState([]);
  const [errorDapodik, setErrorDapodik] = useState([]);

  const [dataDapodikTabelSeProvinsi, setDataDapodikTabelSeProvinsi] = useState(
    []
  );
  const [dataDapodikTabelProvinsi, setDataDapodikTabelProvinsi] = useState([]);
  const [dataDapodikTabelKabupaten, setDataDapodikTabelKabupaten] = useState(
    []
  );
  const [loadingDapodikTabel, setLoadingDapodikTabel] = useState([]);
  const [errorDapodikTabel, setErrorDapodikTabel] = useState([]);

  const [dataChartRincianDapodik, setDataChartRincianDapodik] = useState([
    [],
    [],
  ]);
  const [dataChartRincianDapodikProvinsi, setDataChartRincianDapodikProvinsi] =
    useState([[], []]);
  const [
    dataChartRincianDapodikKabupaten,
    setDataChartRincianDapodikKabupaten,
  ] = useState([[], []]);

  const [dataSdMap, setDataSdMap] = useState([])
  const getDataDapodik = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({
          //   query:
          //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
          // }),
        };
        const response = await fetch(
          `${API_URI}/dashboard_dapodik`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDapodik = await response.json();

        setDataDapodik(dataDapodik.data);
        // const mappedDataPaud = Object.values(dataDapodik.data.dapodik_do_paud).filter(value => typeof value === 'number');

        const mappedDataSd = Object.values(
          dataDapodik.data.dapodik_do_sd
        ).filter((value) => typeof value === "number");
        setDataDropOutSd(mappedDataSd);

        const mappedDataSmp = Object.values(
          dataDapodik.data.dapodik_do_smp
        ).filter((value) => typeof value === "number");
        setDataDropOutSmp(mappedDataSmp);

        const mappedDataSma = Object.values(
          dataDapodik.data.dapodik_do_sma
        ).filter((value) => typeof value === "number");
        setDataDropOutSma(mappedDataSma);

        const mappedDataByUsia = Object.values(
          dataDapodik.data.dapodik_jumlah_belum_pernah_sekolah_by_usia
        ).filter((value) => typeof value === "number");
        setDataBelumPernahSekolahByUsia(mappedDataByUsia);

        const mappedDataAts = Object.values(
          dataDapodik.data.dapodik_compare_ats_tidak_lanjut
        ).filter((value) => typeof value === "number");
        setDataChartAts(mappedDataAts);

        const totalJumlahSiswa =
          dataDapodik.data.dapodik_jumlah_anak_sekolah.reduce(
            (acc, item) => acc + item.jumlah_siswa,
            0
          );
        console.log(totalJumlahSiswa, "ini total");
        setDataTotalTkSdSmpSma(totalJumlahSiswa);

        // setDataDropOutPaud(mappedDataPaud);

        const resultChartRincianDapodik =
          dataDapodik.data.cross_analisis_ats_seprovinsi.reduce(
            (acc, item) => {
              acc[0].push(item.nama_daerah);
              acc[1].push(item.persenats);
              acc[2].push(item.persenblj);
              acc[3].push(item.total_rincianall);
              acc[4].push(item.total_rincianursbid);
              return acc;
            },
            [[], [], [], [], []]
          );

        setDataChartRincianDapodik(resultChartRincianDapodik);

        const resultChartRincianDapodikProvinsi =
          dataDapodik.data.cross_analisis_ats_provinsi.reduce(
            (acc, item) => {
              acc[0].push(item.nama_daerah);
              acc[1].push(item.persenats);
              acc[2].push(item.persenblj);
              acc[3].push(item.total_rincianall);
              acc[4].push(item.total_rincianursbid);
              return acc;
            },
            [[], [], [], [], []]
          );
        setDataChartRincianDapodikProvinsi(resultChartRincianDapodikProvinsi);

        const resultChartRincianDapodikKabupaten =
          dataDapodik.data.cross_analisis_ats_kabkota.reduce(
            (acc, item) => {
              acc[0].push(item.nama_daerah);
              acc[1].push(item.persenats);
              acc[2].push(item.persenblj);
              acc[3].push(item.total_rincianall);
              acc[4].push(item.total_rincianursbid);
              return acc;
            },
            [[], [], [], [], []]
          );
        setDataChartRincianDapodikKabupaten(resultChartRincianDapodikKabupaten);
      } catch (errorDapodik) {
        setErrorDapodik(errorDapodik);
      } finally {
        setLoadingDapodik(false);
      }
    };
    fetchData();
  };

  const getDataTabelDapodikSeProv = (searchTerm) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Mengirimkan pencarian nama_kabkota berdasarkan searchTerm
            nama_prov: searchTerm ? searchTerm : "",
          }),
        };
        // /table_dapodik_provinsi
        // /table_dapodik_kabupaten
        // /table_stunting_provinsi
        const response = await fetch(
          `${API_URI}/tabel_dapodik_seprovinsi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDapodikTabelSeProvinsi = await response.json();

        const dataSd = dataDapodikTabelSeProvinsi.data.map(item => ({
          name: item.nama_prov,
          value: Number(item.sd)
        })                
        )

        console.log(dataSd, 'ini')

        setDataSdMap(dataSd);

        setDataDapodikTabelSeProvinsi(dataDapodikTabelSeProvinsi.data);
      } catch (errorDapodikTabel) {
        setErrorDapodikTabel(errorDapodikTabel);
      } finally {
        setLoadingDapodikTabel(false);
      }
    };
    fetchData();
  };

  const getDataTabelDapodikKab = (searchTerm) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Mengirimkan pencarian nama_kabkota berdasarkan searchTerm
            nama_kabkota: searchTerm ? searchTerm : "",
          }),
        };
        // /table_dapodik_provinsi
        // /table_dapodik_kabupaten
        // /table_stunting_provinsi
        const response = await fetch(
          `${API_URI}/tabel_dapodik_kabupaten`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDapodikTabelKabupaten = await response.json();

        setDataDapodikTabelKabupaten(dataDapodikTabelKabupaten.data);
      } catch (errorDapodikTabel) {
        setErrorDapodikTabel(errorDapodikTabel);
      } finally {
        setLoadingDapodikTabel(false);
      }
    };
    fetchData();
  };

  const getDataTabelDapodikProv = (searchTerm) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Mengirimkan pencarian nama_kabkota berdasarkan searchTerm
            nama_prov: searchTerm ? searchTerm : "",
          }),
        };
        // /table_dapodik_provinsi
        // /table_dapodik_kabupaten
        // /table_stunting_provinsi
        const response = await fetch(
          `${API_URI}/tabel_dapodik_provinsi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDapodikTabelProvinsi = await response.json();

        setDataDapodikTabelProvinsi(dataDapodikTabelProvinsi.data);
      } catch (errorDapodikTabel) {
        setErrorDapodikTabel(errorDapodikTabel);
      } finally {
        setLoadingDapodikTabel(false);
      }
    };
    fetchData();
  };

  const [dataDetailAnggaran, setDataDetailAnggaran] = useState([]);
  const [dataDetailAnggarnaSub, setDataDetailAnggaranSub] = useState([]);
  const [loadingDetailAnggaran, setLoadingDetailAnggaran] = useState([]);
  const [errorDetailAnggaran, setErrorDetailAnggaran] = useState([]);

  const getDataDetailAnggaran = (
    kodeSeProvinsi = "",
    kodeDdnKabupaten = "",
    kodeDdnProvinsi = "",
    kodeSubGiat = ""
  ) => {
    const fetchData = async () => {
      setLoadingDetailAnggaran(true); // Set loading state to true when starting the fetch
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kode_prov: kodeSeProvinsi,
            kode_ddn:
              kodeDdnKabupaten != "" ? kodeDdnKabupaten : kodeDdnProvinsi,
            kode_sub_giat: kodeSubGiat,
          }),
        };

        const response = await fetch(
          `${API_URI}/detail-tabel-dapodik`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDetailAnggaran = await response.json();

        if (kodeSeProvinsi != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran.data.detail_tabel_dapodik_seprovinsi
          );
          setModall(true);
        } else if (kodeDdnProvinsi != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran.data.detail_tabel_dapodik_byprovinsi
          );
          setModall(true);
        } else if (kodeDdnKabupaten != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran.data.detail_tabel_dapodik_bykabupaten
          );
          setModall(true);
        }

        if (kodeSeProvinsi != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran.data.detail_tabel_dapodik_seprovinsi_sro
          );
          setModal(true);
        } else if (kodeDdnProvinsi != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran.data.detail_tabel_dapodik_provinsi_sro
          );
          setModal(true);
        } else if (kodeDdnKabupaten != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran.data.detail_tabel_dapodik_provinsi_sro
          );
          setModal(true);
        }

        setCurrentPageDetail(1);
        setCurrentPageDetailSub(1);
        // Open the modal only after data is successfully fetched
      } catch (errorDetailAnggaran) {
        setErrorDetailAnggaran(errorDetailAnggaran);
      } finally {
        setLoadingDetailAnggaran(false);
      }
    };

    fetchData();
  };

  useEffect(() => {
    getDataTabelDapodikSeProv();
    getDataDapodik();
    getDataTabelDapodikProv();
    getDataTabelDapodikKab();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProvinsi, setCurrentPageProvinsi] = useState(1);
  const [currentPageKabupaten, setCurrentPageKabupaten] = useState(1);
  const [currentPageDetail, setCurrentPageDetail] = useState(1);
  const [currentPageDetailSub, setCurrentPageDetailSub] = useState(1);
  const [itemsPerPage] = useState(10);
  const [itemsPerPageDetail] = useState(10);
  const [itemsPerPageDetailSub] = useState(10); // Set items per page
  const [itemsPerPageProv] = useState(10); // Set items per page
  const [itemsPerPageKab] = useState(10); // Set items per page
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Calculate indexes for current page's data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const indexOfLastItemProvinsi = currentPageProvinsi * itemsPerPageProv;
  const indexOfFirstItemProvinsi = indexOfLastItemProvinsi - itemsPerPageProv;

  const indexOfLastItemKabupaten = currentPageKabupaten * itemsPerPageKab;
  const indexOfFirstItemKabupaten = indexOfLastItemKabupaten - itemsPerPageKab;

  const indexOfLastItemDetail = currentPageDetail * itemsPerPageDetail;
  const indexOfFirstItemDetail = indexOfLastItemDetail - itemsPerPageDetail;

  const indexOfLastItemDetailSub = currentPageDetailSub * itemsPerPageDetailSub;
  const indexOfFirstItemDetailSub =
    indexOfLastItemDetailSub - itemsPerPageDetailSub;

  // Sorting logic
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...(dataDapodikTabelSeProvinsi || [])];
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
  }, [dataDapodikTabelSeProvinsi, sortConfig]);

  const sortedItemsKabupaten = React.useMemo(() => {
    let sortableItems = [...(dataDapodikTabelKabupaten || [])];
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
  }, [dataDapodikTabelKabupaten, sortConfig]);

  const sortedItemsProvinsi = React.useMemo(() => {
    let sortableItems = [...(dataDapodikTabelProvinsi || [])];
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
  }, [dataDapodikTabelProvinsi, sortConfig]);

  const sortedItemsDetail = React.useMemo(() => {
    let sortableItems = [...(dataDetailAnggaran || [])];
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
  }, [dataDetailAnggaran, sortConfig]);

  const sortedItemsDetailSub = React.useMemo(() => {
    let sortableItems = [...(dataDetailAnggarnaSub || [])];
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
  }, [dataDetailAnggarnaSub, sortConfig]);

  // Slice the sorted data for the current page
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemProvinsi = sortedItemsProvinsi.slice(
    indexOfFirstItemProvinsi,
    indexOfLastItemProvinsi
  );
  const currentItemsKabupaten = sortedItemsKabupaten.slice(
    indexOfFirstItemKabupaten,
    indexOfLastItemKabupaten
  );

  const currentItemsDetail = sortedItemsDetail.slice(
    indexOfFirstItemDetail,
    indexOfLastItemDetail
  );
  const currentItemsDetailSub = sortedItemsDetailSub.slice(
    indexOfFirstItemDetailSub,
    indexOfLastItemDetailSub
  );

  // Calculate total number of pages
  const totalPages = Math.ceil(
    (dataDapodikTabelSeProvinsi?.length || 0) / itemsPerPage
  );
  const totalPagesProvinsi = Math.ceil(
    (dataDapodikTabelProvinsi?.length || 0) / itemsPerPage
  );
  const totalPagesKabupaten = Math.ceil(
    (dataDapodikTabelKabupaten?.length || 0) / itemsPerPage
  );
  const totalPagesDetail = Math.ceil(
    (dataDetailAnggaran?.length || 0) / itemsPerPage
  );
  const totalPagesDetailSub = Math.ceil(
    (dataDetailAnggarnaSub?.length || 0) / itemsPerPage
  );

  // Pagination change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateDetail = (pageNumber) => setCurrentPageDetail(pageNumber);
  const paginateDetailSub = (pageNumber) => setCurrentPageDetailSub(pageNumber);
  const paginateProvinsi = (pageNumber) => setCurrentPageProvinsi(pageNumber);
  const paginateKabupaten = (pageNumber) => setCurrentPageKabupaten(pageNumber);

  // Placeholder for empty rows if data is less than items per page
  const placeholders = Array.from(
    { length: itemsPerPage - currentItems.length },
    (_, index) => (
      <tr key={`placeholder-${index}`}>
        <td
          colSpan="13"
          style={{ height: "44px", backgroundColor: "#f9f9f9" }}
        ></td>
      </tr>
    )
  );
  const placeholdersKabupaten = Array.from(
    { length: itemsPerPage - currentItemsKabupaten.length },
    (_, index) => (
      <tr key={`placeholder-${index}`}>
        <td
          colSpan="13"
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

  const [dataShow, setDataShow] = useState(false);
  const handleShowData = (value) => {
    setDataShow(value);
  };

  // create Modal
  const [modall, setModall] = useState(false);
  const [modal, setModal] = useState(false);
  const [dataJenisPemda, setDataJenisPemda] = useState("");
  const [dataRincianDetail, setDataRincianDetail] = useState(0);
  const [dataRincianDetailSub, setDataRincianDetailSub] = useState(0);
  const handleOpen = (
    kodeProv,
    namaDaerah = "",
    kodeDdnKab = "",
    kodeDdnProv = "",
    jenisPemda = "",
    rincianDetail = 0
  ) => {
    getDataDetailAnggaran(kodeProv, kodeDdnKab, kodeDdnProv);

    if (jenisPemda == "prov") {
      setDataJenisPemda("prov");
    } else if (jenisPemda == "kab") {
      setDataJenisPemda("kab");
    } else if (jenisPemda == "kota") {
      setDataJenisPemda("kota");
    } else {
      setDataJenisPemda("seProv");
    }
    setDataDetailNamaDaerah(namaDaerah);
    setDataRincianDetail(rincianDetail);
    setCardHead(null);
  };

  const [cardhead, setCardHead] = useState();

  const handleOpenNextModal = (
    kodeDaerah,
    kodeSubGiat,
    kodeDdn,
    rincianDetail = ""
  ) => {
    if (kodeDaerah != "") {
      getDataDetailAnggaran(kodeDaerah, "", "", kodeSubGiat);
    } else if (kodeDdn != "") {
      getDataDetailAnggaran("", "", kodeDdn, kodeSubGiat);
    }
    // setModal(true);
    setDataRincianDetailSub(rincianDetail);
    setCardHead(null);
  };
  const handleCloseNextModal = () => {
    setModal(false);
  };

  const handleClose = () => {
    setModall(false); // Close modal by setting modall to false
  };

  const [dataDetailNamaDaerah, setDataDetailNamaDaerah] = useState("");

  const navigate = useNavigate();
  const handleDetailPage = (kodeProv, namaProv) => {
    navigate(`/sipdhub/dapodik/detail-anggaran-dapodik/${kodeProv}`);
  };

  const [searchTerm, setSearchTerm] = useState(""); // State untuk menampung nilai input search
  // useEffect(() => {
  //   getDataTabelDapodikKab(searchTerm);
  // }, [searchTerm]);

  // Fungsi untuk menangani perubahan pada input
  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value); // Memperbarui nilai input pencarian
  };

  const handleKeyDown = (e, area) => {
    if (e.key === "Enter") {
      if (area === "kabupaten") {
        getDataTabelDapodikKab(e.target.value); // Panggil API ketika tombol ditekan
      } else if (area === "provinsi") {
        getDataTabelDapodikProv(e.target.value);
      } else {
        getDataTabelDapodikSeProv(e.target.value);
      }
      setCurrentPage(1);
    }
  };

  // Fungsi untuk memanggil API ketika tombol ditekan
  const handleButtonClick = (area) => {
    if (area === "kabupaten") {
      getDataTabelDapodikKab(searchTerm); // Panggil API ketika tombol ditekan
    } else if (area === "provinsi") {
      getDataTabelDapodikProv(searchTerm);
    } else {
      getDataTabelDapodikSeProv(searchTerm);
    }
    setCurrentPage(1);
  };

  const handleClearSearch = (area = "") => {
    if (area === "kabupaten") {
      getDataTabelDapodikKab(); // Panggil API ketika tombol ditekan
    } else if (area === "provinsi") {
      getDataTabelDapodikProv();
    } else {
      getDataTabelDapodikSeProv();
    }
    setCurrentPage(1);
    setSearchTerm(""); // Kosongkan isi input
  };

  const [dataWidth, setDataWidth] = useState(6)  

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="card-custom">
            <div className="d-flex title-page">
              <div className="d-flex justify-content-center align-items-center avatar-sm">
                <span className="logo-sm">
                  <img src={logoKemendikbud} alt="" width="40" height="40" />
                </span>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>DAPODIK</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>      
      <Row>
        <Col md={dataWidth}>        
          <Card className="card-height-100">
            <CardBody>
            {dataWidth==6 ? (<><button onClick={()=>{
          setDataWidth(12)
        }}>
          Full Screen
        </button></>) : (<><button onClick={()=>{
          setDataWidth(6)
        }}>
          Back Screen
        </button></>)}        
              {/* <MapIndoChart />             */}
              <PolygonMaps />
            </CardBody>
          </Card>
        </Col>
        <Col md={dataWidth}>
          <Card className="card-height-100">
            <CardBody>
              <Row>
                <Col>
                  <Card className="card-animate card-height-100">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Anak Sekolah</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="ri-account-circle-line text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                // end={
                                //   dataDapodik?.dapodik_jumlah_anak_sekolah
                                //     ?.total_anak_sekolah
                                // }
                                end={dataTotalTkSdSmpSma}
                                separator="."
                                prefix=""
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
                {/* <Col md={6}> */}
                {/* <Card
                className="card-animate card-height-100"                
              >
                <CardBody>
                  <div className="d-flex flex-column title-custom-card">
                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                      <span>TK</span>
                      <span className="title-percent"></span>
                    </div>
                    <div className="d-flex">
                      <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                            <i className="ri-men-line text-info"></i>
                          </span>
                        </div>
                      <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                        <span>
                          <CountUp
                            start={0}
                            end={dataDapodik?.dapodik_jumlah_anak_sekolah?.tk}
                            separator="."
                            prefix=""
                            suffix=""
                            duration={3}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card> */}
                {/* </Col> */}
              </Row>
              <Row>
                {dataDapodik?.dapodik_jumlah_anak_sekolah
                  ?.slice(0, 2)
                  .map((item, index) => (
                    <Col md={6} key={`first-${index}`}>
                      <Card className="card-animate card-height-100">
                        <CardBody>
                          <div
                            className="d-flex flex-column title-custom-card"
                            
                          >
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>{item.bentuk_pendidikan}</span>
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
                                      item.jumlah_siswa
                                    }
                                    separator="."
                                    // prefix=""
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
                  ))}
              </Row>
              <Row>
                {dataDapodik?.dapodik_jumlah_anak_sekolah
                  ?.slice(2, 4)
                  .reverse()
                  .map((item, index) => (
                    <Col md={6} key={`second-${index}`}>
                      <Card className="card-animate card-height-100">
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>{item.bentuk_pendidikan}</span>
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
                                      item.jumlah_siswa
                                    }
                                    separator="."
                                    prefix=""
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
                  ))}
              </Row>
              {/* <Row>
                <Col md={4}>
                  <Card className="card-animate card-height-100">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                          <span>SD</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                            <i className=" ri-women-line text-danger"></i>
                          </span>
                        </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={
                                  dataDapodik?.dapodik_jumlah_anak_sekolah?.sd
                                }
                                separator="."
                                prefix=""
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
                <Col md={4}>
                  <Card className="card-animate card-height-100">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>SMP</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                            <i className="ri-home-8-line text-warning"></i>
                          </span>
                        </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={
                                  dataDapodik?.dapodik_jumlah_anak_sekolah?.smp
                                }
                                separator="."
                                prefix=""
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
                <Col md={4}>
                  <Card className="card-animate card-height-100">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                          <span>SMA</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                            <i className="ri-team-line text-warning"></i>
                          </span>
                        </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={
                                  dataDapodik?.dapodik_jumlah_anak_sekolah?.sma
                                }
                                separator="."
                                prefix=""
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
              </Row> */}
              {/* <Row>
            <Col md={6}>
              <Card
                className="card-animate card-height-100"                
              >
                <CardBody>
                  <div className="d-flex flex-column title-custom-card">
                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                      <span>SMA</span>
                    </div>
                    <div className="d-flex">
                      <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                            <i className="ri-team-line text-warning"></i>
                          </span>
                        </div>
                      <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                        <span>
                          <CountUp
                            start={0}
                            end={dataDapodik?.dapodik_jumlah_anak_sekolah?.sma}
                            separator="."
                            // prefix=""
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
            <Col md={6}>
              <Card
                className="card-animate card-height-100"                
              >
                <CardBody>
                  <div className="d-flex flex-column title-custom-card">
                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                      <span>UNIVERSITAS</span>
                    </div>
                    <div className="d-flex">
                      <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-success-subtle rounded-4 fs-3">
                            <i className="mdi mdi-arrow-expand text-success"></i>
                          </span>
                        </div>
                      <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                        <span>
                          <CountUp
                            start={0}
                            end={dataDapodik?.dapodik_jumlah_anak_sekolah?.univ}
                            separator="."
                            // prefix=""
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
          </Row> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Nav tabs className="nav nav-tabs nav-success nav-justified mb-3">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames("h-100", {
                      active: customActiveTabTabel === "1",
                    })}
                    onClick={() => {
                      toggleCustomTabel("1");
                      setSearchTerm("");
                    }}
                  >
                    NASIONAL
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames("h-100", {
                      active: customActiveTabTabel === "2",
                    })}
                    onClick={() => {
                      toggleCustomTabel("2");
                      setSearchTerm("");
                    }}
                  >
                    PROVINSI
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames("h-100", {
                      active: customActiveTabTabel === "3",
                    })}
                    onClick={() => {
                      toggleCustomTabel("3");
                      setSearchTerm("");
                    }}
                  >
                    KABUPATEN/KOTA
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={customActiveTabTabel}>
                <TabPane tabId="1" id="paud">
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
                          padding: "10px 30px 10px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                          width: "100%",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "16px",
                        }}
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchInput}
                        onKeyDown={(e) => handleKeyDown(e, "seprovinsi")}
                        placeholder="Cari Provinsi"
                      />

                      {/* Tombol "X" di dalam input */}
                      {searchTerm && (
                        <button
                          onClick={() => handleClearSearch("seprovinsi")}
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
                    <div>
                      <button
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                        onClick={() => handleButtonClick("seprovinsi")}
                      >
                        search
                      </button>
                    </div>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    {/* Render Table */}
                    <table
                      className="table table-bordered table-nowrap align-middle mb-0 custom-table"
                      style={{ width: "100%" }}
                    >
                      <thead className="table-light">
                        <tr>
                          <th
                            rowSpan="2"
                            style={{
                              cursor: "pointer",
                              verticalAlign: "middle",
                            }}
                          >
                            No
                          </th>
                          <th
                            rowSpan="2"
                            onClick={() => requestSort("nama_prov")}
                            style={{
                              cursor: "pointer",
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          >
                            Se-Provinsi {getSortIcon("nama_prov")}
                          </th>
                          <th
                            colSpan="4"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Anak Sekolah
                          </th>
                          <th colSpan="6" style={{ textAlign: "center" }}>
                            Anak Tidak Sekolah
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("totalanggaran")}
                          >
                            Total Anggaran (Rp){" "}
                            {getSortIcon("totalanggaran")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("total_pendidikan ")}
                          >
                            Total Anggaran Pendidikan (Rp){" "}
                            {getSortIcon("total_pendidikan ")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("persentase_anggaran")}
                          >
                            Persentase {" "}
                            {getSortIcon("persentase_anggaran")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            Detail Anggaran Pendidikan
                          </th>
                        </tr>
                        <tr>
                          <th
                            onClick={() => requestSort("sd")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SD {getSortIcon("sd")}
                          </th>
                          <th
                            onClick={() => requestSort("smp")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SMP {getSortIcon("smp")}
                          </th>
                          <th
                            onClick={() => requestSort("sma")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SMA {getSortIcon("sma")}
                          </th>
                          <th
                            onClick={() => requestSort("smk")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            SMK {getSortIcon("smk")}
                          </th>
                          <th
                            onClick={() => requestSort("totsd_do")}
                            style={{ cursor: "pointer" }}
                          >
                            Drop Out SD {getSortIcon("totsd_do")}
                          </th>
                          <th
                            onClick={() => requestSort("totsmp_do")}
                            style={{ cursor: "pointer" }}
                          >
                            Drop Out SMP {getSortIcon("totsmp_do")}
                          </th>
                          <th
                            onClick={() => requestSort("totsma_do")}
                            style={{ cursor: "pointer", borderRight: "2px solid #A9A9A9" }}
                          >
                            Drop Out SMA/SMK {getSortIcon("totsma_do")}
                          </th>
                          <th
                            onClick={() => requestSort("tkt_6_ltm")}
                            style={{ cursor: "pointer" }}
                          >
                            Tidak Lanjut ke SMP {getSortIcon("tkt_6_ltm")}
                          </th>
                          <th
                            onClick={() => requestSort("tkt_9_ltm")}
                            style={{ cursor: "pointer", borderRight: "2px solid #A9A9A9" }}
                          >
                            Tidak Lanjut ke SMA {getSortIcon("tkt_9_ltm")}
                          </th>
                          <th
                            onClick={() => requestSort("tkt_bpb")}
                            style={{ cursor: "pointer" }}
                          >
                            Anak Belum Pernah Bersekolah{" "}
                            {getSortIcon("tkt_bpb")}
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ minHeight: "500px" }}>
                        {currentItems.map((item, index) => (
                          <tr key={index}>
                            {/* <td>{item.kode_prop}</td> */}
                            <td
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {indexOfFirstItem + index + 1}
                            </td>
                            <td style={{ maxWidth: "250px" }}>
                              {" "}
                              {`${item.nama_prov}` || "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.sd
                                ? parseInt(item.sd).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.smp
                                ? parseInt(item.smp).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7ff" }} >
                              {item.sma
                                ? parseInt(item.sma).toLocaleString("id-ID")
                                : "-"}
                            </td >
                            <td style={{ backgroundColor: "#f7f7ff", borderRight: "2px solid #A9A9A9" }}>
                              {item.smk
                                ? parseInt(item.smk).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7f7" }}>
                              {item.totsd_do
                                ? parseInt(item.totsd_do).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7f7" }}>
                              {item.totsmp_do
                                ? parseInt(item.totsmp_do).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7f7", borderRight: "2px solid #A9A9A9" }}>
                              {item.totsma_do
                                ? parseInt(item.totsma_do).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7f7" }}>
                              {item.tkt_6_ltm
                                ? parseInt(item.tkt_6_ltm).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7f7", borderRight: "2px solid #A9A9A9" }}>
                              {item.tkt_9_ltm
                                ? parseInt(item.tkt_9_ltm).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7f7" }}>
                              {item.tkt_bpb
                                ? parseInt(item.tkt_bpb).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {item.totalanggaran
                                  ? parseInt(item.totalanggaran).toLocaleString(
                                      "id-ID"
                                    )
                                  : "-"}
                              </span>
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {item.total_pendidikan
                                  ? parseInt(item.total_pendidikan).toLocaleString(
                                      "id-ID"
                                    )
                                  : "-"}
                              </span>
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {`${item.persentase_anggaran
                                  ? parseInt(item.persentase_anggaran).toLocaleString(
                                      "id-ID"
                                    )
                                  : "-"}%`}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {/* <button
                                style={{
                                  backgroundColor: "#28a745",
                                  color: "white",
                                  padding: "5px 10px",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                }}
                                onClick={() =>
                                  handleOpen(
                                    item.kode_prov,
                                    item.nama_prov,
                                    "",
                                    "",
                                    "",
                                    item.totalanggaran
                                  )
                                }
                              >
                                Lihat Detail
                              </button> */}
                              <i
                                style={{
                                  padding: "5px 10px",
                                  cursor: "pointer",
                                  fontSize: "25px",
                                }}
                                onClick={() =>
                                  handleOpen(
                                    item.kode_prov,
                                    item.nama_prov,
                                    "",
                                    "",
                                    "",
                                    item.total_pendidikan
                                  )
                                }
                                className="bx bx-list-ul text-primary"
                              ></i>
                            </td>
                          </tr>
                        ))}
                        {placeholders}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                  />
                </TabPane>
                <TabPane tabId="2" id="">
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
                          padding: "10px 30px 10px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                          width: "100%",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "16px",
                        }}
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchInput}
                        onKeyDown={(e) => handleKeyDown(e, "provinsi")}
                        placeholder="Cari Provinsi"
                      />

                      {/* Tombol "X" di dalam input */}
                      {searchTerm && (
                        <button
                          onClick={() => handleClearSearch("provinsi")}
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
                    <div>
                      <button
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                        onClick={() => handleButtonClick("provinsi")}
                      >
                        search
                      </button>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    {/* Render Table */}
                    <table
                      className="table table-bordered table-nowrap align-middle mb-0 custom-table"
                      style={{ width: "100%" }}
                    >
                      <thead className="table-light">
                        <tr>
                          <th
                            rowSpan="2"
                            style={{
                              cursor: "pointer",
                              verticalAlign: "middle",
                            }}
                          >
                            No
                          </th>
                          <th
                            rowSpan="2"
                            onClick={() => requestSort("nama_prov")}
                            style={{
                              cursor: "pointer",
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          >
                            Provinsi {getSortIcon("nama_prov")}
                          </th>
                          <th
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Anak Sekolah
                          </th>
                          <th colSpan="2" style={{ textAlign: "center" }}>
                            Anak Tidak Sekolah
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("totalanggaran")}
                          >
                            Total Anggaran (Rp){" "}
                            {getSortIcon("totalanggaran")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("total_pendidikan ")}
                          >
                            Total Anggaran Pendidikan (Rp){" "}
                            {getSortIcon("total_pendidikan ")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("persentase_anggaran")}
                          >
                            Persentase {" "}
                            {getSortIcon("persentase_anggaran")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            Detail Anggaran Pendidikan
                          </th>
                        </tr>
                        <tr>
                          {/* <th
                        onClick={() => requestSort("sd")}
                        style={{ cursor: "pointer" }}
                      >
                        SD {getSortIcon("sd")}
                      </th>
                      <th
                        onClick={() => requestSort("smp")}
                        style={{ cursor: "pointer" }}
                      >
                        SMP {getSortIcon("smp")}
                      </th> */}
                          <th
                            onClick={() => requestSort("sma")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SMA {getSortIcon("sma")}
                          </th>
                          <th
                            onClick={() => requestSort("smk")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            SMK {getSortIcon("smk")}
                          </th>
                          {/* <th
                        onClick={() => requestSort("totsd_do")}
                        style={{ cursor: "pointer" }}
                      >
                        SD {getSortIcon("totsd_do")}
                      </th>
                      <th
                        onClick={() => requestSort("totsmp_do")}
                        style={{ cursor: "pointer" }}
                      >
                        SMP {getSortIcon("totsmp_do")}
                      </th> */}
                          <th
                            onClick={() => requestSort("totsma_do")}
                            style={{ cursor: "pointer", borderRight: "2px solid #A9A9A9", }}
                          >
                            Drop Out SMA/SMK {getSortIcon("totsma_do")}
                          </th>
                          {/* <th
                            onClick={() => requestSort("tkt_6_ltm")}
                            style={{ cursor: "pointer" }}
                          >
                            Tidak Lanjut ke SMP {getSortIcon("tkt_6_ltm")}
                          </th> */}
                          <th
                            onClick={() => requestSort("tkt_9_ltm")}
                            style={{ cursor: "pointer" }}
                          >
                            Tidak Lanjut ke SMA {getSortIcon("tkt_9_ltm")}
                          </th>
                          {/* <th
                            onClick={() => requestSort("tkt_bpb")}
                            style={{ cursor: "pointer" }}
                          >
                            Anak Belum Pernah Bersekolah{" "}
                            {getSortIcon("tkt_bpb")}
                          </th> */}
                        </tr>
                      </thead>
                      <tbody style={{ minHeight: "500px" }}>
                        {currentItemProvinsi.map((item, index) => (
                          <tr key={index}>
                            {/* <td>{item.kode_prop}</td> */}
                            <td
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {indexOfFirstItemProvinsi + index + 1}
                            </td>
                            <td style={{ maxWidth: "250px" }}>
                              {" "}
                              {item.nama_prov || "-"}
                            </td>
                            {/* <td>
                          {item.sd
                            ? parseInt(item.sd).toLocaleString("id-ID")
                            : "-"}
                        </td>
                        <td>
                          {item.smp
                            ? parseInt(item.smp).toLocaleString("id-ID")
                            : "-"}
                        </td> */}
                            <td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.sma
                                ? parseInt(item.sma).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ borderRight: "2px solid #A9A9A9", backgroundColor: "#f7f7ff" }}>
                              {item.smk
                                ? parseInt(item.smk).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            {/* <td>
                          {item.totsd_do
                            ? parseInt(item.totsd_do).toLocaleString("id-ID")
                            : "-"}
                        </td>
                        <td>
                          {item.totsmp_do
                            ? parseInt(item.totsmp_do).toLocaleString("id-ID")
                            : "-"}
                        </td> */}
                            <td style={{ backgroundColor: "#f7f7f7", borderRight: "2px solid #A9A9A9", }}>
                              {item.totsma_do
                                ? parseInt(item.totsma_do).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            {/* <td>
                              {item.tkt_6_ltm
                                ? parseInt(item.tkt_6_ltm).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td> */}
                            <td style={{ backgroundColor: "#f7f7f7" }}>
                              {item.tkt_9_ltm
                                ? parseInt(item.tkt_9_ltm).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            {/* <td>
                              {item.tkt_bpb
                                ? parseInt(item.tkt_bpb).toLocaleString("id-ID")
                                : "-"}
                            </td> */}
                            <td>
                              <span style={{ float: "right" }}>
                                {item.totalanggaran
                                  ? parseInt(item.totalanggaran).toLocaleString(
                                      "id-ID"
                                    )
                                  : "-"}
                              </span>
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {item.total_pendidikan
                                  ? parseInt(item.total_pendidikan).toLocaleString(
                                      "id-ID"
                                    )
                                  : "-"}
                              </span>
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {`${item.persentase_anggaran
                                  ? parseInt(item.persentase_anggaran).toLocaleString(
                                      "id-ID"
                                    )
                                  : "-"}%`}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {/* <button
                                style={{
                                  backgroundColor: "#28a745",
                                  color: "white",
                                  padding: "5px 10px",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                }}
                                onClick={() =>
                                  handleOpen(
                                    "",
                                    item.nama_prov,
                                    "",
                                    item.kode_ddn,
                                    item.jns_pemda,
                                    item.totalanggaran
                                  )
                                }
                              >
                                Lihat Detail
                              </button> */}
                              <i
                                style={{
                                  padding: "5px 10px",
                                  cursor: "pointer",
                                  fontSize: "25px",
                                }}
                                onClick={() =>
                                  handleOpen(
                                    "",
                                    item.nama_prov,
                                    "",
                                    item.kode_ddn,
                                    item.jns_pemda,
                                    item.total_pendidikan
                                  )
                                }
                                className="bx bx-list-ul text-primary"
                              ></i>
                            </td>
                          </tr>
                        ))}
                        {placeholders}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    currentPage={currentPageProvinsi}
                    totalPages={totalPagesProvinsi}
                    onPageChange={paginateProvinsi}
                  />
                </TabPane>
                <TabPane tabId="3" id="paud">
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
                          padding: "10px 30px 10px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                          width: "100%",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "16px",
                        }}
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchInput}
                        onKeyDown={(e) => handleKeyDown(e, "kabupaten")}
                        placeholder="Cari Kabupaten/Kota"
                      />

                      {/* Tombol "X" di dalam input */}
                      {searchTerm && (
                        <button
                          onClick={() => handleClearSearch("kabupaten")}
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
                    <div>
                      <button
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                        onClick={() => handleButtonClick("kabupaten")}
                      >
                        search
                      </button>
                    </div>
                  </div>
                  {/* <div className="mb-2">
                    <input
                      style={{
                        padding: "10px",
                        width: "100%",
                        maxWidth: "300px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        fontSize: "16px",
                        marginRight: "10px",
                      }}
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchInput}
                      onKeyDown={(e) => handleKeyDown(e, "kabupaten")}
                      placeholder="Cari Kabupaten/Kota..."
                    />
                    <button
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                      onClick={() => handleButtonClick("kabupaten")}
                    >
                      search
                    </button>
                  </div> */}
                  <div style={{ overflowX: "auto" }}>
                    {/* Render Table */}
                    <table
                      className="table table-bordered table-nowrap align-middle mb-0 custom-table"
                      style={{ width: "100%" }}
                    >
                      <thead className="table-light">
                        <tr>
                          <th
                            rowSpan="2"
                            style={{
                              cursor: "pointer",
                              verticalAlign: "middle",
                            }}
                          >
                            No
                          </th>
                          <th
                            rowSpan="2"
                            onClick={() => requestSort("nama_prov")}
                            style={{
                              cursor: "pointer",
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          >
                            Kabupaten/Kota {getSortIcon("nama_prov")}
                          </th>
                          <th
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Anak Sekolah
                          </th>
                          <th colSpan="4" style={{ textAlign: "center" }}>
                            Anak Tidak Sekolah
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("totalanggaran")}
                          >
                            Total Anggaran (Rp){" "}
                            {getSortIcon("totalanggaran")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("total_pendidikan ")}
                          >
                            Total Anggaran Pendidikan (Rp){" "}
                            {getSortIcon("total_pendidikan ")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("persentase_anggaran")}
                          >
                            Persentase {" "}
                            {getSortIcon("persentase_anggaran")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            Detail Anggaran Pendidikan
                          </th>
                        </tr>
                        <tr>
                          <th
                            onClick={() => requestSort("sd")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SD {getSortIcon("sd")}
                          </th>
                          <th
                            onClick={() => requestSort("smp")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            SMP {getSortIcon("smp")}
                          </th>
                          {/* <th
                        onClick={() => requestSort("sma")}
                        style={{ cursor: "pointer" }}
                      >
                        SMA {getSortIcon("sma")}
                      </th>
                      <th 
                        onClick={() => requestSort("smk")}
                        style={{ cursor: "pointer", borderRight: "2px solid #A9A9A9", }}
                      >
                        SMK {getSortIcon("smk")}
                      </th> */}
                          <th
                            onClick={() => requestSort("totsd_do")}
                            style={{ cursor: "pointer" }}
                          >
                            Drop Out SD {getSortIcon("totsd_do")}
                          </th>
                          <th
                            onClick={() => requestSort("totsmp_do")}
                            style={{ cursor: "pointer", borderRight: "2px solid #A9A9A9" }}
                          >
                            Drop Out SMP {getSortIcon("totsmp_do")}
                          </th>
                          {/* <th
                        onClick={() => requestSort("totsma_do")}
                        style={{ cursor: "pointer" }}
                      >
                        SMA/SMK {getSortIcon("totsma_do")}
                      </th> */}
                          <th
                            onClick={() => requestSort("tkt_6_ltm")}
                            style={{ cursor: "pointer", borderRight: "2px solid #A9A9A9" }}
                          >
                            Tidak Lanjut ke SMP {getSortIcon("tkt_6_ltm")}
                          </th>
                          {/* <th
                            onClick={() => requestSort("tkt_9_ltm")}
                            style={{ cursor: "pointer" }}
                          >
                            Tidak Lanjut ke SMA {getSortIcon("tkt_9_ltm")}
                          </th> */}
                          <th
                            onClick={() => requestSort("tkt_bpb")}
                            style={{ cursor: "pointer" }}
                          >
                            Anak Belum Pernah Bersekolah{" "}
                            {getSortIcon("tkt_bpb")}
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ minHeight: "500px" }}>
                        {currentItemsKabupaten.map((item, index) => (
                          <tr key={index}>
                            {/* <td>{item.kode_prop}</td> */}
                            <td
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {indexOfFirstItemKabupaten + index + 1}
                            </td>
                            <td style={{ maxWidth: "250px" }}>
                              {" "}
                              {item.nama_kabkota || "-"}
                            </td>
                            <td style={{
                                backgroundColor: "#f7f7ff"
                              }} >
                              {item.sd
                                ? parseInt(item.sd).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ borderRight: "2px solid #A9A9A9", backgroundColor: "#f7f7ff" }}>
                              {item.smp
                                ? parseInt(item.smp).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            {/* <td>
                          {item.sma
                            ? parseInt(item.sma).toLocaleString("id-ID")
                            : "-"}
                        </td>
                        <td  style={{borderRight: "2px solid #A9A9A9",}} >
                          {item.smk
                            ? parseInt(item.smk).toLocaleString("id-ID")
                            : "-"}
                        </td> */}
                            <td style={{ backgroundColor: "#f7f7f7" }}>
                              {item.totsd_do
                                ? parseInt(item.totsd_do).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7f7", borderRight: "2px solid #A9A9A9"}}>
                              {item.totsmp_do
                                ? parseInt(item.totsmp_do).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            {/* <td>
                          {item.totsma_do
                            ? parseInt(item.totsma_do).toLocaleString("id-ID")
                            : "-"}
                        </td> */}
                            <td style={{ backgroundColor: "#f7f7f7", borderRight: "2px solid #A9A9A9" }}>
                              {item.tkt_6_ltm
                                ? parseInt(item.tkt_6_ltm).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            {/* <td>
                              {item.tkt_9_ltm
                                ? parseInt(item.tkt_9_ltm).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td> */}
                            <td style={{ backgroundColor: "#f7f7f7" }}>
                              {item.tkt_bpb
                                ? parseInt(item.tkt_bpb).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {item.totalanggaran
                                  ? parseInt(item.totalanggaran).toLocaleString(
                                      "id-ID"
                                    )
                                  : "-"}
                              </span>
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {item.total_pendidikan
                                  ? parseInt(item.total_pendidikan).toLocaleString(
                                      "id-ID"
                                    )
                                  : "-"}
                              </span>
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {`${item.persentase_anggaran
                                  ? parseInt(item.persentase_anggaran).toLocaleString(
                                      "id-ID"
                                    )
                                  : "-"}%`}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {/* <button
                                style={{
                                  backgroundColor: "#28a745",
                                  color: "white",
                                  padding: "5px 10px",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  verticalAlign: "middle",
                                }}
                                onClick={() =>
                                  handleOpen(
                                    "",
                                    item.nama_kabkota,
                                    item.kode_ddn,
                                    "",
                                    item.jns_pemda,
                                    item.totalanggaran
                                  )
                                }
                              >
                                Lihat Detail
                              </button> */}
                              <i
                                style={{
                                  padding: "5px 10px",
                                  cursor: "pointer",
                                  fontSize: "25px",
                                }}
                                onClick={() =>
                                  handleOpen(
                                    "",
                                    item.nama_kabkota,
                                    item.kode_ddn,
                                    "",
                                    item.jns_pemda,
                                    item.total_pendidikan
                                  )
                                }
                                className="bx bx-list-ul text-primary"
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {placeholdersKabupaten}
                    </table>
                  </div>
                  <Pagination
                    currentPage={currentPageKabupaten}
                    totalPages={totalPagesKabupaten}
                    onPageChange={paginateKabupaten}
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="separator mb-2">
                <h4 className="card-title">
                  Perbandingan Total Anggaran Belanja Urusan Pendidikan
                  Berdasarkan Total Belanja Nasional
                </h4>
              </div>
              {dataShow ? (
                <>
                  <Row>
                    <Col md={6}>
                      <PieChartNew
                        dataChart={[
                          dataDapodik?.total_belanja_nasional -
                            dataDapodik?.total_belanja_bidang_urusan_pendidikan,
                          dataDapodik?.total_belanja_bidang_urusan_pendidikan,
                        ]}
                        dataColors={'["#2DAED4", "#FCAD24"]'}
                        categoryName={[
                          "Anggaran Di luar Pendidikan",
                          "Anggaran Pendidikan",
                        ]}
                        pieChart={false}
                        showLegend={true}
                        percentOnly={true}
                        legendHorizontal={false}
                        heightChart="350px"
                      />
                    </Col>
                    <Col md={6}>
                      <PieChartNew
                        dataChart={[
                          dataDapodik?.perbandingan_spm_vs_total_anggaran
                            ?.total_non_spm_pendidikan -
                            dataDapodik?.perbandingan_spm_vs_total_anggaran
                              ?.total_spm_pendidikan,
                          dataDapodik?.perbandingan_spm_vs_total_anggaran
                            ?.total_spm_pendidikan,
                        ]}
                        dataColors={'["#2DAED4", "#57E7B4"]'}
                        categoryName={[
                          "SPM Di Luar Bidang Pendidikan",
                          "SPM Bidang Pendidikan",
                        ]}
                        pieChart={false}
                        showLegend={true}
                        percentOnly={true}
                        legendHorizontal={false}
                        heightChart="350px"
                      />
                    </Col>
                  </Row>
                  <div className="mt-4 d-flex justify-content-center">
                    <span
                      onClick={() => handleShowData(false)}
                      style={{ cursor: "pointer", color: "#2DAED4" }}
                    >
                      Lihat Anggaran
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Row>
                    <Col>
                      <Row>
                        <Col>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex flex-column title-custom-card mb-2">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span>Total Belanja Nasional</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                      <i className="bx bx-cart text-info"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>
                                      <CountUp
                                        start={0}
                                        end={
                                          dataDapodik?.total_belanja_nasional /
                                          1000000000000
                                        }
                                        decimals={2}
                                        decimal=","
                                        separator="."
                                        prefix="Rp "
                                        suffix=" T"
                                        duration={3}
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex flex-column title-custom-card mb-2">
                                <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                  <span>
                                    Total Anggaran Belanja Urusan Pendidikan
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                      <i className="bx bx-money text-warning"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>
                                      <CountUp
                                        start={0}
                                        end={
                                          dataDapodik?.total_belanja_bidang_urusan_pendidikan /
                                          1000000000000
                                        }
                                        decimals={2}
                                        decimal=","
                                        separator="."
                                        prefix="Rp "
                                        suffix=" T"
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
                      <Row>
                        <Col md={6}>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex flex-column title-custom-card mb-2">
                                <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                  <span>Total Anggaran SPM</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                      <i className="bx bx-money text-warning"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>
                                      <CountUp
                                        start={0}
                                        end={
                                          dataDapodik?.total_anggaran_spm /
                                          1000000000000
                                        }
                                        decimals={2}
                                        decimal=","
                                        separator="."
                                        prefix="Rp "
                                        suffix=" T"
                                        duration={3}
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card className="card-animate">
                            <CardBody>
                              <div className="d-flex flex-column title-custom-card mb-2">
                                <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                  <span>Total SPM Bidang Pendidikan</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                      <i className="bx bx-money text-warning"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>
                                      <CountUp
                                        start={0}
                                        end={
                                          dataDapodik?.total_spm_bidang_pendidikan /
                                          1000000000000
                                        }
                                        decimals={2}
                                        decimal=","
                                        separator="."
                                        prefix="Rp "
                                        suffix=" T"
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
                    </Col>
                  </Row>
                  <div className="mt-4 d-flex justify-content-center">
                    <span
                      onClick={() => handleShowData(true)}
                      style={{ cursor: "pointer", color: "#2DAED4" }}
                    >
                      Lihat Grafik Perbandingan
                    </span>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="nav-beranda">
                
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
                      }}
                    >
                      ANAK TIDAK SEKOLAH KARENA DROP OUT
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
                      }}
                    >
                      ANAK TIDAK SEKOLAH KARENA TIDAK MELANJUTKAN KE JENJANG
                      PENDIDIKAN
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
                      }}
                    >
                      ANAK TIDAK SEKOLAH KARENA BELUM PERNAH BERSEKOLAH
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
                      }}
                    >
                      GRAFIK ALOKASI
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={customActiveTabAll} className="text-muted">
                <TabPane tabId="1" id="paud">
                  <h4 className="card-title mb-0 d-flex justify-content-center">
                    Anak Tidak Sekolah Karena Drop Out
                  </h4>
                  {/* <div className="separator">
              </div> */}
                  <div className="nav-beranda">
                    <Nav
                      tabs
                      className="nav nav-tabs-custom card-header-tabs border-bottom-0 ms-2 mb-3"
                    >
                      {/* <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTab === "1",
                          })}
                          onClick={() => {
                            toggleCustom("1");
                          }}
                        >
                          PAUD
                        </NavLink>
                      </NavItem> */}
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTab === "2",
                          })}
                          onClick={() => {
                            toggleCustom("2");
                          }}
                        >
                          SD
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
                          }}
                        >
                          SMP
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
                          }}
                        >
                          SMA/SMK
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTab}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="paud">
                      <VerticalBarChart
                        valueChart={dataDropOutPaud}
                        categoryChart={[
                          "TK-A",
                          "TK-B",
                          "Kelompok Belajar",
                          "Taman Pendidikan Al-Quran (TPA)",
                          "Satuan Paud Selain TK, KB, dan TPA",
                        ]}
                        dataColors='["#66CDAA"]'
                      />
                    </TabPane>
                    <TabPane tabId="2" id="sd">
                      <VerticalBarChart
                        valueChart={dataDropOutSd}
                        categoryChart={[
                          "Kelas 1",
                          "Kelas 2",
                          "Kelas 3",
                          "Kelas 4",
                          "Kelas 5",
                          "Kelas 6",
                        ]}
                        dataColors='["#F35F52"]'
                      />
                    </TabPane>
                    <TabPane tabId="3" id="smp">
                      <VerticalBarChart
                        valueChart={dataDropOutSmp}
                        categoryChart={["Kelas 7", "Kelas 8", "Kelas 9"]}
                        dataColors='["#7CCCE4"]'
                      />
                    </TabPane>
                    <TabPane tabId="4" id="sma/smk">
                      <VerticalBarChart
                        valueChart={dataDropOutSma}
                        categoryChart={[
                          "Kelas 10",
                          "Kelas 11",
                          "Kelas 12",
                          "kelas 13",
                        ]}
                        dataColors='["#808080"]'
                      />
                    </TabPane>
                  </TabContent>
                </TabPane>
                <TabPane tabId="2" id="sd">
                  {/* <div className="separator">
              </div>               */}
                  <h4 className="card-title mb-0 d-flex justify-content-center">
                    Anak Tidak Sekolah Karena Tidak Melanjutkan Ke Jenjang
                    Pendidikan
                  </h4>
                  <HorizontalBarChart
                    valueChart={dataChartAts}
                    categoryChart={["SMP", "SMA"]}
                    dataColors='["#7CCCE4", "#B0B0B0"]'
                  />
                </TabPane>

                <TabPane tabId="3" id="smp">
                  {/* <div className="separator ">
              </div> */}
                  <h4 className="card-title mb-0 d-flex justify-content-center">
                    Anak Tidak Sekolah Karena Belum Pernah Bersekolah
                  </h4>
                  <Row>
                    <Col md={2}>
                      <div style={{ marginTop: "30px" }}>
                        <div
                          className="card-title d-flex justify-content-start"
                          style={{ fontWeight: 600, fontSize: "12px" }}
                        >
                          Jumlah Anak Belum Pernah Bersekolah
                        </div>
                        <div
                          className="d-flex justify-content-start mb-3"
                          style={{ fontWeight: 700 }}
                        >
                          {dataDapodik?.dapodik_jumlah_belum_pernah_sekolah?.belum_pernah_sekolah?.toLocaleString(
                            "id-ID"
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md={10}>
                      <HorizontalBarChart
                        valueChart={dataBelumPernahSekolahByUsia}
                        categoryChart={[
                          "Usia 8",
                          "Usia 9",
                          "Usia 10",
                          "Usia 11",
                          "Usia 12",
                          "Usia 13",
                          "Usia 14",
                          "Usia 15",
                          "Usia 16",
                          "Usia 17",
                          "Usia 18",
                          "Usia 19",
                          "Usia 20",
                          "Usia 21",
                        ]}
                        dataColors='["#57E7B4"]'
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4" id="smp">
                  <h4 className="card-title mb-4 d-flex justify-content-center">
                    Persentase Anggaran {titleChartAnggaran} untuk Bidang Urusan
                    Pendidikan Dibandingkan dengan persentase Anak Tidak Sekolah
                  </h4>

                  <div className="nav-beranda">
                    <Nav
                      tabs
                      className="nav nav-tabs-custom card-header-tabs border-bottom-0 ms-2 mb-3"
                    >
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabChartAnggaran === "1",
                          })}
                          onClick={() => {
                            toggleCustomChartAnggaran("1");
                            setTitleChartAnggaran("Se-Provinsi");
                          }}
                        >
                          NASIONAL
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabChartAnggaran === "2",
                          })}
                          onClick={() => {
                            toggleCustomChartAnggaran("2");
                            setTitleChartAnggaran("Provinsi");
                          }}
                        >
                          PROVINSI
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabChartAnggaran === "3",
                          })}
                          onClick={() => {
                            toggleCustomChartAnggaran("3");
                            setTitleChartAnggaran("Kabupaten/Kota");
                          }}
                        >
                          KABUPATEN/KOTA
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTabChartAnggaran}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="nasional">
                      <BarWithPercentageModified
                        valueChart={dataChartRincianDapodik[4]}
                        categoryChart={dataChartRincianDapodik[0]}
                        percentageChart1={dataChartRincianDapodik[2]}
                        percentageChart2={dataChartRincianDapodik[1]}
                        axisY={["Total Anggaran", "Persentase"]}
                        additionalData={dataChartRincianDapodik[3]}
                        seProv={true}                        
                        dataColors='["#2DAED4", "#090909"]'
                      />
                    </TabPane>
                    <TabPane tabId="2" id="provinsi">
                      <BarWithPercentageModified
                        valueChart={dataChartRincianDapodikProvinsi[4]}
                        categoryChart={dataChartRincianDapodikProvinsi[0]}
                        percentageChart1={dataChartRincianDapodikProvinsi[2]}
                        percentageChart2={dataChartRincianDapodikProvinsi[1]}
                        axisY={["Total Anggaran", "Persentase"]}
                        additionalData={dataChartRincianDapodikProvinsi[3]}
                        dataColors='["#2DAED4", "#090909"]'                        
                      />
                    </TabPane>
                    <TabPane tabId="3" id="kabupaten">
                      <BarWithPercentageModified
                        valueChart={dataChartRincianDapodikKabupaten[4]}
                        categoryChart={dataChartRincianDapodikKabupaten[0]}
                        percentageChart1={dataChartRincianDapodikKabupaten[2]}
                        percentageChart2={dataChartRincianDapodikKabupaten[1]}
                        axisY={["Total Anggaran", "Persentase"]}
                        additionalData={dataChartRincianDapodikKabupaten[3]}
                        dataColors='["#2DAED4", "#090909"]'
                        kabupaten={true}                        
                      />
                    </TabPane>
                  </TabContent>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <div
            style={{
              backgroundColor: "#ffffff",
              borderLeft: "5px solid #007bff",
              padding: "15px",
              margin: "0 0 20px 0",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                marginBottom: "8px",
                fontSize: "12px" /* Ukuran font lebih kecil */,
                color: "#555",
                fontStyle: "italic",
                /* Menambahkan gaya italic */
              }}
            >
              Sumber Data:{" "}
              <span style={{ fontWeight: "bold" }}>
                {
                  dataDapodik.dapodik_jumlah_belum_pernah_sekolah_by_usia
                    ?.sumber
                }
              </span>
            </div>
            <div
              style={{
                fontSize: "12px" /* Ukuran font lebih kecil */,
                color: "#555",
                fontStyle: "italic" /* Menambahkan gaya italic */,
              }}
            >
              Update Data:{" "}
              {
                dataDapodik.dapodik_jumlah_belum_pernah_sekolah_by_usia
                  ?.update_data
              }
            </div>
          </div>
        </Col>
      </Row>

      {/* create modal */}
      <Modal
        size="xl"
        isOpen={modall}
        toggle={handleOpen}
        centered={true}
        backdrop="static"
      >
        <div className="modal-content border-0">
          <ModalHeader className=" p-3 bg-info-subtle" toggle={handleClose}>
            Detail Anggaran{" "}
            {dataJenisPemda == "prov"
              ? "Provinsi"
              : dataJenisPemda == "kota" || dataJenisPemda == "kab"
              ? "Daerah"
              : "Se-Provinsi"}{" "}
            {dataDetailNamaDaerah}
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
                        <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                          <span>
                            <CountUp
                              start={0}
                              end={
                                // dataDapodik?.dapodik_jumlah_anak_sekolah?.jumlah_siswa
                                dataRincianDetail
                              }
                              separator="."
                              // prefix=""
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
                <thead
                  className="table-light"
                  style={{ position: "sticky", top: 0, zIndex: 2 }}
                >
                  <tr>
                    <th
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      NO
                    </th>
                    {dataJenisPemda == "prov" ||
                    dataJenisPemda == "kab" ||
                    dataJenisPemda == "kota" ? (
                      <></>
                    ) : (
                      <>
                        {/* <th
                          onClick={() => requestSort("nama_daerah")}
                          style={{ cursor: "pointer", verticalAlign: "middle" }}
                        >
                          Nama Daerah {getSortIcon("nama_daerah")}
                        </th> */}
                      </>
                    )}

                    {/* <th style={{ textAlign: "center" }}>
                        Total Rincian
                      </th> */}
                    <th
                      onClick={() => requestSort("kode_sub_giat")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Kode Sub Giat {getSortIcon("kode_sub_giat")}
                    </th>
                    <th
                      onClick={() => requestSort("nama_sub_giat")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Nama Sub Giat {getSortIcon("nama_sub_giat")}
                    </th>
                    {/* <th onClick={() => requestSort("")}
                        style={{ cursor: "pointer", textAlign: "center" }}>
                        Rincian Sub Giat
                      </th>                       */}
                    <th
                      onClick={() => requestSort("total_rinciansub")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Total Rincian Sub Giat (Rp){" "}
                      {getSortIcon("total_rinciansub")}
                    </th>
                    <th
                      onClick={() => requestSort("persentase")}
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                      }}
                    >
                      Persentase {getSortIcon("persentase")}
                    </th>
                    <th>Lihat Sub Rincian Objek</th>
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemsDetail.map((item, index) => (
                    <tr key={index}>
                      {/* <td>{item.kode_prop}</td> */}
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        {index + 1}
                      </td>
                      {dataJenisPemda == "prov" ||
                      dataJenisPemda == "kab" ||
                      dataJenisPemda == "kota" ? (
                        <></>
                      ) : (
                        <>
                          {/* <td style={{ maxWidth: "250px" }}>
                            {" "}
                            {item.nama_prov || "-"} 
                          </td> */}
                        </>
                      )}
                      {/* <td>
                          Rp {item.total_rincian_daerah? parseInt(item.total_rincian_daerah).toLocaleString("id-ID")
                            : "-"}
                        </td> */}
                      <td>{item.kode_sub_giat}</td>
                      <td
                        style={{
                          whiteSpace: "normal", // Membolehkan teks turun ke baris berikutnya
                          wordWrap: "break-word", // Memastikan teks panjang terpotong dan turun ke bawah
                          maxWidth: "200px", // Menetapkan lebar maksimum sel (sesuaikan dengan kebutuhan)
                        }}
                      >
                        {item.nama_sub_giat}
                      </td>
                      {/* <td>
                         Rp {item.rincian_sub_giat ? parseInt(item.rincian_sub_giat).toLocaleString("id-ID")
                            : "-"}
                        </td> */}
                      <td>
                        <span style={{ float: "right" }}>
                          {item.total_rinciansub
                            ? parseInt(item.total_rinciansub).toLocaleString(
                                "id-ID"
                              )
                            : "-"}
                        </span>
                      </td>
                      <td>
                        <span style={{ float: "right" }}>
                          {item.persentase
                            ? item.persentase >= 1
                              ? `${Number(item.persentase).toLocaleString(
                                  "id-ID",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}%`
                              : `${Number(item.persentase).toLocaleString(
                                  "id-ID",
                                  {
                                    minimumFractionDigits: 4,
                                  }
                                )}%`
                            : "-"}
                        </span>
                      </td>
                      <td
                        style={{ verticalAlign: "middle", textAlign: "center" }}
                      >
                        {/* <button
                          style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                            position: "relative",
                            zIndex: 1, // pastikan z-index button lebih tinggi dari tabel jika sticky
                          }}
                          onClick={() =>
                            dataJenisPemda == "prov"
                              ? handleOpenNextModal(
                                  "",
                                  item.kode_sub_giat,
                                  item.kode_ddn,
                                  item.total_rinciansub
                                )
                              : dataJenisPemda == "kab" ||
                                dataJenisPemda == "kota"
                              ? handleOpenNextModal(
                                  "",
                                  item.kode_sub_giat,
                                  item.kode_ddn,
                                  item.total_rinciansub
                                )
                              : handleOpenNextModal(
                                  item.kode_prov,
                                  item.kode_sub_giat,
                                  "",
                                  item.total_rinciansub
                                )
                          }
                        >
                          Lihat Detail
                        </button> */}
                        <i
                          style={{
                            padding: "5px 10px",
                            cursor: "pointer",
                            fontSize: "25px",
                          }}
                          onClick={() =>
                            dataJenisPemda == "prov"
                              ? handleOpenNextModal(
                                  "",
                                  item.kode_sub_giat,
                                  item.kode_ddn,
                                  item.total_rinciansub
                                )
                              : dataJenisPemda == "kab" ||
                                dataJenisPemda == "kota"
                              ? handleOpenNextModal(
                                  "",
                                  item.kode_sub_giat,
                                  item.kode_ddn,
                                  item.total_rinciansub
                                )
                              : handleOpenNextModal(
                                  item.kode_prov,
                                  item.kode_sub_giat,
                                  "",
                                  item.total_rinciansub
                                )
                          }
                          className="bx bx-list-ul text-primary"
                        ></i>
                        {/* <span
                            onClick={()=>dataJenisPemda=="prov" ? handleOpenNextModal("", item.kode_sub_giat, item.kode_ddn) : (dataJenisPemda=="kab" || dataJenisPemda=="kota") ? handleOpenNextModal("", item.kode_sub_giat, item.kode_ddn) : handleOpenNextModal(item.kode_prov, item.kode_sub_giat, "")}
                            style={{ cursor: "pointer", color: "#2DAED4" }}
                          >
                            Lihat Detail               
                          </span> */}
                      </td>
                    </tr>
                  ))}
                  {placeholders}
                </tbody>
              </table>
            </div>
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
            Sub Rincian Objek
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
                                dataRincianDetailSub
                              }
                              separator="."
                              // prefix=""
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
                    {/* <th style={{ textAlign: "center" }}>
                        Total Rincian
                      </th> */}
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
                      Total Rincian (Rp) {getSortIcon("total_rinciansro")}
                    </th>
                    <th
                      onClick={() => requestSort("persentase")}
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                      }}
                    >
                      Persentase {getSortIcon("persentase")}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemsDetailSub.map((item, index) => (
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
                          {item.total_rinciansro
                            ? parseInt(item.total_rinciansro).toLocaleString(
                                "id-ID"
                              )
                            : "-"}
                        </span>
                      </td>
                      <td>
                        <span style={{ float: "right" }}>
                          {item.persentase
                            ? item.persentase >= 1
                              ? `${Number(item.persentase).toLocaleString(
                                  "id-ID",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}%`
                              : `${Number(item.persentase).toLocaleString(
                                  "id-ID",
                                  {
                                    minimumFractionDigits: 4,
                                  }
                                )}%`
                            : "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {placeholders}
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

      {/* <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="separator mb-2">
                <h4 className="card-title d-flex justify-content-start">
                  Persentase Anggaran untuk Bidang Urusan Pendidikan
                  Dibandingkan dengan persentase Anak Tidak Sekolah
                </h4>
              </div>
              <BarWithPercentageModified
                valueChart={dataChartRincianDapodik[4]}
                categoryChart={dataChartRincianDapodik[0]}
                percentageChart1={dataChartRincianDapodik[1]}
                percentageChart2={dataChartRincianDapodik[2]}
                axisY={["Total Anggaran", "Persentase"]}
                additionalData={dataChartRincianDapodik[3]}
                dataColors='["#2DAED4", "#090909"]'
              />
            </CardBody>
          </Card>
        </Col>
      </Row> */}
      {/* <Row>
        <Col md={6}>
        <Card>
          <CardBody>
            <Row>
              <Col>              
                <Card>
                  <CardBody>

                  </CardBody>
                </Card>              
              </Col>
            </Row>
            <Row>
              <Col md={6}>
              <Card>
                <CardBody>

                </CardBody>
              </Card>
              </Col>
              <Col md={6}>
              <Card>
                <CardBody>
                  
                </CardBody>
              </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
        </Col>
        <Col md={6}>
        <Card>
          <CardBody>

          </CardBody>
        </Card>
        </Col>
      </Row> */}

      {/* <Row>
        <Col md={6}>
          <Card className="card-animate card-height-100">
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  Anak Tidak Sekolah Karena Drop Out
                </h4>
              </div>
              <div className="nav-beranda">
                <Nav
                  tabs
                  className="nav nav-tabs nav-success nav-justified mb-3"
                >
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTab === "1",
                      })}
                      onClick={() => {
                        toggleCustom("1");
                      }}
                    >
                      PAUD
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
                      }}
                    >
                      SD
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
                      }}
                    >
                      SMP
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
                      }}
                    >
                      SMA/SMK
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={customActiveTab} className="text-muted">
                <TabPane tabId="1" id="paud">
                  <VerticalBarChart
                    valueChart={dataDropOutPaud}
                    categoryChart={[
                      "TK-A",
                      "TK-B",
                      "Kelompok Belajar",
                      "Taman Pendidikan Al-Quran (TPA)",
                      "Satuan Paud Selain TK, KB, dan TPA",
                    ]}
                    dataColors='["#66CDAA"]'
                  />
                </TabPane>
                <TabPane tabId="2" id="sd">
                  <VerticalBarChart
                    valueChart={dataDropOutSd}
                    categoryChart={[
                      "Kelas 1",
                      "Kelas 2",
                      "Kelas 3",
                      "Kelas 4",
                      "Kelas 5",
                      "Kelas 6",
                    ]}
                    dataColors='["#F35F52"]'
                  />
                </TabPane>
                <TabPane tabId="3" id="smp">
                  <VerticalBarChart
                    valueChart={dataDropOutSmp}
                    categoryChart={["Kelas 7", "Kelas 8", "Kelas 9"]}
                    dataColors='["#7CCCE4"]'
                  />
                </TabPane>
                <TabPane tabId="4" id="sma/smk">
                  <VerticalBarChart
                    valueChart={dataDropOutSma}
                    categoryChart={[
                      "Kelas 10",
                      "Kelas 11",
                      "Kelas 12",
                      "kelas 13",
                    ]}
                    dataColors='["#FCAD24"]'
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="card-animate card-height-100">
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  Anak Tidak Sekolah Karena Tidak Melanjutkan Ke Jenjang
                  Pendidikan
                </h4>
              </div>
              <HorizontalBarChart
                valueChart={dataChartAts}
                categoryChart={["SMP", "SMA"]}
                dataColors='["#FCAD24"]'
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="card-height-100">
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  Anak Tidak Sekolah Karena Belum Pernah Bersekolah
                </h4>
              </div>
              <Row>
                <Col md={2}>
                  <div style={{ marginTop: "30px" }}>
                    <div
                      className="card-title d-flex justify-content-start"
                      style={{ fontWeight: 600, fontSize: "12px" }}
                    >
                      Jumlah Anak Belum Pernah Bersekolah
                    </div>
                    <div
                      className="d-flex justify-content-start mb-3"
                      style={{ fontWeight: 700 }}
                    >
                      {dataDapodik?.dapodik_jumlah_belum_pernah_sekolah?.belum_pernah_sekolah?.toLocaleString(
                        "id-ID"
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={10}>
                  <HorizontalBarChart
                    valueChart={dataBelumPernahSekolahByUsia}
                    categoryChart={[
                      "Usia 8",
                      "Usia 9",
                      "Usia 10",
                      "Usia 11",
                      "Usia 12",
                      "Usia 13",
                      "Usia 14",
                      "Usia 15",
                      "Usia 16",
                      "Usia 17",
                      "Usia 18",
                      "Usia 19",
                      "Usia 20",
                      "Usia 21",
                    ]}
                    dataColors='["#57E7B4"]'
                  />                
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
    </React.Fragment>
  );
};

export default ContentDapodikV2;
