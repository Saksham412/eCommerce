const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next) => {
    const {token} = req.cookies

    if(!token){
        return next(new ErrorHander("Please Login to access", 401))
    }

    const decocdeData = jwt.verify(token,process.env.JWT_SECRET)

    req.user = await User.findById(decocdeData.id)

    next()
})

//Authorisation - ADMIN
exports.authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHander(`Role: ${req.user.role} not allowed to access this resource`,403))
        }
        next()
    }
}
