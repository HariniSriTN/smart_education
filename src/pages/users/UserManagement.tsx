import React, { useState } from 'react';
import { 
  Users, Search, Filter, Plus, CheckCircle, 
  XCircle, Edit, Trash2, ShieldCheck, Mail, 
  Building, Phone, X, Check, AlertCircle 
} from 'lucide-react';
import { 
  getUsers, saveUsers, addUser, updateUser, 
  approveUser, rejectUser 
} from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { User, UserRole, UserStatus } from '../../types';

export const UserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, info } = useToast();

  const [users, setUsers] = useState<User[]>(getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'trainee' as UserRole,
    department: 'Numerical Weather Prediction (NWP)',
    designation: 'Scientific Officer',
    status: 'active' as UserStatus,
    phone: ''
  });

  const departments = [
    'Numerical Weather Prediction (NWP)',
    'Satellite Meteorology Division',
    'Cyclone Warning Division (IMD HQ)',
    'Doppler Weather Radar Network Operations',
    'National Climate Centre (Pune)',
    'Agro-Meteorological Advisory Services',
    'Hydrometeorology Division',
    'Indian Institute of Tropical Meteorology (IITM)',
    'Ocean Observation & Forecasting (INCOIS)'
  ];

  const handleApprove = (u: User) => {
    approveUser(u.id);
    setUsers(getUsers());
    success('User Approved', `${u.name} is now an active portal user.`);
  };

  const handleReject = (u: User) => {
    if (window.confirm(`Reject access for ${u.name}?`)) {
      rejectUser(u.id);
      setUsers(getUsers());
      info('User Rejected', `${u.name}'s request was rejected.`);
    }
  };

  const handleToggleStatus = (u: User) => {
    const newStatus: UserStatus = u.status === 'active' ? 'inactive' : 'active';
    const updated = { ...u, status: newStatus };
    updateUser(updated);
    setUsers(getUsers());
    info('Status Updated', `${u.name} is now ${newStatus}.`);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'trainee',
      department: 'Numerical Weather Prediction (NWP)',
      designation: 'Scientific Assistant',
      status: 'active',
      phone: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      designation: u.designation,
      status: u.status,
      phone: u.phone || ''
    });
    setShowAddModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        ...formData
      };
      updateUser(updated);
      setUsers(getUsers());
      success('User Updated', `Changes to ${updated.name} saved.`);
    } else {
      const newUser: User = {
        id: 'user-' + Date.now(),
        ...formData,
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      };
      addUser(newUser);
      setUsers(getUsers());
      success('User Created', `${newUser.name} added to portal.`);
    }

    setShowAddModal(false);
  };

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Platform Administration
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            User Management & Personnel Directorate
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer MoES personnel profiles, roles, registration authorizations, and security statuses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Personnel
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by officer name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="All">All Roles</option>
            <option value="trainee">Trainees</option>
            <option value="trainer">Trainers</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending Approval</option>
            <option value="inactive">Inactive</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold text-[11px]">
              <th className="p-4">Personnel Profile</th>
              <th className="p-4">Division & Designation</th>
              <th className="p-4">Portal Role</th>
              <th className="p-4">Registered Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-800">{u.designation}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{u.department}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    u.role === 'admin' ? 'bg-amber-100 text-amber-800' :
                    u.role === 'trainer' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{u.joinedDate}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                    u.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                    u.status === 'pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                    u.status === 'inactive' ? 'bg-slate-200 text-slate-700' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                  {u.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(u)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(u)}
                        className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                        title="Edit profile"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100"
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingUser ? 'Edit Personnel Profile' : 'Register New Personnel'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="trainee">Trainee</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
