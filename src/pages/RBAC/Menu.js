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
import { useEffect } from "react";
import { APIClient } from "../../helpers/api_helper";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { get_permission_by_url } from "../../slices/thunks";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FormSelectFilter from "../../Components/FormFactory/FormSelectFilter";

const API_9007_URI = `${process.env.REACT_APP_API_URL_9007}`;
const api = new APIClient();
const FORM_EMPTY = {
    id: 0,
    uuid: '',
    menu_name: "",
    menu_description: "",
    parent_menu_id: null,
    url: "",
    is_menu: false,
    is_active: true
}

const Menu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [resultData, setResultData] = useState([])
    const [formData, setFormData] = useState(JSON.parse(JSON.stringify(FORM_EMPTY)));
    const [is_valid, setIsValid] = useState(false);
    const [show, setShow] = useState(false)
    const [submitProcess, setSubmitProcess] = useState(false)
    const [modal_center, setmodal_center] = useState(false);
    const [delete_data, setDeleteData] = useState(null);
    const [is_edit, setIsEdit] = useState(false);
    const [list_menu_parent, setListMenuParent] = useState([]);
    const [menu_parent_selected, setMenuParentSelected] = useState(null);

    // permission
    const permissionState = (state) => state.Profile;
    const permissionProperties = createSelector(
        permissionState, (d) => ({ list_menus: d.list_menus })
    );
    const { list_menus } = useSelector(permissionProperties);
    useEffect(() => {
        if (list_menus.length == 0) return;
        const permit = get_permission_by_url('/menu', true, () => {
            navigate('/auth-404-basic', { replace: true });
        });
        dispatch(permit);
    }, [list_menus]);

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
                const edit_json = JSON.parse(JSON.stringify(formData));
                edit_json.is_deleted = false;
                response = api.put(`${API_9007_URI}/rbac/update-menu`, edit_json);
            } else {
                const json = JSON.parse(JSON.stringify(formData));
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
    }

    function tog_center() {
        setmodal_center(!modal_center);
    }

    useEffect(() => {
        let is_valid = true;
        if (!formData.menu_name) is_valid = false;
        if (!formData.menu_description) is_valid = false;
        if (!formData.url) is_valid = false;
        setIsValid(is_valid);
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
        const _new = JSON.parse(JSON.stringify(data));
        _new.is_menu = _new.is_menu === true ? true : false; // update data null to false
        setFormData(_new);
        setMenuParentSelected(data.parent_menu_id ? { id: data.parent_menu_id, text: data.parent_menu_name } : null);
        window.scrollTo(0, 0)
    }

    function cancel_form() {
        reset_form();
        setShow(false);
    }

    function reset_form() {
        setIsEdit(false);
        setFormData(JSON.parse(JSON.stringify(FORM_EMPTY)))
        setMenuParentSelected(null);
    }

    async function do_delete() {
        try {
            const json = {
                "id_menu": delete_data.id,
                uuid: delete_data.uuid,
                "is_deleted": true
            }
            let response = api.put(`${API_9007_URI}/rbac/delete-menu`, json);
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

    async function search_parent(keyword = '') {
        const json = {
            page: 1,
            size: 10,
            menu_name: keyword
        }
        let response = api.create(`${API_9007_URI}/rbac/list-menu-table`, json);

        let data = await response;

        if (data.code === 200) {
            setListMenuParent(data.data.map(d => { return { id: d.menu_id, text: d.menu_name } }));
        } else {
            setListMenuParent([]);
        }
    }

    return (
        <>
            <div className="page-content">
                <h3>Form Menus</h3>
                <Row style={{ display: show && "inline" || "none" }}>
                    <Col>
                        <Card>
                            <CardBody>
                                <form onSubmit={onSubmit}>
                                    <Row>
                                        <Col>
                                            <FormGroup key={'form_group_nama_menu'}>
                                                <Label>Nama Menu</Label>
                                                <input type="text" name="menu_name"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.menu_name}
                                                />
                                            </FormGroup>

                                            <FormGroup key={'form_group_nama_sub_menu'}>
                                                <Label>Deskripsi</Label>
                                                <input type="text" name="menu_description"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.menu_description}
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

                                            <FormGroup>
                                                <Label>Menu Parent</Label>
                                                <FormSelectFilter onSearch={search_parent} dataList={list_menu_parent}
                                                    selected={menu_parent_selected}
                                                    onSelect={val => {
                                                        setFormData(Object.assign({}, formData, { parent_menu_id: val ? val.id : null }));
                                                        setMenuParentSelected(val);
                                                    }}
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

                                            <FormGroup check>
                                                <Label>
                                                    <input type="checkbox" name="is_active"
                                                        onChange={(e) => changeValue(e)}
                                                        className="form-check-input"
                                                        checked={formData.is_active}
                                                    />
                                                    <span>Status Aktif</span>
                                                </Label>
                                            </FormGroup>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button color="primary" className="mt-3" style={{ marginRight: "6px" }} disabled={submitProcess || !is_valid}>
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
                                <div className="d-flex flex-row">
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
                                    <Link to="/menu-group" className="btn btn-outline-warning mx-2" style={{
                                        padding: "10px 20px",
                                        marginBottom: "6px"
                                    }}>
                                        Form Menu Group
                                    </Link>
                                    <Link to="/menu-group-detail" className="btn btn-outline-warning mx-2" style={{
                                        padding: "10px 20px",
                                        marginBottom: "6px"
                                    }}>
                                        Form Group Menu Detail
                                    </Link>
                                </div>

                                <table
                                    className="table table-bordered table-nowrap align-middle mb-0"
                                    style={{ width: "100%" }}
                                >
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: "20px" }}>NO</th>
                                            <th style={{ cursor: "pointer", verticalAlign: "middle" }}>Nama Menu</th>
                                            <th>Deskripsi</th>
                                            <th>Url</th>
                                            <th>Parent</th>
                                            <th style={{ width: "60px" }}>Aktif</th>
                                            <th style={{ width: "60px" }}>Deleted</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ minHeight: "500px" }}>
                                        {resultData.map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    style={
                                                        {
                                                            textAlign: "center",
                                                            verticalAlign: "middle",
                                                            maxWidth: "50px"
                                                        }}>
                                                    {(paging.page - 1) * paging.size + index + 1}
                                                </td>
                                                <td style={{ maxWidth: "10%" }} className="text-wrap">
                                                    {item.menu_name}
                                                </td>
                                                <td style={{ maxWidth: "400px" }} className="text-wrap">
                                                    {item.menu_description}
                                                </td>
                                                <td style={{ maxWidth: "400px" }} className="text-wrap">
                                                    {item.url}
                                                </td>
                                                <td style={{ maxWidth: "400px" }} className="text-wrap">
                                                    {item.parent_menu_name || '-'}
                                                </td>
                                                <td><input type="checkbox" key={'is_active_' + index} checked={item.is_active} readOnly /></td>
                                                <td><input type="checkbox" key={'is_deleted_' + index} checked={item.is_deleted} readOnly /></td>
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
                                <div className="paging-container d-flex justify-content-center mt-3">
                                    <div className="d-flex flex-wrap" style={{ maxWidth: '80%' }}>
                                        {paging_content()}
                                    </div>
                                </div>
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
