import React from 'react'
import {logo} from '../../assets/logo'
import {searchIcon} from '../../assets/searchIcon'
const NavBar = () => {
  return (
    <div className='navbar'>
        <img src={logo} alt="" className='logo'/>
        <ul>
            <li>Home</li>
            <li>Contact Us</li>
            <li>Payments</li>
        </ul>
        <div className='navbar-right'>
          <img src={searchIcon} alt="" />
        </div>
      
    </div>
  )
}

export default NavBar
