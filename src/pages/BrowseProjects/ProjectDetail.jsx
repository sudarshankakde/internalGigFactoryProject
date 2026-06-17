import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../../data/projectDataStore';
import ApplyModal from './ApplyModal';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('freelancer');

  const refreshProject = () => {
    const p = getProjectById(id);
    setProject(p);
  };

  useEffect(() => {
    refreshProject();
  }, [id]);

  if (!project) return (
    <div className="min-h-screen bg-black p-6 text-white">Project not found</div>
  );

  const handleApply = (role) => {
    setSelectedRole(role);
    setIsApplyOpen(true);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-[#0b0b0d] border border-[#23232a] rounded-[24px] p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs uppercase tracking-[0.2em] text-gray-400 bg-[#121214] rounded-full">{project.category}</span>
                <span className="px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300 bg-emerald-500/10 rounded-full">{project.status || 'IN PROGRESS'}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{project.title}</h1>
                <p className="text-gray-400 mt-2">{project.client}</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="text-sm uppercase tracking-[0.2em] text-gray-400">Project Status</div>
              <span className="px-4 py-2 rounded-full bg-emerald-500/15 text-emerald-300 text-sm font-semibold">{project.status || 'IN PROGRESS'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#121214] rounded-[20px] p-4">
              <div className="text-gray-400 text-[11px] uppercase tracking-[0.2em]">Budget</div>
              <div className="text-white text-xl font-semibold mt-2">${project.budget?.toLocaleString() || '—'}</div>
            </div>
            <div className="bg-[#121214] rounded-[20px] p-4">
              <div className="text-gray-400 text-[11px] uppercase tracking-[0.2em]">Deadline</div>
              <div className="text-white text-xl font-semibold mt-2">{project.deadline || 'TBD'}</div>
            </div>
            <div className="bg-[#121214] rounded-[20px] p-4">
              <div className="text-gray-400 text-[11px] uppercase tracking-[0.2em]">Posted On</div>
              <div className="text-white text-xl font-semibold mt-2">{project.postedOn || '2026-04-22'}</div>
            </div>
            <div className="bg-[#121214] rounded-[20px] p-4">
              <div className="text-gray-400 text-[11px] uppercase tracking-[0.2em]">Applicants</div>
              <div className="text-white text-xl font-semibold mt-2">{project.applicantsCount || 0} Freelancers</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0b0b0d] border border-[#23232a] rounded-[20px] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#121214] flex items-center justify-center text-lime-400">📄</div>
                <div>
                  <h2 className="text-white text-lg font-semibold">Project Description</h2>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-7">{project.description || 'Development of a new fintech mobile application with real-time data synchronization. The application requires robust security protocols, seamless API integrations with existing financial backends, and a highly responsive, modern user interface optimized for both iOS and Android platforms.'}</p>
            </div>

            <div className="bg-[#0b0b0d] border border-[#23232a] rounded-[20px] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white text-lg font-semibold">Project Deliverables</h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {(project.deliverables || ['Source Code', 'Design Assets', 'Documentation', 'Deployment Script']).map((item, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-full border border-[#23232a] bg-[#121214] text-sm text-gray-300">{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0b0b0d] border border-[#23232a] rounded-[20px] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-400 uppercase text-[11px] tracking-[0.2em]">Overall Progress</div>
                  <div className="text-white font-semibold">Completion</div>
                </div>
                <div className="text-white font-bold">{project.progress || 0}%</div>
              </div>
              <div className="w-full h-3 bg-[#111113] rounded-full overflow-hidden mb-4">
                <div className="h-full bg-lime-400" style={{ width: `${project.progress || 0}%` }} />
              </div>
              <p className="text-gray-500 text-sm">This progress bar indicates the current stage of the project based on completed milestones.</p>
            </div>

            <div className="bg-[#0b0b0d] border border-[#23232a] rounded-[20px] p-6">
              <div className="mb-4">
                <h2 className="text-white text-lg font-semibold">Apply</h2>
                <p className="text-gray-500 text-sm">Submit your request to admin.</p>
              </div>
              <div className="grid gap-3">
                <button
                  onClick={() => handleApply('freelancer')}
                  className="w-full bg-lime-400 text-black py-3 rounded-xl font-semibold"
                >
                  Apply as Freelancer
                </button>
                <button
                  onClick={() => handleApply('agency')}
                  className="w-full border border-[#23232a] text-white py-3 rounded-xl hover:bg-white/5 transition"
                >
                  Apply as Agency
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isApplyOpen && <ApplyModal project={project} onClose={() => setIsApplyOpen(false)} defaultRole={selectedRole} onApplied={refreshProject} />}
    </div>
  );
}
