import React from 'react'

const CardDapodik = () => {
  return (
   <React.Fragment>
    <Card className="card-animate card-height-100">
        <CardBody>
            <div
            className="d-flex flex-column title-custom-card"
           
            >
            <div className="d-flex justify-content-between align-items-start mb-1 title-card">
                <span>title</span>
            </div>
            <div className="d-flex">
                <div className="d-flex justify-content-center align-items-center ms-2 title-body">
                <span>
                    <CountUp
                    start={0}
                    end={
                       0
                    }
                    separator="."
                    // prefix=""
                    suffix=""
                    duration={3}
                    />
                </span>
                </div>
            </div>
            </div>
        </CardBody>
    </Card>
   </React.Fragment>
  )
}

export default CardDapodik