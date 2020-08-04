const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const colors = require("colors");

// Load ENV vars
dotenv.config({ path: "./config/config.env" });

// connect to DB
connectDB();

// route files
const bootcamps = require("./routes/bootcamps");

const app = express();

// Body parser
app.use(express.json());

//

// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("development"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

// Error middleware handler

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// handle unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //close server and exit process
  server.close(() => process.exit(1));
});
