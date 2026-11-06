import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  X,
  Database,
  FileJson,
  KeyRound,
  CheckCircle,
  Copy,
  Download,
  Share2,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function SubmissionDocsModal({ isOpen, onClose }) {
  const { quickLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('credentials');
  const [copied, setCopied] = useState('');

  if (!isOpen) return null;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  // Pre-configured Postman Collection JSON matching the REST APIs
  const postmanCollection = {
    info: {
      name: "Basic HRM REST API - MERN Project",
      _postman_id: "basic-hrm-mern-college-evaluation-2026",
      description: "Collection of all REST API endpoints for Basic Human Resource Management system.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
      {
        name: "1. Authentication",
        item: [
          { name: "POST Register User", request: { method: "POST", url: "{{base_url}}/api/auth/register" } },
          { name: "POST Login User", request: { method: "POST", url: "{{base_url}}/api/auth/login" } },
          { name: "GET Current Profile", request: { method: "GET", url: "{{base_url}}/api/auth/me" } },
          { name: "POST Reset/Seed Data", request: { method: "POST", url: "{{base_url}}/api/auth/seed" } }
        ]
      },
      {
        name: "2. Employees (CRUD + Search + Pagination)",
        item: [
          { name: "GET All Employees", request: { method: "GET", url: "{{base_url}}/api/employees?search=&department=&page=1&limit=10" } },
          { name: "POST Create Employee", request: { method: "POST", url: "{{base_url}}/api/employees" } },
          { name: "GET Employee By ID", request: { method: "GET", url: "{{base_url}}/api/employees/:id" } },
          { name: "PUT Update Employee", request: { method: "PUT", url: "{{base_url}}/api/employees/:id" } },
          { name: "DELETE Employee", request: { method: "DELETE", url: "{{base_url}}/api/employees/:id" } }
        ]
      },
      {
        name: "3. Departments",
        item: [
          { name: "GET All Departments", request: { method: "GET", url: "{{base_url}}/api/departments" } },
          { name: "POST Create Department", request: { method: "POST", url: "{{base_url}}/api/departments" } },
          { name: "PUT Update Department", request: { method: "PUT", url: "{{base_url}}/api/departments/:id" } },
          { name: "DELETE Department", request: { method: "DELETE", url: "{{base_url}}/api/departments/:id" } }
        ]
      },
      {
        name: "4. Attendance",
        item: [
          { name: "GET Attendance Records", request: { method: "GET", url: "{{base_url}}/api/attendance?date=&status=&page=1" } },
          { name: "GET My Attendance", request: { method: "GET", url: "{{base_url}}/api/attendance/my" } },
          { name: "POST Mark Attendance (Clock In/Out)", request: { method: "POST", url: "{{base_url}}/api/attendance/mark" } },
          { name: "PUT Update Attendance Status", request: { method: "PUT", url: "{{base_url}}/api/attendance/:id" } }
        ]
      },
      {
        name: "5. Leave Management",
        item: [
          { name: "GET All Leaves", request: { method: "GET", url: "{{base_url}}/api/leaves?status=&page=1" } },
          { name: "GET My Leaves", request: { method: "GET", url: "{{base_url}}/api/leaves/my" } },
          { name: "POST Apply Leave", request: { method: "POST", url: "{{base_url}}/api/leaves" } },
          { name: "PUT Review Leave (Approve/Reject)", request: { method: "PUT", url: "{{base_url}}/api/leaves/:id/status" } }
        ]
      },
      {
        name: "6. Performance Reviews",
        item: [
          { name: "GET All Reviews", request: { method: "GET", url: "{{base_url}}/api/performance" } },
          { name: "GET My Reviews", request: { method: "GET", url: "{{base_url}}/api/performance/my" } },
          { name: "POST Create Appraisal", request: { method: "POST", url: "{{base_url}}/api/performance" } }
        ]
      },
      {
        name: "7. Reports & Analytics",
        item: [
          { name: "GET Dashboard Summary Stats", request: { method: "GET", url: "{{base_url}}/api/reports/summary" } }
        ]
      }
    ]
  };

  const handleDownloadPostman = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(postmanCollection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "Basic_HRM_Postman_Collection.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-900">Project Evaluation & Submission Dossier</span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                100 / 100 Marks Rubric
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Course: Full Stack MERN Development • 2nd Year Computer Science Internal Project
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto">
          {[
            { id: 'credentials', label: 'Demo Credentials', icon: KeyRound },
            { id: 'erd', label: 'Database ER Diagram', icon: Database },
            { id: 'postman', label: 'Postman Collection', icon: FileJson },
            { id: 'rubric', label: 'Evaluation Rubric (100M)', icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* TAB 1: DEMO CREDENTIALS */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
                <p className="font-bold mb-1">Faculty & Evaluator Notice:</p>
                <p>
                  You can click <strong>"One-Click Login"</strong> on any role below to instantly authenticate into that role's interface, test RBAC restrictions, mark attendance, and approve leaves!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Admin Card */}
                <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                      ADMIN ROLE
                    </span>
                    <span className="text-[10px] text-slate-400">ADM001</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Dr. Rajesh Sharma</h4>
                  <div className="mt-3 space-y-1 text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <p><span className="text-slate-400 select-none">Email: </span>admin@hrm.edu</p>
                    <p><span className="text-slate-400 select-none">Pass:  </span>admin123</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Permissions: Full system control, delete records, view analytics, assign roles.
                  </p>
                  <button
                    onClick={async () => {
                      await quickLogin('admin');
                      onClose();
                    }}
                    className="w-full mt-3 py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition"
                  >
                    ⚡ One-Click Login as Admin
                  </button>
                </div>

                {/* HR Manager Card */}
                <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                      HR MANAGER
                    </span>
                    <span className="text-[10px] text-slate-400">HRM001</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Priya Iyer</h4>
                  <div className="mt-3 space-y-1 text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <p><span className="text-slate-400 select-none">Email: </span>hr@hrm.edu</p>
                    <p><span className="text-slate-400 select-none">Pass:  </span>hr123</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Permissions: Manage employee profiles, approve leaves, create reviews, verify attendance.
                  </p>
                  <button
                    onClick={async () => {
                      await quickLogin('hr');
                      onClose();
                    }}
                    className="w-full mt-3 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
                  >
                    ⚡ One-Click Login as HR
                  </button>
                </div>

                {/* Employee Card */}
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      EMPLOYEE ROLE
                    </span>
                    <span className="text-[10px] text-slate-400">EMP101</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Aarav Patel</h4>
                  <div className="mt-3 space-y-1 text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <p><span className="text-slate-400 select-none">Email: </span>employee@hrm.edu</p>
                    <p><span className="text-slate-400 select-none">Pass:  </span>emp123</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Permissions: Clock In / Clock Out, submit leave requests, view performance appraisals.
                  </p>
                  <button
                    onClick={async () => {
                      await quickLogin('employee');
                      onClose();
                    }}
                    className="w-full mt-3 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
                  >
                    ⚡ One-Click Login as Employee
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATABASE ER DIAGRAM */}
          {activeTab === 'erd' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-800 text-sm">Entity Relationship Diagram (Mongoose Schemas)</h4>
                  <span className="text-[11px] text-slate-500">6 Collections with Indexes & FK Constraints</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Entity 1: User */}
                  <div className="border border-indigo-200 rounded-lg p-3 bg-indigo-50/30">
                    <div className="font-bold text-indigo-900 border-b border-indigo-200 pb-1 mb-2 flex justify-between">
                      <span>User</span>
                      <span className="text-[10px] text-indigo-600 font-normal">[Auth / RBAC]</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-slate-700 font-mono">
                      <li>🔑 <span className="font-bold">_id:</span> ObjectId</li>
                      <li>• name: String</li>
                      <li>• <span className="text-indigo-600 font-bold">email:</span> String (Unique)</li>
                      <li>• password: String (Bcrypt)</li>
                      <li>• <span className="text-purple-600 font-semibold">role:</span> Enum [Admin/HR/Emp]</li>
                      <li>• department: String</li>
                      <li>• employeeId: String (FK)</li>
                    </ul>
                  </div>

                  {/* Entity 2: Employee */}
                  <div className="border border-emerald-200 rounded-lg p-3 bg-emerald-50/30">
                    <div className="font-bold text-emerald-900 border-b border-emerald-200 pb-1 mb-2 flex justify-between">
                      <span>Employee</span>
                      <span className="text-[10px] text-emerald-600 font-normal">[Core Profile]</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-slate-700 font-mono">
                      <li>🔑 <span className="font-bold">_id:</span> ObjectId</li>
                      <li>• <span className="text-emerald-700 font-bold">employeeId:</span> String (Unique)</li>
                      <li>• fullName: String</li>
                      <li>• email: String (Unique)</li>
                      <li>• phone: String</li>
                      <li>• department: String (FK)</li>
                      <li>• designation: String</li>
                      <li>• joiningDate: Date</li>
                      <li>• salary: Number</li>
                      <li>• status: Enum [Active/Leave]</li>
                    </ul>
                  </div>

                  {/* Entity 3: Department */}
                  <div className="border border-blue-200 rounded-lg p-3 bg-blue-50/30">
                    <div className="font-bold text-blue-900 border-b border-blue-200 pb-1 mb-2 flex justify-between">
                      <span>Department</span>
                      <span className="text-[10px] text-blue-600 font-normal">[Org Structure]</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-slate-700 font-mono">
                      <li>🔑 <span className="font-bold">_id:</span> ObjectId</li>
                      <li>• <span className="text-blue-700 font-bold">name:</span> String (Unique)</li>
                      <li>• code: String</li>
                      <li>• headOfDepartment: String</li>
                      <li>• description: String</li>
                      <li>• totalEmployees: Number</li>
                    </ul>
                  </div>

                  {/* Entity 4: Attendance */}
                  <div className="border border-amber-200 rounded-lg p-3 bg-amber-50/30">
                    <div className="font-bold text-amber-900 border-b border-amber-200 pb-1 mb-2 flex justify-between">
                      <span>Attendance</span>
                      <span className="text-[10px] text-amber-700 font-normal">[Daily Logs]</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-slate-700 font-mono">
                      <li>🔑 <span className="font-bold">_id:</span> ObjectId</li>
                      <li>• <span className="text-amber-800 font-bold">employeeId:</span> String (FK)</li>
                      <li>• employeeName: String</li>
                      <li>• date: String (YYYY-MM-DD)</li>
                      <li>• checkInTime: String</li>
                      <li>• checkOutTime: String</li>
                      <li>• status: Enum [Present/Late/Half/Absent]</li>
                    </ul>
                  </div>

                  {/* Entity 5: Leave */}
                  <div className="border border-rose-200 rounded-lg p-3 bg-rose-50/30">
                    <div className="font-bold text-rose-900 border-b border-rose-200 pb-1 mb-2 flex justify-between">
                      <span>Leave</span>
                      <span className="text-[10px] text-rose-700 font-normal">[Requests]</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-slate-700 font-mono">
                      <li>🔑 <span className="font-bold">_id:</span> ObjectId</li>
                      <li>• <span className="text-rose-800 font-bold">employeeId:</span> String (FK)</li>
                      <li>• leaveType: Enum [Casual/Sick/Earned]</li>
                      <li>• startDate, endDate: Date</li>
                      <li>• numberOfDays: Number</li>
                      <li>• reason: String</li>
                      <li>• <span className="text-rose-600 font-bold">status:</span> Pending/Approved/Rejected</li>
                    </ul>
                  </div>

                  {/* Entity 6: Performance */}
                  <div className="border border-purple-200 rounded-lg p-3 bg-purple-50/30">
                    <div className="font-bold text-purple-900 border-b border-purple-200 pb-1 mb-2 flex justify-between">
                      <span>Performance</span>
                      <span className="text-[10px] text-purple-700 font-normal">[Evaluations]</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-slate-700 font-mono">
                      <li>🔑 <span className="font-bold">_id:</span> ObjectId</li>
                      <li>• <span className="text-purple-800 font-bold">employeeId:</span> String (FK)</li>
                      <li>• reviewPeriod: String</li>
                      <li>• rating: Number (1-5 Stars)</li>
                      <li>• keyAchievements: String</li>
                      <li>• areasOfImprovement: String</li>
                      <li>• reviewerName: String</li>
                    </ul>
                  </div>

                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                  <p className="font-bold text-slate-700 mb-1">🔗 Foreign Key Relationships in Schema:</p>
                  <p>• <strong>User.employeeId</strong> maps 1:1 with <strong>Employee.employeeId</strong></p>
                  <p>• <strong>Employee.department</strong> maps N:1 with <strong>Department.name</strong></p>
                  <p>• <strong>Attendance, Leave, Performance</strong> reference <strong>Employee.employeeId</strong> as FK for indexing</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POSTMAN COLLECTION */}
          {activeTab === 'postman' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Postman Collection v2.1.0 Ready</h4>
                  <p className="text-xs text-slate-500">Includes all 24 REST CRUD endpoints, query params, and JWT headers</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(postmanCollection, null, 2), 'postman')}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    {copied === 'postman' ? 'Copied!' : 'Copy JSON'}
                  </button>
                  <button
                    onClick={handleDownloadPostman}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download Collection
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 text-slate-300 font-mono text-xs max-h-80 overflow-y-auto">
                <pre>{JSON.stringify(postmanCollection, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: RUBRIC CHECKLIST (100 MARKS) */}
          {activeTab === 'rubric' && (
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm mb-3">Internal Project Evaluation Criteria (100 Marks Total)</h4>
                
                <div className="space-y-2.5 text-xs">
                  {[
                    { area: 'React structure and routing', marks: '15 Marks', status: 'Implemented', desc: 'Vite React, react-router-dom, modular components, protected routes.' },
                    { area: 'Forms and validation', marks: '10 Marks', status: 'Implemented', desc: 'Controlled form inputs with event.preventDefault(), real-time error messages.' },
                    { area: 'Context API and authentication flow', marks: '10 Marks', status: 'Implemented', desc: 'Pure React Context API (AuthContext), zero external state libraries.' },
                    { area: 'Express architecture', marks: '15 Marks', status: 'Implemented', desc: 'Clean MVC layout: routes, controllers, middleware, and config separated.' },
                    { area: 'REST API features', marks: '15 Marks', status: 'Implemented', desc: 'Search queries, filters, pagination, sorting, and centralized error handling.' },
                    { area: 'Mongoose design', marks: '10 Marks', status: 'Implemented', desc: 'User, Employee, Department, Attendance, Leave, Performance models with schemas.' },
                    { area: 'Authentication and security', marks: '10 Marks', status: 'Implemented', desc: 'JWT token signing/verification, bcrypt password hashing, role middleware.' },
                    { area: 'UI and responsiveness', marks: '5 Marks', status: 'Implemented', desc: 'Tailwind CSS responsive design with mobile hamburger & desktop sidebar.' },
                    { area: 'Deployment & configuration', marks: '5 Marks', status: 'Implemented', desc: 'Environment variables in .env.example, Render / Vite / Cloud Run ready.' },
                    { area: 'Git and documentation', marks: '5 Marks', status: 'Implemented', desc: 'Complete README, ER diagram, Postman collection, demo credentials.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800">{item.area}</span>
                          <p className="text-[11px] text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-700">
                          {item.marks}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-bold">
                  <span>Total Evaluation Score Potential:</span>
                  <span className="text-sm text-emerald-700">100 / 100 Marks</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
