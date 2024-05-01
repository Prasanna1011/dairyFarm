import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import "./BlockedTransaction.css";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import { API_BASE_URL } from "customhooks/All_Api/Apis";
import { useLocation } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const BlockedTransactions = () => {
  const location = useLocation();
  const { state } = location;
  const blockedTransactionsData = state && state.results;


  return (
    <React.Fragment>
      <ProductsNavbar />
      <div className="profile-banner-container">
        <h1 className="text-light">BLOCKED TRANSACTION HISTORY</h1>
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
              <h4>Blocked Transaction History</h4>
              <hr className="horizontal-rule" />
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
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Transaction Id
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Product Name
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Quantity
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Product Name
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Debit
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {blockedTransactionsData &&
                      blockedTransactionsData.map((eachItem) => (
                        <Tr key={eachItem.id} className="text-center">
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            {eachItem.transaction}
                          </Td>
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            {eachItem.product_name}
                          </Td>
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            {eachItem.quantity}
                          </Td>
                          <Td style={{ color: "black" }} className="h6">
                            <i className="fas fa-rupee-sign"></i>
                            {" "}
                            {eachItem.product_rate}.00
                          </Td>
                          <Td style={{ color: "red" }} className="h6">
                          <i className="fas fa-rupee-sign"></i>{" "}
                            - {eachItem.debit}.00
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

export default BlockedTransactions;
