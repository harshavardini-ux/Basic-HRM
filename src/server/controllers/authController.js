// ============================================================================
// Auth Controller
// Handles user registration, login, profile, and initial seed data
// Uses bcrypt for secure password hashing and jsonwebtoken for JWT auth
// ============================================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { Department } from '../models/Department.js';
import { Attendance } from '../models/Attendance.js';
import { Leave } from '../models/Leave.js';
import { Performance } from '../models/Performance.js';
import { Announcement } from '../models/Announcement.js';

const JWT_SECRET = process.env.JWT_SECRET || 'enterprise_hrm_secure_jwt_token_key_2026';

// Helper to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'Employee', department = 'General' } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Generate Employee ID if role is Employee
    const count = await User.countDocuments();
    const employeeId = `EMP${String(count + 101).padStart(3, '0')}`;

    // 5. Create User
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      department,
      employeeId
    });

    // 6. Also create corresponding Employee record
    if (role === 'Employee' || role === 'HR Manager') {
      await Employee.create({
        employeeId,
        fullName: name.trim(),
        email: email.toLowerCase().trim(),
        phone: '9876543210',
        department,
        designation: role === 'HR Manager' ? 'HR Specialist' : 'Software Engineer',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: role === 'HR Manager' ? 65000 : 45000,
        status: 'Active',
        address: 'Campus Road, Tech District',
        emergencyContact: 'Family: 9876500000'
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    console.error('[AuthController.register] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. ' + error.message
    });
  }
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // 3. Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // 4. Issue token
    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    console.error('[AuthController.login] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. ' + error.message
    });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (JWT Protected)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed initial demo data for testing & demonstration
