import React from 'react';
import { Mail, Phone, Briefcase, Users, Globe } from 'lucide-react';
import { StatusBadge, CompletionBar } from '../AdminShared';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function AgencyLogo({ name, logo, size = 42 }) {
  const initials = name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  return logo ? (
    <img 
      src={logo} 
      alt={name} 
      style={{ width: size, height: size }} 
      className="rounded-[8px] object-cover shrink-0 border border-[#23232a] bg-[#1c1c20]" 
    />
  ) : (
    <div 
      style={{ width: size, height: size, fontSize: `${size * 0.3}px` }} 
      className="rounded-[8px] bg-gradient-to-br from-[#2e1065] to-[#4c1d95] border border-[#3b2a6a] flex items-center justify-center font-extrabold text-[#c084fc] shrink-0"
    >
      {initials}
    </div>
  );
}

export const AgencyTable = ({ agencies, isLoading, onSelectAgency }) => {
  return (
    <div className="bg-[#121215] border border-[#23232a] rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#0c0c0e]">
              {['Agency', 'Contact Person', 'Contact', 'Industry', 'Team', 'Projects', 'Profile', 'Status', 'Registered'].map(h => (
                <th key={h} className="text-gray-500 text-[0.65rem] font-bold px-[16px] py-[14px] border-b border-[#23232a] tracking-[0.6px] whitespace-nowrap">
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(7)].map((_, i) => (
                <tr key={i}>
                  {[200, 130, 160, 100, 60, 60, 110, 80, 90].map((w, j) => (
                    <td key={j} className="p-[16px] border-b border-[#1a1a22]">
                      <div className="skeleton-pulse h-[14px] rounded-[4px]" style={{ width: `${w}px` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : agencies.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-[48px] text-gray-500">
                  No agencies found.
                </td>
              </tr>
            ) : agencies.map(a => {
              const ap = a.agency_profile;
              return (
                <tr 
                  key={a.id}
                  onClick={() => onSelectAgency(a)}
                  className="transition-colors duration-100 cursor-pointer hover:bg-[#181820]"
                >
                  {/* Agency name + logo */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <div className="flex items-center gap-[10px]">
                      <AgencyLogo name={ap?.agency_name || a.full_name} logo={ap?.logo} />
                      <div>
                        <p className="text-white font-bold text-[0.88rem] m-0">
                          {ap?.agency_name || a.full_name}
                        </p>
                        {ap?.website && (
                          <a 
                            href={ap.website} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-[4px] text-[#70d64d] text-[0.7rem] no-underline mt-[2px] hover:underline" 
                            onClick={e => e.stopPropagation()}
                          >
                            <Globe size={10} /> {ap.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Contact person */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <span className="text-[#d1d5db] text-[0.82rem] font-semibold">{a.full_name}</span>
                  </td>
                  {/* Contact info */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <div className="flex flex-col gap-[4px]">
                      <span className="flex items-center gap-[5px] text-[#8a8a8a] text-[0.75rem]">
                        <Mail size={11} color="#6b7280" /> {a.email}
                      </span>
                      <span className="flex items-center gap-[5px] text-[#8a8a8a] text-[0.75rem]">
                        <Phone size={11} color="#6b7280" /> {a.mobile || '—'}
                      </span>
                    </div>
                  </td>
                  {/* Industry */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <span className="text-[#8a8a8a] text-[0.78rem]">{ap?.industry || '—'}</span>
                  </td>
                  {/* Team size */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <div className="flex items-center gap-[5px]">
                      <Users size={12} color="#c084fc" />
                      <span className="text-[#d1d5db] text-[0.82rem] font-semibold">
                        {ap?._count?.team_members ?? ap?.employee_count ?? '—'}
                      </span>
                    </div>
                  </td>
                  {/* Projects */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <div className="flex items-center gap-[5px]">
                      <Briefcase size={12} color="#70d64d" />
                      <span className="text-[#d1d5db] text-[0.82rem] font-semibold">
                        {ap?.total_projects ?? '—'}
                      </span>
                    </div>
                  </td>
                  {/* Completion */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle min-w-[100px]">
                    <CompletionBar value={ap?.profile_completion || 0} />
                  </td>
                  {/* Status */}
                  <td className="p-[16px] border-b border-[#1a1a22] align-middle">
                    <StatusBadge status={a.account_status} />
                  </td>
                  {/* Joined */}
                  <td className="p-[16px] border-b border-[#1a1a22] text-gray-500 text-[0.75rem] align-middle whitespace-nowrap">
                    {fmtDate(a.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AgencyTable;
