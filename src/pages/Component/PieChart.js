import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, CardHeader } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import Loader from "../../Components/Common/Loader";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;


const PieChart = ({type, title, labels, dataColors, isLoading, setLoadingPiePerencanaan, isTahun, method }) => {
    const [data, setData] = useState([]);

    const SingleOptions = [
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
    ];

    const [selectedSingle, setSelectedSingle] = useState(SingleOptions[0]); // Set default value

    var chartPieBasicColors = getChartColorsArray(dataColors);
    var options = {
        chart: {
            height: 400,
            type: "pie",
        },
        labels: labels,
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

    useEffect(() => {
        getData()
    }, []);

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedSingle(selectedValue);
        getData(selectedValue); // Panggil API dengan filter yang dipilih
    };

    const getData = async (filter) => {
        console.log(title, "title")
        if (title === 'Tahapan Penganggaran') {
            setData([1000, 800, 500])
        } else if (title === 'Tahapan Realisasi') {
            setData([10, 10])
        } else if (title === 'Tahapan Perencanaan'){
            let url = ''
            if (title === 'Tahapan Perencanaan') {
                url = '/dash_beranda_pie_perencanaan'
            }

            console.log(url, "url nyaa")

            try {
                const requestOptions = {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ filter }),
                };

                console.log(filter, "ini filter");

                const response = await fetch(
                    `${API_URI + url}`,
                    requestOptions
                );

                console.log(response, "res perencanaan")

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                const obj = data.data[0];
                const resultArray = Object.values(obj).map(Number);

                setData(resultArray); // Sesuaikan berdasarkan struktur data yang dikembalikan API
            } catch (error) {
                console.log(error, "error")
                //   setErrorPiePerencanaan(error);
            } finally {
                setLoadingPiePerencanaan(false);
            }
        }

    };


    return (
        <Card className="card-animate" style={{ minHeight: "650px" }}>
            <CardHeader>
                <div className="card-title mb-0" style={{ display: 'flex', justifyContent: "center", fontSize: 20, fontWeight: 650 }}>{title}</div>
            </CardHeader>
            <CardBody>
                {isLoading ? <>
                    <Loader error={"Sedang Memuat data"} />
                </> : <>
                    <div className="d-flex flex-column align-items-center">
                        {isTahun ? <>
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
                        </> : <></>}

                    </div>
                    <ReactApexChart
                        dir="ltr"
                        className="apex-charts"
                        series={data}
                        options={options}
                        type={type}
                        height={400}
                    />
                </>}

            </CardBody>
        </Card>

    )
}

export default PieChart;