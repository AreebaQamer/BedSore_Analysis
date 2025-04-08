const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const History = require('../models/History');  // Model import karo
const path = require('path');
const app = express();
const multer = require('multer');

// MongoDB connection setup for testing
beforeAll(async () => {
  await mongoose.connect('mongodb+srv://KhadijaTariq:Khajju252522@cluster0.cufnyuq.mongodb.net/mern-auth?retryWrites=true&w=majority&appName=Cluster0JWT_SECRET=myjwtsecret', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the history collection before each test
beforeEach(async () => {
  await History.deleteMany();
});

// Mocking multer to avoid file system dependencies
jest.mock('multer', () => {
  const mockMulter = jest.fn(() => ({
    single: () => (req, res, next) => next(),
  }));
  return mockMulter;
});

// Route to be tested
app.use(express.json());

// History POST route for uploading PDF
app.post('/api/history/upload', async (req, res) => {
  try {
    const { email, pdfFile } = req.body;

    const history = new History({
      email,
      pdfFile,
    });

    await history.save();
    res.status(200).json({ message: 'PDF uploaded and history saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// History GET route for fetching records
app.get('/api/history/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const history = await History.find({ email: userEmail });

    // Append the correct full path for the PDF
    const updatedHistory = history.map(item => ({
      ...item._doc,
      fullPath: path.join('uploads/pdfs', item.pdfFile),
    }));

    res.json(updatedHistory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

describe('History API Tests', () => {
  // Test to check PDF upload
  it('should upload PDF and save history', async () => {
    const response = await request(app)
      .post('/api/history/upload')
      .send({
        email: 'testuser@example.com',
        pdfFile: 'testfile.pdf',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('PDF uploaded and history saved');

    const history = await History.find({ email: 'testuser@example.com' });
    expect(history.length).toBe(1);
    expect(history[0].pdfFile).toBe('testfile.pdf');
  });

  // Test to check fetching history by email
  it('should fetch history for a specific email', async () => {
    const newHistory = new History({
      email: 'testuser@example.com',
      pdfFile: 'sample.pdf',
    });
    await newHistory.save();

    const response = await request(app).get('/api/history/testuser@example.com');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].email).toBe('testuser@example.com');
    expect(response.body[0].pdfFile).toBe('sample.pdf');
    expect(response.body[0].fullPath).toBeDefined();
  });

  // Test for when history is not found
  it('should return empty array if no history exists for an email', async () => {
    const response = await request(app).get('/api/history/nonexistent@example.com');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
