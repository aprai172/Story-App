const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const slideRouter = require("./routes/slide");
const HOST = "localhost";
const PORT = 4000;
require("dotenv").config();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "Backend API Server",
    staus: "True",
    time: new Date(),
  });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("bd coonected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRouter);
app.use("/api/slide", slideRouter);
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend Server running on  http://${HOST}:${PORT}`);
});
