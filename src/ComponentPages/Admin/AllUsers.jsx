import React, { useEffect, useState } from 'react';
import useAdminStore from '../../store/useAdminStore';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const UpgradeModal = ({ user, onConfirm, onCancel }) => {
  const [months, setMonths] = useState(1);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Upgrade to Premium</h3>
        <p className="text-sm text-slate-500 mb-6">Upgrading <strong>{user.name || user.email}</strong>.</p>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[1, 3, 6, 12].map(m => (
            <button key={m} onClick={() => setMonths(m)} className={`py-2 rounded-xl text-sm font-bold border transition-colors ${months === m ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
              {m}mo
            </button>
          ))}
        </div>
        
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
          <button onClick={() => onConfirm(months)} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const AllUsers = () => {
  const { allUsers, fetchUsers, upgradeUser, downgradeUser, isLoading } = useAdminStore();
  const [search, setSearch] = useState('');
  const [upgradeTarget, setUpgradeTarget] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = () => fetchUsers(search);
  const isPremium = (user) => user.subscription?.plan === 'premium';

  return (
    <div className="space-y-6">
      {upgradeTarget && <UpgradeModal user={upgradeTarget} onConfirm={(m) => { upgradeUser(upgradeTarget._id, m); setUpgradeTarget(null); }} onCancel={() => setUpgradeTarget(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">Manage accounts and subscriptions.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search users..."
            className="flex-1 sm:w-64 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl">Search</button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading...</td></tr>
              ) : allUsers.map(user => (
                <tr key={user._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isPremium(user) ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                      {(user.name || user.email || 'U').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{user.name || '—'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.contactNumber || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${isPremium(user) ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {isPremium(user) ? '⭐ Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!isPremium(user) ? (
                      <button onClick={() => setUpgradeTarget(user)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                        <ArrowUpCircle size={14} /> Upgrade
                      </button>
                    ) : (
                      <button onClick={() => window.confirm('Downgrade user?') && downgradeUser(user._id)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                        <ArrowDownCircle size={14} /> Downgrade
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;