import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  CardTitle,
  CardSubtitle,
  Alert,
} from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { API_DASHBOARD_GET_CARD_DATA } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { cartData } from "common/data";
import DashBoardPieCharts from "./DashBoardPieCharts";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import LoaderPage from "../../components/Loader/LoaderPage";

const DashBoardHome = () => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { config, first_name, last_name } = GetAuthToken();

  const getCardsData = async () => {
try {
  const response = await axios.get(API_DASHBOARD_GET_CARD_DATA, config);
  setCardData(response?.data);
  console.log("cardData", cardData);
  setLoading(false);
} catch (error) {
  console.log(error);
}
  };

  useEffect(() => {
    getCardsData();
  }, []);

  //meta title
  document.title = "Milkmor | Dashboard";

  return (
    <React.Fragment>
      <div className="page-content">

{
  loading== true?(
    <LoaderPage />
  ):(
    <Container fluid>
    <p>Dashboard</p>

    <Row>
      <Col xl="12">
        <Row>
          {cardData?.active_boys && cardData?.total_boys ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Current Delivery Boys
                      </p>
                      <h4 className="mb-0">
                        {cardData?.active_boys}/{cardData?.total_boys}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i
                          className={"fas fa-people-carry font-size-24"}
                        ></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {cardData?.total_cart_orders && cardData?.total_cart_orders ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Total Cart Orders
                      </p>
                      <h4 className="mb-0">
                        {cardData?.total_cart_orders}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i
                          className={"fas fa-shopping-cart font-size-24"}
                        ></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {cardData?.queue_indent && cardData?.queue_indent ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Indent in Queue
                      </p>
                      <h4 className="mb-0">{cardData?.queue_indent}</h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i
                          className={"fas fa-plus-square font-size-24"}
                        ></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.total_subscriptions &&
          cardData?.total_subscriptions ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Total Subscribers
                      </p>
                      <h4 className="mb-0">
                        {cardData?.total_subscriptions}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i
                          className={"fas fa-user-friends font-size-24"}
                        ></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.pending_ticket && cardData?.total_tickets ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Pending Tickets
                      </p>
                      <h4 className="mb-0">
                        {cardData?.pending_ticket}/
                        {cardData?.total_tickets}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i className={"bx bx-notepad font-size-24"}></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.advanced_renewal_orders &&
          cardData?.advanced_renewal_orders ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Advance Renewal
                      </p>
                      <h4 className="mb-0">
                        {cardData?.advanced_renewal_orders}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i
                          className={"fas fa-cart-plus font-size-24"}
                        ></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.paused_orders !== undefined &&
          cardData?.total_subscriptions !== undefined ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">Paused Order</p>
                      <h4 className="mb-0">
                        {cardData.paused_orders === 0
                          ? "0"
                          : cardData.paused_orders}
                        /{cardData.total_subscriptions}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i className={"fas fa-pause font-size-24"}></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.indent_to_outward && cardData?.indent_to_outward ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Indent to Outward
                      </p>
                      <h4 className="mb-0">
                        {cardData?.indent_to_outward}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i
                          className={
                            "fas fa-long-arrow-alt-right font-size-24"
                          }
                        ></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.total_subscriptions &&
          cardData?.total_subscriptions ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Total Subscription
                      </p>
                      <h4 className="mb-0">
                        {cardData?.total_subscriptions}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i className="mdi mdi-youtube-subscription font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {cardData?.total_cash_received &&
          cardData?.total_cash_received ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Total Cash Recived
                      </p>
                      <h4 className="mb-0">
                        {cardData?.total_cash_received}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i className="mdi mdi-cash-multiple font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {cardData?.total_task_completed &&
          cardData?.total_task_completed ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Total Task Completed
                      </p>
                      <h4 className="mb-0">
                        {cardData?.total_task_completed}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i className="bx bx-task font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {cardData?.current_month_total_sales &&
          cardData?.previous_month_total_sales ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Current / Previous Month Sale
                      </p>
                      <h4 className="mb-0">
                        {" "}
                        {cardData?.current_month_total_sales}/
                        {cardData?.previous_month_total_sales}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i className="far fa-calendar-alt font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.current_month_sub_sales &&
          cardData?.previous_month_sub_sales ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Current / Previous Month Subscription Sale
                      </p>
                      <h4 className="mb-0">
                        {" "}
                        {cardData?.current_month_sub_sales}/
                        {cardData?.previous_month_sub_sales}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i className="far fa-calendar-alt font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.current_month_cart_sales &&
          cardData?.previous_month_cart_sales ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Current / Previous Month cart Sale
                      </p>
                      <h4 className="mb-0">
                        {" "}
                        {cardData?.current_month_cart_sales}/
                        {cardData?.previous_month_cart_sales}
                      </h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i className="far fa-calendar-alt font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.stock_in_hand && cardData?.stock_in_hand ? (
            <Col md="3" key={""}>
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Stock in Hand
                      </p>
                      <h4 className="mb-0">{cardData?.stock_in_hand}</h4>
                    </div>
                    <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                      <span className="avatar-title rounded-circle bg-primary">
                        <i className="bx bx-notepad  font-size-24"></i>
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
        </Row>

        {/* TWOO */}
        <Row>
          {cardData?.pending_day_closure &&
          cardData?.pending_day_closure_total ? (
            <Col md="3">
              <Card className="shadow-lg">
                <CardBody>
                  <h4 className="mb-0 d-flex justify-content-center mb-2">
                    {cardData?.pending_day_closure}/
                    {cardData?.pending_day_closure_total}
                  </h4>

                  <Alert color="info" className="py-1 text-center">
                    Pending Day Closure
                  </Alert>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.pending_task && cardData?.total_task ? (
            <Col md="3">
              <Card className="shadow-lg">
                <CardBody>
                  <h4 className="mb-0 d-flex justify-content-center mb-2">
                    {cardData?.pending_task}/{cardData?.total_task}
                  </h4>
                  {/* <Button className="w-100 btn-sm">Pending Task</Button>   */}

                  <Link to={"/hub-list"}>
                    <Alert color="primary" className="py-1 text-center">
                      Pending Task
                    </Alert>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.unassigned_task && cardData?.total_task ? (
            <Col md="3">
              <Card className="shadow-lg">
                <CardBody>
                  <h4 className="mb-0 d-flex justify-content-center mb-2">
                    {cardData?.unassigned_task}/{cardData?.total_task}
                  </h4>

                  <Alert color="danger" className="py-1 text-center">
                    Unassigned Task
                  </Alert>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {cardData?.today_cash_received !== undefined ? (
            <Col md="3">
              <Card className="shadow-lg">
                <CardBody>
                  <h4 className="mb-0 d-flex justify-content-center mb-2">
                    PENDING/{" "}
                    {cardData?.today_cash_received === 0
                      ? "0"
                      : cardData?.today_cash_received}
                  </h4>

                  <Link to={"/hub-collection-summary"}>
                    <Alert color="primary" className="py-1 text-center">
                      Today's Cash Received
                    </Alert>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.new_subscriptions &&
          cardData?.total_subscriptions ? (
            <Col md="3">
              <Card className="shadow-lg">
                <CardBody>
                  <h4 className="mb-0 d-flex justify-content-center mb-2">
                    {cardData?.new_subscriptions} /
                    {cardData?.total_subscriptions}
                  </h4>

                  <Link to={"/subscription-orders"}>
                    {" "}
                    <Alert color="info" className="py-1 text-center">
                      New Subscription
                    </Alert>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.new_cart_orders && cardData?.active_cart_orders ? (
            <Col md="3">
              <Card className="shadow-lg">
                <CardBody>
                  <h4 className="mb-0 d-flex justify-content-center mb-2">
                    {cardData?.new_cart_orders} /
                    {cardData?.total_cart_orders}
                  </h4>
                  <Alert color="primary" className="py-1 text-center">
                    New Cart Orders
                  </Alert>

                  <Link to={"/cart-orders"}></Link>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.due_subscribers !== undefined ? (
            <Col md="3">
              <Card className="shadow-lg">
                <CardBody>
                  <h4 className="mb-0 d-flex justify-content-center mb-2">
                    {cardData?.due_subscribers}
                  </h4>

                  <Link to={"/subscription-orders?tab=renewal"}>
                    <Alert color="info" className="py-1 text-center">
                      Due Subscribers
                    </Alert>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
        </Row>

        {/* Pie Charts */}
        <DashBoardPieCharts />

        {/* Tables */}
        <Row>
          {cardData?.updates_in_demand && cardData?.updates_in_demand ? (
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h4 mb-3">
                    Updates in Demand (For tomorrow)
                  </CardTitle>

                  <div
                    className="table-responsive"
                    style={{ maxHeight: "350px", overflowY: "auto" }}
                  >
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Subscriber</th>
                          <th>Order</th>
                          <th>item</th>
                          <th>Planned</th>
                          <th>Ordered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cardData?.updates_in_demand?.map(
                          (item, index) => (
                            <tr key={index}>
                              <th scope="row">{item?.subscriber}</th>
                              <td>{item?.order}</td>
                              <td>{item?.item}</td>
                              <td>{item?.planned}</td>
                              <td>{item?.ordered}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.pending_scheduling ? (
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h4 mb-3">
                    Pending Scheduling
                  </CardTitle>

                  <div
                    className="table-responsive"
                    style={{ maxHeight: "350px", overflowY: "auto" }}
                  >
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Subscriber</th>
                          <th>Order</th>
                          <th>Status</th>
                          <th>Activity Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cardData?.pending_scheduling?.map(
                          (item, index) => (
                            <tr key={index}>
                              <th scope="row">{item?.customer_name}</th>
                              <th className="text-primary">
                                <Link
                                  to={`/subscription-orders-view/${item?.order_id}`}
                                >
                                  {item?.order_id}
                                </Link>
                              </th>
                              <td>{item?.order_status}Pending</td>
                              <td>
                                {item?.updated_at
                                  ? format(
                                      new Date(item.updated_at),
                                      "dd-MM-yyyy "
                                    )
                                  : ""}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}

          {cardData?.address_update_activity ? (
            <Col lg={6}>
              <Card >
                <CardBody>
                  <CardTitle className="h4 mb-3">
                    Address Update Activity
                  </CardTitle>

                  <div
                    className="table-responsive"
                    style={{ maxHeight: "350px", overflowY: "auto" }}
                  >
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Subscriber</th>
                          <th>Status</th>
                          <th>Order</th>
                          <th>Activity Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tbody>
                          {cardData?.address_update_activity?.map(
                            (item, index) => (
                              <tr key={index}>
                                <th scope="row">{item?.customer_name}</th>
                                <td>{item?.customer_status}</td>
                                <td>
                                  {item?.orders.map(
                                    (order, orderIndex) => (
                                      <span key={orderIndex}>
                                        {order?.order_id},
                                      </span>
                                    )
                                  )}
                                </td>
                                <td>
                                  {format(
                                    new Date(item?.updated_at),
                                    "dd-MM-yyyy"
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {cardData?.pending_cash_collection ? (
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h4 mb-3">
                    Pending Cash Collection
                  </CardTitle>

                  <div
                    className="table-responsive"
                    style={{ maxHeight: "350px", overflowY: "auto" }}
                  >
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Subscriber</th>
                          <th>Status</th>
                          <th>Order</th>
                          <th>Order Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cardData?.pending_cash_collection?.map(
                          (item, index) => (
                            <tr key={index}>
                              <th scope="row">{item?.subscriber}</th>
                              <td>{item?.status}Pending</td>
                              <td>{item?.order}</td>
                              <td>{item?.order_amount}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {cardData?.todays_activities ? (
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h4 mb-3">
                    Today's Activities
                  </CardTitle>

                  <div
                    className="table-responsive"
                    style={{ maxHeight: "350px", overflowY: "auto" }}
                  >
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Activity </th>
                          <th>Statistics</th>
                          <th>View</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Active Delivery Log</td>
                          <td>
                            {
                              cardData?.todays_activities
                                ?.active_delivery_log
                            }
                          </td>
                          <td>
                            <Link to={"/delivery-logs"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>Cash Received / Cash Collection</td>
                          <td>
                            {
                              cardData?.todays_activities
                                ?.today_cash_received
                            }
                            /
                            {
                              cardData?.todays_activities
                                ?.today_cash_collected
                            }
                          </td>
                          <td>
                            <Link to={"/hub-collection-summary"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Subscription Order Delivered / Order planner
                          </td>
                          <td>
                            {
                              cardData?.todays_activities
                                ?.subscription_order_delivered
                            }
                            /
                            {
                              cardData?.todays_activities
                                ?.subscription_order_planner
                            }
                          </td>
                          <td>
                            <Link to={"/delivery-logs"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>Stock Delivered / Stock Allocated</td>
                          <td>
                            {cardData?.todays_activities?.stock_delivered}
                            /
                            {cardData?.todays_activities?.stock_allocated}
                          </td>
                          <td>
                            <Link to={"/delivery-logs"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Cart order Delivered / Cart Order assigned
                          </td>
                          <td>
                            {
                              cardData?.todays_activities
                                ?.cart_order_delivered
                            }
                            /
                            {
                              cardData?.todays_activities
                                ?.cart_order_assigned
                            }
                          </td>
                          <td>
                            <Link to={"/delivery-logs"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>Task Completed / Task Allocated</td>
                          <td>
                            {cardData?.todays_activities?.task_completed}/
                            {cardData?.todays_activities?.task_allocated}
                          </td>
                          <td>
                            <Link to={"/hub-list"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>Order Expires Tommorrow</td>
                          <td>
                            {
                              cardData?.todays_activities
                                ?.order_expires_tomorrow
                            }
                          </td>
                          <td>
                            <Link>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {cardData?.till_date_activity_log ? (
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="h4 mb-3">
                    Till Day Activity Log
                  </CardTitle>

                  <div
                    className="table-responsive"
                    style={{ maxHeight: "350px", overflowY: "auto" }}
                  >
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Activity</th>
                          <th>Statistics</th>
                          <th>View</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Paused Order</td>
                          <td>
                            {
                              cardData?.till_date_activity_log
                                ?.paused_order
                            }
                          </td>
                          <td>
                            <Link to={"/subscription-orders?tab=paused"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>New Task to Allocate</td>
                          <td>
                            {
                              cardData?.till_date_activity_log
                                ?.new_task_to_allocate
                            }
                          </td>
                          <td>
                            <Link to={"/hub-list"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>New Subscription to Allocate</td>
                          <td>
                            {
                              cardData?.till_date_activity_log
                                ?.new_subscription_to_allocate
                            }
                          </td>
                          <td>
                            <Link to={"/subscription-orders?tab=new"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>New Cart to Allocate</td>
                          <td>
                            {
                              cardData?.till_date_activity_log
                                ?.new_cart_to_allocate
                            }
                          </td>
                          <td>
                            <Link to={"/cart-orders"}>
                              <Button className="edit-button btn btn-sm btn-light ">
                                <i className="fas fa-eye text-primary"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
        </Row>
      </Col>
    </Row>
  </Container>

  )
}

   
      </div>
    </React.Fragment>
  );
};

export default DashBoardHome;
