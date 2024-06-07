// Import PrismaClient dari paket '@prisma/client'
const { PrismaClient } = require("@prisma/client");

// Membuat instance dari PrismaClient
const prisma = new PrismaClient();

// Fungsi untuk membuat entri karyawan baru di database
const createEmployee = async (
  userId,
  firstName,
  lastName,
  position,
  email,
  phoneNumber
) => {
  const employee = await prisma.employee.create({
    data: {
      firstName,
      lastName,
      position,
      email,
      phoneNumber,
      userId,
    },
  });
  return employee;
};

// Fungsi untuk mendapatkan daftar semua karyawan dari database
const getEmployees = async () => {
  return prisma.employee.findMany();
};

// Fungsi untuk mendapatkan detail karyawan berdasarkan ID dari database
const getEmployee = async (id) => {
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    throw new Error("Invalid ID: ID must be a number.");
  }

  return prisma.employee.findUnique({
    where: { id: parsedId },
  });
};

// Fungsi untuk memperbarui data karyawan berdasarkan ID di database
const updateEmployee = async (id, data) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new Error("Invalid ID: ID must be a number");
  }
  return prisma.employee.update({
    where: { id: parsedId },
    data,
  });
};

// Fungsi untuk menghapus karyawan berdasarkan ID dari database
const deleteEmployee = async (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new Error("Invalid ID: ID must be a number");
  }
  return prisma.employee.delete({
    where: { id: parsedId },
  });
};

// Export semua fungsi agar dapat digunakan di modul lain
module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
