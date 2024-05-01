import axios from "axios";
import { API_BASE_URL, API_HUB_ADD_GET, GET_COLLECTION_SUMARY } from "customhooks/All_Api/Apis";
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
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { useFormik } from "formik";
import * as Yup from "yup";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import LoaderPage from "components/Loader/LoaderPage";
import { CSVLink } from "react-csv";

const CollectionSummery = () => {
  const { config, first_name, last_name } = GetAuthToken();
  const [collectionSummaryData, setCollectionSummaryData] = useState();
  const [hubData, setHubData] = useState();
  const [dataDate, setDataDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedHub, setSelectedHub] = useState("");
  const [isFilterClicked, setIsFilterClicked] = useState(false);
  const [loading, setLoading] = useState(true);

  const getPaymentsData = async () => {
    try {
      const { data } = await axios.get(
        `${GET_COLLECTION_SUMARY}${dataDate}&hub_id=${selectedHub}`,
        config
      );

      setCollectionSummaryData(data);
      setLoading(false)
    } catch (error) {
      return error;
    }
  };

  const getHubData = async () => {
    try {
      const { data } = await axios.get(
        API_HUB_ADD_GET,
        config
      );
      setHubData(data.data);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getPaymentsData();
    getHubData();
  }, [dataDate, selectedHub]);

  let totalCollectedAmount = 0;
  let totalAmountDue = 0;

  if (collectionSummaryData && collectionSummaryData.length > 0) {
    collectionSummaryData.forEach((eachItem) => {
      totalCollectedAmount += Number(eachItem.amount_collected);
      totalAmountDue += Number(eachItem.amount_due);
    });
  }

  useEffect(() => {
    getPaymentsData();
  }, []);
  const csvData = collectionSummaryData?.map((item) => ({
    
  })).concat(collectionSummaryData?.map((item) => ({
    "Contact No.": item?.customer?.contact_no,
    "Customer Name": item.customer_name,
    "HUB Name": item.hub_name,
    "Collected By": item.collected_by_name,
    "Order ID": item.order_id,
    "Payment Mode": item.payment_mode,
    "Amount Due": item.amount_due,
    "Amount Collected": item.amount_collected,
    "Collected At": item.collected_at,
  })));
  

 
  return (
    <div className="page-content">
   {
    loading=== true?(<LoaderPage/>):(<>
       <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <div>
                  <h3 className={isFilterClicked ? "d-none" : ""}>
                    Collection Summary
                  </h3>
                  <div
                    className={
                      isFilterClicked ? "d-flex align-items-center" : "d-none"
                    }
                  >
                    <div className="d-flex flex-column w-100">
                      <label>Select Day</label>
                      <Flatpickr
                        id="joined_on"
                        name="joined_on"
                        placeholder="dd-mm-yyyy"
                        className="field"
                        options={{
                          dateFormat: "Y-m-d",
                        }}
                        onChange={(selectedDates, dateStr) =>
                          setDataDate(dateStr)
                        }
                      />
                    </div>
                    <div className="d-flex flex-column ms-3 w-100">
                      <label>Select Hub</label>
                      <select
                        className="field"
                        onChange={(e) => setSelectedHub(e.target.value)}
                      >
                        <option value="">--- Select Hub ---</option>
                        {hubData &&
                          hubData.map(
                            (eachHub, index) =>
                              eachHub.is_active && (
                                <option key={index} value={eachHub.id}>
                                  {eachHub.name}
                                </option>
                              )
                          )}
                      </select>
                    </div>
                    <div>
                      <button
                        className="btn btn-danger mt-4 ms-3"
                        onClick={() => setIsFilterClicked(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  {/* <Button
                    className={isFilterClicked ? "d-none" : "px-3 me-2"}
                    color="primary"
                  >
                    Export
                  </Button> */}
                    <CSVLink
            data={csvData}
            filename={"Collection_Summary.csv"}
          >
            <Button color="primary" className="px-4 me-2">
              Export CSV
            </Button>
          </CSVLink>
                  <Button
                    className={isFilterClicked ? "d-none" : "px-3 me-2"}
                    color="primary"
                    onClick={() => setIsFilterClicked(!isFilterClicked)}
                  >
                    Filter
                  </Button>
                  
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
                        <th className="text-center">Subscriber</th>
                        <th className="text-center">Order No</th>
                        <th className="text-center">Amount Due</th>
                        <th className="text-center">Amount Collected</th>
                        <th className="text-center">Hub</th>
                        <th className="text-center">Collected By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionSummaryData &&
                        collectionSummaryData.map((transaction) => (
                          <tr key={transaction.order_id}>
                            <td className="text-center">
                              {transaction.customer_name}
                            </td>
                            <td className="text-center">
                              {transaction.order_id}
                            </td>
                            <td className="text-center">
                              {transaction.amount_due}
                            </td>
                            <td className="text-center">
                              {transaction.amount_collected}
                            </td>
                            <td className="text-center">
                              {transaction.hub_name}
                            </td>
                            <td className="text-center">
                              {transaction.collected_by_name}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
                <div className="d-flex flex-column">
                  <h6>
                    Total Amount Collected :{" "}
                    {totalCollectedAmount && totalCollectedAmount}
                  </h6>
                  <h6>Total Amount Due : {totalAmountDue && totalAmountDue}</h6>
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

export default CollectionSummery;