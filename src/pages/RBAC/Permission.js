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



const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const permissionForm = {
    menu: {
      id: "ddl_menu",  
      label: "Menu",
      type: "select",
      placeholder: "Input nama role",
      defaultValue: "",
      rules: {
        required: true,
      },
    },
    roles: {
      id: "ddl_roles",
      label: "Roles",
      type: "select",
      placeholder: "",
      defaultValue: true,
      rules: {
        required: true,
      },
    },
    createPermission: {
        id: "check_create",
        label: "Create Permission",
        type: "checkbox",
        placeholder: "",
        defaultValue: true,
        rules: {
          required: true,
        },
      },
      updatePermission: {
        id: "check_update",
        label: "Update Permission",
        type: "checkbox",
        placeholder: "",
        defaultValue: true,
        rules: {
          required: true,
        },
      },
      deletePermission: {
        id: "check_delete",
        label: "Delete Permission",
        type: "checkbox",
        placeholder: "",
        defaultValue: true,
        rules: {
          required: true,
        },
      },
      readPermission: {
        id: "check_read",
        label: "Delete Permission",
        type: "checkbox",
        placeholder: "",
        defaultValue: true,
        rules: {
          required: true,
        },
      }
};

const dataMenu = [
    {
        val:1,
        text:"Dashboard"
    },
    {
        val:2,
        text:"Pengaturan"
    },
    {
        val:3,
        text:"Data Pendapatan"
    }
]
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

const Permission = () => {
    const[ val,setVal] = useState()
    const[ formData,setFormData] = useState({
        ddl_roles:0,
        ddl_menu:0,
        check_create:false,
        check_update:false,
        check_delete:false,
        check_read:false,
    });
    const [show,setShow] = useState(false)
    const [modal_center, setmodal_center] = useState(false);


    const resultData = {
        "success": true,
        "code": 200,
        "message": "List Data Permission",
        "data": [
          {
            "id_menu": 1,
            "menu": "Dashboard",
            "id_role": 1,
            "role": "Dirjen",
            "create_permission": false,
            "read_permission": true,
            "update_permission": false,
            "delete_permission": false
          },
          {
            "id_menu": 2,
            "menu": "Pengaturan",
            "id_role": 2,
            "role": "Kapus",
            "create_permission": false,
            "read_permission": true,
            "update_permission": false,
            "delete_permission": false
          },
          {
            "id_menu": 3,
            "menu": "Pendapatan",
            "id_role": 3,
            "role": "Direktur",
            "create_permission": false,
            "read_permission": true,
            "update_permission": false,
            "delete_permission": false
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
                                                        <FormInput key={e} dynamicForm={permissionForm[e]} changeValue={changeValue} dataMenu={dataMenu} dataRoles={dataRoles}/>
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
                                                Menu
                                            </th>
                                            <th>
                                                Roles
                                            </th>
                                            <th>
                                                Read Permission
                                            </th>
                                            <th>
                                                Create Permission
                                            </th>
                                            <th>
                                                Update Permission
                                            </th>
                                            <th>
                                                Delete Permission
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
                                                   {item.menu}
                                                </td>
                                                <td>
                                                    {item.role}
                                                </td>
                                                <td>
                                                    <input type="checkbox" key={index} checked={item.create_permission} />
                                                </td>
                                                <td>
                                                    <input type="checkbox" key={index} checked={item.read_permission} />
                                                </td>
                                                <td>
                                                    <input type="checkbox" key={index} checked={item.update_permission} />
                                                </td>
                                                <td>
                                                    <input type="checkbox" key={index} checked={item.delete_permission} />
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
                        Hapus Data Permission
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <Label>Anda yakin hapus permission ?</Label>
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

export default Permission;
