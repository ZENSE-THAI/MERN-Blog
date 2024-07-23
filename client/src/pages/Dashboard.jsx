import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DashSidebar } from '../component/DashSidebar.jsx';
import { DashProfile } from '../component/DashProfile.jsx';
import { DashPosts } from '../component/DashPosts.jsx';
import { UpdatePost } from '../pages/UpdatePost.jsx';
import {CreatePost} from '../pages/CreatePost.jsx';

export const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
      if (tabFromUrl.startsWith('update-post/')) {
        const id = tabFromUrl.split('/')[1];
        setPostId(id);
      } else {
        setPostId(null);
      }
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className='md:w-56'>
        {/* sidebar */}
        <DashSidebar />
      </div>
      <div className="flex-1">
        {/* Profile */}
        {tab === 'profile' && <DashProfile />}
        {/* Posts */}
        {tab === 'posts' && <DashPosts />}
        {/* Create Posts */}
        {tab === 'create-post' && <CreatePost />}
        {/* Update Post */}
        {tab.startsWith('update-post/') && postId && <UpdatePost postId={postId} />}
      </div>
    </div>
  );
};
