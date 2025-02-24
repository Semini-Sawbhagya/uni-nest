import React,{useState} from 'react'
import './NavBar.css'
import logo from '../../../assets/logo.png'
import { Link } from 'react-router-dom'
import search_icon from '../../../assets/search_icon.png'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {

  const [menu,setMenu] = useState("home");
  const navigate = useNavigate();

  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div className='navbar'>
      <Link to='/'><img src={logo} alt="" className="logo"/></Link>
      <ul className="navbar-menu">
      <Link to='/home' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home</Link>
      <Link to='/payment' onClick={()=>setMenu("payment")} className={menu==="payment"?"active":""}>payment</Link>
      <a href='#app-download' onClick={()=>setMenu("about-us")}className={menu==="mobile-app"?"active":""}>About us</a>
      <a href='#footer' onClick={()=>setMenu("contact-us")}className={menu==="contact-us"?"active":""}>contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={search_icon} alt="" />
        <div className='navbar-search-icon'>
          
        </div>
        
        <button>sign in</button>
        <button onClick={handlelogout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar