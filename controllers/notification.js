import Notifications from "../models/Notifications.js";
import Users from "../models/Users.js";
import jwt from "jsonwebtoken";

export const setNotification = async (req, res) => {
    try {




        const token = req.cookies.verificationToken;

        if (!token) {
            res.status(403).json("You are not logged in");
            return;
        }

        const secret = process.env.SECRET

        jwt.verify(token, secret, async (err, user) => {
            if (err) { throw (err); }

            const foundUser = await Users.findById(user.usersId);

            if (!foundUser) { return next(createError(404, "User not Found !")); }

            const newNotification = new Notifications({ ...req.body, userId: user.usersId });


            await newNotification.save().then((result) => {
                res.status(200).json(`Your notification for ${result.medicineName} has been set`);
                return;
            }).catch((error) => {
                res.status(404).json(`Error: ${error.message}`);
                return;
            });

        });



    } catch (err) {
        res.status(404).json("some error occured");
        return;
    }
};