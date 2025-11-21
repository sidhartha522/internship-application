# Internship Application Form - Setup Guide

## Google Sheets Integration Setup

### Prerequisites
- Node.js installed on your system
- Google Cloud project with Sheets API enabled ✓
- Service account credentials ✓

### Setup Steps

#### 1. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Internship Applications" (or any name you prefer)
4. Add headers in the first row:
   ```
   Timestamp | First Name | Last Name | Email | Phone | LinkedIn | GitHub | Birth Date | Position | Skill | Availability | Commit | Employment | Resume | Why | Start Date | Agree
   ```

#### 2. Share Sheet with Service Account
1. Copy the service account email: `internship-application@udaarpe.iam.gserviceaccount.com`
2. In your Google Sheet, click **Share**
3. Paste the service account email
4. Give it **Editor** access
5. Click **Send**

#### 3. Get Spreadsheet ID
1. Open your Google Sheet
2. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
3. Save this ID for the next step

#### 4. Configure Server
1. Open `server.js`
2. Replace `YOUR_SPREADSHEET_ID` with your actual Spreadsheet ID
3. If your sheet name is not "Sheet1", update `SHEET_NAME` as well

#### 5. Install Dependencies
```bash
npm install
```

#### 6. Start the Server
```bash
npm start
```

The server will run on `http://localhost:3000`

#### 7. Test the Form
1. Open `index.html` in your browser
2. Fill out the form
3. Submit and check your Google Sheet for the data

### Running on Your Network (Access from Phone)

1. Find your local IP address:
   ```bash
   ifconfig | grep inet
   ```
   Look for your IP (e.g., `192.168.29.138`)

2. Start the server:
   ```bash
   npm start
   ```

3. Update `script.js` to use your IP instead of localhost:
   ```javascript
   const SERVER_URL = 'http://192.168.29.138:3000/submit';
   ```

4. On your phone, open the browser and go to:
   ```
   http://192.168.29.138:8000
   ```

5. In another terminal, serve the static files:
   ```bash
   python3 -m http.server
   ```

### File Structure
```
form/
├── index.html              # Main form page
├── styles.css              # Form styling
├── script.js               # Form submission logic
├── server.js               # Backend server
├── package.json            # Node.js dependencies
├── service-account-key.json # Google credentials (keep private!)
├── uploads/                # Uploaded resume files
└── README.md               # This file
```

### Security Notes
- **Never commit `service-account-key.json` to GitHub**
- The `.gitignore` file is configured to exclude sensitive files
- For production, use environment variables for credentials
- Consider adding rate limiting and validation

### Troubleshooting

**Error: "Cannot find module 'googleapis'"**
- Run `npm install` to install dependencies

**Error: "Permission denied" when writing to sheets**
- Ensure the service account has Editor access to the sheet
- Check that you've shared the sheet with the correct email

**Form submission fails**
- Check if the server is running (`npm start`)
- Verify the `SERVER_URL` in `script.js` is correct
- Check browser console for errors

**File upload not working**
- Ensure the `uploads/` directory exists
- Check file permissions

### Next Steps
- Deploy the backend to a cloud service (Heroku, Railway, etc.)
- Add form validation
- Implement email notifications
- Add CAPTCHA to prevent spam

---

For questions or issues, check the server logs or browser console for error messages.
