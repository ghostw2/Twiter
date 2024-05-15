
const passport = require("passport");
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username
    };
    const token = jwt.sign(payload,"my_secret_key_123" , { expiresIn: '1h' })
    return token;
}


module.exports.login = (req, res, next) => {
    
    User.findOne({ username: req.body.username }).then(user => {
        if (!user) {
            return res.json({
                success: false,
                message: "User not found."
            });
        } 
        if (!bcrypt.compare(user.password, req.body.password)) { 
            return res.json({
                success: false,
                message: "Wrong password."
            });
        }
        const token = generateToken(user);
        return res.json({
            success: true,
            message: "logged in successfull",
            data: {
                "user": {
                    "username": user.username,
                    "email": user.email
                },
                "token": "bearer " + token
            }
        });
    })
    
}
module.exports.logout = async (req, res) => {
    req.logout();
    res.status(200).json({message:"Log out successful"})
}
module.exports.register = async (req, res, next) => {
    
    const { email, username, password } = req.body;

    const exitstingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (exitstingUser) {
        return res.status(400).json({ error: 'Username or email already exists' });
    } 
    const hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    const newuser = new User({ email:email, username:username,password: hash });

    console.log(newuser);
    await newuser.save()
        .then(() => {
        return res.status(201).json({ message: "User registered successfully" });
        }).catch(error => {
        return res.status(500).json({ error: "An error occurred", message: error.message });
        });
        
    }