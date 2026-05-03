import React, { useEffect, useState } from 'react';
import useAdminStore from '../../store/useAdminStore';
import { Phone, Mail, CheckCircle2, Circle } from 'lucide-react';

const LeadCard = ({ lead, onToggle }) => {
  const stepColors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  const stepColorClass = stepColors[(lead.formStep || 1) - 1] || 'bg-slate-400';

  return (
    <div className={`bg-white border rounded-2xl p-5 shadow-sm transition-all duration-200 ${lead.wasContacted ? 'border-slate-200 opacity-75' : 'border-blue-100 hover:shadow-md'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            {(lead.contactDetails?.name || 'U').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{lead.contactDetails?.name || 'Name not provided'}</h4>
            <p className="text-xs text-slate-500">{lead.contactDetails?.phone || 'No phone'}</p>
          </div>
        </div>
        <button 
          onClick={() => onToggle(lead._id, lead.wasContacted)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${lead.wasContacted ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-amber-200 text-amber-600 bg-amber-50'}`}
        >
          {lead.wasContacted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
          {lead.wasContacted ? 'Contacted' : 'Needs Action'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 flex items-center gap-3">
        <span className="text-xs text-slate-500 font-medium">Step</span>
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className={`h-1.5 flex-1 rounded-full ${step <= (lead.formStep || 0) ? stepColorClass : 'bg-slate-200'}`} />
          ))}
        </div>
        <span className="text-xs font-bold text-slate-700">{lead.formStep}/4</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
        {lead.contactDetails?.phone && (
          <a href={`tel:${lead.contactDetails.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl text-sm font-semibold transition-colors">
            <Phone size={16} /> Call
          </a>
        )}
        {lead.contactDetails?.email && (
          <a href={`mailto:${lead.contactDetails.email}`} className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-xl text-sm font-semibold transition-colors">
            <Mail size={16} /> Email
          </a>
        )}
      </div>
    </div>
  );
};

const IncompleteLeads = () => {
  const { incompleteLeads, fetchIncompleteLeads, toggleLeadStatus, isLoading } = useAdminStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchIncompleteLeads(); }, []);

  const filtered = incompleteLeads.filter(l => filter === 'contacted' ? l.wasContacted : filter === 'pending' ? !l.wasContacted : true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Incomplete Leads</h2>
          <p className="text-sm text-slate-500">Recover users who dropped off.</p>
        </div>
        
        {/* Mobile-friendly Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['all', 'pending', 'contacted'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setFilter(tab)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap ${filter === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading leads...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(lead => (
            <LeadCard key={lead._id} lead={lead} onToggle={(id, current) => toggleLeadStatus(id, current)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IncompleteLeads;