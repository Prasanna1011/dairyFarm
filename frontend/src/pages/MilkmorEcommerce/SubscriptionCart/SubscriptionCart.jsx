import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_BASE_URL,
  UPDATE_ECOMMERCE_DELIVERY_PATTERN,
} from "customhooks/All_Api/Apis";
import {
  API_ADD_ITEMS_TO_CART,
  API_DELIVERY_FREQUENCY_GET,
  API_TRIAL_PLAN_AND_SUBSCRIPTION_GET,
  API_CUSTOMER_SUBSCRIPTION_PLAN_VIEW,
  API_DELIVERY_PATTERN_GET_BY_ID,
  UPDATE_ECOMMERCE_DELIVERY_FREQUENCY,
  UPDATE_ECOMMERCE_SUBSCRIPTION_PLAN,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { ToastContainer, toast } from "react-toastify";
import "./SubscriptionCart.css";

const SubscriptionCart = () => {
  const config = GetAuthToken();
  const ecommereceConfig = GetEcommereceAuthToken();
  const token = ecommereceConfig.headers;
  const [subscriptionCartProducts, setSubscriptionCartProducts] = useState([]);
  const [alternateDeliveryFrequency, setAlternateDeliveryFrequency] = useState(
    []
  );
  const [dailyDeliveryFrequency, setDailyDeliveryFrequency] = useState([]);
  const [trailDuration, setTrailDuration] = useState([]);
  const [subscriptionDuration, setSubscriptionDuration] = useState([]);
  const [deliveryPatterns, setDeliveryPatterns] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState();
  const [selectedDuration, setSelectedDuration] = useState("");
  const [defaultDeliveryPattern, setDefaultDeliveryPattern] = useState();
  const [defaultFrequency, setDefaultFrequency] = useState();
  const [defaultDuration, setDefaultDuration] = useState();
  const [subTotalData, setSubTotalData] = useState();
  const [totalTaxData, setTotalTaxData] = useState();
  const [finalTotalData, setFinalTotalData] = useState();
  const [dayOneQuantity, setDayOneQuantity] = useState();
  const [dayTwoQuantity, setDayTwoQuantity] = useState();

  let userId = null;
  let Authorization = null;
  const navigate = useNavigate();

  console.log("subscriptionCartProducts", subscriptionCartProducts);

  try {
    let userData = JSON.parse(localStorage.getItem("EcommerceTokenData"));
    userId = userData.userId;
    Authorization = userData.token.split(" ");
  } catch (e) {
    console.error("Error occurred while retrieving user data:", e);
  }

  const getSubscriptionCartItems = async () => {
    try {
      const { data } = await axios.get(API_ADD_ITEMS_TO_CART, ecommereceConfig);
      console.log("subscription data items", data.error);

      setDefaultDuration(data?.data?.subscription_plan);
      setDefaultFrequency(data?.data?.delivery_frequency);
      setDefaultDeliveryPattern(data?.data?.delivery_pattern);
      setSubTotalData(data?.data?.sub_total);
      setTotalTaxData(data?.data?.tax_amount);
      setFinalTotalData(data?.data?.total);
      if (data?.error) {
        setSubscriptionCartProducts();
        navigate("/products-shop")
        toast.success("No Items In The Cart", {
          autoClose: 3000,
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          theme: "light",
        });
      } else {
        setSubscriptionCartProducts(data?.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSubscriptionCartItem = async (id) => {
    try {
      const payload = {
        data: { cart_id: id },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `token ${Authorization}`,
        },
      };
      const { data } = await axios.delete(API_ADD_ITEMS_TO_CART, payload);
      toast.success("Cart Item Deleted Successfully.", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
      getSubscriptionCartItems();
    } catch (error) {
      toast.error("Failed to Delete Cart Item.", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const getDeliveryFrequency = async () => {
    try {
      const { data } = await axios.get(
        API_DELIVERY_FREQUENCY_GET,
        ecommereceConfig
      );
      setAlternateDeliveryFrequency(data.data.alternate_day);
      setDailyDeliveryFrequency(data.data.daily_day);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubscriptionDuration = async () => {
    try {
      const { data } = await axios.get(
        API_CUSTOMER_SUBSCRIPTION_PLAN_VIEW,
        ecommereceConfig
      );
      console.log("Subscription Duration", data)
      setTrailDuration(data.data.trial_plan);
      setSubscriptionDuration(data.data.subscription_plan);
      setSelectedDuration(data.data.subscription_plan[0].days);
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

  const handleDayOneQuantityChange = async (event, id) => {
    try {
      const { data } = await axios.put(
        API_ADD_ITEMS_TO_CART,
        {
          cart_id: id,
          qty_day1: event.target.value,
          qty_day2: 0,
        },
        ecommereceConfig
      );
      getSubscriptionCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDayTwoOneQuantityChange = async (event, id, dayTwo) => {
    try {
      const { data } = await axios.put(
        API_ADD_ITEMS_TO_CART,
        {
          cart_id: id,
          qty_day1: event.target.value,
          qty_day2: dayTwo,
        },
        ecommereceConfig
      );
      getSubscriptionCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDayTwoTwoQuantityChange = async (event, id, dayOne) => {
    try {
      const { data } = await axios.put(
        API_ADD_ITEMS_TO_CART,
        {
          cart_id: id,
          qty_day2: event.target.value,
          qty_day1: dayOne,
        },
        ecommereceConfig
      );
      getSubscriptionCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedFrequency = async (e) => {
    try {
      const { data } = await axios.put(
        UPDATE_ECOMMERCE_DELIVERY_FREQUENCY,
        {
          delivery_frequency: e.target.value,
        },
        ecommereceConfig
      );
      getSubscriptionCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedDuration = async (e) => {
    try {
      const { data } = await axios.put(
        UPDATE_ECOMMERCE_SUBSCRIPTION_PLAN,
        {
          subscription_plan: e.target.value,
        },
        ecommereceConfig
      );
      getSubscriptionCartItems();
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
      getSubscriptionCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubscriptionCartItems();
    getDeliveryFrequency();
    getSubscriptionDuration();
    getDeliveryPattern();
  }, []);

  return (
    <React.Fragment>
      <ProductsNavbar />
      <ToastContainer />
      <div className="cart-banner-container">
        <h1 className="text-light">SUBSCRIPTION CART</h1>
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
                {dailyDeliveryFrequency &&
                  dailyDeliveryFrequency.map(
                    (eachItem, index) =>
                      eachItem.is_active && (
                        <div key={index}>
                          <input
                            type="radio"
                            id={`frequency${eachItem.id}`}
                            name="one"
                            className="me-2"
                            style={{ cursor: "pointer" }}
                            value={eachItem.id}
                            onChange={(e) => {
                              handleSelectedFrequency(e);
                            }}
                            checked={
                              eachItem.day_pattern ==
                              defaultFrequency?.day_pattern
                            }
                          />

                          <label
                            htmlFor={`frequency${eachItem.id}`}
                            className="me-2 h5 text-bold"
                            style={{ cursor: "pointer" }}
                          >
                            {eachItem.day_pattern}
                          </label>
                        </div>
                      )
                  )}
                {alternateDeliveryFrequency &&
                  alternateDeliveryFrequency.map(
                    (eachItem, index) =>
                      eachItem.is_active && (
                        <div key={index}>
                          <input
                            type="radio"
                            id={eachItem.id}
                            name="one"
                            className="me-2"
                            style={{ cursor: "pointer" }}
                            value={eachItem.id}
                            onChange={(e) => {
                              handleSelectedFrequency(e);
                            }}
                            checked={
                              eachItem.day_pattern ==
                              defaultFrequency?.day_pattern
                            }
                          />
                          <label
                            htmlFor={eachItem.id}
                            className="me-2 h5 text-bold"
                            style={{ cursor: "pointer" }}
                          >
                            {eachItem.day_pattern}
                          </label>
                        </div>
                      )
                  )}
              </div>
            </div>
            <div className="choose-subscription-duration-container">
              <h5>CHOOSE SUBSCRIPTION DURATION </h5>
              <div className="radio-buttons-container">
                {subscriptionDuration &&
                  subscriptionDuration.map(
                    (eachItem, index) =>
                      eachItem.is_active && (
                        <div key={index}>
                          <input
                            type="radio"
                            id={eachItem.id}
                            name="subscriptionDuration"
                            className="me-2"
                            style={{ cursor: "pointer" }}
                            value={eachItem.id}
                            onChange={(e) => {
                              handleSelectedDuration(e);
                            }}
                            checked={eachItem.days == defaultDuration?.days}
                          />
                          <label
                            htmlFor={eachItem.id}
                            className="me-2 h5 text-bold"
                            style={{ cursor: "pointer" }}
                          >
                            {eachItem.days} days
                          </label>
                        </div>
                      )
                  )}
              </div>
            </div>
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
                            Quantity / Day
                          </Th>
                          <Th
                            className="text-center"
                            style={{ color: "#211E1E", fontSize: "14px" }}
                          >
                            Days
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
                          subscriptionCartProducts.map((eachItem) => (
                            <Tr key={eachItem.id}>
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
                                    deleteSubscriptionCartItem(eachItem.id)
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
                                  color: "#211E1E",
                                  fontSize: "15px",
                                  fontWeight: "500",
                                  verticalAlign: "middle",
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
                              {defaultFrequency?.day_pattern == "Daily" ? (
                                <>
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
                                      onChange={(event) =>
                                        handleDayOneQuantityChange(
                                          event,
                                          eachItem.id
                                        )
                                      }
                                    />
                                  </Td>
                                </>
                              ) : (
                                <>
                                  <Td
                                    className="text-center "
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
                                      className="me-1"
                                      onChange={(event) =>
                                        handleDayTwoOneQuantityChange(
                                          event,
                                          eachItem.id,
                                          eachItem.qty_day2
                                        )
                                      }
                                    />
                                    <input
                                      type="number"
                                      style={{ width: "50px" }}
                                      min={0}
                                      value={eachItem.qty_day2}
                                      onChange={(event) =>
                                        handleDayTwoTwoQuantityChange(
                                          event,
                                          eachItem.id,
                                          eachItem.qty_day1
                                        )
                                      }
                                    />
                                  </Td>
                                </>
                              )}
                              <Td
                                className="text-center"
                                style={{
                                  color: "#211E1E",
                                  fontSize: "15px",
                                  fontWeight: "500",
                                  verticalAlign: "middle",
                                }}
                              >
                                {defaultDuration?.days}
                              </Td>
                              <Td
                                className="text-center"
                                style={{
                                  color: "#211E1E",
                                  fontSize: "15px",
                                  fontWeight: "700",
                                  verticalAlign: "middle",
                                  color: "#3B66A0",
                                }}
                              >
                                ₹ {eachItem.amount}.00
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                    <div>
                      <Link to="/products-shop">
                        <button
                          style={{
                            backgroundColor: "#3B66A0",
                            color: "white",
                            border: "none",
                            padding: "12px",
                            borderRadius: "20px",
                          }}
                        >
                          ADD MORE PRODUCTS
                        </button>
                      </Link>
                    </div>
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
            <h5>Choose Delivery Pattern</h5>
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
                    className="me-2 h5 text-bold"
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
                SubTotals
              </h5>
              <h5
                style={{
                  color: "#3B66A0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                ₹ {subTotalData}
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
                ₹ {totalTaxData}
              </h5>
            </div>
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
                ₹ {finalTotalData}.00
              </h5>
            </div>
            <div className="d-flex w-100">
              <Link
                to="/checkout"
                className="w-100"
                state={{
                  cartData: subscriptionCartProducts,
                  subtotal: subTotalData,
                  tax_amount: totalTaxData,
                  total: finalTotalData,
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
      <Footer />
    </React.Fragment>
  );
};

export default SubscriptionCart;
