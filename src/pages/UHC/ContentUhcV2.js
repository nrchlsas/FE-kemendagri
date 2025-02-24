import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import "leaflet/dist/leaflet.css";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import "./../Kependudukan/kependudukan.scss";
import HorizontalBarChart from "../../Components/Chart/HorizontalBarChart";
import PieChartNew from "../../Components/Chart/PieChart";
import CountUp from "react-countup";
import Pagination from "../../Components/Pagination/Pagination";
import classnames from "classnames";
import MapIndoChart from "../../Components/MapIndo/MapIndoChart";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;
const ContentUhcV2 = () => {

  const [selectedDesil, setSelectedDesil] = useState("1"); // State untuk menyimpan pilihan dropdown
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const selectedValue = value;
    setSelectedDesil(selectedValue); // Update state dengan pilihan yang dipilih
    // if(selectedValue == "5"){
    //   setTitleMap(`Keluarga Berisiko Stunting ${name} >4`)
    // }else{
    //   setTitleMap(`Keluarga Berisiko Stunting ${name} ${value}`)
    // }
  
    // Ambil data desil yang sesuai dan update valueMap
    const selectedData = dataPeserta[`bpjs${selectedValue}`]; // Ambil data sesuai pilihan
    console.log(selectedData,'ini')
    if (selectedData) {
      setValueMap(selectedData);
      const maxValue = Math.max(...selectedData.map(item => item.value));
      setmaxValueMap(maxValue);
    }
  };

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const [titleMap, setTitleMap] = useState("Total Peserta Aktif")
  const [valueMap, setValueMap] = useState([]);
  const [maxValueMap, setmaxValueMap] = useState(0)
  const [dataWidth, setDataWidth] = useState(6)  
  const [roam, setRoam] = useState(false);
  const [dataUhc, setDataUhc] = useState([]);
  const [dataCategoryChartPembiayaan, setDataCategoryChartPembiayaan] = useState([])
  const [dataValueChartPembiayaan, setDataValueChartPembiayaan] = useState([])
  const [dataChartGender, setDataChartGender] = useState([[], []])
  const [loadingUhc, setLoadingUhc] = useState([]);
  const [errorUhc, setErrorUhc] = useState([]);

  const getDataUhc = ({tahun, tahun_data, kodeProv, kodeDdn}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_ddn: kodeDdn,
            kode_prov: kodeProv,
            tahun: tahun,
            tahun_data: tahun_data
          }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/v2/dashboard_uhc`,
          requestOptions
        );
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataUhc = await response.json();

        setDataUhc(dataUhc.data); 
        // const categoryPembiayaan = Object.keys(dataUhc.data.uhc_pembiayaan);
        // const valuePembiayaan = Object.values(dataUhc.data.uhc_pembiayaan);

        // setDataCategoryChartPembiayaan(categoryPembiayaan)
        // setDataValueChartPembiayaan(valuePembiayaan)

        // const dataGender = [dataUhc.data.uhc_jumlah_belum_masuk_bpjs.laki, dataUhc.data.uhc_jumlah_belum_masuk_bpjs.perempuan]
        // console.log(dataGender)
        // setDataChartGender(dataGender)

      } catch (errorUhc) {
        setErrorUhc(errorUhc);
      } finally {
        setLoadingUhc(false);
      }
    };
    fetchData();
  };

  const [dataBpjsTabelSeprov, setDataBpjsTabelSeprov] = useState([])
  const [loadingBpjsTabel, setLoadingBpjsTabel] = useState([]);
  const [errorBpjsTabel, setErrorBpjsTabel] = useState([]);
  const [showNextData, setShowNextData] = useState(false);
  const [dataPeserta, setDataPeserta] = useState([])
  const [filteredDataUhcTabel, setFilteredDataUhcTabel] = useState([]); // Data hasil filter
  const [filteredDataUhcTabelKabupaten, setFilteredDataUhcTabelKabupaten] = useState([]); // Data hasil filter

  const getDataTabelBpjsSeprov = ({tahun, tahun_data}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            // Mengirimkan pencarian nama_kabkota berdasarkan searchTerm
            tahun: tahun,
            tahun_data: tahun_data
          }),
        };
        // /table_Bpjs_provinsi
        // /table_Bpjs_kabupaten
        // /table_stunting_provinsi
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_bpjs_seprov`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataBpjsTabelSeprov = await response.json();
        setDataBpjsTabelSeprov(dataBpjsTabelSeprov?.data);
        setFilteredDataUhcTabel(dataBpjsTabelSeprov?.data)

        // Proses data
        const dataPeserta = {
          bpjs1: Array.isArray(dataBpjsTabelSeprov?.data)
            ? dataBpjsTabelSeprov.data.map(item => ({
                name: item?.nama || "Unknown",
                value: item?.total_bpjs || 0,
              }))
            : [],
          bpjs2: Array.isArray(dataBpjsTabelSeprov?.data)
            ? dataBpjsTabelSeprov.data.map(item => ({
                name: item?.nama || "Unknown",
                value: item?.jumlah_non_aktif || 0,
              }))
            : [],
        };
      
        // Simpan data peserta dan set map value
        setDataPeserta(dataPeserta);
        setValueMap(dataPeserta.bpjs1);
      
        // Hitung nilai maksimum
        const maxValue = Array.isArray(dataPeserta.bpjs1) && dataPeserta.bpjs1.length > 0
          ? Math.max(...dataPeserta.bpjs1.map(item => item.value || 0))
          : 0;
        setmaxValueMap(maxValue);
      
        // Ubah state lain
        setShowNextData(false);
        
      } catch (errorBpjsTabel) {
        setErrorBpjsTabel(errorBpjsTabel);
      } finally {
        setLoadingBpjsTabel(false);
      }
    };
    fetchData();
  };

  const [dataBpjsTabelKabupaten, setDataBpjsTabelKabupaten] = useState([])
  const [loadingBpjsTabelKabupaten, setLoadingBpjsTabelKabupaten] = useState([]);
  const [errorBpjsTabelKabupaten, setErrorBpjsTabelKabupaten] = useState([]);
  

  const getDataTabelBpjsKabupaten = ({kodeDdn = "", tahun, tahun_data}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_ddn: kodeDdn,
            tahun: tahun,
            tahun_data: tahun_data
            // Mengirimkan pencarian nama_kabkota berdasarkan searchTerm
          }),
        };
        // /table_Bpjs_provinsi
        // /table_Bpjs_kabupaten
        // /table_stunting_provinsi
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_bpjs_provkabkota`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataBpjsTabelKabupaten = await response.json();
        setShowNextData(true)   
        setDataBpjsTabelSeprov(dataBpjsTabelKabupaten?.data);
        setFilteredDataUhcTabelKabupaten(dataBpjsTabelKabupaten?.data);

        // Proses data
        const dataPeserta = {
          bpjs1: Array.isArray(dataBpjsTabelKabupaten?.data)
            ? dataBpjsTabelKabupaten.data.map(item => ({
              id:item.kode_ddn,
                name: item?.nama || "Unknown",
                value: item?.total_bpjs || 0,
              }))
            : [],
          bpjs2: Array.isArray(dataBpjsTabelKabupaten?.data)
            ? dataBpjsTabelKabupaten.data.map(item => ({
              id:item.kode_ddn,
                name: item?.nama || "Unknown",
                value: item?.jumlah_non_aktif || 0,
              }))
            : [],
        };
      
        // Simpan data peserta dan set map value
        setDataPeserta(dataPeserta);
        setValueMap(dataPeserta.bpjs1);
      
        // Hitung nilai maksimum
        const maxValue = Array.isArray(dataPeserta.bpjs1) && dataPeserta.bpjs1.length > 0
          ? Math.max(...dataPeserta.bpjs1.map(item => item.value || 0))
          : 0;
        setmaxValueMap(maxValue);
      
        // Ubah state lain
      } catch (errorBpjsTabelKabupaten) {
        setErrorBpjsTabelKabupaten(errorBpjsTabelKabupaten);
      } finally {
        setLoadingBpjsTabelKabupaten(false);
      }
    };
    fetchData();
  };

  const [dataDetailAnggaran, setDataDetailAnggaran] = useState([])
  const [dataDetailAnggaranFiltered, setDataDetailAnggaranFiltered] = useState([])
  const [loadingDetailAnggaran, setLoadingDetailAnggaran] = useState([]);
  const [errorDetailAnggaran, setErrorDetailAnggaran] = useState([]);
  const [dataDetailAnggaranSub, setDataDetailAnggaranSub] = useState([]);
  const [dataDetailAnggaranSubFiltered, setDataDetailAnggaranSubFiltered] = useState([]);
  const [loadingDetailAnggaranSub, setLoadingDetailAnggaranSub] = useState([]);
  const [errorDetailAnggaranSub, setErrorDetailAnggaranSub] = useState([]);

  const getDataDetailAnggaran = ({kodeDdn="", tahun, tahun_data}) => {
    const fetchData = async () => {
      setLoadingDetailAnggaran(true); // Set loading state to true when starting the fetch
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({            
            kode_ddn: kodeDdn,      
            tahun: tahun,
            tahun_data: tahun_data      
          }),
        };
  
        const response = await fetch(
          `${API_URI_RBAC}/v2/dashboard_uhc_sub_giat`,
          requestOptions
        );
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const dataDetailAnggaran = await response.json();
        setDataDetailAnggaran(dataDetailAnggaran?.data?.uhc_sub_giat)
        setDataDetailAnggaranFiltered(dataDetailAnggaran?.data?.uhc_sub_giat)
        setCurrentPageDetail(1)
        setCurrentPageDetailSub(1)
        // Open the modal only after data is successfully fetched
        setModall(true);
      } catch (errorDetailAnggaran) {
        setErrorDetailAnggaran(errorDetailAnggaran);
      } finally {
        setLoadingDetailAnggaran(false);
      }
    };
  
    fetchData();
  };

  const getDataDetailAnggaranSub = ({kodeDdn="", kodeSubGiat="", tahun, tahun_data}) => {
    const fetchData = async () => {
      setLoadingDetailAnggaranSub(true); // Set loading state to true when starting the fetch
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({            
            kode_ddn: kodeDdn,
            kode_sub_giat: kodeSubGiat,
            tahun: tahun,
            tahun_data: tahun_data
          }),
        };
  
        const response = await fetch(
          `${API_URI_RBAC}/v2/dashboard_uhc_sro`,
          requestOptions
        );
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const dataDetailAnggaranSub = await response.json();    
        setDataDetailAnggaranSub(dataDetailAnggaranSub?.data?.uhc_sro)    
        setDataDetailAnggaranSubFiltered(dataDetailAnggaranSub?.data?.uhc_sro)    
        setCurrentPageDetail(1)
        setCurrentPageDetailSub(1)
        // Open the modal only after data is successfully fetched
        setModal(true)
      } catch (errorDetailAnggaranSub) {
        setErrorDetailAnggaranSub(errorDetailAnggaranSub);
      } finally {
        setLoadingDetailAnggaranSub(false);
      }
    };
  
    fetchData();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageKab, setCurrentPageKab] = useState(1);
  const [currentPageDetail, setCurrentPageDetail] = useState(1);
  const [currentPageDetailSub, setCurrentPageDetailSub] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page
  const [itemsPerPageKab] = useState(10); // Set items per page  
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;	

  const indexOfLastItemKab = currentPageKab * itemsPerPageKab;
  const indexOfFirstItemKab = indexOfLastItemKab - itemsPerPageKab;	

  const indexOfLastItemDetail = currentPageDetail * itemsPerPage;
  const indexOfFirstItemDetail = indexOfLastItemDetail - itemsPerPage;

  const indexOfLastItemDetailSub = currentPageDetailSub * itemsPerPage;
  const indexOfFirstItemDetailSub = indexOfLastItemDetailSub - itemsPerPage;

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...((showNextData ? filteredDataUhcTabelKabupaten : filteredDataUhcTabel)  || [])];
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
  }, [showNextData ? filteredDataUhcTabelKabupaten : filteredDataUhcTabel, sortConfig]);

  const sortedItemsKab = React.useMemo(() => {
    let sortableItems = [...(dataBpjsTabelKabupaten || [])];
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
  }, [dataBpjsTabelKabupaten, sortConfig]);  

  const sortedItemsDetail = React.useMemo(() => {
    let sortableItems = [...(dataDetailAnggaranFiltered || [])];
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
  }, [dataDetailAnggaranFiltered, sortConfig]);

  const sortedItemsDetailSub = React.useMemo(() => {
    let sortableItems = [...(dataDetailAnggaranSubFiltered || [])];
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
  }, [dataDetailAnggaranSubFiltered, sortConfig]);

  
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);  
  const currentItemsKab = sortedItemsKab.slice(indexOfFirstItemKab, indexOfLastItemKab);
  const currentItemDetail = sortedItemsDetail.slice(indexOfFirstItemDetail, indexOfLastItemDetail);
  const currentItemDetailSub = sortedItemsDetailSub.slice(indexOfFirstItemDetailSub, indexOfLastItemDetailSub);
  
  const totalPages = Math.ceil(((showNextData ? filteredDataUhcTabelKabupaten?.length : filteredDataUhcTabel?.length) || 0) / itemsPerPage);
  const totalPagesKab = Math.ceil((dataBpjsTabelKabupaten?.length || 0) / itemsPerPage);
  const totalPagesDetail = Math.ceil((dataDetailAnggaranFiltered?.length || 0) / itemsPerPage);
  const totalPagesDetailSub = Math.ceil((dataDetailAnggaranSubFiltered?.length || 0) / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateKab = (pageNumber) => setCurrentPageKab(pageNumber);
  const paginateDetail = (pageNumber) => setCurrentPageDetail(pageNumber);
  const paginateDetailSub = (pageNumber) => setCurrentPageDetailSub(pageNumber);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Determine which icon to show for sorting using Unicode
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "↕"; // Default icon for unsorted
  };

  const [modall, setModall] = useState(false)
  const [modal, setModal] = useState(false)
  const [dataRincianDetail, setDataRincianDetail] = useState(0)
  const [dataRincianDetailSub, setDataRincianDetailSub] = useState(0)
  const [dataJenisPemda, setDataJenisPemda] = useState("")
  const [dataDetailNamaDaerah, setDataDetailNamaDaerah] = useState('')
  const handleOpen = ({kodeDdn="", rincianDetail= 0, namaDaerah=""}) => {
    getDataDetailAnggaran({kodeDdn: kodeDdn, tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData })      
    setDataRincianDetail(rincianDetail)
    setDataDetailNamaDaerah(namaDaerah)
    setCardHead(null)
  }

  const [cardhead, setCardHead] = useState()
  const [namaDaerahDetail, setNamaDaerahDetail] = useState("")
  const [namaSubGiat, setNamaSubGiat] = useState("")

  const handleOpenNextModal = ({kodeDdn="", kodeSubGiat="", rincianDetail= 0, namaSubGiat=""}) => {    
    getDataDetailAnggaranSub({kodeDdn: kodeDdn, kodeSubGiat: kodeSubGiat, tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData})
    // setModal(true)
    setDataRincianDetailSub(rincianDetail)
    setNamaSubGiat(namaSubGiat)
    setCardHead(null)
  }
  const handleCloseNextModal = () => {
    setModal(false)
  }

  const handleClose = () => {
    setModall(false); // Close modal by setting modall to false
  };

    const [searchTerm, setSearchTerm] = useState(""); 
    const [searchTermDetail, setSearchTermDetail] = useState(""); 
    const [searchTermDetailSub, setSearchTermDetailSub] = useState(""); 
    const [searchTermDetailSubSub, setSearchTermDetailSubSub] = useState(""); 
      const handleSearchInput = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        if (value === "") {
          if(showNextData){
            setFilteredDataUhcTabelKabupaten(dataBpjsTabelSeprov)
          }else{
            setFilteredDataUhcTabel(dataBpjsTabelSeprov);
          }
        } else {
          // Filter data berdasarkan input
          const filtered = dataBpjsTabelSeprov.filter((item) => {
            if(showNextData){
              return item.nama_daerah.toLowerCase().includes(value)
            }else{
              return item.nama.toLowerCase().includes(value)
            }
          }
          );
          showNextData ? setFilteredDataUhcTabelKabupaten(filtered) : setFilteredDataUhcTabel(filtered)
        }
        setCurrentPage(1)
      };
    
      const handleButtonClick = (area) => {
        setCurrentPage(1);
      };
    
      const handleClearSearch = (area = "") => {
        showNextData ? setFilteredDataUhcTabelKabupaten(dataBpjsTabelSeprov) : setFilteredDataUhcTabel(dataBpjsTabelSeprov)
        setCurrentPage(1);
        // setCurrentPageKabupaten(1);
        setSearchTerm(""); // Kosongkan isi input
      };

      const handleSearchInputDetail = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTermDetail(value);
        if (value === "") {
          setDataDetailAnggaranFiltered(dataDetailAnggaran)
        } else {
          // Filter data berdasarkan input
          const filtered = dataDetailAnggaran.filter((item) => {
            return item.nama_sub_giat.toLowerCase().includes(value)
          }
          );
          setDataDetailAnggaranFiltered(filtered)
        }
        setCurrentPageDetail(1);
      };
      
      const handleClearSearchDetail = (area = "") => {
        setDataDetailAnggaranFiltered(dataDetailAnggaran)
        setCurrentPageDetail(1);
        // setCurrentPageKabupaten(1);
        setSearchTermDetail(""); // Kosongkan isi input
      };
    
      const handleSearchInputDetailSub = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTermDetailSub(value);
        if (value === "") {
          setDataDetailAnggaranSubFiltered(dataDetailAnggaranSub)
        } else {
          // Filter data berdasarkan input
          const filtered = dataDetailAnggaranSub.filter((item) => {
            return item.nama_sro.toLowerCase().includes(value)
          }
          );
          setDataDetailAnggaranSubFiltered(filtered)
        }
        setCurrentPageDetail(1);
      };
      
      const handleClearSearchDetailSub = (area = "") => {
        setDataDetailAnggaranSubFiltered(dataDetailAnggaranSub)
        setCurrentPageDetail(1);
        // setCurrentPageKabupaten(1);
        setSearchTermDetailSub(""); // Kosongkan isi input
      };
  
      const handleKeyDown = (e, area) => {

      };

  const [dataShowChartAnggaran, setDataShowChartAnggaran] = useState(false);
  const [customActiveTabBelanja, setcustomActiveTabBelanja] = useState("1");
  const toggleCustomBelanja = (tab) => {
    if (customActiveTabBelanja !== tab) {
      setcustomActiveTabBelanja(tab);
    }
  };
  
  const [selectedSingleTahunAnggaran, setSelectedSingleTahunAnggaran] = useState('2025'); // Set default value
  const [selectedSingleTahunData, setSelectedSingleTahunData] = useState('2024'); // Set default value

  const handleSelectChangeAnggaran = (e) => {
    const { value } = e.target;
    const newTahunData = (parseInt(value) - 1).toString();
    setSelectedSingleTahunAnggaran(value);
    setSelectedSingleTahunData(newTahunData);
  
    getDataUhc({ kodeDdn:"", kodeProv:kodeWilayahPeta, tahun: value, tahun_data: newTahunData });
    getDataTabelBpjsSeprov({ tahun: value, tahun_data: newTahunData });
  };
  
  const handleSelectChangeDataPokok = (e) => {
    const { value } = e.target;
    const newTahunAnggaran = (parseInt(value) + 1).toString();
    setSelectedSingleTahunData(value);
    setSelectedSingleTahunAnggaran(newTahunAnggaran);
  
    getDataUhc({ kodeDdn:"", kodeProv:kodeWilayahPeta, tahun: newTahunAnggaran, tahun_data: value });
    getDataTabelBpjsSeprov({ tahun: newTahunAnggaran, tahun_data: value });
  };
  
  
    const [clickDaerah, setClickDaerah] = useState(false)
    const [clickNamaDaerah, setClickNamaDaerah] = useState("")
    const [kodeWilayahPeta, setKodeWilayahPeta]=useState("")  
    const handleRegionClick = (kodeProv, namaProv) => {
      getDataUhc({kodeDdn:"", kodeProv:kodeProv, tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData});
      getDataTabelBpjsKabupaten({kodeDdn: kodeProv, tahun:selectedSingleTahunAnggaran, tahun_data:selectedSingleTahunData});
      setKodeWilayahPeta(kodeProv)
      setClickNamaDaerah(namaProv)
      setNamaDaerahDetail(namaProv)
      setClickDaerah(true)
    };

    const handleKabKotaClick = (kodeProv, namaProv) => {
      getDataUhc({kodeDdn:kodeProv, kodeProv:"", tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData});
      setKodeWilayahPeta(kodeProv)
      setClickNamaDaerah(namaProv)
    };
  
  
    const resetRegionClick = () => {
      getDataUhc({kodeDdn:"", kodeProv:"", tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData});
      getDataTabelBpjsSeprov({tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData});
      setClickDaerah(false)
    }
  

  useEffect(() => {
    getDataUhc({kodeDdn:"", kodeProv:"", tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData});
    getDataTabelBpjsSeprov({tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData});
    // getDataTabelBpjsKabupaten()
  }, []);

   useEffect(() => {
      const handleEscKey = (event) => {
        if (event.key === "Escape") {
          handleClose()
          handleCloseNextModal()
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
          <Card className="card-custom ">
          <div className="d-flex justify-content-between">
            <div className="d-flex title-page">
              <div className="avatar-sm">
                <i className="ri-account-circle-line text-dark fs-1"></i>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>BPJS Kesehatan</span>
              </div>
            </div>
            <div className="d-flex nav-beranda">
            <div className="d-flex justify-content-center align-items-center" style={{ fontSize: "14px", fontWeight:600, fontFamily: "poppins" }}>
                    Tahun Data:
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
                margin: "15px 15px 15px 5px",
              }}
              value={selectedSingleTahunData}
              onChange={handleSelectChangeDataPokok}
            >                
              <option value="2023">2023</option>        
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            <div className="d-flex justify-content-center align-items-center" style={{ fontSize: "14px", fontWeight:600, fontFamily: "poppins" }}>
                    Tahun Anggaran:
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
                margin: "15px 15px 15px 5px",
              }}
              value={selectedSingleTahunAnggaran}
              onChange={handleSelectChangeAnggaran}
            >                        
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
                </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={dataWidth}>
        
          <Card className="card-height-100">
            <CardBody>
            <div className="d-flex justify-content-between mb-2">
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
                  {clickDaerah ? <><button onClick={()=>{
                    resetRegionClick()
                    setTitleMap("Total Penduduk")
                    }} style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginLeft: "4px"
                    }}>
                      Nasional
                    </button>
                    </> : 
                    <>
                  </>}
              </div>
              <div className="d-flex nav-beranda">
              <div className="d-flex justify-content-center align-items-center" style={{ fontSize: "14px", fontWeight:600, fontFamily: "poppins" }}>
                TOTAL PESERTA:
              </div>
                  <select
                    name="bpjs"
                      style={{
                        padding: "10px 30px 10px 10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        marginLeft: "10px"
                      }}
                      value={selectedDesil}
                      onChange={handleSelectChange}
                    >
                    <option value="1">AKTIF</option>
                    <option value="2">TIDAK AKTIF</option>                    
                    </select>
                </div>
              </div>        
              <MapIndoChart daerah={clickDaerah} onKabKotaClick={handleKabKotaClick} roam={roam} maxValue={maxValueMap} onRegionClick={handleRegionClick} valueSeries={valueMap} colorData={["#D1ED87","#B9D676","#A1BF66","#89A855","#719145","#597A34"]} />
            </CardBody>
          </Card>
        </Col>
        <Col md={dataWidth}>
          <Card className="card-height-100">
            <CardBody>
            <div className="d-flex justify-content-center align-items-center title-page">
                  {clickDaerah ? clickNamaDaerah : "Nasional"}
              </div>
              <Row>
                <Col md={6}>
                  <Row>
                    <Col>
                      <Card className="card-animate">
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                              <span>TOTAL BELANJA NASIONAL</span>
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
                                      dataUhc?.uhc_total_anggaran_nasional / 1000000000000
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
                    <Col>
                      <Card className="card-animate">
                        <CardBody>
                          <TabContent
                            activeTab={customActiveTabBelanja}
                            className="text-muted"
                          >
                            <TabPane tabId="1" id="provinsi">
                              <div className="d-flex flex-column title-custom-card">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span>
                                    TOTAL JAMKES
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                      <i className="ri-shopping-bag-line text-warning"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>
                                      <CountUp
                                        start={0}
                                        end={
                                          dataUhc?.uhc_total_anggaran_jamkes / 1000000000000
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
                            </TabPane>
                            <TabPane tabId="2" id="kabupaten">
                              <div className="d-flex flex-column title-custom-card">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span>
                                    TOTAL BELANJA UNTUK BIDANG URUSAN KESEHATAN
                                  </span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                      <i className="ri-shopping-bag-line text-warning"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>
                                      <CountUp
                                        start={0}
                                        end={
                                          dataUhc?.uhc_total_anggaran_belanja_urusan_kesehatan / 1000000000000
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
                            </TabPane>
                          </TabContent>
                          <div className="nav-beranda">
                            <Nav
                              tabs
                              className="nav nav-tabs nav-success nav-justified mb-3"
                            >
                              <NavItem>
                                <NavLink
                                  style={{ cursor: "pointer" }}
                                  className={classnames("h-100", {
                                    active: customActiveTabBelanja === "1",
                                  })}
                                  onClick={() => {
                                    toggleCustomBelanja("1");
                                    setDataShowChartAnggaran(false);
                                  }}
                                >
                                  TOTAL JAMKES
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  style={{ cursor: "pointer" }}
                                  className={classnames("h-100", {
                                    active: customActiveTabBelanja === "2",
                                  })}
                                  onClick={() => {
                                    toggleCustomBelanja("2");
                                    setDataShowChartAnggaran(true);
                                  }}
                                >
                                  BIDANG URUSAN KESEHATAN
                                </NavLink>
                              </NavItem>
                            </Nav>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  {dataShowChartAnggaran ? (
                    <>
                      <PieChartNew
                        dataChart={[dataUhc?.uhc_total_anggaran_nasional-dataUhc?.uhc_total_anggaran_belanja_urusan_kesehatan, dataUhc?.uhc_total_anggaran_belanja_urusan_kesehatan]}
                        dataColors={'["#2DAED4", "#FCAD24"]'}
                        categoryName={[
                          "Bidang Urusan di Luar Kesehatan",
                          "Bidang Urusan Kesehatan",
                        ]}
                        showLegend={false}
                        percentOnly={true}
                        pieChart={false}
                      />
                    </>
                  ) : (
                    <>
                      <PieChartNew
                        dataChart={[dataUhc?.uhc_total_anggaran_nasional-dataUhc?.uhc_total_anggaran_jamkes, dataUhc?.uhc_total_anggaran_jamkes]}
                        dataColors={'["#2DAED4", "#FCAD24"]'}
                        categoryName={[
                          "Anggaran Untuk Lainnya",
                          "Anggaran Penurunan dan Pencegahan Stunting",
                        ]}                        
                        pieChart={false}
                        showLegend={false}
                        percentOnly={true}
                      />
                    </>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
      <Col md={12}>
          <Card>
            <CardBody>              
              <Row>
                <Col>
                  <Card className="card-animate card-height-100">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Jumlah Penduduk</span>
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
                            end={dataUhc?.uhc_jmlpenduduk}
                            separator="."
                            prefix=""
                            suffix=" Jiwa"
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
                  <Card className="card-animate card-height-100">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                          <span>PESERTA AKTIF</span>
                          {/* <span className="title-percent">{dataJumlahPenduduk.persenLaki}</span> */}
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                              <i className="las la-briefcase-medical text-info"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                            <CountUp
                            start={0}
                            end={dataUhc?.uhc_jumlah_peserta_bpjs}
                            separator="."
                            prefix=""
                            suffix=" Jiwa"
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
                  <Card className="card-animate card-height-100">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                          <span>PESERTA TIDAK AKTIF</span>
                          {/* <span className="title-percent">{dataJumlahPenduduk.persenLaki}</span> */}
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                              <i className="las la-briefcase-medical text-danger"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                            <CountUp
                            start={0}
                            end={dataUhc?.uhc_jumlah_non_peserta_bpjs}
                            separator="."
                            prefix=""
                            suffix=" Jiwa"
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
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                          <span>PERSENTASE PESERTA AKTIF</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                              <i className="ri-percent-line text-info"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                            <CountUp
                            start={0}
                            end={(dataUhc?.uhc_jumlah_peserta_bpjs/dataUhc?.uhc_jmlpenduduk)*100}
                            separator="."
                            decimals={2}
                            decimal=","
                            prefix=""                            
                            suffix="%"
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
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                          <span>PERSENTASE PESERTA TIDAK AKTIF</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                              <i className="ri-percent-line text-danger"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                            <CountUp
                            start={0}
                            end={(dataUhc?.uhc_jumlah_non_peserta_bpjs/dataUhc?.uhc_jmlpenduduk)*100}
                            separator="."
                            decimals={2}
                            decimal=","
                            prefix=""                            
                            suffix="%"
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
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row> 
        <Col xl={12}>
          <Card>
            <CardBody>
              <div className="separator mb-2">
                <h4 className="card-title">
                  Peserta BPJS Kesehatan Yang Ditanggung Pemda
                </h4>
              </div>
              {dataUhc?.uhc_total_ditanggung_pemda?.map((item, index) => (
                <Col key={index}>
                <Card>
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                        <span>{item?.key}</span>
                      </div>
                      <div className="d-flex">
                        <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                            <i className="ri-account-circle-line text-warning"></i>
                          </span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                          <span>{item?.jumlah?.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              ))}
              {/* <Col>
                <Card>
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                        <span>PB PU/BP PEMDA</span>
                      </div>
                      <div className="d-flex">
                        <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                            <i className="ri-account-circle-line text-warning"></i>
                          </span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                          <span>{dataUhc?.uhc_total_ditanggung_pemda[0]?.jumlah?.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                      <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                        <span>PB PU/BP Kelas III</span>
                      </div>
                      <div className="d-flex">
                        <div className="avatar-xs-half flex-shrink-0">
                          <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                            <i className="ri-account-circle-line text-warning"></i>
                          </span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                          <span>{dataUhc?.uhc_total_ditanggung_pemda[1]?.jumlah?.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col> */}
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
                          className={classnames({
                            active: customActiveTab === "1",
                          })}
                          onClick={() => {
                            toggleCustom("1");
                            // setCustomActiveTitleAnggaran("Nasional");
                          }}
                        >
                          {showNextData ?"Se-Provinsi" : "NASIONAL"}
                        </NavLink>
                      </NavItem>                                        
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTab}
                    className="text-muted"
                  >
                    <TabPane tabId="1">
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
                        placeholder={showNextData ? "Cari Daerah" : "Cari Se-Provinsi"} 
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
                    {/* <div>
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
                    </div> */}
                  </div>
                    {showNextData ? (<><button style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginBottom: "8px"
                    }} onClick={()=>{getDataTabelBpjsSeprov({tahun: selectedSingleTahunAnggaran}); setSearchTerm("")}}>Kembali ke Provinsi</button></>) : (<></>)}
                    <div style={{ overflowX: "auto" }}>
                    <table
                      className="table table-bordered table-nowrap align-middle mb-0 custom-table"
                      style={{ width: "100%" }}
                    >
                      <thead className="table-light">
                        <tr>
                        <th rowSpan="3" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            No
                          </th>        
                          <th rowSpan="3" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}
                            onClick={() => showNextData ? requestSort("nama_daerah") : requestSort("nama")}
                            >
                            {showNextData ? "Nama Daerah" : "Provinsi"} {getSortIcon("nama")}
                          </th>        
                          <th colSpan="7" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            Jumlah Aktif
                          </th>        
                          <th rowSpan="3" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            Jumlah Tidak Aktif
                          </th>        
                          <th rowSpan="3" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            Jumlah Penduduk
                          </th>        
                          <th rowSpan="3" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            Total Anggaran (Rp)
                          </th>        
                          <th rowSpan="3" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            Total Anggaran Iuran Jaminan Kesehatan (Rp)
                          </th>        
                          <th rowSpan="3" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            Persentase
                          </th>
                          {showNextData ? <>
                            <th rowSpan="3" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            Action
                          </th>        
                          </> : <></>}                          
                        </tr>
                        <tr>
                          <th colSpan="2" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            BP
                          </th>        
                          <th rowSpan="2" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            PBI JK
                          </th>        
                          <th rowSpan="2" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            PBPU
                          </th>        
                          <th rowSpan="2" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            PBPU BP Pemda
                          </th>        
                          <th colSpan="2" style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            PPU
                          </th>        
                        </tr>

                        <tr>
                        <th style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            PN
                          </th>
                        <th style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            SWASTA
                          </th>
                          <th style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            BU
                          </th>
                          <th style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",                              
                            }}                            
                            >
                            PN
                          </th>
                        </tr>                        
                      </thead>
                      <tbody style={{ minHeight: "500px" }}>
                  {currentItems.map((item, index) =>(
                    <tr key={index}>
                        <td>{indexOfFirstItem+index+1}</td>                        
                        <td className={showNextData ? "" : "click-data" } style={{ minWidth: "270px" }} onClick={(e)=> {showNextData ? "" : getDataTabelBpjsKabupaten({kodeDdn: item.kode, tahun:selectedSingleTahunAnggaran, tahun_data:selectedSingleTahunData}); setSearchTerm("")}}>{showNextData ? item.nama_daerah : item.nama}</td>
                        <td>{item.jumlah_bp_pn? parseInt(item.jumlah_bp_pn).toLocaleString("id-ID") : "-"}</td>
                        <td>{item.jumlah_bp_swasta? parseInt(item.jumlah_bp_swasta).toLocaleString("id-ID") : "-"}</td>
                        <td>{item.jumlah_pbi_jk? parseInt(item.jumlah_pbi_jk).toLocaleString("id-ID")
                        : "-"}</td>
                        <td>{item.jumlah_pbpu? parseInt(item.jumlah_pbpu).toLocaleString("id-ID")
                        : "-"}</td>
                        <td>{item.jumlah_pbpu_bp_pemda? parseInt(item.jumlah_pbpu_bp_pemda).toLocaleString("id-ID")
                        : "-"}</td>
                        <td>{item.jumlah_ppu_bu? parseInt(item.jumlah_ppu_bu).toLocaleString("id-ID")
                        : "-"}</td>
                        <td>{item.jumlah_ppu_pn? parseInt(item.jumlah_ppu_pn).toLocaleString("id-ID")
                        : "-"}</td>
                        <td>{item.jumlah_non_aktif? parseInt(item.jumlah_non_aktif).toLocaleString("id-ID")
                        : "-"}</td>
                        <td>{item.total_penduduk_dukcapil? parseInt(item.total_penduduk_dukcapil).toLocaleString("id-ID")
                        : "-"}</td>                        
                        <td>{item.total_anggaran? parseInt(item.total_anggaran).toLocaleString("id-ID")
                        : "-"}</td>
                        <td>{item.total_anggaran_bpjs? parseInt(item.total_anggaran_bpjs).toLocaleString("id-ID")
                        : "-"}</td>
                        <td style={{ textAlign: "center" }}>
                              {`${item.persentase_anggaran?.toLocaleString("id-ID",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}%`}
                            </td>
                            {showNextData ? 
                            <>
                            <td style={{textAlign: "center"}}>                    
                              <i style={{                                            
                              padding: "5px 10px",                      
                              cursor: "pointer",
                              fontSize: "25px"                      
                            }} onClick={()=> handleOpen({kodeSubGiat: item.kode_sub_giat, kodeDdn: showNextData? item.kode_ddn :item.kode, rincianDetail: item.total_anggaran_bpjs, namaDaerah: item.nama_daerah})} className="bx bx-list-ul text-primary"></i>                                                                                
                            </td>
                            </> : <></>}
                    </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
                    </TabPane>                    
                  </TabContent>
          </CardBody>
        </Card>           
        </Col>
      </Row>
      <Modal size="xl" isOpen={modall} toggle={handleOpen} centered={true} backdrop="static">
      <div className="modal-content border-0">
        <ModalHeader className=" p-3 bg-info-subtle" toggle={handleClose}>Detail Anggaran Iuran Jaminan Kesehatan {dataDetailNamaDaerah=="Aceh" ? "Provinsi Aceh" : dataDetailNamaDaerah}
        </ModalHeader>
        <ModalBody>
        <Row>
              <Col md={4}><Card className="card-animate">
                        <CardBody>
                          <div
                            className="d-flex flex-column title-custom-card"                            
                          >
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
                          padding: "10px 30px 10px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                          width: "100%",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "16px",
                        }}
                        type="text"
                        value={searchTermDetail}
                        onChange={handleSearchInputDetail}
                        onKeyDown={(e) => handleKeyDown(e, "seprovinsi")}
                        placeholder={"Cari Nama Sub Giat"} 
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
                    {/* <div>
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
                    </div> */}
                  </div>
          <div style={{ overflowY: "scroll", maxHeight:"500px"}}>
          <table
                  className="table table-bordered table-nowrap align-middle mb-0"
                  style={{ width: "100%" }}
                >
                  <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                    <tr>
                      <th style={{ verticalAlign: "middle", textAlign: "center" }}>
                        NO
                      </th>                      
                      {/* {(dataJenisPemda =="prov" || dataJenisPemda =="kab" || dataJenisPemda =="kota")? (<></>):(<><th                        
                        onClick={() => requestSort("nama_daerah")}
                        style={{ cursor: "pointer", verticalAlign: "middle" }}
                      >
                        Nama Daerah {getSortIcon("nama_daerah")}
                      </th></>)} */}
                      
                      {/* <th style={{ textAlign: "center" }}>
                        Total Rincian
                      </th> */}
                      <th onClick={() => requestSort("kode_sub_giat")}
                        style={{ cursor: "pointer", verticalAlign: "middle", textAlign: "center" }}>
                        Kode Sub Giat {getSortIcon("kode_sub_giat")}
                      </th>                      
                      <th onClick={() => requestSort("nama_sub_giat")}
                        style={{ cursor: "pointer", verticalAlign: "middle", textAlign: "center" }}>
                        Nama Sub Giat {getSortIcon("nama_sub_giat")}
                      </th>                      
                      {/* <th onClick={() => requestSort("")}
                        style={{ cursor: "pointer", textAlign: "center" }}>
                        Rincian Sub Giat
                      </th>                       */}
                      <th onClick={() => requestSort("total_rinciansub")}
                        style={{ cursor: "pointer", verticalAlign: "middle", textAlign: "center",whiteSpace: "normal", maxWidth:"100px",
                          wordWrap: "break-word"}}>
                        Total Rincian Sub Giat (Rp) {getSortIcon("total_rinciansub")}
                      </th>
                      <th onClick={() => requestSort("persentase")}
                        style={{ cursor: "pointer", verticalAlign: "middle", textAlign: "center",whiteSpace: "normal",
                          wordWrap: "break-word" }}>
                        Persentase {getSortIcon("persentase")}
                      </th>
                      <th style={{verticalAlign: "middle", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word",maxWidth:"100px"  }}>
                        Lihat Sub Rincian Objek 
                      </th>
                    </tr>                  
                  </thead>
                  <tbody style={{ minHeight: "500px" }}>
                    {currentItemDetail?.map((item, index) => (
                      <tr key={index}>
                        {/* <td>{item.kode_prop}</td> */}
                        <td style={{textAlign: "center",
                        verticalAlign: "middle"}}>
                          {/* { index + 1} */}
                          {indexOfFirstItemDetail+index+1}
                        </td>
                        {/* {(dataJenisPemda =="prov" || dataJenisPemda =="kab" || dataJenisPemda =="kota") ? (<></>):(<><td style={{ maxWidth: "250px" }}>
                          {" "}
                          {item.nama_daerah || "-"}
                        </td></>)}                         */}
                        {/* <td>
                          Rp {item.total_rincian_daerah? parseInt(item.total_rincian_daerah).toLocaleString("id-ID")
                            : "-"}
                        </td> */}
                        <td>
                          {item?.kode_sub_giat}
                        </td>
                        <td style={{
                            whiteSpace: "normal",  // Membolehkan teks turun ke baris berikutnya
                            wordWrap: "break-word",  // Memastikan teks panjang terpotong dan turun ke bawah
                            maxWidth: "200px"  // Menetapkan lebar maksimum sel (sesuaikan dengan kebutuhan)
                          }}>
                          {item?.nama_sub_giat}
                        </td>
                        {/* <td>
                         Rp {item.rincian_sub_giat ? parseInt(item.rincian_sub_giat).toLocaleString("id-ID")
                            : "-"}
                        </td> */}
                        <td>
                          <span style={{float: "right"}}>{item?.total_rinciansub ? parseInt(item?.total_rinciansub).toLocaleString("id-ID")
                            : "-"}</span>
                         
                        </td>
                        <td>
                        <span style={{float: "right"}}>
                        {item.persentase
                          ? (item.persentase >= 1
                              ? `${Number(item.persentase).toLocaleString("id-ID", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}%`
                              : `${Number(item.persentase).toLocaleString("id-ID", {
                                  minimumFractionDigits: 4,
                                })}%`
                            )
                          : "-"}
                        </span>
                        </td>
                        <td style={{verticalAlign: "middle", textAlign: "center" }}>            
                        {/* <button style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }} onClick={()=>dataJenisPemda=="prov" ? handleOpenNextModal("", item.kode_sub_giat, item.kode_ddn, "") : (dataJenisPemda=="kab" || dataJenisPemda=="kota") ? handleOpenNextModal("", item.kode_sub_giat, "", item.kode_ddn) : handleOpenNextModal(item.kode_prov, item.kode_sub_giat, "", "")}>Lihat Detail</button> */}
                    <i style={{                                            
                      padding: "5px 10px",                      
                      cursor: "pointer",
                      fontSize: "30px"
                    }} onClick={()=>handleOpenNextModal({kodeDdn: item.kode_ddn, kodeSubGiat: item.kode_sub_giat, rincianDetail: item.total_rinciansub, namaSubGiat: item.nama_sub_giat})} className="bx bx-list-ul text-primary"></i>
                        </td>          
                      </tr>
                    ))}
                    {/* {placeholders} */}
                  </tbody>
                </table>
          </div>        
          <Pagination currentPage={currentPageDetail} totalPages={totalPagesDetail} onPageChange={paginateDetail} />
        </ModalBody>
      </div>          
      </Modal>   

      <Modal size="xl" isOpen={modal} toggle={handleOpenNextModal} centered={true} backdrop="static">
      <div className="modal-content border-0">
        <ModalHeader className=" p-3 bg-info-subtle" toggle={handleCloseNextModal}>Sub Rincian Objek {namaSubGiat}
        </ModalHeader>
        <ModalBody>
        <Row>
            <Col md={4}><Card className="card-animate card-height-100">
                        <CardBody>
                          <div
                            className="d-flex flex-column title-custom-card"                            
                          >
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Total Anggaran Sub Kegiatan</span>
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
                                      dataRincianDetailSub
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
                      </Card></Col>
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
                          padding: "10px 30px 10px 10px", // Sesuaikan padding kanan agar tidak menimpa tombol X
                          width: "100%",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "16px",
                        }}
                        type="text"
                        value={searchTermDetailSub}
                        onChange={handleSearchInputDetailSub}
                        onKeyDown={(e) => handleKeyDown(e, "seprovinsi")}
                        placeholder={"Cari Sub Rincian Objek"} 
                      />

                      {/* Tombol "X" di dalam input */}
                      {searchTermDetailSub && (
                        <button
                          onClick={() => handleClearSearchDetailSub()}
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
                    {/* <div>
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
                    </div> */}
                  </div>
          <div style={{ overflowY: "scroll", maxHeight:"500px"}}>
          <table
                  className="table table-bordered table-nowrap align-middle mb-0"
                  // style={{ width: "100%" }}
                >
                  <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                    <tr>
                      <th style={{ verticalAlign: "middle", textAlign: "center" }}>
                        NO
                      </th>                      
                      <th                        
                        onClick={() => requestSort("kode_sro")}
                        style={{ cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}
                      >
                        Kode Sub Rincian Objek {getSortIcon("kode_sro")}
                      </th>                                                                  
                      <th onClick={() => requestSort("nama_sro")}
                        style={{ cursor: "pointer", textAlign: "center", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}>
                        Nama Sub Rincian Objek {getSortIcon("nam_sro")}
                      </th>  
                      <th onClick={() => requestSort("total_rinciansro")}
                        style={{ cursor: "pointer", textAlign: "center" }}>
                        Total Rincian (Rp) {getSortIcon("total_rinciansro")}
                      </th>
                      <th onClick={() => requestSort("persentase")}
                        style={{ cursor: "pointer", textAlign: "center",whiteSpace: "normal",
                          wordWrap: "break-word" }}>
                        Persentase {getSortIcon("persentase")}
                      </th>                                                                
                    </tr>                  
                  </thead>
                  <tbody style={{ minHeight: "500px" }}>
                    {currentItemDetailSub.map((item, index) => (
                      <tr key={index}>                        
                        <td style={{textAlign: "center",
                        verticalAlign: "middle"}}>
                          {/* { index + 1} */}
                          {indexOfFirstItemDetailSub+index+1}
                        </td>
                        <td>
                          {item.kode_sro}
                        </td>
                        <td style={{
                            whiteSpace: "normal",  // Membolehkan teks turun ke baris berikutnya
                            wordWrap: "break-word",  // Memastikan teks panjang terpotong dan turun ke bawah
                            maxWidth: "200px"  // Menetapkan lebar maksimum sel (sesuaikan dengan kebutuhan)
                          }}>
                          {" "}
                          {item.nama_sro || "-"}
                        </td>                                                                        
                        <td>
                        <span style={{float: "right"}}>{item.total_rinciansro ? parseInt(item.total_rinciansro).toLocaleString("id-ID")
                            : "-"}</span>
                        </td>                          
                        <td>
                        <span style={{float: "right"}}>
                        {item.persentase
                          ? (item.persentase >= 1
                              ? `${Number(item.persentase).toLocaleString("id-ID", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}%`
                              : `${Number(item.persentase).toLocaleString("id-ID", {
                                  minimumFractionDigits: 4,
                                })}%`
                            )
                          : "-"}
                        </span>   
                        </td>
                      </tr>
                    ))}
                    {/* {placeholders} */}
                  </tbody>
                </table>
          </div> 
          <Pagination currentPage={currentPageDetailSub} totalPages={totalPagesDetailSub} onPageChange={paginateDetailSub} />
        </ModalBody>
      </div>          
      </Modal>   
    </React.Fragment>
  );
};

export default ContentUhcV2;
