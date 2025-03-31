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
import Boarding from './components/Student/Boarding/Boarding'
import MyBoarding from './components/Student/MyBoarding/MyBoarding'
import ReviewRating from './components/Student/ReviewRating/ReviewRating'
import AboutUs from './components/Student/AboutUs/AboutUs'
import ManageStudents from './components/LandLord/ManageStudents/ManageStudents'


function App() {
  

  return (
    <BrowserRouter>
    <AuthProvider>
     
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path='/home' element={<ProtectedRoute allowedRoles={['student']}><Home/></ProtectedRoute>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/landlord-home' element={<ProtectedRoute allowedRoles={['landlord']}><LandLordHome/></ProtectedRoute>}/>
      <Route path="/properties" element = {<ProtectedRoute allowedRoles={['landlord']}><PropertyListingPage/></ProtectedRoute>}/>
      <Route path="/add-properties" element={<ProtectedRoute allowedRoles={['landlord']}><AddPropertyPage/></ProtectedRoute> } />
      <Route path="/packages" element={<ProtectedRoute allowedRoles={['landlord']}><SubscriptionPlans/></ProtectedRoute>} />
      <Route path="/unauthorized" element={<UnauthorizedPage/>} />
      <Route path="/payment" element={<ProtectedRoute allowedRoles={['student']}><Payment/></ProtectedRoute>} />      
      <Route path="/boarding/:id" element={<ProtectedRoute allowedRoles={['student']}><Boarding/></ProtectedRoute>}/>
      <Route path="/my-boarding/:id" element={<ProtectedRoute allowedRoles={['student']}><MyBoarding/></ProtectedRoute>}/>
      <Route path="/review-rating" element={<ProtectedRoute allowedRoles={['student']}><ReviewRating/></ProtectedRoute>}/>
      <Route path="/about-us" element={<AboutUs/>} />  
      <Route path="/Manage-students" element={<ProtectedRoute allowedRoles={['landlord']}><ManageStudents/></ProtectedRoute>} />
      <Route path="/add-request" element={<ProtectedRoute allowedRoles={['student']}><Boarding/></ProtectedRoute>}/>
      <Route path="/get-status" element={<ProtectedRoute allowedRoles={['student']}><Boarding/></ProtectedRoute>}/>
      <Route path="/get-average-rating/:id" element={<ProtectedRoute allowedRoles={['student']}><Boarding/></ProtectedRoute>}/>
      <Route path="/get-reviews/:id" element={<ProtectedRoute allowedRoles={['student']}><Boarding/></ProtectedRoute>}/>
     
    </Routes>
    

    </AuthProvider>
    </BrowserRouter>
    
  )
}

export default App