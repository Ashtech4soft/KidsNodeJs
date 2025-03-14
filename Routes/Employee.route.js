// Importing important packages
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const employeeModel = require('../Model/Employee');
const upload = require('../lib/Multer');

// // Configure Multer to save files in the uploads directory
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// To Get List Of Employees
router.get('/', async (req, res) => {
  try {
    const employees = await employeeModel.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch employees", error: err.message });
  }
});

// To Add New Employee (with file upload)
router.post('/addEmployee', upload.single('file'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const filePath = req.file ? `uploads/${req.file.filename}` : null;

    const newEmployee = new employeeModel({
      firstName,
      lastName,
      email,
      phone,
      file: filePath,
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding employee', error: error.message });
  }
});

// To Get Employee Details By Employee ID
router.get('/editEmployee/:id', async (req, res) => {
  try {
    const employee = await employeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching employee details", error: err.message });
  }
});

// To Update The Employee Details
router.post('/updateEmployee/:id', upload.single('file'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const updateData = { firstName, lastName, email, phone };

    if (req.file) {
      updateData.file = `uploads/${req.file.filename}`;
    }

    const updatedEmployee = await employeeModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: 'Employee updated successfully!', updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
});

// To Delete The Employee
router.delete('/deleteEmployee/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid Employee ID' });
    }

    const result = await employeeModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: 'Employee Deleted Successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err.message);
    res.status(500).json({ message: "Unable to delete employee", error: err.message });
  }
});

module.exports = router;
