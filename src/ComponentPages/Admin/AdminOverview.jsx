import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../../store/useAdminStore';
import { Users, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, bgClass, textClass, trend }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
    <div className={`absolute bottom-0 left-0 right-0 h-1 ${bgClass}`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass} bg-opacity-10 ${textClass}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${bgClass} bg-opacity-10 ${textClass}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-slate-800 mb-1">{value ?? '—'}</div>
    <div className="text-xs font-medium text-slate-500">{title}</div>
  </div>
);

const ActivityRow = ({ colorClass, textClass, icon, text, time }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${colorClass} bg-opacity-10 ${textClass}`}>
      {icon}
    </div>
    <div className="flex-1 text-sm text-slate-700 truncate">{text}</div>
    <div className="text-xs text-slate-400 font-mono shrink-0">{time}</div>
  </div>
);

const AdminOverview = () => {
  const navigate = useNavigate();
  const { stats, fetchStats, pendingProperties, incompleteLeads, allUsers } = useAdminStore();

  useEffect(() => { fetchStats(); }, []);

  const recentPending = pendingProperties.slice(0, 3);
  const recentLeads = incompleteLeads.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stat Cards - Stacks to 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} bgClass="bg-blue-500" textClass="text-blue-500" trend="+12%" />
        <StatCard title="Pending Review" value={stats.pendingCount} icon={Clock} bgClass="bg-amber-500" textClass="text-amber-500" trend="Action Needed" />
        <StatCard title="Active Listings" value={stats.activeListings} icon={CheckCircle} bgClass="bg-emerald-500" textClass="text-emerald-500" trend="Live" />
        <StatCard title="Incomplete Leads" value={stats.incompleteCount} icon={AlertCircle} bgClass="bg-rose-500" textClass="text-rose-500" trend="Follow up" />
      </div>

      {/* Grid: Activity + Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Panel (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
            <button onClick={() => navigate('/admin/pending')} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="p-5">
            {recentPending.length === 0 && recentLeads.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">No recent activity</div>
            ) : (
              <>
                {recentPending.map(p => (
                  <ActivityRow key={p._id} colorClass="bg-amber-500" textClass="text-amber-600" icon="P"
                    text={`New submission: ${p.title || 'Untitled'} — ${p.location?.city || ''}`}
                    time={new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  />
                ))}
                {recentLeads.map(l => (
                  <ActivityRow key={l._id} colorClass="bg-rose-500" textClass="text-rose-600" icon="!"
                    text={`Incomplete form: Step ${l.formStep}/4 — ${l.contactDetails?.name || 'Unknown'}`}
                    time={new Date(l.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Snapshot Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Platform Snapshot</h3>
          </div>
          <div className="p-5 space-y-6">
            {/* Breakdown */}
            <div>
              <div className="text-xs font-bold text-slate-800 mb-3">LISTING STATUS</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"/> <span className="text-slate-500">Awaiting Approval</span></div>
                  <span className="font-mono font-bold">{stats.pendingCount || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"/> <span className="text-slate-500">Incomplete Forms</span></div>
                  <span className="font-mono font-bold">{stats.incompleteCount || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"/> <span className="text-slate-500">Live Listings</span></div>
                  <span className="font-mono font-bold">{stats.activeListings || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;