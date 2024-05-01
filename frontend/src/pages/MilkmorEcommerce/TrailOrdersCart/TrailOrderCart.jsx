import axios from "axios";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import {
  API_ADD_ITEMS_TO_CART,
  API_BASE_URL,
  API_DELIVERY_PATTERN_GET_BY_ID,
  UPDATE_ECOMMERCE_DELIVERY_PATTERN,
} from "customhooks/All_Api/Apis";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const TrailOrderCart = () => {
  const ecommereceConfig = GetEcommereceAuthToken();
  const token = ecommereceConfig.headers;
  const [subscriptionCartProducts, setSubscriptionCartProducts] = useState();
  const [deliveryPatterns, setDeliveryPatterns] = useState();
  const [defaultDeliveryPattern, setDefaultDeliveryPattern] = useState();
  const navigate = useNavigate();
  let userId = null;
  let Authorization = null;

  console.log("subscriptionCartProducts", subscriptionCartProducts);

  try {
    let userData = JSON.parse(localStorage.getItem("EcommerceTokenData"));
    userId = userData.userId;
    Authorization = userData.token.split(" ");
  } catch (e) {
    console.error("Error occurred while retrieving user data:", e);
  }

  const getTrailCartItems = async () => {
    try {
      const { data } = await axios.get(API_ADD_ITEMS_TO_CART, ecommereceConfig);
      if (data.error) {
        setSubscriptionCartProducts();
        navigate("/products-shop");
        toast.success("No Items In The Cart", {
          autoClose: 3000,
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          theme: "light",
        });
      } else {
        setSubscriptionCartProducts(data);
      }

      setDefaultDeliveryPattern(data?.data?.delivery_pattern);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTrailCartItem = async (id) => {
    try {
      const payload = {
        data: { cart_id: id },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `token ${Authorization}`,
        },
      };
      const { data } = await axios.delete(API_ADD_ITEMS_TO_CART, payload);

      getTrailCartItems();

      console.log(
        "Trail Cart Items in Subscription Cart",
        subscriptionCartProducts
      );
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
      setDeliveryPatterns(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedPattern = async (e) => {
    try {
      const { data } = await axios.put(
        UPDATE_ECOMMERCE_DELIVERY_PATTERN,
        {
          delivery_pattern: e.target.value,
        },
        ecommereceConfig
      );
      getTrailCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTrailCartItems();
    getDeliveryPattern();
  }, []);

  return (
    <React.Fragment>
      <ProductsNavbar />
      <ToastContainer />
      <div className="cart-banner-container">
        <h1 className="text-light">TRAIL ORDER CART</h1>
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
      <div className="container">
        <div className="subscription-items-container">
          <div className="delivery-frequency-and-duration">
            <div className="deliver-frequency-container">
              <h5>CHOOSE DELIVERY FREQUENCY</h5>
              <div className="radio-buttons-container">
                <input type="radio" defaultChecked />
                <label className="m-2">
                  {subscriptionCartProducts &&
                    subscriptionCartProducts.data.delivery_frequency
                      .day_pattern}
                </label>
              </div>
            </div>
            <div className="choose-subscription-duration-container">
              <h5>CHOOSE SUBSCRIPTION DURATION </h5>
              <div className="radio-buttons-container">
                <input type="radio" defaultChecked />
                <label className="m-2">
                  {subscriptionCartProducts &&
                    subscriptionCartProducts.data.subscription_plan.days}{" "}
                  days
                </label>
              </div>
            </div>
          </div>
          <div className="container">
            <Row>
              <Col>
                <Card className="mt-4">
                  <CardBody>
                    <div className="table-rep-plugin">
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
                                  fontSize: "14px",
                                }}
                              >
                                Remove
                              </Th>
                              <Th
                                className="text-center "
                                style={{ color: "#211E1E", fontSize: "14px" }}
                              >
                                Image
                              </Th>
                              <Th
                                className="text-center"
                                style={{ color: "#211E1E", fontSize: "14px" }}
                              >
                                Product
                              </Th>
                              <Th
                                className="text-center"
                                style={{ color: "#211E1E", fontSize: "14px" }}
                              >
                                Price
                              </Th>
                              <Th
                                className="text-center"
                                style={{ color: "#211E1E", fontSize: "14px" }}
                              >
                                Tax Rate
                              </Th>
                              <Th
                                className="text-center"
                                style={{ color: "#211E1E", fontSize: "14px" }}
                              >
                                Quantity
                              </Th>
                              <Th
                                className="text-center"
                                style={{ color: "#211E1E", fontSize: "14px" }}
                              >
                                Total
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {subscriptionCartProducts &&
                              subscriptionCartProducts.items.map(
                                (eachItem, index) => (
                                  <Tr key={index}>
                                    <Td
                                      className="text-center"
                                      style={{
                                        color: "#211E1E",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      <i
                                        className="fa fa-trash"
                                        onClick={() =>
                                          deleteTrailCartItem(eachItem.id)
                                        }
                                        style={{ cursor: "pointer" }}
                                      ></i>
                                    </Td>
                                    <Td className="text-center">
                                      <img
                                        src={`${API_BASE_URL}${eachItem.product.profile_picture}`}
                                        alt="product-image"
                                        className="cart-item-image"
                                      />
                                    </Td>
                                    <Td
                                      className="text-center"
                                      style={{
                                        verticalAlign: "middle",
                                        color: "#211E1E",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {eachItem.product.product_name}
                                    </Td>
                                    <Td
                                      className="text-center"
                                      style={{
                                        color: "#211E1E",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      <i className="fas fa-rupee-sign"></i>{" "}
                                      {eachItem.product.product_rate}.00
                                    </Td>
                                    <Td
                                      className="text-center"
                                      style={{
                                        color: "#211E1E",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      {eachItem.product.tax_rate.tax_name}
                                    </Td>
                                    <Td
                                      className="text-center"
                                      style={{
                                        color: "#211E1E",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      <input
                                        type="number"
                                        style={{ width: "50px" }}
                                        min={1}
                                        value={eachItem.qty_day1}
                                        className="text-center"
                                        //   onChange={(event) =>
                                        //     handleDayOneQuantityChange(
                                        //       event,
                                        //       eachItem.id
                                        //     )
                                        //   }
                                      />
                                    </Td>
                                    <Td
                                      className="text-center"
                                      style={{
                                        color: "#211E1E",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      <i className="fas fa-rupee-sign"></i>{" "}
                                      {eachItem.amount}.00
                                    </Td>
                                  </Tr>
                                )
                              )}
                          </Tbody>
                        </Table>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          <div className="container">
            <div className="pattern-totals-container">
              <div>
                <h5 className="mt-2">Choose Delivery Pattern</h5>
                {deliveryPatterns &&
                  deliveryPatterns.map((eachItem) => (
                    <div key={`pattern${eachItem.id}`}>
                      <input
                        type="radio"
                        id={`pattern${eachItem.id}`}
                        name="deliveryPattern"
                        className="me-2"
                        style={{ cursor: "pointer" }}
                        value={eachItem.id}
                        onChange={(e) => {
                          handleSelectedPattern(e);
                        }}
                        checked={
                          eachItem.delivery_pattern ==
                          defaultDeliveryPattern?.delivery_pattern_name
                        }
                      />
                      <label
                        htmlFor={`pattern${eachItem.id}`}
                        className="me-2  text-bold"
                        style={{ cursor: "pointer" }}
                      >
                        {eachItem.delivery_pattern}
                      </label>
                    </div>
                  ))}
              </div>
              <div className="subscription-totals-container">
                <div className="total-numbers">
                  <h5
                    style={{
                      color: "#211E1E",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    SubTotal
                  </h5>
                  <h5
                    style={{
                      color: "#3B66A0",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    ₹{" "}
                    {subscriptionCartProducts &&
                      subscriptionCartProducts.data.sub_total}
                  </h5>
                </div>
                <div className="total-numbers">
                  <h5
                    style={{
                      color: "#211E1E",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Total Tax
                  </h5>
                  <h5
                    style={{
                      color: "#3B66A0",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    ₹{" "}
                    {subscriptionCartProducts &&
                      subscriptionCartProducts.data.tax_amount}
                  </h5>
                </div>
                {subscriptionCartProducts &&
                  subscriptionCartProducts.data.delivery_charge > 0 && (
                    <div className="total-numbers">
                      <h5
                        style={{
                          color: "#211E1E",
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                      >
                        Delivery Charges
                      </h5>
                      <h5
                        style={{
                          color: "#3B66A0",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        ₹{" "}
                        {subscriptionCartProducts &&
                          subscriptionCartProducts.data.delivery_charge}
                        .00
                      </h5>
                    </div>
                  )}

                <div className="total-numbers">
                  <h5
                    style={{
                      color: "#211E1E",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Total
                  </h5>
                  <h5
                    style={{
                      color: "#3B66A0",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    ₹{" "}
                    {subscriptionCartProducts &&
                      subscriptionCartProducts.data.total}
                    .00
                  </h5>
                </div>
                <div className="d-flex w-100">
                  <Link
                    to="/checkout-trail"
                    className="w-100"
                    state={{
                      cartData: subscriptionCartProducts,
                      subtotal:
                        subscriptionCartProducts &&
                        subscriptionCartProducts.data.sub_total,
                      tax_amount:
                        subscriptionCartProducts &&
                        subscriptionCartProducts.data.tax_amount,
                      total:
                        subscriptionCartProducts &&
                        subscriptionCartProducts.data.total,
                    }}
                  >
                    <button className="proceed-to-checkout-button">
                      PROCEED TO CHECKOUT
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TrailOrderCart;
