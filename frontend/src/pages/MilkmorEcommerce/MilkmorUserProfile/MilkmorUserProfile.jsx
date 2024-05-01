import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_CITY_GET_POST,
  API_PINCODE_GET_POST,
  API_AREA_GET_POST,
  API_BASE_URL,
  CUSTOMER_ADDRESS_UPDATE_ECOMMERCE,
  API_CUSTOMERS_GET_BY_ID,
  API_CUSTOMERS_UPDATE,
  UPDATE_ECOMMERCE_MOBILE_NUMBER,
  VERIFY_UPDATE_OTP,
} from "customhooks/All_Api/Apis";
import "./MilkmorUserProfile.css";
import { toast } from "react-toastify";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
// import build from "otp-input-react";

const MilkmorUserProfile = () => {
  const config = GetAuthToken();
  const ecommereceConfig = GetEcommereceAuthToken();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [child, setChild] = useState("");
  const [adult, setAdult] = useState("");
  const [seniorCitizen, setSeniorCitizen] = useState("");
  const [dateOfBirth, setDataOfBirth] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [area, setArea] = useState("");
  const [flat, setFlat] = useState("");
  const [building, setBuilding] = useState("");
  const [landmark, setLandMark] = useState("");
  const [newContact, setNewContact] = useState("");
  const [otp, setOtp] = useState("");
  const [cityData, setCityData] = useState({});
  const [pinCodeData, setPinCodeData] = useState();
  const [areaData, setAreaData] = useState();
  const [selectedCityData, setSelectedCityData] = useState();
  const [selectedPincodeData, setSelectedPincodeData] = useState();
  const [selectedAreaData, setSelectedAreaData] = useState();
  const [primaryAddressData, setPrimaryAddressData] = useState();
  const [primaryAddressId, setPrimaryAddressId] = useState();
  const [personalDetailsEdit, setPersonalDetailsEdit] = useState(false)
  const [addressEdit, setAddressEdit] = useState(false)
  const [passwordEdit, setPasswordEdit] = useState(false)

  const userDetailsData = JSON.parse(
    localStorage.getItem("EcommerceTokenData")
  );
  const userId = userDetailsData.userId;

  const getAddressDetails = async () => {
    try {
      const { data } = await axios.get(
        CUSTOMER_ADDRESS_UPDATE_ECOMMERCE,
        ecommereceConfig
      );

        setPrimaryAddressData(data&&data);
        setSelectedCityData(data&&data.city);
        setSelectedAreaData(data&&data.area_id);
        setSelectedPincodeData(data&&data.pincode_id);
        setFlat(data&&data.house_no);
        setBuilding(data&&data.society);
        setLandMark(data&&data.landmark);

    } catch (error) {
      console.log(error);
    }
  };

  const userDeatils = async () => {
    try {
      const { data } = await axios.get(
        `${API_CUSTOMERS_GET_BY_ID}${userId}/`
      );
      setFirstName(data.data.customer.first_name || "");
      setLastName(data.data.customer.last_name || "");
      setEmail(data.data.customer.email || "");
      setContactNumber(data.data.customer.contact_no || "");
      setChild(data.data.customer.child || "");
      setAdult(data.data.customer.adult || "");
      setSeniorCitizen(data.data.customer.senior_citizen || "");
      setDataOfBirth(data.data.customer.birth_date || "");
      setAnniversaryDate(data.data.customer.anniversary_date || "");
      setCity(data.data.customer.cityId || "");
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdatePersonalDetails = async () => {
    try {
      let updatedValues = {
        first_name: firstName,
        last_name: lastName,
        child: child,
        adult: adult,
        senior_citizen: seniorCitizen,
        contact_no: contactNo,
        birth_date: dateOfBirth,
        anniversary_date: anniversaryDate,
        email: email,
      };

      if (currentPassword.length > 1) {
        updatedValues = {
          ...updatedValues,
          old_password: currentPassword,
          password: newPassword,
          confirm_password: reEnterPassword,
        };
      }

      const { data } = await axios.post(
        `${API_CUSTOMERS_UPDATE}${userId}/`,
        updatedValues,
        ecommereceConfig
      );
      toast.success("Personal Details Updated", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error("Personal Details Were Not Updated", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const onUpdateUserAddressClick = async () => {
    const userAddressData = {
      city: selectedCityData,
      pincode: selectedPincodeData,
      area: selectedAreaData,
      house_no: flat,
      society: building,
      landmark: landmark,
      customer: userId,
    };
    try {
      const { data } = await axios.put(
        CUSTOMER_ADDRESS_UPDATE_ECOMMERCE,
        userAddressData,
        ecommereceConfig
      );
      toast.success("Address Updated Successfully.", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
      getAddressDetails();
    } catch (error) {
      toast.error(error, {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const getCityData = async () => {
    try {
      const { data } = await axios.get(API_CITY_GET_POST, ecommereceConfig);
      setCityData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPincodeApi = async () => {
    try {
      const { data } = await axios.get(API_PINCODE_GET_POST, ecommereceConfig);
      setPinCodeData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAreaApi = async () => {
    try {
      const { data } = await axios.get(API_AREA_GET_POST, ecommereceConfig);
      setAreaData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendChangeNumberOtp = async () => {
    try {
      const number = {
        contact_no: newContact,
      };
      const { data } = await axios.post(
        `${UPDATE_ECOMMERCE_MOBILE_NUMBER}${userId}/`,
        number
      );
      toast.success("OTP Sent. Please Enter OTP.", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const changeNumberVerifyOtp = async () => {
    try {
      const verifcationDetails = {
        contact_no: newContact,
        otp,
      };
      const { data } = await axios.post(
        VERIFY_UPDATE_OTP,
        verifcationDetails
      );
      userDeatils();
      toast.success("Mobile Number Changed Successfully.", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  let dropdownPincodeValues =
    pinCodeData &&
    pinCodeData.map((eachPincode) =>
      eachPincode.pincodes.filter(
        (eachItem) => eachItem.city_id == selectedCityData
      )
    );

  let finalPincodeDropDownValues =
    dropdownPincodeValues &&
    dropdownPincodeValues.filter((eachItem) => eachItem.length);

  let dropdownAreaValues =
    areaData &&
    areaData.map((eachArea) =>
      eachArea.areas.filter((eachItem) => eachItem.id == selectedPincodeData)
    );

  let finalAreaDropDownValues =
    dropdownAreaValues &&
    dropdownAreaValues.filter((eachItem) => eachItem.length);

  useEffect(() => {
    getAddressDetails();
    userDeatils();
    getCityData();
    getPincodeApi();
    getAreaApi();
  }, []);

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
        <h1 className="text-light">MY PROFILE</h1>
        <Link to="/products-shop">
          <h6 className="text-light" style={{ cursor: "pointer" }}>
            <i
              className="fas fa-arrow-left me-2"
              style={{ fontSize: "13px" }}
            ></i>
            Back
          </h6>
        </Link>
      </div>
      <div className="profile-content-container">
        <div className="container">
          <div className="profile-content-layout">
            <div className="left-component">
              <CommonProfileComponent />
            </div>
            <div className="right-component">
              <h3>
                <b>My Profile</b>
              </h3>
              <hr className="horizontal-rule" />
              <div className="d-flex justify-content-between">
              <h6 style={{ color: "#000000" }}>
                <b>Personal Details</b>
              </h6>
              <button className="btn btn-sm btn-primary" onClick={() => setPersonalDetailsEdit(!personalDetailsEdit)}>
              <i className="fas fa-edit" ></i>
              </button>
              </div>
              <hr className="horizontal-rule" />
              <div className="input-fields-container">
                <div className="input-fields">
                  <label htmlFor="firstName">First Name*</label>
                  <input
                    type="text"
                    className="field"
                    id="firstName"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
                <div className="input-fields">
                  <label htmlFor="lastName">Last Name*</label>
                  <input
                    type="text"
                    className="field"
                    id="lastName"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
              </div>
              <div className="input-fields-container">
                <div className="input-fields">
                  <label htmlFor="contactNo">Contact No*</label>
                  <input
                    type="text"
                    className="field"
                    id="contactNo"
                    placeholder="Enter Contact"
                    value={contactNo}
                    readOnly
                    disabled={!personalDetailsEdit}
                  />
                </div>
                <div className="input-fields">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="text"
                    className="field"
                    id="email"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
              </div>
              <div className="input-fields-container">
                <div className="input-fields">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    className="field"
                    id="dob"
                    placeholder="Enter Date of Birth"
                    value={dateOfBirth}
                    onChange={(e) => setDataOfBirth(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
                <div className="input-fields">
                  <label htmlFor="anniversary">Anniversary Date</label>
                  <input
                    type="date"
                    className="field"
                    id="anniversary"
                    placeholder="Enter Anniversary"
                    value={anniversaryDate}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
              </div>
              <hr className="horizontal-rule" />
              <h6 style={{ color: "#000000" }}>
                <b>Family Members</b>
              </h6>
              <hr className="horizontal-rule" />
              <div className="family-fields-container">
                <div className="family-input-fields">
                  <label>Child</label>
                  <input
                    className="family-field"
                    type="number"
                    min="0"
                    value={child}
                    onChange={(e) => setChild(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
                <div className="family-input-fields">
                  <label>Adult</label>
                  <input
                    className="family-field"
                    type="number"
                    min="0"
                    value={adult}
                    onChange={(e) => setAdult(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
                <div className="family-input-fields">
                  <label>Senior Citizen</label>
                  <input
                    className="family-field"
                    type="number"
                    min="0"
                    value={seniorCitizen}
                    onChange={(e) => setSeniorCitizen(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
              </div>
              <hr className="horizontal-rule" />
              <h6 style={{ color: "#000000" }}>
                <b>Change Password</b>
              </h6>
              <hr className="horizontal-rule" />
              <div className="family-fields-container">
                <div className="family-input-fields">
                  <label>Current Password*</label>
                  <input
                    className="family-field"
                    type="password"
                    placeholder="Enter Current Password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
                <div className="family-input-fields">
                  <label>New Password*</label>
                  <input
                    className="family-field"
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
                <div className="family-input-fields">
                  <label>Re-Enter Password*</label>
                  <input
                    className="family-field"
                    type="password"
                    placeholder="Re-Enter Password"
                    onChange={(e) => setReEnterPassword(e.target.value)}
                    disabled={!personalDetailsEdit}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="save-button"
                  onClick={onUpdatePersonalDetails}
                  disabled={!personalDetailsEdit}
                >
                  SAVE
                </button>
              </div>
              <hr className="horizontal-rule" />
              <div className="d-flex justify-content-between">
              <h6 style={{ color: "#000000" }}>
                <b>Address Details</b>
              </h6>
              <button className="btn btn-sm btn-primary" onClick={() => setAddressEdit(!addressEdit)}>
              <i className="fas fa-edit" ></i>
              </button>
              </div>
              <hr className="horizontal-rule" />
              <div className="input-fields-container">
                <div className="input-fields">
                  <label htmlFor="dob">City</label>
                  <select
                    className="field"
                    onChange={(e) => setSelectedCityData(e.target.value)}
                    disabled={!addressEdit}
                  >
                    <option hidden={true}>
                      {primaryAddressData && primaryAddressData.city_name}
                    </option>
                    {cityData.length > 0 &&
                      cityData.map((city) =>
                        city.is_active ? (
                          <option value={city.id} key={city.id}>
                            {city.city}
                          </option>
                        ) : null
                      )}
                  </select>
                </div>
                <div className="input-fields">
                  <label htmlFor="profilePincode">Pin Code</label>
                  <select
                    id="profilePincode"
                    className="field"
                    onChange={(e) => setSelectedPincodeData(e.target.value)}
                    disabled={!addressEdit}
                  >
                    <option hidden={true}>
                      {primaryAddressData && primaryAddressData.pincode}
                    </option>
                    {finalPincodeDropDownValues &&
                      finalPincodeDropDownValues.map((eachItem) =>
                        eachItem.map((pincode) =>
                          pincode.is_active == true ? (
                            <option key={pincode.id} value={pincode.id}>
                              {pincode.code}
                            </option>
                          ) : null
                        )
                      )}
                  </select>
                </div>
              </div>
              <div className="input-fields-container">
                <div className="input-fields">
                  <label htmlFor="profileArea">Area</label>
                  <select
                    className="field"
                    id="profileArea"
                    onChange={(e) => setSelectedAreaData(e.target.value)}
                    disabled={!addressEdit}
                  >
                    <option hidden={true}>
                      {primaryAddressData && primaryAddressData.area}
                    </option>
                    {finalAreaDropDownValues &&
                      finalAreaDropDownValues.map((eachItem) =>
                        eachItem.map((Area, index) =>
                          Area.is_active == true ? (
                            <option key={index} value={Area.id}>
                              {Area.area}
                            </option>
                          ) : null
                        )
                      )}
                  </select>
                </div>
                <div className="input-fields">
                  <label htmlFor="flat">Flat / House.No </label>
                  <input
                    type="text"
                    className="field"
                    id="flat"
                    placeholder="Enter Flat"
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    disabled={!addressEdit}
                  />
                </div>
              </div>
              <div className="input-fields-container">
                <div className="input-fields">
                  <label htmlFor="building">Building / Society</label>
                  <input
                    type="text"
                    className="field"
                    id="building"
                    placeholder="Enter Building"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    disabled={!addressEdit}
                  />
                </div>
                <div className="input-fields">
                  <label htmlFor="landmark">Landmark</label>
                  <input
                    type="text"
                    className="field"
                    id="landmark"
                    placeholder="Enter Landmark"
                    value={landmark}
                    onChange={(e) => setLandMark(e.target.value)}
                    disabled={!addressEdit}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="save-button"
                  onClick={onUpdateUserAddressClick}
                  disabled={!addressEdit}
                >
                  SAVE
                </button>
              </div>
              <hr className="horizontal-rule" />
              <div className="d-flex justify-content-between">
              <h6 style={{ color: "#000000" }}>
                <b>Change Contact No.</b>
              </h6>
              <button className="btn btn-sm btn-primary" onClick={() => setPasswordEdit(!passwordEdit)}>
              <i className="fas fa-edit" ></i>
              </button>
              </div>
              <hr className="horizontal-rule" />

              <div className="input-fields-container">
                <div className="input-fields-number">
                  <label htmlFor="newContact">New Contact No.</label>
                  <input
                    type="text"
                    className="field"
                    id="newContact"
                    placeholder="Enter New Contact Number"
                    onChange={(e) => setNewContact(e.target.value)}
                    required
                    disabled={!passwordEdit}
                  />
                </div>
                <div className="input-fields-number">
                  <label htmlFor="verifyOtp">Verify OTP</label>
                  <input
                    type="text"
                    className="field"
                    id="verifyOtp"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={!passwordEdit}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end m-3">
                <div>
                  <button
                    className="save-button me-1"
                    onClick={sendChangeNumberOtp}
                    disabled={!passwordEdit}
                  >
                    SEND OTP
                  </button>
                </div>
                <button className="save-button" onClick={changeNumberVerifyOtp} disabled={!passwordEdit}>
                  VERIFY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default MilkmorUserProfile;
