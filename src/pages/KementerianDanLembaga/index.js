import React from "react";
import { Col, Container, Row } from "reactstrap";
import ContentKementerianDanLembaga from "./ContentKementerianDanLembaga";

const KementerianDanLembaga = () => {
  document.title =
    "Dashboard Kementerian & Lembaga | Velzon - React Admin & Dashboard Template";  
    
  return (
    <React.Fragment>
      <div className="page-content">
        <Row>
          <Col>
            <ContentKementerianDanLembaga />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default KementerianDanLembaga;
