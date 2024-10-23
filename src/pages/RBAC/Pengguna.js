import React, {useState } from "react";
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
import { Status } from "../APIKey/APIKeyCol";



const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const permissionForm = {
    email: {
      id: "email",  
      label: "Menu",
      type: "text",
      placeholder: "Input email",
      defaultValue: "",
      rules: {
        required: true,
      },
    },
    status: {
        id: "status",
        label: "Status",
        type: "checkbox",
        placeholder: "",
        defaultValue: true,
        rules: {
          required: true,
        },
      },
      is_verifikasi: {
        id: "is_verifikasi",
        label: "Verifikasi",
        type: "checkbox",
        placeholder: "",
        defaultValue: true,
        rules: {
          required: true,
        },
      },
      roles: {
        id: "roles",  
        label: "Role",
        type: "select",
        placeholder: "Input nama role",
        defaultValue: "",
        rules: {
          required: true,
        },
      },
      
};

const dataRoles = [
    {
        val:1,
        text:"Direktur"
    },
    {
        val:2,
        text:"DIRJEN"
    },
    {
        val:3,
        text:"KASUBDIT"
    }
]

const Pengguna = () => {
    const[ val,setVal] = useState()
    const[ formData,setFormData] = useState({
        email:0,
        status:0,
        is_verifikasi:false,
        roles:false
    });
    const [show,setShow] = useState(false)
    const [modal_center, setmodal_center] = useState(false);


    const resultData = {
        "success": true,
        "code": 200,
        "message": "List Data Users",
        "data": [
            {
                "id": 1,
                "uuid": "3e245163-bc03-4bd1-9e12-f7d4c4b7afea",
                "email": "kayla@gmail.com",
                "client_id": "FF&8LxDgyM",
                "status": true,
                "next_login": 2,
                "is_verifikasi": false,
                "is_update_password": false,
                "id_roles": 1,
                "roles": "DIREKTUR"
            },
            {
                "id": 2,
                "uuid": "25704f3c-9b4d-4081-ba96-09b5c8643235",
                "email": "chandra@gmail.com",
                "client_id": "3^q73)lsU9",
                "status": false,
                "next_login": 0,
                "is_verifikasi": false,
                "is_update_password": false,
                "id_roles": 1,
                "roles": "DIRJEN"
            },
            {
                "id": 3,
                "uuid": "040666d5-611c-463b-af33-42de7c44c0cb",
                "email": "chandraa@gmail.com",
                "client_id": "MjNo(rSAX8",
                "status": true,
                "next_login": 1,
                "is_verifikasi": false,
                "is_update_password": false,
                "id_roles": 5,
                "roles": "KASUBDIT"
            },
            {
                "id": 4,
                "uuid": "64663a01-3178-4180-9d4c-d078b705fb5c",
                "email": "kyoooo@gmail.com",
                "client_id": "kuysaaaa",
                "status": false,
                "next_login": 2,
                "is_verifikasi": false,
                "is_update_password": false,
                "id_roles": 1,
                "roles": "STAFF"
            },
            {
                "id": 5,
                "uuid": "1b99ec60-45a2-491c-b822-7191b158b23a",
                "email": "kyoooo@gmaill.com",
                "client_id": null,
                "status": false,
                "next_login": 0,
                "is_verifikasi": false,
                "is_update_password": false,
                "id_roles": 5,
                "roles": "STAFF"
            },
            {
                "id": 6,
                "uuid": "1c648a2d-c8bb-4945-9229-6087473de770",
                "email": "kyoooo1@gmail.com",
                "client_id": "D2EIcOu&oV",
                "status": false,
                "next_login": 10,
                "is_verifikasi": false,
                "is_update_password": false,
                "id_roles": 1,
                "roles": "STAFF"
            },
            {
                "id": 7,
                "uuid": "915f6586-4dff-450c-9b0f-7763f4de7b81",
                "email": "key@gmail.com",
                "client_id": "JNsz$oQhyY",
                "status": false,
                "next_login": 1,
                "is_verifikasi": false,
                "is_update_password": false,
                "id_roles": 3,
                "roles": "ADMIN"
            },
            {
                "id": 8,
                "uuid": "2700ce2d-dd17-4a29-bfc1-01c3125a8450",
                "email": "kut@gmail.com",
                "client_id": "p^o!v$SqnD",
                "status": false,
                "next_login": 1,
                "is_verifikasi": false,
                "is_update_password": false,
                "id_roles": 5,
                "roles": "ADMIN"
            },
            {
                "id": 9,
                "uuid": "bf96387a-8d19-43d7-9d0d-a51cc01b9600",
                "email": "alfian2892@yahoo.com",
                "client_id": null,
                "status": false,
                "next_login": 0,
                "is_verifikasi": false,
                "is_update_password": false,
                "id_roles": 5,
                "roles": "STAFF"
            },
            {
                "id": 10,
                "uuid": "e625b4d1-dc28-45bf-bc66-e04e784e0f7c",
                "email": "admin@gmail.com",
                "client_id": "v4VMD#49!t",
                "status": true,
                "next_login": 1,
                "is_verifikasi": true,
                "is_update_password": false,
                "id_roles": 1,
                "roles": "STAFF"
            }
        ],
        "currentPage": 1,
        "totalPages": 1,
        "totalData": 10,
        "pageSize": 16
    };

    
    
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
                                <form onSubmit={(e)=>{
                                    e.preventDefault() 
                                    onSubmit(e)
                                    }}>
                                        <Row>
                                            <Col>
                                                
                                                {
                                                    Object.keys(permissionForm).map((e) =>(
                                                        <FormInput key={e} dynamicForm={permissionForm[e]} changeValue={changeValue} dataRoles={dataRoles}/>
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
                                                Email
                                            </th>
                                            <th>
                                                Status
                                            </th>
                                            <th>
                                                Verifikasi
                                            </th>
                                            <th>
                                                Update Password
                                            </th>
                                            <th>
                                                Roles
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
                                                   {item.email}
                                                </td>
                                                <td>
                                                    <input type="checkbox" key={index} checked={item.status} />
                                                </td>
                                                <td>
                                                    <input type="checkbox" key={index} checked={item.is_verifikasi} />
                                                </td>
                                                <td>
                                                    <input type="checkbox" key={index} checked={item.is_update_password} />
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
            </div>    

            <Modal
                isOpen={modal_center}
                toggle={() => tog_center}
                centered
            >
                <ModalHeader 
                    className=" p-3 bg-info-subtle" toggle={tog_center}>
                        Hapus Data Pengguna
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <Label>Anda yakin hapus pengguna ?</Label>
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
        </>
    );
}

export default Pengguna;
