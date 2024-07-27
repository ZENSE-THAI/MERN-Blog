import { useEffect, useState } from "react";
import { useSelector} from "react-redux";
import { Table } from 'flowbite-react';
import Swal from "sweetalert2";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Pagination } from "flowbite-react";

export const DashUsers = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const onPageChange = (page) => setCurrentPage(page);

  const fetchusers = async () => {
    try {
      const res = await fetch(`/api/user/getusers?page=${currentPage}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setCurrentPage(data.currentPage);
        setTotalPage(data.totalPages);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchusers();
    }
  }, [currentUser, currentPage]);

  const handleDelete = (usersId) => {
    return () => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#009900',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAccount(usersId);
        }
      });
    };
  };

  const deleteAccount = async (usersId) => {
    try {
      const res = await fetch(`/api/user/deleteuser/${usersId}`, { method: 'DELETE' });

      if (!res.ok) {
        Swal.fire({
          title: 'Failed',
          text: ' Something went wrong ',
          icon: 'error'
        });
      } else {
        Swal.fire({
          title: 'Deleted!',
          text: 'This account has been deleted',
          icon: 'success'
        }).then(() => {
          fetchusers(); // Refresh user list after deletion
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="flex flex-col p-3">
      {currentUser.isAdmin && users.length > 0 ? (
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
                {users.map((user) => (
                  <Table.Row key={user._id}>
                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <img 
                        src={user.profilePicture} 
                        alt={user.username} 
                        className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell className="flex justify-center items-center">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <span className="text-red-500 cursor-pointer font-semibold hover:underline" onClick={handleDelete(user._id)}>
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
          <p>Don&apos;t have any user</p>
        </div>
      )}
    </div>
  );
};
