import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  Table,
  ModalHeader,
  ModalBody,
  ModalFooter,
  
} from "reactstrap";
import axios from "axios";
import { API_ROLE_AND_PERMISSION_GET_POST, API_ROLE_AND_PERMISSION_DELETE } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { TablePagination } from "@mui/material";
import LoaderPage from "components/Loader/LoaderPage";

const RoleAndPermissions = () => {
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [roleName, setRoleName] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const toggleConfirmDelete = () => setConfirmDelete(!confirmDelete);

  const { config } = GetAuthToken();

  const getRoleAndPermissionData = async () => {
    try {
      const { data } = await axios.get(API_ROLE_AND_PERMISSION_GET_POST, config);
      setRoleData(data.data);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_ROLE_AND_PERMISSION_DELETE}${id}/`, config);
      await getRoleAndPermissionData();
      toast.success(`Role deleted successfully`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      toggleConfirmDelete();
    } catch (error) {
      console.error(error);
      toast.error(`Something Went Wrong`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    getRoleAndPermissionData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
     {
      loading === true ?(<LoaderPage />):(<>

<Row>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>Roles & Permissions</h3>
              <Link to={"/add-role-&-permissions"}>
                <Button color="primary">Create</Button>
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
                      <th>sr.no</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.name}</td>
                          <td>
                            {item.created_mobile_no} <br />
                            {format(new Date(item.created_at), "dd-MM-yyyy @h:mm a")}
                          </td>
                          <td>
                            {item.updated_mobile_no} <br />
                            {format(new Date(item.updated_at), "dd-MM-yyyy @h:mm a")}
                          </td>
                          <td>
                            <Link to={`/edit-role-&-permissions/${item.id}`}>
                              <Button className="btn btn-warning btn-sm">
                                <i className="fas fa-pencil-alt"></i>
                              </Button>
                            </Link>
                            <Button
                              className="btn btn-danger btn-sm ms-2"
                              onClick={() => {
                                setDeleteId(item.id);
                                setRoleName(item.name);
                                toggleConfirmDelete();
                              }}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
             
            </CardBody>
            <TablePagination
                className="d-flex justify-content-start"
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={roleData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
          </Card>
        </Col>
      </Row>
      </>
      )
     }

      {/* Delete Popup Start */}
      <Modal isOpen={confirmDelete} toggle={toggleConfirmDelete}>
        <ModalHeader toggle={toggleConfirmDelete}>
          <h4 className="ms-5 text-danger">Alert</h4>
        </ModalHeader>
        <ModalBody>
          <p className="text-center">
            Are you Sure to delete
            <span className="text-danger fs-5 mx-1">{roleName}</span> Role ?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => handleDelete(deleteId)}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleConfirmDelete}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal> 
      {/* Delete Popup End */}
    </>
  );
};

export default RoleAndPermissions;
