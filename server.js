const express = require("express");

const createError = require("http-errors");
const router = express.Router();
const userRouter = require("./routers/user.router");
const app = express();
require("dotenv").config();
const client = require("./helpers/connections_redis");
// require("./helpers/connections_mongodb");

const PORT_DEFAULT = 3000;
const PORT = process.env.PORT || PORT_DEFAULT;
const prefix = "/api-v1";

client.set("key1", "value");
client.get("key1", (err, value) => {
  if(err) throw createError.BadRequest(err);
});
app.use(express.json());
app.use(`${prefix}/user`, userRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  next(createError.NotFound("This router does not exist"));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
