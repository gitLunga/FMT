import { Link } from "react-router-dom";


function Header() {

    return (<div id="header">
        <Link to='/login' className="nav_button">Login</Link> 
        <Link to='/'  className="nav_button">Register</Link>
        <Link to='/playerform'  className="nav_button">Player Form</Link>

        <Link to='/AdminDashboard'  className="nav_button">AdminDashboard</Link>


    </div>)


}

export default Header;