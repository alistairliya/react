
import Footer from '../components/Footer'
import Notifications from '../components/Notifications';
function Dashboard() {

  return (
      <div id="about">
        <Notifications/>
        <h1>Dashboard</h1>
        <div>
        <a href="http://localhost:3000/me/businesses">My Businesses</a>
        </div>
        <div>
        <a href="http://localhost:3000/me/approve">Reviews</a>
        </div>
        <Footer/>
      </div>
  );
}

export default Dashboard;
