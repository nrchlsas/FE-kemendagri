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
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { get_permission_by_url } from "../../slices/thunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const API_9007_URI = `${process.env.REACT_APP_API_URL_9007}`;
const api = new APIClient();
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
        val: 1,
        text: "Dashboard"
    },
    {
        val: 2,
        text: "Pengaturan"
    },
    {
        val: 3,
        text: "Data Pendapatan"
    }
]
const dataRoles = [
    {
        val: 1,
        text: "Direktur"
    },
    {
        val: 2,
        text: "DIRJEN"
    },
    {
        val: 3,
        text: "KASUBDIT"
    }
]

const Permission = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [val, setVal] = useState()
    const [formFilter, setFilter] = useState({
        idMenu: 0,
        idRoles: 0,
    });
    const [formData, setFormData] = useState({
        id_permission: 0,
        idMenu: 0,
        idRoles: 0,
        createPermission: false,
        updatePermission: false,
        deletePermission: false,
        readPermission: false,
    });
    const [show, setShow] = useState(false)
    const [modal_center, setmodal_center] = useState(false);
    const [resultData, setResultData] = useState([]);
    const [is_valid, setIsValid] = useState(false);
    const [is_edit, setIsEdit] = useState(false);
    const [submitProcess, setSubmitProcess] = useState(false);
    const [list_menu, setListMenu] = useState([]);
    const [list_role, setListRole] = useState([]);
    const [delete_data, setDeleteData] = useState(null);
    const [menu_delete_data, setMenuDeleteData] = useState(null);
    const [modal_alert, setModalAlert] = useState({
        open: false,
        type: 'error', // [success|error]
        title: 'Title',
        message: 'Message'
    })

    // permission
    const permissionState = (state) => state.Profile;
    const permissionProperties = createSelector(
        permissionState, (d) => ({ list_menus: d.list_menus })
    );
    const { list_menus } = useSelector(permissionProperties);
    useEffect(() => {
        if (list_menus.length == 0) return;
        const permit = get_permission_by_url('/permission', true, () => {
            navigate('/auth-404-basic', { replace: true });
        });
        dispatch(permit);
    }, [list_menus]); //page ini

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

    useEffect(() => {
        let is_valid = true;
        if (!formData.idMenu) is_valid = false;
        if (!formData.idRoles) is_valid = false;
        setIsValid(is_valid);
        console.log(formData)
    }, [formData])

    useEffect(() => {
        populate_menu();
        populate_role();
        populate_data();
    }, [])

    async function populate_role() {
        const json = {
            page: 1,
            size: 500
        }
        let response = api.create(`${API_9007_URI}/rbac/list-roles-all`, json);
        let data = await response;
        if (data.code === 200) {
            setListRole(data.data);
        }
    }

    async function populate_menu() {
        const json = {
            page: 1,
            size: 500
        }
        let response = api.create(`${API_9007_URI}/rbac/list-menu-table`, json);
        let data = await response;
        if (data.code === 200) {
            setListMenu(data.data);
        }
    }

    async function populate_data() {
        const json = {
            page: paging.page,
            size: paging.size
        }
        let response = api.create(`${API_9007_URI}/rbac/list-permission`, json);
        let data = await response;
        if (data.code === 200) {
            calculate_paging(data);
            setResultData(data.listData);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const json = Object.assign({}, formData);
        try {
            let response = null;
            if (is_edit) {
                response = api.create(`${API_9007_URI}/rbac/update-permission`, json);
            } else {
                response = api.create(`${API_9007_URI}/rbac/create-permission`, json);
            }
            setSubmitProcess(true);
            let data = await response;
            console.log({ data });
            if (data.code === 200 || data.customResponse.code === 200) {
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
            console.log({ error });
            setModalAlert({
                open: true,
                type: 'error',
                title: 'Error Simpan Data',
                message: error.message || error
            })
        } finally {
            setSubmitProcess(false);
        }
        return false;
    }
    function changeValue(e) {
        const { name, value, checked, type } = e.target;

        setFormData({ ...formData, [name]: type == "checkbox" ? checked : type == "select-one" ? parseInt(value) : value })
        setVal(e)

    }

    function tog_center() {
        setmodal_center(!modal_center);
    }

    function onEdit(sItem, mItem,) {
        setShow(true);
        setIsEdit(true);
        setFormData(Object.assign({}, formData, {
            id_permission: sItem.id_permission,
            idMenu: mItem.id_menu,
            idRoles: mItem.id_role,
            createPermission: sItem.create_permission,
            updatePermission: sItem.update_permission,
            deletePermission: sItem.delete_permission,
            readPermission: sItem.read_permission,
        }));
        window.scrollTo(0, 0)
    }

    function cancel_form() {
        reset_form();
        setShow(false);
    }

    function reset_form() {
        setIsEdit(false);
        setFormData({
            id_permission: 0,
            idMenu: 0,
            idRoles: 0,
            createPermission: false,
            updatePermission: false,
            deletePermission: false,
            readPermission: false,
        })
    }

    async function do_delete() {
        console.log({ delete_data, menu_delete_data });
        try {
            const json = {
                "id_permission": delete_data.id_permission,
                "id_menu": menu_delete_data.id_menu,
                "id_role": menu_delete_data.id_role,
                "is_deleted": true
            }
            let response = api.create(`${API_9007_URI}/rbac/delete-permission`, json);
            let data = await response;
            if (data.code === 200) {
                populate_data();
                // setModalAlert({ type: 'success', title: "Hapus Data", message: "Proses hapus data berhasil", open: true })
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
                                                <Label>Menu</Label>
                                                <select name="idMenu"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-select"
                                                    value={formData.idMenu}>
                                                    <option value={0}>-- Please Select Data --</option>
                                                    {list_menu.map(item => (
                                                        <option key={'option_menu_' + item.id} value={item.id}>
                                                            {item.nama_menu} {item.nama_sub_menu ? '- ' + item.nama_sub_menu : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormGroup>

                                            <FormGroup>
                                                <Label>Role</Label>
                                                <select name="idRoles"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-select"
                                                    value={formData.idRoles}>
                                                    <option value="0">-- Please Select Data --</option>
                                                    {list_role.map(item => (
                                                        <option key={'option_menu_' + item.id} value={item.id}>
                                                            {item.nama_roles}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormGroup>

                                            <FormGroup check>
                                                <Label>
                                                    <input type="checkbox" name="createPermission"
                                                        onChange={(e) => changeValue(e)}
                                                        className="form-check-input"
                                                        checked={formData.createPermission}
                                                    />
                                                    <span>Create Permission</span>
                                                </Label>
                                            </FormGroup>

                                            <FormGroup check>
                                                <Label>
                                                    <input type="checkbox" name="readPermission"
                                                        onChange={(e) => changeValue(e)}
                                                        className="form-check-input"
                                                        checked={formData.readPermission}
                                                    />
                                                    <span>Read Permission</span>
                                                </Label>
                                            </FormGroup>

                                            <FormGroup check>
                                                <Label>
                                                    <input type="checkbox" name="updatePermission"
                                                        onChange={(e) => changeValue(e)}
                                                        className="form-check-input"
                                                        checked={formData.updatePermission}
                                                    />
                                                    <span>Update Permission</span>
                                                </Label>
                                            </FormGroup>

                                            <FormGroup check>
                                                <Label>
                                                    <input type="checkbox" name="deletePermission"
                                                        onChange={(e) => changeValue(e)}
                                                        className="form-check-input"
                                                        checked={formData.deletePermission}
                                                    />
                                                    <span>Delete Permission</span>
                                                </Label>
                                            </FormGroup>

                                            {/* {
                                                Object.keys(permissionForm).map((e) => (
                                                    <FormInput key={e} dynamicForm={permissionForm[e]} changeValue={changeValue} dataMenu={dataMenu} dataRoles={dataRoles} />
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
                                <div className="d-flex flex-row justify-content-between">
                                    <div>
                                        <button style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            padding: "10px 20px",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            marginBottom: "6px"
                                        }} onClick={() => setShow(true)}>Tambah</button></div>
                                    <div>
                                        <span>Filter: </span>
                                        <select name="idRoles"
                                            onChange={(e) =>
                                                setFilter({ ...formFilter, idRoles: parseInt(e.target.value) })
                                            }
                                            className=""
                                            value={formFilter.idRoles}>
                                            <option value="0">-- Please Select Data --</option>
                                            {list_role.map(item => (
                                                <option key={'option_menu_' + item.id} value={item.id}>
                                                    {item.nama_roles}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <table
                                    className="table table-bordered table-nowrap align-middle mb-0"
                                    style={{ width: "100%" }}
                                >
                                    <thead className="table-light">
                                        <tr>
                                            {/* <th>
                                                NO
                                            </th> */}
                                            <th>
                                                Roles
                                            </th>
                                            <th style={{ cursor: "pointer", verticalAlign: "middle" }}>
                                                Menu
                                            </th>
                                            <th style={{ cursor: "pointer", verticalAlign: "middle" }}>
                                                Sub Menu
                                            </th>
                                            <th>URL</th>
                                            <th style={{ width: "65px" }}>Read</th>
                                            <th style={{ width: "65px" }}>Create</th>
                                            <th style={{ width: "65px" }}>Update</th>
                                            <th style={{ width: "65px" }}>Delete</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ minHeight: "500px" }}>
                                        {
                                            resultData.map((item, index) => (
                                                item.menus.map((mItem, mIdx) => (
                                                    mItem.sub_menus.map((sItem, idx) => (
                                                        <tr key={'role_item' + index + '_' + idx}>
                                                            {/* <td
                                                                style={
                                                                    {
                                                                        textAlign: "center",
                                                                        verticalAlign: "middle"
                                                                    }}>
                                                                {index + 1}
                                                            </td> */}
                                                            <td>
                                                                {item.nama_roles}
                                                            </td>
                                                            <td style={{ maxWidth: "300px" }} className="text-wrap">
                                                                {mItem.nama_menu}
                                                            </td>
                                                            <td style={{ maxWidth: "300px" }} className="text-wrap">
                                                                {sItem.nama_sub_menu}
                                                            </td>
                                                            <td style={{ maxWidth: "200px" }} className="text-wrap">{sItem.url}</td>
                                                            <td>
                                                                <input type="checkbox" checked={sItem.read_permission} readOnly />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={sItem.create_permission} readOnly />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={sItem.update_permission} readOnly />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={sItem.delete_permission} readOnly />
                                                            </td>
                                                            <td style={{ width: "160px" }}>
                                                                <Button color="danger" style={{ marginRight: "3px" }} onClick={() => {
                                                                    setDeleteData(sItem);
                                                                    setMenuDeleteData(mItem);
                                                                    setShow(false);
                                                                    tog_center();
                                                                }}>Hapus</Button>
                                                                <Button color="primary" onClick={() => onEdit(sItem, mItem)}>Ubah</Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ))
                                            ))
                                        }

                                    </tbody>
                                </table>
                                <div className="paging-container d-flex justify-content-center mt-3">{paging_content()}</div>
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
        </>
    );
}

export default Permission;
