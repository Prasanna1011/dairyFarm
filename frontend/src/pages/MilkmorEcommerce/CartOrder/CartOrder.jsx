import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import { API_BASE_URL } from "../../../customhooks/All_Api/Apis";
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { API_ADD_ITEMS_TO_CART } from "../../../customhooks/All_Api/Apis";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "./CartOrder.css";

const CartOrder = () => {
  const [cartData, setCartData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const navigate = useNavigate();
  let Authorization = null;


  try {
    let userData = JSON.parse(localStorage.getItem("EcommerceTokenData"));
    Authorization = userData.token.split(" ");
  } catch (e) {
    console.error("Error occurred while retrieving user data:", e);
  }

  const ecommereceConfig = GetEcommereceAuthToken();
  const getCartItems = async () => {
    try {
      const { data } = await axios.get(API_ADD_ITEMS_TO_CART, ecommereceConfig);
      console.log("Cart order cart data", data);
      if (data.error) {
        setCartData();
        navigate("/products-shop");
        toast.success("No Items In The Cart", {
          autoClose: 3000,
          position: "top-center",
          closeOnClick: true,
          draggable: true,
          theme: "light",
        });
      }
      setCartData(data.items);
      setPriceData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCartItem = async (id) => {
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
      getCartItems();
    } catch (error) {
      toast.error("Failed to delete Cart Item.", {
        autoClose: 3000,
        position: "top-center",
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <React.Fragment>
      <ProductsNavbar />
      <ToastContainer />
      <div className="cart-banner-container">
        <h1 className="text-light">CART ORDER</h1>
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
                        {cartData &&
                          cartData.map((eachItem) => (
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
                                  onClick={() => deleteCartItem(eachItem.id)}
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
                                  fontWeight: "600",
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
                                style={{ verticalAlign: "middle" }}
                              >
                                <div className="d-flex flex-row align-items-center justify-content-center">
                                  <i
                                    className="fas fa-minus-circle"
                                    style={{
                                      color: "#3B66A0",
                                      fontSize: "20px",
                                      cursor: "pointer",
                                    }}
                                    onClick={async () => {
                                      if (eachItem.qty_day1 > 1) {
                                        let newQuantity = eachItem.qty_day1 - 1;

                                        const { data } = await axios.put(
                                          API_ADD_ITEMS_TO_CART,
                                          {
                                            cart_id: eachItem.id,
                                            qty_day1: newQuantity,
                                            qty_day2: 0,
                                          },
                                          ecommereceConfig
                                        );
                                      }
                                      getCartItems();
                                    }}
                                  ></i>
                                  <p className="quantity-number">
                                    {eachItem.qty_day1}
                                  </p>
                                  <i
                                    className="fas fa-plus-circle"
                                    style={{
                                      color: "#3B66A0",
                                      fontSize: "20px",
                                      cursor: "pointer",
                                    }}
                                    onClick={async () => {
                                      let newQuantity = eachItem.qty_day1 + 1;

                                      const { data } = await axios.put(
                                        API_ADD_ITEMS_TO_CART,
                                        {
                                          cart_id: eachItem.id,
                                          qty_day1: newQuantity,
                                          qty_day2: 0,
                                        },
                                        ecommereceConfig
                                      );
                                      getCartItems();
                                    }}
                                  ></i>
                                </div>
                              </Td>
                              <Td
                                className="text-center"
                                style={{
                                  color: "#3B66A0",
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  verticalAlign: "middle",
                                }}
                              >
                                <i className="fas fa-rupee-sign"></i>{" "}
                                {eachItem.amount}.00
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
                    <div className="total-amount">
                      <div className="total-amount-items">
                        <div className="d-flex flex-row align-items-center justify-content-between">
                          <p
                            className="text-center"
                            style={{
                              color: "#211E1E",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            Subtotal
                          </p>
                          <p
                            className="text-center"
                            style={{
                              color: "#3B66A0",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            <i className="fas fa-rupee-sign"></i>{" "}
                            {priceData && priceData.sub_total}
                          </p>
                        </div>
                        <div className="d-flex flex-row align-items-center justify-content-between">
                          <p
                            className="text-center"
                            style={{
                              color: "#211E1E",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            Total Tax
                          </p>
                          <p
                            className="text-center"
                            style={{
                              color: "#3B66A0",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            <i className="fas fa-rupee-sign"></i>{" "}
                            {priceData && priceData.tax_amount}
                          </p>
                        </div>
                        <div className="d-flex flex-row align-items-center justify-content-between">
                          <p
                            className="text-center"
                            style={{
                              color: "#211E1E",
                              fontSize: "16px",
                              fontWeight: "700",
                            }}
                          >
                            Total
                          </p>
                          <p
                            className="text-center "
                            style={{
                              color: "#3B66A0",
                              fontSize: "16px",
                              fontWeight: "700",
                            }}
                          >
                            <i className="fas fa-rupee-sign"></i>{" "}
                            {priceData && priceData.total}.00
                          </p>
                        </div>
                        <div className="d-flex w-100">
                          <Link
                            to="/cart-order-checkout"
                            className="w-100"
                            state={{
                              cartData: cartData,
                              subtotal: priceData && priceData.sub_total,
                              tax_amount: priceData && priceData.tax_amount,
                              deliveryCharge: priceData && priceData.delivery_charge,
                              total: priceData && priceData.total,
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default CartOrder;
