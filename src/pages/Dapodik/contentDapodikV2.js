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
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

const ContentDapodikV2 = () => {
  const [customActiveTab, setcustomActiveTab] = useState("2");
  const [customActiveTabAll, setcustomActiveTabAll] = useState("1");
  const [customActiveTabChartAnggaran, setcustomActiveTabChartAnggaran] =
    useState("1");
  const [customActiveTabTabel, setcustomActiveTabTabel] = useState("1");
  const [customActiveTabJenisData, setcustomActiveTabJenisData] = useState("1");
  const [titleChartAnggaran, setTitleChartAnggaran] = useState("");

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const toggleCustomJenis = (tab) => {
    if (customActiveTabJenisData !== tab) {
      setcustomActiveTabJenisData(tab);
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
  const [dataDapodikTabelSeProvinsiFiltered, setDataDapodikTabelSeProvinsiFiltered] = useState(
    []
  );
  const [dataDapodikTabelProvinsi, setDataDapodikTabelProvinsi] = useState([]);
  const [dataDapodikTabelProvinsiFiltered, setDataDapodikTabelProvinsiFiltered] = useState([]);
  const [dataDapodikTabelKabupaten, setDataDapodikTabelKabupaten] = useState(
    []
  );
  const [dataDapodikTabelKabupatenFiltered, setDataDapodikTabelKabupatenFiltered] = useState(
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

  const [selectedSingleTahunAnggaran, setSelectedSingleTahunAnggaran] = useState('2025'); // Set default value
  const [selectedSingleTahunData, setselectedSingleTahunData] = useState('2024'); // Set default value
  const [kodeWilayahPeta, setKodeWilayahPeta]=useState("")
  const handleSelectChangeAnggaran = (e) => {
    const { name, value } = e.target;
    setSelectedSingleTahunAnggaran(value); // Misalnya, untuk dropdown tahun
    // getDataAnakSekolah({kodeWilayah: kodeWilayahPeta, tahun: value, tahun_data: selectedSingleTahunData});
    getDataDapodik({kodeDdn: "", tahun: value, tahun_data: selectedSingleTahunData});
    getDataTabelDapodikSeProv({tahun:value, tahun_data: selectedSingleTahunData});
    getDataTabelDapodikProv({tahun:value, tahun_data: selectedSingleTahunData});
    getDataTabelDapodikKab({tahun:value, tahun_data: selectedSingleTahunData});
    getDataCrossAnalisis({tahun:value, tahun_data: selectedSingleTahunData});
  };  

  const handleSelectChangeDataPokok = (e) => {
    const { name, value } = e.target;
    setselectedSingleTahunData(value); // Misalnya, untuk dropdown tahun
    getDataAnakSekolah({kodeWilayah: "", tahun_data: value});
    getDataDapodik({kodeDdn: "", tahun: selectedSingleTahunAnggaran, tahun_data: value});
    getDataTabelDapodikSeProv({tahun:selectedSingleTahunAnggaran, tahun_data: value});
    getDataTabelDapodikProv({tahun:selectedSingleTahunAnggaran, tahun_data: value});
    getDataTabelDapodikKab({tahun:selectedSingleTahunAnggaran, tahun_data: value});
    getDataCrossAnalisis({tahun:selectedSingleTahunAnggaran, tahun_data: value});
  };

  const [dataSdMap, setDataSdMap] = useState([])
  const getDataDapodik = ({kodeDdn="", tahun="", tahun_data=""}) => {
    const fetchData = async () => {
        try {
            const token = JSON.parse(sessionStorage.getItem("authUser"));
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
                body: JSON.stringify({
                    kode_ddn: kodeDdn,
                    tahun: tahun,
                    tahun_data:tahun_data
                }),
            };
            const response = await fetch(`${API_URI_RBAC}/v2/dashboard_dapodik`, requestOptions);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const dataDapodik = await response.json();
            setDataDapodik(dataDapodik?.data);

            try {
                const mappedDataSd = Object.values(dataDapodik.data.dapodik_do_sd).filter((value) => typeof value === "number");
                const totalValueSd = [mappedDataSd, mappedDataSd.reduce((accumulator, value) => accumulator + value, 0)];
                setDataDropOutSd(totalValueSd);
            } catch (error) {
                console.error("Error processing data for SD:", error);
            }

            try {
                const mappedDataSmp = Object.values(dataDapodik.data.dapodik_do_smp).filter((value) => typeof value === "number");
                const totalValueSmp = [mappedDataSmp, mappedDataSmp.reduce((accumulator, value) => accumulator + value, 0)];
                setDataDropOutSmp(totalValueSmp);
            } catch (error) {
                console.error("Error processing data for SMP:", error);
            }

            try {
                const mappedDataSma = Object.values(dataDapodik.data.dapodik_do_sma).filter((value) => typeof value === "number");
                const totalValueSma = [mappedDataSma, mappedDataSma.reduce((accumulator, value) => accumulator + value, 0)];
                setDataDropOutSma(totalValueSma);
            } catch (error) {
                console.error("Error processing data for SMA:", error);
            }

            try {
                const mappedDataByUsia = Object.values(dataDapodik.data.dapodik_jumlah_belum_pernah_sekolah_by_usia).filter((value) => typeof value === "number");
                setDataBelumPernahSekolahByUsia(mappedDataByUsia);
            } catch (error) {
                console.error("Error processing data by usia:", error);
            }

            try {
                const mappedDataAts = Object.values(dataDapodik.data.dapodik_compare_ats_tidak_lanjut).filter((value) => typeof value === "number");
                setDataChartAts(mappedDataAts);
            } catch (error) {
                console.error("Error processing ATS data:", error);
            }

            try {
                const resultChartRincianDapodikProvinsi = dataDapodik.data.cross_analisis_ats_provinsi.reduce((acc, item) => {
                    acc[0].push(item.nama_daerah);
                    acc[1].push(item.persenats);
                    acc[2].push(item.persenblj);
                    acc[3].push(item.total_rincianall);
                    acc[4].push(item.total_rincianursbid);
                    return acc;
                }, [[], [], [], [], []]);

                setDataChartRincianDapodikProvinsi(resultChartRincianDapodikProvinsi);
            } catch (error) {
                console.error("Error processing chart data for provinsi:", error);
            }

            try {
                const resultChartRincianDapodikKabupaten = dataDapodik.data.cross_analisis_ats_kabkota.reduce((acc, item) => {
                    acc[0].push(item.nama_daerah);
                    acc[1].push(item.persenats);
                    acc[2].push(item.persenblj);
                    acc[3].push(item.total_rincianall);
                    acc[4].push(item.total_rincianursbid);
                    return acc;
                }, [[], [], [], [], []]);

                setDataChartRincianDapodikKabupaten(resultChartRincianDapodikKabupaten);
            } catch (error) {
                console.error("Error processing chart data for kabupaten:", error);
            }
        } catch (errorDapodik) {
            setErrorDapodik(errorDapodik);
        } finally {
            setLoadingDapodik(false);
        }
    };

    fetchData();
};


  const [titleMap, setTitleMap] = useState("Total Anak Sekolah")
  const [valueMap, setValueMap] = useState([]);
  const [maxValueMap, setmaxValueMap] = useState(0)
  const [handleCardClick, setHandleCardClick] = useState(() => () => {});

  const getDataTabelDapodikSeProv = ({searchTerm, tahun, tahun_data}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            // Mengirimkan pencarian nama_kabkota berdasarkan searchTerm
            nama_prov: searchTerm ? searchTerm : "",
            tahun: tahun,
            tahun_data:tahun_data
          }),
        };
        // /table_dapodik_provinsi
        // /table_dapodik_kabupaten
        // /table_stunting_provinsi
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_dapodik_seprovinsi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDapodikTabelSeProvinsi = await response.json();
        setDataDapodikTabelSeProvinsi(dataDapodikTabelSeProvinsi?.data);
        setDataDapodikTabelSeProvinsiFiltered(dataDapodikTabelSeProvinsi?.data);

        const valueTotalAnakSekolah = Array.isArray(dataDapodikTabelSeProvinsi?.data) 
        ? dataDapodikTabelSeProvinsi.data.map(item => {
            const total = 
              parseInt(item.sd || 0) + 
              parseInt(item.smp || 0) + 
              parseInt(item.sma || 0) + 
              parseInt(item.smk || 0);
            return {
              name: item.nama_prov || "Unknown",
              value: total
            };
          }) 
        : [];
               
        // const valueTotalAnakDropOutSd = dataDapodikTabelSeProvinsi.data.reduce((accumulate, item) => 
        //   accumulate + parseInt(item.totsd_do), 0
        // )        

        const valueTotalSd = Array.isArray(dataDapodikTabelSeProvinsi?.data)
        ? dataDapodikTabelSeProvinsi.data.map(item => ({
            name: item.nama_prov || "Unknown",
            value: parseInt(item.sd) || 0,
          }))
        : [];

        const valueTotalSmp = Array.isArray(dataDapodikTabelSeProvinsi?.data)
        ? dataDapodikTabelSeProvinsi.data.map(item => ({
            name: item.nama_prov || "Unknown",
            value: parseInt(item.smp) || 0,
          }))
        : [];

        const valueTotalSma = Array.isArray(dataDapodikTabelSeProvinsi?.data)
        ? dataDapodikTabelSeProvinsi.data.map(item => ({
            name: item.nama_prov || "Unknown",
            value: parseInt(item.sma) || 0,
          }))
        : [];

        const valueTotalSmk = Array.isArray(dataDapodikTabelSeProvinsi?.data)
        ? dataDapodikTabelSeProvinsi.data.map(item => ({
            name: item.nama_prov || "Unknown",
            value: parseInt(item.smk) || 0,
          }))
        : [];

        const maxAnakSekolah = Array.isArray(valueTotalAnakSekolah) && valueTotalAnakSekolah.length > 0 
        ? Math.max(...valueTotalAnakSekolah.map(item => item.value || 0)) 
        : 0;
      
      const maxSd = Array.isArray(valueTotalSd) && valueTotalSd.length > 0 
        ? Math.max(...valueTotalSd.map(item => item.value || 0)) 
        : 0;
      
      const maxSmp = Array.isArray(valueTotalSmp) && valueTotalSmp.length > 0 
        ? Math.max(...valueTotalSmp.map(item => item.value || 0)) 
        : 0;
      
      const maxSma = Array.isArray(valueTotalSma) && valueTotalSma.length > 0 
        ? Math.max(...valueTotalSma.map(item => item.value || 0)) 
        : 0;
      
      const maxSmk = Array.isArray(valueTotalSmk) && valueTotalSmk.length > 0 
        ? Math.max(...valueTotalSmk.map(item => item.value || 0)) 
        : 0;
        setValueMap(valueTotalAnakSekolah);
        setmaxValueMap(maxAnakSekolah)

        const handleCardClick = (valueType) => {
          switch(valueType) {
            case 'totalAnakSekolah':
              setValueMap(valueTotalAnakSekolah);
              setmaxValueMap(maxAnakSekolah)
              break;
            case 'totalSD':
              setValueMap(valueTotalSd);
              setmaxValueMap(maxSd)
              break;
            case 'totalSMP':
              setValueMap(valueTotalSmp);
              setmaxValueMap(maxSmp)
              break;
            case 'totalSMA':
              setValueMap(valueTotalSma);
              setmaxValueMap(maxSma)
              break;
            case 'totalSMK':
              setValueMap(valueTotalSmk);
              setmaxValueMap(maxSmk)
              break;            
            default:
              break;
          }
        };
        
  
        // Simpan `handleCardClick` di dalam state atau panggil langsung pada setiap card
        setHandleCardClick(() => handleCardClick);
 
      } catch (errorDapodikTabel) {
        setErrorDapodikTabel(errorDapodikTabel);
      } finally {
        setLoadingDapodikTabel(false);
      }
    };
    fetchData();
  };

  const getDataTabelDapodikKab = ({searchTerm, tahun, tahun_data}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            // Mengirimkan pencarian nama_kabkota berdasarkan searchTerm
            nama_kabkota: searchTerm ? searchTerm : "",
            tahun: tahun,
            tahun_data:tahun_data
          }),
        };
        // /table_dapodik_provinsi
        // /table_dapodik_kabupaten
        // /table_stunting_provinsi
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_dapodik_kabupaten`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDapodikTabelKabupaten = await response.json();

        setDataDapodikTabelKabupaten(dataDapodikTabelKabupaten?.data);
        setDataDapodikTabelKabupatenFiltered(dataDapodikTabelKabupaten?.data);
      } catch (errorDapodikTabel) {
        setErrorDapodikTabel(errorDapodikTabel);
      } finally {
        setLoadingDapodikTabel(false);
      }
    };
    fetchData();
  };
  
  const getDataCrossAnalisis = ({tahun, tahun_data}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            tahun:tahun,
            tahun_data: tahun_data
          }),
        };
        
        const response = await fetch(
          `${API_URI_RBAC}/v2/dashboard_dapodik_cross_analisis_ats_seprovinsi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDapodikCrossAnalisis = await response.json();

        const resultChartRincianDapodik =
        dataDapodikCrossAnalisis.data.reduce(
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

      } catch (errorDapodikTabel) {
        setErrorDapodikTabel(errorDapodikTabel);
      } finally {
        setLoadingDapodikTabel(false);
      }
    };
    fetchData();
  };

  const [dataDapodikJumlahAnakSekolah, setDataDapodikJumlahAnakSekolah] = useState([])
  const getDataAnakSekolah = ({kodeWilayah, tahun, tahun_data}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_wilayah: kodeWilayah,
            tahun: tahun,
            tahun_data:tahun_data
        }),
        };
        
        const response = await fetch(
          `${API_URI_RBAC}/v2/dashboard_dapodik_jumlah_anak_sekolah`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDapodikJumlahAnakSekolah = await response.json();
        setDataDapodikJumlahAnakSekolah(dataDapodikJumlahAnakSekolah?.data)
        const totalJumlahSiswa = dataDapodikJumlahAnakSekolah.data.reduce((acc, item) => acc + item.jumlah_siswa, 0);
        setDataTotalTkSdSmpSma(totalJumlahSiswa);

      } catch (errorDapodikTabel) {
        setErrorDapodikTabel(errorDapodikTabel);
      } finally {
        setLoadingDapodikTabel(false);
      }
    };
    fetchData();
  };



  const getDataTabelDapodikProv = ({searchTerm, tahun, tahun_data}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            // Mengirimkan pencarian nama_kabkota berdasarkan searchTerm
            nama_prov: searchTerm,
            tahun: tahun,
            tahun_data:tahun_data
          }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_dapodik_provinsi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataDapodikTabelProvinsi = await response.json();
        setDataDapodikTabelProvinsi(dataDapodikTabelProvinsi?.data);
        setDataDapodikTabelProvinsiFiltered(dataDapodikTabelProvinsi?.data);
        setShowNextData(false)
        const filterKabupaten = dataDapodikTabelProvinsi?.data?.filter((item)=>(
          item.jns_pemda=="kab" || item.jns_pemda=="kota"
        ))
        setDataKolomNamaDaerah("Provinsi");
        setCurrentPageProvinsi(1)

      } catch (errorDapodikTabel) {
        setErrorDapodikTabel(errorDapodikTabel);
      } finally {
        setLoadingDapodikTabel(false);
      }
    };
    fetchData();
  };

    const [dataDetailAnggaranSubSub, setDataDetailAnggaranSubSub] = useState([]);
    const [dataDetailAnggaranSubSubFiltered, setDataDetailAnggaranSubSubFiltered] = useState([]);
    const [loadingDetailAnggaranSub, setLoadingDetailAnggaranSub] = useState([]);
    const [errorDetailAnggaranSub, setErrorDetailAnggaranSub] = useState([]);
  
    const getDataDetailAnggaranSubSub = ({kodeDdn, kodeSubGiat, kodeSro, tahun, url}) => {
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
              kode_sro: kodeSro,
              tahun: tahun
            }),
          };
    
          const response = await fetch(
            `${API_URI_RBAC}/v2${url}`,
            requestOptions
          );
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const dataDetailAnggaran = await response.json();
          setDataDetailAnggaranSubSub(dataDetailAnggaran?.data)
          setDataDetailAnggaranSubSubFiltered(dataDetailAnggaran?.data)
          setModalSub(true)
        } catch (errorDetailAnggaran) {
          setErrorDetailAnggaran(errorDetailAnggaran);
        } finally {
          setLoadingDetailAnggaran(false);
        }
      };
    
      fetchData();
    };

  const getDataTabelDapodikProvDetail = (kodeProv, e) => {
    const fetchData = async () => {      
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            // Mengirimkan pencarian nama_kabkota berdasarkan searchTerm
            kode_prov: kodeProv
          }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_dapodik_provinsi_detail`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataDapodikTabelProvinsiDetail = await response.json();
        e.stopPropagation(); // Mencegah event bubbling jika dibutuhkan
        setShowNextData(true);
        setDataKolomNamaDaerah("Nama Daerah");
        setCurrentPageProvinsi(1)
        setDataDapodikTabelProvinsi(dataDapodikTabelProvinsiDetail?.data);

      } catch (errorDapodikTabel) {
        setErrorDapodikTabel(errorDapodikTabel);
      } finally {
        setLoadingDapodikTabel(false);
      }
    };
    fetchData();
  };

  const [dataDetailAnggaran, setDataDetailAnggaran] = useState([]);
  const [dataDetailAnggaranFiltered, setDataDetailAnggaranFiltered] = useState([]);
  const [dataDetailAnggaranSub, setDataDetailAnggaranSub] = useState([]);
  const [dataDetailAnggaranSubFiltered, setDataDetailAnggaranSubFiltered] = useState([]);
  const [dataDetailHighlight, setDataDetailHighlight] = useState([])
  const [loadingDetailAnggaran, setLoadingDetailAnggaran] = useState([]);
  const [errorDetailAnggaran, setErrorDetailAnggaran] = useState([]);

  const getDataDetailAnggaran = (
    kodeSeProvinsi = "",
    kodeDdnKabupaten = "",
    kodeDdnProvinsi = "",
    kodeSubGiat = "",
    jenisPemda,
    tahun,
    tahun_data
  ) => {
    const fetchData = async () => {
      setLoadingDetailAnggaran(true); // Set loading state to true when starting the fetch
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_prov: kodeSeProvinsi,
            kode_ddn: kodeDdnKabupaten != "" ? kodeDdnKabupaten : kodeDdnProvinsi,
            kode_sub_giat: kodeSubGiat,
            tahun: tahun,
            tahun_data: tahun_data
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2/detail-tabel-dapodik`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDetailAnggaran = await response.json();

        if (kodeSeProvinsi != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_seprovinsi
          );
          setDataDetailAnggaranFiltered(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_seprovinsi
          );
          setDataDetailHighlight(dataDetailAnggaran?.data?.dapodik_highlight_nasional)
          setModall(true);
        } else if (kodeDdnProvinsi != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_byprovinsi
          );
          setDataDetailAnggaranFiltered(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_byprovinsi
          );
          setDataDetailHighlight(dataDetailAnggaran?.data?.dapodik_highlight_daerah)
          setModall(true);
        } else if (kodeDdnKabupaten != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_bykabupaten
          );
          setDataDetailAnggaranFiltered(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_bykabupaten
          );
          setDataDetailHighlight(dataDetailAnggaran?.data?.dapodik_highlight_daerah)
          setModall(true);
        }

        if (kodeSeProvinsi != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_seprovinsi_sro
          );
          setDataDetailAnggaranSubFiltered(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_seprovinsi_sro
          );
          setModal(true);
        } else if (kodeDdnProvinsi != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_provinsi_sro
          );
          setDataDetailAnggaranSubFiltered(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_provinsi_sro
          );
          setModal(true);
        } else if (kodeDdnKabupaten != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_provinsi_sro
          );
          setDataDetailAnggaranSubFiltered(
            dataDetailAnggaran?.data?.detail_tabel_dapodik_provinsi_sro
          );
          setModal(true);
        }

        setCurrentPageDetail(1);
        setCurrentPageDetailSub(1);
      } catch (errorDetailAnggaran) {
        setErrorDetailAnggaran(errorDetailAnggaran);
      } finally {
        setLoadingDetailAnggaran(false);
      }
    };

    fetchData();
  };

  useEffect(() => {
    getDataDapodik({kodeDdn: "", tahun: selectedSingleTahunAnggaran, tahun_data:selectedSingleTahunData});
    getDataAnakSekolah({kodeWilayah: "", tahun_data:selectedSingleTahunData});
    getDataTabelDapodikSeProv({tahun:selectedSingleTahunAnggaran, tahun_data:selectedSingleTahunData});
    getDataTabelDapodikProv({tahun:selectedSingleTahunAnggaran, tahun_data:selectedSingleTahunData});
    getDataTabelDapodikKab({tahun:selectedSingleTahunAnggaran, tahun_data:selectedSingleTahunData});
    getDataCrossAnalisis({tahun:selectedSingleTahunAnggaran, tahun_data:selectedSingleTahunData});
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProvinsi, setCurrentPageProvinsi] = useState(1);
  const [currentPageKabupaten, setCurrentPageKabupaten] = useState(1);
  const [currentPageDetail, setCurrentPageDetail] = useState(1);
  const [currentPageDetailSub, setCurrentPageDetailSub] = useState(1);
  const [currentPageDetailSubSub, setCurrentPageDetailSubSub] = useState(1);
  const [itemsPerPage] = useState(10);
  const [itemsPerPageDetail] = useState(10);
  const [itemsPerPageDetailSub] = useState(10); // Set items per page
  const [itemsPerPageDetailSubSub] = useState(10); // Set items per page
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

    const indexOfLastItemDetailSubSub = currentPageDetailSubSub * itemsPerPageDetailSubSub;
  const indexOfFirstItemDetailSubSub =
    indexOfLastItemDetailSubSub - itemsPerPageDetailSubSub;

  // Sorting logic
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...(dataDapodikTabelSeProvinsiFiltered || [])];
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
  }, [dataDapodikTabelSeProvinsiFiltered, sortConfig]);

  const sortedItemsKabupaten = React.useMemo(() => {
    let sortableItems = [...(dataDapodikTabelKabupatenFiltered || [])];
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
  }, [dataDapodikTabelKabupatenFiltered, sortConfig]);

  const sortedItemsProvinsi = React.useMemo(() => {
    let sortableItems = [...(dataDapodikTabelProvinsiFiltered || [])];
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
  }, [dataDapodikTabelProvinsiFiltered, sortConfig]);

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

  const currentItemsDetailSubSub = sortedItemsDetailSubSub.slice(
    indexOfFirstItemDetailSubSub,
    indexOfLastItemDetailSubSub
  );

  // Calculate total number of pages
  const totalPages = Math.ceil(
    (dataDapodikTabelSeProvinsiFiltered?.length || 0) / itemsPerPage
  );
  const totalPagesProvinsi = Math.ceil(
    (dataDapodikTabelProvinsiFiltered?.length || 0) / itemsPerPage
  );
  const totalPagesKabupaten = Math.ceil(
    (dataDapodikTabelKabupatenFiltered?.length || 0) / itemsPerPage
  );
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
  
  const [dataKolomNamaDaerah, setDataKolomNamaDaerah] = useState("Provinsi");
  const [showNextData, setShowNextData] = useState(false);
  
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
  const [modalSub, setModalSub] = useState(false);
  const [dataJenisPemda, setDataJenisPemda] = useState("");
  const [dataRincianDetail, setDataRincianDetail] = useState(0);
  const [dataRincianDetailSub, setDataRincianDetailSub] = useState(0);
  const [dataRincianDetailSubSub, setDataRincianDetailSubSub] = useState(0);

  const handleOpen = (
    kodeProv,
    namaDaerah = "",
    kodeDdnKab = "",
    kodeDdnProv = "",
    jenisPemda = "",
    rincianDetail = 0
  ) => {
    getDataDetailAnggaran(kodeProv, kodeDdnKab, kodeDdnProv, "", jenisPemda, selectedSingleTahunAnggaran, selectedSingleTahunData);

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

  const handleOpenNextModalSub = ({kodeDdn, kodeSubGiat, kodeSro,tahun, rincianDetail, namaSro}) => {
    let url = ""
    dataJenisPemda === "seProv" ? url = "/dapodik_ssro_seprov" : url = "/dapodik_ssro_provkabkota"
    getDataDetailAnggaranSubSub({kodeDdn:kodeDdn, kodeSubGiat:kodeSubGiat, kodeSro:kodeSro, tahun:tahun, url: url})
    setNamaSro(namaSro)
    setDataRincianDetailSubSub(rincianDetail);
    setCardHead(null)
  }
  
  const handleCloseNextModalSub = () => {
    setModalSub(false)
  }

  const [cardhead, setCardHead] = useState();
  const [namaSubGiat, setNamaSubGiat] = useState("")
  const [namaSro, setNamaSro] = useState("")

  const handleOpenNextModal = (
    kodeDaerah,
    kodeSubGiat,
    kodeDdn,
    rincianDetail = "",
    namaSubGiat = ""
  ) => {
    if (kodeDaerah != "") {
      getDataDetailAnggaran(kodeDaerah, "", "", kodeSubGiat, "", selectedSingleTahunAnggaran, selectedSingleTahunData);
    } else if (kodeDdn != "") {
      getDataDetailAnggaran("", "", kodeDdn, kodeSubGiat, "", selectedSingleTahunAnggaran, selectedSingleTahunData);
    }
    // setModal(true);
    setDataRincianDetailSub(rincianDetail);
    setNamaSubGiat(namaSubGiat)
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

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermProvinsi, setSearchTermProvinsi] = useState("");
  const [searchTermKab, setSearchTermKab] = useState("");
  const [searchTermDetail, setSearchTermDetail] = useState(""); 
  const [searchTermDetailSub, setSearchTermDetailSub] = useState(""); 
  const [searchTermDetailSubSub, setSearchTermDetailSubSub] = useState(""); 

  // Fungsi untuk menangani perubahan pada input
  const handleSearchInput = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(e.target.value);
    if(value===""){
     setDataDapodikTabelSeProvinsiFiltered(dataDapodikTabelSeProvinsi)
    }else{
      const filtered = dataDapodikTabelSeProvinsi.filter((item) => {
        return item.nama_prov.toLowerCase().includes(value)
        }
      );
      setDataDapodikTabelSeProvinsiFiltered(filtered)
    }
    setCurrentPage(1);
  };

  const handleSearchInputProvinsi = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTermProvinsi(e.target.value);
    if(value===""){
     setDataDapodikTabelProvinsiFiltered(dataDapodikTabelProvinsi)
    }else{
      const filtered = dataDapodikTabelProvinsi.filter((item) => {
          return item.nama_prov.toLowerCase().includes(value)
        }
      );
     setDataDapodikTabelProvinsiFiltered(filtered)
    }
    setCurrentPageProvinsi(1);
  };

  const handleSearchInputKabupaten = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTermKab(e.target.value);
    if(value===""){
     setDataDapodikTabelKabupatenFiltered(dataDapodikTabelKabupaten)
    }else{
      const filtered = dataDapodikTabelKabupaten.filter((item) => {  
          return item.nama_kabkota.toLowerCase().includes(value)
        }
      );
      setDataDapodikTabelKabupatenFiltered(filtered)
    }
    setCurrentPageKabupaten(1);
  };

  const handleClearSearch = (area = "") => {
    // area === "kabupaten" ? (setCurrentPageKabupaten(1), setSearchTermKab(""), setDataDapodikTabelKabupatenFiltered(dataDapodikTabelKabupaten)) : area ==="provinsi" ? (setSearchTerm(""), setCurrentPageProvinsi(1), setDataDapodikTabelProvinsiFiltered(dataDapodikTabelProvinsi)) : (setCurrentPage(1), setSearchTerm(""), setDataDapodikTabelSeProvinsiFiltered(dataDapodikTabelSeProvinsi))
    if (area === "kabupaten") {
      setCurrentPageKabupaten(1);
      setSearchTermKab("");
      setDataDapodikTabelKabupatenFiltered(dataDapodikTabelKabupaten);
    } else if (area === "provinsi") {
      setSearchTermProvinsi("");
      setCurrentPageProvinsi(1);
      setDataDapodikTabelProvinsiFiltered(dataDapodikTabelProvinsi);
    } else {
      setCurrentPage(1);
      setSearchTerm("");
      setDataDapodikTabelSeProvinsiFiltered(dataDapodikTabelSeProvinsi);
    }
  };

  const handleSearchInputDetail = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTermDetail(value);
    if (value === "") {
      setDataDetailAnggaranFiltered(dataDetailAnggaran)
    } else {
      const filtered = dataDetailAnggaran.filter((item) => {
          return item.nama_sub_giat.toLowerCase().includes(value)
      }
      );
      setDataDetailAnggaranFiltered(filtered)
    }
    setCurrentPageDetail(1);
  };

  const handleClearSearchDetail = (area = "") => {
    setCurrentPageDetail(1);
    setSearchTermDetail(""); // Kosongkan isi input
    setDataDetailAnggaranFiltered(dataDetailAnggaran)
  };

  const handleSearchInputDetailSub = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTermDetailSub(value);
    if (value === "") {
      setDataDetailAnggaranSubFiltered(dataDetailAnggaranSub)  
    } else {
      const filtered = dataDetailAnggaranSub.filter((item) => {
          return item.nama_sro.toLowerCase().includes(value)
      }
      );
      setDataDetailAnggaranSubFiltered(filtered)
    }
    setCurrentPageDetailSub(1);
  };

  const handleClearSearchDetailSub = () => {
    setCurrentPageDetailSub(1);
    setSearchTermDetailSub(""); // Kosongkan isi input
    setDataDetailAnggaranSubFiltered(dataDetailAnggaranSub)
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

  const [dataWidth, setDataWidth] = useState(6)  
  const [roam, setRoam] = useState(false)

  const [dataShowChartTidakLanjutProvinsi, setShowDataChartTidakLanjutProvinsi] = useState(false)
  const [dataShowChartTidakLanjutPemda, setShowDataChartTidakLanjutPemda] = useState(false)
  
  const [currentCategoryClicked, setCurrentCategoryClicked] = useState(null)
  const [dataChartDetailTidakLanjutProvinsi, setDataChartDetailTidakLanjutProvinsi] = useState([],[],0,[])    
  const [tidakLanjutShow, setTidakLanjutShow] = useState("")

  const handleBarClick = (params) => {
    const clickedCategory = params.name
    setTidakLanjutShow(clickedCategory)        
    const dataDetail = (clickedCategory == "SMP" ? dataDapodik.dapodik_compare_ats_tidak_lanjut_ltm6_prov.reduce((acc, item) => {
      acc[0].push(item.tkt_6_ltm)
      acc[1].push(item.nama_prov)      
      acc[2] += item.tkt_6_ltm;
      acc[3].push(item.kode_prov)
      return acc
    }, [[],[], 0, []]) : dataDapodik.dapodik_compare_ats_tidak_lanjut_ltm9_prov.reduce((acc, item) => {
      acc[0].push(item.tkt_9_ltm)
      acc[1].push(item.nama_prov)
      acc[2] += item.tkt_9_ltm;
      acc[3].push(item.kode_prov)
      return acc
    }, [[],[], 0, []]))
    
    setCurrentCategoryClicked(clickedCategory)    
    setDataChartDetailTidakLanjutProvinsi(dataDetail)
    setShowDataChartTidakLanjutProvinsi(true)
  };

  const [dataDapodikTidakLanjutPemda, setDataDapodikTidakLanjutPemda] = useState([],[])
  const getDataDapodikTidakLanjutPerProv = ({kodeDdn = "", url=""}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_ddn: kodeDdn,
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2${url}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDapodikTidakLanjut = await response.json();

        const dataDetail = (tidakLanjutShow == "SMP" ? dataDapodikTidakLanjut.data.reduce((acc, item) => {
          acc[0].push(item.tkt_6_ltm)
          acc[1].push(item.nama_kabkota)      
          acc[2] += item.tkt_6_ltm;
          acc[3].push(item.kode_ddn)
          return acc
        }, [[],[], 0, []]) : dataDapodikTidakLanjut.data.reduce((acc, item) => {
          acc[0].push(item.tkt_6_ltm)
          acc[1].push(item.nama_kabkota)
          acc[2] += item.tkt_6_ltm;
          acc[3].push(item.kode_ddn)
          return acc
        }, [[],[], 0, []]))
        
        setDataDapodikTidakLanjutPemda(dataDetail)

        setShowDataChartTidakLanjutPemda(true)
      } catch (errorDapodik) {
        setErrorDapodik(errorDapodik);
      } finally {
        setLoadingDapodik(false);
      }
    };
    fetchData();
  };

  const handleBarClickProv = (data) => {
    if (tidakLanjutShow == "SMP") {      
      getDataDapodikTidakLanjutPerProv({kodeDdn: data.id, url: "/dashboard_dapodik_detail_ats_ltm6_kabkota"})
    } else {      
      getDataDapodikTidakLanjutPerProv({kodeDdn: data.id, url: "/dashboard_dapodik_detail_ats_ltm9_kabkota"})
    }  
  };

  
  const [clickDaerah, setClickDaerah] = useState(false)
  const [clickNamaDaerah, setClickNamaDaerah] = useState("")
  const handleRegionClick = (kodeProv, namaProv) => {
    setKodeWilayahPeta(kodeProv)
    getDataDapodik({kodeDdn: kodeProv, tahun_data:selectedSingleTahunData, tahun:selectedSingleTahunAnggaran})
    getDataAnakSekolah({kodeWilayah: kodeProv, tahun_data:selectedSingleTahunData})
    setClickNamaDaerah(namaProv)
    setClickDaerah(true)
  };

  const resetRegionClick = () => {
    getDataDapodik({kodeDdn: "", tahun_data: selectedSingleTahunData, tahun:selectedSingleTahunAnggaran});
    getDataAnakSekolah({kodeWilayah: "", tahun_data:selectedSingleTahunData});
    setClickDaerah(false)
  }

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        handleCloseNextModalSub();
        handleCloseNextModal()
        handleClose()
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
              <div className="d-flex justify-content-center align-items-center avatar-sm">
                <span className="logo-sm">
                  <img src={logoKemendikbud} alt="" width="40" height="40" />
                </span>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>Kementerian Pendidikan Dasar dan Menengah</span>
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
              value={selectedSingleTahunAnggaran}
              onChange={handleSelectChangeAnggaran}
            >                        
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select> */}
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
                  <MapIndoChart chartTitle={titleMap} roam={roam} maxValue={maxValueMap} colorData={['#B3E0E5', '#69D6E8', '#0092B3', '#1B8BA6']} onRegionClick={handleRegionClick} valueSeries={valueMap}/>
              {/* <PolygonMaps /> */}
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
                <Col>
                  <Card style={{cursor:"pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick('totalAnakSekolah')
                        setTitleMap("Total Anak Sekolah")
                      }}>
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
                {dataDapodikJumlahAnakSekolah
                  ?.slice(0, 2)
                  .map((item, index) => (
                    <Col md={6} key={`first-${index}`}>
                      <Card style={{cursor:"pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick(`total${item.bentuk_pendidikan}`)
                        setTitleMap(`Total ${item.bentuk_pendidikan}`)
                      }}>
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
                {dataDapodikJumlahAnakSekolah
                  ?.slice(2, 4)
                  .reverse()
                  .map((item, index) => (
                    <Col md={6} key={`second-${index}`}>
                      <Card style={{cursor:"pointer"}} className="card-animate card-height-100" onClick={()=> {
                        handleCardClick(`total${item.bentuk_pendidikan}`)
                        setTitleMap(`Total ${item.bentuk_pendidikan}`)
                      }}>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                              <span>{item.bentuk_pendidikan}</span>
                            </div>
                            <div className="d-flex">
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
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
                  <div>                  
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
                      handleClearSearch('seprov')
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
                      handleClearSearch('provinsi')
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
                      handleClearSearch('kabupaten')
                    }}
                  >
                    KABUPATEN/KOTA
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={customActiveTabTabel}>
              <div className="nav-beranda">
                    <Nav
                      tabs
                      className="nav nav-tabs-custom card-header-tabs border-bottom-0 ms-2 mb-3"
                    >                      
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabJenisData === "1",
                          })}
                          onClick={() => {
                            toggleCustomJenis("1");
                          }}
                        >
                          DATA POKOK
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabJenisData === "2",
                          })}
                          onClick={() => {
                            toggleCustomJenis("2");
                          }}
                        >
                          ANAK TIDAK SEKOLAH
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
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

                  <div style={{ overflowX: "auto" }}>
                    {/* Render Table */}
                    <table
                      className="table table-bordered table-nowrap align-middle mb-0 custom-table"
                      style={{ width: "100%" }}
                    >
                      <thead className="table-light">
                        {customActiveTabJenisData == "1" ? (<>
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
                              textAlign:"center"
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
                            Peserta Didik
                          </th>
                          <th
                            colSpan="4"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Tenaga Pengajar
                          </th>
                          <th
                            colSpan="4"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Jumlah Sekolah
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
                            onClick={() => requestSort("guru_sd")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SD {getSortIcon("guru_sd")}
                          </th>
                          <th
                            onClick={() => requestSort("guru_smp")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SMP {getSortIcon("guru_smp")}
                          </th>
                          <th
                            onClick={() => requestSort("guru_sma")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SMA {getSortIcon("guru_sma")}
                          </th>
                          <th
                            onClick={() => requestSort("guru_smk")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            SMK {getSortIcon("guru_smk")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_sekolah_sd")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SD {getSortIcon("jumlah_sekolah_sd")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_sekolah_smp")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SMP {getSortIcon("jumlah_sekolah_smp")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_sekolah_sma")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SMA {getSortIcon("jumlah_sekolah_sma")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_sekolah_smk")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            SMK {getSortIcon("jumlah_sekolah_smk")}
                          </th>
                        </tr>
                        </>) : (
                        <>
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
                        </>)}                        
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
                            {customActiveTabJenisData == "1" ? (<><td style={{ backgroundColor: "#f7f7ff" }}>
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
                            <td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.guru_sd
                                ? parseInt(item.guru_sd).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.guru_smp
                                ? parseInt(item.guru_smp).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td  style={{ backgroundColor: "#f7f7ff" }}>
                              {item.guru_sma
                                ? parseInt(item.guru_sma).toLocaleString("id-ID")
                                : "-"}
                            </td >
                            <td style={{ backgroundColor: "#f7f7ff", borderRight: "2px solid #A9A9A9" }}>
                              {item.guru_smk
                                ? parseInt(item.guru_smk).toLocaleString("id-ID")
                                : "-"}
                            </td>

                            <td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.jumlah_sekolah_sd
                                ? parseInt(item.jumlah_sekolah_sd).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.jumlah_sekolah_smp
                                ? parseInt(item.jumlah_sekolah_smp).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td  style={{ backgroundColor: "#f7f7ff" }}>
                              {item.jumlah_sekolah_sma
                                ? parseInt(item.jumlah_sekolah_sma).toLocaleString("id-ID")
                                : "-"}
                            </td >
                            <td style={{ backgroundColor: "#f7f7ff", borderRight: "2px solid #A9A9A9" }}>
                              {item.jumlah_sekolah_smk
                                ? parseInt(item.jumlah_sekolah_smk).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            </>):(<>
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
                            </>)}                                                        
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
                                    "se-prov",
                                    item.total_pendidikan
                                  )
                                }
                                className="bx bx-list-ul text-primary"
                              ></i>
                            </td>
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
                </TabPane>
                <TabPane tabId="2" id="">
                <div className="mb-2 d-flex">
                  {showNextData ? (<></>): (<><div
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
                        value={searchTermProvinsi}
                        onChange={handleSearchInputProvinsi}
                        // onKeyDown={(e) => handleKeyDown(e, "provinsi")}
                        placeholder="Cari Provinsi"
                      />

                      {/* Tombol "X" di dalam input */}
                      {searchTermProvinsi && (
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
                        onClick={() => handleButtonClick("provinsi")}
                      >
                        search
                      </button>
                    </div> */}
                    </>)}                    
                  </div>                  
                  {showNextData ? (
                    <><button
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginBottom: "8px",
                    }}
                    onClick={() => getDataTabelDapodikProv({searchTerm, tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData})}
                  >
                    Kembali ke Provinsi
                  </button></>
                  ) : (
                    <>
                    </>
                  )}
                  <div style={{ overflowX: "auto" }}>
                    {/* Render Table */}
                    <table
                      className="table table-bordered table-nowrap align-middle mb-0 custom-table"
                      style={{ width: "100%" }}
                    >
                      <thead className="table-light">
                      {customActiveTabJenisData == "1" ? (<>
                        <tr>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              cursor: "pointer",
                              verticalAlign: "middle",
                            }}
                          >
                            No
                          </th>
                          <th
                            rowSpan="2"
                            onClick={() => dataKolomNamaDaerah =="Provinsi" ? requestSort("kode_prov") : requestSort("kode_ddn")}
                            style={{
                              cursor: "pointer",
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          >
                            {dataKolomNamaDaerah}
                            {dataKolomNamaDaerah == "Provinsi"
                              ? getSortIcon("kode_prov")
                              : getSortIcon("kode_ddn")}                            
                          </th>
                          <th
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Peserta Didik
                          </th>
                          <th
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Tenaga Pengajar
                          </th>
                          <th
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Jumlah Sekolah
                          </th>
                          {/* <th colSpan="2" style={{ textAlign: "center" }}>
                            Anak Tidak Sekolah
                          </th> */}
                          {showNextData ? (<></>) : (<><th
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
                          </th></>)}                          
                        </tr>
                        <tr>
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
                            onClick={() => requestSort("guru_sma")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SMA {getSortIcon("guru_sma")}
                          </th>
                          <th
                            onClick={() => requestSort("guru_smk")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            SMK {getSortIcon("guru_smk")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_sekolah_sma")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SMA {getSortIcon("jumlah_sekolah_sma")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_sekolah_smk")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            SMK {getSortIcon("jumlah_sekolah_smk")}
                          </th>
                        </tr>
                      </>) : (<>
                        <tr>
                          <th
                            rowSpan="2"
                            style={{
                              cursor: "pointer",
                              verticalAlign: "middle",
                              textAlign: "center"
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
                          <th colSpan="2" style={{ textAlign: "center" }}>
                            Anak Tidak Sekolah
                          </th>
                          {showNextData ? (<></>) : (<><th
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
                          </th></>)}                          
                        </tr>
                        <tr>
                          <th
                            onClick={() => requestSort("totsma_do")}
                            style={{ cursor: "pointer", borderRight: "2px solid #A9A9A9", }}
                          >
                            Drop Out SMA/SMK {getSortIcon("totsma_do")}
                          </th>                          
                          <th
                            onClick={() => requestSort("tkt_9_ltm")}
                            style={{ cursor: "pointer" }}
                          >
                            Tidak Lanjut ke SMA {getSortIcon("tkt_9_ltm")}
                          </th>                        
                        </tr></>)}
                        
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
                            <td onClick={(e)=>{showNextData ? "" : getDataTabelDapodikProvDetail(item.kode_prov, e)}} className={showNextData ? "" : "click-data"} style={{ maxWidth: "250px" }}>                              
                              {showNextData ? item.nama_kabkota : item.nama_prov}
                            </td>
                        {customActiveTabJenisData == "1" ? (<><td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.sma
                                ? parseInt(item.sma).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ borderRight: "2px solid #A9A9A9", backgroundColor: "#f7f7ff" }}>
                              {item.smk
                                ? parseInt(item.smk).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.guru_sma
                                ? parseInt(item.guru_sma).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ borderRight: "2px solid #A9A9A9", backgroundColor: "#f7f7ff" }}>
                              {item.guru_smk
                                ? parseInt(item.guru_smk).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7ff" }}>
                              {item.jumlah_sekolah_sma
                                ? parseInt(item.jumlah_sekolah_sma).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ borderRight: "2px solid #A9A9A9", backgroundColor: "#f7f7ff" }}>
                              {item.jumlah_sekolah_smk
                                ? parseInt(item.jumlah_sekolah_smk).toLocaleString("id-ID")
                                : "-"}
                            </td></>) : (<>
                            <td style={{ backgroundColor: "#f7f7f7", borderRight: "2px solid #A9A9A9", }}>
                              {item.totsma_do
                                ? parseInt(item.totsma_do).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7f7" }}>
                              {item.tkt_9_ltm
                                ? parseInt(item.tkt_9_ltm).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            </>)}
                            {showNextData ? (<></>):(<><td>
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
                            </td></>)}
                            
                          </tr>
                        ))}                        
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
                        value={searchTermKab}
                        onChange={handleSearchInputKabupaten}
                        // onKeyDown={(e) => handleKeyDown(e, "kabupaten")}
                        placeholder="Cari Kabupaten/Kota"
                      />

                      {/* Tombol "X" di dalam input */}
                      {searchTermKab && (
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
                        onClick={() => handleButtonClick("kabupaten")}
                      >
                        search
                      </button>
                    </div> */}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    {/* Render Table */}
                    <table
                      className="table table-bordered table-nowrap align-middle mb-0 custom-table"
                      style={{ width: "100%" }}
                    >
                      <thead className="table-light">
                        {customActiveTabJenisData == "1" ? (<>
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
                            Peserta Didik
                          </th>
                          <th
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Tenaga Pengajar
                          </th>
                          <th
                            colSpan="2"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            Jumlah Sekolah
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
                          <th
                            onClick={() => requestSort("guru_sd")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SD {getSortIcon("guru_sd")}
                          </th>
                          <th
                            onClick={() => requestSort("guru_smp")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            SMP {getSortIcon("guru_smp")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_sekolah_sd")}
                            style={{ cursor: "pointer", backgroundColor: "#f7f7ff" }}
                          >
                            SD {getSortIcon("jumlah_sekolah_sd")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_sekolah_smp")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                              backgroundColor: "#f7f7ff"
                            }}
                          >
                            SMP {getSortIcon("jumlah_sekolah_smp")}
                          </th>
                        </tr>
                        </>):(<>
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
                          <th
                            onClick={() => requestSort("tkt_6_ltm")}
                            style={{ cursor: "pointer", borderRight: "2px solid #A9A9A9" }}
                          >
                            Tidak Lanjut ke SMP {getSortIcon("tkt_6_ltm")}
                          </th>
                          <th
                            onClick={() => requestSort("tkt_bpb")}
                            style={{ cursor: "pointer" }}
                          >
                            Anak Belum Pernah Bersekolah{" "}
                            {getSortIcon("tkt_bpb")}
                          </th>
                        </tr>
                        </>)}
                        
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
                            {customActiveTabJenisData == "1" ? (<><td style={{
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
                            <td style={{
                                backgroundColor: "#f7f7ff"
                              }} >
                              {item.guru_sd
                                ? parseInt(item.guru_sd).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ borderRight: "2px solid #A9A9A9", backgroundColor: "#f7f7ff" }}>
                              {item.guru_smp
                                ? parseInt(item.guru_smp).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{
                                backgroundColor: "#f7f7ff"
                              }} >
                              {item.jumlah_sekolah_sd
                                ? parseInt(item.jumlah_sekolah_sd).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td style={{ borderRight: "2px solid #A9A9A9", backgroundColor: "#f7f7ff" }}>
                              {item.jumlah_sekolah_smp
                                ? parseInt(item.jumlah_sekolah_smp).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            </>) : (<>
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
                            <td style={{ backgroundColor: "#f7f7f7", borderRight: "2px solid #A9A9A9" }}>
                              {item.tkt_6_ltm
                                ? parseInt(item.tkt_6_ltm).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            <td style={{ backgroundColor: "#f7f7f7" }}>
                              {item.tkt_bpb
                                ? parseInt(item.tkt_bpb).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            </>)}
                            
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
                      {/* {placeholdersKabupaten} */}
                    </table>
                  </div>
                  <Pagination
                    currentPage={currentPageKabupaten}
                    totalPages={totalPagesKabupaten}
                    onPageChange={paginateKabupaten}
                  />
                </TabPane>
              </TabContent>
              </div>                                                                           
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
                    {/* <TabPane tabId="1" id="paud">
                      <Card>
                        <CardBody>

                        </CardBody>
                      </Card>
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
                    </TabPane> */}
                    <TabPane tabId="2" id="sd">
                      <Row>
                        <Col md={4}>
                        <Card>
                        <CardBody>
                        <div className="d-flex flex-column title-custom-card">
                          <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                            <span>
                              Total Drop Out SD
                            </span>
                          </div>
                          <div className="d-flex">
                            <div className="d-flex justify-content-center align-items-center title-body">
                              <span>
                                <CountUp
                                  start={0}
                                  end={
                                    dataDropOutSd[1]
                                  }                                 
                                  separator="."
                                  // prefix="Rp "
                                  // suffix=" T"
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
                    
                      <VerticalBarChart
                        valueChart={dataDropOutSd[0]}
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
                      <Row>
                        <Col md={4}>
                        <Card>
                        <CardBody>
                        <div className="d-flex flex-column title-custom-card">
                          <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                            <span>
                              Total Drop Out SMP
                            </span>
                          </div>
                          <div className="d-flex">
                            <div className="d-flex justify-content-center align-items-center title-body">
                              <span>
                                <CountUp
                                  start={0}
                                  end={
                                    dataDropOutSmp[1]
                                  }
                                  separator="."
                                  // prefix="Rp "
                                  // suffix=" T"
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
                    
                      <VerticalBarChart
                        valueChart={dataDropOutSmp[0]}
                        categoryChart={["Kelas 7", "Kelas 8", "Kelas 9"]}
                        dataColors='["#7CCCE4"]'
                      />
                    </TabPane>
                    <TabPane tabId="4" id="sma/smk">
                    <Row>
                      <Col md={4}>
                      <Card>
                        <CardBody>
                        <div className="d-flex flex-column title-custom-card">
                          <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                            <span>
                              Total Drop Out SMA
                            </span>
                          </div>
                          <div className="d-flex">
                            <div className="d-flex justify-content-center align-items-center title-body">
                              <span>
                                <CountUp
                                  start={0}
                                  end={
                                    dataDropOutSma[1]
                                  }                                  
                                  separator="."
                                  // prefix="Rp "
                                  // suffix=" T"
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
                      <VerticalBarChart
                        valueChart={dataDropOutSma[0]}
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
                  {dataShowChartTidakLanjutProvinsi ? dataShowChartTidakLanjutPemda ? (<><button
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "16px",
                          margin: "8px 0px",
                        }}
                        onClick={() => setShowDataChartTidakLanjutPemda(false)}
                      >
                        Kembali
                      </button>
                        <Row>
                          <Col md={3}>
                            <Card className="card-animate mt-4 mb-0">
                              <CardBody>
                                  <div className="d-flex flex-column title-custom-card">
                                  <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                    <span>
                                      {currentCategoryClicked == "SMP" ? "Total Tidak Lanjut SMP" : "Total Tidak Lanjut SMA"}
                                    </span>
                                  </div>
                                  <div className="d-flex">                            
                                    <div className="d-flex justify-content-center align-items-center title-body">
                                      <span>
                                        <CountUp
                                          start={0}
                                          end={
                                            dataDapodikTidakLanjutPemda[2]
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
                          <Col md={9}>
                            <HorizontalBarChart
                              dataColors= {currentCategoryClicked == "SMP" ? '["#7CCCE4"]' : '["#B0B0B0"]'}
                              valueChart={dataDapodikTidakLanjutPemda[0]}
                              categoryChart={dataDapodikTidakLanjutPemda[1]}
                              idParam={dataDapodikTidakLanjutPemda[3]}
                              dataZoom={true}
                              breakWord={true}                          
                            />
                          </Col>
                        </Row>  </>) : (<><button
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "16px",
                          margin: "8px 0px",
                        }}
                        onClick={() => setShowDataChartTidakLanjutProvinsi(false)}
                      >
                        Kembali
                      </button>
                        <Row>
                          <Col md={3}>
                            <Card className="card-animate mt-4 mb-0">
                              <CardBody>
                                  <div className="d-flex flex-column title-custom-card">
                                  <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                    <span>
                                      {currentCategoryClicked == "SMP" ? "Total Tidak Lanjut SMP" : "Total Tidak Lanjut SMA"}
                                    </span>
                                  </div>
                                  <div className="d-flex">                            
                                    <div className="d-flex justify-content-center align-items-center title-body">
                                      <span>
                                        <CountUp
                                          start={0}
                                          end={
                                            dataChartDetailTidakLanjutProvinsi[2]
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
                          <Col md={9}>
                            <HorizontalBarChart
                              dataColors= {currentCategoryClicked == "SMP" ? '["#7CCCE4"]' : '["#B0B0B0"]'}
                              valueChart={dataChartDetailTidakLanjutProvinsi[0]}
                              categoryChart={dataChartDetailTidakLanjutProvinsi[1]}
                              idParam={dataChartDetailTidakLanjutProvinsi[3]}
                              onBarClickProv={handleBarClickProv}
                              dataZoom={true}
                              breakWord={true}                          
                            />
                          </Col>
                        </Row>  </>) : (<><HorizontalBarChart
                    valueChart={dataChartAts}
                    categoryChart={["SMP", "SMA"]}
                    dataColors='["#7CCCE4", "#B0B0B0"]'
                    onBarClick={handleBarClick}
                  /></>)}
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
            Detail Anggaran Pendidikan{" "}
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
                              duration={3}
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
                        placeholder="Cari Nama Sub Giat"
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
                        {indexOfFirstItemDetail + index + 1}
                        {/* {index + 1} */}
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
                                  item.total_rinciansub,
                                  item.nama_sub_giat
                                )
                              : dataJenisPemda == "kab" ||
                                dataJenisPemda == "kota"
                              ? handleOpenNextModal(
                                  "",
                                  item.kode_sub_giat,
                                  item.kode_ddn,
                                  item.total_rinciansub,
                                  item.nama_sub_giat
                                )
                              : handleOpenNextModal(
                                  item.kode_prov,
                                  item.kode_sub_giat,
                                  "",
                                  item.total_rinciansub,
                                  item.nama_sub_giat
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
        toggle={handleOpenNextModal}
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
                value={searchTermDetailSub}
                onChange={handleSearchInputDetailSub}
                // onKeyDown={(e) => handleKeyDown(e, "seprovinsi")}
                placeholder="Cari Nama Sub Rincian Objek"
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
                    <th style={{verticalAlign: "middle", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word",maxWidth:"100px"  }}>
                        Lihat Sub Sub Rincian Objek 
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
                    }} onClick={()=>handleOpenNextModalSub({kodeDdn: item.kode_prov? item.kode_prov : item.kode_ddn, kodeSubGiat: item.kode_sub_giat, kodeSro: item.kode_sro, tahun: selectedSingleTahunAnggaran, rincianDetail: item.total_rinciansro, namaSro: item.nama_sro})} className="bx bx-list-ul text-primary"></i>
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
                    {currentItemsDetailSubSub.map((item, index) => (
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
                        <span style={{float: "right"}}>{dataJenisPemda ==="seProv" ? (item.total_rinciansubsro ? parseInt(item.total_rinciansubsro).toLocaleString("id-ID")
                            : "-") : (item.total_rinciansro ? parseInt(item.total_rinciansro).toLocaleString("id-ID")
                            : "-")}</span>                          
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

export default ContentDapodikV2;
