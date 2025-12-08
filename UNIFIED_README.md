# Internship Application - Unified Application

A modern, unified full-stack application for internship applications with React frontend and Express backend.

## 🎯 Architecture

**Single Server Application** - Express serves both API and React frontend from one port (3001)

### Tech Stack
- **Frontend**: React + Vite, Tailwind CSS v4, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: Google Sheets API
- **File Storage**: Cloudinary
- **Session**: Express Session

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

### 3. Build & Run
```bash
# Build frontend and start server
npm run build:start

# OR use the script
./start-unified.sh
```

## 📦 Available Scripts

- `npm start` - Start the unified server (port 3001)
- `npm run dev` - Start server with nodemon (auto-reload)
- `npm run build` - Build React frontend for production
- `npm run build:start` - Build and start in one command
- `npm run install:all` - Install all dependencies (root + frontend)

## 🌐 Access Points

Once running:
- **Application**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3001/old/admin.html
- **API Endpoint**: http://localhost:3001/api/submit

## 🎨 Features

### User Features
- ✅ Landing page with internship details
- ✅ Multi-step form with 15 questions
- ✅ Star rating for skill level (1-5 stars)
- ✅ Toggle buttons for Yes/No questions
- ✅ Glitch-styled checkboxes
- ✅ Drag & drop file upload
- ✅ Dark theme with blue accent
- ✅ Smooth animations and transitions

### Form Fields
1. Full Name (First & Last)
2. Email
3. Phone Number
4. LinkedIn Profile
5. GitHub Profile
6. Birth Date
7. Position Selection (Backend/Frontend/Full-Stack)
8. Skill Level (5-star rating)
9. Weekly Availability
10. Commitment Period (Yes/No toggle)
11. Employment Status (Multi-select checkboxes)
12. Resume Upload (Drag & drop)
13. Why should we select you?
14. Available Start Date
15. Unpaid Internship Agreement (Yes/No toggle)

### Backend Features
- ✅ File upload to Cloudinary
- ✅ Data storage in Google Sheets
- ✅ Admin dashboard for viewing applications
- ✅ Session management
- ✅ CORS enabled

## 📁 Project Structure

```
internship-application/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── App.jsx        # Main application
│   │   └── index.css      # Tailwind styles
│   ├── dist/              # Production build (generated)
│   └── package.json
├── server.js              # Express server
├── package.json           # Root dependencies
├── .env                   # Environment variables
└── start-unified.sh       # Quick start script
```

## 🔧 Configuration

### Required Environment Variables

```env
PORT=3001
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SPREADSHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
SESSION_SECRET=your_random_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
```

## 🌟 Benefits of Unified Architecture

1. **Single Port** - Everything runs on port 3001
2. **Easy Deployment** - Deploy to one service (Render, Railway, etc.)
3. **Simple Setup** - One command to start everything
4. **Cost Effective** - Single hosting service needed
5. **Better Performance** - No CORS, direct API calls

## 🚢 Deployment

### Deploy to Render/Railway

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Build command: `npm run build`
5. Start command: `npm start`

The server will automatically serve the React build!

## 🔄 Development Workflow

For development with hot reload:

**Terminal 1** (Backend):
```bash
npm run dev
```

**Terminal 2** (Frontend):
```bash
cd frontend && npm run dev
```

For production (single server):
```bash
npm run build:start
```

## 📝 Notes

- Frontend builds to `frontend/dist/`
- Express serves static files from dist folder
- API routes are prefixed with `/api/`
- Old HTML files accessible at `/old/`
- File uploads max size: 10MB
- Supported file types: PDF, DOC, DOCX, PPT, PPTX

## 🐛 Troubleshooting

**Port already in use:**
```bash
lsof -ti:3001 | xargs kill -9
```

**Build not updating:**
```bash
npm run build
```

**Missing dependencies:**
```bash
npm run install:all
```

## 📧 Support

For issues or questions, check the console logs or contact the development team.
