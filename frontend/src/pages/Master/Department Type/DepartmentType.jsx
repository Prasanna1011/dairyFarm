import axios from "axios";
import {
  API_DEPARTMENT_TYPE_DELETE,
  API_DEPARTMENT_TYPE_GET_POST,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import React, { useState, useEffect } from "react";
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
  CardTitle,
  Modal,
} from "reactstrap";

const DepartmentType = () => {
  const [departmentTypeData, setDepartmentTypeData] = useState([]);
  const [deleteModal, setdeleteModal] = useState(false);

  function deletePopupToggle() {
setdeleteModal(!deleteModal);
}

  //  local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
  //  local storage token End

  const getDepartmentData = async () => {
    const { data } = await axios.get(API_DEPARTMENT_TYPE_GET_POST, config);
    setDepartmentTypeData(data.data);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_DEPARTMENT_TYPE_DELETE}${id}`, config);
      getDepartmentData();
      // If deletion is successful, update the departmentTypeData state to reflect the updated data
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDepartmentData();
  }, []);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Department Types</h3>
                  <Link to="/master-add-department">
                    <Button className="px-4" color="primary">
                      Add
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
                          <th>Sr no.</th>
                          <th>Department Types</th>

                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departmentTypeData.map((item, index) => (
                          <>
                            <tr>
                              <th scope="row">{index + 1}</th>
                              <td>{item.type}</td>
                              <td>
                                <Link to={`/master-department-edit/${item.id}`}>
                                  <Button
                                    className="btn btn-warning btn-sm"
                                    size="small"
                                  >
                                    <i className="fas fa-pencil-alt"></i>
                                  </Button>
                                </Link>

                                <Button
                                  className="btn btn-danger btn-sm ms-1"
                                  color="danger"
                                  onClick={() => {
                                    handleDelete(item.id);
                                  }}
                                >
                                  <i className="fas fa-trash-alt"></i>
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

          {/* delete popup Window Start */}


<Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h5">Vertically Centered</CardTitle>
                  <p className="card-title-desc">
                    Add <code>.modal-dialog-centered</code> to{" "}
                    <code>.modal-dialog</code> to vertically center the modal.
                  </p>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary "
                      onClick={() => {
                        deletePopupToggle();
                      }}
                    >
                      Center modal
                    </button>
                    <Modal
                      isOpen={deleteModal}
                      toggle={() => {
                        deletePopupToggle();
                      }}
                      centered
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0">Center Modal</h5>
                        <button
                          type="button"
                          onClick={() => {
                            setdeleteModal(false);
                          }}
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p className="mb-0">
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>
          {/* delete popup Window End */}
        </Container>
      </div>
    </>
  );
};

export default DepartmentType;
