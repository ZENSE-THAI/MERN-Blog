import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      profilePicture:{
        type:String,
        default:"https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg",
      },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
