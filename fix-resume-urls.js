require('dotenv').config();
const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = 'Sheet1';

async function fixResumeUrls() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './service-account-key.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Fetching data from Google Sheets...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Q`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }

    console.log(`Found ${rows.length} rows`);

    const updates = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[14]) {
        const oldUrl = row[14];
        let newUrl = oldUrl.replace('.pdf.pdf', '.pdf');
        
        if (newUrl.includes('/image/upload/') && newUrl.endsWith('.pdf')) {
          newUrl = newUrl.replace('/image/upload/', '/raw/upload/');
        }

        if (oldUrl !== newUrl) {
          updates.push({
            range: `${SHEET_NAME}!O${i + 1}`,
            values: [[newUrl]]
          });
          console.log(`Row ${i + 1}: ${oldUrl} -> ${newUrl}`);
        }
      }
    }

    if (updates.length === 0) {
      console.log('No URLs need updating!');
      return;
    }

    console.log(`\nUpdating ${updates.length} resume URLs...`);
    
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: updates
      }
    });

    console.log('✅ All resume URLs updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixResumeUrls();
