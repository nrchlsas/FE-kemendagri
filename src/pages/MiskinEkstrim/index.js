import React from 'react';
import { Col, Row } from 'reactstrap';
import ContentMiskinEkstremV2 from './ContentMiskinEkstremV2';


const MiskinEkstrim = () => {
  document.title="SIPD-HUB | Miskin Ekstrem";
  return (
    <React.Fragment>
    <div className="page-content">              
      <Row>
        <Col>
              <ContentMiskinEkstremV2 />
        </Col>
      </Row>        
    </div>
    </React.Fragment>
  )
}

export default MiskinEkstrim