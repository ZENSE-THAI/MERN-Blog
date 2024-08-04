import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
            required:true,
        },
        postId:{
            type:String,
            required:true,
        },
        content:{
            type:String,
            required:true,
        },
        like:{
            type:Array,
            default:[],
        },
        numberOfLike:{
            type:Number,
            default:0
        },
    },{timestamps:true}
);

const comment = mongoose.model('Comment', commentSchema);

export default comment