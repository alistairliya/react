
import Footer from '../components/Footer'
import Notifications from '../components/Notifications';
import {FE_URL} from '../constants'
function Dashboard() {

  return (
      <div id="about">
        <Notifications/>
        <h1>Dashboard</h1>
        <div>
        <a href={FF_URL+"/me/businesses"}>My Businesses</a>
        </div>
        <div>
        <a href={FE_URL+"/me/approve"}>Reviews</a>
        </div>
        <Footer/>
      </div>
  );
}

export default Dashboard;
