import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videofile: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        duration: {
            type: Number, //cloudinary gave all information when you upload any file
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        likes: {
            type: Number,
            default: 0
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        viewedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: []
            }
        ]

    },
    { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);