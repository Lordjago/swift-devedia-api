import express from 'express'

import {
    getUser,
    getUsersFriends,
    addRemoveFriend
} from '../controllers/users.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router()

router.get('/:id', verifyToken, getUser)

router.get('/:id/friends', verifyToken, getUsersFriends)

router.patch('/:id/:friendId', verifyToken, addRemoveFriend)

export default router