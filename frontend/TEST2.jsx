import PropTypes from "prop-types";
import React from "react";

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// actions
import { loginUser, socialLogin } from "../../store/actions";

// import images
import profile from "assets/images/profile-img.png";
import logo from "assets/images/logo.svg";

//Import config
import { facebook, google } from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import { API_FORGOT_PASSWORD } from "customhooks/All_Api/Apis";

const ChangePassword = () => {
  const navigate = useNavigate();
  //meta title
  document.title = "Login | Skote - React Admin & Dashboard Template";

  // const mobile_no = 9423743054;
  const chanvePasswordValidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      new_password: "" || "",
      re_new_password: "" || "",
    },
    validationSchema: Yup.object({
      new_password: Yup.string()
        .required("Please confirm your password")

        .min(6, "Password must be min 6 characters long")
        .max(16, "Password must be max 16 characters long")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .matches(/[^\w]/, "Password requires a symbol"),

      re_new_password: Yup.string()
        .required("Please confirm your password")
        .min(6, "Password must be min 6 characters long")
        .max(16, "Password must be max 16 characters long")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .matches(/[^\w]/, "Password requires a symbol")
        .oneOf([Yup.ref("new_password")], "Passwords do not match")
        .required("Please Confirm Password"),
    }),

    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(`${API_FORGOT_PASSWORD}`, {
          ...values,
          mobile_no: mobile_no,
        });
        console.log(data);
        toast.success(`Password Reset successfully`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/admin-login");
      } catch (error) {
        toast.error(`Something went wrong`, {
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

  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
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
                          with special charector number small letter and capital
                          letter
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
                            chanvePasswordValidation.values.new_password || ""
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
                            chanvePasswordValidation.values.re_new_password ||
                            ""
                          }
                          type="password"
                          placeholder="Enter Confirm New Password"
                          onChange={chanvePasswordValidation.handleChange}
                          onBlur={chanvePasswordValidation.handleBlur}
                          invalid={
                            chanvePasswordValidation.touched.re_new_password &&
                            chanvePasswordValidation.errors.re_new_password
                              ? true
                              : false
                          }
                        />
                        {chanvePasswordValidation.touched.re_new_password &&
                        chanvePasswordValidation.errors.re_new_password ? (
                          <FormFeedback type="invalid">
                            {chanvePasswordValidation.errors.re_new_password}
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
      </div>
    </React.Fragment>
  );
};

export default ChangePassword;
