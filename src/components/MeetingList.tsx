import React from 'react';

export interface Meeting {
  id?: number;
  title: string;
  date: string;
  time: string;
  employeeId: number;
  employeeName?: string;
}

interface MeetingListProps {
  meetings: Meeting[];
  employees: { employeeId: number; name: string }[];
}

const MeetingList: React.FC<MeetingListProps> = ({ meetings, employees }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Meetings</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Employee</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((m, idx) => (
            <tr key={m.id || idx} className="border-t">
              <td className="px-4 py-2">{m.title}</td>
              <td className="px-4 py-2">{m.date}</td>
              <td className="px-4 py-2">{m.time}</td>
              <td className="px-4 py-2">{employees.find(e => e.employeeId === m.employeeId)?.name || m.employeeId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MeetingList;
