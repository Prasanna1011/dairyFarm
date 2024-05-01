import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  Alert,
  CardTitle,
  NavItem,
  TabContent,
  TabPane,
  CardText,
  Collapse,
  Nav,
  NavLink,
  UncontrolledCollapse,
} from "reactstrap";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import classnames from "classnames";
import {
  API_CUSTOMERS_GET_BY_ID,
  API_CUSTOMERS_STATUS_AND_SUMMARY,
} from "customhooks/All_Api/Apis";
import axios from "axios";
const CustomerDetail = () => {
  const [customerDataById, setCustomerDataById] = useState([]);
  const [customerStatusAndSummary, setCustomerStatusAndSummary] = useState([]);

  const { id } = useParams();
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const { customer, addresses } = customerDataById;
  //   Customer List Data Fetch by id Start

  const fetchCustomerDataById = async () => {
    const { data } = await axios.get(
      `${API_CUSTOMERS_GET_BY_ID}${id}/`,
      config
    );
    setCustomerDataById(data.data);
  };
  const fetchCustomerStatusAndSummary = async () => {
    const { data } = await axios.get(
      `${API_CUSTOMERS_STATUS_AND_SUMMARY}${id}/`,
      config
    );
    setCustomerStatusAndSummary(data);
    console.log("data", data);
  };

  useEffect(() => {
    fetchCustomerDataById();
    fetchCustomerStatusAndSummary();
  }, []);
  ////////////////////////////////////////////////////////////////

  document.title =
    "Tabs & Accordions | Skote - React Admin & Dashboard Template";

  const [activeTab, setactiveTab] = useState("1");
  const [activeTab1, setactiveTab1] = useState("5");
  const [activeTab2, setactiveTab2] = useState("1");
  const [activeTab3, setactiveTab3] = useState("1");
  const [verticalActiveTab, setverticalActiveTab] = useState("1");
  const [verticalActiveTabWithIcon, setverticalActiveTabWithIcon] =
    useState("1");
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [customIconActiveTab, setcustomIconActiveTab] = useState("1");
  const [col1, setcol1] = useState(true);
  const [col2, setcol2] = useState(false);
  const [col3, setcol3] = useState(false);

  const [col5, setcol5] = useState(true);
  const [col6, setcol6] = useState(true);
  const [col7, setcol7] = useState(true);

  const [col8, setcol8] = useState(true);
  const [col9, setcol9] = useState(true);
  const [col10, setcol10] = useState(false);
  const [col11, setcol11] = useState(false);

  const t_col1 = () => {
    setcol1(!col1);
    setcol2(false);
    setcol3(false);
  };

  const t_col2 = () => {
    setcol2(!col2);
    setcol1(false);
    setcol3(false);
  };

  const t_col3 = () => {
    setcol3(!col3);
    setcol1(false);
    setcol2(false);
  };

  const t_col5 = () => {
    setcol5(!col5);
  };

  const t_col6 = () => {
    setcol6(!col6);
  };

  const t_col7 = () => {
    setcol7(!col7);
  };

  const t_col8 = () => {
    setcol6(!col6);
    setcol7(!col7);
  };

  const t_col9 = () => {
    setcol9(!col9);
    setcol10(false);
    setcol11(false);
  };

  const t_col10 = () => {
    setcol10(!col10);
    setcol9(false);
    setcol11(false);
  };

  const t_col11 = () => {
    setcol11(!col11);
    setcol10(false);
    setcol9(false);
  };

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const toggle1 = (tab) => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab);
    }
  };

  const toggle2 = (tab) => {
    if (activeTab2 !== tab) {
      setactiveTab2(tab);
    }
  };

  const toggle3 = (tab) => {
    if (activeTab3 !== tab) {
      setactiveTab3(tab);
    }
  };

  const toggleVertical = (tab) => {
    if (verticalActiveTab !== tab) {
      setverticalActiveTab(tab);
    }
  };

  const toggleVerticalIcon = (tab) => {
    if (verticalActiveTabWithIcon !== tab) {
      setverticalActiveTabWithIcon(tab);
    }
  };

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const toggleIconCustom = (tab) => {
    if (customIconActiveTab !== tab) {
      setcustomIconActiveTab(tab);
    }
  };

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Customer Detail</h3>
                  <Link to={"/customer-list"}>
                    <Button className="px-5" color="primary">
                      Back
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md="7">
              <Card className="p-4">
                <Row>
                  <Col md="2">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom06">Title</Label>
                      <Input
                        name="title"
                        type="text"
                        className="form-control"
                        id="validationCustom06"
                        value={customer?.title || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="5">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom01">First name</Label>
                      <Input
                        name="firstname"
                        placeholder="First name"
                        type="text"
                        className="form-control"
                        id="validationCustom01"
                        value={customer?.first_name || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="5">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom02">Last name</Label>
                      <Input
                        name="lastname"
                        placeholder="Last name"
                        type="text"
                        className="form-control"
                        id="validationCustom02"
                        value={customer?.last_name || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                {/* Repeat similar structure for other input fields */}
                <Row className="mt-3">
                  <Col md="12">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom03">Email</Label>
                      <Input
                        name="email"
                        placeholder="Email"
                        type="email"
                        className="form-control"
                        id="validationCustom03"
                        value={customer?.email || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                {/* Repeat similar structure for other input fields */}
                <Row className="mt-3">
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom04">Contact No.</Label>
                      <Input
                        name="contact_no"
                        placeholder="Contact No."
                        type="text"
                        className="form-control"
                        id="validationCustom04"
                        value={customer?.contact_no || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom05">Registered On</Label>
                      <Input
                        name="registered_no"
                        placeholder="Registered On"
                        type="text"
                        className="form-control"
                        id="validationCustom05"
                        value={customer?.registered_no || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                {/* Repeat similar structure for other input fields */}
                <Row className="mt-3">
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom06">Birth Date</Label>
                      <Input
                        name="birth_date"
                        placeholder="Birth Date"
                        type="text"
                        className="form-control"
                        id="validationCustom06"
                        value={customer?.birth_date || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom07">
                        Anniversary Date
                      </Label>
                      <Input
                        name="anniversary_date"
                        placeholder="Anniversary Date"
                        type="text"
                        className="form-control"
                        id="validationCustom07"
                        value={customer?.anniversary_date || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                {/* Repeat similar structure for other input fields */}
                <Row className="mt-3">
                  <Col md="4">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom08">Child</Label>
                      <Input
                        name="child"
                        placeholder="Child"
                        type="text"
                        className="form-control"
                        id="validationCustom08"
                        value={customer?.child || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom09">Adult</Label>
                      <Input
                        name="adult"
                        placeholder="Adult"
                        type="text"
                        className="form-control"
                        id="validationCustom09"
                        value={customer?.adult || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom10">Senior Citizen</Label>
                      <Input
                        name="senior_citizen"
                        placeholder="Senior Citizen"
                        type="text"
                        className="form-control"
                        id="validationCustom10"
                        value={customer?.senior_citizen || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom11">Customer Group</Label>
                      <Input
                        name="customer_group"
                        placeholder="Customer Group"
                        type="text"
                        className="form-control"
                        id="validationCustom11"
                        value={customer?.customer_group || ""}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col lg={5}>
              <Card>
                <CardBody>
                  <Nav tabs className="nav-tabs-custom nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleCustom("1");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Status</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "2",
                        })}
                        onClick={() => {
                          toggleCustom("2");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Summary</span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent
                    activeTab={customActiveTab}
                    className="p-3 text-muted"
                  >
                    <TabPane tabId="1">
                      <Row>
                        <Col sm="12">
                          <CardText className="mb-0">
                            <Card className="p-4">
                              <Row>
                                {customerStatusAndSummary?.status_list &&
                                  customerStatusAndSummary?.status_list?.map(
                                    (item) => (
                                      <>
                                        <Col sm="8">
                                          <Label className="">
                                            {item?.status === "New" ? (
                                              <Alert
                                                color="secondary"
                                                className="px-3"
                                                role="alert"
                                              >
                                                {item?.status}
                                              </Alert>
                                            ) : item.status === "KYC Done" ? (
                                              <Alert
                                                color="info"
                                                className="mb-0 px-3"
                                                role="alert"
                                              >
                                                {item?.status}
                                              </Alert>
                                            ) : item.status === "Approved" ? (
                                              <Alert
                                                color="warning"
                                                className="mb-0 px-3"
                                                role="alert"
                                              >
                                                {item?.status}
                                              </Alert>
                                            ) : item.status === "Scheduling" ? (
                                              <Alert
                                                color="primary"
                                                className="mb-0 px-3"
                                                role="alert"
                                              >
                                                {item?.status}
                                              </Alert>
                                            ) : item.status === "Active" ? (
                                              <Alert
                                                color="success"
                                                className="mb-0 px-4"
                                                role="alert"
                                              >
                                                {item?.status}
                                              </Alert>
                                            ) : null}
                                          </Label>
                                        </Col>
                                        <Col sm="4">
                                          {item?.date?.split("T")[0]}
                                        </Col>
                                        <hr className="border" />
                                      </>
                                    )
                                  )}
                              </Row>
                            </Card>
                          </CardText>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="12">
                          <Row>
                            <Col sm="8">
                              <label htmlFor="">Delivery Location :</label>
                            </Col>
                            <Col sm="4">View Map</Col>
                            <hr className="border" />
                          </Row>
                          <Row>
                            <Col sm="8">
                              <label htmlFor="">Trial Plan :</label>
                            </Col>
                            <Col sm="4">{customerStatusAndSummary?.summary?.trial_plan}</Col>
                            <hr className="border" />
                          </Row>
                          <Row>
                            <Col sm="8">
                              <label htmlFor="">Subscription Orders :</label>
                            </Col>
                            <Col sm="4">{customerStatusAndSummary?.summary?.subscription_orders}</Col>
                            <hr className="border" />
                          </Row>
                          <Row>
                            <Col sm="8">
                              <label htmlFor="">Cart Order :</label>
                            </Col>
                            <Col sm="4">{customerStatusAndSummary?.summary?.cart_orders}</Col>
                            <hr className="border" />
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
      </div>
    </>
  );
};

export default CustomerDetail;
