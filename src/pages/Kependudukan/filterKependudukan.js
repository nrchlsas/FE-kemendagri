import React, { useState } from 'react'
import { Card, CardBody, Col, Label, Row } from 'reactstrap';
import Select from "react-select";

const SingleOptions = [
    { value: 'Choices 1', label: 'Choices 1' },
    { value: 'Choices 2', label: 'Choices 2' },
    { value: 'Choices 3', label: 'Choices 3' },
    { value: 'Choices 4', label: 'Choices 4' }
];
const FilterKependudukan = () => {
    const [selectedSingle, setSelectedSingle] = useState(null);
    function handleSelectSingle(selectedSingle) {
        setSelectedSingle(selectedSingle);
    }
  return (
   <React.Fragment>
     <Row>
            <Col>
            <div>
                <Card>
                    <CardBody>
                        <div className='d-flex flex-column'>
                        <div className='d-flex justify-content-between mb-2'>
                            <span className='title-filter'>FILTER</span> 
                            <span className='align-content-center'><i className="ri-filter-fills text-dark"></i></span>                             
                        </div>
                        <div className='mb-2'>
                        <Select
                            value={selectedSingle}
                            onChange={() => {
                                handleSelectSingle();
                            }}
                            options={SingleOptions}
                        />
                        </div>                        
                        <div className='mb-2'>
                        <Select
                            value={selectedSingle}
                            onChange={() => {
                                handleSelectSingle();
                            }}
                            options={SingleOptions}
                        />
                        </div>                        
                        <div className='mb-2'>
                        <Select
                            value={selectedSingle}
                            onChange={() => {
                                handleSelectSingle();
                            }}
                            options={SingleOptions}
                        />
                        </div>                        
                        </div>
                    </CardBody>
                </Card>
            </div>                
            </Col>
        </Row>
   </React.Fragment>
  )
}

export default FilterKependudukan;