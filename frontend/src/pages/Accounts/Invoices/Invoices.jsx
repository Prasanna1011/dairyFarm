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
  Modal,
  Table,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import {
  API_ACCOUNT_GET,
  API_ACCOUNT_GET_BY_ORDER_NO,
  API_BASE_URL,
} from "customhooks/All_Api/Apis";
import LoaderPage from "components/Loader/LoaderPage";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
const Invoices = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [invoiceDataByOrderNo, setInvoiceDataByOrderNo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterClicked, setFilterClicked] = useState(false);
  const [searchByIdOrCustomerToggle, setSearchByIdOrCustomerToggle] =
    useState(false);
  const [searchByIdOrCustomer, setSearchByIdOrCustomer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [invoiceDetailModal, setinvoiceDetailModal] = useState(false);
  const [pageSize, setpageSize] = useState(10);
  const [pagePending, setPagePending] = useState(0); // Pagination state for first tab
  const [pageSizePending, setPageSizePending] = useState(10);

  function toggleInvoideDetailModal() {
    setinvoiceDetailModal(!invoiceDetailModal);
  }

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
  // Local storage token End

  // Local storage token End

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    // const searchData = deliveryBoysData.filter((item) => {
    //   // const searchString = `${item.city} ${item.activated_on}   ${item.deactivated_on}`; // Add more properties as needed
    //   return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    // });
    // setFilteredData(searchData);
  };

  // Search Filter End
  // Pagenation Start

  const getInvoices = async () => {
    try {
      const { data } = await axios.get(`${API_ACCOUNT_GET}?hub_id=&customer_or_invoice_no=${searchByIdOrCustomer}&from_date=${fromDate}&to_date=${toDate}`, {
        ...config,
        params: {
          page: pagePending + 1,
          page_size: pageSizePending,
        },
      });
      // 
      setInvoiceData(data);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const getInvoiceDataByOrderNo = async (oredrNo) => {
    try {
      const { data } = await axios.get(
        `${API_ACCOUNT_GET_BY_ORDER_NO}${oredrNo}`,
        config
      );
      setInvoiceDataByOrderNo(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };
  const handlePrint = () => (
    (document.title = `Invoice_${invoiceDataByOrderNo?.invoice?.customer?.first_name}_${invoiceDataByOrderNo?.invoice?.customer?.last_name}_invoiceNo_${invoiceDataByOrderNo?.invoice?.invoice_no}`),
    window.print(),
    (document.title = "Your App Name")
  );
  useEffect(() => {
    getInvoices();
  }, [fromDate, toDate, searchByIdOrCustomer, page, pageSize,pagePending,pageSizePending]);
  // Pagenation End



  return (
    <>
      <div className="page-content">
        {
          loading === true ? (<LoaderPage />) : (<>
            <Container fluid={true}>
              <Row>
                <Col xl={12}>
                  <Card>
                    <CardBody className="d-flex justify-content-between">
                      <div className={filterClicked ? "d-none" : ""}>
                        <h3>Invoices</h3>
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
                                placeholder="Search by Customer or Invoice No."
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
                              <th>Invoice No..</th>
                              <th>Invoice Date</th>
                              <th> Order No.</th>
                              <th>Customer Name</th>
                              <th>Order Date</th>
                              <th>Order Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceData.results &&
                              invoiceData.results?.map((item) => (
                                <tr key={item?.invoice_no}>
                                  <td
                                    className="text-primary "
                                    onClick={() => {
                                      toggleInvoideDetailModal();
                                      getInvoiceDataByOrderNo(item?.order_no);
                                    }}
                                  >
                                    {item?.invoice_no}
                                  </td>
                                  <td>{item?.invoice_date}</td>
                                  <td>{item?.order_no}</td>
                                  <td>
                                    {item?.customer?.first_name} {item?.customer?.last_name}
                                  </td>
                                  <td>{item?.invoice_date}</td>
                                  <td>{item?.order_amount}</td>
                                  {/* Add other columns as needed */}
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
                      count={invoiceData?.count || 0}
                      rowsPerPage={pageSizePending}

                      page={pagePending}
                      onPageChange={(event, newPage) => setPagePending(newPage)}
                      onRowsPerPageChange={(event) => {
                        setPageSizePending(+event.target.value);
                        setPagePending(0);
                      }}
                    />

                  </Card>
                </Col>
              </Row>

            </Container>
          </>)
        }

        {/* details Popup Start */}

        <Modal
          size="xl"
          className="modal-fullscreen"
          isOpen={invoiceDetailModal}
          toggle={() => {
            toggleInvoideDetailModal();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">
              Subscription Order Invoice Info
            </h5>
            <button className="btn btn-light me-5" onClick={handlePrint}>
              <span className="fas fa-print"></span>
            </button>
            <button
              type="button"
              onClick={() => {
                setinvoiceDetailModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body w-100">
            <Row className="border-bottom pb-2 w-100">
              <Col md={6} className="">
                <img
                  className="rounded me-2"
                  alt="200x200"
                  width="200"
                  src={`${API_BASE_URL}${invoiceDataByOrderNo?.company?.logo}`}
                  data-holder-rendered="true"
                />
              </Col>
              <Col md={6} className="d-flex  text-end">
                <div className="d-flex flex-column justify-content-end w-100">
                  <h4 className="">
                    Invoice: {invoiceDataByOrderNo?.invoice?.invoice_no}
                  </h4>
                  <p className="mt-0 pt-0">
                    {invoiceDataByOrderNo?.company?.company_name}
                  </p>
                  <p className="mt-0 pt-0">
                    {invoiceDataByOrderNo?.company?.company_email}
                  </p>
                  <p className="mt-0 pt-0">
                    {invoiceDataByOrderNo?.company?.company_email}
                  </p>
                  <p>GSTIN : {invoiceDataByOrderNo?.company?.GSTIN}</p>
                  {/* Add more details as needed */}
                </div>
              </Col>
            </Row>

            <Row className="border-bottom pb-2 w-100 mt-2">
              <Col md="6">
                <p className="d-flex">
                  <b>Invoice To : </b>{" "}
                  {`${invoiceDataByOrderNo?.invoice?.customer?.first_name} ${invoiceDataByOrderNo?.invoice?.customer?.last_name}`}
                </p>
                <p>
                  <b>Order No. : </b> {invoiceDataByOrderNo?.order?.order_id}
                </p>
                <p>
                  <b>Issue Date : </b>{" "}
                  {invoiceDataByOrderNo?.invoice?.invoice_date}
                </p>
              </Col>
              <Col md="6" className="text-end">
                <p>
                  <b>Delivery Address : </b>{" "}
                </p>
                {invoiceDataByOrderNo?.order?.customer_address?.full_address}
              </Col>
            </Row>

            <Row className="border-bottom pb-2 mt-2 w-100">
              {invoiceDataByOrderNo?.order?.items.map((item, index) => (
                <React.Fragment key={index}>
                  <Col md="6">
                    <p className="">
                      <b>Product Name </b>
                      <h5>{item?.product?.product_name}</h5>
                    </p>
                  </Col>
                  <Col md="6" className="text-end">
                    <p>
                      <b>Qty : {item?.quantity}</b>
                    </p>
                  </Col>
                  <Col md="12 text-end">
                    <p>
                      <b>Payment Summary : {item?.with_tax_amount}</b>
                    </p>
                    <p>
                      <b>Total Recharge :</b>
                    </p>
                    <p>
                      <b>Discount :</b> {item?.discount_rate}
                    </p>
                    <p>
                      <b>Current Balance :</b> {item?.with_tax_amount}
                    </p>
                  </Col>
                  {index !== invoiceDataByOrderNo.order.items.length - 1 && (
                    <hr className="w-100 mt-2 mb-2" />
                  )}
                </React.Fragment>
              ))}
            </Row>
          </div>
        </Modal>

        {/* details Popup End */}
      </div>
    </>
  );
};

export default Invoices;
