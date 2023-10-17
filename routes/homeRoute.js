import express from "express";

const homeRoute = express.Router();

homeRoute.get("/", (req, res) => {
    res.send("This route is working completely fine");
});

export default homeRoute;