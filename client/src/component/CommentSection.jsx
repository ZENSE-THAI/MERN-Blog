import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Textarea , Button ,Alert} from 'flowbite-react'
import { useState } from 'react';
import { HiInformationCircle } from "react-icons/hi";


export const CommentSection = ({postId}) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [comments, setComments] = useState('');
    const [commentError,setCommentError] = useState();

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!comments){
            setCommentError('Please enter a comment before submitting.')
        }
        else{
            setCommentError(null);
        }
        if(comments.length > 200){
            return;
        }
        try {
            const res = await fetch(`/api/comment/create`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    userId:currentUser._id,
                    postId,
                    content:comments,
                })
            });
            const data = await res.json();
            if(res.ok){
                setComments('');
                setCommentError(null)
            }
        } catch (error) {
            setCommentError(error.message);
        }
    }
  return (
    <div>
        {currentUser ? (
            <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                <p>Signed in as:</p>
                <img src= {currentUser.profilePicture} alt={currentUser.username}  className='w-5 h-5 rounded-full object-cover'/>
                <Link to={`/dashboard?tab=profile`} className='text-xs text-cyan-600 dark:text-cyan-400 hover:underline'>
                    {currentUser.username}
                </Link>
            </div>
        ):(
            <div className="text-xs lg:text-xl text-gray-600 dark:text-gray-300 flex gap-1">
                You must be signed in to comment.
                <Link to={'/sign-in'} className='text-blue-500 font-semibold hover:underline'>
                    Sign in
                </Link>
            </div>
        )}
        {currentUser ? (
            <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                <Textarea placeholder='add a comment...' rows={3} maxLength={200} value={comments} onChange={(e) => setComments(e.target.value)}/>
                <div className="flex justify-between  mt-3">
                    <span className={`text-xs  ${comments.length === 200 ? 'text-red-700' : 'text-gray-500'}`}>
                        {200 - comments.length}characters remaining
                    </span>
                    <Button type='submit' color='blue'>Comment</Button>
                </div>
                {commentError && (
                    <Alert color="failure" icon={HiInformationCircle} className='w-full mt-2 '>
                        {commentError}
                    </Alert>
                )}
            </form>
        ) : (null)}
    </div>
  )
}

export default CommentSection;