import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import SignUp from './pages/SignUp/SignUp'
import React from 'react'
import NavBar from './components/Student/NavBar/NavBar'
import Home from './components/Student/Home/Home'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
import LandLordHome from './components/LandLord/landlordHome'
import PropertyListingPage from './components/LandLord/Properties/PropertyListing'
import AddPropertyPage from './components/LandLord/AddProperties/AddProperties'
import SubscriptionPlans from './components/LandLord/SubscriptionPlans/SubscriptionPlans'



function App() {
  

  return (
    <BrowserRouter>
     
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path='/home' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/landlord-home' element={<LandLordHome/>}/>
      <Route path="/properties" element = {<PropertyListingPage/>}/>
      <Route path="/add-properties" element={<AddPropertyPage/> } />
      <Route path="/packages" element={<SubscriptionPlans />} />
      
      
    </Routes>
    
    </BrowserRouter>
    
  )
}

export default App