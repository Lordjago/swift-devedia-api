import asyncHandler from "../middleware/asyncHandler.js";
import bcrypt from 'bcrypt'
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import jwt from 'jsonwebtoken'

export const register = asyncHandler(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        viewedProfile,
        impressions
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return next(new ErrorResponse("Kindly provide a phone and Email", 400));
    }
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
        return next(new ErrorResponse("Email Already In Used", 400));
    }
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000)
    })
    const savedUser = await newUser.save()
    return res.status(200).json(savedUser)
})


export const login = asyncHandler(async (req, res, next) => {
    const {
        email,
        password
    } = req.body

    if (!email || !password) {
        return next(new ErrorResponse("Kindly provide a email and password", 400));
    }
    const user = await User.findOne({ email: email }).select("+password")
    if (!user) {
        return next(new ErrorResponse("User does not exist", 400))
    }
    const isMacth = await bcrypt.compare(password, user.password)
    if (!isMacth) {
        return next(new ErrorResponse("Invalid Credentials", 400))
    }
    //delete user password from retrieved data
    const { password : pass, ...userData } = user._doc

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
    return res.status(200).json({ token: token, user: userData })
})