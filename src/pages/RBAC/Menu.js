import React, { useState } from "react";
import {
    Col,
    Row,
    Button,
    Card,
    CardBody,
    Modal,
    ModalHeader,
    ModalBody,
    Label
  } from "reactstrap";
import FormInput from "../../Components/FormFactory/FormInput";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const menuForm = {
    namaMenu: {
      id: "nama_menu",  
      label: "Nama Menu",
      type: "text",
      placeholder: "Input nama menu",
      defaultValue: "",
      rules: {
        required: true,
      },
    },
    url: {
      id: "url",
      label: "URL",
      type: "text",
      placeholder: "Input url",
      defaultValue: "",
      rules: {
        required: true,
      },
    },
    namaSubMenu: {
        id: "nama_sub_menu",
        label: "Nama Sub Menu",
        type: "text",
        placeholder: "Input nama sub menu",
        defaultValue: "",
        rules: {
          required: false,
        },
    },
    
};
const resultData = {
    "success": true,
    "code": 200,
    "message": "List Data Menu",
    "data": [
      {
        "id": 1,
        "nama_roles": "Dashboard",
        "url": "/dashboard",
        "nama_sub_menu":""
      },
      {
        "id": 2,
        "nama_roles": "Pengaturan",
        "url": "/settings/roles",
        "nama_sub_menu":"Role Management"
      },
      {
        "id": 3,
        "nama_roles": "Data Pendapatan",
        "url": "data/create-data-pendapatan",
        "nama_sub_menu":"Input Data Pendapatan"
      }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalData": 10,
    "pageSize": 16
};


const Menu = () => {
    const[ formData,setFormData] = useState({
        nama_menu:"",
        url:false,
        nama_sub_menu:""
    });
    const [show,setShow] = useState(false)
    const [modal_center, setmodal_center] = useState(false);
    
    const onSubmit = (e) => {
        console.log(JSON.stringify(formData));
    }
    function changeValue (e) {
        const {name,value,checked} = e.target;
         
        setFormData({ ...formData,[name]:checked == undefined ? value: checked})
        setVal(e)
        
    }
    
    function tog_center() {
        setmodal_center(!modal_center);
    }
    
    
    return (
        <>
            <div className="page-content">
                <Row style={{display:show && "inline" || "none"}}>
                    <Col>
                        <Card>
                            <CardBody>
                                <form onSubmit={onSubmit}>
                                        <Row>
                                            <Col>
                                                {
                                                    Object.keys(menuForm).map((e) =>(
                                                        <FormInput key={e} dynamicForm={menuForm[e]}/>
                                                    ))
                                                }
                                                
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button color="primary" className="mt-3" style={{marginRight:"6px"}}>
                                                    Simpan
                                                </Button>
                                                <Button color="warning" className="mt-3" onClick={()=> setShow(false)}>
                                                    Batal
                                                </Button>
                                            </Col>
                                        </Row>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                            <button style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "12px",
                                marginBottom:"6px"
                            }} onClick={()=> setShow(true)}>Tambah</button>
                            <table
                                className="table table-bordered table-nowrap align-middle mb-0"
                                style={{ width: "100%" }}
                                >
                                    <thead className="table-light">
                                        <tr>
                                            <th>
                                                NO
                                            </th>
                                            <th
                                                style={{ cursor: "pointer", verticalAlign: "middle" }}
                                            >
                                                Nama Menu
                                            </th>
                                            <th>
                                                Url
                                            </th>
                                            <th>
                                                Nama Sub menu
                                            </th>
                                            <th>
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ minHeight: "500px" }}>
                                        {resultData.data.map((item, index) => (
                                            <tr key={index}>
                                                <td 
                                                    style={
                                                        {
                                                            textAlign: "center",
                                                            verticalAlign: "middle"
                                                        }}>
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    {item.nama_menu}
                                                </td>
                                                <td>
                                                    {item.url}
                                                </td>
                                                <td>
                                                    {item.nama_sub_menu}
                                                </td>
                                                <td>
                                                    <Button color="danger" style={{marginRight:"3px"}}onClick={()=> {
                                                        setShow(false)
                                                        tog_center()
                                                    }}>Hapus</Button>
                                                    <Button color="primary" onClick={()=> setShow(true)}>Ubah</Button>
                                                </td>
                                            </tr>
                                        ))}
                                        
                                    </tbody>
                                    </table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    isOpen={modal_center}
                    toggle={() => tog_center}
                    centered
                >
                    <ModalHeader 
                        className=" p-3 bg-info-subtle" toggle={tog_center}>
                            Hapus Data Menu
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <Label>Anda yakin hapus menu ?</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col  className="d-flex justify-content-center align-items-center" >
                                <Button color="primary" className="mt-3" style={{marginRight:"6px"}} onClick={()=> tog_center()}>
                                    Hapus
                                </Button>
                                <Button color="warning" className="mt-3" onClick={()=> tog_center()}>
                                    Batal
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </div>    
        </>
    );
}

export default Menu;
