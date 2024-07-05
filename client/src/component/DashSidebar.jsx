import { useState, useEffect } from 'react';
import { useLocation ,Link} from 'react-router-dom';
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiDocumentText, HiUser } from 'react-icons/hi'
import { useDispatch ,useSelector } from 'react-redux';
import { signoutStart,signoutSuccess,signoutFailure } from '../redux/user/userSlice.js'


export const DashSidebar = () => {

    const location = useLocation();
    const [tab , setTab] = useState('');
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
  
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
    <Sidebar className='w-full md:w-56 '>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Sidebar.Item 
                      active={tab === 'profile'} 
                      as={Link} 
                      to='/dashboard?tab=profile' 
                      icon={HiUser} 
                      label={currentUser.isAdmin ? 'Admin' : 'User'} 
                      labelColor='dark' 
                      className='cursor-pointer hover:text-blue-600'
                      >
                        Profile
                    </Sidebar.Item>
                    {currentUser.isAdmin ? (
                        <Sidebar.Item active={tab === 'post'} as={Link} to='/dashboard?tab=posts' icon={HiDocumentText}  className='cursor-pointer'>
                          Post
                      </Sidebar.Item>
                    ) : (null)}
                    
                <Sidebar.Item icon={HiArrowSmRight}  className='cursor-pointer' onClick={handlesignout}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
