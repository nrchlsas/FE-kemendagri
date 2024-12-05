import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import ContentDapodikV2 from "./contentDapodikV2";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { get_permission_by_url } from "../../slices/thunks";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Dapodik = () => {
  document.title = "Dashboard Kependudukan | SIPD-HUB";
  
  const permissionState = (state) => state.Profile;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissionProperties = createSelector(
      permissionState, (d) => ({ list_menus: d.list_menus })
  );
  const { list_menus } = useSelector(permissionProperties);
  useEffect(() => {
      if (list_menus.length == 0) return;
      const permit = get_permission_by_url('/dapodik', true, () => {
          navigate('/auth-404-basic', { replace: true });
      });
      dispatch(permit);
  }, [list_menus]); //page ini

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
