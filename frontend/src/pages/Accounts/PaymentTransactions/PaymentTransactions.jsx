import axios from "axios";
import {
  API_BASE_URL,
  GET_PAYMENT_DATA,
  POST_PAYMENT_TRANSACTIONS_REFERENCE,
} from "customhooks/All_Api/Apis";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import LoaderPage from "components/Loader/LoaderPage";

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
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const PaymentTransactions = () => {
  const { config, first_name, last_name } = GetAuthToken();
  const [paymentTransactionsData, setPaymentTransactionsData] = useState();
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [addReferenceNumberClick, setAddReferenceNumberClick] = useState();
  const [modal_center, setmodal_center] = useState(false);
  const [filterClicked, setFilterClicked] = useState(false);
  const [searchByIdOrCustomerToggle, setSearchByIdOrCustomerToggle] =
    useState(false);
  const [searchByIdOrCustomer, setSearchByIdOrCustomer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  const getPaymentsData = async () => {
    try {
      const { data } = await axios.get(
        `${GET_PAYMENT_DATA}${pageNumber}&page_size=${pageSize}&customer_or_order_id&from_date=${fromDate}&to_date=${toDate}&customer_or_order_id=${searchByIdOrCustomer}`,
        config
      );

      setPaymentTransactionsData(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setLoading(false);
    } catch (error) {
      return error;
    }
  };

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

  function tog_center(id) {
    setmodal_center(!modal_center);
    setAddReferenceNumberClick(id);
  }

  const validationSchema = Yup.object({
    reference_number: Yup.string().required("Reference Number is required"),
  });

  const formik = useFormik({
    initialValues: {
      reference_number: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let { reference_number } = values;
      console.log("values log", reference_number);
      const dataToSubmit = {
        id: addReferenceNumberClick,
        reference_number: reference_number,
      };
      try {
        const { data } = await axios.post(
          POST_PAYMENT_TRANSACTIONS_REFERENCE,
          dataToSubmit,
          config
        );
        getPaymentsData();
        setmodal_center(false);
      } catch (error) {
        return error;
      }
    },
  });

  useEffect(() => {
    getPaymentsData();
  }, [pageNumber, pageSize, fromDate, toDate, searchByIdOrCustomer]);

  return (
    <div className="page-content">
      {loading === true ? (
        <LoaderPage />
      ) : (
        <>
          <Container fluid={true}>
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody className="d-flex justify-content-between">
                    <div className={filterClicked ? "d-none" : ""}>
                      <h3>Payment Transactions</h3>
                    </div>
                    <div
                      className={
                        filterClicked ? "d-flex align-items-center" : "d-none"
                      }
                    >
                      <div className="d-flex flex-column w-100">
                        <label>Select From Day</label>
                        <Flatpickr
                          id="joined_on"
                          name="joined_on"
                          placeholder="dd-mm-yyyy"
                          className="field"
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                          onChange={(selectedDates, dateStr) =>
                            setFromDate(dateStr)
                          }
                        />
                      </div>
                      <div className="d-flex flex-column w-100 ms-2">
                        <label>Select To Day</label>
                        <Flatpickr
                          id="joined_on"
                          name="joined_on"
                          placeholder="dd-mm-yyyy"
                          className="field"
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                          onChange={(selectedDates, dateStr) =>
                            setToDate(dateStr)
                          }
                        />
                      </div>
                      <div>
                        <button
                          className="btn btn-danger mt-4 ms-3"
                          onClick={() => {
                            setFilterClicked(false);
                            setFromDate("");
                            setToDate("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className={filterClicked ? "d-none" : ""}>
                      <div className="d-flex align-items-center">
                        {" "}
                        {/* Added container for filter button and search input */}
                        <Button className="px-3 me-2" color="primary">
                          Dailywise Sales Export
                        </Button>
                        <Button className="px-3 me-2" color="primary">
                          Export
                        </Button>
                        <Button
                          className="px-3 me-2"
                          color="primary"
                          onClick={() => setFilterClicked(!filterClicked)}
                        >
                          Filter
                        </Button>
                        {searchByIdOrCustomerToggle === true ? (
                          <>
                            <Input
                              name="searchByIdOrCustomer"
                              placeholder="Search by Customer or Order ID"
                              type="text"
                              className="form-control "
                              id="validationCustom01"
                              onChange={(e) =>
                                setSearchByIdOrCustomer(e.target.value)
                              }
                              value={searchByIdOrCustomer}
                              style={{ width: "250px" }}
                            />
                          </>
                        ) : (
                          ""
                        )}
                        {searchByIdOrCustomerToggle === false ? (
                          <>
                            <Button
                              className="px-3 me-2"
                              color="light"
                              onClick={() =>
                                setSearchByIdOrCustomerToggle(
                                  !searchByIdOrCustomerToggle
                                )
                              }
                            >
                              <i className="fas fa-search"></i>
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="p-2 ms-2"
                            color="danger"
                            onClick={() => {
                              setSearchByIdOrCustomerToggle(
                                !searchByIdOrCustomerToggle
                              );
                              setSearchByIdOrCustomer("");
                            }}
                          >
                            <i className="fas fa-window-close"></i>
                          </Button>
                        )}
                      </div>
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
                            <th className="text-center">Transaction Id</th>
                            <th className="text-center">Transaction Date</th>
                            <th className="text-center">Order Id</th>
                            <th className="text-center">Customer Name</th>
                            <th className="text-center">Payment Status</th>
                            <th className="text-center">Payment Mode</th>
                            <th className="text-center">Credit</th>
                            <th className="text-center">Debit</th>
                            <th className="text-center">Reference Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentTransactionsData &&
                            paymentTransactionsData.map((transaction) => (
                              <tr key={transaction.order_id}>
                                <td className="text-center">
                                  {transaction.id}
                                </td>
                                <td className="text-center">
                                  {transaction.created_at.split("T")[0]}
                                </td>
                                <td className="text-center">
                                  {transaction.order_id}
                                </td>
                                <td className="text-center">
                                  {transaction.customer.first_name}
                                </td>
                                <td className="text-center">
                                  {transaction.payment_status}
                                </td>
                                <td className="text-center">
                                  {transaction.payment_mode}
                                </td>
                                <td className="text-center">
                                  {transaction.credit}
                                </td>
                                <td className="text-center">
                                  {transaction.debit}
                                </td>
                                <td className="text-center">
                                  {transaction.reference_number ? (
                                    transaction.reference_number
                                  ) : (
                                    <span>
                                      <i
                                        className="fas fa-pencil-alt"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          tog_center(transaction.id);
                                        }}
                                      ></i>
                                    </span>
                                  )}
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
                        <select
                          onChange={(e) => handlePageSizeChange(e)}
                          style={{ height: "28px", marginTop: "6px" }}
                        >
                          <option value={5}>5</option>
                          <option value={10} selected>
                            10
                          </option>
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
        </>
      )}
      <Modal
        isOpen={modal_center}
        toggle={() => {
          tog_center();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Add Reference Number</h5>
        </div>
        <div className="modal-body">
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="modalReferenceNumber" className="h5">
              Reference Number*
            </label>
            <input
              type="text"
              id="modalReferenceNumber"
              name="reference_number"
              className="form-control"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.reference_number}
            />
            {formik.touched.reference_number &&
            formik.errors.reference_number ? (
              <div className="text-danger">
                {formik.errors.reference_number}
              </div>
            ) : null}
            <div className="mt-3">
              <Button type="submit" className="px-3 me-2" color="primary">
                Save
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentTransactions;
