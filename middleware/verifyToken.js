import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import ErrorResponse from '../utils/errorResponse.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
    let token = req.header("Authorization");
//  console.log(token)
    if(!token) {
        return next(new ErrorResponse("Access Denied",  403))
    }

    if(token) {
        token = token.split("Bearer ")[1]
    }
   
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = verified
    next()
})