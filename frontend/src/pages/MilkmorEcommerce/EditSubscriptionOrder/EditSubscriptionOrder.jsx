import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import { useLocation } from "react-router-dom";
import "./EditSubscriptionOrder.css";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import milkmorlogo from "../../../assets/images/brands/mikmor-1.png";
import { API_BASE_URL, API_CUSTOMERS_GET_BY_ID, API_DELIVERY_FREQUENCY_GET, API_DELIVERY_PATTERN_GET_BY_ID, API_PRODUCT_POST_GET, API_SUBSCRIPTION_OFFER_APPLY, API_TRIAL_PLAN_AND_SUBSCRIPTION_GET, GET_ECOMMERCE_WALLET_DETAILS } from "customhooks/All_Api/Apis";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const EditSubscriptionOrder = () => {
  const navigate = useNavigate();
  const config = GetAuthToken();
  const ecommereceConfig = GetEcommereceAuthToken();
  const location = useLocation();
  const { subscriptonOrderViewDetails } = location.state && location.state;
  const [deliveryFrequencyData, setDeliveryFrequencyData] = useState();
  const [subscriptionDurationData, setSubscriptionDurationData] = useState();
  const [deliveryPatternData, setDeliveryPatternData] = useState();
  const [productsData, setProductsData] = useState();
  const [selectedFrequency, setSelectedFrequency] = useState();
  const [selectedDuration, setSelectedDuration] = useState();
  const [selectedPattern, setSelectedPattern] = useState();
  const [selectedProducts, setSelectedPoducts] = useState();
  const [finalProductData, setFinalProductData] = useState();
  const [day1Quantity, setDay1Quantity] = useState();
  const [day2Quantity, setDay2Quantity] = useState();
  const [couponCode, setCouponCode] = useState();
  const [offerApplied, setOfferApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState();
  const [cartTotal, setCartTotal] = useState();
  const [finalPayableAfterDiscount, setFinalPayableAfterDiscount] = useState();
  const [walletBalance, setWalletBalance] = useState();
  const [useWalletAmount, setUseWalletAmount] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("online");
  const [deliveryAppointmentTime, setDeliveryAppointmentTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [emailId, setEmailId] = useState("");

  const userDeatils = async () => {
    const { data } = await axios.get(
      `${API_CUSTOMERS_GET_BY_ID}${userId}/`
    );
    setFirstName(data.data.customer.first_name);
    setLastName(data.data.customer.last_name);
    setContactNumber(data.data.customer.contact_no);
    setEmailId(data.data.customer.email);
  };

  const transformedProducts =
    finalProductData &&
    finalProductData.map((product) => ({
      product_id: product.id,
      qty_day1: product.qty_day1,
      qty_day2: product.qty_day2,
    }));

  let totalQuantity = 0;

  finalProductData &&
    finalProductData.map(
      (eachItem) =>
        (totalQuantity +=
          parseInt(eachItem.qty_day1) + parseInt(eachItem.qty_day2))
    );

  let dailyPayable = 0;

  finalProductData &&
    finalProductData.map(
      (eachItem) =>
        (dailyPayable +=
          parseInt(eachItem.product_rate) *
          (parseInt(eachItem.qty_day1) + parseInt(eachItem.qty_day2)))
    );

  const userDetailsData = JSON.parse(
    localStorage.getItem("EcommerceTokenData")
  );
  const userId = userDetailsData.userId;
  const token = userDetailsData.token;

  const getDeliveryFrequency = async () => {
    try {
      const { data } = await axios.get(
        API_DELIVERY_FREQUENCY_GET,
        ecommereceConfig
      );
      setDeliveryFrequencyData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubscriptionDuration = async () => {
    try {
      const { data } = await axios.get(
        API_TRIAL_PLAN_AND_SUBSCRIPTION_GET,
        ecommereceConfig
      );
      setSubscriptionDurationData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDeliveryPattern = async () => {
    try {
      const { data } = await axios.get(
        API_DELIVERY_PATTERN_GET_BY_ID,
        ecommereceConfig
      );
      setDeliveryPatternData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetProducts = async () => {
    try {
      const { data } = await axios.get(API_PRODUCT_POST_GET, ecommereceConfig);
      setProductsData(data.data);
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

  const onAddRenewProductsClick = (e) => {
    e.preventDefault();

    const parsedSelectedProducts = JSON.parse(selectedProducts);

    // Check if the existing finalProductData has the same delivery frequency and subscription duration
    const hasMatchingData =
      finalProductData &&
      finalProductData.every(
        (eachItem) =>
          eachItem.delivery_frequency === selectedFrequency &&
          eachItem.subscription_duration === selectedDuration
      );

    if (!hasMatchingData) {
      // If not, clear finalProductData and add the new product
      setFinalProductData([
        {
          id: parsedSelectedProducts.id,
          product_name: parsedSelectedProducts.product_name,
          product_rate: parsedSelectedProducts.product_rate,
          ...(selectedPattern === "Daily"
            ? { qty_day1: day1Quantity, qty_day2: day2Quantity || 0 }
            : { qty_day1: day1Quantity, qty_day2: day2Quantity || 0 }),
          delivery_frequency: selectedFrequency,
          subscription_duration: selectedDuration,
        },
      ]);
    } else {
      // If the data matches, proceed to add/update the product
      const existingIndex = finalProductData.findIndex(
        (eachItem) => eachItem.id === parsedSelectedProducts.id
      );

      if (existingIndex !== -1) {
        // If the product already exists, update the quantities
        const updatedProductData = [...finalProductData];
        updatedProductData[existingIndex] = {
          ...updatedProductData[existingIndex],
          qty_day1: day1Quantity,
          ...(selectedFrequency === "Alternate"
            ? { qty_day2: day2Quantity || 0 }
            : {}),
        };
        setFinalProductData(updatedProductData);
      } else {
        // If the product does not exist, add a new product
        const newProduct = {
          id: parsedSelectedProducts.id,
          product_name: parsedSelectedProducts.product_name,
          product_rate: parsedSelectedProducts.product_rate,
          ...(selectedPattern === "Daily"
            ? { qty_day1: day1Quantity, qty_day2: day2Quantity || 0 }
            : { qty_day1: day1Quantity, qty_day2: day2Quantity || 0 }),
          delivery_frequency: selectedFrequency,
          subscription_duration: selectedDuration,
        };

        setFinalProductData([...finalProductData, newProduct]);
      }
    }
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

  useEffect(() => {
    if (subscriptonOrderViewDetails) {
      const updatedFinalProductData = subscriptonOrderViewDetails.items.map(
        (eachItem) => ({
          id: eachItem.product.id,
          product_name: eachItem.product_name,
          product_rate: eachItem.product_rate,
          qty_day1: eachItem.qty_day1,
          qty_day2: eachItem.qty_day2 || 0,
          delivery_frequency:
            subscriptonOrderViewDetails &&
            subscriptonOrderViewDetails.order.delivery_frequency,
          subscription_duration:
            subscriptonOrderViewDetails &&
            subscriptonOrderViewDetails.order.subscription_duration,
        })
      );

      setFinalProductData(updatedFinalProductData);
      setSelectedDuration(
        subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.subscription_duration
      );
      setSelectedFrequency(
        subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.delivery_frequency
      );
      setSelectedPattern(
        subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.delivery_pattern
      );
    }
  }, [subscriptonOrderViewDetails]);

  const handleProductDeleteFromFinalProducts = (id) => {
    const updatedProducts =
      finalProductData &&
      finalProductData.filter((eachItem) => eachItem.id !== id);
    setFinalProductData(updatedProducts);
  };

  const onApplyCouponButton = async () => {
    const couponData = {
      coupon_code: couponCode,
      customer_id: userId,
      order_type: "Subscription Orders",
      amount: parseInt(dailyPayable) * parseInt(selectedDuration),
    };
    try {
      const { data } = await axios.post(
        API_SUBSCRIPTION_OFFER_APPLY           ,
        couponData,
        ecommereceConfig
      );
      setOfferApplied(!offerApplied);
      setDiscountAmount(data.discount);
      setCartTotal(data.pb_discount);
      setFinalPayableAfterDiscount(data.pa_discount);
      toast.success("Coupon Applied", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error("Coupon was not applied", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const onRemoveCouponButton = () => {
    setOfferApplied(!offerApplied);
    setDiscountAmount("");
    setCartTotal("");
    setFinalPayableAfterDiscount("");
    setCouponCode("");
  };

  useEffect(() => {
    getDeliveryFrequency();
    getSubscriptionDuration();
    getDeliveryPattern();
    handleGetProducts();
    getWalletDetails();
    userDeatils();
  }, []);

  // this function will handel payment when user submit his/her money
  // and it will confim if payment is successfull or not
  const handlePaymentSuccess = async (response) => {
    try {
      // we will send the response we've got from razorpay to the backend to validate the payment
      const bodyData = {
        order_data: {
          customer_id:
            subscriptonOrderViewDetails &&
            subscriptonOrderViewDetails.order.customer.customer_id,
          products:
            transformedProducts &&
            transformedProducts.map((eachItem) => ({
              product_id: parseInt(eachItem.product_id),
              qty_day1: parseInt(eachItem.qty_day1),
              qty_day2: parseInt(eachItem.qty_day2),
            })),
          delivery_frequency: selectedFrequency,
          subscription_duration: selectedDuration,
          delivery_pattern: selectedPattern,
          subscription_type: "subscription",
          appointment_time: deliveryAppointmentTime,
          coupon_code: couponCode || "",
          order_id:
            subscriptonOrderViewDetails &&
            subscriptonOrderViewDetails.order.order_id,
        },
        order_id:
          subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.order_id,
        amount:
          offerApplied == true
            ? finalPayableAfterDiscount
            : `${parseInt(dailyPayable) * parseInt(selectedDuration)}`,
        response: response,
      };

      await Axios({
        url: `${API_BASE_URL}/api/renew-edit-razorpay-paymenthandler/`,
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
      // const productsArray = JSON.parse(finalProductData);

      // we will pass the amount and product name to the backend using form data
      // const bodyData = {
      //   customer_id:
      //     subscriptonOrderViewDetails &&
      //     subscriptonOrderViewDetails.order.customer.customer_id,
      //   products:
      //     transformedProducts &&
      //     transformedProducts.map((eachItem) => ({
      //       product_id: parseInt(eachItem.product_id),
      //       qty_day1: parseInt(eachItem.qty_day1),
      //       qty_day2: parseInt(eachItem.qty_day2),
      //     })),
      //   delivery_frequency: selectedFrequency,
      //   subscription_duration: selectedDuration,
      //   delivery_pattern: selectedPattern,
      //   subscription_type: "subscription",
      //   appointment_time: deliveryAppointmentTime,
      //   coupon_code: couponCode || "",
      //   order_id:
      //     subscriptonOrderViewDetails &&
      //     subscriptonOrderViewDetails.order.order_id,
      //   amount: `${parseInt(dailyPayable) * parseInt(selectedDuration)}`,
      //   use_wallet: useWalletAmount,
      // };
      const bodyData = {
        order_data: {
          customer_id:
            subscriptonOrderViewDetails &&
            subscriptonOrderViewDetails.order.customer.customer_id,
          products:
            transformedProducts &&
            transformedProducts.map((eachItem) => ({
              product_id: parseInt(eachItem.product_id),
              qty_day1: parseInt(eachItem.qty_day1),
              qty_day2: parseInt(eachItem.qty_day2),
            })),
          delivery_frequency: selectedFrequency,
          subscription_duration: selectedDuration,
          delivery_pattern: selectedPattern,
          subscription_type: "subscription",
          appointment_time: deliveryAppointmentTime,
          coupon_code: couponCode || "",
          order_id:
            subscriptonOrderViewDetails &&
            subscriptonOrderViewDetails.order.order_id,
        },
        order_id:
          subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.order_id,
        amount:
          offerApplied == true
            ? finalPayableAfterDiscount
            : `${parseInt(dailyPayable) * parseInt(selectedDuration)}`,
        use_wallet: useWalletAmount,
      };

      console.log("bodyData", bodyData);

      const data = await Axios({
        url: `${API_BASE_URL}/api/order/renew-edit-order-online/`,
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
      const bodyData = {
        customer_id:
          subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.customer.customer_id,
        products:
          transformedProducts &&
          transformedProducts.map((eachItem) => ({
            product_id: parseInt(eachItem.product_id),
            qty_day1: parseInt(eachItem.qty_day1),
            qty_day2: parseInt(eachItem.qty_day2),
          })),
        delivery_frequency: selectedFrequency,
        subscription_duration: selectedDuration,
        delivery_pattern: selectedPattern,
        subscription_type: "subscription",
        appointment_time: deliveryAppointmentTime,
        coupon_code: couponCode || "",
        order_id:
          subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.order_id,
      };

      const data = await Axios({
        url: `${API_BASE_URL}/api/order/create-order/`,
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
      console.log("Error", error);
    }
  };

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
        <h1 className="text-light">EDIT SUBSCRIPTION ORDER</h1>
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
              <div className="d-flex align-items-center justify-content-start">
                <div>
                  <h5>Edit Subscription Order</h5>
                </div>
              </div>
              <hr className="horizontal-rule" />
              <div>
                <h5>Customer Details</h5>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <div className="text-center">
                    <i
                      className="fas fa-user-alt"
                      style={{ color: "#3B66A0" }}
                    ></i>
                    <h6>Customer Name</h6>
                    {subscriptonOrderViewDetails &&
                      subscriptonOrderViewDetails.order.customer.first_name}
                  </div>
                  <div className="text-center">
                    <i
                      className="fas fa-mobile-alt"
                      style={{ color: "#3B66A0" }}
                    ></i>
                    <h6>Contact Number</h6>
                    {subscriptonOrderViewDetails &&
                      subscriptonOrderViewDetails.order.customer.contact_no}
                  </div>
                  <div className="text-center">
                    <i
                      className="fas fa-location-arrow"
                      style={{ color: "#3B66A0" }}
                    ></i>
                    <h6>Pincode</h6>
                    {subscriptonOrderViewDetails &&
                      subscriptonOrderViewDetails.order.customer_address.pincode
                        .code}
                  </div>
                </div>
                <div className="mt-3">
                  <i
                    className="fas fa-map-marker-alt "
                    style={{ color: "#3B66A0" }}
                  ></i>
                  <h6>Address</h6>
                  {subscriptonOrderViewDetails &&
                    subscriptonOrderViewDetails.order.customer_address
                      .full_address}
                </div>
              </div>
              <hr className="horizontal-rule" />
              <h5>Subscription Details</h5>
              <hr className="horizontal-rule" />
              <form onSubmit={onAddRenewProductsClick}>
                <div className="input-fields-container">
                  <div className="input-fields">
                    <label htmlFor="SubscriptionFrequencyDropdown">
                      Subscription Frequency *
                    </label>
                    <select
                      id="SubscriptionFrequencyDropdown"
                      className="field"
                      value={selectedFrequency}
                      onChange={(e) => setSelectedFrequency(e.target.value)}
                      required
                    >
                      <option>--- Select Frequency ---</option>
                      <option
                        value={
                          deliveryFrequencyData &&
                          deliveryFrequencyData.alternate_day[0].day_pattern
                        }
                      >
                        {deliveryFrequencyData &&
                          deliveryFrequencyData.alternate_day[0].day_pattern}
                      </option>
                      <option
                        value={
                          deliveryFrequencyData &&
                          deliveryFrequencyData.daily_day[0].day_pattern
                        }
                      >
                        {deliveryFrequencyData &&
                          deliveryFrequencyData.daily_day[0].day_pattern}
                      </option>
                    </select>
                  </div>
                  <div className="input-fields">
                    <label htmlFor="SubscriptionDurationDropdown">
                      Subscription Duration *
                    </label>
                    <select
                      id="SubscriptionDurationDropdown"
                      className="field"
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      required
                    >
                      <option value=""> --- Select Duration ---</option>
                      {subscriptionDurationData &&
                        subscriptionDurationData.subscription_plan.map(
                          (eachItem) =>
                            eachItem.is_active == true && (
                              <option key={eachItem.id} value={eachItem.days}>
                                {eachItem.days} Days
                              </option>
                            )
                        )}
                    </select>
                  </div>
                </div>
                <div className="input-fields-container">
                  <div className="input-fields">
                    <label htmlFor="SubscriptionFrequencyDropdown">
                      Delivery Pattern *
                    </label>
                    <select
                      id="SubscriptionFrequencyDropdown"
                      className="field"
                      value={selectedPattern}
                      onChange={(e) => setSelectedPattern(e.target.value)}
                      required
                    >
                      <option value="">--- Select Delivery Pattern ---</option>
                      {deliveryPatternData &&
                        deliveryPatternData.map(
                          (eachItem) =>
                            eachItem.is_active == true && (
                              <option
                                key={eachItem.id}
                                value={eachItem.delivery_pattern}
                              >
                                {eachItem.delivery_pattern}
                              </option>
                            )
                        )}
                    </select>
                  </div>
                  <div className="input-fields">
                    <label htmlFor="SubscriptionDurationDropdown">
                      Products *
                    </label>
                    <select
                      id="SubscriptionDurationDropdown"
                      className="field"
                      onChange={(e) => setSelectedPoducts(e.target.value)}
                      required
                    >
                      <option> --- Select Products ---</option>
                      {productsData &&
                        productsData.map(
                          (eachProducts) =>
                            eachProducts.product_classification == "Saleable" &&
                            eachProducts.product_type == "Scheduled" && (
                              <option
                                key={eachProducts.id}
                                value={JSON.stringify({
                                  id: eachProducts.id,
                                  product_name: eachProducts.product_name,
                                  product_rate: eachProducts.product_rate,
                                })}
                              >
                                {eachProducts.product_name}
                              </option>
                            )
                        )}
                    </select>
                  </div>
                </div>
                <div>
                  <div>
                    <label>Set Day 1 Quantity</label>
                    <input
                      type="number"
                      className="field"
                      min={1}
                      required
                      onChange={(e) => setDay1Quantity(e.target.value)}
                    />
                  </div>
                  {selectedFrequency && selectedFrequency == "Alternate" && (
                    <div className="mt-2">
                      <label>Set Day 2 Quantity</label>
                      <input
                        type="number"
                        className="field"
                        min={0}
                        required
                        onChange={(e) => setDay2Quantity(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <button
                  className="proceed-to-checkout-button mt-3"
                  type="submit"
                >
                  ADD PRODUCTS
                </button>
              </form>
              <div className="table-rep-plugin mt-3">
                <div
                  className="table-responsive mb-0"
                  data-pattern="priority-columns"
                >
                  <Table
                    id="tech-companies-1"
                    className="table table-striped table-bordered"
                  >
                    <Thead>
                      <Tr>
                        <Th
                          className="text-center"
                          style={{
                            color: "#211E1E",
                            fontSize: "12px",
                          }}
                        >
                          Product
                        </Th>
                        <Th
                          className="text-center "
                          style={{ color: "#211E1E", fontSize: "12px" }}
                        >
                          Qty.Day1
                        </Th>
                        <Th
                          className="text-center "
                          style={{ color: "#211E1E", fontSize: "12px" }}
                        >
                          Qty.Day2
                        </Th>
                        <Th
                          className="text-center"
                          style={{ color: "#211E1E", fontSize: "12px" }}
                        >
                          Rate
                        </Th>
                        <Th
                          className="text-center"
                          style={{ color: "#211E1E", fontSize: "12px" }}
                        >
                          Delete
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {finalProductData &&
                        finalProductData.map((eachProduct) => (
                          <Tr key={eachProduct.id}>
                            <Td
                              className="text-center"
                              style={{
                                color: "#211E1E",
                                fontSize: "12px",
                                fontWeight: "500",
                                verticalAlign: "middle",
                              }}
                            >
                              {eachProduct.product_name}
                            </Td>
                            <Td
                              className="text-center"
                              style={{
                                color: "#211E1E",
                                fontSize: "12px",
                                fontWeight: "500",
                                verticalAlign: "middle",
                              }}
                            >
                              {eachProduct.qty_day1}
                            </Td>
                            <Td
                              className="text-center"
                              style={{
                                color: "#211E1E",
                                fontSize: "12px",
                                fontWeight: "500",
                                verticalAlign: "middle",
                              }}
                            >
                              {eachProduct.qty_day2 || 0}
                            </Td>
                            <Td
                              className="text-center"
                              style={{
                                color: "#211E1E",
                                fontSize: "12px",
                                fontWeight: "500",
                                verticalAlign: "middle",
                              }}
                            >
                              {eachProduct.product_rate}
                            </Td>
                            <Td
                              className="text-center"
                              style={{
                                color: "#211E1E",
                                fontSize: "12px",
                                fontWeight: "500",
                                verticalAlign: "middle",
                              }}
                            >
                              <i
                                className="fa fa-trash"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleProductDeleteFromFinalProducts(
                                    eachProduct.id
                                  )
                                }
                              ></i>
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </div>
              </div>

              <div className="renew-coupon-total-data">
                <div
                  className={
                    selectedPaymentMode == "cashPayment"
                      ? "d-none"
                      : "d-flex flex-row align-items-center justify-content-between mt-2"
                  }
                >
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
                <div>
                  <h6>
                    Total Qty : {totalQuantity} * {selectedDuration} ={" "}
                    {parseInt(totalQuantity) * parseInt(selectedDuration)}
                  </h6>
                  <h6 className="d-flex mb-0">
                    Total Payable : ₹{" "}
                    {offerApplied == true ? (
                      <h6>{finalPayableAfterDiscount}</h6>
                    ) : (
                      `${parseInt(dailyPayable) * parseInt(selectedDuration)}`
                    )}
                  </h6>
                  {useWalletAmount == true &&
                    selectedPaymentMode == "online" && (
                      <div className="d-flex flex-row align-items-center justify-content-between">
                        <h6>Payable After Using Wallet : </h6>
                        <h6>
                          ₹{" "}
                          {offerApplied === true
                            ? Number(finalPayableAfterDiscount) >
                              Number(walletBalance)
                              ? Number(finalPayableAfterDiscount) -
                                Number(walletBalance)
                              : 0
                            : Number(
                                `${
                                  parseInt(dailyPayable) *
                                  parseInt(selectedDuration)
                                }`
                              ) > Number(walletBalance)
                            ? Number(
                                `${
                                  parseInt(dailyPayable) *
                                  parseInt(selectedDuration)
                                }`
                              ) - Number(walletBalance)
                            : 0}
                        </h6>
                      </div>
                    )}
                </div>
              </div>
              <h5
                style={{ color: "#2C2C2C", fontWeight: 600, marginTop: "15px" }}
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

export default EditSubscriptionOrder;
