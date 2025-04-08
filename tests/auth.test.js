const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model import karo

const app = express();
app.use(express.json());

// MongoDB connection setup for testing
beforeAll(async () => {
  await mongoose.connect('mongodb+srv://KhadijaTariq:Khajju252522@cluster0.cufnyuq.mongodb.net/mern-auth?retryWrites=true&w=majority&appName=Cluster0JWT_SECRET=myjwtsecret', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the user collection before each test
beforeEach(async () => {
  await User.deleteMany();
});

// Route for signup
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Route for login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

describe('Auth API Tests', () => {
  // Test to check signup functionality
  it('should sign up a new user and return a token', async () => {
    const newUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(newUser);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(newUser.email);
  });

  // Test to check login functionality
  it('should log in an existing user and return a token', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10),
    });
    await user.save();

    const loginUser = {
      email: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginUser);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(loginUser.email);
  });

  // Test to check invalid login
  it('should return an error for invalid credentials', async () => {
    const invalidUser = {
      email: 'wronguser@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe('Invalid credentials');
  });

  // Test to check for user already exists during signup
  it('should return an error if user already exists', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: await bcrypt.hash('password123', 10),
    });
    await user.save();

    const newUser = {
      name: 'Test User',
      email: 'testuser@example.com', // Same email as above
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
