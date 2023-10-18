import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

export const registerUser = async (req, res) => {
    try {
        const saltRounds = Number(process.env.SALT);

        const { password, ...otherDetails } = req.body;


        const hashedPassword = bcrypt.hashSync(password, saltRounds);


        const newUser = new Users({ ...otherDetails, password: hashedPassword });

        const savedUser = await newUser.save();

        res.json(`Hey! ${savedUser.name} your Account has been created`);


    } catch (err) {
        res.status(404).json("an error occured");
        return;
    }
};

export const loginUser = async (req, res) => {
    try {
        const foundUser =await Users.findOne({ email: req.body.email });

        if (!foundUser) {
            res.status(404).json("No such user found");
            return;
        }


        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
            var token = jwt.sign({ userId: foundUser._id }, process.env.SECRET);

            res.cookie("verificationToken", token).status(200).json(`welcome ${foundUser.name}, you can set your medicine reminders now`);
            return;
        }
        else {
            res.status(403).json("Email Id or password is incorrect");
            return;
        }
    } catch (err) {
        res.status(404).json("an error occured");
        return;
    }
};