# EduSpace Project 

A modern web application for student management, featuring a NestJS backend and a React frontend with a premium, theme-aware UI.

## Features

- **Premium UI**: Modern Glassmorphism design with Light/Dark mode support.
- **Frontend**: React 19, React Router v7, custom CSS variable system.
- **Backend**: NestJS, MongoDB (Mongoose), JWT Auth.
- **Integration**: Full CORS support and Axios-based API client.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally on port 27017

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/benmedikram/projetweb
    cd projetweb
    ```

2.  **Install dependencies**:
    ```bash
    # Backend
    cd backend
    npm install
    
    # Frontend (in a new terminal)
    cd ../front
    npm install
    ```

### Running the Project

You need to run both the backend and frontend terminals simultaneously.

#### 1. Start Backend
```bash
cd backend
npm run start:dev
```
*Server runs on: http://localhost:5000*

#### 2. Start Frontend
```bash
cd front
npm start
```
*App runs on: http://localhost:3000*

## Project Structure

- **`/backend`**: NestJS API with `User` and `Auth` modules.
- **`/front`**: React application.
  - **`src/pages`**: Main views (SignIn, SignUp, Dashboard).
  - **`src/components`**: Shared components (AuthLayout, ThemeContext).
  - **`src/theme.css`**: Design system variables.
  - **`src/services/api.js`**: Axios client configuration.

## Technologies

- **React 19**
- **NestJS**
- **MongoDB**
- **CSS Variables (HSL)**

---
© 2024 EduSpace
