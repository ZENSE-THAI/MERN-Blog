import Post from "../models/post.model.js";
import { errorHandler } from "../utills/error.js"

export const create = async(req,res,next) => {
    
    if(!req.user.isAdmin){
        return next(errorHandler(403,'Your are not allowed to create a post'));
    }

    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,'Please provide all required fields'))
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const newPost = new Post({
        ...req.body,
        slug,
        userId:req.user.id,
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json({
            success : true,
            message : 'Post created successfully',
            data : savedPost
        });
        
    } catch (error) {
        next(error);
    }
}

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        // Validate and construct query conditions
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            })
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });
    } catch (error) {
        next(error);
    }
};


export const deletePost = async(req,res,next) => {
    if(!req.user.isAdmin ||  req.user.id !== req.params.userId ){
        return next(errorHandler(403,'You are not allowed to delete this post'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}


export const updatePost = async(req,res,next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403,'You are not allowed to update this post'));
    }
    try {
       const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image : req.body.image,
            },
        }, { new: true });
        if (!updatedPost) {
            return next(errorHandler(404, 'Post not found'));
        };
        res.status(200).json({
            success: true,
            message: 'Post updated successfully'
        });
    } catch (error) {
        next(error);
    }
 }


 export const getPostsForComment = async(req,res,next) => {
    try {
        const postId = req.params.postId;
        const  post = await Post.findById(postId);
        if (!post) {
          return next(errorHandler(404, 'Post not found'));
      }
      res.status(200).json(post);
      } catch (error) {
        next(error);
      }
 }