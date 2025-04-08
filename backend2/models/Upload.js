const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  email: { type: String, required: true},  // Use email as a unique identifier
  originalImage: { type: String, required: true },
  segmentedImage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', UploadSchema);
// const mongoose = require('mongoose');

// const UploadSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   originalImage: { type: String, required: true },
//   segmentedImage: { type: String, required: true },
//   woundArea: { type: Number }, // ✅ Add this line
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Upload', UploadSchema);
