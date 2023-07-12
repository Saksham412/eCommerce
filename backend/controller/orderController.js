const Product = require("../models/productModel")
const ErrorHander = require("../utils/errorhander")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Order = require("../models/orderModel")


//Create a new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice,
        paidAt: Date.now(), user: req.user._id
    })

    res.status(201).json({
        success:true,
        order
    })

})


// Get single order
exports.getSingleOrde = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )
    if(!order){
        return next(new ErrorHander("Order Not found with this id!", 404))
    }

    res.status(200).json({
        success:true,
        order
    })
})

//Get logged In user orders
exports.myOrders = catchAsyncErrors(async (req,res,next) => {
    const orders = await Order.find({user: req.user._id})
    
    res.status(200).json({
        success:true,
        orders
    })
})


//Get all orders -- ADMIN
exports.getAllOrders = catchAsyncErrors(async (req,res,next) => {
    const orders = await Order.find()
    

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})


//Update order status -- ADMIN
exports.updateOrder = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHander("Order Not found with this id!", 404))
    }
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHander("Order already delivered!", 400))
    }

   order.orderItems.forEach(async (order)=>{
        await updateStock(order.product, order.quantity)
   })

   order.orderStatus = req.body.status

   if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now()
   }

   await order.save({validateBeforeSave: false})
    res.status(200).json({
        success:true,
    })
})

async function updateStock (id,quantity){
    const product = await Product.findById(id)

    product.Stock-=quantity

    await product.save({validateBeforeSave: false})
}


//Delete order -- ADMIN
exports.deleteOrder = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHander("Order Not found with this id!", 404))
    }

    await order.remove
    res.status(200).json({
        success:true,
    })
})
