import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';


export const STATUS_CFG = {
  approved:  { bg: 'rgba(112,214,77,0.12)',  color: '#70d64d',  label: 'Approved'  },
  pending:   { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b',  label: 'Pending'   },
  inactive:  { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b',  label: 'Inactive'  },
  rejected:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444',  label: 'Rejected'  },
  suspended: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280',  label: 'Suspended' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span 
      style={{ background: cfg.bg, color: cfg.color }} 
      className="text-[0.68rem] font-bold px-[8px] py-[3px] rounded-[4px]" >
      {cfg.label.toUpperCase()}
    </span>
  );
}

export function CompletionBar({ value = 0 }) {
  const color = value >= 70 ? '#70d64d' : value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div className="flex justify-between mb-[4px]">
        <span className="text-gray-500 text-[0.65rem] font-semibold uppercase">Profile</span>
        <span style={{ color }} className="text-[0.65rem] font-bold">{value}%</span>
      </div>
      <div className="h-[4px] bg-[#1c1c20] rounded-[99px] overflow-hidden">
        <div 
          style={{ width: `${value}%`, background: color }} 
          className="h-full rounded-[99px] transition-[width] duration-400" 
        />
      </div>
    </div>
  );
}

export function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end   = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const baseClass = "inline-flex items-center justify-center min-w-[32px] h-[32px] rounded-[6px] border border-[#23232a] bg-[#0c0c0e] text-[#8a8a8a] text-[0.8rem] cursor-pointer px-[8px]";
  const activeClass = "inline-flex items-center justify-center min-w-[32px] h-[32px] rounded-[6px] border border-[#70d64d] bg-[#70d64d] text-black text-[0.8rem] cursor-pointer px-[8px] font-bold";
  const disabledClass = "inline-flex items-center justify-center min-w-[32px] h-[32px] rounded-[6px] border border-[#23232a] bg-[#0c0c0e] text-[#8a8a8a] text-[0.8rem] cursor-not-allowed px-[8px] opacity-30";

  return (
    <div className="flex gap-[6px] flex-wrap items-center">
      <button onClick={() => onPage(page - 1)} disabled={page === 1} className={page === 1 ? disabledClass : baseClass}><ChevronLeft size={14} /></button>
      {start > 1 && <><button onClick={() => onPage(1)} className={baseClass}>1</button><span className="text-[#4b4b57]">…</span></>}
      {pages.map(p => <button key={p} onClick={() => onPage(p)} className={p === page ? activeClass : baseClass}>{p}</button>)}
      {end < totalPages && <><span className="text-[#4b4b57]">…</span><button onClick={() => onPage(totalPages)} className={baseClass}>{totalPages}</button></>}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages} className={page === totalPages ? disabledClass : baseClass}><ChevronRight size={14} /></button>
    </div>
  );
}

export function ActivityHistoryView({ id }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-history', id],
    queryFn: async () => {
      const response = await api.get(`/admin/users/${id}/profile-history`);
      return response;
    },
    enabled: !!id
  });

  if (isLoading) return <div className="text-[#8a8a8a] text-[0.85rem] p-[40px] text-center">Loading history logs...</div>;
  if (error) return <div className="text-[#ef4444] text-[0.85rem] p-[40px] text-center">Error loading logs: {error.message || 'Unknown error'}</div>;

  const { activityLogs = [], loginHistory = [], blockedHistory = [] } = data || {};

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Suspension History */}
      {blockedHistory.length > 0 && (
        <div className="bg-[#1c0c0e] border border-[#ef444433] rounded-[8px] p-[18px]">
          <h4 className="text-[0.75rem] font-extrabold uppercase tracking-[0.6px] text-[#ef4444] m-0 mb-[12px] pb-[6px] border-b border-[#ef444422]">
            Suspension History Logs
          </h4>
          <div className="flex flex-col gap-[10px]">
            {blockedHistory.map(log => (
              <div key={log.id} className="flex justify-between text-[0.8rem] text-[#d1d5db] border-b border-[#ef444411] pb-[6px]">
                <div>
                  <strong>Reason:</strong> {log.reason}
                </div>
                <span className="text-[#8a8a8a] text-[0.72rem]">
                  {new Date(log.created_at).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Action / Activity Logs */}
      <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[18px]">
        <h4 className="text-[0.75rem] font-extrabold uppercase tracking-[0.6px] text-[#70d64d] m-0 mb-[12px] pb-[6px] border-b border-[#23232a]">
          Platform Activity Logs
        </h4>
        {activityLogs.length === 0 ? (
          <p className="text-[#8a8a8a] text-[0.8rem] m-0 italic">No activity records found.</p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto flex flex-col gap-[8px]">
            {activityLogs.map(log => (
              <div key={log.id} className="flex justify-between items-center text-[0.8rem] text-[#d1d5db] border-b border-[#1a1a22] pb-[6px]">
                <div>
                  <span className="text-[#38bdf8] font-bold mr-[8px] text-[0.72rem] uppercase">
                    [{log.module || 'System'}]
                  </span>
                  <span>{log.action}</span>
                  {log.ip_address && <div className="text-[0.72rem] text-gray-500 mt-[2px]">IP: {log.ip_address}</div>}
                </div>
                <span className="text-[#8a8a8a] text-[0.72rem]">
                  {log.created_at ? new Date(log.created_at).toLocaleString('en-IN') : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Login History */}
      <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[18px]">
        <h4 className="text-[0.75rem] font-extrabold uppercase tracking-[0.6px] text-[#c084fc] m-0 mb-[12px] pb-[6px] border-b border-[#23232a]">
          Recent Login Attempts
        </h4>
        {loginHistory.length === 0 ? (
          <p className="text-[#8a8a8a] text-[0.8rem] m-0 italic">No login records found.</p>
        ) : (
          <div className="max-h-[250px] overflow-y-auto flex flex-col gap-[8px]">
            {loginHistory.map(log => (
              <div key={log.id} className="flex justify-between items-center text-[0.8rem] text-[#d1d5db] border-b border-[#1a1a22] pb-[6px]">
                <div>
                  <span className="text-white font-semibold">{log.browser || 'Browser'}</span> on <span className="text-[#a78bfa]">{log.device || 'Device'}</span>
                  <div className="text-[0.72rem] text-gray-500 mt-[2px]">IP: {log.ip_address || '—'}</div>
                </div>
                <span className="text-[#8a8a8a] text-[0.72rem]">
                  {log.login_at ? new Date(log.login_at).toLocaleString('en-IN') : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    
    </div>
  );
}

