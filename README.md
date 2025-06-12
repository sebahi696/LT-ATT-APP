<<<<<<< HEAD
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
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
>>>>>>> eb34080634c9ca250ef996338c14697833dcac99
