import { Subscription } from "../models/subscription.models.js"
import { ApiError } from "../utils/ApiError.js"
import Apiresponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {

    // Steps
    // 1. check channel exist
    // 2. avoid self subscribing
    // 3. if subscription exist then delete it
    // 4. else -> create new subscription


    const { channelId } = req.params
    if (!channelId) {
        throw new ApiError(400, "channel not found")
    }

    if (channelId === req.user?._id.toString()) {
        throw new ApiError(400, "You can not subscribed yourself")
    }

    const existingSubscription = await Subscription.findOne(
        {
            subscriber: req.user?._id,
            channel: channelId
        }
    )

    let subscribed;

    if (existingSubscription) {
        await Subscription.deleteOne({ _id: existingSubscription._id });
        subscribed = false;
    } else {
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        });
        subscribed = true;
    }



    return res.status(200).json(
        new Apiresponse(200, { subscribed }, "Toggled subscription status")
    );

})

const getAllsubscribersList = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId) {
        throw new ApiError(400, "channel doesnt exist")
    }

    const subscribers = await Subscription.find(
        {
            channel: channelId
        }
    ).populate("subscriber", "username avatar fullname")

    if (!subscribers) {
        throw new ApiError(400, "No subscribers found")
    }

    return res
        .status(200)
        .json(
            new Apiresponse(200, subscribers, "Subscribers fetched")
        )

})

export {
    toggleSubscription,
    getAllsubscribersList
}