const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //console.log("Headers:", req.headers);
  //console.log("Body type:", typeof req.body);
  //console.log("Body:", req.body);
  const { username, password } = req.query;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,10));
});

//get all books in shop-promise Task 10
public_users.get('/all', async function (req, res) {
    try{
        const response = await axios.get('http://localhost:5000/');
        const formattedBooks = JSON.stringify({books: response.data}, null,10);
        return res.status(200).send(formattedBooks);
    } catch (error) {
        return res.status(500).json({message: "Error fetching books", error: error.message});
    }
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
  
//task 11 books based on ISBN with promises
public_users.get('/isbn/:isbn', function (req, res){
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (!books) {
            return reject(new Error("Empty book database"));
        }
        return resolve(books);
    }).then((books)=>{
        const book =books[isbn];
        if (!book) {
            return res.status(404).send("book not found"):
        }
        return res.json(book);
    })
    .catch((err) => res.status(500).send(err.message));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);

  if (filteredBooks.length > 0) {
    return res.status(200).json({ books: filteredBooks});
  } else {
    return res.status(404).json({ message: "No books found for this author"});
  }
});


//task 12 get books by author using axios
//Get books by author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    try {
      const response = await axios.get('http://localhost:5000/');
      const booksData = response.data.books;
  
      const matchingBooks = Object.values(booksData).filter(book => book.author === author);
  
      if (matchingBooks.length > 0) {
        const formattedOutput = JSON.stringify({ booksByAuthor: matchingBooks }, null, 2);
        return res.status(200).send(formattedOutput);
      } else {
        return res.status(404).json({ message: "No books found by this author" });
      }
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json({ books: filteredBooks});
  } else {
    return res.status(404).json({message: "cannot find book with title"});
  }
});

//task 13. get books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    try {
      const response = await axios.get('http://localhost:5000/');
      const booksData = response.data.books;
  
      const matchingTitles = Object.values(booksData).filter(book => book.title === title);
  
      if (matchingTitles.length > 0) {
        const formattedOutput = JSON.stringify({ booksByTitle: matchingTitles }, null, 2);
        return res.status(200).send(formattedOutput);
      } else {
        return res.status(404).json({ message: "No books found with this title" });
      }
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "No reviews found under this book" });
  }
});

module.exports.general = public_users;
