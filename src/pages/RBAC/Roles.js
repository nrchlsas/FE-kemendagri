import React, { useEffect, useState } from "react";
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
const rolesForm = {
    namaRoles: {
      id: "txt_nama_roles",  
      label: "Nama Role",
      type: "text",
      placeholder: "Input nama role",
      defaultValue: "",
      rules: {
        required: true,
      },
    },
    status: {
      id: "check_status",
      label: "Status",
      type: "checkbox",
      placeholder: "",
      defaultValue: true,
      rules: {
        required: true,
      },
    }
    
};





const Roles = () => {
    const[ formData,setFormData] = useState({
        txt_nama_roles:0,
        check_status:false,
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
    
    const resultData = {
        "success": true,
        "code": 200,
        "message": "List Data Roles",
        "data": [
          {
            "id": 1,
            "nama_roles": "DIREKTUR",
            "status": true,
          },
          {
            "id": 2,
            "nama_roles": "DIRJEN",
            "status": false,
          },
          {
            "id": 3,
            "nama_roles": "KASUBDIT",
            "status": true,
          },
          {
            "id": 4,
            "nama_roles": "STAFF",
            "status": false,
          },
          {
            "id": 5,
            "nama_roles": "TAMU",
            "status": false,
          },
        ],
        "currentPage": 1,
        "totalPages": 1,
        "totalData": 10,
        "pageSize": 16
    };
 
    return (
        <>
            <div className="page-content">
                <Row style={{display:show && "inline" || "none"}}>
                    <Col>
                        <Card>
                            <CardBody>
                                <form onSubmit={(e)=>{
                                    e.preventDefault() 
                                    onSubmit(e)
                                    }}>
                                        <Row>
                                            <Col>
                                                {
                                                    Object.keys(rolesForm).map((e) =>(
                                                        <FormInput key={e} dynamicForm={rolesForm[e]}/>
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
                                                Nama Role
                                            </th>
                                            <th>
                                                Status
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
                                                    {item.nama_roles}
                                                </td>
                                                <td>
                                                    <input type="checkbox" key={index} checked={item.status} />
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
                        Hapus Data Roles
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <Label>Anda yakin hapus role ?</Label>
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

export default Roles;
