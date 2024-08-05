import { useEffect, useState } from 'react';
import moment from 'moment';

const Comment = ({ comment }) => {
    const [user, setUser] = useState({});

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

    return (
        <div className="flex items-center my-2">
            <img
                src={user.profilePicture}
                alt={user.username}
                className="w-10 h-10 rounded-full bg-gray-200"
            />
            <div className="ml-3">
                <div className="flex items-center">
                    <span className="font-bold mr-1 truncate">
                        {user ? `@${user.username}` : 'anonymous user'}
                    </span>
                    <span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
                </div>
                <p>{comment.content}</p>
            </div>
        </div>
    );
};

export default Comment;
