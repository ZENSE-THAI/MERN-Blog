import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from 'flowbite-react';
import { Link } from "react-router-dom";

export const DashPosts = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userPost, setUserPost] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getpost?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPost(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        } else {
          console.error("Failed to fetch posts:", data.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser, currentUser._id]);


  const handleShowMore = async() => {
      const startIndex = userPost.length;
      try {
        const res = await fetch(`/api/post/getpost?userId=${currentUser._id}&startIndex=${startIndex}`);
        const data = await res.json();
        if(res.ok){
          setUserPost([...userPost, ...data.posts]);
          if(data.posts.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
  }

  return (
    <div className="w-full  table-auto md:mx-auto overflow-x-auto p-3 
        scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 
      dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-600"
    >
      {currentUser.isAdmin && userPost.length > 0 ? (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {userPost.map((post) => (
                <Table.Row key={post._id}>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`} target="_blank">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`} target="_blank" className="font-medium text-gray-900 dark:text-gray-100 hover:underline">
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category.join(", ")}</Table.Cell>
                  <Table.Cell>
                    <span className='text-red-600 font-medium hover:underline cursor-pointer'>Delete</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/updatepost/${post._id}`}>
                      <span className='text-teal-500 font-medium hover:underline cursor-pointer'>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {
            showMore && (
              <div className="w-full flex justify-center">
                <button onClick={handleShowMore} className=" mt-4 bg-blue-500 hover:bg-blue-800 ease-in-out duration-300 text-white px-4 py-2 rounded">
                  Show More
                </button>
              </div>
            ) 
          }
        </>
      ) : (
        <p>You haven&apos;t created any posts yet. Start sharing your thoughts now!</p>
      )}
    </div>
  );
};
