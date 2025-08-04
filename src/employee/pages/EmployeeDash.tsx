
// src/pages/EmployeeDash.tsx

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useClerk, useSignIn } from '../../contexts/clerkHooks';
// import { se } from 'date-fns/locale'; // removed unused import

const EmployeeDash: React.FC = () => {
  const { user } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardStats, setDashboardStats] = useState<any>({});
  const [meetingSchedule, setMeetingSchedule] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [errorMeetings, setErrorMeetings] = useState<string | null>(null);

  // Remove action state, not needed for toggle logic
  const [message, setMessage] = useState('');
  const [todayAttendance, setTodayAttendance] = useState<{clockIn?: string, clockOut?: string} | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  // Removed isOpen, not needed for button logic

  // Fetch today's attendance record for the logged-in user
  const fetchTodayAttendance = () => {
    if (!user?.employeeId) return;
    setAttendanceLoading(true);
    fetch(`http://127.0.0.1:8000/api/attendance/?employee_id=${user.employeeId}&date=${new Date().toISOString().slice(0, 10)}`)
      .then(res => res.json())
      .then(data => {
        // Expecting a single record for today
        if (data && data.length > 0) {
          setTodayAttendance({ clockIn: data[0].clock_in, clockOut: data[0].clock_out });
        } else {
          setTodayAttendance({});
        }
      })
      .catch(() => setTodayAttendance(null))
      .finally(() => setAttendanceLoading(false));
  };

  useEffect(() => {
    fetchTodayAttendance();
    // eslint-disable-next-line
  }, [message, user?.employeeId]);

  // ⏰ Clock update
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 📊 Fetch dashboard stats
  useEffect(() => {
    if (!user?.employeeId) return;
    setLoadingStats(true);
    setErrorStats(null);
    fetch(`/api/dashboard/?employee_id=${user.employeeId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        return res.json();
      })
      .then(data => setDashboardStats(data))
      .catch(err => setErrorStats(err.message))
      .finally(() => setLoadingStats(false));
  }, [message, user?.employeeId]);

  // 📅 Fetch meeting schedule
  useEffect(() => {
    if (!user?.employeeId) return;
    setLoadingMeetings(true);
    setErrorMeetings(null);
    fetch(`http://127.0.0.1:8000/api/meetings/?employeeId=${user.employeeId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch meeting schedule');
        return res.json();
      })
      .then(data => setMeetingSchedule(data))
      .catch(err => setErrorMeetings(err.message))
      .finally(() => setLoadingMeetings(false));
  }, [user?.employeeId]);

  // ⏱️ Mark clock-in
  const { signOut } = useClerk();
  const { isLoaded, signIn } = useSignIn();
  const handleClockIn = () => {
    // removed setDisableClockIn(true); button is always enabled
    if (!user?.employeeId) {
      setMessage('No employee found.');
      // removed setDisableClockIn(false); button is always enabled
      return;
    }
    // Prevent multiple clock-ins per day
    if (todayAttendance?.clockIn) {
      setMessage('You have already clocked in today.');
      // removed setDisable(false); now using setDisableClockIn/setDisableClockOut
      return;
    }
   
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    fetch('http://127.0.0.1:8000/api/attendance/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee: Number(user.employeeId),
        date: today,
        status: 'Present',
        clock_in: now
      }),
    })
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          if (contentType && contentType.includes('application/json')) {
            const errJson = await res.json();
            throw new Error(errJson.error || JSON.stringify(errJson));
          } else {
            const errText = await res.text();
            throw new Error(errText);
          }
        }
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        } else {
          return { message: await res.text() };
        }
      })
      .then(data => {
        setMessage(data.message || 'Clock-in successful!');
        fetchTodayAttendance();


        // Start session after successful clock in if not already signed in
        setTimeout(() => {
          // Prevent duplicate session creation if already signed in
          const clerkAny = window as any;
          if (isLoaded && signIn && !signIn.createdSessionId && !(clerkAny.Clerk && clerkAny.Clerk.session)) {
            signIn.create({});
          }
        }, 500);
      })
      .catch(err => setMessage('Error: ' + err.message))
      .finally(() => {}); // button is always enabled
  };

  // ⏱️ Mark clock-out
  const handleClockOut = () => {
    // removed setDisableClockOut(true); button is always enabled
    if (!user?.employeeId) {
      setMessage('No employee found.');
      // removed setDisableClockOut(false); button is always enabled
      return;
    }
    // Prevent multiple clock-outs per day
    if (!todayAttendance?.clockIn) {
      setMessage('You must clock in before clocking out.');

      // removed setDisable(false); now using setDisableClockIn/setDisableClockOut
      return;
    }
    if (todayAttendance?.clockOut) {
      setMessage('You have already clocked out today.');
      // removed setDisable(false); now using setDisableClockIn/setDisableClockOut
      return;
    }
    
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    fetch('http://127.0.0.1:8000/api/attendance/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee: Number(user.employeeId),
        date: today,
        status: 'Present',
        clock_out: now
      }),
    })
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          if (contentType && contentType.includes('application/json')) {
            const errJson = await res.json();
            throw new Error(errJson.error || JSON.stringify(errJson));
          } else {
            const errText = await res.text();
            throw new Error(errText);
          }
        }
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        } else {
          return { message: await res.text() };
        }
      })
      .then(data => {
        setMessage(data.message || 'Clock-out successful!');
        // Fetch latest attendance so employee sees their record before logout
        fetchTodayAttendance();
        // End session only after successful clock out
        setTimeout(() => {
          signOut();
        }, 1000);
      })
      .catch(err => setMessage('Error: ' + err.message))
      .finally(() => {}); // button is always enabled
  };
  // No need to fetch employeeId, use user context

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Employee Dashboard</h1>

      {/* 🔹 Attendance Section */}
      <div className="bg-white rounded-2xl p-6 shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
        <p className="mb-2">Office Time: <strong>09:00AM to 06:00PM</strong></p>
        {/*
          Clock In: Enabled if not clocked in today. Disabled after clock in.
          Clock Out: Enabled only after clock in, and only once per day. After clock out, logs out the user (ends session).
        */}
        <div className="flex items-center gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClockIn}
            disabled={!!todayAttendance?.clockIn}
          >
            Clock In
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClockOut}
            disabled={!todayAttendance?.clockIn || !!todayAttendance?.clockOut}
          >
            Clock Out
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-700">
          {attendanceLoading ? 'Loading attendance...' : (
            <>
              <span>Today: </span>
              <span className="font-mono">Clock In: {todayAttendance?.clockIn || '--:--'}</span>
              <span className="mx-2">|</span>
              <span className="font-mono">Clock Out: {todayAttendance?.clockOut || '--:--'}</span>
            </>
          )}
        </div>
        <div className="mt-4 text-xl">
          <span className="font-medium">Current Time:</span>{' '}
          <span className="font-mono text-2xl">{currentTime.toLocaleTimeString()}</span>
        </div>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>

      {/* 🔹 Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loadingStats ? (
          <div className="col-span-3 flex justify-center items-center h-24">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
            <span className="ml-3">Loading stats...</span>
          </div>
        ) : errorStats ? (
          <div className="col-span-3 text-red-600 text-center">Error: {errorStats}</div>
        ) : (
          <>
            <div className="bg-white p-4 rounded-2xl shadow">
              <h3 className="text-gray-600">Total Leaves</h3>
              <p className="text-3xl font-bold">{dashboardStats.totalLeaves || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow">
              <h3 className="text-gray-600">Present Days</h3>
              <p className="text-3xl font-bold">{dashboardStats.presentDays || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow">
              <h3 className="text-gray-600">Total Hours</h3>
              <p className="text-3xl font-bold">{dashboardStats.totalHours || 0}</p>
            </div>
          </>
        )}
      </div>

      {/* 🔹 Meeting Schedule */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Meeting Schedule</h2>
        {loadingMeetings ? (
          <div className="flex justify-center items-center h-24">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
            <span className="ml-3">Loading meetings...</span>
          </div>
        ) : errorMeetings ? (
          <div className="text-red-600 text-center">Error: {errorMeetings}</div>
        ) : meetingSchedule.length === 0 ? (
          <p>No meetings scheduled.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Meeting Title</th>
                <th className="p-2 text-left">Meeting Date</th>
                <th className="p-2 text-left">Meeting Time</th>
              </tr>
            </thead>
            <tbody>
              {meetingSchedule.map((meeting, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{meeting.title}</td>
                  <td className="p-2">{meeting.date}</td>
                  <td className="p-2">{meeting.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeDash;
