import asyncHandler from "express-async-handler";
import helperMethods from "../utility/helperMethods.js";
import model from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!helperMethods.hasValidValue(username)) return res.status(422).json("username is required in the payload.");
    if (!helperMethods.hasValidValue(password)) return res.status(422).json("password is required in the payload.");

    const user = await model.getUser(username, password);

    if (helperMethods.isNotEmptyArray(user)) return res.status(200).json({token: helperMethods.generateToken(user)});
    return res.status(401).json("incorrect username and/or password");
  }
  catch (error) {
    return res.status(500).json("An error has occured in login(). Error Message: " + error.message);
  }
});


export {
  login
};
