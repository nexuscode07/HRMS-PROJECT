// import { useApp } from '../contexts/AppContext';
import { useApp } from '../employee/context/AppContext';
import React, { useEffect, useState } from 'react';
import { Clock, Calendar, Download, Filter, CheckCircle, XCircle } from 'lucide-react';

type AttendanceSession = {
  checkIn: string;
  checkOut: string;
  hours: string;
  overtime: string;
};

type AttendanceDay = {
  date: string;
  sessions: AttendanceSession[];
  status: string;
};

// Demo/mock data for all employees
const demoAttendance: AttendanceDay[] = [
  {
    date: '2024-06-01',
    sessions: [
      { checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9.0', overtime: '1.0' },
    ],
    status: 'Present',
  },
  {
    date: '2024-06-02',
    sessions: [
      { checkIn: '09:15 AM', checkOut: '05:45 PM', hours: '8.5', overtime: '0.0' },
    ],
    status: 'Present',
  },
  {
    date: '2024-06-03',
    sessions: [
      { checkIn: '-', checkOut: '-', hours: '0.0', overtime: '0.0' }],
    status: 'Absent',
  },
  {
    date: '2024-06-04',
    sessions: [
      { checkIn: '08:45 AM', checkOut: '06:30 PM', hours: '9.75', overtime: '1.75' },
      { checkIn: '07:00 PM', checkOut: '09:00 PM', hours: '2.0', overtime: '2.0' },
    ],
    status: 'Present',
  },
];

export default function Attendance() {
  const { user } = useApp();
  const [attendanceData, setAttendanceData] = useState<AttendanceDay[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [todaySessions, setTodaySessions] = useState<AttendanceSession[]>([]);
  const [checkInDone, setCheckInDone] = useState(false);
  const [checkOutDone, setCheckOutDone] = useState(false);
  const [message, setMessage] = useState<string>("");

  const employeeId = user?.employeeId;
  // Fetch attendance records from backend
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!employeeId) return;
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/attendance/?employee_id=${employeeId}`);
        if (!res.ok) {
          setAttendanceData([]);
          return;
        }
        const data = await res.json();
        // Transform backend data to AttendanceDay[] if needed
        // If backend already returns in correct format, use as is
        // Otherwise, map/convert here
        if (Array.isArray(data)) {
          // Try to convert flat records to AttendanceDay[]
          const grouped = data.reduce((acc, rec) => {
            const date = rec.date;
            if (!acc[date]) acc[date] = { date, sessions: [], status: rec.status };
            acc[date].sessions.push({
              checkIn: rec.clock_in || '-',
              checkOut: rec.clock_out || '-',
              hours: rec.hours ? rec.hours.toString() : '0.0',
              overtime: rec.overtime ? rec.overtime.toString() : '0.0',
            });
            return acc;
          }, {});
          setAttendanceData(Object.values(grouped));
        } else {
          setAttendanceData([]);
        }
      } catch (err) {
        setAttendanceData([]);
      }
    };
    fetchAttendance();
  }, [employeeId]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // Load today's sessions if present
    const todayData = attendanceData.find(d => d.date === today);
    if (todayData) {
      setTodaySessions(todayData.sessions);
      // If at least one session, disable check-in; if at least one session with checkOut, disable check-out
      setCheckInDone(todayData.sessions.length > 0);
      setCheckOutDone(todayData.sessions.length > 0 && todayData.sessions[0].checkOut !== '-');
    } else {
      setTodaySessions([]);
      setCheckInDone(false);
      setCheckOutDone(false);
    }
    setIsCheckedIn(false);
    setCheckInTime(null);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [attendanceData]);

  const handleCheckIn = async () => {
    if (checkInDone) return;
    setIsCheckedIn(true);
    setCheckInTime(currentTime.toLocaleTimeString());
    setCheckInDone(true);
    // Send attendance to backend
    try {
      const response = await fetch("http://127.0.0.1:8000/api/attendance/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee: employeeId,
          date: today,
          status: "Present"
        })
      });
      if (!response.ok) {
        const errText = await response.text();
        if (errText.startsWith('<!DOCTYPE')) {
          setMessage("Error: Internal Server Error (500). Please check backend logs for details.");
          throw new Error("Internal Server Error (500)");
        }
        setMessage("Error: " + errText);
        throw new Error("Failed to submit attendance");
      }
      setMessage("Attendance submitted successfully!");
    } catch (error) {
      setMessage("Attendance error: " + error);
    }
  };

  const handleCheckOut = async () => {
    if (!isCheckedIn || !checkInTime || checkOutDone) return;
    setIsCheckedIn(false);
    setCheckOutDone(true);
    const checkOutTime = currentTime.toLocaleTimeString();
    // Calculate hours and overtime
    const checkInDate = new Date(`${today}T${checkInTime}`);
    const checkOutDate = new Date(`${today}T${checkOutTime}`);
    let diffMs = checkOutDate.getTime() - checkInDate.getTime();
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // handle overnight
    const hours = (diffMs / 1000 / 60 / 60).toFixed(2);
    const overtime = (parseFloat(hours) > 8 ? (parseFloat(hours) - 8).toFixed(2) : '0.0');
    const newSession: AttendanceSession = {
      checkIn: checkInTime,
      checkOut: checkOutTime,
      hours,
      overtime,
    };
    // Update today's sessions
    setTodaySessions([newSession]);
    // Update attendanceData for today
    setAttendanceData(data => {
      const found = data.find(d => d.date === today);
      if (found) {
        return data.map(d => d.date === today ? { ...d, sessions: [newSession], status: 'Present' } : d);
      } else {
        return [...data, { date: today, sessions: [newSession], status: 'Present' }];
      }
    });
    setCheckInTime(null);
    // Send attendance to backend
    try {
      const response = await fetch("http://127.0.0.1:8000/api/attendance/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee: employeeId,
          date: today,
          status: "Present"
        })
      });
      if (!response.ok) {
        const err = await response.json();
        setMessage("Error: " + (err?.employee?.[0] || "Failed to submit attendance"));
        throw new Error("Failed to submit attendance");
      }
      setMessage("Attendance submitted successfully!");
    } catch (error) {
      setMessage("Attendance error: " + error);
    }
  };

  const getStatusIcon = (status: string) =>
    status === 'Present' ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );

  const getStatusColor = (status: string) =>
    status === 'Present' ? 'text-green-600' : 'text-red-600';

  // Calculate stats for all days
  const totalHours = attendanceData.reduce((sum, d) => sum + d.sessions.reduce((s, sess) => s + parseFloat(sess.hours), 0), 0);
  const totalOvertime = attendanceData.reduce((sum, d) => sum + d.sessions.reduce((s, sess) => s + parseFloat(sess.overtime), 0), 0);
  const presentDays = attendanceData.filter(d => d.status === 'Present').length;
  const absentDays = attendanceData.filter(d => d.status === 'Absent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <button className="px-4 py-2 bg-green-600 text-white rounded mb-4" onClick={handleCheckIn}>Check-in</button>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track your daily attendance and working hours</p>
        </div>
        <div className="mt-4 sm:mt-0 text-right">
          <div className="text-2xl font-bold text-gray-900">{currentTime.toLocaleTimeString()}</div>
          <div className="text-sm text-gray-600">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Check-in/Check-out */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Attendance</h3>
              <p className="text-gray-600">Mark your attendance for today (one check-in/out per day)</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleCheckIn}
              className={`flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 ${checkInDone ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={checkInDone}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              className={`flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 ${!isCheckedIn || checkOutDone ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isCheckedIn || checkOutDone}
            >
              <XCircle className="w-5 h-5 mr-2" />
              Check Out
            </button>
          </div>
        </div>
        {isCheckedIn && checkInTime && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              <strong>Checked in at:</strong> {checkInTime}
            </p>
          </div>
        )}
        {/* Show today's session */}
        {/* {todaySessions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Today's Session</h4>
            <ul className="space-y-1">
              {todaySessions.map((s, i) => (
                <li key={i} className="text-sm text-gray-700">
                  <span className="font-medium">Check In:</span> {s.checkIn} &nbsp; <span className="font-medium">Check Out:</span> {s.checkOut} &nbsp; <span className="font-medium">Hours:</span> {s.hours} &nbsp; <span className="font-medium">Overtime:</span> {s.overtime}
                </li>
              ))}
            </ul>
          </div>
        )} */}
        {message && <div className="mt-2 text-red-500">{message}</div>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Hours" value={totalHours.toFixed(1)} icon={<Calendar className="text-blue-600 w-6 h-6" />} />
        <StatsCard title="Present Days" value={presentDays.toString()} icon={<CheckCircle className="text-green-600 w-6 h-6" />} />
        <StatsCard title="Absent Days" value={absentDays.toString()} icon={<XCircle className="text-red-600 w-6 h-6" />} />
        <StatsCard title="Overtime" value={`${totalOvertime.toFixed(1)}h`} icon={<Clock className="text-orange-600 w-6 h-6" />} />
      </div>

      {/* Table: All Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((day, i) =>
                day.sessions.map((session, j) => (
                  <tr key={day.date + '-' + j} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{day.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{j + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{session.checkIn}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{session.checkOut}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{session.hours}h</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{session.overtime}h</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(day.status)}
                        <span className={`ml-2 text-sm font-medium ${getStatusColor(day.status)}`}>
                          {day.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center">
      <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      <div className="ml-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
