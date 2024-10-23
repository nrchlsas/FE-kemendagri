import React from 'react'
import ContentStuntingV2 from './ContentStuntingV2'
import { Col, Row } from 'reactstrap'
import FilterKependudukan from '../Kependudukan/filterKependudukan'


const Stunting = () => {

  return (
    <React.Fragment>
        <div className='page-content'>
          <Row>
            <Col>
            <ContentStuntingV2 />
            </Col>
            {/* <Col xl={3}>
              <FilterKependudukan />
            </Col> */}
          </Row>
        </div>
    </React.Fragment>
  )
}

export default Stunting