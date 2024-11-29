import React, { useEffect, useLayoutEffect, useState } from "react";
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent } from "reactstrap";
import BerandaV2 from "./BerandaV2";
import { get_permission_by_url } from "../../slices/thunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const Home = () => {
  document.title = "BERANDA | SIPD-HUB";
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const permissionState = (state) => state.Profile;
  const permissionProperties = createSelector(
    permissionState,
    (d) => ({
      list_menus: d.list_menus
    })
  );
  const { list_menus } = useSelector(permissionProperties);

  useEffect(() => {
    if (list_menus.length == 0) return;
    const permit = get_permission_by_url('/beranda', true, () => {
      navigate('/auth-404-basic', { replace: true });
    });
    dispatch(permit);
  }, [list_menus]);

  const handleClick = () => {
    setCount(count - 1);
  };

  const handleClick1 = () => {
    setCount(count + 1);
  };

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
      <Container fluid>      
        <Row>
          <Col xs={12}>
            <BerandaV2 />
          </Col>
        </Row>
      </Container>      
      </div>
    </React.Fragment>
  );
};

export default Home;
