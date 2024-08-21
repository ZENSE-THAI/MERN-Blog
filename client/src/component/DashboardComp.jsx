import { useEffect, useState } from "react"
import { HiArrowNarrowUp, HiOutlineUserGroup , HiAnnotation ,HiDocumentText} from "react-icons/hi";
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { Button, Table } from 'flowbite-react'

export const DashboardComp = () => {
  const [users, setUsers] = useState();
  const [posts, setPosts] = useState();
  const [comments, setComments] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [totalPosts, setTotalPosts] = useState();
  const [totalComments, setTotalComments] = useState();
  const [lastMonthUsers, setLastMonthUsers] = useState();
  const [lastMonthPosts, setLastMonthPosts] = useState();
  const [lastMonthComments, setLastMonthComments] = useState();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = () => {
      fetchUsers();
      fetchPosts();
      fetchComments();
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getpost?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getComment?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comment);
          setTotalComments(data.totalComment);
          setLastMonthComments(data.lastMonthComment);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  return (
    <div className="p-4 md:mx-auto w-full max-w-screen-lg">
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* User Card */}
        <div className="flex flex-col p-5 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 uppercase text-md">Total Users</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-200">{totalUsers}</p>
            </div>
            <Link to={'/dashboard?tab=user'} className="hover:scale-105 transition-transform">
              <HiOutlineUserGroup className="text-6xl text-teal-600" />
            </Link>
          </div>
          <div className="mt-2 text-sm text-green-500 flex items-center">
            <HiArrowNarrowUp />
            <span>{lastMonthUsers} Last Month</span>
          </div>
        </div>

        {/* Posts Card */}
        <div className="flex flex-col p-5 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 uppercase text-md">Total Posts</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-200">{totalPosts}</p>
            </div>
            <Link to={'/dashboard?tab=posts'} className="hover:scale-105 transition-transform">
              <HiDocumentText className="text-6xl text-indigo-600" />
            </Link>
          </div>
          <div className="mt-2 text-sm text-green-500 flex items-center">
            <HiArrowNarrowUp />
            <span>{lastMonthPosts} Last Month</span>
          </div>
        </div>

        {/* Comments Card */}
        <div className="flex flex-col p-5 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 uppercase text-md">Total Comments</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-200">{totalComments}</p>
            </div>
            <Link to={'/dashboard?tab=comments'} className="hover:scale-105 transition-transform">
              <HiAnnotation className="text-6xl text-purple-600" />
            </Link>
          </div>
          <div className="mt-2 text-sm text-green-500 flex items-center">
            <HiArrowNarrowUp />
            <span>{lastMonthComments} Last Month</span>
          </div>
        </div>
      </div>

      {/* Recent Data Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
          <div className="flex justify-between mb-3">
            <h2 className="text-xl font-semibold">Recent Users</h2>
            <Button size={'sm'} color={'blue'}>
              <Link to={'/dashboard?tab=user'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Profile</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users && users.map((user) => (
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-gray-100 dark:bg-gray-700">
                  <Table.Cell>
                    <img src={user.profilePicture} alt="profile avatar" className="w-10 h-10 rounded-full object-cover" />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>

        {/* Recent Comments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
          <div className="flex justify-between mb-3">
            <h2 className="text-xl font-semibold">Recent Comments</h2>
            <Button size={'sm'} color={'blue'}>
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments && comments.map((comment) => (
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-gray-100 dark:bg-gray-700">
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLike}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>


        {/* Recent Posts */}
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full">
          <div className="flex justify-between mb-3">
            <h2 className="text-xl font-semibold">Recent Comments</h2>
            <Button size={'sm'} color={'blue'}>
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts && posts.map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-gray-100 dark:bg-gray-700">
                  <Table.Cell>
                    <img src={post.image} alt="post image" className="w-20 h-10  object-cover" />
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`} className="text-gray-800 dark:text-gray-300 hover:underline">
                    {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category.join(' , ')}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
