import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  department: true,
  graduationYear: true,
  classDivision: true,
  rollNumber: true,
  role: true,
  itemsReported: true,
  joinedDate: true,
};
// ... (Register and Login routes keep existing logic)
// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, department, graduationYear, classDivision, rollNumber } = req.body;

    if (!email.endsWith('@ves.ac.in')) {
      return res.status(403).json({ message: 'Access restricted to @ves.ac.in email addresses only.' });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        department,
        graduationYear,
        classDivision,
        rollNumber
      }
    });

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.endsWith('@ves.ac.in')) {
      return res.status(403).json({ message: 'Access restricted to @ves.ac.in email addresses only.' });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get currently logged-in user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Fetch user without password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: publicUserSelect
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User found but not found in DB' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get public profile of a user by id
router.get('/user/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: publicUserSelect
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
