import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js"
import { FileUploader } from "../utils/cloudinary.js";
import Apiresponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation of data
    // validation for not empty
    // if already user exists: username,email
    // check for images, check for avatar
    // upload them in cloudinary
    // check if images uploaded in cloudinary , avatar
    // create user object in db
    // remove password and refreshtoken from response
    // return res

    const { fullname, email, username, password } = req.body;

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "all fields are required");
    }

    if (!email.includes("@")) {
        throw new ApiError(400, "Enter valid email address");
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password contain minimum 8 characters");
    }


    // we can use $ sugn for condition and or nor 
    //  we can use findone method that return the first user that satisfied condition 
    const existedUser = await User.findOne({
        $or: [{ username:username?.toLowerCase() }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "Username or email already exists");
    }

    console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0].path;
    // const coverImageLocalPath = req.files?.coverImage[0].path;

    // check if coverfile is there or not
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverImageLocalPath = req.files.coverimage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required");
    }

    // Server takes time for upload the image even though we have use asyncHandler we have use inside async function because we want to not continue untill this process is completed so thats why we have use await


    const avatar = await FileUploader(avatarLocalPath);
    const CoverImage = await FileUploader(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "avatar is required");
    }

    // Create User Object In Db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: CoverImage?.url || "", //if not available then ""
        username: username.toLowerCase(),
        email,
        password
    })


    // check whether user is created or not
    // if exist then we can use findById method that can use to find user from _id by defauld generated by mongo db
    // select method by default select all field if you dont want any field from it than you can write -sign and after that field name

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while Registering User")
    }

    // if user is created then return response

    res.status(201).json(
        new Apiresponse(200, createdUser, "User Registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {


    const generateAccessTokenrefreshToken = async (userId) => {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;

        await user.save({
            validateBeforeSave: false
        })

        return { accessToken, refreshToken };

    }

    // Steps
    // take username or email and password from req.body
    // check the user for username or email
    // check the password
    // accessToken and refreshToken
    // send data with cookie

    const { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "username or email required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User doesnt exist")
    }

    const isValidPassword = await user.isCorrectPassword(password);

    if (!isValidPassword) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessTokenrefreshToken(user._id);

    // now this user has some unnecessary fields that we dont want to send to user like password and refreshToken so in this user refreshToken is empty now either we modify this user or we can again use query

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // Send data Through cookies
    // option object ensure that cookie is only modified from server side using httpOnly 

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(200, {
                user: loggedInUser, refreshToken, accessToken,

            },
                "User Loggedin successfully")
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    // Steps
    // first of all remove all cookies
    // and also refreshToken
    // Here we cannot find user by id because we dont have any field that identify particular user for logout so we can create our own middleware for verify User


    // Now if middleware is executed completely that means now logoutUser has access of req.user so we can easily find user by req.user._id

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new Apiresponse(200, {}, "logged out"))
})

// We can use this method to refresh the access token
// Generally access token has short time if it expired than the session will be end user get 401 request
// so we cannot said to user that login again instead we can compare user refreshtoken to db refreshToken if match we can start new session so it is end point for accessToken
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError()
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "token is expired or used")
        }

        const { accessToken, newrefreshToken } = await generateAccessTokenrefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new Apiresponse(
                    200,
                    { accessToken, refreshToken: newrefreshToken },
                    "AccessToken successfully refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isCorrectPassword(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect")
    }

    user.password = newPassword
    user.save({
        validateBeforeSave: false
    })

    return res
        .status(200)
        .json(new Apiresponse(200, {}, "Password Updated"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new Apiresponse(200, req.user, "Current User found")
        )
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body
    if (!(fullname || email)) {
        throw new ApiError(401, "Provide Fullname or email")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200)
        .json(new Apiresponse(200, user, "User details Updated"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    console.log(req.file);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await FileUploader(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new Apiresponse(200, user, "Avatar updated")
        )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverLocalPath = req.file?.path;

    if (!coverLocalPath) {
        throw new ApiError(400, "CoverImage is missing")
    }

    const coverImage = await FileUploader(coverLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "CoverImage is missing")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverimage: coverImage.url
            }
        }, { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new Apiresponse(200, user, "CoverImage Updated"))
})

const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username) {
        throw new ApiError(401, "Username is missing")
    }

    // Write aggregate pipelines for
    // getting subscribers count and whom i subscribe or how many channel i subscribed

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribercount: {
                    $size: "$subscribers"
                },
                subscribedTocount: {
                    $size: "$subscribedTo"
                },
                issubscibed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                email: 1,
                avatar: 1,
                coverimage: 1,
                subscribercount: 1,
                subscribedTocount: 1,
                issubscibed: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(401, "Channel doesnot exist")
    }

    console.log(channel);

    return res
        .status(200)
        .json(new Apiresponse(200, channel[0], "User profile fetched"))

})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {

            // At this rate all the information of video documents are stored in watchHistory but Owner information aint coming so for that we have to add subpipelines for it
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",

                            // Now all data will come from user model but we want to provide only selected field so we write anothe subpipeline for projection of fields
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        avatar: 1,
                                        username: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(new Apiresponse(200, user[0].watchHistory, "WatchHistory Fetched"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateUserDetails,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage,
    getUserProfile,
    getWatchHistory
};