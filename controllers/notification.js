import Notifications from "../models/Notifications.js";

export const setNotification = async (req, res) => {
    try {

        const newNotification = new Notifications(req.body);

        const savedNotification = await newNotification.save().then((result) => {
            console.log("notification added : ", result)
        }).catch((error) => {
            res.json(`Error: ${error.message}`);
            return;
        });

        res.json(`Your notification for ${savedNotification.medicineName} has been set`);

    } catch (err) {
        console.log(err);
        return;
    }
};