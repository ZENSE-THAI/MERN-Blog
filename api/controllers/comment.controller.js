import { errorHandler } from "../utills/error.js";
import Comment from "../models/comment.model.js";



export const createComment = async(req,res,next) => {
    try {
        const { userId,postId,content } = req.body;
        if(!userId || !postId || !content){
            return next(errorHandler(400,'Please provide all required fields'));
        }
        if (userId !== req.body.userId) {
            return next(errorHandler(401, 'You are not allowed to create a comment'));
        }

        const newComment = new Comment({
            userId,
            postId,
            content
        });
        await newComment.save();
        res.status(201).json({
            success : true,
            message : 'Comment created successfully',
            data : newComment
        });
        
    } catch (error) {
        next(errorHandler(500,'Internal Server Error'));
    }
}