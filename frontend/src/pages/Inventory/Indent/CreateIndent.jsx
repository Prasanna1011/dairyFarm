import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
  Table,
} from "reactstrap";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { API_INDENT_CREATE_GET_POST } from "customhooks/All_Api/Apis";
import { toast } from "react-toastify";

const CreateIndent = ({ openPopup,getIndentData }) => {
  const [createIndent, setcreateIndent] = useState(false);
  const [indentInfoData, setIndentInfoData] = useState(false);
  const [totalDemands, setTotalDemands] = useState({});
  const [comments, setComments] = useState(""); // Add this line to initialize the state

  const [totalDemandErrors, setTotalDemandErrors] = useState({});

  const { config, first_name, last_name , department_type_name ,designation } = GetAuthToken();
  const navigate = useNavigate();



  function createIndentPopupToggle() {
    try {
      const { department_type_name, designation } = GetAuthToken();
      if (department_type_name.toLowerCase() === "hub" && designation.toLowerCase() === "manager") {
        setcreateIndent(!createIndent);
      } else {
        // Display toast message
        toast.error("Only Hub manager can add", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    }
  }
  



  const getIndentDetails = async () => {
    try {
      const { data } = await axios.get(API_INDENT_CREATE_GET_POST, config);
      setIndentInfoData(data.data);
      console.log("data", data);
    } catch (error) {
      console.error("Error fetching indent details:", error.message);
    }
  };

  const handleSubmit = async () => {
    // Collect data from the form and create the desired data structure
    const formData = {
      requested_from: indentInfoData?.requested_from?.requested_from_name,
      requested_from_id: indentInfoData?.requested_from?.requested_from_id,
      requested_to_id: indentInfoData?.requested_to?.requested_to_id,
      requested_to: indentInfoData?.requested_to?.requested_to_name,
      requested_by_id: indentInfoData?.requested_by?.requested_by_id,
      requested_by: indentInfoData?.requested_by?.requested_by_name,
      comments: comments || "",  // This is the comments value from the state
      products: indentInfoData?.products?.map((product) => ({
        product: product.id,
        required_quantity: product.required_tomorrow,
        available_quantity: product.available_quantity,
        total_demand: totalDemands[product.id] || 0,
      })),
    };
    
    // Make the API request

    console.log("formData", formData);
    try {
      const response = await axios.post(
        API_INDENT_CREATE_GET_POST,
        formData,
        config
      );
      createIndentPopupToggle();
      console.log("API response:", response.data);
      toast.success(response.data.message, {
        // Add a comma here
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getIndentData();
      setIndentInfoData([])
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error("Error submitting indent:", error.message);
    }
  };

  const handleTotalDemandChange = (productId, value) => {
    if (value < 0) {
      setTotalDemandErrors((prevErrors) => ({
        ...prevErrors,
        [productId]: "Total demand cannot be negative.",
      }));
    } else {
      setTotalDemandErrors((prevErrors) => ({
        ...prevErrors,
        [productId]: "",
      }));
      setTotalDemands((prevTotalDemands) => ({
        ...prevTotalDemands,
        [productId]: parseInt(value, 10) || 0,
      }));
    }
  };

  return (
    <>
      <Button
        type="button"
        color="primary"
        onClick={() => {
          createIndentPopupToggle();
          openPopup();
          getIndentDetails();
        }}
      >
        Create Indent
      </Button>

      <Modal
        size="xl"
        isOpen={createIndent}
        toggle={() => {
          createIndentPopupToggle();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Create Indent</h5>
          <button
            type="button"
            onClick={() => {
              setcreateIndent(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Row>
            <Col md="6">
              <Label htmlFor="email">Requested From</Label>
              <Input
                name="email"
                placeholder="enter email id"
                type="text"
                className="form-control"
                id="validationCustom05"
                disabled={true}
                value={indentInfoData?.requested_from?.requested_from_name}
              />
            </Col>
            <Col md="6">
              <Label htmlFor="email">Requested to (Auto Fetch Head)</Label>
              <Input
                name="email"
                placeholder="enter email id"
                type="text"
                className="form-control"
                id="validationCustom05"
                disabled={true}
                value={indentInfoData?.requested_to?.requested_to_name}
              />
            </Col>
            <Col md="6" className=" mt-3">
              <Label htmlFor="email">Requested by (Auto Fetch username)</Label>
              <Input
                name="email"
                placeholder="enter email id"
                type="text"
                className="form-control "
                id="validationCustom05"
                disabled={true}
                value={indentInfoData?.requested_by?.requested_by_name}
              />
            </Col>
            <Col md="6" className="mt-3">
              <Label htmlFor="email">Comments (if any )</Label>
              <Input
                name="comments" // Give a unique name to the input
                placeholder="Enter Comment"
                type="text"
                className="form-control"
                id="validationCustom05"
                value={comments} // Bind the value to the state variable
                onChange={(e) => setComments(e.target.value)} // Update state on change
              />
            </Col>
          </Row>
          <Row className=" w-100  ">
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4 py-3">EST. REQUIRED STOCK</CardTitle>

                  <div className="table-responsive mt-3">
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Product</th>
                          <th>Required Tomorrow</th>
                          <th>Available Qty.</th>
                          <th>Total Demand</th>
                        </tr>
                      </thead>
                      <tbody>
                        {indentInfoData?.products?.map((product, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{product.name}</td>
                            <td>{product.required_tomorrow}</td>
                            <td>{product.available_quantity}</td>
                            <td>
                              <Input
                                type="number"
                                style={{ width: "70px" }}
                                value={totalDemands[product.id] || 0}
                                onChange={(e) =>
                                  handleTotalDemandChange(
                                    product.id,
                                    e.target.value
                                  )
                                }
                              />
                              <span className="text-danger">
                                {totalDemandErrors[product.id]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="text-center">
              <Button
                type="button"
                className="px-5"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                type="button"
                className="px-5 ms-2"
                color="danger"
                onClick={() => {
                  setcreateIndent(false);
                  
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default CreateIndent;
