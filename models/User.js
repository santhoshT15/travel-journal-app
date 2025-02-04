const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            url: {
                type: String,
                
            },
            public_id: {
                type: String,
                
            },
        }
        ,
        entries: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Entry",
            }
        ],
        
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);
module.exports = {User};