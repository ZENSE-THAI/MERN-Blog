import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from 'flowbite-react';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export const DashPosts = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userPost, setUserPost] = useState([]);
  const [showMore, setShowMore] = useState(true);

  
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

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser, currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPost.length;
    try {
      const res = await fetch(`/api/post/getpost?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPost([...userPost, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deletePost = async (postId) => {
    try {
      const res = await fetch(`/api/post/deletepost/${postId}/${currentUser._id}`, { method: 'DELETE' });
      if (res.ok) {
        setUserPost(userPost.filter(post => post._id !== postId));
        Swal.fire({
          title: "Deleted!",
          text: "Your post has been deleted.",
          icon: "success"
        }).than(() => {
          fetchPosts();
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete post.",
          icon: "error"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete post.",
        icon: "error"
      });
    }
  }

  const showSwal = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to be delete this post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009900",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost(postId);
      }
    });
  }

  return (
    <div className="flex flex-col  justify-center items-center table-auto md:mx-auto overflow-x-auto p-3 
        scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 
      dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-600"
    >
      {currentUser.isAdmin && userPost.length > 0 ? (
        <>
        <div className="mb-5 w-full flex justify-end md:mx-auto">
          <Button  color="blue" as={Link} to="/dashboard?tab=create-post">Create Post</Button>
        </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="bg-gray-200">Date Updated</Table.HeadCell>
              <Table.HeadCell className="bg-gray-200">Post Image</Table.HeadCell>
              <Table.HeadCell className="bg-gray-200">Post Title</Table.HeadCell>
              <Table.HeadCell className="bg-gray-200">Category</Table.HeadCell>
              <Table.HeadCell className="bg-gray-200">Delete</Table.HeadCell>
              <Table.HeadCell className="bg-gray-200">Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {userPost.map((post) => (
                <Table.Row key={post._id}>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`} className="font-medium text-gray-900 dark:text-gray-100 hover:underline">
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category.join(", ")}</Table.Cell>
                  <Table.Cell>
                    <span 
                      className='text-red-600 font-medium hover:underline cursor-pointer'
                      onClick={() => showSwal(post._id)}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/dashboard?tab=update-post/${post._id}`}>
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
        <div className="w-full flex flex-col justify-center items-center">
          <p>You haven&apos;t created any posts yet. Start sharing your thoughts now!</p>
          <Link to={'/dashboard?tab=create-post'} >
            <Button color="blue" className="mt-5">Create Post</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
