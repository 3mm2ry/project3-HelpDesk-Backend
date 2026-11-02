// imports
const connectToDB = require("./config/db.js");
const express = require("express"); //importing express package
const app = express(); // creates a express application
const dotenv = require("dotenv").config(); //this allows me to use my .env values in this file
const morgan = require("morgan");
const cors = require("cors");

// Routes Import
const authRoutes = require("./routes/auth.routes");
const assetRoutes = require("./routes/asset.route.js");
const commentRoutes = require("./routes/comment.route.js");
const departmentRoutes = require("./routes/department.routes.js");
const locationRoutes = require("./routes/location.routes.js");
const userRoutes = require("./routes/user.routes.js");
const ticketRoutes = require("./routes/ticket.routes.js");

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);
app.use("/assets", assetRoutes);
app.use("/comment", commentRoutes);
app.use("/department", departmentRoutes);
app.use("/location", locationRoutes);
app.use("/user", userRoutes);
app.use("/ticket", ticketRoutes);

// connect to database and listen on Port 3000
async function startServer() {
  const PORT = process.env.PORT || 3000;
  await connectToDB();

  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
}
startServer();
