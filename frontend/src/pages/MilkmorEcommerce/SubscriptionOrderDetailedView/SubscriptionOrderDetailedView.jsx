import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link, useLocation } from "react-router-dom";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import "./SubscriptionOrderDetailedView.css";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import axios from "axios";
import {
  API_BASE_URL,
  API_CUSTOMERS_GET_BY_ID,
  API_HUB_PAUSE_SUBSCRIPTION_ORDER,
  API_SUBSCRIPTION_ORDER_DATA_GET_BY_ID,
  CANCEL_ECOMMERCE_SUBSCRIPTION_ORDER_REQUEST,
  GET_ECOMMERCE_WALLET_DETAILS,
} from "customhooks/All_Api/Apis";
import { useNavigate } from "react-router-dom";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import Axios from "axios";
import milkmorlogo from "../../../assets/images/brands/mikmor-1.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubscriptionOrderDetailedView = () => {
  const [cancelOrderStatusData, setCancelOrderStatusData] = useState();
  const location = useLocation();
  const { state } = location;
  const orderID = state && state.orderID;
  const [subscriptonOrderViewDetails, setSubscriptionOrderViewDetails] =
    useState();
  const [selectedDropdownStatusValues, setSelectedDropdownStatusValues] =
    useState();
  const [selectedCancellationReasons, setSelectedCancellationReason] =
    useState();
  const [selectedCancellationDescription, setSelectedCancellationDescription] =
    useState();
  const [selectedPauseDateFrom, setSelectedPauseDateFrom] = useState();
  const [selectedPauseDateTo, setSelectedPauseDateTo] = useState();
  const [selectedPauseDescription, setSelectedPauseDescription] = useState();
  const [continueWithSameOrderTriggered, setContinueWithSameOrderTriggered] =
    useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("online");
  const [walletBalance, setWalletBalance] = useState();
  const [useWalletAmount, setUseWalletAmount] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [emailId, setEmailId] = useState("");

  console.log("subscriptonOrderViewDetails", subscriptonOrderViewDetails);

  const userDetailsData = JSON.parse(
    localStorage.getItem("EcommerceTokenData")
  );
  const userId = userDetailsData.userId;
  const token = userDetailsData.token;

  const navigate = useNavigate();
  const ecommereceConfig = GetEcommereceAuthToken();

  const userDeatils = async () => {
    const { data } = await axios.get(`${API_CUSTOMERS_GET_BY_ID}${userId}/`);
    setFirstName(data.data.customer.first_name);
    setLastName(data.data.customer.last_name);
    setContactNumber(data.data.customer.contact_no);
    setEmailId(data.data.customer.email);
  };

  const getSubscriptionOrderDetailedViewList = async () => {
    try {
      const { data } = await axios.get(
        `${API_SUBSCRIPTION_ORDER_DATA_GET_BY_ID}${orderID}/`,
        ecommereceConfig
      );
      setSubscriptionOrderViewDetails(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getCancelOrderStatus = async () => {
    try {
      const { data } = await axios.get(
        `${CANCEL_ECOMMERCE_SUBSCRIPTION_ORDER_REQUEST}${orderID}/`,
        ecommereceConfig
      );
      setCancelOrderStatusData(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const submitCancellationRequest = async (e) => {
    e.preventDefault();
    const cancellationRequestData = {
      cancel_reason: selectedCancellationReasons,
      description: selectedCancellationDescription,
    };
    try {
      const { data } = await axios.post(
        `${CANCEL_ECOMMERCE_SUBSCRIPTION_ORDER_REQUEST}${orderID}/`,
        cancellationRequestData,
        ecommereceConfig
      );
      navigate("/my-subscriptions");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePauseOrderSubmit = async (e) => {
    e.preventDefault();
    const pauseRequestData = {
      order_id: orderID,
      pause_from: selectedPauseDateFrom,
      pause_to: selectedPauseDateTo,
      pause_reason: selectedPauseDescription,
    };
    try {
      const { data } = await axios.post(
        API_HUB_PAUSE_SUBSCRIPTION_ORDER,
        pauseRequestData,
        ecommereceConfig
      );
      navigate("/my-subscriptions");
    } catch (error) {
      console.log(error);
    }
  };

  const getWalletDetails = async () => {
    try {
      const { data } = await axios.get(
        `${GET_ECOMMERCE_WALLET_DETAILS}${userId}/`,
        ecommereceConfig
      );
      setWalletBalance(data.available_balance);
      console.log("Wallet Details", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubscriptionOrderDetailedViewList();
    getCancelOrderStatus();
  }, [orderID]);

  useEffect(() => {
    getWalletDetails();
    userDeatils();
  }, []);

  // this function will handel payment when user submit his/her money
  // and it will confim if payment is successfull or not
  const handlePaymentSuccess = async (response) => {
    try {
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", JSON.stringify(response));

      await Axios({
        url: `${API_BASE_URL}/api/renew-same-razorpay-paymenthandler/`,
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

      bodyData.append(
        "order_id",
        subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.order_id
      );
      bodyData.append(
        "amount",
        subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.pb_discount
      );

      useWalletAmount == true
        ? bodyData.append("use_wallet", true)
        : bodyData.append("use_wallet", false);

      const data = await Axios({
        url: `${API_BASE_URL}/api/order/renew-same-order-online/`,
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
      toast.error("Order Can be renewed only once.", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const onPlaceSubscriptionOrderClickCash = async () => {
    try {
      let bodyData = new FormData();

      bodyData.append(
        "order_id",
        subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.order_id
      );
      bodyData.append(
        "amount",
        subscriptonOrderViewDetails &&
          subscriptonOrderViewDetails.order.pb_discount
      );
      const data = await Axios({
        url: `${API_BASE_URL}/api/order/renew-same-order-offline/`,
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
      toast.error("Order Can be renewed only once.", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
        <h1 className="text-light">Order Details</h1>
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
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5>Subscription Details</h5>
                </div>
                <div className="detailed-view-subscription-buttons">
                  <Link
                    to="/customer-delivery-logs"
                    state={{
                      id: orderID,
                      duration:
                        subscriptonOrderViewDetails &&
                        subscriptonOrderViewDetails.order.subscription_duration,
                    }}
                  >
                    <button className="print-button me-2" disabled={subscriptonOrderViewDetails&&subscriptonOrderViewDetails.order.activated_on === null}>
                      DELIVERY PATTERN
                    </button>
                  </Link>
                  <Link
                    to="/print-cart-order-invoice"
                    state={{
                      orderId:
                        subscriptonOrderViewDetails &&
                        subscriptonOrderViewDetails.order.order_id,
                    }}
                  >
                    <button className="print-button" disabled={subscriptonOrderViewDetails&&subscriptonOrderViewDetails.order.amount_paid === null}>PRINT</button>
                  </Link>
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
              <h5>Order Details</h5>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <div>
                  <h6>
                    Order :{" "}
                    <span style={{ color: "#3B66A0" }}>
                      #
                      {subscriptonOrderViewDetails &&
                        subscriptonOrderViewDetails.order.order_id}
                    </span>
                  </h6>
                </div>
                <div>
                  <h6>
                    Ordered On :{" "}
                    <span style={{ color: "#3B66A0" }}>
                      {new Date(
                        subscriptonOrderViewDetails &&
                          subscriptonOrderViewDetails.order.created_at
                      ).toLocaleDateString()}
                    </span>
                  </h6>
                </div>
                <div>
                  <h6>
                    Expired On : <span style={{ color: "#3B66A0" }}></span>
                  </h6>
                </div>
              </div>
              <div
                className="table-responsive mb-0 mt-2"
                data-pattern="priority-columns"
              >
                <Table
                  id="tech-companies-1"
                  className="table table-striped table-bordered"
                >
                  <Thead>
                    <Tr>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Product Name
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Unit Rate (INR)
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Tax Rate
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Planned Qty.
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Amount
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {subscriptonOrderViewDetails &&
                      subscriptonOrderViewDetails.items.map((eachItem) => (
                        <Tr key={eachItem.id} className="text-center">
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            {eachItem.product_name}
                          </Td>
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            <i className="fas fa-rupee-sign"></i>
                            {eachItem.product_rate}.00
                          </Td>
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            {eachItem.tax_name}
                          </Td>
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            {eachItem.total_planned_qty}
                          </Td>
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            <i className="fas fa-rupee-sign"></i>{" "}
                            {eachItem.with_tax_amount}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6>
                    Appointment Time :{" "}
                    <span style={{ color: "#3B66A0" }}>
                      {subscriptonOrderViewDetails &&
                        subscriptonOrderViewDetails.order.appointment_time}
                    </span>
                  </h6>
                </div>
                <div>
                  <h6>
                    Total amount + Tax ={" "}
                    <span style={{ color: "#3B66A0" }}>
                      <i className="fas fa-rupee-sign"></i>{" "}
                      {subscriptonOrderViewDetails &&
                        subscriptonOrderViewDetails.order
                          .without_tax_amount}{" "}
                      + <i className="fas fa-rupee-sign"></i>{" "}
                      {subscriptonOrderViewDetails &&
                        subscriptonOrderViewDetails.order.total_tax}
                    </span>
                  </h6>
                  <h6>
                    Order Total :{" "}
                    <span style={{ color: "#3B66A0" }}>
                      <i className="fas fa-rupee-sign"></i>{" "}
                      {subscriptonOrderViewDetails &&
                        subscriptonOrderViewDetails.order.pa_discount}
                      .00
                    </span>
                  </h6>
                </div>
              </div>
              <hr className="horizontal-rule" />
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6>Delivery Frequency</h6>
                  <h6 className="text-center" style={{ color: "#3B66A0" }}>
                    {subscriptonOrderViewDetails &&
                      subscriptonOrderViewDetails.order.delivery_frequency}
                  </h6>
                </div>
                <div>
                  <h6>Order Duration</h6>
                  <h6 className="text-center" style={{ color: "#3B66A0" }}>
                    {subscriptonOrderViewDetails &&
                      subscriptonOrderViewDetails.order
                        .subscription_duration}{" "}
                    Days
                  </h6>
                </div>
                <div>
                  <h6>Delivery Pattern</h6>
                  <h6 className="text-center" style={{ color: "#3B66A0" }}>
                    {subscriptonOrderViewDetails &&
                      subscriptonOrderViewDetails.order.delivery_pattern}
                  </h6>
                </div>
              </div>
              <hr className="horizontal-rule" />
              <div className="d-flex align-items-center justify-content-around">
                <div>
                  <h6>Payment Mode</h6>
                  <h6 className="text-center" style={{ color: "#3B66A0" }}>
                    {subscriptonOrderViewDetails &&
                      subscriptonOrderViewDetails.order.payment_mode}
                  </h6>
                </div>
                <div>
                  <h6>Amount Paid</h6>
                  <h6 className="text-center" style={{ color: "#3B66A0" }}>
                    <i className="fas fa-rupee-sign"></i>{" "}
                    {subscriptonOrderViewDetails &&
                    subscriptonOrderViewDetails.order.amount_paid
                      ? subscriptonOrderViewDetails &&
                        subscriptonOrderViewDetails.order.amount_paid
                      : 0}
                  </h6>
                </div>
              </div>
              <hr className="horizontal-rule" />
              <div className="d-flex align-items-center justify-content-around ms-3">
                <div className="text-center">
                  <i
                    className="fas fa-warehouse"
                    style={{ color: "#3B66A0" }}
                  ></i>
                  <h6 className="text-center">Allocated Hub</h6>
                  <h6 className="text-center" style={{ color: "#3B66A0" }}>
                    {subscriptonOrderViewDetails &&
                      subscriptonOrderViewDetails.order.hub.name}
                  </h6>
                </div>
                <div className="text-center">
                  <i
                    className="far fa-calendar-alt"
                    style={{ color: "#3B66A0" }}
                  ></i>
                  <h6 className="text-center">Activated On</h6>
                  <h6 className="text-center" style={{ color: "#3B66A0" }}>
                    {subscriptonOrderViewDetails &&
                    subscriptonOrderViewDetails.order.delivery_start_date
                      ? subscriptonOrderViewDetails &&
                        subscriptonOrderViewDetails.order.delivery_start_date
                      : "Yet To Be Activated"}
                  </h6>
                </div>
              </div>
              <hr className="horizontal-rule" />
              {cancelOrderStatusData &&
                cancelOrderStatusData.status == "Accepted" && (
                  <div>
                    <h6 style={{ color: "green" }}>
                      Order Cancellation Accepted
                    </h6>
                  </div>
                )}
              {cancelOrderStatusData &&
                cancelOrderStatusData.status == "Rejected" && (
                  <div>
                    <h6 style={{ color: "red" }}>
                      Order Cancellation Rejected
                    </h6>
                  </div>
                )}
              {cancelOrderStatusData &&
                cancelOrderStatusData.status == "Pending" && (
                  <div>
                    <h6 style={{ color: "orange" }}>
                      Order Cancellation Pending
                    </h6>
                  </div>
                )}
              {cancelOrderStatusData && cancelOrderStatusData.message && (
                <div className="d-flex align-items-center justify-content-end">
                  <select
                    className="subscription-order-select-action"
                    onChange={(e) =>
                      setSelectedDropdownStatusValues(e.target.value)
                    }
                    value={selectedDropdownStatusValues}
                  >
                    <option value="">Select Action</option>
                    <option value="cancelOrder">Cancel Order</option>
                    <option value="pauseOrder">Pause Order</option>
                    <option value="renewOrder">Renew Order</option>
                  </select>
                </div>
              )}
              <hr className="horizontal-rule" />
              {selectedDropdownStatusValues == "cancelOrder" && (
                <form onSubmit={submitCancellationRequest}>
                  <h5>Cancel Order</h5>
                  <hr className="horizontal-rule" />
                  <div className="d-flex flex-column">
                    <label htmlFor="cancellationReason">
                      Cancellation Reason *
                    </label>
                    <select
                      id="cancellationReason"
                      className="cancellation-reason-dropdown-container"
                      value={selectedCancellationReasons}
                      onChange={(e) =>
                        setSelectedCancellationReason(e.target.value)
                      }
                      required
                    >
                      <option value="">Select Reason</option>
                      <option value="Order Placed By Mistake">
                        Order Placed By Mistake
                      </option>
                      <option value="Products not of good quality">
                        Products not of good quality
                      </option>
                      <option value="Not satisfied with the service">
                        Not satisfied with the service
                      </option>
                      <option value="Relocating to other city">
                        Relocating to other city
                      </option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="d-flex flex-column mt-3">
                    <label
                      className="cancellation-reason-description"
                      htmlFor="cancellation-reason-label"
                    >
                      Description *
                    </label>
                    <textarea
                      style={{
                        backgroundColor: "#DCDADA",
                        border: "none",
                        padding: "10px",
                      }}
                      rows={5}
                      id="cancellation-reason-label"
                      value={selectedCancellationDescription}
                      onChange={(e) =>
                        setSelectedCancellationDescription(e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    <button className="print-button" type="submit">
                      SAVE
                    </button>
                  </div>
                </form>
              )}
              {selectedDropdownStatusValues == "pauseOrder" && (
                <form onSubmit={handlePauseOrderSubmit}>
                  <h5>Pause Order</h5>
                  <hr className="horizontal-rule" />
                  <div className="pause-dates-container">
                    <div className="d-flex flex-column pause-order-input-fields-containers">
                      <label>Pause From *</label>
                      <input
                        className="pause-order-input-fields"
                        type="date"
                        value={selectedPauseDateFrom}
                        onChange={(e) =>
                          setSelectedPauseDateFrom(e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="d-flex flex-column pause-order-input-fields-containers">
                      <label>Pause To *</label>
                      <input
                        className="pause-order-input-fields"
                        type="date"
                        value={selectedPauseDateTo}
                        onChange={(e) => setSelectedPauseDateTo(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="m-2 d-flex flex-column">
                    <label>Pause Reason *</label>
                    <textarea
                      rows={5}
                      style={{
                        backgroundColor: "#DCDADA",
                        border: "none",
                        padding: "10px",
                      }}
                      onChange={(e) =>
                        setSelectedPauseDescription(e.target.value)
                      }
                    />
                  </div>
                  <div className="d-flex justify-content-end mt-2">
                    <button className="print-button" type="submit">
                      SAVE
                    </button>
                  </div>
                </form>
              )}
              {selectedDropdownStatusValues == "renewOrder" && (
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    className="renew-buttons"
                    onClick={() =>
                      setContinueWithSameOrderTriggered(
                        !continueWithSameOrderTriggered
                      )
                    }
                  >
                    Continue With Same Order
                  </button>
                  <Link
                    to="/edit-subscription-orders"
                    state={{ subscriptonOrderViewDetails }}
                  >
                    <button className="renew-buttons">
                      Edit Current Order
                    </button>
                  </Link>
                </div>
              )}
              {continueWithSameOrderTriggered == true && (
                <div>
                  <hr className="horizontal-rule" />
                  <h5
                    style={{
                      color: "#2C2C2C",
                      fontWeight: 600,
                      marginTop: "10px",
                    }}
                  >
                    Continuing With Same Order
                  </h5>
                  <div className="renew-payment-container">
                    <div className="d-flex flex-row align-items-center justify-content-center">
                      <div className="me-3" style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          id="onlinePayment"
                          name="paymentMode"
                          className="me-2 "
                          value="online"
                          onChange={(e) =>
                            setSelectedPaymentMode(e.target.value)
                          }
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
                          onChange={(e) =>
                            setSelectedPaymentMode(e.target.value)
                          }
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
                    <div className="d-flex flex-column align-items-start justify-content-start">
                      <lable
                        style={{
                          color: "#2C2C2C",
                          fontWeight: 600,
                          marginTop: "10px",
                          className: "h5",
                        }}
                      >
                        Total Payble
                      </lable>
                      <input
                        className="field"
                        value={
                          useWalletAmount == true &&
                          selectedPaymentMode == "online"
                            ? subscriptonOrderViewDetails &&
                              subscriptonOrderViewDetails.order.pb_discount >
                                walletBalance
                              ? subscriptonOrderViewDetails.order.pb_discount -
                                walletBalance
                              : 0
                            : subscriptonOrderViewDetails.order.pb_discount
                        }
                        readOnly
                      />
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
                          {/* <label htmlFor="appointmentTime">
                            Appointment Time*
                          </label>
                          <select
                            className="field mb-1"
                            id="appointmentTime"
                            // onChange={(e) =>
                            //   setDeliveryAppointmentTime(e.target.value)
                            // }
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
                          </select> */}
                          <p>
                            Note:{" "}
                            <span>Our Executive will visit you soon.</span>
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
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default SubscriptionOrderDetailedView;
