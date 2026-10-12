import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Dashboards
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { TraineeDashboard } from './pages/dashboards/TraineeDashboard';
import { TrainerDashboard } from './pages/dashboards/TrainerDashboard';

// Courses
import { CourseCatalogue } from './pages/courses/CourseCatalogue';
import { CourseDetails } from './pages/courses/CourseDetails';
import { CoursePlayer } from './pages/courses/CoursePlayer';
import { CourseManagement } from './pages/courses/CourseManagement';
import { MyLearning } from './pages/courses/MyLearning';

// Assessments
import { AssessmentList } from './pages/assessments/AssessmentList';
import { AssessmentTake } from './pages/assessments/AssessmentTake';
import { AssessmentResult } from './pages/assessments/AssessmentResult';

// Modules
import { CompetencyMapping } from './pages/competency/CompetencyMapping';
import { TrainerLibrary } from './pages/resources/TrainerLibrary';
import { Certifications } from './pages/certifications/Certifications';
import { Announcements } from './pages/announcements/Announcements';
import { FeedbackModule } from './pages/feedback/FeedbackModule';
import { ReportsAnalytics } from './pages/reports/ReportsAnalytics';
import { UserManagement } from './pages/users/UserManagement';
import { ProfileSettings } from './pages/profile/ProfileSettings';

// Dynamic role-based dashboard router
const DashboardDispatcher: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'admin') return <AdminDashboard />;
  if (currentUser.role === 'trainer') return <TrainerDashboard />;
  return <TraineeDashboard />;
};

// Route protection wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Portal Routes inside DashboardLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Main Role-Aware Dashboard */}
              <Route path="/" element={<DashboardDispatcher />} />

              {/* Course Views */}
              <Route path="/catalogue" element={<CourseCatalogue />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/courses/:id/learn" element={<CoursePlayer />} />
              <Route path="/courses/manage" element={<CourseManagement />} />
              <Route path="/my-learning" element={<MyLearning />} />

              {/* Assessments */}
              <Route path="/assessments" element={<AssessmentList />} />
              <Route path="/assessments/:id/take" element={<AssessmentTake />} />
              <Route path="/assessments/:id/results" element={<AssessmentResult />} />

              {/* Specialized Modules */}
              <Route path="/competencies" element={<CompetencyMapping />} />
              <Route path="/library" element={<TrainerLibrary />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/feedback" element={<FeedbackModule />} />
              <Route path="/reports" element={<ReportsAnalytics />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<ProfileSettings />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
