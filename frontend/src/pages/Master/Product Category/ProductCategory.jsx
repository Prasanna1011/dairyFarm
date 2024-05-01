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
  Input,
  ModalBody,
  Form,
  FormFeedback,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LoaderPage from "components/Loader/LoaderPage";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_PRODUCT_CATEGORY_DELETE,
  API_PRODUCT_CATEGORY_GET_POST,
} from "customhooks/All_Api/Apis";

const ProductCategory = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modal, setModal] = useState(false);
  const [productCategory, setProductCategory] = useState([]);
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const DeleteConformFun = () => setConfirmDelete(!ConfirmDelete);
  const toggle = () => setModal(!modal);

  // modal popup start

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
      product_category: "",
    },
    validationSchema: yup.object({
      product_category: yup.string().required("Product Category is required"),
    }),
    onSubmit: async (values) => {
      try {

        const { data } = await axios.post(
          API_PRODUCT_CATEGORY_GET_POST,
          values,
          config
        );
        getProductCategory();

        toast.success(`Product Added successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        toggle();
      } catch (error) {
        console.log(error);
        toast.error(`Product must be unique`, {
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

  // product category data GET Start

  const getProductCategory = async () => {
    try {
      const response = await axios.get(API_PRODUCT_CATEGORY_GET_POST, config);
      setProductCategory(response.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // product category data GET End

  // delete code Start
  const handleDelete = async (id) => {
    try {
      const URL = `${API_PRODUCT_CATEGORY_DELETE}${id}/`;

      const ree = await axios.delete(URL, config);

      getProductCategory();
      DeleteConformFun();
      toast.success(`Product Deleted successfully`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
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

  // delete code Start

  // // Search Filter Start
  // const handleSearch = () => {
  //   const searchData = productCategory.filter(item =>
  //     item.product_category_name
  //       .toLowerCase()
  //       .includes(searchQuery.toLowerCase())
  //   )
  //   setFilteredData(searchData)
  // }

  // // Search Filter End
  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = productCategory.filter((item) => {
      const searchString = `${item.product_category_name}  `; // Add more properties as needed
      return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(searchData);
  };

  // Search Filter End

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
    getProductCategory();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, productCategory]);

  return (
    <>
      <Row>
        <Col xl={12}>
          <Card style={{ marginTop: "100px" }}>
            <CardBody className="d-flex justify-content-between">
              <h3>Product Category</h3>
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
            className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded px-3"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="    Search Product Category..."
          />
          <Button
            className=" btn btn-sm rounded-circle "
            onClick={handleSearch}
          >
            <i className="fas fa-search"></i>
          </Button>
        </div>

        {/*  */}

        <Col xl={12}>
          <Card className="pb-5">
            <CardBody>
              <div className="table-responsive">
                {loading == true ? (
                  <LoaderPage />
                ) : (
                  <Table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Sr no.</th>
                        <th>Product Category</th>

                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(searchQuery
                        ? filteredData
                        : productCategory &&
                          productCategory.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                      ).map((item, index) => (
                        <tr key={item.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.product_category_name}</td>

                          <td>
                            <Link
                              to={`/master-Product-category-edit/${item.id}`}
                            >
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
                                  setCategoryName(item.product_category_name)
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
              count={productCategory.length}
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
          <ModalHeader>Delivery Ptterns </ModalHeader>

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
                      Product Category
                    </Label>
                    <Col sm={8} className="mt-3 mb-3 ">
                      <Input
                        name="product_category"
                        placeholder="Product Category"
                        type="text"
                        className="form-control "
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.product_category || ""}
                        invalid={
                          validation.touched.product_category &&
                          validation.errors.product_category
                            ? true
                            : false
                        }
                      />
                      {validation.touched.product_category &&
                      validation.errors.product_category ? (
                        <FormFeedback type="invalid">
                          {validation.errors.product_category}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </Row>
                  {/*  */}

                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Add Product Category
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
              <h5 className="text-danger mx-1">{categoryName}</h5>
              Product Category ?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={(e) => handleDelete(deleteId)}
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

export default ProductCategory;
