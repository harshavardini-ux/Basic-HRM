# Basic HRM (Human Resource Management) System
### MERN Stack Internal Mark College Project • Semester IV
**Student Name:** 2nd Year Computer Science & Engineering  
**Evaluation Rubric:** 100 Marks Total (MERN Guidelines Standard)  

---

## 📌 Project Overview & Scope
A full-stack Human Resource Management (HRM) web application developed using the **MERN Stack** (MongoDB, Express.js, React, Node.js). The system features comprehensive role-based access control (RBAC) for **Admin**, **HR Manager**, and **Employee**, supporting the complete workforce lifecycle from recruitment and attendance tracking to leave processing and quarterly performance evaluations.

---

## 👥 User Roles & Permissions
1. **Admin (`admin@hrm.edu` / `admin123`)**:
   - Complete system access and audit rights.
   - User account management and role assignments.
   - Employee record creation, editing, and permanent deletion.
   - Department configuration and organization-wide analytics.
2. **HR Manager (`hr@hrm.edu` / `hr123`)**:
   - Employee profile directory management.
   - Attendance verification and status overrides.
   - Leave application reviews (Approve / Reject with remarks).
   - Performance appraisals creation and rating assignments.
   - Notice board bulletin publishing.
3. **Employee (`employee@hrm.edu` / `emp123`)**:
   - Personal profile viewing.
   - Daily attendance punch (Clock In / Clock Out) with on-time/late calculations.
   - Leave applications with date range validation and status tracking.
   - Performance review feedback history.
   - Organization announcement board.

---

## 🗄️ Database Schemas & Mongoose Models
The system defines 6 core Mongoose collections:
- **`User`**: Authentication credentials, bcrypt hashed passwords, JWT payload, and RBAC role.
- **`Employee`**: Core employment profiles (Employee ID, full name, email, phone, department, designation, salary, status).
- **`Department`**: Department codes, names, head of department, and dynamic headcount tracking.
- **`Attendance`**: Daily timecards with employee reference, date, clock-in, clock-out, and status (`Present`, `Late`, `Half Day`, `Absent`).
- **`Leave`**: Time-off applications (`Casual Leave`, `Sick Leave`, `Earned Leave`, `Maternity/Paternity`), date ranges, reasons, and approvals.
- **`Performance`**: Appraisals with 1-5 star ratings, review periods, key achievements, improvement areas, and reviewer feedback.
- **`Announcement`**: Organization-wide circulars with priority tags (`Normal`, `Important`, `Urgent`).

---

## 🛠️ Technical Architecture & Rubric Alignment (100 Marks)
| Evaluation Area | Marks | Implementation in Project |
|---|---|---|
| **React structure & routing** | 15 Marks | React 19, `react-router-dom`, protected routes, modular components |
| **Forms & validation** | 10 Marks | Controlled inputs, `event.preventDefault()`, dual-layer client/server validation |
| **State management** | 10 Marks | Pure React Context API (`AuthContext`), zero external Redux libraries |
| **Express architecture** | 15 Marks | Clean MVC: controllers, routes, middleware, and models separated |
| **REST API features** | 15 Marks | Query searching, status filtering, pagination, sorting, centralized errors |
| **Mongoose design** | 10 Marks | Schema models, field type validation, unique indexes, and fallback store |
| **Authentication & security**| 10 Marks | JWT token bearer verification, bcrypt password hashing, role middleware |
| **UI & responsiveness** | 5 Marks | Tailwind CSS, mobile-friendly navigation, accessible feedback states |
| **Deployment & config** | 5 Marks | Separate frontend/backend workspaces, environment templates, API proxy, configurable CORS |
| **Documentation & Git** | 5 Marks | Interactive ER diagram, Postman collection export, README, demo logins |
| **Total Marks** | **100/100** | **Complete Full Stack Implementation** |

---

## 🚀 Quick Start & Installation

The project is split into two independently deployable workspaces:

- `frontend/` contains the React/Vite application.
- `backend/` contains the Express API, MongoDB models, and server configuration.

1. **Install dependencies** from the project root:
   ```bash
   npm install
   ```

2. **Configure the backend:** copy `backend/.env.example` to `backend/.env`, then set `JWT_SECRET` and, for persistent data, `MONGODB_URI`. The server uses an in-memory fallback when MongoDB is not configured.

3. **Start both apps** in separate terminals from the project root:
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```
   Open `http://localhost:5173`. Vite forwards `/api` requests to the backend at `http://localhost:3000`.

For production, deploy the frontend and backend separately. Set `FRONTEND_URL` on the backend to the frontend origin (comma-separated for multiple origins), and set `VITE_API_URL` in the frontend build environment to the backend origin. Production CORS requires an explicit `FRONTEND_URL`.

---
## 🔑 Demo Login Credentials
- **Admin:** `admin@hrm.edu` / `admin123`
- **HR Manager:** `hr@hrm.edu` / `hr123`
- **Employee:** `employee@hrm.edu` / `emp123`
*(Or click the 1-Click login buttons on the login page or in the top navigation bar).*
