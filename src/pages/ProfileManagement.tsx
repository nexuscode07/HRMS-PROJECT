import React, { useState, useEffect } from 'react';
import { Camera, Edit, Save, X, User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';

export default function ProfileManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    // Fetch employee profile data from API (replace 1 with actual employee id or use /me endpoint if available)
    fetch('/api/employees/1/')
      .then(res => res.json())
      .then(data => setProfileData(data));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save to backend
    fetch('/api/employees/1/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white text-2xl font-bold">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{profileData.name}</h3>
              <p className="text-gray-600">{profileData.position}</p>
              <p className="text-sm text-gray-500">{profileData.department}</p>
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ● Active
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {profileData.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {profileData.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {profileData.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Joined {new Date(profileData.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                  <p className="text-gray-900">{profileData.employeeId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.position}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  {isEditing ? (
                    <select
                      value={profileData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Engineering</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>HR</option>
                      <option>Finance</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profileData.department}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.location}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                  <p className="text-gray-900">{profileData.manager}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills and Certifications */}
          <div className="bg-white rounded-lg shadow-sm border mt-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Skills & Certifications</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">AWS Certified Solutions Architect</p>
                        <p className="text-sm text-gray-600">Amazon Web Services</p>
                      </div>
                      <span className="text-sm text-gray-500">Valid until Dec 2024</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Certified Scrum Master</p>
                        <p className="text-sm text-gray-600">Scrum Alliance</p>
                      </div>
                      <span className="text-sm text-gray-500">Valid until Jun 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

















// // // ------------------------------------------------------------------
// import React, { useState, useEffect } from 'react';
// import { Edit, Save, X } from 'lucide-react';

// interface ProfileManagementProps {
//   employeeId?: string | number;
// }

// export default function ProfileManagement({ employeeId }: ProfileManagementProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState<Record<string, any> | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [saveStatus, setSaveStatus] = useState<string | null>(null);

//   // Determine endpoint: /api/employees/me/ if available, else use employeeId, else fallback to 1
//   const endpoint = employeeId
//     ? `/api/employees/${employeeId}/`
//     : '/api/employees/me/';

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     fetch(endpoint)
//       .then(async res => {
//         if (!res.ok) throw new Error('Failed to fetch profile');
//         return res.json();
//       })
//       .then(data => setProfileData(data))
//       .catch(err => setError(err.message))
//       .finally(() => setLoading(false));
//     // eslint-disable-next-line
//   }, [endpoint]);

//   const handleInputChange = (field: string, value: string) => {
//     setProfileData(prev => prev ? { ...prev, [field]: value } : prev);
//   };

//   const handleSave = async () => {
//     setIsEditing(false);
//     setSaveStatus(null);
//     setLoading(true);
//     try {
//       const res = await fetch(endpoint, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(profileData)
//       });
//       if (!res.ok) throw new Error('Failed to save profile');
//       setSaveStatus('Profile updated successfully.');
//     } catch (err: any) {
//       setSaveStatus('Error saving profile: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;
//   if (!profileData) return <div>No profile data found.</div>;

//   // Dynamically render all fields except id
//   const editableFields = Object.keys(profileData).filter(
//     key => key !== 'id' && key !== 'employeeId' && key !== 'manager' && key !== 'joinDate'
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
//           <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
//         </div>
//         <div className="mt-4 sm:mt-0">
//           {isEditing ? (
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 <X className="w-4 h-4 mr-2" />
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 <Save className="w-4 h-4 mr-2" />
//                 Save Changes
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               <Edit className="w-4 h-4 mr-2" />
//               Edit Profile
//             </button>
//           )}
//         </div>
//       </div>
//       {saveStatus && <div className={saveStatus.startsWith('Error') ? 'text-red-500' : 'text-green-600'}>{saveStatus}</div>}
//       <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
//         <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
//           {editableFields.map(field => (
//             <div key={field} className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={profileData[field] ?? ''}
//                   onChange={e => handleInputChange(field, e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               ) : (
//                 <p className="text-gray-900">{profileData[field]}</p>
//               )}
//             </div>
//           ))}
//         </form>
//         {/* Show non-editable fields if needed */}
//         <div className="mt-6 text-sm text-gray-500">
//           <div>Employee ID: {profileData.employeeId}</div>
//           {profileData.manager && <div>Manager: {profileData.manager}</div>}
//           {profileData.joinDate && <div>Joined: {new Date(profileData.joinDate).toLocaleDateString()}</div>}
//         </div>
//       </div>
//     </div>
//   );
// }
