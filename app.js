const express = require("express");
const authRouter = require("./router/auth");
const followRouter = require("./router/follow");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
//middlewares
app.get("/", (req, res) => {
  res.send("Hi,the API is working.");
});

// For invalid routes
// app.all("*", (req, res) => {
//   res.send(`Requested URL ${req.path} not found`);
// });

// auth router
app.use("/api/v1", authRouter);
// follow router
app.use("/api/v1", followRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`connection succesful  at port ${port}`);
});
