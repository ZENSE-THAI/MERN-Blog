import { BrowserRouter,Route,Routes } from 'react-router-dom'
import React from 'react';

// Import Pages
import { Home } from './pages/Home.jsx'
import { About } from './pages/About.jsx'
import { Projects } from './pages/Projects.jsx'
import { Signin } from './pages/Signin.jsx'
import { Signup } from './pages/Signup.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Header } from './component/Header.jsx';


export default function App() {
  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/projects' element={< Projects/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/signin' element={<Signin/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
        </Routes>
      </BrowserRouter>
      <h1 className='text-red-500 text-bold'></h1>
    </>
  )
}
