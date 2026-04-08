import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";

import {
    Container,
    Row,
    Col,
    Card,
    Alert,
    CardBody,
    Button,
    Label,
    Input,
    FormFeedback,
    Form,
    FormGroup,
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

// actions
import { Link, useParams } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

const API_9007_URI = `${process.env.REACT_APP_API_URL_9007}`;
const api = new APIClient();

const UserVerification = () => {

    const { uuid } = useParams();
    const [is_valid, setValid] = useState(false);
    const [submitProcess, setSubmitProcess] = useState(false);
    const [formData, setFormData] = useState({
        id: 0,
        email: '',
        uuid: '',
        password: "",
        confirm_password: "",
    });
    const [verifated, setVerifated] = useState(false)

    useEffect(() => {
        getUserVerification();
    }, [])

    useEffect(() => {
        let is_valid = true;
        if (!formData.email) is_valid = false;
        if (!formData.password) is_valid = false;
        if (formData.password !== formData.confirm_password) is_valid = false;
        if (formData.password && formData.password.length < 6) is_valid = false;
        setValid(is_valid);
        console.log({ formData });
    }, [formData])

    function changeValue(e) {
        const { name, value, checked, type } = e.target;
        setFormData({ ...formData, [name]: type == "checkbox" ? checked : type == "select-one" ? parseInt(value) : value })
    }

    async function getUserVerification() {
        const json = { idRegister: uuid }
        let response = api.create(`${API_9007_URI}/users/verification`, json);
        let data = await response;
        if (data.code === 200) {
            // setResultData(data.data);
            console.log({ data });
        }
    }

    async function reset_password() {
        try {
            setSubmitProcess(true);
            const json = Object.assign({}, formData);
            let response = null;
            response = api.create(`${API_9007_URI}/users/detail-users/update-password`, json);
            let data = await response;
            if (data.code === 200) {
                console.log({ data });
            }
        } catch (err) {

        } finally {
            setSubmitProcess(false);
            setVerifated(true);
        }
    }

    document.title = "User Verification";
    return (

        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <h4 className="card-title mb-4">User Verification</h4>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>
                                    {
                                        verifated ? (
                                            <>
                                                <h3>Pengguna sudah terverifikasi dan sudah dapat digunakan</h3>
                                                <div className="mt-3">Silahkan klik link berikut untuk melakukan Login <Link to={'/login'}>SIPD-HUB</Link></div>
                                            </>
                                        ) : (
                                            <>
                                                <FormGroup>
                                                    <Label>Kode Verifikasi</Label>
                                                    <input type="email" name="uuid"
                                                        disabled={true}
                                                        onChange={(e) => { }}
                                                        className="form-control"
                                                        value={uuid}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Email</Label>
                                                    <input type="email" name="email"
                                                        disabled={true}
                                                        onChange={(e) => { }}
                                                        className="form-control"
                                                        value={formData.email}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
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
                                                </FormGroup>

                                                <div>
                                                    {/* !is_valid ||  */}
                                                    <Button color="primary" className="mt-3" style={{ marginRight: "6px" }} disabled={submitProcess} onClick={() => reset_password()}>
                                                        Verifikasi
                                                    </Button>
                                                </div>
                                            </>
                                        )
                                    }
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default UserVerification;
