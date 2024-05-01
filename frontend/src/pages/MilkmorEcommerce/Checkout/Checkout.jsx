import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import "./Checkout.css";
import axios from "axios";
import Axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { useNavigate } from "react-router-dom";
import milkmorlogo from "../../../assets/images/brands/mikmor-1.png";
import {
  API_AREA_GET_BY_ID,
  API_BASE_URL,
  API_CITY_GET_BY_ID,
  API_CUSTOMERS_GET_BY_ID,
  API_PINCODE_GET_BY_ID,
  API_SUBSCRIPTION_OFFER_APPLY,
  CUSTOMER_ADDRESS_UPDATE_ECOMMERCE,
  GET_ECOMMERCE_CUSTOMER_ADDRESS,
  GET_ECOMMERCE_WALLET_DETAILS,
} from "customhooks/All_Api/Apis";

const Checkout = () => {
  const navigate = useNavigate();
  const config = GetAuthToken();
  const location = useLocation();
  const ecommereceConfig = GetEcommereceAuthToken();
  const { cartData, subtotal, tax_amount, total } = location?.state;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [addressData, setAddressData] = useState();
  const [addNewAddressButton, setAddNewAddressButton] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedFlatHouseNo, setSelectedFlatHouseNo] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedLandmark, setSelectedLandmark] = useState("");
  const [selectedRemark, setSelectedRemark] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [offerApplied, setOfferApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState();
  const [cartTotal, setCartTotal] = useState();
  const [finalPayableAfterDiscount, setFinalPayableAfterDiscount] = useState();
  const [showAddressFileds, setShowAddressFields] = useState(false);
  const [cityData, setcityData] = useState();
  const [initialPincodeData, setInitialPincodeData] = useState();
  const [initialAreaData, setInitialAreaData] = useState();
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("online");
  const [deliveryAppointmentTime, setDeliveryAppointmentTime] = useState("");
  const [walletBalance, setWalletBalance] = useState();
  const [useWalletAmount, setUseWalletAmount] = useState(false);
  const [primaryCity, setPrimaryCity] = useState();
  const [primaryPincode, setPrimaryPincode] = useState();
  const [primaryArea, setPrimaryArea] = useState();
  const [primaryHouse, setPrimaryHouse] = useState();
  const [primarySociety, setPrimarySociety] = useState();
  const [primaryLandmark, setPrimaryLandmark] = useState();
  const [primaryPincodeName, setPrimaryPincodeName] = useState();
  const [primaryCityName, setPrimaryCityName] = useState();
  const [primaryAreaName, setPrimaryAreaName] = useState();
  const [primaryAddressData, setPrimaryAddressData] = useState();
  const [selectedCityData, setSelectedCityData] = useState();
  const [selectedPincodeData, setSelectedPincodeData] = useState();
  const [selectedAreaData, setSelectedAreaData] = useState();
  const [flat, setFlat] = useState();
  const [building, setBuilding] = useState();
  const [landmark, setLandmark] = useState();

  console.log("primaryArea", primaryArea);
  console.log("primaryPincode", primaryPincode);
  console.log("primaryHouse", primaryHouse);
  console.log("primaryLandmark", primaryLandmark);
  console.log("primarySociety", primarySociety);

  console.log("initialPincodeData", initialPincodeData);

  const userDetailsData = JSON.parse(
    localStorage.getItem("EcommerceTokenData")
  );
  const userId = userDetailsData.userId;
  const token = userDetailsData.token;

  const userDeatils = async () => {
    const { data } = await axios.get(`${API_CUSTOMERS_GET_BY_ID}${userId}/`);
    setFirstName(data.data.customer.first_name);
    setLastName(data.data.customer.last_name);
    setContactNumber(data.data.customer.contact_no);
    setEmailId(data.data.customer.email);
    setAddressData(data.data.addresses);
  };

  const getCityData = async () => {
    const { data } = await axios.get(API_CITY_GET_BY_ID, ecommereceConfig);
    setcityData(data.data);
  };

  const getPincodeData = async () => {
    const { data } = await axios.get(API_PINCODE_GET_BY_ID, ecommereceConfig);
    setInitialPincodeData(data.data);
  };

  const getAreaData = async () => {
    const { data } = await axios.get(API_AREA_GET_BY_ID, ecommereceConfig);
    setInitialAreaData(data.data);
  };

  const getAddressDetails = async () => {
    try {
      const { data } = await axios.get(
        `${GET_ECOMMERCE_CUSTOMER_ADDRESS}${userId}/`
      );

      const primaryAddressData = data.data.find(
        (eachItem) => eachItem.is_primary_address === true
      );
      setPrimaryAddressData(primaryAddressData);

      if (primaryAddressData) {
        setPrimaryCity(primaryAddressData.city || "");
        setPrimaryPincode(primaryAddressData.pincode_id || "");
        setPrimaryArea(primaryAddressData.area_id || "");
        setPrimaryHouse(primaryAddressData.house_no || "");
        setPrimarySociety(primaryAddressData.society || "");
        setPrimaryLandmark(primaryAddressData.landmark || "");
        setPrimaryPincodeName(primaryAddressData.pincode || "");
        setPrimaryCityName(primaryAddressData.city_name || "");
        setPrimaryAreaName(primaryAddressData.area || "");
      }
    } catch (error) {
      return error;
    }
  };

  let dropdownPincodeValues =
    initialPincodeData &&
    initialPincodeData.map((eachPincode) =>
      eachPincode.pincodes.filter(
        (eachItem) => eachItem.city_id == selectedCityData
      )
    );

  let finalPincodeDropDownValues =
    dropdownPincodeValues &&
    dropdownPincodeValues.filter((eachItem) => eachItem.length);

  let dropdownAreaValues =
    initialAreaData &&
    initialAreaData.map((eachArea) =>
      eachArea.areas.filter(
        (eachItem) => eachItem.pincode_id == selectedPincodeData
      )
    );

  let finalAreaDropDownValues =
    dropdownAreaValues &&
    dropdownAreaValues.filter((eachItem) => eachItem.length);

  const onApplyCouponButton = async () => {
    const couponData = {
      coupon_code: couponCode,
      customer_id: userId,
      order_type: "Subscription Orders",
      amount: total,
    };
    try {
      const { data } = await axios.post(
        API_SUBSCRIPTION_OFFER_APPLY,
        couponData,
        ecommereceConfig
      );
      setOfferApplied(!offerApplied);
      console.log("Coupon Data", data);
      setDiscountAmount(data.discount);
      setCartTotal(data.pb_discount);
      setFinalPayableAfterDiscount(data.pa_discount);
    } catch (error) {
      console.log(error);
    }
  };

  const onRemoveCouponButton = () => {
    setOfferApplied(!offerApplied);
    setDiscountAmount("");
    setCartTotal("");
    setFinalPayableAfterDiscount("");
    setCouponCode("");
  };

  const getWalletDetails = async () => {
    try {
      const { data } = await axios.get(
        `${GET_ECOMMERCE_WALLET_DETAILS}${userId}/`,
        ecommereceConfig
      );
      setWalletBalance(data.available_balance);
    } catch (error) {
      console.log(error);
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
      getAddressDetails();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    userDeatils();
    getCityData();
    getPincodeData();
    getAreaData();
    getWalletDetails();
    getAddressDetails();
  }, []);

  let primaryAddressDetails =
    addressData &&
    addressData.filter((eachAddress) => eachAddress.primary_address === true);

  // this function will handel payment when user submit his/her money
  // and it will confim if payment is successfull or not
  const handlePaymentSuccess = async (response) => {
    try {
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", JSON.stringify(response));

      await Axios({
        url: `${API_BASE_URL}/api/razorpay-paymenthandler/`,
        method: "POST",
        data: bodyData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
      })
        .then((res) => {
          console.log("Subscription Order Placed");
          console.log("resulttt", res);
          navigate("/order-placed-successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(console.error());
    }
  };

  // this will load a script tag which will open up Razorpay payment card to make //transactions
  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const onPlaceSubscriptionOrderClick = async () => {
    try {
      const res = await loadScript();

      let bodyData = new FormData();

      // we will pass the amount and product name to the backend using form data

      if (offerApplied === true) {
        bodyData.append("amount", finalPayableAfterDiscount);
      } else {
        bodyData.append("amount", total);
      }
      bodyData.append("coupon", couponCode);
      bodyData.append("city", primaryCity);
      bodyData.append("pincode", primaryPincode);
      bodyData.append("area", primaryArea);
      bodyData.append("house_no", primaryHouse);
      bodyData.append("society", primarySociety);
      bodyData.append("landmark", primaryLandmark);
      bodyData.append("remarks", selectedRemark);
      if (useWalletAmount == true) {
        bodyData.append("use_wallet", true);
      } else {
        bodyData.append("use_wallet", false);
      }

      const data = await Axios({
        url: `${API_BASE_URL}/api/razorpay-create-order/`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        data: bodyData,
      }).then((res) => {
        if (res.status == 201) {
          navigate("/order-placed-successfully");
        }
        return res;
      });

      // in data we will receive an object from the backend with the information about the payment
      //that has been made by the user

      var options = {
        key_id: process.env.REACT_APP_PUBLIC_KEY, // in react your environment variable must start with REACT_APP_
        key_secret: process.env.REACT_APP_SECRET_KEY,
        amount: data.data.razorpay_order.amount,
        currency: "INR",
        name: "Milkmor",
        description: "Payment For Milkmor",
        image: milkmorlogo,
        order_id: data.data.razorpay_order.id,
        handler: function (response) {
          console.log(response);
          // we will handle success by calling handlePaymentSuccess method and
          // will pass the response that we've got from razorpay
          handlePaymentSuccess(response);
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: emailId,
          contact: contactNumber,
        },
        notes: {
          address: "Milkmor Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };

  const onPlaceSubscriptionOrderClickCash = async () => {
    try {
      let bodyData = new FormData();

      // we will pass the amount and product name to the backend using form data

      if (offerApplied === true) {
        bodyData.append("amount", finalPayableAfterDiscount);
      } else {
        bodyData.append("amount", total);
      }
      bodyData.append("coupon_code", couponCode);
      bodyData.append("city", primaryCity);
      bodyData.append("pincode", primaryPincode);
      bodyData.append("area", primaryArea);
      bodyData.append("house_no", primaryHouse);
      bodyData.append("society", primarySociety);
      bodyData.append("landmark", primaryLandmark);
      bodyData.append("remarks", selectedRemark);
      bodyData.append("appointment_time", deliveryAppointmentTime);
      const data = await Axios({
        url: `${API_BASE_URL}/api/order/sub-cart-order-offline-create/`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        data: bodyData,
      }).then((res) => {
        return res;
      });
      navigate("/order-placed-successfully");
    } catch (error) {
      console.log("Error");
    }
  };

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="cart-banner-container">
        <h1 className="text-light">CHECKOUT</h1>
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
      <div style={{ backgroundColor: "#fffff" }}>
        <div className="container p-3">
          <div className="proceed-to-checkout-content-container">
            <div className="address-container">
              <h4 style={{ color: "#2C2C2C", fontWeight: 600 }}>
                Billing Details
              </h4>
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
                    readOnly
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
                    readOnly
                  />
                </div>
              </div>
              <div className="input-fields-container">
                <div className="input-fields">
                  <label htmlFor="contactNumber">Contact Number*</label>
                  <input
                    type="text"
                    className="field"
                    id="contactNumber"
                    placeholder="Enter Contact NUmber"
                    value={contactNumber}
                    readOnly
                  />
                </div>
                <div className="input-fields">
                  <label htmlFor="emailAddress">Email Address*</label>
                  <input
                    type="text"
                    className="field"
                    id="emailAddress"
                    placeholder="Enter Email Address"
                    value={emailId}
                    readOnly
                  />
                </div>
              </div>

              {(primaryArea === undefined || primaryArea ===
                " " ||
                primaryArea === null) ||
                (primaryPincode === undefined ||
                  primaryPincode === " " ||
                  primaryPincode === null) ||
                (primaryHouse == undefined ||
                  primaryHouse === " " ||
                  primaryHouse === null) ||
                (primaryLandmark == undefined ||
                  primaryLandmark === " " ||
                  primaryLandmark === null) ||
                (primarySociety == undefined ||
                  primaryLandmark === " " ||
                  primaryLandmark === null) ? (
                <>
                  <div className="input-fields-container">
                    <div className="input-fields">
                      <label htmlFor="dob">City</label>
                      <select
                        className="field"
                        onChange={(e) => setSelectedCityData(e.target.value)}
                      >
                        <option hidden={true}>
                          {primaryAddressData && primaryAddressData.city_name}
                        </option>
                        {cityData &&
                          cityData.length > 0 &&
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
                        onChange={(e) => setLandmark(e.target.value)}
                      />
                    </div>
                  </div>
                  <div
                    className="d-flex justify-content-end me-3"
                    onClick={onUpdateUserAddressClick}
                  >
                    <button className="save-button">SAVE ADDRESS</button>
                  </div>
                </>
              ) : (
                <div>
                  <div className="input-fields-container">
                    <div className="input-fields">
                      <label htmlFor="city">City *</label>
                      <input
                        className="field"
                        value={primaryCityName}
                        readOnly
                      />
                    </div>

                    <div className="input-fields">
                      <label htmlFor="pincode">Pincode *</label>
                      <input
                        className="field"
                        value={primaryPincodeName}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="input-fields-container">
                    <div className="input-fields">
                      <label htmlFor="city">Area *</label>
                      <input
                        className="field"
                        value={primaryAreaName}
                        readOnly
                      />
                    </div>
                    <div className="input-fields">
                      <label htmlFor="flatAndHouse">House No.*</label>
                      <input
                        type="text"
                        id="flatAndHouse"
                        className="field"
                        value={primaryHouse}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="input-fields-container">
                    <div className="input-fields">
                      <label htmlFor="BuildingAndSociety">Society Name *</label>
                      <input
                        type="text"
                        id="BuildingAndSociety"
                        className="field"
                        value={primarySociety}
                        readOnly
                      />
                    </div>
                    <div className="input-fields">
                      <label htmlFor="landmark">Landmark *</label>
                      <input
                        type="text"
                        id="landmark"
                        className="field"
                        value={primaryLandmark}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="summary-container">
              <h4 style={{ color: "#2C2C2C", fontWeight: 600 }}>
                Order Summary
              </h4>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h5
                  style={{
                    color: "#2C2C2C",
                    fontWeight: 600,
                    marginTop: "10px",
                  }}
                >
                  Products
                </h5>
                <h5
                  style={{
                    color: "#2C2C2C",
                    fontWeight: 600,
                    marginTop: "10px",
                  }}
                >
                  Total
                </h5>
              </div>
              <hr className="horizontal-rule" />

              {cartData &&
                cartData.map((cartItem) => (
                  <div key={cartItem.id}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6
                          style={{
                            color: "#2C2C2C",
                            fontWeight: 500,
                          }}
                        >
                          {cartItem.product.product_name} &#215;{" "}
                          {cartItem.qty_day1}
                        </h6>
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "#2C2C2C",
                            fontWeight: 500,
                          }}
                        >
                          ₹ {cartItem.amount}.00
                        </h6>
                      </div>
                    </div>
                    <hr className="horizontal-rule" />
                  </div>
                ))}

              <div className="d-flex flex-row align-items-center justify-content-between">
                <h6
                  style={{
                    color: "#2C2C2C",
                    fontWeight: 600,
                    marginTop: "10px",
                  }}
                >
                  Cart Subtotal
                </h6>
                <h6
                  style={{
                    color: "#2C2C2C",
                    fontWeight: 600,
                    marginTop: "10px",
                  }}
                >
                  ₹ {subtotal}
                </h6>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h6
                  style={{
                    color: "#2C2C2C",
                    fontWeight: 600,
                    marginTop: "10px",
                  }}
                >
                  Total Tax
                </h6>
                <h6
                  style={{
                    color: "#2C2C2C",
                    fontWeight: 600,
                    marginTop: "10px",
                  }}
                >
                  ₹ {tax_amount}
                </h6>
              </div>

              {offerApplied && (
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <h6
                    style={{
                      color: "#2C2C2C",
                      fontWeight: 600,
                      marginTop: "10px",
                    }}
                  >
                    Order Total
                  </h6>
                  <h6
                    style={{
                      color: "#2C2C2C",
                      fontWeight: 600,
                      marginTop: "10px",
                    }}
                  >
                    ₹ {total}.00
                  </h6>
                </div>
              )}

              {offerApplied && (
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <h6
                    style={{
                      color: "#2C2C2C",
                      fontWeight: 600,
                      marginTop: "10px",
                    }}
                  >
                    Total Discount
                  </h6>
                  <h6
                    style={{
                      color: "#2C2C2C",
                      fontWeight: 600,
                      marginTop: "10px",
                    }}
                  >
                    ₹ {discountAmount}.00
                  </h6>
                </div>
              )}

              <div className="d-flex flex-row align-items-center justify-content-between">
                <h5
                  style={{
                    color: "#2C2C2C",
                    fontWeight: 600,
                    marginTop: "10px",
                  }}
                >
                  Total Payable
                </h5>
                <h5
                  style={{
                    color: "#2C2C2C",
                    fontWeight: 600,
                    marginTop: "10px",
                    color: "#F70000",
                  }}
                >
                  {offerApplied == true
                    ? `₹ ${finalPayableAfterDiscount}.00`
                    : `₹ ${total}.00`}
                </h5>
              </div>

              {useWalletAmount == true && selectedPaymentMode == "online" && (
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <h5
                    style={{
                      color: "#2C2C2C",
                      fontWeight: 600,
                      marginTop: "10px",
                    }}
                  >
                    Payable After Using Wallet
                  </h5>
                  <h5
                    style={{
                      color: "#2C2C2C",
                      fontWeight: 600,
                      marginTop: "10px",
                      color: "#F70000",
                    }}
                  >
                    ₹{" "}
                    {offerApplied === true
                      ? Number(finalPayableAfterDiscount) >
                        Number(walletBalance)
                        ? Number(finalPayableAfterDiscount) -
                        Number(walletBalance)
                        : 0
                      : Number(total) > Number(walletBalance)
                        ? Number(total) - Number(walletBalance)
                        : 0}
                  </h5>
                </div>
              )}

              <div className="d-flex flex-row align-items-center justify-content-between mt-2">
                <input
                  className="field"
                  placeholder="Apply Coupon"
                  onChange={(e) => setCouponCode(e.target.value)}
                  value={couponCode}
                />
                {offerApplied == false ? (
                  <button
                    className="apply-button"
                    onClick={onApplyCouponButton}
                  >
                    APPLY
                  </button>
                ) : (
                  <button
                    className="apply-button"
                    onClick={onRemoveCouponButton}
                  >
                    Remove
                  </button>
                )}
              </div>
              <h5
                style={{ color: "#2C2C2C", fontWeight: 600, marginTop: "10px" }}
              >
                Payment Mode
              </h5>
              <div className="d-flex flex-row align-items-center justify-content-start">
                <div className="me-3" style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    id="onlinePayment"
                    name="paymentMode"
                    className="me-2 "
                    value="online"
                    onChange={(e) => setSelectedPaymentMode(e.target.value)}
                    defaultChecked
                  />
                  <label
                    htmlFor="onlinePayment"
                    className="h5"
                    style={{
                      color: "#2C2C2C",
                      fontWeight: 600,
                      marginTop: "10px",
                      color: "#2C2C2C",
                      cursor: "pointer",
                    }}
                  >
                    Online{" "}
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="cashPayment"
                    name="paymentMode"
                    className="me-2 "
                    value="cashPayment"
                    onChange={(e) => setSelectedPaymentMode(e.target.value)}
                  />
                  <label
                    htmlFor="cashPayment"
                    className="h5"
                    style={{
                      color: "#2C2C2C",
                      fontWeight: 600,
                      marginTop: "10px",
                      color: "#2C2C2C",
                      cursor: "pointer",
                    }}
                  >
                    Cash Payment
                  </label>
                </div>
              </div>
              <div className="d-flex w-100">
                {selectedPaymentMode == "online" ? (
                  <div className="d-flex flex-column w-100">
                    <div>
                      <h6 className="mt-2 mb-3 text-dark">
                        Available Wallet Balance : ₹ {walletBalance}.00
                      </h6>
                    </div>
                    <div>
                      {walletBalance > 0 && (
                        <div>
                          <input
                            type="checkbox"
                            id="cartUseWalletCheckbox"
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              setUseWalletAmount(!useWalletAmount)
                            }
                            checked={useWalletAmount == true}
                          />
                          <label
                            htmlFor="cartUseWalletCheckbox"
                            className="h5 ms-1"
                            style={{ cursor: "pointer" }}
                          >
                            Use Wallet Amount
                          </label>
                        </div>
                      )}
                    </div>
                    <button
                      className="proceed-to-checkout-button"
                      onClick={onPlaceSubscriptionOrderClick}
                    >
                      PLACE ORDER ONLINE
                    </button>
                  </div>
                ) : (
                  <div className="cash-order-container">
                    <div className="mt-1">
                      <label htmlFor="appointmentTime">Appointment Time*</label>
                      <select
                        className="field mb-1"
                        id="appointmentTime"
                        onChange={(e) =>
                          setDeliveryAppointmentTime(e.target.value)
                        }
                      >
                        <option value="">
                          --- Select Appointment Time ---
                        </option>
                        <option value="10:00am to 12:30pm">
                          10:00am to 12:30pm
                        </option>
                        <option value="01:30pm to 04:00pm">
                          01:30pm to 04:00pm
                        </option>
                      </select>
                      <p>
                        Note: <span>Our Executive will visit you soon.</span>
                      </p>
                    </div>
                    <button
                      className="proceed-to-checkout-button"
                      onClick={onPlaceSubscriptionOrderClickCash}
                    >
                      PLACE ORDER WITH CASH
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default Checkout;
