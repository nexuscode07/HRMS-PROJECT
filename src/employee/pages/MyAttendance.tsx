import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import Card from '../components/common/Card';
import { useApp } from '../context/AppContext';

const MyAttendance: React.FC = () => {
  const { user } = useApp();
  // Debug: log user and employeeId
  console.log('User from context:', user);
  console.log('user.employeeId:', user?.employeeId);
  type AttendanceRecord = {
    date: string;
    clock_in?: string;
    clock_out?: string;
    hours?: number;
    status: string;
  };
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  // ...existing code...
  // Calculate summary stats
  // ...existing code...
  // Persist clock-in/out state for today in localStorage
  // ...existing code...
  // ...existing code...
  // ...existing code...

  // Fetch attendance records
  const fetchAttendance = async () => {
    if (!user?.employeeId) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/attendance/?employee_id=${user.employeeId}`);
      if (!res.ok) {
        const text = await res.text();
        console.error('Attendance fetch failed:', text);
        setAttendanceData([]);
        return;
      }
      const data = await res.json();
      console.log('Fetched attendance data:', data);
      setAttendanceData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Attendance fetch error:', err);
      setAttendanceData([]);
    }
  };

  // Calculate summary stats
  // ...existing code...
  const totalHours = attendanceData.reduce((sum, rec) => sum + (rec.hours || 0), 0);
  const presentDays = attendanceData.filter((rec) => rec.status.toLowerCase() === 'present').length;
  const lateDays = attendanceData.filter((rec) => rec.status.toLowerCase() === 'late').length;
  const absentDays = attendanceData.filter((rec) => rec.status.toLowerCase() === 'absent').length;



  // ...existing code...



  useEffect(() => {
    fetchAttendance();
  }, [user]);

  // Check-in logic removed as requested
  // (Removed duplicate/broken useEffect)


  const getStatusBadge = (status: string) => {
    const statusClasses = {
      present: 'bg-green-100 text-green-800',
      late: 'bg-yellow-100 text-yellow-800',
      absent: 'bg-red-100 text-red-800',
    };
    const statusKey = status.toLowerCase();
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[statusKey as keyof typeof statusClasses] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{totalHours}</p>
              <p className="text-sm text-black">Total Hours</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{presentDays}</p>
              <p className="text-sm text-black">Present Days</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{lateDays}</p>
              <p className="text-sm text-black">Late Days</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{absentDays}</p>
              <p className="text-sm text-black">Absent Days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ...existing code... */}

      {/* Attendance Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-semibold text-left text-black">Date</th>
                <th className="px-4 py-3 font-semibold text-left text-black">Clock In</th>
                <th className="px-4 py-3 font-semibold text-left text-black">Clock Out</th>
                <th className="px-4 py-3 font-semibold text-left text-black">Hours</th>
                <th className="px-4 py-3 font-semibold text-left text-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-white">
                    <td className="px-4 py-3 text-black">{record.date}</td>
                    <td className="px-4 py-3 text-black">{record.clock_in || '-'}</td>
                    <td className="px-4 py-3 text-black">{record.clock_out || '-'}</td>
                    <td className="px-4 py-3 text-black">{record.hours ?? '-'}</td>
                    <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MyAttendance;
