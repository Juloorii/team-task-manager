TEAM TASK MANAGER
=================

LIVE URLs
---------
Frontend: https://team-task-manager-ivory-chi.vercel.app
Backend API: ${process.env.REACT_APP_API_URL}
GitHub: https://github.com/Juloorii/team-task-manager

DESCRIPTION
-----------
A full-stack Team Task Manager web application with role-based access 
control (Admin/Member). Built with React, Node.js, Express, PostgreSQL 
and Prisma ORM.

FEATURES
--------
- User Authentication (Signup/Login with JWT)
- Role-based Access Control (Admin/Member)
- Project Management (Create, View, Delete)
- Task Management (Create, Assign, Update Status, Delete)
- Dashboard with task statistics
- Overdue task tracking

TECH STACK
----------
Frontend: React.js, Axios, React Router
Backend: Node.js, Express.js
Database: PostgreSQL (Supabase)
ORM: Prisma
Authentication: JWT, Bcrypt
Deployment: Railway (Backend), Vercel (Frontend)

REST API ENDPOINTS
------------------
POST   /api/auth/signup     - Create account
POST   /api/auth/login      - Login
GET    /api/projects        - Get all projects
POST   /api/projects        - Create project (Admin)
DELETE /api/projects/:id    - Delete project (Admin)
GET    /api/tasks           - Get all tasks
POST   /api/tasks           - Create task (Admin)
PATCH  /api/tasks/:id       - Update task status
DELETE /api/tasks/:id       - Delete task (Admin)
GET    /api/users           - Get all users (Admin)

HOW TO RUN LOCALLY
------------------
1. Clone the repo:
   git clone https://github.com/Juloorii/team-task-manager.git

2. Setup Backend:
   cd backend
   npm install
   npx prisma db push
   npm run dev

3. Setup Frontend:
   cd frontend
   npm install
   npm start

4. Open browser:
   http://localhost:3000

TEST CREDENTIALS
----------------
Admin Account:
  Email: admin@test.com
  Password: admin123
  Role: Admin (can create projects and tasks)

Member Account:
  Email: member@test.com
  Password: member123
  Role: Member (can view and update task status)

ROLE-BASED ACCESS
-----------------
Admin:
  - Create/Delete projects
  - Create/Delete tasks
  - Assign tasks to members
  - View all users

Member:
  - View all projects
  - View all tasks
  - Update task status only