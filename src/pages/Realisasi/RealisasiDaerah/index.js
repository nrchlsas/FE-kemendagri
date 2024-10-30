import React from 'react'
import ContentRealisasiDaerah from './ContentRealisasiDaerah'
import { Col, Row } from 'reactstrap'

const RealisasiDaerah = () => {
  return (
    <React.Fragment>
      <div className='page-content'>
        <Row>
          <Col>
            <ContentRealisasiDaerah />
          </Col>
        </Row>                  
      </div>  
    </React.Fragment>
  )
}

export default RealisasiDaerah
