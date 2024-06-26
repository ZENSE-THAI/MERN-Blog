import { BrowserRouter,Route,Routes } from 'react-router-dom'

// Import Pages
import { Header } from './component/Header.jsx';
import { Home } from './pages/Home.jsx'
import { FooterComponent } from './component/Footer.jsx';
import { Signin } from './pages/Signin.jsx'
import { Signup } from './pages/Signup.jsx'
import { About } from './pages/About.jsx'
import { Projects } from './pages/Projects.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import PrivateRoute from './component/PrivateRoute.jsx';


export default function App() {
  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/sign-in' element={<Signin/>}></Route>
          <Route path='/sign-up' element={<Signup/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route element={<PrivateRoute/>}>
              <Route path='/dashboard' element={<Dashboard/>}></Route>
          </Route>
          <Route path='/projects' element={< Projects/>}></Route>
        </Routes>
      <FooterComponent/>
      </BrowserRouter>
    </>
  )
}
