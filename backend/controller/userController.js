const ErrorHander = require("../utils/errorhander")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const User = require("../models/userModel")
const sendToken = require("../utils/jwtToken")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")



//Register a User

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sampleavtarid",
      url: "profilepic"
    },
  })

  sendToken(user, 201, res)
})

//Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHander("Please enter your credentials!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid credentials!", 401))
  }

  const isPasswordMatching = await user.comparePassword(password)

  if (!isPasswordMatching) {
    return next(new ErrorHander("Invalid credentials!", 401))
  }


  sendToken(user, 200, res)
})

//LogOut
exports.logout = catchAsyncErrors(async (req, res, next) => {

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Logged Out"
  })
})

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});


// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
 
  const newUserData = {
    name:req.body.name,
    email:req.body.email
  }

  const user = await User.findById(req.user.id);
  
  await user.updateOne(newUserData, {
    new:true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success:true,
    user
  })
});

//Get all user - admin
exports.getUsers = catchAsyncErrors(async (req, res, next) =>{
  const users = await User.find()

  res.status(200).json({
    success:true,
    users
  })
})


//Get single user - admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) =>{
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHander(`User does not exist with id: ${req.params.id}`))
  }

  res.status(200).json({
    success:true,
    user
  })
})


// Update User - ADMIN
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
 
  const newUserData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHander(`User not present with id: ${req.params.id}`))
  }
  await user.updateOne(newUserData, {
    new:true,
    runValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    success:true,
    user
  })
});


// Delete User - ADMIN
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
 
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHander(`User not present with id: ${req.params.id}`))
  }
  await user.deleteOne()
  res.status(200).json({
    success:true
  })
});