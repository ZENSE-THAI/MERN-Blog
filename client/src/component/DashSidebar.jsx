import { useState, useEffect } from 'react';
import { useLocation ,Link} from 'react-router-dom';
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiUser } from 'react-icons/hi'

export const DashSidebar = () => {

    const location = useLocation();
    const [tab , setTab] = useState('');
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl){
        setTab(tabFromUrl);
      }
      // console.log(tabFromUrl);
    },[location.search])
  
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                    <Sidebar.Item active={tab === 'profile'} as={Link} to='/dashboard?tab=profile' icon={HiUser} label='User' labelColor='dark' className='cursor-pointer'>
                        Profile
                    </Sidebar.Item>
                <Sidebar.Item icon={HiArrowSmRight}  className='cursor-pointer'>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
