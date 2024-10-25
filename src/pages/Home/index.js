import React, { useEffect, useLayoutEffect, useState } from "react";
import Welcome from "./welcome";
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent } from "reactstrap";
import classnames from "classnames";
import { SimplePie } from "../Charts/ApexCharts/PieCharts/PieCharts";
import Beranda from "./beranda";
import Filter from "./Filter";
import BerandaV2 from "./BerandaV2";
import { get_permission_by_url } from "../../slices/thunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { Card, CardBody, Col, Label, Row, Container } from 'reactstrap';
// import FilterWilayah from './filterWilayah';
// import ContentApbd from './contentApbd'

const Home = () => {
  document.title = "BERANDA | SIPD-HUB";
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // const permit = get_permission_by_url('/beranda', true, () => {
    //   navigate('/auth-404-basic', { replace: true });
    //   // history.push('/auth-404-basic', { shallow: true });
    // });
    // dispatch(permit);
  }, []);


  useLayoutEffect(() => {
    console.log("useLayoutEffect");
    const permit = get_permission_by_url('/beranda', true, () => {
      navigate('/auth-404-basic', { replace: true });
      // history.push('/auth-404-basic', { shallow: true });
    });
    dispatch(permit);
  }, []);

  const constructor = () => {
    console.log('constructor')
  };

  constructor();
  console.log("afterconstructor ");

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
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //     const fetchData = async () => {
  //     try {
  //         const response = await fetch('http://localhost:3002/getData');
  //         if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //         }
  //         const data = await response.json();
  //         setData(data.data);
  //         // console.log(data.data._source, 'ini data')
  //     } catch (error) {
  //         setError(error);
  //     } finally {
  //         setLoading(false);
  //     }
  //     };

  //     fetchData();
  // }, []);

  // if (loading) {
  //     return <div>Loading...</div>;
  // }

  // if (error) {
  //     return <div>Error: {error.message}</div>;
  // }
  return (
    <React.Fragment>
      <div className="page-content">
        <Row>
          <Col>
            <BerandaV2 />
          </Col>
          {/* <Col md={3}>
              <Filter />
           </Col> */}
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Home;
