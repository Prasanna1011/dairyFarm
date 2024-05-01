import React, { useEffect, useRef, useMemo } from "react";
import { useFormik } from "formik";

import * as yup from "yup";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Label,
  Input,
  Form,
  FormFeedback,
  ModalBody,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { TablePagination } from "@mui/material";
import LoaderPage from "components/Loader/LoaderPage";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

import {
  API_CUSTOMER_GROUP_DELETE,
  API_CUSTOMER_GROUP_GET_POST,
} from "customhooks/All_Api/Apis";

const CustomerGroup = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modal, setModal] = useState(false);
  const [customerGroupData, setcustomerGroupData] = useState([]);
  const [deleteId, setDeleteId] = useState();
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerGroupName, setCustomerGroupName] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const DeleteConformFun = () => setConfirmDelete(!ConfirmDelete);
  const { config, first_name, last_name } = GetAuthToken();
  const url = API_CUSTOMER_GROUP_GET_POST;

  // modal popup start
  const toggle = () => setModal(!modal);
  const externalCloseBtn = (
    <button
      type="button"
      className="close"
      style={{ position: "absolute", top: "15px", right: "15px" }}
      onClick={toggle}
    >
      &times;
    </button>
  );
  // modal popup End

  const validation = useFormik({
    initialValues: {
      customer_group: "",
    },
    validationSchema: yup.object({
      customer_group: yup.string().required("Delivery Patterns is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(url, values, config);
        customerGroupGetData();
        toggle();

        toast.success(`Customer Group successfully added successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(`Customer Group successfully must be unique`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  // Delivery Pattern data GET Start
  const customerGroupGetData = async () => {
    try {
      const response = await axios.get(url, config);
      setcustomerGroupData(response.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Delivery Pattern data GET End

  // delete Tax Rate  Start
  const handleDelete = async (id) => {
    try {
      const URL = `${API_CUSTOMER_GROUP_DELETE}${id}/`;

      await axios.delete(URL, config);

      customerGroupGetData();
      toast.success(`Customer Group successfully`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.error(error);
      toast.error(` Something Went Wrong`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // delete Tax Rate End

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = customerGroupData.filter((item) => {
      const searchString = `${item.customer_group_name}  `; // Add more properties as needed
      return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(searchData);
  };

  // Search Filter End

  //  local storage token Start

  //  local storage token End

  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Pagenation End

  useEffect(() => {
    customerGroupGetData();
  }, []);
  useEffect(() => {
    handleSearch();
  }, [searchQuery, customerGroupData]);

  return (
    <>
      <Row>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>Customer Group</h3>
              {/* <Link to="/master-city"> */}
              <Button color="primary" onClick={toggle}>
                Create
              </Button>
              {/* </Link> */}
            </CardBody>
          </Card>
        </Col>

        {/*  */}

        <div className="d-flex mb-3 justify-content-center">
          <input
            ref={searchInputRef}
            className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded px-3 "
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="   Search ..."
          />
          {searchQuery.length >= 1 ? (
            <Button
              className="btn btn-sm "
              onClick={() => {
                const input = searchInputRef.current;
                if (input) {
                  input.select();
                  document.execCommand("cut");
                }
              }}
            >
              <i className="fas fa-times"></i>
            </Button>
          ) : (
            <Button className=" btn btn-sm " onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </Button>
          )}
        </div>

        {/*  */}
        <Col xl={12}>
          <Card>
            <CardBody>
              <div className="table-responsive">
                {loading == true ? (
                  <LoaderPage />
                ) : (
                  <Table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Sr no.</th>
                        <th>Customer Group</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(searchQuery
                        ? filteredData
                        : customerGroupData &&
                          customerGroupData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                      ).map((item, index) => (
                        <tr key={item.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.customer_group_name}</td>
                          <td>
                            <Link to={`/master-customer-group/${item.id}`}>
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
                              // onClick={DeleteConformFun}
                              onClick={() => {
                                DeleteConformFun(
                                  item.id && setDeleteId(item.id),
                                  setCustomerGroupName(item.customer_group_name)
                                );
                              }}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </CardBody>
            <TablePagination
              className=" d-flex justfy-content-start"
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={customerGroupData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Col>
      </Row>
      <div>
        {/* Model WinDow Start */}
        <Modal isOpen={modal} toggle={toggle} external={externalCloseBtn}>
          <ModalHeader>Customer Group </ModalHeader>

          <Col xl="12">
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  onSubmit={validation.handleSubmit}
                >
                  {/*  */}
                  <Row className="">
                    <Label for="exampleEmail" className="mt-3" sm={4}>
                      Customer Group
                    </Label>
                    <Col sm={8} className="mt-3 mb-3 ">
                      <Input
                        name="customer_group"
                        placeholder="Customer Group"
                        type="text"
                        className="form-control "
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.customer_group || ""}
                        invalid={
                          validation.touched.customer_group &&
                          validation.errors.customer_group
                            ? true
                            : false
                        }
                      />
                      {validation.touched.customer_group &&
                      validation.errors.customer_group ? (
                        <FormFeedback type="invalid">
                          {validation.errors.customer_group}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  {/*  */}

                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Add Customer group
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Modal>
        {/* Model WinDow End */}
      </div>
      {/* Delete Popup Start */}
      <div>
        <Modal isOpen={ConfirmDelete} toggle={DeleteConformFun}>
          <ModalHeader toggle={DeleteConformFun}>
            <h4 className="ms-5 text-danger">Alert</h4>
          </ModalHeader>
          <ModalBody>
            <p className=" text-center">
              Are yoy Sure to delete
              <h5 className="text-danger mx-1">{customerGroupName}</h5>
              Customer Group ?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              // onClick={DeleteConformFun}
              onClick={(e) => {
                handleDelete(deleteId), DeleteConformFun();
              }}
              deleteId
            >
              Delete
            </Button>
            <Button color="secondary" onClick={DeleteConformFun}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      {/* Delete Popup End */}
    </>
  );
};

export default CustomerGroup;
