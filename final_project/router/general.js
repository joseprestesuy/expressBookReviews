const express = require("express");
let books = require("./booksdb.js"); // Import the books data
let isValid = require("./auth_users.js").isValid; // Import the validation function
let users = require("./auth_users.js").users; // Import the users array
const axios = require('axios'); // Axios for making HTTP requests
const public_users = express.Router();

// Endpoint for user registration
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (!isValid) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register the new user (add to users array)
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    // Simulate fetching books data asynchronously
    const bookList = await Promise.resolve(books); // In reality, this could be an external API call
    res.status(200).json(bookList);
  } catch (error) {
    // Handle errors during the data fetch process
    res.status(500).json({ message: "Error retrieving books list", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    // Simulate fetching a book by ISBN asynchronously
    const book = await Promise.resolve(books[isbn]); // Simulated async operation
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // Handle errors during fetching book details
    res.status(500).json({ message: "Error retrieving book details", error: error.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author.toLowerCase();

  try {
    // Simulate fetching books by author asynchronously
    const booksByAuthor = await new Promise((resolve) => {
      let result = [];
      for (let isbn in books) {
        let bookAuthor = books[isbn].author.toLowerCase();
        if (bookAuthor.includes(author)) {
          result.push(books[isbn]);
        }
      }
      resolve(result); // Simulating async operation
    });

    // Return books if found, or an error if no books are found
    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    // Handle errors during fetching books by author
    res.status(500).json({ message: "Error retrieving books by author", error: error.message });
  }
});

// Get book details based on title
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title.toLowerCase();

  try {
    // Simulate fetching books by title asynchronously
    const booksByTitle = await new Promise((resolve) => {
      let result = [];
      for (let isbn in books) {
        let bookTitle = books[isbn].title.toLowerCase();
        if (bookTitle.includes(title)) {
          result.push(books[isbn]);
        }
      }
      resolve(result); // Simulating async operation
    });

    // Return books if found, or an error if no books are found
    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    // Handle errors during fetching books by title
    res.status(500).json({ message: "Error retrieving books by title", error: error.message });
  }
});

// Get book review based on ISBN
public_users.get("/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    // Simulate fetching book reviews asynchronously
    const book = await Promise.resolve(books[isbn]); // Simulated async operation

    // Return reviews if the book and its reviews exist, or return a 404 error if not found
    if (book && book.reviews) {
      res.status(200).json(book.reviews);
    } else {
      res.status(404).json({ message: "No reviews found for this book" });
    }
  } catch (error) {
    // Handle errors during fetching book reviews
    res.status(500).json({ message: "Error retrieving book reviews", error: error.message });
  }
});

/* Version 1.0 of the end points
When i need axios change that
const response = await axios.get('http://example.com/api/books');
const books = response.data;

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Find the book with the matching ISBN
  const book = books[isbn];

  // If the book is found, return the details
  if (book) {
    res.status(200).json(book);
  } else {
    // If the book is not found, return a 404 error
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Retrieve the author from the request parameters
  const author = req.params.author.toLowerCase();

  // Array to hold books by the requested author
  let booksByAuthor = [];

  // Iterate through the books object
  for (let isbn in books) {
    // Convertir el nombre del autor del libro a minúsculas
    let bookAuthor = books[isbn].author.toLowerCase();

    // Verificar si el nombre del autor contiene la cadena buscada
    if (bookAuthor.includes(author)) {
      booksByAuthor.push(books[isbn]);
    }
  }

  //Test1 sin includes function
  // Iterate through the books object
  //for (let isbn in books) {
  //  if (books[isbn].author == author) {
  //    booksByAuthor.push(books[isbn]);
  //  }
  // }

  // If books by the author are found, return the details
  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor);
  } else {
    // If no books by the author are found, return a 404 error
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  // Retrieve the title from the request parameters
  const title = req.params.title.toLowerCase();

  // Array to hold books by the requested author
  let booksByTitle = [];

  // Iterate through the books object
  for (let isbn in books) {
    // Convertir el titulo del libro a minúsculas
    let bookTitle = books[isbn].title.toLowerCase();

    // Verificar si el nombre del titulo contiene la cadena buscada
    if (bookTitle.includes(title)) {
      booksByTitle.push(books[isbn]);
    }
  }

  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found by this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Retrieve the IBSN from the request parameters
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    // Si no se encuentran reseñas, devuelve un error 404
    res.status(404).json({ message: "No reviews found for this book" });
  }
});
*/

// Export the public_users router to use in the app
module.exports.general = public_users;
