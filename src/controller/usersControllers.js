const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        msg: "Validation error",
        success: false,
        errors: errors.array(),
      });
    }
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.send({
      succes: true,
      messege: "Register Successfull",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User Not Found");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    await prisma.user.update({
      where: { id: user.id },
      data: { token: token },
    });

    const getUpdateUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    res.send({
      success: true,
      message: "Login Succeessful",
      user: getUpdateUser,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const existing = await prisma.user.findMany({ where: { id: userId } });
    if (existing.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        msg: "Validation error",
        success: false,
        errors: errors.array(),
      });
    }
    const { id } = req.params;
    const { name, email, password } = req.body;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(404).json({ message: "Invalid User Id" });
    }

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return res.status(404).json({ error: "User id not found" });
    }

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, password },
    });

    res.status(200).json({
      success: true,
      message: "User Update Successfully",
      user: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).send({
      success: true,
      message: "Get All User Succcesfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

const getId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(404).json({ messege: "User Id invalid" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ messege: "User not found" });
    }

    res.status(200).json({
      succes: true,
      message: "Get User Successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  deleteUser,
  update,
  getAll,
  getId,
};
