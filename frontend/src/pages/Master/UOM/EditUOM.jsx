import axios from "axios"
import WarningCard from "components/warningCard/WarningCard"
import { API_UOM_GET_BY_ID, API_UOM_UPDATE } from "customhooks/All_Api/Apis"
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken"
import { values } from "lodash"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

const EditUOM = () => {
  const [uomData, setUomData] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()



     //  local storage token Start
     const { config, first_name, last_name } = GetAuthToken();
 
   //  local storage token End

  const getUomData = async id => {
    const url = `${API_UOM_GET_BY_ID}${id}/`
    try {
      const { data } = await axios.get(url,config)
      setUomData(data.data) // Set the UOM object directly
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateUom = async e => {
    e.preventDefault()
    try {
      await axios.post(`${API_UOM_UPDATE}${id}/`, uomData,config)
      navigate(`/master-uom`)
      toast.success(`UOM Updated successfully`, {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    } catch (error) {
      console.error(error)
      toast.error(` Something Went Wrong`, {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    }
  }
  useEffect(() => {
    // console.log(uomData) // Log the updated value whenever uomData changes
  }, [uomData])

  useEffect(() => {
    getUomData(id)
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
                  <h4>Unit Of Measure</h4>
                </div>
                <div className="card-body">
                  {/* Remove the map function since uomData is no longer an array */}
                  <>
                    <p className="d-flex">
                      <span className="fs-5">Category </span>:
                      <h5 className="ms-1">{uomData.unit_name}</h5>
                    </p>
                    <p className="d-flex">
                      <span className="fs-5">Quantity </span>:
                      <h5 className="ms-1">{uomData.quantity}</h5>
                    </p>
                  </>
                  {/* ... */}
                </div>
                <div className="card-footer d-flex justify-content-around">
                  <Link to={`/master-uom`}>
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
                      <div className="card-header">Edit Unit Of Measure </div>
                      <div className="card-body">
                        <div>
                          <label htmlFor="city" className="form-label" >
                            Unit Of Measure :
                          </label>
                          <input
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            id="unit_name"
                            placeholder=" Enter Unit Of Measure"
                            value={uomData?.unit_name}
                            onChange={e => {
                              const updatedUomData = {
                                ...uomData,
                                unit_name: e.target.value,
                              }
                              setUomData(updatedUomData)
                            }}
                          />
                        </div>
                        <div className="mt-2">
                          <label htmlFor="city" className="form-label">
                            Quantity :
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            placeholder="Enter Quantity ..."
                            value={uomData?.quantity}
                            onChange={e => {
                              const updatedUomData = {
                                ...uomData,
                                quantity: e.target.value,
                              }
                              setUomData(updatedUomData)
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleUpdateUom}
                          className="btn btn-primary w-100 mt-3"
                        >
                          Update
                        </button>
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

export default EditUOM
