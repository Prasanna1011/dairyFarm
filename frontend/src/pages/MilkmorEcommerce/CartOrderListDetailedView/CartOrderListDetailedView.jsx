import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import {
  API_BASE_URL,
  API_CART_ORDER_CANCEL,
  API_CART_ORDER_GET_BY_ID,
  API_CART_ORDER_STATUS,
} from "customhooks/All_Api/Apis";
import { Card, CardBody, CardTitle, Col, Container, Modal } from "reactstrap";
import HorizontalTimeline from "react-horizontal-timeline";
import { useNavigate } from "react-router-dom";
import "./CartOrderListDetailedView.css";

const CartOrderListDetaiedView = () => {
  const location = useLocation();
  const { state } = location;
  const orderID = state && state.orderID;
  const [orderViewData, setOrderViewDetails] = useState();
  const [orderStatusData, SetOrderStatusData] = useState();
  const [modal_center, setmodal_center] = useState(false);
  const [cancelOrderButtonClicked, setCancelOrderClickedButton] =
    useState(false);
  const [cancelOrderReasons, setCancelOrderReasons] = useState();
  const [cancelOrderDescription, setCancelOrderDescription] = useState();

  const [value, setValue] = useState(0);
  const [previous, setPrevious] = useState(0);

  console.log("orderViewData", orderViewData);

  // Values should be only date
  // const VALUES = [
  //   orderStatusData && orderStatusData.map((eachItem) => eachItem.updated_at),
  // ];
  const VALUES = orderStatusData
    ? orderStatusData.map((eachItem) => eachItem.updated_at)
    : [];

  // Description array corresponding to values
  // const description = [
  //   orderStatusData && orderStatusData.map((eachItem) => eachItem.status),
  // ];
  const description = orderStatusData
    ? orderStatusData.map((eachItem) => eachItem.status)
    : [];

  const ecommereceConfig = GetEcommereceAuthToken();
  const getOrderDetailedViewList = async () => {
    try {
      const { data } = await axios.get(
        `${API_CART_ORDER_GET_BY_ID}${orderID}/`,
        ecommereceConfig
      );
      setOrderViewDetails(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getOrderStatus = async () => {
    try {
      const { data } = await axios.get(API_CART_ORDER_STATUS, {
        params: {
          order_id: orderID,
        },
        ...ecommereceConfig,
      });
      SetOrderStatusData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      order_id: orderID,
      cancel_reason: cancelOrderReasons,
      comment: cancelOrderDescription,
    };
    try {
      const { data } = await axios.post(
        API_CART_ORDER_CANCEL,
        orderData,
        ecommereceConfig
      );
      Navigate("/cart-order-list");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderDetailedViewList();
    getOrderStatus();
  }, [orderID]);

  return (
    <React.Fragment>
      <ProductsNavbar />

      <div className="profile-banner-container">
        <h1 className="text-light">ORDER DETAILS</h1>
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
              <div className="d-flex justify-content-between">
                <h4>Order Details</h4>
                <Link
                  to="/print-cart-order-invoice"
                  state={{
                    orderId: orderViewData && orderViewData.order.order_id,
                  }}
                >
                  <button
                    className="print-button"
                    disabled={
                      orderViewData && orderViewData.order.amount_paid === null
                    }
                  >
                    Print
                  </button>
                </Link>
              </div>
              <hr className="horizontal-rule" />
              {/* <div>
                <h5>
                  Order Number : {orderViewData && orderViewData.order.order_id}
                </h5>
              </div> */}
              {/* <div className="status-heading-bar">
                <div>
                  <h5>Order Placed</h5>
                </div>
                <div>
                  <h5>In Process</h5>
                </div>
                <div>
                  <h5>Delivered</h5>
                </div>
              </div> */}
              {/* <div className="d-flex justify-content-around mt-3">
                {orderStatusData &&
                  orderStatusData.map((eachStatusData, index) => (
                    <div key={index} className="w-30">
                      <h6 className="text-center">
                        {new Date(
                          eachStatusData.created_at
                        ).toLocaleDateString()}
                      </h6>
                      <h6 className="text-center">
                        @{" "}
                        {new Date(eachStatusData.created_at).toLocaleTimeString(
                          "en-US",
                          { hour: "numeric", minute: "numeric", hour12: true }
                        )}
                      </h6>
                    </div>
                  ))}
              </div> */}
              <div
                style={{
                  width: "60%",
                  height: "100px",
                  margin: "0 auto",
                }}
              >
                <HorizontalTimeline
                  styles={{ outline: "#DFA867", foreground: "#19295C" }}
                  index={value}
                  indexClick={(index) => {
                    setValue(index);
                    setPrevious(value);
                  }}
                  values={VALUES}
                />
                <div className="text-center">{description[value]}</div>
              </div>
              <hr className="horizontal-rule" />
              <div>
                {orderViewData &&
                  orderViewData.items.map((eachOrderData, index) => (
                    <>
                      <div key={index} className="detialed-view-products-data">
                        <div className="d-flex flex-row align-items-center detailed-view-product-image-width">
                          <div>
                            <img
                              src={`${API_BASE_URL}${eachOrderData.product.profile_picture}`}
                              alt="product-image"
                              className="product-image"
                            />
                          </div>
                          <div>
                            <h6>{eachOrderData.product.product_name}</h6>
                            <h6>Qty : {eachOrderData.quantity}</h6>
                          </div>
                        </div>
                        <div className="subscription-uom-details">
                          <div>
                            <h6>UOM</h6>
                            <h6 className="text-center">{`${eachOrderData.product_uom_quantity} ${eachOrderData.product_uom_name}`}</h6>
                          </div>
                          <div>
                            <h6>Unit Rate</h6>
                            <h6 className="text-center">
                              <i className="fas fa-rupee-sign"></i>{" "}
                              {eachOrderData.product.product_rate}.00
                            </h6>
                          </div>
                          <div>
                            <h6>Tax Rate</h6>
                            <h6 className="text-center">
                              {eachOrderData.tax_name}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <hr className="horizontal-rule" />
                    </>
                  ))}
              </div>
              <div>
                <h5 className="mb-3">Delivery Address</h5>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <h6 className="mb-3">
                    Name :{" "}
                    <span>
                      {orderViewData && orderViewData.order.customer.first_name}
                    </span>
                  </h6>
                  <h6 className="mb-3">
                    Phone :{" "}
                    <span>
                      {orderViewData && orderViewData.order.customer.contact_no}
                    </span>
                  </h6>
                  <h6 className="mb-3">
                    Email :{" "}
                    <span>
                      {orderViewData && orderViewData.order.customer.email}
                    </span>
                  </h6>
                </div>
                <div>
                  <h6 className="mb-3">
                    Address :{" "}
                    <span>
                      {orderViewData &&
                        orderViewData.order.customer_address.full_address}
                    </span>
                  </h6>
                </div>
              </div>
              <hr className="horizontal-rule" />
              <div>
                <h5 className="mb-3">Payment Details</h5>
                <h6>
                  Payment Mode :{" "}
                  <span>
                    {orderViewData && orderViewData.order.payment_mode}
                  </span>
                </h6>
              </div>
              <hr className="horizontal-rule" />
              <div>
                <h5 className="mb-3">Remarks</h5>
                <h6>{orderViewData && orderViewData.order.remarks}</h6>
              </div>
              <hr className="horizontal-rule" />
              <div className="text-end">
                <h5>
                  Sub Total :{" "}
                  <span>
                    {" "}
                    <i className="fas fa-rupee-sign"></i>{" "}
                    {orderViewData && orderViewData.order.without_tax_amount}
                  </span>
                </h5>
                <h5>
                  Total Tax :{" "}
                  <span>
                    {" "}
                    <i className="fas fa-rupee-sign"></i>{" "}
                    {orderViewData && orderViewData.order.total_tax}
                  </span>
                </h5>
                <h5>
                  Final Total :{" "}
                  <span>
                    {" "}
                    <i className="fas fa-rupee-sign"></i>{" "}
                    {orderViewData && orderViewData.order.pa_discount}.00
                  </span>
                </h5>
              </div>
              <hr className="horizontal-rule" />
              {(orderViewData?.order.order_status !== "Delivered" ||
                orderViewData?.order.order_status !== "Cancelled") == true && (
                <div>
                  <button
                    className="cancel-order-button"
                    onClick={() =>
                      setCancelOrderClickedButton(!cancelOrderButtonClicked)
                    }
                    disabled={
                      orderViewData?.order.order_status == "Delivered" ||
                      orderViewData?.order.order_status == "Cancelled"
                    }
                  >
                    Cancel Order
                  </button>

                  {cancelOrderButtonClicked == true && (
                    <div className="mt-3">
                      <hr className="horizontal-rule" />
                      <form onSubmit={handleCancelSubmit}>
                        <div className="d-flex flex-column ">
                          <label htmlFor="cartCancelReasonLabel">
                            Cancel Reason *
                          </label>
                          <select
                            id="cartCancelReasonLabel"
                            className="cancellation-reason-dropdown-container"
                            value={cancelOrderReasons}
                            onChange={(e) =>
                              setCancelOrderReasons(e.target.value)
                            }
                            required
                          >
                            <option value="Order Placed By Mistake">
                              Order Placed By Mistake
                            </option>
                            <option value="Item Price is too high">
                              Item Price is too high
                            </option>
                            <option value="Need to change shipping address">
                              Need to change shipping address
                            </option>
                            <option value="Will not be available at home on the delivery date">
                              Will not be available at home on the delivery date
                            </option>
                            <option value="Expected delivery is taking too much time">
                              Expected delivery is taking too much time
                            </option>
                            <option value="Product isn't as mentioned">
                              Product isn't as mentioned
                            </option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                        <div className="d-flex flex-column mt-3">
                          <label htmlFor="cartCancelDescription">
                            Description *
                          </label>
                          <textarea
                            id="cartCancelDescription"
                            rows={5}
                            className="cancellation-reason-dropdown-container"
                            onChange={(e) =>
                              setCancelOrderDescription(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <button type="submit" className="print-button">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
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

export default CartOrderListDetaiedView;
