import axios from "axios";
import { API_BASE_URL, GET_PENDING_TRANSACTIONS_DATA } from "customhooks/All_Api/Apis";
import React, { useState, useRef, useEffect } from "react";
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
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import LoaderPage from "components/Loader/LoaderPage";

const PendingTransaction = () => {
  const { config, first_name, last_name } = GetAuthToken();
  const [pendingTransactionsData, setPendingTransactionsData] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  const getPendingTransactionsData = async () => {
    try {
      const { data } = await axios.get(
        GET_PENDING_TRANSACTIONS_DATA,
        config
      );

      setPendingTransactionsData(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setLoading(false)
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getPendingTransactionsData();
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
  };

  return (
    <div className="page-content">
 {
  loading=== true ?(<LoaderPage/>):(<>
       <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <div>
                  <h3>Pending Transactions</h3>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={12}>
            <Card className="pb-5">
              <CardBody>
                <div className="table-responsive">
                  <Table className="align-middle ">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">Customer Name</th>
                        <th className="text-center">Order No</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Order Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingTransactionsData &&
                        pendingTransactionsData.map((transaction, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {transaction.customer.first_name}
                            </td>
                            <td className="text-center">
                              {transaction.razorpay_order_id}
                            </td>
                            <td className="text-center">
                              {transaction.status}
                            </td>
                            <td className="text-center">
                              {transaction.order_type}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                  <div className="d-flex justify-content-end">
                    <button
                      className="pagination-buttons-in-list"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                    <select onChange={(e) => handlePageSizeChange(e)} style={{height : "28px", marginTop: "6px"}}>
                      <option value={5}>5</option>
                      <option value={10} selected>10</option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                      <option value={100}>100</option>
                    </select>
                    <button
                      className="pagination-buttons-in-list"
                      onClick={handleNextPage}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
  </>)
 }
    </div>
  );
};

export default PendingTransaction;