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
import { CreatePost } from './pages/CreatePost.jsx';
import { UpdatePost } from './pages/UpdatePost.jsx';
import PrivateRoute from './component/PrivateRoute.jsx';
import AdminPrivateRoute from './component/AdminPrivateRoute.jsx';
import PostPage from './pages/PostPage.jsx';
import ScrollToTop from './component/ScrollToTop.jsx';



export default function App() {
  return (
    <>
      <BrowserRouter>
      <ScrollToTop/>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/sign-in' element={<Signin/>}></Route>
          <Route path='/sign-up' element={<Signup/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/projects' element={< Projects/>}></Route>
          <Route path='/post/:postSlug' element={<PostPage/>}></Route>
          <Route element={<PrivateRoute/>}>
              <Route path='/dashboard' element={<Dashboard/>}></Route>
          </Route>
          <Route element={<AdminPrivateRoute/>}>
              <Route path='/create-post' element={<CreatePost/>}></Route>
              <Route path='/update-post/:postId' element={<UpdatePost/>}></Route>
          </Route>
        </Routes>
      <FooterComponent/>
      </BrowserRouter>
    </>
  )
}
