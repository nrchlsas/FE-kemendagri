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
    Label,
    FormGroup
} from "reactstrap";
import FormInput from "../../Components/FormFactory/FormInput";
import { APIClient } from "../../helpers/api_helper";

const API_9007_URI = `${process.env.REACT_APP_API_URL_9007}`;
const api = new APIClient();
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
    const [formData, setFormData] = useState({
        id: 0,
        uuid: '',
        nama_roles: '',
        status: false,
    });
    const [show, setShow] = useState(false)
    const [modal_center, setmodal_center] = useState(false);
    const [resultData, setResultData] = useState([]);
    const [submitProcess, setSubmitProcess] = useState(false);
    const [is_valid, setIsValid] = useState(false);
    const [is_edit, setIsEdit] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        const json = {
            id: formData.id,
            uuid: formData.uuid,
            namaRoles: formData.nama_roles,
            status: formData.status
        };
        try {
            let response = null;
            if (is_edit) {
                response = api.put(`${API_9007_URI}/rbac/update-roles`, json);
            } else {
                response = api.create(`${API_9007_URI}/rbac/create-roles`, json);
            }
            setSubmitProcess(true);
            let data = await response;
            if (data.code === 200) {
                populate_data();
                cancel_form();
            }
        } catch (error) {
            alert('Error Simpan data');
        } finally {
            setSubmitProcess(false);
        }
        return false;
    }
    function changeValue(e) {
        const { name, value, checked, type } = e.target;
        setFormData({ ...formData, [name]: type == "checkbox" ? checked : type == "select-one" ? parseInt(value) : value })
    }

    function tog_center() {
        setmodal_center(!modal_center);
    }

    useEffect(() => {
        let is_valid = true;
        console.log('formData', formData);
        if (!formData.nama_roles) is_valid = false;
        setIsValid(is_valid);
    }, [formData])

    useEffect(() => {
        populate_data();
    }, [])

    async function populate_data() {
        let response = api.get(`${API_9007_URI}/rbac/list-roles-all`);
        let data = await response;
        if (data.code === 200) {
            setResultData(data.list);
        }
    }

    function onEdit(data) {
        setShow(true);
        setIsEdit(true);
        setFormData(Object.assign({}, formData, {
            id: data.id,
            uuid: data.uuid,
            nama_roles: data.nama_roles,
            status: data.status,
        }));
        window.scrollTo(0, 0)
    }

    function cancel_form() {
        setIsEdit(false);
        setFormData({
            id: 0,
            uuid: '',
            nama_roles: '',
            status: false,
        })
        setShow(false);
    }

    return (
        <>
            <div className="page-content">
                <Row style={{ display: show && "inline" || "none" }}>
                    <Col>
                        <Card>
                            <CardBody>
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    onSubmit(e)
                                }}>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label>Nama Role</Label>
                                                <input type="text" name="nama_roles"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.nama_roles}
                                                />
                                            </FormGroup>
                                            <FormGroup check>
                                                <Label>
                                                    <input type="checkbox" name="status"
                                                        onChange={(e) => changeValue(e)}
                                                        className="form-check-input"
                                                        checked={formData.status}
                                                    />
                                                    <span>Status</span>
                                                </Label>
                                            </FormGroup>
                                            {/* {
                                                Object.keys(rolesForm).map((e) => (
                                                    <FormInput key={e} dynamicForm={rolesForm[e]} />
                                                ))
                                            } */}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button color="primary" className="mt-3" style={{ marginRight: "6px" }} disabled={!is_valid || submitProcess}>
                                                Simpan
                                            </Button>
                                            <Button color="warning" className="mt-3" onClick={() => cancel_form()}>
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
                                    marginBottom: "6px"
                                }} onClick={() => setShow(true)}>Tambah</button>
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
                                        {resultData.map((item, index) => (
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
                                                    <input type="checkbox" key={index} checked={item.status} readOnly />
                                                </td>
                                                <td>
                                                    <Button color="danger" style={{ marginRight: "3px" }} onClick={() => {
                                                        setShow(false)
                                                        tog_center()
                                                    }}>Hapus</Button>
                                                    <Button color="primary" onClick={() => onEdit(item)}>Ubah</Button>
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
                            <Col className="d-flex justify-content-center align-items-center" >
                                <Button color="primary" className="mt-3" style={{ marginRight: "6px" }} onClick={() => tog_center()}>
                                    Hapus
                                </Button>
                                <Button color="warning" className="mt-3" onClick={() => tog_center()}>
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
