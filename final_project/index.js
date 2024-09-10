const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
// Check if there is an authorization object in the session
if (req.session && req.session.authorization) {
    // Extract the accessToken from the session
    let token = req.session.authorization.accessToken;

    // Verify the JWT token
    jwt.verify(token, 'access', (err, user) => {
      if (err) {
        // If the token is invalid or expired, send a 401 Unauthorized response
        return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
      }
      // If token is valid, proceed to the next middleware or route handler
      req.user = user;  // Optionally, you can set req.user to the token payload
      next();
    });
  } else {
    // If no token is found in the session, send a 401 Unauthorized response
    return res.status(401).json({ message: "Please log in." });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
