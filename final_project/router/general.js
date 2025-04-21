const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,10));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; //get the ISBN from URL
  const book = books[isbn]; //find the book by ISBN

  if (book) {
    res.status(200).json(book); //if found return book detail
  } else {
    res.status(404).json({message: "Book or ISBN not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
  try {
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (filteredBooks.length > 0) {
        const response = { data: filteredBooks}; 
        res.json(response.data);
    } else {
        res.status(404).json({message: "no books found for this author"});
    }
  } catch (error) {
        res.status(500).json({message: "Error retreiving books by author", error:error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
