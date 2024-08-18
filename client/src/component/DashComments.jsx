import { useEffect, useState } from "react";
import { useSelector} from "react-redux";
import { Table } from 'flowbite-react';
import Swal from "sweetalert2";
import { Pagination } from "flowbite-react";
import { Link } from "react-router-dom";




export const DashComments = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const onPageChange = (page) => setCurrentPage(page);


  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment/getComment?page=${currentPage}`);
      const data = await res.json();

      if (res.ok) {
            const commentDetails = await Promise.all(
                data.comment.map(async(comments) => {
                    const userRes = await fetch(`/api/user/${comments.userId}`);
                    const userData = await userRes.json();

                    const postRes = await fetch(`/api/post/${comments.postId}`);
                    const postData = await postRes.json();


                    return {
                        ...comments,
                        username: userData.username,
                        postTitle: postData.title,
                        postSlug: postData.slug,
                    };
                    
                })
            )

        setComments(commentDetails);
        setCurrentPage(data.currentPage);
        setTotalPage(data.totalPages);
      } else {
        console.error("Failed to fetch Comment:", data.message);
      }
    } catch (error) {
      console.error("Error fetching Comment:", error);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
        fetchComments();
    }
  }, [currentUser, currentPage]);

  const handleDelete = (commentId) => {
    return () => {
      Swal.fire({
        title: 'Are you sure?',
        text: "Are you sure you want to delete this comment?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#009900',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAccount(commentId);
        }
      });
    };
  };

  const deleteAccount = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, { method: 'DELETE' });

      if (!res.ok) {
        Swal.fire({
          title: 'Failed',
          text: ' Something went wrong ',
          icon: 'error'
        });
      } else {
        Swal.fire({
          title: 'Deleted!',
          text: 'This Comment has been deleted',
          icon: 'success'
        }).then(() => {
          fetchComments(); // Refresh comments list after deletion
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };


  return (
    <div className="flex flex-col p-3">
     
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <div className="table-auto md:mx-auto overflow-x-auto p-3 
          scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 
          dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-600">
            <Table hoverable className="w-full mx-auto">
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Number of likes</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {comments.map((comment) => (
                  <Table.Row key={comment._id}>
                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                     {comment.content}
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLike}</Table.Cell>
                    <Table.Cell>
                        <Link to={`/post/${comment.postSlug}`}  className=" line-clamp-1 font-medium text-gray-900 dark:text-gray-100 hover:underline">
                            {comment.postTitle}
                        </Link>
                    </Table.Cell>
                    <Table.Cell>{comment.username}</Table.Cell>
                    <Table.Cell className="text-center">
                      <span className="text-red-500 cursor-pointer font-semibold hover:underline" onClick={handleDelete(comment._id)} >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div className="md:mx-auto overflow-x-auto p-3">
            <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={onPageChange} showIcons />
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <p>Don&apos;t have any Comments</p>
        </div>
      )}
    </div>
  );
};
