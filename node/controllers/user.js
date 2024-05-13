
const passport = require("passport");
const User = require('../models/user');

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ error: "An error occurred" });
            }
            return res.status(200).json({ message: "Login Successful" })
        });
    })(req,res,next)
}
module.exports.logout = async (req, res) => {
    req.logout();
    res.status(200).json({message:"Log out successful"})
}
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        const exitstingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (exitstingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        const newuser = new User({ email, username });
        await User.register(newuser, password);
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred",message:error.message});
    }
}
