import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async(userId) => {
    try {
       const user = await User.findById(userId)
       const refreshToken = user.generateRefreshToken()
       const accessToken = user.generateAccessToken()

       user.refreshToken = refreshToken
       await user.save({validateBeforeSave: false})

       return {refreshToken, accessToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the Access Token")
    }
}  

const registerUser = asyncHandler (async (req, res) => {
    const {fullName, email, username, password} = req.body
    console.log("email :", email);
    console.log("Request body :", req.body)

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    
    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email and username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0].path
    // const coverImageLocalPath = req.files?.coverImage[0].path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    console.log("Request files: ", req.files)

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    let avatar, coverImage = null;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
    } catch (error) {
        throw new ApiError(500, "Failed to upload avatar");
    }
    
    // Only attempt to upload cover image if a path is provided
    if (coverImageLocalPath) {
        try {
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
        } catch (error) {
            throw new ApiError(500, "Failed to upload cover image");
        }
    }

     const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase(),
     })

     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )

     if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
     }

     return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
     )
})

const loginUser = asyncHandler(async (req, res) => {
    // req.body == data
    // username or email
    // find the user
    // password check 
    // access and refresh token
    // send cookie

    const {email, username, password} = req.body
    if(!username || !email){
        throw new ApiError(400, "Username or password is required");
    }

    const user = await User.findOne({
        $or : [{username},{email}]
    })

    if(!user) {
        throw new ApiError(404, "User does not exist"); 
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect"); 
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpsOnly : true,
        secure : true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user : loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
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
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}