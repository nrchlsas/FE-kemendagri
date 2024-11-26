import React, { useEffect, useState } from 'react';
import {
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    Collapse,
    Row,
    Col,
    Card,
    CardBody
} from "reactstrap";

//SimpleBar
import SimpleBar from "simplebar-react";

// const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const FilterRightSide = ({ dataFilter, onSelectFilter }) => {    

    // open offcanvas
    const [open, setOpen] = useState(false);
    const toggleLeftCanvas = () => {
        setOpen(!open);
    };

    window.onscroll = function () {
        scrollFunction();
    };

    const scrollFunction = () => {
        const element = document.getElementById("back-to-top");
        if (element) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }
    };

    const toTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };        


    // const [dataFilter, setDataFilter] = useState([])
    // const [errorDataFilter, setErrorDataFilter] = useState([])
    // const [loadingDataFilter, setLoadingDataFilter] = useState([])

    // const getDataFilter = () => {
    // const fetchData = async () => {
    //     try {
    //       const requestOptions = {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({

    //         }),
    //       };          
    //       const response = await fetch(
    //         `${API_URI}/dashboard_anggaran_analisis`,
    //         requestOptions
    //       );
  
    //       if (!response.ok) {
    //         throw new Error("Network response was not ok");
    //       }
    //       const dataFilter = await response.json();

    //       setDataFilter(dataFilter?.data)
          
    //     } catch (errorDapodikTabel) {
    //         setErrorDataFilter(errorDapodikTabel);
    //     } finally {
    //         setLoadingDataFilter(false);
    //     }
    //   };
    //   fetchData();
    // };

    // useEffect(() => {
    //     getDataFilter()
    // },[])

    const [selectedValues, setSelectedValues] = useState({
        fungsi: [],
        // spm: [],
        // urusan: [],
        // bidangUrusan: [],
      });
    
      // Fungsi untuk menangani perubahan checkbox
      const handleCheckboxChange = (event, filterType) => {
        const { value, checked } = event.target;
    
        const updatedValues = { ...selectedValues };
        if (checked) {
          // Tambahkan nilai jika dicentang
          updatedValues[filterType].push(value);
        } else {
          // Hapus nilai jika tidak dicentang
          updatedValues[filterType] = updatedValues[filterType].filter(
            (item) => item !== value
          );
        }
    
        setSelectedValues(updatedValues);
        onSelectFilter(updatedValues);
      };

    return (
        <React.Fragment>
            <button
                onClick={() => toTop()}
                className="btn btn-danger btn-icon" id="back-to-top">
                <i className="ri-arrow-up-line"></i>
            </button>

            {/* {preloader === "enable" && <div id="preloader">
                <div id="status">
                    <div className="spinner-border text-primary avatar-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>} */}

            <div>
                <div className="customizer-setting d-none d-md-block">
                    <div onClick={toggleLeftCanvas} className="btn-info rounded-pill shadow-lg btn btn-icon btn-lg p-2">
                        <i className='mdi mdi-filter-outline fs-22'></i>
                    </div>
                </div>
                <Offcanvas style={{width: "700px"}} isOpen={open} toggle={toggleLeftCanvas} direction="end" className="bg-light offcanvas-end border-0">
                    <OffcanvasHeader className="d-flex align-items-center bg-light bg-gradient p-3 offcanvas-header-light" toggle={toggleLeftCanvas}>
                    <i className='mdi mdi-filter-outline fs-22'></i><span className="m-0 me-2 text-dark">FILTER</span>
                    </OffcanvasHeader>
                    <OffcanvasBody className="p-0">
                        <SimpleBar className="h-100 p-2">
                                <Row >
                                    <Col md={6}>
                                        <Card className='card-height-100 card-animate'>
                                            <CardBody>
                                        <div className='mb-2'>
                                            <span style={{
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                padding: "2px 5px",
                                                border: "none",
                                                borderRadius: "5px",
                                                width:"30%",
                                                fontSize: "10px",
                                            }}>Fungsi</span>
                                        </div>                                            
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_fungsi?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e) => handleCheckboxChange(e, "fungsi")} class="form-check-input" type="checkbox" id={`check-fungsi-${index}`} value={item.kode_fungsi}/>
                                                <label class="form-check-label" for={`check-fungsi-${index}`}>
                                                    {item.nama_fungsi}
                                                </label>
                                            </div>
                                        ))}
                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className='card-height-100 card-animate'>
                                            <CardBody>
                                            <div className='mb-2'>
                                            <span style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            padding: "2px 5px",
                                            border: "none",
                                            borderRadius: "5px",
                                            
                                            fontSize: "10px",
                                        }}>SPM</span>
                                        </div>
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_spm?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check-spm-${index}`} value={item.id_spm}/>
                                                <label class="form-check-label" for={`check-spm-${index}`}>
                                                    {item.spm_teks}
                                                </label>
                                            </div>
                                        ))}    
                                        </div>
                                        
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>   
                                <Row >
                                    <Col md={6}>
                                        <Card className='card-animate'>
                                            <CardBody>
                                        <div className='mb-2'>
                                            <span style={{
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                padding: "2px 5px",
                                                border: "none",
                                                borderRadius: "5px",
                                                width:"30%",
                                                fontSize: "10px",
                                            }}>Urusan</span>
                                        </div>                                            
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_urusan?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check-urusan-${index}`} value={item.kode_urusan}/>
                                                <label class="form-check-label" for={`check-urusan-${index}`}>
                                                    {item.nama_urusan}
                                                </label>
                                            </div>
                                        ))}
                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className='card-height-100 card-animate'>
                                            <CardBody>
                                            <div className='mb-2'>
                                            <span style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            padding: "2px 5px",
                                            border: "none",
                                            borderRadius: "5px",
                                            
                                            fontSize: "10px",
                                        }}>Bidang Urusan</span>
                                        </div>
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_bidang_urusan?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check-bidang-urusan-${index}`} value={item.kode_bidang_urusan}/>
                                                <label class="form-check-label" for={`check-bidang-urusan-${index}`}>
                                                    {item.nama_bidang_urusan}
                                                </label>
                                            </div>
                                        ))}    
                                        </div>
                                        
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>  
                                <Row >
                                    <Col md={6}>
                                        <Card className='card-animate'>
                                            <CardBody>
                                        <div className='mb-2'>
                                            <span style={{
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                padding: "2px 5px",
                                                border: "none",
                                                borderRadius: "5px",
                                                width:"30%",
                                                fontSize: "10px",
                                            }}>Program</span>
                                        </div>
                                            {/* {Array.from({length:7}, (_, index)=>(
                                        <div key={index} class="form-check mb-2">
                                            <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check${index}`} checked={checkboxes[index]} onChange={() => handleCheckboxChange(index)}/>
                                            <label class="form-check-label" for={`check${index}`}>
                                                Default checkbox
                                            </label>
                                        </div>
                                        ))} */}
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_program?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check-program-${index}`} value={item.kode_program}/>
                                                <label class="form-check-label" for={`check-program-${index}`}>
                                                    {item.nama_program}
                                                </label>
                                            </div>
                                        ))}
                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className='card-height-100 card-animate'>
                                            <CardBody>
                                            <div className='mb-2'>
                                            <span style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            padding: "2px 5px",
                                            border: "none",
                                            borderRadius: "5px",
                                            
                                            fontSize: "10px",
                                        }}>Kegiatan</span>
                                        </div>
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_giat?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check-kegiatan-${index}`} value={item.kode_giat}/>
                                                <label class="form-check-label" for={`check-kegiatan-${index}`}>
                                                    {item.nama_giat}
                                                </label>
                                            </div>
                                        ))}    
                                        </div>
                                        
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col md={6}>
                                        <Card className='card-animate'>
                                            <CardBody>
                                        <div className='mb-2'>
                                            <span style={{
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                padding: "2px 5px",
                                                border: "none",
                                                borderRadius: "5px",
                                                width:"30%",
                                                fontSize: "10px",
                                            }}>Sub Kegiatan</span>
                                        </div>
                                            {/* {Array.from({length:7}, (_, index)=>(
                                        <div key={index} class="form-check mb-2">
                                            <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check${index}`} checked={checkboxes[index]} onChange={() => handleCheckboxChange(index)}/>
                                            <label class="form-check-label" for={`check${index}`}>
                                                Default checkbox
                                            </label>
                                        </div>
                                        ))} */}
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_sub_giat?.slice(0,5).map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check-sub-kegiatan-${index}`} value={item.kode_sub_giat}/>
                                                <label class="form-check-label" for={`check-sub-kegiatan-${index}`}>
                                                    {item.nama_sub_giat}
                                                </label>
                                            </div>
                                        ))}
                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className='card-height-100 card-animate'>
                                            <CardBody>
                                            <div className='mb-2'>
                                            <span style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            padding: "2px 5px",
                                            border: "none",
                                            borderRadius: "5px",
                                            
                                            fontSize: "10px",
                                        }}>Objek</span>
                                        </div>
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_objek?.slice(0,5).map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check-objek-${index}`} value={item.kode_objek}/>
                                                <label class="form-check-label" for={`check-objek-${index}`}>
                                                    {item.nama_objek}
                                                </label>
                                            </div>
                                        ))}    
                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col md={6}>
                                        <Card className='card-animate'>
                                            <CardBody>
                                        <div className='mb-2'>
                                            <span style={{
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                padding: "2px 5px",
                                                border: "none",
                                                borderRadius: "5px",
                                                width:"30%",
                                                fontSize: "10px",
                                            }}>Rincian Objek</span>
                                        </div>
                                            {/* {Array.from({length:7}, (_, index)=>(
                                        <div key={index} class="form-check mb-2">
                                            <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check${index}`} checked={checkboxes[index]} onChange={() => handleCheckboxChange(index)}/>
                                            <label class="form-check-label" for={`check${index}`}>
                                                Default checkbox
                                            </label>
                                        </div>
                                        ))} */}
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_rincian_objek?.slice(0,5).map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check-rincian-objek-${index}`} value={item.kode_ro}/>
                                                <label class="form-check-label" for={`check-rincian-objek-${index}`}>
                                                    {item.nama_ro}
                                                </label>
                                            </div>
                                        ))}
                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className='card-height-100 card-animate'>
                                            <CardBody>
                                            <div className='mb-2'>
                                            <span style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            padding: "2px 5px",
                                            border: "none",
                                            borderRadius: "5px",
                                            
                                            fontSize: "10px",
                                        }}>Sub Rincian Objek</span>
                                        </div>
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_rincian_sub_objek?.slice(0,5).map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={handleCheckboxChange} class="form-check-input" type="checkbox" id={`check-sub-rincian-objek-${index}`} value={item.kode_sro}/>
                                                <label class="form-check-label" for={`check-sub-rincian-objek-${index}`}>
                                                    {item.nama_sro}
                                                </label>
                                            </div>
                                        ))}    
                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* <Row >
                                    <Col md={6}>
                                        <Card className='card-animate'>
                                            <CardBody>
                                        <div className='mb-2'>
                                            <span style={{
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                padding: "2px 5px",
                                                border: "none",
                                                borderRadius: "5px",
                                                width:"30%",
                                                fontSize: "10px",
                                            }}>Akun Sumber Dana</span>
                                        </div>                                            
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_rincian_objek?.slice(0,5).map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id={`check-akun-sumber-dana-${index}`} value={item.kode_ro}/>
                                                <label class="form-check-label" for={`check-akun-sumber-dana-${index}`}>
                                                    {item.nama_ro}
                                                </label>
                                            </div>
                                        ))}
                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className='card-height-100 card-animate'>
                                            <CardBody>
                                            <div className='mb-2'>
                                            <span style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            padding: "2px 5px",
                                            border: "none",
                                            borderRadius: "5px",
                                            
                                            fontSize: "10px",
                                        }}>Sumber Dana</span>
                                        </div>
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.anggaran_filter_list_rincian_sub_objek?.slice(0,5).map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id={`check-sumber-dana-${index}`} value={item.kode_sro}/>
                                                <label class="form-check-label" for={`check-sumber-dana-${index}`}>
                                                    {item.nama_sro}
                                                </label>
                                            </div>
                                        ))}    
                                        </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row> */}
                        </SimpleBar>
                    </OffcanvasBody>
                </Offcanvas>
            </div>
        </React.Fragment>
    );
};

export default FilterRightSide;