# La Tavola Attendance System - Frontend

This is the frontend application for the La Tavola Attendance System, built with React, TypeScript, and Material-UI.

## Prerequisites

- Node.js 14.x or higher
- Git
- Yarn or npm

## Environment Variables

Create a `.env` file in the client directory with:

```env
REACT_APP_API_URL=http://localhost:5001
```

For production, update REACT_APP_API_URL to your Render backend URL.

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/lt-att-frontend.git
cd lt-att-frontend/client
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Start the development server
```bash
yarn start
# or
npm start
```

## Deployment to Vercel

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure the build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
4. Add environment variables:
   - REACT_APP_API_URL: Your Render backend URL

## Available Scripts

- `yarn start` - Runs the app in development mode
- `yarn build` - Builds the app for production
- `yarn test` - Runs the test suite
- `yarn eject` - Ejects from Create React App

## Features

- User Authentication
  - Login/Logout
  - Role-based access control
  - Session management

- Admin Dashboard
  - Employee management
  - Department management
  - Attendance reports
  - QR code generation

- Manager Dashboard
  - Department overview
  - Team attendance
  - Leave management

- Employee Features
  - QR code scanning
  - Attendance history
  - Profile management

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable components
│   ├── context/       # React context providers
│   ├── services/      # API services
│   ├── types/         # TypeScript interfaces
│   ├── utils/         # Helper functions
│   └── App.tsx        # Main application component
├── public/           # Static files
└── package.json      # Dependencies and scripts
``` 