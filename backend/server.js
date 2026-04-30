const dotenv = require('dotenv');
dotenv.config(); // MUST be first — loads .env before any module reads process.env

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('./config/cloudinary');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer: use memory storage — Cloudinary handles persistence
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// Helper: stream a buffer to Cloudinary and return the result
const uploadToCloudinary = (buffer, folder = 'woreda05') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// Upload Endpoint — returns Cloudinary secure URL + size
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    const sizeMB = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
    res.status(200).json({
      url:       result.secure_url,
      public_id: result.public_id,
      size:      sizeMB,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
});

// Basic route to test server
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Woreda 05 Backend is running!' });
});

// Import Routes
const announcementRoutes = require('./routes/announcementRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceDetailsRoutes = require('./routes/serviceDetailsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/service-details', serviceDetailsRoutes);
app.use('/api/messages', messageRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

