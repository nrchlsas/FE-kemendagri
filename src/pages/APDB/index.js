import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Label, Row, Container } from "reactstrap";
import FilterWilayah from "./filterWilayah";
import ContentApbd from "./contentApbd";

const Apbd = () => {
    document.title="SIPD-HUB | APBD";
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count - 1);
  };

  const handleClick1 = () => {
    setCount(count + 1);
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
            <Card>
              <CardBody>
                <div className="d-flex align-items-center justify-content-center">
                  <h1>Anggaran Pendapatan dan Belanja Daerah</h1>
                </div>
              </CardBody>
            </Card>
            <ContentApbd />
          </Col>
        </Row>

        {/* <p>{count}</p>
                <button onClick={handleClick}>test</button>
                <button onClick={handleClick1}>test</button> */}
        {/* {data.map((item, idx) => (              
                    <div key={item._id} style={{ marginBottom: '10px' }}>
                        <strong>{idx + 1}. </strong>
                        <span>{item._index}</span>
                        <div>Id Daerah: {item._source.id_daerah}</div>
                        <div>kode_skpd: {item._source.kode_skpd}</div>
                        <div>kode_sub_skpd: {item._source.kode_sub_skpd}</div>
                        <div>rincian: {item._source.rincian}</div>
                        <div>nama_prop: {item._source.nama_prop}</div>
                        <div>nama_wil: {item._source.nama_wil}</div>    
                    </div>
                ))} */}
        {/* <Container fluid>              
                      <BreadCrumb title="Analytics" pageTitle="Dashboards" />
                      <Row>
                          <Col xxl={5}>
                              <UpgradeAccountNotise />
                              <Widget />
                          </Col>
                          <LiveUsers />
                      </Row>
                      <Row>
                          <AudiencesMetrics />
                          <AudiencesSessions />
                      </Row>
                      <Row>
                          <UsersByDevice />
                          <TopReferrals />
                          <TopPages />
                      </Row>
                  </Container> */}
      </div>
    </React.Fragment>
  );
};

export default Apbd;
