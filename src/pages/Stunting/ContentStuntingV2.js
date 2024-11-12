import React, { memo, useEffect, useState } from "react";
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

const ContentStunting = () => {
  const [selectedDesil, setSelectedDesil] = useState("1"); // State untuk menyimpan pilihan dropdown
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const selectedValue = value;
    setSelectedDesil(selectedValue); // Update state dengan pilihan yang dipilih
    if(selectedValue == "5"){
      setTitleMap(`Keluarga Berisiko Stunting ${name} >4`)
    }else{
      setTitleMap(`Keluarga Berisiko Stunting ${name} ${value}`)
    }
  
    // Ambil data desil yang sesuai dan update valueMap
    const selectedData = dataDesil[`desil${selectedValue}`]; // Ambil data sesuai pilihan
    console.log(selectedData,'ini')
    if (selectedData) {
      setValueMap(selectedData);
      const maxValue = Math.max(...selectedData.map(item => item.value));
      setmaxValueMap(maxValue);
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
    console.log(dataShowAkunBelanja, "ini isinyaaa");
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
  const [dataBeresikoKabupaten, setDataBeresikoKabupaten] = useState([]);
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

  const getDataStunting = () => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };

        const response = await fetch(
          `${API_URI}/dashboard_stunting`,
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
            dataStunting.data.compare_resiko_by_provinsi.data.map(
              (item) => item.provinsi
            );

          const resultChartStackedProv =
            dataStunting.data.compare_resiko_by_provinsi.data.reduce(
              (acc, item) => {
                acc[0].push(item.jumlah_keluarga_beresiko);
                acc[1].push(item.jumlah_keluarga_tidak_beresiko);
                return acc;
              },
              [[], []]
            );
            console.log(resultChartStackedProv, 'result')

          setDataBeresikoProvinsi(resultChartStackedProv);
          setDataCategoryChartProvinsi(categoryNamesProv);
        } catch (error) {
          console.error("Error processing provinsi data", error);
        }

        // kabupaten
        try {
          const categoryNamesKab =
            dataStunting.data.compare_resiko_by_kabupaten.data.map(
              (item) => item.kabupaten
            );

          const resultChartStackedKab =
            dataStunting.data.compare_resiko_by_kabupaten.data.reduce(
              (acc, item) => {
                acc[0].push(item.jumlah_keluarga_beresiko);
                acc[1].push(item.jumlah_keluarga_tidak_beresiko);
                return acc;
              },
              [[], []]
            );

          setDataCategoryChartKabupaten(categoryNamesKab);
          setDataBeresikoKabupaten(resultChartStackedKab);
        } catch (error) {
          console.error("Error processing kabupaten data", error);
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
          const provinsiKesejahteraan =
            dataStunting.data.stunting_peringkat_kesejahteraan.data.map(
              (item) => item.provinsi
            );
          const peringkatKesejahteraan1 =
            dataStunting.data.stunting_peringkat_kesejahteraan.data.map(
              (item) => item.peringkat_kesejahteraan_1
            );
          const peringkatKesejahteraan2 =
            dataStunting.data.stunting_peringkat_kesejahteraan.data.map(
              (item) => item.peringkat_kesejahteraan_2
            );
          const peringkatKesejahteraan3 =
            dataStunting.data.stunting_peringkat_kesejahteraan.data.map(
              (item) => item.peringkat_kesejahteraan_3
            );
          const peringkatKesejahteraan4 =
            dataStunting.data.stunting_peringkat_kesejahteraan.data.map(
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
          const resultChartSpm = [dataStunting.data.pie_spm_stunting.jml_rincian_total_anggaran_spm_stunting,dataStunting.data.pie_spm_stunting.jml_rincian_diluar_anggaran_spm_stunting]
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
              }, [[],[]]              
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
          // const resultChartPus4Terlalu = [dataStunting.data.pus_4_terlalu.jumlah_terlalu_banyak, dataStunting.data.pus_4_terlalu.jumlah_terlalu_dekat, dataStunting.data.pus_4_terlalu.jumlah_terlalu_muda, dataStunting.data.pus_4_terlalu.jumlah_terlalu_tua]
          console.log(resultChartPus4Terlalu, 'ini isi result')
            setDataChartPus4Terlalu(resultChartPus4Terlalu)
        } catch (error) {
          console.error("Error processing top 5 akun belanja", error);
        }

      } catch (error) {
        console.error("Error fetching dashboard_stunting data", error);
      }
    };
    fetchData();
  };

  const [dataStuntingTabel, setDataStuntingTabel] = useState([], []);
  const [titleMap, setTitleMap] = useState("Berisiko Stunting Desil 1")
  const [valueMap, setValueMap] = useState([]);
  const [maxValueMap, setmaxValueMap] = useState(0)
  const [dataWidth, setDataWidth] = useState(6)  
  const [roam, setRoam] = useState(false);
  const [dataDesil, setDataDesil] = useState({}); 

  const getDataStuntingTabel = () => {
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
          `${API_URI}/tabel_stunting_seprovinsi`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataStuntingTabel = await response.json();
        setDataStuntingTabel(dataStuntingTabel.data);
        setShowNextData(true);
        setCurrentPage(1);
        setDataKolomNamaDaerah("Se-Provinsi");

              // Menyimpan semua data desil ke dalam state dataDesil
      const desilData = {
        desil1: dataStuntingTabel.data.map(item => ({
          name: item.nama_prov,
          value: parseInt(item.peringkat_kesejahteraan_1)
        })),
        desil2: dataStuntingTabel.data.map(item => ({
          name: item.nama_prov,
          value: parseInt(item.peringkat_kesejahteraan_2)
        })),
        desil3: dataStuntingTabel.data.map(item => ({
          name: item.nama_prov,
          value: parseInt(item.peringkat_kesejahteraan_3)
        })),
        desil4: dataStuntingTabel.data.map(item => ({
          name: item.nama_prov,
          value: parseInt(item.peringkat_kesejahteraan_4)
        })),
        desil5: dataStuntingTabel.data.map(item => ({
          name: item.nama_prov,
          value: parseInt(item.peringkat_kesejahteraan_diatas_4)
        }))
      };

      setDataDesil(desilData); // Simpan semua desil ke dalam state
      setValueMap(desilData.desil1);
      const maxDesil1 = Math.max(...desilData.desil1.map(item => item.value));
      setmaxValueMap(maxDesil1);
      
        // const valueDesil1 = dataStuntingTabel.data.map(item => ({
        //   name: item.nama_prov,
        //   value: parseInt(item.peringkat_kesejahteraan_1)          
        // }));
        // setValueMap(valueDesil1);

        // console.log(valueDesil1)

        // const valueDesil2 = dataStuntingTabel.data.map(item => ({
        //   name: item.nama_prov,
        //   value: parseInt(item.peringkat_kesejahteraan_2)          
        // }));

        // const valueDesil3 = dataStuntingTabel.data.map(item => ({
        //   name: item.nama_prov,
        //   value: parseInt(item.peringkat_kesejahteraan_3)          
        // }));

        // const valueDesil4 = dataStuntingTabel.data.map(item => ({
        //   name: item.nama_prov,
        //   value: parseInt(item.peringkat_kesejahteraan_4)          
        // }));

        // const valueDesilLebihDari4 = dataStuntingTabel.data.map(item => ({
        //   name: item.nama_prov,
        //   value: parseInt(item.peringkat_kesejahteraan_diatas_4)          
        // }));

        // const maxDesil1 = Math.max(...valueDesil1.map(item => item.value));
        // const maxDesil2  = Math.max(...valueDesil2.map(item => item.value));
        // const maxDesil3  = Math.max(...valueDesil3.map(item => item.value));
        // const maxDesil4  = Math.max(...valueDesil4.map(item => item.value));
        // const maxDesilLebiDari4  = Math.max(...valueDesilLebihDari4.map(item => item.value));

      } catch (errorStunting) {
        setErrorStunting(errorStunting);
      } finally {
        setLoadingStunting(false);
      }
    };
    fetchData();
  };

  const [dataStuntingTabelKabupaten, setDataStuntingTabelKabupaten] = useState(
    [],
    []
  );
  const [dataKolomNamaDaerah, setDataKolomNamaDaerah] = useState("Se-Provinsi");
  const [showNextData, setShowNextData] = useState(true);

  console.log(dataKolomNamaDaerah, 'ini data kolom nama daerah')
  const getDataStuntingTabelKabupaten = (kodeDdn = "", e) => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kode_ddn1: kodeDdn,
          }),
        };

        const response = await fetch(
          `${API_URI}/tabel_stunting_kabupaten`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataStuntingTabelKabupaten = await response.json();
        e.stopPropagation(); // Mencegah event bubbling jika dibutuhkan
        setShowNextData(false); // Mengatur state agar class 'test' dihilangkan dari semua elemen

        setDataKolomNamaDaerah("Nama Daerah");
        setCurrentPage(1);
        setDataStuntingTabel(dataStuntingTabelKabupaten.data);        
      } catch (errorStunting) {
        setErrorStunting(errorStunting);
      } finally {
        setLoadingStunting(false);
      }
    };
    fetchData();
  };

  const [dataDetailAnggaran, setDataDetailAnggaran] = useState([]);
  const [dataDetailAnggaranSub, setDataDetailAnggaranSub] = useState([]);
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
          `${API_URI}/detail-tabel-stunting`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDetailAnggaran = await response.json();

        if (kodeDdnProvinsi != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran.data.detail_stunting_subgiat
          );
          setModall(true);
        } else if (kodeDdnKabupaten != "" && kodeSubGiat == "") {
          setDataDetailAnggaran(
            dataDetailAnggaran.data.detail_stunting_subgiat
          );
          setModall(true);
        }

        if (kodeDdnProvinsi != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran.data.detail_stunting_subgiat_sro
          );
          setModal(true);
        } else if (kodeDdnKabupaten != "" && kodeSubGiat != "") {
          setDataDetailAnggaranSub(
            dataDetailAnggaran.data.detail_stunting_subgiat_sro
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
    getDataStunting();
    getDataStuntingTabel();
    // getDataStuntingTabelKabupaten();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProvinsi, setCurrentPageProvinsi] = useState(1);
  const [currentPageKabupaten, setCurrentPageKabupaten] = useState(1);
  const [currentPageDetail, setCurrentPageDetail] = useState(1);
  const [currentPageDetailSub, setCurrentPageDetailSub] = useState(1);
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

  // Sorting logic
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...(dataStuntingTabel || [])];
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
  }, [dataStuntingTabel, sortConfig]);

  const sortedItemsKabupaten = React.useMemo(() => {
    let sortableItems = [...(dataStuntingTabelKabupaten || [])];
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
  }, [dataStuntingTabelKabupaten, sortConfig]);

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
    let sortableItems = [...(dataDetailAnggaranSub || [])];
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
  }, [dataDetailAnggaranSub, sortConfig]);

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

  // Calculate total number of pages
  const totalPages = Math.ceil((dataStuntingTabel?.length || 0) / itemsPerPage);
  const totalPagesKabupaten = Math.ceil(
    (dataStuntingTabelKabupaten?.length || 0) / itemsPerPage
  );
  const totalPagesDetail = Math.ceil(
    (dataDetailAnggaran?.length || 0) / itemsPerPage
  );
  const totalPagesDetailSub = Math.ceil(
    (dataDetailAnggaranSub?.length || 0) / itemsPerPage
  );

  // Pagination change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateKabupaten = (pageNumber) => setCurrentPageKabupaten(pageNumber);
  const paginateDetail = (pageNumber) => setCurrentPageDetail(pageNumber);
  const paginateDetailSub = (pageNumber) => setCurrentPageDetailSub(pageNumber);
  // const paginateProvinsi = (pageNumber) => setCurrentPageProvinsi(pageNumber);

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

  const placeholdersKab = Array.from(
    { length: itemsPerPage - currentItemsKabupaten.length },
    (_, index) => (
      <tr key={`placeholder-${index}`}>
        <td
          colSpan="12"
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

  const [modall, setModall] = useState(false);
  const [modal, setModal] = useState(false);
  const [dataRincianDetail, setDataRincianDetail] = useState(0);
  const [dataRincianDetailSub, setDataRincianDetailSub] = useState(0);
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
    getDataDetailAnggaran(kodeProv, kodeDdnKab, kodeDdnProv, "");

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

  const handleOpenNextModal = (
    kodeDaerah = "",
    kodeSubGiat = "",
    kodeDdnProv = "",
    kodeDdnKab = "",
    rincianDetail = ""
  ) => {
    if (kodeDaerah != "") {
      getDataDetailAnggaran(kodeDaerah, "", "", kodeSubGiat);
    } else if (kodeDdnProv != "") {
      getDataDetailAnggaran("", "", kodeDdnProv, kodeSubGiat);
    } else if (kodeDdnKab != "") {
      getDataDetailAnggaran("", kodeDdnKab, "", kodeSubGiat);
    }

    setDataRincianDetailSub(rincianDetail);
    // setModal(true)
  };
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

  const [dataShowChartAnggaran, setDataShowChartAnggaran] = useState(false);
  const [dataShowChartFasilitasProvinsi, setShowDataChartFasilitasProvinsi] = useState(false)
  const [currentCategoryClicked, setCurrentCategoryClicked] = useState(null)
  const [dataChartDetailFasilitasProvinsi, setDataChartDetailFasilitasProvinsi] = useState([],[])    
  const [namaDaerahDetail, setNamaDaerahDetail] = useState([],[])

  const handleBarClick = (params) => {
    const clickedCategory = params.name        

    const dataDetail = (clickedCategory == "Jamban Tidak Layak" ? dataStunting.fasilitas_lingkungan_tidak_sehat_jamban.reduce((acc, item) => {
      acc[0].push(item.jumlah_lingkungan_tdksehat_jamban)
      acc[1].push(item.nama_daerah)      
      acc[2] += item.jumlah_lingkungan_tdksehat_jamban;
      return acc
    }, [[],[], 0]) : dataStunting.fasilitas_lingkungan_tidak_sehat_air.reduce((acc, item) => {
      acc[0].push(item.jumlah_lingkungan_tdksehat_air)
      acc[1].push(item.nama_daerah)      
      acc[2] += item.jumlah_lingkungan_tdksehat_air; 
      return acc
    }, [[],[], 0]))    
    
    setCurrentCategoryClicked(clickedCategory)    
    setDataChartDetailFasilitasProvinsi(dataDetail)
    setShowDataChartFasilitasProvinsi(true)
  };

  const handleBack = () => {
    setShowDataChartFasilitasProvinsi(false)
  }

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="card-custom">
            <div className="d-flex title-page">
              <div className="d-flex justify-content-center align-items-center avatar-sm">
                <span className="logo-sm">
                  <img src={logoBkkbn} alt="" width="35" height="35" />
                </span>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <span>Kementerian Kependudukan dan Pembangunan Keluarga</span>
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
              </div>
              
              <div className="d-flex nav-beranda">
              <div className="d-flex justify-content-center align-items-center" style={{ fontSize: "14px", fontWeight:600, fontFamily: "poppins" }}>
                Keluarga Berisiko Stunting:
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
                    <option value="1">DESIL 1</option>
                    <option value="2">DESIL 2</option>
                    <option value="3">DESIL 3</option>
                    <option value="4">DESIL 4</option>
                    <option value="5">DESIL &gt;4</option>
                    </select>
                </div>
              </div>
              <MapIndoChart roam={roam} maxValue={maxValueMap} valueSeries={valueMap} colorData={["#FFCDD2", "#FF9EA7", "#FF7380", "#FF4B5C", "#FF2438", "#FF0017"]} />
            </CardBody>
          </Card>
        </Col>
        <Col md={dataWidth}>
          <Card className="card-height-100">
            <CardBody>
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
                                      dataStunting?.total_anggaran_belanja_nasional /
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
                                    TOTAL BELANJA PENURUNAN DAN PENCEGAHAN
                                    STUNTING
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
                                          dataStunting?.total_anggaran_belanja_kasus_stunting /
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
                                          dataStunting?.total_anggaran_belanja_urusan_kesehatan /
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
                                  PENURUNAN DAN PENCEGAHAN STUNTING
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
                        dataChart={dataChartPerbandinganAnggaranKesehatan}
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
                        dataChart={dataChartPerbandinganAnggaranStunting}
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
      <Card>
        <CardBody>
          <Row>
            <Col md={4}>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex flex-column title-custom-card">
                    <div className="d-flex justify-content-start align-items-start mb-1 title-card">
                      <span>JUMLAH KELUARGA</span>
                    </div>
                    <div className="d-flex">
                      <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-warning-subtle rounded-4 fs-3">
                          <i className="mdi mdi-human-male-female-child text-warning"></i>
                        </span>
                      </div>
                      <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                        <span>
                          <CountUp
                            start={0}
                            end={dataStunting.jumlah_keluarga}
                            separator="."
                            prefix=""
                            duration={3}
                          />
                          {/* {dataStunting?.jumlah_keluarga?.toLocaleString("id-ID")} */}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex flex-column title-custom-card">
                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                      <span>KELUARGA SASARAN</span>
                    </div>
                    <div className="d-flex">
                      <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-info-subtle rounded-4 fs-3">
                          <i className="mdi mdi-human-male-female-child text-info"></i>
                        </span>
                      </div>
                      <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                        <span>
                          <CountUp
                            start={0}
                            end={dataStunting.jumlah_keluarga_sasaran}
                            separator="."
                            prefix=""
                            duration={3}
                          />
                          {/* {dataStunting?.jumlah_keluarga_sasaran?.toLocaleString("id-ID")} */}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="card-animate">
                <CardBody>
                  <div className="d-flex flex-column title-custom-card">
                    <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                      <span>KELUARGA BERISIKO STUNTING</span>
                    </div>
                    <div className="d-flex">
                      <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                          <i className="mdi mdi-human-male-female-child text-danger"></i>
                        </span>
                      </div>
                      <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                        <span>
                          <CountUp
                            start={0}
                            end={dataStunting.jumlah_keluarga_stunting}
                            separator="."
                            prefix=""
                            duration={3}
                          />
                          {/* {dataStunting?.jumlah_keluarga_stunting?.toLocaleString("id-ID")} */}
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
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col md={6}>
                  <Card className="card-animate">
                    <CardBody>
                      <div className="d-flex flex-column title-custom-card">
                        <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                          <span>BUKAN PESERTA KB MODERN</span>
                        </div>
                        <div className="d-flex">
                          {/* <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                          <i className="ri-women-line text-danger"></i>
                        </span>
                      </div> */}
                          <div className="d-flex justify-content-center align-items-center title-body">
                            <span>
                              {dataStunting?.peserta_kb_modern?.toLocaleString(
                                "id-ID"
                              )}
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
                          <span>JUMLAH PUS</span>
                        </div>
                        <div className="d-flex">
                          {/* <div className="avatar-xs-half flex-shrink-0">
                        <span className="avatar-title bg-danger-subtle rounded-4 fs-3">
                          <i className="ri-women-line text-danger"></i>
                        </span>
                      </div> */}
                          <div className="d-flex justify-content-center align-items-center title-body">
                            <span>
                              {dataStunting?.jumlah_pus?.toLocaleString(
                                "id-ID"
                              )}
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
                        active: customActiveTabTabelDaerah === "1",
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
                  {showNextData ? (
                    <></>
                  ) : (
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
                        onClick={() => getDataStuntingTabel()}
                      >
                        Kembali ke Provinsi
                      </button>
                    </>
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
                          {dataKolomNamaDaerah == "Se-Provinsi" ? (<></>):(<><th
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
                              className={showNextData ? "click-data" : ""}
                              style={{ minWidth: "270px" }}
                              onClick={(e) =>{item.nama_kabupaten
                                ? ""
                                : getDataStuntingTabelKabupaten(
                                    item.kode_prov,
                                    e
                                  ), dataKolomNamaDaerah == "Se-Provinsi" ? setNamaDaerahDetail(item.nama_prov) : ""}                                
                              }
                            >
                              {item.nama_kabupaten
                                ? item.nama_kabupaten =="Aceh"? "Provinsi Aceh": item.nama_kabupaten || "-"
                                : item.nama_prov=="Aceh"? "Provinsi Aceh": item.nama_prov || "-"}
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
                              {`${item.persentase_anggaran?.toLocaleString("id-ID",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}%`}
                            </td>
                            {dataKolomNamaDaerah == "Se-Provinsi" ? (<></>):(<><td style={{ textAlign: "center" }}>
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
                            </td>  </>) }
                                                      
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
                {/* <TabPane tabId="2">
                    <div style={{ overflowX: "auto" }}>
              <table 
                className="table table-bordered table-nowrap align-middle mb-0"
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
                        cursor: "pointer"
                      }}
                      onClick={() => requestSort("nama_provinsi")}                        
                    >
                      DAERAH {getSortIcon("nama_provinsi")}
                    </th>
                    <th
                      rowSpan="4"
                      style={{
                        textAlign: "center",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "150px",
                        verticalAlign: "middle",
                        cursor: "pointer"
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
                        cursor: "pointer"
                      }}
                      onClick={() => requestSort("jumlah_keluarga_sasaran")}
                    >
                      JUMLAH KELUARGA SASARAN {getSortIcon("jumlah_keluarga_sasaran")}
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
                        cursor: "pointer"
                      }}
                    >
                      KATEGORI KELUARGA BERISIKO STUNTING
                    </th>
                    <th rowSpan="4" style={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "150px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer"                        
                      }}
                      onClick={() => requestSort("totalanggaran")}>
                       TOTAL ANGGARAN STUNTING (Rp) {getSortIcon("totalanggaran")}
                    </th>
                    <th rowSpan="4" style={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "150px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer"
                      }}>
                      LIHAT DETAIL ANGGARAN STUNTING
                    </th>
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
                        cursor: "pointer"
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
                        cursor: "pointer"
                      }}
                      onClick={() => requestSort("jumlah_keluarga_tidak_beresiko_stunting")}
                    >
                      TIDAK BERISIKO {getSortIcon("jumlah_keluarga_tidak_beresiko_stunting")}
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
                        cursor: "pointer"
                      }}
                      onClick={() => requestSort("peringkat_kesejahteraan_1")}
                    >
                      DESIL 1 {getSortIcon("peringkat_kesejahteraan_1")}
                    </th>
                    <th
                      style={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "150px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer"
                      }}
                      onClick={() => requestSort("peringkat_kesejahteraan_2")}
                      >
                        PERINGKAT KESEJAHTERAAN 2 {getSortIcon("peringkat_kesejahteraan_2")}
                    </th>
                    <th
                      style={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "150px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer"
                      }}
                      onClick={() => requestSort("peringkat_kesejahteraan_3")}
                      >
                        PERINGKAT KESEJAHTERAAN 3 {getSortIcon("peringkat_kesejahteraan_3")}
                    </th>
                    <th
                      style={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "150px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer"
                      }}
                      onClick={() => requestSort("peringkat_kesejahteraan_4")}
                      >
                        PERINGKAT KESEJAHTERAAN 4 {getSortIcon("peringkat_kesejahteraan_4")}
                    </th>
                    <th
                      style={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "150px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer"
                      }}
                      onClick={() => requestSort("peringkat_kesejahteraan_diatas_4")}
                      >
                        PERINGKAT KESEJAHTERAAN &gt;4 {getSortIcon("peringkat_kesejahteraan_diatas_4")}
                    </th>
                    <th
                      style={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        maxWidth: "150px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer"
                      }}
                      onClick={() => requestSort("total_kesejahteraan")}
                      >
                        TOTAL {getSortIcon("total_kesejahteraan")}
                    </th>                   
                  </tr>                
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemsKabupaten.map((item, index) =>(
                    <tr key={index}>                    
                    <td style={{textAlign: "center",
                        verticalAlign: "middle"}}>
                      {indexOfFirstItemKabupaten + index + 1}
                    </td>
                    <td style={{ minWidth: "270px" }}>
                      {" "}
                      {item.nama_kabupaten || "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga
                        ? parseInt(item.jumlah_keluarga).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_sasaran
                        ? parseInt(item.jumlah_keluarga_sasaran).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.peringkat_kesejahteraan_1
                        ? parseInt(item.peringkat_kesejahteraan_1).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.peringkat_kesejahteraan_2
                        ? parseInt(item.peringkat_kesejahteraan_2).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.peringkat_kesejahteraan_3
                        ? parseInt(item.peringkat_kesejahteraan_3).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.peringkat_kesejahteraan_4
                        ? parseInt(item.peringkat_kesejahteraan_4).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.peringkat_kesejahteraan_diatas_4
                        ? parseInt(item.peringkat_kesejahteraan_diatas_4).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.total_kesejahteraan
                        ? parseInt(item.total_kesejahteraan).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {item.jumlah_keluarga_tidak_beresiko_stunting
                        ? parseInt(item.jumlah_keluarga_tidak_beresiko_stunting).toLocaleString("id-ID")
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
                    }} onClick={()=>handleOpen("", item.nama_kabupaten, item.kode_ddn1, "", "kab", item.totalanggaran)}>Lihat Detail</button>                           
                    <i style={{                                            
                      padding: "5px 10px",                      
                      cursor: "pointer",
                      fontSize: "30px"
                    }} onClick={()=>handleOpen("", item.nama_kabupaten, item.kode_ddn1, "", "kab", item.totalanggaran)} className="bx bx-list-ul text-primary"></i>
                    </td>                               
                  </tr>
                  ))}
                  {placeholdersKab}
                </tbody>
              </table>
            </div>            
              <Pagination currentPage={currentPageKabupaten} totalPages={totalPagesKabupaten} onPageChange={paginateKabupaten} />
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
                  style={{ textTransform: "uppercase" }}
                >
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100",{
                        active: customActiveTabAll === "1",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("1");
                      }}
                    >
                      URUSAN PEMERINTAH UNTUK PENANGANAN STUNTING
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "4",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("4");
                      }}
                    >
                      ANGGARAN SPM
                    </NavLink>
                  </NavItem>
                  <NavItem>
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
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "3",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("3");
                      }}
                    >
                      Perbandingan Keluarga Sasaran yang Berisiko dan Tidak
                      Berisiko Stunting
                    </NavLink>
                  </NavItem>                  
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "5",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("5");
                      }}
                    >
                      KELUARGA SASARAN MENURUT PERINGKAT KESEJAHTERAAN
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "6",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("6");
                      }}
                    >
                      KELUARGA SASARAN MENURUT USIA ANAK DAN PASANGAN USIA SUBUR
                      (PUS)
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "9",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("9");
                      }}
                    >
                      PASANGAN USIA SUBUR (PUS)
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "7",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("7");
                      }}
                    >
                      FASILITAS LINGKUNGAN TIDAK SEHAT
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames("h-100", {
                        active: customActiveTabAll === "8",
                      })}
                      onClick={() => {
                        toggleCustomTabAll("8");
                      }}
                    >
                      GRAFIK ALOKASI
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={customActiveTabAll} className="text-muted">
                <TabPane tabId="1">
                <HorizontalBarChart
                    dataZoom ={true}
                    dataTotal={5}
                    breakWord = {true}
                    dataColors='["#FCAD24"]'
                    trillion={true}                    
                    valueChart={dataChartTopUrusan[0]}
                    categoryChart={dataChartTopUrusan[1]}
                  />
                </TabPane>
                {/* <TabPane tabId="1">                        
              {dataShowAkunBelanja ? (
                <>
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      Top 5 Akun Belanja Terbesar Untuk Penurunan dan Pencegahan
                      Stunting
                    </h4>
                  </div>
                  <HorizontalBarChart
                    dataColors='["#FCAD24"]'
                    valueChart={dataChartTop5AkunBelanja[0]}
                    categoryChart={dataChartTop5AkunBelanja[1]}
                  />                  
                  <span
                    onClick={() => handleShowDataAkun(false)}
                    style={{ cursor: "pointer", color: "#2DAED4" }}
                  >
                    Lihat Grafik
                  </span>
                </>
              ) : (
                <>
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      Perbandingan Total Anggaran Pencegahan dan Penurunan
                      Stunting Berdasarkan Total Belanja Nasional
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
                          className={classnames("h-100",{
                            active:
                              customActiveTabPerbandinganAnggaranKesehatan ===
                              "1",
                          })}
                          onClick={() => {
                            toggleCustomPerbandinganAnggaranKesehatan("1");
                          }}
                        >
                          KESEHATAN
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink 
                          style={{ cursor: "pointer" }}
                          className={classnames("h-100", {
                            active:
                              customActiveTabPerbandinganAnggaranKesehatan ===
                              "2",
                          })}
                          onClick={() => {
                            toggleCustomPerbandinganAnggaranKesehatan("2");
                          }}
                        >
                          PENCEGAHAN DAN PENURUNAN STUNTING
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTabPerbandinganAnggaranKesehatan}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      <PieChartNew
                        dataChart={dataChartPerbandinganAnggaranKesehatan}
                        dataColors={'["#57E7B4", "#2DAED4"]'}
                        categoryName={[
                          "Bidang Urusan di Luar Kesehatan",
                          "Bidang Urusan Kesehatan",
                        ]}
                      />
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      <PieChartNew
                        dataChart={dataChartPerbandinganAnggaranStunting}
                        dataColors={'["#57E7B4", "#2DAED4"]'}
                        categoryName={[
                          "Anggaran Untuk Lainnya",
                          "Anggaran Penurunan dan Pencegahan Stunting",
                        ]}
                      />
                      <div className="d-flex justify-content-center align-items-center mt-4">
                        <span
                          onClick={() => handleShowDataAkun(true)}
                          style={{ cursor: "pointer", color: "#2DAED4" }}
                        >
                          Lihat Akun Belanja
                        </span>
                      </div>
                    </TabPane>
                  </TabContent>
                </>
              )}
            
                        </TabPane> */}
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
                  <div>
                    <h4 className="card-title">
                      Perbandingan Keluarga Sasaran yang Berisiko dan Tidak
                      Berisiko Stunting
                    </h4>
                  </div>
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
                          KABUPATEN
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTab}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      <StackedBarChart
                        dataColors='["#2DAED4", "#57E7B4"]'
                        valueCharts={dataBeresikoProvinsi}
                        categoryChart={dataCategoryChartProvinsi}
                        legendNames={["Berisiko", "Tidak Berisiko"]}
                      />
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      <StackedBarChart
                        dataColors='["#2DAED4", "#57E7B4"]'
                        valueCharts={dataBeresikoKabupaten}
                        legendNames={["Berisiko", "Tidak Berisiko"]}
                        categoryChart={dataCategoryChartKabupaten}
                      />
                    </TabPane>
                    {/* <TabPane tabId="3" id="kecamatan">
                  <StackedBarChart
                    dataColors='["#2DAED4", "#57E7B4"]'
                    valueCharts={dataBeresikoKecamatan}                    
                    legendNames={['Beresiko', 'Tidak Beresiko']}
                    categoryChart={dataCategoryChartKecamatan}
                  />
                </TabPane>
                <TabPane tabId="4" id="kelurahan">
                  <StackedBarChart
                    dataColors='["#2DAED4", "#57E7B4"]'
                    valueCharts={dataBeresikoKelurahan}                    
                    legendNames={['Beresiko', 'Tidak Beresiko']}
                    categoryChart={dataCategoryChartKelurahan}
                  />
                </TabPane> */}
                  </TabContent>
                </TabPane>
                <TabPane tabId="4">
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      ANGGARAN SPM UNTUK PENURUNAN DAN PENCEGAHAN STUNTING
                    </h4>
                  </div>
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
                                    dataStunting?.pie_spm_stunting?.jml_rincian_total_anggaran_spm_stunting/1000000000000
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
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      KELUARGA SASARAN MENURUT PERINGKAT KESEJAHTERAAN
                    </h4>
                  </div>
                  {/* <ColBarChart
                valueChart={dataChartKesejahteraan[1]}
                categoryChart={dataChartKesejahteraan[0]}
                seriesName={[
                  "Kesejahteraan 1",
                  "Kesejahteraan 2",
                  "Kesejahteraan 3",
                  "Kesejahteraan 4",
                ]}
                dataColors='["#2DAED4","#2DAED4C4","#2DAED47B","#2DAED43B"]'
              /> */}
                  <StackedBarChart
                    dataTotal={10}
                    dataZoom={true}
                    breakWord={true}
                    dataColors='["#695FF3", "#63A9ED", "#5BE9F3", "#99FFE7"]'
                    valueCharts={dataChartKesejahteraanStacked}
                    categoryChart={dataChartCategoryKesejahteraan}
                    legendNames={[
                      "Kesejahteraan 1",
                      "Kesejahteraan 2",
                      "Kesejahteraan 3",
                      "Kesejahteraan 4",
                    ]}
                  />
                </TabPane>
                <TabPane tabId="6">
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      KELUARGA SASARAN MENURUT USIA ANAK DAN PASANGAN USIA SUBUR
                      (PUS)
                    </h4>
                  </div>
                  <ColBarChart
                    valueChart={dataChartPus[1]}
                    categoryChart={dataChartPus[0]}
                    seriesName={["Baduta", "Balita", "Pus Hamil"]}
                    dataColors='["#2DAED4","#2DAED4C4","#2DAED47B","#2DAED43B"]'
                  />
                </TabPane>
                <TabPane tabId="9">
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      PASANGAN USIA SUBUR (PUS) 4T
                    </h4>
                  </div>
                  <VerticalBarChart
                        valueChart={dataChartPus4Terlalu[0]}
                        categoryChart={['Terlalu Banyak', 'Terlalu Dekat', 'Terlalu Muda', 'Terlalu Tua']}
                        dataColors='["#57E7B4"]'
                      />
                </TabPane>
                <TabPane tabId="7">
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      FASILITAS LINGKUNGAN TIDAK SEHAT
                    </h4>                    
                  </div>              
                  {dataShowChartFasilitasProvinsi ? (<><button
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
                        onClick={handleBack}
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
                              {currentCategoryClicked == "Jamban Tidak Layak" ? "Total Jamban Tidak Layak" : "Total Air Tidak Layak"}
                            </span>
                          </div>
                          <div className="d-flex">                            
                            <div className="d-flex justify-content-center align-items-center title-body">
                              <span>
                                <CountUp
                                  start={0}
                                  end={
                                    dataChartDetailFasilitasProvinsi[2]
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
                          <Col md={9}><HorizontalBarChart                    
                    dataColors= {currentCategoryClicked == "Jamban Tidak Layak" ? '["#FCAD24"]' : '["#FCAD248B"]'}
                    valueChart={dataChartDetailFasilitasProvinsi[0]}
                    categoryChart={dataChartDetailFasilitasProvinsi[1]}                    
                    dataZoom={true}
                    breakWord={true}
                  /></Col>
                        </Row>                        
                      </>) : (<><HorizontalBarChart
                    onBarClick={handleBarClick}
                    dataColors='["#FCAD24", "#FCAD248B"]'
                    valueChart={dataChartFasilitasTidakSehat}
                    fasilitasLingkungan = {true}
                    categoryChart={["Jamban Tidak Layak", "Air Tidak Layak"]}
                  /></>) }                  
                </TabPane>
                <TabPane tabId="8">
                  <h4 className="card-title mb-4 d-flex justify-content-center">
                    persentase anggaran pencegahan dan penurunan stunting
                    dibandingkan dengan persentase keluarga sasaran yang
                    berisiko stunting
                  </h4>

                  <div className="nav-beranda">
                    <Nav
                      tabs
                      className="nav nav-tabs-custom card-header-tabs border-bottom-0 ms-2 mb-3"
                    >
                      {/* <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabChartAnggaran === "1",
                          })}
                          onClick={() => {
                            toggleCustomChartAnggaran("1");
                            
                          }}
                        >
                          NASIONAL
                        </NavLink>
                      </NavItem> */}
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: customActiveTabChartAnggaran === "2",
                          })}
                          onClick={() => {
                            toggleCustomChartAnggaran("2");
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

      {/* <Row>
        <Col xl={6}>
          <Card>
            <CardBody>
              {dataShowAkunBelanja ? (
                <>
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      Top 5 Akun Belanja Terbesar Untuk Penurunan dan Pencegahan
                      Stunting
                    </h4>
                  </div>
                  <HorizontalBarChart
                    dataColors='["#FCAD24"]'
                    valueChart={dataChartTop5AkunBelanja[0]}
                    categoryChart={dataChartTop5AkunBelanja[1]}
                  />                  
                  <span
                    onClick={() => handleShowDataAkun(false)}
                    style={{ cursor: "pointer", color: "#2DAED4" }}
                  >
                    Lihat Grafik
                  </span>
                </>
              ) : (
                <>
                  <div className="separator">
                    <h4 className="card-title mb-0">
                      Perbandingan Total Anggaran Pencegahan dan Penurunan
                      Stunting Berdasarkan Total Belanja Nasional
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
                          className={classnames("h-100",{
                            active:
                              customActiveTabPerbandinganAnggaranKesehatan ===
                              "1",
                          })}
                          onClick={() => {
                            toggleCustomPerbandinganAnggaranKesehatan("1");
                          }}
                        >
                          KESEHATAN
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink 
                          style={{ cursor: "pointer" }}
                          className={classnames("h-100", {
                            active:
                              customActiveTabPerbandinganAnggaranKesehatan ===
                              "2",
                          })}
                          onClick={() => {
                            toggleCustomPerbandinganAnggaranKesehatan("2");
                          }}
                        >
                          PENCEGAHAN DAN PENURUNAN STUNTING
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent
                    activeTab={customActiveTabPerbandinganAnggaranKesehatan}
                    className="text-muted"
                  >
                    <TabPane tabId="1" id="provinsi">
                      <PieChartNew
                        dataChart={dataChartPerbandinganAnggaranKesehatan}
                        dataColors={'["#57E7B4", "#2DAED4"]'}
                        categoryName={[
                          "Bidang Urusan di Luar Kesehatan",
                          "Bidang Urusan Kesehatan",
                        ]}
                      />
                    </TabPane>
                    <TabPane tabId="2" id="kabupaten">
                      <PieChartNew
                        dataChart={dataChartPerbandinganAnggaranStunting}
                        dataColors={'["#57E7B4", "#2DAED4"]'}
                        categoryName={[
                          "Anggaran Untuk Lainnya",
                          "Anggaran Penurunan dan Pencegahan Stunting",
                        ]}
                      />
                      <div className="d-flex justify-content-center align-items-center mt-4">
                        <span
                          onClick={() => handleShowDataAkun(true)}
                          style={{ cursor: "pointer", color: "#2DAED4" }}
                        >
                          Lihat Akun Belanja
                        </span>
                      </div>
                    </TabPane>
                  </TabContent>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="card-height-100">
            <CardBody>
              <div className="separator mb-5">
                <h4 className="card-title ">
                  Perbandingan Total Keluarga Beresiko Stunting Berdasarkan
                  Total Keluarga Sasaran
                </h4>
              </div>
              <PieChartNew
                dataChart={dataChartPerbandinganKeluargaStunting}
                categoryName={[
                  "Keluarga Tidak Beresiko Stunting",
                  "Keluarga Beresiko Stunting",
                ]}
                dataColors={'["#57E7B4", "#2DAED4"]'}
              />
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      {/* <Row>
        <Col>
          <Card className="card-height-100">
            <CardBody>
              <div className="separator">
                <h4 className="card-title">
                  Perbandingan Keluarga Sasaran yang Berisiko dan Tidak Berisiko
                  Stunting
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
                      KABUPATEN
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
                      KELURAHAN
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={customActiveTab} className="text-muted">
                <TabPane tabId="1" id="provinsi">
                  <StackedBarChart
                    dataColors='["#2DAED4", "#57E7B4"]'
                    valueChart1={dataBeresikoProvinsi}
                    valueChart2={dataTidakBeresikoProvinsi}
                    categoryChart={dataCategoryChartProvinsi}
                  />
                </TabPane>
                <TabPane tabId="2" id="kabupaten">
                  <StackedBarChart
                    dataColors='["#2DAED4", "#57E7B4"]'
                    valueChart1={dataBeresikoKabupaten}
                    valueChart2={dataTidakBeresikoKabupaten}
                    categoryChart={dataCategoryChartKabupaten}
                  />
                </TabPane>
                <TabPane tabId="3" id="kecamatan">
                  <StackedBarChart
                    dataColors='["#2DAED4", "#57E7B4"]'
                    valueChart1={dataBeresikoKecamatan}
                    valueChart2={dataTidakBeresikoKecamatan}
                    categoryChart={dataCategoryChartKecamatan}
                  />
                </TabPane>
                <TabPane tabId="4" id="kelurahan">
                  <StackedBarChart
                    dataColors='["#2DAED4", "#57E7B4"]'
                    valueChart1={dataBeresikoKelurahan}
                    valueChart2={dataTidakBeresikoKelurahan}
                    categoryChart={dataCategoryChartKelurahan}
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      {/* <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  ANGGARAN SPM UNTUK PENURUNAN DAN PENCEGAHAN STUNTING
                </h4>
              </div>
              <HorizontalBarChart
                dataColors='["#FCAD24"]'
                valueChart={dataChartSpmStunting[0]}
                categoryChart={dataChartSpmStunting[1]}
              />
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      {/* <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  KELUARGA SASARAN MENURUT PERINGKAT KESEJAHTERAAN
                </h4>
              </div>
              <ColBarChart
                valueChart={dataChartKesejahteraan[1]}
                categoryChart={dataChartKesejahteraan[0]}
                seriesName={[
                  "Kesejahteraan 1",
                  "Kesejahteraan 2",
                  "Kesejahteraan 3",
                  "Kesejahteraan 4",
                ]}
                dataColors='["#2DAED4","#2DAED4C4","#2DAED47B","#2DAED43B"]'
              />
            </CardBody>
          </Card>
        </Col>
      </Row> */}

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

      {/* <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  KELUARGA SASARAN MENURUT USIA ANAK DAN PASANGAN USIA SUBUR
                  (PUS)
                </h4>
              </div>
              <ColBarChart
                valueChart={dataChartPus[1]}
                categoryChart={dataChartPus[0]}
                seriesName={["Baduta", "Balita", "Pus Hamil"]}
                dataColors='["#2DAED4","#2DAED4C4","#2DAED47B","#2DAED43B"]'
              />              
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      {/* <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="separator">
                <h4 className="card-title mb-0">
                  FASILITAS LINGKUNGAN TIDAK SEHAT
                </h4>
              </div>           
              <HorizontalBarChart
                dataColors='["#FCAD24", "#FCAD248B"]'
                valueChart={dataChartFasilitasTidakSehat}
                categoryChart={["Jamban Tidak Layak", "Air Tidak Layak"]}
              />
            </CardBody>
          </Card>
        </Col>
      </Row> */}

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
            {/* {dataJenisPemda == "kab" ? "Kabupaten/Kota" : "Provinsi"} */}
            {dataDetailNamaDaerah == "Aceh"? "Provinsi Aceh" : dataDetailNamaDaerah}
          </ModalHeader>
          <ModalBody>
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
                        {index + 1}
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
                        {/* <button style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px"
                    }} onClick={()=>dataJenisPemda=="prov" ? handleOpenNextModal("", item.kode_sub_giat, item.kode_ddn, "",item.total_rinciansub) : (dataJenisPemda=="kab" || dataJenisPemda=="kota") ? handleOpenNextModal("", item.kode_sub_giat, "", item.kode_ddn,item.total_rinciansub) : handleOpenNextModal(item.kode_prov, item.kode_sub_giat, "", "",item.total_rinciansub)}>Lihat Detail</button> */}

                        <i
                          style={{
                            padding: "5px 10px",
                            cursor: "pointer",
                            fontSize: "30px",
                          }}
                          onClick={() =>
                            dataJenisPemda == "prov"
                              ? handleOpenNextModal(
                                  "",
                                  item.kode_sub_giat,
                                  item.kode_ddn,
                                  "",
                                  item.total_rinciansub
                                )
                              : dataJenisPemda == "kab" ||
                                dataJenisPemda == "kota"
                              ? handleOpenNextModal(
                                  "",
                                  item.kode_sub_giat,
                                  "",
                                  item.kode_ddn,
                                  item.total_rinciansub
                                )
                              : handleOpenNextModal(
                                  item.kode_prov,
                                  item.kode_sub_giat,
                                  "",
                                  "",
                                  item.total_rinciansub
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
              currentPage={currentPageDetailSub}
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
                  </tr>
                </thead>
                <tbody style={{ minHeight: "500px" }}>
                  {currentItemDetailSub.map((item, index) => (
                    <tr key={index}>
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
    </React.Fragment>
  );
};

export default ContentStunting;
