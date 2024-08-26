import { Link } from 'react-router-dom'
import { CallToAction } from '../component/CallToAction.jsx'
import { useEffect , useState } from 'react'
import { PostCard } from '../component/PostCard.jsx'


export const Home = () => {

  const [posts,setPosts] = useState([]);

  useEffect(() => {
    try {
      const fetchPosts = async() => {
        const res = await fetch('/api/post/getpost')
        const data = await res.json()
        if(res.ok){
          setPosts(data.posts)
        }
        if(!res.ok){
          console.log(data.error);
        }
      }
    fetchPosts();
    } catch (error) {
      console.log(error);
    }
  },[])


  return (
    <div className="">
      <div className='px-3 max-w-6xl  mx-auto flex flex-col gap-6 p-28'>
        <h1 className='font-bold text-3xl lg:text-6xl'>Welcome to Home Page</h1>
        <p className='text-gray-500 text-xs sm:text-lg '>Here you'll find a variety of articles and
          tutorials on topics such as web development,
          software engineering, and programming languages.
        </p>
      <Link to='/search' className='text-xs  sm:text-sm text-teal-600 font-bold hover:underline'>
        View all posts
      </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-800">
        <CallToAction/>
      </div>
      <div className="p-3 max-w-6xl mx-auto flex flex-col  gap-8 py-7">
        {posts && posts.length > 0 &&  (
          <div className="flex flex-col gap-6">
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {posts.map((post) => (
               <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to='/search' className='text-lg  sm:text-sm text-teal-600 font-bold hover:underline text-center'>
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
