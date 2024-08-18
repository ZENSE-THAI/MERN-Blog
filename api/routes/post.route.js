import express from 'express'
import { verifyToken } from '../utills/verifyuser.js';
import { create ,getPosts , deletePost , updatePost , getPostsForComment} from '../controllers/post.controller.js'

const router = express.Router();

router.post('/create',verifyToken,create);
router.get('/getpost',getPosts);
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost)
router.put('/updatepost/:postId/:userId',verifyToken,updatePost)
router.get('/:postId',getPostsForComment)

export default router;