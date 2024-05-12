const asynchandler = require('express-async-handler');
const defineUserModel=require('../datamodels/UserModel')
const sequelize=require('../dbconfig/dbconnection')
const User=defineUserModel(sequelize)
const jwt = require('jsonwebtoken')
const{ addToBlacklist}= require('../tokenBlacklist')
const bcrypt=require('bcrypt')

const register = asynchandler(async (req, res) => {
  const { username, name, password, email } = req.body;


      // Check if all required fields are provided
      if (!username || !password || !name || !email) {
          res.status(400);
          throw new Error('All fields are mandatory');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          res.status(400);
          throw new Error('Invalid email format');
      }

      // Check if the username is already taken
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
          res.status(409);
          throw new Error('Username already taken');
      }

      const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            res.status(409);
            throw new Error('Email already registered');
        }      

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user record in the database
      const newUser = await User.create({
          username,
          name,
          password: hashedPassword,
          email
      });

      // Respond with success message
      res.status(200).json({
          id: newUser.id,
          msg: 'Registration success',
      });
})

const login = asynchandler(async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if username and password are provided
      if (!username || !password) {
          res.status(400);
          throw new Error('All fields are mandatory');
      }

      // Find the user by username
      const user = await User.findOne({ where: { username } });
      // Check if user exists and password is correct
      if (user && (await bcrypt.compare(password, user.password))) {
          // Generate JWT token
          const accessToken = jwt.sign(
              {
                  user: {
                      username: user.username,
                      id: user.id // Optionally include other user details in the token
                  }
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '30m' }
          );

          // Respond with token and success message
          res.status(200).json({
              token:accessToken,
              username: user.name,
              msg: 'Login successful'
          });
      } else {
          res.status(401).json({ message: 'Invalid username or password' });
      }

  } catch (error) {
      // Handle errors
      console.error('Error logging in:', error.message);
      res.status(500).json({ error: error.message });
  }
})

const logout = asynchandler(async (req, res) => {
    const token = req.header('Authorization').split(' ')[1]; 
    // Add the token to the blacklist
    addToBlacklist(token)     
    // Respond with success message
    res.status(200).json({ message: 'Logged out successfully' });
})




module.exports = {
    register,
    login,
    logout
};
