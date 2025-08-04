import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: string;
  joinDate: string;
  salary: string;
  role: 'HR' | 'Employee';
}



const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  // Fetch employees from backend API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/employees/')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(() => setEmployees([]));
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joinDate: '',
    salary: '',
    role: 'Employee',
    status: 'Active',
    password: '',
    confirmPassword: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add employee via backend API and register with Clerk
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.password || !formData.confirmPassword) {
      setError('Password and confirm password are required.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      // Call the backend route that creates both the employee and Clerk user
      const res = await fetch('http://127.0.0.1:8000/api/employees/register_with_clerk/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (!res.ok) {
        // Show backend/Clerk error if available
        if (result && result.error) {
          setError(result.error + (result.clerk ? ': ' + JSON.stringify(result.clerk) : ''));
          return;
        }
        setError('Failed to add employee');
        return;
      }
      // Only add to UI if result is an Employee object (has id and email)
      if (result && result.id && result.email) {
        setEmployees(prev => [...prev, result]);
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        joinDate: '',
        salary: '',
        role: 'Employee',
        status: 'Active',
        password: '',
        confirmPassword: '',
      });
      setShowModal(false);
    } catch (err) {
      setError('Failed to add employee');
    }
  };

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // Delete employee via backend API (default DRF endpoint)
  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/employees/${deleteId}/`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        setEmployees(prev => prev.filter(e => e.id !== deleteId));
      } catch {
        setError('Failed to delete employee');
      }
    }
    setShowConfirm(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setShowModal(true)}
      >
        Add Employee
      </button>

      <table className="w-full bg-white border rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Position</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Join Date</th>
            <th className="p-3 text-left">Salary</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{emp.id.toString().padStart(4, '0')}</td>
              <td className="p-3">{emp.name}</td>
              <td className="p-3">{emp.email}</td>
              <td className="p-3">{emp.phone}</td>
              <td className="p-3">{emp.position}</td>
              <td className="p-3">{emp.department}</td>
              <td className="p-3">{emp.role}</td>
              <td className="p-3">{emp.status}</td>
              <td className="p-3">{emp.joinDate}</td>
              <td className="p-3">{emp.salary}</td>
              <td className="p-3">
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleDelete(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirm Delete Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[400px] max-w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this employee profile?</p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelDelete} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add Employee */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[500px] max-w-full">
            <h3 className="text-xl font-bold mb-4">Add Employee</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mt-1" required />
                </div>
                <div>
                  <label className="block">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mt-1" required />
                </div>
                <div>
                  <label className="block">Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mt-1" required />
                </div>
                <div>
                  <label className="block">Position</label>
                  <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mt-1" required />
                </div>
                <div>
                  <label className="block">Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mt-1" required />
                </div>
                <div>
                  <label className="block">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mt-1">
                    <option value="Employee">Employee</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label className="block">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mt-1">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block">Join Date</label>
                  <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mt-1" required />
                </div>
                <div>
                  <label className="block">Salary</label>
                  <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mt-1" required />
                </div>
                <div>
                  <label className="block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded p-2 mt-1 pr-10"
                      required
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={0}
                      role="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded p-2 mt-1 pr-10"
                      required
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={0}
                      role="button"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
// Add at the bottom if not present:
// npm install react-icons
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;