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
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
    ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
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
    for (let i = 0; i < 35; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawCaptcha();
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
      dispatch(loginUser(values, props.router.navigate));
    },
  });

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
                        invalid={validation.touched.email && validation.errors.email ? true : false}
                      />
                      {validation.touched.email && validation.errors.email && (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
                      <Label htmlFor="password-input" className="form-label">
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
                            validation.touched.password && validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password && validation.errors.password && (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
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
