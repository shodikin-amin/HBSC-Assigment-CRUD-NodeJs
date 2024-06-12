// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userController = require("./controller/usersControllers.js");
const costumerController = require("./controller/customersController.js");
const errorHandler = require("./config/errorHandler.js");
const valid = require("./middleware/validator.js");
const { verifyToken } = require("./middleware/auth.js");

const app = express();
app.use(bodyParser.json());
// route user
app.post("/register", valid.emailUser, userController.register);
app.post("/login", valid.emailUser, userController.login);
app.delete("/user/:id", verifyToken, userController.deleteUser);

// route costumer
app.post("/costumer", valid.emailCostumers, costumerController.create);
app.get("/costumer", costumerController.getAll);
app.get("/costumer/:id", costumerController.getId);
app.put("/costumer/:id", costumerController.update);
app.delete("/costumer/:id", costumerController.del);

app.use(errorHandler);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.get("/", (req, res) => {
  res.send("server aktif");
});