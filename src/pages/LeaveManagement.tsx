// src/pages/Leave.tsx

import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../employee/context/AppContext.tsx";
import { Plus, X } from "lucide-react";

interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  applied_date: string;
  days: number;
}

interface Employee {
  id: number;
  name: string;
}

const LeaveManagement: React.FC = () => {
  const { addNotification } = useContext(AppContext);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState<Omit<LeaveRequest, "id">>({
    employee_id: 0,
    employee_name: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    status: "Pending",
    applied_date: new Date().toISOString().split("T")[0],
    days: 0,
  });
  const [statusMessage, setStatusMessage] = useState<string>("");

  // 🔄 Fetch Leaves
  const fetchLeaves = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/leaves/");
      const data = await res.json();
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  // 🔄 Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/employees/");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // 📨 Submit Leave
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/leaves/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveForm),
      });
      if (res.ok) {
        setShowModal(false);
        fetchLeaves();
        addNotification("Leave applied successfully");
      } else {
        const errorData = await res.json();
        alert("Error: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  // ✔️ Update Leave Status
  const updateLeaveStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/leaves/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchLeaves();
        addNotification(`Leave ${status}`);
        setStatusMessage(`Leave ${status} successfully!`);
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        const errorData = await res.json();
        alert("Error: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  // 🔃 Load on mount
  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Leave Management (Admin)</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      {statusMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {statusMessage}
        </div>
      )}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Leave Type</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Days</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Applied Date</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{leave.id}</td>
                <td className="px-4 py-2">{leave.employee_name}</td>
                <td className="px-4 py-2">{leave.leave_type}</td>
                <td className="px-4 py-2">{leave.start_date}</td>
                <td className="px-4 py-2">{leave.end_date}</td>
                <td className="px-4 py-2">{leave.days}</td>
                <td className="px-4 py-2">{leave.reason}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        leave.status === "Approved"
                          ? "bg-green-200 text-green-700"
                          : leave.status === "Rejected"
                          ? "bg-red-200 text-red-700"
                          : "bg-yellow-200 text-yellow-700"
                      }`}
                    >
                      {leave.status}
                    </span>
                    {leave.status && leave.status.trim().toLowerCase() === "pending" && (
                      <>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                          onClick={() => updateLeaveStatus(leave.id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          onClick={() => updateLeaveStatus(leave.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">{leave.applied_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Apply Leave</h3>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              {/* 👇 Employee Dropdown */}
              <select
                className="w-full border rounded px-3 py-2"
                value={leaveForm.employee_id}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  const selectedEmp = employees.find((emp) => emp.id === selectedId);
                  setLeaveForm({
                    ...leaveForm,
                    employee_id: selectedId,
                    employee_name: selectedEmp?.name || "",
                  });
                }}
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Leave Type"
                value={leaveForm.leave_type}
                onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="date"
                value={leaveForm.start_date}
                onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="date"
                value={leaveForm.end_date}
                onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Days"
                value={leaveForm.days}
                onChange={(e) => setLeaveForm({ ...leaveForm, days: Number(e.target.value) })}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                placeholder="Reason"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
