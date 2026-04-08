import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, FormGroup, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { APIClient } from "../../helpers/api_helper";
import FormSelectFilter from "../../Components/FormFactory/FormSelectFilter";
import { Link } from "react-router-dom";

const API_9007_URI = `${process.env.REACT_APP_API_URL_9007}`;
const api = new APIClient();
const EMPTY_FORM = {
    id: 0,
    uuid: '',
    permission_id: 0,
    permission_name: '',
    grp_role_id: 0,
    grp_role_name: '',
    is_active: true,
    is_deleted: true
}

const PermissionRoles = () => {

    const [resultData, setResultData] = useState([])
    const [formData, setFormData] = useState(JSON.parse(JSON.stringify(EMPTY_FORM)));
    const [is_edit, setIsEdit] = useState(false);
    const [is_valid, setIsValid] = useState(false);
    const [show, setShow] = useState(false);
    const [submitProcess, setSubmitProcess] = useState(false);

    const [formFilter, setFormFilter] = useState({
        id_permission: 0
    })
    const [listPermission, setListPermission] = useState([]);
    const [listGroupRole, setListGroupRole] = useState([]);

    const [delete_data, setDeleteData] = useState(null);
    const [modal_center, setmodal_center] = useState(false);

    const [modal_alert, setModalAlert] = useState({
        open: false,
        type: 'error', // [success|error]
        title: 'Title',
        message: 'Message'
    })

    // data form
    useEffect(() => {
        let is_valid = true;
        if (!formData.permission_id) is_valid = false;
        if (!formData.grp_role_id) is_valid = false;
        setIsValid(is_valid);
    }, [formData])

    useEffect(() => {
        populate_data();
    }, [formFilter])

    // debug
    // useEffect(() => {
    // }, [formFilter])


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
    function calculate_paging(resp) {
        const { totalPages, currentPage, pageSize } = resp;
        paging.page = currentPage;
        paging.max = totalPages;
        paging.size = pageSize;
    }

    // on create
    useEffect(() => {
        populate_permission();
        populate_group_roles();
    }, [])

    async function populate_group_roles() {
        setListGroupRole([]);
        const json = {
            page: 1,
            size: 100
        }
        let response = api.create(`${API_9007_URI}/rbac/list-group-roles-all`, json);

        let data = await response;

        if (data.code === 200) {
            setListGroupRole(data.data);
        }
    }

    async function populate_permission() {
        setListPermission([]);
        const json = {
            page: 1,
            size: 100
        }
        let response = api.create(`${API_9007_URI}/rbac/list-permission-table`, json);

        let data = await response;

        if (data.code === 200) {
            setListPermission(data.listData);
        }
    }

    async function populate_data() {
        const json = {
            page: paging.page,
            size: paging.size,
        }
        if (formFilter.id_permission) json.permission_id = formFilter.id_permission;
        let response = api.create(`${API_9007_URI}/rbac/list-permission-group-table`, json);

        let data = await response;

        if (data.code === 200) {
            calculate_paging(data);
            setResultData(data.data);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            let response = null;
            if (is_edit) {
                const edit_json = JSON.parse(JSON.stringify(formData));
                edit_json.is_deleted = false;
                response = api.put(`${API_9007_URI}/rbac/update-permission-group`, edit_json);
            } else {
                const json = JSON.parse(JSON.stringify(formData));
                response = api.create(`${API_9007_URI}/rbac/create-permission-group`, json);
            }

            setSubmitProcess(true);
            let data = await response;
            if (data.code === 200) {
                populate_data();
                setShow(false);
                reset_form();
                setModalAlert({
                    open: true,
                    type: 'success',
                    title: 'Simpan Data',
                    message: 'Proses simpan data berhasil'
                });
            }
        } catch (error) {
            setModalAlert({
                open: true,
                type: 'error',
                title: 'Error Simpan Data',
                message: error
            })
        } finally {
            setSubmitProcess(false);
        }
        return false;
    }

    function changeValue(e) {
        const { name, value, checked, type } = e.target;
        setFormData({ ...formData, [name]: type == "checkbox" ? checked : type == "select-one" ? parseInt(value) : value })
    }

    function cancel_form() {
        reset_form();
        setShow(false);
    }

    function reset_form() {
        setIsEdit(false);
        setFormData(JSON.parse(JSON.stringify(EMPTY_FORM)));
    }

    function onEdit(data) {
        setIsEdit(true);
        setShow(true);
        const _new = JSON.parse(JSON.stringify(data));
        setFormData(_new);
        window.scrollTo(0, 0)
    }

    function onDelete(item) {
        setDeleteData(item);
        setShow(false);
        tog_center();
    }

    function tog_center() {
        setmodal_center(!modal_center);
    }

    async function do_delete() {
        try {
            const json = Object.assign({}, delete_data, { is_deleted: !delete_data.is_deleted });
            let response = api.put(`${API_9007_URI}/rbac/delete-permission-group`, json);
            let data = await response;
            if (data.code === 200) {
                populate_data();
                setModalAlert({
                    open: true,
                    type: 'success',
                    title: 'Hapus Data',
                    message: 'Proses hapus data berhasil'
                });
            }
        } catch (error) {
            setModalAlert({
                open: true,
                type: 'error',
                title: 'Error Hapus Data',
                message: error
            })
        } finally {
        }
        tog_center();
    }

    return (
        <div className="page-content">
            <h3>Permission Roles</h3>
            <Row style={{ display: show && "inline" || "none" }}>
                <Col>
                    <Card>
                        <CardBody>
                            <form onSubmit={onSubmit}>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label>Permission</Label>
                                            <select name="permission_id"
                                                onChange={e => changeValue(e)}
                                                className="form-select"
                                                value={formData.permission_id}>
                                                <option value={0}>-- Pilih Permission --</option>
                                                {listPermission.map(item => (
                                                    <option key={'option_permission' + item.permission_id} value={item.permission_id}>
                                                        {item.permission_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Group Role</Label>
                                            <select name="grp_role_id"
                                                onChange={e => changeValue(e)}
                                                className="form-select"
                                                value={formData.grp_role_id}>
                                                <option value={0}>-- Pilih Group Role --</option>
                                                {listGroupRole.map(item => (
                                                    <option key={'option_permission' + item.grp_role_id} value={item.grp_role_id}>
                                                        {item.grp_role_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Label>
                                                <input type="checkbox" name="is_active"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-check-input"
                                                    checked={formData.is_active}
                                                />
                                                <span>Aktif</span>
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
                            <div className="d-flex justify-content-between">
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
                                    <Link to="/permission" className="btn btn-outline-warning mx-2" style={{
                                        padding: "10px 20px",
                                        marginBottom: "6px"
                                    }}>
                                        Form Permission
                                    </Link>
                                    <Link to="/permission-menus" className="btn btn-outline-warning mx-2" style={{
                                        padding: "10px 20px",
                                        marginBottom: "6px"
                                    }}>
                                        Form Permission Menus
                                    </Link>
                                </div>

                                <div style={{ width: '400px' }}>
                                    <select name="roles"
                                        onChange={e => setFormFilter(Object.assign({}, formFilter, { id_permission: parseInt(e.target.value) }))}
                                        className="form-select"
                                        value={formFilter.id_permission}>
                                        <option value={0}>-- Filter Permission --</option>
                                        {listPermission.map(item => (
                                            <option key={'option_filter_permission_' + item.permission_id} value={item.permission_id}>
                                                {item.permission_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>


                            <table className="table table-bordered table-nowrap align-middle mb-0" style={{ width: "100%" }}>
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: "20px" }}>NO</th>
                                        <th style={{ cursor: "pointer", verticalAlign: "middle" }}>Nama Permission</th>
                                        <th>Nama Group Roles</th>
                                        <th style={{ width: "60px" }}>Aktif</th>
                                        <th style={{ width: "60px" }}>Deleted</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody style={{ minHeight: "500px" }}>
                                    {resultData.map((item, index) => (
                                        <tr key={index}>
                                            <td style={
                                                {
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                    maxWidth: "50px"
                                                }}>
                                                {(paging.page - 1) * paging.size + index + 1}
                                            </td>
                                            <td style={{ maxWidth: "10%" }} className="text-wrap">
                                                {item.permission_name}
                                            </td>
                                            <td style={{ maxWidth: "400px" }} className="text-wrap">
                                                {item.grp_role_name}
                                            </td>
                                            <td><input type="checkbox" key={'is_active_' + index} checked={item.is_active} readOnly /></td>
                                            <td><input type="checkbox" key={'is_deleted_' + index} checked={item.is_deleted} readOnly /></td>
                                            <td style={{ width: "160px" }}>
                                                <Button color="danger" style={{ marginRight: "3px" }} onClick={() => { onDelete(item); }}>Hapus</Button>
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
                <ModalHeader className="p-3 bg-info-subtle" toggle={tog_center}>
                    Hapus Data Permission By Group Roles
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <Label>Anda yakin hapus permission by group role ?</Label>
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

            <Modal
                isOpen={modal_alert.open}
                backdrop="static"
                keyboard={false}
                toggle={() => setModalAlert(Object.assign({}, modal_alert, { open: false }))}
                centered
            >
                <div className=" text-center p-5">
                    <lord-icon
                        src={modal_alert.type == "error" ? 'https://cdn.lordicon.com/tdrtiskw.json' : 'https://cdn.lordicon.com/lupuorrc.json'}
                        trigger="loop"
                        colors="primary:#f7b84b,secondary:#405189"
                        style={{ width: "130px", height: "130px" }}>
                    </lord-icon>
                    <div className="mt-4 pt-4">
                        <h4>{modal_alert.title}</h4>
                        <p className="text-muted"> {modal_alert.message} </p>
                        <button className="btn btn-warning" onClick={() => setModalAlert(Object.assign({}, modal_alert, { open: false }))}>
                            {modal_alert.type == "error" ? 'Continue' : 'Complete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default PermissionRoles;
