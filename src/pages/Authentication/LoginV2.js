import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser, socialLogin, resetLoginFlag } from "../../slices/thunks";

import logoLight from "../../assets/images/logo-light.png";
import { createSelector } from "reselect";

//import images
import logoSipd from "../../assets/images/logo-kemendagri/logo-sipd-hub-kemendagri.png";
import logoSdpdn from "../../assets/images/logo-kemendagri/logo-sdpdn.png";
import imageLogin from "../../assets/images/logo-kemendagri/image-login.png"

import AuthSlider from "../AuthenticationInner/authCarousel";

const Login = (props) => {
  const dispatch = useDispatch();
  const selectLayoutState = (state) => {
    return state.Login;
  };
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      user: layout.user,
      errorMsg: layout.errorMsg,
      loading: layout.loading,
      error: layout.error,
    })
  );
  // Inside your component
  const { user, errorMsg, loading, error } = useSelector(
    selectLayoutProperties
  );

  const [userLogin, setUserLogin] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);

  useEffect(() => {
    if (user && user) {
      const updatedUserData =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? user.multiFactor.user.email
          : user.data.email;
      const updatedUserPassword =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? ""
          : user.data.confirm_password;
      setUserLogin({
        email: updatedUserData,
        password: updatedUserPassword,
      });
    }
  }, [user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userLogin.email || "admin@themesbrand.com" || "",
      password: userLogin.password || "123456" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    },
  });

  const signIn = (type) => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //for facebook and google authentication
  const socialResponse = (type) => {
    signIn(type);
  };

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  document.title = "SIPD-HUB | LOGIN";

  return (
    <React.Fragment>
      <ParticlesAuth>
        {/* <div className="auth-page-content"> */}
        {/* <Container> */}
        {/* <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <div className='d-flex justify-content-center align-items-center'>
                                                <img src={logoSipd} alt="" height="200" />
                                                <span style={{ fontSize: "70px", fontFamily: 'sans-serif', color: 'white', fontWeight: 600, margin: '0 0 0 10px' }}>SIPD-HUB</span>
                                            </div>
                                        </Link>
                                    </div>
                                    
                                </div>
                            </Col>
                        </Row> */}
        <Row className="m-0 vh-100">
          {/* Form Section with Background Color */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "#f8f9fa" }} // Background color for left section
          >
            <Card className="mt-4 card-animate" style={{ width: "100%", maxWidth: "400px" }}>
              <CardBody className="p-4">
                <div className="text-center mt-2">
                  <h5 className="text-primary">Welcome Back!</h5>
                  <p className="text-muted">Sign in to continue to SIPD-HUB</p>
                </div>
                {error && <Alert color="danger">{error}</Alert>}
                <div className="p-2 mt-4">
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    {/* Email Input */}
                    <div className="mb-3">
                      <Label htmlFor="email" className="form-label">
                        Username
                      </Label>
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Enter email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.email && validation.errors.email && (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="password-input">
                        Password
                      </Label>
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type={passwordShow ? "text" : "password"}
                          className="form-control pe-5"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password &&
                          validation.errors.password && (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          )}
                        <button
                          className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                          type="button"
                          onClick={() => setPasswordShow(!passwordShow)}
                          id="password-addon"
                        >
                          <i className="ri-eye-fill align-middle"></i>
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4">
                      <Button
                        color="success"
                        disabled={loading}
                        className="btn btn-success w-100"
                        type="submit"
                      >
                        {loading && (
                          <Spinner size="sm" className="me-2">
                            Loading...
                          </Spinner>
                        )}
                        Sign In
                      </Button>
                    </div>
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Illustration Section with Background Color */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
            style={{ background: "linear-gradient(to bottom right,  #001f44, #003f88)"}} // Background color for right section
          >
            
            <div className="d-flex flex-column text-white text-center">
                <div className="d-flex justify-content-center mb-2">
                    <div>
                    <img src={logoSipd} alt="" width="120" height="120" />
                    </div>
                    <div>
                    <img src={logoSdpdn} alt="" width="120" height="120" />
                    </div>
                </div>
                <img src={imageLogin} alt=""  width="500" height="500"/>
              {/* <h1>Welcome to SIPD-HUB</h1>
              <p>This is your gateway to advanced data management</p> */}
            </div>
          </Col>
        </Row>
        {/* </Container> */}
        {/* </div> */}
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
