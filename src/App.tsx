import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 🔹 Admin Pages
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeaveManagement from './pages/LeaveManagement';
import ProfileManagement from './pages/ProfileManagement';
import Attendance from './pages/Attendance';
import EmployeeManagement from './pages/EmployeeManagement';
import Payroll from './pages/Payroll';
import Recruitment from './pages/Recruitment';
import Settings from './pages/Settings';
import NotificationsPage from './pages/NotificationsPage';

// 🔹 Common
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider, useApp } from './employee/context/AppContext';
import { MeetingProvider } from './contexts/MeetingContext';

// 🔹 Employee Layout & Pages
import Header from './employee/components/layout/Header';
import Sidebar from './employee/components/layout/Sidebar';
import EmployeeDash from './employee/pages/EmployeeDash';
import Profile from './employee/pages/Profile';
import MyAttendance from './employee/pages/MyAttendance';
import Payment from './employee/pages/Payment';
import Leave from './employee/pages/Leave';
import EmployeeSetting from './employee/pages/EmployeeSetting';

// 🔹 Employee Layout Component
const EmployeeLayout: React.FC = () => {
  const { darkMode } = useApp();

  return (
    <div className={`min-h-screen ${darkMode ? 'white' : 'white'}`}>
      <div className="min-h-screen bg-white dark:bg-white">
        <Header />
        <div className="flex h-[calc(100vh-80px)]">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="" element={<EmployeeDash />} />
              <Route path="profile" element={<Profile />} />
              <Route path="attendance" element={<MyAttendance />} />
              <Route path="payment" element={<Payment />} />
              <Route path="leave" element={<Leave />} />
              <Route path="settings" element={<EmployeeSetting />} />
              <Route path="*" element={<Navigate to="/employee" />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

// 🔹 Main Route Logic
import { useUser } from './contexts/clerkHooks';
function AppRoutes() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  let routes;

  if (!isSignedIn) {
    routes = (
      <>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </>
    );
  } else if (user?.primaryEmailAddress?.emailAddress === undefined) {
    // Clerk user state is not yet available, show loading
    return <div>Loading user...</div>;
  } else if (user?.primaryEmailAddress?.emailAddress === 'admin@hrms.com') {
    routes = (
      <>
        {/* Redirect / to /dashboard for admin */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          {/* Profile Management is available for admin and can be reused anywhere */}
          <Route path="profile-management" element={<ProfileManagement />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="employee-management" element={<EmployeeManagement />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notificationspage" element={<NotificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </>
    );
  } else {
    routes = (
      <>
        {/* Redirect / to /employee for employees */}
        <Route path="/" element={<Navigate to="/employee" replace />} />
        <Route path="/employee/*" element={<EmployeeLayout />} />
        <Route path="*" element={<Navigate to="/employee" />} />
      </>
    );
  }

  return <Routes>{routes}</Routes>;
}

// 🔹 Root App
function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MeetingProvider>
          <AppRoutes />
        </MeetingProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
// ------------------------------------------------------
// import React from 'react';
// import { Outlet } from 'react-router-dom';

// const Layout: React.FC = () => {
//   return (
//     <div>
//       {/* Your layout header/sidebar/etc here */}
//       <Outlet />
//     </div>
//   );
// };

// export default Layout;
