import { errorHandler } from "../utills/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json({ message: 'API is working!' });
  };
  

export const updateUser = async (req, res, next) => {
    const userId = req.params.userId;

    if (req.user.id !== userId) {
        // ในกรณีทีไอดีผู้ใช้ที่อยู่ใน Token ไม่ตรงกับไอดีผู้ใช้ที่ส่งมาผ่าน url
        return next(errorHandler(403, 'Forbidden: You can only update your own profile'));
    }

    // ตรวจสอบ password
    if (req.body.password) {
        if (req.body.password.length < 6) {
            // ในกรณีทีรหัสมีตัวอักษรน้อยกว่า 6
            return next(errorHandler(400, 'Password must be at least 6 characters.'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // ตรวจสอบ username
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            // ในกรณีทีชื่อผู้ใช้มีตัวอักษรน้อยกว่า 7 และมากกว่า 20
            return next(errorHandler(400, 'Username must be between 7 and 20 characters.'));
        }

        if (req.body.username.includes(' ')) {
            // ในกรณีที่มีช่องว่างใน username
            return next(errorHandler(400, 'Username cannot contain spaces'));
        }

        if (req.body.username !== req.body.username.toLowerCase()) {
            // ในกรณีที่ username ไม่มีตัวพิมพ์เล็ก
            return next(errorHandler(400, 'Username must be lowercase'));
        }

        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            // ในกรณีที่ username มีแต่ตัวอักษร a-z, A-Z, และ 0-9 เท่านั้น
            return next(errorHandler(400, 'Username can only contain letters and numbers'));
        }
    }

    // ตรวจสอบ email
    if (req.body.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            // ในกรณีที่ email ไม่ถูกต้อง
            return next(errorHandler(400, 'Invalid email format'));
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },
        }, { new: true });

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json(null);
    } catch (error) {
      next(error);
    }
  };
  
export const deleteUserForAdmin = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json('user deleted successfully');
    } catch (error) {
      next(error);
    }
  };
  

  export const signout = (req, res, next) => {
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json(null);
    } catch (error) {
      next(error);
    }
  };


  export const getUsers = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = (page - 1) * limit;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
  
      const users = await User.find({
        ...(req.query._Id && { userId: req.query._Id }),
        ...(req.query.username && { username: req.query.username }),
        ...(req.query.email && { email: req.query.email }),
        ...(req.query.profilePicture && { profilePicture: req.query.profilePicture }),
        ...(req.query.isAdmin && { isAdmin: req.query.isAdmin }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } }
          ]
        })
      })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
  
      const totalUsers = await User.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo }
      });
  
      res.status(200).json({
        users,
        totalUsers,
        lastMonthUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit)
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const getUserForComment = async(req,res,next) => {
      try {
        const userId = req.params.userId;
        const  user = await User.findById(userId);
        if (!user) {
          return next(errorHandler(404, 'User not found'));
      }
      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
      } catch (error) {
        next(error);
      }
  }