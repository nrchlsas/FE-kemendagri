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
    console.log(dataFilter, 'ini filter side')
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

    const [selectedValues, setSelectedValues] = useState({
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
        return Object.fromEntries(
            Object.entries(payload).filter(([_, value]) => !(Array.isArray(value) && value.length === 0))
        );
    };
    
    const handleCheckboxChange = (event, filterType) => {
        const { value, checked } = event.target;
    
        // Salin state filter saat ini
        const updatedValues = { ...selectedValues };
    
        if (checked) {
            // Tambahkan nilai jika checkbox dicentang
            updatedValues[filterType].push(value);
        } else {
            // Hapus nilai jika checkbox tidak dicentang
            updatedValues[filterType] = updatedValues[filterType].filter((item) => item !== value);
        }
    
        // Perbarui state filter di child
        setSelectedValues(updatedValues);
    
        // Bersihkan payload sebelum dikirim ke parent
        const cleanedFilters = cleanPayload(updatedValues);
    
        // Kirimkan payload ke parent
        onSelectFilter(cleanedFilters);
    };
    
    return (
        <React.Fragment>
            <button
                onClick={() => toTop()}
                className="btn btn-danger btn-icon" id="back-to-top">
                <i className="ri-arrow-up-line"></i>
            </button>

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
                                        {dataFilter?.filter_fungsi?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e) => handleCheckboxChange(e, "fungsi")} checked={selectedValues.fungsi.includes(item.kode_fungsi)} class="form-check-input" type="checkbox" id={`check-fungsi-${index}`} value={item.kode_fungsi}/>
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
                                        {dataFilter?.filter_spm?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e)=>handleCheckboxChange(e, "spm")} checked={selectedValues.spm.includes(item.spm_teks)} class="form-check-input" type="checkbox" id={`check-spm-${index}`} value={item.spm_teks}/>
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
                                            }}>Urusan</span>
                                        </div>                                            
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.filter_urusan?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e)=>handleCheckboxChange(e, "urusan")} checked={selectedValues.urusan.includes(item.kode_urusan)} class="form-check-input" type="checkbox" id={`check-urusan-${index}`} value={item.kode_urusan}/>
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
                                        {dataFilter?.filter_bidang_urusan?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e)=>handleCheckboxChange(e, "bidangUrusan")} checked={selectedValues.bidangUrusan.includes(item.kode_bidang_urusan)} class="form-check-input" type="checkbox" id={`check-bidang-urusan-${index}`} value={item.kode_bidang_urusan}/>
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
                                        {dataFilter?.filter_program?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e)=>handleCheckboxChange(e, "program")} checked={selectedValues.program.includes(item.kode_program)} class="form-check-input" type="checkbox" id={`check-program-${index}`} value={item.kode_program}/>
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
                                        <Card className='card-height-100 card-animate' onScroll={(e)=>handleScroll(e, 'filter_giat')}>
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
                                        {dataFilter?.filter_giat?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e)=>handleCheckboxChange(e, "kegiatan")} checked={selectedValues.kegiatan.includes(item.kode_giat)} class="form-check-input" type="checkbox" id={`check-kegiatan-${index}`} value={item.kode_giat}/>
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
                                            }}>Sub Kegiatan</span>
                                        </div>                                            
                                        <div style={{overflowY: "auto", maxHeight:"300px"}} >
                                        {dataFilter?.filter_subgiat?.map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e)=>handleCheckboxChange(e, "subKegiatan")} checked={selectedValues.subKegiatan.includes(item.kode_sub_giat)} class="form-check-input" type="checkbox" id={`check-sub-kegiatan-${index}`} value={item.kode_sub_giat}/>
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
                                        {dataFilter?.filter_objek?.slice(0,5).map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e)=>handleCheckboxChange(e, "objek")} checked={selectedValues.objek.includes(item.kode_objek)} class="form-check-input" type="checkbox" id={`check-objek-${index}`} value={item.kode_objek}/>
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
                                            }}>Rincian Objek</span>
                                        </div>
                                        <div style={{overflowY: "auto", maxHeight:"300px"}}>
                                        {dataFilter?.filter_ro?.slice(0,5).map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e)=>handleCheckboxChange(e, "rincianObjek")} checked={selectedValues.rincianObjek.includes(item.kode_ro)} class="form-check-input" type="checkbox" id={`check-rincian-objek-${index}`} value={item.kode_ro}/>
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
                                        {dataFilter?.filter_sro?.slice(0,5).map((item, index) => (
                                            <div key={index} class="form-check mb-2">
                                                <input onChange={(e)=>handleCheckboxChange(e, "subRincianObjek")}  checked={selectedValues.subRincianObjek.includes(item.kode_sro)} class="form-check-input" type="checkbox" id={`check-sub-rincian-objek-${index}`} value={item.kode_sro}/>
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
                        </SimpleBar>
                    </OffcanvasBody>
                </Offcanvas>
            </div>
        </React.Fragment>
    );
};

export default FilterRightSide;