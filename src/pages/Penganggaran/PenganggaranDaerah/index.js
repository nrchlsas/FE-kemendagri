import React from 'react'
import ContentPenganggaranDaerah from './ContentPenganggaranDaerah'
import { Col, Row } from 'reactstrap'

const PenganggaranDaerah = () => {
  return (
    <React.Fragment>
      <div className='page-content'>
        <Row>
          <Col>
            <ContentPenganggaranDaerah />
          </Col>
        </Row>                  
      </div>  
    </React.Fragment>
  )
}

export default PenganggaranDaerah
