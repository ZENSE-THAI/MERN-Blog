import { Navbar ,Button,TextInput, Dropdown, Avatar} from "flowbite-react";
import { Link , useLocation} from "react-router-dom";
import { FaMoon} from "react-icons/fa";
import { FaSun } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import {  useSelector , useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice.js';



export const Header = () => {

  const path = useLocation().pathname;
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme()); // เรียกใช้ฟังก์ชัน toggleTheme() ก่อน
  };
  return (
    <Navbar className='border-b-2 sticky top-0 z-50'>
      {/* sticky top-0 z-50 */}
      <Navbar.Brand  as='div'>
        <Link to='/' className='uppercase self-center whitespace-nowrap text-md sm:text-xl font-semibold dark:text-white'>
        <span className=' px-2 py-1 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-lg text-white'>Zense</span>
        Blogs
        </Link>
      </Navbar.Brand>
      
      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={IoSearch}
          className='hidden lg:inline'
        ></TextInput>
      </form>
      <Button className='w-12 h-10 items-center lg:hidden' color='gray' pill>
        <IoSearch/>
      </Button>
      <div className='flex gap-2 items-center md:order-2'>
        <Button className="w-12 h-10 inline"  color='gray' pill onClick={handleToggleTheme}>
        {theme === 'light' ? <FaMoon size={10} /> : <FaSun size={10} />}
        </Button>


        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
            <Avatar
            img={currentUser.profilePicture}
            alt={currentUser.username}
            rounded />
            }>

              <Dropdown.Header >
                <span className='text-sm  block'>@{currentUser.username}</span>
                <span className='text-sm  block font-semibold truncate'>{currentUser.email}</span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                  <Dropdown.Item>
                    Profile
                  </Dropdown.Item>
              </Link>
              {/* <Link to={'/dashboard?tab=profile'}>
                  <Dropdown.Item>
                    Dashboard
                  </Dropdown.Item>
              </Link> */}
              <Dropdown.Divider/>
              <Link to={'/sign-out'}>
                <Dropdown.Item>Sign Out</Dropdown.Item>
              </Link>
          
          </Dropdown>
          ) : (
          <Link to='/sign-in' className=''>
            <Button className="font-semibold" color="blue">
              Sign In
            </Button>
          </Link>
          )}


        <Navbar.Toggle></Navbar.Toggle>
      </div>
        <Navbar.Collapse className=''>
            <Navbar.Link active={path === '/'}  as='div'>
              <Link to='/'>Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/about'}  as='div'>
              <Link to='/about'>About</Link>
            </Navbar.Link>
            <Navbar.Link active={path === '/projects'}  as='div'>
              <Link to='/projects'>Projects</Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}






  //       <Link to='/' className=" text-xl font-bold tracking-wide uppercase dark:text-white">
  //         <span className='text-bold  px-1 bg-gradient-to-tr from-cyan-500 to-blue-500 text-white rounded-sm'>zense</span>dev
  //       </Link>
        
  //       <div className="flex gap-2 md:order-2">
  //         <Button className='ml-2 w-12 h-10 inline  text-md' color='gray' pill>
  //             <FaMoon size={20}/>
  //           </Button>
  //         <Link to='/sign-in'>
  //           <Button gradientDuoTone='purpleToBlue' color='gray' pill>
  //           Sign In
  //           </Button>
  //         </Link>
  //       </div>
  //       <Navbar.Toggle></Navbar.Toggle>
  //         <Navbar.Collapse >
  //           <Navbar.Link>
  //             <Link to='/' className='font-bold text-[16px]'>
  //               Home
  //             </Link>
  //           </Navbar.Link>
  //           <Navbar.Link>
  //             <Link to='/about' className='font-bold text-[16px]'>
  //               About
  //             </Link>
  //           </Navbar.Link>
  //           <Navbar.Link>
  //             <Link to='/projects' className='font-bold text-[16px]'>
  //               Projects
  //             </Link>
  //           </Navbar.Link>
  //         </Navbar.Collapse>