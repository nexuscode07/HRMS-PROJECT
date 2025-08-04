import React, { useEffect, useState } from "react";

interface LeaveForm {
  employee: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface Leave {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  applied_date: string;
}

const Leave: React.FC = () => {
  const [leaveForm, setLeaveForm] = useState<LeaveForm>({
    employee: 1, // static ID for now
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const fetchLeaves = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/leaves/?employee=${leaveForm.employee}`);
      if (!response.ok) throw new Error("Failed to fetch leaves");
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      setMessage("Error fetching leaves: " + error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const applyLeave = async () => {
    setMessage("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/leaves/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveForm),
      });

      if (!response.ok) {
        const err = await response.json();
        setMessage("Error: " + (err?.employee?.[0] || "Failed to apply leave"));
        console.error("Apply error: ", err);
        throw new Error("Failed to apply leave");
      }

      setMessage("Leave applied successfully!");
      fetchLeaves(); // Refresh leave list after applying
    } catch (error) {
      setMessage("Leave apply error: " + error);
      console.error("Leave apply error:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Apply for Leave</h2>
      <div className="grid gap-4">
        <select name="leave_type" onChange={handleChange} className="p-2 border">
          <option value="">Select Leave Type</option>
          <option value="sick">Sick Leave</option>
          <option value="casual">Casual Leave</option>
        </select>
        <input type="date" name="start_date" onChange={handleChange} className="p-2 border" />
        <input type="date" name="end_date" onChange={handleChange} className="p-2 border " />
        <textarea name="reason" placeholder="Reason" onChange={handleChange} className="p-2 border resize-none" />
        <button onClick={applyLeave} className="px-4 py-2 text-white bg-blue-500 rounded">Apply</button>
        {message && <div className="mt-2 text-red-500">{message}</div>}
      </div>
      <div className="mt-8">
        <h3 className="mb-2 text-lg font-semibold">My Leave Requests</h3>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Type</th>
              <th className="border p-2">Start</th>
              <th className="border p-2">End</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l.id}>
                <td className="border p-2">{l.leave_type}</td>
                <td className="border p-2">{l.start_date}</td>
                <td className="border p-2">{l.end_date}</td>
                <td className="border p-2">{l.reason}</td>
                <td className="border p-2">{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leave;
