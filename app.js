// Load environment variables from .env
require("dotenv").config();

// Import core modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const exphbs = require("express-handlebars");

// Import route handlers
const electricRouter = require("./routes/electric_index");
const gasRouter = require("./routes/gas_index");
const adminRouter = require("./routes/admin");

// Import models
const CustomerModel = require("./models/CustomerModel");

// Initialize app
const app = express();

// Connect to MongoDB (local MongoDB Compass URI from .env)
const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB Error: Failed to connect");
    console.error(err);
    process.exit(1);
  }
};

db();

// View engine setup (Handlebars)
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "layout",
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", ".hbs");

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());

// Home route
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Route handlers
app.use("/admin", adminRouter);
app.use("/electric", electricRouter);
app.use("/gas", gasRouter);

// Create new customer via POST
app.post("/customer", async (req, res) => {
  try {
    const user = new CustomerModel({
      name: req.body.username,
      email: req.body.useremail,
      phone: req.body.userphone,
    });

    const savedUser = await user.save();
    console.log(savedUser);
    res.status(201).json({ message: "Customer added", data: savedUser });
  } catch (err) {
    res.status(500).json({ error: "Error saving customer" });
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).render("error", { message: "Page not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`🚗 App running on http://localhost:${PORT} [ENV=${process.env.NODE_ENV || "development"}]`);
});

module.exports = app;
