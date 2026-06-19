import React from 'react';
import { Eye, Edit2, Trash2, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import { CompletionBar } from '../AdminShared';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const PROJECT_STATUS_CFG = {
  'open':        { bg: 'rgba(107,114,128,0.12)', color: '#9ca3af', label: 'Not Started' },
  'assigned':    { bg: 'rgba(112,214,77,0.12)',  color: '#70d64d', label: 'In Progress' },
  'completed':   { bg: 'rgba(56,189,248,0.12)',  color: '#38bdf8', label: 'Completed' },
  'NOT STARTED': { bg: 'rgba(107,114,128,0.12)', color: '#9ca3af', label: 'Not Started' },
  'IN PROGRESS': { bg: 'rgba(112,214,77,0.12)',  color: '#70d64d', label: 'In Progress' },
  'COMPLETED':   { bg: 'rgba(56,189,248,0.12)',  color: '#38bdf8', label: 'Completed' },
};

export function ProjectStatusBadge({ status }) {
  const cfg = PROJECT_STATUS_CFG[status] || PROJECT_STATUS_CFG['open'];
  return (
    <span 
      style={{ background: cfg.bg, color: cfg.color }} 
      className="text-[0.68rem] font-bold px-[8px] py-[3px] rounded-[4px] whitespace-nowrap"
    >
      {cfg.label.toUpperCase()}
    </span>
  );
}

export function ProjectTable({ projects, isLoading, onViewDetails, onEdit, onDelete, onTrackProgress, onApplications }) {
  return (
    <div className="bg-[#121215] border border-[#23232a] rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#0c0c0e]">
              {['Project Details', 'Type & Priority', 'Budget', 'Timeline', 'Progress', 'Bids/Applicants', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-gray-500 text-[0.65rem] font-bold px-[16px] py-[14px] border-b border-[#23232a] tracking-[0.6px] whitespace-nowrap">
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[220, 120, 100, 140, 120, 90, 100, 150].map((w, j) => (
                    <td key={j} className="p-[16px] border-b border-[#1a1a22]">
                      <div className="skeleton-pulse h-[14px] rounded-[4px]" style={{ width: `${w}px` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-[48px] text-gray-500">
                  No projects found.
                </td>
              </tr>
            ) : projects.map(p => {
              const assignedUser = p.assignments?.[0]?.assigned_to;
              return (
                <tr 
                  key={p.id}
                  className="transition-colors duration-100 hover:bg-[#181820]"
                >
                  {/* Project Details */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <div>
                      <p className="text-white font-bold text-[0.88rem] m-0">{p.title}</p>
                    </div>
                  </td>
                  {/* Type & Priority */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-white text-[0.78rem] capitalize font-medium">
                        {p.project_type || 'fixed'}
                      </span>
                      <span className={`text-[0.62rem] font-bold px-[6px] py-[2px] rounded-[4px] self-start uppercase ${p.priority === 'high' ? 'bg-red-500/10 text-red-400' : p.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>
                        {p.priority || 'medium'}
                      </span>
                    </div>
                  </td>
                  {/* Budget */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <span className="text-[#70d64d] font-bold text-[0.85rem]">
                      {p.budget ? `₹${Number(p.budget).toLocaleString('en-IN')}` : '—'}
                    </span>
                  </td>
                  {/* Timeline */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <div className="flex flex-col gap-[2px] text-[0.75rem] text-[#8a8a8a]">
                      <span className="flex items-center gap-[4px]">
                        <span className="w-[30px] text-gray-600 font-semibold uppercase text-[0.6rem]">Start:</span>
                        <span className="text-gray-300 font-medium">{fmtDate(p.start_date)}</span>
                      </span>
                      <span className="flex items-center gap-[4px]">
                        <span className="w-[30px] text-gray-600 font-semibold uppercase text-[0.6rem]">End:</span>
                        <span className="text-gray-300 font-medium">{fmtDate(p.end_date)}</span>
                      </span>
                    </div>
                  </td>
                  {/* Progress */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle min-w-[120px]">
                    {p.status === 'open' || p.status === 'NOT STARTED' ? (
                      <span className="text-gray-500 text-[0.8rem] italic">—</span>
                    ) : (
                      <div className="flex flex-col gap-[4px]">
                        <CompletionBar value={p.progress_percentage || 0} label="Progress" />
                      </div>
                    )}
                  </td>
                  {/* Bids/Applicants */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    {p.status === 'open' || p.status === 'NOT STARTED' ? (
                      <button 
                        onClick={() => onApplications && onApplications(p)}
                        className="flex items-center gap-[4px] bg-[#1e293b] hover:bg-[#2e3e56] text-[#38bdf8] text-[0.7rem] font-bold px-[8px] py-[4px] rounded-[4px] border-none cursor-pointer transition-colors"
                      >
                        <Users size={12} />
                        {p.applications_count || 0} Bids
                      </button>
                    ) : (
                      <span className="text-gray-500 text-[0.8rem] italic">—</span>
                    )}
                  </td>
                  {/* Status */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <ProjectStatusBadge status={p.status} />
                  </td>
                  {/* Actions */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <div className="flex items-center gap-[8px]">
                      <button
                        onClick={() => onViewDetails && onViewDetails(p.id)}
                        className="bg-[#0c0c0e] border border-[#23232a] text-[#8a8a8a] hover:text-white p-[6px] rounded-[4px] cursor-pointer transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => onTrackProgress && onTrackProgress(p.id)}
                        className="bg-[#0c0c0e] border border-[#23232a] text-[#70d64d] hover:bg-[#70d64d]/10 p-[6px] rounded-[4px] cursor-pointer transition-colors"
                        title="Track Progress"
                      >
                        <TrendingUp size={14} />
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(p.id)}
                        className="bg-[#0c0c0e] border border-[#23232a] text-[#f59e0b] hover:bg-[#f59e0b]/10 p-[6px] rounded-[4px] cursor-pointer transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(p.id)}
                        className="bg-[#0c0c0e] border border-[#23232a] text-[#ef4444] hover:bg-[#ef4444]/10 p-[6px] rounded-[4px] cursor-pointer transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectTable;
