import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Button,
  Form,
  Input,
  Label,
  FormFeedback,
  Alert,
  Spinner,
  TabContent,
  NavItem,
  Nav,
  NavLink,
  TabPane,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useSelector, useDispatch } from "react-redux";
import withRouter from "../../Components/Common/withRouter";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser, resetLoginFlag } from "../../slices/thunks";
import logoSipd from "../../assets/images/logo-kemendagri/logo-sipd-hub-kemendagri.png";
import logoSdpdn from "../../assets/images/logo-kemendagri/logo-sdpdn.png";
import imageLogin from "../../assets/images/logo-kemendagri/image-login.png";
import classnames from "classnames";


const API_URI_RBAC = `${process.env.REACT_APP_API_URL_9007}`;

const Login = (props) => {
  const dispatch = useDispatch();
  const { user, errorMsg, loading, error } = useSelector((state) => state.Login);

  const [passwordShow, setPasswordShow] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const canvasRef = useRef(null);

  // Generate random CAPTCHA text
  const generateCaptchaText = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
    const captchaLength = 6;
    return Array.from({ length: captchaLength }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };
  // Draw CAPTCHA on Canvas
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    console.log(canvasRef.current); // Pastikan tidak null sebelum melanjutkan
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Random background color
    ctx.fillStyle = `rgb(${Math.random() * 20}, ${Math.random() * 20}, ${Math.random() * 20})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw CAPTCHA text
    const text = generateCaptchaText();
    setCaptchaText(text);

    ctx.font = "bold 30px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (let i = 0; i < text.length; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
      const x = (canvas.width / (text.length + 1)) * (i + 1);
      const y = canvas.height / 2;
      const angle = Math.random() * 0.5 - 0.25;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // Draw random lines
    for (let i = 0; i < 10; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawCaptcha();
    getDataListDaerah();
  }, []);

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      if (captchaInput !== captchaText) {
        setCaptchaError(true);
        return;
      }
      dispatch(loginUser(values, props.router.navigate, "email"));
    },
  });

  const validationUsername = useFormik({
    enableReinitialize: true,
    initialValues: {
      daerah:"",
      username: "",
      password: "",
      login_type:""
    },
    validationSchema: Yup.object({
      daerah: Yup.string().required("Daerah harus dipilih"),
      username: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
      login_type: Yup.string().required("Please Enter Your login type"),
    }),
    onSubmit: (values) => {
      if (captchaInput !== captchaText) {
        setCaptchaError(true);
        return;
      }
      dispatch(loginUser(values, props.router.navigate, "username"));
    },
  });
  

  const [justifyPillsTab, setjustifyPillsTab] = useState("1");
    const justifyPillsToggle = (tab) => {
        if (justifyPillsTab !== tab) {
            setjustifyPillsTab(tab);
        }
    };

    const [dataListDaerah, setDataListDaerah] = useState([])
    const [errorListDaerah, setErrorListDaerah] = useState(false)
    const [loadingListDaerah, setLoadingListDaerah] = useState(false)

    const getDataListDaerah = () => {
      const fetchData = async () => {
        try {
          // const token = JSON.parse(sessionStorage.getItem("authUser"))
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
          
            // }),
          };
  
          const response = await fetch(
            `${API_URI_RBAC}/master/daerah`,
            requestOptions
          );
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          } 
  
          const dataListDaerah = await response.json();
          
          setDataListDaerah(dataListDaerah.data)
        } catch (errorListDaerah) {
          setErrorListDaerah(errorListDaerah);
        } finally {
          setLoadingListDaerah(false);
        }
      };
      fetchData();
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [selectedDaerah, setSelectedDaerah] = useState("Pilih Daerah");

const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

const filteredDaerah = dataListDaerah.filter((item) =>
  item.nama_daerah.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <React.Fragment>
      <ParticlesAuth>
        <Row className="m-0 vh-100">
          {/* Form Section */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <Card className="mt-4 card-animate" style={{ width: "100%", maxWidth: "400px" }}>
              <CardBody className="p-4">
                <div className="text-center mt-2">
                  <h5 className="text-primary">Welcome Back!</h5>
                  <p className="text-muted">Sign in to continue to SIPD-HUB</p>
                </div>
                <Nav pills className="nav-justified mb-2">
                <NavItem>
                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: justifyPillsTab === "1", })} onClick={() => { justifyPillsToggle("1"); }} >
                        SIPD-HUB
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink style={{ cursor: "pointer" }} className={classnames({ active: justifyPillsTab === "2", })} onClick={() => { justifyPillsToggle("2"); }} >
                        SIPD
                    </NavLink>
                </NavItem>
            </Nav>
            
                {error && <Alert color="danger">{error}</Alert>}
                <div className="p-2 mt-0">
                <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (justifyPillsTab === "1") {
                          setTimeout(() => validation.handleSubmit(), 100);
                        } else {
                          validationUsername.setFieldTouched("daerah", true); // Paksa field tersentuh
                          validationUsername.validateField("daerah"); // Jalankan validasi manual
                          validationUsername.setFieldValue("login_type", "SIPD", false);
                          setTimeout(() => validationUsername.handleSubmit(), 100);
                        }
                      }}
                  >
                   <TabContent activeTab={justifyPillsTab} className="text-muted">
                    {/* Tab pertama: Login dengan Email */}
                    <TabPane tabId="1" id="pill-justified-home-1">
                      <div className="mb-3">
                        <Label htmlFor="email" className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={validation.touched.email && validation.errors.email ? true : false}
                        />
                        {validation.touched.email && validation.errors.email && (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        )}
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="password-input" className="form-label">Password</Label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={passwordShow ? "text" : "password"}
                            className="form-control pe-5"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={validation.touched.password && validation.errors.password ? true : false}
                          />
                          {validation.touched.password && validation.errors.password && (
                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                          )}
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                            type="button"
                            onClick={() => setPasswordShow(!passwordShow)}
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </button>
                        </div>
                      </div>
                    </TabPane>

                    {/* Tab kedua: Login dengan Username */}
                    <TabPane tabId="2" id="pill-justified-home-2">
                      <div className="mb-3">
                        <Label htmlFor="daerah" className="form-label">Daerah</Label>
                        <Dropdown isOpen={dropdownOpen} toggle={() => {
                              setDropdownOpen(!dropdownOpen);
                              if (dropdownOpen) {
                                validationUsername.setFieldTouched("daerah", true);
                                validationUsername.validateField("daerah");
                              }
                            }}>
                          <DropdownToggle  caret
                            style={{
                              background: "transparent",
                              color: "black",
                              border: "1px solid #ccc",
                              width: "100%",
                              textAlign: "left",
                              boxShadow: "none", // Hilangkan efek shadow default
                            }}>
                            {selectedDaerah || "Pilih Daerah"}
                          </DropdownToggle>
                          <DropdownMenu className="w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
                          <div className="px-2">
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Cari daerah..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                            {dataListDaerah
                              .filter((item) => item.nama_daerah.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map((item) => (
                                <DropdownItem
                                key={item.id_daerah}
                                onClick={() => {
                                  validationUsername.setFieldValue("daerah", item.kode_ddn_2, true);
                                  setSelectedDaerah(item.nama_daerah);
                              
                                  // Tambahkan sedikit delay sebelum menutup dropdown
                                  setTimeout(() => setDropdownOpen(false), 100); 
                                }}
                                >
                                  {item.nama_daerah}
                                </DropdownItem>
                              ))}
                          </DropdownMenu>

                          {validationUsername.touched.daerah && validationUsername.errors.daerah && (
                            <FormFeedback>{validationUsername.errors.daerah}</FormFeedback>
                          )}
                        </Dropdown>
                        {/* <Input
                          type="select"
                          name="daerah"
                          className="form-control"
                          onChange={validationUsername.handleChange}
                          onBlur={validationUsername.handleBlur}
                          value={validationUsername.values.daerah || ""}
                          invalid={validationUsername.touched.daerah && validationUsername.errors.daerah ? true : false}
                        >
                          <option value="">Pilih Daerah</option>
                          {dataListDaerah.map((item) => (
                            <option key={item.id_daerah} value={item.kode_ddn}>
                              {item.nama_daerah}
                            </option>
                          ))}
                        </Input> */}
                        {/* {validationUsername.touched.daerah && validationUsername.errors.daerah && (
                          <FormFeedback type="invalid">{validationUsername.errors.daerah}</FormFeedback>
                        )} */}
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="username" className="form-label">Username</Label>
                        <Input
                          name="username" // Ubah name agar tidak berbagi dengan email
                          className="form-control"
                          placeholder="Enter username"
                          type="text"
                          onChange={validationUsername.handleChange}
                          onBlur={validationUsername.handleBlur}
                          value={validationUsername.values.username || ""}
                          invalid={validationUsername.touched.username && validationUsername.errors.username ? true : false}
                        />
                        {validationUsername.touched.username && validationUsername.errors.username && (
                          <FormFeedback type="invalid">{validationUsername.errors.username}</FormFeedback>
                        )}
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="password-input" className="form-label">Password</Label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <Input
                            name="password"
                            value={validationUsername.values.password || ""}
                            type={passwordShow ? "text" : "password"}
                            className="form-control pe-5"
                            placeholder="Enter Password"
                            onChange={validationUsername.handleChange}
                            onBlur={validationUsername.handleBlur}
                            invalid={validationUsername.touched.password && validationUsername.errors.password ? true : false}
                          />
                          {validationUsername.touched.password && validationUsername.errors.password && (
                            <FormFeedback type="invalid">{validationUsername.errors.password}</FormFeedback>
                          )}
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                            type="button"
                            onClick={() => setPasswordShow(!passwordShow)}
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </button>
                        </div>
                      </div>
                    </TabPane>
                  </TabContent>
                    {/* CAPTCHA */}
                    <div className="mb-3">
                {/* <Label>Captcha</Label> */}
                <canvas
                  ref={canvasRef}
                  width="335"
                  height="80"
                  style={{ display: "block", border: "1px solid #ccc" }}
                ></canvas>
                <Button
                  className="p-0 mb-2"
                  color="link"
                  onClick={() => {
                    setCaptchaError(false);
                    drawCaptcha();
                  }}
                >
                  Refresh Captcha
                </Button>
                <Input
                  type="text"
                  placeholder="Enter Captcha"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  invalid={captchaError}
                />
                {captchaError && (
                  <FormFeedback>Captcha Salah!</FormFeedback>
                )}                
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

          {/* Illustration Section */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
            style={{ background: "linear-gradient(to bottom right, #001f44, #003f88)" }}
          >
            <div className="text-center text-white">
              <div className="d-flex justify-content-center mb-2">
                <img src={logoSipd} alt="Logo SIPD" width="120" height="120" />
                <img src={logoSdpdn} alt="Logo SDPDN" width="120" height="120" />
              </div>
              <img src={imageLogin} alt="Login Illustration" width="500" height="500" />
            </div>
          </Col>
        </Row>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
