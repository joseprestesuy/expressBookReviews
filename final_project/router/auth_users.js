const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the user exists
const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    //users.some()detiene la busqueda cuamdo encuentra una coincidencia y filter no se detiene
    //some para buscar un elemento yu filter para buscar todos, somo = true, filter = array
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

// Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    //users.some()detiene la busqueda cuamdo encuentra una coincidencia y filter no se detiene
    //some para buscar un elemento y filter para buscar todos, somo = true, filter = array
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  // Check if both username and password were provided in the request body
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Check if the user exists in the system using the isValid function
  if (!isValid(username)) {
    return res.status(401).json({ message: "User not found" });
  }

  // Check if the provided credentials are correct using the authenticatedUser function
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }
  // If the credentials are correct, generate a JWT token for the session
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: username,
      },
      "access",
      { expiresIn: "1h" }
    );
    // Store the generated token in the session under the authorization field
    req.session.authorization = {
      accessToken,
      username,
    };

    // Send a success message indicating the user has logged in successfully
    return res.status(200).send("User successfully logged in");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  // Extract username parameter
  const username = req.session.authorization?.username;

  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the user is logged in
  if (!username) {
    return res.status(401).json({ message: "User is not logged in" });
  }

  // Check if the review and ISBN are provided
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  // Check if the user has already reviewed the book
  if (books[isbn].reviews[username]) {
    // Modify the existing review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    // Add a new review for the user
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
