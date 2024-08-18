import express from 'express'
import { createComment , getPostComment ,likeComment ,editComment ,deleteComment, getComment} from '../controllers/comment.controller.js';
import { verifyToken } from '../utills/verifyuser.js';


const router = express.Router();

router.post('/create',verifyToken,createComment);
router.get('/getPostComment/:postId',getPostComment);
router.put('/likeComment/:commentId',verifyToken,likeComment);
router.put('/editComment/:commentId',verifyToken,editComment);
router.delete('/deleteComment/:commentId',verifyToken,deleteComment);
router.get('/getComment',verifyToken,getComment)

export default router;