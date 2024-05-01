import React, { useState, useRef, useEffect } from "react";
import { TablePagination } from "@mui/material";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { CSVLink } from "react-csv";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import { format } from "date-fns";
import { API_HUB_COLLECTION_SUMMARY, API_HUB_COLLECTION_SUMMARY_WITH_FILTER } from "customhooks/All_Api/Apis";
import axios from "axios";
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
} from "reactstrap";

const CollectionSummeryHub = () => {
  const [loading, setLoading] = useState(true);
  const [collectionSummaryData, setdCollectionSummaryData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [totalCollectedAmount, setTotalCollectedAmount] = useState(0);

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
  // Local storage token End

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const getCollectionSummaryData = async () => {
    try {
      const { data } = await axios.get(`${API_HUB_COLLECTION_SUMMARY_WITH_FILTER}?date=${formattedDate}&hub_id=`, config);
      setdCollectionSummaryData(data);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    let dueAmountTotal = 0;
    let collectedAmountTotal = 0;

    collectionSummaryData.forEach((item) => {
      dueAmountTotal += item.amount_due || 0;
      collectedAmountTotal += item.amount_collected || 0;
    });

    setTotalDueAmount(dueAmountTotal);
    setTotalCollectedAmount(collectedAmountTotal);
  }, [collectionSummaryData]);

  // Calculate pending amount
  const pendingAmount = totalDueAmount - totalCollectedAmount;

  useEffect(() => {
    getCollectionSummaryData();
  }, [selectedDate]);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
      {
        loading === true ?(<LoaderPage/>):(<>
            <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between align-items-center ">
                  <h3>Collection Summary</h3>
                  <div className="d-flex  align-items-center">
                    <div className="">
                      <label htmlFor="datepicker" className="form-label">
                        Select Date:
                      </label>
                      <Flatpickr
                        id="datepicker"
                        value={selectedDate}
                        onChange={(dates) => setSelectedDate(dates[0])}
                        options={{
                          dateFormat: "d-m-Y",
                          maxDate: new Date(), // Restrict selection to the current date
                        }}
                        className="form-control"
                      />
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
                          <th>Suscriber</th>
                          <th>Order No. </th>
                          <th> Amount Due</th>
                          <th> Ammount Collected</th>
                          <th> Collected By</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {collectionSummaryData?.map((item) => (
                          <>
                            <tr key={item?.collected_by}>
                              <td>{item?.customer_name}</td>
                              <td>{item?.order_id}</td>
                              <td>₹ {item?.amount_due}</td>
                              <td>₹ {item?.amount_collected}</td>
                              <td>{item?.collected_by_name}</td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-evenly align-items-center mt-5">
                      <b>
                        {" "}
                        <p>Total Due Amount : ₹ {totalDueAmount}</p>
                      </b>
                      <b>
                        <p>Total Collected Amount : ₹ {totalCollectedAmount}</p>
                      </b>
                      <b>
                        <p className="text-danger">
                          Collection Pending Amount : ₹ {pendingAmount}
                        </p>
                      </b>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>)
      }
        </Container>
      </div>
    </>
  );
};

export default CollectionSummeryHub;
