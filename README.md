# Real-Time Collaboration Workspace (Slack Clone)

Production-ready MERN monorepo for a real-time collaboration workspace, focused on a clean authentication foundation in Weeks 1 and 2.

## Project Overview

This repository contains a TypeScript-based Express API with MongoDB Atlas, plus a Vite + React frontend for authentication flows. Week 1 delivers project setup, auth, and protected profile access. Week 2 adds the strict backend model layer, schema transforms, and middleware architecture.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, TypeScript, Mongoose, MongoDB Atlas, JWT, bcryptjs, Zod
- Tooling: ESLint, Prettier, npm workspaces

## Features

- Register and login with JWT-based authentication
- Protected profile route with sanitized user data
- Strict TypeScript interfaces for all schemas
- Clean JSON transforms for MongoDB documents
- Modular MVC backend structure
- React auth context and protected routes

## Folder Structure

```text
slack-clone-mern/
├── client/
├── server/
├── README.md
├── .gitignore
└── docker-compose.yml
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `server/.env` and `client/.env`.

3. Start the backend and frontend in separate terminals:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

## Environment Variables

### server/.env

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### client/.env

```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

## Future Roadmap

- Workspace management
- Direct and channel-based messaging
- Socket.IO real-time updates
- Redis-backed presence and pub/sub
- File uploads and notifications
- Role-based access control
