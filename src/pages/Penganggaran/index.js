import React from 'react'
import ContentPenganggaran from './ContentPenganggaran'
import { Col, Row } from 'reactstrap'

const Penganggaran = () => {
  return (
    <React.Fragment>
        <div className='page-content'>
          <Row>
            <Col>
              <ContentPenganggaran />
            </Col>
          </Row>          
        </div>
    </React.Fragment>
  )
}

export default Penganggaran