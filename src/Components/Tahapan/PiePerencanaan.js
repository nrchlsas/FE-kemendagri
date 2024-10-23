import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import getChartColorsArray from '../Common/ChartsDynamicColor';
import ReactApexChart from 'react-apexcharts';
import Select from 'react-select';
const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const SingleOptions = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
];

const TahapanPiePerencanaan = ({ title, dataColors }) => {
  const [selectedSingle, setSelectedSingle] = useState(SingleOptions[0]); // Set default value
  const [dataPiePerencanaan, setDataPiePerencanaan] = useState([]);
  const [errorPiePerencanaan, setErrorPiePerencanaan] = useState(null);
  const [loadingPiePerencanaan, setLoadingPiePerencanaan] = useState(true);

  useEffect(() => {
    getPiePerencanaan(selectedSingle.value);
    // SimplePieTahapanRencana();
  }, []);

  const getPiePerencanaan = async (filter) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filter }),
      };

      const response = await fetch(`${API_URI}/dash_beranda_pie_perencanaan`, requestOptions);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const mappedData = [parseFloat(data.data['0'].persiapan), parseFloat(data.data['0'].rancangan_awal), parseFloat(data.data['0'].rancangan), parseFloat(data.data['0'].musrenbang), parseFloat(data.data['0'].rancangan_akhir), parseFloat(data.data['0'].penetapan)];

      setDataPiePerencanaan(mappedData); // Sesuaikan berdasarkan struktur data yang dikembalikan API
    } catch (error) {
      setErrorPiePerencanaan(error);
    } finally {
      setLoadingPiePerencanaan(false);
    }
  };

  const SimplePieTahapanRencana = ({ dataColors }) => {
    var dataColors = ['#FF5733', '#33FFF2', '#3357FF', '#FF33A1', '#A133FF', '#388E3C'];
    var chartPieBasicColors = getChartColorsArray(dataColors);
    const series = dataPiePerencanaan;
    var options = {
      chart: {
        height: 400,
        type: 'donut',
      },
      labels: ['Persiapan', 'Rancangan Awal', 'Rancangan', 'Musrembang', 'Rancangan Akhir', 'Penetapan'],
      legend: {
        position: 'bottom',
      },

      dataLabels: {
        style: {
          fontSize: '12px',
          colors: ['#000000'],
        },
        dropShadow: {
          enabled: false,
        },
      },
      colors: chartPieBasicColors,
    };
    return <ReactApexChart dir='ltr' className='apex-charts' series={series} options={options} type='donut' height={400} />;
  };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    console.log('Selected value:', selectedValue); // Debugging

    setSelectedSingle(selectedValue);
    getPiePerencanaan(selectedValue); // Panggil API dengan filter yang dipilih
  };

  return (
    <React.Fragment>
      <Row>
        <Col md={12}>
          <Card className='card-animate' style={{ minHeight: '650px' }}>
            <CardBody>
              <div className='d-flex flex-column align-items-center'>
                <div
                  className='card-title mb-3'
                  style={{
                    fontColor: '#333333',
                    fontSize: '30px',
                    fontWeight: 650,
                  }}
                >
                  {title}
                </div>
                <div className='d-flex'>
                  <div className='d-flex justify-content-center align-items-center' style={{ marginRight: '20px', fontSize: '18px' }}>
                    Tahun :
                  </div>
                  <div>
                    <select
                      style={{
                        padding: '8px 12px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f8f8f8',
                        color: '#333',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                      value={selectedSingle}
                      onChange={handleSelectChange}
                    >
                      {/* <option value="">Select an option</option> */}
                      <option value='2024'>2024</option>
                      <option value='2025'>2025</option>
                    </select>
                  </div>
                </div>
              </div>
              <SimplePieTahapanRencana dataColors={dataColors} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default TahapanPiePerencanaan;
