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
    Label,
    FormGroup
} from "reactstrap";
//import FormInput from "../../Components/FormFactory/FormInput";
import { useEffect } from "react";
import { APIClient } from "../../helpers/api_helper";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;
const API_9007_URI = `${process.env.REACT_APP_API_URL_9007}`;
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
const api = new APIClient();


const Menu = () => {
    const [val, setVal] = useState()
    const [resultData, setResultData] = useState([])
    const [formData, setFormData] = useState({
        id: 0,
        nama_menu: "",
        url: "",
        nama_sub_menu: ""
    });
    const [show, setShow] = useState(false)
    const [submitProcess, setSubmitProcess] = useState(false)
    const [modal_center, setmodal_center] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        const json = {
            namaMenu: formData.nama_menu,
            namaSubMenu: formData.nama_sub_menu,
            url: formData.url,
            isMenu: true
        }
        let response = api.create(`${API_9007_URI}/rbac/create-menu`, json);

        setSubmitProcess(true);
        let data = await response;
        console.log({ data });
        if (data.code === 200) {
            populate_data();
        }
        setSubmitProcess(false);
        return false;
    }
    function changeValue(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
        setVal(e);
    }

    function tog_center() {
        setmodal_center(!modal_center);
    }

    useEffect(() => {
        console.log('formData', formData);
    }, [formData])

    useEffect(() => {
        populate_data();
    }, [])

    async function populate_data() {
        let response = api.get(`${API_9007_URI}/rbac/list-menu`);

        let data = await response;

        if (data.code === 200) {
            setResultData(data.list.filter(d => d.is_menu));
        }
    }

    function onEdit(data) {
        setShow(true);
        setFormData(JSON.parse(JSON.stringify(data)));
        window.scrollTo(0, 0)
    }

    function cancel_form() {
        setFormData({
            id: 0,
            nama_menu: "",
            url: "",
            nama_sub_menu: ""
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
                                <form onSubmit={onSubmit}>
                                    <Row>
                                        <Col>
                                            <FormGroup key={'form_group_nama_menu'}>
                                                <Label>Nama Menu</Label>
                                                <input type="text" name="nama_menu"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.nama_menu}
                                                />
                                            </FormGroup>

                                            <FormGroup key={'form_group_url'}>
                                                <Label>URL</Label>
                                                <input type="text" name="url"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.url}
                                                />
                                            </FormGroup>

                                            <FormGroup key={'form_group_nama_sub_menu'}>
                                                <Label>Nama Sub Menu</Label>
                                                <input type="text" name="nama_sub_menu"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.nama_sub_menu}
                                                />
                                            </FormGroup>

                                            {/* {
                                                Object.keys(menuForm).map((e) => (
                                                    <FormInput key={e} dynamicForm={menuForm[e]} changeValue={changeValue} />
                                                ))
                                            } */}

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button color="primary" className="mt-3" style={{ marginRight: "6px" }} disabled={submitProcess}>
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
                                                    {item.nama_menu}
                                                </td>
                                                <td>
                                                    {item.url}
                                                </td>
                                                <td>
                                                    {item.nama_sub_menu}
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
                        Hapus Data Menu
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <Label>Anda yakin hapus menu ?</Label>
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

export default Menu;
