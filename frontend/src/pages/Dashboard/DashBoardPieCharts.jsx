import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { API_DASHBOARD_GET_CARD_DATA } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";

const DashboardPieCharts = () => {
  const [cardData, setCardData] = useState({});
  const [showSubscriptionOrders, setShowSubscriptionOrders] = useState(true);

  const { config } = GetAuthToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_DASHBOARD_GET_CARD_DATA, config);
        setCardData(response.data);
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchData();
  }, []);

  const subscriptionOrderData = cardData.subscription_order_summary;
  const cartOrderData = cardData.cart_order_summary;
  const taskSummaryData = cardData.task_summary;

  // Map the keys to user-friendly labels
  const mapKeysToLabels = (data) => {
    const newData = {};
    for (const key in data) {
      let newKey = key.replace(/_/g, " "); // Replace underscores with spaces
      newKey = newKey.charAt(0).toUpperCase() + newKey.slice(1); // Capitalize first letter
      newData[newKey] = data[key];
    }
    return newData;
  };

  const createPieChart = (data, title) => {
    if (!data || Object.keys(data).length === 0) {
      return <div>Loading...</div>; // or any other fallback UI
    }
  
    const options = {
      series: Object.values(data),
      labels: Object.keys(data),
      chart: {
        type: "pie",
        width: 380,
      },
      title: {
        text: title,
        align: "center",
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center", // Align legend items to the center horizontally
        itemMargin: {
          horizontal: 10, // Adjust the horizontal margin between legend items
          vertical: 0, // No vertical margin between legend items
        },
        markers: {
          width: 20, // Set the width of the legend markers
          height: 10, // Set the height of the legend markers
        },
      },
      colors: ["#D53A35", "#2A3042", "#6AB0B8", "#E98F6F", "#9FDABF", "#7FAE90", "#CA8622"], // Custom colors for the pie chart
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  
    return <ApexCharts options={options} series={options.series} type="pie" width={450} />;
  };

  const toggleOrders = () => {
    setShowSubscriptionOrders(!showSubscriptionOrders);
  };

  return (
    <div>
         <div className="page-content">
        <Container
          className="d-flex flex-column justify-content-center"
          fluid={true}
        >
      <Row>
        <Col xs="12" md="6">
          <Card>
            <CardBody className="">
              <div>

                <div className="
                 text-end ">
                <Button color="primary" onClick={toggleOrders}  >
                  {showSubscriptionOrders
                    ? "Cart Order Summary"
                    : "Subscription Order Summary"}
                </Button>
                </div>
                <div className="d-flex justify-content-center">
                {showSubscriptionOrders
                  ? createPieChart(mapKeysToLabels(subscriptionOrderData), "Subscription Order Summary")
                  : createPieChart(mapKeysToLabels(cartOrderData), "Cart Order Summary")}
                </div>
                

               
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" md="6">
          <Card>
            <CardBody className="">
              <div className="text-end">
                <div>     <Button color="light" >
                  Task Summary
                </Button></div>
                <div className="d-flex justify-content-center">
                {createPieChart(mapKeysToLabels(taskSummaryData), "Task Summary")}


                </div>
           

              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      </Container>
      </div>

    </div>
  );
};

export default DashboardPieCharts;


