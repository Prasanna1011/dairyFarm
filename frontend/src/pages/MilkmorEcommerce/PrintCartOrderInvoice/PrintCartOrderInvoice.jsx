import React, { useEffect, useState } from "react";
import "./PrintCartOrderInvoice.css";
import { useLocation } from "react-router-dom";
import milkmorblue from "../../../assets/images/brands/milkmorblue.svg";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { API_ACCOUNT_GET_BY_ORDER_NO } from "customhooks/All_Api/Apis";

const PrintCartOrderInvoice = () => {
  const location = useLocation();
  const { state } = location;
  const orderId = state && state.orderId;
  const ecommereceConfig = GetEcommereceAuthToken();
  const [cartOrderInvoiceData, setCartOrderInvoiceData] = useState();

  const handlePrint = () => {
    document.title = "Milkmor Payment Invoice";
    window.print();
  };

  const getCartOrderInvoiceDetails = async () => {
    try {
      const { data } = await axios.get(
        `${API_ACCOUNT_GET_BY_ORDER_NO}${orderId}/`,
        ecommereceConfig
      );
      setCartOrderInvoiceData(data);
      console.log("invoice data", data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getCartOrderInvoiceDetails();
  }, []);

  return (
    <React.Fragment>
      <div className="invoice-header">
        <h3 className="text-light">Milkmor Payment Invoice</h3>
        <i className="fas fa-print print-icon" onClick={handlePrint}></i>
      </div>
      <div className="container">
        <div className="invoice-logo-container ">
          <div>
            <img
              src={milkmorblue}
              alt="invoice-logo"
              className="invoice-logo-image"
            />
          </div>
          <div>
            <h5>
              Invoice :{" "}
              {cartOrderInvoiceData && cartOrderInvoiceData.invoice.invoice_no}
            </h5>
            <h5>
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.company.company_name}
            </h5>
            <h5>
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.company.company_email}
            </h5>
            <h5>
              GSTIN :{" "}
              {cartOrderInvoiceData && cartOrderInvoiceData.company.GSTIN}
            </h5>
          </div>
        </div>
        <hr className="horizontal-rule" />
        <div className="invoice-to-container">
          <div>
            <h5>Invoice To</h5>
            <h5>
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.order.customer.first_name}{" "}
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.order.customer.last_name}
            </h5>
            <h5>
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.order.customer_address.house_no}
              ,{" "}
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.order.customer_address.society}
              ,{" "}
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.order.customer_address.landmark}
            </h5>
            <h5>
              {" "}
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.order.customer_address.city.name}{" "}
              -{" "}
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.order.customer_address.pincode.code}
            </h5>
          </div>
          <div>
            <h5>Order Info</h5>
            <h5>
              Order No :{" "}
              {cartOrderInvoiceData && cartOrderInvoiceData.order.order_id}
            </h5>
            <h5>
              Invoice Date :{" "}
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.invoice.invoice_date}
            </h5>
          </div>
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
                <Th className="text-center h5" style={{ color: "black" }}>
                  Description
                </Th>
                <Th className="text-center h5" style={{ color: "black" }}>
                  Unit Rate
                </Th>
                <Th className="text-center h5" style={{ color: "black" }}>
                  Tax Rate
                </Th>
                <Th className="text-center h5" style={{ color: "black" }}>
                  Total
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {cartOrderInvoiceData &&
                cartOrderInvoiceData.order.items.map((eachItem) => (
                  <Tr key={eachItem.id} className="text-center">
                    <Td style={{ color: "black" }} className="h6">
                      {" "}
                      {eachItem.product_name}
                    </Td>
                    <Td style={{ color: "black" }} className="h6">
                      {" "}
                      <i className="fas fa-rupee-sign"></i>{" "}
                      {eachItem.product_rate}.00
                    </Td>
                    <Td style={{ color: "black" }} className="h6">
                      {" "}
                      {eachItem.product.tax_rate.tax_name}
                    </Td>
                    <Td style={{ color: "black" }} className="h6">
                      <i className="fas fa-rupee-sign"></i>{" "}
                      {eachItem.with_tax_amount}.00
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </div>
        <div className="invoice-totals-container">
          <div>
            <h5>* Tax Included in Unit Rate</h5>
          </div>
          <div>
            <h5>
              Gross Total :{" "}
              <span style={{ color: "#3B66A0" }}>
                <i className="fas fa-rupee-sign"></i>{" "}
                {cartOrderInvoiceData &&
                  cartOrderInvoiceData.order.without_tax_amount}
              </span>
            </h5>
            <h5>
              Tax Amount :{" "}
              <span style={{ color: "#3B66A0" }}>
                <i className="fas fa-rupee-sign"></i>{" "}
                {cartOrderInvoiceData && cartOrderInvoiceData.order.total_tax}
              </span>
            </h5>
            <h5>
              Final Amount :{" "}
              <span style={{ color: "#3B66A0" }}>
                <i className="fas fa-rupee-sign"></i>{" "}
                {cartOrderInvoiceData && cartOrderInvoiceData.order.pa_discount}
                .00
              </span>
            </h5>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PrintCartOrderInvoice;
