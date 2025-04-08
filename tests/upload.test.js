const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs-extra');  // Import fs-extra for file existence check
const Upload = require('../models/Upload');

const app = express();
app.use(express.json());

// Setup MongoDB connection for testing
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up the uploads collection before each test
beforeEach(async () => {
  await Upload.deleteMany();
});

// Simulate the /upload route
app.post('/api/upload', (req, res) => {
  const email = req.body.email;
  const originalImagePath = req.body.originalImagePath;
  const segmentedImagePath = path.join('segment_output', 'results', originalImagePath);

  const pythonProcess = spawn('C:\\Python313\\python.exe', ['run_model.py', originalImagePath, segmentedImagePath]);

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: 'Python script failed' });
    }

    const uploadRecord = new Upload({
      email,
      originalImage: originalImagePath,
      segmentedImage: segmentedImagePath,
    });

    await uploadRecord.save();

    res.json({ success: true, segmentedImage: segmentedImagePath });
  });
});

// Simulate the /user/:email route
app.get('/api/upload/user/:email', async (req, res) => {
  const { email } = req.params;
  const uploads = await Upload.find({ email });

  if (uploads.length > 0) {
    res.status(200).json(uploads);
  } else {
    res.status(404).json({ message: 'No uploads found for this user' });
  }
});

describe('Upload API Tests', () => {
  // Test image upload functionality
  it('should upload an image and return segmented image path', async () => {
    const testData = {
      email: 'testuser@example.com',
      originalImagePath: 'uploads/test-image.jpg',
    };

    const response = await request(app)
      .post('/api/upload')
      .send(testData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.segmentedImage).toBeDefined();

    // Check if the segmented image exists
    const segmentedImageFilePath = path.join(__dirname, 'segment_output', 'results', testData.originalImagePath);
    const fileExists = await fs.pathExists(segmentedImageFilePath);
    
    expect(fileExists).toBe(true);  // Ensure that the segmented image file exists
  });

  // Test if user uploads are fetched successfully
  it('should fetch uploads for a specific user', async () => {
    const testData = {
      email: 'testuser@example.com',
      originalImagePath: 'uploads/test-image.jpg',
    };

    // Manually adding a test upload to the database
    const upload = new Upload({
      email: testData.email,
      originalImage: testData.originalImagePath,
      segmentedImage: 'segment_output/results/test-image.jpg',
    });
    await upload.save();

    const response = await request(app)
      .get(`/api/upload/user/${testData.email}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].email).toBe(testData.email);
  });

  // Test when no uploads exist for the user
  it('should return an error if no uploads found for the user', async () => {
    const response = await request(app)
      .get('/api/upload/user/nonexistent@example.com');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No uploads found for this user');
  });
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
