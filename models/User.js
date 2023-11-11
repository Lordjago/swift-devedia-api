import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        max: 50
    },
    picturePath: {
        type: String,
        default:
            "https://static.thenounproject.com/png/4038155-200.png"
    },
    friends: {
        type: Array,
        default: []
    },
    location: {
        type: String,
        default: "Los Angeles"
    },
    occupation: {
        type: String,
        default: "Footballer"
    },
    viewedProfile: Number,
    impressions: Number
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.__v
        }
    }
},
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', UserSchema)

export default User