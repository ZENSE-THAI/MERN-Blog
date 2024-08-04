import express from 'express'
import { createComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utills/verifyuser.js';


const router = express.Router();

router.post('/create',verifyToken,createComment);

export default router;