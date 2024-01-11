const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post('/customer/login', (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // Check if the username exists and the password is correct
    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(401).send('Invalid username or password.');
    }

    // Create a JWT token for the user
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    // Send the JWT token as a response
    res.json({ token });
});
;

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
