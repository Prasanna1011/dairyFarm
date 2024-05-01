import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Card } from "reactstrap";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
// import OTPInput from "otp-input-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EcommerceAuthmiddleware from "routes/ecommerceRoutes";
import {
  API_CITY_GET_POST,
  API_CUSTOMER_SIGN_UP_OPT,
  API_CUSTOMER_SIGN_UP_OTP_SUBMIT,
  API_CITY_GET_BY_ID
} from "customhooks/All_Api/Apis";
import "./SignupPage.css"
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cityData, setcityData] = useState([]);
  const [selectedCity, setSlectedCity] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [child, setChild] = useState("");
  const [adult, setAdult] = useState("");
  const [seniorCitizen, setSeniorCitizen] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupCaptcha, setSignupCaptcha] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [singupOtp, setSingupOtp] = useState("");
  const [signupSeconds, setSignUpSeconds] = useState(30);
  const [showInitialSignUpPage, setShowInitialSignUpPage] = useState(true);
  const config = GetAuthToken();
  const ecommerceConfig = GetEcommereceAuthToken()

  const recaptchaRef = useRef(null);

  const SITE_KEY = "6LfnnuEUAAAAAOOLhvKxcw4chkdGRB_GdgV1tuaL";

  const handleGetCity = async () => {
    try {
      const { data } = await axios.get(API_CITY_GET_BY_ID, ecommerceConfig);
      setcityData(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onSignUpSubmit = async (e) => {
    e.preventDefault();
    if (signupCaptcha !== undefined) {
      const userData = {
        contact_no: contactNumber,
      };

      try {
        const response = await axios.post(API_CUSTOMER_SIGN_UP_OPT, userData);
        if (response.status === 200) {
          toast.success("OTP Sent", {
            autoClose: 3000,
            position: "top-center",
            closeOnClick: true,
            draggable: true,
            theme: "light",
          });
          setShowInitialSignUpPage(false);
        }
      } catch (error) {
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
    }
  };

  const onSignupOtpSubmit = async (e) => {
    e.preventDefault();
    const finalSignupSubmitData = {
      first_name: firstName,
      last_name: lastName,
      child: child,
      adult: adult,
      senior_citizen: seniorCitizen,
      password: password,
      confirm_password: confirmPassword,
      captcha: signupCaptcha !== "" ? "True" : "False",
      contact_no: contactNumber,
      otp: singupOtp,
      city_id: selectedCity,
      email: email,
    };
    try {
      const response = await axios.post(
        API_CUSTOMER_SIGN_UP_OTP_SUBMIT,
        finalSignupSubmitData
      );
      if (response.status === 200) {
        const loginPostRegister = {
          contact_no: contactNumber,
          password: password,
          captcha: signupCaptcha !== "" ? "True" : "False",
        };
        toast.success("Registration Successful", {
          autoClose: 3000,
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          theme: "light",
        });
        navigate("/customer-login");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("OTP Verification failed", {
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

  useEffect(() => {
    handleGetCity();
  }, []);

  return (
    <div className="customer-login-container">
      {showInitialSignUpPage == true && (
        <Card className="p-3 signup-card">
          <div>
            <form onSubmit={onSignUpSubmit}>
              <div className="register-input-styles-container mb-1 mt-1">
                <input
                  type="text"
                  className="register-input-styles-half me-1"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="register-input-styles-half ms-1"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <input
                type="text"
                className="register-input-styles mb-1 mt-1"
                placeholder="Contact Number*"
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />

              <input
                type="text"
                className="register-input-styles mb-1 mt-1"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="register-input-styles-container mb-1 mt-1">
                <input
                  type="password"
                  className="register-input-styles-half me-1"
                  placeholder="Password*"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="register-input-styles-half ms-1"
                  placeholder="Confirm Password*"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <select
                className="mb-1 mt-1 w-100 cityDropdown"
                onChange={(e) => setSlectedCity(e.target.value)}
                value={selectedCity}
                required
              >
                <option> --- Select a City ---</option>
                {cityData &&
                  cityData.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.city}
                    </option>
                  ))}
              </select>

              <div className="family-members-label">
                <p>Family Members : </p>
              </div>

              <div className="register-input-styles-container mb-1">
                <input
                  type="number"
                  className="register-input-styles-quater me-1"
                  placeholder="Child*"
                  onChange={(e) => setChild(e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="register-input-styles-quater ms-1"
                  placeholder="Adult*"
                  onChange={(e) => setAdult(e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="register-input-styles-quater ms-1"
                  placeholder="Senior Citizen*"
                  onChange={(e) => setSeniorCitizen(e.target.value)}
                  required
                />
              </div>
              <Link to={"/customer-login"}>
                <div className="w-100 d-flex flex-row align-items-center justify-content-start">
                  <p
                    className="mt-2 h6"
                    style={{
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    <u>Do you have an account?</u>
                  </p>
                </div>
              </Link>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={SITE_KEY}
                  onChange={(token) => {
                    setSignupCaptcha(token);
                  }}
                />
              </div>

              <div className="text-center">
                <button className="authentication-button" type="submit">
                  GENERATE OTP
                </button>
              </div>
            </form>
          </div>
        </Card>
      )}
      {showInitialSignUpPage == false && (
        <Card className="p-3">
          <div>
            <h4 className="text-center mt-3">
              Please enter OTP sent to your mobile number.
            </h4>
            <form onSubmit={onSignupOtpSubmit}>
              <input
                type="text"
                className="login-register-input-styles mt-3 mb-3"
                placeholder="Enter OTP"
                onChange={(e) => setSingupOtp(e.target.value)}
              />

              <div className="text-center">
                <button className="authentication-button" type="submit">
                  Verify
                </button>
              </div>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SignupPage;
