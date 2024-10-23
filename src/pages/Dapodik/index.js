import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import ContentDapodikV2 from "./contentDapodikV2";

const Dapodik = () => {
    document.title = "Dashboard Kependudukan | SIPD-HUB";
  return (
    <React.Fragment>
      <div className="page-content">
        <Row>
          <Col>
            {/* <ContentDapodik /> */}
            <ContentDapodikV2 />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Dapodik;
