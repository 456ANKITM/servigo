import Notification from "../models/Notification.js"

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({userId: req.user._id}).sort({createdAt:-1})
        return res.json({success:true, notifications})
    } catch (error) {
        return res.json({success:false, message:"Server Error"})
    }
}

export const markAsRead = async (req, res) => {
    console.log("The request is comming")
    try {
        const userId = req.user._id;
        await Notification.updateMany(
            {userId: userId, isRead:false},
            {$set:{isRead:true}}
        )
        return res.json({success:true, message:"All notifications marked as read"})
    } catch (error) {
        res.json({success:false, message:'Server Error'})
    }
}

export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({userId:req.user._id, isRead:false})
        return res.json({count})
    } catch (error) {
        return res.json({success:false, message:"Server Error"})
    }
}

export const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await Notification.deleteMany({userId});
        return res.json({success:true, message:"All notifications has been deleted"})
    } catch (error) {
        return res.json({success:false, message:"Server Error"})
    }
}



