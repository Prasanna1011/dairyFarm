import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
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
import PropTypes from "prop-types";
import axios from "axios";
import { API_FARM_GET_POST } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
const LoadingContainer = () => <div>Loading...</div>;
const Farm = ({ google }) => {
  const [loading, setLoading] = useState(true);
  const [farmData, setFarmData] = useState([]);
  const [latLng, setLatLng] = useState({ lat: null, lng: null });

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  // for lati and longi
  useEffect(() => {
    const fetchLatLng = async () => {
      try {
        // Use geocoding API to get latitude and longitude for the exampleAddress
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            `${farmData.address}`
          )}&key=AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch coordinates");
        }

        const data = await response.json();
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } catch (error) {
        console.error(error);
        return { lat: null, lng: null };
      }
    };

    fetchLatLng();
  }, []);
  // for lati and longi

  // Fetch latitude and longitude for each farm individually
  useEffect(() => {
    const fetchFarmCoordinates = async () => {
      const updatedFarmData = await Promise.all(
        farmData.map(async (item) => {
          if (item.address) {
            const coordinates = await getLatLngForFarm(item.address);
            return { ...item, lat: coordinates.lat, lng: coordinates.lng };
          }
          return item;
        })
      );

      setFarmData(updatedFarmData);
    };

    fetchFarmCoordinates();
  }, []);
  useEffect(() => {}, [farmData]);

  const getFarmData = async () => {
    const { data } = await axios.get(API_FARM_GET_POST, config);
    setFarmData(data.data);
setLoading(false)
    // console.log(data);
    // console.log(farmData);
  };

  useEffect(() => {
    getFarmData();
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
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Farm</h3>
                  <Link to="/farm-add">
                    <Button className="px-4" color="primary">
                      Add
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
          {farmData.map((item) => (
            <>
        


           


           <Col lg={4} className="mb-4">
      <Card className="h-100 border-0 shadow-sm">
      <CardHeader className="bg-transparent border-bottom d-flex justify-content-between align-items-center">
          <h5 className="my-0 text-primary">
            <i className="bx bxs-factory me-2" />
            <b>{item.name}</b>
          </h5>
          <Link to={`/farm-edit/${item.id}`}>
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
              <Col xs={4} className="fw-bold text-muted">Manager:</Col>
              <Col xs={8}>{item.farm_manager_name}</Col>
            </Row>
            <Row className="mb-3">
              <Col xs={4} className="fw-bold text-muted">Address:</Col>
              <Col xs={8}>{item.address}</Col>
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
export default GoogleApiWrapper({
  apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
})(Farm);
