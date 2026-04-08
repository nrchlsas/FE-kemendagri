import React from 'react'
import ContentPenganggaranDetailDaerah from './ContentPenganggaranDetailDaerah'
import { Col, Row } from 'reactstrap'

const PenganggaranDetailDaerah = () => {
  return (
    <React.Fragment>
      <div className='page-content'>
        <Row>
          <Col>
            <ContentPenganggaranDetailDaerah />
          </Col>          
        </Row>          
      </div>  
    </React.Fragment>
  )
}

export default PenganggaranDetailDaerah