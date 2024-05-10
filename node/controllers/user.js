const User = require('../models/user');

module.exports.createUser = async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({email,username,password});
    await user.save();
}
module.exports.deletUser = async (req, res) => {
    const { id } = req.body;
    await User.findByIdAndDelete(id);
}
module.exports.insertUserTest = async (req, res) => {
   const users =  await User.insertMany(
        { email: "men2ri@mail.com", username: "m2enri", password: "password" },
        { email: "am2arius@mail.com", username: "amar2ius", password: "password" }
   );
    res.json(users);
}
module.exports.getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users );
}