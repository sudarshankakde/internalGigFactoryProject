import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import Login from './pages/login/Login.jsx'
import { Dashboard } from './pages/Dashboard/Dashboard.jsx'
import { Profile } from './pages/Profile/Profile.jsx'
import { ActiveProjects } from './pages/ActiveProject/ActiveProject.jsx'


function App() { 
  
  const [count, setCount] = useState(0)

  return (
    //<Login/>
    <BrowserRouter>

    <>
       <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/activeProject" element={<ActiveProjects />} />
       </Routes>
    </>

    </BrowserRouter>
  )
}

export default App
