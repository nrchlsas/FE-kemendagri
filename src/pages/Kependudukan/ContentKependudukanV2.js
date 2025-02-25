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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import "./kependudukan.scss";
import "leaflet/dist/leaflet.css";
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import classnames from "classnames";
import CountUp from "react-countup";
import HorizontalBarChart from "../../Components/Chart/HorizontalBarChart";
import VerticalBarChart from "../../Components/Chart/VerticalBarChart";
import PyramidChart from "../../Components/Chart/PyramidChart";
import MapIndoChart from "../../Components/MapIndo/MapIndoChart";
import Pagination from "../../Components/Pagination/Pagination";
import "./../Dapodik/dapodik.scss"

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

const ContentKependudukanV2 = () => {
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [customActiveTabAll, setcustomActiveTabAll] = useState("1");
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

  const [customActiveTabKelompokUmur, setcustomActiveTabKelompokUmur] =
    useState("1");
  const toggleCustomKelompokUmur = (tab) => {
    if (customActiveTabKelompokUmur !== tab) {
      setcustomActiveTabKelompokUmur(tab);
    }
  };

  const [dataKependudukan, setDataKependudukan] = useState([]);
  const [loadingKependudukan, setLoadingKependudukan] = useState([]);
  const [errorKependudukan, setErrorKependudukan] = useState([]);
  const [dataChartTop10Provinsi, setDataChartTop10Provinsi] = useState([
    [],
    [],
  ]);
  const [dataChartTop10Kabupaten, setDataChartTop10Kabupaten] = useState([
    [],
    [],
  ]);
  const [dataChartTop10Kecamatan, setDataChartTop10Kecamatan] = useState([
    [],
    [],
  ]);
  const [dataChartTop10Kelurahan, setDataChartTop10Kelurahan] = useState([
    [],
    [],
  ]);
  const [dataChartUsiaProduktif, setDataChartUsiaProduktif] = useState([
    [],
    [],
  ]);
  const [dataChartAgama, setDataChartAgama] = useState([[], []]);
  const [dataChartPendidikan, setDataChartPendidikan] = useState([[], []]);
  const [dataChartLakiLaki, setDataChartLakiLaki] = useState([[], []]);
  const [dataChartPerempuan, setDataChartPerempuan] = useState([[], []]);

  const getDataKependudukan = ({tahunData, tahunAnggaran, wilayah="INDONESIA", kodeDdn, semester, kodeProv}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}`},
          body: JSON.stringify({
            kode_prov: kodeProv,
            kode_ddn: kodeDdn,
            wilayah: wilayah,
            tahun_data: tahunData,
            tahun: tahunAnggaran,
            semester: semester,
        }),
        };
        const response = await fetch(`${API_URI_RBAC}/v2/dashboard_dukcapil`, requestOptions);
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const dataKependudukan = await response.json();
        setDataKependudukan(dataKependudukan.data);
  
        try {
          //chart top 10 Provinsi
          const resultChartTop10Prov = dataKependudukan.data.top10_by_provinsi.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.provinsi);
              return acc;
            },
            [[], []]
          );
          setDataChartTop10Provinsi(resultChartTop10Prov);
        } catch (error) {
          console.error("Error processing top 10 Provinsi data:", error);
        }
  
        try {
          //chart top 10 Kabupaten
          const resultChartTop10Kab = dataKependudukan.data.top10_by_kabupaten.reduce(
            (acc, item) => {
              acc[0].push(item.jumlah);
              acc[1].push(item.nama_kabkota);
              acc[2].push(item.nama_provinsi)
              return acc;
            },
            [[], [], []]
          );
          setDataChartTop10Kabupaten(resultChartTop10Kab);
        } catch (error) {
          console.error("Error processing top 10 Kabupaten data:", error);
        }
  
        try {
          //chart top 10 Kecamatan
          const resultChartTop10Kec = dataKependudukan.data.top10_by_kecamatan.reduce(
            (acc, item) => {
              acc[0].push(item.jumlah);
              acc[1].push(item.nama_kecamatan);
              acc[2].push(item.nama_provinsi)
              acc[3].push(item.nama_kabkota)
              return acc;
            },
            [[], [], [], []]
          );
          setDataChartTop10Kecamatan(resultChartTop10Kec);
        } catch (error) {
          console.error("Error processing top 10 Kecamatan data:", error);
        }
  
        try {
          //chart top 10 Kelurahan
          const resultChartTop10Kel = dataKependudukan.data.top10_by_kelurahan.reduce(
            (acc, item) => {
              acc[0].push(item.jumlah);
              acc[1].push(item.nama_desa_kelurahan);
              acc[2].push(item.nama_provinsi)
              acc[3].push(item.nama_kabkota)
              acc[4].push(item.nama_kecamatan);
              return acc;
            },
            [[], [],[], [],[]]
          );                  
          setDataChartTop10Kelurahan(resultChartTop10Kel);
        } catch (error) {
          console.error("Error processing top 10 Kelurahan data:", error);
        }
  
        try {
          //chart usia produktif
          const chartUsiaProduktif = Object.values(dataKependudukan.data.pekerjaan);
          setDataChartUsiaProduktif(chartUsiaProduktif);
        } catch (error) {
          console.error("Error processing usia produktif data:", error);
        }
  
        try {
          //chart agama
          // const resultChartAgama = Object.values(
          //   dataKependudukan.data.agama
          // ).filter((value) => typeof value === "number");

          const keys = [];
          const values = [];

          for (let key in dataKependudukan.data.agama) {
            if (key !== "description" && key !== "sumber") {
              keys.push(key);
              values.push(dataKependudukan.data.agama[key]);
            }
          }
          
          // Gabungkan keys dan values menjadi satu array objek untuk diurutkan
          const combined = keys.map((key, index) => {
            return { key: key, value: values[index] };
          });

          // Urutkan berdasarkan value dari terbesar ke terkecil
          combined.sort((a, b) => b.value - a.value);

          // Pisahkan kembali keys dan values setelah diurutkan
          const sortedKeys = combined.map(item => item.key);
          const sortedValues = combined.map(item => item.value);

          // Hasil akhir dalam array yang diurutkan
          const resultChartAgama = [sortedKeys, sortedValues];

          setDataChartAgama(resultChartAgama);
        } catch (error) {
          console.error("Error processing agama data:", error);
        }
  
        try {
          //chart pendidikan
          const resultChartPendidikan = dataKependudukan.data.pendidikan.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.key);
              return acc;
            },
            [[], []]
          );
          setDataChartPendidikan(resultChartPendidikan);
        } catch (error) {
          console.error("Error processing pendidikan data:", error);
        }
  
        try {
          //chart usia laki-laki
          const resultChartLakiLaki = dataKependudukan.data.kelompok_umur.data.reduce(
            (acc, item) => {
              acc[0].push(item.totl);
              acc[1].push(item.kelompok_umur);
              return acc;
            },
            [[], []]
          );
          setDataChartLakiLaki(resultChartLakiLaki);
        } catch (error) {
          console.error("Error processing usia laki-laki data:", error);
        }
  
        try {
          //chart usia perempuan
          const resultChartPerempuan = dataKependudukan.data.kelompok_umur.data.reduce(
            (acc, item) => {
              acc[0].push(item.totp);
              acc[1].push(item.kelompok_umur);
              return acc;
            },
            [[], []]
          );
          setDataChartPerempuan(resultChartPerempuan);
        } catch (error) {
          console.error("Error processing usia perempuan data:", error);
        }
      } catch (errorKependudukan) {
        setErrorKependudukan(errorKependudukan);
      } finally {
        setLoadingKependudukan(false);
      }
    };
    fetchData();
  };

  const [selectedSingleTahunAnggaran, setSelectedSingleTahunAnggaran] = useState('2025'); // Set default value
  const [selectedSingleTahunData, setSelectedSingleTahunData] = useState('2024'); // Set default value
  const [selectedSingleTahunSemester, setSelectedSingleTahunSemester] = useState('1'); // Set default value
  
  const handleSelectChangeAnggaran = (e) => {
    const { name, value } = e.target;
    const newTahunData = (parseInt(value) - 1).toString();
    setSelectedSingleTahunAnggaran(value); 
    setSelectedSingleTahunData(newTahunData);
    getDataKependudukan({kodeDdn: kodeWilayahPeta, kodeProv: kodeWilayahPeta, tahunData: newTahunData, tahunAnggaran:value, semester: selectedSingleTahunSemester});
    getDataTabelKependudukanProv({tahunData: newTahunData, tahunAnggaran:value, semester: selectedSingleTahunSemester});
   
  };

  const handleSelectChangeDataPokok = (e) => {
    const { name, value } = e.target;
    const newTahunAnggaran = (parseInt(value) + 1).toString();
    setSelectedSingleTahunData(value); 
    setSelectedSingleTahunAnggaran(newTahunAnggaran);
    getDataKependudukan({kodeDdn: kodeWilayahPeta, kodeProv: kodeWilayahPeta, tahunData: value, tahunAnggaran:newTahunAnggaran, semester: selectedSingleTahunSemester});
    getDataTabelKependudukanProv({tahunData: value, tahunAnggaran:newTahunAnggaran, semester: selectedSingleTahunSemester});
  };

  const handleSelectChangeSemester = (e) => {
    const { name, value } = e.target;
    setSelectedSingleTahunSemester(value);
    getDataKependudukan({kodeDdn: kodeWilayahPeta, kodeProv: kodeWilayahPeta, tahunData: selectedSingleTahunData, tahunAnggaran:selectedSingleTahunAnggaran, semester: value});
    getDataTabelKependudukanProv({tahunData: selectedSingleTahunData, tahunAnggaran:selectedSingleTahunAnggaran, semester: value});
  };

  const [handleCardClick, setHandleCardClick] = useState(() => () => {});
  const [dataKependudukanTabel, setDataKependudukanTabel] = useState([]);
  const [dataKependudukanTabelFiltered, setDataKependudukanTabelFiltered] = useState([]);
  const [loadingKependudukanTabel, setLoadingKependudukanTabel] = useState([]);
  const [errorKependudukanTabel, setErrorKependudukanTabel] = useState([]);
  const [titleMap, setTitleMap] = useState("Total Penduduk")
  const [valueMap, setValueMap] = useState([]);
  const [maxValueMap, setmaxValueMap] = useState(0)
  const getDataTabelKependudukanProv = ({tahunData, tahunAnggaran,semester}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            semester: semester,
            tahun_data: tahunData,
            tahun: tahunAnggaran
        }),
        };
        // /table_Kependudukan_provinsi
        // /table_Kependudukan_kabupaten
        // /table_stunting_provinsi
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_dukcapil`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataKependudukanTabel = await response.json();
        setDataKependudukanTabel(dataKependudukanTabel.data)
        setDataKependudukanTabelFiltered(dataKependudukanTabel.data)
        setShowNextData(false)

        const valueTotalPenduduk = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.jumlahpenduduk
        }));

        const valueTotalKK = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.jmlkk
        }));

        const valueTotalLakiLaki = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.jumlahlakilaki
        }));

        const valueTotalPerempuan = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.jumlahperempuan
        }));

        const valueTotalKepadatan = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.kepadatan
        }));

        const valueTotalLuasWilayah = dataKependudukanTabel.data.map(item => ({
          name: item.nama_daerah,
          value: item.luas_wilayah
        }));

        const maxPenduduk = valueTotalPenduduk?.reduce((max, item) => Math.max(max, item.value || 0), 0);
        const maxKK = valueTotalKK?.reduce((max, item) => Math.max(max, item.value || 0), 0);
        const maxLakiLaki = valueTotalLakiLaki?.reduce((max, item) => Math.max(max, item.value || 0), 0);
        const maxPerempuan = valueTotalPerempuan?.reduce((max, item) => Math.max(max, item.value || 0), 0);
        const maxKepadatan = valueTotalKepadatan?.reduce((max, item) => Math.max(max, item.value || 0), 0);
        const maxLuasWilayah = valueTotalLuasWilayah?.reduce((max, item) => Math.max(max, item.value || 0), 0);
        // const maxPenduduk = Math.max(...valueTotalPenduduk.map(item => item.value));
        // const maxKK = Math.max(...valueTotalKK.map(item => item.value));
        // const maxLakiLaki = Math.max(...valueTotalLakiLaki.map(item => item.value));
        // const maxPerempuan = Math.max(...valueTotalPerempuan.map(item => item.value));
        // const maxKepadatan = Math.max(...valueTotalKepadatan.map(item => item.value));
        // const maxLuasWilayah = Math.max(...valueTotalLuasWilayah.map(item => item.value));

        setValueMap(valueTotalPenduduk);
        setmaxValueMap(maxPenduduk)

        const handleCardClick = (valueType) => {
          switch(valueType) {
            case 'totalPenduduk':
              setValueMap(valueTotalPenduduk);
              setmaxValueMap(maxPenduduk)
              break;
            case 'totalKK':
              setValueMap(valueTotalKK);
              setmaxValueMap(maxKK)
              break;
            case 'totalLakiLaki':
              setValueMap(valueTotalLakiLaki);
              setmaxValueMap(maxLakiLaki)
              break;
            case 'totalPerempuan':
              setValueMap(valueTotalPerempuan);
              setmaxValueMap(maxPerempuan)
              break;
            case 'totalKepadatan':
              setValueMap(valueTotalKepadatan);
              setmaxValueMap(maxKepadatan)
              break;
            case 'totalLuasWilayah':
              setValueMap(valueTotalLuasWilayah);
              setmaxValueMap(maxLuasWilayah)
              break;
            default:
              
              break;
          }
        };
        
        // Simpan `handleCardClick` di dalam state atau panggil langsung pada setiap card
        setHandleCardClick(() => handleCardClick);
        setCurrentPage(1)

      } catch (errorKependudukanTabel) {
        setErrorKependudukanTabel(errorKependudukanTabel);
      } finally {
        setLoadingKependudukanTabel(false);
      }
    };
    fetchData();
  };

  const [showNextData, setShowNextData] = useState(false);
  const getDataTabelKependudukanKabKota = ({kodeProvinsi, tahunData, tahunAnggaran}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_provinsi: kodeProvinsi,
            tahun: tahunAnggaran,
            tahun_data: tahunData
          }),
        };        
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_dukcapil_kabkota`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataKependudukanTabel = await response.json();

        setDataKependudukanTabel(dataKependudukanTabel.data) 
        setDataKependudukanTabelFiltered(dataKependudukanTabel.data) 
        setCurrentPage(1)
        setShowNextData(true);     
      } catch (errorKependudukanTabel) {
        setErrorKependudukanTabel(errorKependudukanTabel);
      } finally {
        setLoadingKependudukanTabel(false);
      }
    };
    fetchData();
  };

    const [dataDetailAnggaran, setDataDetailAnggaran] = useState([]);
    const [dataDetailAnggaranFiltered, setDataDetailAnggaranFiltered] = useState([]);
    const [dataDetailAnggaranSub, setDataDetailAnggaranSub] = useState([]);
    const [dataDetailAnggaranSubFiltered, setDataDetailAnggaranSubFiltered] = useState([]);
    const [dataDetailAnggaranSubSub, setDataDetailAnggaranSubSub] = useState([]);
    const [dataDetailAnggaranSubSubFiltered, setDataDetailAnggaranSubSubFiltered] = useState([]);
    const [loadingDetailAnggaran, setLoadingDetailAnggaran] = useState([]);
    const [errorDetailAnggaran, setErrorDetailAnggaran] = useState([]);
    const [dataDetailHighlight, setDataDetailHighlight] = useState([])
  
    const getDataDetailAnggaran = ({kodeDdn,tahun,tahunData}) => {
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
              tahun_data: tahunData
            }),
          };
  
          const response = await fetch(
            `${API_URI_RBAC}/v2/subgiat_per_provkabkota`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataDetailAnggaran = await response.json();
          setDataDetailAnggaran(dataDetailAnggaran?.data)
          setDataDetailAnggaranFiltered(dataDetailAnggaran?.data)
          setModall(true)
          
          // Open the modal only after data is successfully fetched
        } catch (errorDetailAnggaran) {
          setErrorDetailAnggaran(errorDetailAnggaran);
        } finally {
          setLoadingDetailAnggaran(false);
        }
      };
  
      fetchData();
    };

    const getDataDetailAnggaranSub = ({kodeDdn,tahun,tahunData,kodeSubGiat}) => {
      const fetchData = async () => {
        setLoadingDetailAnggaran(true); // Set loading state to true when starting the fetch
        try {
          const token = JSON.parse(sessionStorage.getItem("authUser"))
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
            body: JSON.stringify({
              kode_ddn: kodeDdn,
              kode_sub_giat: kodeSubGiat,
              tahun: tahun,
              tahun_data: tahunData
            }),
          };
  
          const response = await fetch(
            `${API_URI_RBAC}/v2/sro_per_provkabkota`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataDetailAnggaranSub = await response.json();
          setDataDetailAnggaranSub(dataDetailAnggaranSub?.data)
          setDataDetailAnggaranSubFiltered(dataDetailAnggaranSub?.data)
          setModal(true)
          
          // Open the modal only after data is successfully fetched
        } catch (errorDetailAnggaran) {
          setErrorDetailAnggaran(errorDetailAnggaran);
        } finally {
          setLoadingDetailAnggaran(false);
        }
      };
  
      fetchData();
    };

    const getDataDetailAnggaranSubSub = ({kodeDdn,tahun,tahunData, kodeSubGiat, kodeSro}) => {
      const fetchData = async () => {
        setLoadingDetailAnggaran(true); // Set loading state to true when starting the fetch
        try {
          const token = JSON.parse(sessionStorage.getItem("authUser"))
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
            body: JSON.stringify({
              kode_ddn: kodeDdn,
              kode_sub_giatsro:kodeSubGiat,
              kode_sro: kodeSro,
              tahun: tahun,
              tahun_data: tahunData
            }),
          };
  
          const response = await fetch(
            `${API_URI_RBAC}/v2/ssro_per_provkabkota`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataDetailAnggaranSubSub = await response.json();
          setDataDetailAnggaranSubSub(dataDetailAnggaranSubSub?.data)
          setDataDetailAnggaranSubSubFiltered(dataDetailAnggaranSubSub?.data)
          setModalSub(true)
          
          // Open the modal only after data is successfully fetched
        } catch (errorDetailAnggaran) {
          setErrorDetailAnggaran(errorDetailAnggaran);
        } finally {
          setLoadingDetailAnggaran(false);
        }
      };
  
      fetchData();
    };

    const getDataHighlight = ({kodeDdn, tahun, tahunAnggaran}) => {
      const fetchData = async () => {
        try {
          const token = JSON.parse(sessionStorage.getItem("authUser"))
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
            body: JSON.stringify({
              kode_ddn: kodeDdn,
              tahun : tahun,  
              tahun_anggaran : tahunAnggaran,  
            }),
          };
  
          const response = await fetch(
            `${API_URI_RBAC}/v2/dukcapil_mamin`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const dataHighlight = await response.json();
          setDataDetailHighlight(dataHighlight?.data)
        } catch (errorDetailUnitSkpd) {
          
        } finally {
          
        }
      };
  
      fetchData();
    };

  useEffect(() => {
    getDataKependudukan({kodeDdn: kodeWilayahPeta, kodeProv: kodeWilayahPeta, tahunData: selectedSingleTahunData, tahunAnggaran:selectedSingleTahunAnggaran, semester: selectedSingleTahunSemester});
    getDataTabelKependudukanProv({tahunData: selectedSingleTahunData, tahunAnggaran:selectedSingleTahunAnggaran, semester: selectedSingleTahunSemester});
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageKabupaten, setCurrentPageKabupaten] = useState(1);
  const [currentPageDetail, setCurrentPageDetail] = useState(1);
  const [currentPageDetailSub, setCurrentPageDetailSub] = useState(1);
  const [currentPageDetailSubSub, setCurrentPageDetailSubSub] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Calculate indexes for current page's data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const indexOfLastItemDetail = currentPageDetail * itemsPerPage;
  const indexOfFirstItemDetail = indexOfLastItemDetail - itemsPerPage;

  const indexOfLastItemDetailSub = currentPageDetailSub * itemsPerPage;
  const indexOfFirstItemDetailSub = indexOfLastItemDetailSub - itemsPerPage;

  const indexOfLastItemDetailSubSub = currentPageDetailSubSub * itemsPerPage;
  const indexOfFirstItemDetailSubSub = indexOfLastItemDetailSubSub - itemsPerPage;

  // Sorting logic
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...(dataKependudukanTabelFiltered || [])];
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
  }, [dataKependudukanTabelFiltered, sortConfig]);

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
  
    const sortedItemsDetailSubSub = React.useMemo(() => {
      let sortableItems = [...(dataDetailAnggaranSubSubFiltered || [])];
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
    }, [dataDetailAnggaranSubSubFiltered, sortConfig]);

    
  // Slice the sorted data for the current page
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemDetail = sortedItemsDetail.slice(
    indexOfFirstItemDetail,
    indexOfLastItemDetail
  );
  const currentItemDetailSub = sortedItemsDetailSub.slice(
    indexOfFirstItemDetailSub,
    indexOfLastItemDetailSub
  );
  const currentItemDetailSubSub = sortedItemsDetailSubSub.slice(
    indexOfFirstItemDetailSubSub,
    indexOfLastItemDetailSubSub
  );

  // Calculate total number of pages
  const totalPages = Math.ceil((dataKependudukanTabelFiltered?.length || 0) / itemsPerPage);
  const totalPagesDetail = Math.ceil(
    (dataDetailAnggaranFiltered?.length || 0) / itemsPerPage
  );
  const totalPagesDetailSub = Math.ceil(
    (dataDetailAnggaranSubFiltered?.length || 0) / itemsPerPage
  );
  const totalPagesDetailSubSub = Math.ceil(
    (dataDetailAnggaranSubSubFiltered?.length || 0) / itemsPerPage
  );

  // Pagination change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateDetail = (pageNumber) => setCurrentPageDetail(pageNumber);
  const paginateDetailSub = (pageNumber) => setCurrentPageDetailSub(pageNumber);
  const paginateDetailSubSub = (pageNumber) => setCurrentPageDetailSubSub(pageNumber);

  // Placeholder for empty rows if data is less than items per page
  const placeholders = Array.from(
    { length: itemsPerPage - currentItems.length },
    (_, index) => (
      <tr key={`placeholder-${index}`}>
        <td
          colSpan="10"
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

  const [dataWidth, setDataWidth] = useState(6)  
  const [roam, setRoam] = useState(false)

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

    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchInput= (e) => {
      const value = e.target.value.toLowerCase();
      setSearchTerm(value);
      if (value === "") {
        setDataKependudukanTabelFiltered(dataKependudukanTabel) 
      } else {
        const filtered = dataKependudukanTabel.filter((item) => {
            return item.nama_daerah.toLowerCase().includes(value)
        }
        );
        setDataKependudukanTabelFiltered(filtered)  
      }
      setCurrentPage(1);
    };

    const handleClearSearch= () => {
      setCurrentPage(1);
      setSearchTerm(""); // Kosongkan isi input
      setDataKependudukanTabelFiltered(dataKependudukanTabel)
    };

    const [modall, setModall] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalSub, setModalSub] = useState(false);
    const [dataRincianDetail, setDataRincianDetail] = useState(0);
    const [dataRincianDetailSub, setDataRincianDetailSub] = useState(0);
    const [dataRincianDetailSubSub, setDataRincianDetailSubSub] = useState(0);
    const [dataDetailNamaDaerah, setDataDetailNamaDaerah] = useState("");
    const handleOpen = ({
      namaDaerah = "",
      kodeDdn,
      rincianDetail = 0
    }
    ) => {
      getDataDetailAnggaran({kodeDdn:kodeDdn, tahun:selectedSingleTahunAnggaran, tahunData:selectedSingleTahunData});      
      getDataHighlight({kodeDdn:kodeDdn, tahun:selectedSingleTahunAnggaran, tahunData:selectedSingleTahunData})
      setDataDetailNamaDaerah(namaDaerah);
      setDataRincianDetail(rincianDetail);
    };

    const [namaSubGiat, setNamaSubGiat] = useState("")
      const [namaSro, setNamaSro] = useState("")
      const handleOpenNextModalSub = ({
        namaSubGiat = "",
        kodeDdn,
        kodeSubGiat,
        rincianDetail = 0
      }
      ) => {
        getDataDetailAnggaranSub({kodeDdn:kodeDdn, kodeSubGiat:kodeSubGiat, tahun:selectedSingleTahunAnggaran, tahunData:selectedSingleTahunData});      
        setNamaSubGiat(namaSubGiat);
        setDataRincianDetailSub(rincianDetail);
      };
    
      const handleOpenNextModalSubSub = ({kodeDdn, kodeSubGiat, kodeSro, tahun, rincianDetail, namaSro}) => {
        getDataDetailAnggaranSubSub({kodeDdn:kodeDdn, kodeSubGiat:kodeSubGiat, kodeSro:kodeSro, tahun:tahun})
        setNamaSro(namaSro)
        setDataRincianDetailSubSub(rincianDetail)
        
      }
      
      const handleClose = () => {
        setModall(false); // Close modal by setting modall to false
      };

      const handleCloseNextModalSub = () => {
        setModalSub(false)
      }
    
      const handleCloseNextModal = () => {
        setModal(false);
      };


    const [searchTermDetail, setSearchTermDetail] = useState("");
    const [searchTermDetailSub, setSearchTermDetailSub] = useState("");
    const [searchTermDetailSubSub, setSearchTermDetailSubSub] = useState("");
    const handleSearchInputDetail = (e) => {
      const value = e.target.value.toLowerCase();
      setSearchTermDetail(value);
      if (value === "") {
        setDataDetailAnggaranFiltered(dataDetailAnggaran)
      } else {
        // Filter data berdasarkan input
        const filtered = dataDetailAnggaran.filter((item) => {
          // setCurrentPageDetail(1);
          return item.nama_sub_giat.toLowerCase().includes(value)
        }
        );
        setDataDetailAnggaranFiltered(filtered)
      }
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
          // setCurrentPageDetail(1);
          return item.nama_sro.toLowerCase().includes(value)
        }
        );
        setDataDetailAnggaranSubFiltered(filtered)
      }
    };
    
    const handleClearSearchDetailSub = (area = "") => {
      setDataDetailAnggaranSubFiltered(dataDetailAnggaranSub)
      setCurrentPageDetail(1);
      // setCurrentPageKabupaten(1);
      setSearchTermDetailSub(""); // Kosongkan isi input
    };
  
    const handleSearchInputDetailSubSub = (e) => {
      const value = e.target.value.toLowerCase();
      setSearchTermDetailSubSub(value);
      if (value === "") {
        setDataDetailAnggaranSubSubFiltered(dataDetailAnggaranSubSub)  
      } else {
        const filtered = dataDetailAnggaranSubSub.filter((item) => {
            return item.nama_standar_harga.toLowerCase().includes(value)
        }
        );
        setDataDetailAnggaranSubSubFiltered(filtered)
      }
      setCurrentPageDetailSubSub(1);
    };
  
    const handleClearSearchDetailSubSub = () => {
      setCurrentPageDetailSubSub(1);
      setSearchTermDetailSubSub(""); // Kosongkan isi input
      setDataDetailAnggaranSubSubFiltered(dataDetailAnggaranSubSub)
    };

    const [clickDaerah, setClickDaerah] = useState(false)
    const [clickNamaDaerah, setClickNamaDaerah] = useState("")
    const [kodeWilayahPeta, setKodeWilayahPeta]=useState("")
    const handleRegionClick = (kodeProv, namaProv) => {
      setKodeWilayahPeta(kodeProv)
      setClickNamaDaerah(namaProv)
      getDataKependudukan({wilayah:"", kodeProv: kodeProv, tahunData: selectedSingleTahunData, tahunAnggaran:selectedSingleTahunAnggaran, semester: selectedSingleTahunSemester});
      setClickDaerah(true)
    };

    const handleKabKotaClick = (kodeProv, namaProv) => {
      setClickNamaDaerah(namaProv)
      setClickDaerah(true)
    };
  
    const resetRegionClick = () => {
      getDataKependudukan({kodeDdn: "", kodeProv: "", tahunData: selectedSingleTahunData, tahunAnggaran:selectedSingleTahunAnggaran, semester: selectedSingleTahunSemester});
      setClickDaerah(false)
      setKodeWilayahPeta("")
    }

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
                <span>Data Kependudukan</span>
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
                   Semester:
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
              value={selectedSingleTahunSemester}
              onChange={handleSelectChangeSemester}
            >
              <option value="1">1</option>
              <option value="2">2</option>
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
              {/* <PolygonMaps /> */}
              <div className="d-flex justify-content-between mb-2">
            <div className="d-flex justify-content-center align-items-center">
              {dataWidth==6 ? (<>
                  <button onClick={()=>{
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
                  </button>
                  </>) : (<>
                    <button onClick={()=>{
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
                    </button>                    
                  </>)}
                  </div>
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
                      marginBottom: "8px"
                    }}>
                      Nasional
                    </button>
                    </> : 
                    <>
                  </>}
                  </div>
              <MapIndoChart onKabKotaClick={handleKabKotaClick} chartTitle={titleMap} roam={roam} maxValue={maxValueMap} colorData={["#FFD47A", "#FFC04D", "#FCAD24", "#E69B20", "#CC891C", "#B27717"]} onRegionClick={handleRegionClick} valueSeries={valueMap}/>
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
                <Col xl={6}>
                  <Row>
                    <Col>
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalPenduduk')
                        setTitleMap("Total Penduduk")
                      }}>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                              <span>Total Penduduk</span>
                            </div>
                            <div className="d-flex">
                              <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                  <i className="ri-account-circle-line text-warning"></i>
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.jenis_kelamin?.jumlah
                                    }
                                    separator="."
                                    // prefix=""
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
                    <Col>
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalLakiLaki')
                        setTitleMap("Total Laki-Laki")
                      }}>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>LAKI-LAKI</span>
                              <span className="title-percent">
                                {/* {dataJumlahPenduduk.persenLaki} */}
                              </span>
                            </div>
                            <div className="d-flex">
                              <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                  <i className="ri-men-line text-info"></i>
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={dataKependudukan?.jenis_kelamin?.laki}
                                    separator="."
                                    // prefix=""
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
                    <Col>
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalPerempuan')
                        setTitleMap("Total Perempuan")
                      }}>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>PEREMPUAN</span>
                              <span className="title-percent">
                                {/* {dataJumlahPenduduk.persenPerempuan} */}
                              </span>
                            </div>
                            <div className="d-flex">
                              <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                                  <i className=" ri-women-line text-danger"></i>
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan?.jenis_kelamin?.perempuan
                                    }
                                    separator="."
                                    // prefix=""
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
                </Col>
                <Col xl={6}>
                  <Row>
                    <Col>
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalKK')
                        setTitleMap("Total Kartu Keluarga")
                      }}>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                              <span>Jumlah Kartu Keluarga</span>
                            </div>
                            <div className="d-flex">
                              <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                  <i className="ri-home-8-line text-warning"></i>
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span style={{ fontSize: "18px" }}>
                                  {" "}
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan
                                        ?.jumlah_kepadatan_penduduk?.jml
                                    }
                                    separator="."
                                    // prefix=""
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
                    <Col>
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                       handleCardClick('totalKepadatan')
                       setTitleMap("Total Kepadatan Penduduk")
                      }}>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Kepadatan Penduduk</span>
                            </div>
                            <div className="d-flex">
                              <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                  <i className="ri-team-line text-warning"></i>
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan
                                        ?.jumlah_kepadatan_penduduk?.kepadatan
                                    }
                                    separator="."
                                    // prefix=""
                                    suffix=""
                                    duration={3}
                                  />{" "}
                                  Jiwa/Km<sup>2</sup>
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
                      <Card style={{cursor: "pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalLuasWilayah')
                        setTitleMap("Total Luas Wilayah")
                      }}>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Luas Wilayah</span>
                            </div>
                            <div className="d-flex">
                              <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-success-subtle rounded-4 fs-3">
                                  <i className="mdi mdi-arrow-expand text-success"></i>
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                <span style={{ fontSize: "18px" }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataKependudukan
                                        ?.jumlah_kepadatan_penduduk
                                        ?.luas_wilayah
                                    }
                                    separator="."
                                    // prefix=""
                                    suffix=""
                                    duration={3}
                                  />{" "}
                                  Km<sup>2</sup>
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
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
        <Card className="card-animate">
          <CardBody>
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
                        // onKeyDown={(e) => handleKeyDown(e, "seprovinsi")}
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
                      }} onClick={()=>{getDataTabelKependudukanProv({tahunData: selectedSingleTahunData, tahunAnggaran:selectedSingleTahunAnggaran, semester:selectedSingleTahunSemester}); resetRegionClick()}}>Kembali ke Provinsi</button></>) : (<></>)}  
    <div style={{ overflowX: "auto" }}>
      {/* Render Table */}
      <table
        className="table table-bordered table-nowrap align-middle mb-0 custom-table"
        style={{ width: "100%" }}
      >
        <thead className="table-light">
          <tr>
            {/* <th>Kode Provinsi</th> */}
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("nama_daerah")}>Nama Daerah {getSortIcon("nama_daerah")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("jumlahpenduduk")}>Total Penduduk (Jiwa) {getSortIcon("jumlahpenduduk")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("jmlkk")}>Jumlah KK (Jiwa) {getSortIcon("jmlkk")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("luas_wilayah")}>Luas Wilayah (Km²) {getSortIcon("luas_wilayah")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("kepadatan")}>Kepadatan (Jiwa/km²) {getSortIcon("kepadatan")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("jumlahlakilaki")}>Jumlah Penduduk Laki-laki (Jiwa) {getSortIcon("jumlahlakilaki")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}} onClick={() => requestSort("jumlahperempuan")}>Jumlah Penduduk Perempuan (Jiwa) {getSortIcon("jumlahperempuan")}</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}}>Jumlah Anggaran (Rp)</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}}>Total Anggaran Kependudukan (Rp)</th>
            <th style={{ whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",}}>Persentase Anggaran</th>
            {showNextData ? (<><th
              rowSpan="4"
              style={{
                whiteSpace: "normal",
                overflowWrap: "break-word",
                maxWidth: "150px",
                textAlign: "center",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
            >
              DETAIL ANGGARAN KEPENDUDUKAN
            </th></>):(<></>)}   
          </tr>
        </thead>
        <tbody style={{ minHeight: '500px' }}>
          {currentItems.map((item, index) => (
            <tr key={index}>
              {/* <td>{item.kode_daerah}</td> */}
              <td className={showNextData ? "" : "click-data"} onClick={() =>{showNextData ? "" : getDataTabelKependudukanKabKota({kodeProvinsi: item.kode_daerah, tahunAnggaran:selectedSingleTahunAnggaran, tahunData:selectedSingleTahunData})}}>{item.nama_daerah}</td>
              <td>{item.jumlahpenduduk.toLocaleString("id-ID")}</td>
              <td>{item.jmlkk.toLocaleString("id-ID")}</td>            
              <td>{item.luas_wilayah.toLocaleString("id-ID")}</td>
              <td>{item.kepadatan.toLocaleString("id-ID")}</td>
              <td>{item.jumlahlakilaki.toLocaleString("id-ID")}</td>
              <td>{item.jumlahperempuan.toLocaleString("id-ID")}</td>
              <td><span style={{ float: "right" }}>{item.total_anggaran ? parseInt(item.total_anggaran).toLocaleString("id-ID") : "-"}</span></td>
              <td><span style={{ float: "right" }}>{item.total_anggaran_kependudukan ? parseInt(item.total_anggaran_kependudukan).toLocaleString("id-ID") : "-"}</span></td>
              <td><span style={{ float: "right" }}>{`${item.persentase_anggaran? parseFloat(item.persentase_anggaran).toLocaleString("id-ID",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }): "-"}%`}</span></td>
              {showNextData ? (<><td style={{ textAlign: "center" }}>
                <i
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    fontSize: "30px",
                  }}
                  onClick={() => handleOpen({kodeDdn:item.kode_daerah, namaDaerah:item.nama_daerah, rincianDetail:item.total_anggaran_kependudukan})
                  }
                  className="bx bx-list-ul text-primary"
                ></i>
              </td></>): (<></>)}
            </tr>
          ))}
          {/* {placeholders} */}
        </tbody>
      </table>
      </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />                 
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
                      JUMLAH PENDUDUK
                    </NavLink>
                  </NavItem>
                  {/* <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "2",
                      })}
                      onClick={() => {
                        toggleCustomAll("2");
                      }}
                    >
                     PENGELOMPOKAN USIA BERDASARKAN PRODUKTIVITAS
                    </NavLink>
                  </NavItem>                   */}
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
                      AGAMA
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
                      PENDIDIKAN                 
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
                      }}
                    >
                      KELOMPOK UMUR                 
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>            
              <TabContent
                activeTab={customActiveTabAll}
                className="text-muted"
              >
                <TabPane tabId="1" id="provinsi">
                {/* <div className="separator">
                <h4 className="card-title mb-0 d-flex justify-content-center">Top 10 Jumlah Penduduk</h4>
              </div> */}
              <div className="nav-beranda">
                <Nav
                  tabs
                  className="nav nav-tabs-custom card-header-tabs border-bottom-0 ms-2 mb-3"
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
                      PROVINSI
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
                      KABUPATEN/KOTA
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
                      KECAMATAN
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={customActiveTab} className="text-muted">
                <TabPane tabId="1" id="provinsi">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Provinsi[0]}
                    categoryChart={dataChartTop10Provinsi[1]}
                    dataColors='["#57E7B4"]'                    
                    dataTotal={10}
                    dataZoom={true}
                  />
                </TabPane>
                <TabPane tabId="2" id="kabupaten">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Kabupaten[0]}
                    categoryChart={dataChartTop10Kabupaten[1]}
                    namaProv={dataChartTop10Kabupaten[2]}
                    dataColors='["#57E7B4"]'
                    dataZoom={true}
                    kabupaten={true}
                  />
                </TabPane>
                <TabPane tabId="3" id="kecamatan">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Kecamatan[0]}
                    categoryChart={dataChartTop10Kecamatan[1]}
                    namaProv={dataChartTop10Kecamatan[2]}
                    namaKab={dataChartTop10Kecamatan[3]}
                    dataColors='["#57E7B4"]'
                    dataZoom={true}
                    kecamatan={true}
                  />
                </TabPane>
                <TabPane tabId="4" id="kelurahan">
                  <HorizontalBarChart
                    valueChart={dataChartTop10Kelurahan[0]}
                    categoryChart={dataChartTop10Kelurahan[1]}
                    namaProv={dataChartTop10Kelurahan[2]}
                    namaKab={dataChartTop10Kelurahan[3]}
                    namaKec={dataChartTop10Kelurahan[4]}  
                    kelurahan={true}                  
                    dataColors='["#57E7B4"]'
                    dataZoom={true}
                  />
                </TabPane>
              </TabContent>
                </TabPane>
                <TabPane tabId="3" id="provinsi">
                <div className="separator mb-2">
                <h4 className="card-title d-flex justify-content-center">Agama</h4>
              </div>
              <HorizontalBarChart
                dataColors='["#FCAD24"]'
                valueChart={dataChartAgama[1]}
                categoryChart={dataChartAgama[0]}
              />
                </TabPane>
                <TabPane tabId="4" id="provinsi">
                <div className="separator mb-2">
                <h4 className="card-title d-flex justify-content-center">Pendidikan</h4>
              </div>
              <HorizontalBarChart
                dataColors='["#FCAD24"]'
                valueChart={dataChartPendidikan[0]}
                categoryChart={dataChartPendidikan[1]}
              />
                </TabPane>
                <TabPane tabId="5" id="provinsi">
                <div className="">
                <h4 className="card-title mb-2 d-flex justify-content-center">Kelompok Umur</h4>
              </div>
              <PyramidChart 
                    firstValue={dataChartLakiLaki[0]}
                    secondValue={dataChartPerempuan[0]}
                    category={dataChartPerempuan[1]}
                  />
                </TabPane>                
              </TabContent>
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
            Detail Anggaran Kependudukan {dataDetailNamaDaerah == "Aceh"? "Provinsi Aceh" : dataDetailNamaDaerah}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md={4}>
                <Card className="card-animate">
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
                              duration={1}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                
              </Col>
              <Col md={8}>
              {dataDetailHighlight.map((item, index)=>(
                <div className="d-flex mb-3" key={index}>
                  <div style={{ flexBasis: "350px", color:"#929FB1" }}>{item.nama_rekening}</div>
                  <div>:&nbsp;</div>
                  <div style={{ fontWeight: 650 }}>
                  <CountUp
                      start={0}
                      end={item.anggaran}
                      // decimal=","
                      // decimals={2}
                      separator="."
                      prefix="Rp "
                      // suffix=" T"
                      duration={1}
                    /> 
                    &nbsp;
                  </div>
                  {((item.anggaran/dataRincianDetail)*100)>=1 ? <>
                    <div>
                    (<CountUp
                      start={0}
                      end={(item.anggaran/dataRincianDetail)*100}
                      decimal=","
                      decimals={2}
                      separator="."
                      // prefix="Rp "
                      suffix="%"
                      duration={1}
                    />)
                  </div>
                  </> : <>
                  <div>
                    (<CountUp
                      start={0}
                      end={(item.anggaran/dataRincianDetail)*100}
                      decimal=","
                      decimals={6}
                      separator="."
                      // prefix="Rp "
                      suffix="%"
                      duration={1}
                    />)
                  </div>
                  </>}
                  
                </div>
              ))}
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
                        // onKeyDown={(e) => handleKeyDown(e, "seprovinsi")}
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
                  </div>
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
                    {/* {(dataJenisPemda =="prov" || dataJenisPemda =="kab" || dataJenisPemda =="kota")? (<></>):(<><th                        
                        onClick={() => requestSort("nama_daerah")}
                        style={{ cursor: "pointer", verticalAlign: "middle" }}
                      >
                        Nama Daerah {getSortIcon("nama_daerah")}
                      </th></>)} */}

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
                    <th
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      Lihat Sub Rincian Objek
                    </th>
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemDetail.map((item, index) => (
                    <tr key={index}>
                      {/* <td>{item.kode_prop}</td> */}
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        {/* {index + 1} */}
                        {indexOfFirstItemDetail + index + 1}
                      </td>
                      {/* {(dataJenisPemda =="prov" || dataJenisPemda =="kab" || dataJenisPemda =="kota") ? (<></>):(<><td style={{ maxWidth: "250px" }}>
                          {" "}
                          {item.nama_daerah || "-"}
                        </td></>)}                         */}
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
                        <i style={{                                            
                      padding: "5px 10px",                      
                      cursor: "pointer",
                      fontSize: "30px"
                    }} onClick={()=>handleOpenNextModalSub({kodeDdn: item.kode_ddn, kodeSubGiat: item.kode_sub_giat, rincianDetail: item.total_rinciansub, namaSubGiat:item.nama_sub_giat})} className="bx bx-list-ul text-primary"></i>
                      </td>
                    </tr>
                  ))}
                  {/* {placeholders} */}
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
        toggle={handleOpenNextModalSub}
        centered={true}
        backdrop="static"
      >
        <div className="modal-content border-0">
          <ModalHeader
            className=" p-3 bg-info-subtle"
            toggle={handleCloseNextModal}
          >
            Sub Rincian Objek {namaSubGiat}
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
                              duration={1}
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
                        value={searchTermDetailSub}
                        onChange={handleSearchInputDetailSub}
                        
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
                      onClick={() => requestSort("kode_sro")}
                      style={{ cursor: "pointer", verticalAlign: "middle" }}
                    >
                      Kode Sub Rincian Objek {getSortIcon("kode_sro")}
                    </th>
                    <th
                      onClick={() => requestSort("nama_sro")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      Nama Sub Rincian Objek {getSortIcon("nam_sro")}
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
                    <th style={{verticalAlign: "middle", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word",maxWidth:"100px"  }}>
                        Lihat Sub Sub Rincian Objek 
                      </th>           
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemDetailSub.map((item, index) => (
                    <tr key={index}>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        {/* {index + 1} */}
                        {indexOfFirstItemDetailSub + index + 1}
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
                      <td style={{verticalAlign: "middle", textAlign: "center" }}>            
                    <i style={{                                            
                      padding: "5px 10px",                      
                      cursor: "pointer",
                      fontSize: "30px"
                    }} onClick={()=>handleOpenNextModalSubSub({kodeDdn: item.kode_ddn, kodeSubGiat: item.kode_sub_giat, rincianDetail: item.total_rinciansro, namaSro: item.nama_sro})} className="bx bx-list-ul text-primary"></i>
                        </td> 
                    </tr>
                  ))}
                  {/* {placeholders} */}
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

      <Modal size="xl" isOpen={modalSub} toggle={handleOpenNextModalSub} centered={true} backdrop="static">
      <div className="modal-content border-0">
        <ModalHeader className=" p-3 bg-info-subtle" toggle={handleCloseNextModalSub}>Sub Sub Rincian Objek {namaSro}
        </ModalHeader>
        <ModalBody>
        <Row>
            <Col md={4}><Card className="card-animate card-height-100">
                        <CardBody>
                          <div
                            className="d-flex flex-column title-custom-card"                            
                          >
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>Total Anggaran Sub Rincian Objek</span>
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
                                      dataRincianDetailSubSub
                                    }
                                    separator="."
                                    prefix="Rp "
                                    suffix=""
                                    duration={1}
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
                  padding: "10px 30px 10px 10px",
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "16px",
                }}
                type="text"
                value={searchTermDetailSubSub}
                onChange={handleSearchInputDetailSubSub}
                // onKeyDown={(e) => handleKeyDown(e, "seprovinsi")}
                placeholder="Cari Sub Sub Rincian Objek"
              />

              {/* Tombol "X" di dalam input */}
              {searchTermDetailSubSub && (
                <button
                  onClick={() => handleClearSearchDetailSubSub()}
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
                        onClick={() => requestSort("kode_standar_harga")}
                        style={{ cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}
                      >
                        Kode Standar Harga {getSortIcon("kode_standar_harga")}
                      </th>                                                                  
                      <th                        
                        onClick={() => requestSort("nama_standar_harga")}
                        style={{ cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}
                      >
                        Nama Standar Harga {getSortIcon("nama_standar_harga")}
                      </th>                                                                  
                      <th                        
                        onClick={() => requestSort("satuan")}
                        style={{ cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}
                      >
                        Satuan {getSortIcon("satuan")}
                      </th>                                                                  
                      <th onClick={() => requestSort("volume")}
                        style={{ cursor: "pointer", textAlign: "center", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}>
                        Volume {getSortIcon("volume")}
                      </th>  
                      <th onClick={() => requestSort("harga_satuan")}
                        style={{ cursor: "pointer", textAlign: "center" }}>
                        Harga Satuan (Rp) {getSortIcon("harga_satuan")}
                      </th>
                      <th onClick={() => requestSort("total_rinciansro")}
                        style={{ cursor: "pointer", textAlign: "center" }}>
                        Total Rincian Sub sro {getSortIcon("total_rinciansro")}
                      </th>
                      <th onClick={() => requestSort("persentase")}
                        style={{ cursor: "pointer", textAlign: "center",whiteSpace: "normal",
                          wordWrap: "break-word" }}>
                        Persentase {getSortIcon("persentase")}
                      </th>                                                                   
                    </tr>  
                  </thead>
                  <tbody style={{ minHeight: "500px" }}>
                  {currentItemDetailSubSub.map((item, index) => (
                      <tr key={index}>                        
                        <td style={{textAlign: "center",
                        verticalAlign: "middle"}}>
                          {/* { index + 1} */}
                          {indexOfFirstItemDetailSubSub + index + 1}
                        </td>
                        <td>
                          {item.kode_standar_harga}
                        </td>
                        <td>
                          {item.nama_standar_harga}
                        </td>
                        <td style={{
                            whiteSpace: "normal",  // Membolehkan teks turun ke baris berikutnya
                            wordWrap: "break-word",  // Memastikan teks panjang terpotong dan turun ke bawah
                            maxWidth: "200px"  // Menetapkan lebar maksimum sel (sesuaikan dengan kebutuhan)
                          }}>
                          {" "}
                          {item.satuan || "-"}
                        </td>     
                        <td>
                        <span style={{float: "right"}}>{item.volume ? item.volume.toLocaleString("id-ID")
                          : "-"}</span>                          
                        </td>         
                        <td>
                        <span style={{float: "right"}}>{item.harga_satuan ? parseInt(item.harga_satuan).toLocaleString("id-ID")
                            : "-"}</span>                          
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
          <Pagination currentPage={currentPageDetailSubSub} totalPages={totalPagesDetailSubSub} onPageChange={paginateDetailSubSub} />
        </ModalBody>
      </div>          
      </Modal>
    </React.Fragment>
  );
};

export default ContentKependudukanV2;
