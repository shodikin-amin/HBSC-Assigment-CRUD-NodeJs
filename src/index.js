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
app.get("/user/:id", verifyToken, userController.getId);
app.get("/user", verifyToken, userController.getAll);
app.put("/user/:id", verifyToken, valid.emailUser, userController.update);

// route costumer
app.post(
  "/costumer",
  verifyToken,
  valid.emailCostumers,
  costumerController.create
);
app.get("/costumer", verifyToken, costumerController.getAll);
app.get("/costumer/:id", verifyToken, costumerController.getId);
app.delete("/costumer/:id", verifyToken, costumerController.del);
app.put(
  "/costumer/:id",
  verifyToken,
  valid.emailCostumers,
  costumerController.update
);

app.use(errorHandler);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.get("/", (req, res) => {
  res.send("server aktif");
});
