import axios from "axios"
import { values } from "lodash"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import WarningCard from "components/warningCard/WarningCard"
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { toast } from "react-toastify"
import { API_PRODUCT_CATEGORY_GET_BY_ID, API_PRODUCT_CATEGORY_UPDATE } from "customhooks/All_Api/Apis"
import {
  Button,
  Col,
Form, FormFeedback, FormGroup, Input, Label, Row,
} from "reactstrap";
const EditProductCategory = () => {
  const [productCategory, setProductCategory] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()




 //  local storage token Start
 const { config, first_name, last_name } = GetAuthToken();
   //  local storage token End



  const getProductCategory = async ()  => {
  
    try {
      const { data } = await axios.get(`${API_PRODUCT_CATEGORY_GET_BY_ID}${id}/`,config)
      setProductCategory(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getProductCategory()
  }, [])



  const validationSchema = Yup.object().shape({
    product_category_name: Yup.string()
      .matches(/^[^0-9]*$/, 'Product Category Name cannot contain numbers')
      .required('Product Category Name is required'),
  });

  const formik = useFormik({
    initialValues: {
      product_category_name:productCategory?.product_category_name || "",
    },
    validationSchema,
    onSubmit: async values => {
      try {
        await axios.post(
          `${API_PRODUCT_CATEGORY_UPDATE}${id}/`,
          {
            product_category: values.product_category_name
          },config
        )
        toast.success(`Product Updated successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate(`/master-Product-category`)
      } catch (error) {
        console.error(error)
        toast.error(`Something went wrong`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  })
  return (
    <>
      <WarningCard />
      <div style={{ marginTop: "50px" }}>
        <div className="container">
          <div className="row ">
            <div className="col-md-4">
              <div className="card border ">
                <div className="card-header">
                  <h4>Product Category</h4>
                </div>
                <div className="card-body">
                  <p className="d-flex">
                    <span className="fs-5">Category </span>:
                    <h5 className="ms-1">
                      {/* {productCategory.map(item => (
                        <span key={item.id}>{item.product_category_name}</span>
                      ))} */}
                      {productCategory.product_category_name  }
                    </h5>
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-around">
                  <Link to={`/master-Product-category`}>
                    <button className="btn btn-warning">Back</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="container">
                <div className="row">
                  <div className="col-sm-6 offset-sm-3">
                    <div className="card">
                      <h4 className="card-header">Edit Product Category</h4>
                      <div className="card-body">
                       
                             <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      formik.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">Product Category</Label>
                          <Input
                            name="product_category_name"
                            placeholder="First name"
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.product_category_name || ""}
                            invalid={
                              formik.touched.product_category_name &&
                              formik.errors.product_category_name
                                ? true
                                : false
                            }
                          />
                          {formik.touched.product_category_name &&
                          formik.errors.product_category_name ? (
                            <FormFeedback type="invalid">
                              {formik.errors.product_category_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                 
                    </Row>
           
          
                    <Button color="primary" type="submit">
                      Submit form
                    </Button>
                  </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditProductCategory
