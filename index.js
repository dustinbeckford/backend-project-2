/** @format */

const express = require("express");
const app = express();
const port = 3001;
const bcrypt = require("bcrypt");
const bodyparser = require("body-parser");
const { name } = require("ejs");
const authentication = require("./routes/authentication/authentication");
const ownerRoutes = require("./routes/carownerroutes");
const eventRoutes = require("./routes/eventroutes");
const carRoutes = require("./routes/carroutes");
const carOwnerEvents = require("./routes/eventcarowners");

// Middleware
app.use(bodyparser.urlencoded({ extended: false }));

app.set("views", "./views");
app.set("view engine", "ejs");
// // Log request middleware
// function logRequest(req, res, next) {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// }
app.use("/owner", ownerRoutes);
app.use("/car", carRoutes);
app.use("/events", eventRoutes);
app.use("/carownerevents", carOwnerEvents);
app.use("/auth", authentication);
app.use(express.static(__dirname + "/public"));
app.use("/logout", authentication);

app.get("/login", (req, res) => {
	res.render("login/login");
});
app.get("/signup", (req, res) => {
	res.render("signup/signup");
});

app.get("/logout", (req, res) => {
	res.render("logout/logout");
});

// Start the server
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
