import { useSelector } from 'react-redux'
import { Outlet , Navigate} from 'react-router-dom';

const AdminPrivateRoute = () => {
    const currentUser = useSelector(state => state.user.currentUser);
  return (
    currentUser && currentUser.isAdmin ? <Outlet/> : <Navigate to='/sign-in'/>
  )
}

export default AdminPrivateRoute