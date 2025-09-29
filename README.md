# IronBridge Frontend

A modern React application built with Vite, featuring user authentication, routing, and a responsive UI with Tailwind CSS.

## 🚀 Features

- **User Authentication System**: Login, Signup, Password Reset, OTP Verification
- **Modern React**: Built with React 19 and React Router DOM
- **Responsive Design**: Styled with Tailwind CSS
- **Fast Development**: Powered by Vite with Hot Module Replacement (HMR)
- **Code Quality**: ESLint configuration for consistent code style
- **Chart Integration**: Chart.js and React-ChartJS-2 for data visualization
- **Icon Library**: React Icons for modern UI elements
- **Loading States**: React Spinners for better UX

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (comes with Node.js) or **yarn** package manager

## � Quick Setup Guide for Clients

Follow these simple steps to get the project running on your machine:

### Step 1: Check Node.js Installation

First, verify that Node.js is installed on your system:

```bash
node --version
npm --version
```

If you don't have Node.js installed:

- Visit [nodejs.org](https://nodejs.org/)
- Download the LTS (Long Term Support) version
- Install it following the installer instructions
- Restart your terminal/command prompt

### Step 2: Get the Project Files

If you received the project as a ZIP file:

1. Extract the ZIP file to your desired location
2. Open terminal/command prompt
3. Navigate to the project folder:
   ```bash
   cd path/to/ironbridge-frontend
   ```

### Step 3: Install Project Dependencies

Run this command in the project directory:

```bash
npm install
```

**Wait for the installation to complete** (this may take a few minutes)

### Step 4: Start the Development Server

Once installation is complete, start the project:

```bash
npm run dev
```

### Step 5: Open the Application

After running `npm run dev`, you'll see output similar to:

```
  VITE v7.1.7  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

1. Open your web browser
2. Go to `http://localhost:5173`
3. You should see the login page of the IronBridge application

## 🛠️ Detailed Installation Steps

### For Windows Users:

1. **Open Command Prompt or PowerShell as Administrator**
2. **Navigate to project folder**:
   ```cmd
   cd C:\path\to\your\project\folder
   ```
3. **Install dependencies**:
   ```cmd
   npm install
   ```
4. **Start the project**:
   ```cmd
   npm run dev
   ```

### For Mac/Linux Users:

1. **Open Terminal**
2. **Navigate to project folder**:
   ```bash
   cd /path/to/your/project/folder
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the project**:
   ```bash
   npm run dev
   ```

## 🚀 Running the Project

### Development Mode

To start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173` (or another available port). The application will automatically reload when you make changes to the code.

### Production Build

To create a production build:

```bash
npm run build
```

The built files will be generated in the `dist` directory.
