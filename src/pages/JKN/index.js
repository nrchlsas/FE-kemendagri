import React, { useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import ContentJKN from './ContentJKN';


const JKN = () => {
  document.title="SIPD-HUB | JKN";
//   const permissionState = (state) => state.Profile;
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const permissionProperties = createSelector(
//       permissionState, (d) => ({ list_menus: d.list_menus })
//   );
//   const { list_menus } = useSelector(permissionProperties);
//   useEffect(() => {
//       if (list_menus.length == 0) return;
//       const permit = get_permission_by_url('/miskin-ekstrim', true, () => {
//           navigate('/auth-404-basic', { replace: true });
//       });
//       dispatch(permit);
//   }, [list_menus]); //page ini
  return (
    <React.Fragment>
    <div className="page-content">              
      <Row>
        <Col>
            <ContentJKN />
        </Col>
      </Row>        
    </div>
    </React.Fragment>
  )
}

export default JKN