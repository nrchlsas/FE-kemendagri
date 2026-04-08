import React from 'react'
import ContentPerencanaanDetailDaerah from './ContentPerencanaanDetailDaerah'
import { Col, Row } from 'reactstrap'

const PerencanaanDetailDaerah = () => {
  return (
    <React.Fragment>
      <div className='page-content'>
        <Row>
          <Col>
            <ContentPerencanaanDetailDaerah />          
          </Col>          
        </Row>
          
      </div>  
    </React.Fragment>
  )
}

export default PerencanaanDetailDaerah