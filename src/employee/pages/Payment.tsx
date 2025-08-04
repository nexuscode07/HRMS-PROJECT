import React, { useState } from 'react';
import { DollarSign, Download, Eye, Filter } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Payment: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  const payrollData = [
    { month: 'June 2024', baseSalary: 5000, allowances: 1000, deductions: 500, netSalary: 5500, status: 'paid' },
    { month: 'May 2024', baseSalary: 5000, allowances: 1000, deductions: 500, netSalary: 5500, status: 'paid' },
    { month: 'April 2024', baseSalary: 5000, allowances: 1200, deductions: 450, netSalary: 5750, status: 'paid' },
    { month: 'March 2024', baseSalary: 5000, allowances: 800, deductions: 600, netSalary: 5200, status: 'paid' }
  ];

  const currentMonth = payrollData[0];
  const totalEarnings = currentMonth.baseSalary + currentMonth.allowances;

  return (
    <div className="space-y-6">
      {/* Current Month Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Base Salary', value: currentMonth.baseSalary, color: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Allowances', value: currentMonth.allowances, color: 'bg-green-100', iconColor: 'text-green-600' },
          { label: 'Deductions', value: currentMonth.deductions, color: 'bg-red-100', iconColor: 'text-red-600' },
          { label: 'Net Salary', value: currentMonth.netSalary, color: 'bg-purple-100', iconColor: 'text-purple-600' }
        ].map((item, idx) => (
          <Card key={idx}>
            <div className="flex items-center space-x-3">
              <div className={`p-3 ${item.color} rounded-lg`}>
                <DollarSign className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">${item.value}</p>
                <p className="text-sm text-black">{item.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Current Month Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold text-black mb-6">
          Current Month Breakdown - {currentMonth.month}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Earnings */}
          <div>
            <h4 className="text-md font-semibold text-black mb-4">Earnings</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-black">Base Salary</span>
                <span className="font-semibold text-black">${currentMonth.baseSalary}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-black">House Allowance</span>
                <span className="font-semibold text-black">${Math.round(currentMonth.allowances * 0.6)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-black">Transport Allowance</span>
                <span className="font-semibold text-black">${Math.round(currentMonth.allowances * 0.4)}</span>
              </div>
              <div className="flex justify-between items-center py-2 font-semibold text-green-600">
                <span>Total Earnings</span>
                <span>${totalEarnings}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h4 className="text-md font-semibold text-black mb-4">Deductions</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-black">Tax</span>
                <span className="font-semibold text-black">${Math.round(currentMonth.deductions * 0.7)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-black">Insurance</span>
                <span className="font-semibold text-black">${Math.round(currentMonth.deductions * 0.3)}</span>
              </div>
              <div className="flex justify-between items-center py-2 font-semibold text-red-600">
                <span>Total Deductions</span>
                <span>${currentMonth.deductions}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-black">Net Salary</span>
            <span className="text-2xl font-bold text-blue-600">${currentMonth.netSalary}</span>
          </div>
        </div>
      </Card>

      {/* Payroll History */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-black">Payroll History</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-black"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                {['Month', 'Base Salary', 'Allowances', 'Deductions', 'Net Salary', 'Actions'].map((heading, index) => (
                  <th key={index} className="text-left py-3 px-4 font-semibold text-black">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payrollData.map((record, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-black font-medium">{record.month}</td>
                  <td className="py-3 px-4 text-black">${record.baseSalary}</td>
                  <td className="py-3 px-4 text-green-600">${record.allowances}</td>
                  <td className="py-3 px-4 text-red-600">${record.deductions}</td>
                  <td className="py-3 px-4 text-black font-semibold">${record.netSalary}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>
                      <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Payment;
