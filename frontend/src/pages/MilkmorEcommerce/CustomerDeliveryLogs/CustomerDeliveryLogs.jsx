import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import "./CustomerDeliveryLogs.css";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import { useLocation } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
  API_BASE_URL,
  GET_ECOMMERCE_CUSTOMER_SUBSCRIPTION_ORDER_LOGS,
  UPDATE_ECOMMERCE_CUSTOMER_SUBSCRIPTION_ORDER_LOGS,
} from "customhooks/All_Api/Apis";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";

const CustomerDeliveryLogs = () => {
  const { state } = useLocation();
  const ecommereceConfig = GetEcommereceAuthToken();
  const orderID = state && state.id;
  const deliveryDuration = state && state.duration;
  const [deliveryLogsData, setDeliveryLogsData] = useState();
  const [selectedProductData, setSelectedProductData] = useState();
  const todayDate = new Date().toLocaleDateString();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 8);
  const formattedSevenDate = sevenDaysLater.toLocaleDateString();

  // useEffect(() => {
  //   const getDeliveryLogsData = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${GET_ECOMMERCE_CUSTOMER_SUBSCRIPTION_ORDER_LOGS}${orderID}/`,
  //         ecommereceConfig
  //       );
  //       console.log("Delivery Logs Data", data);
  //       {
  //         if (data.message) {
  //           setDeliveryLogsData();
  //         } else {
  //           setDeliveryLogsData(data);
  //         }
  //       }

  //       if (data && data.length > 0) {
  //         setSelectedProductData(data[0].product_name);
  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };

  //   getDeliveryLogsData();
  // }, [orderID]);

  // const handleDailyQuantityChange = async (id, e) => {
  //   const updateData = {
  //     log_id: id,
  //     ordered_qty: e.target.value,
  //   };
  //   try {
  //     const { data } = await axios.put(
  //       UPDATE_ECOMMERCE_CUSTOMER_SUBSCRIPTION_ORDER_LOGS,
  //       updateData,
  //       ecommereceConfig
  //     );
  //     getDeliveryLogsData();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getDeliveryLogsData = async () => {
    try {
      const { data } = await axios.get(
        `${GET_ECOMMERCE_CUSTOMER_SUBSCRIPTION_ORDER_LOGS}${orderID}/`,
        ecommereceConfig
      );
      console.log("Delivery Logs Data", data);
      {
        if (data.message) {
          setDeliveryLogsData();
        } else {
          setDeliveryLogsData(data);
        }
      }
  
      if (data && data.length > 0) {
        setSelectedProductData(data[0].product_name);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  
  useEffect(() => {
    getDeliveryLogsData();
  }, [orderID]);
  
  const handleDailyQuantityChange = async (id, e) => {
    const updateData = {
      log_id: id,
      ordered_qty: e.target.value,
    };
    try {
      const { data } = await axios.put(
        UPDATE_ECOMMERCE_CUSTOMER_SUBSCRIPTION_ORDER_LOGS,
        updateData,
        ecommereceConfig
      );
      getDeliveryLogsData();
    } catch (error) {
      console.log(error);
    }
  };

  const productsName =
    deliveryLogsData && deliveryLogsData.map((product) => product.product_name);

  const filteredProductsData =
    deliveryLogsData &&
    deliveryLogsData.filter(
      (product) => product.product_name == selectedProductData
    );

  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
        <h1 className="text-light">DELIVERY LOGS</h1>
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
                <h4 className="mb-0 text-dark">Delivery Logs Table</h4>
              </div>
              <hr className="horizontal-rule" />
              <div className="d-flex align-items-center justify-content-between">
                <select
                  className="delivery-log-product-filter-field"
                  onChange={(e) => setSelectedProductData(e.target.value)}
                >
                  {productsName &&
                    productsName.map((eachProduct, index) => (
                      <option key={index} value={eachProduct}>
                        {eachProduct}
                      </option>
                    ))}
                </select>
                <h5>Total Days : {deliveryDuration} </h5>
              </div>
              <div
                className="table-responsive mb-0 mt-2 mb-2"
                data-pattern="priority-columns"
              >
                <Table
                  id="tech-companies-1"
                  className="table table-striped table-bordered"
                >
                  <Thead>
                    <Tr>
                      <Th className="text-center" style={{ color: "black" }}>
                        Date
                      </Th>
                      <Th className="text-center" style={{ color: "black" }}>
                        Time
                      </Th>
                      <Th className="text-center" style={{ color: "black" }}>
                        D.Boy
                      </Th>
                      <Th className="text-center" style={{ color: "black" }}>
                        Rate
                      </Th>
                      <Th className="text-center" style={{ color: "black" }}>
                        Ordered Qty
                      </Th>
                      <Th className="text-center" style={{ color: "black" }}>
                        Delivered Qty
                      </Th>
                      <Th className="text-center" style={{ color: "black" }}>
                        Remarks
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Th colSpan={3} className="text-center">
                        Total
                      </Th>
                      <Th className="text-center">
                        <i className="fas fa-rupee-sign"></i>{" "}
                        {filteredProductsData &&
                          filteredProductsData[0].product_rate}
                        .00
                      </Th>
                      <Th className="text-center">
                        {filteredProductsData &&
                          filteredProductsData[0].total_ordered_qty}{" "}
                        Qty.
                      </Th>
                      <Th className="text-center">
                        {(filteredProductsData &&
                          filteredProductsData[0].total_delivered_qty) ||
                          0}{" "}
                        Qty.
                      </Th>
                    </Tr>
                    {filteredProductsData &&
                      filteredProductsData[0].logs.map((eachItem) => (
                        <Tr key={eachItem.id}>
                          <Td className="text-center">{eachItem.assign_at}</Td>
                          <Td className="text-center">
                            {eachItem.delivered_time
                              ? eachItem.delivered_time
                              : "-"}
                          </Td>
                          <Td className="text-center">
                            {eachItem?.delivery_boy?.first_name
                              ? eachItem.delivery_boy.first_name + " " + eachItem.delivery_boy.last_name
                              : "-"}
                          </Td>
                          <Td className="text-center">
                            <i className="fas fa-rupee-sign"></i>{" "}
                            {eachItem.product.product_rate}.00
                          </Td>
                          <Td className="text-center">
                            {todayDate <
                              new Date(
                                eachItem.assign_at
                              ).toLocaleDateString() &&
                            new Date(eachItem.assign_at).toLocaleDateString() <
                              formattedSevenDate ? (
                              <input
                                value={eachItem.ordered_qty}
                                type="number"
                                className="input-number"
                                min={0}
                                onChange={(e) =>
                                  handleDailyQuantityChange(eachItem.id, e)
                                }
                              />
                            ) : (
                              eachItem.ordered_qty
                            )}
                          </Td>

                          <Td className="text-center">
                            {eachItem.delivered_qty
                              ? eachItem.delivered_qty
                              : "-"}
                          </Td>
                          <Td className="text-center">
                            {eachItem.remarks ? eachItem.remarks : "-"}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default CustomerDeliveryLogs;
