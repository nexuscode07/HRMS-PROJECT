// import { User2 as User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';

const Profile: React.FC = () => {
  const { user, setUser } = useApp(); // Assume you have setUser to update context
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
    dateOfBirth: user?.dateOfBirth ?? '',
    emergencyContact: user?.emergencyContact ?? '',
    position: user?.position ?? '',
    department: user?.department ?? '',
    employeeId: user?.employeeId ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // You can also call an API here to save the profile
    setUser({ ...user, ...formData }); // Update context (if setUser exists)
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
      dateOfBirth: user?.dateOfBirth ?? '',
      emergencyContact: user?.emergencyContact ?? '',
      position: user?.position ?? '',
      department: user?.department ?? '',
      employeeId: user?.employeeId ?? '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <img
              src={user?.avatar ?? '/default-avatar.png'}
              alt={user?.name ?? 'User Avatar'}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div className="text-center md:text-left flex-1">
            {!isEditing ? (
              <>
                <h1 className="text-2xl font-bold text-black">{user?.name ?? 'No Name'}</h1>
                <p className="text-lg text-black">{user?.position ?? 'No Position'}</p>
                <p className="text-sm text-black">{user?.department ?? 'No Department'}</p>
                <p className="text-sm text-black">Email: {user?.email ?? 'N/A'}</p>
                <p className="text-sm text-black">Phone: {user?.phone ?? 'N/A'}</p>
                <p className="text-sm text-black">Address: {user?.address ?? 'N/A'}</p>
                <p className="text-sm text-black">DOB: {user?.dateOfBirth ?? 'N/A'}</p>
                <p className="text-sm text-black">Emergency Contact: {user?.emergencyContact ?? 'N/A'}</p>
              </>
            ) : (
              <div className="space-y-2">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Full Name"
                />
                <input
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Position"
                />
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Department"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Email"
                  type="email"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Phone"
                  type="tel"
                />
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Address"
                />
                <input
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Date of Birth"
                  type="date"
                />
                <input
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Emergency Contact"
                />
              </div>
            )}
            <p className="text-sm text-blue-600 mt-1">ID: {user?.employeeId ?? 'N/A'}</p>
          </div>
          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="primary" onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      {/* ... existing tab rendering ... */}

    </div>
  );
};

export default Profile;
