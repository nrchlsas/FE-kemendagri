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
        nama_sub_menu: "",
        is_menu: false
    });
    const [show, setShow] = useState(false)
    const [submitProcess, setSubmitProcess] = useState(false)
    const [modal_center, setmodal_center] = useState(false);
    const [delete_data, setDeleteData] = useState(null);
    const [is_edit, setIsEdit] = useState(false);

    // pagination
    const [paging, setPaging] = useState({
        page: 1,
        max: 1,
        size: 10
    })
    function page_goto(page) {
        if (page == paging.page) return;
        setPaging(Object.assign({}, paging, { page }));
    }
    function page_prev() {
        const { page } = paging;
        if (page == 1) return;
        setPaging(Object.assign({}, paging, { page: page - 1 }));
    }
    useEffect(() => {
        populate_data();
    }, [paging])
    function paging_content() {
        let content = [];
        for (let i = 0; i < paging.max; i++) {
            content.push(<div
                key={'paging-item-' + i}
                onClick={() => page_goto(i + 1)}
                className={`page-item d-flex align-items-center justify-content-center ${i + 1 == paging.page ? 'disabled' : ''}`}>
                {i + 1}</div>)
        }
        return content;
    }

    // modal SUCCESS
    const [mSuccess, setModalSuccess] = useState({
        open: false,
        title: 'Success Message',
        message: ''
    })
    // modal ERROR
    const [mError, setModalError] = useState({
        open: false,
        title: 'Error Message',
        message: ''
    })

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            let response = null;
            if (is_edit) {
                const edit_json = {
                    "nama_menu": formData.nama_menu,
                    "url": formData.nama_menu,
                    "nama_sub_menu": formData.nama_menu,
                    "is_menu": formData.is_menu,
                    "id_menu": formData.id,
                    "updated_by": ''
                }
                response = api.create(`${API_9007_URI}/rbac/update-menu`, edit_json);
            } else {
                const json = {
                    namaMenu: formData.nama_menu,
                    namaSubMenu: formData.nama_sub_menu,
                    url: formData.url,
                    isMenu: formData.is_menu
                }
                response = api.create(`${API_9007_URI}/rbac/create-menu`, json);
            }

            setSubmitProcess(true);
            let data = await response;
            if (data.code === 200) {
                populate_data();
                setShow(false);
                reset_form();
                setModalSuccess(Object.assign({}, mSuccess, { title: "Simpan Data", message: "Proses simpan data berhasil", open: true }))
            }
        } catch (error) {
            setModalError(Object.assign({}, mError, { title: "Error Simpan Data", message: error, open: true }))
        } finally {
            setSubmitProcess(false);
        }
        return false;
    }
    function changeValue(e) {
        const { name, value, checked, type } = e.target;
        setFormData({ ...formData, [name]: type == "checkbox" ? checked : type == "select-one" ? parseInt(value) : value })
        setVal(e);
    }

    function tog_center() {
        setmodal_center(!modal_center);
    }

    useEffect(() => {
    }, [formData])

    useEffect(() => {
        // populate_data();
    }, [])

    async function populate_data() {
        const json = {
            page: paging.page,
            size: paging.size
        }
        let response = api.create(`${API_9007_URI}/rbac/list-menu-table`, json);

        let data = await response;

        if (data.code === 200) {
            calculate_paging(data);
            setResultData(data.data);
        }
    }

    function calculate_paging(resp) {
        const { totalPages, currentPage, pageSize } = resp;
        paging.page = currentPage;
        paging.max = totalPages;
        paging.size = pageSize;
    }

    function onEdit(data) {
        setIsEdit(true);
        setShow(true);
        setFormData(JSON.parse(JSON.stringify(data)));
        window.scrollTo(0, 0)
    }

    function cancel_form() {
        reset_form();
        setShow(false);
    }

    function reset_form() {
        setIsEdit(false);
        setFormData({
            id: 0,
            nama_menu: "",
            url: "",
            nama_sub_menu: "",
            is_menu: false
        })
    }

    async function do_delete() {
        try {
            const json = {
                "id_menu": delete_data.id,
                "is_deleted": true
            }
            let response = api.create(`${API_9007_URI}/rbac/delete-menu`, json);
            let data = await response;
            if (data.code === 200) {
                populate_data();
                setModalSuccess(Object.assign({}, mSuccess, { title: "Hapus Data", message: "Proses hapus data berhasil", open: true }))
            }
        } catch (error) {
            setModalError(Object.assign({}, mError, { title: "Error Hapus Data", message: error, open: true }))
        } finally {
        }
        tog_center();
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

                                            <FormGroup check>
                                                <Label>
                                                    <input type="checkbox" name="is_menu"
                                                        onChange={(e) => changeValue(e)}
                                                        className="form-check-input"
                                                        checked={formData.is_menu}
                                                    />
                                                    <span>Menu Utama</span>
                                                </Label>
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
                                                {is_edit ? 'Ubah' : 'Simpan'}
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
                                }} onClick={() => { reset_form(); setShow(true); }}>Tambah</button>

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
                                                    {(paging.page - 1) * paging.size + index + 1}
                                                </td>
                                                <td style={{ maxWidth: "10%" }}>
                                                    {item.nama_menu}
                                                </td>
                                                <td style={{ maxWidth: "400px" }} className="text-wrap">
                                                    {item.url}
                                                </td>
                                                <td style={{ maxWidth: "400px" }} className="text-wrap">
                                                    {item.nama_sub_menu}
                                                </td>
                                                <td style={{ width: "160px" }}>
                                                    <Button color="danger" style={{ marginRight: "3px" }} onClick={() => {
                                                        setDeleteData(item);
                                                        setShow(false);
                                                        tog_center();
                                                    }}>Hapus</Button>
                                                    <Button color="primary" onClick={() => onEdit(item)}>Ubah</Button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                                <div className="paging-container d-flex justify-content-center mt-3">{paging_content()}</div>
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
                        className="p-3 bg-info-subtle" toggle={tog_center}>
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
                                <Button color="primary" className="mt-3" style={{ marginRight: "6px" }} onClick={() => do_delete()}>
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

            <Modal
                isOpen={mError.open}
                backdrop="static"
                keyboard={false}
                toggle={() => setModalError(Object.assign({}, mError, { open: false }))}
                centered
            >
                <div className=" text-center p-5">
                    <lord-icon
                        src="https://cdn.lordicon.com/tdrtiskw.json"
                        trigger="loop"
                        colors="primary:#f7b84b,secondary:#405189"
                        style={{ width: "130px", height: "130px" }}>
                    </lord-icon>
                    <div className="mt-4 pt-4">
                        <h4>{mError.title}</h4>
                        <p className="text-muted"> {mError.message} </p>
                        <button className="btn btn-warning" onClick={() => setModalError(Object.assign({}, mError, { open: false }))}>
                            Continue
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={mSuccess.open}
                backdrop="static"
                keyboard={false}
                toggle={() => setModalError(Object.assign({}, mError, { open: false }))}
                centered
            >
                <div className=" text-center p-5">
                    <lord-icon
                        src="https://cdn.lordicon.com/lupuorrc.json"
                        trigger="loop"
                        colors="primary:#121331,secondary:#08a88a"
                        style={{ width: "130px", height: "130px" }}>
                    </lord-icon>

                    <div className="mt-4 pt-4">
                        <h4>{mSuccess.title}</h4>
                        <p className="text-muted"> {mSuccess.message} </p>
                        <button className="btn btn-success" onClick={() => setModalSuccess(Object.assign({}, mSuccess, { open: false }))}>
                            Complete
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Menu;
