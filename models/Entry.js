const mongoose = require("mongoose");

const entryScheme = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        photos: [{
            secure_url: String,
            public_id: String,
        }],
        description: {
            type: String,
            required: true,
        }
    }
)

const Entry = mongoose.model("Entry", entryScheme);
module.exports = Entry;