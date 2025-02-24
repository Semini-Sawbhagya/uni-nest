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

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import UnauthorizedPage from './pages/Unauthorized'
import Payment from './components/Student/Payment/Payment'



function App() {
  

  return (
    <BrowserRouter>
    <AuthProvider>
     
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path='/home' element={<ProtectedRoute allowedRoles={['student']}><Home/></ProtectedRoute>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/landlord-home' element={<LandLordHome/>}/>
      <Route path="/properties" element = {<PropertyListingPage/>}/>
      <Route path="/add-properties" element={<AddPropertyPage/> } />
      <Route path="/packages" element={<SubscriptionPlans/>} />
      <Route path="/unauthorized" element={<UnauthorizedPage/>} />
      <Route path="/payment" element={<Payment/>} />      
    </Routes>
    </AuthProvider>
    
    </BrowserRouter>
    
  )
}

export default App