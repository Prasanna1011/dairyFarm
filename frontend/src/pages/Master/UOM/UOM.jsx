import React, { useEffect, useRef } from "react";
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
  ModalBody,
  Input,
  Form,
  FormFeedback,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LoaderPage from "components/Loader/LoaderPage";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { API_UOM_DELETE, API_UOM_GET_POST } from "customhooks/All_Api/Apis";

const UOM = () => {
  const [loading , setLoading] = useState(true)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modal, setModal] = useState(false);
  const [UOMData, setUOMData] = useState([]);
  const [deleteId, setDeleteId] = useState();
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const [UOMName, setUOMName] = useState("");
  const [UOMNQuantity, setUOMNQuantity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  const DeleteConformFun = () => setConfirmDelete(!ConfirmDelete);
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

  //  local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
  //  local storage token End

  const validation = useFormik({
    initialValues: {
      unit_name: "",
      quantity: "",
    },
    validationSchema: yup.object({
      unit_name: yup.string().required("Unit Name is required"),
      quantity: yup.string().required("Quantity is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(API_UOM_GET_POST, values, config);
        getUOMData()

        toggle();
        toast.success(`UOM added successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(`Something Went Wrong`, {
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

  // Tax Rate data GET Start
  const getUOMData = async () => {
    try {
      const response = await axios.get(API_UOM_GET_POST, config);
      setUOMData(response.data?.data || []);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };
  // Tax Rate data GET End

  // Search Filter Start
  const searchInputRef = useRef(null);
 

  const handleSearch = () => {
    const searchData = UOMData.filter((item) => {
      const searchString = `${item.unit_name} ${item.quantity}`; // Add more properties as needed
      return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(searchData);
  };
  
  // Search Filter End

  // delete UOM Data  Start

  const handleDelete = async () => {
    try {
      const URL = `${API_UOM_DELETE}${deleteId}/`;

      await axios.delete(URL, config);
      getUOMData()
      toast.success(`Entry Deleted successfully`, {
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
  // delete UOM Data   End


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
    getUOMData()
  }, []);
  useEffect(() => {
    handleSearch();
  }, [searchQuery, UOMData]);
  return (
    <>
      <Row>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>Unit of Measure</h3>
              <Button color="primary" onClick={toggle}>
                Create
              </Button>
            </CardBody>
          </Card>
        </Col>

        {/*  */}

        <div className="d-flex mb-3 justify-content-center">
          <input
            className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded px-3"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
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
       {
        loading == true ? <LoaderPage/>:  <Col xl={12}>
        <Card className="pb-5">
            <CardBody>
              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Sr no.</th>
                      <th className=" ">Unit Name</th>
                      <th>Qty</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(searchQuery
                      ? filteredData
                      : UOMData &&
                        UOMData.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                    ).map((item, index) => (
                      <>
                        <tr className="mb-3">
                          <th scope="row">{index + 1}</th>
                          <td>{item.unit_name}</td>
                          <td>{item.quantity}</td>
                          <td>
                            <Link to={`/master-uom-edit/${item.id}`}>
                              <Button className="btn btn-warning btn-sm">
                                <i className="fas fa-pencil-alt"></i>
                              </Button>
                            </Link>
                            <Button
                              className="btn btn-danger btn-sm ms-2"
                              color="danger"
                              // onClick={DeleteConformFun}
                              onClick={() => {
                                DeleteConformFun(
                                  item.id && setDeleteId(item.id),
                                  setUOMName(item.unit_name),
                                  setUOMNQuantity(item.quantity)
                                );
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
            <TablePagination
              className=" d-flex justfy-content-start"
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={UOMData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Col>
       }
      </Row>

      <div>
        {/* Model WinDow Start */}
        <Modal isOpen={modal} toggle={toggle} external={externalCloseBtn}>
          <ModalHeader>Unit of Measure</ModalHeader>

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
                      Unit Name
                    </Label>
                    <Col sm={8} className="mt-3 mb-3 ">
                      <Input
                        name="unit_name"
                        placeholder="Unit  Name"
                        type="text"
                        className="form-control "
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.unit_name || ""}
                        invalid={
                          validation.touched.unit_name &&
                          validation.errors.unit_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.unit_name &&
                      validation.errors.unit_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.unit_name}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  {/*  */}

                  {/*  */}
                  <Row className="">
                    <Label for="exampleEmail" className="mt-3" sm={4}>
                      Quantity
                    </Label>
                    <Col sm={8} className="mt-3 mb-3 ">
                      <Input
                        name="quantity"
                        placeholder="Quantity"
                        type="number"
                        className="form-control "
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.quantity || ""}
                        invalid={
                          validation.touched.quantity &&
                          validation.errors.quantity
                            ? true
                            : false
                        }
                      />
                      {validation.touched.quantity &&
                      validation.errors.quantity ? (
                        <FormFeedback type="invalid">
                          {validation.errors.quantity}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  {/*  */}

                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Add UOM
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
              Are you Sure to delete
              <h5 className="text-danger mx-1">
                {UOMName}-{UOMNQuantity}
              </h5>
              Unit Of Measure ?
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
            <Button color="danger" onClick={DeleteConformFun}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      {/* Delete Popup End */}
    </>
  );
};

export default UOM;
