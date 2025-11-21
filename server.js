const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Google Sheets configuration
const SPREADSHEET_ID = '1_6pIks1iiaz92Vs2Rh2_iMe0nmmkNDfPe4QR4q3OcUY'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Sheet1'; // Replace with your sheet name

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: './service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Endpoint to handle form submission
app.post('/submit', upload.single('resume'), async (req, res) => {
  try {
    const formData = req.body;
    const resumeFile = req.file;

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
      resumeFile ? resumeFile.filename : '',
      formData.why || '',
      formData.startDate || '',
      formData.agree || '',
    ];

    // Append data to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Q`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [row],
      },
    });

    res.json({ success: true, message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ success: false, message: 'Error submitting form', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
