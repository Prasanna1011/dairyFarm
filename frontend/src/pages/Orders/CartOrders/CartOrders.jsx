import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Modal,
  Table,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import axios from "axios";
import classnames from "classnames";
import { TablePagination } from "@mui/material";
import {
  API_BASE_URL,
  API_CART_ORDER_EXPORT_CART_ORDERS,
  API_CART_ORDER_GET,
  API_CART_ORDER_SALE_REPORT,
  API_HUB_ADD_GET,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { format } from "date-fns";
function CartOrders(props) {
  const [page, setPage] = useState(0);
  const [pagePending, setPagePending] = useState(0); // Pagination state for first tab
  const [pageSizePending, setPageSizePending] = useState(10);




  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [cartDataCount, setCartDataCount] = useState([]);
  const [cartSaleReport, setCartSaleReport] = useState([]);
  const [exportDataModal, setexportDataModal] = useState(false);
  const [selectedHub, setSelectedHub] = useState("");
  const [hubListData, setHubListData] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  function toggleExportData() {
    setexportDataModal(!exportDataModal);
  }
  //meta title
  document.title =
    "Tabs & Accordions | Skote - React Admin & Dashboard Template";

  const [customActiveTab, setcustomActiveTab] = useState("pending");

  // Local storage token
  const { config, first_name, last_name } = GetAuthToken();

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  // Search Filter Start

  const searchInputRef = useRef(null);

  const getHubList = async () => {
    const { data } = await axios.get(API_HUB_ADD_GET, config);
    console.log(data.data);
    setHubListData(data.data);
  };

  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Pagenation End
  const csvDataStatus = [
    { key: "Pending", value: "Pending" },
    { key: "InProcess", value: "InProcess" },
    { key: "Attempted", value: "Attempted" },
    { key: "Cancelled", value: "Cancelled" },
    { key: "Delivered", value: "Delivered" },
  ];

  // Export CSV Validation Start
  const exportCSVValidations = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: "", // Change from "status" to "cancel_reason"
      from_date: "",
      to_date: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Please Select Cancel Reason"),
      from_date: Yup.string().required("From Date is required"),
      to_date: Yup.string().required("To Date is required"),
    }),
    onSubmit: async (values) => {
      try {
        // Make the API call to export CSV
        const response = await axios.post(
          API_CART_ORDER_EXPORT_CART_ORDERS,
          values,
          config,
          {
            responseType: "blob", // Important for handling binary data
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: "application/csv" });
        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        // link.download = ".csv";
        link.download = `${exportCSVValidations.values.status}_cartOrders.csv`;
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Remove the link element from the DOM
        document.body.removeChild(link);
        toggleExportData();
        toast.success(`File downloaded successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.log("Error downloading file:", error);
        toast.error(`Something went wrong`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  const getCartOrdersData = async () => {
    const { data } = await axios.get(
      `${API_CART_ORDER_GET}?hub_id=${selectedHub}&customer_or_order_id=${searchTerm}&order_status=${customActiveTab}`,
      {
        ...config,
        params: {
          page:pagePending +1,
          page_size: pageSizePending,
        },

      }
    );
    setCartData(data?.results);
    setCartDataCount(data);
    console.log(data);
  };
  const getCartSaleReport = async () => {
    const { data } = await axios.get(API_CART_ORDER_SALE_REPORT, config);
    setCartSaleReport(data);
    console.log(data);
  };
  const downloadSalesReport = async () => {
    try {
      const response = await axios.get(API_CART_ORDER_SALE_REPORT, config, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = new Blob([response.data], { type: "application/csv" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "cartOrderSales_Report.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };
  useEffect(() => {
    getCartOrdersData();
    getHubList();
  }, [customActiveTab, selectedHub, searchTerm]);
  useEffect(() => {
    getCartOrdersData(pagePending, pageSizePending);
  }, [pagePending,  pageSizePending,customActiveTab, selectedHub, searchTerm]);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3>Cart Orders</h3>
                  </div>
                  <div className="d-flex align-items-end">
                    <div>
                      <Button
                        color="primary"
                        onClick={() => {
                          toggleExportData();
                        }}
                      >
                        Export
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="ms-2"
                        color="primary"
                        onClick={downloadSalesReport}
                      >
                        Cart Sale Report
                      </Button>
                    </div>
                    <div className="mx-2">
                      <Label htmlFor="formrow-email-Input">Select HUB</Label>
                      <Input
                        type="select"
                        className="form-control"
                        id="formrow-email-Input"
                        placeholder=""
                        value={selectedHub}
                        onChange={(e) => setSelectedHub(e.target.value)}
                      >
                        <option value="">Select HUB</option>
                        {hubListData &&
                          hubListData
                            .filter((item) => item.is_active === true)
                            .map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                      </Input>
                    </div>
                    <div className="">
                      <Label htmlFor="formrow-email-Input">
                        Search Customer/Orders
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="formrow-email-Input"
                        placeholder="Search Customer/Orders"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Nav tabs className="nav-tabs-custom nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "pending", // Pending
                        })}
                        onClick={() => {
                          toggleCustom("pending");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Pending</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "In-process", // In Process
                        })}
                        onClick={() => {
                          toggleCustom("In-process");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">In Process</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "Attempted", // Attempted
                        })}
                        onClick={() => {
                          toggleCustom("Attempted");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">Attempted</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "Delivered", // Delivered
                        })}
                        onClick={() => {
                          toggleCustom("Delivered");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-cog"></i>
                        </span>
                        <span className="d-none d-sm-block">Delivered</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "Cancelled", // Canclled
                        })}
                        onClick={() => {
                          toggleCustom("Cancelled");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-cog"></i>
                        </span>
                        <span className="d-none d-sm-block">Canclled</span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent
                    activeTab={customActiveTab}
                    className="p-3 text-muted"
                  >
                    <TabPane tabId="pending">
                      <Row>
                        <Col sm="12">
                          <Row>
                            <Col xl={12}>
                              <Card className="pb-5">
                                <CardBody>
                                  <div className="table-responsive">
                                    <Table className="align-middle ">
                                      <thead className="table-light">
                                        <tr>
                                          <th>Order No. </th>
                                          <th>Customer</th>
                                          <th> Area</th>
                                          <th> Order Amount</th>
                                          <th> Order Date</th>
                                          <th>Payment Mode</th>
                                        </tr>
                                      </thead>

                                      <tbody className="">
                                        {cartData?.map((item, index) => (
                                          <tr key={item.id}>
                                            <th>
                                              <Link
                                                to={`/cart-orders-view/${item.order_id}`}
                                              >
                                                {item.order_id}
                                              </Link>
                                            </th>
                                            <td>
                                              {item?.customer_name}
                                              <br />
                                              {item?.customer?.contact_no}
                                            </td>
                                            <td>
                                              {
                                                item?.customer_address?.area
                                                  ?.area_name
                                              }

                                              {
                                                item?.customer_address?.pincode
                                                  ?.code
                                              }
                                            </td>
                                            <td>₹{item?.pb_discount}</td>
                                            <td>
                                              {item.created_at !== null
                                                ? format(
                                                    new Date(item.created_at),
                                                    "dd-MM-yyyy"
                                                  )
                                                : "---"}
                                            </td>
                                            <td>{item?.payment_mode}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </div>
                                </CardBody>
                                <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={cartDataCount?.count}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="In-process">
                      <Row>
                        <Col sm="12">
                          <Row>
                            <Col xl={12}>
                              <Card className="pb-5">
                                <CardBody>
                                  <div className="table-responsive">
                                    <Table className="align-middle ">
                                      <thead className="table-light">
                                        <tr>
                                          <th>Order No. </th>
                                          <th>Customer</th>
                                          <th> Area</th>
                                          <th> Order Amount</th>
                                          <th> Order Date</th>
                                          <th>Processed On</th>
                                          <th>Payment Mode</th>
                                        </tr>
                                      </thead>
                                      <tbody className="">
                                        {cartData?.map((item, index) => (
                                          <tr key={item.id}>
                                            <th>
                                              <Link
                                                to={`/cart-orders-view/${item.order_id}`}
                                              >
                                                {item.order_id}
                                              </Link>
                                            </th>
                                            <td>
                                              {item?.customer_name}
                                              <br />
                                              {item?.customer?.contact_no}
                                            </td>
                                            <td>
                                              {
                                                item?.customer_address?.area
                                                  ?.area_name
                                              }

                                              {
                                                item?.customer_address?.pincode
                                                  ?.code
                                              }
                                            </td>
                                            <td>₹{item?.pb_discount}</td>
                                            <td>
                                              {item.created_at !== null
                                                ? format(
                                                    new Date(item.created_at),
                                                    "dd-MM-yyyy"
                                                  )
                                                : "---"}
                                            </td>
                                            <td>
                                              {item.updated_at !== null
                                                ? format(
                                                    new Date(item.updated_at),
                                                    "dd-MM-yyyy"
                                                  )
                                                : "---"}
                                            </td>
                                            <td>{item?.payment_mode}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </div>
                                </CardBody>
                                <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={cartDataCount?.count}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="Attempted">
                      <Row>
                        <Col sm="12">
                          <Row>
                            <Col xl={12}>
                              <Card className="pb-5">
                                <CardBody>
                                  <div className="table-responsive">
                                    <Table className="align-middle ">
                                      <thead className="table-light">
                                        <tr>
                                          <th>Order No. </th>
                                          <th>Customer</th>
                                          <th> Area</th>
                                          <th> Order Amount</th>
                                          <th> No. Of Attempt</th>
                                          <th> Last Attempt</th>
                                          <th>Payment Mode</th>
                                        </tr>
                                      </thead>
                                      <tbody className="">
                                        {cartData?.map((item, index) => (
                                          <tr key={item.id}>
                                            <th>
                                              <Link
                                                to={`/cart-orders-view/${item.order_id}`}
                                              >
                                                {item.order_id}
                                              </Link>
                                            </th>
                                            <td>
                                              {item?.customer_name}
                                              <br />
                                              {item?.customer?.contact_no}
                                            </td>
                                            <td>
                                              {
                                                item?.customer_address?.area
                                                  ?.area_name
                                              }

                                              {
                                                item?.customer_address?.pincode
                                                  ?.code
                                              }
                                            </td>
                                            <td>₹{item?.pb_discount}</td>
                                            <td>
                                              {item.created_at !== null
                                                ? format(
                                                    new Date(item.created_at),
                                                    "dd-MM-yyyy"
                                                  )
                                                : "---"}
                                            </td>
                                            <td>
                                              {item.updated_at !== null
                                                ? format(
                                                    new Date(item.updated_at),
                                                    "dd-MM-yyyy"
                                                  )
                                                : "---"}
                                            </td>
                                            <td>{item?.payment_mode}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </div>
                                </CardBody>
                                <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={cartDataCount?.count}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="Delivered">
                      <Row>
                        <Col sm="12">
                          <Row>
                            <Col xl={12}>
                              <Card className="pb-5">
                                <CardBody>
                                  <div className="table-responsive">
                                    <Table className="align-middle ">
                                      <thead className="table-light">
                                        <tr>
                                          <th>Order No. </th>
                                          <th>Customer</th>
                                          <th> Area</th>
                                          <th> Order Amount</th>
                                          <th> Delivered On</th>
                                          <th> Delivered By</th>
                                        </tr>
                                      </thead>

                                      <tbody className="">
                                        {cartData?.map((item, index) => (
                                          <tr key={item.id}>
                                            <th>
                                              <Link
                                                to={`/cart-orders-view/${item.order_id}`}
                                              >
                                                {item.order_id}
                                              </Link>
                                            </th>
                                            <td>
                                              {item?.customer_name}
                                              <br />
                                              {item?.customer?.contact_no}
                                            </td>
                                            <td>
                                              {
                                                item?.customer_address?.area
                                                  ?.area_name
                                              }
                                            </td>
                                            <td>₹{item?.pb_discount}</td>
                                            <td>
                                              {item?.updated_at !== null
                                                ? format(
                                                    new Date(item?.updated_at),
                                                    "dd-MM-yyyy"
                                                  )
                                                : "---"}
                                            </td>
                                            <td>
                                              {" "}
                                              <div className="d-flex  align-items-center">
                                                <img
                                                  src={
                                                    item?.delivery_boy
                                                      ?.profile_picture
                                                  }
                                                  alt=""
                                                  className="rounded-circle avatar-sm"
                                                />
                                                <p className=" ms-2 mt-2">
                                                  {
                                                    item?.delivery_boy
                                                      ?.first_name
                                                  }{" "}
                                                  {
                                                    item?.delivery_boy
                                                      ?.last_name
                                                  }
                                                </p>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </div>
                                </CardBody>
                                <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={cartDataCount?.count}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="Cancelled">
                      <Row>
                        <Col sm="12">
                          <Row>
                            <Col xl={12}>
                              <Card className="pb-5">
                                <CardBody>
                                  <div className="table-responsive">
                                    <Table className="align-middle ">
                                      <thead className="table-light">
                                        <tr>
                                          <th>Order No. </th>
                                          <th>Customer</th>
                                          <th> Area</th>
                                          <th> Order Amount</th>
                                          <th> Cancelled On</th>
                                          <th>Payment Mode</th>
                                        </tr>
                                      </thead>

                                      <tbody className="">
                                        {cartData?.map((item, index) => (
                                          <tr key={item.id}>
                                            <th>
                                              <Link
                                                to={`/cart-orders-view/${item.order_id}`}
                                              >
                                                {item.order_id}
                                              </Link>
                                            </th>
                                            <td>
                                              {item?.customer_name}
                                              <br />
                                              {item?.customer?.contact_no}
                                            </td>
                                            <td>
                                              {
                                                item?.customer_address?.area
                                                  ?.area_name
                                              }
                                            </td>
                                            <td>₹{item?.pb_discount}</td>
                                            <td>
                                              {item?.cancelled_on !== null
                                                ? format(
                                                    new Date(
                                                      item?.cancelled_on
                                                    ),
                                                    "dd-MM-yyyy"
                                                  )
                                                : "---"}
                                            </td>
                                            <td>
                                              {item?.refund_completed ===
                                              null ? (
                                                "-"
                                              ) : item?.refund_completed ===
                                                true ? (
                                                <>
                                                  <Link
                                                    to={`/cart-orders-view/${item.order_id}`}
                                                  >
                                                    <span className="fas fa-check-circle text-success fs-4"></span>
                                                  </Link>
                                                </>
                                              ) : (
                                                <>
                                                  <Link
                                                    to={`/cart-orders-view/${item.order_id}`}
                                                  >
                                                    <span className="far fa-money-bill-alt fs-4 text-primary"></span>
                                                  </Link>
                                                </>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </div>
                                </CardBody>
                                <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={cartDataCount?.count}
                                  rowsPerPage={pageSizePending}
                                  page={pagePending}
                                  onPageChange={(event, newPage) =>
                                    setPagePending(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSizePending(+event.target.value);
                                    setPagePending(0);
                                  }}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Expoer popup Start */}

        <Modal
          isOpen={exportDataModal}
          toggle={() => {
            toggleExportData();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Center Modal</h5>
            <button
              type="button"
              onClick={() => {
                setexportDataModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form
              className="needs-validation"
              onSubmit={(e) => {
                e.preventDefault();
                exportCSVValidations.handleSubmit();
                return false;
              }}
            >
              <Row>
                {/* Add hidden input for order_id */}
                <Input
                  type="hidden"
                  name="order_id"
                  value={exportCSVValidations.values.order_id}
                />

                <Col md="12">
                  <FormGroup className="mb-3">
                    <Label htmlFor="exportCSVValidationsCustom01">
                      Choose Status*
                    </Label>
                    <Input
                      name="status"
                      placeholder="Choose the status"
                      type="select"
                      className="form-control"
                      id="exportCSVValidationsCustom01"
                      onChange={exportCSVValidations.handleChange}
                      onBlur={exportCSVValidations.handleBlur}
                      value={exportCSVValidations.values.status || ""}
                      invalid={
                        exportCSVValidations.touched.status &&
                        exportCSVValidations.errors.status
                          ? true
                          : false
                      }
                    >
                      <option value="" disabled>
                        Select Status
                      </option>

                      {csvDataStatus.map((item) => (
                        <>
                          <option value={item.key}>{item.value}</option>
                        </>
                      ))}
                    </Input>
                    {exportCSVValidations.touched.status &&
                    exportCSVValidations.errors.status ? (
                      <FormFeedback type="invalid">
                        {exportCSVValidations.errors.status}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <div className="mb-3">
                    <label htmlFor="from_date" className="form-label">
                      From Date *
                    </label>
                    <Flatpickr
                      id="from_date"
                      name="from_date"
                      placeholder="dd-mm-yyyy"
                      className={`form-control ${
                        exportCSVValidations.touched.from_date &&
                        exportCSVValidations.errors.from_date
                          ? "is-invalid"
                          : ""
                      }`}
                      value={exportCSVValidations.values.from_date}
                      onChange={(date) => {
                        const formattedDate = format(date[0], "yyyy-MM-dd"); // Format the date
                        exportCSVValidations.setFieldValue(
                          "from_date",
                          formattedDate
                        ); // Corrected field name
                      }}
                      options={{
                        dateFormat: "Y-m-d",
                        maxDate: new Date().toISOString().split("T")[0], // Set maxDate to the
                      }}
                    />
                    {exportCSVValidations.touched.from_date &&
                      exportCSVValidations.errors.from_date && (
                        <div className="invalid-feedback">
                          {exportCSVValidations.errors.from_date}
                        </div>
                      )}
                  </div>
                </Col>
                <Col md="12">
                  <div className="mb-3">
                    <label htmlFor="to_date" className="form-label">
                      To Date *
                    </label>
                    <Flatpickr
                      id="to_date"
                      name="to_date"
                      placeholder="dd-mm-yyyy"
                      className={`form-control ${
                        exportCSVValidations.touched.to_date &&
                        exportCSVValidations.errors.to_date
                          ? "is-invalid"
                          : ""
                      }`}
                      value={exportCSVValidations.values.to_date}
                      onChange={(date) => {
                        const formattedDate = format(date[0], "yyyy-MM-dd"); // Format the date
                        exportCSVValidations.setFieldValue(
                          "to_date",
                          formattedDate
                        );
                      }}
                      options={{
                        dateFormat: "Y-m-d",
                        maxDate: new Date().toISOString().split("T")[0], // Set maxDate to the current date
                      }}
                    />

                    {exportCSVValidations.touched.to_date &&
                      exportCSVValidations.errors.to_date && (
                        <div className="invalid-feedback">
                          {exportCSVValidations.errors.to_date}
                        </div>
                      )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col xl="12" className="text-center">
                  <Button color="primary" type="submit">
                    Submit form
                  </Button>
                  <Button
                    color="danger"
                    className="ms-2"
                    onClick={() => {
                      setexportDataModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>

        {/* Expoer popup End */}
      </div>
    </>
  );
}

export default CartOrders;
