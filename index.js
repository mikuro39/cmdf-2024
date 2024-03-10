// const loginForm = document.getElementById("login-form");
// const loginButton = document.getElementById("login-form-submit");
// const loginErrorMsg = document.getElementById("login-error-msg");

// loginButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     const email = loginForm.email.value;
//     const password = loginForm.password.value;

//     console.log(email);
//     console.log(password);

//     if (email === "stempower@gmail.com" && password === "stempowerher") {
//         window.location.replace("./profile.html");
//         // alert("You have successfully logged in.");
//         // location.reload();
//     } else {
//         alert("Invalid login")
//     }
// })

const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/userModel");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

app.use(session({
    secret: 'asnbmiqlnpoejpeklongpsgebns', 
    resave: false,
    saveUninitialized: false
}));

// Auth middleware
function requireAuth(req, res, next) {
    if (req.session.isLoggedIn) {
        // User is authenticated
        next();
    } else {
        // User is not authenticated
        res.redirect("/login.html");
    }
}

// Connect to MongoDB
const port = 8000;
const dbUrl = "mongodb+srv://admin:M2D8rgEdEKIcuuhs@rest.ax4svnf.mongodb.net/?retryWrites=true&w=majority&appName=REST"

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", () => console.log("Error in connecting to MongoDB"));
db.once("open", () => console.log("Successfully connected to MongoDB"));


// Route for user registeration
app.post("/register", async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists. Please proceed to login");
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({ name, email, password: hashedPassword });

        res.status(201).send("User registered successfully");

     } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal Server Error");
    }

});

// Route for login
app.post("/login", async (req, res) => {
    try {
        // Extract data from request
        const { email, password } = req.body;

        // Find user in database by email (unique field)
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Login unsuccessful");
            return res.status(400).send("Invalid password and/or email");
        }

        console.log("Login successful");

        // Set isLoggedIn flag in session to indicate that the user is logged in
        req.session.isLoggedIn = true;

        // Redirect the user to the profile page after successful login
        res.redirect("profile.html");


    } catch (error) {
        res.status(500).send("An error occured while logging in");
    }
    
});

// Route for logout
app.get("/logout", (req, res) => {
    console.log("Session before logout:", req.session);

    // Destroy session to log user out
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Error logging out");
        }
        console.log("Session after logout:", req.session);

        // Redirect user to login page after logging out
        res.redirect("login.html");
    });
});

app.get(["/profile", "/profile.html"], requireAuth, (req, res) => {
    res.setHeader('Cache-Control', 'no-store');

    // Render the profile page
    res.sendFile(__dirname + "/public/profile.html");
});

app.get("/", (req, res) => {
    // Render home page
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});