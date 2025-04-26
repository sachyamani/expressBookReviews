const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = "secret_key";

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username,password} = req.query;
  if (!(username && password)) {
    return res.status(422).send("username and password required");
  } else if (!authenticatedUser(username,password)){
    return res.status(403).send("invalid credentials");
  }
  const accessToken = jwt.sign({username}, JWT_SECRET, {expiresIn: "1d"});
  req.session.accessToken = accessToken;
  req.session.username = username;
  return res.json({accessToken});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  if (!review){
    return res.status(422).send("Non-empty review query required");
  }
  const username = req.session.username;
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).send("Book not found");
  }
  const previousReview = book.reviews[username];
  book,reviews[username] = review;
  return res.send(previousReview ? "Review updated successfully" : "Review added successfully");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    // Check if user is authenticated
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    const book = books[isbn];
  
    // Check if the user has a review
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "No review found for this user on the given book." });
    }
  
    // Delete the user's review
    delete book.reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
