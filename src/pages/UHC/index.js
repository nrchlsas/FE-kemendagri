import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Label, Row } from 'reactstrap'
import ContentUhcV2 from './ContentUhcV2';

const SingleOptions = [
    { value: 'Choices 1', label: 'Choices 1' },
    { value: 'Choices 2', label: 'Choices 2' },
    { value: 'Choices 3', label: 'Choices 3' },
    { value: 'Choices 4', label: 'Choices 4' }
];

const Uhc = () => {
    const [selectedMulti2, setselectedMulti2] = useState(null);
    function handleMulti2(selectedMulti2) {
        setselectedMulti2(selectedMulti2);
    }
    
  return (
    <React.Fragment>
        <div className='page-content'>
            <Row>
                <Col>
                    <ContentUhcV2 />
                </Col>
            </Row>            
        </div>         
    </React.Fragment>
  )
}

export default Uhc;