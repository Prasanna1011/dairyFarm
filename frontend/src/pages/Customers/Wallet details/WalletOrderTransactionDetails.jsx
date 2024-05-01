import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ECOMMERCE_CUSTOMER_BLOCKED_TRANSACTIONS,
  ECOMMERCE_CUSTOMER_BLOCKED_TRANSACTION_DETAILS,
} from "customhooks/All_Api/Apis";
import { useLocation } from "react-router-dom";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { TablePagination } from "@mui/material";

const WalletOrderTransactionDetails = () => {
    const { config, first_name, last_name } = GetAuthToken();
  const location = useLocation();
  const [walletOrderTransactionData, setWalletOrderTransactionData] =
    useState();
  const [
    walletOrderTransactionDetailedData,
    setWalletOrderTransactionDetailedData,
  ] = useState();
  const [popupNextPage, setPopupNextPage] = useState();
  const [popupPreviousPage, setPopupPreviousPage] = useState();
  const [popupPageNumber, setPopupPageNumber] = useState();
  const [popupPageSize, setPopupPageSize] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [modal_center, setmodal_center] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const { id } = location && location.state;

  console.log(
    "walletOrderTransactionDetailedData",
    walletOrderTransactionDetailedData
  );

   const getWalletOrderTransactions = async () => {
    try {
      const { data } = await axios.get(`${ECOMMERCE_CUSTOMER_BLOCKED_TRANSACTIONS}${id}`, {
        ...config,
        params: { page, page_size: pageSize },
      });
      setWalletOrderTransactionData(data.results);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (error) {
      console.log(error);
    }
  };


  const getWalletTransactionsDetails = async (id) => {
    try {
      const { data } = await axios.get(
        `${ECOMMERCE_CUSTOMER_BLOCKED_TRANSACTION_DETAILS}${id}`,
        config
      );
      setWalletOrderTransactionDetailedData(data.results);
      setPopupNextPage(data.next);
      setPopupPreviousPage(data.previous);
    } catch (error) {
      console.log(error);
    }
  };

  
 

  const handlePopUpPreviousPage = () => {
    if (popupPreviousPage) {
      setPopupPreviousPage(popupPageNumber - 1);
    }
  };

  function tog_center() {
    setmodal_center(!modal_center);
  }


  useEffect(() => {
    getWalletOrderTransactions();
  }, [page, pageSize]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(1);
  };

  return (
    <div className="page-content">
      <Container fluid={true}>
      <Row>
          <Col xl={12}>
            <Card className="">
              <CardBody className="">
                <div className="d-flex justify-content-between w-100">
                  <h3>Wallet Transaction Details</h3>
                
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="">
                <div className="table-responsive">
                  <Table className="align-middle ">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">Transaction Id</th>
                        <th className="text-center">Order Id</th>
                        <th className="text-center">Order Amount</th>
                        <th className="text-center">Available Order Amount</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletOrderTransactionData &&
                        walletOrderTransactionData.map((transaction, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {transaction.transaction_id}
                            </td>
                            <td className="text-center">
                              {transaction.order_id}
                            </td>
                            <td className="text-center">
                              {transaction.amount}
                            </td>
                            <td className="text-center">
                              {transaction.available_amount}
                            </td>
                            <td className="text-center">
                              <button
                                className="edit-button btn btn-sm btn-info me-1"
                                onClick={() => {
                                  getWalletTransactionsDetails(
                                    transaction.transaction_id
                                  );
                                  tog_center();
                                }}
                              >
                                <i className="fas fa-info-circle"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                 
                </div>
              </CardBody>
              <TablePagination
                className="d-flex justify-content-start"
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={totalPages * pageSize}
                rowsPerPage={pageSize}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Col>
        </Row>

          <Modal
          isOpen={modal_center}
          toggle={() => {
            tog_center();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Wallet Transaction Details</h5>
          </div>
          <div className="modal-body">
            <div className="table-responsive">
              <Table className="align-middle ">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Product Name</th>
                    <th className="text-center">Debit</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {walletOrderTransactionDetailedData &&
                    walletOrderTransactionDetailedData.map(
                      (transaction, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {transaction.product_name}
                          </td>
                          <td className="text-center">{transaction.debit}</td>
                          <td className="text-center">
                            {transaction.quantity}
                          </td>
                          <td className="text-center">
                            {transaction.updated_at.split("T")[0]}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </Table>
              {/* <div className="d-flex justify-content-end">
                <button
                  className="pagination-buttons-in-list"
                  onClick={handlePopUpPreviousPage}
                >
                  Previous
                </button>
                <button
                  className="pagination-buttons-in-list"
                  onClick={handlePopUpNextPage}
                >
                  Next
                </button>
              </div> */}
            </div>
          </div>
        </Modal>
      </Container>
    </div>
  );
};

export default WalletOrderTransactionDetails;