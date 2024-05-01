import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Container,
  CardTitle,
  CardSubtitle,
  Table,
} from "reactstrap";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import {
    API_DASHBOARD_SCHEDULAR_LIST_GET,
  API_DASHBOARD_SCHEDULAR_RUN,
} from "customhooks/All_Api/Apis";
import { toast } from "react-toastify";
import SchedularRazerPay from "./SchedularRazerPay";
import SchedularSmsCredentials from "./SchedularSmsCredentials";
import SendSmsCustomer from "./SendSmsCustomer";
import SendSmsFlag from "./SendSmsFlag";
const SchedularSettings = () => {
  const [schedularList, setSchedularList] = useState([]);

  // Local storage token Start
  const { config, first_name, last_name, department_type_name } =
    GetAuthToken();

  // Local storage token End

  const getSchedularListGet = async () => {
    const { data } = await axios.get(API_DASHBOARD_SCHEDULAR_LIST_GET, config);
    console.log("data", data);
    setSchedularList(data);
  };

  const handleScheduleRun = async (id) => {
    try {
      const response = await axios.post(
        `${API_DASHBOARD_SCHEDULAR_RUN}${id}/`,
        "",
        config
      );
      toast.success(response.data.message, {
        // Add a comma here
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getSchedularListGet();
    } catch (error) {
      console.log("error ", error);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    getSchedularListGet();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Scheduler Settings</h3>
                  <Link to="/dashboard">
                    <Button className="px-4" color="light">
                      <span className="dripicons-home font-size-20"></span>
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Schedular Name</th>
                          <th>Description</th>
                          <th>Last Run at</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedularList?.map((item) => (
                          <>
                            <tr>
                              <td>{item.name}</td>
                              <td>{item.name}</td>
                              <td>{item.last_run_date}</td>
                              <td>
                                <Button
                                  color="primary"
                                  className={`px-4 ${
                                    item.is_executed_today === false
                                      ? ""
                                      : "disabled"
                                  }`}
                                  onClick={() => handleScheduleRun(item.id)}
                                >
                                  Run
                                </Button>
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <SendSmsCustomer />
          <SendSmsFlag/>
          <SchedularRazerPay/>
          <SchedularSmsCredentials/>
        </Container>
      </div>
    </>
  );
};

export default SchedularSettings;
