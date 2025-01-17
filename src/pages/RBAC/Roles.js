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
import { APIClient } from "../../helpers/api_helper";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { get_permission_by_url } from "../../slices/thunks";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FormSelectFilter from "../../Components/FormFactory/FormSelectFilter";

const API_9007_URI = `${process.env.REACT_APP_API_URL_9007}`;
const api = new APIClient();

const Roles = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: 0,
        uuid: '',
        role_name: '',
        role_description: '',
        is_active: false,
        parent_role_id: null
    });
    const [show, setShow] = useState(false)
    const [modal_center, setmodal_center] = useState(false);
    const [resultData, setResultData] = useState([]);
    const [submitProcess, setSubmitProcess] = useState(false);
    const [is_valid, setIsValid] = useState(false);
    const [delete_data, setDeleteData] = useState(null);
    const [is_edit, setIsEdit] = useState(false);
    const [modal_alert, setModalAlert] = useState({
        open: false,
        type: 'error', // [success|error]
        title: 'Title',
        message: 'Message'
    })

    const [list_parent, setListParent] = useState([]);
    const [parent_selected, setParentSelected] = useState(null);
    async function search_parent(keyword) {
        const json = {
            page: 1,
            size: 10,
            role_name: keyword
        }
        let response = api.create(`${API_9007_URI}/rbac/list-roles-all`, json);

        let data = await response;

        if (data.code === 200) {
            setListParent(data.data.map(d => { return { id: d.role_id, text: d.role_name } }));
        } else {
            setListParent([]);
        }
    }

    // permission
    const permissionState = (state) => state.Profile;
    const permissionProperties = createSelector(
        permissionState, (d) => ({ list_menus: d.list_menus })
    );
    const { list_menus } = useSelector(permissionProperties);
    useEffect(() => {
        if (list_menus.length == 0) return;
        const permit = get_permission_by_url('/roles', true, () => {
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
    function calculate_paging(resp) {
        const { totalPages, currentPage, pageSize } = resp;
        paging.page = currentPage;
        paging.max = totalPages;
        paging.size = pageSize;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const json = JSON.parse(JSON.stringify(formData));
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

    function tog_center() {
        setmodal_center(!modal_center);
    }

    useEffect(() => {
        let is_valid = true;
        if (!formData.role_name) is_valid = false;
        setIsValid(is_valid);
    }, [formData])

    useEffect(() => {
        populate_data();
    }, [])

    async function populate_data() {
        const json = {
            page: paging.page,
            size: paging.size
        }
        let response = api.create(`${API_9007_URI}/rbac/list-roles-all`, json);
        let data = await response;
        if (data.code === 200) {
            calculate_paging(data);
            setResultData(data.data);
        }
    }

    function onEdit(data) {
        setShow(true);
        setIsEdit(true);
        setFormData(Object.assign({}, formData, {
            id: data.id,
            uuid: data.uuid,
            role_name: data.role_name,
            role_description: data.role_description || '',
            is_active: data.is_active,
            parent_role_id: data.parent_role_id
        }));
        setParentSelected(data.parent_role_id ? { id: data.parent_role_id, text: data.parent_role_name || 'EMPTY' } : null);
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
            uuid: '',
            role_name: '',
            role_description: '',
            is_active: false,
        })
    }

    async function do_delete() {
        try {
            const json = {
                "id_role": delete_data.id,
                "is_deleted": true,
                uuid: delete_data.uuid
            }
            let response = api.create(`${API_9007_URI}/rbac/delete-roles`, json);
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
                type: 'error',
                title: "Error Hapus Data",
                message: error || 'error',
                open: true,
            })
        } finally {
        }
        tog_center();
    }

    return (
        <>
            <div className="page-content">
                <h3>Form Roles</h3>
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
                                                <input type="text" name="role_name"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.role_name}
                                                />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label>Deskripsi Role</Label>
                                                <input type="text" name="role_description"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.role_description}
                                                />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label>Role Parent</Label>
                                                <FormSelectFilter onSearch={search_parent} dataList={list_parent}
                                                    selected={parent_selected}
                                                    onSelect={val => {
                                                        setFormData(Object.assign({}, formData, { parent_role_id: val ? val.id : null }));
                                                        setParentSelected(val);
                                                    }}
                                                />
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
                                    }} onClick={() => { reset_form(); setShow(true) }}>Tambah</button>
                                    <Link to="/roles-group" className="btn btn-outline-warning mx-2" style={{
                                        padding: "10px 20px",
                                        marginBottom: "6px"
                                    }}>
                                        Form Role Group
                                    </Link>
                                    <Link to="/roles-group-detail" className="btn btn-outline-warning mx-2" style={{
                                        padding: "10px 20px",
                                        marginBottom: "6px"
                                    }}>
                                        Form Group Role Detail
                                    </Link>
                                </div>
                                <table
                                    className="table table-bordered table-nowrap align-middle mb-0"
                                    style={{ width: "100%" }}
                                >
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: "20px" }}>NO</th>
                                            <th style={{ cursor: "pointer", verticalAlign: "middle" }}>
                                                Nama Role
                                            </th>
                                            <th>Deskripsi</th>
                                            <th>Parent Role</th>
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
                                                        width: "20px"
                                                    }}>
                                                    {(paging.page - 1) * paging.size + index + 1}
                                                </td>
                                                <td>{item.role_name}</td>
                                                <td>{item.role_description}</td>
                                                <td>{item.parent_role_name || item.parent_role_id || '-'}</td>
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
        </>
    );
}

export default Roles;
