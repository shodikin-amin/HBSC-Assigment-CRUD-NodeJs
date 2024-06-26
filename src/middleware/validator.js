const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const emailUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        throw new Error("Email already in use");
      }
      return true;
    }),
];

const emailCostumers = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (email) => {
      const costumer = await prisma.costumers.findUnique({ where: { email } });
      if (costumer) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone Number id reuired")
    .isMobilePhone("id-ID")
    .withMessage("Invalid Phone Number Inonesia"),
];

module.exports = { emailUser, emailCostumers };
