import React, { useEffect } from 'react'
import ContentRealisasi from './ContentRealisasi'
import { Col, Row } from 'reactstrap'
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { get_permission_by_url } from "../../slices/thunks";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Realisasi = () => {
  const permissionState = (state) => state.Profile;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissionProperties = createSelector(
      permissionState, (d) => ({ list_menus: d.list_menus })
  );
  const { list_menus } = useSelector(permissionProperties);
  useEffect(() => {
      if (list_menus.length == 0) return;
      const permit = get_permission_by_url('/realisasi', true, () => {
          navigate('/auth-404-basic', { replace: true });
      });
      dispatch(permit);
  }, [list_menus]); //page ini
  return (
    <React.Fragment>
        <div className='page-content'>
          <Row>
            <Col>
              <ContentRealisasi />
            </Col>
          </Row>          
        </div>
    </React.Fragment>
  )
}

export default Realisasi