import {
  API_BASE_URL,
  API_COMPANY_DETAILS_POST_GET,
  API_DELIVERY_BOYS_GET_BY_ID_AND_UPDATE,
  DB_IMAGES_URL,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import React from "react";

import LoaderPage from "components/Loader/LoaderPage";

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
  ModalFooter,
} from "reactstrap";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const CompanyDetails = () => {
  const [companyDetails, setCompanyDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  const companyDetailsData = async () => {
    try {
      const { data } = await axios.get(API_COMPANY_DETAILS_POST_GET, config);

      // Assuming your fetched data contains the image URLs/paths, update the state accordingly
      setCompanyDetails(data.data[0]);
      console.log("data.data", data.data);
      setLoading(false)
      console.log("companyDetails", companyDetails); // This might not show the updated state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    companyDetailsData();
  }, []);

  useEffect(() => {
    console.log("companyDetails", companyDetails); // Log the updated state here
  }, [companyDetails]);

  // ... rest of the component code

  return (
    <>
      <div className="page-content">
        {
          loading=== true ?(<LoaderPage/>):(
            <><Container fluid={true}>
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody className="d-flex justify-content-between">
                    <h3>Company Details</h3>
                  </CardBody>
                </Card>
              </Col>
            </Row>
  
            <Row>
              <Row>
                <Card>
                  <Col xl={12}>
                    <Row className="mt-4">
                      <Col lg={4}>
                        <div>
                          <img
                            src={`${API_BASE_URL}${companyDetails.logo} `}
                            alt=""
                            className=" avatar-lg ms-3 w-50"
                          />
                          <p className="mt-2 mb-lg-0"></p>
                        </div>
                      </Col>
                      <Col lg={8}>
                        <div>
                          <Link to={`/company-details-edit/${companyDetails.id}`}>
                            <Button className="edit-button btn btn-sm btn-warning ms-2">
                              <i className="fas fa-pen"></i>
                            </Button>
                          </Link>
                        </div>
                      </Col>
                    </Row>
                    {/*  */}
                    <Row className="mt-4">
                      <Col lg={12}>
                        <p className="ms-5 fs-4">Company Details :</p>
                      </Col>
                    </Row>
                    {/* second row */}
                    <Row className="mt-4">
                      <Col lg={4}>
                        <div className="ms-5  ">
                          <h5>Company Name : </h5>
                          <p> {companyDetails.company_name}</p>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="ms-5  ">
                          <h5>GSTIN : </h5>
                          <p> {companyDetails.GSTIN}</p>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="ms-5  ">
                          <h5>Contact No. : </h5>
                          <p> {companyDetails.contact_no}</p>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col lg={4}>
                        <div className="ms-5  ">
                          <h5>Company Email </h5>
                          <p> {companyDetails.company_email}</p>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="ms-5  ">
                          <h5>Customer Care Email : </h5>
                          <p> {companyDetails.customer_care_email}</p>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="ms-5 my-2  ">
                          <h5>Company Address : </h5>
                          <p>
                            <b>{companyDetails.company_address}</b>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Card>
              </Row>
            </Row>
          </Container></>
          )
        }
      </div>
    </>
  );
};

export default CompanyDetails;
