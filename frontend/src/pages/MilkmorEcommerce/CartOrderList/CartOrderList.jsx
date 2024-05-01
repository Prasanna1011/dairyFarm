import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import "./CartOrderList.css";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import {
  API_BASE_URL,
  ECOMMERCE_CUSTOMER_CART_ORDER_LIST,
} from "customhooks/All_Api/Apis";

const CartOrderList = () => {
  const ecommereceConfig = GetEcommereceAuthToken();
  const [cartItemsData, setCartItemsData] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#007BFF"; 
      case "In-process":
        return "#6C757D";
      case "Attempted":
        return "#FFC107";
      case "Delivered":
        return "#28A745"
      case "Cancelled":
        return "#DC3545"
      default:
        return ""; 
    }
  };

  const getCartOrderListDetails = async () => {
    try {
      const { data } = await axios.get(
        `${ECOMMERCE_CUSTOMER_CART_ORDER_LIST}${pageNumber}&page_size=${pageSize}`,
        ecommereceConfig
      );
      setCartItemsData(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      const totalPages = Math.ceil(data.count / pageSize);

      let startPage = Math.max(1, pageNumber - 1);
      let endPage = Math.min(totalPages, startPage + 2);

      if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
      }

      setVisiblePageNumbers(
        [...Array(endPage - startPage + 1)].map((_, index) => startPage + index)
      );
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

  useEffect(() => {
    getCartOrderListDetails();
  }, [pageNumber, pageSize]);

  const handleNextPage = () => {
    if (nextPage) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = e.target.value;
    setPageSize(newSize);
    setPageNumber(1);
  };

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
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
      <div className="profile-content-container">
        <div className="container">
          <div className="profile-content-layout">
            <div className="left-component">
              <CommonProfileComponent />
            </div>
            <div className="right-component">
              <h4>Cart Orders</h4>
              <hr className="horizontal-rule" />
              {cartItemsData &&
                cartItemsData.map((eachCartItem) => (
                  <div
                    className="cart-list-container"
                    key={eachCartItem.order_id}
                  >
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <h6 style={{ color: "black" }}>
                          Order Number : <span>{eachCartItem.order_id}</span>
                        </h6>
                      </div>
                      <div>
                        <Link
                          to={`/cart-order-list-detailed-view/`}
                          state={{ orderID: eachCartItem.order_id }}
                        >
                          <h6
                            style={{
                              cursor: "pointer",
                              color: "#3B66A0",
                              textDecoration: "underline",
                            }}
                          >
                            Order Details
                          </h6>
                        </Link>
                      </div>
                    </div>
                    <div className="ordered-user-details-container">
                      <div className="d-flex flex-row me-2">
                        <i
                          className="fas fa-calendar-alt me-1"
                          style={{ color: "#3B66A0" }}
                        ></i>
                        <h6 style={{ color: "black" }}>
                          {eachCartItem.created_at.split("T")[0]}
                        </h6>
                      </div>
                      <i className="fas fa-grip-lines-vertical me-2"></i>
                      <div className="d-flex flex-row me-2">
                        <i
                          className="fas fa-user me-1"
                          style={{ color: "#3B66A0" }}
                        ></i>
                        <h6 style={{ color: "black" }}>
                          {eachCartItem.customer.first_name}
                        </h6>
                      </div>
                      <i className="fas fa-grip-lines-vertical me-2"></i>
                      <div className="d-flex flex-row me-2">
                        <i
                          className="fas fa-phone-alt me-1"
                          style={{ color: "#3B66A0" }}
                        ></i>
                        <h6 style={{ color: "black" }}>
                          {eachCartItem.customer.contact_no}
                        </h6>
                      </div>
                    </div>
                    <hr className="horizontal-rule" />

                    {eachCartItem.items.map((eachProduct, index) => (
                      <>
                        <div
                          className="order-details-contaniner w-100 "
                          key={index}
                        >
                          <div className="d-flex flex-row align-items-center product-name-img-container">
                            <img
                              src={`${API_BASE_URL}${eachProduct.product.profile_picture}`}
                              alt="product-image"
                              className="product-image"
                            />
                            <h6 style={{ color: "black" }}>
                              {eachProduct.product.product_name}
                            </h6>
                          </div>
                          <div className="d-flex align-items-center justify-content-between w-50">
                            <div>
                              <h6 style={{ color: "black" }}>Total Qty : </h6>
                              <h6
                                style={{ color: "#3B66A0" }}
                                className="text-center"
                              >
                                {" "}
                                {eachProduct.quantity}
                              </h6>
                            </div>
                            <div>
                              <h6 style={{ color: "black" }}>Total Amount :</h6>
                              <h6
                                style={{ color: "#3B66A0" }}
                                className="text-center"
                              >
                                {" "}
                                <i className="fas fa-rupee-sign"></i>{" "}
                                {eachProduct.with_tax_amount}.00
                              </h6>
                            </div>
                          </div>
                        </div>
                        <hr className="horizontal-rule" />
                      </>
                    ))}
                    <div className="d-flex justify-content-between">
                      <div className="ms-2">
                        <button
                          style={{
                            backgroundColor: getStatusColor(eachCartItem.order_status),
                            color: "white",
                            border: "none",
                            padding: "6px",
                            borderRadius: "5px",
                            width: "100px"
                          }}
                        >
                          {eachCartItem.order_status}
                        </button>
                      </div>
                      <div className="me-2">
                        <h6 style={{ color: "#3B66A0" }}>
                          Order Total :{" "}
                          <span>
                            {" "}
                            <i className="fas fa-rupee-sign"></i>{" "}
                            {eachCartItem.pa_discount}.00
                          </span>
                        </h6>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="d-flex justify-content-between">
                <div>
                  <span className=" text-dark ms-4 me-1">Showing</span>
                  <select
                    onChange={(e) => handlePageSizeChange(e)}
                    style={{ height: "20px", marginTop: "4px" }}
                    value={pageSize}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={100}>100</option>
                  </select>
                  <span className=" text-dark m-1">Items per page</span>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-primary m-1"
                    onClick={handlePreviousPage}
                  >
                    Previous
                  </button>
                  {visiblePageNumbers.map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm btn-primary m-1 ${
                        page === pageNumber ? "active" : ""
                      }`}
                      onClick={() => setPageNumber(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="btn btn-sm btn-primary m-1 me-4"
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default CartOrderList;
