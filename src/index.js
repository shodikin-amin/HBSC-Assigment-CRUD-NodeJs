const express = require("express");
const bodyParser = require("body-parser");
const { register, login } = require("./auth/auth.js");
const {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require("./controller/employeeController.js");

const app = express();
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await register(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/employees", async (req, res) => {
  const { userId, firstName, lastName, position, email, phoneNumber } =
    req.body;
  try {
    const employee = await createEmployee(
      userId,
      firstName,
      lastName,
      position,
      email,
      phoneNumber
    );
    res.status(201).json({
      success: "Employee data has been successfully entered",
      employee,
    });
  } catch (error) {
    res.status(400).json({ error: "email alrady exist" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const employees = await getEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await getEmployee(id);
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const employee = await updateEmployee(id, data);
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteEmployee(id);
    res.status(200).json({ success: "data berhasil di hapus" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.get("/", (req, res) => {
  res.send("server aktif");
});
