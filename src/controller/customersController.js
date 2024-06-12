const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");

const create = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, address } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        msg: "Validation error",
        success: false,
        errors: errors.array(),
      });
    }

    const customer = await prisma.costumers.create({
      data: { fullName, email, phoneNumber, address },
    });

    res.status(201).send({
      success: true,
      message: "Create Successfull",
      customer,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const customers = await prisma.costumers.findMany();

    res.status(200).send({
      success: true,
      message: "Get All Customers Successfull",
      customers,
    });
  } catch (error) {
    next(error);
  }
};

const getId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      return res.status(400).json({ error: "Invalid Customer Id" });
    }

    const customer = await prisma.costumers.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer Id not found" });
    }

    res.status(200).json({
      success: true,
      message: "Get Customer Successful",
      customer,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phoneNumber, address } = req.body;
    const customerId = parseInt(id, 10);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        msg: "Validation error",
        success: false,
        errors: errors.array(),
      });
    }

    if (isNaN(customerId)) {
      return res.status(400).json({ error: "Invalid Customer Id" });
    }

    const customer = await prisma.costumers.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer Id not found" });
    }

    const updatedCustomer = await prisma.costumers.update({
      where: { id: customerId },
      data: { fullName, email, phoneNumber, address },
    });

    res.status(200).json({
      success: true,
      message: "Customer Updated Successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    next(error);
  }
};

const del = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      return res.status(400).json({ error: "Invalid Customer Id" });
    }

    const customer = await prisma.costumers.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer Id not found" });
    }

    const deleteCustomer = await prisma.costumers.delete({
      where: { id: customerId },
    });

    res.status(200).json({
      success: true,
      message: "Customer Delete Successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { create, getAll, getId, update, del };
