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
import PolygonMaps from "../../Components/MapIndo/PolygonMaps";
import classnames from "classnames";
import HorizontalBarChart from "../../Components/Chart/HorizontalBarChart";
import CountUp from "react-countup";
import BarWithPercentage from "../../Components/Chart/BarWithPercentage";
import VerticalBarChart from "../../Components/Chart/VerticalBarChart";
import PieChartNew from "../../Components/Chart/PieChart";
import Pagination from "../../Components/Pagination/Pagination";
import logoKemenkoPmk from "../../assets/images/logo-kemendagri/logo-kemenko-pmk.png"
import "./../Dapodik/dapodik.scss"
import MapIndoChart from "../../Components/MapIndo/MapIndoChart";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

const ContentMiskinEkstremV2 = () => {
  const [dataGrafikLabel, setDataGrafikLabel] = useState([]);
  const [dataGrafikValue, setDataGrafikValue] = useState([]);

  const [dataGrafikLabelKab, setDataGrafikLabelKab] = useState([]);
  const [dataGrafikValueKab, setDataGrafikValueKab] = useState([]);

  const [dataGrafikLabelKota, setDataGrafikLabelKota] = useState([]);
  const [dataGrafikValueKota, setDataGrafikValueKota] = useState([]);

  const [dataGrafikLabelKomp, setDataGrafikLabelKomp] = useState([]);
  const [dataGrafikValueKomp, setDataGrafikValueKomp] = useState([]);

  const [dataGrafikLabelKompKab, setDataGrafikLabelKompKab] = useState([]);
  const [dataGrafikValueKompKab, setDataGrafikValueKompKab] = useState([]);

  const [dataGrafikLabelKompKota, setDataGrafikLabelKompKota] = useState([]);
  const [dataGrafikValueKompKota, setDataGrafikValueKompKota] = useState([]);

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [customActiveTabChart, setcustomActiveTabChart] = useState("1");
  const [
    customActiveTabChartKeluargaMiskin,
    setcustomActiveTabChartKeluargaMiskin,
  ] = useState("1");
  const [customActiveTabChartTop, setcustomActiveTabChartTop] = useState("1");
  const [
    customActiveTabChartFasilitasRumah,
    setcustomActiveTabChartFasilitasRumah,
  ] = useState("1");
  const [
    customActiveTabChartJenisPekerjaan,
    setcustomActiveTabChartJenisPekerjaan,
  ] = useState("1");
  const [customActiveTabChartTopBottom, setcustomActiveTabChartTopBottom] =
    useState("1");

  const [customActiveTabAll, setcustomActiveTabAll] = useState("1");

  const [customActiveTitleAnggaran, setCustomActiveTitleAnggaran] =
    useState("Nasional");
  const [customActiveTitleChartAlokasi, setCustomActiveTitleChartAlokasi] =
    useState("Provinsi");
  const [customActiveTitleTopBottom, setCustomActiveTitleTopBottom] =
    useState("Top 10");

    const [customActiveTabTabelDaerah, setcustomActiveTabTabelDaerah] = useState ("1")
  const toggleCustomTabelDaerah = (tab) => {
    if (customActiveTabTabelDaerah !== tab) {
      setcustomActiveTabTabelDaerah(tab);
    }
  };

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

  const toggleCustomChart = (tab) => {
    if (customActiveTabChart !== tab) {
      setcustomActiveTabChart(tab);
    }
  };

  const toggleCustomChartKeluargaMiskin = (tab) => {
    if (customActiveTabChartKeluargaMiskin !== tab) {
      setcustomActiveTabChartKeluargaMiskin(tab);
    }
  };

  const toggleCustomChartTop = (tab) => {
    if (customActiveTabChartTop !== tab) {
      setcustomActiveTabChartTop(tab);
    }
  };

  const toggleCustomChartTopBottom = (tab) => {
    if (customActiveTabChartTopBottom !== tab) {
      setcustomActiveTabChartTopBottom(tab);
    }
  };

  const toggleCustomChartFasilitasRumah = (tab) => {
    if (customActiveTabChartFasilitasRumah !== tab) {
      setcustomActiveTabChartFasilitasRumah(tab);
    }
  };

  const toggleCustomChartJenisPekerjaan = (tab) => {
    if (customActiveTabChartJenisPekerjaan !== tab) {
      setcustomActiveTabChartJenisPekerjaan(tab);
    }
  };



  const [dataKemiskinanEkstrem, setDataKemiskinanEkstrem] = useState([]);
  const [dataKemiskinanEkstremTahun, setDataKemiskinanEkstremTahun] = useState([]);
  const [dataCategoryChartPembiayaan, setDataCategoryChartPembiayaan] =
    useState([]);
  const [dataValueChartPembiayaan, setDataValueChartPembiayaan] = useState([]);
  const [loadingKemiskinanEkstrem, setLoadingKemiskinanEkstrem] = useState([]);
  const [errorKemiskinanEkstrem, setErrorKemiskinanEkstrem] = useState([]);

  const [
    dataChartTop5AnggaranKemiskinanEkstrem,
    setDataChartTop5AnggaranKemiskinanEkstrem,
  ] = useState([[], []]);
  const [
    dataChartBottom5AnggaranKemiskinanEkstrem,
    setDataChartBottom5AnggaranKemiskinanEkstrem,
  ] = useState([[], []]);
  const [
    dataChartPerbandinganSpmKemiskinanEkstrem,
    setDataChartPerbandinganSpmKemiskinanEkstrem,
  ] = useState([[], []]);
  const [
    dataChartUrusanPemerintahKemeskinanEkstrem,
    setDataChartUrusanPemerintahKemeskinanEkstrem,
  ] = useState([[], []]);

  const [
    dataChartTop10KemiskinanEkstremProvinsi,
    setDataChartTop10KemiskinanEkstremProvinsi,
  ] = useState([[], []]);
  const [
    dataChartBottom10KemiskinanEkstremProvinsi,
    setDataChartBottom10KemiskinanEkstremProvinsi,
  ] = useState([[], []]);

  const [
    dataChartTop10KemiskinanEkstremKabupaten,
    setDataChartTop10KemiskinanEkstremKabupaten,
  ] = useState([[], []]);
  const [
    dataChartBottom10KemiskinanEkstremKabupaten,
    setDataChartBottom10KemiskinanEkstremKabupaten,
  ] = useState([[], []]);

  const [
    dataChartTop10KemiskinanEkstremKota,
    setDataChartTop10KemiskinanEkstremKota,
  ] = useState([[], []]);
  const [
    dataChartBottom10KemiskinanEkstremKota,
    setDataChartBottom10KemiskinanEkstremKota,
  ] = useState([[], []]);

  const [
    dataChartKomposisiBelanjaProvinsi,
    setDataChartKomposisiBelanjaProvinsi,
  ] = useState([[], []]);
  const [
    dataChartKomposisiBelanjaKabupaten,
    setDataChartKomposisiBelanjaKabupaten,
  ] = useState([[], []]);
  const [dataChartKomposisiBelanjaKota, setDataChartKomposisiBelanjaKota] =
    useState([[], []]);

  const [
    dataChartFasilitasRumahStatusRumah,
    setDataChartFasilitasRumahStatusRumah,
  ] = useState([[], []]);
  const [
    dataChartFasilitasRumahDayaListrikRumah,
    setDataChartFasilitasRumahDayaListrikRumah,
  ] = useState([[], []]);
  const [dataChartFasilitasRumahMemasak, setDataChartFasilitasRumahMemasak] =
    useState([[], []]);

  const [dataChartFasilitasSanitasi, setDataChartFasilitasSanitasi] = useState([
    [],
    [],
  ]);
  const [
    dataChartJenisPekerjaanKepalaKeluarga,
    setDataChartJenisPekerjaanKepalaKeluarga,
  ] = useState([[], []]);
  const [dataChartJenisPekerjaanIndividu, setDataChartJenisPekerjaanIndividu] =
    useState([[], []]);
  const [
    dataChartKepalaKeluargaPerempuan,
    setDataChartKepalaKeluargaPerempuan,
  ] = useState([[], []]);

  const [
    dataChartIndividuMiskinEkstremProvinsi,
    setDataChartIndividuMiskinEkstremProvinsi,
  ] = useState([[], []]);
  const [
    dataChartIndividuMiskinEkstremKabupatenKota,
    setDataChartIndividuMiskinEkstremKabupatenKota,
  ] = useState([[], []]);
  const [
    dataChartKeluargaMiskinEkstremProvinsi,
    setDataChartKeluargaMiskinEkstremProvinsi,
  ] = useState([[], []]);
  const [
    dataChartKeluargaMiskinEkstremKabupatenKota,
    setDataChartKeluargaMiskinEkstremKabupatenKota,
  ] = useState([[], []]);
  const [
    dataChartIndividuMiskinEkstremDesil1Provinsi,
    setDataChartIndividuMiskinEkstremDesil1Provinsi,
  ] = useState([[], []]);
  const [
    dataChartIndividuMiskinEkstremDesil1KabupatenKota,
    setDataChartIndividuMiskinEkstremDesil1KabupatenKota,
  ] = useState([[], []]);
  const [
    dataChartKeluargaMiskinEkstremDesil1Provinsi,
    setDataChartKeluargaMiskinEkstremDesil1Provinsi,
  ] = useState([[], []]);
  const [
    dataChartKeluargaMiskinEkstremDesil1KabupatenKota,
    setDataChartKeluargaMiskinEkstremDesil1KabupatenKota,
  ] = useState([[], []]);

  const [dataPieChartSpm, setDataPieChartSpm] = useState([],[])

  const getDataKemiskinanEkstrem = ({tahun, tahun_data}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            tahun : tahun,
            tahun_data: tahun_data
          }),
        };
        const response = await fetch(
          `${API_URI_RBAC}/v2/dashboard_kemiskinan_ekstrim`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataKemiskinanEkstrem = await response.json();

        setDataKemiskinanEkstrem(dataKemiskinanEkstrem.data);

        //chart Top 5 Prov
        const resultChartTop5Prov =
          dataKemiskinanEkstrem.data.ke_akbar_top5_seprovinsi_untuk_kasus_ke.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_provinsi);
              return acc;
            },
            [[], []]
          );
        setDataChartTop5AnggaranKemiskinanEkstrem(resultChartTop5Prov);

        //chart Bottom 5 Prov
        const resultChartBottom5Prov =
          dataKemiskinanEkstrem.data.ke_akbar_bottom5_seprovinsi_untuk_kasus_ke.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_provinsi);
              return acc;
            },
            [[], []]
          );
        setDataChartBottom5AnggaranKemiskinanEkstrem(resultChartBottom5Prov);

        //chart SPM
        const resultChartSpm =
          dataKemiskinanEkstrem.data.ke_akbar_perbandingan_spm_untuk_kasus_ke.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.spm);
              return acc;
            },
            [[], []]
          );
        setDataChartPerbandinganSpmKemiskinanEkstrem(resultChartSpm);

        // chart urusan pemerintah
        const resultChartUrusanPemerintah =
          dataKemiskinanEkstrem.data.ke_akbar_top5_urusan_untuk_kasus_ke.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_urusan);
              return acc;
            },
            [[], []]
          );
        setDataChartUrusanPemerintahKemeskinanEkstrem(
          resultChartUrusanPemerintah
        );

        //chart top 10 alokasi provinsi
        const resultChartTop10AlokasiProvinsi =
          dataKemiskinanEkstrem.data.ke_grafika_alokasi_provinsi_top10.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_provinsi);
              acc[2].push(item.percentage);
              acc[3].push(item.total);
              return acc;
            },
            [[], [], [], []]
          );
        console.log(resultChartTop10AlokasiProvinsi);
        setDataChartTop10KemiskinanEkstremProvinsi(
          resultChartTop10AlokasiProvinsi
        );

        //chart bottom 10 alokasi provinsi
        const resultChartBottom10AlokasiProvinsi =
          dataKemiskinanEkstrem.data.ke_grafika_alokasi_provinsi_bottom10.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_provinsi);
              acc[2].push(item.percentage);
              acc[3].push(item.total);
              return acc;
            },
            [[], [], [], []]
          );
        setDataChartBottom10KemiskinanEkstremProvinsi(
          resultChartBottom10AlokasiProvinsi
        );

        //chart top 10 alokasi Kabupaten
        const resultChartTop10AlokasiKabupaten =
          dataKemiskinanEkstrem.data.ke_grafika_alokasi_kab_top10.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_kabupaten);
              acc[2].push(item.percentage);
              acc[3].push(item.total);
              return acc;
            },
            [[], [], [], []]
          );
        setDataChartTop10KemiskinanEkstremKabupaten(
          resultChartTop10AlokasiKabupaten
        );

        //chart bottom 10 alokasi Kabupaten
        const resultChartBottom10AlokasiKabupaten =
          dataKemiskinanEkstrem.data.ke_grafika_alokasi_kab_bottom10.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_kabupaten);
              acc[2].push(item.percentage);
              acc[3].push(item.total);
              return acc;
            },
            [[], [], [], []]
          );
        setDataChartBottom10KemiskinanEkstremKabupaten(
          resultChartBottom10AlokasiKabupaten
        );

        //chart bottom 10 alokasi Kota
        const resultChartTop10AlokasiKota =
          dataKemiskinanEkstrem.data.ke_grafika_alokasi_kota_top10.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_kota);
              acc[2].push(item.percentage);
              acc[3].push(item.total);
              return acc;
            },
            [[], [], [], []]
          );
        setDataChartTop10KemiskinanEkstremKota(resultChartTop10AlokasiKota);

        //chart bottom 10 alokasi Kota
        const resultChartBottom10AlokasiKota =
          dataKemiskinanEkstrem.data.ke_grafika_alokasi_kota_bottom10.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_kota);
              acc[2].push(item.percentage);
              acc[3].push(item.total);
              return acc;
            },
            [[], [], [], []]
          );
        setDataChartBottom10KemiskinanEkstremKota(
          resultChartBottom10AlokasiKota
        );

        //chart komposisi belanja provinsi
        const resultChartKomposisiBelanjaProvinsi =
          dataKemiskinanEkstrem.data.ke_komposisi_belanja_provinsi.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_provinsi);
              return acc;
            },
            [[], []]
          );
        setDataChartKomposisiBelanjaProvinsi(
          resultChartKomposisiBelanjaProvinsi
        );

        //chart komposisi belanja kabupaten
        const resultChartKomposisiBelanjaKabupaten =
          dataKemiskinanEkstrem.data.ke_komposisi_belanja_kabupaten.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_kabupaten);
              return acc;
            },
            [[], []]
          );
        setDataChartKomposisiBelanjaKabupaten(
          resultChartKomposisiBelanjaKabupaten
        );

        //chart komposisi belanja kota
        const resultChartKomposisiBelanjaKota =
          dataKemiskinanEkstrem.data.ke_komposisi_belanja_kota.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.nama_kota);
              return acc;
            },
            [[], []]
          );
        setDataChartKomposisiBelanjaKota(resultChartKomposisiBelanjaKota);

        //chart fasilitas
        const resultChartFasilitasRumahStatusRumah =
          dataKemiskinanEkstrem.data.ke_status_rumah.reduce(
            (acc, item) => {
              if (item.key && item.value !== undefined) {
                acc[0].push(item.value);
                acc[1].push(item.key);
              }              
              return acc;
            },
            [[], []]
          );
        setDataChartFasilitasRumahStatusRumah(
          resultChartFasilitasRumahStatusRumah
        );

        const resultChartFasilitasRumahDayaListrik =
          dataKemiskinanEkstrem.data.ke_daya_listrik_rumah.reduce(
            (acc, item) => {
              if (item.key && item.value !== undefined) {
                acc[0].push(item.value);
                acc[1].push(item.key);
              }
              return acc;
            },
            [[], []]
          );
        setDataChartFasilitasRumahDayaListrikRumah(
          resultChartFasilitasRumahDayaListrik
        );

        const resultChartFasilitasRumahMemasak =
          dataKemiskinanEkstrem.data.ke_memasak.reduce(
            (acc, item) => {
              if (item.key && item.value !== undefined) {
                acc[0].push(item.value);
                acc[1].push(item.key);
              }              
              return acc;
            },
            [[], []]
          );
        setDataChartFasilitasRumahMemasak(resultChartFasilitasRumahMemasak);

        //fasilitas sanitasi
        const resultChartFasilitasSanitasi =
          dataKemiskinanEkstrem.data.ke_fasilitas_sanitasi.reduce(
            (acc, item) => {
              if (item.key && item.value !== undefined) {
              acc[0].push(item.value);
              acc[1].push(item.key);
              }
              return acc;
            },
            [[], []]
          );
        setDataChartFasilitasSanitasi(resultChartFasilitasSanitasi);

        const resultChartJenisPekerjaanKepalaKeluarga =
          dataKemiskinanEkstrem.data.ke_jenis_pekerjaan_kepala_keluarga.reduce(
            (acc, item) => {
              if (item.key && item.value !== undefined) {
              acc[0].push(item.value);
              acc[1].push(item.key);
              }
              return acc;
            },
            [[], []]
          );
        setDataChartJenisPekerjaanKepalaKeluarga(
          resultChartJenisPekerjaanKepalaKeluarga
        );

        const resultChartJenisPekerjaanIndividu =
          dataKemiskinanEkstrem.data.ke_jenis_pekerjaan_individu.reduce(
            (acc, item) => {
              if (item.key && item.value !== undefined) {
              acc[0].push(item.value);
              acc[1].push(item.key);
              }
              return acc;
            },
            [[], []]
          );
        setDataChartJenisPekerjaanIndividu(resultChartJenisPekerjaanIndividu);

        const resultChartIndividuMiskinEkstremDesil1Provinsi =
        dataKemiskinanEkstrem.data.jumlah_individu_miskin_desil1_per_prov.reduce(
          (acc, item) => {
            acc[0].push(item.jumlah_keluarga_desil_1);
            acc[1].push(item.nama_provinsi);
            return acc;
          },
          [[], []]
        );
      setDataChartIndividuMiskinEkstremDesil1Provinsi(
        resultChartIndividuMiskinEkstremDesil1Provinsi
      );

      const resultChartIndividuMiskinEkstremDesil1Kabupaten =
          dataKemiskinanEkstrem.data.jumlah_individu_miskin_desil1_per_kabkota.reduce(
            (acc, item) => {
              acc[0].push(item.jumlah_keluarga_desil_1);
              acc[1].push(item.nama_provinsi);
              return acc;
            },
            [[], []]
          );
        setDataChartIndividuMiskinEkstremDesil1KabupatenKota(
          resultChartIndividuMiskinEkstremDesil1Kabupaten
        );

        const resultChartKeluargaMiskinEkstremDesil1Provinsi =
          dataKemiskinanEkstrem.data.jumlah_keluarga_miskin_desil1_per_prov.reduce(
            (acc, item) => {
              acc[0].push(item.jumlah_keluarga_desil_1);
              acc[1].push(item.nama_provinsi);
              return acc;
            },
            [[], []]
          );
        setDataChartKeluargaMiskinEkstremDesil1Provinsi(
          resultChartKeluargaMiskinEkstremDesil1Provinsi
        );

        const resultChartKeluargaMiskinEkstremDesil1Kabupaten =
          dataKemiskinanEkstrem.data.jumlah_keluarga_miskin_desil1_per_kabkota.reduce(
            (acc, item) => {
              acc[0].push(item.jumlah_keluarga_desil_1);
              acc[1].push(item.nama_provinsi);
              return acc;
            },
            [[], []]
          );
        setDataChartKeluargaMiskinEkstremDesil1KabupatenKota(
          resultChartKeluargaMiskinEkstremDesil1Kabupaten
        );

        const resultChartKepalaKeluargaPerempuan =
          dataKemiskinanEkstrem.data.ke_kategori_umur_kepala_keluarga_perempuan.reduce(
            (acc, item) => {
              if (item.key && item.value !== undefined) {
              acc[0].push(item.value);
              acc[1].push(item.key);
              }
              return acc;
            },
            [[], []]
          );
        setDataChartKepalaKeluargaPerempuan(resultChartKepalaKeluargaPerempuan);

        const resultChartIndividuMiskinEkstremProvinsi =
          dataKemiskinanEkstrem.data.ke_jumlah_individu_per_provinsi.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.key);
              return acc;
            },
            [[], []]
          );
        console.log(resultChartIndividuMiskinEkstremProvinsi, "iiniii");
        setDataChartIndividuMiskinEkstremProvinsi(
          resultChartIndividuMiskinEkstremProvinsi
        );

        const resultChartIndividuMiskinEkstremKabupaten =
          dataKemiskinanEkstrem.data.ke_jumlah_individu_per_kabkota.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.key);
              return acc;
            },
            [[], []]
          );
        setDataChartIndividuMiskinEkstremKabupatenKota(
          resultChartIndividuMiskinEkstremKabupaten
        );

        const resultChartKeluargaMiskinEkstremProvinsi =
          dataKemiskinanEkstrem.data.ke_jumlah_ke_per_provinsi.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.key);
              return acc;
            },
            [[], []]
          );
        setDataChartKeluargaMiskinEkstremProvinsi(
          resultChartKeluargaMiskinEkstremProvinsi
        );

        const resultChartKeluargaMiskinEkstremKabupaten =
          dataKemiskinanEkstrem.data.ke_jumlah_ke_per_kabkota.data.reduce(
            (acc, item) => {
              acc[0].push(item.value);
              acc[1].push(item.key);
              return acc;
            },
            [[], []]
          );
        setDataChartKeluargaMiskinEkstremKabupatenKota(
          resultChartKeluargaMiskinEkstremKabupaten
        );

        // const resultPiePerbandingan = dataKemiskinanEkstrem.data.pie_spm_ke.map(item => item.total_rincian)
        const resultPiePerbandingan = [dataKemiskinanEkstrem.data.pie_spm_ke.jml_rincian_total_anggaran_spm_kemiskinan_ekstrem, dataKemiskinanEkstrem.data.pie_spm_ke.jml_rincian_dluar_anggaran_spm_kemiskinan_ekstrem]
        setDataPieChartSpm(resultPiePerbandingan)        

      } catch (errorKemiskinanEkstrem) {
        setErrorKemiskinanEkstrem(errorKemiskinanEkstrem);
      } finally {
        setLoadingKemiskinanEkstrem(false);
      }
    };
    fetchData();
  };
  const [dataShowKeluargaDesil1, setDataShowKeluargaDesil1] = useState(false);
  const [dataShowIndividuDesil1, setDataShowIndividuDesil1] = useState(false);
  const [titleMap, setTitleMap] = useState("Keluarga Desil 1")
  const [valueMap, setValueMap] = useState([]);
  const [maxValueMap, setmaxValueMap] = useState(0)
  const [dataWidth, setDataWidth] = useState(6)  
  const [roam, setRoam] = useState(false);
  const [dataDesil, setDataDesil] = useState({}); 

  const [selectedDesil, setSelectedDesil] = useState("1"); // State untuk menyimpan pilihan dropdown
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const selectedValue = value;
    console.log(selectedValue, 'ini selected vlue')
    setSelectedDesil(selectedValue); // Update state dengan pilihan yang dipilih
    if(selectedValue <= "4"){
      setTitleMap(`Keluarga ${name} ${value}`)
    }else{
      setTitleMap(`Individu ${name} ${value-4}`)
    }
  
    // Ambil data desil yang sesuai dan update valueMap
    const selectedData = dataDesil[`desil${selectedValue}`]; // Ambil data sesuai pilihan
    console.log(selectedData, 'ini');

    if (Array.isArray(selectedData) && selectedData.length > 0) {
      setValueMap(selectedData);
      const maxValue = Math.max(...selectedData.map(item => item.value || 0));
      setmaxValueMap(maxValue);
    } else {
      setValueMap([]);
      setmaxValueMap(0); // Set nilai default jika selectedData tidak valid
}
  };

  const handleShowDataKeluargaDesil1 = (value) => {
    setDataShowKeluargaDesil1(value);
  };
  
  const handleShowDataIndividuDesil1 = (value) => {
    setDataShowIndividuDesil1(value);
  };
  const [dataMiskinEkstremTabel, setDataMiskinEkstremTabel] = useState([],[]);
  const [filteredDataMiskinEkstremTabel, setFilteredDataMiskinEkstremTabel] = useState([]); // Data hasil filter
  const [filteredDataMiskinEkstremTabelKabupaten, setFilteredDataMiskinEkstremTabelKabupaten] = useState([]); // Data hasil filter
  
  const getDataMiskinEkstremTabel = ({tahun, tahun_data}) => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            tahun: tahun,
            tahun_data: tahun_data
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_ke_seprovinsi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        } 

        const dataMiskinEkstremTabel = await response.json();

        setShowNextData(false)        
        setDataMiskinEkstremTabel(dataMiskinEkstremTabel?.data);
        setFilteredDataMiskinEkstremTabel(dataMiskinEkstremTabel?.data)
        setCurrentPage(1)
        setDataKolomNamaDaerah("Se-Provinsi")
        
        const dataDesil = {
          desil1: Array.isArray(dataMiskinEkstremTabel?.data)
            ? dataMiskinEkstremTabel.data.map(item => ({
                name: item.nama_prov || "Unknown",
                value: parseInt(item.jumlah_keluarga_desil_1) || 0,
              }))
            : [],
          desil2: Array.isArray(dataMiskinEkstremTabel?.data)
            ? dataMiskinEkstremTabel.data.map(item => ({
                name: item.nama_prov || "Unknown",
                value: parseInt(item.jumlah_keluarga_desil_2) || 0,
              }))
            : [],
          desil3: Array.isArray(dataMiskinEkstremTabel?.data)
            ? dataMiskinEkstremTabel.data.map(item => ({
                name: item.nama_prov || "Unknown",
                value: parseInt(item.jumlah_keluarga_desil_3) || 0,
              }))
            : [],
          desil4: Array.isArray(dataMiskinEkstremTabel?.data)
            ? dataMiskinEkstremTabel.data.map(item => ({
                name: item.nama_prov || "Unknown",
                value: parseInt(item.jumlah_keluarga_desil_4) || 0,
              }))
            : [],
          desil5: Array.isArray(dataMiskinEkstremTabel?.data)
            ? dataMiskinEkstremTabel.data.map(item => ({
                name: item.nama_prov || "Unknown",
                value: parseInt(item.jumlah_individu_desil_1) || 0,
              }))
            : [],
          desil6: Array.isArray(dataMiskinEkstremTabel?.data)
            ? dataMiskinEkstremTabel.data.map(item => ({
                name: item.nama_prov || "Unknown",
                value: parseInt(item.jumlah_individu_desil_2) || 0,
              }))
            : [],
          desil7: Array.isArray(dataMiskinEkstremTabel?.data)
            ? dataMiskinEkstremTabel.data.map(item => ({
                name: item.nama_prov || "Unknown",
                value: parseInt(item.jumlah_individu_desil_3) || 0,
              }))
            : [],
          desil8: Array.isArray(dataMiskinEkstremTabel?.data)
            ? dataMiskinEkstremTabel.data.map(item => ({
                name: item.nama_prov || "Unknown",
                value: parseInt(item.jumlah_individu_desil_4) || 0,
              }))
            : [],
        };
        
        // Simpan data ke state
        setDataDesil(dataDesil);
        
        // Setel data awal untuk peta berdasarkan desil pertama
        setValueMap(dataDesil?.desil1);
        
        // Cari nilai maksimum pada desil pertama
        const maxValueDesil1 = dataDesil?.desil1.reduce((max, item) => Math.max(max, item.value || 0), 0);
        setmaxValueMap(maxValueDesil1 || 0);
        
      } catch (errorKemiskinanEkstrem) {
        setErrorKemiskinanEkstrem(errorKemiskinanEkstrem);
      } finally {
        setLoadingKemiskinanEkstrem(false);
      }
    };
    fetchData();
  };

  const [dataMiskinEkstremTabelKab, setDataMiskinEkstremTabelKab] = useState([],[]);
  const [dataKolomNamaDaerah, setDataKolomNamaDaerah] = useState("Se-Provinsi");
  const [showNextData, setShowNextData] = useState(false);
  
  const getDataMiskinEkstremTabelKab = (kodeDdn="", e, tahun, tahun_data) => {
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
          }),
        };

        const response = await fetch(
          `${API_URI_RBAC}/v2/tabel_ke_kabkota`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        } 

        const dataMiskinEkstremTabelKab = await response.json();
        
        e.stopPropagation(); // Mencegah event bubbling jika dibutuhkan
        setShowNextData(true); // Mengatur state agar class 'test' dihilangkan dari semua elemen

        setDataKolomNamaDaerah("Nama Daerah")
        setCurrentPage(1)

        setDataMiskinEkstremTabel(dataMiskinEkstremTabelKab?.data);
        setFilteredDataMiskinEkstremTabelKabupaten(dataMiskinEkstremTabelKab?.data)
        
      } catch (errorKemiskinanEkstrem) {
        setErrorKemiskinanEkstrem(errorKemiskinanEkstrem);
      } finally {
        setLoadingKemiskinanEkstrem(false);
      }
    };
    fetchData();
  };

  const [dataDetailAnggaran, setDataDetailAnggaran] = useState([])
  const [dataDetailAnggaranSub, setDataDetailAnggaranSub] = useState([]);
  const [dataDetailAnggaranFiltered, setDataDetailAnggaranFiltered] = useState([])
  const [dataDetailAnggaranSubFiltered, setDataDetailAnggaranSubFiltered] = useState([]);
  const [dataDetailAnggaranSubSubFiltered, setDataDetailAnggaranSubSubFiltered] = useState([]);
  const [dataDetailHighlight, setDataDetailHighlight] = useState([])
  const [loadingDetailAnggaran, setLoadingDetailAnggaran] = useState([]);
  const [errorDetailAnggaran, setErrorDetailAnggaran] = useState([]);

  const getDataDetailAnggaran = (kodeSeProvinsi="", kodeDdnKabupaten="", kodeDdnProvinsi="", kodeSubGiat="", tahun, tahun_data) => {
    const fetchData = async () => {
      setLoadingDetailAnggaran(true); // Set loading state to true when starting the fetch
      try {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-sipdhub": `${token.token}` },
          body: JSON.stringify({
            kode_prov: kodeSeProvinsi,
            kode_ddn: kodeDdnKabupaten !=""? kodeDdnKabupaten : kodeDdnProvinsi,
            kode_sub_giat: kodeSubGiat,
            tahun: tahun,
            tahun_data: tahun_data
          }),
        };
  
        const response = await fetch(
          `${API_URI_RBAC}/v2/detail-tabel-ke`,
          requestOptions
        );
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const dataDetailAnggaran = await response.json();
      
        if (kodeDdnProvinsi != "" && kodeSubGiat == "") {        
          setDataDetailAnggaran(dataDetailAnggaran.data.detail_tabel_ke_subgiat);
          setDataDetailAnggaranFiltered(dataDetailAnggaran.data.detail_tabel_ke_subgiat);
          setModall(true);
        }else if (kodeDdnKabupaten != "" && kodeSubGiat == ""){
          setDataDetailAnggaran(dataDetailAnggaran.data.detail_tabel_ke_subgiat);
          setDataDetailAnggaranFiltered(dataDetailAnggaran.data.detail_tabel_ke_subgiat);
          setModall(true);
        }      

        if(kodeDdnProvinsi != "" && kodeSubGiat != ""){
          setDataDetailAnggaranSub(dataDetailAnggaran.data.detail_tabel_ke_sro);
          setDataDetailAnggaranSubFiltered(dataDetailAnggaran.data.detail_tabel_ke_sro);
          setModal(true)
        }else if(kodeDdnKabupaten != "" && kodeSubGiat !=""){
          setDataDetailAnggaranSub(dataDetailAnggaran.data.detail_tabel_ke_sro);
          setDataDetailAnggaranSubFiltered(dataDetailAnggaran.data.detail_tabel_ke_sro);
          setModal(true)
        }
        
        setCurrentPageDetail(1)
        setCurrentPageDetailSub(1)
        setDataDetailHighlight(dataDetailAnggaran.data.ke_highlight)
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
  const [loadingDetailAnggaranSub, setLoadingDetailAnggaranSub] = useState([]);
  const [errorDetailAnggaranSub, setErrorDetailAnggaranSub] = useState([]);

  const getDataDetailAnggaranSubSub = ({kodeDdn, kodeSubGiat, kodeSro, tahun}) => {
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
          `${API_URI_RBAC}/v2/ke_ssro_provkabkota`,
          requestOptions
        );
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const dataDetailAnggaranSub = await response.json();
        dataDetailAnggaranSubSub(dataDetailAnggaranSub?.data)
        setDataDetailAnggaranSubSubFiltered(dataDetailAnggaranSub?.data)
      } catch (errorDetailAnggaran) {
        setErrorDetailAnggaran(errorDetailAnggaran);
      } finally {
        setLoadingDetailAnggaran(false);
      }
    };
  
    fetchData();
  };

  useEffect(() => {
    getDataKemiskinanEkstrem({tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData});
    // getDataKemiskinanEkstremTahun("2024");
    getDataMiskinEkstremTabel({tahun: selectedSingleTahunAnggaran, tahun_data: selectedSingleTahunData});
    // getDataMiskinEkstremTabelKab()
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageKab, setCurrentPageKab] = useState(1);
  const [currentPageDetail, setCurrentPageDetail] = useState(1);
  const [currentPageDetailSub, setCurrentPageDetailSub] = useState(1);
  const [currentPageDetailSubSub, setCurrentPageDetailSubSub] = useState(1);
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

  const indexOfLastItemDetailSubSub = currentPageDetailSubSub * itemsPerPage;
  const indexOfFirstItemDetailSubSub = indexOfLastItemDetailSubSub - itemsPerPage;
  
  const sortedItems = React.useMemo(() => {
    let sortableItems = [...((showNextData ? filteredDataMiskinEkstremTabelKabupaten : filteredDataMiskinEkstremTabel) || [])];
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
  }, [showNextData ? filteredDataMiskinEkstremTabelKabupaten : filteredDataMiskinEkstremTabel, sortConfig]);

  const sortedItemsKab = React.useMemo(() => {
    let sortableItems = [...(dataMiskinEkstremTabelKab || [])];
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
  }, [dataMiskinEkstremTabelKab, sortConfig]);

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
  
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemsKab = sortedItemsKab.slice(indexOfFirstItemKab, indexOfLastItemKab);
  const currentItemDetail = sortedItemsDetail.slice(indexOfFirstItemDetail, indexOfLastItemDetail);
  const currentItemDetailSub = sortedItemsDetailSub.slice(indexOfFirstItemDetailSub, indexOfLastItemDetailSub);
  const currentItemDetailSubSub = sortedItemsDetailSubSub.slice(indexOfFirstItemDetailSubSub, indexOfLastItemDetailSubSub);

  const totalPages = Math.ceil(((showNextData ? filteredDataMiskinEkstremTabelKabupaten?.length : filteredDataMiskinEkstremTabel?.length)|| 0) / itemsPerPage);
  const totalPagesKab = Math.ceil((dataMiskinEkstremTabelKab?.length || 0) / itemsPerPage);
  const totalPagesDetail = Math.ceil((setDataDetailAnggaranFiltered?.length || 0) / itemsPerPage);
  const totalPagesDetailSub = Math.ceil((dataDetailAnggaranSubFiltered?.length || 0) / itemsPerPage);
  const totalPagesDetailSubSub = Math.ceil((dataDetailAnggaranSubSubFiltered?.length || 0) / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateKab = (pageNumber) => setCurrentPageKab(pageNumber);
  const paginateDetail = (pageNumber) => setCurrentPageDetail(pageNumber);
  const paginateDetailSub = (pageNumber) => setCurrentPageDetailSub(pageNumber);
  const paginateDetailSubSub = (pageNumber) => setCurrentPageDetailSubSub(pageNumber);
  
  const placeholders = Array.from(
    { length: itemsPerPage - currentItems.length },
    (_, index) => (
      <tr key={`placeholder-${index}`}>
        <td
          colSpan="14"
          style={{ height: "44px", backgroundColor: "#f9f9f9" }}
        ></td>
      </tr>
    )
  );

  const [dataShowIndividu, setDataShowIndividu] = useState(false);
  const [dataShowKomposisiBelanja, setDataShowKomposisiBelanja] =
    useState(false);
  const [dataShowAlokasi, setDataShowAlokasi] = useState(false);

  const handleShowDataIndividu = (value) => {
    setDataShowIndividu(value);
  };
  const handleShowDataKomposisiBelanja = (value) => {
    setDataShowKomposisiBelanja(value);
  };

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
  const [modalSub, setModalSub] = useState(false)
  const [dataRincianDetail, setDataRincianDetail] = useState(0)
  const [dataRincianDetailSub, setDataRincianDetailSub] = useState(0)
  const [dataRincianDetailSubSub, setDataRincianDetailSubSub] = useState(0);
  const [dataJenisPemda, setDataJenisPemda] = useState("")
  const [dataDetailNamaDaerah, setDataDetailNamaDaerah] = useState('')
  const handleOpen = (kodeProv="",  namaDaerah="", kodeDdnKab="", kodeDdnProv="", jenisPemda="", rincianDetail= 0) => {
    getDataDetailAnggaran(kodeProv, kodeDdnKab, kodeDdnProv, "", selectedSingleTahunAnggaran, selectedSingleTahunData)      

    if(jenisPemda=="prov"){
      setDataJenisPemda("prov")
    }else if(jenisPemda=="kab"){
      setDataJenisPemda("kab")
    }else if(jenisPemda=="kota"){
      setDataJenisPemda("kota")        
    }else{
      setDataJenisPemda("seProv")
    }
    setDataRincianDetail(rincianDetail)
    setDataDetailNamaDaerah(namaDaerah)
    setCardHead(null)
  }

  const [cardhead, setCardHead] = useState()
  const [namaDaerahDetail, setNamaDaerahDetail] = useState("")
  const [namaSubGiat, setNamaSubGiat] = useState("")
  const [namaSro, setNamaSro] = useState("")
  

  const handleOpenNextModal = (kodeDaerah="", kodeSubGiat="", kodeDdnProv="", kodeDdnKab="", rincianDetail= 0, namaSubGiat="") => {

    if(kodeDaerah != "") {
      getDataDetailAnggaran(kodeDaerah, "", "", kodeSubGiat, selectedSingleTahunAnggaran, selectedSingleTahunData)      
    }else if(kodeDdnProv != "") {
      getDataDetailAnggaran("", "", kodeDdnProv, kodeSubGiat, selectedSingleTahunAnggaran, selectedSingleTahunData)
    }else if(kodeDdnKab != "") {
      getDataDetailAnggaran("", kodeDdnKab, "", kodeSubGiat, selectedSingleTahunAnggaran, selectedSingleTahunData)
    }

    // setModal(true)
    setDataRincianDetailSub(rincianDetail)
    setNamaSubGiat(namaSubGiat)
    setCardHead(null)
  }

  const handleOpenNextModalSub = ({kodeDdn, kodeSubGiat, kodeSro,tahun,rincianDetail,namaSro}) => {
    getDataDetailAnggaranSubSub({kodeDdn:kodeDdn, kodeSubGiat:kodeSubGiat, kodeSro:kodeSro, tahun:tahun})
    setNamaSro(namaSro)
    setDataRincianDetailSubSub(rincianDetail)
    setModalSub(true)
    setCardHead(null)
  }
  
  const handleCloseNextModalSub = () => {
    setModalSub(false)
  }

  const handleCloseNextModal = () => {
    setModal(false)
  }


  const handleClose = () => {
    setModall(false); // Close modal by setting modall to false
  };

  const [searchTerm, setSearchTerm] = useState(""); // State untuk menampung nilai input search
  const [searchTermDetail, setSearchTermDetail] = useState(""); // State untuk menampung nilai input search
  const [searchTermDetailSub, setSearchTermDetailSub] = useState(""); // State untuk menampung nilai input search
  const [searchTermDetailSubSub, setSearchTermDetailSubSub] = useState(""); // State untuk menampung nilai input search
    const handleSearchInput = (e) => {
      const value = e.target.value.toLowerCase();
      setSearchTerm(value);
      if (value === "") {
        if(showNextData){
          setFilteredDataMiskinEkstremTabelKabupaten(dataMiskinEkstremTabel)
        }else{
          setFilteredDataMiskinEkstremTabel(dataMiskinEkstremTabel);
        }
      } else {
        // Filter data berdasarkan input
        const filtered = dataMiskinEkstremTabel.filter((item) => {
          if(showNextData){
            return item.nama_daerah.toLowerCase().includes(value)
          }else{
            return item.nama_prov.toLowerCase().includes(value)
          }
        }
        );
        showNextData ? setFilteredDataMiskinEkstremTabelKabupaten(filtered) : setFilteredDataMiskinEkstremTabel(filtered)
      }
    };
  
    const handleButtonClick = (area) => {
      setCurrentPage(1);
    };
  
    const handleClearSearch = (area = "") => {
      showNextData ? setFilteredDataMiskinEkstremTabelKabupaten(dataMiskinEkstremTabel) : setFilteredDataMiskinEkstremTabel(dataMiskinEkstremTabel)
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
    };
    
    const handleClearSearchDetailSub = (area = "") => {
      setDataDetailAnggaranSubFiltered(dataDetailAnggaranSub)
      setCurrentPageDetailSub(1);
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

  const [selectedSingleTahunAnggaran, setSelectedSingleTahunAnggaran] = useState('2025'); // Set default value
  const [selectedSingleTahunData, setselectedSingleTahunData] = useState('2024'); // Set default value
  
  const handleSelectChangeAnggaran = (e) => {
    const { name, value } = e.target;
    setSelectedSingleTahunAnggaran(value); // Misalnya, untuk dropdown tahun
    getDataKemiskinanEkstrem({tahun: value, tahun_data:selectedSingleTahunData})
    getDataMiskinEkstremTabel({tahun: value, tahun_data:selectedSingleTahunData});
  };

  const handleSelectChangeDataPokok = (e) => {
    const { name, value } = e.target;
    setselectedSingleTahunData(value); // Misalnya, untuk dropdown tahun
    getDataKemiskinanEkstrem({tahun: selectedSingleTahunAnggaran, tahun_data: value})
    getDataMiskinEkstremTabel({tahun: selectedSingleTahunAnggaran, tahun_data: value});
  };

  const handleRegionClick = (kodeProv, namaProv) => {
    // getDataDapodik({kodeDdn: kodeProv})
    // getDataAnakSekolah({kodeWilayah: kodeProv})
    // setClickNamaDaerah(namaProv)
    // setClickDaerah(true)
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
                  <img src={logoKemenkoPmk} alt="" width="40" height="40" />
                </span>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>KEMISKINAN EKSTREM</span>
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
              onChange={handleSelectChange}
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
              </div>
              
              <div className="d-flex nav-beranda">
                  <div className="d-flex justify-content-center align-items-center" style={{ fontSize: "14px", fontWeight:600, fontFamily: "poppins" }}>
                    Penanganan Miskin Ekstrem:
                  </div>
                  <select
                    name="Desil"
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
                    <option value="1">KELUARGA DESIL 1</option>
                    <option value="2">KELUARGA DESIL 2</option>
                    <option value="3">KELUARGA DESIL 3</option>
                    <option value="4">KELUARGA DESIL 4</option>
                    <option value="5">INDIVIDU DESIL 1</option>
                    <option value="6">INDIVIDU DESIL 2</option>
                    <option value="7">INDIVIDU DESIL 3</option>
                    <option value="8">INDIVIDU DESIL 4</option>
                    </select>
                </div>
              </div>
              <MapIndoChart roam={roam} maxValue={maxValueMap} valueSeries={valueMap} onRegionClick={handleRegionClick} colorData={["#D1ED87","#B9D676","#A1BF66","#89A855","#719145","#597A34"]} />
            </CardBody>
          </Card>
        </Col>
        <Col md={dataWidth}>
          {/* <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  Top 5 Se-Provinsi Dengan Anggaran Untuk Penanganan Kemiskinan
                  Ekstrem Tertinggi
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
                        active: customActiveTabChartTop === "1",
                      })}
                      onClick={() => {
                        toggleCustomChartTop("1");
                      }}
                    >
                      TOP 5
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: customActiveTabChartTop === "2",
                      })}
                      onClick={() => {
                        toggleCustomChartTop("2");
                      }}
                    >
                      BOTTOM 5
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent
                activeTab={customActiveTabChartTop}
                className="text-muted"
              >
                <TabPane tabId="1" id="provinsi">
                  <HorizontalBarChart
                    valueChart={dataChartTop5AnggaranKemiskinanEkstrem[0]}
                    categoryChart={dataChartTop5AnggaranKemiskinanEkstrem[1]}
                    dataColors='["#FBAD25"]'
                  />
                </TabPane>
                <TabPane tabId="2" id="kabupaten">
                  <HorizontalBarChart
                    valueChart={dataChartBottom5AnggaranKemiskinanEkstrem[0]}
                    categoryChart={dataChartBottom5AnggaranKemiskinanEkstrem[1]}
                    dataColors='["#FBAD25"]'
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card> */}
          <Card className="card-height-100">
            <CardBody>
              <div className="separator mb-2">
                <h4 className="card-title">
                  Perbandingan Total Anggaran Untuk Penanganan Miskin Ekstrem
                  Berdasarkan Total Belanja {customActiveTitleAnggaran}
                </h4>
              </div>
              <Row>
                <Col>
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
                            setCustomActiveTitleAnggaran("Nasional");
                          }}
                        >
                          NASIONAL
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
                            setCustomActiveTitleAnggaran("Provinsi");
                          }}
                        >
                          PROVINSI
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
                            setCustomActiveTitleAnggaran("Kabupaten");
                          }}
                        >
                          KABUPATEN
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
                            setCustomActiveTitleAnggaran("Kota");
                          }}
                        >
                          KOTA
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTab}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      <Row>
                        <Col md={6}>
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
                                              dataKemiskinanEkstrem?.ke_total_belanja_nasional /
                                              1000000000000
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
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Card className="card-animate">
                                <CardBody>
                                  <div className="d-flex flex-column title-custom-card mb-2">
                                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                      <span>
                                        ANGGARAN PENANGANAN KEMISKINAN EKSTREM
                                        NASIONAL
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
                                              dataKemiskinanEkstrem?.ke_anggaran_nasional /
                                              1000000000000
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
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <PieChartNew
                            dataChart={[
                              dataKemiskinanEkstrem?.ke_total_belanja_nasional-dataKemiskinanEkstrem?.ke_anggaran_nasional,
                              dataKemiskinanEkstrem?.ke_anggaran_nasional,
                            ]}
                            dataColors={'["#2DAED4", "#FCAD24"]'}
                            categoryName={[
                              "Total Belanja Nasional",
                              "Anggaran Penanganan Kemiskinan Ekstrem Nasional",
                            ]}
                            pieChart={false}
                            showLegend={false}
                            percentOnly={true}
                            legendHorizontal={true}
                            heightChart="350px"
                          />
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      <Row>
                        <Col md={6}>
                          <Row>
                            <Col>
                              <Card className="card-animate">
                                <CardBody>
                                  <div className="d-flex flex-column title-custom-card mb-2">
                                    <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                      <span>Total Belanja Provinsi</span>
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
                                              dataKemiskinanEkstrem?.ke_total_belanja_provinsi /
                                              1000000000000
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
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Card className="card-animate">
                                <CardBody>
                                  <div className="d-flex flex-column title-custom-card mb-2">
                                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                      <span
                                        // style={{
                                        //   fontSize: "16px",
                                        //   fontWeight: "600",
                                        // }}
                                      >
                                        ANGGARAN PENANGANAN KEMISKINAN EKSTREM
                                        PROVINSI
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
                                              dataKemiskinanEkstrem?.ke_anggaran_provinsi /
                                              1000000000000
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
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <PieChartNew
                            dataChart={[
                              dataKemiskinanEkstrem?.ke_total_belanja_provinsi-dataKemiskinanEkstrem?.ke_anggaran_provinsi,
                              dataKemiskinanEkstrem?.ke_anggaran_provinsi,
                            ]}
                            dataColors={'["#2DAED4", "#FCAD24"]'}
                            categoryName={[
                              "Total Belanja Provinsi",
                              "Anggaran Penanganan Kemiskinan Ekstrem Provinsi",
                            ]}
                            pieChart={false}
                            showLegend={false}
                            percentOnly={true}
                            legendHorizontal={true}
                            heightChart="350px"
                          />
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3" id="kabupaten">
                      {/* <StackedKab dataColors='["#2DAED4", "#57E7B4"]' /> */}
                      <Row>
                        <Col md={6}>
                          <Row>
                            <Col>
                              <Card className="card-animate">
                                <CardBody>
                                  <div className="d-flex flex-column title-custom-card">
                                    <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                      <span>Total Belanja Kabupaten</span>
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
                                              dataKemiskinanEkstrem
                                                ?.total_anggaran_kab?.value /
                                                1000000000000
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
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Card className="card-animate">
                                <CardBody>
                                  <div className="d-flex flex-column title-custom-card">
                                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                      <span>
                                        ANGGARAN PENANGANAN KEMISKINAN EKSTREM
                                        KABUPATEN
                                      </span>
                                      {/* <span className="title-percent">{dataJumlahPenduduk.persenLaki}</span> */}
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
                                              dataKemiskinanEkstrem
                                                ?.total_anggaran_kab_kemiskinan_ekstrim
                                                ?.value / 1000000000000
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
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <PieChartNew
                            dataChart={[
                              dataKemiskinanEkstrem?.total_anggaran_kab?.value-dataKemiskinanEkstrem
                              ?.total_anggaran_kab_kemiskinan_ekstrim?.value,
                              dataKemiskinanEkstrem
                                ?.total_anggaran_kab_kemiskinan_ekstrim?.value,
                            ]}
                            dataColors={'["#2DAED4", "#FCAD24"]'}
                            categoryName={[
                              "Total Belanja Kabupaten",
                              "Anggaran Penanganan Kemiskinan Ekstrem Kabupaten",
                            ]}
                            pieChart={false}
                            showLegend={false}
                            percentOnly={true}
                            legendHorizontal={true}
                            heightChart="350px"
                          />
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="4" id="kabupaten">
                      {/* <StackedKab dataColors='["#2DAED4", "#57E7B4"]' /> */}
                      <Row>
                        <Col md={6}>
                          <Row>
                            <Col>
                              <Card className="card-animate">
                                <CardBody>
                                  <div className="d-flex flex-column title-custom-card">
                                    <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                      <span>Total Belanja Kota</span>
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
                                              dataKemiskinanEkstrem
                                                ?.total_anggaran_kota?.value /
                                                1000000000000
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
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Card className="card-animate">
                                <CardBody>
                                  <div className="d-flex flex-column title-custom-card">
                                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                                      <span>
                                        ANGGARAN PENANGANAN KEMISKINAN EKSTREM
                                        Kota
                                      </span>
                                      {/* <span className="title-percent">{dataJumlahPenduduk.persenLaki}</span> */}
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
                                              dataKemiskinanEkstrem
                                                ?.total_anggaran_kota_kemiskinan_ekstrim
                                                ?.value / 1000000000000
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
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={6}>
                          <PieChartNew
                            dataChart={[
                              dataKemiskinanEkstrem?.total_anggaran_kota?.value- dataKemiskinanEkstrem
                              ?.total_anggaran_kota_kemiskinan_ekstrim?.value,
                              dataKemiskinanEkstrem
                                ?.total_anggaran_kota_kemiskinan_ekstrim?.value,
                            ]}
                            dataColors={'["#2DAED4", "#FCAD24"]'}
                            categoryName={[
                              "Total Belanja Kabupaten",
                              "Anggaran Penanganan Kemiskinan Ekstrem Kabupaten",
                            ]}
                            pieChart={false}
                            showLegend={false}
                            percentOnly={true}
                            legendHorizontal={true}
                            heightChart="350px"
                          />
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                  {/* disini nav link nya */}
                </Col>
              </Row>
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
                            active:
                              customActiveTabTabelDaerah ===
                              "1",
                          })}
                          onClick={() => {
                            toggleCustomTabelDaerah("1");
                          }}
                        >
                          {dataKolomNamaDaerah == "Se-Provinsi" ? "NASIONAL" : `Se-${namaDaerahDetail}`}
                        </NavLink>
                      </NavItem>
                      {/* <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active:
                              customActiveTabTabelDaerah ===
                              "2",
                          })}
                          onClick={() => {
                            toggleCustomTabelDaerah("2");
                          }}
                        >
                          KABUPATEN/KOTA
                        </NavLink>
                      </NavItem> */}
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
                    {showNextData ? (<><button style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginBottom: "8px"
                      }} onClick={()=> {getDataMiskinEkstremTabel({tahun: selectedSingleTahunAnggaran, tahun_data:selectedSingleTahunData}); setSearchTerm("")}}>Kembali ke Provinsi</button></>) : (<></>)}         
                    <div style={{ overflowX: "auto" }}>
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
                              textAlign: "center"
                            }}
                          >
                            No
                          </th>
                          <th
                            rowSpan="2"
                            
                            style={{
                              cursor: "pointer",
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          onClick={() => {dataKolomNamaDaerah == "Se-Provinsi" ? requestSort("kode_prov") : requestSort("kode_ddn")} }
                    >                      
                      {dataKolomNamaDaerah} {dataKolomNamaDaerah == "Se-Provinsi" ? getSortIcon("kode_prov") : getSortIcon("kode_ddn")}
                          </th>
                          <th
                            colSpan="5"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                            }}
                          >
                            Keluarga
                          </th>
                          <th colSpan="5" style={{ textAlign: "center"}}>
                            Individu
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            }}
                            onClick={() => requestSort("total_anggaran")}
                          >
                            Total Anggaran (Rp) {getSortIcon("total_anggaran")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            }}
                            onClick={() => requestSort("total_anggaran_kemiskinan")}
                          >
                            Total Anggaran Kemiskinan Ekstrem (Rp) {getSortIcon("total_anggaran_kemiskinan")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            }}
                            onClick={() => requestSort("persentase_anggaran")}
                          >
                            Persentase {getSortIcon("persentase_anggaran")}
                          </th>
                          {dataKolomNamaDaerah=="Se-Provinsi" ? (<></>) : (<><th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",   
                              whiteSpace: "normal",
                              overflowWrap: "break-word",                         
                            }}                          
                            >
                              Detail Anggaran Kemiskinan Ekstrem 
                          </th></>)}                          
                        </tr>
                        <tr>                      
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_all")}
                            style={{ cursor: "pointer" }}
                          >
                            Jumlah {getSortIcon("jumlah_keluarga_desil_all")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_1")}                            
                          >
                            Desil 1 {getSortIcon("jumlah_keluarga_desil_1")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_2")}
                            style={{ cursor: "pointer" }}
                          >
                            Desil 2 {getSortIcon("jumlah_keluarga_desil_2")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_3")}
                            style={{ cursor: "pointer" }}
                          >
                            Desil 3 {getSortIcon("jumlah_keluarga_desil_3")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_4")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                            }}
                          >
                            Desil 4 {getSortIcon("jumlah_keluarga_desil_4")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_all")}
                            style={{ cursor: "pointer" }}
                          >
                            Jumlah {getSortIcon("jumlah_individu_desil_all")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_1")}                            
                          >
                            Desil 1 {getSortIcon("jumlah_individu_desil_1")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_2")}
                            style={{ cursor: "pointer" }}
                          >
                            Desil 2 {getSortIcon("jumlah_individu_desil_2")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_3")}
                            style={{ cursor: "pointer" }}
                          >
                            Desil 3 {getSortIcon("jumlah_individu_desil_3")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_4")}
                            style={{
                              cursor: "pointer",                              
                            }}
                          >
                            Desil 4 {getSortIcon("jumlah_individu_desil_4")}
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ minHeight: "500px" }}>
                  {currentItems.map((item, index) =>(
                    <tr key={index}>
                    {/* <td>{item.kode_prop}</td> */}
                    <td style={{textAlign: "center",
                        verticalAlign: "middle"}}>
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className={showNextData ? "" : "click-data"} style={{ minWidth: "270px" }} onClick={(e)=> {!showNextData ?  getDataMiskinEkstremTabelKab(item.kode_prov, e, selectedSingleTahunAnggaran, selectedSingleTahunData) : "", !showNextData ? setNamaDaerahDetail(item.nama_prov) : ""; setSearchTerm("")}}>
                      {item.nama_prov ? item.nama_prov.replace("Provinsi ", "") : item.nama_daerah.replace("Provinsi ", "")}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_all
                        ? parseInt(item.jumlah_keluarga_desil_all).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_1
                        ? parseInt(item.jumlah_keluarga_desil_1).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_2
                        ? parseInt(item.jumlah_keluarga_desil_2).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_3
                        ? parseInt(item.jumlah_keluarga_desil_3).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_4
                        ? parseInt(item.jumlah_keluarga_desil_4).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_individu_desil_all
                        ? parseInt(item.jumlah_individu_desil_all).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_individu_desil_1
                        ? parseInt(item.jumlah_individu_desil_1).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_individu_desil_2
                        ? parseInt(item.jumlah_individu_desil_2).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_individu_desil_3
                        ? parseInt(item.jumlah_individu_desil_3).toLocaleString("id-ID")
                        : "-"}
                    </td>    
                    <td>
                      {item.jumlah_individu_desil_4
                        ? parseInt(item.jumlah_individu_desil_4).toLocaleString("id-ID")
                        : "-"}
                    </td>    
                    <td>
                    <span style={{float: "right"}}>
                              {item.total_anggaran
                                ? parseInt(item.total_anggaran).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                              </span>
                    </td>         
                    <td>
                    <span style={{float: "right"}}>
                              {item.total_anggaran_kemiskinan
                                ? parseInt(item.total_anggaran_kemiskinan).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                              </span>
                    </td>         
                    <td>
                    <span style={{float: "right"}}>
                              {item.persentase_anggaran
                                ? `${parseInt(item.persentase_anggaran).toLocaleString(
                                    "id-ID"
                                  )}%`
                                : "-"}
                              </span>
                    </td>
                    {dataKolomNamaDaerah == "Se-Provinsi" ? (<></>) : (<><td style={{textAlign: "center"}}>
                    {/* <button style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }} onClick={()=>handleOpen("", item.nama_daerah, "", item.kode_ddn, "prov")}>Lihat Detail</button>                           
                      */}
                      <i style={{                                            
                      padding: "5px 10px",                      
                      cursor: "pointer",
                      fontSize: "25px"                      
                    }} onClick={()=> dataKolomNamaDaerah=="Se-Provinsi" ? handleOpen("", item.nama_daerah, "", item.kode_ddn, "prov", item.total_anggaran_kemiskinan) : handleOpen("", item.nama_daerah, item.kode_ddn, "", "kab", item.total_anggaran_kemiskinan)} className="bx bx-list-ul text-primary"></i>                                                                                
                    </td></>)}      
                    
                  </tr>
                  ))}
                  {/* {placeholders} */}
                </tbody>
            </table>
            </div>            
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
                    </TabPane>
                    {/* <TabPane tabId="2">
                    <div style={{ overflowX: "auto" }}>
            <table
                      className="table table-bordered table-nowrap align-middle mb-0"
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
                            Nama Provinsi {getSortIcon("nama_prov")}
                          </th>
                          <th
                            colSpan="5"
                            style={{
                              textAlign: "center",
                              borderRight: "2px solid #A9A9A9",
                            }}
                          >
                            Keluarga
                          </th>
                          <th colSpan="5" style={{ textAlign: "center"}}>
                            Individu
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            }}
                            onClick={() => requestSort("totalanggaran")}
                          >
                            Total Anggaran Kemiskinan Ekstrem (Rp) {getSortIcon("totalanggaran")}
                          </th>
                          <th
                            rowSpan="2"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",   
                              whiteSpace: "normal",
                              overflowWrap: "break-word",                         
                            }}                          
                            >
                              Detail Anggaran Kemiskinan Ekstrem 
                          </th>
                        </tr>
                        <tr>                      
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_all")}
                            style={{ cursor: "pointer" }}
                          >
                            Jumlah {getSortIcon("jumlah_keluarga_desil_all")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_1")}                            
                          >
                            Desil 1 {getSortIcon("jumlah_keluarga_desil_1")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_2")}
                            style={{ cursor: "pointer" }}
                          >
                            Desil 2 {getSortIcon("jumlah_keluarga_desil_2")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_3")}
                            style={{ cursor: "pointer" }}
                          >
                            Desil 3 {getSortIcon("jumlah_keluarga_desil_3")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_keluarga_desil_4")}
                            style={{
                              cursor: "pointer",
                              borderRight: "2px solid #A9A9A9",
                            }}
                          >
                            Desil 4 {getSortIcon("jumlah_keluarga_desil_4")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_all")}
                            style={{ cursor: "pointer" }}
                          >
                            Jumlah {getSortIcon("jumlah_individu_desil_all")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_1")}                            
                          >
                            Desil 1 {getSortIcon("jumlah_individu_desil_1")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_2")}
                            style={{ cursor: "pointer" }}
                          >
                            Desil 2 {getSortIcon("jumlah_individu_desil_2")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_3")}
                            style={{ cursor: "pointer" }}
                          >
                            Desil 3 {getSortIcon("jumlah_individu_desil_3")}
                          </th>
                          <th
                            onClick={() => requestSort("jumlah_individu_desil_4")}
                            style={{
                              cursor: "pointer",                              
                            }}
                          >
                            Desil 4 {getSortIcon("jumlah_individu_desil_4")}
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ minHeight: "500px" }}>
                  {currentItemsKab.map((item, index) =>(
                    <tr key={index}>
                    
                    <td style={{textAlign: "center",
                        verticalAlign: "middle"}}>
                      {indexOfFirstItem + index + 1}
                    </td>                    
                    <td >
                      {" "}
                      {item.nama_daerah || "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_all
                        ? parseInt(item.jumlah_keluarga_desil_all).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_1
                        ? parseInt(item.jumlah_keluarga_desil_1).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_2
                        ? parseInt(item.jumlah_keluarga_desil_2).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_3
                        ? parseInt(item.jumlah_keluarga_desil_3).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_desil_4
                        ? parseInt(item.jumlah_keluarga_desil_4).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_individu_desil_all
                        ? parseInt(item.jumlah_individu_desil_all).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_individu_desil_1
                        ? parseInt(item.jumlah_individu_desil_1).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_individu_desil_2
                        ? parseInt(item.jumlah_individu_desil_2).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_individu_desil_3
                        ? parseInt(item.jumlah_individu_desil_3).toLocaleString("id-ID")
                        : "-"}
                    </td>    
                    <td>
                      {item.jumlah_individu_desil_4
                        ? parseInt(item.jumlah_individu_desil_4).toLocaleString("id-ID")
                        : "-"}
                    </td>    
                    <td>
                    <span style={{float: "right"}}>
                              {item.totalanggaran
                                ? parseInt(item.totalanggaran).toLocaleString(
                                    "id-ID"
                                  )
                                : "-"}
                              </span>
                    </td>         
                    <td style={{textAlign: "center"}}>
                    <button style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }} onClick={()=>handleOpen("", item.nama_daerah, item.kode_ddn, "", "prov")}>Lihat Detail</button>
                    <i style={{                                            
                      padding: "5px 10px",                      
                      cursor: "pointer",
                      fontSize: "25px"
                    }} onClick={()=>handleOpen("", item.nama_daerah, item.kode_ddn, "", "kab", item.totalanggaran)} className="bx bx-list-ul text-primary"></i>
                    </td>                               
                  </tr>
                  ))}
                  {placeholders}
                </tbody>
            </table>
            </div>            
            <Pagination currentPage={currentPageKab} totalPages={totalPagesKab} onPageChange={paginateKab} />
                    </TabPane> */}
                  </TabContent>            
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
                      URUSAN PEMERINTAH TERBESAR UNTUK PENANGANAN
                      KEMISKINAN EKSTREM
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
                      PERBANDINGAN SPM UNTUK PENANGANAN KEMISKINAN EKSTREM
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
                      KELUARGA KEMISKINAN EKSTREM PER PROVINSI
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
                      FASILITAS RUMAH
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
                      FASILITAS SANITASI
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
                      }}
                    >
                      JENIS PEKERJAAN
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
                      }}
                    >
                      KEPALA KELUARGA PEREMPUAN
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
                      }}
                    >
                      GRAFIK ALOKASI
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={customActiveTabAll} className="text-muted">
                <TabPane tabId="1" id="kabupaten">
                  <h4 className="card-title d-flex justify-content-center">
                    URUSAN PEMERINTAH TERBESAR UNTUK PENANGANAN KEMISKINAN
                    EKSTREM
                  </h4>
                  <HorizontalBarChart
                    valueChart={dataChartUrusanPemerintahKemeskinanEkstrem[0]}
                    categoryChart={
                      dataChartUrusanPemerintahKemeskinanEkstrem[1]
                    }
                    dataTotal={5}
                    dataZoom={true}
                    breakWord={true}
                    trillion={true}
                    dataColors='["#57E7B4"]'
                  />
                </TabPane>
                <TabPane tabId="2" id="provinsi">
                  <h4 className="card-title d-flex justify-content-center">
                    PERBANDINGAN SPM UNTUK PENANGANAN KEMISKINAN EKSTREM
                  </h4>
                  <Row>
                    <Col md={4}>
                    <Card className="card-animate mt-4">
                      <CardBody>
                        <div className="d-flex flex-column title-custom-card">
                          <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                            <span>
                              Total SPM
                            </span>
                          </div>
                          <div className="d-flex">
                            <div className="d-flex justify-content-center align-items-center title-body">
                              <span>
                                <CountUp
                                  start={0}
                                  end={
                                    dataKemiskinanEkstrem?.pie_spm_ke?.jml_rincian_total_anggaran_spm_kemiskinan_ekstrem/1000000000000
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
                        </div>
                      </CardBody>
                    </Card>
                    <PieChartNew
                        dataChart={dataPieChartSpm}
                        dataColors={'["#2DAED4","#FCAD24"]'}
                        categoryName={[
                          "Anggaran Kemiskinan Ekstrem yang termasuk ke dalam SPM",
                          "Anggaran Kemiskinan Ekstrem di Luar SPM",
                        ]}
                        lineShow={true}
                        pieChart={false}
                        showLegend={true}
                        fitContent={true}
                        percentOnly={true}
                      />
                    </Col>
                    <Col md={8}>
                    <HorizontalBarChart
                    valueChart={dataChartPerbandinganSpmKemiskinanEkstrem[0]}
                    categoryChart={dataChartPerbandinganSpmKemiskinanEkstrem[1]}
                    dataColors='["#2DAED4"]'
                    trillion={true}
                    breakWord={true}
                  />
                    </Col>
                  </Row>                
                </TabPane>
                <TabPane tabId="3" id="kabupaten">
                  <h4 className="card-title d-flex justify-content-center">
                    {dataShowIndividu ? "INDIVIDU " : "KELUARGA "}
                    KEMISKINAN EKSTREM PER PROVINSI
                  </h4>
                  <Row>
                    <Col>
                      <Card>
                        <CardBody>
                          {dataShowIndividu ? (
                            <>
                              <div className="separator mb-4">
                                <div className="mt-4">
                                  <span
                                    onClick={() =>
                                      handleShowDataIndividu(false)
                                    }
                                    style={{
                                      cursor: "pointer",
                                      color: "#2DAED4",
                                    }}
                                  >
                                    Lihat Keluarga
                                  </span>
                                </div>
                              </div>
                              <Row>
                                <Col md={3}>
                                <Card  onClick={() =>
                                      handleShowDataIndividuDesil1(false)
                                    } className="card-animate"
                                    style={{cursor: "pointer"}}>
                                    <CardBody>
                                      <div className="d-flex flex-column title-custom-card">
                                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                          <span>Total Individu Desil 1</span>
                                        </div>
                                        <div className="d-flex">
                                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                            <span>
                                              <CountUp
                                                start={0}
                                                end={
                                                  dataKemiskinanEkstrem?.total_individu_miskin_ekstrim_desil1
                                                }
                                                separator="."
                                                // prefix=""
                                                suffix=""
                                                duration={1}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardBody>
                                  </Card>
                                  <Card style={{cursor: "pointer"}} onClick={() =>
                                      handleShowDataIndividuDesil1(true)
                                    } className="card-animate">
                                    <CardBody>
                                      <div className="d-flex flex-column title-custom-card">
                                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                          <span>
                                            Total Individu (Desil 1 - 4)
                                          </span>
                                        </div>
                                        <div className="d-flex">
                                          {/* <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                  <i className="bx bx-cart text-info"></i>
                                </span>
                              </div> */}
                                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                            <span>
                                              <CountUp
                                                start={0}
                                                end={
                                                  dataKemiskinanEkstrem
                                                    ?.ke_total_individu?.value
                                                }
                                                separator="."
                                                // prefix=""
                                                suffix=""
                                                duration={1}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardBody>
                                  </Card>
                                  <Nav
                                    tabs
                                    className="nav nav-tabs nav-success nav-justified mb-3"
                                  >
                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active:
                                            customActiveTabChartKeluargaMiskin ===
                                            "1",
                                        })}
                                        onClick={() => {
                                          toggleCustomChartKeluargaMiskin("1");
                                        }}
                                      >
                                        PROVINSI
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active:
                                            customActiveTabChartKeluargaMiskin ===
                                            "2",
                                        })}
                                        onClick={() => {
                                          toggleCustomChartKeluargaMiskin("2");
                                        }}
                                      >
                                        KABUPATEN/KOTA
                                      </NavLink>
                                    </NavItem>
                                  </Nav>
                                </Col>
                                <Col md={8}>
                                  <TabContent
                                    activeTab={
                                      customActiveTabChartKeluargaMiskin
                                    }
                                    className="text-muted"
                                  >
                                    <TabPane tabId="1" id="provinsi">
                                    {dataShowIndividuDesil1 ? (<><h4 className="card-title ">
                                        Grafik Individu (Desil 1-4)
                                      </h4>
                                      <HorizontalBarChart
                                        valueChart={
                                          dataChartIndividuMiskinEkstremProvinsi[0]
                                        }
                                        categoryChart={
                                          dataChartIndividuMiskinEkstremProvinsi[1]
                                        }
                                        dataColors='["#2DAED4"]'
                                        dataTotal={10}
                                        dataZoom={true}
                                      /></>) : (<><h4 className="card-title ">
                                        Grafik Individu (Desil 1)
                                      </h4>
                                      <HorizontalBarChart
                                        valueChart={
                                          dataChartIndividuMiskinEkstremDesil1Provinsi[0]
                                        }
                                        categoryChart={
                                          dataChartIndividuMiskinEkstremDesil1Provinsi[1]
                                        }
                                        dataColors='["#2DAED4"]'
                                        dataTotal={10}
                                        dataZoom={true}
                                      /></>)}    
                                      {/* <HorizontalBarChart
                                        valueChart={
                                          dataChartIndividuMiskinEkstremProvinsi[0]
                                        }
                                        categoryChart={
                                          dataChartIndividuMiskinEkstremProvinsi[1]
                                        }
                                        dataColors='["#2DAED4"]'
                                      /> */}
                                    </TabPane>
                                    <TabPane tabId="2" id="kabupaten">
                                    {dataShowIndividuDesil1 ? (<><h4 className="card-title ">
                                        Chart Individu (Desil 1-4)
                                      </h4>
                                      <HorizontalBarChart
                                        valueChart={
                                          dataChartIndividuMiskinEkstremKabupatenKota[0]
                                        }
                                        categoryChart={
                                          dataChartIndividuMiskinEkstremKabupatenKota[1]
                                        }
                                        dataColors='["#2DAED4"]'
                                        dataTotal={10}
                                        dataZoom={true}
                                      /></>) : (<><h4 className="card-title ">
                                        Chart Individu (Desil 1)
                                      </h4>
                                      <HorizontalBarChart
                                        valueChart={
                                          dataChartIndividuMiskinEkstremDesil1KabupatenKota[0]
                                        }
                                        categoryChart={
                                          dataChartIndividuMiskinEkstremDesil1KabupatenKota[1]
                                        }
                                        dataColors='["#2DAED4"]'
                                        dataTotal={10}
                                        dataZoom={true}
                                      /></>)}
                                      {/* <HorizontalBarChart
                                        valueChart={
                                          dataChartIndividuMiskinEkstremKabupatenKota[0]
                                        }
                                        categoryChart={
                                          dataChartIndividuMiskinEkstremKabupatenKota[1]
                                        }
                                        dataColors='["#2DAED4"]'
                                      /> */}
                                    </TabPane>
                                  </TabContent>
                                </Col>
                              </Row>
                            </>
                          ) : (
                            <>
                              <div className="separator mb-4">
                                <div className="mt-4">
                                  <span
                                    onClick={() => handleShowDataIndividu(true)}
                                    style={{
                                      cursor: "pointer",
                                      color: "#2DAED4",
                                    }}
                                  >
                                    Lihat Individu
                                  </span>
                                </div>
                              </div>
                              <Row>
                                <Col md={3}>
                                <Card style={{cursor: "pointer"}} onClick={()=> handleShowDataKeluargaDesil1(false)} className="card-animate">
                                    <CardBody>
                                      <div className="d-flex flex-column title-custom-card">
                                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                          <span>Total Keluarga (Desil 1)</span>
                                        </div>
                                        <div className="d-flex">
                                          {/* <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                  <i className="bx bx-cart text-info"></i>
                                </span>
                              </div> */}
                                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                            <span>
                                              <CountUp
                                                start={0}
                                                end={
                                                  dataKemiskinanEkstrem?.total_keluarga_miskin_ekstrim_desil1
                                                }
                                                separator="."
                                                // prefix=""
                                                suffix=""
                                                duration={1}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardBody>
                                  </Card>
                                  <Card style={{cursor: "pointer"}} onClick={()=> handleShowDataKeluargaDesil1(true)} className="card-animate">
                                    <CardBody>
                                      <div className="d-flex flex-column title-custom-card">
                                        <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                                          <span>
                                            Total Keluarga (Desil 1 - 4)
                                          </span>
                                        </div>
                                        <div className="d-flex">
                                          {/* <div className="avatar-xs-half flex-shrink-0">
                                <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                                  <i className="bx bx-cart text-info"></i>
                                </span>
                              </div> */}
                                          <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                                            <span>
                                              <CountUp
                                                start={0}
                                                end={
                                                  dataKemiskinanEkstrem
                                                    ?.ke_total_keluarga?.value
                                                }
                                                separator="."
                                                // prefix=""
                                                suffix=""
                                                duration={1}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardBody>
                                  </Card>
                                  <Nav
                                    tabs
                                    className="nav nav-tabs nav-success nav-justified mb-3"
                                  >
                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active:
                                            customActiveTabChartKeluargaMiskin ===
                                            "1",
                                        })}
                                        onClick={() => {
                                          toggleCustomChartKeluargaMiskin("1");
                                        }}
                                      >
                                        PROVINSI
                                      </NavLink>
                                    </NavItem>
                                    <NavItem>
                                      <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                          active:
                                            customActiveTabChartKeluargaMiskin ===
                                            "2",
                                        })}
                                        onClick={() => {
                                          toggleCustomChartKeluargaMiskin("2");
                                        }}
                                      >
                                        KABUPATEN/KOTA
                                      </NavLink>
                                    </NavItem>
                                  </Nav>
                                </Col>
                                <Col md={8}>
                                  <TabContent
                                    activeTab={
                                      customActiveTabChartKeluargaMiskin
                                    }
                                    className="text-muted"
                                  >
                                    <TabPane tabId="1" id="provinsi">
                                    {dataShowKeluargaDesil1 ? (<><h4 className="card-title ">
                                        Chart Keluarga (Desil 1 - 4)
                                      </h4>
                                      <HorizontalBarChart
                                        valueChart={
                                          dataChartKeluargaMiskinEkstremProvinsi[0]
                                        }
                                        categoryChart={
                                          dataChartKeluargaMiskinEkstremProvinsi[1]
                                        }
                                        dataColors='["#57E7B4"]'
                                        dataTotal={10}
                                        dataZoom={true}
                                      /></>) : (<><h4 className="card-title ">
                                        Chart Keluarga (Desil 1)
                                      </h4>
                                      <HorizontalBarChart
                                        valueChart={
                                          dataChartKeluargaMiskinEkstremDesil1Provinsi[0]
                                        }
                                        categoryChart={
                                          dataChartKeluargaMiskinEkstremDesil1Provinsi[1]
                                        }
                                        dataColors='["#57E7B4"]'
                                        dataTotal={10}
                                        dataZoom={true}
                                      /></>)}      
                                      {/* <HorizontalBarChart
                                        valueChart={
                                          dataChartKeluargaMiskinEkstremProvinsi[0]
                                        }
                                        categoryChart={
                                          dataChartKeluargaMiskinEkstremProvinsi[1]
                                        }
                                        dataColors='["#57E7B4"]'
                                      /> */}
                                    </TabPane>
                                    <TabPane tabId="2" id="kabupaten">
                                    {dataShowKeluargaDesil1 ? (<><h4 className="card-title ">
                                        Chart Keluarga (Desil 1 - 4)
                                      </h4>
                                      <HorizontalBarChart
                                        valueChart={
                                          dataChartKeluargaMiskinEkstremKabupatenKota[0]
                                        }
                                        categoryChart={
                                          dataChartKeluargaMiskinEkstremKabupatenKota[1]
                                        }
                                        dataColors='["#57E7B4"]'
                                        dataTotal={10}
                                        dataZoom={true}
                                      /></>) : (<><h4 className="card-title ">
                                        Chart Keluarga (Desil 1)
                                      </h4>
                                      <HorizontalBarChart
                                        valueChart={
                                          dataChartKeluargaMiskinEkstremDesil1KabupatenKota[0]
                                        }
                                        categoryChart={
                                          dataChartKeluargaMiskinEkstremDesil1KabupatenKota[1]
                                        }
                                        dataColors='["#57E7B4"]'
                                        dataTotal={10}
                                        dataZoom={true}
                                      /></>)}                     
                                      {/* <HorizontalBarChart
                                        valueChart={
                                          dataChartKeluargaMiskinEkstremKabupatenKota[0]
                                        }
                                        categoryChart={
                                          dataChartKeluargaMiskinEkstremKabupatenKota[1]
                                        }
                                        dataColors='["#57E7B4"]'
                                      /> */}
                                    </TabPane>
                                  </TabContent>
                                </Col>
                              </Row>
                            </>
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4" id="kabupaten">
                  <h4 className="card-title d-flex justify-content-center">
                  FASILITAS RUMAH
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
                            active: customActiveTabChartFasilitasRumah === "1",
                          })}
                          onClick={() => {
                            toggleCustomChartFasilitasRumah("1");
                          }}
                        >
                          Status Rumah
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabChartFasilitasRumah === "2",
                          })}
                          onClick={() => {
                            toggleCustomChartFasilitasRumah("2");
                          }}
                        >
                          Daya Listrik
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabChartFasilitasRumah === "3",
                          })}
                          onClick={() => {
                            toggleCustomChartFasilitasRumah("3");
                          }}
                        >
                          Bahan Bakar Memasak
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTabChartFasilitasRumah}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      <VerticalBarChart
                        valueChart={dataChartFasilitasRumahStatusRumah[0]}
                        categoryChart={dataChartFasilitasRumahStatusRumah[1]}
                        dataColors='["#36D1FF"]'
                        height="450px"
                      />
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      <VerticalBarChart
                        valueChart={dataChartFasilitasRumahDayaListrikRumah[0]}
                        categoryChart={
                          dataChartFasilitasRumahDayaListrikRumah[1]
                        }
                        dataColors='["#C3B79F"]'
                        height="450px"
                      />
                    </TabPane>
                    <TabPane tabId="3" id="kecamatan">
                      <VerticalBarChart
                        valueChart={dataChartFasilitasRumahMemasak[0]}
                        categoryChart={dataChartFasilitasRumahMemasak[1]}
                        dataColors='["#DD9AB0"]'
                        height="450px"
                      />
                    </TabPane>
                  </TabContent>
                </TabPane>
                <TabPane tabId="5" id="kabupaten">
                  <h4 className="card-title d-flex justify-content-center">
                    FASILITAS SANITASI
                  </h4>
                  <VerticalBarChart
                    valueChart={dataChartFasilitasSanitasi[0]}
                    categoryChart={dataChartFasilitasSanitasi[1]}
                    dataColors='["#DD9AB0"]'
                    height="450px"
                  />
                </TabPane>
                <TabPane tabId="6" id="kabupaten">
                  <h4 className="card-title d-flex justify-content-center">
                    JENIS PEKERJAAN
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
                            active: customActiveTabChartJenisPekerjaan === "1",
                          })}
                          onClick={() => {
                            toggleCustomChartJenisPekerjaan("1");
                          }}
                        >
                          Kepala Keluarga
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabChartJenisPekerjaan === "2",
                          })}
                          onClick={() => {
                            toggleCustomChartJenisPekerjaan("2");
                          }}
                        >
                          Individu
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTabChartJenisPekerjaan}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      <VerticalBarChart
                        valueChart={dataChartJenisPekerjaanKepalaKeluarga[0]}
                        categoryChart={dataChartJenisPekerjaanKepalaKeluarga[1]}
                        dataColors='["#D2C067"]'
                        height="450px"
                      />
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      {/* <div className="mb-1 mt-5 d-flex justify-content-center">
                    <h4 className="card-title">Individu</h4>
                  </div> */}
                      <VerticalBarChart
                        valueChart={dataChartJenisPekerjaanIndividu[0]}
                        categoryChart={dataChartJenisPekerjaanIndividu[1]}
                        dataColors='["#D2C067"]'
                        height="450px"
                      />
                    </TabPane>
                  </TabContent>
                </TabPane>
                <TabPane tabId="7" id="kabupaten">
                <h4 className="card-title d-flex justify-content-center">
                    KEPALA KELUARGA PEREMPUAN
                  </h4>
                  <Row>
                    <Col md={6}>
                      <Card>
                        <CardBody>
                          <div className="d-flex flex-column title-custom-card">
                            <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                              <span>Kepala Keluarga</span>
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
                                    end={
                                      dataKemiskinanEkstrem
                                        ?.ke_jumlah_kepala_keluarga_perempuan
                                        ?.value
                                    }
                                    separator="."
                                    prefix=""
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
                    <Col md={6}>
                      <VerticalBarChart
                        valueChart={dataChartKepalaKeluargaPerempuan[0]}
                        categoryChart={dataChartKepalaKeluargaPerempuan[1]}
                        dataColors='["#C56786"]'
                        height="450px"
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="8" id="kabupaten">
                  <h4 className="card-title d-flex justify-content-center">
                    GRAFIK ALOKASI ANGGARAN PENANGANAN KEMISKINAN EKSTREM
                    PEMERINTAH DAERAH
                  </h4>
                  <Row>
                    <Col md={6}>
                      <div className="nav-beranda">
                        <Nav
                          tabs
                          className="nav nav-tabs-custom card-header-tabs border-bottom-0 ms-2 mb-3"
                        >
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: customActiveTabChart === "1",
                              })}
                              onClick={() => {
                                toggleCustomChart("1");
                                setCustomActiveTitleChartAlokasi("Provinsi");
                              }}
                            >
                              PROVINSI
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: customActiveTabChart === "2",
                              })}
                              onClick={() => {
                                toggleCustomChart("2");
                                setCustomActiveTitleChartAlokasi("Kabupaten");
                              }}
                            >
                              KABUPATEN
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: customActiveTabChart === "3",
                              })}
                              onClick={() => {
                                toggleCustomChart("3");
                                setCustomActiveTitleChartAlokasi("Kota");
                              }}
                            >
                              KOTA
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </div>
                    </Col>
                    {dataShowKomposisiBelanja ? (
                      <></>
                    ) : (
                      <>
                        {/* <Col md={6}>
                          <div className="nav-beranda">
                            <Nav
                              tabs
                              className="nav nav-tabs-custom card-header-tabs border-bottom-0 ms-2 mb-3"
                            >
                              <NavItem>
                                <NavLink
                                  style={{ cursor: "pointer" }}
                                  className={classnames({
                                    active:
                                      customActiveTabChartTopBottom === "1",
                                  })}
                                  onClick={() => {
                                    toggleCustomChartTopBottom("1");
                                    setCustomActiveTitleTopBottom("Top 10");
                                  }}
                                >
                                  TOP 10
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  style={{ cursor: "pointer" }}
                                  className={classnames({
                                    active:
                                      customActiveTabChartTopBottom === "2",
                                  })}
                                  onClick={() => {
                                    toggleCustomChartTopBottom("2");
                                    setCustomActiveTitleTopBottom("Bottom 10");
                                  }}
                                >
                                  BOTTOM 10
                                </NavLink>
                              </NavItem>
                            </Nav>
                          </div>
                        </Col> */}
                      </>
                    )}
                  </Row>
                  <TabContent
                    activeTab={customActiveTabChart}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      {dataShowKomposisiBelanja ? (
                        <>
                          <Card className="card-animate mt-4">
                            <CardBody>
                              <div className="mb-4 separator">
                                <h4 className="card-title">
                                  Komposisi Belanja Daerah Dalam Mendukung
                                  Penanganan Kemiskinan Ekstrem Pemerintah
                                  Daerah Provinsi
                                </h4>
                              </div>
                              <VerticalBarChart
                                valueChart={
                                  dataChartKomposisiBelanjaProvinsi[0]
                                }
                                categoryChart={
                                  dataChartKomposisiBelanjaProvinsi[1]
                                }
                                dataColors='["#57E7B4"]'
                                fullCategory={true}
                                height="450px"
                                trillion={true}
                                breakWord={true}
                              />
                            </CardBody>
                          </Card>
                        </>
                      ) : (
                        <>
                          <TabContent
                            activeTab={customActiveTabChartTopBottom}
                            className="text-muted"
                          >
                            <TabPane tabId="1" id="provinsi">
                              <BarWithPercentage
                                valueChart={
                                  dataChartTop10KemiskinanEkstremProvinsi[0]
                                }
                                categoryChart={
                                  dataChartTop10KemiskinanEkstremProvinsi[1]
                                }
                                percentageChart={
                                  dataChartTop10KemiskinanEkstremProvinsi[2]
                                }
                                additionalData={
                                  dataChartTop10KemiskinanEkstremProvinsi[3]
                                }
                                dataColors='["#2DAED4"]'
                              />
                            </TabPane>
                            <TabPane tabId="2" id="provinsi">
                              <BarWithPercentage
                                valueChart={
                                  dataChartBottom10KemiskinanEkstremProvinsi[0]
                                }
                                categoryChart={
                                  dataChartBottom10KemiskinanEkstremProvinsi[1]
                                }
                                percentageChart={
                                  dataChartBottom10KemiskinanEkstremProvinsi[2]
                                }
                                additionalData={
                                  dataChartBottom10KemiskinanEkstremProvinsi[3]
                                }
                                dataColors='["#2DAED4"]'
                              />
                            </TabPane>
                          </TabContent>
                        </>
                      )}
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      {dataShowKomposisiBelanja ? (
                        <>
                          <Card className="card-animate mt-4">
                            <CardBody>
                              <div className="mb-4 separator">
                                <h4 className="card-title">
                                  Komposisi Belanja Daerah Dalam Mendukung
                                  Penanganan Kemiskinan Ekstrem Pemerintah
                                  Daerah Kabupaten
                                </h4>
                              </div>
                              <VerticalBarChart
                                valueChart={
                                  dataChartKomposisiBelanjaKabupaten[0]
                                }
                                categoryChart={
                                  dataChartKomposisiBelanjaKabupaten[1]
                                }
                                dataColors='["#57E7B4"]'
                                fullCategory={true}
                                trillion={true}
                                breakWord={true}
                                height="450px"
                              />
                            </CardBody>
                          </Card>
                        </>
                      ) : (
                        <>
                          <TabContent
                            activeTab={customActiveTabChartTopBottom}
                            className="text-muted"
                          >
                            <TabPane tabId="1" id="provinsi">
                              <BarWithPercentage
                                valueChart={
                                  dataChartTop10KemiskinanEkstremKabupaten[0]
                                }
                                categoryChart={
                                  dataChartTop10KemiskinanEkstremKabupaten[1]
                                }
                                percentageChart={
                                  dataChartTop10KemiskinanEkstremKabupaten[2]
                                }
                                additionalData={
                                  dataChartTop10KemiskinanEkstremKabupaten[3]
                                }
                                dataColors='["#2DAED4"]'
                              />
                            </TabPane>
                            <TabPane tabId="2" id="provinsi">
                              <BarWithPercentage
                                valueChart={
                                  dataChartBottom10KemiskinanEkstremKabupaten[0]
                                }
                                categoryChart={
                                  dataChartBottom10KemiskinanEkstremKabupaten[1]
                                }
                                percentageChart={
                                  dataChartBottom10KemiskinanEkstremKabupaten[2]
                                }
                                additionalData={
                                  dataChartBottom10KemiskinanEkstremKabupaten[3]
                                }
                                dataColors='["#2DAED4"]'
                              />
                            </TabPane>
                          </TabContent>
                        </>
                      )}
                    </TabPane>
                    <TabPane tabId="3" id="kecamatan">
                      {dataShowKomposisiBelanja ? (
                        <>
                          <Card className="card-animate mt-4">
                            <CardBody>
                              <div className="mb-4 separator">
                                <h4 className="card-title">
                                  Komposisi Belanja Daerah Dalam Mendukung
                                  Penanganan Kemiskinan Ekstrem Pemerintah
                                  Daerah Kota
                                </h4>
                              </div>
                              <VerticalBarChart
                                valueChart={dataChartKomposisiBelanjaKota[0]}
                                categoryChart={dataChartKomposisiBelanjaKota[1]}
                                dataColors='["#57E7B4"]'
                                fullCategory={true}
                                trillion={true}
                                breakWord={true}
                                height="450px"
                              />
                            </CardBody>
                          </Card>
                        </>
                      ) : (
                        <>
                          <TabContent
                            activeTab={customActiveTabChartTopBottom}
                            className="text-muted"
                          >
                            <TabPane tabId="1" id="kecamatan">
                              <BarWithPercentage
                                valueChart={
                                  dataChartTop10KemiskinanEkstremKota[0]
                                }
                                categoryChart={
                                  dataChartTop10KemiskinanEkstremKota[1]
                                }
                                percentageChart={
                                  dataChartTop10KemiskinanEkstremKota[2]
                                }
                                additionalData={
                                  dataChartTop10KemiskinanEkstremKota[3]
                                }
                                dataColors='["#2DAED4"]'
                              />
                            </TabPane>
                            <TabPane tabId="2" id="kecamatan">
                              <BarWithPercentage
                                valueChart={
                                  dataChartBottom10KemiskinanEkstremKota[0]
                                }
                                categoryChart={
                                  dataChartBottom10KemiskinanEkstremKota[1]
                                }
                                percentageChart={
                                  dataChartBottom10KemiskinanEkstremKota[2]
                                }
                                additionalData={
                                  dataChartBottom10KemiskinanEkstremKota[3]
                                }
                                dataColors='["#2DAED4"]'
                              />
                            </TabPane>
                          </TabContent>
                        </>
                      )}
                    </TabPane>
                    {dataShowKomposisiBelanja ? (
                      <>
                        <div className="mt-4">
                          <span
                            onClick={() =>
                              handleShowDataKomposisiBelanja(false)
                            }
                            style={{ cursor: "pointer", color: "#2DAED4" }}
                          >
                            Lihat Alokasi Belanja
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-4">
                          <span
                            onClick={() => handleShowDataKomposisiBelanja(true)}
                            style={{ cursor: "pointer", color: "#2DAED4" }}
                          >
                            Lihat Komposisi Belanja
                          </span>
                        </div>
                      </>
                    )}
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
                Kementerian Koordinator Bidang Kemanusiaan dan Kebudayaan ( Kemenko PMK )                
              </span>
            </div>
            <div
              style={{
                fontSize: "12px" /* Ukuran font lebih kecil */,
                color: "#555",
                fontStyle: "italic" /* Menambahkan gaya italic */,
              }}
            >
              Update Data: 10 Juli 2024
            </div>
          </div>
        </Col>
      </Row>

      <Modal size="xl" isOpen={modall} toggle={handleOpen} centered={true} backdrop="static">
      <div className="modal-content border-0">
        <ModalHeader className=" p-3 bg-info-subtle" toggle={handleClose}>Detail Anggaran Kemiskinan Ekstrem {dataDetailNamaDaerah=="Aceh" ? "Provinsi Aceh" : dataDetailNamaDaerah}
        </ModalHeader>
        <ModalBody>
        <Row>
          <Col md={4}>
            <Card className="card-animate">
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
                        onKeyDown={(e) => handleKeyDown(e, "seprovinsi")}
                        placeholder={"Cari Nama Sub Giat"} 
                      />

                      {/* Tombol "X" di dalam input */}
                      {searchTermDetail && (
                        <button
                          onClick={() => handleClearSearchDetail("seprovinsi")}
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
                    }} onClick={()=>dataJenisPemda=="prov" ? handleOpenNextModal("", item.kode_sub_giat, item.kode_ddn, "", item.total_rinciansub, item.nama_sub_giat) : (dataJenisPemda=="kab" || dataJenisPemda=="kota") ? handleOpenNextModal("", item.kode_sub_giat, "", item.kode_ddn, item.total_rinciansub, item.nama_sub_giat) : handleOpenNextModal(item.kode_prov, item.kode_sub_giat, "", "", item.total_rinciansub, item.nama_sub_giat)} className="bx bx-list-ul text-primary"></i>
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
        <ModalHeader className=" p-3 bg-info-subtle" toggle={handleCloseNextModal}>Sub Rincian Objek {namaSro}
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
                      <th style={{verticalAlign: "middle", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word",maxWidth:"100px"  }}>
                        Lihat Sub Sub Rincian Objek 
                      </th>                                                           
                    </tr>                  
                  </thead>
                  <tbody style={{ minHeight: "500px" }}>
                    {currentItemDetailSub.map((item, index) => (
                      <tr key={index}>                        
                        <td style={{textAlign: "center",
                        verticalAlign: "middle"}}>
                          {/* { index + 1} */}
                          {indexOfFirstItemDetailSub + index + 1}
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
                        <td style={{verticalAlign: "middle", textAlign: "center" }}>
                    <i style={{                                            
                      padding: "5px 10px",                      
                      cursor: "pointer",
                      fontSize: "30px"
                    }} onClick={()=>handleOpenNextModalSub({kodeDdn: item.kode_ddn, kodeSubGiat: item.kode_sub_giat, kodeSro: item.kode_sro, tahun: selectedSingleTahunAnggaran, rincianDetail:item.total_rinciansro, namaSro: item.nama_sro})} className="bx bx-list-ul text-primary"></i>
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

      <Modal size="xl" isOpen={modalSub} toggle={handleOpenNextModalSub} centered={true} backdrop="static">
      <div className="modal-content border-0">
        <ModalHeader className=" p-3 bg-info-subtle" toggle={handleCloseNextModalSub}>Sub Sub Rincian Objek {namaSubGiat}
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
                        onClick={() => requestSort("kode_sro")}
                        style={{ cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}
                      >
                        Kode Standar Harga {getSortIcon("kode_sro")}
                      </th>                                                                  
                      <th                        
                        onClick={() => requestSort("kode_sro")}
                        style={{ cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}
                      >
                        Nama Standar Harga {getSortIcon("kode_sro")}
                      </th>                                                                  
                      <th                        
                        onClick={() => requestSort("kode_sro")}
                        style={{ cursor: "pointer", verticalAlign: "middle", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}
                      >
                        Satuan {getSortIcon("kode_sro")}
                      </th>                                                                  
                      <th onClick={() => requestSort("nama_sro")}
                        style={{ cursor: "pointer", textAlign: "center", whiteSpace: "normal",
                          wordWrap: "break-word", maxWidth:"100px" }}>
                        Volume {getSortIcon("nam_sro")}
                      </th>  
                      <th onClick={() => requestSort("total_rinciansro")}
                        style={{ cursor: "pointer", textAlign: "center" }}>
                        Harga Satuan (Rp) {getSortIcon("total_rinciansro")}
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
                      <span style={{float: "right"}}>{item.volume ? parseInt(item.volume).toLocaleString("id-ID")
                          : "-"}</span>                          
                      </td>         
                      <td>
                      <span style={{float: "right"}}>{item.harga_satuan ? parseInt(item.harga_satuan).toLocaleString("id-ID")
                          : "-"}</span>                          
                      </td>                                                                    
                      <td>
                      <span style={{float: "right"}}>{item.total_rinciansubsro ? parseInt(item.total_rinciansubsro).toLocaleString("id-ID")
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

export default ContentMiskinEkstremV2;
