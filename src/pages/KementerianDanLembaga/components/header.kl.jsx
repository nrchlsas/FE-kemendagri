import React from "react";
import { Card, CardBody } from "reactstrap";

export default function HeaderKl({ iconClass, text }) {
  return (
    <Card>
      <CardBody>
        <div className="d-flex title-page gap-2 align-items-center">
          <div className="avatar-sm">
            <i className={`${iconClass} text-dark fs-1`}></i>
          </div>
          <div>
            <span className="text-capitalize">{text}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
