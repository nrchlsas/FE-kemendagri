import React from 'react'
import ContentPerencanaanDaerah from './ContentPerencanaanDaerah'
import { Col, Row } from 'reactstrap'

const PerencanaanDaerah = () => {
  return (
    <React.Fragment>
      <div className='page-content'>
        <Row>
          <Col>
            <ContentPerencanaanDaerah />
          </Col>
        </Row>                  
      </div>  
    </React.Fragment>
  )
}

export default PerencanaanDaerah
