import React, { useState } from 'react';
import { DollarSign, Eye, Edit, Trash2, X } from 'lucide-react';

type PayrollEntry = {
  id: number;
  employeeName: string;
  employeeId: string;
  position: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
  status: string;
};

export default function Payroll() {
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      position: 'Software Developer',
      baseSalary: 75000,
      allowances: 5000,
      deductions: 8000,
      netSalary: 72000,
      month: 'June 2024',
      status: 'Paid',
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      position: 'Product Manager',
      baseSalary: 85000,
      allowances: 6000,
      deductions: 9500,
      netSalary: 81500,
      month: 'June 2024',
      status: 'Pending',
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      position: 'UI/UX Designer',
      baseSalary: 70000,
      allowances: 4500,
      deductions: 7500,
      netSalary: 67000,
      month: 'June 2024',
      status: 'Paid',
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState<PayrollEntry | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleView = (employee: PayrollEntry) => {
    setSelectedEmployee(employee);
    setIsEditMode(false);
  };

  const handleEdit = (employee: PayrollEntry) => {
    setSelectedEmployee(employee);
    setIsEditMode(true);
  };

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setPayrollData(prev => prev.filter(emp => emp.id !== deleteId));
    }
    setShowDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleSaveEdit = () => {
    setPayrollData(prev =>
      prev.map(emp =>
        emp.id === selectedEmployee?.id ? { ...selectedEmployee } : emp
      )
    );
    setSelectedEmployee(null);
    setIsEditMode(false);
  };

  const getStatusColor = (status: string) =>
    status === 'Paid'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';

  const totalBaseSalary = payrollData.reduce((acc, cur) => acc + cur.baseSalary, 0);
  const totalAllowances = payrollData.reduce((acc, cur) => acc + cur.allowances, 0);
  const totalDeductions = payrollData.reduce((acc, cur) => acc + cur.deductions, 0);
  const totalNetSalary = payrollData.reduce((acc, cur) => acc + cur.netSalary, 0);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Payroll Management</h1>
            <p className="text-gray-500 text-lg">Manage employee salaries and payroll processing</p>
          </div>
          {/* Add payroll button can be added here if needed */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Base Salary', value: totalBaseSalary, color: 'blue' },
            { label: 'Allowances', value: totalAllowances, color: 'green' },
            { label: 'Deductions', value: totalDeductions, color: 'red' },
            { label: 'Net Payroll', value: totalNetSalary, color: 'purple' },
          ].map(({ label, value, color }) => (
            <div className="bg-white border rounded-2xl p-6 flex items-center shadow-sm" key={label}>
              <div className={`p-3 bg-${color}-100 rounded-lg`}>
                <DollarSign className={`w-7 h-7 text-${color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-base">{label}</p>
                <p className="text-2xl font-bold text-gray-900">${value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">Employee</th>
                <th className="p-4 text-left font-semibold text-gray-600">Position</th>
                <th className="p-4 text-left font-semibold text-gray-600">Base</th>
                <th className="p-4 text-left font-semibold text-gray-600">Allowances</th>
                <th className="p-4 text-left font-semibold text-gray-600">Deductions</th>
                <th className="p-4 text-left font-semibold text-gray-600">Net</th>
                <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payrollData.map(emp => (
                <tr key={emp.id} className="hover:bg-purple-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 text-white flex items-center justify-center rounded-full text-lg font-bold shadow">
                      {emp.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-base">{emp.employeeName}</div>
                      <div className="text-xs text-gray-500">{emp.employeeId}</div>
                    </div>
                  </td>
                  <td className="p-4">{emp.position}</td>
                  <td className="p-4">${emp.baseSalary.toLocaleString()}</td>
                  <td className="p-4 text-green-600">+${emp.allowances.toLocaleString()}</td>
                  <td className="p-4 text-red-600">-${emp.deductions.toLocaleString()}</td>
                  <td className="p-4 font-semibold">${emp.netSalary.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(emp.status)}`}>{emp.status}</span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleView(emp)} className="p-2 rounded hover:bg-blue-100 text-blue-600 transition">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleEdit(emp)} className="p-2 rounded hover:bg-green-100 text-green-600 transition">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(emp.id)} className="p-2 rounded hover:bg-red-100 text-red-600 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-[350px] max-w-full flex flex-col items-center">
              <Trash2 className="w-10 h-10 text-red-500 mb-3" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">Delete Payroll Record</h3>
              <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete this payroll record? This action cannot be undone.</p>
              <div className="flex gap-3 w-full justify-center">
                <button onClick={cancelDelete} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for View/Edit Payroll */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-[95%] max-w-lg shadow-2xl relative animate-fadeIn">
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setIsEditMode(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-purple-700">{isEditMode ? 'Edit Payroll' : 'Payroll Slip'}</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                    readOnly={!isEditMode}
                    value={selectedEmployee.employeeName}
                    onChange={(e) =>
                      setSelectedEmployee({ ...selectedEmployee, employeeName: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Base Salary</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                      type="number"
                      readOnly={!isEditMode}
                      value={selectedEmployee.baseSalary}
                      onChange={(e) =>
                        setSelectedEmployee({ ...selectedEmployee, baseSalary: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Allowances</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                      type="number"
                      readOnly={!isEditMode}
                      value={selectedEmployee.allowances}
                      onChange={(e) =>
                        setSelectedEmployee({ ...selectedEmployee, allowances: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Deductions</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                      type="number"
                      readOnly={!isEditMode}
                      value={selectedEmployee.deductions}
                      onChange={(e) =>
                        setSelectedEmployee({ ...selectedEmployee, deductions: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6 gap-3">
                  <button
                    className="px-4 py-2 border rounded-lg"
                    onClick={() => {
                      setSelectedEmployee(null);
                      setIsEditMode(false);
                    }}
                  >
                    Close
                  </button>
                  {isEditMode && (
                    <button
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
