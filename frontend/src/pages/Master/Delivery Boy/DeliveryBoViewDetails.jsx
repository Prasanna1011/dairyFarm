import {
  API_BASE_URL,
  API_DELIVERY_BOYS_AREA_WISE_DELIVERY,
  API_DELIVERY_BOYS_DELIVERY_ORDERS,
  API_DELIVERY_BOYS_GET_BY_ID_AND_UPDATE,
  DB_IMAGES_URL,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import React from "react";
import classnames from "classnames";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Nav,
  NavItem,
  NavLink,
  ModalFooter,
  TabContent,
  TabPane,
  CardTitle,
  CardText,
  Table,
} from "reactstrap";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { TablePagination } from "@mui/material";
const DeliveryBoViewDetails = () => {
  const [dataById, setDataById] = useState([]);
  const [adharcardpopup, setadharcardpopup] = useState(false);
  const [selectedAdharcardImg, setSelectedAdharcardImg] = useState("");
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [deliveryBoyAreaWiseData, setDeliveryBoyAreaWiseData] = useState([]);
  const [deliveryBoyDeliveryOrdersData, setDeliveryBoyDeliveryOrdersData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedDrivingLicenceImg, setSelectedDrivingLicenceImg] =
    useState("");
  const [drivingLicence, setdrivingLicence] = useState(false);

  const { id } = useParams();
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
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
  // adharcard popup start
  function adharcardModalToggle() {
    setadharcardpopup(!adharcardpopup);
    removeBodyCss();
  }
  // adharcard popup End

  // drivingLicence popup Start
  function drivingLicenceModalToggle() {
    setdrivingLicence(!drivingLicence);
    removeBodyCss();
  }
  // drivingLicence popup End

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const getDeliveryBoyDataById = async () => {
    try {
      const { data } = await axios.get(
        `${API_DELIVERY_BOYS_GET_BY_ID_AND_UPDATE}${id}/`,
        config
      );

      // Assuming your fetched data contains the image URLs/paths, update the state accordingly
      setDataById(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDeliveryBoyDeliveryOrdersData = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    try {
      const { data } = await axios.get(
        `${API_DELIVERY_BOYS_DELIVERY_ORDERS}?delivery_boy_id=${id}&date=${formattedDate}&is_delivered=true`,
        config
      );

      // Assuming your fetched data contains the image URLs/paths, update the state accordingly
      setDeliveryBoyDeliveryOrdersData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDeliveryAreaWiseDelivery = async () => {

    try {
      const { data } = await axios.get(
        `${API_DELIVERY_BOYS_AREA_WISE_DELIVERY}?delivery_boy_id=${id}`,
        config
      );

      setDeliveryBoyAreaWiseData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDeliveryBoyDataById();
    getDeliveryAreaWiseDelivery();
    getDeliveryBoyDeliveryOrdersData()
  }, []);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Delivery Boy Details</h3>

                  <div>
                    <Link to="/master-delivery-boys">
                      <Button color="primary" className="px-4">
                        Back
                      </Button>
                    </Link>

                    <Link
                      to={`/master-delivery-boys/${dataById?.delivery_boy_id}`}
                    >
                      <Button className="edit-button btn btn-warning ms-2 px-4">
                        <i className="fas fa-pen"></i>
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Row>
            <Card>
  <CardBody>
    <Row className="mt-4 align-items-center">
      <Col lg={2}>
        <div>
          <img
            src={`${API_BASE_URL}${dataById?.profile_picture}`}
            alt=""
            className="rounded-circle avatar-lg ms-3"
          />
        </div>
      </Col>
      <Col lg={10}>
        <div className="ml-3">
          <h5>{dataById?.first_name} {dataById?.last_name}</h5>
          <p>{dataById?.contact_no}</p>
        </div>
      </Col>
    </Row>

    <Row className="mt-4">
      <Col lg={12}>
        <p className="ms-5 fs-4">Personal Details:</p>
      </Col>
    </Row>

    <Row className="mt-4">
      <Col lg={4}>
        <div className="ms-5">
          <h5>Address</h5>
          <p>{dataById?.address}</p>
        </div>
      </Col>
      <Col lg={4}>
        <div className="ms-5">
          <h5>Allocated Hub</h5>
          <p>{dataById?.allocated_hub_name}</p>
        </div>
      </Col>
      <Col lg={4}>
        <div className="ms-5">
          <h5>Joined On</h5>
          <p>{dataById?.joined_on}</p>
        </div>
      </Col>
    </Row>

    <Row className="mt-3">
      <Col lg={4}>
        <div className="ms-5">
          <h5>Head Person</h5>
          <p>{dataById?.head_person_name}</p>
        </div>
      </Col>
      <Col lg={4}>
        <div className="ms-5">
          <h5>Job Type</h5>
          <p>{dataById?.job_type}</p>
        </div>
      </Col>
      <Col lg={4}>
        <div className="ms-5">
          <h5>Blood Group</h5>
          <p><b>{dataById?.blood_group}</b></p>
        </div>
      </Col>
    </Row>

    <Row className="mt-3">
      <Col lg={12}>
        <div className="ms-5">
          <h5>Documents</h5>
          <div className="d-flex">
            <Button
              type="button"
              onClick={() => {
                setSelectedAdharcardImg(dataById?.adhar_card_file);
                adharcardModalToggle();
              }}
              className="btn btn-light waves-effect waves-light me-3"
            >
              Open Adharcard
            </Button>

            <Button
              type="button"
              onClick={() => {
                setSelectedDrivingLicenceImg(dataById?.driving_licence_file);
                drivingLicenceModalToggle();
              }}
              className="btn btn-light waves-effect waves-light"
            >
              Open Driving Licence
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  </CardBody>
</Card>

            </Row>
          </Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Custom Tabs</CardTitle>
                <p className="card-title-desc">Example of custom tabs</p>

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
                      <span className="d-none d-sm-block">
                        Area wise Deliveries
                      </span>
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
                        getDeliveryBoyDeliveryOrdersData()
                      }}
                    >
                      <span className="d-block d-sm-none">
                        <i className="far fa-user"></i>
                      </span>
                      <span className="d-none d-sm-block">Delivery Orders</span>
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent
                  activeTab={customActiveTab}
                  className="p-3 text-muted"
                >
                  <TabPane tabId="1">
                    <Row>
                      <Col xl={12}>
                        <Card className="pb-5">
                          <CardBody>
                            <div className="table-responsive">
                              <Table className="align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Pincode</th>
                                    <th>Delivery Area</th>
                                    <th>No. Of Orders</th>
                                  </tr>
                                </thead>

                                <tbody className="">
                                  {deliveryBoyAreaWiseData &&
                                    deliveryBoyAreaWiseData?.results &&
                                    deliveryBoyAreaWiseData?.results
                                      .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                      )
                                      .map((item, index) => (
                                        <tr key={item.id}>
                                          <th scope="row">{item?.pincode}</th>
                                          <td>{item?.area}</td>
                                          <td>{item?.orders}</td>
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
                            count={
                              deliveryBoyAreaWiseData?.results?.length || 0
                            } // Add a fallback for count
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col xl={12}>
                        <Card className="pb-5">
                          <CardBody>
                            <div className="table-responsive">
                              <Table className="align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Order No.</th>
                                    <th>Customer Name</th>
                                    <th>Area</th>
                                    <th>Subscription Expires</th>
                                  </tr>
                                </thead>

                                <tbody className="">
                                  {deliveryBoyDeliveryOrdersData &&
                                    deliveryBoyDeliveryOrdersData.items &&
                                    deliveryBoyDeliveryOrdersData.items
                                      .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                      )
                                      .map((item, index) => (
                                        <tr key={item.order_id}>
                                          <th scope="row">{item?.order_id}</th>
                                          <td>{item?.customer?.first_name} {item?.customer?.last_name}</td>
                                          <td>{item?.customer_address?.area?.area_name}</td>
                                          <td>{item?.order_data?.subscription_expiry}</td>
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
                            count={
                              deliveryBoyDeliveryOrdersData?.items?.length || 0
                            } // Add a fallback for count
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
          <Row></Row>

          {/* ADHAR CARD BODY START */}

          <Row>
            <div>
              <Card>
                <Container>
                  <Modal
                    isOpen={adharcardpopup}
                    toggle={() => {
                      adharcardModalToggle();
                    }}
                    centered
                  >
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">
                        Adharcard
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setadharcardpopup(false);
                        }}
                        aria-label="Close"
                      ></button>
                    </div>
                    <ModalBody>
                      <img
                        className="p-4 img-fluid"
                        src={`${API_BASE_URL}${selectedAdharcardImg}`}
                        alt="Adharcard"
                      />
                    </ModalBody>
                  </Modal>
                </Container>
              </Card>
            </div>
          </Row>

          {/* ADHAR CARD  END */}

          {/*  Driving Licence  START */}

          <Row>
            <div>
              <Card>
                <Container>
                  <Modal
                    isOpen={drivingLicence}
                    toggle={() => {
                      drivingLicenceModalToggle();
                    }}
                    centered
                  >
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">
                        Drivinglicence
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setdrivingLicence(false);
                        }}
                        aria-label="Close"
                      ></button>
                    </div>
                    <ModalBody>
                      <img
                        className="p-4 img-fluid"
                        src={`${API_BASE_URL}${selectedDrivingLicenceImg}`}
                        alt="Adharcard"
                      />
                    </ModalBody>
                  </Modal>
                </Container>
              </Card>
            </div>
          </Row>

          {/* Driving Licence END */}
        </Container>
      </div>
    </>
  );
};

export default DeliveryBoViewDetails;
