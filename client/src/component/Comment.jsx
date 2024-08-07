import { useEffect, useState } from 'react';
import moment from 'moment';
import { IoIosHeart } from "react-icons/io";
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

const Comment = ({ comment , onLike , onEdit }) => {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);

    const [editedContent, setEditedContent] = useState(comment.content);
    
    // const [editedComment, setEditedComment] = useState();

    useEffect(() => {
        const getUser = async () => {
            if (comment.userId) {
                try {
                    const res = await fetch(`/api/user/${comment.userId}`);
                    const data = await res.json();
                    if (res.ok) {
                        setUser(data);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        };
        getUser();
    }, [comment]);

    const handleEdit =  () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editedContent
                })
            });
    
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            } else {
                console.error('Failed to save edited comment:', res.statusText);
            }
        } catch (error) {
            console.log('Error saving edited comment:', error.message);
        }
    }
    

    return (
        <div className="flex  my-2 p-4 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3">
              <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-10 h-10 rounded-full bg-gray-200"
              />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-1 text-xs truncate">
                        {user ? `@${user.username}` : 'anonymous user'}
                    </span>
                    <span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
                </div>
                {isEditing ? (
                    <div className="">
                        <Textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)}/>
                        <div className="flex gap-2 mt-2 justify-end">
                            <Button color={'blue'} type='button'  size='xs' onClick={handleSave}>Save</Button>
                            <Button color={'gray'} type='button'  size='xs' onClick={() => setIsEditing(false)}>Cancle</Button>
                        </div>
                    </div>
                ) : (
                <>
                    <p className='text-gray-500 pb-2'>{comment.content}</p>
                    <div className='flex items-center gap-2 pt-2 text-xs  border-t dark:border-gray-700 max-w-fit h-8 '>
                    <button 
                        type='button' 
                        onClick={() => onLike(comment._id)} 
                        className={`text-gray-500 hover:text-red-600 hover:scale-125 
                            ${
                                currentUser && comment.like.includes(currentUser._id) ? 'text-red-600' : ''
                            }`}
                    >
                        <IoIosHeart className='text-sm'/>
                    </button>
                    <span className='text-xs text-gray-500 dark:text-gray-300  ease-in-out transition-300'>
                            {
                                comment.numberOfLike > 0 && comment.numberOfLike + " " + (
                                    comment.numberOfLike === 1 ? "like" : "Likes"
                                ) 
                            }
                    </span>
                    {
                        currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                            <button type='button' className='text-gray-400 hover:text-red-500 ' onClick={handleEdit}>
                                Edit
                            </button>
                        )
                    }
                    </div>
                </>
                )}
                
            </div>
        </div>
    );
};

export default Comment;
