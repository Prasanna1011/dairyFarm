import React, { useState, useRef, useEffect } from "react";
import { TablePagination } from "@mui/material";
import axios from "axios";
import {
  API_BASE_URL,
  API_INDENT_OUTARD_GET_DATA_BY_ID,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { useParams } from "react-router-dom";
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
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import { format } from "date-fns";

const OutwardDetailByIndentNo = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [outwardDetails, setOutwardDetails] = useState([]);
  const [printPopupModal, setprintPopupModal] = useState(false);

  function printPopupToggle() {
    setprintPopupModal(!printPopupModal);
  }

  const { config, first_name, last_name } = GetAuthToken();
  const { id } = useParams();

  const gtOutwardDetailsByOutwardNo = async () => {
    const { data } = await axios.get(
      `${API_INDENT_OUTARD_GET_DATA_BY_ID}${id}/`,
      config
    );
    console.log("data.data", data.data);
    setOutwardDetails(data.data);
  };

  console.log("outwardDetails", outwardDetails);

  useEffect(() => {
    gtOutwardDetailsByOutwardNo();
  }, []);

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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Pagenation End

  // Update filteredData when searchQuery changes
  // useEffect(() => {
  //   handleSearch();
  // }, [searchQuery, hubListData]);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3> OUTWARD DETAILS</h3>
                <Button
                  className="px-4"
                  color="primary"
                  onClick={() => {
                    printPopupToggle();
                  }}
                >
                  <span className="fas fa-print"></span>
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl={8}>
            <Card className="pb-5">
              <CardBody>
                <div className="invoice-title"></div>
                <hr />
                <div className="table-responsive">
                  <Table className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Required Qty.</th>
                        <th>Batch No.</th>
                        <th>Expired On</th>
                        <th>Qty. Outward</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outwardDetails?.outward_data?.outward_items?.map(
                        (item) => (
                          <tr key={item.id}>
                            <td>{item?.product_name}</td>
                            <td>{item?.required_qty}</td>
                            <td>{item?.batch_no}</td>
                            <td>
                              {item?.expired_on !== null
                                ? format(
                                    new Date(item?.expired_on),
                                    "dd-MM-yyyy"
                                  )
                                : "---"}
                            </td>
                            <td>{item?.outward_quantity}</td>
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
                count={outwardDetails?.outward_data?.outward_items?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Col>
          <Col xl={4}>
            <Card className="pb-5">
              <CardBody>
                <h5 className="pb-3">DRIVER DETAILS</h5>
                <Row>
                  <Col md={12}>
                    <Row>
                      <Col xs="4">
                        <div className="mb-3">
                          <h6>Driver Name: </h6>
                        </div>
                      </Col>
                      <Col xs="8">
                        <span className="">
                          {outwardDetails?.outward_data?.driver_name || "N/A"}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={12}>
                    <Row>
                      <Col xs="4">
                        <div className="mb-3">
                          <h6>Vehicle name : </h6>
                        </div>
                      </Col>
                      <Col xs="8">
                        <span className="">
                          {outwardDetails?.outward_data?.vehicle_name || "N/A"}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="4">
                        <div className="mb-3">
                          <h6>Vehicle No.:</h6>
                        </div>
                      </Col>
                      <Col xs="8">
                        <span className="">
                          {outwardDetails?.outward_data?.vehicle_no || "N/A"}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Print Popup Start */}

      <Modal
        size="xl"
        isOpen={printPopupModal}
        toggle={() => {
          printPopupToggle();
        }}
        className="modal-fullscreen"
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Outward Invoice Info</h5>
          <Button
  color="light"
  type="button"
  className="me-4"
  onClick={() => window.print()}
>
  <span className="fas fa-print"></span>
</Button>

          <button
            type="button"
            onClick={() => {
              setprintPopupModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
       
        </div>
        <div className="modal-body">
          <Row className="mt-4 border-bottom pb-4">
            <Col sm="6">
              <img
                src={`${API_BASE_URL}${outwardDetails?.company_details?.logo}`}
                alt="milkmor logo"
              />
            </Col>
            <Col sm="6" className="text-end">
              <h5 className="pb-2">
                Outward No : {outwardDetails?.outward_data?.outward_no}
              </h5>
              <p className="m-0 p-0">
                {outwardDetails?.company_details?.company_name}
              </p>
              <p className="m-0 p-0">
                {outwardDetails?.company_details?.company_email}
              </p>
              <p className="m-0 p-0">
                GSTIN : {outwardDetails?.company_details?.GSTIN}
              </p>
            </Col>
          </Row>

          <Row className="mt-4 border-bottom pb-4">
            <Col sm="6">
              <h5 className="pb-2">Outward Info </h5>
              <h6 className="">
                Outward From : {outwardDetails?.outward_data?.outward_from_name}
              </h6>
              <h6 className="">
                Outward Date :{" "}
                {outwardDetails?.outward_data?.outward_date
                  ? format(
                      new Date(outwardDetails.outward_data.outward_date),
                      "dd-MM-yyyy"
                    )
                  : "---"}
              </h6>
            </Col>
            <Col sm="6" className="text-end">
              <h5 className="">
                Indent No. <br /> {outwardDetails?.outward_data?.indent_no}
              </h5>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <div className="table-responsive">
                <Table className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Required Qty.</th>
                      <th>Batch No.</th>
                      <th>Expired Date</th>
                      <th>Qty. Outward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outwardDetails?.outward_data?.outward_items?.map(
                      (item) => (
                        <tr key={item.id}>
                          <td>{item?.product_name}</td>
                          <td>{item?.required_qty}</td>
                          <td>{item?.batch_no}</td>
                          <td>
                            {item?.expired_on !== null
                              ? format(new Date(item?.expired_on), "dd-MM-yyyy")
                              : "---"}
                          </td>
                          <td>{item?.outward_quantity}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col xl={12} className="text-end">
              <Card className="pb-5">
                <CardBody>
                  <h5 className="pb-3">DRIVER DETAILS</h5>
                  <Row>
                    <Col md={12}>
                      <Row>
                        <Col xs="12">
                          <div className="mb-3">
                            <h6>
                              Driver Name :{" "}
                              <span className="ms-2">
                                {outwardDetails?.outward_data?.driver_name ||
                                  "N/A"}
                              </span>
                            </h6>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={12}>
                      <Row>
                        <Col xs="12">
                          <div className="mb-3">
                            <h6>
                              Vehicle name :{" "}
                              <span className="ms-2">
                                {outwardDetails?.outward_data?.vehicle_name ||
                                  "N/A"}
                              </span>
                            </h6>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="12">
                          <div className="mb-3">
                            <h6>
                              Vehicle No. :{" "}
                              <span className="ms-2">
                                {outwardDetails?.outward_data?.vehicle_no ||
                                  "N/A"}
                              </span>
                            </h6>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col sm="4" className="text-center">

                          <span ><h5>{outwardDetails?.outward_data?.outward_from_name}</h5> Sent By</span>
                        </Col>
                        <Col sm="4" className="text-center">
                          <span ><h5>{outwardDetails?.outward_data?.outward_to_name}</h5> Received By</span>
                        </Col>
                        <Col sm="4" className="text-center">
                          <span ><h5>{outwardDetails?.outward_data?.outward_by}</h5> Received By</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* Print Popup End */}
    </div>
  );
};

export default OutwardDetailByIndentNo;
