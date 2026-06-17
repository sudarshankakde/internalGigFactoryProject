import React from 'react';
import ProjectCard from './ProjectCard';
import StartNewProjectCard from './StartNewProjectCard';
import { Eye, TrendingUp } from 'lucide-react';

const ProjectsGrid = ({ 
  projects, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onTrackProgress, 
  onMilestones,
  onApplications,
  onSimApply,
  viewMode,
  onStartNewProject 
}) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#10101a] border border-[#23232a] rounded-[18px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="text-gray-400 mt-2">{project.client}</p>
                <div className="mt-3 flex flex-wrap gap-2 items-center text-sm">
                  <span className="bg-[#16171e] text-[#94a3b8] px-3 py-1 rounded-full">{project.category}</span>
                  <span className="bg-[#16171e] text-[#94a3b8] px-3 py-1 rounded-full">{project.status}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onViewDetails(project.id)}
                  className="rounded-[14px] border border-[#2c2f3d] bg-[#11131a] px-4 py-3 text-sm text-gray-300 hover:text-white transition"
                >
                 <Eye size={16} /> View Details
                </button>
                <button
                  onClick={() => onTrackProgress(project.id)}
                  className="rounded-[14px] bg-[#70d64d] px-4 py-3 text-sm font-semibold text-black hover:bg-[#8ee67b] transition"
                >
                  <TrendingUp size={16} /> Track Progress
                </button>
              </div>
            </div>
          </div>
        ))}
        <StartNewProjectCard onStartNewProject={onStartNewProject} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onTrackProgress={onTrackProgress}
          onMilestones={onMilestones}
          onApplications={onApplications}
          onSimApply={onSimApply}
        />
      ))}

      <StartNewProjectCard onStartNewProject={onStartNewProject} />
    </div>
  );
};

export default ProjectsGrid;
