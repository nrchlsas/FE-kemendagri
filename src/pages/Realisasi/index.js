import React from 'react'
import ContentRealisasi from './ContentRealisasi'
import { Col, Row } from 'reactstrap'

const Realisasi = () => {
  return (
    <React.Fragment>
        <div className='page-content'>
          <Row>
            <Col>
              <ContentRealisasi />
            </Col>
          </Row>          
        </div>
    </React.Fragment>
  )
}

export default Realisasi