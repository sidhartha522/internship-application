const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = 3001;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dui9chgpb',
  api_key: '366634852469368',
  api_secret: 'OAsNppLiiR_xZuv64-P3D3SwXPI'
});

// Middleware for session management (must be before routes)
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads (using memory storage for direct cloud upload)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Google Sheets configuration
const SPREADSHEET_ID = '1_6pIks1iiaz92Vs2Rh2_iMe0nmmkNDfPe4QR4q3OcUY'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Sheet1'; // Replace with your sheet name

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Cloudinary upload function
async function uploadToCloudinary(fileBuffer, fileName) {
  try {
    console.log('Uploading file to Cloudinary:', fileName);
    
    // Generate a unique filename to avoid conflicts
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    const uniquePublicId = `resume_${timestamp}_${cleanFileName}`;
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // Use raw type for PDFs
          public_id: uniquePublicId,
          overwrite: true,
          invalidate: true
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
app.post('/submit', upload.single('resume'), async (req, res) => {
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

    // Prepare data for Google Sheets
    const row = [
      new Date().toISOString(),
      formData.firstName || '',
      formData.lastName || '',
      formData.email || '',
      formData.phone || '',
      formData.linkedin || '',
      formData.github || '',
      formData.birthDate || '',
      formData.position || '',
      formData.skill || '',
      formData.availability || '',
      formData.commit || '',
      formData.employment || '',
      resumeInfo || '',
      formData.why || '',
      formData.startDate || '',
      formData.agree || '',
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

// Admin endpoint to get all applications from Google Sheets
app.get('/admin/applications', async (req, res) => {
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
      skill: row[9] || '',
      availability: row[10] || '',
      commit: row[11] || '',
      employment: row[12] || '',
      resume: row[13] || '',
      why: row[14] || '',
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
        
        // For raw resource type, use the full URL with version number
        // Just ensure it uses the correct resource type
        const urlParts = fileId.split('/upload/');
        let downloadUrl = fileId;
        
        if (urlParts.length >= 2) {
          // Keep the version number and path - just ensure correct resource type
          const pathAfterUpload = urlParts[1];
          
          // If URL contains /raw/upload/, use it as-is
          // If URL contains /image/upload/, try raw first
          if (fileId.includes('/image/upload/')) {
            downloadUrl = fileId.replace('/image/upload/', '/raw/upload/');
            console.log('Converted image URL to raw URL:', downloadUrl);
          } else {
            downloadUrl = fileId; // Use the original URL
            console.log('Using original URL:', downloadUrl);
          }
        }
        
        console.log('Attempting to fetch file from URL:', downloadUrl);
        
        let response = await axios({
          method: 'get',
          url: downloadUrl,
          responseType: 'stream',
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 500; // Don't throw on 4xx errors
          }
        });
        
        // If raw type fails with 404, try image type (for old uploads)
        if (response.status === 404 && downloadUrl.includes('/raw/upload/')) {
          const fallbackUrl = downloadUrl.replace('/raw/upload/', '/image/upload/');
          console.log('Trying fallback URL (image type):', fallbackUrl);
          
          response = await axios({
            method: 'get',
            url: fallbackUrl,
            responseType: 'stream',
            maxRedirects: 5,
            validateStatus: function (status) {
              return status >= 200 && status < 500;
            }
          });
        }
        
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
        
        console.log('✅ Successfully fetched PDF from Cloudinary, streaming to client...');
        
        // Set headers to display PDF in browser
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        // Stream the PDF to client
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

    // Replace with environment variables or a secure method in production
    const adminUsername = 'admin';
    const adminPassword = '123';

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

// Middleware to protect admin API routes
app.use('/admin', (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        next();
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
});

// Serve static files (must be after protected routes)
app.use(express.static('.'));

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
  
  console.log(`\n🚀 Server is running and accessible on your network!\n`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${localIP}:${PORT}`);
  console.log(`\n📊 Admin Dashboard:`);
  console.log(`   Local:   http://localhost:${PORT}/admin.html`);
  console.log(`   Network: http://${localIP}:${PORT}/admin.html\n`);
});
