import React, { useEffect, useRef, useState } from "react";
import milkmorlogoecommerce from "../../../assets/images/milkmorlogoecommerce.png";
import milkmorblue from "../../../assets/images/brands/milkmorblue.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Card} from "reactstrap";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

import OTPInput from "otp-input-react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";

import {

  API_CUSTOMER_LOGIN_SUBMIT,
  API_CUSTOMER_FORGOT_PASSWORD_OTP,
  API_CUSTOMER_FORGOT_PASSWORD_OTP_VERIFICATION,
  API_CUSTOMER_FORGOT_PASSWORD_FINAL_SUBMIT,
} from "customhooks/All_Api/Apis";

const LoginPage = () => {
  const [loginContactNumber, setLoginContactNumber] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginCaptcha, setLoginCaptcha] = useState("");
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
  const [forgotPasswordNumber, setForgotPasswordNumber] = useState("");
  const [forgotPasswordOtpRequested, setForgotPasswordOtpRequested] =
    useState(false);
  const [forgotOtpSubmitted, setForgotOtpSubmitted] = useState(false);
  // const [newPasswordSubmitted, setNewPasswordSubmitted] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(true);
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState("");
  const [forgotPasswordNewPassword, setForgotPasswordNewPassword] =
    useState("");
  const [forgotPasswordReenterPassword, setForgotPasswordReenterPassword] =
    useState("");
  const navigate = useNavigate();

  const recaptchaRef = useRef(null);

  const SITE_KEY = "6LfnnuEUAAAAAOOLhvKxcw4chkdGRB_GdgV1tuaL";

  const onLoginSubmit = async (e) => {
    e.preventDefault();

    let loginSubmitData;

    loginSubmitData = {
      contact_no: loginContactNumber,
      password: loginPassword,
      captcha: loginCaptcha !== "" ? "True" : "False",
    };

    try {
      const response = await axios.post(
        API_CUSTOMER_LOGIN_SUBMIT,
        loginSubmitData
      );
      if (response.status === 200) {
        localStorage.setItem(
          "EcommerceTokenData",
          JSON.stringify({
            userId: response.data.data.customer_id,
            token: response.data.data.token,
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            trail_used: response.data.data.trial_used,
          })
        );
        navigate("/products-home");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Login failed. Please Check the Credentials", {
            autoClose: 3000,
            position: "top-center",
            closeOnClick: true,
            draggable: true,
            theme: "light",
          });
        }
      }
    }
  };

  const onForgotPasswordOtpSubmit = async (e) => {
    e.preventDefault();
    const forgotPasswordOtpData = {
      contact_no: forgotPasswordNumber,
    };
    try {
      const response = await axios.post(
        API_CUSTOMER_FORGOT_PASSWORD_OTP,
        forgotPasswordOtpData
      );
      if (response.status === 200) {
        setForgotPasswordOtpRequested(true);
        setForgotPasswordClicked(false);
        setShowLoginPage(false);
        toast.success("OTP Sent. Please Enter OTP.", {
          autoClose: 3000,
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Bad request. Please check your Contact Number.", {
            autoClose: 3000,
            position: "top-center",
            closeOnClick: true,
            draggable: true,
            theme: "light",
          });
        }
      }
    }
  };

  const onForgotPasswordOtpModalSubmit = async (e) => {
    e.preventDefault();
    const forgotPasswordOtpVerificationDetails = {
      contact_no: forgotPasswordNumber,
      otp: forgotPasswordOtp,
    };
    try {
      const response = await axios.post(
        API_CUSTOMER_FORGOT_PASSWORD_OTP_VERIFICATION,
        forgotPasswordOtpVerificationDetails
      );
      if (response.status === 200) {
        setForgotOtpSubmitted(true);
        setForgotPasswordOtpRequested(false);
        setShowLoginPage(false);
        toast.success("OTP Verified. Please Set New Password.", {
          autoClose: 3000,
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Verification failed. Please check your OTP.", {
            autoClose: 3000,
            position: "top-center",
            closeOnClick: true,
            draggable: true,
            theme: "light",
          });
        }
      }
    }
  };

  const onForgotPasswordFinalSubmit = async (e) => {
    e.preventDefault();
    const fogotPasswordFinalSubmit = {
      contact_no: forgotPasswordNumber,
      new_password: forgotPasswordNewPassword,
      confirm_new_password: forgotPasswordReenterPassword,
      otp: forgotPasswordOtp,
    };
    try {
      const response = await axios.post(
        API_CUSTOMER_FORGOT_PASSWORD_FINAL_SUBMIT,
        fogotPasswordFinalSubmit
      );
      if (response.status === 200) {
        setForgotOtpSubmitted(false);
        setShowLoginPage(true);
        toast.success("Password Reset Successful.", {
          autoClose: 3000,
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Password Reset Failed", {
            autoClose: 3000,
            position: "top-center",
            closeOnClick: true,
            draggable: true,
            theme: "light",
          });
        }
      }
    }
  };

  return (
    <div className="customer-login-container">
      {showLoginPage == true && (
        <Card
          className={
            forgotPasswordClicked == true ||
            forgotPasswordOtpRequested == true ||
            forgotOtpSubmitted == true
              ? "d-none"
              : "p-3"
          }
        >
          <div className="text-center">
            <img src={milkmorblue} alt="Logo" className="logo-svg" />
          </div>
          <div>
            <form onSubmit={onLoginSubmit}>
              <input
                type="text"
                className="login-register-input-styles mt-4"
                placeholder="Contact Number"
                onChange={(e) => setLoginContactNumber(e.target.value)}
                required
              />

              <div className="d-flex flex-column w-100">
                <input
                  type="password"
                  className="login-register-input-styles mt-4 "
                  placeholder="Password"
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <p
                  className="m-2"
                  onClick={() => {
                    setForgotPasswordClicked(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Forgot Password?
                </p>
              </div>

              <div className="d-flex align-self-start">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={SITE_KEY}
                  onChange={(token) => {
                    setLoginCaptcha(token);
                  }}
                />
              </div>
              <Link to="/customer-register">
                <div className="w-100 d-flex flex-row align-items-center justify-content-around">
                  <p
                    className="m-3 h6"
                    style={{
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    <u>Create Account?</u>
                  </p>
                </div>
              </Link>
              <div className="text-center">
                <button className="authentication-button" type="submit">
                  SIGN IN
                </button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {forgotPasswordClicked == true && (
        <Card className="p-3">
          <div className="text-center">
            <img src={milkmorblue} alt="Logo" className="logo-svg" />
          </div>
          <form onSubmit={onForgotPasswordOtpSubmit}>
            <div className="d-flex w-100">
              <input
                type="text"
                className="login-register-input-styles mt-4 "
                placeholder="Enter Contact No."
                onChange={(e) => setForgotPasswordNumber(e.target.value)}
                required
              />
              <button
                type="submit"
                className="mt-4 text-light h5"
                style={{
                  backgroundColor: "#3B66A0",
                  whiteSpace: "nowrap",
                  height: "44px",
                  border: "none",
                }}
              >
                GENERATE OTP
              </button>
            </div>
          </form>
        </Card>
      )}
      {forgotPasswordOtpRequested == true && (
        <Card className="p-5">
          <div>
            <div className="text-center">
              <img src={milkmorblue} alt="Logo" className="logo-svg mb-3" />
            </div>
            <form onSubmit={onForgotPasswordOtpModalSubmit}>
              <OTPInput
                value={forgotPasswordOtp}
                onChange={setForgotPasswordOtp}
                autoFocus
                OTPLength={6}
                otpType="number"
                disabled={false}
                secure
                required
              />
              <div className="text-center mt-3">
                <p style={{ textDecoration: "underline" }}>Resend OTP</p>
              </div>
              <div className="text-center">
                <button className="authentication-button" type="submit">
                  VERIFY OTP
                </button>
              </div>
            </form>
          </div>
        </Card>
      )}
      {forgotOtpSubmitted == true && (
        <Card className="p-3">
          <div>
            <div className="text-center">
              <img src={milkmorblue} alt="Logo" className="logo-svg mb-3" />
            </div>
            <form onSubmit={onForgotPasswordFinalSubmit}>
              <div>
                <input
                  type="password"
                  className="register-input-styles mt-3"
                  placeholder="New Password"
                  onChange={(e) => setForgotPasswordNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="register-input-styles mt-3"
                  placeholder="Re-Enter New Password"
                  onChange={(e) =>
                    setForgotPasswordReenterPassword(e.target.value)
                  }
                  required
                />
              </div>
              <div className="text-center mt-3">
                <button className="authentication-button" type="submit">
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LoginPage;
