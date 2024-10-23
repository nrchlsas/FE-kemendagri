import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import ContentKependudukanV2 from "./ContentKependudukanV2";

const Kependudukan = () => {
  document.title =
    "Dashboard Kependudukan | SIPD-HUB";
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count - 1);
  };

  const handleClick1 = () => {
    setCount(count + 1);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Row>
          <Col>
            <ContentKependudukanV2 />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Kependudukan;
