import React from 'react'
import ContentRealisasi from './ContentRealisasi'
import { Col, Row } from 'reactstrap'

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