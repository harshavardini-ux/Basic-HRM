import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Navbar from './components/common/Navbar.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import SubmissionDocsModal from './components/modals/SubmissionDocsModal.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EmployeesPage from './pages/EmployeesPage.jsx';
import DepartmentsPage from './pages/DepartmentsPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import LeavesPage from './pages/LeavesPage.jsx';
import PerformancePage from './pages/PerformancePage.jsx';
import AnnouncementsPage from './pages/AnnouncementsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import ProjectDocsPage from './pages/ProjectDocsPage.jsx';

// Main App Layout Wrapper with Navbar & Sidebar
function AppLayout({ onOpenDocsModal }: { onOpenDocsModal: () => void }) {
  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      <Navbar onOpenDocsModal={onOpenDocsModal} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route
                path="/dashboard"
                element={<DashboardPage onOpenDocsModal={onOpenDocsModal} />}
              />
              
              <Route
                path="/employees"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'HR Manager']}>
                    <EmployeesPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/departments"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'HR Manager']}>
                    <DepartmentsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/attendance"
                element={<AttendancePage />}
              />
              
              <Route
                path="/leaves"
                element={<LeavesPage />}
              />
              
              <Route
                path="/performance"
                element={<PerformancePage />}
              />
              
              <Route
                path="/announcements"
                element={<AnnouncementsPage />}
              />
              
              <Route
                path="/reports"
                element={<ReportsPage />}
              />
              
              <Route
                path="/docs"
                element={<ProjectDocsPage />}
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              <LoginPage onOpenDocsModal={() => setIsDocsModalOpen(true)} />
            }
          />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'HR Manager', 'Employee']}>
                <AppLayout onOpenDocsModal={() => setIsDocsModalOpen(true)} />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Global Submission & ER Diagram Modal */}
        <SubmissionDocsModal
          isOpen={isDocsModalOpen}
          onClose={() => setIsDocsModalOpen(false)}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
