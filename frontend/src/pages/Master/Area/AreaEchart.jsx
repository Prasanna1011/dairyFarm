import React from 'react'
import { Card, CardBody, CardTitle, Col, Container } from 'reactstrap'

import Pie from "../../AllCharts/echart/piechart"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
// import Breadcrumbs from "../../components/Common/Breadcrumb"
// import Pie from "../AllCharts/echart/piechart"

const AreaEchart = () => {
    // console.log(getAreaData);
  return ( <div className='page-content'>
   <Container fluid={true}>
   
   <Breadcrumbs title="Charts" breadcrumbItem="E Chart" />
    <Col lg="6">
    <Card>
      <CardBody>
        <CardTitle>Pie Chart</CardTitle>
        <div id="pie-chart" className="e-chart">
          <Pie dataColors='["--bs-primary","--bs-warning", "--bs-danger","--bs-info", "--bs-success"]'/>
        </div>
      </CardBody>
    </Card>
  </Col>
   </Container>
  </div>
  )
}

export default AreaEchart