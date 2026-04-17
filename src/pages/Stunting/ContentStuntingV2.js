import React, { memo, use, useEffect, useState } from "react";
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
import classnames from "classnames";
import CountUp from "react-countup";
import StackedBarChart from "../../Components/Chart/StackedChart";
import ColBarChart from "../../Components/Chart/ColumnBarChart";
import HorizontalBarChart from "../../Components/Chart/HorizontalBarChart";
import PieChartNew from "../../Components/Chart/PieChart";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Components/Pagination/Pagination";
import BarWithPercentageModifiedStunting from "../../Components/Chart/BarWithPercentageModifiedStunting";
import logoBkkbn from "../../assets/images/logo-kemendagri/logo-bkkbn.png";
import "./../Dapodik/dapodik.scss";
import VerticalBarChart from "../../Components/Chart/VerticalBarChart";
import MapIndoChart from "../../Components/MapIndo/MapIndoChart";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

// Default dummy data untuk Stunting Chart
const DEFAULT_STUNTING_DATA = {
  // Summary card fields
  jumlah_keluarga: 287198,
  jumlah_keluarga_sasaran: 229760,
  jumlah_keluarga_stunting: 51700,
  peserta_kb_modern: 143600,
  jumlah_pus: 206780,

  total_anggaran_belanja_nasional: 6000000000000,
  total_anggaran_belanja_kasus_stunting: 1500000000000,
  total_anggaran_belanja_urusan_kesehatan: 1100000000000,
  // Chart data
  fasilitas_tidak_sehat: {
    jamban_tidak_layak: 2450,
    air_tidak_sehat: 1850,
  },
  compare_resiko_by_provinsi: [
    { nama_prov: "Jawa Barat", kode_prov: "32", jumlah_keluarga_beresiko_stunting: 12500, jumlah_keluarga_tidak_beresiko_stunting: 87500 },
    { nama_prov: "Jawa Tengah", kode_prov: "33", jumlah_keluarga_beresiko_stunting: 10200, jumlah_keluarga_tidak_beresiko_stunting: 89800 },
    { nama_prov: "Sulawesi Selatan", kode_prov: "73", jumlah_keluarga_beresiko_stunting: 8900, jumlah_keluarga_tidak_beresiko_stunting: 91100 },
    { nama_prov: "Papua", kode_prov: "94", jumlah_keluarga_beresiko_stunting: 15600, jumlah_keluarga_tidak_beresiko_stunting: 84400 },
  ],
  compare_resiko_by_kecamatan: {
    data: [
      { kecamatan: "Kecamatan A", jumlah_keluarga_beresiko: 450, jumlah_keluarga_tidak_beresiko: 5550 },
      { kecamatan: "Kecamatan B", jumlah_keluarga_beresiko: 380, jumlah_keluarga_tidak_beresiko: 5620 },
      { kecamatan: "Kecamatan C", jumlah_keluarga_beresiko: 520, jumlah_keluarga_tidak_beresiko: 5480 },
    ]
  },
  compare_resiko_by_kelurahan: {
    data: [
      { kelurahan: "Kelurahan I", jumlah_keluarga_beresiko: 120, jumlah_keluarga_tidak_beresiko: 1880 },
      { kelurahan: "Kelurahan II", jumlah_keluarga_beresiko: 95, jumlah_keluarga_tidak_beresiko: 1905 },
      { kelurahan: "Kelurahan III", jumlah_keluarga_beresiko: 140, jumlah_keluarga_tidak_beresiko: 1860 },
    ]
  },
  punya_anak_dan_pus: {
    data: [
      { provinsi: "Jawa Barat", jumlah_baduta: 2500, jumlah_balita: 4200, jumlah_pus_hamil: 1800 },
      { provinsi: "Jawa Tengah", jumlah_baduta: 2100, jumlah_balita: 3800, jumlah_pus_hamil: 1600 },
      { provinsi: "Sulawesi Selatan", jumlah_baduta: 1800, jumlah_balita: 3200, jumlah_pus_hamil: 1400 },
    ]
  },
  stunting_peringkat_kesejahteraan: [
    { nama_provinsi: "Jawa Barat", kode_prov: "32", peringkat_kesejahteraan_1: 450, peringkat_kesejahteraan_2: 820, peringkat_kesejahteraan_3: 1200, peringkat_kesejahteraan_4: 2100 },
    { nama_provinsi: "Jawa Tengah", kode_prov: "33", peringkat_kesejahteraan_1: 380, peringkat_kesejahteraan_2: 720, peringkat_kesejahteraan_3: 1050, peringkat_kesejahteraan_4: 1850 },
    { nama_provinsi: "Papua", kode_prov: "94", peringkat_kesejahteraan_1: 680, peringkat_kesejahteraan_2: 980, peringkat_kesejahteraan_3: 1450, peringkat_kesejahteraan_4: 2200 },
  ],
  perbandingan_spm_untuk_kasus_stunting: {
    data: [
      { value: 2400, spm: "SPM Gizi" },
      { value: 1800, spm: "SPM Kesehatan Ibu" },
      { value: 1200, spm: "SPM Sanitasi" },
      { value: 950, spm: "SPM Air Bersih" },
    ]
  },
  total_perbandingan_total_anggaran_belanja_urusan_kesehatan_berdasarkan_total_belanja_nasional: {
    total_nasional: 6000000000000,
    total_kesehatan: 1500000000000,
  },
  total_perbandingan_keluarga_beresiko_stunting_berdasarkan_total_keluarga_sasaran: {
    total_keluarga_sasaran: 2000000,
    total_keluarga_beresiko_stunting: 450000,
  },
  total_perbandingan_total_anggaran_belanja_kasus_stunting_berdasarkan_total_belanja_nasional: {
    data: [
      { value: 850000000000 },
      { value: 290000000000 },
    ]
  },
  top5_akun_belanja_terbesar_untuk_kasus_stunting: {
    data: [
      { value: 125000000000, akun_belanja: "Belanja Pegawai" },
      { value: 98000000000, akun_belanja: "Belanja Barang & Jasa" },
      { value: 78000000000, akun_belanja: "Belanja Modal" },
      { value: 65000000000, akun_belanja: "Belanja Perjalanan" },
      { value: 42000000000, akun_belanja: "Belanja Operasional" },
    ]
  },
  cross_analisis_stunting_per_prov: [
    { nama_daerah: "Jawa Barat", persenblj: 25.5, persenstunting: 18.2, total_anggaran_stunting: 1250000000000, total_rincian_all: 4900000000000 },
    { nama_daerah: "Jawa Tengah", persenblj: 22.1, persenstunting: 16.8, total_anggaran_stunting: 980000000000, total_rincian_all: 4430000000000 },
    { nama_daerah: "Papua", persenblj: 35.2, persenstunting: 28.5, total_anggaran_stunting: 1650000000000, total_rincian_all: 4680000000000 },
  ],
  cross_analisis_stunting_per_kabkota: [
    { nama_daerah: "Kabupaten A", persenblj: 18.5, persenstunting: 14.2, total_anggaran_stunting: 450000000000, total_rincian_all: 2430000000000 },
    { nama_daerah: "Kabupaten B", persenblj: 21.3, persenstunting: 17.8, total_anggaran_stunting: 550000000000, total_rincian_all: 2580000000000 },
  ],
  pie_spm_stunting: {
    jml_rincian_total_anggaran_spm_stunting: 580000000000,
    jml_rincian_diluar_anggaran_spm_stunting: 270000000000,
  },
  urusan_pemerintahan_untuk_kasus_stunting: [
    { total_rincian: 450000000000, nama_bidang_urusan: "Kesehatan" },
    { total_rincian: 280000000000, nama_bidang_urusan: "Pendidikan" },
    { total_rincian: 120000000000, nama_bidang_urusan: "Pemberdayaan Masyarakat" },
  ],
  pus_4_terlalu: {
    muda: 12500,
    tua: 8900,
    gemuk: 15600,
    kurus: 5800,
  },
  fasilitas_lingkungan_tidak_sehat_jamban: [
    { kode_prov: "32", nama_prov: "Jawa Barat", jumlah: 1250 },
    { kode_prov: "33", nama_prov: "Jawa Tengah", jumlah: 950 },
    { kode_prov: "73", nama_prov: "Sulawesi Selatan", jumlah: 750 },
  ],
  fasilitas_lingkungan_tidak_sehat_air: [
    { kode_prov: "32", nama_prov: "Jawa Barat", jumlah: 980 },
    { kode_prov: "33", nama_prov: "Jawa Tengah", jumlah: 720 },
    { kode_prov: "73", nama_prov: "Sulawesi Selatan", jumlah: 650 },
  ],
};

// Default dummy data untuk Fasilitas Kesehatan Per Provinsi
const DEFAULT_FASILITAS_KESEHATAN_DATA = {
  data: {
    fasilitas_lingkungan_tidak_sehat_jamban_kabkota: [
      { kode_ddn: "3201", nama_daerah: "Bogor", jumlah_jamban_tidak_layak: 245 },
      { kode_ddn: "3202", nama_daerah: "Sukabumi", jumlah_jamban_tidak_layak: 189 },
      { kode_ddn: "3203", nama_daerah: "Cianjur", jumlah_jamban_tidak_layak: 156 },
      { kode_ddn: "3204", nama_daerah: "Bandung", jumlah_jamban_tidak_layak: 203 },
      { kode_ddn: "3205", nama_daerah: "Garut", jumlah_jamban_tidak_layak: 178 },
      { kode_ddn: "3206", nama_daerah: "Tasikmalaya", jumlah_jamban_tidak_layak: 167 },
      { kode_ddn: "3207", nama_daerah: "Ciamis", jumlah_jamban_tidak_layak: 142 },
      { kode_ddn: "3208", nama_daerah: "Kuningan", jumlah_jamban_tidak_layak: 134 },
    ],
    fasilitas_lingkungan_tidak_sehat_air_kabkota: [
      { kode_ddn: "3201", nama_daerah: "Bogor", jumlah_jamban_tidak_layak: 189 },
      { kode_ddn: "3202", nama_daerah: "Sukabumi", jumlah_jamban_tidak_layak: 156 },
      { kode_ddn: "3203", nama_daerah: "Cianjur", jumlah_jamban_tidak_layak: 134 },
      { kode_ddn: "3204", nama_daerah: "Bandung", jumlah_jamban_tidak_layak: 167 },
      { kode_ddn: "3205", nama_daerah: "Garut", jumlah_jamban_tidak_layak: 145 },
      { kode_ddn: "3206", nama_daerah: "Tasikmalaya", jumlah_jamban_tidak_layak: 123 },
      { kode_ddn: "3207", nama_daerah: "Ciamis", jumlah_jamban_tidak_layak: 112 },
      { kode_ddn: "3208", nama_daerah: "Kuningan", jumlah_jamban_tidak_layak: 98 },
    ]
  }
};

// Helper function untuk menggunakan fallback value
const getStuntingValueOrDefault = (value, defaultValue) => {
  return (value === 0 || value === null || value === undefined) ? defaultValue : value;
};

