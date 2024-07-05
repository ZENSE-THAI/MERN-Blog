import { Navbar, Button, TextInput, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation ,useNavigate } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice.js';
import { signoutStart,signoutSuccess,signoutFailure } from '../redux/user/userSlice.js'

export const Header = () => {
  const path = useLocation().pathname;
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector(state => state.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handlesignout = async() =>{
    try {
      dispatch(signoutStart());
      const res = await fetch('/api/user/signout',{method:'POST'});
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signoutSuccess(data));
        navigate('sign-in')
      }
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  }

  return (
    <Navbar className='border-b-2 sticky top-0 z-50'>
      <Navbar.Brand as='div'>
        <Link to='/' className='uppercase self-center whitespace-nowrap text-md sm:text-xl font-semibold dark:text-white'>
          <span className='px-2 py-1 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-lg text-white'>Zense</span>
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
        <IoSearch />
      </Button>

      <div className='flex gap-2 items-center md:order-2'>
        <Button className="w-12 h-10 inline" color='gray' pill onClick={handleToggleTheme}>
          {theme === 'light' ? <FaMoon size={10} /> : <FaSun size={10} />}
        </Button>

        {/* เปลี่ยนเงื่อนไขที่แสดง Dropdown หรือปุ่ม Sign In */}
        {!currentUser ? (
          <Link to='/sign-in' className=''>
            <Button className="font-semibold" color="blue" >
              Sign In
            </Button>
          </Link>
        ) : (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                img={currentUser.profilePicture}
                alt={currentUser.username}
                rounded
              />
            }>

            <Dropdown.Header>
              <span className='text-sm block'>@{currentUser.username}</span>
              <span className='text-sm block font-semibold truncate'>{currentUser.email}</span>
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
            <Dropdown.Divider />
            <Link  onClick={handlesignout} >
              <Dropdown.Item  onClick={handlesignout}>Sign Out</Dropdown.Item>
            </Link>
          </Dropdown>
        )}

        <Navbar.Toggle></Navbar.Toggle>
      </div>

      <Navbar.Collapse className=''>
        <Navbar.Link active={path === '/'} as='div'>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as='div'>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as='div'>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}
