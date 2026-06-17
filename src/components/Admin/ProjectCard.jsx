import React from 'react';
import { Edit2, Trash2, Eye, TrendingUp } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete, onViewDetails, onTrackProgress, onMilestones, onApplications, onSimApply }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'IN PROGRESS':
        return 'bg-lime-400/20 text-lime-400';
      case 'NOT STARTED':
        return 'bg-gray-500/20 text-gray-400';
      case 'COMPLETED':
        return 'bg-blue-400/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-lime-400';
    if (progress >= 50) return 'bg-yellow-400';
    if (progress >= 25) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all">
      {/* Header with Title and Actions */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white text-lg font-semibold">{project.title}</h3>
          <p className="text-gray-400 text-sm mt-1">
            {project.client} • 
            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${project.category === 'WEB' ? 'bg-blue-500/20 text-blue-400' : project.category === 'MOBILE' ? 'bg-purple-500/20 text-purple-400' : 'bg-pink-500/20 text-pink-400'}`}>
              {project.category}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(project.id)}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Edit"
          >
            <Edit2 size={16} className="text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-2 hover:bg-red-500/20 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Budget and Deadline */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider">Budget (USD)</p>
          <p className="text-white text-lg font-semibold">{project.budget}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider">Deadline</p>
          <p className="text-white text-lg font-semibold">{project.deadline}</p>
        </div>
      </div>

      {/* Assigned Members and Applicants */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Assigned Members</p>
          <div className="flex items-center gap-2">
            {project.assignedMembers && project.assignedMembers.length > 0 ? (
              <>
                <img
                  src={project.assignedMembers[0].avatar}
                  alt={project.assignedMembers[0].name}
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-white text-sm">{project.assignedMembers[0].name}</p>
              </>
            ) : (
              <p className="text-gray-400 text-sm">Unassigned</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Applicants</p>
          <p className="text-lime-400 font-semibold">{project.applicantsCount} Total</p>
        </div>
      </div>

      {/* Progress */}
      {project.status === 'IN PROGRESS' && (
        <>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-white text-sm">Progress</p>
              <p className="text-lime-400 font-semibold">{project.progress}%</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getProgressColor(project.progress)}`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onViewDetails(project.id)}
          className="flex-1 border border-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          View Details
        </button>
        <button
          onClick={() => onTrackProgress(project.id)}
          className="flex-1 bg-lime-400 text-black py-2 rounded-lg hover:bg-lime-300 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <TrendingUp size={16} />
          Track Progress
        </button>
        {/* <button
          onClick={() => onMilestones && onMilestones(project)}
          className="flex-1 border border-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          title="Manage Milestones"
        >
          Milestones
        </button>
        <button
          onClick={() => onApplications && onApplications(project)}
          className="flex-1 border border-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          title="View Applications"
        >
          Applications
        </button> */}
      </div>

      {/* Simulate apply buttons for demo (freelancer / agency) */}
      <div className="flex gap-2 mt-3">
        <button onClick={() => onSimApply && onSimApply(project, 'freelancer')} className="text-xs px-2 py-1 border border-[#23232a] rounded text-gray-300">Sim Apply (Freelancer)</button>
        <button onClick={() => onSimApply && onSimApply(project, 'agency')} className="text-xs px-2 py-1 border border-[#23232a] rounded text-gray-300">Sim Apply (Agency)</button>
      </div>
    </div>
  );
};

export default ProjectCard;
