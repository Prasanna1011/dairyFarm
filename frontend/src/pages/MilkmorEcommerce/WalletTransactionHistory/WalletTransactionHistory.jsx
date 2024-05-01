import React, { useEffect, useState } from "react";
import ProductsNavbar from "components/EcommerceMilkMor/ProductsNavBar/ProductsNavbar";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import { Link } from "react-router-dom";
import "./WalletTransactionHistory.css";
import CommonProfileComponent from "components/EcommerceMilkMor/CommonProfileComponent/CommonProfileComponent";
import GetEcommereceAuthToken from "customhooks/EcommereceTokenVerification/EcommereceAuthToken";
import axios from "axios";
import { API_BASE_URL, CUSTOMER_WALLET_TRANSACTIONS } from "customhooks/All_Api/Apis";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const WalletTransactionHistory = () => {
  const [walletTransactions, setWalletTransactions] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const ecommereceConfig = GetEcommereceAuthToken();
  const userDetailsData = JSON.parse(
    localStorage.getItem("EcommerceTokenData")
  );
  const userId = userDetailsData.userId;
  const getWalletTransactionsData = async () => {
    try {
      const { data } = await axios.get(
        `${CUSTOMER_WALLET_TRANSACTIONS}${userId}&page=${pageNumber}&page_size=${pageSize}`,
        ecommereceConfig
      );
      setWalletTransactions(data.results);
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
      console.log("error", error);
    }
  };

  useEffect(() => {
    getWalletTransactionsData();
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
        <h1 className="text-light">WALLET TRANSACTION HISTORY</h1>
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
              <h4>Wallet Transactions</h4>
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
                        Credit
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Debit
                      </Th>
                      <Th className="text-center h6" style={{ color: "black" }}>
                        Paid On
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {walletTransactions &&
                      walletTransactions.map((eachItem) => (
                        <Tr
                          key={eachItem.transaction_id}
                          className="text-center"
                        >
                          <Td style={{ color: "black" }} className="h6">
                            {" "}
                            {eachItem.transaction_id}
                          </Td>
                          <Td style={{ color: "green" }} className="h6">
                            <i className="fas fa-rupee-sign"></i>{" "}
                            {eachItem.credit}.00
                          </Td>
                          <Td style={{ color: "red" }} className="h6">
                            <i className="fas fa-rupee-sign"></i>{" "}
                            {eachItem.debit}.00
                          </Td>
                          <Td style={{ color: "black" }} className="h6">
                            {new Date(eachItem.created_at).toLocaleDateString(
                              "en-US"
                            )}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
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

export default WalletTransactionHistory;
