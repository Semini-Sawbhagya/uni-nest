import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import SignUp from './pages/SignUp/SignUp'

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUp />} />
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
