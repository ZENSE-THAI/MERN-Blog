import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from 'flowbite-react';
import { Link } from "react-router-dom";


export const DashPosts = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userPost, setUserPost] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getpost?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPost(data.posts);
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

  return (
    <div className="w-full table-auto md:mx-auto overflow-x-auto p-3 
        scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 
      dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-600"
    >
      {currentUser.isAdmin && userPost.length > 0 ? (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body> {/* ย้ายการแมปโพสต์ไปไว้ภายใน <Table.Body> */}
            {userPost.map((post) => (
              <Table.Row key={post._id}> {/* เพิ่ม key ให้กับ <Table.Row> */}
                <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell> {/* ใช้ new Date(post.updatedAt).toLocaleDateString() เพื่อแสดงวันที่ */}
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell >
                  <Link to={`/post/${post.slug}`} className="font-medium text-gray-900 dark:text-gray-100">
                    {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{post.category.join(", ")}</Table.Cell>
                <Table.Cell>
                  <span className=' text-red-600 font-medium hover:underline cursor-pointer'>Delete</span>
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
      ) : (
        <p>You haven&apos;t created any posts yet. Start sharing your thoughts now!</p>
      )}
    </div>
  );
};
