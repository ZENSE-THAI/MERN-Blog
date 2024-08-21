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
        return next(error);
    }
}


export const getComment = async(req,res,next) => {

    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = (currentPage - 1) * limit;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const comment = await Comment.find()
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalComment = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthComment = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            comment,
            totalComment,
            lastMonthComment,
            currentPage,
            totalPages: Math.ceil(totalComment / limit)
        });

    } catch (error) {
        return next(error);
    }
}


export const getPostComment = async(req,res,next) => {
    try {
        const comment = await Comment.find({postId:req.params.postId}).sort({
            createdAt: -1,
        });
        res.status(200).json(comment);

    } catch (error) {
        return  next(error);
    }
}


export const likeComment = async (req, res, next) => {
    try {
        // ดึงคอมเมนต์จากฐานข้อมูลตาม commentId ที่ส่งมาใน params
        const comment = await Comment.findById(req.params.commentId);
        
        // ถ้าไม่เจอคอมเมนต์ ให้ส่งข้อความกลับไปว่า "Comment not found!"
        if (!comment) {
            return next(errorHandler(404,'Comment not found!'));
        }

        // ตรวจสอบว่า user.id ที่ส่งมาอยู่ในอาร์เรย์ like ของคอมเมนต์หรือไม่
        const userIndex = comment.like.indexOf(req.user.id);
        
        // ถ้า user.id ยังไม่อยู่ในอาร์เรย์ like
        if (userIndex === -1) {
            // เพิ่มจำนวน like ขึ้น 1
            comment.numberOfLike += 1;
            // เพิ่ม user.id ลงในอาร์เรย์ like
            comment.like.push(req.user.id);
        } else {
            // ถ้า user.id อยู่ในอาร์เรย์ like แล้ว ให้ลบออก
            comment.numberOfLike -= 1;
            comment.like.splice(userIndex, 1);
        }

        // บันทึกคอมเมนต์ที่ถูกอัปเดตกลับไปที่ฐานข้อมูล
        await comment.save();
        // ส่งคอมเมนต์ที่อัปเดตกลับไปใน response
        res.status(200).json(comment);
    } catch (error) {
        // ถ้าเกิดข้อผิดพลาด ให้ส่ง error กลับไปใน middleware
        return next(error);
    }
};


export const editComment = async(req,res,next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'Comment not found'))
        }
        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(401,'You are not allowed to edit this comment'))
        }

        const editedCommnet =  await Comment.findByIdAndUpdate(
            req.params.commentId,{
                content:req.body.content,
            },
            {new:true},
        )

        res.status(200).json(editedCommnet);

    } catch (error) {
        return next(error)
    }
}


export const deleteComment = async (req, res, next) => {
    try {
        // ค้นหา Comment โดย ID
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        // ตรวจสอบสิทธิ์ในการลบคอมเมนต์
        if (!req.user.isAdmin && req.user.id !== comment.userId.toString()) {
            return next(errorHandler(403, 'You are not allowed to delete this comment'));
        }

        // ลบคอมเมนต์
        await Comment.findByIdAndDelete(req.params.commentId);

        // ส่งการตอบกลับ
        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });

    } catch (error) {
        // จัดการข้อผิดพลาด
        return next(error);
    }
};