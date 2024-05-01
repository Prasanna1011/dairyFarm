// import React, { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   FormGroup,
//   Button,
//   Label,
//   Input,
//   Container,
//   FormFeedback,
//   Form,
//   Table,
// } from "reactstrap";
// import { TablePagination } from "@mui/material";
// import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
// const DeliveryLogsById = () => {
//   const [page, setPage] = useState(0);

//   // Local storage token Start
//   const { config, first_name, last_name } = GetAuthToken();

//   // Local storage token End

//   return (
//     <>
//       <div className="page-content">
//         <Container fluid={true}>
//           <Row>
//             <Col xl={12}>
//               <Card>
//                 <CardBody className="d-flex justify-content-between">
//                   <h3>Delivery Logs Of </h3>
//                   <>
//                     <Button className="px-4" color="primary">
//                       Create
//                     </Button>
//                   </>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//           {/*Search filter  */}

//           {/*  Search filter*/}

//           <Row>
//             <Col xl={12}>
//               <Card className="pb-5">
//                 <CardBody>
//                   <div className="table-responsive">
//                     <Table className="align-middle ">
//                       <thead className="table-light">
//                         <tr>
//                           <th>No.</th>
//                           <th>Order No.</th>
//                           <th>Customer Name</th>
//                           <th>Address</th>
//                           <th>Product</th>
//                           <th>Ordered Qty.</th>
//                           <th>Delivered Qty.</th>
//                           <th>Remarks</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>

//                       {/* <tbody className="">
//                         {(searchQuery
//                           ? filteredData
//                           : deliveryBoysData &&
//                             deliveryBoysData.slice(
//                               page * rowsPerPage,
//                               page * rowsPerPage + rowsPerPage
//                             )
//                         ).map((item, index) => (
//                           <tr key={item.id}>
//                             <th scope="row">{index + 1}</th>
//                             <td>
//                               {item.first_name} {item.last_name}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody> */}
//                     </Table>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default DeliveryLogsById;

import React, { useState, useEffect } from "react";

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
  Modal,
} from "reactstrap";
const DeliveryLogsById = ({
  tasklogToggle,
  deliveryBoyName,
  selectedDeliveryBoy,
}) => {
  const [taskLogModal, settaskLogModal] = useState(false);
  //   const [selectedDeliveryBoyData, setSelectedDeliveryBoyData] = useState(false);
  function tasklogToggle() {
    settaskLogModal(!taskLogModal);
  }

  console.log("selectedDeliveryBoy", selectedDeliveryBoy);

  //   setSelectedDeliveryBoyData(selectedDeliveryBoy);
  //   tasklogToggle(); // Open the modal
  return (
    <div>
      {" "}
      {/* Delivery boy Task Log Popup Start */}
      <Col lg={6}>
        <Card>
          <CardBody>
            <p className="card-title-desc">
              Add <code>.modal-dialog-centered</code> to{" "}
              <code>.modal-dialog</code> to vertically center the modal.
            </p>
            <div>
              <button
                type="button"
                className="btn btn-primary "
                onClick={() => {
                  tasklogToggle();
                }}
              >
                Center modal
              </button>
              <Modal
                isOpen={taskLogModal}
                toggle={() => {
                  tasklogToggle();
                }}
                centered
              >
                <div className="modal-header">
                  <h5 className="modal-title mt-0">Center Modal</h5>
                  <button
                    type="button"
                    onClick={() => {
                      settaskLogModal(false);
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
                    Cras mattis consectetur purus sit amet fermentum. Cras justo
                    odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                    risus, porta ac consectetur ac, vestibulum at eros.
                  </p>
                  <p>
                    Praesent commodo cursus magna, vel scelerisque nisl
                    consectetur et. Vivamus sagittis lacus vel augue laoreet
                    rutrum faucibus dolor auctor.
                  </p>
                  <p className="mb-0">
                    Aenean lacinia bibendum nulla sed consectetur. Praesent
                    commodo cursus magna, vel scelerisque nisl consectetur et.
                    Donec sed odio dui. Donec ullamcorper nulla non metus auctor
                    fringilla.
                  </p>
                </div>
              </Modal>
            </div>
          </CardBody>
        </Card>
      </Col>
      {/* Delivery boy Task Log Popup End */}
    </div>
  );
};

export default DeliveryLogsById;
