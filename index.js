const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const entryRoute = require("./routes/entry");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinaryConfig = require("./cloudinaryConfig");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5500;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log(" MongoDB is Disconnected");
});

connect();

app.get("/", (req, res) => {
  res.send("hello from coder");
});

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://santhosh-travel-log-app.netlify.app/"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  cors({
    origin: "https://santhosh-travel-log-app.netlify.app/",
    credentials: true,
  })
);

app.use(morgan("common"));

app.get("/get-signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    cloudinaryConfig.api_secret
  );
  res.json({ timestamp, signature });
});
app.use("/api/users", userRoute);
app.use("/api/entries", entryRoute);

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
