
const passport = require("passport");
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const argon2 = require('argon2');

const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username
    };
    const token = jwt.sign(payload,process.env.BACK_END_SECRET_KEY , { expiresIn: '1h' })
    return token;
}


module.exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found."
            });
        }
        
        const pass_match = await argon2.verify(user.password, req.body.password);
        console.log(pass_match);
        if (!pass_match) { 
            return res.json({
                success: false,
                message: "Wrong password."
            });
        }
        
        const token = generateToken(user);
        
        return res.status(200).json({
            data: {
                success: true,
                user: {
                    username: user.username,
                    email: user.email
                },
                token: "bearer " + token
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login."
        });
    }
};
module.exports.logout = async (req, res) => {
    req.logout();
    res.status(200).json({message:"Log out successful"})
}
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
    
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
    
        
        const hash = await argon2.hash(password);
    
        const newUser = new User({ email, username, password: hash });
    
        await newUser.save()
          .then(() => {
            return res.status(201).json({ message: "User registered successfully" });
          })
          .catch(error => {
            return res.status(500).json({ error: "An error occurred", message: error.message });
          });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred", message: error.message });
      }
    }