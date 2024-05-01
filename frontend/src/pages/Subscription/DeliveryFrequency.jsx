import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Container, Button } from "reactstrap";
import {
  API_DELIVERY_FREQUENCY_GET,
  API_DELIVERY_FREQUENCY_UPDATE,
} from "customhooks/All_Api/Apis";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const DeliveryFrequency = () => {
  const [deliveryFrequencyDataAlternate, setDeliveryFrequencyDataAlternate] =
    useState([]);
  const [deliveryFrequencyDataDay, setDeliveryFrequencyDataDay] = useState([]);
  const [selectedAlternateDayFrequencyID, setSelectedAlternateDayFrequencyID] =
    useState(null);

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  console.log(
    "selectedAlternateDayFrequencyID",
    selectedAlternateDayFrequencyID
  );

  const getDeliveryFrequency = async () => {
    const { data } = await axios.get(API_DELIVERY_FREQUENCY_GET, config);
    setDeliveryFrequencyDataAlternate(data.data.alternate_day);
    setDeliveryFrequencyDataDay(data.data.daily_day);
  };

  //  for Alternate Days Start

  const handleCheckboxChange = async (itemId) => {
    // Find the item to update
    const itemToUpdate = deliveryFrequencyDataAlternate.find(
      (item) => item.id === itemId
    );

    if (!itemToUpdate) {
      return;
    }

    const updatedItem = {
      id: itemToUpdate.id,
      is_active: !itemToUpdate.is_active,
    };

    try {
      // Make an API call to update the server with the new state of the checkbox
      await axios.post(
        `${API_DELIVERY_FREQUENCY_UPDATE}${itemId}/`,
        updatedItem,
        config
      );
    } catch (error) {
      console.log("Error updating checkbox state:", error);
      // You may want to handle the error appropriately here.
    }

    // Update the local state with the updated data
    setDeliveryFrequencyDataAlternate((prevData) =>
      prevData.map((item) => (item.id === itemId ? updatedItem : item))
    );
  };

  //  alternate days End

  //
  const handleCheckboxChangeDays = async (itemId) => {
    // Find the item to update
    const itemToUpdate = deliveryFrequencyDataDay.find(
      (item) => item.id === itemId
    );

    if (!itemToUpdate) {
      return;
    }

    const updatedItem = {
      id: itemToUpdate.id,
      is_active: !itemToUpdate.is_active,
    };

    try {
      // Make an API call to update the server with the new state of the checkbox
      await axios.post(
        `${API_DELIVERY_FREQUENCY_UPDATE}${itemId}/`,
        updatedItem,
        config
      );
    } catch (error) {
      console.log("Error updating checkbox state:", error);
      // You may want to handle the error appropriately here.
    }

    // Update the local state with the updated data
    setDeliveryFrequencyDataDay((prevData) =>
      prevData.map((item) => (item.id === itemId ? updatedItem : item))
    );
  };

  const daysArray = [
    { key: "MONDAY", day: "MON" },
    { key: "TUESDAY", day: "TUE" },
    { key: "WEDNESDAY", day: "WED" },
    { key: "THURSDAY", day: "THU" },
    { key: "FRIDAY", day: "FRI" },
    { key: "SATURDAY", day: "SAT" },
    { key: "SUNDAY", day: "SUN" },
  ];

  useEffect(() => {
    getDeliveryFrequency();
  }, []);

  return (
    <div className="px-3">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card className="py-3">
              <h4 className="ms-3 mt-3"> Delivery Frequency</h4>
              <CardBody>
                {deliveryFrequencyDataAlternate.map((item) => (
                  <div key={item.id}>
                    <Row>
                      <Col md="3">
                        <h5>Alternate</h5>
                      </Col>

                      <Col md="2 border-bottom">
                        <div>
                          <p className="fw-light mb-0 pb-0">Day 1 Qty</p>
                          <span className="mt-0 pt-0 fw-light">
                            <b>1</b>
                          </span>
                        </div>
                      </Col>
                      <Col md="2 ">
                        <p className="text-center">&</p>
                      </Col>
                      <Col md="2 border-bottom">
                        <div>
                          <p className="fw-light mb-0 pb-0">Day 2 Qty</p>
                          <span className="mt-0 pt-0 fw-light">
                            <b>0</b>
                          </span>
                        </div>
                      </Col>
                      <Col md="2">
                        <label>
                          <input
                            className=""
                            type="checkbox"
                            value={item.id}
                            checked={item.is_active}
                            onChange={() => handleCheckboxChange(item.id)}
                            onClick={() => {
                              setSelectedAlternateDayFrequencyID(item.id);
                            }}
                          />
                          {item.delivery_pattern}
                        </label>
                      </Col>
                    </Row>
                  </div>
                ))}

                {/* frequency Start */}
                {deliveryFrequencyDataDay.map((item) => (
                  <div key={item.id}>
                    <Row className="mt-3">
                      <Col md="3">
                        <h5 className="mt-3">Daily</h5>
                      </Col>

                      <Col md="6 ">
                        <div className="d-flex mt-3">
                          {daysArray.map((day) => (
                            <div
                              key={day.key}
                              className="d-flex align-items-center"
                            >
                              <div className="form-check ">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckCheckedDisabled"
                                  checked
                                  disabled
                                />
                                <label
                                  className="form-check-label me-4"
                                  htmlFor="flexCheckCheckedDisabled"
                                >
                                  {day.day}
                                </label>
                              </div>
                              {/* <p className="ms-2 d-flex align-items-center">
                                {day.day}
                              </p> */}
                            </div>
                          ))}
                        </div>
                      </Col>

                      <Col md="2 ">
                        <label className="">
                          <input
                            className="mt-3"
                            type="checkbox"
                            value={item.id}
                            checked={item.is_active}
                            onChange={() => handleCheckboxChangeDays(item.id)}
                            onClick={() => {
                              setSelectedAlternateDayFrequencyID(item.id);
                            }}
                          />
                          {item.delivery_pattern}
                        </label>
                      </Col>
                    </Row>
                  </div>
                ))}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DeliveryFrequency;
