import React, { useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Label,
  Input,
  Row,
  FormFeedback,
  Button,
} from "reactstrap";
import * as Yup from "yup";
// import images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { API_VERIFY_OTP } from "customhooks/All_Api/Apis";

const ForgetPasswordOTP = () => {
  const location = useLocation();
  const otpMobileNo = location.state?.otpMobileNo;
  console.log(otpMobileNo);

  const mobile_no = 9423743054;
  // const navigate = useNavigate()

  const otpVerification = useFormik({
    enableReinitialize: true,
    initialValues: {
      otp_code1: "",
      otp_code2: "",
      otp_code3: "",
      otp_code4: "",
      otp_code5: "",
      otp_code6: "",
    },
    validationSchema: Yup.object({
      otp_code1: Yup.number().required("fleld is required"),
      otp_code2: Yup.number().required("fleld is required"),
      otp_code3: Yup.number().required("fleld is required"),
      otp_code4: Yup.number().required("fleld is required"),
      otp_code5: Yup.number().required("fleld is required"),
      otp_code6: Yup.number().required("fleld is required"),
    }),
    onSubmit: async (values) => {
      try {
        const otp1 = values.otp_code1;
        const otp2 = values.otp_code2;
        const otp3 = values.otp_code3;
        const otp4 = values.otp_code4;
        const otp5 = values.otp_code5;
        const otp6 = values.otp_code6;

        const otp_code = otp1.concat(otp2, otp3, otp4, otp5, otp6);
        console.log(otp_code);

        const res = await axios.post(`${API_VERIFY_OTP}`, {
          otp: otp_code,
          mobile_no: mobile_no,
        });
        console.log(res.data);
        toast.success(`OTP is verified`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // navigate("/changePassword")
      } catch (error) {
        toast.error(`Please enter correct OTP`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    },
  });

  //meta title
  document.title =
    "Two Step Verification | Skote - React Admin & Dashboard Template";

  useEffect(() => {
    console.log("ForgetPasswordOTP", otpMobileNo);
  }, [otpMobileNo]);

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">  
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5 text-muted">
                <Link to="dashboard" className="d-block auth-logo">
                  {/* <img
                    src={logodark}
                    alt=""
                    height="20"
                    className="auth-logo-dark mx-auto"
                  /> */}
                  <img
                    src={logolight}
                    alt=""
                    height="20"
                    className="auth-logo-light mx-auto"
                  />
                </Link>
                <p className="mt-3">Milkmor Admin Dashboard </p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card>
                <CardBody>
                  <div className="p-2">
                    <div className="text-center">
                      <div className="avatar-md mx-auto">
                        <div className="avatar-title rounded-circle bg-light">
                          <i className="bx bxs-envelope h1 mb-0 text-primary"></i>
                        </div>
                      </div>
                      <div className="p-2 mt-4">
                        <h4>Verify your OTP</h4>
                        <p className="mb-5">Please enter the 6 digit code</p>

                        <Form
                          // onSubmit={e => {
                          //   e.preventDefault()
                          //   validation.handleSubmit()
                          //   return false
                          // }}
                          onSubmit={otpVerification.handleSubmit}
                        >
                          <Row>
                            <Col lg={2}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="digit1-input"
                                  className="visually-hidden"
                                >
                                  Digit 1
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center two-step"
                                  maxLength="1"
                                  data-value="1"
                                  id="digit1-input"
                                  name="otp_code1"
                                  onChange={otpVerification.handleChange}
                                  onBlur={otpVerification.handleBlur}
                                  value={otpVerification.values.otp_code1 || ""}
                                  invalid={
                                    otpVerification.touched.otp_code1 &&
                                    otpVerification.errors.otp_code1
                                      ? true
                                      : false
                                  }
                                />
                                {otpVerification.touched.otp_code1 &&
                                otpVerification.errors.otp_code1 ? (
                                  <FormFeedback type="invalid">
                                    {otpVerification.errors.otp_code1}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>

                            <Col lg={2}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="digit2-input"
                                  className="visually-hidden"
                                >
                                  Dight 2
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center two-step"
                                  maxLength="1"
                                  data-value="2"
                                  id="digit2-input"
                                  name="otp_code2"
                                  onChange={otpVerification.handleChange}
                                  onBlur={otpVerification.handleBlur}
                                  value={otpVerification.values.otp_code2 || ""}
                                  invalid={
                                    otpVerification.touched.otp_code2 &&
                                    otpVerification.errors.otp_code2
                                      ? true
                                      : false
                                  }
                                />
                                {otpVerification.touched.otp_code2 &&
                                otpVerification.errors.otp_code3 ? (
                                  <FormFeedback type="invalid">
                                    {otpVerification.errors.otp_code2}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>

                            <Col lg={2}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="digit3-input"
                                  className="visually-hidden"
                                >
                                  Digit 3
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center two-step"
                                  maxLength="1"
                                  data-value="3"
                                  id="digit3-input"
                                  name="otp_code3"
                                  onChange={otpVerification.handleChange}
                                  onBlur={otpVerification.handleBlur}
                                  value={otpVerification.values.otp_code3 || ""}
                                  invalid={
                                    otpVerification.touched.otp_code3 &&
                                    otpVerification.errors.otp_code3
                                      ? true
                                      : false
                                  }
                                />
                                {otpVerification.touched.otp_code3 &&
                                otpVerification.errors.otp_code3 ? (
                                  <FormFeedback type="invalid">
                                    {otpVerification.errors.otp_code3}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>

                            <Col lg={2}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="digit4-input"
                                  className="visually-hidden"
                                >
                                  Dight 4
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center two-step"
                                  maxLength="1"
                                  data-value="4"
                                  id="digit4-input"
                                  name="otp_code4"
                                  onChange={otpVerification.handleChange}
                                  onBlur={otpVerification.handleBlur}
                                  value={otpVerification.values.otp_code4 || ""}
                                  invalid={
                                    otpVerification.touched.otp_code4 &&
                                    otpVerification.errors.otp_code4
                                      ? true
                                      : false
                                  }
                                />
                                {otpVerification.touched.otp_code4 &&
                                otpVerification.errors.otp_code4 ? (
                                  <FormFeedback type="invalid">
                                    {otpVerification.errors.otp_code4}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={2}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="digit4-input"
                                  className="visually-hidden"
                                >
                                  Dight 5
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center two-step"
                                  maxLength="1"
                                  data-value="5"
                                  id="digit5-input"
                                  name="otp_code5"
                                  onChange={otpVerification.handleChange}
                                  onBlur={otpVerification.handleBlur}
                                  value={otpVerification.values.otp_code5 || ""}
                                  invalid={
                                    otpVerification.touched.otp_code5 &&
                                    otpVerification.errors.otp_code5
                                      ? true
                                      : false
                                  }
                                />
                                {otpVerification.touched.otp_code5 &&
                                otpVerification.errors.otp_code5 ? (
                                  <FormFeedback type="invalid">
                                    {otpVerification.errors.otp_code5}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={2}>
                              <div className="mb-3">
                                <Label
                                  htmlFor="digit6-input"
                                  className="visually-hidden"
                                >
                                  Dight 6
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control form-control-lg text-center two-step"
                                  maxLength="1"
                                  data-value="6"
                                  id="digit6-input"
                                  name="otp_code6"
                                  onChange={otpVerification.handleChange}
                                  onBlur={otpVerification.handleBlur}
                                  value={otpVerification.values.otp_code6 || ""}
                                  invalid={
                                    otpVerification.touched.otp_code6 &&
                                    otpVerification.errors.otp_code6
                                      ? true
                                      : false
                                  }
                                />
                                {otpVerification.touched.otp_code6 &&
                                otpVerification.errors.otp_code6 ? (
                                  <FormFeedback type="invalid">
                                    {otpVerification.errors.otp_code6}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          </Row>

                          <div className="mt-4">
                            <button
                              className="btn btn-primary w-md "
                              type="submit"
                            >
                              Confirm OTP
                            </button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                {/* <p>
                  Did&apos;t receive a code ?
                  <a href="#" className="fw-medium text-primary">
                    Resend
                  </a>
                </p> */}
                <p>
                  © {new Date().getFullYear()} Milkmor. Crafted with
                  <i className="mdi mdi-heart text-danger"></i> TechAstha
                </p>
              </div>
            </Col>
          </Row>

          {/*
          /////////////////////////////// Change Password */}

          {/* <div className="home-btn d-none d-sm-block">
            <Link to="/" className="text-dark">
              <i className="bx bx-home h2" />
            </Link>
          </div>
          <div className="account-pages my-5 pt-sm-5">
            <Container>
              <Row className="justify-content-center">
                <Col md={8} lg={6} xl={5}>
                  <Card className="overflow-hidden">
                    <div className="bg-primary bg-soft">
                      <Row>
                        <Col xs={7}>
                          <div className="text-primary p-4">
                            <h5 className="text-primary">Welcome Back !</h5>
                            <p>
                              Password must have contain minimum{" "}
                              <b className="pe-1">6 charectors</b>
                              with special charector number small letter and
                              capital letter
                            </p>
                          </div>
                        </Col>
                        <Col className="col-5 align-self-end">
                          <img src={profile} alt="" className="img-fluid" />
                        </Col>
                      </Row>
                    </div>
                    <CardBody className="pt-0">
                      <div>
                        <Link to="/" className="logo-light-element">
                          <div className="avatar-md profile-user-wid mb-4">
                            <span className="avatar-title rounded-circle bg-light">
                              <img
                                src={logo}
                                alt=""
                                className="rounded-circle"
                                height="34"
                              />
                            </span>
                          </div>
                        </Link>
                      </div>
                      <Form
                        onSubmit={chanvePasswordValidation.handleSubmit}
                        // onSubmit={handleLoginUser}
                      >
                        <div className="p-2">
                          {error ? <Alert color="danger">{error}</Alert> : null}

                          <div className="mb-3">
                            <Label className="form-label">New Password</Label>
                            <Input
                              name="new_password"
                              className="form-control"
                              placeholder="Enter New Password"
                              type="password"
                              onChange={chanvePasswordValidation.handleChange}
                              onBlur={chanvePasswordValidation.handleBlur}
                              value={
                                chanvePasswordValidation.values.new_password ||
                                ""
                              }
                              invalid={
                                chanvePasswordValidation.touched.new_password &&
                                chanvePasswordValidation.errors.new_password
                                  ? true
                                  : false
                              }
                            />
                            {chanvePasswordValidation.touched.new_password &&
                            chanvePasswordValidation.errors.new_password ? (
                              <FormFeedback type="invalid">
                                {chanvePasswordValidation.errors.new_password}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <Label className="form-label">
                              Confirm New Password
                            </Label>
                            <Input
                              name="re_new_password"
                              value={
                                chanvePasswordValidation.values
                                  .re_new_password || ""
                              }
                              type="password"
                              placeholder="Enter Confirm New Password"
                              onChange={chanvePasswordValidation.handleChange}
                              onBlur={chanvePasswordValidation.handleBlur}
                              invalid={
                                chanvePasswordValidation.touched
                                  .re_new_password &&
                                chanvePasswordValidation.errors.re_new_password
                                  ? true
                                  : false
                              }
                            />
                            {chanvePasswordValidation.touched.re_new_password &&
                            chanvePasswordValidation.errors.re_new_password ? (
                              <FormFeedback type="invalid">
                                {
                                  chanvePasswordValidation.errors
                                    .re_new_password
                                }
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mt-3 d-grid">
                            <button
                              className="btn btn-primary btn-block"
                              type="submit"
                            >
                              Change Password
                            </button>
                          </div>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                  <div className="mt-5 text-center">
                    <p>
                      © {new Date().getFullYear()} Skote. Crafted with
                      <i className="mdi mdi-heart text-danger" /> by Themesbrand
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div> */}

          {/* /////////////////////////////// Change Password */}
        </Container>
      </div>
    </React.Fragment>
  );
};
export default ForgetPasswordOTP;
