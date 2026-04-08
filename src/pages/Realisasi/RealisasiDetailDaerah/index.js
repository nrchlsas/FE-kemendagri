import React from 'react'
import ContentRealisasiDetailDaerah from './ContentRealisasiDetailDaerah'
import { Col, Row } from 'reactstrap'

const RealisasiDetailDaerah = () => {
  return (
    <React.Fragment>
      <div className='page-content'>
        <Row>
          <Col>
            <ContentRealisasiDetailDaerah />
          </Col>          
        </Row>          
      </div>  
    </React.Fragment>
  )
}

export default RealisasiDetailDaerah