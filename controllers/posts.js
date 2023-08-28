import asyncHandler from "../middleware/asyncHandler.js";
import Post from "../models/Posts.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";


/* CREATE */
export const createPost = asyncHandler(async (req, res, next) => {
    const { userId, description } = req.body
    const image = req.file
    if (!image) {
        return next(new ErrorResponse("An Image is required", 400))
    }
    const user = await User.findById(userId)
    const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath: image.path ,
        likes: {},
        comment: []
    })

    await newPost.save()
    const post = await Post.find()
    return res.status(200).json(post)
})

/* READ */
export const getFeedPosts = asyncHandler(async (req, res, next) => {
    const post = await Post.find().populate('userId', {firstName: 'firstName', lastName: 'lastName', location:'location'})
    return res.status(200).json(post)
})

export const getUserPosts = asyncHandler(async (req, res, next) => {
    const { userId } = req.params
    const post = await Post.find({ userId })
    return res.status(200).json(post)
})

/* UPDATE */
export const likePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.body
    
    const post = await Post.findById(id)
    const isLike = post.likes.get(userId)

    if (isLike) {
        post.likes.delete(userId)
    } else {
        post.likes.set(userId, true)
    }

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
    )
    return res.status(200).json(updatedPost)
})