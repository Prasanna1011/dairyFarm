import React from "react"
import { Alert, Card } from "reactstrap"

const WarningCard = () => {
  return (
    <>
      <div className="mx-4" style={{ marginTop: "100px" }}>
        <Card className="p-3 pb-0">
          <Alert className="text-center" color="danger">
            Be careful to Edit Data , it is Reflecting in Whole System
          </Alert>
        </Card>
      </div>
    </>
  )
}

export default WarningCard
