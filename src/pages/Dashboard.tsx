import { useState, useEffect } from 'react';
import { useApp } from '../employee/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useMeeting } from '../contexts/MeetingContext';
import {
  Stat,
  Meeting,
  Absent,
  // Notification,
  Announcement,
  ChartData
} from '../employee/types';
// Removed demoData imports. Will use API fetches below.
import { Users, UserX, FolderOpen, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';


// --- Components ---
// (All component definitions moved below Dashboard)


interface Notification {
  name: string;
  message: string;
  time: string;
  action: string;
}


const Dashboard = () => {
  const { user } = useApp();
  // Clock In/Out logic
  // Clock In/Out state persisted for today
  const todayKey = 'attendance-' + new Date().toISOString().slice(0, 10);
  const getInitialClockState = () => {
    const data = localStorage.getItem(todayKey);
    if (!data) return { in: false, out: false, inTime: null, outTime: null };
    try {
      return JSON.parse(data);
    } catch {
      return { in: false, out: false, inTime: null, outTime: null };
    }
  };
  const [loading, setLoading] = useState(false);
  const [isClockingOut, setIsClockingOut] = useState(false);
  const [clockedIn, setClockedIn] = useState(getInitialClockState().in);
  const [clockedOut, setClockedOut] = useState(getInitialClockState().out);
  const [clockInTime, setClockInTime] = useState<string | null>(getInitialClockState().inTime);
  const [clockOutTime, setClockOutTime] = useState<string | null>(getInitialClockState().outTime);

  // UI state
  const alreadyClockedIn = clockedIn && !clockedOut;
  const alreadyClockedOut = clockedIn && clockedOut;
  const todayClockIn = clockInTime;
  const todayClockOut = clockOutTime;

  const handleClockIn = async () => {
    setLoading(true);
    const now = new Date().toLocaleTimeString();
    setClockedIn(true);
    setClockedOut(false);
    setClockInTime(now);
    setClockOutTime(null);
    localStorage.setItem(todayKey, JSON.stringify({ in: true, out: false, inTime: now, outTime: null }));
    try {
      const res = await fetch('http://127.0.0.1:8000/api/employee/clock-in/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee: user?.employeeId,
          date: new Date().toISOString().slice(0, 10),
          status: 'Present',
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert('Failed to mark attendance: ' + (errorData.error || JSON.stringify(errorData)));
        setLoading(false);
        setClockedIn(false);
        setClockInTime(null);
        localStorage.setItem(todayKey, JSON.stringify({ in: false, out: false, inTime: null, outTime: null }));
        return;
      }
      alert('Attendance recorded and sent to admin!');
    } catch (err) {
      alert('Error marking attendance: ' + (err?.message || err));
      setClockedIn(false);
      setClockInTime(null);
      localStorage.setItem(todayKey, JSON.stringify({ in: false, out: false, inTime: null, outTime: null }));
    }
    setLoading(false);
  };

  const handleClockOut = async () => {
    setIsClockingOut(true);
    const now = new Date().toLocaleTimeString();
    setClockedOut(true);
    setClockOutTime(now);
    localStorage.setItem(todayKey, JSON.stringify({ in: true, out: true, inTime: clockInTime, outTime: now }));
    try {
      const res = await fetch('http://127.0.0.1:8000/api/employee/clock-out/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee: user?.employeeId,
          date: new Date().toISOString().slice(0, 10),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert('Failed to mark clock out: ' + (errorData.error || JSON.stringify(errorData)));
        setIsClockingOut(false);
        setClockedOut(false);
        setClockOutTime(null);
        localStorage.setItem(todayKey, JSON.stringify({ in: true, out: false, inTime: clockInTime, outTime: null }));
        return;
      }
      alert('Clock out recorded!');
    } catch (err) {
      alert('Error marking clock out: ' + (err?.message || err));
      setClockedOut(false);
      setClockOutTime(null);
      localStorage.setItem(todayKey, JSON.stringify({ in: true, out: false, inTime: clockInTime, outTime: null }));
    }
    setIsClockingOut(false);
  };
  const { setShowMeetings } = useMeeting();
  const [statsData, setStatsData] = useState<Stat[]>([]);
  const [meetingSchedule, setMeetingSchedule] = useState<Meeting[]>([]);
  const [absentToday, setAbsentToday] = useState<Absent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  // Fetch all dashboard data from API
  useEffect(() => {
    // Employees
    fetch('http://127.0.0.1:8000/api/employees/')
      .then(res => res.json())
      .then(data => {
        setStatsData(prev => ([
          ...prev.filter(s => s.title !== 'Employees'),
          { title: 'Employees', value: data.length, change: '', changeType: '', subtitle: '', icon: 'Users', color: 'bg-blue-100 text-blue-700' }
        ]));
      });
    // Meetings
    fetch('http://127.0.0.1:8000/api/meetings/')
      .then(res => res.json())
      .then(setMeetingSchedule);
    // Absent
    fetch('http://127.0.0.1:8000/api/attendance/?status=absent')
      .then(res => res.json())
      .then(setAbsentToday);
    // Notifications
    fetch('http://127.0.0.1:8000/api/notifications/')
      .then(res => res.json())
      .then(setNotifications);
    // Announcements
    fetch('http://127.0.0.1:8000/api/announcements/')
      .then(res => res.json())
      .then(setAnnouncements);
    // Chart Data (removed)
  }, []);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<Announcement>({
    title: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const handleAddAnnouncement = () => {
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowAnnouncementModal(false);
    setNewAnnouncement({ title: '', startDate: '', endDate: '', description: '' });
  };

  const handleDeleteAnnouncement = (idx: number) => {
    setDeleteIdx(idx);
  };

  const confirmDeleteAnnouncement = () => {
    if (deleteIdx !== null) {
      setAnnouncements(prev => prev.filter((_, i) => i !== deleteIdx));
      setDeleteIdx(null);
    }
  };

  const cancelDeleteAnnouncement = () => {
    setDeleteIdx(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-end mb-4">
        {/* Clock In/Out UI */}
        {!alreadyClockedIn && (
          <button
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleClockIn}
            disabled={loading}
          >
            <Clock className="w-5 h-5 mr-2" />
            {loading ? 'Marking...' : 'Clock In'}
          </button>
        )}
        {alreadyClockedIn && !alreadyClockedOut && todayClockIn && (
          <>
            <span className="font-semibold text-green-700 mr-4">Clocked in at {todayClockIn}</span>
            <button
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded"
              onClick={handleClockOut}
              disabled={isClockingOut}
            >
              <Clock className="w-5 h-5 mr-2" />
              {isClockingOut ? 'Marking...' : 'Clock Out'}
            </button>
          </>
        )}
        {alreadyClockedIn && alreadyClockedOut && todayClockIn && todayClockOut && (
          <>
            <span className="font-semibold text-green-700 mr-4">Clocked in at {todayClockIn}, Clocked out at {todayClockOut}</span>
            <button
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => {
                setClockedIn(false);
                setClockedOut(false);
                setClockInTime(null);
                setClockOutTime(null);
                localStorage.removeItem(todayKey);
              }}
            >
              <Clock className="w-5 h-5 mr-2" />
              Clock In
            </button>
          </>
        )}
      </div>
      <StatsCards statsData={statsData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MeetingSchedule meetings={meetingSchedule} onShowAll={() => setShowMeetings(true)} />
        <CalendarCard />
        <AbsentToday absent={absentToday} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Notifications notifications={notifications} />
      </div>
      <Announcements 
        announcements={announcements} 
        onAddClick={() => setShowAnnouncementModal(true)}
        onDeleteClick={handleDeleteAnnouncement}
      />

      {/* Modal for adding announcement */}
      {/* Delete confirmation dialog */}
      {deleteIdx !== null && announcements[deleteIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Delete Announcement</h2>
            <p className="mb-2">Are you sure you want to delete this announcement?</p>
            <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
              <div className="font-semibold">{announcements[deleteIdx].title}</div>
              <div className="text-xs text-gray-500">{announcements[deleteIdx].startDate} - {announcements[deleteIdx].endDate}</div>
              <div className="text-sm mt-1">{announcements[deleteIdx].description}</div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={cancelDeleteAnnouncement}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmDeleteAnnouncement}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Announcement</h2>
            <div className="space-y-3">
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="date"
                placeholder="Start Date"
                value={newAnnouncement.startDate}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, startDate: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                type="date"
                placeholder="End Date"
                value={newAnnouncement.endDate}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, endDate: e.target.value })}
              />
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Description"
                value={newAnnouncement.description}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowAnnouncementModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddAnnouncement} disabled={!newAnnouncement.title || !newAnnouncement.startDate || !newAnnouncement.endDate || !newAnnouncement.description}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- All subcomponents below ---
function StatsCards({ statsData }: { statsData: Stat[] }) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'UserX': return UserX;
      case 'FolderOpen': return FolderOpen;
      case 'CheckCircle': return CheckCircle;
      default: return Users;
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData?.map((stat) => {
        const Icon = getIconComponent(stat.icon);
        return (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
                  <span className="text-xs text-gray-500 ml-1">{stat.subtitle}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MeetingSchedule({ meetings, onShowAll }: { meetings: Meeting[], onShowAll: () => void }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Meeting Schedule</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium" onClick={onShowAll}>View All</button>
      </div>
      <div className="space-y-4">
        {meetings?.slice(0, 5).map((meeting) => (
          <div key={meeting.title + meeting.date + meeting.time} className="flex items-center justify-between py-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
              <p className="text-xs text-gray-500">{meeting.date}</p>
            </div>
            <span className="text-xs text-gray-600">{meeting.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarCard() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-1 text-center"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && currentMonth === today.getMonth();
    days.push(
      <div key={`day-${i}`} className={`p-1 text-center ${isToday ? 'bg-blue-600 text-white rounded' : ''}`}>{i}</div>
    );
  }
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">month</button>
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">week</button>
          <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md">day</button>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">{today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p className="text-lg font-semibold text-gray-900">{today.toLocaleDateString('en-US', { weekday: 'long' })}</p>
        <div className="mt-4 space-y-2">
          <div className="text-xs text-gray-500">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={day + idx} className="p-1 text-center">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{days}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AbsentToday({ absent }: { absent: Absent[] }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Absent Today</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
      </div>
      <div className="space-y-3">
        {absent?.map((person, idx) => (
          <div key={person.name + '-' + idx} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{person.name}</span>
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">{person.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderOverview({ chartData }: { chartData: ChartData[] }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Overview</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Project</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Task</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="Project" fill="#3B82F6" />
            <Bar dataKey="Task" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Notifications({ notifications }: { notifications: Notification[] }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          onClick={() => navigate('/dashboard/notificationspage')}
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {notifications?.map((notification) => (
          <div key={notification.id || notification.message} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">{notification.name ? String(notification.name)[0] : '?'}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">{notification.name || 'Unknown'}</p>
                <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                <div className="flex items-center justify-between">
                  <button className="text-xs text-blue-600 hover:text-blue-700">{notification.action || ''}</button>
                  <span className="text-xs text-gray-500">{notification.time || ''}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// --- Reusable Announcements Table Component ---
function Announcements({ announcements, onAddClick, onDeleteClick }: { announcements: Announcement[], onAddClick: () => void, onDeleteClick: (idx: number) => void }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [10, 25, 50];

  // Filtered and paginated announcements
  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Pagination controls
  const goToPage = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  useEffect(() => { setPage(1); }, [search, pageSize, announcements]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
        <div className="flex items-center space-x-2 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onAddClick}>Add Announcement</button>
          <select
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            {pageSizes.map(size => (
              <option key={size} value={size}>{`Show ${size} entries`}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="text-sm border border-gray-300 rounded-md px-3 py-1 w-32"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Start Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">End Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">No announcements found.</td>
              </tr>
            ) : paginated.map((announcement, idx) => (
              <tr key={announcement.title + announcement.startDate} className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">{announcement.title}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{announcement.startDate}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{announcement.endDate}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{announcement.description}</td>
                <td className="py-3 px-4 text-sm">
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => onDeleteClick((page - 1) * pageSize + idx)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600 flex-wrap gap-2">
        <span>
          Showing {total === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} entries
        </span>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}
              onClick={() => goToPage(i + 1)}
            >{i + 1}</button>
          ))}
          <button
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >Next</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;