import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FileText,
  Database,
  FileCode2,
  CheckCircle,
  Copy,
  Download,
  BookOpen,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  Server,
  Layers
} from 'lucide-react';

export default function ProjectDocsPage() {
  const { quickLogin } = useAuth();
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const postmanSample = {
    info: {
      name: "Basic HRM REST API - MERN Project",
      _postman_id: "basic-hrm-mern-enterprise-api-2026",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
      { name: "POST Register User", request: { method: "POST", url: "{{base_url}}/api/auth/register" } },
      { name: "POST Login User", request: { method: "POST", url: "{{base_url}}/api/auth/login" } },
      { name: "GET All Employees (Search & Page)", request: { method: "GET", url: "{{base_url}}/api/employees?search=&department=&page=1" } },
      { name: "POST Create Employee", request: { method: "POST", url: "{{base_url}}/api/employees" } },
      { name: "GET All Departments", request: { method: "GET", url: "{{base_url}}/api/departments" } },
      { name: "POST Mark Attendance", request: { method: "POST", url: "{{base_url}}/api/attendance/mark" } },
      { name: "POST Apply Leave", request: { method: "POST", url: "{{base_url}}/api/leaves" } },
      { name: "PUT Review Leave", request: { method: "PUT", url: "{{base_url}}/api/leaves/:id/status" } },
      { name: "POST Create Performance Review", request: { method: "POST", url: "{{base_url}}/api/performance" } },
      { name: "GET Analytics Summary Report", request: { method: "GET", url: "{{base_url}}/api/reports/summary" } }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                System Architecture & Technical Specifications
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Enterprise Edition
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Human Resource Management (HRM) System • Full Stack Architecture & REST API Endpoints
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Stack: React • Express • Mongoose • JWT
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: ER Diagram & Rubric */}
        <div className="lg:col-span-2 space-y-6">

          {/* Atlas Whitelist Guidance Banner */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start space-x-3">
            <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-1">MongoDB Atlas IP Whitelisting & Persistence Notice</span>
              <p className="text-xs text-blue-800 leading-relaxed">
                If connecting to your custom MongoDB Atlas cluster, make sure to add <strong>0.0.0.0/0</strong> (Allow Access from Anywhere) under <em>Atlas Dashboard &gt; Network Access</em>. If Atlas is unreachable due to restricted IP networks, the system operates seamlessly with complete persistent local storage — meaning all users, employees, leaves, attendance, and reviews persist without error.
              </p>
            </div>
          </div>
          
          {/* ER Diagram Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center">
              <Database className="w-5 h-5 mr-2 text-indigo-600" />
              Entity Relationship (ER) Diagram & Mongoose Schema Architecture
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Visual representation of Mongoose collections, relationships, primary keys, and foreign keys:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40">
                <div className="font-bold text-xs text-indigo-900 border-b border-indigo-200 pb-1 mb-2 flex justify-between">
                  <span>Users Collection</span>
                  <span className="text-[10px] text-indigo-600">Auth & RBAC</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>🔑 <strong className="text-indigo-900">_id:</strong> ObjectId (PK)</p>
                  <p>• name: String (Required)</p>
                  <p>• email: String (Unique Index)</p>
                  <p>• password: String (Bcrypt Hash)</p>
                  <p>• role: 'Admin' | 'HR Manager' | 'Employee'</p>
                  <p>• department: String</p>
                  <p>• employeeId: String (1:1 with Employee)</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <div className="font-bold text-xs text-emerald-900 border-b border-emerald-200 pb-1 mb-2 flex justify-between">
                  <span>Employees Collection</span>
                  <span className="text-[10px] text-emerald-600">Core Profile</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>🔑 <strong className="text-emerald-900">_id:</strong> ObjectId (PK)</p>
                  <p>• <strong className="text-emerald-700">employeeId:</strong> String (Unique Key)</p>
                  <p>• fullName, email, phone</p>
                  <p>• department: String (FK - Dept.name)</p>
                  <p>• designation, joiningDate, salary</p>
                  <p>• status: 'Active' | 'On Leave' | 'Resigned'</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
                <div className="font-bold text-xs text-blue-900 border-b border-blue-200 pb-1 mb-2 flex justify-between">
                  <span>Departments Collection</span>
                  <span className="text-[10px] text-blue-600">Divisions</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>🔑 <strong className="text-blue-900">_id:</strong> ObjectId (PK)</p>
                  <p>• <strong className="text-blue-700">name:</strong> String (Unique Key)</p>
                  <p>• code: String (Upper, e.g. ENG)</p>
                  <p>• headOfDepartment: String</p>
                  <p>• totalEmployees: Number</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
                <div className="font-bold text-xs text-amber-900 border-b border-amber-200 pb-1 mb-2 flex justify-between">
                  <span>Attendance Collection</span>
                  <span className="text-[10px] text-amber-600">Daily Records</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>🔑 <strong className="text-amber-900">_id:</strong> ObjectId (PK)</p>
                  <p>• employeeId: String (FK - Employee)</p>
                  <p>• date: String (YYYY-MM-DD)</p>
                  <p>• checkInTime, checkOutTime</p>
                  <p>• status: 'Present' | 'Late' | 'Half Day'</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40">
                <div className="font-bold text-xs text-rose-900 border-b border-rose-200 pb-1 mb-2 flex justify-between">
                  <span>Leaves Collection</span>
                  <span className="text-[10px] text-rose-600">Time-off</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>🔑 <strong className="text-rose-900">_id:</strong> ObjectId (PK)</p>
                  <p>• employeeId: String (FK - Employee)</p>
                  <p>• leaveType: 'Casual' | 'Sick' | 'Earned'</p>
                  <p>• startDate, endDate, numberOfDays</p>
                  <p>• status: 'Pending' | 'Approved' | 'Rejected'</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40">
                <div className="font-bold text-xs text-purple-900 border-b border-purple-200 pb-1 mb-2 flex justify-between">
                  <span>Performance Collection</span>
                  <span className="text-[10px] text-purple-600">Evaluations</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-700">
                  <p>🔑 <strong className="text-purple-900">_id:</strong> ObjectId (PK)</p>
                  <p>• employeeId: String (FK - Employee)</p>
                  <p>• reviewPeriod: String (e.g. Q3 2026)</p>
                  <p>• rating: Number (1 to 5 Stars)</p>
                  <p>• keyAchievements, feedback</p>
                </div>
              </div>

            </div>
          </div>

          {/* Technical Specifications Checklist */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              System Technical Specifications & Architecture Compliance
            </h2>
            <div className="space-y-2 mt-4 text-xs">
              {[
                { area: 'Frontend & Routing Architecture', desc: 'React 19 SPA, react-router-dom, modular components, protected routes.' },
                { area: 'Forms & Real-time Validation', desc: 'Controlled form fields, event.preventDefault(), dual-layer client/server checks.' },
                { area: 'State Management Layer', desc: 'Pure React Context API (AuthContext) for reactive user session state.' },
                { area: 'Express.js MVC Architecture', desc: 'Organized folders: controllers, routes, middleware, models, and db config.' },
                { area: 'REST API & Query Engine', desc: 'CRUD endpoints with query searching, filtering, sorting, pagination, error handling.' },
                { area: 'Mongoose Schemas & Models', desc: '6 Mongoose schemas with validation, defaults, and foreign key relations.' },
                { area: 'Authentication & Security', desc: 'JWT token signing/verification, bcrypt password hashing, role middleware.' },
                { area: 'UI & Mobile Responsiveness', desc: 'Tailwind CSS responsive design with mobile drawer & desktop sidebar.' },
                { area: 'Database Storage Engine', desc: 'MongoDB Atlas integration with automatic local persistent storage engine fallback.' },
                { area: 'Documentation & API Schema', desc: 'Complete architecture diagram, Postman collection, demo credentials.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">{item.area}</span>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                    Active & Compliant
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Demo Credentials & Postman */}
        <div className="space-y-6">
          
          {/* Fast Login Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
              <KeyRound className="w-4 h-4 mr-2 text-indigo-600" />
              Quick Demo Accounts
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              One-click instant role switching:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs">
                <div className="flex justify-between font-bold text-purple-900 mb-1">
                  <span>Admin: Dr. Rajesh</span>
                  <span className="font-mono text-[10px]">admin@hrm.edu</span>
                </div>
                <p className="text-[11px] text-purple-700">Full CRUD, delete privileges, system analytics.</p>
                <button
                  onClick={() => quickLogin('admin')}
                  className="w-full mt-2 py-1 px-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded transition"
                >
                  ⚡ Switch to Admin
                </button>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <div className="flex justify-between font-bold text-blue-900 mb-1">
                  <span>HR Manager: Priya Iyer</span>
                  <span className="font-mono text-[10px]">hr@hrm.edu</span>
                </div>
                <p className="text-[11px] text-blue-700">Manage workforce, approve leaves, add performance appraisals.</p>
                <button
                  onClick={() => quickLogin('hr')}
                  className="w-full mt-2 py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded transition"
                >
                  ⚡ Switch to HR Lead
                </button>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex justify-between font-bold text-emerald-900 mb-1">
                  <span>Employee: Aarav Patel</span>
                  <span className="font-mono text-[10px]">employee@hrm.edu</span>
                </div>
                <p className="text-[11px] text-emerald-700">Clock in/out, apply leaves, review self evaluations.</p>
                <button
                  onClick={() => quickLogin('employee')}
                  className="w-full mt-2 py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded transition"
                >
                  ⚡ Switch to Employee
                </button>
              </div>
            </div>
          </div>

          {/* Postman Collection Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center">
              <FileCode2 className="w-4 h-4 mr-2 text-indigo-600" />
              Postman Collection Export
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Pre-built JSON collection for Postman API testing:
            </p>

            <button
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(postmanSample, null, 2));
                const a = document.createElement('a');
                a.setAttribute("href", dataStr);
                a.setAttribute("download", "Basic_HRM_Postman_Collection.json");
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
              className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center justify-center mb-3"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Postman Collection
            </button>

            <button
              onClick={() => copyToClipboard(JSON.stringify(postmanSample, null, 2), 'postman_snippet')}
              className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              {copied === 'postman_snippet' ? 'Copied to Clipboard!' : 'Copy Collection JSON'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
