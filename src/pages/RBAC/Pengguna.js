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
import { Link, useLocation, useNavigate } from "react-router-dom";



const API_9007_URI = `${process.env.REACT_APP_API_URL_9007}`;
const api = new APIClient();
const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
};

const Pengguna = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [disabledChangePassword, setDisabledChangePassword] = useState(true);
    const [changePassword, setChangePassword] = useState({
        password: "",
        confirm_password: "",
        uuid: '',
    });
    useEffect(() => {
        let is_valid = true;
        if (!changePassword.password) is_valid = false;
        if (changePassword.password !== changePassword.confirm_password) is_valid = false;
        if (changePassword.password && changePassword.password.length < 6) is_valid = false;
        setDisabledChangePassword(!is_valid);
    }, [changePassword])
    const [formData, setFormData] = useState({
        id: 0,
        email: '',
        status: false,
        is_verifikasi: false,
        roles: 0,
        first_name: "",
        last_name: "",
        id_daerah: 0,
        password: "",
        confirm_password: "",
        uuid: '',
    });
    const [show, setShow] = useState(false)
    const [modal_center, setmodal_center] = useState(false);
    const [modal_update_password, setmodal_update_password] = useState(false);
    const [list_role, setListRole] = useState([]);
    const [list_daerah, setListDaerah] = useState([]);
    const [resultData, setResultData] = useState([]);
    const [submitProcess, setSubmitProcess] = useState(false)
    const [is_valid, setIsValid] = useState(false);
    const [is_edit, setIsEdit] = useState(false);
    const [modal_alert, setModalAlert] = useState({
        open: false,
        type: 'error', // [success|error]
        title: 'Title',
        message: 'Message'
    })
    const [delete_data, setDeleteData] = useState(null);

    useEffect(() => {
        populate_data();
        populate_roles();
        populate_daerah();
    }, [])

    useEffect(() => {
        let is_valid = true;
        if (!formData.email) is_valid = false;
        if (!isEmailValid(formData.email)) is_valid = false;
        if (formData.roles == 0) is_valid = false;
        setIsValid(is_valid);
    }, [formData])

    // permission
    const permissionState = (state) => state.Profile;
    const permissionProperties = createSelector(
        permissionState, (d) => ({ list_menus: d.list_menus })
    );
    const { list_menus } = useSelector(permissionProperties);
    useEffect(() => {
        if (list_menus.length == 0) return;
        const permit = get_permission_by_url('/pengguna', true, () => {
            navigate('/auth-404-basic', { replace: true });
        });
        dispatch(permit);
    }, [list_menus]);

    async function populate_daerah() {
        // populate list role
        const json = { page: 1, size: 100 }
        let response = api.get(`${API_9007_URI}/rbac/list-daerah`);
        let data = await response;
        if (data.code === 200) {
            const list_area = data.data.map(d => {
                return {
                    id_daerah: d.id_daerah,
                    kode_ddn: parseInt(d.kode_ddn),
                    nama_daerah: d.nama_daerah
                }
            });
            setListDaerah(list_area);
        }
    }

    async function populate_roles() {
        // populate list role
        const json = { page: 1, size: 100 }
        let response = api.create(`${API_9007_URI}/rbac/list-roles-all`);
        let data = await response;
        if (data.code === 200) {
            setListRole(data.data); // .filter(d => d.status)
        }
    }

    async function populate_data() {
        const json = {
            "page": 1,
            "size": 100
        }
        let response = api.create(`${API_9007_URI}/users/list-users`, json);
        let data = await response;
        if (data.code === 200) {
            setResultData(data.data);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const json = Object.assign({}, formData, { is_deleted: false });
            let response = null;

            if (is_edit) {
                json.id_user = parseInt(formData.id);
                json.id_roles = parseInt(formData.roles);
                delete json.id;
                delete json.roles;
                response = api.create(`${API_9007_URI}/users/update-user`, json);
            } else {
                response = api.create(`${API_9007_URI}/users/register`, json);
            }

            setSubmitProcess(true);
            let data = await response;
            if (data.code === 200) {
                populate_data();
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

    function tog_center() {
        setmodal_center(!modal_center);
    }

    function onEdit(data) {
        setIsEdit(true);
        setShow(true);
        setFormData(Object.assign({}, formData, {
            id: data.id,
            email: data.email,
            status: data.status,
            is_verifikasi: data.is_verifikasi,
            roles: data.id_roles,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            id_daerah: data.id_daerah || 0,
            password: data.password || "",
            confirm_password: data.confirm_password || "",
            uuid: data.uuid,
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
            id: 0,
            email: '',
            status: false,
            is_verifikasi: false,
            roles: 0,
            first_name: "",
            last_name: "",
            id_daerah: 0,
            password: "",
            confirm_password: "",
        })
    }

    async function do_delete() {
        try {
            const json = {
                id_user: parseInt(delete_data.id),
                is_deleted: true
            };
            let response = api.create(`${API_9007_URI}/users/delete-user`, json);
            let data = await response;
            if (data.code === 200) {
                populate_data();
                setModalAlert(Object.assign({}, modal_alert, { type: 'success', title: "Hapus Data", message: "Proses hapus data berhasil", open: true }))
            }
        } catch (error) {
            setModalAlert(Object.assign({}, modal_alert, { type: 'error', title: "Error Hapus Data", message: error, open: true }))
        } finally {
        }
        tog_center();
    }

    function update_password(data) {
        setChangePassword({
            password: "",
            confirm_password: "",
            uuid: data.uuid,
        });
        setmodal_update_password(true);
    }
    async function do_update_password() {
        try {
            const json = {
                uuid: changePassword.uuid,
                password: changePassword.password
            };
            let response = api.create(`${API_9007_URI}/users/update-password/`, json);
            let data = await response;
            if (data.code === 200) {
                setModalAlert(Object.assign({}, modal_alert, { type: 'success', title: "Update Password", message: "Proses update password berhasil", open: true }))
            }
        } catch (error) {
            setModalAlert(Object.assign({}, modal_alert, { type: 'error', title: "Error Update Password", message: error, open: true }))
        } finally {
        }
    }

    async function onVerification(item) {
        // const newWindow = window.open(`/verification/${item.uuid}`, '_blank');
        // if (newWindow) newWindow.opener = null
        try {
            let response = api.get(`${API_9007_URI}/users/verifikasi/${item.uuid}`);
            let data = await response;
            if (data.code === 200) {
                setModalAlert(Object.assign({}, modal_alert, { type: 'success', title: "Verifikasi Data", message: "Proses verifikasi data berhasil", open: true }))
            }
        } catch (error) {
            setModalAlert(Object.assign({}, modal_alert, { type: 'error', title: "Error Verifikasi Data", message: error, open: true }))
        } finally {
        }
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
                                                <Label>Email</Label>
                                                <input type="email" name="email"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.email}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>First Name</Label>
                                                <input type="text" name="first_name"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.first_name}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Last Name</Label>
                                                <input type="text" name="last_name"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.last_name}
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
                                            <FormGroup check>
                                                <Label>
                                                    <input type="checkbox" name="is_verifikasi"
                                                        onChange={(e) => changeValue(e)}
                                                        className="form-check-input"
                                                        checked={formData.is_verifikasi}
                                                    />
                                                    <span>Varifikasi</span>
                                                </Label>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Daerah</Label>
                                                <select name="id_daerah"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-select"
                                                    value={formData.id_daerah}>
                                                    <option value={0}>-- Pilih Data --</option>
                                                    {list_daerah.map(item => (
                                                        <option key={'option_daerah_' + item.id_daerah} value={item.id_daerah}>
                                                            {item.nama_daerah}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Role</Label>
                                                <select name="roles"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-select"
                                                    value={formData.roles}>
                                                    <option value={0}>-- Pilih Data --</option>
                                                    {list_role.map(item => (
                                                        <option key={'option_roles_' + item.id} value={item.id}>
                                                            {item.nama_roles}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormGroup>

                                            {/* <FormGroup className="mt-5">
                                                <Label>Password</Label>
                                                <input type="password" name="password"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.password}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Confirm Password</Label>
                                                <input type="password" name="confirm_password"
                                                    onChange={(e) => changeValue(e)}
                                                    className="form-control"
                                                    value={formData.confirm_password}
                                                />
                                            </FormGroup> */}
                                            {/* {
                                                Object.keys(permissionForm).map((e) => (
                                                    <FormInput key={e} dynamicForm={permissionForm[e]} changeValue={changeValue} dataRoles={dataRoles} />
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
                                <table
                                    className="table table-bordered table-nowrap align-middle mb-0"
                                    style={{ width: "100%" }}
                                >
                                    <thead className="table-light">
                                        <tr>
                                            <th>NO</th>
                                            <th style={{ cursor: "pointer", verticalAlign: "middle" }}>
                                                Email
                                            </th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Status</th>
                                            <th>Verifikasi</th>
                                            <th>Update Password</th>
                                            <th>Roles</th>
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
                                                            verticalAlign: "middle"
                                                        }}>
                                                    {index + 1}
                                                </td>
                                                <td>{item.email}</td>
                                                <td>{item.first_name || '-'}</td>
                                                <td>{item.last_name || '-'}</td>
                                                <td>
                                                    <input type="checkbox" key={index} checked={item.status} readOnly />
                                                </td>
                                                <td style={{ width: "150px" }}>
                                                    {
                                                        item.is_verifikasi ? (
                                                            <Button color="warning" onClick={() => onVerification(item)}>Verification</Button>
                                                        ) : (
                                                            <div><Link to={`/verification/${item.uuid}`} target="_blank">Terverifikasi</Link></div>
                                                        )
                                                    }
                                                    {/* <input type="checkbox" key={index} checked={item.is_verifikasi} readOnly /> */}
                                                </td>
                                                <td style={{ width: "155px" }}>
                                                    {/* <input type="checkbox" key={index} checked={item.is_update_password} readOnly /> */}
                                                    <Button color="danger" onClick={() => { update_password(item) }}>Ubah Password</Button>
                                                </td>
                                                <td>{item.nama_roles || '-'}</td>
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

            <Modal
                isOpen={modal_update_password}
                toggle={() => setmodal_update_password(false)}
                centered
            >
                <ModalHeader className=" p-3 bg-info-subtle" toggle={() => setmodal_update_password(false)}>
                    Form Ubah Password
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Password</Label>
                                <input type="password" name="password"
                                    onChange={(e) => setChangePassword(Object.assign({}, changePassword, { password: e.target.value }))}
                                    className="form-control"
                                    value={changePassword.password}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Confirm Password</Label>
                                <input type="password" name="confirm_password"
                                    onChange={(e) => setChangePassword(Object.assign({}, changePassword, { confirm_password: e.target.value }))}
                                    className="form-control"
                                    value={changePassword.confirm_password}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center align-items-center" >
                            <Button color="primary" className="mt-3" style={{ marginRight: "6px" }} onClick={() => do_update_password()} disabled={disabledChangePassword}>
                                Ubah Password
                            </Button>
                            <Button color="warning" className="mt-3" onClick={() => setmodal_update_password(false)}>
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
