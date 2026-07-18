# Real-Time Collaboration Workspace (Slack Clone)

Production-ready MERN monorepo for a real-time collaboration workspace (Slack Clone) supporting authentication, workspaces, channels, real-time messaging, online presence, typing indicators, Redis Pub/Sub, role-based access control, and Docker deployment.

---

## 🚀 Quick Start — How to Run the Project

### Option A: Running Locally (Development Mode)

#### Prerequisites
- **Node.js** (v18 or v20+)
- **MongoDB** (Local instance on `mongodb://localhost:27017` or MongoDB Atlas URI)
- *(Optional)* **Redis** server running on port `6379` (The backend runs gracefully even if Redis is absent).

#### Step 1: Install Dependencies
Run from the root directory:
```bash
npm install
```

#### Step 2: Configure Environment Variables

**Server Configuration (`server/.env`):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/slack-clone
JWT_SECRET=your_strong_jwt_secret_key_at_least_16_chars_long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

**Client Configuration (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 3: Start Development Servers

Start backend server and frontend client concurrently:

**Terminal 1 (Backend Server):**
```bash
npm run dev --workspace server
```
*Runs on `http://localhost:5000`*

**Terminal 2 (Frontend Client):**
```bash
npm run dev --workspace client
```
*Runs on `http://localhost:5173`*

Open `http://localhost:5173` in your browser to register an account and start collaborating!

---

### Option B: Running with Docker (Production Mode)

Ensure Docker Desktop is installed and running.

Run:
```bash
docker-compose up --build
```

This starts 4 containers automatically:
1. **MongoDB**: `mongodb://localhost:27017`
2. **Redis**: `redis://localhost:6379`
3. **Express Server**: `http://localhost:5000`
4. **React Client (Nginx)**: `http://localhost`

---

## 🛠️ Technology Stack

- **Frontend**: React 18/19, TypeScript, Vite, Tailwind CSS, Axios, React Router 7, Socket.IO Client
- **Backend**: Node.js, Express, TypeScript, Mongoose, MongoDB, JWT, bcryptjs, Zod
- **Real-Time**: Socket.IO (WebSockets with polling fallback)
- **Caching & Pub/Sub**: Redis (`ioredis`, `@socket.io/redis-adapter`)
- **Containerization**: Docker, Docker Compose, Nginx

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in & receive JWT token
- `GET /api/auth/profile` — Fetch authenticated user profile

### Workspaces
- `POST /api/workspaces` — Create a new workspace (auto-creates `#general` channel)
- `GET /api/workspaces` — Get workspaces for current user
- `GET /api/workspaces/:workspaceId` — Get workspace details
- `PATCH /api/workspaces/:workspaceId` — Update workspace info (owner/admin)
- `DELETE /api/workspaces/:workspaceId` — Delete workspace (owner only)
- `POST /api/workspaces/join` — Join workspace via invite code
- `POST /api/workspaces/:workspaceId/regenerate-invite` — Regenerate invite code
- `DELETE /api/workspaces/:workspaceId/members/:userId` — Remove member

### Channels
- `POST /api/channels/:workspaceId` — Create channel in workspace
- `GET /api/channels/:workspaceId` — List workspace channels
- `GET /api/channels/:workspaceId/:channelId` — Get channel details
- `DELETE /api/channels/:workspaceId/:channelId` — Delete channel (non-default)

### Messages
- `POST /api/messages/:workspaceId` — Send message to a channel
- `GET /api/messages/:workspaceId/:channelId` — Get channel message history (paginated)
- `PATCH /api/messages/:workspaceId/:messageId` — Edit own message
- `DELETE /api/messages/:workspaceId/:messageId` — Delete message

---

## ⚡ Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_workspace` | Client → Server | Join workspace room & trigger online notification |
| `join_channel` | Client → Server | Join specific channel room |
| `leave_channel` | Client → Server | Leave channel room |
| `send_message` | Client → Server | Send message to channel |
| `receive_message` | Server → Client | Real-time broadcast of new message |
| `typing_start` | Client ↔ Server | Broadcast typing indicator |
| `typing_stop` | Client ↔ Server | Stop typing indicator |
| `user_online` | Server → Client | User online presence broadcast |
| `user_offline` | Server → Client | User offline presence broadcast |
| `message_read` | Client ↔ Server | Read receipt acknowledgement |

---

## 📂 Project Structure

```text
slack-clone-mern/
├── docker-compose.yml
├── package.json
├── README.md
├── server/
│   ├── Dockerfile
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/ (database, env, redis, socket)
│   │   ├── controllers/ (auth, workspace, channel, message)
│   │   ├── interfaces/
│   │   ├── middleware/ (auth, authorize, error, validate)
│   │   ├── models/ (User, Workspace, Channel, Message)
│   │   ├── routes/
│   │   ├── services/ (presence)
│   │   ├── socket/ (socketHandlers)
│   │   └── types/
└── client/
    ├── Dockerfile
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── components/ (layout, chat, ui)
    │   ├── context/ (Auth, Socket, Workspace)
    │   ├── pages/ (Login, Register, Dashboard)
    │   ├── services/ (api, workspace, channel, message)
    │   └── types/
```
