import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { CallToAction } from '../component/CallToAction';
import { CommentSection } from '../component/CommentSection';

const PostPage = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getpost?slug=${postSlug}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setPost(data.posts[0]);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };

        fetchPost();
    }, [postSlug]);

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen gap-3'>
                <Spinner color={'info'} size={'xl'} />
                <span className='text-xl font-bold'>Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex justify-center items-center h-screen gap-3'>
                <span className='text-xl font-bold text-red-500'>Error loading post</span>
            </div>
        );
    }

    return (
        <main className='p-3 flex flex-col mx-auto max-w-6xl min-h-screen font-mono'>
            <h1 className='text-2xl font-bold mt-10 p-3 text-center  max-w-full mx-auto md:text-3xl lg:text-4xl'>{post.title}</h1>
                
                {post.category ? (
                    <div className="flex gap-2 mt-5 self-center">
                        {post.category.map((category, index) => (
                            <Link key={index} to={`/search?category=${category}`}>
                                <Button size='xs'  color='gray'>
                                    {category}
                                </Button>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>No categories available.</p>
                )}
                <img src={post.image} alt={post.title}  className='mt-10 p-2 max-h-[600px] w-full object-cover'/>
                <div className="flex justify-between text-xs mx-auto w-full max-w-2xl p-3 border-b border-slate-300">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read.</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.content }} className="font-sans p-3 max-w-2xl mx-auto w-full post-content"></div>
                
                <div className="max-w-4xl mx-auto p-3 w-full">
                    <CallToAction/>
                </div>
                <div className="max-w-2xl mx-auto p-3 w-full">
                    <CommentSection postId={post._id}/>
                </div>
        </main>
    );
};

export default PostPage;
