require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 3001;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware for session management (must be before routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
const distPath = path.join(__dirname, 'frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('✅ Serving React app from:', distPath);
} else {
  console.log('⚠️  React build not found. Run: cd frontend && npm run build');
}

// Configure multer for file uploads (using memory storage for direct cloud upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Google Sheets configuration
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = 'Sheet1'; // Replace with your sheet name

// Initialize Google Sheets API
let auth;
if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  // Use credentials from environment variable (for production)
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
} else {
  // Use local key file (for development)
  auth = new google.auth.GoogleAuth({
    keyFile: './service-account-key.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

const sheets = google.sheets({ version: 'v4', auth });

// Cloudinary upload function
async function uploadToCloudinary(fileBuffer, fileName) {
  try {
    console.log('Uploading file to Cloudinary:', fileName);

    // Generate a unique filename to avoid conflicts
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const cleanFileName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    const uniquePublicId = `resume_${timestamp}_${cleanFileName}`;

    // Determine resource type based on file extension
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const resourceType = imageExtensions.includes(fileExtension) ? 'image' : 'raw';

    console.log(`Uploading with resource_type: ${resourceType}, extension: ${fileExtension}`);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          public_id: uniquePublicId,
          overwrite: true,
          invalidate: true,
          access_mode: 'public'
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            console.log('File uploaded successfully to Cloudinary:', result.secure_url);
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

// Endpoint to handle form submission
app.post('/api/submit', upload.single('resume'), async (req, res) => {
  try {
    console.log('Form submission received');
    console.log('Form data:', req.body);
    console.log('File received:', req.file);

    const formData = req.body;
    const resumeFile = req.file;

    let resumeInfo = '';
    if (resumeFile) {
      console.log('Resume file received:', resumeFile.originalname);
      try {
        // Upload to Cloudinary
        const cloudinaryResponse = await uploadToCloudinary(resumeFile.buffer, resumeFile.originalname);
        resumeInfo = cloudinaryResponse.url;
        console.log('Resume uploaded to Cloudinary:', resumeInfo);
      } catch (uploadError) {
        console.error('Failed to upload to Cloudinary:', uploadError);
        throw new Error('Resume upload failed');
      }
    }

    // Prepare data for Google Sheets (match the order of columns)
    const row = [
      new Date().toISOString(),           // Column A: Timestamp
      formData.firstName || '',           // Column B
      formData.lastName || '',            // Column C
      formData.email || '',               // Column D
      formData.phone || '',               // Column E
      formData.linkedin || '',            // Column F
      formData.github || '',              // Column G
      formData.birthDate || '',           // Column H
      formData.position || '',            // Column I
      formData.skill || '',               // Column J: Skill Level
      formData.availability || '',        // Column K
      formData.commit || '',              // Column L: Full-Time Commit
      formData.employment || '',          // Column M: Employment Status
      resumeInfo || '',                   // Column N: Resume URL
      formData.why || '',                 // Column O: Why Join
      formData.startDate || '',           // Column P
      formData.agree || '',               // Column Q
    ];

    // Append data to Google Sheets
    console.log('Appending data to Google Sheets...');
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Q`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [row],
      },
    });
    console.log('Data appended successfully:', result.data);

    res.json({ success: true, message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ success: false, message: 'Error submitting form', error: error.message });
  }
});

// Simple authentication middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  const expectedToken = Buffer.from(
    `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`
  ).toString('base64');

  if (token !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Admin endpoint to get all applications from Google Sheets
app.get('/api/applications', authenticateAdmin, async (req, res) => {
  try {
    console.log('Fetching all applications from Google Sheets...');

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Q`,
    });

    const rows = result.data.values;
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    // Skip header row and convert to objects
    const applications = rows.slice(1).map((row, index) => ({
      id: `app-${index + 1}`,
      timestamp: row[0] || '',
      firstName: row[1] || '',
      lastName: row[2] || '',
      email: row[3] || '',
      phone: row[4] || '',
      linkedin: row[5] || '',
      github: row[6] || '',
      birthDate: row[7] || '',
      position: row[8] || '',
      skillLevel: row[9] || '',
      availability: row[10] || '',
      fullTimeCommit: row[11] || '',
      employmentStatus: row[12] || '',
      resume: row[13] || '',
      whyJoin: row[14] || '',
      startDate: row[15] || '',
      agree: row[16] || '',
    }));

    console.log(`Found ${applications.length} applications`);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Admin endpoint to download resume files
// Admin endpoint to fetch and serve PDF from Cloudinary
app.get('/admin/download/:fileId', async (req, res) => {
  try {
    const fileId = decodeURIComponent(req.params.fileId);
    console.log('Fetching resume:', fileId);

    // If it's a Cloudinary URL, fetch and stream it
    if (fileId.startsWith('http') && fileId.includes('cloudinary.com')) {
      try {
        const axios = require('axios');

        // Extract public_id and generate signed URL
        const urlMatch = fileId.match(/\/upload\/(?:v\d+\/)?(.+)$/);
        let downloadUrl = fileId;

        if (urlMatch && urlMatch[1]) {
          const publicId = urlMatch[1];
          console.log('Extracted public_id for signed URL:', publicId);

          // Generate a signed URL with authentication
          downloadUrl = cloudinary.url(publicId, {
            resource_type: 'image',
            type: 'upload',
            secure: true,
            sign_url: true, // Enable URL signing for authentication
            expires_at: Math.floor(Date.now() / 1000) + 3600 // Valid for 1 hour
          });
          console.log('Generated signed URL:', downloadUrl);
        } else {
          console.log('Using original URL:', downloadUrl);
        }

        let response = await axios({
          method: 'get',
          url: downloadUrl,
          responseType: 'stream',
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 500; // Don't throw on 4xx errors
          }
        });

        if (response.status !== 200) {
          console.error('❌ Failed to fetch file. Status:', response.status);
          console.error('Headers:', response.headers);

          return res.status(response.status).json({
            error: 'File not accessible',
            status: response.status,
            hint: response.status === 401
              ? 'File access denied. The file may be private or requires re-uploading.'
              : 'File not found. Please upload a new application.'
          });
        }

        console.log('✅ Successfully fetched file from Cloudinary, streaming to client...');

        // Detect file type from URL
        const fileExtension = downloadUrl.split('.').pop().toLowerCase();
        let contentType = 'application/pdf';
        let fileName = 'resume.pdf';

        if (fileExtension === 'docx') {
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          fileName = 'resume.docx';
        } else if (fileExtension === 'doc') {
          contentType = 'application/msword';
          fileName = 'resume.doc';
        }

        // Set headers to display in browser (inline for all file types)
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Stream the file to client
        response.data.pipe(res);

      } catch (fetchError) {
        console.error('❌ Error fetching file:', fetchError.message);
        console.error('Status:', fetchError.response?.status);

        res.status(fetchError.response?.status || 500).json({
          error: 'Failed to download file from Cloudinary',
          details: fetchError.message,
          status: fetchError.response?.status
        });
      }
    } else {
      console.error('Invalid or non-Cloudinary URL:', fileId);
      res.status(404).json({ error: 'File not found or invalid URL' });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file: ' + error.message });
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Use environment variables for credentials
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Sidhartha@630022';

  if (username === adminUsername && password === adminPassword) {
    req.session.isAuthenticated = true;
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Middleware to protect admin.html
app.get('/admin.html', (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    next();
  } else {
    return res.redirect('/login.html');
  }
});

// Serve old static files for backward compatibility
app.use('/old', express.static('.'));

// All other routes serve the React app (including /admin route)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Positions Management
const POSITIONS_FILE = path.join(__dirname, 'positions.json');

// Helper to read positions
function getPositions() {
  if (!fs.existsSync(POSITIONS_FILE)) return [];
  try {
    const data = fs.readFileSync(POSITIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading positions file:', err);
    return [];
  }
}

// Helper to write positions
function savePositions(positions) {
  try {
    fs.writeFileSync(POSITIONS_FILE, JSON.stringify(positions, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing positions file:', err);
    return false;
  }
}

// GET all positions (Public)
app.get('/api/positions', (req, res) => {
  const positions = getPositions();
  res.json(positions);
});

// POST new position (Admin protected)
app.post('/api/positions', authenticateAdmin, (req, res) => {
  const positions = getPositions();
  const newPosition = {
    id: Date.now(), // Simple ID generation
    ...req.body
  };

  positions.push(newPosition);

  if (savePositions(positions)) {
    res.json({ success: true, position: newPosition });
  } else {
    res.status(500).json({ error: 'Failed to save position' });
  }
});

// PUT update position (Admin protected)
app.put('/api/positions/:id', authenticateAdmin, (req, res) => {
  const positions = getPositions();
  const id = parseInt(req.params.id);
  const index = positions.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Position not found' });
  }

  // Update position preserving ID
  positions[index] = { ...positions[index], ...req.body, id };

  if (savePositions(positions)) {
    res.json({ success: true, position: positions[index] });
  } else {
    res.status(500).json({ error: 'Failed to update position' });
  }
});

// DELETE position (Admin protected)
app.delete('/api/positions/:id', authenticateAdmin, (req, res) => {
  const positions = getPositions();
  const id = parseInt(req.params.id);
  const filteredPositions = positions.filter(p => p.id !== id);

  if (positions.length === filteredPositions.length) {
    return res.status(404).json({ error: 'Position not found' });
  }

  if (savePositions(filteredPositions)) {
    res.json({ success: true, message: 'Position deleted' });
  } else {
    res.status(500).json({ error: 'Failed to delete position' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let localIP = 'localhost';

  // Find the local network IP
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
      }
    });
  });

  console.log(`\n🚀 Unified Application Server Running!\n`);
  console.log(`   React App:  http://localhost:${PORT}`);
  console.log(`   Network:    http://${localIP}:${PORT}`);
  console.log(`\n📊 Admin Dashboard:`);
  console.log(`   Local:      http://localhost:${PORT}/admin`);
  console.log(`   Network:    http://${localIP}:${PORT}/admin\n`);
});
