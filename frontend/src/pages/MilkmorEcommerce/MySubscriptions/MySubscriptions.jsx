import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import "./MySubscriptions.css";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { API_BASE_URL, GET_BOTTLE_MANAGEMENT_DATA, SUBSCRIPTION_ORDER_LIST } from "customhooks/All_Api/Apis";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const MySubscription = () => {
  const ecommereceConfig = GetEcommereceAuthToken();
  const [subscriptionItemsData, setSubscriptionItemsData] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [emptyBottleData, setEmptyBottleData] = useState();

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "#007BFF"; 
      case "In-process":
        return "#6C757D";
      case "Paused":
        return "#FFC107";
      case "Active":
        return "#28A745"
      case "Expired":
        return "#17A2B8"
      case "Cancelled":
        return "#DC3545"
      case "Upcoming":
        return "#F8F9FA"
      default:
        return ""; 
    }
  };

  const getSubscriptionOrderListDetails = async () => {
    try {
      const { data } = await axios.get(
        `${SUBSCRIPTION_ORDER_LIST}${pageNumber}&page_size=${pageSize}`,
        ecommereceConfig
      );
      setSubscriptionItemsData(data.results);
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
    getSubscriptionOrderListDetails();
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

  const getBottleManagementData = async () => {
    try {
      const { data } = await axios.get(
        GET_BOTTLE_MANAGEMENT_DATA,
        ecommereceConfig
      );
      setEmptyBottleData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBottleManagementData();
  }, []);

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
        <h1 className="text-light">MY SUBSCRIPTION</h1>
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
              <h4>Subscription Orders</h4>
              <hr className="horizontal-rule" />
              <div className="bottle-management-container">
                <h6>
                  Empty Bottle Count (1L) :{" "}
                  <span style={{ color: "#3B66A0" }}>
                    {emptyBottleData && emptyBottleData.count_1l}
                  </span>
                </h6>
                <h6>
                  Empty Bottle Count (500ML) :{" "}
                  <span style={{ color: "#3B66A0" }}>
                    {emptyBottleData && emptyBottleData.count_500ml}
                  </span>
                </h6>
              </div>
              <hr className="horizontal-rule" />
              {subscriptionItemsData &&
                subscriptionItemsData.map((eachSubscriptionItem) => (
                  <div
                    className="cart-list-container"
                    key={eachSubscriptionItem.order_id}
                  >
                    <div>
                      <Link
                        to={`/subscription-order-list-detailed-view/`}
                        state={{ orderID: eachSubscriptionItem.order_id }}
                      >
                        <h6
                          style={{
                            color: "#3B66A0",
                            textDecoration: "underline",
                          }}
                        >
                          Order Number :{" "}
                          <span>{eachSubscriptionItem.order_id}</span>
                        </h6>
                      </Link>
                    </div>
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
                              className="text-center h6"
                              style={{ color: "black" }}
                            >
                              Product
                            </Th>
                            <Th
                              className="text-center h6"
                              style={{ color: "black" }}
                            >
                              Planned Quantity
                            </Th>
                            <Th
                              className="text-center h6"
                              style={{ color: "black" }}
                            >
                              Delivered Quantity
                            </Th>
                            <Th
                              className="text-center h6"
                              style={{ color: "black" }}
                            >
                              Total Days
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {eachSubscriptionItem &&
                            eachSubscriptionItem.items.map((eachProduct) => (
                              <Tr key={eachProduct.id} className="text-center">
                                <Td style={{ color: "black" }} className="h6">
                                  {" "}
                                  {eachProduct.product_name}
                                </Td>
                                <Td style={{ color: "black" }} className="h6">
                                  {eachProduct.total_planned_qty}
                                </Td>
                                <Td style={{ color: "black" }} className="h6">
                                  {eachProduct.total_delivered_qty}
                                </Td>
                                <Td style={{ color: "black" }} className="h6">
                                  {eachProduct.total_days}
                                </Td>
                              </Tr>
                            ))}
                        </Tbody>
                      </Table>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6
                            className="text-center"
                            style={{ color: "black" }}
                          >
                            Ordered On :{" "}
                            <span style={{ color: "#3B66A0" }}>
                              {eachSubscriptionItem.created_at.split("T")[0]}
                            </span>
                          </h6>
                        </div>
                        <div>
                          <h6
                            className="text-center"
                            style={{ color: "black" }}
                          >
                            Activated On: <span></span>
                          </h6>
                          <h6
                            className="text-center"
                            style={{ color: "#3B66A0" }}
                          >
                            {eachSubscriptionItem.delivery_start_date !== null
                              ? eachSubscriptionItem.delivery_start_date
                              : "Will be activated soon"}
                          </h6>
                        </div>
                        <div>
                          <h6
                            className="text-center"
                            style={{ color: "black" }}
                          >
                            Expired On:{" "}
                          </h6>
                          <h6
                            className="text-center"
                            style={{ color: "#3B66A0" }}
                          >
                            {eachSubscriptionItem.delivery_end_date !== null
                              ? eachSubscriptionItem.delivery_end_date
                              : "Details Awaited"}
                          </h6>
                        </div>
                      </div>
                      <hr className="horizontal-rule" />
                      <div className="d-flex justify-content-between">
                        <div>
                        <button
                          style={{
                            backgroundColor: getStatusColor(eachSubscriptionItem.order_status),
                            color: "white",
                            border: "none",
                            padding: "6px",
                            borderRadius: "5px",
                            width: "100px"
                          }}
                        >
                            {eachSubscriptionItem.order_status}
                          </button>
                        </div>
                        <div>
                          <h6 style={{ color: "black" }}>
                            Order Total :{" "}
                            <span style={{ color: "#3B66A0" }}>
                              <i className="fas fa-rupee-sign me-1"></i>
                              {eachSubscriptionItem.pa_discount}.00
                            </span>
                          </h6>
                        </div>
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
                    defaultValue={pageSize}
                  >
                    <option value={5}>5</option>
                    <option value={10} selected>10</option>
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

export default MySubscription;
