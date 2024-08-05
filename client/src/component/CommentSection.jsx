import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Textarea, Button, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import Comment from './Comment.jsx';

export const CommentSection = ({ postId }) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentError, setCommentError] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment) {
            setCommentError('Please enter a comment before submitting.');
            return;
        }
        if (comment.length > 200) {
            return;
        }
        try {
            const res = await fetch(`/api/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser._id,
                    postId,
                    content: comment,
                }),
            });
            if (res.ok) {
                setComment('');
                setCommentError(null);
                getComments();
            }
        } catch (error) {
            setCommentError(error.message);
        }
    };



    const getComments = async () => {
        try {
            const res = await fetch(`/api/comment/getComment/${postId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            } else {
                throw new Error('Failed to fetch comments');
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        getComments();
        setCommentError(null);
    }, [postId]);

    return (
        <div>
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Signed in as:</p>
                    <img
                        src={currentUser.profilePicture}
                        alt={currentUser.username}
                        className="w-5 h-5 rounded-full object-cover"
                    />
                    <Link
                        to={`/dashboard?tab=profile`}
                        className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                        {currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className="text-xs lg:text-xl text-gray-600 dark:text-gray-300 flex gap-1">
                    You must be signed in to comment.
                    <Link to={'/sign-in'} className="text-blue-500 font-semibold hover:underline">
                        Sign in
                    </Link>
                </div>
            )}
            {currentUser ? (
                <form className="border border-teal-500 rounded-md p-3" onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="add a comment..."
                        rows={3}
                        maxLength={200}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-between mt-3">
                        <span
                            className={`text-xs ${
                                comment.length === 200 ? 'text-red-700' : 'text-gray-500'
                            }`}
                        >
                            {200 - comment.length} characters remaining
                        </span>
                        <Button type="submit" color="blue">
                            Comment
                        </Button>
                    </div>
                    {commentError && (
                        <Alert color="failure" icon={HiInformationCircle} className="w-full mt-2 ">
                            {commentError}
                        </Alert>
                    )}
                </form>
            ) : null}

            {comments.length === 0 ? (
                <p className="text-gray-500 italic text-sm my-5">No comment yet!</p>
            ) : (
                <>
                    <div className="text-sm my-5 flex items-center gap-1">
                        <p>Comment</p>
                        <div className="border boder-gray-400 py-1 px-2 rounded-sm">
                            <p>{comments.length}</p>
                        </div>
                    </div>

                    {comments.map((comment) => (
                        <Comment key={comment._id || comment.id} comment={comment} />
                    ))}
                </>
            )}
        </div>
    );
};

export default CommentSection;
