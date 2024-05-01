import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ErrorMessage, Field, Formik } from "formik"
import * as Yup from "yup"
import {
  Button,
  ModalFooter,
  Row,
  Col,
  CardBody,
  Label,
  Form,
  Card,
  CardHeader,
} from "reactstrap"
import axios from "axios"
import WarningCard from "components/warningCard/WarningCard"
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { toast } from "react-toastify"
import { API_HSN_CODE_GET_BY_ID, API_HSN_CODE_UPDATE, API_TAX_RATE_GET_POST } from "customhooks/All_Api/Apis"
const EditHsnCode = () => {
  const [hsnData, setHsnData] = useState([])
  const [taxRates, setTaxRates] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()


  
 //  local storage token Start
 const { config, first_name, last_name } = GetAuthToken();
 
  //  local storage token End
  const getHsnData = async id => {

    try {
      const { data } = await axios.get(`${API_HSN_CODE_GET_BY_ID}${id}`,config)
      setHsnData(data.data) 
    } catch (error) {
      console.error(error)
    }
  }

  // tax rate data get for edit start
  const getTaxRates = async () => {
    const { data } = await axios.get(API_TAX_RATE_GET_POST,config)
    setTaxRates(data.data)
  }
  // tax rate data get for edit End

  const initialValues = {
    tax_rate: "",
    HSN_code: "",
  }

  const validationSchema = Yup.object({
    HSN_code: Yup.string()
      .required("HSN-Code is required")
      .max(6, "HSN Code must be 6 digit")
      .min(6, "HSN Code must be 6 digit"),
    tax_rate: Yup.number().required("Tax Rate is required"),
  })
  const handleSubmit = async values => {
    try {
      await axios.post(
        `${API_HSN_CODE_UPDATE}${id}/`,
        values,config
      )
      console.log(values);
      navigate(`/master-hsn-code`)
      toast.success(`HNS Code Edited successfully`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    } catch (error) {
      console.error(error)
      toast.error(`Something Went Wrong`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    }
  }

  useEffect(() => {
    getTaxRates()
    console.log(hsnData) // Log the updated value whenever uomData changes
  }, [setHsnData])

  useEffect(() => {
    getHsnData(id)
  }, [id])

  return (
    <>
      <WarningCard />
      <div style={{ marginTop: "50px" }}>
        <div className="container">
          <div className="row ">
            <div className="col-md-4">
              <div className="card border ">
                <div className="card-header">
                  <h4>Selected HSN Code</h4>
                </div>
                <div className="card-body">
                  <p className="d-flex">
                    <span className="fs-5">HSN-Code </span> :
                    <h5 className="ms-1">{hsnData?.code}</h5>
                  </p>
                  <p className="d-flex">
                    <span className="fs-5">Tax Rate </span>:
                    <h5 className="ms-1">{hsnData?.tax_rate_id}</h5>
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-around">
                  {/* </Link> */}
                  <Link to={`/master-hsn-code`}>
                    <button className="btn btn-warning">Back</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="container">
                <div className="row">
                  <div className="col-sm-6 offset-sm-3">
                    <Card>
                      <CardHeader>
                        <h4>Edit HSN-Code</h4>
                      </CardHeader>
                      <CardBody>
                        <Formik
                          initialValues={initialValues}
                          validationSchema={validationSchema}
                          onSubmit={handleSubmit}
                        >
                          {formik => (
                            <Form
                              className="needs-validation"
                              onSubmit={formik.handleSubmit}
                            >
                              {/* Tax Rate Field */}
                              <Row>
                                <Label
                                  for="exampleEmail"
                                  className="mt-3"
                                  sm={4}
                                >
                                  Tax Rate
                                </Label>
                                <Col sm={8} className="mt-3">
                                  <div className="input-group">
                                    <Field
                                      as="select"
                                      className="form-select"
                                      id="inputGroupSelect04"
                                      name="tax_rate"
                                    >
                                      <option value="">Choose Tax Rate</option>
                                      {taxRates?.map(item => (
                                        <option key={item.id} value={item.id}>
                                          {item.tax_name}
                                        </option>
                                      ))}
                                    </Field>
                                  </div>
                                  <ErrorMessage
                                    name="tax_rate"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </Col>
                              </Row>

                              {/* HSN-code Field */}
                              <Row>
                                <Label
                                  for="exampleEmail"
                                  className="mt-3"
                                  sm={4}
                                >
                                  HSN-code
                                </Label>
                                <Col sm={8} className="my-3">
                                  <Field
                                    name="HSN_code"
                                    placeholder="HSN-code"
                                    type="number"
                                    className={`form-control ${
                                      formik.touched.HSN_code &&
                                      formik.errors.HSN_code
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    
                                  />
                                  <ErrorMessage
                                    name="HSN_code"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </Col>
                              </Row>

                              {/* Form Actions */}
                              <ModalFooter>
                                <Button
                                  color="primary"
                                  type="submit"
                                  disabled={formik.isSubmitting}
                                >
                                  Save Changes
                                </Button>

                                <Link to={"/master-hsn-code"}>
                                  <Button color="secondary" className="ms-2">
                                    Cancel
                                  </Button>
                                </Link>
                              </ModalFooter>
                            </Form>
                          )}
                        </Formik>
                      </CardBody>
                    </Card>
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

export default EditHsnCode
