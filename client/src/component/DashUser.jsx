import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from 'flowbite-react';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCheck ,FaTimes} from "react-icons/fa";



import { Pagination } from "flowbite-react";

export const DashUsers = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);
  // const [showMore, setShowMore] = useState(true);


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage,setTotalPage] = useState();
  const onPageChange = (page) => setCurrentPage(page);

  
  useEffect(() => {
    const fetchusers = async () => {
      try {
        const res = await fetch(`/api/user/getusers?page=${currentPage}`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setCurrentPage(data.currentPage);
          setTotalPage(data.totalPages);
        } else {
          console.error("Failed to fetch userss:", data.message);
        }
      } catch (error) {
        console.error("Error fetching userss:", error);
      }
    };

    if (currentUser.isAdmin) {
      fetchusers();
    }
  }, [currentUser, currentPage]);
  

  const deleteusers = async (usersId) => {
    try {
      const res = await fetch(`/api/users/delete/${usersId}`, { method: 'DELETE' });
      console.log(res);
      // if (res.ok) {
      //   setUsers(users.filter(users => users._id !== usersId));
      //   Swal.fire({
      //     title: "Deleted!",
      //     text: "Your users has been deleted.",
      //     icon: "success"
      //   });
      // } else {
      //   Swal.fire({
      //     title: "Error!",
      //     text: "Failed to delete users.",
      //     icon: "error"
      //   });
      // }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete users.",
        icon: "error"
      });
    }
  }

  const showSwal = (usersId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to be delete this users!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009900",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
         deleteusers(usersId);
      }
    });
  }

  return (
    <div className=" flex flex-col  p-3">
      {currentUser.isAdmin  && users.length > 0 ? (
        <>
        <div className="table-auto md:mx-auto overflow-x-auto p-3 
        scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 
      dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-600">
          <Table hoverable className="w-full mx-auto">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.map((users) => (
                <Table.Row key={users._id}>
                  <Table.Cell>{new Date(users.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/`} target="_blank">
                      <img 
                        src={users.profilePicture} 
                        alt={users.username} 
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                      {users.username}
                  </Table.Cell>
                  <Table.Cell>
                      {users.email}
                  </Table.Cell>
                  <Table.Cell className="flex justify-center items-center ">
                    {users.isAdmin ? (
                        <FaCheck className="text-green-500" />
                    ):(
                        <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-center">
                   <span className="text-red-500 cursor-pointer font-semibold hover:underline" onClick={showSwal.bind(this, users._id)}>
                    Delete
                   </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          </div>
          <div className=" md:mx-auto overflow-x-auto p-3">
            <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={onPageChange} showIcons />
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <p>don&apos;t have any user</p>
        </div>
      )}
    </div>
  );
};
