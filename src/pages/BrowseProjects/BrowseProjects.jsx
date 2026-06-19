import React, { useEffect, useState } from 'react';
import { getProjects } from '../../data/projectDataStore';
import { useNavigate } from 'react-router-dom';

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Browse Projects</h1>
          <p className="text-gray-400 mt-2">Quickly review open projects and apply as freelancer or agency.</p>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-[#0b0b0d] border border-[#23232a] rounded-[20px] p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 uppercase text-[10px] font-semibold tracking-[0.2em] text-gray-400 bg-[#121214] rounded-full">{project.category}</span>
                    {project.status && (
                      <span className="px-3 py-1 uppercase text-[10px] font-semibold tracking-[0.2em] text-emerald-300 bg-emerald-500/10 rounded-full">{project.status}</span>
                    )}
                  </div>
                  <div className="text-white text-2xl font-bold">{project.title}</div>
                  <div className="text-gray-400">{project.client}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm text-gray-400">
                    <div className="bg-[#121214] rounded-xl p-3">
                      <div className="uppercase text-[10px] tracking-[0.2em] mb-1">Budget</div>
                      <div className="text-white font-semibold">${project.budget?.toLocaleString() || project.price || '—'}</div>
                    </div>
                    <div className="bg-[#121214] rounded-xl p-3">
                      <div className="uppercase text-[10px] tracking-[0.2em] mb-1">Deadline</div>
                      <div className="text-white font-semibold">{project.deadline || 'TBD'}</div>
                    </div>
                    <div className="bg-[#121214] rounded-xl p-3">
                      <div className="uppercase text-[10px] tracking-[0.2em] mb-1">Posted On</div>
                      <div className="text-white font-semibold">{project.postedOn || '2026-04-22'}</div>
                    </div>
                    <div className="bg-[#121214] rounded-xl p-3">
                      <div className="uppercase text-[10px] tracking-[0.2em] mb-1">Applicants</div>
                      <div className="text-white font-semibold">{project.applicantsCount || 0}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="px-5 py-3 rounded-xl border border-[#23232a] text-white hover:bg-white/5 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="px-5 py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
                  >
                    Apply for Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
