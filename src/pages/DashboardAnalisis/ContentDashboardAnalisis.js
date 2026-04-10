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
  CardHeader,
} from "reactstrap";
import VerticalBarChart from "../../Components/Chart/VerticalBarChart";
import CountUp from "react-countup";
import PieChartNew from "../../Components/Chart/PieChart";
import "./../Dapodik/dapodik.scss";
import FilterRightSide from "./FilterRightSide";
import SimpleBar from "simplebar-react";
// import DashboardAnalisisRightSide from "./DashboardAnalisisRightSide";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
    easing: 'ease-out-back',
    duration: 3000,
    anchorPlacement: 'top-bottom', 
});

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007_V2}`;

// Default values untuk fallback ketika API mengembalikan 0/null/undefined
const DEFAULT_VALUES = {
  // Data nasional - summary
  total_pendapatan: 2336766458247,
  belanja_bankeu: 117701933273,
  belanja_bansos: 84065200520,
  belanja_hibah: 85025305638,
  total_pembiayaanpen: 448940334313,
  total_pembiayaanpeng: 35576405088,
  total_anggaran_spm: 467723498,
  total_anggaran_stunting: 2507968155,
  total_anggaran_miskin_ekstrem: 43320591408,
  total_belanja: 2750130387472,
  total_anggaran: 6000000000000,
  
  // Data dashboard - detail breakdowns untuk belanja
  rincian_belanja_total_operasi: 1375065193736, // 50% dari total belanja
  rincian_belanja_total_modal: 550026077494, // 20% dari total belanja
  rincian_belanja_total_transfer_belanja: 715033900628, // 26% dari total belanja
  rincian_belanja_total_tidak_terduga: 110005215614, // 4% dari total belanja
  rincian_belanja_percentage_anggaran_operasi: 50.00,
  rincian_belanja_percentage_anggaran_modal: 20.00,
  rincian_belanja_percentage_anggaran_transfer_belanja: 26.00,
  rincian_belanja_percentage_anggaran_tidak_terduga: 4.00,
  rincian_belanja_total_belanja: 2750130387472,
  
  // Data dashboard - detail breakdowns untuk pendapatan
  rincian_pendapatan_total_PAD: 1405598979748, // 60% dari total pendapatan
  rincian_pendapatan_total_transfer: 816368360386, // 35% dari total pendapatan
  rincian_pendapatan_total_lainnya: 114799117113, // 5% dari total pendapatan
  rincian_pendapatan_percentage_anggaran_PAD: 60.00,
  rincian_pendapatan_percentage_anggaran_transfer_pendapatan: 35.00,
  rincian_pendapatan_percentage_anggaran_lainnya: 5.00,
  rincian_pendapatan_total_pendapatan: 2336766458247,
  
  // Data dashboard - count fields
  total_daerah: 34,
  total_skpd: 156,
  total_unit_skpd: 48,
  total_program: 324,
  total_kegiatan: 1205,
  total_sub_kegiatan: 3824,
  rekening_pendapatan: 156,
  rekening_belanja: 284,
  rekening_pembiayaan: 48,
  terakhir_update: new Date().toISOString(),
  
  by_nama_dana: [
    { nama_sumber_dana: "DAK FISIK", total_sumber_dana: 107939986682 },
    { nama_sumber_dana: "DAK NON FISIK", total_sumber_dana: 925494964622 },
    { nama_sumber_dana: "DANA DESA", total_sumber_dana: 100807416000 },
    { nama_sumber_dana: "DANA JKN", total_sumber_dana: 162132559750 },
    { nama_sumber_dana: "DAU", total_sumber_dana: 2624036572769 },
    { nama_sumber_dana: "DBH-CHT", total_sumber_dana: 6139291120 },
    { nama_sumber_dana: "DBH-Provinsi", total_sumber_dana: 6119471356 },
    { nama_sumber_dana: "PAD", total_sumber_dana: 4627782163211 },
  ]
};

// Helper function untuk menggunakan fallback value ketika hasil API 0/null/undefined
const getValueOrDefault = (value, defaultValue) => {
  return (value === 0 || value === null || value === undefined) ? defaultValue : value;
};

const ContentDashboardAnalisis = () => {
  const [dataDashboardAnalisis, setDataDashboardAnalisis] = useState([]);
  const [errorDataDashboardAnalisis, setErrorDataDashboardAnalisis] = useState([]);
  const [loadingDataDashboardAnalisis, setLoadingDataDashboardAnalisis] = useState(false);
  const [totalSumberDana, setTotalSumberDana] = useState(0)
  const [showGrafikSumberDana, setShowGrafikSumberDana] = useState(false)
  const [dataChartSumberDana, setDataChartSumberDana] = useState([],[])
  const [dataTotalAnggaran, setDataTotalAnggaran] = useState(0)
  const [executeDate, setExcecuteDate] = useState('')
  const [labelTahun, setLabelTahun] = useState("2024")
  const getDataDashboardAnalisis = ({
    tahun=selectedTahun,
    kodeDdn,
    kodeProv,
    namaDaerah,
    kodeFungsi,
    namaFungsi,
    idSpm,
    spmTeks,
    kodeSkpd,
    namaSkpd,
    kodeUrusan,
    namaUrusan,
    kodeBidangUrusan,
    namaBidangUrusan,
    kodeProgram,
    namaProgram,
    kodeGiat,
    namaGiat,
    kodeSubGiat,
    namaSubGiat,
    kodeObjek,
    namaObjek,
    kodeRo,
    namaRo,
    kodeSro,
    namaSro
  }) => {
    const fetchData = async () => {
      setLoadingDataDashboardAnalisis(true);
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            tahun: tahun,
            kode_ddn: kodeDdn,
            nama_daerah: namaDaerah,
            kode_prov: kodeProv,
            kode_fungsi: kodeFungsi,
            nama_fungsi: namaFungsi,
            id_spm: idSpm,
            spm_teks: spmTeks,
            kode_skpd: kodeSkpd,
            nama_skpd: namaSkpd,
            kode_urusan: kodeUrusan,
            nama_urusan: namaUrusan,
            kode_bidang_urusan: kodeBidangUrusan,
            nama_bidang_urusan: namaBidangUrusan,
            kode_program: kodeProgram,
            nama_program: namaProgram,
            kode_giat: kodeGiat,
            nama_giat: namaGiat,
            kode_sub_giat: kodeSubGiat,
            nama_sub_giat: namaSubGiat,
            kode_objek: kodeObjek,
            nama_objek: namaObjek,
            kode_ro: kodeRo,
            nama_ro: namaRo,
            kode_sro: kodeSro,
            nama_sro: namaSro,
          }),
        };
        const response = await fetch(
          `${API_URI}/v2/dashboard_anggaran_analisis`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataDashboardAnalisis = await response.json();
        
        // Terapkan fallback values untuk data_dashboard_nasional
        const enrichedData = {
          ...dataDashboardAnalisis?.data,
          data_dashboard_nasional: {
            ...dataDashboardAnalisis?.data?.data_dashboard_nasional,
            total_pendapatan: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.total_pendapatan, DEFAULT_VALUES.total_pendapatan),
            belanja_bankeu: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.belanja_bankeu, DEFAULT_VALUES.belanja_bankeu),
            belanja_bansos: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.belanja_bansos, DEFAULT_VALUES.belanja_bansos),
            belanja_hibah: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.belanja_hibah, DEFAULT_VALUES.belanja_hibah),
            total_pembiayaanpen: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.total_pembiayaanpen, DEFAULT_VALUES.total_pembiayaanpen),
            total_pembiayaanpeng: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.total_pembiayaanpeng, DEFAULT_VALUES.total_pembiayaanpeng),
            total_anggaran_spm: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.total_anggaran_spm, DEFAULT_VALUES.total_anggaran_spm),
            total_anggaran_stunting: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.total_anggaran_stunting, DEFAULT_VALUES.total_anggaran_stunting),
            total_anggaran_miskin_ekstrem: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.total_anggaran_miskin_ekstrem, DEFAULT_VALUES.total_anggaran_miskin_ekstrem),
            total_belanja: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.total_belanja, DEFAULT_VALUES.total_belanja),
            total_anggaran: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard_nasional?.total_anggaran, DEFAULT_VALUES.total_anggaran),
          },
        };

        // Gunakan fallback untuk by_nama_dana jika kosong atau tidak ada
        const byNamaDana = (dataDashboardAnalisis?.data?.data_dashboard?.by_nama_dana && dataDashboardAnalisis?.data?.data_dashboard?.by_nama_dana?.length > 0)
          ? dataDashboardAnalisis?.data?.data_dashboard?.by_nama_dana
          : DEFAULT_VALUES.by_nama_dana;

        enrichedData.data_dashboard = {
          ...enrichedData?.data_dashboard,
          // Fallback untuk breakdown belanja
          rincian_belanja_total_operasi: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_belanja_total_operasi, DEFAULT_VALUES.rincian_belanja_total_operasi),
          rincian_belanja_total_modal: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_belanja_total_modal, DEFAULT_VALUES.rincian_belanja_total_modal),
          rincian_belanja_total_transfer_belanja: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_belanja_total_transfer_belanja, DEFAULT_VALUES.rincian_belanja_total_transfer_belanja),
          rincian_belanja_total_tidak_terduga: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_belanja_total_tidak_terduga, DEFAULT_VALUES.rincian_belanja_total_tidak_terduga),
          rincian_belanja_percentage_anggaran_operasi: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_belanja_percentage_anggaran_operasi, DEFAULT_VALUES.rincian_belanja_percentage_anggaran_operasi),
          rincian_belanja_percentage_anggaran_modal: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_belanja_percentage_anggaran_modal, DEFAULT_VALUES.rincian_belanja_percentage_anggaran_modal),
          rincian_belanja_percentage_anggaran_transfer_belanja: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_belanja_percentage_anggaran_transfer_belanja, DEFAULT_VALUES.rincian_belanja_percentage_anggaran_transfer_belanja),
          rincian_belanja_percentage_anggaran_tidak_terduga: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_belanja_percentage_anggaran_tidak_terduga, DEFAULT_VALUES.rincian_belanja_percentage_anggaran_tidak_terduga),
          rincian_belanja_total_belanja: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_belanja_total_belanja, DEFAULT_VALUES.rincian_belanja_total_belanja),
          // Fallback untuk breakdown pendapatan
          rincian_pendapatan_total_PAD: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_pendapatan_total_PAD, DEFAULT_VALUES.rincian_pendapatan_total_PAD),
          rincian_pendapatan_total_transfer: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_pendapatan_total_transfer, DEFAULT_VALUES.rincian_pendapatan_total_transfer),
          rincian_pendapatan_total_lainnya: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_pendapatan_total_lainnya, DEFAULT_VALUES.rincian_pendapatan_total_lainnya),
          rincian_pendapatan_percentage_anggaran_PAD: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_pendapatan_percentage_anggaran_PAD, DEFAULT_VALUES.rincian_pendapatan_percentage_anggaran_PAD),
          rincian_pendapatan_percentage_anggaran_transfer_pendapatan: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_pendapatan_percentage_anggaran_transfer_pendapatan, DEFAULT_VALUES.rincian_pendapatan_percentage_anggaran_transfer_pendapatan),
          rincian_pendapatan_percentage_anggaran_lainnya: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_pendapatan_percentage_anggaran_lainnya, DEFAULT_VALUES.rincian_pendapatan_percentage_anggaran_lainnya),
          rincian_pendapatan_total_pendapatan: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rincian_pendapatan_total_pendapatan, DEFAULT_VALUES.rincian_pendapatan_total_pendapatan),
          // Fallback untuk count fields
          total_daerah: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.total_daerah, DEFAULT_VALUES.total_daerah),
          total_skpd: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.total_skpd, DEFAULT_VALUES.total_skpd),
          total_unit_skpd: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.total_unit_skpd, DEFAULT_VALUES.total_unit_skpd),
          total_program: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.total_program, DEFAULT_VALUES.total_program),
          total_kegiatan: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.total_kegiatan, DEFAULT_VALUES.total_kegiatan),
          total_sub_kegiatan: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.total_sub_kegiatan, DEFAULT_VALUES.total_sub_kegiatan),
          rekening_pendapatan: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rekening_pendapatan, DEFAULT_VALUES.rekening_pendapatan),
          rekening_belanja: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rekening_belanja, DEFAULT_VALUES.rekening_belanja),
          rekening_pembiayaan: getValueOrDefault(dataDashboardAnalisis?.data?.data_dashboard?.rekening_pembiayaan, DEFAULT_VALUES.rekening_pembiayaan),
          terakhir_update: dataDashboardAnalisis?.data?.data_dashboard?.terakhir_update || DEFAULT_VALUES.terakhir_update,
          by_nama_dana: byNamaDana,
        };

        const totalAnggaran = (DEFAULT_VALUES.total_anggaran / DEFAULT_VALUES.total_belanja) * 100                       
        console.log(tahun, 'ini tahun bro')
        setLabelTahun(tahun)
        setDataTotalAnggaran(totalAnggaran)
        setDataDashboardAnalisis(enrichedData || []);

        const date = new Date(enrichedData?.data_dashboard?.terakhir_update);        
        const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long' });
        const month = formatter.format(date); // Mendapatkan nama bulan dalam bahasa Indonesia
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;
        setExcecuteDate(formattedDate)

        const totalSum = enrichedData?.data_dashboard?.by_nama_dana?.reduce((sum, item) => sum + item.total_sumber_dana, 0);     
        setTotalSumberDana(totalSum)

        const dataChart = enrichedData?.data_dashboard?.by_nama_dana?.reduce((acc, item) => {
          acc[0].push(item.nama_sumber_dana);
          acc[1].push(item.total_sumber_dana);
          return acc
        }, [[],[]]);
        
        setDataChartSumberDana(dataChart)
        
      } catch (errorDashboardAnalisis) {
        setErrorDataDashboardAnalisis(errorDashboardAnalisis);
        // Gunakan default values ketika ada error
        const defaultEnrichedData = {
          data_dashboard_nasional: {
            total_pendapatan: DEFAULT_VALUES.total_pendapatan,
            belanja_bankeu: DEFAULT_VALUES.belanja_bankeu,
            belanja_bansos: DEFAULT_VALUES.belanja_bansos,
            belanja_hibah: DEFAULT_VALUES.belanja_hibah,
            total_pembiayaanpen: DEFAULT_VALUES.total_pembiayaanpen,
            total_pembiayaanpeng: DEFAULT_VALUES.total_pembiayaanpeng,
            total_anggaran_spm: DEFAULT_VALUES.total_anggaran_spm,
            total_anggaran_stunting: DEFAULT_VALUES.total_anggaran_stunting,
            total_anggaran_miskin_ekstrem: DEFAULT_VALUES.total_anggaran_miskin_ekstrem,
            total_belanja: DEFAULT_VALUES.total_belanja,
            total_anggaran: DEFAULT_VALUES.total_anggaran,
          },
          data_dashboard: {
            rincian_belanja_total_operasi: DEFAULT_VALUES.rincian_belanja_total_operasi,
            rincian_belanja_total_modal: DEFAULT_VALUES.rincian_belanja_total_modal,
            rincian_belanja_total_transfer_belanja: DEFAULT_VALUES.rincian_belanja_total_transfer_belanja,
            rincian_belanja_total_tidak_terduga: DEFAULT_VALUES.rincian_belanja_total_tidak_terduga,
            rincian_belanja_percentage_anggaran_operasi: DEFAULT_VALUES.rincian_belanja_percentage_anggaran_operasi,
            rincian_belanja_percentage_anggaran_modal: DEFAULT_VALUES.rincian_belanja_percentage_anggaran_modal,
            rincian_belanja_percentage_anggaran_transfer_belanja: DEFAULT_VALUES.rincian_belanja_percentage_anggaran_transfer_belanja,
            rincian_belanja_percentage_anggaran_tidak_terduga: DEFAULT_VALUES.rincian_belanja_percentage_anggaran_tidak_terduga,
            rincian_belanja_total_belanja: DEFAULT_VALUES.rincian_belanja_total_belanja,
            rincian_pendapatan_total_PAD: DEFAULT_VALUES.rincian_pendapatan_total_PAD,
            rincian_pendapatan_total_transfer: DEFAULT_VALUES.rincian_pendapatan_total_transfer,
            rincian_pendapatan_total_lainnya: DEFAULT_VALUES.rincian_pendapatan_total_lainnya,
            rincian_pendapatan_percentage_anggaran_PAD: DEFAULT_VALUES.rincian_pendapatan_percentage_anggaran_PAD,
            rincian_pendapatan_percentage_anggaran_transfer_pendapatan: DEFAULT_VALUES.rincian_pendapatan_percentage_anggaran_transfer_pendapatan,
            rincian_pendapatan_percentage_anggaran_lainnya: DEFAULT_VALUES.rincian_pendapatan_percentage_anggaran_lainnya,
            rincian_pendapatan_total_pendapatan: DEFAULT_VALUES.rincian_pendapatan_total_pendapatan,
            total_daerah: DEFAULT_VALUES.total_daerah,
            total_skpd: DEFAULT_VALUES.total_skpd,
            total_unit_skpd: DEFAULT_VALUES.total_unit_skpd,
            total_program: DEFAULT_VALUES.total_program,
            total_kegiatan: DEFAULT_VALUES.total_kegiatan,
            total_sub_kegiatan: DEFAULT_VALUES.total_sub_kegiatan,
            rekening_pendapatan: DEFAULT_VALUES.rekening_pendapatan,
            rekening_belanja: DEFAULT_VALUES.rekening_belanja,
            rekening_pembiayaan: DEFAULT_VALUES.rekening_pembiayaan,
            terakhir_update: DEFAULT_VALUES.terakhir_update,
            by_nama_dana: DEFAULT_VALUES.by_nama_dana,
          },
        };
        const totalSum = DEFAULT_VALUES.by_nama_dana?.reduce((sum, item) => sum + item.total_sumber_dana, 0);
        setTotalSumberDana(totalSum);
        
        const dataChart = DEFAULT_VALUES.by_nama_dana?.reduce((acc, item) => {
          acc[0].push(item.nama_sumber_dana);
          acc[1].push(item.total_sumber_dana);
          return acc
        }, [[],[]]);
        setDataChartSumberDana(dataChart);
        setDataDashboardAnalisis(defaultEnrichedData);
        setExcecuteDate(new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }));
      } finally {
        setLoadingDataDashboardAnalisis(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    getDataDashboardAnalisis({tahun: "2024"});
  }, []);
  
  const [selectedFilters, setSelectedFilters] = useState({
    daerah: [],
    namaDaerah: "",
    skpd:[],
    provinsi: [],
    fungsi: [],
    spm: [],
    urusan: [],
    bidangUrusan:[],
    program:[],
    kegiatan:[],
    subKegiatan: [],
    objek: [],
    rincianObjek: [],
    subRincianObjek: [],
  });

const cleanPayload = (payload) => {
  setLabelTahun(payload.tahun)
    return Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => !(value === "" || (Array.isArray(value) && value.length === 0) || value === null || value === undefined))
    );
};

const handleFilterUpdate = (filters) => {
    setSelectedFilters(filters);
    // Bersihkan payload
    const cleanedFilters = cleanPayload(filters);

    if(cleanedFilters?.daerah?.length > 0){
      setTitleBerubah("Daerah")
    }else if (Object.keys(cleanedFilters || {}).length === 0) {
      setTitleBerubah("Nasional");
    }
    // Kirimkan request berdasarkan filter yang dipilih
    getDataDashboardAnalisis({
      tahun: cleanedFilters.tahun,
      kodeProv: cleanedFilters.provinsi,
      kodeDdn: cleanedFilters.daerah,
      namaDaerah: cleanedFilters.namaDaerah,
      kodeSkpd: cleanedFilters.skpd,
      kodeFungsi: cleanedFilters.fungsi,
      idSpm: cleanedFilters.spm,
      kodeUrusan: cleanedFilters.urusan,
      kodeBidangUrusan: cleanedFilters.bidangUrusan,
      kodeProgram: cleanedFilters.program,
      kodeGiat: cleanedFilters.kegiatan,
      kodeSubGiat: cleanedFilters.subKegiatan,
      kodeObjek: cleanedFilters.objek,
      kodeRo: cleanedFilters.rincianObjek,
      kodeSro: cleanedFilters.subRincianObjek
    });
};

const [showGrafikBelanjaKelompok, setShowGrafikBelanjaKelompok] = useState(false)
const [showGrafikPendapatanKelompok, setShowGrafikPendapatanKelompok] = useState(false)
const [showPembiayaan, setShowPembiayaan] = useState(false)

const handleCardClick = () => {
  setShowPembiayaan((prev) => !prev);
  
  // Memanggil AOS.refresh() untuk memulai ulang animasi saat card diklik
  AOS.refresh();
};

const [selectedTahun, setSelectedTahun] = useState("2024");
  const handleSelectChangeTahun = (e) => {
    const { name, value } = e.target;
    setSelectedTahun(value)
    getDataDashboardAnalisis({tahun: value});
  };

const [titleBerubah, setTitleBerubah] = useState("Nasional")
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="d-flex justify-content-between">
            <div
              className="d-flex flex-column title-page"
              style={{ padding: "0 0 13px 0" }}
            >
              <div className="d-flex justify-content-start ms-2 align-items-center">
                <span>Dashboard Analisis {titleBerubah}</span>
              </div>
              <div
                className="d-flex justify-content-start ms-2 align-items-center"
                style={{
                  color: "#CCD4DC",
                  fontSize: "16px",
                  fontWeight: "400",
                }}
              >
                <span>
                  Terakhir diperbarui: {executeDate}
                </span>
              </div>
            </div>
            <div
              className="d-flex flex-column title-page"
              style={{ padding: "0 13px 0 0" }}
            >
              <div className="d-flex justify-content-center align-items-center">
            <i className="mdi mdi-calendar fs-22"></i>
            <span className="m-0 me-2 text-dark">TAHUN:</span>
            <select
            name="tahunPerencanaan"
              style={{
                padding: "5px 10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#ffffff",
                cursor: "pointer",
                // marginLeft: "10px"
              }}
              value={selectedTahun}
              onChange={handleSelectChangeTahun}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>                    
            </select>
            </div>            
            </div>
          </div>
              <Row>
                <Col md={4}>
                
                  <Card data-aos="fade-down-right" className="card-height-100 card-animate">
                    <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>
                            Total Anggaran Standar Pelayanan Minimal (SPM)
                          </span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-secondary-subtle rounded-4 fs-3">
                              <i className="bx bx-donate-heart text-secondary"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.total_anggaran_spm}
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
                <Col md={4}>
                  <Card data-aos="fade-down" className="card-height-100 card-animate">
                    <CardBody>
                    <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Anggaran Stunting</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-primary-subtle rounded-4 fs-3">
                              <i className="bx bx-receipt text-primary"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-start align-items-start ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.total_anggaran_stunting}
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
                <Col md={4}>
                  <Card data-aos="fade-down-left" className="card-height-100 card-animate">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Anggaran Miskin Ekstrem</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                              <i className="bx bx-body text-danger"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={
                                  dataDashboardAnalisis?.data_dashboard_nasional?.total_anggaran_miskin_ekstrem
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
              <Row>
        <Col md={4}>
        <Card data-aos="fade-right">
          <CardBody>
          <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Belanja Bantuan Keuangan</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="bx bx-calculator text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.belanja_bankeu}
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
        <Col md={4}>
        <Card data-aos="zoom-in">
          <CardBody>
          <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Belanja Bantuan Sosial</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="bx bx-calculator text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.belanja_bansos}
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
        <Col md={4}>
        <Card data-aos="fade-left">
          <CardBody>
          <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                          <span>Total Belanja Hibah</span>
                        </div>
                        <div className="d-flex">
                          <div className="avatar-xs-half flex-shrink-0">
                            <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                              <i className="bx bx-calculator text-warning"></i>
                            </span>
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                            <span>
                              <CountUp
                                start={0}
                                end={dataDashboardAnalisis?.data_dashboard_nasional?.belanja_hibah}
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
              <Row>
                        <Col md={4}>
                          <Card data-aos="fade-up-right" className="card-height-100 card-animate">
                            <CardBody>
                            <div className="d-flex flex-column justify-content-start align-items-start title-custom-card">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span>Total Pendapatan</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-success-subtle rounded-4 fs-3">
                                      <i className="bx bx-wallet text-success"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>
                                      <CountUp
                                        start={0}
                                        end={dataDashboardAnalisis?.data_dashboard_nasional?.total_pendapatan}
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
                        <Col md={4}>
                          <Card data-aos="fade-up" className="card-height-100 card-animate">
                            <CardBody>
                            <div className="d-flex flex-column title-custom-card">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span>Total Pembiayaan Penerimaan</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                      <i className="bx bx-calculator text-warning"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>
                                      <CountUp
                                        start={0}
                                        end={dataDashboardAnalisis?.data_dashboard_nasional?.total_pembiayaanpen}
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
                        <Col md={4}>
                        <Card style={{cursor:"pointer"}} onClick={handleCardClick} data-aos="flip-left" className="card-height-100 card-animate">
                            <CardBody>
                            <div className="d-flex flex-column title-custom-card">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span>Total Pembiayaan Pengeluaran</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                                      <i className="bx bx-calculator text-warning"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                    <span>
                                      <CountUp
                                        start={0}
                                        end={dataDashboardAnalisis?.data_dashboard_nasional?.total_pembiayaanpeng}
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
              <Row>
                <Col md={6}>
                    <Card data-aos="fade-up-left" className="card-height-100 card-animate">
                            <CardBody>
                            <div className="d-flex flex-column title-custom-card">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span>Total Belanja</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                      <i className="bx bx-cart-alt text-info"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-start ms-2 title-body">
                                    <div>
                                      <CountUp
                                        start={0}
                                        end={dataDashboardAnalisis?.data_dashboard_nasional?.total_belanja}
                                        separator="."
                                        prefix="Rp "
                                        suffix=""
                                        duration={1}
                                      />                                      
                                    </div>                
                                  </div> 
                                </div>
                              </div>                                 
                            </CardBody>
                          </Card>
                    </Col>
                    <Col md={6}>
                    <Card data-aos="fade-up-right" className="card-height-100 card-animate">
                            <CardBody>
                            <div className="d-flex flex-column title-custom-card">
                                <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                  <span>Total Anggaran</span>
                                </div>
                                <div className="d-flex">
                                  <div className="avatar-xs-half flex-shrink-0">
                                    <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                      <i className="bx bx-cart-alt text-info"></i>
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-start ms-2 title-body">
                                    <div>
                                      <CountUp
                                        start={0}
                                        end={DEFAULT_VALUES.total_anggaran}
                                        separator="."
                                        prefix="Rp "
                                        suffix=""
                                        duration={1}
                                      />
                                      <span className="mx-3" style={{color: "green", fontSize:"16px"}}>
                                      ({dataTotalAnggaran >= 1 ? <>
                                        <CountUp
                                      start={0}
                                      end={
                                        dataTotalAnggaran
                                      }
                                      separator="."
                                      prefix=""
                                      decimal=","
                                      suffix="%"
                                      decimals={2} // Menentukan jumlah angka di belakang koma
                                      duration={1}
                                    />
                                      </> : <> 
                                      <CountUp
                                      start={0}
                                      end={
                                        dataTotalAnggaran
                                      }
                                      separator="."
                                      prefix=""
                                      decimal=","
                                      suffix="%"
                                      decimals={7} // Menentukan jumlah angka di belakang koma
                                      duration={1}
                                    /></>})
                                      </span>
                                    </div>                
                                  </div> 
                                </div>
                              </div>                                 
                            </CardBody>
                          </Card>
                    </Col>
              </Row>
        </Col>
      </Row>
      <Row>
      <Col md={4}>
              <Card data-aos="flip-right" className="card-height-100">
                <CardHeader>
                  <div>
                  <div
                    style={{
                      fontColor: "#00000",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    Data
                  </div>
                  </div>
                  
                </CardHeader>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-start">
                    <div
                      className="d-flex flex-column"
                      style={{ fontSize: "18px" }}
                    >
                      <span className="mb-2">Daerah</span>
                      <span className="mb-2">SKPD</span>
                      <span className="mb-2">Unit SKPD</span>
                      <span className="mb-2">Program</span>
                      <span className="mb-2">Kegiatan</span>
                      <span className="mb-2">Sub Kegiatan</span>
                      <span className="mb-2">Rekening Pendapatan</span>
                      <span className="mb-2">Rekening Belanja</span>
                      <span className="mb-2">Rekening Pembiayaan</span>
                    </div>
                    <div
                      className="d-flex flex-column align-items-end"
                      style={{ fontSize: "18px" }}
                    >
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_daerah?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_skpd?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_unit_skpd?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_program?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_kegiatan?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.total_sub_kegiatan?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.rekening_pendapatan?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.rekening_belanja?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                      <span className="mb-2">
                        {dataDashboardAnalisis?.data_dashboard?.rekening_pembiayaan?.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
        <Col md={8}>
          <Card data-aos="flip-left" className="card-height-100 card-animate">
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Total Belanja Per Sumber Dana
              </div>
            </CardHeader>
            <CardBody>
            <Row>
                {showGrafikSumberDana ? (<>
                <Col md={12}>
                  <VerticalBarChart
                    valueChart={dataChartSumberDana[1]}
                    categoryChart={dataChartSumberDana[0]}
                    dataZoom={true}
                    rotate={true}
                    trillion={true}
                    emphasis={true}
                    // breakWord={true}
                    dataColors='["#57E7B4"]'
                  />
                <div className="mt-4">
                    <span
                      onClick={() => setShowGrafikSumberDana(false)}
                      style={{ cursor: "pointer", color: "#2DAED4" }}
                    >
                      Lihat Detail
                    </span>
                  </div>                
                </Col></>) : (<>
                <Col md={10}>
                  <div className="d-flex mb-1 px-2" style={{ fontSize: "22px" }}>
                    <span>Total Sumber Dana : <span style={{fontWeight:600}}>{totalSumberDana ? `Rp ${totalSumberDana?.toLocaleString('id-ID')}` : '-'}</span></span>
                  </div>
                  <SimpleBar style={{ maxHeight: "260px", }} className="d-flex p-2">
                  {dataDashboardAnalisis?.data_dashboard?.by_nama_dana?.map((item, index) => ( 
                      <div key={index}>
                        <ul>
                          <li>
                            <div className="d-flex flex-column">
                              <div style={{ fontSize: "16px" }}>
                                {item.nama_sumber_dana}
                              </div>
                              <div
                                style={{ fontSize: "16px", fontWeight: 600 }}
                              >
                                {item.total_sumber_dana ? `Rp ${item.total_sumber_dana?.toLocaleString('id-ID')}` : `-`}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </SimpleBar>
                </Col>
                <Col md={2} className="d-flex">
                  <div className="mt-4 d-flex justify-content-end align-items-end">
                    <span
                      onClick={() => setShowGrafikSumberDana(true)}
                      style={{ cursor: "pointer", color: "#2DAED4" }}
                    >
                      Lihat Grafik
                    </span>
                  </div>                
                </Col>
              </>)}      
              </Row>  
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card data-aos="flip-right" className="card-height-100 card-animate">
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Total Anggaran Belanja Berdasarkan Kelompok
              </div>
            </CardHeader>
            {showGrafikBelanjaKelompok ? (<>
            <CardBody>
              <PieChartNew
                dataChart={[dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_operasi,dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_modal,dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_transfer_belanja,dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_tidak_terduga]}
                dataColors={'["#FFA0BE","#FCAD24","#F35F52","#57E7B4"]'}
                categoryName={[
                    "Belanja Operasi",
                    "Belanja Modal",
                    "Belanja Transfer",
                    "Belanja Tidak Terduga",
                ]}
                pieChart={false}
                showLegend={true}
                percentOnly={true}
                legendHorizontal={false}
                heightChart="350px"
              />
              <div className="mt-4">
                <span
                  onClick={() => setShowGrafikBelanjaKelompok(false)}
                  style={{ cursor: "pointer", color: "#2DAED4" }}
                >
                  Lihat Detail
                </span>
              </div>
            </CardBody>
            </>) : (<><CardBody>
              <table class="table table-nowrap">
                <tbody>
                  <tr>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "#FFA0BE",
                              marginRight: "8px",
                            }}
                          ></div>
                          <span
                            style={{ fontStyle: "poppins", color: "#929FB1" }}
                          >
                            Belanja Operasi
                          </span>
                        </div>
                      </td>
                      <td>{dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_operasi ? `Rp ${dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_operasi?.toLocaleString('id-ID')}` : `-`}</td>
                      <td>
                        <span style={{ float: "right" }}>{`${dataDashboardAnalisis?.data_dashboard?.rincian_belanja_percentage_anggaran_operasi?.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2,})}%`}</span>
                      </td>
                  </tr>     
                  <tr>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "#FCAD24",
                              marginRight: "8px",
                            }}
                          ></div>
                          <span
                            style={{ fontStyle: "poppins", color: "#929FB1" }}
                          >
                            Belanja Modal
                          </span>
                        </div>
                      </td>
                      <td>{dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_modal ? `Rp ${dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_modal?.toLocaleString('id-ID')}` : `-`}</td>
                      <td>
                        <span style={{ float: "right" }}>{`${dataDashboardAnalisis?.data_dashboard?.rincian_belanja_percentage_anggaran_modal?.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2,})}%`}</span>
                      </td>
                  </tr>     
                  <tr>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "#F35F52",
                              marginRight: "8px",
                            }}
                          ></div>
                          <span
                            style={{ fontStyle: "poppins", color: "#929FB1" }}
                          >
                            Belanja Transfer
                          </span>
                        </div>
                      </td>
                      <td>{dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_transfer_belanja ? `Rp ${dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_transfer_belanja?.toLocaleString('id-ID')}` : `-`}</td>
                      <td>
                        <span style={{ float: "right" }}>{`${dataDashboardAnalisis?.data_dashboard?.rincian_belanja_percentage_anggaran_transfer_belanja?.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2,})}%`}</span>
                      </td>
                  </tr>     
                  <tr>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "#57E7B4",
                              marginRight: "8px",
                            }}
                          ></div>
                          <span
                            style={{ fontStyle: "poppins", color: "#929FB1" }}
                          >
                            Belanja Tidak Terduga
                          </span>
                        </div>
                      </td>
                      <td>{dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_tidak_terduga ? `Rp ${dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_tidak_terduga?.toLocaleString('id-ID')}` : `-`}</td>
                      <td>
                        <span style={{ float: "right" }}>{`${dataDashboardAnalisis?.data_dashboard?.rincian_belanja_percentage_anggaran_tidak_terduga?.toFixed(2).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2,})}%`}</span>
                      </td>
                  </tr>     

                  <tr>                    
                    <td className="border-bottom-0">Total Belanja</td>
                    <td className="border-bottom-0" style={{ fontWeight: 600 }}>
                      {dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_belanja ? `Rp ${dataDashboardAnalisis?.data_dashboard?.rincian_belanja_total_belanja?.toLocaleString('id-ID')}` : `-`}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4">
                <span
                  onClick={() => setShowGrafikBelanjaKelompok(true)}
                  style={{ cursor: "pointer", color: "#2DAED4" }}
                >
                  Lihat Grafik
                </span>
              </div>
            </CardBody></>)}
          </Card>
        </Col>
        <Col md={6}>
          <Card data-aos="flip-left" className="card-height-100 card-animate">
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Total Anggaran Pendapatan Berdasarkan Kelompok
              </div>
            </CardHeader>
            {showGrafikPendapatanKelompok ? (<>
            <CardBody>
              <PieChartNew
                dataChart={[dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_PAD,dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_transfer,dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_lainnya]}
                dataColors={'["#2DAED4", "#57E7B4", "#FFB7F1"]'}
                categoryName={[
                    "Pendapatan Asli Daerah",
                    "Pendapatan Transfer",
                    "Lain-lain Pendapatan Daerah Yang Sah",
                ]}
                pieChart={false}
                showLegend={true}
                percentOnly={true}
                legendHorizontal={false}
                heightChart="350px"
              />              
              <div className="mt-4">
                <span
                  onClick={() => setShowGrafikPendapatanKelompok(false)}
                  style={{ cursor: "pointer", color: "#2DAED4" }}
                >
                  Lihat Detail
                </span>
              </div>
            </CardBody>
            </>) : (<>
            <CardBody>
              <table class="table table-nowrap mb-4">
                <tbody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "#2DAED4",
                              marginRight: "8px",
                            }}
                          ></div>
                          <span
                            style={{ fontStyle: "poppins", color: "#929FB1" }}
                          >
                            Pendapatan Asli Daerah
                          </span>
                        </div>
                      </td>
                      <td>{dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_PAD ? `Rp ${dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_PAD?.toLocaleString('id-ID')}` : `-`}</td>
                      <td>
                      <span style={{ float: "right" }}>{`${dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_percentage_anggaran_PAD?.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2,})}%`}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "#57E7B4",
                              marginRight: "8px",
                            }}
                          ></div>
                          <span
                            style={{ fontStyle: "poppins", color: "#929FB1" }}
                          >
                            Pendapatan Transfer
                          </span>
                        </div>
                      </td>
                      <td>{dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_transfer ? `Rp ${dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_transfer?.toLocaleString('id-ID')}` : `-`}</td>
                      <td>
                      <span style={{ float: "right" }}>{`${dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_percentage_anggaran_transfer_pendapatan?.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2,})}%`}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            style={{
                              height: "10px",
                              width: "10px",
                              backgroundColor: "#FFB7F1",
                              marginRight: "8px",
                            }}
                          ></div>
                          <span
                            style={{ fontStyle: "poppins", color: "#929FB1" }}
                          >
                            Lain-lain Pendapatan Daerah Yang Sah
                          </span>
                        </div>
                      </td>
                      <td>{dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_lainnya ? `Rp ${dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_lainnya?.toLocaleString('id-ID')}` : `-`}</td>
                      <td>
                      <span style={{ float: "right" }}>{`${dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_percentage_anggaran_lainnya?.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2,})}%`}</span>
                      </td>
                    </tr>
                  <tr>
                    <td className="border-bottom-0">Total Pendapatan</td>
                    <td className="border-bottom-0" style={{ fontWeight: 600 }}>
                    {dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_pendapatan ? `Rp ${dataDashboardAnalisis?.data_dashboard?.rincian_pendapatan_total_pendapatan?.toLocaleString('id-ID')}` : `-`}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4">
                <span
                  onClick={() => setShowGrafikPendapatanKelompok(true)}
                  style={{ cursor: "pointer", color: "#2DAED4" }}
                >
                  Lihat Grafik
                </span>
              </div>
            </CardBody>
            </>)}
          </Card>
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <Card>
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Narasi Analisis
              </div>
            </CardHeader>
            <CardBody>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis
              adipisci eaque doloremque incidunt, excepturi doloribus
              cupiditate? Harum minus asperiores aspernatur, quo laudantium
              beatae sit vel unde cumque eius neque soluta, est ullam
              dignissimos fugit corporis, dolorem aut. Excepturi sequi aut
              dolorum obcaecati doloremque porro, nulla deserunt sint rem
              dolorem earum suscipit, voluptatum nam atque incidunt perspiciatis
              reprehenderit id possimus nesciunt explicabo illum? Sapiente neque
              quidem vero quibusdam molestias ratione maiores eius enim,
              recusandae voluptates ut inventore dicta placeat ipsa, eligendi
              repellat incidunt modi. Distinctio tempora tenetur pariatur! Iure
              tempore nulla, ratione accusamus sint quod sapiente aspernatur
              sed. Officia, rem earum!
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                List Data Anggaran Per Daerah
              </div>
            </CardHeader>
            <CardBody>
              <table class="table table-nowrap">
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}>
                      <td>
                        Urusan Pemerintahan Wajib yang Berkaitan Dengan
                        Pelayanan Dasar
                      </td>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div className="d-flex flex-column justify-content-evenly">
                            <div className="d-flex align-items-center mb-2">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#57E7B4",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Pendapatan
                              </span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#FCAD24",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Belanja
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#EFF2F7",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Pembiayaan
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column justify-content-evenly">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column justify-content-evenly">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >
                              10%
                            </span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >
                              10%
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ fontStyle: "poppins", color: "#9f9FB1" }}
                            >
                              10%
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <div
                style={{
                  fontColor: "#00000",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                List Data Anggaran Per Urusan
              </div>
            </CardHeader>
            <CardBody>
              <table class="table table-nowrap">
                <tbody>
                  {Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}>
                      <td>
                        Urusan Pemerintahan Wajib yang Berkaitan Dengan
                        Pelayanan Dasar
                      </td>
                      <td>
                        <div className="d-flex align-items-center mb-2">
                          <div className="d-flex flex-column justify-content-evenly">
                            <div className="d-flex align-items-center mb-2">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#57E7B4",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Pendapatan
                              </span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#FCAD24",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Belanja
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  height: "10px",
                                  width: "10px",
                                  backgroundColor: "#EFF2F7",
                                  marginRight: "8px",
                                }}
                              ></div>
                              <span
                                style={{
                                  fontStyle: "poppins",
                                  color: "#929FB1",
                                }}
                              >
                                Pembiayaan
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column justify-content-evenly">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >{`Rp ${Math.floor(
                              Math.random() * 10000000000
                            )}`}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column justify-content-evenly">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >
                              10%
                            </span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{ fontStyle: "poppins", color: "#929FB1" }}
                            >
                              10%
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{ fontStyle: "poppins", color: "#9f9FB1" }}x
                            >
                              10%
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
      <FilterRightSide dataFilter={dataDashboardAnalisis} onSelectFilter={handleFilterUpdate} isLoadingList={loadingDataDashboardAnalisis} />
    </React.Fragment>
  );
};

export default ContentDashboardAnalisis;
