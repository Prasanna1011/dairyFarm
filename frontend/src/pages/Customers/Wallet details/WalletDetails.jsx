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
  CUSTOMER_WALLET_TRANSACTIONS,
  GET_DASHBOARD_WALLET_LIST_DATA,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { TablePagination } from "@mui/material";
import LoaderPage from "components/Loader/LoaderPage";
const WalletDetails = () => {
  const [loading, setLoading] = useState(true);
  const { config, first_name, last_name } = GetAuthToken();
  const [walletData, setWalletData] = useState();
  const [walletTransactionsData, setWalletTransactionsData] = useState();
  const [popupNextPage, setPopupNextPage] = useState();
  const [popupPreviousPage, setPopupPreviousPage] = useState();
  const [searchByName, setSearchByName] = useState("");
  const [removeSerch, setRemoveSerch] = useState("");
  const [popupPageNumber, setPopupPageNumber] = useState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [modal_center, setmodal_center] = useState(false);

  console.log("searchByName", searchByName);
  const getWalletDetails = async () => {
    try {
      const { data } = await axios.get(
        `${GET_DASHBOARD_WALLET_LIST_DATA}?customer_name=${searchByName}`,
        {
          ...config,
          params: { page, page_size: pageSize },
        }
      );
      setWalletData(data.results);
      setTotalPages(Math.ceil(data.count / pageSize));
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  const getWalletTransactions = async (id) => {
    try {
      const { data } = await axios.get(
        `${CUSTOMER_WALLET_TRANSACTIONS}${id}`,
        config
      );
      setWalletTransactionsData(data.results);
      setPopupNextPage(data.next);
      setPopupPreviousPage(data.previous);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWalletDetails();
  }, [page, pageSize,searchByName]);

  const handlePopUpNextPage = () => {
    if (popupNextPage) {
      setPopupNextPage(popupPageNumber + 1);
    }
  };

  const handlePopUpPreviousPage = () => {
    if (popupPreviousPage) {
      setPopupPreviousPage(popupPageNumber - 1);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(1);
  };

  function tog_center() {
    setmodal_center(!modal_center);
  }

  return (
    <div className="page-content">
      <Container fluid={true}>
     {
      loading === true ?(<LoaderPage/>):(<>
      
      <Row>
          <Col xl={12}>
            <Card className="">
              <CardBody className="">
                <div className="d-flex justify-content-between w-100">
                  <h3>Wallet Details</h3>
                  <div className="d-flex">
                    <Input
                      name="email"
                      placeholder="Search By Customer Name"
                      type="text"
                      className="form-control"
                      id="validationCustom05"
                      onChange={(e) => setSearchByName(e.target.value)}
                      value={searchByName}
                    />
                    <Button color="light " className="btn-sm ms-1 px-3 btn-rounded" onClick={() => setSearchByName([])}>
                      {" "}
                      <span
                        className="fas fa-times text-danger 
                         
"
                      ></span>
                    </Button>
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
                        <th className="">Customer Name</th>
                        <th className="">Contact No</th>
                        <th className="">Available Balance</th>
                        <th className="">Blocked Balance</th>
                        <th className="">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletData &&
                        walletData.map(
                          (wallet, index) =>
                            wallet.is_active === true && (
                              <tr key={index}>
                                <td className="">
                                  {wallet.customer.first_name}
                                </td>
                                <td className="">
                                  {wallet.customer.contact_no}
                                </td>
                                <td className="">{wallet.available_balance}</td>
                                <td className="">{wallet.blocked_balance}</td>
                                <td className="">
                                  <button
                                    className="edit-button btn btn-sm btn-info me-1"
                                    onClick={() => {
                                      getWalletTransactions(
                                        wallet.customer.customer_id
                                      );
                                      tog_center();
                                    }}
                                  >
                                    <i className="fas fa-info-circle"></i>
                                  </button>
                                  <Link
                                    to="/dashboard-wallet-order-transactions"
                                    state={{ id: wallet.customer.customer_id }}
                                  >
                                    <button className="edit-button btn btn-sm btn-info ">
                                      <i className="fas fa-eye"></i>
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            )
                        )}
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
      </>)
     }
      </Container>


      <Modal
        isOpen={modal_center}
        toggle={() => {
          tog_center();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Wallet Transactions</h5>
        </div>

        <div className="modal-body">
          <div className="table-responsive">
            <Table className="align-middle ">
              <thead className="table-light">
                <tr>
                  <th className="">Transaction</th>
                  <th className="">Credit</th>
                  <th className="">Debit</th>
                  <th className="">Description</th>
                </tr>
              </thead>
              <tbody>
                {walletTransactionsData &&
                  walletTransactionsData.map((transaction, index) => (
                    <tr key={index}>
                      <td className="">{transaction.transaction_id}</td>
                      <td className="">{transaction.credit}</td>
                      <td className="">{transaction.debit}</td>
                      <td className="">{transaction.description}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end">
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
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WalletDetails;
