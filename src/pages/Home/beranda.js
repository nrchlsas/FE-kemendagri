import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import classnames from "classnames";
import { SimplePie } from "../Charts/ApexCharts/PieCharts/PieCharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import PieChart from '../Component/PieChart'
const API_URI = `${process.env.REACT_APP_API_URL_BE}`;


const SingleOptions = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
];
const Beranda = () => {
  const [selectedSingle, setSelectedSingle] = useState(SingleOptions[0]); // Set default value
  const [dataPiePerencanaan, setDataPiePerencanaan] = useState([]);
  const [errorPiePerencanaan, setErrorPiePerencanaan] = useState(null);
  const [loadingPiePerencanaan, setLoadingPiePerencanaan] = useState(true);

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const getPiePerencanaan = async (filter) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filter }),
      };

      console.log(filter, "ini filter");

      const response = await fetch(
        `${API_URI}/dash_beranda_pie_perencanaan`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data.data);
      console.log(
        parseFloat(data.data["0"].persiapan),
        "ini isi data perencanaan"
      );

      const mappedData = [
        parseFloat(data.data["0"].persiapan),
        parseFloat(data.data["0"].rancangan_awal),
        parseFloat(data.data["0"].rancangan),
        parseFloat(data.data["0"].musrenbang),
        parseFloat(data.data["0"].rancangan_akhir),
        parseFloat(data.data["0"].penetapan),
      ];

      setDataPiePerencanaan(mappedData); // Sesuaikan berdasarkan struktur data yang dikembalikan API
    } catch (error) {
      setErrorPiePerencanaan(error);
    } finally {
      setLoadingPiePerencanaan(false);
    }
  };

  const [dataBeranda, setDataBeranda] = useState([]);
  const [errorBeranda, setErrorBeranda] = useState([]);
  const [loadingBeranda, setLoadingBeranda] = useState(true);

  const getPerencanaanDanPenganggaran = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(
          `${API_URI}/beranda`,

          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataBeranda = await response.json();

        console.log(dataBeranda, "ini isi mappedData");

        const mapData = dataBeranda.data.map((item) => ({
          apbdPaguBelanja: `${parseFloat(
            item.apbd_belanja.toFixed(2)
          ).toLocaleString("id-ID")} M`,
          apbdJumlahUrusan: parseFloat(item.apbd_jumlah_urusan).toLocaleString(
            "id-ID"
          ),
          apbdJumlahProgram: parseFloat(
            item.apdb_jumlah_program
          ).toLocaleString("id-ID"),
          apbdJumlahGiat: parseFloat(item.apdb_jumlah_giat).toLocaleString(
            "id-ID"
          ),
          apbdJumlahSubGiat: parseFloat(
            item.apdb_jumlah_sub_giat
          ).toLocaleString("id-ID"),
          apbdPaguKemiskinanEkstrem: `${parseFloat(
            item.apbd_pagu_miskin.toFixed(2)
          ).toLocaleString("id-ID")} M`,
          apbdPaguStunting: `${parseFloat(
            item.apdb_pagu_stunting.toFixed(2)
          ).toLocaleString("id-ID")} M`,
          apbdPaguSpm: `${parseFloat(
            item.apdb_pagu_spm.toFixed(2)
          ).toLocaleString("id-Id")} M`,
          apbdPaguPendapatan: `${parseFloat(
            item.apbd_pendapatan.toFixed(2)
          ).toLocaleString("id-Id")} M`,
          apbdPembiayaanPenerimaan: `${parseFloat(
            item.apbd_pembiayaan_penerimaan.toFixed(2)
          ).toLocaleString("id-ID")} M`,
          apbdPembiayaanPengeluaran: `${parseFloat(
            item.apbd_pembiayaan_pengeluaran.toFixed(2)
          ).toLocaleString("id-ID")} M`,
          rkpdPaguBelanja: `${parseFloat(
            item.rkpd_pagu.toFixed(2)
          ).toLocaleString("id-ID")} M`,
          rkpdJumlahUrusan: parseFloat(item.rkpd_jumlah_urusan).toLocaleString(
            "id-ID"
          ),
          rkpdJumlahProgram: parseFloat(
            item.rkpd_jumlah_program
          ).toLocaleString("id-ID"),
          rkpdJumlahGiat: parseFloat(item.rkpd_jumlah_giat).toLocaleString(
            "id-ID"
          ),
          rkpdJumlahSubGiat: parseFloat(
            item.rkpd_jumlah_sub_giat
          ).toLocaleString("id-ID"),
          rkpdMiskinEkstrem: parseFloat(
            item.rkpd_pagu_miskin.toFixed(2)
          ).toLocaleString("id-ID"),
          rkpdStunting: `${parseFloat(
            item.rkpd_pagu_stunting.toFixed(2)
          ).toLocaleString("id-ID")} M`,
          rkpdSpm: `${parseFloat(item.rkpd_pagu_spm.toFixed(2)).toLocaleString(
            "id-ID"
          )} M`,
        }));
        console.log(mapData[0], "dataBeranda");
        setDataBeranda(mapData[0]);
      } catch (errorBeranda) {
        setErrorBeranda(errorBeranda);
      } finally {
        setLoadingBeranda(false);
      }
    };

    fetchData();
  };

  const [dataRealisasi, setDataRealisasi] = useState([]);
  const [errorRealisasi, setErrorRealisasi] = useState([]);
  // const [loadingRealisasi, setLoadingRealisasi] = useState([])    // const [dataGrafikLabelPostur, setDataGrafikLabelPostur] = useState([]);
  // const [dataGrafikValuePostur, setDataGrafikValuePostur] = useState([]);
  const [loadingRealisasi, setLoadingRealisasi] = useState(true);

  const getRealisasi = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(
          `${API_URI}/dash_beranda_realisasi_nasional`,
          requestOptions
        );

        // const response2 = await fetch(
        //   `${API_URI}/dash_beranda_realisasi_nasional`,
        //   requestOptions
        // );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataRealisasi = await response.json();
        // const dataRealisasi2 = await response2.json();

        console.log(dataRealisasi.data, "ini ");

        const dataMapped = {
          jumlahKegiatan:
            dataRealisasi.data.total_kegiatan.value.toLocaleString("id-ID"),
          jumlahSubKegiatan:
            dataRealisasi.data.total_sub_kegiatan.value.toLocaleString("id-ID"),
          program:
            dataRealisasi.data.total_program.value.toLocaleString("id-ID"),
          jumlahRealisasi: `${parseFloat(
            dataRealisasi.data.total_belanja.value / 1000000000
          ).toLocaleString("id-ID")} M`,
          jumlahBidang:
            dataRealisasi.data.total_urusan.value.toLocaleString("id-ID"),
          realisasiKemiskinanEkstrem: `${(
            dataRealisasi.data.total_realisasi_miskin_nas.value / 1000000000
          ).toLocaleString("id-ID")} M`,
          realisasiStunting: `${(
            dataRealisasi.data.total_realisasi_stunting_nas.value / 1000000000
          ).toLocaleString("id-ID")} M`,
          realisasiSpm: `${(
            dataRealisasi.data.total_realisasi_spm_nas.value / 1000000000
          ).toLocaleString("id-ID")} M`,
          realisasiPendapatan: `${(
            dataRealisasi.data.total_realisasi_pendapatan_nas.value / 1000000000
          ).toLocaleString("id-ID")} M`,
          // realisasiKemiskinanEkstrem :dataRealisasi2.data.aggregations.realisasi_miskin.value.toLocaleString('id-ID'),
          // realisasiStunting :dataRealisasi2.data.aggregations.realisasi_stunting.value.toLocaleString('id-ID'),
          // realisasiSpm :dataRealisasi2.data.aggregations.realisasi_spm.value.toLocaleString('id-ID'),
        };
        console.log(dataMapped, "ini isi realisasi");

        setDataRealisasi(dataMapped);
      } catch (errorRealisasi) {
        setErrorRealisasi(errorRealisasi);
      } finally {
        setLoadingRealisasi(false);
      }
    };
    fetchData();
  };

  const [dataSpmPendidikan, setDataSpmPendidikan] = useState([]);
  const [dataSpmKesehatan, setDataSpmKesehatan] = useState([]);
  const [dataSpmPenataRuang, setDataSpmPenataRuang] = useState([]);
  const [dataSpmPerumahanRakyat, setDataSpmPerumahanRakyat] = useState([]);
  const [dataSpmPerlindunganMasyarakat, setDataSpmPerlindunganMasyarakat] =
    useState([]);
  const [dataSpmSosial, setDataSpmSosial] = useState([]);
  const [dataSpm, setDataSpm] = useState([]);

  const getSpm = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
        const responseAnggaranSpmPendidikan = await fetch(
          `${API_URI}/dash_beranda_spm_anggaran_pendidikan`,
          requestOptions
        );
        const responseRealisasiSpmPendidikan = await fetch(
          `${API_URI}/dash_beranda_spm_realisasi_bidang_pendidikan`,
          requestOptions
        );
        const responseAnggaranSpmKesehatan = await fetch(
          `${API_URI}/dash_beranda_spm_anggaran_kesehatan`,
          requestOptions
        );
        const responseRealisasiSpmKesehatan = await fetch(
          `${API_URI}/dash_beranda_spm_realisasi_bidang_kesehatan`,
          requestOptions
        );

        const responseAnggaranSpmPanduanPenataRuang = await fetch(
          `${API_URI}/dash_beranda_spm_anggaran_panduanpenataanruang`,
          requestOptions
        );
        const responseRealisasiSpmPanduanPenataRuang = await fetch(
          `${API_URI}/dash_beranda_spm_realisasi_panduanpenataanruang`,
          requestOptions
        );

        const responseAnggaranSpmPerumahanRakyat = await fetch(
          `${API_URI}/dash_beranda_spm_anggaran_perumahan_rakyat_dan_kawasan_pemukiman`,
          requestOptions
        );
        const responseRealisasiSpmPerumahanRakyat = await fetch(
          `${API_URI}/dash_beranda_spm_realisasi_perumahan_rakyat_dan_kawasan_pemukiman`,
          requestOptions
        );

        const responseAnggaranSpmPerlindunganMasyarakat = await fetch(
          `${API_URI}/dash_beranda_spm_anggaran_perlindunganmasyarakat`,
          requestOptions
        );
        const responseRealisasiSpmPerlindunganMasyarakat = await fetch(
          `${API_URI}/dash_beranda_spm_realisasi_perlindunganmasyarakat`,
          requestOptions
        );

        const responseAnggaranSpmSosial = await fetch(
          `${API_URI}/dash_beranda_spm_anggaran_sosial`,
          requestOptions
        );
        const responseRealisasiSpmSosial = await fetch(
          `${API_URI}/dash_beranda_spm_realisasi_sosial`,
          requestOptions
        );

        const dataAnggaranSpmPendidikan =
          await responseAnggaranSpmPendidikan.json();
        const dataRealisasiSpmPendidikan =
          await responseRealisasiSpmPendidikan.json();
        const dataAnggaranSpmKesehatan =
          await responseAnggaranSpmKesehatan.json();
        const dataRealisasiSpmKesehatan =
          await responseRealisasiSpmKesehatan.json();
        const dataAnggaranSpmPanduanPenataRuang =
          await responseAnggaranSpmPanduanPenataRuang.json();
        const dataRealisasiSpmPanduanPenataRuang =
          await responseRealisasiSpmPanduanPenataRuang.json();
        const dataAnggaranSpmPerumahanRakyat =
          await responseAnggaranSpmPerumahanRakyat.json();
        const dataRealisasiSpmPerumahanRakyat =
          await responseRealisasiSpmPerumahanRakyat.json();
        const dataAnggaranSpmPerlindunganMasyarakat =
          await responseAnggaranSpmPerlindunganMasyarakat.json();
        const dataRealisasiSpmPerlindunganMasyarakat =
          await responseRealisasiSpmPerlindunganMasyarakat.json();
        const dataAnggaranSpmSosial = await responseAnggaranSpmSosial.json();
        const dataRealisasiSpmSosial = await responseRealisasiSpmSosial.json();

        const mappedDataSpmPendidikan = [
          dataAnggaranSpmPendidikan.data["1"].value,
          dataRealisasiSpmPendidikan.data["1"].value,
        ];
        const mappedDataSpmKesehatan = [
          dataAnggaranSpmKesehatan.data["1"].value,
          dataRealisasiSpmKesehatan.data["1"].value,
        ];
        const mappedDataSpmPanduanPenataRuang = [
          dataAnggaranSpmPanduanPenataRuang.data["1"].value,
          dataRealisasiSpmPanduanPenataRuang.data["1"].value,
        ];
        const mappedDataSpmPerumahanRakyat = [
          dataAnggaranSpmPerumahanRakyat.data["1"].value,
          dataRealisasiSpmPerumahanRakyat.data["1"].value,
        ];
        const mappedDataSpmPerlindunganMasyarakat = [
          dataAnggaranSpmPerlindunganMasyarakat.data["1"].value,
          dataRealisasiSpmPerlindunganMasyarakat.data["1"].value,
        ];
        const mappedDataSpmSosial = [
          dataAnggaranSpmSosial.data["1"].value,
          dataRealisasiSpmSosial.data["1"].value,
        ];

        const valueAllSpm = {
          pendidikan: mappedDataSpmPendidikan,
          kesehatan: mappedDataSpmKesehatan,
          panduanPenataRuang: mappedDataSpmPanduanPenataRuang,
          perumahanRakyat: mappedDataSpmPerumahanRakyat,
          perlindunganMasyarakat: mappedDataSpmPerlindunganMasyarakat,
          sosial: mappedDataSpmSosial,
        };

        console.log(valueAllSpm, "ini value spm");

        setDataSpm(valueAllSpm);
      } catch (errorRealisasi) {
        setErrorRealisasi(errorRealisasi);
      } finally {
        setLoadingRealisasi(false);
      }
    };
    fetchData();
  };

  useEffect(() => {
    getPerencanaanDanPenganggaran();
    getRealisasi();
    getSpm();
    getPiePerencanaan(selectedSingle.value);
  }, []);

  const SimplePieTahapanRencana = ({ dataColors }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = dataPiePerencanaan;
    var options = {
      chart: {
        height: 400,
        type: "donut",
      },
      labels: [
        "Persiapan",
        "Rancangan Awal",
        "Rancangan",
        "Musrembang",
        "Rancangan Akhir",
        "Penetapan",
      ],
      legend: {
        position: "bottom",
      },

      dataLabels: {
        style: {
          fontSize: "12px",
          colors: ["#000000"],
        },
        dropShadow: {
          enabled: false,
        },
      },
      colors: chartPieBasicColors,
    };
    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="donut"
        height={400}
      />
    );
  };
  const SimplePieTahapanAnggaran = ({ dataColors }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = [5, 5, 5];
    var options = {
      chart: {
        height: 400,
        type: "donut",
      },
      labels: ["KUA PPAS", "RAPBD", "APBD"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
        style: {
          fontSize: "12px",
          colors: ["#000"],
        },
      },
      colors: chartPieBasicColors,
    };
    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="pie"
        height={400}
      />
    );
  };
  const SimplePieTahapanRealisasi = ({ dataColors }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = [5, 5];
    var options = {
      chart: {
        height: 400,
        type: "pie",
      },
      labels: ["Sisa Anggaran", "Realisasi"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: chartPieBasicColors,
    };
    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="pie"
        height={400}
      />
    );
  };
  const SimplePieSpmPendidikan = ({ dataColors }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = dataSpm?.pendidikan || [0, 0];
    var options = {
      chart: {
        height: 400,
        type: "pie",
      },
      labels: ["Sisa Anggaran", "Realisasi"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: chartPieBasicColors,
    };
    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="pie"
        height={400}
      />
    );
  };
  const SimplePieSpmKesehatan = ({ dataColors }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = dataSpm?.kesehatan || [0, 0];
    var options = {
      chart: {
        height: 400,
        type: "pie",
      },
      labels: ["Sisa Anggaran", "Realisasi"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: chartPieBasicColors,
    };
    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="pie"
        height={400}
      />
    );
  };
  const SimplePieSpmPenataRuang = ({ dataColors }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = dataSpm?.panduanPenataRuang || [0, 0];
    var options = {
      chart: {
        height: 400,
        type: "pie",
      },
      labels: ["Sisa Anggaran", "Realisasi"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: chartPieBasicColors,
    };
    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="pie"
        height={400}
      />
    );
  };
  const SimplePieSpmPerumahanRakyat = ({ dataColors }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = dataSpm?.perumahanRakyat || [0, 0];
    var options = {
      chart: {
        height: 400,
        type: "pie",
      },
      labels: ["Sisa Anggaran", "Realisasi"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: chartPieBasicColors,
    };
    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="pie"
        height={400}
      />
    );
  };
  const SimplePieSpmPerlindunganMasyarakat = ({ dataColors }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = dataSpm?.perlindunganMasyarakat || [0, 0];
    var options = {
      chart: {
        height: 400,
        type: "pie",
      },
      labels: ["Sisa Anggaran", "Realisasi"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: chartPieBasicColors,
    };
    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="pie"
        height={400}
      />
    );
  };
  const SimplePieSpmSosial = ({ dataColors }) => {
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = dataSpm?.sosial || [0, 0];
    var options = {
      chart: {
        height: 400,
        type: "pie",
      },
      labels: ["Sisa Anggaran", "Realisasi"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: chartPieBasicColors,
    };
    return (
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={series}
        options={options}
        type="pie"
        height={400}
      />
    );
  };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Selected value:", selectedValue); // Debugging

    setSelectedSingle(selectedValue);
    getPiePerencanaan(selectedValue); // Panggil API dengan filter yang dipilih
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/detail-anggaran-bidang-pendidikan");
  };

  return (
    <React.Fragment>
      {/* <Card>
        <CardBody>
          <div className="nav-beranda">
            <Nav tabs className="nav nav-tabs nav-success nav-justified mb-3">
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
                  Perencanaan
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
                  Penganggaran
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
                  Realisasi
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </CardBody>
      </Card>
      <TabContent activeTab={customActiveTab}
                className="text-muted">
      <Row style={{ fontFamily: "bookmanoldstyle" }}>
        <TabPane tabId="1" id="chats">
          <Row>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Perencanaan
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pagu Belanja</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdPaguBelanja}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahUrusan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahProgram}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Jumlah Sub Kegiatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahSubGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Pagu Kemiskinan Ekstrem
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdMiskinEkstrem}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pagu Stunting</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdStunting}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pagu SPM</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>{dataBeranda.rkpdSpm}</div>
                  </div>
                </div>
              </CardBody>
            </Card>
            </Col>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Tahapan Perencanaan
                  </div>
                  <div className="d-flex">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ marginRight: "20px", fontSize: "18px" }}
                    >
                      Tahun :
                    </div>
                    <div>
                      <select
                        style={{
                          padding: "8px 12px",
                          fontSize: "16px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor: "#f8f8f8",
                          color: "#333",
                          cursor: "pointer",
                          outline: "none",
                        }}
                        value={selectedSingle}
                        onChange={handleSelectChange}
                      >
                        <option value="">Select an option</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </select>
                    </div>
                  </div>
                </div>
                <SimplePieTahapanRencana dataColors='["#FF5733", "#33FFF2", "#3357FF", "#FF33A1", "#A133FF", "#388E3C"]' />
              </CardBody>
            </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2" id="chats">
          <Row>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Penganggaran
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Total Rincian</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguBelanja}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahUrusan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahProgram}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Jumlah Sub Kegiatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahSubGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Rincian Kemiskinan Ekstrem
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguKemiskinanEkstrem}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Rincian Stunting</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguStunting}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Rincian SPM</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguSpm}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pendapatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguPendapatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Pembiayaan Penerimaan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPembiayaanPenerimaan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Pembiayaan Pengeluaran
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPembiayaanPengeluaran}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            </Col>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Tahapan Penganggaran
                  </div>
                </div>
                <SimplePieTahapanAnggaran dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                <div>
                sumber data : SIPD                
              </div>
              <div>
                di-update pada : {}
              </div>
              </CardBody>
            </Card>
            </Col>
          </Row>
          
        </TabPane>
        <TabPane tabId="3" id="chats">
          <Row>
            <Col md={6}>            
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Realisasi
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Daerah</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahRealisasi}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Realisasi Belanja</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahRealisasi}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahBidang}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.program}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahKegiatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Jumlah Sub Kegiatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahSubKegiatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Realisasi Kemiskinan Ekstrem
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiKemiskinanEkstrem}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Realisasi Stunting</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiStunting}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Realisasi SPM</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiSpm}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Realisasi Pendapatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiPendapatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Realisasi Pembiayaan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>         
                    </div>
                  </div>                  
                </div>                
              </CardBody>
            </Card>
            </Col>
            <Col md={6}>
            <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Tahapan Realisasi
                  </div>
                </div>
                <SimplePieTahapanRealisasi dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                <div>
                sumber data : SIPD                
              </div>
              <div>
                di-update pada : {}
              </div>
              </CardBody>
            </Card>
            </Col>
          </Row>
        </TabPane>
      </Row>
      </TabContent>  */}
      <Row style={{ fontFamily: "bookmanoldstyle" }}>
        <Col md={4}>
        <Card className="card-animate" style={{ minHeight: "700px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Perencanaan
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pagu Belanja</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdPaguBelanja}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahUrusan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahProgram}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Jumlah Sub Kegiatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdJumlahSubGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Pagu Kemiskinan Ekstrem
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdMiskinEkstrem}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pagu Stunting</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.rkpdStunting}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pagu SPM</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>{dataBeranda.rkpdSpm}</div>
                  </div>
                </div>
              </CardBody>
            </Card>
        </Col>
        <Col md={4}>
        <Card className="card-animate" style={{ minHeight: "700px" }}>
              <CardBody>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Penganggaran
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Total Rincian</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguBelanja}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahUrusan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahProgram}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Jumlah Sub Kegiatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdJumlahSubGiat}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Rincian Kemiskinan Ekstrem
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguKemiskinanEkstrem}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Rincian Stunting</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguStunting}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Rincian SPM</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguSpm}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Pendapatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPaguPendapatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Pembiayaan Penerimaan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPembiayaanPenerimaan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Pembiayaan Pengeluaran
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataBeranda.apbdPembiayaanPengeluaran}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
        </Col>
        
        <Col md={4}>
        <Card className="card-animate" style={{ minHeight: "700px" }}>
              <CardBody>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Realisasi
                  </div>
                </div>
                <div style={{ fontSize: "20px" }}>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Daerah</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {/* {dataRealisasi.jumlahRealisasi} */}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Realisasi Belanja</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahRealisasi}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Urusan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahBidang}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Program</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.program}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Jumlah Kegiatan</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahKegiatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Jumlah Sub Kegiatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.jumlahSubKegiatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Realisasi Kemiskinan Ekstrem
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiKemiskinanEkstrem}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Realisasi Stunting</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiStunting}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>Realisasi SPM</div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiSpm}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Realisasi Pendapatan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>
                      {dataRealisasi.realisasiPendapatan}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div style={{ flexBasis: "220px" }}>
                      Realisasi Pembiayaan
                    </div>
                    <div>:&nbsp;</div>
                    <div style={{ fontWeight: 650 }}>         
                    </div>
                  </div>                  
                </div>                
              </CardBody>
            </Card>
        </Col>      
      </Row>
      <Row>
        <Col md={4}><Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Tahapan Perencanaan
                  </div>
                  <div className="d-flex">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ marginRight: "20px", fontSize: "18px" }}
                    >
                      Tahun :
                    </div>
                    <div>
                      <select
                        style={{
                          padding: "8px 12px",
                          fontSize: "16px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor: "#f8f8f8",
                          color: "#333",
                          cursor: "pointer",
                          outline: "none",
                        }}
                        value={selectedSingle}
                        onChange={handleSelectChange}
                      >
                        {/* <option value="">Select an option</option> */}
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </select>
                    </div>
                  </div>
                </div>
                <SimplePieTahapanRencana dataColors='["#FF5733", "#33FFF2", "#3357FF", "#FF33A1", "#A133FF", "#388E3C"]' />
              </CardBody>
            </Card></Col>
        <Col md={4}>
        <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Tahapan Penganggaran
                  </div>
                </div>
                <SimplePieTahapanAnggaran dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                {/* <div>
                sumber data : SIPD                
              </div>
              <div>
                di-update pada : {}
              </div> */}
              </CardBody>
            </Card>
        </Col>
        <Col md={4}>
        <Card className="card-animate" style={{ minHeight: "650px" }}>
              <CardBody>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="card-title mb-3"
                    style={{
                      fontColor: "#333333",
                      fontSize: "30px",
                      fontWeight: 650,
                    }}
                  >
                    Tahapan Realisasi
                  </div>
                </div>
                <SimplePieTahapanRealisasi dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                {/* <div>
                sumber data : SIPD                
              </div>
              <div>
                di-update pada : {}
              </div> */}
              </CardBody>
            </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="card-animate" style={{ minHeight: "650px" }}>
            <Card>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 650,
                    padding: "4px",
                  }}
                >
                  SPM Pendidikan
                </div>
              </div>
            </Card>
            <CardBody>
              <SimplePieSpmPendidikan dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
              <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                {/* <i className="ri-equalizer-fill me-1 align-bottom"></i>{" "} */}
                Lihat Detail
              </Button>
              {/* <button className="btn" onClick={handleClick}>
                Lihat Detail
              </button> */}
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate" style={{ minHeight: "650px" }}>
            <Card>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 650,
                    padding: "4px",
                  }}
                >
                  SPM Kesehatan
                </div>
              </div>
            </Card>
            <CardBody>
              <SimplePieSpmKesehatan dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
              <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                {/* <i className="ri-equalizer-fill me-1 align-bottom"></i>{" "} */}
                Lihat Detail
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate" style={{ minHeight: "650px" }}>
            <Card>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 650,
                    padding: "4px",
                  }}
                >
                  SPM Pekerjaan Umum dan Penataan Ruang
                </div>
              </div>
            </Card>
            <CardBody>
              <SimplePieSpmPenataRuang dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
              <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                Lihat Detail
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="card-animate" style={{ minHeight: "650px" }}>
            <Card>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 650,
                    padding: "4px",
                  }}
                >
                  SPM Perumahan Rakyat dan Kawasan Permukiman
                </div>
              </div>
            </Card>
            <CardBody>
              <SimplePieSpmPerumahanRakyat dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
              <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                {/* <i className="ri-equalizer-fill me-1 align-bottom"></i>{" "} */}
                Lihat Detail
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate" style={{ minHeight: "650px" }}>
            <Card>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 650,
                    padding: "4px",
                  }}
                >
                  SPM Pelindungan Masyarakat
                </div>
              </div>
            </Card>
            <CardBody>
              <SimplePieSpmPerlindunganMasyarakat dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
              <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                {/* <i className="ri-equalizer-fill me-1 align-bottom"></i>{" "} */}
                Lihat Detail
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-animate" style={{ minHeight: "650px" }}>
            <Card>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                  className="card-title mb-2"
                  style={{
                    fontColor: "#333333",
                    fontSize: "20px",
                    fontWeight: 650,
                    padding: "4px",
                  }}
                >
                  SPM Sosial
                </div>
              </div>
            </Card>
            <CardBody>
              <SimplePieSpmSosial dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
              <Button
                type="button"
                color="success"
                className="btn w-100"
                onClick={handleClick}
              >
                {/* <i className="ri-equalizer-fill me-1 align-bottom"></i>{" "} */}
                Lihat Detail
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          {/* <PieChart type="donut" title="Tahapan Perencanaan" labels={labelsTahapanPerencanaan} dataColors={'["#FF5733", "#33FFF2", "#3357FF", "#FF33A1", "#A133FF", "#388E3C"]'} method="POST" isLoading={loadingPiePerencanaan} setLoadingPiePerencanaan={setLoadingPiePerencanaan} isTahun /> */}
        </Col>
        <Col md={4}>
          {/* <PieChart type="pie" title="Tahapan Penganggaran" labels={labelsTahapanPenganggaran} dataColors={'["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'} method="GET"/> */}
        </Col>
        <Col md={4}>
          {/* <PieChart type="pie" title="Tahapan Realisasi" labels={labelsTahapanRealisasi} dataColors={'["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'} method="GET"/> */}
        </Col>
      </Row>
      {/* </TabContent> */}
    </React.Fragment>
  );
};

export default Beranda;