// @route   POST /api/auth/seed
// @access  Public
export const seedInitialData = async (req, res) => {
  try {
    const existingUsers = await User.find();
    if (existingUsers.length > 0 && req.query.force !== 'true') {
      return res.json({ success: true, message: 'Data already initialized.' });
    }

    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const hrPass = await bcrypt.hash('hr123', salt);
    const empPass = await bcrypt.hash('emp123', salt);

    // 1. Seed Users
    const u1 = await User.create({
      name: 'Dr. Rajesh Sharma (Admin)',
      email: 'admin@hrm.edu',
      password: adminPass,
      role: 'Admin',
      department: 'Management',
      employeeId: 'ADM001'
    });

    const u2 = await User.create({
      name: 'Priya Iyer (HR Lead)',
      email: 'hr@hrm.edu',
      password: hrPass,
      role: 'HR Manager',
      department: 'Human Resources',
      employeeId: 'HRM001'
    });

    const u3 = await User.create({
      name: 'Aarav Patel (Developer)',
      email: 'employee@hrm.edu',
      password: empPass,
      role: 'Employee',
      department: 'Engineering',
      employeeId: 'EMP101'
    });

    // 2. Seed Departments
    await Department.create({
      name: 'Engineering',
      code: 'ENG',
      headOfDepartment: 'Vikram Malhotra',
      description: 'Core software development, product architecture, and DevOps.',
      totalEmployees: 4
    });
    await Department.create({
      name: 'Human Resources',
      code: 'HR',
      headOfDepartment: 'Priya Iyer',
      description: 'Talent recruitment, employee relations, onboarding, and payroll.',
      totalEmployees: 2
    });
    await Department.create({
      name: 'Finance & Accounts',
      code: 'FIN',
      headOfDepartment: 'Suresh Menon',
      description: 'Corporate budgeting, financial auditing, payroll accounting, and fiscal planning.',
      totalEmployees: 2
    });
    await Department.create({
      name: 'Marketing & Sales',
      code: 'MKT',
      headOfDepartment: 'Neha Gupta',
      description: 'Brand promotion, digital marketing, client acquisition, and PR.',
      totalEmployees: 3
    });

    // 3. Seed Employees
    await Employee.create({
      employeeId: 'EMP101',
      fullName: 'Aarav Patel',
      email: 'employee@hrm.edu',
      phone: '9845012345',
      department: 'Engineering',
      designation: 'Full Stack Developer',
      joiningDate: '2024-02-15',
      salary: 58000,
      status: 'Active',
      address: 'Plot 42, HSR Layout, Sector 2',
      emergencyContact: 'Father - 9845000001'
    });
    await Employee.create({
      employeeId: 'EMP102',
      fullName: 'Ananya Deshmukh',
      email: 'ananya@hrm.edu',
      phone: '9845023456',
      department: 'Engineering',
      designation: 'Frontend React Engineer',
      joiningDate: '2024-03-01',
      salary: 54000,
      status: 'Active',
      address: 'Flat 304, Green Meadows',
      emergencyContact: 'Mother - 9845000002'
    });
    await Employee.create({
      employeeId: 'HRM001',
      fullName: 'Priya Iyer',
      email: 'hr@hrm.edu',
      phone: '9845034567',
      department: 'Human Resources',
      designation: 'Senior HR Manager',
      joiningDate: '2023-08-10',
      salary: 72000,
      status: 'Active',
      address: 'Villa 12, Palm Residency',
      emergencyContact: 'Spouse - 9845000003'
    });
    await Employee.create({
      employeeId: 'ADM001',
      fullName: 'Dr. Rajesh Sharma',
      email: 'admin@hrm.edu',
      phone: '9845045678',
      department: 'Management',
      designation: 'Head of Operations & Admin',
      joiningDate: '2022-01-05',
      salary: 95000,
      status: 'Active',
      address: 'Tower A, Executive Enclave',
      emergencyContact: 'Spouse - 9845000004'
    });
    await Employee.create({
      employeeId: 'EMP103',
      fullName: 'Rohan Verma',
      email: 'rohan.v@hrm.edu',
      phone: '9845056789',
      department: 'Marketing & Sales',
      designation: 'Growth Marketing Executive',
      joiningDate: '2024-05-20',
      salary: 46000,
      status: 'On Leave',
      address: 'B-12, Sunrise Apartments',
      emergencyContact: 'Brother - 9845000005'
    });

    // 4. Seed Today's & Past Attendance
    const today = new Date().toISOString().split('T')[0];
    await Attendance.create({
      employeeId: 'EMP101',
      employeeName: 'Aarav Patel',
      date: today,
      checkInTime: '09:12 AM',
      checkOutTime: '--:--',
      status: 'Present',
      remarks: 'Clocked in on campus'
    });
    await Attendance.create({
      employeeId: 'EMP102',
      employeeName: 'Ananya Deshmukh',
      date: today,
      checkInTime: '09:45 AM',
      checkOutTime: '--:--',
      status: 'Late',
      remarks: 'Traffic delay reported'
    });
    await Attendance.create({
      employeeId: 'HRM001',
      employeeName: 'Priya Iyer',
      date: today,
      checkInTime: '08:58 AM',
      checkOutTime: '--:--',
      status: 'Present',
      remarks: 'Early arrival'
    });
    await Attendance.create({
      employeeId: 'ADM001',
      employeeName: 'Dr. Rajesh Sharma',
      date: today,
      checkInTime: '09:00 AM',
      checkOutTime: '--:--',
      status: 'Present',
      remarks: 'Standard check-in'
    });

    // 5. Seed Leaves
    await Leave.create({
      employeeId: 'EMP101',
      employeeName: 'Aarav Patel',
      leaveType: 'Casual Leave',
      startDate: '2026-11-12',
      endDate: '2026-11-13',
      numberOfDays: 2,
      reason: 'Attending sibling graduation ceremony in hometown.',
      status: 'Approved',
      reviewedBy: 'Priya Iyer',
      comments: 'Approved. Please coordinate task handover before leaving.'
    });
    await Leave.create({
      employeeId: 'EMP102',
      employeeName: 'Ananya Deshmukh',
      leaveType: 'Sick Leave',
      startDate: '2026-11-18',
      endDate: '2026-11-19',
      numberOfDays: 2,
      reason: 'Scheduled dental procedure and recovery.',
      status: 'Pending',
      reviewedBy: 'Pending',
      comments: ''
    });
    await Leave.create({
      employeeId: 'EMP103',
      employeeName: 'Rohan Verma',
      leaveType: 'Earned Leave',
      startDate: '2026-11-04',
      endDate: '2026-11-08',
      numberOfDays: 5,
      reason: 'Annual family vacation trip.',
      status: 'Approved',
      reviewedBy: 'Dr. Rajesh Sharma',
      comments: 'Enjoy your vacation.'
    });

    // 6. Seed Performance Reviews
    await Performance.create({
      employeeId: 'EMP101',
      employeeName: 'Aarav Patel',
      reviewPeriod: 'Q3 2026',
      rating: 5,
      keyAchievements: 'Successfully delivered the REST API authentication module and overhauled the UI with 100% responsiveness.',
      areasOfImprovement: 'Enhance automated unit test coverage for edge cases.',
      reviewerName: 'Dr. Rajesh Sharma',
      feedback: 'Outstanding technical initiative, teamwork, and reliable milestone deliveries.'
    });
    await Performance.create({
      employeeId: 'EMP102',
      employeeName: 'Ananya Deshmukh',
      reviewPeriod: 'Q3 2026',
      rating: 4,
      keyAchievements: 'Revamped the frontend component library and improved page load accessibility.',
      areasOfImprovement: 'Deepen backend integration knowledge.',
      reviewerName: 'Priya Iyer',
      feedback: 'Consistent output and high-quality UI design implementations.'
    });

    // 7. Seed Announcements
    await Announcement.create({
      title: 'Company All-Hands Meeting & Q4 Roadmap Review',
      content: 'Our quarterly organizational all-hands and product roadmap session is scheduled for Monday at 10:00 AM. Please ensure your department updates are submitted.',
      priority: 'Urgent',
      author: 'Executive HR Team',
      date: today
    });
    await Announcement.create({
      title: 'Annual Corporate Wellness & Health Checkup',
      content: 'Complimentary full-body wellness and health screening scheduled for this Friday from 10:00 AM to 4:00 PM in Conference Center B.',
      priority: 'Important',
      author: 'Priya Iyer (HR)',
      date: today
    });
    await Announcement.create({
      title: 'Tech Fest Hackathon Registration Open',
      content: 'Registrations are now open for inter-departmental innovation hackathon. Grand prize includes tech merchandise and mentorship.',
      priority: 'Normal',
      author: 'Engineering Dept',
      date: today
    });

    return res.json({
      success: true,
      message: 'HRM demo data initialized successfully!'
    });
  } catch (error) {
    console.error('[Seed] Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
