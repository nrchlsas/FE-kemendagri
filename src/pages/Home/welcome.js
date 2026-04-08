import { Alert, Card, CardBody, Col, Row } from 'reactstrap';
import React from 'react';

//Import Icons
import FeatherIcon from "feather-icons-react";

//import images
// import illustarator from "../../assets/images/user-illustarator-2.png";
import logoKemendagriHome from "../../assets/images/logo-kemendagri/logo-kemendagri-home.png"

const Welcome = () => {
    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardBody className="p-0">
                            <Alert className="alert alert-warning border-0 rounded-0 m-0 d-flex justify-content-center align-items-center" role="alert">
                                {/* <FeatherIcon
                                    icon="alert-triangle"
                                    className="text-warning me-2 icon-sm"
                                /> */}
                                <div style={{ fontFamily: 'sans-serif', color: 'black', fontSize:'40px', fontWeight: 600, margin: '0 0 0 10px' }} className="d-flex justtify-content-center align-item-center text-truncate">
                                    Selamat Datang di Aplikasi SIPD Hub
                                </div>
                            </Alert>

                            <Row className="align-items-start">
                                <Col sm={8}>
                                    <div className="p-3">
                                        <Card>
                                            <CardBody>
                                            <div className="m-3">
                                                <div>Nama: User</div> 
                                                <div>Wilayah: ADMINISTRATOR</div> 
                                                <div>Provinsi: </div> 
                                                <div>Kabupaten: </div> 
                                            </div>
                                            </CardBody>
                                        </Card>
                                        {/* <p className="fs-17 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p>
                                        <div className="mt-3">
                                            <Link to="/pages-pricing" className="btn btn-success">Upgrade Account!</Link>
                                        </div> */}
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <div className="px-3">
                                        <img src={logoKemendagriHome} className="img-fluid" alt="" />
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Welcome;