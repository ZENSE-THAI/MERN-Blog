import express from 'express';
import { deleteUser, test, updateUser , signout , getUsers ,deleteUserForAdmin , getUserForComment} from '../controllers/user.controller.js';
import { verifyToken } from '../utills/verifyuser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId',verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser);
router.post('/signout',signout);
router.get('/getusers',verifyToken,getUsers);
router.delete('/deleteuser/:userId',verifyToken,deleteUserForAdmin);
router.get('/:userId',getUserForComment);


export default router;
