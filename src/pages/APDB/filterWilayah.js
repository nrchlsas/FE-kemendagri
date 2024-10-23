import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Label, Row } from 'reactstrap';
import Select from "react-select";

const API_URI = `${process.env.REACT_APP_API_URL_BE}`;

const FilterWilayah = () => {

    // this.state = {
    //     postId: null
    // };
    
    const [selectedMulti1, setselectedMulti1] = useState(null);
    const [selectedMulti2, setselectedMulti2] = useState(null);
    function handleMulti1(selectedMulti1) {
        setselectedMulti1(selectedMulti1);
    }    
    function handleMulti2(selectedMulti2) {
        setselectedMulti2(selectedMulti2);
    }    
    
    const [singleOptions, setSingleOptions] = useState([]);
    const [singleOptions2, setSingleOptions2] = useState([]);

      const [count, setCount] = useState(0)

      const handleClick = () => {
        setCount(count - 1);      
      }

      const handleClick1 = () =>{
        setCount(count + 1)
      }

        // const [dataProv, setDataProv] = useState([]);
        // const [loadingProv, setLoadingProv] = useState(true);
        // const [errorProv, setErrorProv] = useState(null);

        // useEffect(() => {
        //     const fetchData = async () => {
        //     try {
        //         const requestOptions = {
        //             method: 'GET',
        //             headers: { 'Content-Type': 'application/json' },
        //             // body: JSON.stringify({ 'query': `SELECT * FROM idx_prop` })
        //         };
        //         // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        //         // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        //         // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        //         const response = await fetch(`${API_URI}/ref_daerah`, requestOptions)
        //         if (!response.ok) {
        //         throw new Error('Network response was not ok');
        //         }
        //         const dataProv = await response.json();
        //         console.log(dataProv, 'ini data prov filter');
        //         // setData(data.hits.hits);

        //         const mappedData = dataProv.map((item)=>({
        //             label: item._source.nama_daerah,
        //             // value: item._source.nama_daerah
        //         }))

        //         console.log(mappedData, 'ini isi mapped data')
        //         setDataProv(dataProv.data);
        //         // const options = data.hits.hits.map(hit => ({
        //         //     value: hit._source.kode_wil_prop,
        //         //     label: hit._source.nama_prop
        //         // }));
        //         // const options = dataProv.datarows.map(hit => ({
        //         //     value: hit[0],
        //         //     label: hit[1]
        //         // }));
        //         // console.log(options, 'ini options')
        //         // setSingleOptions(options);
        //         // console.log(setSingleOptions(options), 'ini set single')
                
        //         // // console.log(data.hits.hits)
        //         // console.log(singleOptions);
        //     } catch (errorProv) {
        //         setErrorProv(errorProv);
        //     } finally {
        //         setLoadingProv(false);
        //     }
        //     // try {
        //     //     // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search', {
        //     //     const response = await fetch('https://192.168.128.72:9220/_plugins/_sql', {
        //     //       method: 'POST',
        //     //       headers: {
        //     //         'Content-Type': 'application/json',
        //     //       },
        //     //       body: JSON.stringify({
        //     //         "query": "SELECT * FROM idx_prop WHERE kode_wil_prop = '11'"
        //     //       }),
        //     //       // Include this to bypass SSL issues (not recommended for production)
        //     //       agent: new https.Agent({
        //     //         rejectUnauthorized: false
        //     //       })
        //     //     });
        
        //     //     if (!response.ok) {
        //     //       throw new Error('Network response was not ok');
        //     //     }
        
        //     //     const result = await response.json();
        //     //     setData(result);
        //     //   } catch (error) {
        //     //     setError(error);
        //     //   } finally {
        //     //     setLoading(false);
        //     //   }
            
        //         // Simple POST request with a JSON body using fetch
        //     // const requestOptions = {
        //     //     method: 'POST',
        //     //     headers: { 'Content-Type': 'application/json' },
        //     //     body: JSON.stringify({ 'query': "SELECT * FROM idx_prop WHERE kode_wil_prop = '11'" })
        //     // };
        //     // fetch('https://192.168.128.72:9220/_plugins/_sql', requestOptions)
        //     //     .then(response => response.json())
        //     //     .then(data => this.setData({ postId: data.id }));
        //     };

        //     fetchData();
        // }, []);

        // const [dataKab, setDataKab] = useState([]);
        // const [loadingKab, setLoadingKab] = useState(true);
        // const [errorKab, setErrorKab] = useState(null);

        // useEffect(() => {
        //     const fetchData = async () => {
        //         try {
        //             const requestOptions = {
        //                 method: 'POST',
        //                 headers: { 'Content-Type': 'application/json' },
        //                 body: JSON.stringify({ 'query': `SELECT * FROM idx_prop_wil` })
        //             };
        //             // const response = await fetch('http://127.0.0.1:3024/api/prov/getProvinsi');
        //             // const response = await fetch('https://192.168.128.72:9220/idx_prop/_search?from=0&size=100');
        //             // const response = await fetch('https://192.168.128.72:9220/_plugins/_sql?query="SELECT * FROM idx_prop WHERE kode_wil_prop = 11"');
        //             const response = await fetch('https://192.168.128.72:9220/_plugins/_sql', requestOptions)
        //             if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //             }
        //             const dataKab = await response.json();
        //             console.log(dataKab.datarows, 'ini data kab');
        //             // setData(data.hits.hits);
        //             setDataKab(dataKab);
        //             // const options = data.hits.hits.map(hit => ({
        //             //     value: hit._source.kode_wil_prop,
        //             //     label: hit._source.nama_prop
        //             // }));
        //             const options = dataKab.datarows.map(hit => ({
        //                 value: hit[1],
        //                 label: hit[2]
        //             }));
        //             // console.log(options, 'ini options')
        //             setSingleOptions2(options);
        //             console.log(setSingleOptions2(options), 'ini set single')
                    
        //             // console.log(data.hits.hits)
        //             console.log(singleOptions);
        //         } catch (errorKab) {
        //             setErrorKab(errorKab);
        //         } finally {
        //             setLoadingKab(false);
        //         }
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
                    {/* <div className="p-3"> */}
                        <Card>
                            <CardBody>
                            <Row>
                                <Col xs-={6}>
                                    <Label>Provinsi :</Label>
                                    <Select
                                        value={selectedMulti1}
                                        isMulti={true}
                                        isClearable={true}
                                        onChange={() => {
                                            handleMulti1();
                                        }}
                                        options={singleOptions}
                                    />
                                </Col>
                                <Col xs-={6}> 
                                    {/* <div className="mb-3"> */}
                                        <Label>Kabupaten :</Label>
                                        <Select
                                        value={selectedMulti2}
                                        isMulti={true}
                                        isClearable={true}
                                        onChange={() => {
                                            handleMulti2();
                                        }}
                                        options={singleOptions2}
                                        />
                                    {/* </div> */}
                                </Col>
                            </Row>
                            </CardBody>
                        </Card>
                        {/* <p className="fs-17 lh-base">Upgrade your plan from a <span className="fw-semibold">Free
                            trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p>
                        <div className="mt-3">
                            <Link to="/pages-pricing" className="btn btn-success">Upgrade Account!</Link>
                        </div> */}
                    {/* </div>                       */}
                {/* <p>{count}</p>
                <button onClick={handleClick}>test</button>
                <button onClick={handleClick1}>test</button> */}
                {/* {data.map((item, idx) => (              
                    <div key={item._id} style={{ marginBottom: '10px' }}>
                        <div>
                            {item._source.nama_prop}
                        </div>
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
          </React.Fragment>
      );
  };
  
  export default FilterWilayah;