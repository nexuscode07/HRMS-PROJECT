import React, { useState } from 'react';

interface CreateMeetingProps {
  onCreate: (meeting: { title: string; date: string; time: string; employeeId: number }) => void;
  employees: { employeeId: number; name: string }[];
}

const CreateMeeting: React.FC<CreateMeetingProps> = ({ onCreate, employees }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [employeeId, setEmployeeId] = useState<number>(employees[0]?.employeeId || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !employeeId) return;
    onCreate({ title, date, time, employeeId });
    setTitle('');
    setDate('');
    setTime('');
    setEmployeeId(employees[0]?.employeeId || 0);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="border rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="border rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Employee</label>
        <select value={employeeId} onChange={e => setEmployeeId(Number(e.target.value))} className="border rounded px-3 py-2 w-full">
          {employees.map(emp => (
            <option key={emp.employeeId} value={emp.employeeId}>{emp.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Meeting</button>
    </form>
  );
};

export default CreateMeeting;
