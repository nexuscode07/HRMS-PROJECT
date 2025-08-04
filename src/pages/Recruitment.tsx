// Recruitment.tsx

import React, { useState } from 'react';
import {
  Plus, Search, Eye, Edit, Trash2, Mail, Phone, MapPin, X
} from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  status: string;
  location: string;
  appliedDate: string;
}

const initialCandidates: Candidate[] = [
  {
    id: 1,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1 (555) 987-6543',
    position: 'Senior React Developer',
    experience: '5 years',
    status: 'Interview Scheduled',
    location: 'New York, NY',
    appliedDate: '2024-05-15',
  },
  {
    id: 2,
    name: 'David Chen',
    email: 'david.chen@email.com',
    phone: '+1 (555) 876-5432',
    position: 'Product Designer',
    experience: '3 years',
    status: 'Under Review',
    location: 'San Francisco, CA',
    appliedDate: '2024-05-18',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 765-4321',
    position: 'Marketing Manager',
    experience: '4 years',
    status: 'Hired',
    location: 'Austin, TX',
    appliedDate: '2024-05-10',
  },
];


export default function Recruitment() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openViewModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('view');
  };

  const openEditModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewMode('edit');
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setCandidates(prev => prev.filter(c => c.id !== deleteId));
    }
    setShowDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleEditChange = (field: keyof Candidate, value: string) => {
    if (selectedCandidate) {
      setSelectedCandidate({ ...selectedCandidate, [field]: value });
    }
  };

  const handleEditSave = () => {
    if (selectedCandidate) {
      setCandidates(prev =>
        prev.map(c => (c.id === selectedCandidate.id ? selectedCandidate : c))
      );
      setViewMode(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hired':
        return 'bg-green-100 text-green-800';
      case 'Interview Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Recruitment Management</h1>
            <p className="text-gray-500 text-lg">Manage job candidates with a modern, professional interface</p>
          </div>
          <button
            className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all font-semibold text-base"
            onClick={() => openEditModal({
              id: Date.now(),
              name: '',
              email: '',
              phone: '',
              position: '',
              experience: '',
              status: 'Under Review',
              location: '',
              appliedDate: new Date().toISOString().slice(0, 10),
            })}
          >
            <Plus className="w-5 h-5" /> Add Candidate
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  // Add search logic if needed
                />
              </div>
            </div>
            <div className="flex gap-2">
              {/* Add filter dropdowns if needed */}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Candidate</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Position</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Experience</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Location</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Applied</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.map(candidate => (
                  <tr key={candidate.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 text-white flex items-center justify-center rounded-full text-lg font-bold shadow">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-base">{candidate.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-4 h-4 mr-1" /> {candidate.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-4 h-4 mr-1" /> {candidate.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{candidate.position}</td>
                    <td className="px-6 py-4">{candidate.experience}</td>
                    <td className="px-6 py-4 flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      {candidate.location}
                    </td>
                    <td className="px-6 py-4">{new Date(candidate.appliedDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(candidate.status)}`}>{candidate.status}</span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openViewModal(candidate)} className="p-2 rounded hover:bg-blue-100 text-blue-600 transition">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button onClick={() => openEditModal(candidate)} className="p-2 rounded hover:bg-green-100 text-green-600 transition">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(candidate.id)} className="p-2 rounded hover:bg-red-100 text-red-600 transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-[350px] max-w-full flex flex-col items-center">
              <Trash2 className="w-10 h-10 text-red-500 mb-3" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">Delete Candidate</h3>
              <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete this candidate profile? This action cannot be undone.</p>
              <div className="flex gap-3 w-full justify-center">
                <button onClick={cancelDelete} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for View/Edit Candidate */}
        {viewMode && selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-[95%] max-w-lg shadow-2xl relative animate-fadeIn">
              <button
                onClick={() => setViewMode(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
              {viewMode === 'view' ? (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-blue-700">Candidate Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Name:</span> <span>{selectedCandidate.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Email:</span> <span>{selectedCandidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Phone:</span> <span>{selectedCandidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Position:</span> <span>{selectedCandidate.position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Experience:</span> <span>{selectedCandidate.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Location:</span> <span>{selectedCandidate.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-28">Status:</span> <span>{selectedCandidate.status}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-blue-700">{selectedCandidate.name ? 'Edit Candidate' : 'Add Candidate'}</h2>
                  <div className="space-y-4">
                    {['name', 'email', 'phone', 'position', 'experience', 'location', 'status'].map(field => (
                      <div key={field} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                        <input
                          type="text"
                          value={selectedCandidate[field as keyof Candidate] as string}
                          onChange={(e) => handleEditChange(field as keyof Candidate, e.target.value)}
                          placeholder={field}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6 gap-3">
                    <button onClick={() => setViewMode(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
                    <button onClick={handleEditSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
