# Basic HRM (Human Resource Management) System
### Enterprise Full-Stack MERN Platform
**Architecture:** React 19, Express.js, MongoDB / Mongoose, JWT Security, Tailwind CSS

---

## 📌 Platform Overview & Scope
A full-stack Human Resource Management (HRM) application developed using the **MERN Stack** (MongoDB, Express.js, React, Node.js). The system features comprehensive role-based access control (RBAC) for **Admin**, **HR Manager**, and **Employee**, supporting the complete workforce lifecycle from employee records and attendance tracking to leave processing and quarterly performance evaluations.

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
   - Company notice board bulletin publishing.
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

## 🛠️ Technical Architecture & Modules
| System Module | Technology | Architecture Details |
|---|---|---|
| **Frontend & Routing** | React 19 & Vite | React SPA, `react-router-dom`, protected routes, modular components |
| **Forms & Validation** | Controlled Components | Controlled inputs, `event.preventDefault()`, dual-layer client/server validation |
| **State Management** | React Context API | Pure React Context API (`AuthContext`), reactive session management |
| **Backend Architecture**| Express.js & Node.js | Clean MVC: controllers, routes, middleware, and models separated |
| **REST API Engine** | Express REST APIs | Query searching, status filtering, pagination, sorting, centralized error handler |
| **Database Layer** | MongoDB & Mongoose | Schema models, field type validation, unique indexes, local persistence engine |
| **Authentication & RBAC**| JWT & Bcrypt | JWT bearer token verification, bcrypt password hashing, role middleware |
| **UI & Responsiveness** | Tailwind CSS | Responsive design with mobile drawer & desktop sidebar |
| **Configuration** | Environment Config | Environment variables in `.env.example`, port 3000, Vite dev middleware |
| **API Documentation** | Schema & Postman | Interactive architecture diagram, Postman collection, demo credentials |

---

## 🚀 Quick Start & Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and configure:
   ```env
   JWT_SECRET="enterprise_hrm_secure_jwt_token_key_2026"
   MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/basic_hrm"
   ```
   *(Note: The application automatically initializes an embedded persistent database engine if external MongoDB Atlas is unreachable).*

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🔑 Demo Login Accounts
- **Admin:** `admin@hrm.edu` / `admin123`
- **HR Manager:** `hr@hrm.edu` / `hr123`
- **Employee:** `employee@hrm.edu` / `emp123`
*(Or click the 1-Click login buttons on the login page or in the top navigation bar).*
