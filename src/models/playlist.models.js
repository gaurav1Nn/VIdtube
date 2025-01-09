
import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [ // array
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: { // single owner no need of array
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true})



export const Playlist = mongoose.model("Playlist", playlistSchema)