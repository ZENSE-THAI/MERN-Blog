import express from 'express'
import { createComment , getComment ,likeComment} from '../controllers/comment.controller.js';
import { verifyToken } from '../utills/verifyuser.js';


const router = express.Router();

router.post('/create',verifyToken,createComment);
router.get('/getComment/:postId',getComment);
router.put('/likeComment/:commentId',verifyToken,likeComment)

export default router;