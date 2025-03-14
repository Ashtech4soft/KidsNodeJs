// Importing important packages
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs')

// Import user model
const userModel = require('../Model/User');
const Community = require('../Model/Community');
const Charity = require('../Model/Charity');
const Supplier = require('../Model/Supplier');
const upload = require('../lib/Multer');
const { userToken, CharityToken, supplierToken } = require('../utils/TokenGen');
const { protuctRoute } = require('../middlewares/protuctRoute');
require('dotenv').config()

// Serve the uploads directory as a static resource
// Configure Multer to save files in the uploads directory
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// To Get List Of Users
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.find();
    console.log(users);

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to fetch users", error: err.message });
  }
});

// To Add New user (with file upload)
router.post('/addUser', upload.single('file'), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const filePath = req.file ? `uploads/${req.file.filename}` : null;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      file: filePath,
    });

    await newUser.save();
    res.status(200).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding user', error: error.message });
  }
});

router.post('/addSupplier', upload.single('file'), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const filePath = req.file ? `uploads/${req.file.filename}` : null;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Supplier({
      name,
      email,
      phone,
      password: hashedPassword,
      file: filePath,
    });

    await newUser.save();
    res.status(200).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding user', error: error.message });
  }
});

router.post('/addCharity', upload.single('file'), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const filePath = req.file ? `uploads/${req.file.filename}` : null;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new Charity({
      name,
      email,
      phone,
      password: hashedPassword,
      file: filePath,
    });

    await newUser.save();
    res.status(200).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding user', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (role === 'admin') {
      // Static check for admin credentials
      // const admin = await 
      // const passMatch = await bcrypt.compare(password,admin.pass)
      if (email === 'admin@gmail.com' && password === 'admin') {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '3d' });
        return res.status(200).json({ success: true, token, role: 'admin' });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid Admin Credentials' });
      }

    } else if (role === 'user') {
      console.log(req.body)

      // Check for user or supplier in the database
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }

      const passMatch = await bcrypt.compare(password, user.password)
      console.log(passMatch);

      if (!passMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const token = userToken(user._id, res)
      console.log(token);

      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: role,
        token: token,
        file: user.file,
      })
    } else if (role === 'charity') {
      // Check for user or supplier in the database
      const user = await Charity.findOne({ email });
      console.log(user);


      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }
      const passMatch = await bcrypt.compare(password, user.password)
      if (!passMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
      const token = CharityToken(user._id, res)
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: role,
        token: token
      })
    } else if (role === 'supplier') {
      const user = await Supplier.findOne({ email })
      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }
      const passMatch = await bcrypt.compare(password, user.password)
      if (!passMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
      const token = supplierToken(user._id, res)
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: role,
        token: token

      })
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/userProfile', protuctRoute, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select('-password');
    console.log(user);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
  }
})


// router.get('/updateuserProfile', upload.single('file'), protuctRoute, async (req, res) => {
//   try {
//     const user = await userModel.findById(req.user.userId);
//     const update = {}
//     console.log(user);

//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//   }
// })

// To Get Employee Details By ID
router.get('/editEmployee/:id', async (req, res) => {
  try {
    const employee = await userModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching employee details", error: err.message });
  }
});

// To Update Employee Details
router.put('/updateuserProfile', protuctRoute, upload.single('file'), async (req, res) => {
  const userId = req.user.userId
  try {
    const { name, email, phone } = req.body;
    const updateData = {};

    // If a new file is uploaded, update the file path
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    console.log(req.file);

    if (req.file) {

      updateData.file = `uploads/${req.file.filename}`;
    }

    await userModel.findByIdAndUpdate(userId, updateData);
    res.status(200).json({ message: 'Employee updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }

});

// To Delete Employee
router.delete('/deleteEmployee/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ message: 'Invalid Employee ID' });
    }

    // Delete the employee
    const result = await userModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({ message: "Employee not found" });
    }

    res.status(200).json({ message: 'Employee Deleted Successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err.message);
    res.status(500).send({ message: "Unable to delete employee", error: err.message });
  }
});

module.exports = router;