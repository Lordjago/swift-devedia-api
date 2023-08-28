import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";

/*READ*/
export const getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id);
    return res.status(200).json(user);
})


export const getUsersFriends = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id)

    // if (user.friends.length > 0) {
        const friends = await Promise.all(
            user.friends.map(id => {
                return User.findById(id)
            })
        )
        const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return {
                _id,
                firstName,
                lastName,
                occupation,
                location,
                picturePath
            }
        })
        return res.status(200).json({ friends: formattedFriends })
    // } else {
    //     return res.status(200).json(user.friends)
    // }

})

/*UPDATE*/
export const addRemoveFriend = asyncHandler(async (req, res, next) => {
    const { id, friendId } = req.params

    const user = await User.findById(id)
    const friend = await User.findById(friendId)
    // console.log(user, friend)
    if (user.friends.includes(friendId)) {
        console.log("if")
        user.friends.filter(id => id != friendId)
        friend.friends = friend.friends.filter(id => id != id)
    } else {
        console.log("else")
        user.friends.push(friendId)
        friend.friends.push(id)
    }

    await user.save()
    await friend.save()
    
    const friends = await Promise.all(
        user.friends.map(id => {
           return User.findById(id)
        })
    )
    
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath
        }
    })
    return res.status(200).json({ friends: formattedFriends })
})