import Users from "../models/Users.js";

export const registerUser = async (req, res) => {
    try {

        const newUser = new Users(req.body);

        const savedUser = await newUser.save();

        res.json(`Hey! ${savedUser.name} your Account has been created`);


    } catch (err) {
        console.log(err);
        return;
    }
};