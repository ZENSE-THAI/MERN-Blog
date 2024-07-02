import { useState, useEffect } from 'react';
import { useLocation ,Link} from 'react-router-dom';
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { useDispatch  } from 'react-redux';
import { signoutStart,signoutSuccess,signoutFailure } from '../redux/user/userSlice.js'


export const DashSidebar = () => {

    const location = useLocation();
    const [tab , setTab] = useState('');
    const dispatch = useDispatch();
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl){
        setTab(tabFromUrl);
      }
      // console.log(tabFromUrl);
    },[location.search])

 const handlesignout = async() =>{
      try {
        dispatch(signoutStart());
        const res = await fetch('/api/user/signout',{method:'POST'});
        const data = await res.json();
        if(!res.ok){
          console.log(data.message);
        }else{
          dispatch(signoutSuccess(data));
        }
      } catch (error) {
        dispatch(signoutFailure(error.message));
      }
    }
  
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                    <Sidebar.Item active={tab === 'profile'} as={Link} to='/dashboard?tab=profile' icon={HiUser} label='User' labelColor='dark' className='cursor-pointer'>
                        Profile
                    </Sidebar.Item>
                <Sidebar.Item icon={HiArrowSmRight}  className='cursor-pointer' onClick={handlesignout}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
