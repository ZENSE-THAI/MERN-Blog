import { Link } from 'react-router-dom';
import { useState } from 'react';

export const PostCard = ({ post }) => {

  const [category, setCategory] = useState(post.category);

  return (
    <div className='group  relative w-full h-[400px] border border-gray-500 hover:border-blue-500 overflow-hidden rounded-lg sm:w-[430px] transition-all'>
      <Link to={`/post/${post.slug}`}>
        <img 
          src={post.image} 
          alt={post.title}  
          className='h-[260px] w-full object-cover group-hover:h-[200px] duration-300 transition-all z-20'
        />
      </Link>
      <div className='px-5 py-3 flex flex-col gap-3'>
        <p className='line-clamp-1 sm:line-clamp-2 text-lg font-semibold cursor-pointer hover:underline'>
          {post.title}
        </p>
        <div className="">
          {
            category.map((categoryItem, index) => (
            <span 
              className='mx-1 text-xs text-gray-100 italic bg-gray-400 p-1 dark:bg-gray-400 dark:text-white rounded-md' 
              key={index}>
                {categoryItem}
            </span>
          ))}
        </div>
        <Link to={`/post/${post.slug}`} 
          className='absolute bottom-[-200px] right-0 left-0 group-hover:bottom-0 border border-blue-500 text-blue-500
          hover:text-white hover:bg-blue-500 duration-300 transition-all text-center py-2 rounded-md rounded-tl-none rounded-tr-none'>
          Read article
        </Link>
      </div>
    </div>
  );
}
