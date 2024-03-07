const express = require("express");
const morgan = require("morgan");
const app = express();
const dbConnect = require("./dbConnect");
const authRouter = require("./Routes/authRouter");
const postRouter = require("./Routes/postRouter");
const userRouter = require("./Routes/userRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary");

//Middleware for all

app.use(express.json({limit:"10mb"}));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
cloudinary.config({
  cloud_name: "dtrwbpv82",
  api_key: "274178244569374",
  api_secret: "3rC0BJB3k0wMQ9wFfBHqz_oabf8",
});
app.get("/", (req, res) => {
  res.send("ok tested");
});
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
dbConnect();
app.listen(4000, () => {
  console.log("listening on port 4000");
});
