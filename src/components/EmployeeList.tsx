import React from 'react';

export type Employee = {
  employeeId: number;
  name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  address: string;
};

interface EmployeeListProps {
  employees: Employee[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Department</th>
            <th className="px-4 py-2 border-b">Position</th>
            <th className="px-4 py-2 border-b">Phone</th>
            <th className="px-4 py-2 border-b">Address</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.employeeId} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{emp.employeeId}</td>
              <td className="px-4 py-2 border-b">{emp.name}</td>
              <td className="px-4 py-2 border-b">{emp.email}</td>
              <td className="px-4 py-2 border-b">{emp.department}</td>
              <td className="px-4 py-2 border-b">{emp.position}</td>
              <td className="px-4 py-2 border-b">{emp.phone}</td>
              <td className="px-4 py-2 border-b">{emp.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
