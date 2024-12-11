import React from 'react'
import ContentPerencanaan from './ContentPerencanaan'
import { Col, Row } from 'reactstrap'

const Perencanaan = () => {
  const permissionState = (state) => state.Profile;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissionProperties = createSelector(
      permissionState, (d) => ({ list_menus: d.list_menus })
  );
  const { list_menus } = useSelector(permissionProperties);
  useEffect(() => {
      if (list_menus.length == 0) return;
      const permit = get_permission_by_url('/perencanaan', true, () => {
          navigate('/auth-404-basic', { replace: true });
      });
      dispatch(permit);
  }, [list_menus]); //page ini
  return (
    <React.Fragment>
        <div className='page-content'>
          <Row>
            <Col>
              <ContentPerencanaan />
            </Col>
          </Row>          
        </div>
    </React.Fragment>
  )
}

export default Perencanaan