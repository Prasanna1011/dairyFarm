import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  API_DELIVERY_PATTERN_GET_POST,
  API_DELIVERY_PATTERN_UPDATE,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";

const SubscriptionDeliveryPattern = () => {
  const [deliveryPatternData, setDeliveryPatternData] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState({}); // Store selected patterns as an object

  // local storage token
  const { config, first_name, last_name } = GetAuthToken();

  const deliveryPatternDetails = async () => {
    try {
      const { data } = await axios.get(API_DELIVERY_PATTERN_GET_POST, config);

      // Initialize selectedPatterns with an object where keys are item IDs and values are is_active status
      const initialSelectedPatterns = {};
      data.data.forEach((item) => {
        initialSelectedPatterns[item.id] = item.is_active;
      });

      setSelectedPatterns(initialSelectedPatterns);
      setDeliveryPatternData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    deliveryPatternDetails();
  }, []);

  const handleCheckboxChange = async (id, deliveryPattern) => {
    const updatedSelectedPatterns = {
      ...selectedPatterns,
      [id]: !selectedPatterns[id],
    };

    // Make an API call to update the server with the new state of the checkbox
    try {
      await axios.post(
        `${API_DELIVERY_PATTERN_UPDATE}${id}/`,
        {
          id,
          is_active: updatedSelectedPatterns[id],
          delivery_pattern: deliveryPattern,
        },
        config
      );
    } catch (error) {
      console.log("Error updating checkbox state:", error);
      // You may want to handle the error appropriately here.
    }

    setSelectedPatterns(updatedSelectedPatterns);
  };

  return (
    <>
      <div className="px-3">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card className="py-3">
                <h4 className=" ms-3">Delivery Pattern</h4>
                <CardBody>
                  <Row>
                    {deliveryPatternData.map((item) => (
                      <Col className="fs-6 pb-2 " md="6" key={item.id}>
                        <label>
                          <input
                            className="me-2"
                            type="checkbox"
                            value={item.id}
                            checked={selectedPatterns[item.id]}
                            onChange={() =>
                              handleCheckboxChange(
                                item.id,
                                item.delivery_pattern
                              )
                            }
                          />
                          {item.delivery_pattern}
                        </label>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SubscriptionDeliveryPattern;
