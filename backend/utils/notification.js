import Notification from "../models/Notification.js";

export const createNotification = async ({
    userId,
    title,
    message,
    type
}) => {
    return await Notification.create({
        userId,
        title,
        message,
        type
    })
}