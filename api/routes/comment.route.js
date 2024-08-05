import express from 'express'
import { createComment , getComment} from '../controllers/comment.controller.js';
import { verifyToken } from '../utills/verifyuser.js';


const router = express.Router();

router.post('/create',verifyToken,createComment);
router.get('/getComment/:postId',getComment);

export default router;