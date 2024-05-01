import axios from "axios";
import { API_CWH_GET_POST } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import LoaderPage from "components/Loader/LoaderPage";

const Cwh = () => {
  const [CWHData, setCWHData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End
  const getAllCwhData = async () => {
try {
  const { data } = await axios.get(API_CWH_GET_POST, config);
  setCWHData(data.data);
  // console.log("data",data.data);
  setLoading(false)

} catch (error) {
  console.log("error",error);
}
  };
  console.log("CWHData", CWHData);
  useEffect(() => {
    getAllCwhData();
  }, []);
  return (
    <>
        <div className="page-content">
        <Container fluid={true}>
    {
      loading=== true ?(
        <LoaderPage/>
      ):(
        <>
          <Row>
        <Col xl={12}>
          <Card >
            <CardBody className="d-flex justify-content-between">
              <h3>CWH</h3>
              <Link to="/cwh-add">
                <Button className="px-4" color="primary">
                  Add
                </Button>
              </Link>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
      {CWHData.map((item) => (
        <>
          
          <Col lg={4} className="mb-4">
  <Card className="h-100 border-0 shadow-sm">
    <CardHeader className="bg-transparent border-bottom d-flex justify-content-between align-items-center">
      <h5 className="my-0 text-primary">
        <i className="bx bxs-store me-2" />
        <span className="me-1">CWH :</span>
        <b>{item.name}</b>
      </h5>
      <Link to={`/cwh-edit/${item.id}`}>
        <Button color="warning" size="sm">
          <i className="bx bx-pencil"></i> Edit
        </Button>
      </Link>
    </CardHeader>
    <CardBody className="bg-transparent">
      <CardText>
        <Row className="mb-3">
          <Col xs={4} className="fw-bold text-muted">City:</Col>
          <Col xs={8}>{item.city}</Col>
        </Row>
        <Row className="mb-3">
          <Col xs={4} className="fw-bold text-muted">Farm:</Col>
          <Col xs={8}>{item.farm}</Col>
        </Row>
        <Row className="mb-3">
          <Col xs={4} className="fw-bold text-muted">Manager:</Col>
          <Col xs={8}>
            {item?.warehouse_manager_name == null ? (
              <span>Not Assigned</span>
            ) : (
              item?.warehouse_manager_name
            )}
          </Col>
        </Row>
        <Row>
          <Col xs={4} className="fw-bold text-muted">Status:</Col>
          <Col xs={8}>
            {item.is_active ? (
              <Badge color="success">Active</Badge>
            ) : (
              <Badge color="danger">Inactive</Badge>
            )}
          </Col>
        </Row>
      </CardText>
    </CardBody>
  </Card>
</Col>

        
        </>
      ))}
      </Row>
        </>
      )
    }
      </Container>
      </div>
    </>
  );
};

export default Cwh;
