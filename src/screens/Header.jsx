import { Link } from "react-router-dom";


function Header() {

    return (<div id="header">
        <Link to='/login' className="nav_button">Login</Link> 
       
        {/* <Link to='/playerform'  className="nav_button">Player Form</Link> */}

        <Link to='/AdminDashboard'  className="nav_button">AdminDashboard</Link>

        <Link to='/'  className="nav_button">Landing Page</Link>
        <Link to='/login'  className="nav_button">Login Page</Link>


        {/* <Link to='/ViewPlayers'  className="nav_button">View Players</Link> */}


    </div>)


}

export default Header;