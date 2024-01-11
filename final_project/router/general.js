const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required for registration' });
    }
  
    if (userExists(username)) {
      return res.status(409).json({ message: 'Username already exists' });
    }
  
    // If everything is fine, add the new user
    users.push({ username, password });
    res.status(201).json({ message: 'User successfully registered' });
  });
  
  // Function to check if a user already exists
  function userExists(username) {
    return users.some(user => user.username === username);
  }

  public_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Validate username and password
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required for login' });
    }
  
    // Check if the user exists
    const user = users.find(u => u.username === username && u.password === password);
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  
    // Sign in the customer and save user credentials for the session as a JWT
    const accessToken = jwt.sign({ username: user.username }, "access");
  
    // Save the access token to the session
    req.session.authorization = { accessToken };
  
    res.status(200).json({ message: 'Login successful', accessToken });
  });
  
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 10));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if (books[isbn]) {
    res.json(books[isbn]);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorToFind = req.params.author;
    const matchingBooks = [];
  
    for (const isbn in books) {
      if (books[isbn].author === authorToFind) {
        matchingBooks.push(books[isbn]);
      }
    }
  
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({ message: 'Books by the author not found' });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleToFind = req.params.title;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books[isbn].title === titleToFind) {
      matchingBooks.push(books[isbn]);
    }
  }

  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).json({ message: 'Books with the title not found' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbnParam = req.params.isbn;

    // Find the book with the corresponding ISBN
    const book = Object.values(books).find(b => b.isbn === isbnParam);

    if (book) {
        // If the book is found, send its reviews as a response
        const reviewsJSON = JSON.stringify(book.reviews || {}, null, 2);
        
        // Set the Content-Type header to application/json
        res.setHeader('Content-Type', 'application/json');
        
        // Send the JSON response
        res.send(reviewsJSON);
    } else {
        // If the book is not found, send a 404 response
        res.status(404).send('Book not found');
    }
});

module.exports.general = public_users;


