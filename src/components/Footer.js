import { Link } from "react-router-dom";
import { Outlet} from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div id="about">
        <Outlet />
      </div>
        <p>Copyright &copy; 2023</p>
        <Link to={'about'}>About</Link>
    </footer>
  )
}

export default Footer