import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import getChartColorsArray from '../../Components/Common/ChartsDynamicColor';
import ReactApexChart from 'react-apexcharts';
import TableContainer from '../../Components/Common/TableContainerReactTable';

const API_URI = `${process.env.REACT_APP_API_URL_BE}`
const ContentDetailPendidikan = () => {
    const [dataAnggaranPendidikan, setDataAnggaranPendidikan] = useState([]);
    const [loadingAnggaranPendidikan, setLoadingAnggaranPendidikan] = useState([]);
    const [errorAnggaranPendidikan, setErrorAnggaranPendidikan] = useState([]);
  
    const getDataAnggaranPendidikan = () => {
      const fetchData = async () => {
        try {
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            //   query:
            //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
            // }),
          };
          const response = await fetch(
            `${API_URI}/dash_detail_spm_anggaran_pendidikan`,
            requestOptions
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const dataAnggaranPendidikan = await response.json();
          // const formatDataPengeluaran = parseFloat(
          //   dataPengeluaran.datarows[0][0].toFixed(2)
          // );
        //   console.log(dataAnggaranPendidikan.data.nama_bidang_uruan.buckets["nama_bidang_urusan : \"URUSAN PEMERINTAHAN BIDANG PENDIDIKAN\""].total_rincian.value, 'ini')
          const mappedData = (dataAnggaranPendidikan.data.nama_bidang_uruan.buckets["nama_bidang_urusan : \"URUSAN PEMERINTAHAN BIDANG PENDIDIKAN\""].total_rincian.value).toLocaleString('id-ID')
        //   console.log(dataAnggaranPendidikan, "ini pendidikan");

          console.log(mappedData, 'ini value anggaran pendidikan')
          setDataAnggaranPendidikan(mappedData);
  
          // console.log(data.hits.hits)
        } catch (errorAnggaranPendidikan) {
          setErrorAnggaranPendidikan(errorAnggaranPendidikan);
        } finally {
          setLoadingAnggaranPendidikan(false);
        }
      };
      fetchData();
    };
    
    const [dataTop10AnggaranPendidikan, setDataTop10AnggaranPendidikan] = useState({});
    const [loadingTop10AnggaranPendidikan, setLoadingTop10AnggaranPendidikan] = useState([]);
    const [errorTop10AnggaranPendidikan, setErrorTop10AnggaranPendidikan] = useState([]);
  
    const getDataTop10AnggaranPendidikan = () => {
      const fetchData = async () => {
        try {
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            //   query:
            //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
            // }),
          };
          const response = await fetch(
            `${API_URI}/dash_detail_spm_top10_anggaran_pendidikan`,
            requestOptions
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const dataTop10AnggaranPendidikan = await response.json();
          // const formatDataPengeluaran = parseFloat(
          //   dataPengeluaran.datarows[0][0].toFixed(2)
          // );
          console.log(dataTop10AnggaranPendidikan, 'ini')
            const keys = [];
            const values = [];
            
            dataTop10AnggaranPendidikan.data.nama_kegiatan.buckets.forEach((bucket) => {
                keys.push(bucket.key);
                values.push(bucket.total_rincian.value);
            });
            
            // console.log(keys, 'ini isi keys')
            // console.log(values, 'ini isi keys')
         const mappedData = {
            keys: keys,
            values: values
         }
         
          console.log(mappedData, "ini top 10");
          setDataTop10AnggaranPendidikan(mappedData);
  
          // console.log(data.hits.hits)
        } catch (errorTop10AnggaranPendidikan) {
          setErrorTop10AnggaranPendidikan(errorTop10AnggaranPendidikan);
        } finally {
          setLoadingTop10AnggaranPendidikan(false);
        }
      };
      fetchData();
    };

    const [dataAnggaranPendPerWil, setDataAnggaranPendPerWil] = useState([]);
    const [loadingAnggaranPendPerWil, setLoadingAnggaranPendPerWil] = useState([]);
    const [errorAnggaranPendPerWil, setErrorAnggaranPendPerWil] = useState([]);
  
    const getDataAnggaranPendPerWil = () => {
      const fetchData = async () => {
        try {
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            //   query:
            //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
            // }),
          };
          const response = await fetch(
            `${API_URI}/dash_detail_spm_rincian_anggaran_pendidikan_per_wilayah`,
            requestOptions
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const dataAnggaranPendPerWil = await response.json();
          // const formatDataPengeluaran = parseFloat(
          //   dataPengeluaran.datarows[0][0].toFixed(2)
          // );
          const tableData = dataAnggaranPendPerWil.data.nama_wilayah.buckets.map((bucket, index) => ({
            nomor: index,
            namaWilayah: bucket.key,
            totalBelanja: bucket.total_rincian.value
          }));
          
          console.log(tableData, "ini tabel pendidikan");
          setDataAnggaranPendPerWil(tableData);
  
          // console.log(data.hits.hits)
        } catch (errorAnggaranPendPerWil) {
          setErrorAnggaranPendPerWil(errorAnggaranPendPerWil);
        } finally {
          setLoadingAnggaranPendPerWil(false);
        }
      };
      fetchData();
    };

    const [dataRincianAkunAnggaranPend, setDataRincianAkunAnggaranPend] = useState([]);
    const [loadingRincianAkunAnggaranPend, setLoadingRincianAkunAnggaranPend] = useState([]);
    const [errorRincianAkunAnggaranPend, setErrorRincianAkunAnggaranPend] = useState([]);
  
    const getDataRincianAkunAnggaranPend = () => {
      const fetchData = async () => {
        try {
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            //   query:
            //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
            // }),
          };
          const response = await fetch(
            `${API_URI}/dash_detail_spm_rincian_akun_anggaran_pendidikan`,
            requestOptions
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const dataRincianAkunAnggaranPend = await response.json();
          // const formatDataPengeluaran = parseFloat(
          //   dataPengeluaran.datarows[0][0].toFixed(2)
          // );
          console.log(dataRincianAkunAnggaranPend, "ini pendidikan");
          setDataRincianAkunAnggaranPend(dataRincianAkunAnggaranPend);
  
          // console.log(data.hits.hits)
        } catch (errorRincianAkunAnggaranPend) {
          setErrorRincianAkunAnggaranPend(errorRincianAkunAnggaranPend);
        } finally {
          setLoadingRincianAkunAnggaranPend(false);
        }
      };
      fetchData();
    };

    const [dataTop10SubGiatAnggaranPend, setDataTop10SubGiatAnggaranPend] = useState({});
    const [loadingTop10SubGiatAnggaranPend, setLoadingTop10SubGiatAnggaranPend] = useState([]);
    const [errorTop10SubGiatAnggaranPend, setErrorTop10SubGiatAnggaranPend] = useState([]);
  
    const getDataTop10SubGiatAnggaranPend = () => {
      const fetchData = async () => {
        try {
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            //   query:
            //     "select sum(total_rincian)/1000000000000 TotalPembiayaanK from konsolidasi_apbd where kode_kelompok = '6.2'",
            // }),
          };
          const response = await fetch(
            `${API_URI}/dash_detail_spm_top10_subgiat_anggaran_pendidikan`,
            requestOptions
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const dataTop10SubGiatAnggaranPend = await response.json();
          // const formatDataPengeluaran = parseFloat(
          //   dataPengeluaran.datarows[0][0].toFixed(2)
          // );
          console.log(dataTop10SubGiatAnggaranPend, 'ini subgiat10')
          const keys = [];
          const values = [];
            
            dataTop10SubGiatAnggaranPend.data.nama_sub_giat.buckets.forEach((bucket) => {
                keys.push(bucket.key);
                values.push(bucket.total_rincian.value);
            });
            
         const mappedData = {
            keys: keys,
            values: values
         }
          
          setDataTop10SubGiatAnggaranPend(mappedData);
  
          // console.log(data.hits.hits)
        } catch (errorTop10SubGiatAnggaranPend) {
          setErrorTop10SubGiatAnggaranPend(errorTop10SubGiatAnggaranPend);
        } finally {
          setLoadingTop10SubGiatAnggaranPend(false);
        }
      };
      fetchData();
    };

    useEffect(()=>{
        getDataAnggaranPendidikan();
        getDataTop10AnggaranPendidikan();
        getDataAnggaranPendPerWil();
        getDataRincianAkunAnggaranPend();
        getDataTop10SubGiatAnggaranPend();
    }, [])

    const CustomDataLabelTop10AnggaranPend = ({ dataColors }) => {
        var chartDatalabelsBarColors = getChartColorsArray(dataColors);
        const series = [{
            data: dataTop10AnggaranPendidikan?.values || []
        }];
        var options = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    barHeight: '100%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom'
                    },
                }
            },
            colors: chartDatalabelsBarColors,
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: ['#000']
                },
                formatter: function (val, opt) {
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val.toLocaleString();
                    return val.toLocaleString('id-ID');
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false
                }
            },
            stroke: {
                width: 1,
                colors: ['#000']
            },
            xaxis: {
                categories: dataTop10AnggaranPendidikan?.keys || [],
            },
            legend: {
              show: false,
              showForSingleSeries: !0,
              customLegendItems: ["Actual", "Expected"],
              Markers: {
                  fillColors: ["#00E396", "#775DD0"],
              },
          },
            yaxis: {
                labels: {
                    // show: false
                    show: true
                }
            },
            title: {
                text: '',
                align: 'center',
                floating: true,
                style: {
                    fontWeight: 500,
                },
            },
            subtitle: {
                text: '',
                align: 'center',
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return '';
                        }
                    }
                }
            }
        };
        return (
            <React.Fragment>
                <ReactApexChart dir="ltr"
                    className="apex-charts"
                    options={options}
                    series={series}
                    type="bar"
                    height={550}
                />
            </React.Fragment>
        );
      };
      
    const CustomDataLabelTop10SubGiatPend = ({ dataColors }) => {
        var chartDatalabelsBarColors = getChartColorsArray(dataColors);
        const series = [{
            data: dataTop10SubGiatAnggaranPend?.values || []
        }];
        var options = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    barHeight: '100%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom'
                    },
                }
            },
            colors: chartDatalabelsBarColors,
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: ['#000']
                },
                formatter: function (val, opt) {
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val.toLocaleString();
                    return val.toLocaleString('id-ID');
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false
                }
            },
            stroke: {
                width: 1,
                colors: ['#000']
            },
            xaxis: {
                categories: dataTop10SubGiatAnggaranPend?.keys || [],
            },
            legend: {
              show: false,
              showForSingleSeries: !0,
              customLegendItems: ["Actual", "Expected"],
              Markers: {
                  fillColors: ["#00E396", "#775DD0"],
              },
          },
            yaxis: {
                labels: {
                    // show: false
                    show: true
                }
            },
            title: {
                text: '',
                align: 'center',
                floating: true,
                style: {
                    fontWeight: 500,
                },
            },
            subtitle: {
                text: '',
                align: 'center',
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return '';
                        }
                    }
                }
            }
        };
        return (
            <React.Fragment>
                <ReactApexChart dir="ltr"
                    className="apex-charts"
                    options={options}
                    series={series}
                    type="bar"
                    height={550}
                />
            </React.Fragment>
        );
      };

      const PaginationTable = () => {
        const paginationTable = dataAnggaranPendPerWil
          // [{ id: "#VL2111", name: "Jonathan", date: "07 Oct, 2021", total: "$24.05", status: "Paid" },
          // { id: "#VL2110", name: "Harold", date: "07 Oct, 2021", total: "$26.15", status: "Paid" },
          // { id: "#VL2109", name: "Shannon", date: "06 Oct, 2021", total: "$21.25", status: "Refund" },
          // { id: "#VL2108", name: "Robert", date: "05 Oct, 2021", total: "$25.03", status: "Paid" },
          // { id: "#VL2107", name: "Noel", date: "05 Oct, 2021", total: "$22.61", status: "Paid" },
          // { id: "#VL2106", name: "Traci", date: "04 Oct, 2021", total: "$24.05", status: "Paid" },
          // { id: "#VL2105", name: "Kerry", date: "04 Oct, 2021", total: "$26.15", status: "Paid" },
          // { id: "#VL2104", name: "Patsy", date: "04 Oct, 2021", total: "$21.25", status: "Refund" },
          // { id: "#VL2103", name: "Cathy", date: "03 Oct, 2021", total: "$22.61", status: "Paid" },
          // { id: "#VL2102", name: "Tyrone", date: "03 Oct, 2021", total: "$25.03", status: "Paid" }];
      
        const columns = useMemo(
          () => [
            // {
            //   header: "ID",
            //   cell: (cell) => {
            //     return (
            //       <Link to="#" className="fw-medium">{cell.getValue()}</Link>
            //     );
            //   },
            //   accessorKey: "id",
            //   enableColumnFilter: false,
            // },
      
            {
              header: "Nama Wilayah",
              accessorKey: "namaWilayah",
              enableColumnFilter: false,
            },
            {
              header: "Total Belanja",
              accessorKey: "totalBelanja",
              enableColumnFilter: false,
            },
            // {
            //   header: "Total",
            //   accessorKey: "total",
            //   enableColumnFilter: false,
            // },
            // {
            //   header: "Status",
            //   enableColumnFilter: false,
            //   accessorKey: "status",
            //   cell: (cell) => {
            //     switch (cell.getValue()) {
            //       case "Paid":
            //         return (<span className="badge bg-success-subtle text-success text-uppercase"> {cell.getValue()}</span>);
            //       case "Refund":
            //         return (<span className="badge bg-warning-subtle  text-warning text-uppercase"> {cell.getValue()}</span>);
            //       default:
            //         return (<span className="badge bg-danger-subtle  text-danger text-uppercase"> {cell.getValue()}</span>);
            //     }
            //   },
            // },
            // {
            //   header: "Actions",
            //   enableColumnFilter: false,
            //   cell: (cell) => {
            //     return (
            //       <React.Fragment>
            //         Details
            //       </React.Fragment>
            //     );
            //   },
            // },
          ],
          []
        );
      
        return (
          <React.Fragment >
            <TableContainer
              columns={(columns || [])}
              data={(paginationTable || [])}
              customPageSize={15}
              tableClass="table-centered align-middle table-nowrap mb-0"
              theadClass="text-muted table-light"
              SearchPlaceholder='Search Products...'
            />
          </React.Fragment >
        );
      };

  return (
    <React.Fragment>
        <Row>
            <Col>
                <Card>
                    <CardBody>
                    <h4
                        className="card-title d-flex justify-content-center"
                        style={{ fontSize: "16px", fontWeight: 600 }}
                    >
                        ANGGARAN BELANJA BIDANG PENDIDIKAN
                    </h4>                      
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col md={4}>
                <Card>
                    <CardBody>
                    <h4
                        className="card-title d-flex justify-content-center"
                        style={{ fontSize: "16px", fontWeight: 600 }}
                        >
                        Total Belanja Bidang Pendidikan
                    </h4>                
                    <div className='d-flex justify-content-center align-items-center'>
                        {dataAnggaranPendidikan}
                    </div>              
                    </CardBody>
                </Card>
            </Col>
            <Col md={8}>
                <Card>
                    <CardBody>
                    <h4
                        className="card-title d-flex justify-content-center"
                        style={{ fontSize: "16px", fontWeight: 600 }}
                        >
                        Top 5 Kegiatan Pendidikan
                    </h4>                
                    <CustomDataLabelTop10AnggaranPend dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'/>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col>
                <Card>
                    <CardBody>
                    <h4
                        className="card-title d-flex justify-content-center"
                        style={{ fontSize: "16px", fontWeight: 600 }}
                        >
                        Total Belanja Bidang Pendidikan
                    </h4>                
                    <CustomDataLabelTop10SubGiatPend dataColors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]' />
                    </CardBody>
                </Card>
            </Col>
        </Row>        
        <Row>
            <Col>
            <Card>
                <CardBody>
                  {/* <PaginationTable />   */}
                </CardBody>
            </Card>
            </Col>
        </Row>
    </React.Fragment>
  )
}

export default ContentDetailPendidikan