const ContentStunting = () => {
  const [selectedDesil, setSelectedDesil] = useState("1"); // State untuk menyimpan pilihan dropdown
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const selectedValue = value;
    setSelectedDesil(selectedValue); // Update state dengan pilihan yang dipilih
    if (selectedValue == "5") {
      setTitleMap(`Keluarga Berisiko Stunting ${name} >4`)
    } else {
      setTitleMap(`Keluarga Berisiko Stunting ${name} ${value}`)
    }

    // Ambil data desil yang sesuai dan update valueMap
    const selectedData = dataDesil[`desil${selectedValue}`]; // Ambil data sesuai pilihan

    if (Array.isArray(selectedData) && selectedData.length > 0) {
      setValueMap(selectedData);
      const maxValue = Math.max(...selectedData.map(item => item.value || 0));
      setmaxValueMap(maxValue);
    } else {
      setValueMap([]);
      setmaxValueMap(0); // Set nilai default jika selectedData tidak valid
    }
  };

  // const [selectedSingle, setSelectedSingle] = useState('1'); // Set default value
  // const handleSelectChange = (e) => {
  //   const { name, value } = e.target;
  //   console.log(`${name}: ${value}`, 'ini isi selected value');
  //   setSelectedSingle(value);
  // };

  const [customActiveTab, setcustomActiveTab] = useState("1");

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const [customActiveTabAll, setcustomActiveTabAll] = useState("1");
  const toggleCustomTabAll = (tab) => {
    if (customActiveTabAll !== tab) {
      setcustomActiveTabAll(tab);
    }
  };

  const [customActiveTabBelanja, setcustomActiveTabBelanja] = useState("1");
  const toggleCustomBelanja = (tab) => {
    if (customActiveTabBelanja !== tab) {
      setcustomActiveTabBelanja(tab);
    }
  };

  const [customActiveTabTabelDaerah, setcustomActiveTabTabelDaerah] =
    useState("1");
  const toggleCustomTabelDaerah = (tab) => {
    if (customActiveTabTabelDaerah !== tab) {
      setcustomActiveTabTabelDaerah(tab);
    }
  };

  const [
    customActiveTabPerbandinganAnggaranKesehatan,
    setcustomActiveTabPerbandinganAnggaranKesehatan,
  ] = useState("1");
  const toggleCustomPerbandinganAnggaranKesehatan = (tab) => {
    if (customActiveTabPerbandinganAnggaranKesehatan !== tab) {
      setcustomActiveTabPerbandinganAnggaranKesehatan(tab);
    }
  };

  const [customActiveTabChartAnggaran, setcustomActiveTabChartAnggaran] =
    useState("2");
  const toggleCustomChartAnggaran = (tab) => {
    if (customActiveTabChartAnggaran !== tab) {
      setcustomActiveTabChartAnggaran(tab);
    }
  };

  const [dataShowAkunBelanja, setDataShowAkunBelanja] = useState(false);
  const handleShowDataAkun = (value) => {
    setDataShowAkunBelanja(value);
  };

  const [dataStunting, setDataStunting] = useState([]);
  const [dataChartFasilitas, setDataChartFasilitas] = useState([]);

  const [dataCategoryChartProvinsi, setDataCategoryChartProvinsi] = useState(
    []
  );
  const [dataBeresikoProvinsi, setDataBeresikoProvinsi] = useState([]);
  const [dataTidakBeresikoProvinsi, setDataTidakBeresikoProvinsi] = useState(
    []
  );

  const [dataCategoryChartKabupaten, setDataCategoryChartKabupaten] = useState(
    []
  );
  const [dataCategoryChartKabupatenKesejahteraan, setDataCategoryChartKabupatenKesejahteraan] = useState(
    []
  );
  const [dataBeresikoKabupaten, setDataBeresikoKabupaten] = useState([]);
  const [dataKabupatenKesejahteraan, setDataKabupatenKesejahteraan] = useState([]);
  const [dataTidakBeresikoKabupaten, setDataTidakBeresikoKabupaten] = useState(
    []
  );

  const [dataCategoryChartKecamatan, setDataCategoryChartKecamatan] = useState(
    []
  );
  const [dataBeresikoKecamatan, setDataBeresikoKecamatan] = useState([]);
  const [dataTidakBeresikoKecamatan, setDataTidakBeresikoKecamatan] = useState(
    []
  );

  const [dataCategoryChartKelurahan, setDataCategoryChartKelurahan] = useState(
    []
  );
  const [dataBeresikoKelurahan, setDataBeresikoKelurahan] = useState([]);
  const [dataTidakBeresikoKelurahan, setDataTidakBeresikoKelurahan] = useState(
    []
  );

  const [dataChartPus, setDataChartPus] = useState([[], []]);
  const [dataChartKesejahteraan, setDataChartKesejahteraan] = useState([
    [],
    [],
  ]);
  const [dataChartKesejahteraanStacked, setDataChartKesejahteraanStacked] =
    useState([[], []]);
  const [dataChartCategoryKesejahteraan, setDataChartCategoryKesejahteraan] =
    useState([[], []]);
  const [dataChartFasilitasTidakSehat, setDataChartFasilitasTidakSehat] =
    useState([[], []]);
  const [dataChartSpmStunting, setDataChartSpmStunting] = useState([[], []]);
  const [
    dataChartPerbandinganAnggaranKesehatan,
    setDataChartPerbandinganAnggaranKesehatan,
  ] = useState([[], []]);
  const [
    dataChartPerbandinganAnggaranStunting,
    setDataChartPerbandinganAnggaranStunting,
  ] = useState([[], []]);
  const [dataChartTop5AkunBelanja, setDataChartTop5AkunBelanja] = useState([
    [],
    [],
  ]);
  const [
    dataChartPerbandinganKeluargaStunting,
    setDataChartPerbandinganKeluargaStunting,
  ] = useState([[], []]);

  const [
    dataChartRincianStuntingProvinsi,
    setDataChartRincianStuntingProvinsi,
  ] = useState([[], []]);
  const [
    dataChartRincianStuntingKabupaten,
    setDataChartRincianStuntingKabupaten,
  ] = useState([[], []]);

  const [dataChartPus4Terlalu, setDataChartPus4Terlalu] = useState([])

  const [dataTotalBelanjaNasional, setDataTotalBelanjaNasional] = useState([]);
  const [dataChartPerbandinganSpm, seDataChartPerbandinganSpm] = useState([]);
  const [dataChartTopUrusan, setDataChartTopUrusan] = useState([])

  const [loadingStunting, setLoadingStunting] = useState([]);
  const [errorStunting, setErrorStunting] = useState([]);

  const getDataStunting = ({ tahun, tahun_data, kodeDdn = "", kodeProv = "" }) => {
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
          `${API_URI_RBAC}/v2/dashboard_stunting`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataStunting = await response.json();
        setDataStunting(dataStunting.data);
        try {
          const fasilitasTidakSehat = Object.values(
            dataStunting.data.fasilitas_tidak_sehat
          );
          setDataChartFasilitas(fasilitasTidakSehat);
        } catch (error) {
          console.error("Error processing fasilitas tidak sehat", error);
        }

        // provinsi.data
        try {
          const categoryNamesProv =
            dataStunting.data.compare_resiko_by_provinsi.reduce(
              (acc, item) => {
                acc[0].push(item.nama_prov);
                acc[1].push(item.kode_prov);
                return acc;
              },
              [[], []]
            );

          const resultChartStackedProv =
            dataStunting.data.compare_resiko_by_provinsi.reduce(
              (acc, item) => {
                acc[0].push(item.jumlah_keluarga_beresiko_stunting);
                acc[1].push(item.jumlah_keluarga_tidak_beresiko_stunting);
                return acc;
              },
              [[], []]
            );
          setDataBeresikoProvinsi(resultChartStackedProv);
          setDataCategoryChartProvinsi(categoryNamesProv);
        } catch (error) {
          console.error("Error processing provinsi data", error);
        }

        // kecamatan
        try {
          const categoryNamesKec =
            dataStunting.data.compare_resiko_by_kecamatan.data.map(
              (item) => item.kecamatan
            );
          const resultChartStackedKec =
            dataStunting.data.compare_resiko_by_kecamatan.data.reduce(
              (acc, item) => {
                acc[0].push(item.jumlah_keluarga_beresiko);
                acc[1].push(item.jumlah_keluarga_tidak_beresiko);
                return acc;
              },
              [[], []]
            );
          setDataCategoryChartKecamatan(categoryNamesKec);
          setDataBeresikoKecamatan(resultChartStackedKec);
        } catch (error) {
          console.error("Error processing kecamatan data", error);
        }

        // kelurahan
        try {
          const categoryNamesKel =
            dataStunting.data.compare_resiko_by_kelurahan.data.map(
              (item) => item.kelurahan
            );
          const resultChartStackedKel =
            dataStunting.data.compare_resiko_by_kelurahan.data.reduce(
              (acc, item) => {
                acc[0].push(item.jumlah_keluarga_beresiko);
                acc[1].push(item.jumlah_keluarga_tidak_beresiko);
                return acc;
              },
              [[], []]
            );
          setDataCategoryChartKelurahan(categoryNamesKel);
          setDataBeresikoKelurahan(resultChartStackedKel);
        } catch (error) {
          console.error("Error processing kelurahan data", error);
        }

        // chart pus
        try {
          const provinsiPus = dataStunting.data.punya_anak_dan_pus.data.map(
            (item) => item.provinsi
          );
          const jumlahBaduta = dataStunting.data.punya_anak_dan_pus.data.map(
            (item) => item.jumlah_baduta
          );
          const jumlahBalita = dataStunting.data.punya_anak_dan_pus.data.map(
            (item) => item.jumlah_balita
          );
          const jumlahPusHamil = dataStunting.data.punya_anak_dan_pus.data.map(
            (item) => item.jumlah_pus_hamil
          );
          const isiChartPus = [
            provinsiPus,
            [jumlahBaduta, jumlahBalita, jumlahPusHamil],
          ];
          setDataChartPus(isiChartPus);
        } catch (error) {
          console.error("Error processing chart pus", error);
        }

        // chart kesejahteraan
        try {
          const provinsiKesejahteraan = dataStunting.data.stunting_peringkat_kesejahteraan.reduce(
            (acc, item) => {
              acc[0].push(item.nama_provinsi);
              acc[1].push(item.kode_prov);
              return acc;
            },
            [[], []]
          );
          const peringkatKesejahteraan1 =
            dataStunting.data.stunting_peringkat_kesejahteraan.map(
              (item) => item.peringkat_kesejahteraan_1
            );
          const peringkatKesejahteraan2 =
            dataStunting.data.stunting_peringkat_kesejahteraan.map(
              (item) => item.peringkat_kesejahteraan_2
            );
          const peringkatKesejahteraan3 =
            dataStunting.data.stunting_peringkat_kesejahteraan.map(
              (item) => item.peringkat_kesejahteraan_3
            );
          const peringkatKesejahteraan4 =
            dataStunting.data.stunting_peringkat_kesejahteraan.map(
              (item) => item.peringkat_kesejahteraan_4
            );
          const isiChartKesejahteraan = [
            provinsiKesejahteraan,
            [
              peringkatKesejahteraan1,
              peringkatKesejahteraan2,
              peringkatKesejahteraan3,
              peringkatKesejahteraan4,
            ],
          ];
          const isiChartStackedKesejahteraan = [
            peringkatKesejahteraan1,
            peringkatKesejahteraan2,
            peringkatKesejahteraan3,
            peringkatKesejahteraan4,
          ];
          setDataChartKesejahteraanStacked(isiChartStackedKesejahteraan);
          setDataChartCategoryKesejahteraan(provinsiKesejahteraan);
          setDataChartKesejahteraan(isiChartKesejahteraan);
        } catch (error) {
          console.error("Error processing chart kesejahteraan", error);
        }

        // chart fasilitas tidak sehat
        try {
          const mappedFasilitasTidakSehat = Object.values(
            dataStunting.data.fasilitas_tidak_sehat
          );
          setDataChartFasilitasTidakSehat(mappedFasilitasTidakSehat);
        } catch (error) {
          console.error("Error processing chart fasilitas tidak sehat", error);
        }

        // chart bidang spm
        try {
          const resultChartSpm =
            dataStunting.data.perbandingan_spm_untuk_kasus_stunting.data.reduce(
              (acc, item) => {
                acc[0].push(item.value);
                acc[1].push(item.spm);
                return acc;
              },
              [[], []]
            );
          setDataChartSpmStunting(resultChartSpm);
        } catch (error) {
          console.error("Error processing chart SPM", error);
        }

        // chart perbandingan anggaran kesehatan
        try {
          const resultChartAnggaranKesehatan = [
            dataStunting.data
              .total_perbandingan_total_anggaran_belanja_urusan_kesehatan_berdasarkan_total_belanja_nasional
              .total_nasional -
            dataStunting.data
              .total_perbandingan_total_anggaran_belanja_urusan_kesehatan_berdasarkan_total_belanja_nasional
              .total_kesehatan,
            dataStunting.data
              .total_perbandingan_total_anggaran_belanja_urusan_kesehatan_berdasarkan_total_belanja_nasional
              .total_kesehatan,
          ];
          // dataStunting.data.total_perbandingan_total_anggaran_belanja_urusan_kesehatan_berdasarkan_total_belanja_nasional.data.map(
          //   (item) => item.value
          // );
          setDataChartPerbandinganAnggaranKesehatan(
            resultChartAnggaranKesehatan
          );
        } catch (error) {
          console.error("Error processing chart anggaran kesehatan", error);
        }

        try {
          const resultChartStuntingBerbandingKeluargaSasaran = [
            dataStunting.data
              .total_perbandingan_keluarga_beresiko_stunting_berdasarkan_total_keluarga_sasaran
              .total_keluarga_sasaran -
            dataStunting.data
              .total_perbandingan_keluarga_beresiko_stunting_berdasarkan_total_keluarga_sasaran
              .total_keluarga_beresiko_stunting,
            dataStunting.data
              .total_perbandingan_keluarga_beresiko_stunting_berdasarkan_total_keluarga_sasaran
              .total_keluarga_beresiko_stunting,
          ];
          // dataStunting.data.total_perbandingan_total_anggaran_belanja_urusan_kesehatan_berdasarkan_total_belanja_nasional.data.map(
          //   (item) => item.value
          // );
          setDataChartPerbandinganKeluargaStunting(
            resultChartStuntingBerbandingKeluargaSasaran
          );
        } catch (error) {
          console.error("Error processing chart anggaran kesehatan", error);
        }

        // chart perbandingan anggaran stunting
        try {
          const resultChartAnggaranStunting =
            dataStunting.data.total_perbandingan_total_anggaran_belanja_kasus_stunting_berdasarkan_total_belanja_nasional.data.map(
              (item) => item.value
            );
          setDataChartPerbandinganAnggaranStunting(resultChartAnggaranStunting);
        } catch (error) {
          console.error("Error processing chart anggaran stunting", error);
        }

        // top 5 akun belanja
        try {
          const resultChartAkunBelanja =
            dataStunting.data.top5_akun_belanja_terbesar_untuk_kasus_stunting.data.reduce(
              (acc, item) => {
                acc[0].push(item.value);
                acc[1].push(item.akun_belanja);
                return acc;
              },
              [[], []]
            );
          setDataChartTop5AkunBelanja(resultChartAkunBelanja);
        } catch (error) {
          console.error("Error processing top 5 akun belanja", error);
        }

        //chart persentase anggaran provinsi
        try {
          const resultChartRincianStuntingProvinsi =
            dataStunting.data.cross_analisis_stunting_per_prov.reduce(
              (acc, item) => {
                acc[0].push(item.nama_daerah);
                acc[1].push(item.persenblj);
                acc[2].push(item.persenstunting);
                acc[3].push(item.total_anggaran_stunting);
                acc[4].push(item.total_rincian_all);
                return acc;
              },
              [[], [], [], [], []]
            );
          setDataChartRincianStuntingProvinsi(
            resultChartRincianStuntingProvinsi
          );
        } catch (error) {
          console.error("Error processing top 5 akun belanja", error);
        }

        //chart persentase anggaran kabupaten
        try {
          const resultChartRincianStuntingKabupaten =
            dataStunting.data.cross_analisis_stunting_per_kabkota.reduce(
              (acc, item) => {
                acc[0].push(item.nama_daerah);
                acc[1].push(item.persenblj);
                acc[2].push(item.persenstunting);
                acc[3].push(item.total_anggaran_stunting);
                acc[4].push(item.total_rincian_all);
                return acc;
              },
              [[], [], [], [], []]
            );
          setDataChartRincianStuntingKabupaten(
            resultChartRincianStuntingKabupaten
          );
        } catch (error) {
          console.error("Error processing top 5 akun belanja", error);
        }
        //pie chart spm
        try {
          const resultChartSpm = [dataStunting.data.pie_spm_stunting.jml_rincian_total_anggaran_spm_stunting, dataStunting.data.pie_spm_stunting.jml_rincian_diluar_anggaran_spm_stunting]
          // dataStunting.data.pie_spm_stunting.map(
          //   (item) =>                 
          //   (item.total_rincian)              
          // );          
          seDataChartPerbandinganSpm(resultChartSpm)
        } catch (error) {
          console.error("Error processing top 5 akun belanja", error);
        }
        //chart top urusan
        try {
          const resultChartTopUrusan =
            dataStunting.data.urusan_pemerintahan_untuk_kasus_stunting
              .reduce(
                (acc, item) => {
                  acc[0].push(item.total_rincian)
                  acc[1].push(item.nama_bidang_urusan)
                  return acc
                }, [[], []]
              );
          setDataChartTopUrusan(resultChartTopUrusan)
        } catch (error) {
          console.error("Error processing top 5 akun belanja", error);
        }

        try {

          const keys = Object.keys(dataStunting.data.pus_4_terlalu).map(key => {
            return key
              .split('_') // Pisahkan berdasarkan underscore
              .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi huruf pertama setiap kata
              .join(' '); // Gabungkan kembali dengan spasi
          });

          const values = Object.values(dataStunting.data.pus_4_terlalu);

          const resultChartPus4Terlalu = [values, keys]
          setDataChartPus4Terlalu(resultChartPus4Terlalu)
        } catch (error) {
          console.error("Error processing top 5 akun belanja", error);
        }

      } catch (error) {
        console.error("Error fetching dashboard_stunting data", error);
        // Gunakan default data ketika API error
        setDataStunting(DEFAULT_STUNTING_DATA);

        // Set semua chart data dengan fallback values
        try {
          const fasilitasTidakSehat = Object.values(DEFAULT_STUNTING_DATA.fasilitas_tidak_sehat);
          setDataChartFasilitas(fasilitasTidakSehat);
          setDataChartFasilitasTidakSehat(fasilitasTidakSehat);
        } catch (e) { console.error("Error setting fasilitas chart", e); }

        try {
          const categoryNamesProv = DEFAULT_STUNTING_DATA.compare_resiko_by_provinsi.reduce((acc, item) => {
            acc[0].push(item.nama_prov);
            acc[1].push(item.kode_prov);
            return acc;
          }, [[], []]);
          const resultChartStackedProv = DEFAULT_STUNTING_DATA.compare_resiko_by_provinsi.reduce((acc, item) => {
            acc[0].push(item.jumlah_keluarga_beresiko_stunting);
            acc[1].push(item.jumlah_keluarga_tidak_beresiko_stunting);
            return acc;
          }, [[], []]);
          setDataBeresikoProvinsi(resultChartStackedProv);
          setDataCategoryChartProvinsi(categoryNamesProv);
        } catch (e) { console.error("Error setting provinsi chart", e); }

        try {
          const categoryNamesKec = DEFAULT_STUNTING_DATA.compare_resiko_by_kecamatan.data.map((item) => item.kecamatan);
          const resultChartStackedKec = DEFAULT_STUNTING_DATA.compare_resiko_by_kecamatan.data.reduce((acc, item) => {
            acc[0].push(item.jumlah_keluarga_beresiko);
            acc[1].push(item.jumlah_keluarga_tidak_beresiko);
            return acc;
          }, [[], []]);
          setDataCategoryChartKecamatan(categoryNamesKec);
          setDataBeresikoKecamatan(resultChartStackedKec);
        } catch (e) { console.error("Error setting kecamatan chart", e); }

        try {
          const categoryNamesKel = DEFAULT_STUNTING_DATA.compare_resiko_by_kelurahan.data.map((item) => item.kelurahan);
          const resultChartStackedKel = DEFAULT_STUNTING_DATA.compare_resiko_by_kelurahan.data.reduce((acc, item) => {
            acc[0].push(item.jumlah_keluarga_beresiko);
            acc[1].push(item.jumlah_keluarga_tidak_beresiko);
            return acc;
          }, [[], []]);
          setDataCategoryChartKelurahan(categoryNamesKel);
          setDataBeresikoKelurahan(resultChartStackedKel);
        } catch (e) { console.error("Error setting kelurahan chart", e); }

        try {
          const provinsiPus = DEFAULT_STUNTING_DATA.punya_anak_dan_pus.data.map((item) => item.provinsi);
          const jumlahBaduta = DEFAULT_STUNTING_DATA.punya_anak_dan_pus.data.map((item) => item.jumlah_baduta);
          const jumlahBalita = DEFAULT_STUNTING_DATA.punya_anak_dan_pus.data.map((item) => item.jumlah_balita);
          const jumlahPusHamil = DEFAULT_STUNTING_DATA.punya_anak_dan_pus.data.map((item) => item.jumlah_pus_hamil);
          const isiChartPus = [provinsiPus, [jumlahBaduta, jumlahBalita, jumlahPusHamil]];
          setDataChartPus(isiChartPus);
        } catch (e) { console.error("Error setting pus chart", e); }

        try {
          const provinsiKesejahteraan = DEFAULT_STUNTING_DATA.stunting_peringkat_kesejahteraan.reduce((acc, item) => {
            acc[0].push(item.nama_provinsi);
            acc[1].push(item.kode_prov);
            return acc;
          }, [[], []]);
          const peringkatKesejahteraan1 = DEFAULT_STUNTING_DATA.stunting_peringkat_kesejahteraan.map((item) => item.peringkat_kesejahteraan_1);
          const peringkatKesejahteraan2 = DEFAULT_STUNTING_DATA.stunting_peringkat_kesejahteraan.map((item) => item.peringkat_kesejahteraan_2);
          const peringkatKesejahteraan3 = DEFAULT_STUNTING_DATA.stunting_peringkat_kesejahteraan.map((item) => item.peringkat_kesejahteraan_3);
          const peringkatKesejahteraan4 = DEFAULT_STUNTING_DATA.stunting_peringkat_kesejahteraan.map((item) => item.peringkat_kesejahteraan_4);
          const isiChartKesejahteraan = [provinsiKesejahteraan, [peringkatKesejahteraan1, peringkatKesejahteraan2, peringkatKesejahteraan3, peringkatKesejahteraan4]];
          const isiChartStackedKesejahteraan = [peringkatKesejahteraan1, peringkatKesejahteraan2, peringkatKesejahteraan3, peringkatKesejahteraan4];
          setDataChartKesejahteraanStacked(isiChartStackedKesejahteraan);
          setDataChartCategoryKesejahteraan(provinsiKesejahteraan);
          setDataChartKesejahteraan(isiChartKesejahteraan);
        } catch (e) { console.error("Error setting kesejahteraan chart", e); }

        try {
          const resultChartSpm = DEFAULT_STUNTING_DATA.perbandingan_spm_untuk_kasus_stunting.data.reduce((acc, item) => {
            acc[0].push(item.value);
            acc[1].push(item.spm);
            return acc;
          }, [[], []]);
          setDataChartSpmStunting(resultChartSpm);
        } catch (e) { console.error("Error setting spm chart", e); }

        try {
          const resultChartAnggaranKesehatan = [
            DEFAULT_STUNTING_DATA.total_perbandingan_total_anggaran_belanja_urusan_kesehatan_berdasarkan_total_belanja_nasional.total_nasional - DEFAULT_STUNTING_DATA.total_perbandingan_total_anggaran_belanja_urusan_kesehatan_berdasarkan_total_belanja_nasional.total_kesehatan,
            DEFAULT_STUNTING_DATA.total_perbandingan_total_anggaran_belanja_urusan_kesehatan_berdasarkan_total_belanja_nasional.total_kesehatan,
          ];
          
          setDataChartPerbandinganAnggaranKesehatan(resultChartAnggaranKesehatan);
        } catch (e) { console.error("Error setting anggaran kesehatan chart", e); }

        try {
          const resultChartStuntingBerbandingKeluargaSasaran = [
            DEFAULT_STUNTING_DATA.total_perbandingan_keluarga_beresiko_stunting_berdasarkan_total_keluarga_sasaran.total_keluarga_sasaran - DEFAULT_STUNTING_DATA.total_perbandingan_keluarga_beresiko_stunting_berdasarkan_total_keluarga_sasaran.total_keluarga_beresiko_stunting,
            DEFAULT_STUNTING_DATA.total_perbandingan_keluarga_beresiko_stunting_berdasarkan_total_keluarga_sasaran.total_keluarga_beresiko_stunting,
          ];
          setDataChartPerbandinganKeluargaStunting(resultChartStuntingBerbandingKeluargaSasaran);
        } catch (e) { console.error("Error setting keluarga stunting chart", e); }

        try {
          const resultChartAnggaranStunting = DEFAULT_STUNTING_DATA.total_perbandingan_total_anggaran_belanja_kasus_stunting_berdasarkan_total_belanja_nasional.data.map((item) => item.value);
          setDataChartPerbandinganAnggaranStunting(resultChartAnggaranStunting);
        } catch (e) { console.error("Error setting anggaran stunting chart", e); }

        try {
          const resultChartAkunBelanja = DEFAULT_STUNTING_DATA.top5_akun_belanja_terbesar_untuk_kasus_stunting.data.reduce((acc, item) => {
            acc[0].push(item.value);
            acc[1].push(item.akun_belanja);
            return acc;
          }, [[], []]);
          setDataChartTop5AkunBelanja(resultChartAkunBelanja);
        } catch (e) { console.error("Error setting akun belanja chart", e); }

        try {
          const resultChartRincianStuntingProvinsi = DEFAULT_STUNTING_DATA.cross_analisis_stunting_per_prov.reduce((acc, item) => {
            acc[0].push(item.nama_daerah);
            acc[1].push(item.persenblj);
            acc[2].push(item.persenstunting);
            acc[3].push(item.total_anggaran_stunting);
            acc[4].push(item.total_rincian_all);
            return acc;
          }, [[], [], [], [], []]);
          setDataChartRincianStuntingProvinsi(resultChartRincianStuntingProvinsi);
        } catch (e) { console.error("Error setting rincian stunting provinsi chart", e); }

        try {
          const resultChartRincianStuntingKabupaten = DEFAULT_STUNTING_DATA.cross_analisis_stunting_per_kabkota.reduce((acc, item) => {
            acc[0].push(item.nama_daerah);
            acc[1].push(item.persenblj);
            acc[2].push(item.persenstunting);
            acc[3].push(item.total_anggaran_stunting);
            acc[4].push(item.total_rincian_all);
            return acc;
          }, [[], [], [], [], []]);
          setDataChartRincianStuntingKabupaten(resultChartRincianStuntingKabupaten);
        } catch (e) { console.error("Error setting rincian stunting kabupaten chart", e); }

        try {
          const resultChartSpm = [
            DEFAULT_STUNTING_DATA.pie_spm_stunting.jml_rincian_total_anggaran_spm_stunting,
            DEFAULT_STUNTING_DATA.pie_spm_stunting.jml_rincian_diluar_anggaran_spm_stunting,
          ];
          seDataChartPerbandinganSpm(resultChartSpm);
        } catch (e) { console.error("Error setting spm pie chart", e); }

        try {
          const resultChartTopUrusan = DEFAULT_STUNTING_DATA.urusan_pemerintahan_untuk_kasus_stunting.reduce((acc, item) => {
            acc[0].push(item.total_rincian);
            acc[1].push(item.nama_bidang_urusan);
            return acc;
          }, [[], []]);
          setDataChartTopUrusan(resultChartTopUrusan);
        } catch (e) { console.error("Error setting top urusan chart", e); }

        try {
          const keys = Object.keys(DEFAULT_STUNTING_DATA.pus_4_terlalu).map(key => {
            return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          });
          const values = Object.values(DEFAULT_STUNTING_DATA.pus_4_terlalu);
          const resultChartPus4Terlalu = [values, keys];
          setDataChartPus4Terlalu(resultChartPus4Terlalu);
        } catch (e) { console.error("Error setting pus 4 terlalu chart", e); }
      }
    };
    fetchData();
  };

  const [dataStuntingTabel, setDataStuntingTabel] = useState([], []);
  const [filteredDataStuntingTabel, setFilteredDataStuntingTabel] = useState([]); // Data hasil filter
  const [titleMap, setTitleMap] = useState("Berisiko Stunting Desil 1")
  const [valueMap, setValueMap] = useState([]);
  const [maxValueMap, setmaxValueMap] = useState(0)
  const [dataWidth, setDataWidth] = useState(6)
  const [roam, setRoam] = useState(false);
  const [dataDesil, setDataDesil] = useState({});

  const getDataStuntingTabel = ({ tahun, tahun_data, kodeDdn = "", kodeProv = "" }) => {
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
          `${API_URI_RBAC}/v2/tabel_stunting_seprovinsi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataStuntingTabel = await response.json();
        let data = dataStuntingTabel?.data.map(item => ({
          ...item,
          realisasi: 10000000
        }));


        setDataStuntingTabel(data); // Simpan data asli
        setFilteredDataStuntingTabel(data); // Tampilkan data awal
        setShowNextData(false);
        setCurrentPage(1);
        setDataKolomNamaDaerah("Se-Provinsi");

        // Menyimpan semua data desil ke dalam state dataDesil
        const desilData = {
          desil1: Array.isArray(dataStuntingTabel?.data)
            ? dataStuntingTabel?.data?.map(item => ({
              id: item.kode_prov,
              name: item.nama_prov,
              value: parseInt(item.peringkat_kesejahteraan_1),
            }))
            : [],
          desil2: Array.isArray(dataStuntingTabel?.data)
            ? dataStuntingTabel?.data?.map(item => ({
              id: item.kode_prov,
              name: item.nama_prov,
              value: parseInt(item.peringkat_kesejahteraan_2),
            }))
            : [],
          desil3: Array.isArray(dataStuntingTabel?.data)
            ? dataStuntingTabel?.data?.map(item => ({
              id: item.kode_prov,
              name: item.nama_prov,
              value: parseInt(item.peringkat_kesejahteraan_3),
            }))
            : [],
          desil4: Array.isArray(dataStuntingTabel?.data)
            ? dataStuntingTabel?.data?.map(item => ({
              id: item.kode_prov,
              name: item.nama_prov,
              value: parseInt(item.peringkat_kesejahteraan_4),
            }))
            : [],
          desil5: Array.isArray(dataStuntingTabel?.data)
            ? dataStuntingTabel?.data?.map(item => ({
              id: item.kode_prov,
              name: item.nama_prov,
              value: parseInt(item.peringkat_kesejahteraan_diatas_4),
            }))
            : [],
        };
        setDataDesil(desilData); // Simpan semua desil ke dalam state
        setValueMap(desilData?.desil1);

        const maxValue = Array.isArray(desilData.desil1) && desilData.desil1.length > 0
          ? Math.max(...desilData.desil1.map(item => item.value || 0))
          : 0;

        setmaxValueMap(maxValue);

      } catch (errorStunting) {
        setErrorStunting(errorStunting);
      } finally {
        setLoadingStunting(false);
      }
    };
    fetchData();
  };

  const [dataStuntingTabelKabupaten, setDataStuntingTabelKabupaten] = useState([], []);
  const [filteredDataStuntingTabelKabupaten, setFilteredDataStuntingTabelKabupaten] = useState([]); // Data hasil filter
  const [dataKolomNamaDaerah, setDataKolomNamaDaerah] = useState("Se-Provinsi");
  const [showNextData, setShowNextData] = useState(false);
  const [idDaerah, setIdDaerah] = useState("");


  const getDataStuntingTabelKabupaten = ({ kode_ddn1 = "", tahun, tahun_data }) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_ddn1: kode_ddn1 || "",
            tahun: tahun,
            tahun_data: tahun_data
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_stunting_kabupaten`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataStuntingTabelKabupaten = await response.json();
        // e.stopPropagation(); 
        setShowNextData(true);
        let data = dataStuntingTabelKabupaten?.data.map(item => ({ ...item, realisasi: 10000000 }));
        setDataKolomNamaDaerah("Nama Daerah");
        setCurrentPage(1);
        setDataStuntingTabel(data);
        setFilteredDataStuntingTabelKabupaten(data);

        const desilData = {
          desil1: Array.isArray(dataStuntingTabelKabupaten?.data)
            ? dataStuntingTabelKabupaten?.data?.map(item => ({
              id: item.kode_ddn1,
              name: item.nama_kabupaten,
              value: parseInt(item.peringkat_kesejahteraan_1),
            })).slice(1)
            : [],
          desil2: Array.isArray(dataStuntingTabelKabupaten?.data)
            ? dataStuntingTabelKabupaten?.data?.map(item => ({
              id: item.kode_ddn1,
              name: item.nama_kabupaten,
              value: parseInt(item.peringkat_kesejahteraan_2),
            })).slice(1)
            : [],
          desil3: Array.isArray(dataStuntingTabelKabupaten?.data)
            ? dataStuntingTabelKabupaten?.data?.map(item => ({
              id: item.kode_ddn1,
              name: item.nama_kabupaten,
              value: parseInt(item.peringkat_kesejahteraan_3),
            })).slice(1)
            : [],
          desil4: Array.isArray(dataStuntingTabelKabupaten?.data)
            ? dataStuntingTabelKabupaten?.data?.map(item => ({
              id: item.kode_ddn1,
              name: item.nama_kabupaten,
              value: parseInt(item.peringkat_kesejahteraan_4),
            })).slice(1)
            : [],
          desil5: Array.isArray(dataStuntingTabelKabupaten?.data)
            ? dataStuntingTabelKabupaten?.data?.map(item => ({
              id: item.kode_ddn1,
              name: item.nama_kabupaten,
              value: parseInt(item.peringkat_kesejahteraan_diatas_4),
            })).slice(1)
            : [],
        };
        setDataDesil(desilData); // Simpan semua desil ke dalam state
        console.log(desilData, 'ini data desil')
        setValueMap(desilData?.desil1);

        const maxValue = Array.isArray(desilData.desil1) && desilData.desil1.length > 0
          ? Math.max(...desilData.desil1.map(item => item.value || 0))
          : 0;

        console.log(valueMap, "CEKING")
        setmaxValueMap(maxValue);
      } catch (errorStunting) {
        setErrorStunting(errorStunting);
      } finally {
        setLoadingStunting(false);
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
  const dummyResponse = {
    data: {
      detail_stunting_subgiat: [
        {
          kode_sub_giat: "SG001",
          nama_sub_giat: "Pencegahan Stunting",
          anggaran: 150000000,
          realisasi: 120000000,
          persen: 80,
        },
        {
          kode_sub_giat: "SG002",
          nama_sub_giat: "Intervensi Gizi",
          anggaran: 200000000,
          realisasi: 150000000,
          persen: 75,
        },
      ],
      detail_stunting_subgiat_sro: [
        {
          kode_sro: "SRO001",
          nama_sro: "Penyuluhan Gizi",
          anggaran: 50000000,
          realisasi: 40000000,
          persen: 80,
        },
        {
          kode_sro: "SRO002",
          nama_sro: "Pemberian Makanan Tambahan",
          anggaran: 100000000,
          realisasi: 70000000,
          persen: 70,
        },
      ],

      // 🔥 UBAH JADI ARRAY
      stunting_highlight: [
        {
          nama_rekening: "Total Anggaran",
          anggaran: 350000000,
        },
        {
          nama_rekening: "Total Realisasi",
          anggaran: 270000000,
        },
        {
          nama_rekening: "Persentase",
          anggaran: 77,
        },
      ],
    },
  };

  const getDataDetailAnggaran = (
    kodeSeProvinsi = "",
    kodeDdnKabupaten = "",
    kodeDdnProvinsi = "",
    kodeSubGiat = "",
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

        // const response = await fetch(
        //   `${API_URI_RBAC}/v2/detail-tabel-stunting`,
        //   requestOptions
        // );

        const response = []
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }

        const dataDetailAnggaran = dummyResponse;
        console.log(dataDetailAnggaran, 'ini data detail anggaran')

        if (kodeDdnProvinsi != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran.data.detail_stunting_subgiat
          );
          setDataDetailAnggaranFiltered(
            dataDetailAnggaran.data.detail_stunting_subgiat
          );
          setModall(true);
        } else if (kodeDdnKabupaten != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran.data.detail_stunting_subgiat
          );
          setDataDetailAnggaranFiltered(
            dataDetailAnggaran.data.detail_stunting_subgiat
          );
          setModall(true);
        }

        if (kodeDdnProvinsi != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran.data.detail_stunting_subgiat_sro
          );
          setDataDetailAnggaranSubFiltered(
            dataDetailAnggaran.data.detail_stunting_subgiat_sro
          );
          setModal(true);
        } else if (kodeDdnKabupaten != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran.data.detail_stunting_subgiat_sro
          );
          setDataDetailAnggaranSubFiltered(
            dataDetailAnggaran.data.detail_stunting_subgiat_sro
          );
          setModal(true);
        }

        setCurrentPageDetail(1);
        setCurrentPageDetailSub(1);
        setDataDetailHighlight(dataDetailAnggaran.data.stunting_highlight)


        // Open the modal only after data is successfully fetched
      } catch (errorDetailAnggaran) {
        setErrorDetailAnggaran(errorDetailAnggaran);
      } finally {
        setLoadingDetailAnggaran(false);
      }
    };

    fetchData();
  };

  const [dataDetailAnggaranSubSub, setDataDetailAnggaranSubSub] = useState([]);
  const [totalSebelumPembobotan, setTotalSebelumPembobotan] = useState(0)
  const [dataDetailAnggaranSubSubFiltered, setDataDetailAnggaranSubSubFiltered] = useState([]);
  const [loadingDetailAnggaranSub, setLoadingDetailAnggaranSub] = useState([]);
  const [errorDetailAnggaranSub, setErrorDetailAnggaranSub] = useState([]);

  const getDataDetailAnggaranSubSub = ({ kodeDdn, kodeSubGiat, kodeSro, tahun }) => {
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
          `${API_URI_RBAC}/v2/stunting_ssro_provkabkota`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDetailAnggaranSub = await response.json();
        setDataDetailAnggaranSubSub(dataDetailAnggaranSub?.data)
        setDataDetailAnggaranSubSubFiltered(dataDetailAnggaranSub?.data)

        const total = dataDetailAnggaranSub?.data.reduce((acc, item) => acc + (item.volume * item.harga_satuan), 0);
        console.log(total, 'ini total bobot')
        setTotalSebelumPembobotan(total)
        setModalSub(true)
      } catch (errorDetailAnggaran) {
        setErrorDetailAnggaran(errorDetailAnggaran);
      } finally {
        setLoadingDetailAnggaran(false);
      }
    };

    fetchData();
  };

  useEffect(() => {
    getDataStunting({ kodeDdn: "", kodeProv: "", tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData });
    getDataStuntingTabel({ tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData });
    // getDataStuntingTabelKabupaten();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProvinsi, setCurrentPageProvinsi] = useState(1);
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

  const indexOfLastItemKabupaten = currentPageKabupaten * itemsPerPage;
  const indexOfFirstItemKabupaten = indexOfLastItemKabupaten - itemsPerPage;

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
    let sortableItems = [...((showNextData ? filteredDataStuntingTabelKabupaten : filteredDataStuntingTabel) || [])];
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
  }, [showNextData ? filteredDataStuntingTabelKabupaten : filteredDataStuntingTabel, sortConfig]);

  const sortedItemsKabupaten = React.useMemo(() => {
    let sortableItems = [...(filteredDataStuntingTabelKabupaten || [])];
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
  }, [filteredDataStuntingTabelKabupaten, sortConfig]);

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
  const currentItemsKabupaten = sortedItemsKabupaten.slice(
    indexOfFirstItemKabupaten,
    indexOfLastItemKabupaten
  );
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
  const totalPages = Math.ceil(((showNextData ? filteredDataStuntingTabelKabupaten?.length : filteredDataStuntingTabel?.length) || 0) / itemsPerPage);
  // const totalPagesKabupaten = Math.ceil(
  //   (filteredDataStuntingTabelKabupaten?.length || 0) / itemsPerPage
  // );
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

  // Determine which icon to show for sorting using Unicode
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "↕"; // Default icon for unsorted
  };

  const [modall, setModall] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalSub, setModalSub] = useState(false);
  const [dataRincianDetail, setDataRincianDetail] = useState(0);
  const [dataRincianDetailSub, setDataRincianDetailSub] = useState(0);
  const [dataRincianDetailSubSub, setDataRincianDetailSubSub] = useState(0);
  const [dataJenisPemda, setDataJenisPemda] = useState("");
  const [dataDetailNamaDaerah, setDataDetailNamaDaerah] = useState("");
  const handleOpen = (
    kodeProv = "",
    namaDaerah = "",
    kodeDdnKab = "",
    kodeDdnProv = "",
    jenisPemda = "",
    rincianDetail = 0
  ) => {
    getDataDetailAnggaran(kodeProv, kodeDdnKab, kodeDdnProv, "", selectedSingleTahunAnggaran, selectedSingleTahunData);

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
  };

  const [namaSubGiat, setNamaSubGiat] = useState("")
  const [namaSro, setNamaSro] = useState("")
  const handleOpenNextModal = (
    kodeDaerah = "",
    kodeSubGiat = "",
    kodeDdnProv = "",
    kodeDdnKab = "",
    rincianDetail = "",
    namaSubGiat = ""
  ) => {
    if (kodeDaerah != "") {
      getDataDetailAnggaran(kodeDaerah, "", "", kodeSubGiat, selectedSingleTahunAnggaran, selectedSingleTahunData);
    } else if (kodeDdnProv != "") {
      getDataDetailAnggaran("", "", kodeDdnProv, kodeSubGiat, selectedSingleTahunAnggaran, selectedSingleTahunData);
    } else if (kodeDdnKab != "") {
      getDataDetailAnggaran("", kodeDdnKab, "", kodeSubGiat, selectedSingleTahunAnggaran, selectedSingleTahunData);
    }

    setDataRincianDetailSub(rincianDetail);
    setNamaSubGiat(namaSubGiat)
    // setModal(true)
  };

  const handleOpenNextModalSub = ({ kodeDdn, kodeSubGiat, kodeSro, tahun, rincianDetail, namaSro }) => {
    getDataDetailAnggaranSubSub({ kodeDdn: kodeDdn, kodeSubGiat: kodeSubGiat, kodeSro: kodeSro, tahun: tahun })
    setNamaSro(namaSro)
    setDataRincianDetailSubSub(rincianDetail)
    setModalSub(true)
  }

  const handleCloseNextModalSub = () => {
    setModalSub(false)
  }

  const handleCloseNextModal = () => {
    setModal(false);
  };

  const handleClose = () => {
    setModall(false); // Close modal by setting modall to false
  };

  const navigate = useNavigate();
  const handleDetailPage = (kodeProv, namaProv) => {
    navigate(`/sipdhub/dapodik/detail-anggaran-dapodik/${kodeProv}`);
  };

  const [searchTerm, setSearchTerm] = useState(""); // State untuk menampung nilai input search
  const [searchTermDetail, setSearchTermDetail] = useState(""); // State untuk menampung nilai input search
  const [searchTermDetailSub, setSearchTermDetailSub] = useState(""); // State untuk menampung nilai input search
  const [searchTermDetailSubSub, setSearchTermDetailSubSub] = useState(""); // State untuk menampung nilai input search
  const handleSearchInput = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    console.log(dataStuntingTabel, 'ini isi data stunting <tabel>   </tabel>')
    if (value === "") {
      if (showNextData) {
        setFilteredDataStuntingTabelKabupaten(dataStuntingTabel)
      } else {
        setFilteredDataStuntingTabel(dataStuntingTabel);
      }
    } else {
      // Filter data berdasarkan input
      const filtered = dataStuntingTabel.filter((item) => {
        if (showNextData) {
          setCurrentPageKabupaten(1)
          return item.nama_kabupaten.toLowerCase().includes(value)
        } else {
          setCurrentPage(1)
          return item.nama_prov.toLowerCase().includes(value)
        }
      }
      );
      showNextData ? (setFilteredDataStuntingTabelKabupaten(filtered)) : (setFilteredDataStuntingTabel(filtered));
    }

  };

  const handleClearSearch = () => {
    showNextData ? setFilteredDataStuntingTabelKabupaten(dataStuntingTabel) : setFilteredDataStuntingTabel(dataStuntingTabel)
    setCurrentPage(1);
    setCurrentPageKabupaten(1);
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

  const handleKeyDown = (e, area) => {
    // if (e.key === "Enter") {
    //   if (area === "kabupaten") {
    //     getDataTabelDapodikKab(e.target.value); // Panggil API ketika tombol ditekan
    //   } else if (area === "provinsi") {
    //     getDataTabelDapodikProv(e.target.value);
    //   } else {
    //     getDataTabelDapodikSeProv(e.target.value);
    //   }
    //   setCurrentPage(1);
    // }
  };

  const [dataShowChartAnggaran, setDataShowChartAnggaran] = useState(false);
  const [dataShowChartFasilitasProvinsi, setShowDataChartFasilitasProvinsi] = useState(false)
  const [dataShowChartFasilitasPemda, setShowDataChartFasilitasPemda] = useState(false)

  const [currentCategoryClicked, setCurrentCategoryClicked] = useState(null)
  const [dataChartDetailFasilitasProvinsi, setDataChartDetailFasilitasProvinsi] = useState([], [], 0, [])
  const [namaDaerahDetail, setNamaDaerahDetail] = useState([], [])
  const [fasilitasShow, setFasilitasShow] = useState("")

  const handleBarClick = (params) => {
    const clickedCategory = params.name
    setFasilitasShow(clickedCategory)
    const dataDetail = (clickedCategory == "Jamban Tidak Layak" ? dataStunting.fasilitas_lingkungan_tidak_sehat_jamban.reduce((acc, item) => {
      acc[0].push(item.jumlah_lingkungan_tdksehat_jamban)
      acc[1].push(item.nama_daerah)
      acc[2] += item.jumlah_lingkungan_tdksehat_jamban;
      acc[3].push(item.kode_ddn)
      return acc
    }, [[], [], 0, []]) : dataStunting.fasilitas_lingkungan_tidak_sehat_air.reduce((acc, item) => {
      acc[0].push(item.jumlah_lingkungan_tdksehat_air)
      acc[1].push(item.nama_daerah)
      acc[2] += item.jumlah_lingkungan_tdksehat_air;
      acc[3].push(item.kode_ddn)
      return acc
    }, [[], [], 0, []]))

    setCurrentCategoryClicked(clickedCategory)
    setDataChartDetailFasilitasProvinsi(dataDetail)
    setShowDataChartFasilitasProvinsi(true)
  };

  const [dataJambanTidakLayakPemda, setDataJambanTidakLayakPemda] = useState([])

  useEffect(() => {
    let dataStuntingFasilitasKesehatan = DEFAULT_FASILITAS_KESEHATAN_DATA;

    const dataDetail = (fasilitasShow == "Jamban Tidak Layak" ? dataStuntingFasilitasKesehatan.data.fasilitas_lingkungan_tidak_sehat_jamban_kabkota.reduce((acc, item) => {
      acc[0].push(item.jumlah_jamban_tidak_layak)
      acc[1].push(item.nama_daerah)
      acc[2] += item.jumlah_jamban_tidak_layak;
      acc[3].push(item.kode_ddn)
      return acc
    }, [[], [], 0, []]) : dataStuntingFasilitasKesehatan.data.fasilitas_lingkungan_tidak_sehat_air_kabkota.reduce((acc, item) => {
      acc[0].push(item.jumlah_jamban_tidak_layak)
      acc[1].push(item.nama_daerah)
      acc[2] += item.jumlah_jamban_tidak_layak;
      acc[3].push(item.kode_ddn)
      return acc
    }, [[], [], 0, []]))

    console.log(dataDetail, 'ini data detail fasilitas kesehatan')
    setDataJambanTidakLayakPemda(dataDetail)

    setShowDataChartFasilitasPemda(true)
  }, [fasilitasShow])

  console.log(DEFAULT_FASILITAS_KESEHATAN_DATA, 'ini default fasilitas kesehatan')
  const getDataFasilitasKesehatanPerProv = ({ kodeProvinsi = "", kodeDdn = "", url = "", tahun, tahunData }) => {
    let dataStuntingFasilitasKesehatan = DEFAULT_FASILITAS_KESEHATAN_DATA;

    // Uncomment di bawah untuk menggunakan API yang sebenarnya
    // const response = await fetch(
    //   `${API_URI_RBAC}/v2${url}`,
    //   requestOptions
    // );
    // if (response.ok) {
    //   dataStuntingFasilitasKesehatan = await response.json();
    // }

    console.log(dataStuntingFasilitasKesehatan, 'ini data fasilitas kesehatan per provinsi')

    // const dataDetail = (fasilitasShow == "Jamban Tidak Layak" ? dataStuntingFasilitasKesehatan.data.fasilitas_lingkungan_tidak_sehat_jamban_kabkota.reduce((acc, item) => {
    //   acc[0].push(item.jumlah_jamban_tidak_layak)
    //   acc[1].push(item.nama_daerah)
    //   acc[2] += item.jumlah_jamban_tidak_layak;
    //   acc[3].push(item.kode_ddn)
    //   return acc
    // }, [[], [], 0, []]) : dataStuntingFasilitasKesehatan.data.fasilitas_lingkungan_tidak_sehat_air_kabkota.reduce((acc, item) => {
    //   acc[0].push(item.jumlah_jamban_tidak_layak)
    //   acc[1].push(item.nama_daerah)
    //   acc[2] += item.jumlah_jamban_tidak_layak;
    //   acc[3].push(item.kode_ddn)
    //   return acc
    // }, [[], [], 0, []]))

    // console.log(dataDetail, 'ini data detail fasilitas kesehatan')
    // setDataJambanTidakLayakPemda(dataDetail)

    // setShowDataChartFasilitasPemda(true)
    // const fetchData = async () => {

    //   try {
    //     const token = JSON.parse(sessionStorage.getItem("authUser"))
    //     const requestOptions = {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
    //       body: JSON.stringify({
    //         kode_provinsi: kodeProvinsi,
    //         tahun: tahun,
    //         tahun_data: tahunData
    //       }),
    //     };

    //     // const response = await fetch(
    //     //   `${API_URI_RBAC}/v2${url}`,
    //     //   requestOptions
    //     // );

    //     let dataStuntingFasilitasKesehatan = DEFAULT_FASILITAS_KESEHATAN_DATA;

    //     // Uncomment di bawah untuk menggunakan API yang sebenarnya
    //     // const response = await fetch(
    //     //   `${API_URI_RBAC}/v2${url}`,
    //     //   requestOptions
    //     // );
    //     // if (response.ok) {
    //     //   dataStuntingFasilitasKesehatan = await response.json();
    //     // }

    //     console.log(dataStuntingFasilitasKesehatan, 'ini data fasilitas kesehatan per provinsi')

    //     const dataDetail = (fasilitasShow == "Jamban Tidak Layak" ? dataStuntingFasilitasKesehatan.data.fasilitas_lingkungan_tidak_sehat_jamban_kabkota.reduce((acc, item) => {
    //       acc[0].push(item.jumlah_jamban_tidak_layak)
    //       acc[1].push(item.nama_daerah)      
    //       acc[2] += item.jumlah_jamban_tidak_layak;
    //       acc[3].push(item.kode_ddn)
    //       return acc
    //     }, [[],[], 0, []]) : dataStuntingFasilitasKesehatan.data.fasilitas_lingkungan_tidak_sehat_air_kabkota.reduce((acc, item) => {
    //       acc[0].push(item.jumlah_jamban_tidak_layak)
    //       acc[1].push(item.nama_daerah)
    //       acc[2] += item.jumlah_jamban_tidak_layak;
    //       acc[3].push(item.kode_ddn)
    //       return acc
    //     }, [[],[], 0, []]))            

    //     console.log(dataDetail, 'ini data detail fasilitas kesehatan')
    //     setDataJambanTidakLayakPemda(dataDetail)

    //     setShowDataChartFasilitasPemda(true)
    //   } catch (errorStunting) {
    //     console.error("Error fetching fasilitas kesehatan data:", errorStunting);
    //     // Gunakan default data jika API error
    //     const dataDetail = (fasilitasShow == "Jamban Tidak Layak" ? DEFAULT_FASILITAS_KESEHATAN_DATA.data.fasilitas_lingkungan_tidak_sehat_jamban_kabkota.reduce((acc, item) => {
    //       acc[0].push(item.jumlah_jamban_tidak_layak)
    //       acc[1].push(item.nama_daerah)      
    //       acc[2] += item.jumlah_jamban_tidak_layak;
    //       acc[3].push(item.kode_ddn)
    //       return acc
    //     }, [[],[], 0, []]) : DEFAULT_FASILITAS_KESEHATAN_DATA.data.fasilitas_lingkungan_tidak_sehat_air_kabkota.reduce((acc, item) => {
    //       acc[0].push(item.jumlah_jamban_tidak_layak)
    //       acc[1].push(item.nama_daerah)
    //       acc[2] += item.jumlah_jamban_tidak_layak;
    //       acc[3].push(item.kode_ddn)
    //       return acc
    //     }, [[],[], 0, []]))

    //     setDataJambanTidakLayakPemda(dataDetail)
    //     setShowDataChartFasilitasPemda(true)
    //     setErrorStunting(errorStunting);
    //   } finally {
    //     setLoadingStunting(false);
    //   }
    // };
    // fetchData();
  };

  const [dataStackedProv, setDataStackedProv] = useState([])
  const [dataShowStackKab, setDataShowStackKab] = useState(false)
  const getDataStackPerProv = ({ kodeProv = "" }) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_prov: kodeProv,
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2/dashboard_stunting_compare_resiko_by_provinsi_onklik`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataStuntingStackProv = await response.json();

        const categoryNamesKab = dataStuntingStackProv.data.compare_resiko_by_provinsi_onklik.reduce((acc, item) => {
          acc[0].push(item.nama_kabupaten);
          acc[1].push(item.nama_provinsi);
          return acc;
        },
          [[], []]
        );

        const resultChartStackedKab = dataStuntingStackProv.data.compare_resiko_by_provinsi_onklik.reduce((acc, item) => {
          acc[0].push(item.jumlah_keluarga_beresiko_stunting)
          acc[1].push(item.jumlah_keluarga_tidak_beresiko_stunting)
          return acc
        }, [[], []]
        )
        console.log(categoryNamesKab, 'ini')
        console.log(resultChartStackedKab, "kkab perbandingan")
        setDataCategoryChartKabupaten(categoryNamesKab);
        setDataBeresikoKabupaten(resultChartStackedKab);

        setDataShowStackKab(true)
      } catch (errorStunting) {
        setErrorStunting(errorStunting);
      } finally {
        setLoadingStunting(false);
      }
    };
    fetchData();
  };

  const [dataShowKesejahteraanStackKab, setDataShowKesejahteraanStackKab] = useState(false)
  const getDataStackPerProvKesejahteraan = ({ kodeProv = "", tahunData }) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_prov: kodeProv,
            tahun_data: tahunData
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2/dashboard_stunting_peringkat_kesejahteraan_kabkota`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataStuntingStackProvKesejahteraan = await response.json();
        setDataShowKesejahteraanStackKab(true)

        const categoryNamesKab = dataStuntingStackProvKesejahteraan.data.reduce((acc, item) => {
          acc[0].push(item.nama_kabupaten);
          return acc;
        },
          [[]]
        );
        console.log(categoryNamesKab, 'ini isi kesejahteran acada')
        setDataCategoryChartKabupatenKesejahteraan(categoryNamesKab);

        const resultChartStackedKab = dataStuntingStackProvKesejahteraan.data.reduce((acc, item) => {
          acc[0].push(item.peringkat_kesejahteraan_1)
          acc[1].push(item.peringkat_kesejahteraan_2)
          acc[2].push(item.peringkat_kesejahteraan_3)
          acc[3].push(item.peringkat_kesejahteraan_4)
          return acc
        }, [[], [], [], []]
        )
        console.log(resultChartStackedKab, 'kab kesejahteraan')
        setDataKabupatenKesejahteraan(resultChartStackedKab);

      } catch (errorStunting) {
        setErrorStunting(errorStunting);
      } finally {
        setLoadingStunting(false);
      }
    };
    fetchData();
  };

  const handleBarClickProv = (data) => {
    if (fasilitasShow == "Jamban Tidak Layak") {
      getDataFasilitasKesehatanPerProv({ kodeDdn: "", kodeProvinsi: data.id, url: "/dashboard_stunting_jamban_kabkota", tahun: selectedSingleTahunAnggaran, tahunData: selectedSingleTahunData })
    } else {
      getDataFasilitasKesehatanPerProv({ kodeDdn: "", kodeProvinsi: data.id, url: "/dashboard_stunting_air_kabkota", tahun: selectedSingleTahunAnggaran, tahunData: selectedSingleTahunData })
    }
  };

  const [titleStack, setTitleStack] = useState("")
  const [titleStackKesejahteraan, setTitleStackKesejahteraan] = useState("")
  const handleBarClickStackProv = (data) => {
    setTitleStack(data.category)
    getDataStackPerProv({ kodeProv: data.id })
  }

  const handleBarClickStackKesejahteraanProv = (data) => {
    setTitleStackKesejahteraan(data.category)
    getDataStackPerProvKesejahteraan({ kodeProv: data.id, tahunData: selectedSingleTahunData })
  }

  const handleBack = () => {
    setShowDataChartFasilitasProvinsi(false)
    setShowDataChartFasilitasPemda(true)

  }

  const [showChartBerisiko, setShowChartBerisiko] = useState(false)

  const [selectedSingleTahunAnggaran, setSelectedSingleTahunAnggaran] = useState('2025'); // Set default value
  const [selectedSingleTahunData, setSelectedSingleTahunData] = useState('2024'); // Set default value

  const handleSelectChangeAnggaran = (e) => {
    const { value } = e.target;
    const newTahunData = (parseInt(value) - 1).toString();
    setSelectedSingleTahunAnggaran(value);
    setSelectedSingleTahunData(newTahunData);
    getDataStunting({ kodeDdn: "", kodeProv: kodeWilayahPeta, tahun: value, tahun_data: newTahunData });
    if (clickDaerah) {
      getDataStuntingTabelKabupaten({ kode_ddn1: kodeWilayahPeta, tahun: value, tahun_data: newTahunData })
    } else {
      getDataStuntingTabel({ tahun: value, tahun_data: newTahunData });
    }
  };

  const handleSelectChangeDataPokok = (e) => {
    const { value } = e.target;
    const newTahunAnggaran = (parseInt(value) + 1).toString();
    setSelectedSingleTahunData(value);
    setSelectedSingleTahunAnggaran(newTahunAnggaran);
    getDataStunting({ kodeDdn: "", kodeProv: kodeWilayahPeta, tahun: newTahunAnggaran, tahun_data: value });
    // getDataStuntingTabel({ tahun: newTahunAnggaran, tahun_data: value });
    if (clickDaerah) {
      getDataStuntingTabelKabupaten({ kode_ddn1: kodeWilayahPeta, tahun: selectedSingleTahunAnggaran, tahun_data: value })
    } else {
      getDataStuntingTabel({ tahun: newTahunAnggaran, tahun_data: value });
    }
    if (dataShowKesejahteraanStackKab) {
      getDataStackPerProvKesejahteraan({ tahunData: value });
    }
  };

  const [clickDaerah, setClickDaerah] = useState(false)
  const [clickNamaDaerah, setClickNamaDaerah] = useState("")
  const [kodeWilayahPeta, setKodeWilayahPeta] = useState("")
  const handleRegionClick = (kodeProv, namaProv) => {
    getDataStunting({ kodeDdn: "", kodeProv: kodeProv, tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData });
    getDataStuntingTabelKabupaten({ kode_ddn1: kodeProv, tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData });
    setKodeWilayahPeta(kodeProv)
    setNamaDaerahDetail(namaProv)
    setClickNamaDaerah(namaProv)
    setClickDaerah(true)
  };

  const handleKabKotaClick = (kodeProv, namaProv) => {
    getDataStunting({ kodeDdn: kodeProv, kodeProv: "", tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData });
    setKodeWilayahPeta(kodeProv)
    setClickNamaDaerah(namaProv)
  };

  const resetRegionClick = () => {
    getDataStunting({ kodeDdn: "", kodeProv: "", tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData });
    getDataStuntingTabel({ tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData })
    setKodeWilayahPeta("")
    setClickDaerah(false)
  }

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

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="card-custom" style={{ borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div className="d-flex justify-content-between align-items-center" style={{ padding: "20px 24px" }}>
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex justify-content-center align-items-center" 
                  style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "12px", 
                    backgroundColor: "#f8f9fa",
                    padding: "8px"
                  }}
                >
                  <img src={logoBkkbn} alt="Logo BKKBN" width="32" height="32" style={{ objectFit: "contain" }} />
                </div>
                <div>
                  <h6 className="mb-0" style={{ fontSize: "15px", fontWeight: 600, color: "#1a1a1a", lineHeight: "1.4" }}>
                    Kementerian Kependudukan dan<br />Pembangunan Keluarga
                  </h6>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <label 
                    htmlFor="tahunData" 
                    style={{ 
                      fontSize: "13px", 
                      fontWeight: 500, 
                      color: "#6c757d",
                      marginBottom: 0,
                      whiteSpace: "nowrap"
                    }}
                  >
                    Tahun Data:
                  </label>
                  <select
                    id="tahunData"
                    name="tahun"
                    className="form-select form-select-sm"
                    style={{
                      padding: "8px 32px 8px 12px",
                      fontSize: "14px",
                      fontWeight: 500,
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      minWidth: "90px",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                    value={selectedSingleTahunData}
                    onChange={handleSelectChangeDataPokok}
                    onMouseEnter={(e) => e.target.style.borderColor = "#0d6efd"}
                    onMouseLeave={(e) => e.target.style.borderColor = "#e0e0e0"}
                  >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <label 
                    htmlFor="tahunAnggaran" 
                    style={{ 
                      fontSize: "13px", 
                      fontWeight: 500, 
                      color: "#6c757d",
                      marginBottom: 0,
                      whiteSpace: "nowrap"
                    }}
                  >
                    Tahun Anggaran:
                  </label>
                  <select
                    id="tahunAnggaran"
                    name="tahun"
                    className="form-select form-select-sm"
                    style={{
                      padding: "8px 32px 8px 12px",
                      fontSize: "14px",
                      fontWeight: 500,
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      minWidth: "90px",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                    value={selectedSingleTahunAnggaran}
                    onChange={handleSelectChangeAnggaran}
                    onMouseEnter={(e) => e.target.style.borderColor = "#0d6efd"}
                    onMouseLeave={(e) => e.target.style.borderColor = "#e0e0e0"}
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      {/* ===== ROW UTAMA ===== */}
      <Row>
        <Col md={dataWidth} id="mapCol">
          <Card className="card-height-100" style={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "none" }}>
            <CardBody style={{ padding: "20px" }}>

              {/* ── Header Controls ── */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>

                {/* Left: Maximize / Nasional buttons */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => { setDataWidth(dataWidth === 6 ? 12 : 6); setRoam(dataWidth === 6); }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      backgroundColor: "#1B6FE8", color: "#fff",
                      padding: "8px 16px", border: "none", borderRadius: "8px",
                      cursor: "pointer", fontSize: "13px", fontWeight: 600,
                    }}
                  >
                    {dataWidth === 6 ? "⛶ Maximize Map" : "⊡ Minimize Map"}
                  </button>

                  {clickDaerah && (
                    <button
                      onClick={() => { resetRegionClick(); setTitleMap("Total Penduduk"); }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        backgroundColor: "transparent", color: "#1B6FE8",
                        padding: "8px 16px", border: "1.5px solid #1B6FE8", borderRadius: "8px",
                        cursor: "pointer", fontSize: "13px", fontWeight: 600,
                      }}
                    >
                      ⌂ Nasional
                    </button>
                  )}
                </div>

                {/* Right: Desil Select */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>
                    Keluarga Berisiko Stunting:
                  </span>
                  <select
                    name="Desil"
                    value={selectedDesil}
                    onChange={handleSelectChange}
                    style={{
                      appearance: "none", background: "#fff",
                      border: "1.5px solid #E2E8F0", borderRadius: "8px",
                      padding: "8px 32px 8px 12px", fontSize: "13px",
                      fontWeight: 600, color: "#0F172A", cursor: "pointer",
                      minWidth: "110px",
                    }}
                  >
                    <option value="1">Desil 1</option>
                    <option value="2">Desil 2</option>
                    <option value="3">Desil 3</option>
                    <option value="4">Desil 4</option>
                    <option value="5">Desil &gt;4</option>
                  </select>
                </div>
              </div>

              {/* ── Map Component ── */}
              <MapIndoChart
                roam={roam} daerah={clickDaerah}
                onKabKotaClick={handleKabKotaClick}
                maxValue={maxValueMap}
                onRegionClick={handleRegionClick}
                valueSeries={valueMap}
                colorData={["#FFCDD2", "#FF9EA7", "#FF7380", "#FF4B5C", "#FF2438", "#FF0017"]}
              />

              <div style={{
                marginTop: "16px",
                padding: "12px 16px",
                backgroundColor: "#f0f9ff",
                borderLeft: "4px solid #0ea5e9",
                borderRadius: "8px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <i className="bx bx-info-circle" style={{
                    fontSize: "18px",
                    color: "#0284c7"
                  }}></i>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#0c4a6e",
                    lineHeight: "1.5"
                  }}>
                    Klik pada peta untuk melihat data detail per provinsi dan kabupaten/kota
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* ===== DATA COLUMN ===== */}
        <Col md={dataWidth}>
          <Card className="card-height-100" style={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "none" }}>
            <CardBody style={{ padding: "20px" }}>

              {/* ── Region Title ── */}
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", textAlign: "center", paddingBottom: "16px", borderBottom: "1px solid #E2E8F0", marginBottom: "16px" }}>
                {clickDaerah ? clickNamaDaerah : "Nasional"}
              </div>

              <Row>
                {/* ─ LEFT: Budget + Tabs ─ */}
                <Col md={6}>
                  <Row className="mb-2">
                    <Col>
                      {/* Total Belanja Nasional */}
                      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <i className="bx bx-cart" style={{ fontSize: "20px", color: "#0EA5E9" }}></i>
                        </div>
                        <div>
                          <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: "4px" }}>Total Belanja Nasional</div>
                          <div style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>
                            <CountUp start={0} end={dataStunting?.total_anggaran_belanja_nasional / 1000000000000}
                              decimals={2} decimal="," separator="." prefix="Rp " suffix=" T" duration={1} />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      {/* Tab Card */}
                      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "14px" }}>
                        {/* Tab Nav */}
                        <div style={{ display: "flex", background: "#F0F4FA", borderRadius: "8px", padding: "3px", gap: "2px", marginBottom: "14px" }}>
                          {[["1", "Penurunan Stunting"], ["2", "Urusan Kesehatan"]].map(([id, label]) => (
                            <button key={id}
                              onClick={() => { toggleCustomBelanja(id); setDataShowChartAnggaran(id === "2"); }}
                              style={{
                                flex: 1, padding: "8px 10px", borderRadius: "6px", border: "none", cursor: "pointer",
                                fontSize: "11px", fontWeight: 600, lineHeight: 1.3, textAlign: "center",
                                background: customActiveTabBelanja === id ? "#fff" : "transparent",
                                color: customActiveTabBelanja === id ? "#1B6FE8" : "#64748B",
                                boxShadow: customActiveTabBelanja === id ? "0 1px 4px rgba(0,0,0,.1)" : "none",
                                transition: "all .15s",
                              }}
                            >{label}</button>
                          ))}
                        </div>

                        {/* Tab Content */}
                        <TabContent activeTab={customActiveTabBelanja} className="text-muted">
                          <TabPane tabId="1">
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <i className="ri-shopping-bag-line" style={{ fontSize: "18px", color: "#F59E0B" }}></i>
                              </div>
                              <div>
                                <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: "4px" }}>Total Belanja Penurunan & Pencegahan Stunting</div>
                                <div style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>
                                  <CountUp start={0} end={dataStunting?.total_anggaran_belanja_kasus_stunting / 1000000000000}
                                    decimals={2} decimal="," separator="." prefix="Rp " suffix=" T" duration={1} />
                                </div>
                              </div>
                            </div>
                          </TabPane>
                          <TabPane tabId="2">
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <i className="ri-shopping-bag-line" style={{ fontSize: "18px", color: "#F59E0B" }}></i>
                              </div>
                              <div>
                                <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: "4px" }}>Total Belanja Bidang Urusan Kesehatan</div>
                                <div style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>
                                  <CountUp start={0} end={dataStunting?.total_anggaran_belanja_urusan_kesehatan / 1000000000000}
                                    decimals={2} decimal="," separator="." prefix="Rp " suffix=" T" duration={1} />
                                </div>
                              </div>
                            </div>
                          </TabPane>
                        </TabContent>
                      </div>
                    </Col>
                  </Row>
                </Col>

                {/* ─ RIGHT: Pie Chart ─ */}
                <Col md={6} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {dataShowChartAnggaran ? (
                    <PieChartNew
                      dataChart={dataChartPerbandinganAnggaranKesehatan}
                      dataColors={'["#2DAED4","#FCAD24"]'}
                      categoryName={["Bidang Urusan di Luar Kesehatan", "Bidang Urusan Kesehatan"]}
                      showLegend={false} percentOnly={true} pieChart={false}
                    />
                  ) : (
                    <PieChartNew
                      dataChart={dataChartPerbandinganAnggaranStunting}
                      dataColors={'["#2DAED4","#FCAD24"]'}
                      categoryName={["Anggaran Untuk Lainnya", "Anggaran Penurunan dan Pencegahan Stunting"]}
                      pieChart={false} showLegend={false} percentOnly={true}
                    />
                  )}
                </Col>
              </Row>

              {/* ── Divider ── */}
              <hr style={{ margin: "16px 0", borderColor: "#E2E8F0", borderWidth: "1px 0 0" }} />

              {/* ── Family Stats Toggle ── */}
              {showChartBerisiko ? (
                <>
                  <PieChartNew
                    dataChart={dataChartPerbandinganKeluargaStunting}
                    categoryName={["Keluarga Tidak Berisiko Stunting", "Keluarga Berisiko Stunting"]}
                    dataColors={'["#57E7B4","#2DAED4"]'}
                  />
                  <div style={{ textAlign: "center", padding: "4px 0" }}>
                    <span onClick={() => setShowChartBerisiko(false)}
                      style={{ cursor: "pointer", color: "#1B6FE8", fontSize: "12px", fontWeight: 600 }}>
                      ← Lihat Nilai
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Row className="mb-2">
                    <Col md={12}>
                      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#EBF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <i className="mdi mdi-human-male-female-child" style={{ fontSize: "20px", color: "#1B6FE8" }}></i>
                        </div>
                        <div>
                          <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: "4px" }}>Jumlah Keluarga</div>
                          <div style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>
                            <CountUp start={0} end={dataStunting.jumlah_keluarga} separator="." duration={1} />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    {[
                      { label: "Keluarga Sasaran", value: dataStunting.jumlah_keluarga_sasaran, icon: "mdi mdi-human-male-female-child", bg: "#E0F2FE", color: "#0EA5E9", key: "sasaran" },
                      { label: "Keluarga Berisiko Stunting", value: dataStunting.jumlah_keluarga_stunting, icon: "mdi mdi-human-male-female-child", bg: "#FFEBEE", color: "#E53935", key: "stunting" },
                    ].map(({ label, value, icon, bg, color, key }) => (
                      <Col md={6} key={key}>
                        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <i className={icon} style={{ fontSize: "18px", color }}></i>
                          </div>
                          <div>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: "4px" }}>{label}</div>
                            <div style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>
                              <CountUp start={0} end={value} separator="." duration={1} />
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <div style={{ textAlign: "center", padding: "4px 0" }}>
                    <span onClick={() => setShowChartBerisiko(true)}
                      style={{ cursor: "pointer", color: "#1B6FE8", fontSize: "12px", fontWeight: 600 }}>
                      Lihat Grafik Perbandingan →
                    </span>
                  </div>
                </>
              )}

              {/* ── Divider ── */}
              <hr style={{ margin: "5px 0", borderColor: "#E2E8F0", borderWidth: "1px 0 0" }} />

              {/* ── PUS & KB ── */}
              <Row>
                {[
                  { label: "Bukan Peserta KB Modern", value: dataStunting?.peserta_kb_modern ?? 0, icon: "ri-women-line", bg: "#ECFDF5", color: "#10B981", key: "kb" },
                  { label: "Jumlah PUS", value: dataStunting?.jumlah_pus ?? 0, icon: "ri-user-line", bg: "#FFFBEB", color: "#F59E0B", key: "pus" },
                ].map(({ label, value, icon, bg, color, key }) => (
                  <Col md={6} key={key}>
                    <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className={icon} style={{ fontSize: "18px", color }}></i>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: "4px" }}>{label}</div>
                        <div style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>
                          {value.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "none" }}>
            <CardBody style={{ padding: "24px" }}>
              <div className="nav-beranda">
                <Nav
                  tabs
                  className="nav nav-tabs mb-4"
                  style={{ borderBottom: "2px solid #f0f0f0" }}
                >
                  <NavItem>
                    <NavLink
                      style={{ 
                        cursor: "pointer",
                        padding: "12px 24px",
                        fontWeight: 600,
                        fontSize: "15px",
                        border: "none",
                        borderBottom: "3px solid transparent",
                        color: "#6c757d",
                        transition: "all 0.3s ease"
                      }}
                      className={classnames({
                        active: customActiveTabTabelDaerah === "1",
                      })}
                      onClick={() => {
                        toggleCustomTabelDaerah("1");
                      }}
                    >
                      {dataKolomNamaDaerah == "Se-Provinsi" ? "NASIONAL" : `Se-${namaDaerahDetail}`}
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent
                activeTab={customActiveTabTabelDaerah}
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
                  {showNextData ? (
                    <>
                      <button
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
                        onClick={() => { getDataStuntingTabel({ tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData }); setSearchTerm(""); resetRegionClick() }}
                      >
                        Kembali ke Provinsi
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                  <div style={{ overflowX: "auto" }}>
                    <table
                      className="table table-bordered table-nowrap align-middle mb-0 custom-table"
                      style={{ width: "100%" }}
                    >
                      <thead className="table-light">
                        <tr>
                          <th
                            rowSpan="4"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            NO
                          </th>
                          <th
                            rowSpan="4"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              dataKolomNamaDaerah == "Se-Provinsi"
                                ? requestSort("kode_prov")
                                : requestSort("kode_ddn1")
                            }
                          >
                            {dataKolomNamaDaerah}{" "}
                            {dataKolomNamaDaerah == "Se-Provinsi"
                              ? getSortIcon("kode_prov")
                              : getSortIcon("kode_ddn1")}
                          </th>
                          <th
                            rowSpan="4"
                            style={{
                              textAlign: "center",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("jumlah_keluarga")}
                          >
                            JUMLAH KELUARGA {getSortIcon("jumlah_keluarga")}
                          </th>
                          <th
                            rowSpan="4"
                            style={{
                              textAlign: "center",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              requestSort("jumlah_keluarga_sasaran")
                            }
                          >
                            JUMLAH KELUARGA SASARAN{" "}
                            {getSortIcon("jumlah_keluarga_sasaran")}
                          </th>
                        </tr>
                        <tr>
                          <th
                            colSpan="7"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                          >
                            KATEGORI KELUARGA BERISIKO STUNTING
                          </th>
                          <th
                            rowSpan="4"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("total_anggaran")}
                          >
                            PERSENTASE KELUARGA BERISIKO STUNTING{" "}
                            {getSortIcon("total_anggaran")}
                          </th>
                          <th
                            rowSpan="4"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("total_anggaran")}
                          >
                            TOTAL ANGGARAN (Rp){" "}
                            {getSortIcon("total_anggaran")}
                          </th>
                          <th
                            rowSpan="4"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("total_anggaran_stunting")}
                          >
                            TOTAL ANGGARAN STUNTING (Rp){" "}
                            {getSortIcon("total_anggaran_stunting")}
                          </th>
                          <th
                            rowSpan="4"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("persentase_anggaran")}
                          >
                            PERSENTASE{" "}
                            {getSortIcon("persentase_anggaran")}
                          </th>
                          <th
                            rowSpan="4"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("realisasi")}
                          >
                            Realisasi{" "}
                            {getSortIcon("realisasi")}
                          </th>


                          {dataKolomNamaDaerah == "Se-Provinsi" ? (<></>) : (<><th
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
                            DETAIL ANGGARAN STUNTING
                          </th></>)}
                        </tr>
                        <tr>
                          <th
                            colSpan="6"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                          >
                            RISIKO
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              requestSort(
                                "jumlah_keluarga_tidak_beresiko_stunting"
                              )
                            }
                          >
                            TIDAK BERISIKO{" "}
                            {getSortIcon(
                              "jumlah_keluarga_tidak_beresiko_stunting"
                            )}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              requestSort("peringkat_kesejahteraan_1")
                            }
                          >
                            DESIL 1{" "}
                            {getSortIcon("peringkat_kesejahteraan_1")}
                          </th>
                          <th
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              requestSort("peringkat_kesejahteraan_2")
                            }
                          >
                            DESIL 2{" "}
                            {getSortIcon("peringkat_kesejahteraan_2")}
                          </th>
                          <th
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              requestSort("peringkat_kesejahteraan_3")
                            }
                          >
                            DESIL 3{" "}
                            {getSortIcon("peringkat_kesejahteraan_3")}
                          </th>
                          <th
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              requestSort("peringkat_kesejahteraan_4")
                            }
                          >
                            DESIL 4{" "}
                            {getSortIcon("peringkat_kesejahteraan_4")}
                          </th>
                          <th
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              requestSort("peringkat_kesejahteraan_diatas_4")
                            }
                          >
                            DESIL &gt;4{" "}
                            {getSortIcon("peringkat_kesejahteraan_diatas_4")}
                          </th>
                          <th
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              maxWidth: "150px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort("total_kesejahteraan")}
                          >
                            TOTAL {getSortIcon("total_kesejahteraan")}
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ minHeight: "500px" }}>
                        {currentItems.map((item, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {indexOfFirstItem + index + 1}
                            </td>
                            <td
                              className={showNextData ? "" : "click-data"}
                              style={{ minWidth: "270px" }}
                              onClick={(e) => {
                                setIdDaerah(item.kode_prov);
                                getDataStuntingTabelKabupaten({
                                  kode_ddn1: item.kode_prov,
                                  tahun: selectedSingleTahunAnggaran,
                                  tahun_data: selectedSingleTahunData
                                }),
                                  dataKolomNamaDaerah == "Se-Provinsi" ? setNamaDaerahDetail(item.nama_prov) : ""; setSearchTerm("")
                              }
                              }
                            >
                              {item.nama_kabupaten ? item.nama_kabupaten.replace("Provinsi ", "") || "-"
                                : item.nama_prov.replace("Provinsi ", "") || "-"}
                            </td>
                            <td>
                              {item.jumlah_keluarga
                                ? parseInt(item.jumlah_keluarga).toLocaleString(
                                  "id-ID"
                                )
                                : "-"}
                            </td>
                            <td>
                              {item.jumlah_keluarga_sasaran
                                ? parseInt(
                                  item.jumlah_keluarga_sasaran
                                ).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              {item.peringkat_kesejahteraan_1
                                ? parseInt(
                                  item.peringkat_kesejahteraan_1
                                ).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              {item.peringkat_kesejahteraan_2
                                ? parseInt(
                                  item.peringkat_kesejahteraan_2
                                ).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              {item.peringkat_kesejahteraan_3
                                ? parseInt(
                                  item.peringkat_kesejahteraan_3
                                ).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              {item.peringkat_kesejahteraan_4
                                ? parseInt(
                                  item.peringkat_kesejahteraan_4
                                ).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              {item.peringkat_kesejahteraan_diatas_4
                                ? parseInt(
                                  item.peringkat_kesejahteraan_diatas_4
                                ).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              {item.total_kesejahteraan
                                ? parseInt(
                                  item.total_kesejahteraan
                                ).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              {item.jumlah_keluarga_tidak_beresiko_stunting
                                ? parseInt(
                                  item.jumlah_keluarga_tidak_beresiko_stunting
                                ).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {isNaN(item.total_kesejahteraan / item.jumlah_keluarga_sasaran)
                                  ? "-"
                                  : `${(((item.total_kesejahteraan / item.jumlah_keluarga_sasaran) * 100) ?? 0)?.toLocaleString("id-ID", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}%`}
                              </span>
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {item.total_anggaran
                                  ? parseInt(item.total_anggaran).toLocaleString(
                                    "id-ID"
                                  )
                                  : "-"}
                              </span>
                            </td>
                            <td>
                              <span style={{ float: "right" }}>
                                {item.total_anggaran_stunting
                                  ? parseInt(item.total_anggaran_stunting).toLocaleString(
                                    "id-ID"
                                  )
                                  : "-"}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {`${(item.persentase_anggaran ?? 0)?.toLocaleString("id-ID",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}%`}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {item.realisasi ? parseInt(item.realisasi).toLocaleString(
                                "id-ID"
                              )
                                : "-"}

                            </td>

                            {dataKolomNamaDaerah == "Se-Provinsi" ? (<></>) : (<><td style={{ textAlign: "center" }}>
                              {/* <button style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }} onClick={()=>handleOpen("", item.nama_provinsi, item.kode_provinsi, "", "prov", item.totalanggaran)}>Lihat Detail</button>                            */}
                              <i
                                style={{
                                  padding: "5px 10px",
                                  cursor: "pointer",
                                  fontSize: "30px",
                                }}
                                onClick={() =>
                                  dataKolomNamaDaerah == "Se-Provinsi"
                                    ? handleOpen(
                                      "",
                                      item.nama_provinsi,
                                      item.kode_provinsi,
                                      "",
                                      "prov",
                                      item.total_anggaran_stunting
                                    )
                                    : handleOpen(
                                      "",
                                      item.nama_kabupaten,
                                      item.kode_ddn1,
                                      "",
                                      "kab",
                                      item.total_anggaran_stunting
                                    )
                                }
                                className="bx bx-list-ul text-primary"
                              ></i>
                            </td>  </>)}

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
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "none" }}>
            <CardBody style={{ padding: "24px" }}>
              <div className="nav-beranda">
                <Nav
                  tabs
                  className="nav nav-tabs mb-4"
                  style={{ 
                    borderBottom: "2px solid #f0f0f0",
                    flexWrap: "wrap",
                    gap: "8px"
                  }}
                >
                  <NavItem>
                    <NavLink
                      style={{ 
                        cursor: "pointer",
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        borderBottom: "3px solid transparent",
                        color: "#6c757d",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap"
                      }}
                      className={classnames({
                        active: customActiveTabAll === "1",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("1");
                      }}
                    >
                      Anggaran Pemerintah
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ 
                        cursor: "pointer",
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        borderBottom: "3px solid transparent",
                        color: "#6c757d",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap"
                      }}
                      className={classnames({
                        active: customActiveTabAll === "4",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("4");
                      }}
                    >
                      Anggaran SPM
                    </NavLink>
                  </NavItem>
                  {/* <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "2",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("2");
                      }}
                    >
                      Perbandingan Total Keluarga Berisiko Stunting Berdasarkan
                      Total Keluarga Sasaran
                    </NavLink>
                  </NavItem> */}
                  <NavItem>
                    <NavLink
                      style={{ 
                        cursor: "pointer",
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        borderBottom: "3px solid transparent",
                        color: "#6c757d",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap"
                      }}
                      className={classnames({
                        active: customActiveTabAll === "3",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("3");
                      }}
                    >
                      Perbandingan Risiko
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ 
                        cursor: "pointer",
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        borderBottom: "3px solid transparent",
                        color: "#6c757d",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap"
                      }}
                      className={classnames({
                        active: customActiveTabAll === "5",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("5");
                      }}
                    >
                      Peringkat Kesejahteraan
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ 
                        cursor: "pointer",
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        borderBottom: "3px solid transparent",
                        color: "#6c757d",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap"
                      }}
                      className={classnames({
                        active: customActiveTabAll === "6",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("6");
                      }}
                    >
                      Usia Anak & PUS
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ 
                        cursor: "pointer",
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        borderBottom: "3px solid transparent",
                        color: "#6c757d",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap"
                      }}
                      className={classnames({
                        active: customActiveTabAll === "9",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("9");
                      }}
                    >
                      PUS 4T
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ 
                        cursor: "pointer",
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        borderBottom: "3px solid transparent",
                        color: "#6c757d",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap"
                      }}
                      className={classnames({
                        active: customActiveTabAll === "7",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("7");
                      }}
                    >
                      Fasilitas Lingkungan
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ 
                        cursor: "pointer",
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        borderBottom: "3px solid transparent",
                        color: "#6c757d",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap"
                      }}
                      className={classnames({
                        active: customActiveTabAll === "8",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("8");
                      }}
                    >
                      Grafik Alokasi
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={customActiveTabAll} className="text-muted">
                <TabPane tabId="1">
                  <HorizontalBarChart
                    dataZoom={true}
                    dataTotal={5}
                    breakWord={true}
                    dataColors='["#FCAD24"]'
                    trillion={true}
                    valueChart={dataChartTopUrusan[0]}
                    categoryChart={dataChartTopUrusan[1]}
                  />
                </TabPane>


                <TabPane tabId="2">
                  <div className="separator mb-5">
                    <h4 className="card-title ">
                      Perbandingan Total Keluarga Berisiko Stunting Berdasarkan
                      Total Keluarga Sasaran
                    </h4>
                  </div>
                  <PieChartNew
                    dataChart={dataChartPerbandinganKeluargaStunting}
                    categoryName={[
                      "Keluarga Tidak Berisiko Stunting",
                      "Keluarga Berisiko Stunting",
                    ]}
                    dataColors={'["#57E7B4", "#2DAED4"]'}
                  />
                </TabPane>
                <TabPane tabId="3">
                  <div style={{ 
                    padding: "20px 24px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "12px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{ 
                      fontSize: "16px", 
                      fontWeight: 600, 
                      color: "#1a1a1a",
                      margin: 0
                    }}>
                      Perbandingan Keluarga Sasaran yang Berisiko dan Tidak Berisiko Stunting
                      {titleStack && <span style={{ color: "#0d6efd" }}> - Provinsi {titleStack}</span>}
                    </h4>
                  </div>

                  {dataShowStackKab ? (<>
                    <button
                      style={{
                        backgroundColor: "#0d6efd",
                        color: "white",
                        padding: "11px 20px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(13,110,253,0.2)",
                        marginBottom: "16px"
                      }}
                      onClick={() => { setDataShowStackKab(false); setTitleStack("") }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#0b5ed7";
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 4px 8px rgba(13,110,253,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#0d6efd";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 4px rgba(13,110,253,0.2)";
                      }}
                    >
                      <i className="bx bx-arrow-back" style={{ fontSize: "16px" }} />
                      Kembali
                    </button>
                    <StackedBarChart
                      dataTotal={10}
                      dataZoom={true}
                      breakWord={true}
                      // kabupaten={true}
                      // namaProv={dataCategoryChartKabupaten[1]}
                      dataColors='["#2DAED4", "#57E7B4"]'
                      valueCharts={dataBeresikoKabupaten}
                      legendNames={["Berisiko", "Tidak Berisiko"]}
                      categoryChart={dataCategoryChartKabupaten[0]}
                    /></>) : (<><StackedBarChart
                      dataTotal={10}
                      dataZoom={true}
                      breakWord={true}
                      dataColors='["#2DAED4", "#57E7B4"]'
                      valueCharts={dataBeresikoProvinsi}
                      idParam={dataCategoryChartProvinsi[1]}
                      categoryChart={dataCategoryChartProvinsi[0]}
                      legendNames={["Berisiko", "Tidak Berisiko"]}
                      onBarClickProv={handleBarClickStackProv}
                    /></>)}

                </TabPane>
                <TabPane tabId="4">
                  <div style={{ 
                    padding: "20px 24px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "12px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{ 
                      fontSize: "16px", 
                      fontWeight: 600, 
                      color: "#1a1a1a",
                      margin: 0,
                      textTransform: "uppercase"
                    }}>
                      Anggaran SPM untuk Penurunan dan Pencegahan Stunting
                    </h4>
                  </div>
                  <Row>
                    <Col md={4}>
                      <Card style={{ 
                        borderRadius: "12px", 
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        border: "none",
                        marginTop: "16px"
                      }}>
                        <CardBody style={{ padding: "24px" }}>
                          <div className="d-flex flex-column">
                            <div className="mb-3">
                              <span style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#6c757d",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                              }}>
                                Total SPM
                              </span>
                            </div>
                            <div>
                              <span style={{
                                fontSize: "28px",
                                fontWeight: 700,
                                color: "#1a1a1a"
                              }}>
                                <CountUp
                                  start={0}
                                  end={
                                    dataStunting?.pie_spm_stunting?.jml_rincian_total_anggaran_spm_stunting / 1000000000000
                                  }
                                  decimals={2}
                                  decimal=","
                                  separator="."
                                  prefix="Rp "
                                  suffix=" T"
                                  duration={1}
                                />
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                      <PieChartNew
                        dataChart={dataChartPerbandinganSpm}
                        dataColors={'["#FCAD24","#2DAED4"]'}
                        categoryName={[
                          "Anggaran Stunting yang termasuk ke dalam SPM",
                          "Anggaran Stunting di Luar SPM",
                        ]}
                        fitContent={true}
                        pieChart={false}
                        showLegend={true}
                        percentOnly={true}
                      />
                    </Col>
                    <Col md={8}>
                      <HorizontalBarChart
                        dataColors='["#FCAD24"]'
                        trillion={true}
                        breakWord={true}
                        valueChart={dataChartSpmStunting[0]}
                        categoryChart={dataChartSpmStunting[1]}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="5">
                  <div style={{ 
                    padding: "20px 24px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "12px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{ 
                      fontSize: "16px", 
                      fontWeight: 600, 
                      color: "#1a1a1a",
                      margin: 0,
                      textTransform: "uppercase"
                    }}>
                      Keluarga Sasaran Menurut Peringkat Kesejahteraan
                    </h4>
                  </div>
                  {/* <TabPane tabId="1" id="provinsi"> */}
                  {dataShowKesejahteraanStackKab ? (<>
                    <button
                      style={{
                        backgroundColor: "#0d6efd",
                        color: "white",
                        padding: "11px 20px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(13,110,253,0.2)",
                        marginBottom: "16px"
                      }}
                      onClick={() => { setDataShowKesejahteraanStackKab(false); setTitleStack("") }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#0b5ed7";
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 4px 8px rgba(13,110,253,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#0d6efd";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 4px rgba(13,110,253,0.2)";
                      }}
                    >
                      <i className="bx bx-arrow-back" style={{ fontSize: "16px" }} />
                      Kembali
                    </button>
                    <StackedBarChart
                      dataTotal={10}
                      dataZoom={true}
                      breakWord={true}
                      dataColors='["#695FF3", "#63A9ED", "#5BE9F3", "#99FFE7"]'
                      valueCharts={dataKabupatenKesejahteraan}
                      categoryChart={dataCategoryChartKabupatenKesejahteraan[0]}
                      legendNames={[
                        "Kesejahteraan 1",
                        "Kesejahteraan 2",
                        "Kesejahteraan 3",
                        "Kesejahteraan 4",
                      ]}
                    />
                  </>) : (<><StackedBarChart
                    dataTotal={10}
                    dataZoom={true}
                    breakWord={true}
                    dataColors='["#695FF3", "#63A9ED", "#5BE9F3", "#99FFE7"]'
                    valueCharts={dataChartKesejahteraanStacked}
                    onBarClickProv={handleBarClickStackKesejahteraanProv}
                    categoryChart={dataChartCategoryKesejahteraan[0]}
                    idParam={dataChartCategoryKesejahteraan[1]}
                    legendNames={[
                      "Kesejahteraan 1",
                      "Kesejahteraan 2",
                      "Kesejahteraan 3",
                      "Kesejahteraan 4",
                    ]}
                  /></>)}
                </TabPane>
                <TabPane tabId="6">
                  <div style={{ 
                    padding: "20px 24px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "12px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{ 
                      fontSize: "16px", 
                      fontWeight: 600, 
                      color: "#1a1a1a",
                      margin: 0,
                      textTransform: "uppercase"
                    }}>
                      Keluarga Sasaran Menurut Usia Anak dan Pasangan Usia Subur (PUS)
                    </h4>
                  </div>
                  <ColBarChart
                    valueChart={dataChartPus[1]}
                    categoryChart={dataChartPus[0]}
                    seriesName={["Baduta", "Balita", "Pus Hamil"]}
                    dataColors='["#57E7B4","#2DAED4", "#FFB7F1"]'
                  />
                </TabPane>
                <TabPane tabId="9">
                  <div style={{ 
                    padding: "20px 24px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "12px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{ 
                      fontSize: "16px", 
                      fontWeight: 600, 
                      color: "#1a1a1a",
                      margin: 0,
                      textTransform: "uppercase"
                    }}>
                      Pasangan Usia Subur (PUS) 4T
                    </h4>
                  </div>
                  <VerticalBarChart
                    valueChart={dataChartPus4Terlalu[0]}
                    categoryChart={['Terlalu Banyak', 'Terlalu Dekat', 'Terlalu Muda', 'Terlalu Tua']}
                    dataColors='["#57E7B4"]'
                  />
                </TabPane>
                <TabPane tabId="7">
                  <div style={{ 
                    padding: "20px 24px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "12px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{ 
                      fontSize: "16px", 
                      fontWeight: 600, 
                      color: "#1a1a1a",
                      margin: 0,
                      textTransform: "uppercase"
                    }}>
                      Fasilitas Lingkungan Tidak Sehat
                    </h4>
                  </div>
                  {dataShowChartFasilitasProvinsi ? dataShowChartFasilitasPemda ? (<>
                    <button
                      style={{
                        backgroundColor: "#0d6efd",
                        color: "white",
                        padding: "11px 20px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(13,110,253,0.2)",
                        marginBottom: "16px"
                      }}
                      onClick={() => setShowDataChartFasilitasPemda(false)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#0b5ed7";
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 4px 8px rgba(13,110,253,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#0d6efd";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 4px rgba(13,110,253,0.2)";
                      }}
                    >
                      <i className="bx bx-arrow-back" style={{ fontSize: "16px" }} />
                      Kembali
                    </button>
                    <Row>
                      <Col md={3}>
                        <Card style={{ 
                          borderRadius: "12px", 
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          border: "none",
                          marginTop: "16px",
                          marginBottom: 0
                        }}>
                          <CardBody style={{ padding: "24px" }}>
                            <div className="d-flex flex-column">
                              <div className="mb-3">
                                <span style={{
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: "#6c757d",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px"
                                }}>
                                  {currentCategoryClicked == "Jamban Tidak Layak" ? "Total Jamban Tidak Layak" : "Total Air Tidak Layak"}
                                </span>
                              </div>
                              <div>
                                <span style={{
                                  fontSize: "28px",
                                  fontWeight: 700,
                                  color: "#1a1a1a"
                                }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataJambanTidakLayakPemda[2]
                                    }
                                    separator="."
                                    suffix=""
                                    duration={1}
                                  />
                                </span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md={9}>
                        <HorizontalBarChart
                          dataColors={currentCategoryClicked == "Jamban Tidak Layak" ? '["#FCAD24"]' : '["#FCAD248B"]'}
                          valueChart={dataJambanTidakLayakPemda[0]}
                          categoryChart={dataJambanTidakLayakPemda[1]}
                          idParam={dataJambanTidakLayakPemda[3]}
                          dataZoom={true}
                          breakWord={true}
                        />
                      </Col>
                    </Row>
                  </>) : (<><button
                    style={{
                      backgroundColor: "#0d6efd",
                      color: "white",
                      padding: "11px 20px",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 500,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 4px rgba(13,110,253,0.2)",
                      marginBottom: "16px"
                    }}
                    onClick={handleBack}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#0b5ed7";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 4px 8px rgba(13,110,253,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#0d6efd";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 4px rgba(13,110,253,0.2)";
                    }}
                  >
                    <i className="bx bx-arrow-back" style={{ fontSize: "16px" }} />
                    Kembali
                  </button>
                    <Row>
                      <Col md={3}>
                        <Card style={{ 
                          borderRadius: "12px", 
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          border: "none",
                          marginTop: "16px",
                          marginBottom: 0
                        }}>
                          <CardBody style={{ padding: "24px" }}>
                            <div className="d-flex flex-column">
                              <div className="mb-3">
                                <span style={{
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: "#6c757d",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px"
                                }}>
                                  {currentCategoryClicked == "Jamban Tidak Layak" ? "Total Jamban Tidak Layak" : "Total Air Tidak Layak"}
                                </span>
                              </div>
                              <div>
                                <span style={{
                                  fontSize: "28px",
                                  fontWeight: 700,
                                  color: "#1a1a1a"
                                }}>
                                  <CountUp
                                    start={0}
                                    end={
                                      dataChartDetailFasilitasProvinsi[2]
                                    }
                                    separator="."
                                    suffix=""
                                    duration={1}
                                  />
                                </span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md={9}>
                        <HorizontalBarChart
                          dataColors={currentCategoryClicked == "Jamban Tidak Layak" ? '["#FCAD24"]' : '["#FCAD248B"]'}
                          valueChart={dataChartDetailFasilitasProvinsi[0]}
                          categoryChart={dataChartDetailFasilitasProvinsi[1]}
                          idParam={dataChartDetailFasilitasProvinsi[3]}
                          dataZoom={true}
                          breakWord={true}
                          onBarClickProv={handleBarClickProv}
                        />
                      </Col>
                    </Row>
                  </>) : (<>
                    <HorizontalBarChart
                      onBarClick={handleBarClick}
                      dataColors='["#FCAD24", "#FCAD248B"]'
                      valueChart={dataChartFasilitasTidakSehat}
                      fasilitasLingkungan={true}
                      categoryChart={["Jamban Tidak Layak", "Air Tidak Layak"]}
                    /></>)}
                </TabPane>
                <TabPane tabId="8">
                  <div style={{ 
                    padding: "20px 24px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "12px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{ 
                      fontSize: "16px", 
                      fontWeight: 600, 
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: "1.5"
                    }}>
                      Persentase Anggaran Pencegahan dan Penurunan Stunting Dibandingkan dengan Persentase Keluarga Sasaran yang Berisiko Stunting
                    </h4>
                  </div>

                  <div className="nav-beranda">
                    <Nav
                      tabs
                      className="nav nav-tabs mb-4"
                      style={{ 
                        borderBottom: "2px solid #f0f0f0",
                        gap: "8px"
                      }}
                    >
                      <NavItem>
                        <NavLink
                          style={{ 
                            cursor: "pointer",
                            padding: "10px 20px",
                            fontWeight: 600,
                            fontSize: "14px",
                            border: "none",
                            borderBottom: "3px solid transparent",
                            color: "#6c757d",
                            transition: "all 0.3s ease",
                            borderRadius: "8px 8px 0 0"
                          }}
                          className={classnames({
                            active: customActiveTabChartAnggaran === "2",
                          })}
                          onClick={() => {
                            toggleCustomChartAnggaran("2");
                          }}
                        >
                          Provinsi
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ 
                            cursor: "pointer",
                            padding: "10px 20px",
                            fontWeight: 600,
                            fontSize: "14px",
                            border: "none",
                            borderBottom: "3px solid transparent",
                            color: "#6c757d",
                            transition: "all 0.3s ease",
                            borderRadius: "8px 8px 0 0"
                          }}
                          className={classnames({
                            active: customActiveTabChartAnggaran === "3",
                          })}
                          onClick={() => {
                            toggleCustomChartAnggaran("3");
                          }}
                        >
                          Kabupaten/Kota
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTabChartAnggaran}
                    className="text-muted"
                  >
                    {/* <TabPane tabId="1" id="nasional">
                    </TabPane> */}
                    <TabPane tabId="2" id="provinsi">
                      <BarWithPercentageModifiedStunting
                        valueChart={dataChartRincianStuntingProvinsi[3]}
                        categoryChart={dataChartRincianStuntingProvinsi[0]}
                        percentageChart1={dataChartRincianStuntingProvinsi[1]}
                        percentageChart2={dataChartRincianStuntingProvinsi[2]}
                        axisY={["Total Anggaran", "Persentase"]}
                        additionalData={dataChartRincianStuntingProvinsi[4]}
                        dataColors='["#090909", "#2DAED4"]'
                        dataTotal={10}
                      />
                    </TabPane>
                    <TabPane tabId="3" id="pronvisi">
                      <BarWithPercentageModifiedStunting
                        valueChart={dataChartRincianStuntingKabupaten[3]}
                        categoryChart={dataChartRincianStuntingKabupaten[0]}
                        percentageChart1={dataChartRincianStuntingKabupaten[1]}
                        percentageChart2={dataChartRincianStuntingKabupaten[2]}
                        axisY={["Total Anggaran", "Persentase"]}
                        additionalData={dataChartRincianStuntingKabupaten[4]}
                        dataColors='["#090909", "#2DAED4"]'
                        kabupaten={true}
                        dataTotal={10}
                      />
                    </TabPane>
                  </TabContent>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ini */}
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
                Badan Kependudukan dan Keluarga Berencana Nasional (BKKBN)
              </span>
            </div>
            <div
              style={{
                fontSize: "12px" /* Ukuran font lebih kecil */,
                color: "#555",
                fontStyle: "italic" /* Menambahkan gaya italic */,
              }}
            >
              Update Data: 13 Juni 2024
            </div>
          </div>
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
            Detail Anggaran Stunting{" "}
            {/* {dataJenisPemda == "kab" ? "Kabupaten/Kota" : "Provinsi"} */}
            {dataDetailNamaDaerah == "Aceh" ? "Provinsi Aceh" : dataDetailNamaDaerah}
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
                {dataDetailHighlight.map((item, index) => (
                  <div className="d-flex mb-3" key={index}>
                    <div style={{ flexBasis: "350px", color: "#929FB1" }}>{item.nama_rekening}</div>
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
                    {((item.anggaran / dataRincianDetail) * 100) >= 1 ? <>
                      <div>
                        (<CountUp
                          start={0}
                          end={(item.anggaran / dataRincianDetail) * 100}
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
                          end={(item.anggaran / dataRincianDetail) * 100}
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
                      onClick={() => requestSort("realisasi")}
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                      }}
                    >
                      Realisasi {getSortIcon("realisasi")}
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
                      <td>{item.realisasi}</td>


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
                    <th
                      onClick={() => requestSort("realisasi")}
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                      }}
                    >
                      Realisasi {getSortIcon("realisasi")}
                    </th>

                    <th style={{ verticalAlign: "middle", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word", maxWidth: "100px" }}>
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
                      <td>
                        <span style={{ float: "right" }}>
                          {item.realisasi}
                        </span>
                      </td>

                      <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                        <i style={{
                          padding: "5px 10px",
                          cursor: "pointer",
                          fontSize: "30px"
                        }} onClick={() => handleOpenNextModalSub({ kodeDdn: item.kode_ddn, kodeSubGiat: item.kode_sub_giat, kodeSro: item.kode_sro, tahun: selectedSingleTahunAnggaran, rincianDetail: item.total_rinciansro, namaSro: item.nama_sro })} className="bx bx-list-ul text-primary"></i>
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
                      <span>Total Anggaran Sub Rincian Objek Setelah Pembobotan</span>
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
              <Col md={4}><Card className="card-animate card-height-100">
                <CardBody>
                  <div
                    className="d-flex flex-column title-custom-card"
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                      <span>Total Anggaran Sub Rincian Objek Sebelum Pembobotan</span>
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
                              totalSebelumPembobotan
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
            <div style={{ overflowY: "scroll", maxHeight: "500px" }}>
              <table
                className="table table-bordered table-nowrap align-middle mb-0"
              // style={{ width: "100%" }}
              >
                <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                  <tr>
                    <th rowSpan="3" style={{ verticalAlign: "middle", textAlign: "center" }}>
                      NO
                    </th>
                    <th rowSpan="3"
                      onClick={() => requestSort("kode_standar_harga")}
                      style={{
                        cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                        wordWrap: "break-word", maxWidth: "100px"
                      }}
                    >
                      Kode Standar Harga {getSortIcon("kode_standar_harga")}
                    </th>
                    <th rowSpan="3"
                      onClick={() => requestSort("nama_standar_harga")}
                      style={{
                        cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                        wordWrap: "break-word", maxWidth: "100px"
                      }}
                    >
                      Nama Standar Harga {getSortIcon("nama_standar_harga")}
                    </th>
                    <th rowSpan="3"
                      onClick={() => requestSort("satuan")}
                      style={{
                        cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                        wordWrap: "break-word", maxWidth: "100px"
                      }}
                    >
                      Satuan {getSortIcon("satuan")}
                    </th>
                    <th rowSpan="3" onClick={() => requestSort("volume")}
                      style={{
                        cursor: "pointer", textAlign: "center", whiteSpace: "normal",
                        wordWrap: "break-word", maxWidth: "100px"
                      }}>
                      Volume {getSortIcon("volume")}
                    </th>
                    <th rowSpan="3" onClick={() => requestSort("harga_satuan")}
                      style={{ cursor: "pointer", textAlign: "center" }}>
                      Harga Satuan (Rp) {getSortIcon("harga_satuan")}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="2"
                      style={{ cursor: "pointer", textAlign: "center" }}>
                      Total Rincian
                    </th>
                    <th rowSpan="2" onClick={() => requestSort("persentase")}
                      style={{
                        cursor: "pointer", textAlign: "center", whiteSpace: "normal",
                        wordWrap: "break-word"
                      }}>
                      Persentase Setelah Pembobotan {getSortIcon("persentase")}
                    </th>
                  </tr>
                  <tr>
                    <th onClick={() => requestSort("total_rinciansro")}
                      style={{ cursor: "pointer", textAlign: "center" }}>
                      Sebelum Pembobotan
                    </th>
                    <th onClick={() => requestSort("total_rinciansro")}
                      style={{ cursor: "pointer", textAlign: "center" }}>
                      Setelah Pembobotan {getSortIcon("total_rinciansro")}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemDetailSubSub.map((item, index) => (
                    <tr key={index}>
                      <td style={{
                        textAlign: "center",
                        verticalAlign: "middle"
                      }}>
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
                        <span style={{ float: "right" }}>{item.volume ? item.volume.toLocaleString("id-ID")
                          : "-"}</span>
                      </td>
                      <td>
                        <span style={{ float: "right" }}>{item.harga_satuan ? parseInt(item.harga_satuan).toLocaleString("id-ID")
                          : "-"}</span>
                      </td>
                      <td>
                        <span style={{ float: "right" }}>{item.harga_satuan ? parseInt(item.harga_satuan * item.volume).toLocaleString("id-ID")
                          : "-"}</span>
                      </td>
                      <td>
                        <span style={{ float: "right" }}>{item.total_rinciansro ? parseInt(item.total_rinciansro).toLocaleString("id-ID")
                          : "-"}</span>
                      </td>
                      <td>
                        <span style={{ float: "right" }}>
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

export default ContentStunting;
